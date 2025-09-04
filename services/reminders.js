const db = require('../db');

async function loadReminders() {
  const [rows] = await db.query('SELECT * FROM reminders');
  return rows;
}
async function addReminder(userId, timer, minutes, guildId=null) {
  await db.query(
    `INSERT INTO reminders (userId, timer, minutes, guildId)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE minutes = VALUES(minutes)`,
    [userId, timer, minutes, guildId]
  );
}
async function clearUserReminders(userId) {
  await db.query('DELETE FROM reminders WHERE userId = ?', [userId]);
}
async function getUserReminders(userId) {
  const [rows] = await db.query('SELECT * FROM reminders WHERE userId = ?', [userId]);
  return rows;
}
async function clearUserRemindersByTimer(userId, timer) {
  await db.query('DELETE FROM reminders WHERE userId = ? AND timer = ?', [userId, timer]);
}

module.exports = { loadReminders, addReminder, clearUserReminders, getUserReminders, clearUserRemindersByTimer };
