const { loadReminders, clearUserReminders } = require('../services/reminders');
const { getNextDrogonTime, getNextPeddlerTime, getDailyResetTime, getWeeklyResetTime, getNextBeastTime, getNextLimitedDealTime } = require('../services/timers');
const { DEFAULT_TZ } = require('../utils/constants');

const remindedCache = new Map();
const dmErrorLogged = new Set();

function getReminderKey(timerType, eventTime, userId, minutes) {
  const target = new Date(eventTime - minutes * 60 * 1000).toISOString();
  return `${userId}-${timerType}-${target}`;
}

async function tickReminders(client, botStart) {
  const now = new Date();
  if (now - botStart < 30_000) return;

  const reminders = await loadReminders();
  const tz = DEFAULT_TZ;
  const timers = {
    drogon:  getNextDrogonTime(tz),
    daily:   getDailyResetTime(),
    weekly:  getWeeklyResetTime(),
    peddler: getNextPeddlerTime(tz),
    beast:   getNextBeastTime(),
    limiteddeal: getNextLimitedDealTime(tz)
  };

  for (const r of reminders) {
    const eventTime = timers[r.timer];
    const diff = eventTime - now;
    const threshold = r.minutes * 60_000;

      if (diff <= threshold && diff > 0) {
        const key = getReminderKey(r.timer, eventTime, r.userId, r.minutes);
        if (!remindedCache.has(key)) {
          try {
            const user = await client.users.fetch(r.userId);
          const label = r.timer === 'limiteddeal' ? 'LIMITED TIME DEAL' : r.timer.toUpperCase();
          await user.send(`🔔 **Reminder:** ${label} starts in ${r.minutes} minute(s)!`);
          remindedCache.set(key, true);
        } catch (e) {
          if (e.code === 50007) { // privacy
            if (!dmErrorLogged.has(r.userId)) {
              console.warn(`❌ Cannot DM ${r.userId} (privacy settings). Clearing their reminders.`);
              dmErrorLogged.add(r.userId);
            }
            try { await clearUserReminders(r.userId); } catch {}
            continue;
          }
          if (!dmErrorLogged.has(r.userId)) {
            console.warn(`❌ Failed to DM ${r.userId}: ${e.message}`);
            dmErrorLogged.add(r.userId);
          }
        }
      }
    }
  }
}

module.exports = { tickReminders };
