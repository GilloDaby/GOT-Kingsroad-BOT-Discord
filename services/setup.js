const { ChannelType, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getSettings, updateSettings } = require('./settings');
const { sendRanksMessage } = require('./ranks');
const { getLatestPatchnotePayload } = require('./patchnote');
const { tzOf, styleOf } = require('../utils/time');
const { I18N, t, langOf } = require('../i18n');
const { getNextDrogonTime, getNextPeddlerTime, getDailyResetTime, getWeeklyResetTime, getNextBeastTime } = require('./timers');

async function buildTimerBody(settings) {
  const { formatCountdown, nowInTZ } = require('../utils/time');
  const tz = tzOf(settings);
  const now        = nowInTZ(tz);
  const nextDrogon = getNextDrogonTime(tz);
  const nextPeddler= getNextPeddlerTime(tz);
  const nextDaily  = getDailyResetTime();
  const nextWeekly = getWeeklyResetTime();
  const nextBeast  = getNextBeastTime();

  const lines = [
    `⏰ **Daily Reset**: ${formatCountdown(nextDaily - now)}`,
    `🔥 **Drogon**: ${formatCountdown(nextDrogon - now)}`,
    `📅 **Weekly Reset**: ${formatCountdown(nextWeekly - now)}`,
    `🔔 **Peddler**: ${formatCountdown(nextPeddler - now)}`,
    `🐺 **Beast**: ${formatCountdown(nextBeast - now)}`
  ];

  if (styleOf(settings) === 'embed') {
    const embed = new EmbedBuilder()
      .setTitle(`⏱️ ${I18N[langOf(settings)].timers_embed_title}`)
      .setDescription(lines.join('\n'))
      .setColor(0x5865F2)
      .setFooter({ text: `TZ: ${tz}` });
    return { embeds: [embed] };
  }
  return { content: lines.join('\n') };
}

async function sendTimerMessage(guild, channel) {
  const settings = await getSettings(guild.id);
  if (!channel) return;
  const perms = channel.permissionsFor(guild.members.me);
  if (!perms?.has(PermissionsBitField.Flags.SendMessages)) return;
  if (settings.timerMessageId) {
    try { const oldMsg = await channel.messages.fetch(settings.timerMessageId); if (oldMsg) await oldMsg.delete(); } catch {}
  }
  const body = await buildTimerBody(settings);
  const msg = await channel.send(body);
  await updateSettings(guild.id, { timerMessageId: msg.id });
}

async function ensureGuildSetup(guild) {
  let category = guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name === 'GOT KINGSROAD DISCORD BOT');
  if (!category) category = await guild.channels.create({ name: 'GOT KINGSROAD DISCORD BOT', type: ChannelType.GuildCategory });

  const defs = [
    ['📰・bot-patchnote',  'patch'],
    ['📘・how-to-use-the-bot', 'howto'],
    ['🔔・ping-rank',      'pingrank'],
    ['⏳・global-timer',   'timer'],
    ['📢・timer-alert',    'alert'],
    ['🔎・marker-finder',  'finder'],
    ['🔥・ping-reminder',  'reminder'],
  ];
  const ch = {};
  for (const [name, key] of defs) {
    let c = guild.channels.cache.find(x => x.name === name && x.type === ChannelType.GuildText);
    if (!c) c = await guild.channels.create({ name, type: ChannelType.GuildText, parent: category.id });
    ch[key] = c;
  }

  const roleNames = ['AlertDrogon','AlertPeddler','AlertDaily','AlertWeekly','AlertBeast'];
  const roles = {};
  for (const rName of roleNames) {
    let r = guild.roles.cache.find(r => r.name === rName);
    if (!r) r = await guild.roles.create({ name: rName, reason: 'Auto-setup' });
    roles[rName] = r;
  }

  const current = await getSettings(guild.id);
  await updateSettings(guild.id, {
    guildName: guild.name,
    joinedAt: new Date(),
    drogonRoleId: roles.AlertDrogon.id,
    peddlerRoleId: roles.AlertPeddler.id,
    dailyRoleId: roles.AlertDaily.id,
    weeklyRoleId: roles.AlertWeekly.id,
    beastRoleId: roles.AlertBeast.id,
    drogonWarningChannelId: ch.alert.id,
    globalTimerChannelId: ch.timer.id,
    patchnoteChannelId: ch.patch.id,
    timezone: current.timezone || 'America/Toronto',
    language: current.language || 'en',
    style: current.style || 'compact',
  });

  const { sendRanksMessage } = require('./ranks');
  await sendRanksMessage(guild, ch.pingrank);
  await sendTimerMessage(guild, ch.timer);

  const patchPayload = getLatestPatchnotePayload(await getSettings(guild.id));
  const patchMsg = await ch.patch.send(patchPayload);
  await updateSettings(guild.id, { patchnoteMessageId: patchMsg.id });

  return ch;
}

module.exports = { ensureGuildSetup, sendTimerMessage, buildTimerBody };
