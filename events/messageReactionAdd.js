const { emojiRoleMap, roleMessageIds } = require('../services/ranks');
const { getSettings } = require('../services/settings');
const { PermissionsBitField } = require('discord.js');

module.exports = async (reaction, user) => {
  if (user.bot) return;
  try {
    if (reaction.partial) await reaction.fetch();
    const guildId = reaction.message.guildId;
    let messageId = roleMessageIds.get(guildId);
    if (!messageId) {
      const s = await getSettings(guildId);
      messageId = s.rankMessageId;
      if (messageId) roleMessageIds.set(guildId, messageId);
    }
    if (!messageId || reaction.message.id !== messageId) return;

    const roleName = emojiRoleMap[reaction.emoji.name];
    if (!roleName) return;

    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    const role = guild.roles.cache.find(r => r.name === roleName);
    if (!member || !role) return;

    const botMember = await guild.members.fetch(reaction.client.user.id);
    if (botMember.roles.highest.position <= role.position) {
      const channel = reaction.message.channel;
      if (channel?.viewable && channel.permissionsFor(botMember).has(PermissionsBitField.Flags.SendMessages)) {
        channel.send('⚠️ Move the bot role **above** alert roles to allow assignment.').catch(() => {});
      }
      return;
    }
    await member.roles.add(role);
  } catch (err) {
    console.error('[ReactionAdd Error]', err);
  }
};
