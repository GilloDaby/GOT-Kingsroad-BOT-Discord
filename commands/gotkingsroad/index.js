const { SlashCommandBuilder, ChannelType, PermissionsBitField, AttachmentBuilder } = require('discord.js');
const { DateTime } = require('luxon');
const { TZ_SUGGESTIONS, DEFAULT_TZ } = require('../../utils/constants');
const { tzOf, styleOf, nowInTZ, format12HourTime, formatCountdown, formatDuration } = require('../../utils/time');
const { getSettings, updateSettings } = require('../../services/settings');
const { ensureGuildSetup, sendTimerMessage } = require('../../services/setup');
const { getNextDrogonTime, getNextPeddlerTime, getDailyResetTime, getWeeklyResetTime, getNextBeastTime, getNextLimitedDealTime } = require('../../services/timers');
const { getLatestPatchnotePayload } = require('../../services/patchnote');
const { addReminder, getUserReminders, clearUserRemindersByTimer, clearUserReminders } = require('../../services/reminders');
const { sendRanksMessage } = require('../../services/ranks');
const { getAllMarkerNames } = require('../../services/markers');
const { addCustomTimer, getCustomTimers, removeCustomTimer } = require('../../services/customTimers');
const { I18N, t } = require('../../i18n');

let botStartedAt = new Date();

const TIMER_TITLES = { drogon:'Drogon', peddler:'Peddler', daily:'Daily', weekly:'Weekly', beast:'Beast', limiteddeal:'Limited Time Deal' };
const TIMER_UPPER = { drogon:'DROGON', peddler:'PEDDLER', daily:'DAILY', weekly:'WEEKLY', beast:'BEAST', limiteddeal:'LIMITED TIME DEAL' };
const timerTitle = (key) => TIMER_TITLES[key] || key;
const timerUpper = (key) => TIMER_UPPER[key] || key?.toUpperCase?.() || key;

const builder = new SlashCommandBuilder()
  .setName('gotkingsroad')
  .setDescription('Timer setup and configuration')
  .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
  .setDMPermission(false)
  .addSubcommand(s => s.setName('setup').setDescription('Auto-(re)configure channels & roles (idempotent)'))
  .addSubcommand(s => s.setName('reload').setDescription('Reload config and regenerate messages if missing'))
  .addSubcommand(s => s.setName('cleanup').setDescription('Cleanup orphan/duplicate bot messages'))
  .addSubcommand(s => s.setName('permissions').setDescription('Check required permissions in configured channels'))
  .addSubcommand(s =>
    s.setName('summon').setDescription('Manually summon an alert')
      .addStringOption(o => o.setName('target').setDescription('Which alert').setRequired(true).addChoices(
        { name:'Drogon', value:'drogon' }, { name:'Peddler', value:'peddler' }, { name:'Daily', value:'daily' },
        { name:'Weekly', value:'weekly' }, { name:'Beast', value:'beast' }, { name:'Limited Time Deal', value:'limiteddeal' },
      ))
  )
  .addSubcommandGroup(g =>
    g.setName('config').setDescription('Export/Import server configuration (JSON)')
      .addSubcommand(s => s.setName('export').setDescription('Export config as JSON'))
      .addSubcommand(s =>
        s.setName('import').setDescription('Import server config from a JSON file')
          .addAttachmentOption(o => o.setName('file').setDescription('JSON file').setRequired(true))
      )
  )
  .addSubcommandGroup(g =>
    g.setName('reminder').setDescription('Manage your DM reminders')
      .addSubcommand(s =>
        s.setName('add').setDescription('Add a reminder before a timer')
          .addStringOption(o => o.setName('timer').setDescription('Which timer').setRequired(true).addChoices(
            { name:'Drogon', value:'drogon' }, { name:'Peddler', value:'peddler' },
            { name:'Daily', value:'daily' }, { name:'Weekly', value:'weekly' },
            { name:'Beast', value:'beast' }, { name:'Limited Time Deal', value:'limiteddeal' },
          ))
          .addIntegerOption(o => o.setName('minutes').setDescription('How many minutes before').setRequired(true).setMinValue(1).setMaxValue(1440))
      )
      .addSubcommand(s => s.setName('list').setDescription('List your reminders'))
      .addSubcommand(s =>
        s.setName('clear').setDescription('Clear reminders for ONE timer')
          .addStringOption(o => o.setName('timer').setDescription('Timer').setRequired(true).addChoices(
            { name:'Drogon', value:'drogon' }, { name:'Peddler', value:'peddler' },
            { name:'Daily', value:'daily' }, { name:'Weekly', value:'weekly' },
            { name:'Beast', value:'beast' }, { name:'Limited Time Deal', value:'limiteddeal' },
          ))
      )
      .addSubcommand(s =>
        s.setName('remove').setDescription('Remove ONE reminder (timer + minutes)')
          .addStringOption(o => o.setName('timer').setDescription('Timer').setRequired(true).addChoices(
            { name:'Drogon', value:'drogon' }, { name:'Peddler', value:'peddler' },
            { name:'Daily', value:'daily' }, { name:'Weekly', value:'weekly' },
            { name:'Beast', value:'beast' }, { name:'Limited Time Deal', value:'limiteddeal' },
          ))
          .addIntegerOption(o => o.setName('minutes').setDescription('Minutes').setRequired(true))
      )
      .addSubcommand(s => s.setName('clearall').setDescription('Clear ALL your reminders'))
  )
  .addSubcommandGroup(g =>
    g.setName('customtimer').setDescription('Manage custom timers')
      .addSubcommand(s =>
        s.setName('add').setDescription('Add a custom timer')
          .addStringOption(o => o.setName('name').setDescription('Timer name').setRequired(true))
          .addStringOption(o => o.setName('time').setDescription('YYYY-MM-DD HH:mm').setRequired(true))
      )
      .addSubcommand(s => s.setName('list').setDescription('List custom timers'))
      .addSubcommand(s =>
        s.setName('remove').setDescription('Remove a custom timer')
          .addStringOption(o => o.setName('name').setDescription('Timer name').setRequired(true))
      )
  )
  .addSubcommandGroup(g =>
    g.setName('set').setDescription('Set per-server preferences')
      .addSubcommand(s => s.setName('timezone').setDescription('Set server timezone (IANA)')
        .addStringOption(o => o.setName('iana').setDescription('e.g., UTC, America/Toronto').setRequired(true).setAutocomplete(true)))
      .addSubcommand(s => s.setName('language').setDescription('Set language')
        .addStringOption(o => o.setName('lang').setDescription('fr, en, es, pt-br').setRequired(true).addChoices(
          { name:'fr', value:'fr' }, { name:'en', value:'en' }, { name:'es', value:'es' }, { name:'pt-BR', value:'pt-br' }
        )))
      .addSubcommand(s => s.setName('style').setDescription('Set timer message style')
        .addStringOption(o => o.setName('mode').setDescription('compact or embed').setRequired(true).addChoices(
          { name:'compact', value:'compact' }, { name:'embed', value:'embed' }
        )))
  )
  .addSubcommandGroup(g =>
    g.setName('rank').setDescription('Manage alert roles & ranks message')
      .addSubcommand(s => s.setName('post').setDescription('Post the reaction-roles selector'))
      .addSubcommand(s => s.setName('drogon').setDescription('Set role for Drogon').addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
      .addSubcommand(s => s.setName('daily').setDescription('Set role for Daily').addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
      .addSubcommand(s => s.setName('weekly').setDescription('Set role for Weekly').addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
      .addSubcommand(s => s.setName('peddler').setDescription('Set role for Peddler').addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
      .addSubcommand(s => s.setName('beast').setDescription('Set role for Beast').addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
      .addSubcommand(s => s.setName('limiteddeal').setDescription('Set role for Limited Time Deal').addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
  )
  .addSubcommand(s => s.setName('status').setDescription('Show current server configuration'))
  .addSubcommand(s => s.setName('uptime').setDescription('Show bot uptime'))
  .addSubcommand(s => s.setName('timers').setDescription('Show upcoming timers'))
  .addSubcommand(s => s.setName('about').setDescription('About this bot'))
  .addSubcommand(s => s.setName('help').setDescription('Show general user help'))
  .addSubcommand(s => s.setName('helpadmin').setDescription('Show admin-only help'))
  .addSubcommand(s => s.setName('ping').setDescription('Check bot latency'))
  .addSubcommand(s => s.setName('message').setDescription('Send or refresh the timer message'))
  .addSubcommand(s => s.setName('reset').setDescription('Delete the current timer message'))
  .addSubcommand(s => s.setName('event').setDescription('Show the event calendar (screenshot)'))
  .addSubcommand(s => s.setName('patchnote').setDescription('Send and track the latest bot patchnote'))
  .addSubcommand(s => s.setName('searchmarker').setDescription('Show a screenshot centered on a marker').addStringOption(o => o.setName('name').setDescription('Marker name').setRequired(true).setAutocomplete(true)));

async function handleAutocomplete(interaction) {
  const focused = interaction.options.getFocused() || '';
  const sub = interaction.options.getSubcommand(false);
  const focusedName = interaction.options._hoistedOptions?.[0]?.name || '';

  if (sub === 'timezone' || focusedName === 'iana') {
    const query = focused.toLowerCase();
    const list = TZ_SUGGESTIONS.filter(z => z.toLowerCase().includes(query)).slice(0,25);
    return interaction.respond(list.map(z => ({ name: z, value: z })));
  }

  try {
    const all = await getAllMarkerNames();
    const filtered = all
      .filter(n => n.toLowerCase().includes(focused.toLowerCase()))
      .sort((a,b) => a.toLowerCase().indexOf(focused.toLowerCase()) - b.toLowerCase().indexOf(focused.toLowerCase()))
      .slice(0, 25);
    return interaction.respond(filtered.map(name => ({ name, value: name })));
  } catch { return interaction.respond([]); }
}

async function run(interaction, client) {
  const group = interaction.options.getSubcommandGroup(false);
  const sub   = interaction.options.getSubcommand(false);
  const settings = interaction.guildId ? await getSettings(interaction.guildId) : {};

  const adminCommands = new Set(['setup','reload','cleanup','permissions','message','reset','patchnote','summon','status']);
  const adminGroups = new Set(['channel','config','set','rank','customtimer']);

  const shouldBePrivate =
    new Set(['setup','reload','about','cleanup','permissions','status','uptime','help','helpadmin','ping','message','reset','patchnote','timers']).has(sub) ||
    new Set(['channel','config','set','rank','reminder']).has(group);

  if (interaction.guild && (adminCommands.has(sub) || adminGroups.has(group))) {
    if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: t('admin_only', settings), ephemeral: true });
    }
  }
  if (!interaction.deferred && !interaction.replied) {
    await interaction.deferReply({ ephemeral: shouldBePrivate });
  }

  // ADMIN
  if (sub === 'setup') {
    await ensureGuildSetup(interaction.guild);
    return interaction.editReply({ content: `✅ ${t('done_setup', settings)}` });
  }
  if (sub === 'reload') {
    const s = await getSettings(interaction.guildId);
    if (s.patchnoteChannelId) {
      try {
        const ch = await client.channels.fetch(s.patchnoteChannelId);
        const payload = getLatestPatchnotePayload(s);
        if (s.patchnoteMessageId) {
          const msg = await ch.messages.fetch(s.patchnoteMessageId).catch(() => null);
          if (msg) await msg.edit(payload); else {
            const newMsg = await ch.send(payload);
            await updateSettings(interaction.guildId, { patchnoteMessageId: newMsg.id });
          }
        } else {
          const newMsg = await ch.send(payload);
          await updateSettings(interaction.guildId, { patchnoteMessageId: newMsg.id });
        }
      } catch {}
    }
    if (s.globalTimerChannelId && !s.timerMessageId) {
      try {
        const timerCh = await client.channels.fetch(s.globalTimerChannelId);
        await sendTimerMessage(interaction.guild, timerCh);
      } catch {}
    }
    return interaction.editReply({ content: `🔄 ${t('done_reload', s)}` });
  }
  if (sub === 'cleanup') {
    const s = await getSettings(interaction.guildId);
    let removed = 0;
    try {
      const channel = interaction.channel;
      const fetched = await channel.messages.fetch({ limit: 50 });
      const ranksMsgs = fetched.filter(m => m.author.id === client.user.id && m.content?.includes(t('choose_alert_roles', s)));
      if (ranksMsgs.size > 1) {
        const sorted = [...ranksMsgs.values()].sort((a,b) => b.createdTimestamp - a.createdTimestamp);
        for (let i = 1; i < sorted.length; i++) { await sorted[i].delete().catch(()=>{}); removed++; }
        if (sorted[0]) await updateSettings(interaction.guildId, { rankMessageId: sorted[0].id });
      }
    } catch {}
    try {
      if (s.globalTimerChannelId && s.timerMessageId) {
        const ch = await client.channels.fetch(s.globalTimerChannelId);
        const msg = await ch.messages.fetch(s.timerMessageId).catch(()=>null);
        if (!msg) await updateSettings(interaction.guildId, { timerMessageId: null });
      }
    } catch {}
    try {
      if (s.patchnoteChannelId && s.patchnoteMessageId) {
        const ch = await client.channels.fetch(s.patchnoteChannelId);
        const msg = await ch.messages.fetch(s.patchnoteMessageId).catch(()=>null);
        if (!msg) await updateSettings(interaction.guildId, { patchnoteMessageId: null });
      }
    } catch {}
    return interaction.editReply({ content: t('cleanup_removed', settings, removed) });
  }
  if (sub === 'permissions') {
    const s = await getSettings(interaction.guildId);
    const checks = [];
    async function checkChannel(label, id) {
      if (!id) { checks.push(`• ${label}: ${t('not_set', s)}`); return; }
      try {
        const ch = await client.channels.fetch(id);
        const me = ch.guild.members.me;
        const perms = ch.permissionsFor(me);
        const need = ['ViewChannel','SendMessages','EmbedLinks','AddReactions'];
        const missing = need.filter(flag => !perms?.has(PermissionsBitField.Flags[flag]));
        checks.push(`• ${label}: ${missing.length ? `${t('missing', s)} ${missing.join(', ')}` : t('ok', s)}`);
      } catch { checks.push(`• ${label}: ${t('inaccessible', s)}`); }
    }
    await checkChannel('Timer Channel', s.globalTimerChannelId);
    await checkChannel('Warning Channel', s.drogonWarningChannelId);
    await checkChannel('Patchnote Channel', s.patchnoteChannelId);
    const me = interaction.guild.members.me;
    const hasManageRoles = me.permissions.has(PermissionsBitField.Flags.ManageRoles);
    checks.push(`• ManageRoles (guild): ${hasManageRoles ? t('ok', s) : t('missing', s)}`);
    return interaction.editReply({ content: `🔐 **${t('perms_check', s)}**\n${checks.join('\n')}` });
  }

  // SET group
  if (group === 'set') {
    if (sub === 'timezone') {
      const tz = interaction.options.getString('iana', true);
      try {
        require('luxon').DateTime.now().setZone(tz);
        await updateSettings(interaction.guildId, { timezone: tz });
        return interaction.editReply({ content: t('tz_set', settings, tz) });
      } catch {
        return interaction.editReply({ content: t('tz_invalid', settings) });
      }
    }
    if (sub === 'language') {
      const lang = interaction.options.getString('lang', true).toLowerCase();
      if (!['fr','en','es','pt-br'].includes(lang)) return interaction.editReply({ content: t('lang_invalid', settings) });
      await updateSettings(interaction.guildId, { language: lang });
      return interaction.editReply({ content: t('lang_set', { ...settings, language: lang }, lang) });
    }
    if (sub === 'style') {
      const style = interaction.options.getString('mode', true).toLowerCase();
      if (!['compact','embed'].includes(style)) return interaction.editReply({ content: t('style_invalid', settings) });
      await updateSettings(interaction.guildId, { style });
      return interaction.editReply({ content: t('style_set', settings, style) });
    }
  }

  // CHANNEL group
  if (group === 'channel') {
    const validSubs = new Set(['timer','warning','patchnote']);
    if (!validSubs.has(sub)) return interaction.editReply({ content: t('unknown_channel_sub', settings) });
    const target = interaction.options.getChannel('channel', true);
    const ALLOWED_TYPES = new Set([ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.AnnouncementThread]);
    if (!ALLOWED_TYPES.has(target.type)) return interaction.editReply({ content: t('channel_type_invalid', settings) });
    try {
      const me = target.guild.members.me;
      const perms = target.permissionsFor(me);
      const required = [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages];
      const missing = required.filter(f => !perms?.has(f));
      if (missing.length) {
        const names = missing.join(', ');
        return interaction.editReply({ content: t('channel_missing_perms', settings, names) });
      }
    } catch { return interaction.editReply({ content: t('channel_perms_unknown', settings) }); }
    const map = {
      timer:    { field: 'globalTimerChannelId',   label: t('label_timer_channel', settings) },
      warning:  { field: 'drogonWarningChannelId', label: t('label_warning_channel', settings) },
      patchnote:{ field: 'patchnoteChannelId',     label: t('label_patchnote_channel', settings) }
    };
    const { field, label } = map[sub];
    await updateSettings(interaction.guildId, { [field]: target.id });
    if (sub === 'timer') {
      try { await sendTimerMessage(interaction.guild, target); } catch {}
    }
    return interaction.editReply({ content: t('channel_set', settings, label, `<#${target.id}>`) });
  }

  // CONFIG group
  if (group === 'config') {
    if (sub === 'export') {
      const s = await getSettings(interaction.guildId);
      const payload = {
        guildId: s.guildId,
        timezone: s.timezone, language: s.language, style: s.style,
        globalTimerChannelId: s.globalTimerChannelId, drogonWarningChannelId: s.drogonWarningChannelId, patchnoteChannelId: s.patchnoteChannelId,
        drogonRoleId: s.drogonRoleId, peddlerRoleId: s.peddlerRoleId, dailyRoleId: s.dailyRoleId, weeklyRoleId: s.weeklyRoleId, beastRoleId: s.beastRoleId, limitedDealRoleId: s.limitedDealRoleId,
        exportedAt: new Date().toISOString(),
      };
      const buff = Buffer.from(JSON.stringify(payload, null, 2), 'utf8');
      const file = new AttachmentBuilder(buff, { name: `gotkingsroad-config-${interaction.guildId}.json` });
      return interaction.editReply({ content: t('config_export_generated', settings), files: [file] });
    }
    if (sub === 'import') {
      const att = interaction.options.getAttachment('file', true);
      if (att.size > 2_000_000) return interaction.editReply({ content: t('file_too_large', settings) });
      if (att.contentType && !/json|text\/plain/i.test(att.contentType)) return interaction.editReply({ content: t('need_json', settings) });
      try {
        const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
        const res = await fetch(att.url);
        const text = await res.text();
        const data = JSON.parse(text);
        const allowed = ['timezone','language','style','globalTimerChannelId','drogonWarningChannelId','patchnoteChannelId','drogonRoleId','peddlerRoleId','dailyRoleId','weeklyRoleId','beastRoleId','limitedDealRoleId'];
        const apply = {};
        for (const k of allowed) if (data[k] !== undefined && data[k] !== null && data[k] !== '') apply[k] = data[k];
        if (!Object.keys(apply).length) return interaction.editReply({ content: t('nothing_to_import', settings) });
        await updateSettings(interaction.guildId, apply);
        const changed = Object.keys(apply).sort().map(k => `• **${k}** → \`${apply[k]}\``).join('\n');
        return interaction.editReply({ content: t('config_imported', settings, changed) });
      } catch (e) {
        console.error('[config import] error:', e);
        return interaction.editReply({ content: t('import_failed', settings) });
      }
    }
  }

  // SUMMON
  if (sub === 'summon') {
    const target = interaction.options.getString('target', true);
    const s = await getSettings(interaction.guildId);
    if (!s.drogonWarningChannelId) {
      return interaction.editReply({ content: t('need_warning_channel', settings) });
    }
    const roleField = {
      drogon:  'drogonRoleId',
      peddler: 'peddlerRoleId',
      daily:   'dailyRoleId',
      weekly:  'weeklyRoleId',
      beast:   'beastRoleId',
      limiteddeal: 'limitedDealRoleId',
    }[target];

    const roleId = roleField ? s[roleField] : null;
    if (!roleId) {
      const rankCmd = {
        drogon:  'rank drogon',
        peddler: 'rank peddler',
        daily:   'rank daily',
        weekly:  'rank weekly',
        beast:   'rank beast',
        limiteddeal: 'rank limiteddeal',
      }[target];
      return interaction.editReply({ content: t('need_rank_cmd', settings, rankCmd) });
    }
    const tz = tzOf(s);
    const nextTimes = {
      drogon:  getNextDrogonTime(tz),
      peddler: getNextPeddlerTime(tz),
      daily:   getDailyResetTime(),
      weekly:  getWeeklyResetTime(),
      beast:   getNextBeastTime(),
      limiteddeal: getNextLimitedDealTime(tz),
    };
    const when = nextTimes[target];
    const hour = format12HourTime(when, tz);
    const prefixEmoji = { drogon:'🔥', peddler:'🧺', daily:'⏰', weekly:'📅', beast:'🐺', limiteddeal:'🛍️' }[target];
    const key = {
      drogon:  'drogon_near',
      peddler: 'peddler_near',
      daily:   'daily_near',
      weekly:  'weekly_near',
      beast:   'beast_near',
      limiteddeal: 'limiteddeal_near',
    }[target];

    const displayName = timerTitle(target);
    const ch = await client.channels.fetch(s.drogonWarningChannelId);
    const msg = await ch.send({
      content: `${prefixEmoji} ${t(key, s, hour)}\n<@&${roleId}>`,
      allowedMentions: { roles: [roleId] },
    });
    setTimeout(() => msg.delete().catch(()=>{}), 5 * 60 * 1000);
    return interaction.editReply({ content: t('summon_posted', settings, displayName) });
  }

  // RANK group
  if (group === 'rank') {
    if (sub === 'post') {
      const msg = await interaction.channel.send({ content: t('preparing_ranks', settings) });
      await msg.delete().catch(()=>{});
      await sendRanksMessage(interaction.guild, interaction.channel);
      return interaction.editReply({ content: t('reaction_role_sent', settings) });
    }
    if (['drogon','daily','weekly','peddler','beast','limiteddeal'].includes(sub)) {
      const role = interaction.options.getRole('role', true);
      const field = sub === 'drogon' ? 'drogonRoleId' : sub === 'daily' ? 'dailyRoleId' : sub === 'weekly' ? 'weeklyRoleId' : sub === 'peddler' ? 'peddlerRoleId' : sub === 'beast' ? 'beastRoleId' : 'limitedDealRoleId';
      await updateSettings(interaction.guildId, { [field]: role.id });
      return interaction.editReply({ content: t('rank_set', settings, sub, `<@&${role.id}>`) });
    }
  }

  // Status/Uptime/Timers/About/Ping/Message/Reset/Patchnote/Event/Searchmarker
  if (sub === 'status') {
    const s = await getSettings(interaction.guildId);
    const safe = (id, type) => id ? (type==='role' ? `<@&${id}>` : `<#${id}>`) : '—';
    const lines = [
      `**${t('label_timer_channel', settings)}:** ${safe(s.globalTimerChannelId, 'channel')}`,
      `**${t('label_warning_channel', settings)}:** ${safe(s.drogonWarningChannelId, 'channel')}`,
      `**${t('label_patchnote_channel', settings)}:** ${safe(s.patchnoteChannelId, 'channel')}`,
      `**${t('label_timer_msg_id', settings)}:** ${s.timerMessageId || '—'}`,
      `**${t('label_patchnote_msg_id', settings)}:** ${s.patchnoteMessageId || '—'}`,
      `**${t('label_drogon_role', settings)}:** ${safe(s.drogonRoleId, 'role')}`,
      `**${t('label_daily_role', settings)}:** ${safe(s.dailyRoleId, 'role')}`,
      `**${t('label_weekly_role', settings)}:** ${safe(s.weeklyRoleId, 'role')}`,
      `**${t('label_peddler_role', settings)}:** ${safe(s.peddlerRoleId, 'role')}`,
      `**${t('label_beast_role', settings)}:** ${safe(s.beastRoleId, 'role')}`,
      `**${t('label_limiteddeal_role', settings)}:** ${safe(s.limitedDealRoleId, 'role')}`,
      `**${t('label_timezone', settings)}:** ${s.timezone || DEFAULT_TZ}`,
      `**${t('label_language', settings)}:** ${s.language || 'en'}`,
      `**${t('label_style', settings)}:** ${s.style || 'compact'}`,
    ].join('\n');
    return interaction.editReply({ content: `📊 **${t('status_title', settings)}**\n${lines}` });
  }
  if (sub === 'uptime') {
    const up = Date.now() - botStartedAt.getTime();
    return interaction.editReply({ content: `🟢 **${t('uptime_label', settings)}** ${formatDuration(up)}` });
  }
  if (sub === 'timers') {
    const tz = tzOf(settings);
    const now = nowInTZ(tz);
    const nextD = getNextDrogonTime(tz);
    const nextP = getNextPeddlerTime(tz);
    const nextDa= getDailyResetTime();
    const nextW = getWeeklyResetTime();
    const nextB = getNextBeastTime();
    const nextL = getNextLimitedDealTime(tz);
    const lines = [
      `🔥 **Drogon:** ${format12HourTime(nextD, tz)} (${t('in_label', settings, formatCountdown(nextD - now))})`,
      `🧺 **Peddler:** ${format12HourTime(nextP, tz)} (${t('in_label', settings, formatCountdown(nextP - now))})`,
      `⏰ **Daily Reset:** ${format12HourTime(nextDa, tz)} (${t('in_label', settings, formatCountdown(nextDa - now))})`,
      `📅 **Weekly Reset:** ${format12HourTime(nextW, tz)} (${t('in_label', settings, formatCountdown(nextW - now))})`,
      `🐺 **Beast:** ${format12HourTime(nextB, tz)} (${t('in_label', settings, formatCountdown(nextB - now))})`,
      `🛍️ **Limited Time Deal:** ${format12HourTime(nextL, tz)} (${t('in_label', settings, formatCountdown(nextL - now))})`,
    ].join('\n');
    return interaction.editReply({ content: `⏱️ **${t('next_timers_title', settings)}**\n${lines}` });
  }
  if (sub === 'about') {
    return interaction.editReply({
      content: t('about', settings),
      ephemeral: shouldBePrivate
    });
  }
  if (sub === 'help') {
    return interaction.editReply({ content: t('help_user', settings) });
  }
  if (sub === 'helpadmin') {
    if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.editReply({ content: t('perms_only_admin', settings) });
    }
    return interaction.editReply({ content: t('help_admin', settings) });
  }
  if (sub === 'ping') {
    const latency = Date.now() - interaction.createdTimestamp;
    return interaction.editReply({ content: `${t('latency_label', settings)} \`${latency}ms\`` });
  }
  if (sub === 'message') {
    const s = await getSettings(interaction.guildId);
    if (!s.globalTimerChannelId) return interaction.editReply({ content: t('timer_channel_needed', settings) });
    const channel = await client.channels.fetch(s.globalTimerChannelId).catch(() => null);
    if (!channel) return interaction.editReply({ content: t('inaccessible', settings) });
    await sendTimerMessage(interaction.guild, channel);
    return interaction.editReply({ content: t('timer_sent_in', settings, s.globalTimerChannelId) });
  }
  if (sub === 'reset') {
    const s = await getSettings(interaction.guildId);
    if (!s.globalTimerChannelId || !s.timerMessageId) return interaction.editReply({ content: t('no_timer_to_delete', settings) });
    const channel = await client.channels.fetch(s.globalTimerChannelId);
    const msg = await channel.messages.fetch(s.timerMessageId).catch(()=>null);
    if (msg) await msg.delete().catch(()=>{});
    await updateSettings(interaction.guildId, { timerMessageId: null });
    return interaction.editReply({ content: t('timer_deleted', settings) });
  }
  if (sub === 'patchnote') {
    const s = await getSettings(interaction.guildId);
    if (!s.patchnoteChannelId) return interaction.editReply({ content: t('need_patchnote_channel', settings) });
    const ch = await client.channels.fetch(s.patchnoteChannelId);
    const payload = getLatestPatchnotePayload(s);
    const sent = await ch.send(payload);
    await updateSettings(interaction.guildId, { patchnoteMessageId: sent.id });
    return interaction.editReply({ content: t('patchnote_sent', settings) });
  }

  // Lazy-require pour ne pas casser /help si calendar service manque
  if (sub === 'event') {
    try {
      const { captureCalendarScreenshot } = require('../../services/calendar');
      const screenshot = await captureCalendarScreenshot();
      const attachment = new AttachmentBuilder(screenshot, { name: 'calendar.png' });
      await interaction.followUp({
        content: t('upcoming_events', settings),
        files: [attachment],
        ephemeral: shouldBePrivate
      });
      return interaction.editReply({ content: t('calendar_sent', settings) });
    } catch (e) {
      return interaction.editReply({ content: t('calendar_error', settings) });
    }
  }

  if (sub === 'searchmarker') {
    const name = interaction.options.getString('name', true);
    const fileName = `screenshot-${name.replace(/'/g, '').replace(/\s/g, '_')}.webp`;
    const imageUrl = `https://got-kingsroad.com/botdiscord/screenshots/${fileName}`;
    await interaction.followUp({ content: `📍 **${name}**`, ephemeral: shouldBePrivate });
    try {
      const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
      const head = await fetch(imageUrl, { method: 'HEAD' });
      if (head.ok) {
        await interaction.followUp({ embeds: [{ title: `${t('screenshot_label', settings)} ${name}`, image: { url: imageUrl }, color: 0xF4C542 }], ephemeral: shouldBePrivate });
        return interaction.editReply({ content: t('done', settings) });
      }
      return interaction.editReply({ content: t('searchmarker_no_screenshot', settings, name) });
    } catch {
      return interaction.editReply({ content: t('searchmarker_failed', settings, name) });
    }
  }

  // REMINDER group
  if (group === 'reminder') {
    if (sub === 'add') {
      const timerType = interaction.options.getString('timer', true);
      const minutes   = interaction.options.getInteger('minutes', true);
      const tz = tzOf(settings);
      const targets = {
        drogon:  getNextDrogonTime(tz),
        daily:   getDailyResetTime(),
        weekly:  getWeeklyResetTime(),
        peddler: getNextPeddlerTime(tz),
        beast:   getNextBeastTime(),
        limiteddeal: getNextLimitedDealTime(tz),
      };
      const targetTime = targets[timerType];
      const diffMin = Math.floor((targetTime - new Date()) / 60000);
      const prettyName = timerUpper(timerType);
      if (diffMin <= minutes) {
        return interaction.editReply({ content: t('reminder_too_late', settings, prettyName, diffMin, minutes) });
      }
      try {
        await interaction.user.send(t('reminder_dm_confirm', settings, minutes, prettyName));
      } catch (e) {
        if (e.code === 50007) {
          return interaction.editReply({ content: t('reminder_dm_closed', settings) });
        }
        return interaction.editReply({ content: t('reminder_dm_unknown', settings) });
      }
      await addReminder(interaction.user.id, timerType, minutes, interaction.guildId);
      return interaction.editReply({ content: t('reminder_set', settings, minutes, prettyName) });
    }
    if (sub === 'remove') {
      const timer   = interaction.options.getString('timer', true);
      const minutes = interaction.options.getInteger('minutes', true);
      const db = require('../../db');
      const [res] = await db.query('DELETE FROM reminders WHERE userId = ? AND timer = ? AND minutes = ?', [interaction.user.id, timer, minutes]);
      const ok = (res.affectedRows > 0);
      const pretty = timerUpper(timer);
      return interaction.editReply({ content: ok ? t('reminder_removed', settings, pretty, minutes) : t('reminder_not_found', settings, pretty, minutes) });
    }
    if (sub === 'list') {
      const list = await getUserReminders(interaction.user.id);
      if (!list.length) return interaction.editReply({ content: t('reminders_empty', settings) });
      const groups = list.reduce((acc, r) => { (acc[r.timer] ||= []).push(r.minutes); return acc; }, {});
      const lines = Object.entries(groups).sort((a,b)=>a[0].localeCompare(b[0])).map(([timer, mins]) => `• **${timerUpper(timer)}** – ${[...new Set(mins)].sort((a,b)=>a-b).join(', ')} min`);
      return interaction.editReply({ content: `${t('reminders_title', settings)}\n${lines.join('\n')}` });
    }
    if (sub === 'clear') {
      const timer = interaction.options.getString('timer', true);
      await clearUserRemindersByTimer(interaction.user.id, timer);
      return interaction.editReply({ content: t('reminders_cleared_one', settings, timerUpper(timer)) });
    }
    if (sub === 'clearall') {
      await clearUserReminders(interaction.user.id);
      return interaction.editReply({ content: t('reminders_cleared_all', settings) });
    }
  }

  if (group === 'customtimer') {
    if (sub === 'add') {
      const name = interaction.options.getString('name', true);
      const timeStr = interaction.options.getString('time', true);
      const tz = tzOf(settings);
      const dt = DateTime.fromFormat(timeStr, 'yyyy-LL-dd HH:mm', { zone: tz });
      if (!dt.isValid) {
        return interaction.editReply({ content: t('custom_timer_invalid_time', settings) });
      }
      await addCustomTimer(interaction.guildId, name, dt.toJSDate());
      return interaction.editReply({ content: t('custom_timer_added', settings, name, dt.toFormat('yyyy-LL-dd HH:mm')) });
    }
    if (sub === 'list') {
      const list = await getCustomTimers(interaction.guildId);
      if (!list.length) {
        return interaction.editReply({ content: t('custom_timer_list', settings, t('missing', settings)) });
      }
      const tz = tzOf(settings);
      const now = new Date();
      const lines = list.map(r => {
        const dt = DateTime.fromJSDate(r.time).setZone(tz);
        return `• **${r.name}** – ${dt.toFormat('yyyy-LL-dd HH:mm')} (${t('in_label', settings, formatCountdown(r.time - now))})`;
      });
      return interaction.editReply({ content: t('custom_timer_list', settings, lines.join('\n')) });
    }
    if (sub === 'remove') {
      const name = interaction.options.getString('name', true);
      const ok = await removeCustomTimer(interaction.guildId, name);
      return interaction.editReply({ content: ok ? t('custom_timer_removed', settings, name) : t('custom_timer_not_found', settings, name) });
    }
  }

  return interaction.editReply({ content: t('unknown_sub', settings) });
}

module.exports = { builder, handleAutocomplete, run };
