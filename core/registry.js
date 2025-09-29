const { REST, Routes } = require('discord.js');
const gotkingsroad = require('../commands/gotkingsroad');

async function registerSlashCommands(client, token, clientId) {
  const commands = [ gotkingsroad.builder.toJSON() ];
  const rest = new REST({ version: '10' }).setToken(token);
  await rest.put(Routes.applicationCommands(clientId), { body: commands });
  console.log('✅ Slash commands registered globally.');
}

function routeInteractions(client) {
  client.on('interactionCreate', async (interaction) => {
    try {
      if (interaction.isAutocomplete()) {
        return gotkingsroad.handleAutocomplete(interaction);
      }
      if (!interaction.isChatInputCommand()) return;
      if (interaction.commandName === 'gotkingsroad') {
        return gotkingsroad.run(interaction, client);
      }
    } catch (e) {
      console.error('[interaction error]', e);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: '❌ Error while processing your command.', ephemeral: true }).catch(()=>{});
      } else {
        await interaction.editReply({ content: '❌ Error while processing your command.' }).catch(()=>{});
      }
    }
  });
}

module.exports = { registerSlashCommands, routeInteractions };
