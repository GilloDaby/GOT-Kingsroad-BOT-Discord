const db = require('../db');
module.exports = async (guild) => {
  try {
    console.log(`👋 Removed from: ${guild.name} (${guild.id})`);
    await db.query('DELETE FROM settings WHERE guildId = ?', [guild.id]);
  } catch (err) {
    console.error(`❌ Cleanup failed for ${guild.id}:`, err);
  }
};
