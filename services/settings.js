const db = require('../db');

async function getSettings(guildId) {
  const [rows] = await db.query('SELECT * FROM settings WHERE guildId = ?', [guildId]);
  return rows[0] || {};
}
async function updateSettings(guildId, values) {
  const keys = Object.keys(values);
  if (!keys.length) return;
  const placeholders = keys.map(() => '?').join(', ');
  const updates = keys.map(k => `${k} = VALUES(${k})`).join(', ');
  const sql = `INSERT INTO settings (guildId, ${keys.join(', ')}) VALUES (?, ${placeholders}) ON DUPLICATE KEY UPDATE ${updates}`;
  const params = [guildId, ...keys.map(k => values[k])];
  await db.query(sql, params);
}

module.exports = { getSettings, updateSettings };
