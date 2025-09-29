const { updateTimerMessageLoop } = require('../loops/timerMessageLoop');
const { tickReminders } = require('../loops/remindersLoop');
const { getSettings, updateSettings } = require('../services/settings');
const { getLatestPatchnotePayload } = require('../services/patchnote');

module.exports = (client) => {
  console.log(`🤖 Logged in as ${client.user.tag}`);

  (async () => {
    try {
      for (const [, guild] of client.guilds.cache) {
        await updateSettings(guild.id, { guildName: guild.name });
      }
    } catch (err) {
      console.error('❌ guildName sync error:', err);
    }

    try {
      const db = require('../db');
      const [rows] = await db.query('SELECT guildId, rankMessageId FROM settings WHERE rankMessageId IS NOT NULL');
      console.log(`🔄 Ranks message IDs known for ${rows.length} guild(s).`);
    } catch (err) {
      console.error('❌ Failed to check ranks message IDs:', err);
    }

    setInterval(() => updateTimerMessageLoop(client).catch(()=>{}), 5000);
    const botStart = new Date();
    setInterval(() => tickReminders(client, botStart).catch(()=>{}), 5000);

    // Patchnote refresh pass
    try {
      const db = require('../db');
      const [rows] = await db.query(
        'SELECT guildId, patchnoteChannelId, patchnoteMessageId FROM settings WHERE patchnoteChannelId IS NOT NULL AND patchnoteMessageId IS NOT NULL'
      );
      for (const row of rows) {
        try {
          const channel = await client.channels.fetch(row.patchnoteChannelId);
          const message = await channel.messages.fetch(row.patchnoteMessageId);
          const s = await getSettings(row.guildId);
          await message.edit(getLatestPatchnotePayload(s));
          console.log(`✅ Patchnote updated for guild ${row.guildId}`);
        } catch (err) {
          console.error(`❌ Patchnote update failed for ${row.guildId}:`, err.message);
          if (err.code === 10008) {
            await updateSettings(row.guildId, { patchnoteMessageId: null });
            console.log(`🗑️ Cleared missing patchnoteMessageId for guild ${row.guildId}`);
          }
          if (err.code === 10003) {
            await updateSettings(row.guildId, { patchnoteChannelId: null, patchnoteMessageId: null });
            console.log(`🗑️ Cleared patchnote channel+msg for guild ${row.guildId}`);
          }
        }
      }
    } catch (err) {
      console.error('❌ Patchnote global update error:', err);
    }
  })();
};
