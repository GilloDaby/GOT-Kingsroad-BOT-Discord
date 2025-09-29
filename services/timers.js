// services/timers.js
const { DateTime } = require('luxon');
const {
  DEFAULT_TZ,
  DROGON_SLOTS, DROGON_MINUTE,
  PEDDLER_SLOTS, PEDDLER_MINUTE,
  LIMITED_DEAL_SLOTS, LIMITED_DEAL_MINUTE,
  BEAST_ZONE, BEAST_HOURS,
  DAILY_RESET_UTC, WEEKLY_RESET_UTC,
} = require('../utils/constants');

/**
 * Renvoie le prochain slot > now dans un TZ donné.
 * @param {string} tz
 * @param {number[]} hours - liste d'heures (0-23)
 * @param {number} minute
 * @param {number} [second=0]
 */
function getNextFromSlots(tz = DEFAULT_TZ, hours = [], minute = 0, second = 0) {
  const now = DateTime.now().setZone(tz);
  for (const h of hours) {
    const cand = now.set({ hour: h, minute, second, millisecond: 0 });
    if (cand > now) return cand.toJSDate();
  }
  // sinon, lendemain au premier slot
  return now.plus({ days: 1 }).set({ hour: hours[0], minute, second, millisecond: 0 }).toJSDate();
}

function getNextDrogonTime(tz = DEFAULT_TZ) {
  return getNextFromSlots(tz, DROGON_SLOTS, DROGON_MINUTE, 0);
}

function getNextPeddlerTime(tz = DEFAULT_TZ) {
  return getNextFromSlots(tz, PEDDLER_SLOTS, PEDDLER_MINUTE, 0);
}

function getNextLimitedDealTime(tz = DEFAULT_TZ) {
  return getNextFromSlots(tz, LIMITED_DEAL_SLOTS, LIMITED_DEAL_MINUTE, 0);
}

function getDailyResetTime() {
  // Toujours en UTC
  const now = DateTime.utc();
  let reset = now.set({ hour: DAILY_RESET_UTC.hour, minute: DAILY_RESET_UTC.minute, second: 0, millisecond: 0 });
  if (reset <= now) reset = reset.plus({ days: 1 });
  return reset.toJSDate();
}

function getWeeklyResetTime() {
  // Toujours en UTC
  const now = DateTime.utc();
  let target = now.set({
    weekday: WEEKLY_RESET_UTC.weekday, // 1=Mon ... 7=Sun (Luxon)
    hour: WEEKLY_RESET_UTC.hour,
    minute: WEEKLY_RESET_UTC.minute,
    second: 0,
    millisecond: 0,
  });
  if (target <= now) target = target.plus({ weeks: 1 });
  return target.toJSDate();
}

function getNextBeastTime() {
  const nowQT = DateTime.now().setZone(BEAST_ZONE);
  for (const h of BEAST_HOURS) {
    const cand = nowQT.set({ hour: h, minute: 0, second: 0, millisecond: 0 });
    if (cand > nowQT) return cand.toJSDate();
  }
  // lendemain au premier créneau
  return nowQT.plus({ days: 1 }).set({ hour: BEAST_HOURS[0], minute: 0, second: 0, millisecond: 0 }).toJSDate();
}

module.exports = {
  getNextDrogonTime,
  getNextPeddlerTime,
  getNextLimitedDealTime,
  getDailyResetTime,
  getWeeklyResetTime,
  getNextBeastTime,
};
