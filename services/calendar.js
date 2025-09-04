// services/calendar.js
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

async function captureCalendarScreenshot() {
  const endpoint = "https://production-sfo.browserless.io/chromium/bql";
  const token = process.env.BROWSERLESS_TOKEN; // 🔑 Mets ton token dans .env

  const response = await fetch(`${endpoint}?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation Screenshot($url: String!) {
          goto(url: $url, waitUntil: load) {
            status
          }
          screenshot(type: png, selector: ".timeline-wrapper") {
            base64
          }
        }
      `,
      variables: {
        url: "https://got-kingsroad.com/calendar"
      }
    })
  });

  const data = await response.json();
  if (data.errors || !data.data?.screenshot?.base64) {
    throw new Error("Screenshot failed: " + JSON.stringify(data.errors || data));
  }

  return Buffer.from(data.data.screenshot.base64, 'base64');
}

module.exports = { captureCalendarScreenshot };
