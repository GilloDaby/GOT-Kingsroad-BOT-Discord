const { PermissionsBitField } = require('discord.js');
const { getSettings, updateSettings } = require('../services/settings');
const { getNextDrogonTime, getNextPeddlerTime, getDailyResetTime, getWeeklyResetTime, getNextBeastTime, getNextLimitedDealTime } = require('../services/timers');
const { tzOf, nowInTZ, format12HourTime } = require('../utils/time');
const { buildTimerBody } = require('../services/setup');

const warningSentFlags = new Map();

async function updateTimerMessageLoop(client) {
  const db = require('../db');
  const [rows] = await db.query('SELECT * FROM settings WHERE globalTimerChannelId IS NOT NULL AND timerMessageId IS NOT NULL');
  const FIVE_MIN = 5 * 60 * 1000;
  const TWO_HOURS = 2 * 60 * 60 * 1000;
  const keyOf = (d) => d?.getTime?.() ?? 0;

  for (const settings of rows) {
    try {
      const channel = await client.channels.fetch(settings.globalTimerChannelId);
      const message = await channel.messages.fetch(settings.timerMessageId);
      const body = await buildTimerBody(settings);
      await message.edit(body);

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

      const warnChannel = settings.drogonWarningChannelId
        ? await client.channels.fetch(settings.drogonWarningChannelId).catch(() => null)
        : null;

      async function pruneOldWarnings(channel) {
        const cutoff = Date.now() - TWO_HOURS;
        const MAX_BATCHES = 5;
        let lastId;

        try {
          for (let batchIndex = 0; batchIndex < MAX_BATCHES; batchIndex += 1) {
            const batch = await channel.messages.fetch({ limit: 100, before: lastId ?? undefined });
            if (!batch.size) break;

            for (const message of batch.values()) {
              if (message.author?.id === client.user?.id && message.createdTimestamp < cutoff) {
                await message.delete().catch(() => {});
              }
            }

            if (batch.size < 100) break;
            lastId = batch.last().id;
          }
        } catch (err) {
          // ignore pruning errors to avoid breaking the loop
        }
      }

      if (warnChannel) await pruneOldWarnings(warnChannel);


      async function sendWarn(roleId, content) {
        if (!roleId || !warnChannel) return;
        const msg = await warnChannel.send({ content: `${content}\n<@&${roleId}>`, allowedMentions: { roles: [roleId] } });
        if (msg) setTimeout(() => msg.delete().catch(() => {}), TWO_HOURS);
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
      // message or channel might be gone
      // console.warn(`[Timer Update] ${settings.guildId}:`, err.message);
    }
  }
}

module.exports = { updateTimerMessageLoop };