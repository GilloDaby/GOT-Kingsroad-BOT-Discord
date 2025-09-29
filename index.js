require('dotenv').config();

process.noDeprecation = true;

global.fetch = global.fetch || ((...args) => import('node-fetch').then(({ default: f }) => f(...args)));

const createClient = require('./core/client');
const { registerSlashCommands, routeInteractions } = require('./core/registry');

const client = createClient();

// events
client.once('ready', require('./events/ready'));
client.on('guildCreate', require('./events/guildCreate'));
client.on('guildUpdate', require('./events/guildUpdate'));
client.on('guildDelete', require('./events/guildDelete'));
client.on('messageReactionAdd', require('./events/messageReactionAdd'));
client.on('messageReactionRemove', require('./events/messageReactionRemove'));

// interaction router
routeInteractions(client);

// register slash (one-shot at startup)
(async () => {
  try {
    await registerSlashCommands(client, process.env.DISCORD_TOKEN, process.env.CLIENT_ID || process.env.DISCORD_CLIENT_ID);
  } catch (e) {
    console.error('❌ Failed to register commands:', e);
  }
})();

client.login(process.env.DISCORD_TOKEN);
