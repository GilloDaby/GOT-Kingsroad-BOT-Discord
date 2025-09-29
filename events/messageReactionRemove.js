const { emojiRoleMap, roleMessageIds } = require('../services/ranks');
const { getSettings } = require('../services/settings');

module.exports = async (reaction, user) => {
  if (user.bot) return;
  try {
    if (reaction.partial) await reaction.fetch();
    const guildId = reaction.message.guildId;
    let messageId = roleMessageIds.get(guildId);
    if (!messageId) {
      const s = await getSettings(guildId);
      messageId = s.rankMessageId || null;
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
    if (botMember.roles.highest.position <= role.position) return;

    await member.roles.remove(role);
  } catch (err) {
    console.error('[ReactionRemove Error]', err);
  }
};
