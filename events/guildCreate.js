const { ensureGuildSetup } = require('../services/setup');

module.exports = async (guild) => {
  try {
    console.log(`📥 Joined: ${guild.name} (${guild.id})`);
    await ensureGuildSetup(guild);
    console.log(`✅ Auto-setup done for ${guild.name}`);
  } catch (err) {
    console.error(`❌ Setup error for ${guild.name}:`, err);
  }
};
