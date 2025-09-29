const { PermissionsBitField } = require('discord.js');
const { t } = require('../i18n');
const { getSettings, updateSettings } = require('./settings');

const emojiRoleMap = { '🔥': 'AlertDrogon', '🧺': 'AlertPeddler', '⏰': 'AlertDaily', '📅': 'AlertWeekly', '🐺': 'AlertBeast', '🛍️': 'AlertLimitedDeal' };
const roleMessageIds = new Map();

async function sendRanksMessage(guild, channel) {
  const settings = await getSettings(guild.id);
  const roles = {};
  for (const [emoji, roleName] of Object.entries(emojiRoleMap)) {
    let role = guild.roles.cache.find(r => r.name === roleName);
    if (!role) role = await guild.roles.create({ name: roleName, reason: 'Auto-created alert role' });
    roles[emoji] = role;
  }
  const description = Object.entries(roles).map(([emoji, role]) => `${emoji} → <@&${role.id}>`).join('\n');
  const message = await channel.send({ content: `📢 **${t('choose_alert_roles', settings)}**\n\n${description}` });
  for (const emoji of Object.keys(roles)) await message.react(emoji);
  roleMessageIds.set(guild.id, message.id);
  await updateSettings(guild.id, { rankMessageId: message.id });
}

module.exports = { emojiRoleMap, roleMessageIds, sendRanksMessage };
