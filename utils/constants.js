// utils/constants.js
const DEFAULT_TZ = 'America/Toronto';
const DEFAULT_LANG = 'en';
const DEFAULT_STYLE = 'compact';

const TZ_SUGGESTIONS = [
  'UTC',
  'America/Toronto','America/New_York','America/Chicago','America/Denver','America/Los_Angeles','America/Vancouver','America/Mexico_City','America/Sao_Paulo',
  'Europe/London','Europe/Paris','Europe/Berlin','Europe/Madrid','Europe/Lisbon','Europe/Rome','Europe/Warsaw','Europe/Moscow',
  'Asia/Tokyo','Asia/Seoul','Asia/Shanghai','Asia/Singapore','Asia/Kolkata','Asia/Dubai','Australia/Sydney','Pacific/Auckland'
];

/**
 * Timers « jeu »
 * - DROGON: heures impaires à :00
 * - PEDDLER: heures impaires à :30 (simple, indépendant de Drogon)
 *   (Si tu veux inclure 00:30, remplace par les heures paires: [0,2,4,...,22])
 */
const DROGON_SLOTS = [1,3,5,7,9,11,13,15,17,19,21,23];
const DROGON_MINUTE = 0;

const PEDDLER_SLOTS = [1,3,5,7,9,11,13,15,17,19,21,23];
const PEDDLER_MINUTE = 30;

/**
 * Beast: zone et heures (heure locale BEAST_ZONE)
 */
const BEAST_ZONE  = 'America/Toronto';
const BEAST_HOURS = [3,7,11,15,19,23];

/**
 * Resets en UTC
 */
const DAILY_RESET_UTC = { hour: 5, minute: 0 };                 // 07:00 UTC tous les jours
const WEEKLY_RESET_UTC = { weekday: 4, hour: 5, minute: 0 };    // Jeudi 05:00 UTC

module.exports = {
  DEFAULT_TZ, DEFAULT_LANG, DEFAULT_STYLE, TZ_SUGGESTIONS,
  DROGON_SLOTS, DROGON_MINUTE,
  PEDDLER_SLOTS, PEDDLER_MINUTE,
  BEAST_ZONE, BEAST_HOURS,
  DAILY_RESET_UTC, WEEKLY_RESET_UTC,
};
