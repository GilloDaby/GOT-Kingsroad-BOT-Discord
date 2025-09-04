const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '..', '.env'), // ← force /home/container/.env
});

const TOKEN = process.env.DISCORD_TOKEN && process.env.DISCORD_TOKEN.trim();
const CLIENT_ID = (process.env.CLIENT_ID || process.env.DISCORD_CLIENT_ID || '').trim();
if (!TOKEN) { console.error('❌ DISCORD_TOKEN manquant/vidé.'); process.exit(1); }
if (!CLIENT_ID) { console.error('❌ CLIENT_ID manquant.'); process.exit(1); }

const { registerSlashCommands } = require('./core/registry');
const createClient = require('./core/client');

(async () => {
  try {
    const client = createClient();
    await registerSlashCommands(client, process.env.DISCORD_TOKEN, process.env.CLIENT_ID || process.env.DISCORD_CLIENT_ID);
    console.log('Done.');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
