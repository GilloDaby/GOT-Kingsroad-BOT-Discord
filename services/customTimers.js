const db = require('../db');

async function addCustomTimer(guildId, name, time) {
  await db.query(
    `INSERT INTO custom_timers (guildId, name, time) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE time = VALUES(time)`,
    [guildId, name, time]
  );
}

async function getCustomTimers(guildId) {
  const [rows] = await db.query(
    'SELECT name, time FROM custom_timers WHERE guildId = ? ORDER BY time ASC',
    [guildId]
  );
  return rows;
}

async function removeCustomTimer(guildId, name) {
  const [res] = await db.query(
    'DELETE FROM custom_timers WHERE guildId = ? AND name = ?',
    [guildId, name]
  );
  return res.affectedRows > 0;
}

module.exports = { addCustomTimer, getCustomTimers, removeCustomTimer };
