const { DateTime } = require('luxon');
const { DEFAULT_TZ, DEFAULT_STYLE } = require('./constants');

const tzOf = (s) => s?.timezone || DEFAULT_TZ;
const styleOf = (s) => ((s?.style || DEFAULT_STYLE).toLowerCase() === 'embed' ? 'embed' : 'compact');
const nowInTZ = (tz) => DateTime.now().setZone(tz || DEFAULT_TZ).toJSDate();

function format12HourTime(date, tz) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz || DEFAULT_TZ, hour: 'numeric', minute: '2-digit', hour12: true
  }).format(date);
}
function formatCountdown(ms, short=false) {
  const h = Math.max(0, Math.floor(ms / 3_600_000));
  const m = Math.max(0, Math.floor((ms % 3_600_000) / 60_000));
  const s = Math.max(0, Math.floor((ms % 60_000) / 1_000));
  return short ? `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${h}h ${m}m ${s}s`;
}
function formatDuration(ms) {
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const parts = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
}

module.exports = { tzOf, styleOf, nowInTZ, format12HourTime, formatCountdown, formatDuration };
