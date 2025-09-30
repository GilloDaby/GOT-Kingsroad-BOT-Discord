const { getSettings, updateSettings } = require('../services/settings');
const { getNextDrogonTime, getNextPeddlerTime, getDailyResetTime, getWeeklyResetTime, getNextBeastTime, getNextLimitedDealTime } = require('../services/timers');
const { tzOf, nowInTZ, format12HourTime } = require('../utils/time');
const { buildTimerBody } = require('../services/setup');

const warningSentFlags = new Map();
const channelCache = new Map();
const messageCache = new Map();

async function updateTimerMessageLoop(client) {
  const db = require('../db');
  const [rows] = await db.query('SELECT * FROM settings WHERE globalTimerChannelId IS NOT NULL AND timerMessageId IS NOT NULL');
  const FIVE_MIN = 5 * 60 * 1000;
  const TWO_HOURS = 2 * 60 * 60 * 1000;
  const keyOf = (d) => d?.getTime?.() ?? 0;

  for (const settings of rows) {
    try {
      let channel = channelCache.get(settings.globalTimerChannelId);
      if (!channel) {
        channel = await client.channels.fetch(settings.globalTimerChannelId);
        channelCache.set(settings.globalTimerChannelId, channel);
      }

      let message = messageCache.get(settings.timerMessageId);
      if (!message || message.channelId !== channel.id) {
        message = channel.messages.cache.get(settings.timerMessageId) || await channel.messages.fetch(settings.timerMessageId);
        messageCache.set(settings.timerMessageId, message);
      }
      const body = await buildTimerBody(settings);
      message = await message.edit(body);
      messageCache.set(settings.timerMessageId, message);

      const tz = tzOf(settings);
      const now = nowInTZ(tz);
      const nextDrogon  = getNextDrogonTime(tz);
      const nextPeddler = getNextPeddlerTime(tz);
      const nextDaily   = getDailyResetTime();
      const nextWeekly  = getWeeklyResetTime();
      const nextBeast   = getNextBeastTime();
      const nextLimitedDeal = getNextLimitedDealTime(tz);

      const gid = settings.guildId ?? 'default';
      if (!warningSentFlags.has(gid)) warningSentFlags.set(gid, {});
      const sent = warningSentFlags.get(gid);

      let warnChannel;
      let cleanedOldWarnings = false;

      async function getWarnChannel() {
        if (!settings.drogonWarningChannelId) return null;
        if (!warnChannel) {
          warnChannel = await client.channels.fetch(settings.drogonWarningChannelId).catch(() => null);
        }
        return warnChannel;
      }

      async function cleanupOldWarnings(channel) {
        if (!channel) return;
        const cutoff = Date.now() - TWO_HOURS;
        try {
          const messages = await channel.messages.fetch({ limit: 100 });
          for (const message of messages.values()) {
            if (message.createdTimestamp < cutoff && message.author?.id === client.user?.id) {
              await message.delete().catch(() => {});
            }
          }
        } catch (err) {
          // ignore cleanup errors
        }
      }

      async function sendWarn(roleId, content) {
        if (!roleId) return;
        const warnCh = await getWarnChannel();
        if (!warnCh) return;
        if (!cleanedOldWarnings) {
          cleanedOldWarnings = true;
          await cleanupOldWarnings(warnCh);
        }
        const msg = await warnCh.send({ content: `${content}\n<@&${roleId}>`, allowedMentions: { roles: [roleId] } });
        if (msg) setTimeout(() => msg.delete().catch(() => {}), TWO_HOURS);
      }

      if (!cleanedOldWarnings) {
        const warnCh = await getWarnChannel();
        if (warnCh) {
          cleanedOldWarnings = true;
          await cleanupOldWarnings(warnCh);
        }
      }

      if (nextDrogon - now > 0 && nextDrogon - now <= FIVE_MIN && sent.lastDrogonTime !== keyOf(nextDrogon)) {
        await sendWarn(settings.drogonRoleId, `🔥 Drogon near **${format12HourTime(nextDrogon, tz)}**`);
        sent.lastDrogonTime = keyOf(nextDrogon);
      }
      if (nextPeddler - now > 0 && nextPeddler - now <= FIVE_MIN && sent.lastPeddlerTime !== keyOf(nextPeddler)) {
        await sendWarn(settings.peddlerRoleId, `🧺 Peddler near **${format12HourTime(nextPeddler, tz)}**`);
        sent.lastPeddlerTime = keyOf(nextPeddler);
      }
      if (nextDaily - now > 0 && nextDaily - now <= FIVE_MIN && sent.lastDailyTime !== keyOf(nextDaily)) {
        await sendWarn(settings.dailyRoleId, `⏰ Daily near **${format12HourTime(nextDaily, tz)}**`);
        sent.lastDailyTime = keyOf(nextDaily);
      }
      if (nextWeekly - now > 0 && nextWeekly - now <= FIVE_MIN && sent.lastWeeklyTime !== keyOf(nextWeekly)) {
        await sendWarn(settings.weeklyRoleId, `📅 Weekly near **${format12HourTime(nextWeekly, tz)}**`);
        sent.lastWeeklyTime = keyOf(nextWeekly);
      }
      if (nextBeast - now > 0 && nextBeast - now <= FIVE_MIN && sent.lastBeastTime !== keyOf(nextBeast)) {
        await sendWarn(settings.beastRoleId, `🐺 Beast near **${format12HourTime(nextBeast, tz)}**`);
        sent.lastBeastTime = keyOf(nextBeast);
      }
      if (nextLimitedDeal - now > 0 && nextLimitedDeal - now <= FIVE_MIN && sent.lastLimitedDealTime !== keyOf(nextLimitedDeal)) {
        await sendWarn(settings.limitedDealRoleId, `🛍️ Limited Time Deal near **${format12HourTime(nextLimitedDeal, tz)}**`);
        sent.lastLimitedDealTime = keyOf(nextLimitedDeal);
      }

    } catch (err) {
      if (err?.code === 10008) { // Unknown Message
        messageCache.delete(settings.timerMessageId);
        await updateSettings(settings.guildId, { timerMessageId: null });
        console.warn(`⚠️ Timer message missing for guild ${settings.guildId}. Cleared stored timerMessageId.`);
      } else if (err?.code === 10003) { // Unknown Channel
        channelCache.delete(settings.globalTimerChannelId);
        messageCache.delete(settings.timerMessageId);
        await updateSettings(settings.guildId, { globalTimerChannelId: null, timerMessageId: null });
        console.warn(`⚠️ Timer channel missing for guild ${settings.guildId}. Cleared stored channel and message IDs.`);
      } else if (err?.code === 50001 || err?.code === 50013) { // Missing access / perms
        console.warn(`⚠️ Missing access to update timer for guild ${settings.guildId}: ${err.message}`);
      } else {
        console.warn(`[Timer Update] ${settings.guildId}:`, err);
      }
    }
  }
}

module.exports = { updateTimerMessageLoop };
