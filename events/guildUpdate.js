const { updateSettings } = require('../services/settings');
module.exports = async (oldGuild, newGuild) => {
  if (oldGuild.name !== newGuild.name) {
    await updateSettings(newGuild.id, { guildName: newGuild.name });
  }
};
