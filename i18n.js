// i18n.js
// Simple i18n store + formatter: t(key, settings, ...args)
const DEFAULT_LANG = 'en';

const I18N = {
  en: {
    // ===== Generic labels =====
    ok: 'OK',
    missing: 'Missing',
    not_set: 'Not set',
    inaccessible: 'Inaccessible',
    in_label: 'in {0}',
    done: '✅ Done.',
    admin_only: '⛔ Admin only',
    unknown_sub: '❌ Unknown subcommand.',
    unknown_channel_sub: '❌ Unknown /channel subcommand.',
    channel_type_invalid: '❌ Please choose a text/announcement channel (or a thread).',
    channel_missing_perms: '❌ Missing permissions in that channel: {0}',
    channel_perms_unknown: '❌ Cannot verify my permissions in that channel.',
    label_timer_channel: 'Timer Channel',
    label_warning_channel: 'Warning Channel',
    label_patchnote_channel: 'Patchnote Channel',
    label_timer_msg_id: 'Timer Msg ID',
    label_patchnote_msg_id: 'Patchnote Msg ID',
    label_drogon_role: 'Drogon Role',
    label_daily_role: 'Daily Role',
    label_weekly_role: 'Weekly Role',
    label_peddler_role: 'Peddler Role',
    label_beast_role: 'Beast Role',
    label_limiteddeal_role: 'Limited Time Deal Role',
    label_timezone: 'Timezone',
    label_language: 'Language',
    label_style: 'Style',
    perms_check: 'Permissions Check',
    status_title: 'Current Setup',
    uptime_label: 'Uptime:',
    latency_label: '🏓 Latency:',
    next_timers_title: 'Next Timers',

    custom_timer_added: '⏰ Custom timer "{0}" set for {1}.',
    custom_timer_removed: '🗑️ Removed custom timer "{0}".',
    custom_timer_not_found: '❌ Custom timer "{0}" not found.',
    custom_timer_list: '📆 Custom timers:\n{0}',
    custom_timer_invalid_time: '❌ Invalid time format. Use YYYY-MM-DD HH:mm.',

    // ===== Setup / reload / cleanup =====
    choose_alert_roles: 'Choose the alert roles you want to receive',
    done_setup: 'Setup completed.',
    done_reload: 'Reload completed.',
    cleanup_removed: '🧹 Removed {0} duplicate ranks messages.',

    // ===== Set / config =====
    tz_set: 'Timezone set to **{0}**.',
    tz_invalid: 'Invalid timezone.',
    lang_invalid: 'Invalid language.',
    lang_set: 'Language set to **{0}**.',
    style_invalid: 'Invalid style.',
    style_set: 'Style set to **{0}**.',
    config_export_generated: '✅ Config export generated.',
    file_too_large: '❌ File too large (max 2 MB).',
    need_json: '❌ Please provide a JSON file.',
    nothing_to_import: '⚠️ Nothing to import (no recognized keys).',
    import_failed: '❌ Failed to import this file (invalid JSON or fetch error).',
    config_imported: '✅ Config imported:\n{0}',
    channel_set: '✅ {0} channel set to {1}.',

    // ===== Timers text =====
    timers_embed_title: 'Global Timers',

    // ===== Warnings (5-min before) =====
    drogon_near: 'Drogon at **{0}**',
    peddler_near: 'Peddler at **{0}**',
    daily_near: 'Daily Reset at **{0}**',
    weekly_near: 'Weekly Reset at **{0}**',
    beast_near: 'Beast at **{0}**',
    limiteddeal_near: 'Limited Time Deal at **{0}**',

    // ===== Patchnote / message =====
    need_patchnote_channel: '❌ Configure `/gotkingsroad channel patchnote` first.',
    patchnote_sent: '✅ Patchnote sent and will auto-update on restart.',
    timer_channel_needed: '❌ Configure the timer channel first with `/gotkingsroad channel timer`.',
    timer_sent_in: '✅ Timer message sent in <#{0}>.',
    no_timer_to_delete: '⚠️ No timer message to delete.',
    timer_deleted: '🧹 Timer message deleted.',

    // ===== Ranks / summon =====
    preparing_ranks: 'Preparing ranks message...',
    reaction_role_sent: '✅ Reaction role message sent.',
    rank_set: '✅ rank {0} set to {1}.',
    need_warning_channel: '❌ Configure `/gotkingsroad channel warning` first.',
    need_rank_cmd: '❌ Configure `/gotkingsroad {0}` first.',
    summon_posted: '✅ {0} summon posted.',

    // ===== Event / Calendar =====
    upcoming_events: '📅 Upcoming events:',
    calendar_sent: '✅ Calendar sent.',
    calendar_error: '❌ Error while generating the calendar.',
    screenshot_label: 'Screenshot:',
    searchmarker_no_screenshot: '❌ No screenshot available for **{0}** yet.',
    searchmarker_failed: '❌ Failed to retrieve screenshot for **{0}**.',

    // ===== Reminders =====
    reminder_too_late: '❌ {0} in {1} min. Too late for a {2}-min reminder.',
    reminder_dm_confirm: '🔔 I will remind you **{0} min** before **{1}** here in DM.',
    reminder_dm_closed: '❌ I cannot DM you. Please enable **Allow direct messages from server members** and try again.',
    reminder_dm_unknown: '❌ I could not send you a confirmation DM, so I did not create the reminder.',
    reminder_set: '✅ Reminder set: **{0} min** before **{1}**.',
    reminder_removed: '🗑️ Removed **{0} – {1} min**.',
    reminder_not_found: '⚠️ You had no **{0} – {1} min** reminder.',
    reminders_empty: '📭 No active reminders.',
    reminders_title: '⏰ **Your Reminders**',
    reminders_cleared_one: '🗑️ Cleared your **{0}** reminders.',
    reminders_cleared_all: '🗑️ All your reminders were cleared.',

    // ===== Help / About =====
help_user: 
`**User commands**
• \`/gotkingsroad timers\` – show upcoming timers
• \`/gotkingsroad searchmarker\` – find a map marker (with screenshot)
• \`/gotkingsroad reminder add|list|remove|clear|clearall\` – manage DM reminders
• \`/gotkingsroad event\` – show the event calendar (screenshot)
• \`/gotkingsroad about\` – about this bot (private)
• \`/gotkingsroad help\` – this help
• \`/gotkingsroad ping\` – check latency`,

perms_only_admin: '⛔ Admin only',

help_admin: 
`**Admin commands**
• \`setup\`, \`reload\`, \`cleanup\`, \`permissions\`, \`status\`, \`uptime\`
• \`set timezone|language|style\`
• \`channel timer|warning|patchnote\`
• \`rank post|drogon|peddler|daily|weekly|beast|limiteddeal\`
• \`message\`, \`reset\`, \`patchnote\`, \`summon\``,

    about:
`🐲 **GOT Kingsroad Bot**
• **Timers & Alerts**: Drogon, Peddler, Daily Reset, Weekly Reset, Beast, Limited Time Deal (with 5-min warnings & DM reminders).
• **Map Tools**: /searchmarker with autocomplete & live screenshots.
• **Reminders**: DM alerts (add | list | remove | clear | clearall).
• **Patchnotes & Events**: Auto-updating patchnotes + event calendar screenshot.
• **Setup & Config**: /setup auto-creates channels & roles, /config export|import, /permissions check.
• **Ranks**: Reaction-role system for alert roles (Drogon, Peddler, Daily, Weekly, Beast).
• **Admin Tools**: /reload, /cleanup, /message, /reset, /summon, /status, /uptime.
• **i18n**: Multilingual replies (fr / en / es / pt-BR).
• **Timezone Support**: Autocomplete IANA tz + UTC (global).
• **Styles**: Timer message in *compact* or *embed* mode.

🌐 **Website:** https://got-kingsroad.com/
👤 **Maintainer:** GilloDaby`,
  },

  fr: {
    ok: 'OK',
    missing: 'Manquant',
    not_set: 'Non défini',
    inaccessible: 'Inaccessible',
    in_label: 'dans {0}',
    done: '✅ Terminé.',
    admin_only: '⛔ Réservé aux administrateurs',
    unknown_sub: '❌ Sous-commande inconnue.',
    unknown_channel_sub: '❌ Sous-commande /channel inconnue.',
    channel_type_invalid: '❌ Choisissez un salon texte/annonces (ou un fil).',
    channel_missing_perms: '❌ Permissions manquantes dans ce salon : {0}',
    channel_perms_unknown: '❌ Impossible de vérifier mes permissions dans ce salon.',
    label_timer_channel: 'Salon Timer',
    label_warning_channel: 'Salon Avertissements',
    label_patchnote_channel: 'Salon Patchnote',
    label_timer_msg_id: 'ID Msg Timer',
    label_patchnote_msg_id: 'ID Msg Patchnote',
    label_drogon_role: 'Rôle Drogon',
    label_daily_role: 'Rôle Daily',
    label_weekly_role: 'Rôle Weekly',
    label_peddler_role: 'Rôle Peddler',
    label_beast_role: 'Rôle Beast',
    label_limiteddeal_role: 'Rôle Offre limitée',
    label_timezone: 'Fuseau',
    label_language: 'Langue',
    label_style: 'Style',
    perms_check: 'Vérification des permissions',
    status_title: 'Configuration actuelle',
    uptime_label: 'Uptime :',
    latency_label: '🏓 Latence :',
    next_timers_title: 'Prochains timers',

    custom_timer_added: '⏰ Minuteur "{0}" fixé pour {1}.',
    custom_timer_removed: '🗑️ Minuteur "{0}" supprimé.',
    custom_timer_not_found: '❌ Minuteur "{0}" introuvable.',
    custom_timer_list: '📆 Minuteries personnalisées:\n{0}',
    custom_timer_invalid_time: '❌ Format de date invalide. Utilisez YYYY-MM-DD HH:mm.',

    choose_alert_roles: 'Choisissez les rôles d’alerte que vous souhaitez recevoir',
    done_setup: 'Configuration terminée.',
    done_reload: 'Rechargement effectué.',
    cleanup_removed: '🧹 {0} messages de ranks en double supprimés.',

    tz_set: 'Fuseau horaire défini sur **{0}**.',
    tz_invalid: 'Fuseau horaire invalide.',
    lang_invalid: 'Langue invalide.',
    lang_set: 'Langue définie sur **{0}**.',
    style_invalid: 'Style invalide.',
    style_set: 'Style défini sur **{0}**.',
    config_export_generated: '✅ Export de configuration généré.',
    file_too_large: '❌ Fichier trop volumineux (max 2 Mo).',
    need_json: '❌ Merci de fournir un fichier JSON.',
    nothing_to_import: '⚠️ Rien à importer (aucune clé reconnue).',
    import_failed: '❌ Échec de l’import (JSON invalide ou erreur réseau).',
    config_imported: '✅ Configuration importée :\n{0}',
    channel_set: '✅ Le salon {0} a été défini sur {1}.',

    timers_embed_title: 'Timers globaux',

    drogon_near: 'Drogon à **{0}**',
    peddler_near: 'Peddler à **{0}**',
    daily_near: 'Reset quotidien à **{0}**',
    weekly_near: 'Reset hebdo à **{0}**',
    beast_near: 'Beast à **{0}**',
    limiteddeal_near: 'Offre limitée à **{0}**',

    need_patchnote_channel: '❌ Configurez d’abord `/gotkingsroad channel patchnote`.',
    patchnote_sent: '✅ Patchnote envoyé et suivi (mise à jour auto).',
    timer_channel_needed: '❌ Configurez d’abord le salon des timers avec `/gotkingsroad channel timer`.',
    timer_sent_in: '✅ Message timer envoyé dans <#{0}>.',
    no_timer_to_delete: '⚠️ Aucun message timer à supprimer.',
    timer_deleted: '🧹 Message timer supprimé.',

    preparing_ranks: 'Préparation du message des ranks...',
    reaction_role_sent: '✅ Message de rôles par réactions envoyé.',
    rank_set: '✅ rank {0} défini sur {1}.',
    need_warning_channel: '❌ Configurez d’abord `/gotkingsroad channel warning`.',
    need_rank_cmd: '❌ Configurez d’abord `/gotkingsroad {0}`.',
    summon_posted: '✅ {0} annoncé.',

    upcoming_events: '📅 Événements à venir :',
    calendar_sent: '✅ Calendrier envoyé.',
    calendar_error: '❌ Erreur lors de la génération du calendrier.',
    screenshot_label: 'Capture :',
    searchmarker_no_screenshot: '❌ Aucune capture disponible pour **{0}** pour l’instant.',
    searchmarker_failed: '❌ Échec de récupération de la capture pour **{0}**.',

    reminder_too_late: '❌ {0} dans {1} min. Trop tard pour un rappel de {2} min.',
    reminder_dm_confirm: '🔔 Je te rappellerai **{0} min** avant **{1}** ici en DM.',
    reminder_dm_closed: '❌ Je ne peux pas t’envoyer de DM. Active **Autoriser les messages privés** et réessaie.',
    reminder_dm_unknown: '❌ Impossible d’envoyer le DM de confirmation, le rappel n’a pas été créé.',
    reminder_set: '✅ Rappel créé : **{0} min** avant **{1}**.',
    reminder_removed: '🗑️ Supprimé **{0} – {1} min**.',
    reminder_not_found: '⚠️ Tu n’avais pas de rappel **{0} – {1} min**.',
    reminders_empty: '📭 Aucun rappel actif.',
    reminders_title: '⏰ **Tes rappels**',
    reminders_cleared_one: '🗑️ Tes rappels **{0}** ont été supprimés.',
    reminders_cleared_all: '🗑️ Tous tes rappels ont été supprimés.',

    perms_only_admin: '⛔ Réservé aux administrateurs',
help_user: 
`**Commandes utilisateur**
• \`/gotkingsroad timers\` – affiche les prochains timers
• \`/gotkingsroad searchmarker\` – trouve un marqueur sur la carte (avec capture)
• \`/gotkingsroad reminder add|list|remove|clear|clearall\` – gérer tes rappels en DM
• \`/gotkingsroad event\` – affiche le calendrier des événements (capture)
• \`/gotkingsroad about\` – à propos du bot (privé)
• \`/gotkingsroad help\` – cette aide
• \`/gotkingsroad ping\` – vérifier la latence`,

perms_only_admin: '⛔ Réservé aux administrateurs',

help_admin: 
`**Commandes admin**
• \`setup\`, \`reload\`, \`cleanup\`, \`permissions\`, \`status\`, \`uptime\`
• \`set timezone|language|style\`
• \`channel timer|warning|patchnote\`
• \`rank post|drogon|peddler|daily|weekly|beast|limiteddeal\`
• \`message\`, \`reset\`, \`patchnote\`, \`summon\``,

    about:
`🐲 **Bot GOT Kingsroad**
• **Timers & Alertes** : Drogon, Peddler, Reset Quotidien, Reset Hebdo, Beast, Offre limitée (alertes 5 min avant & rappels en DM).
• **Outils Carte** : /searchmarker avec autocomplétion & captures.
• **Rappels** : DM (add | list | remove | clear | clearall).
• **Patchnotes & Événements** : patchnotes auto + capture calendrier.
• **Setup & Config** : /setup crée salons & rôles, /config export|import, /permissions check.
• **Ranks** : rôles par réactions (Drogon, Peddler, Daily, Weekly, Beast).
• **Outils Admin** : /reload, /cleanup, /message, /reset, /summon, /status, /uptime.
• **i18n** : fr / en / es / pt-BR.
• **Fuseaux horaires** : autocomplétion IANA + UTC.
• **Styles** : *compact* ou *embed*.

🌐 **Site :** https://got-kingsroad.com/
👤 **Mainteneur :** GilloDaby`,
  },

  es: {
    ok: 'OK',
    missing: 'Faltante',
    not_set: 'No definido',
    inaccessible: 'Inaccesible',
    in_label: 'en {0}',
    done: '✅ Listo.',
    admin_only: '⛔ Solo administradores',
    unknown_sub: '❌ Subcomando desconocido.',
    unknown_channel_sub: '❌ Subcomando /channel desconocido.',
    channel_type_invalid: '❌ Elige un canal de texto/anuncios (o un hilo).',
    channel_missing_perms: '❌ Faltan permisos en ese canal: {0}',
    channel_perms_unknown: '❌ No puedo verificar mis permisos en ese canal.',
    label_timer_channel: 'Canal de Timer',
    label_warning_channel: 'Canal de Avisos',
    label_patchnote_channel: 'Canal de Patchnote',
    label_timer_msg_id: 'ID Msg Timer',
    label_patchnote_msg_id: 'ID Msg Patchnote',
    label_drogon_role: 'Rol Drogon',
    label_daily_role: 'Rol Daily',
    label_weekly_role: 'Rol Weekly',
    label_peddler_role: 'Rol Peddler',
    label_beast_role: 'Rol Beast',
    label_limiteddeal_role: 'Rol Oferta Limitada',
    label_timezone: 'Zona horaria',
    label_language: 'Idioma',
    label_style: 'Estilo',
    perms_check: 'Verificación de permisos',
    status_title: 'Configuración actual',
    uptime_label: 'Uptime:',
    latency_label: '🏓 Latencia:',
    next_timers_title: 'Próximos temporizadores',

    custom_timer_added: '⏰ Temporizador "{0}" programado para {1}.',
    custom_timer_removed: '🗑️ Temporizador "{0}" eliminado.',
    custom_timer_not_found: '❌ Temporizador "{0}" no encontrado.',
    custom_timer_list: '📆 Temporizadores personalizados:\n{0}',
    custom_timer_invalid_time: '❌ Formato de hora inválido. Use YYYY-MM-DD HH:mm.',

    choose_alert_roles: 'Elige los roles de alerta que quieres recibir',
    done_setup: 'Configuración completada.',
    done_reload: 'Recarga completada.',
    cleanup_removed: '🧹 {0} mensajes de rangos duplicados eliminados.',

    tz_set: 'Zona horaria establecida a **{0}**.',
    tz_invalid: 'Zona horaria inválida.',
    lang_invalid: 'Idioma inválido.',
    lang_set: 'Idioma establecido a **{0}**.',
    style_invalid: 'Estilo inválido.',
    style_set: 'Estilo establecido a **{0}**.',
    config_export_generated: '✅ Exportación de configuración generada.',
    file_too_large: '❌ Archivo demasiado grande (máx 2 MB).',
    need_json: '❌ Proporciona un archivo JSON.',
    nothing_to_import: '⚠️ Nada que importar (sin claves reconocidas).',
    import_failed: '❌ Error al importar (JSON inválido o error de red).',
    config_imported: '✅ Configuración importada:\n{0}',
    channel_set: '✅ Canal {0} establecido a {1}.',

    timers_embed_title: 'Temporizadores globales',

    drogon_near: 'Drogon a las **{0}**',
    peddler_near: 'Peddler a las **{0}**',
    daily_near: 'Reinicio diario a las **{0}**',
    weekly_near: 'Reinicio semanal a las **{0}**',
    beast_near: 'Beast a las **{0}**',
    limiteddeal_near: 'Oferta limitada a las **{0}**',

    need_patchnote_channel: '❌ Configura primero `/gotkingsroad channel patchnote`.',
    patchnote_sent: '✅ Patchnote enviado (actualización automática).',
    timer_channel_needed: '❌ Configura primero el canal de timer con `/gotkingsroad channel timer`.',
    timer_sent_in: '✅ Mensaje de timer enviado en <#{0}>.',
    no_timer_to_delete: '⚠️ No hay mensaje de timer para eliminar.',
    timer_deleted: '🧹 Mensaje de timer eliminado.',

    preparing_ranks: 'Preparando el mensaje de rangos...',
    reaction_role_sent: '✅ Mensaje de roles por reacción enviado.',
    rank_set: '✅ rank {0} establecido a {1}.',
    need_warning_channel: '❌ Configura primero `/gotkingsroad channel warning`.',
    need_rank_cmd: '❌ Configura primero `/gotkingsroad {0}`.',
    summon_posted: '✅ {0} anunciado.',

    upcoming_events: '📅 Próximos eventos:',
    calendar_sent: '✅ Calendario enviado.',
    calendar_error: '❌ Error al generar el calendario.',
    screenshot_label: 'Captura:',
    searchmarker_no_screenshot: '❌ No hay captura disponible para **{0}** aún.',
    searchmarker_failed: '❌ Error al recuperar la captura para **{0}**.',

    reminder_too_late: '❌ {0} en {1} min. Demasiado tarde para un recordatorio de {2} min.',
    reminder_dm_confirm: '🔔 Te recordaré **{0} min** antes de **{1}** por DM.',
    reminder_dm_closed: '❌ No puedo enviarte DM. Activa **Permitir mensajes directos** y vuelve a intentar.',
    reminder_dm_unknown: '❌ No pude enviarte el DM de confirmación, así que no creé el recordatorio.',
    reminder_set: '✅ Recordatorio creado: **{0} min** antes de **{1}**.',
    reminder_removed: '🗑️ Eliminado **{0} – {1} min**.',
    reminder_not_found: '⚠️ No tenías el recordatorio **{0} – {1} min**.',
    reminders_empty: '📭 No hay recordatorios activos.',
    reminders_title: '⏰ **Tus recordatorios**',
    reminders_cleared_one: '🗑️ Se borraron tus recordatorios de **{0}**.',
    reminders_cleared_all: '🗑️ Se borraron todos tus recordatorios.',

    perms_only_admin: '⛔ Solo administradores',
help_user: 
`**Comandos de usuario**
• \`/gotkingsroad timers\` – mostrar los próximos temporizadores
• \`/gotkingsroad searchmarker\` – buscar un marcador en el mapa (con captura)
• \`/gotkingsroad reminder add|list|remove|clear|clearall\` – gestionar recordatorios por DM
• \`/gotkingsroad event\` – mostrar el calendario de eventos (captura)
• \`/gotkingsroad about\` – información sobre el bot (privado)
• \`/gotkingsroad help\` – esta ayuda
• \`/gotkingsroad ping\` – comprobar latencia`,

perms_only_admin: '⛔ Solo administradores',

help_admin: 
`**Comandos de admin**
• \`setup\`, \`reload\`, \`cleanup\`, \`permissions\`, \`status\`, \`uptime\`
• \`set timezone|language|style\`
• \`channel timer|warning|patchnote\`
• \`rank post|drogon|peddler|daily|weekly|beast|limiteddeal\`
• \`message\`, \`reset\`, \`patchnote\`, \`summon\``,

    about:
`🐲 **Bot GOT Kingsroad**
• **Temporizadores y Alertas**: Drogon, Peddler, Reinicio Diario, Reinicio Semanal, Beast, Oferta Limitada (avisos 5 min antes y recordatorios por DM).
• **Herramientas de Mapa**: /searchmarker con autocompletar y capturas en vivo.
• **Recordatorios**: DM (add | list | remove | clear | clearall).
• **Patchnotes & Eventos**: patchnotes auto + captura del calendario.
• **Configuración**: /setup crea canales y roles, /config export|import, /permissions check.
• **Rangos**: roles por reacción (Drogon, Peddler, Daily, Weekly, Beast).
• **Admin**: /reload, /cleanup, /message, /reset, /summon, /status, /uptime.
• **i18n**: fr / en / es / pt-BR.
• **Zonas horarias**: autocompletar IANA + UTC.
• **Estilos**: *compact* o *embed*.

🌐 **Sitio web:** https://got-kingsroad.com/
👤 **Mantenedor:** GilloDaby`,
  },

  'pt-br': {
    ok: 'OK',
    missing: 'Faltando',
    not_set: 'Não definido',
    inaccessible: 'Inacessível',
    in_label: 'em {0}',
    done: '✅ Concluído.',
    admin_only: '⛔ Somente administradores',
    unknown_sub: '❌ Subcomando desconhecido.',
    unknown_channel_sub: '❌ Subcomando /channel desconhecido.',
    channel_type_invalid: '❌ Escolha um canal de texto/anúncios (ou um tópico).',
    channel_missing_perms: '❌ Permissões ausentes nesse canal: {0}',
    channel_perms_unknown: '❌ Não consigo verificar minhas permissões nesse canal.',
    label_timer_channel: 'Canal de Timer',
    label_warning_channel: 'Canal de Avisos',
    label_patchnote_channel: 'Canal de Patchnote',
    label_timer_msg_id: 'ID Msg Timer',
    label_patchnote_msg_id: 'ID Msg Patchnote',
    label_drogon_role: 'Cargo Drogon',
    label_daily_role: 'Cargo Daily',
    label_weekly_role: 'Cargo Weekly',
    label_peddler_role: 'Cargo Peddler',
    label_beast_role: 'Cargo Beast',
    label_limiteddeal_role: 'Cargo Oferta Limitada',
    label_timezone: 'Fuso horário',
    label_language: 'Idioma',
    label_style: 'Estilo',
    perms_check: 'Verificação de permissões',
    status_title: 'Configuração atual',
    uptime_label: 'Uptime:',
    latency_label: '🏓 Latência:',
    next_timers_title: 'Próximos timers',

    custom_timer_added: '⏰ Timer "{0}" definido para {1}.',
    custom_timer_removed: '🗑️ Timer "{0}" removido.',
    custom_timer_not_found: '❌ Timer "{0}" não encontrado.',
    custom_timer_list: '📆 Timers personalizados:\n{0}',
    custom_timer_invalid_time: '❌ Formato de hora inválido. Use YYYY-MM-DD HH:mm.',

    choose_alert_roles: 'Escolha os cargos de alerta que deseja receber',
    done_setup: 'Configuração concluída.',
    done_reload: 'Recarga concluída.',
    cleanup_removed: '🧹 {0} mensagens de ranks duplicadas removidas.',

    tz_set: 'Fuso horário definido para **{0}**.',
    tz_invalid: 'Fuso horário inválido.',
    lang_invalid: 'Idioma inválido.',
    lang_set: 'Idioma definido para **{0}**.',
    style_invalid: 'Estilo inválido.',
    style_set: 'Estilo definido para **{0}**.',
    config_export_generated: '✅ Exportação de configuração gerada.',
    file_too_large: '❌ Arquivo muito grande (máx 2 MB).',
    need_json: '❌ Envie um arquivo JSON.',
    nothing_to_import: '⚠️ Nada para importar (nenhuma chave reconhecida).',
    import_failed: '❌ Falha ao importar (JSON inválido ou erro de rede).',
    config_imported: '✅ Configuração importada:\n{0}',
    channel_set: '✅ Canal {0} definido para {1}.',

    timers_embed_title: 'Timers globais',

    drogon_near: 'Drogon às **{0}**',
    peddler_near: 'Peddler às **{0}**',
    daily_near: 'Reset diário às **{0}**',
    weekly_near: 'Reset semanal às **{0}**',
    beast_near: 'Beast às **{0}**',
    limiteddeal_near: 'Oferta limitada às **{0}**',

    need_patchnote_channel: '❌ Configure primeiro `/gotkingsroad channel patchnote`.',
    patchnote_sent: '✅ Patchnote enviado (atualização automática).',
    timer_channel_needed: '❌ Configure primeiro o canal de timer com `/gotkingsroad channel timer`.',
    timer_sent_in: '✅ Mensagem de timer enviada em <#{0}>.',
    no_timer_to_delete: '⚠️ Nenhuma mensagem de timer para excluir.',
    timer_deleted: '🧹 Mensagem de timer excluída.',

    preparing_ranks: 'Preparando a mensagem de ranks...',
    reaction_role_sent: '✅ Mensagem de cargos por reação enviada.',
    rank_set: '✅ rank {0} definido para {1}.',
    need_warning_channel: '❌ Configure primeiro `/gotkingsroad channel warning`.',
    need_rank_cmd: '❌ Configure primeiro `/gotkingsroad {0}`.',
    summon_posted: '✅ {0} anunciado.',

    upcoming_events: '📅 Próximos eventos:',
    calendar_sent: '✅ Calendário enviado.',
    calendar_error: '❌ Erro ao gerar o calendário.',
    screenshot_label: 'Captura:',
    searchmarker_no_screenshot: '❌ Sem captura disponível para **{0}** ainda.',
    searchmarker_failed: '❌ Falha ao recuperar a captura para **{0}**.',

    reminder_too_late: '❌ {0} em {1} min. Tarde demais para um lembrete de {2} min.',
    reminder_dm_confirm: '🔔 Vou lembrar você **{0} min** antes de **{1}** por DM.',
    reminder_dm_closed: '❌ Não consigo enviar DM. Ative **Permitir mensagens diretas** e tente novamente.',
    reminder_dm_unknown: '❌ Não consegui enviar o DM de confirmação, então não criei o lembrete.',
    reminder_set: '✅ Lembrete criado: **{0} min** antes de **{1}**.',
    reminder_removed: '🗑️ Removido **{0} – {1} min**.',
    reminder_not_found: '⚠️ Você não tinha o lembrete **{0} – {1} min**.',
    reminders_empty: '📭 Nenhum lembrete ativo.',
    reminders_title: '⏰ **Seus lembretes**',
    reminders_cleared_one: '🗑️ Seus lembretes de **{0}** foram apagados.',
    reminders_cleared_all: '🗑️ Todos os seus lembretes foram apagados.',

    perms_only_admin: '⛔ Somente administradores',
help_user: 
`**Comandos de usuário**
• \`/gotkingsroad timers\` – mostrar os próximos timers
• \`/gotkingsroad searchmarker\` – encontrar um marcador no mapa (com screenshot)
• \`/gotkingsroad reminder add|list|remove|clear|clearall\` – gerenciar lembretes por DM
• \`/gotkingsroad event\` – mostrar o calendário de eventos (screenshot)
• \`/gotkingsroad about\` – sobre o bot (privado)
• \`/gotkingsroad help\` – esta ajuda
• \`/gotkingsroad ping\` – verificar latência`,

perms_only_admin: '⛔ Apenas administradores',

help_admin: 
`**Comandos admin**
• \`setup\`, \`reload\`, \`cleanup\`, \`permissions\`, \`status\`, \`uptime\`
• \`set timezone|language|style\`
• \`channel timer|warning|patchnote\`
• \`rank post|drogon|peddler|daily|weekly|beast|limiteddeal\`
• \`message\`, \`reset\`, \`patchnote\`, \`summon\``,

    about:
`🐲 **Bot GOT Kingsroad**
• **Timers & Alertas**: Drogon, Peddler, Reset Diário, Reset Semanal, Beast, Oferta Limitada (avisos 5 min antes e lembretes por DM).
• **Ferramentas de Mapa**: /searchmarker com autocompletar e capturas ao vivo.
• **Lembretes**: DM (add | list | remove | clear | clearall).
• **Patchnotes & Eventos**: patchnotes auto + captura do calendário.
• **Configuração**: /setup cria canais e cargos, /config export|import, /permissions check.
• **Ranks**: cargos por reação (Drogon, Peddler, Daily, Weekly, Beast).
• **Admin**: /reload, /cleanup, /message, /reset, /summon, /status, /uptime.
• **i18n**: fr / en / es / pt-BR.
• **Fusos**: autocompletar IANA + UTC.
• **Estilos**: *compact* ou *embed*.

🌐 **Site:** https://got-kingsroad.com/
👤 **Mantenedor:** GilloDaby`,
  },
};

// Language resolver & formatter
function langOf(settings) {
  const raw = (settings?.language || DEFAULT_LANG).toLowerCase();
  return ['en','fr','es','pt-br'].includes(raw) ? raw : DEFAULT_LANG;
}

function t(key, settings = {}, ...args) {
  const L = langOf(settings);
  const pack = I18N[L] || I18N[DEFAULT_LANG];
  let s = pack[key] ?? I18N[DEFAULT_LANG][key] ?? key;
  if (!args.length) return s;
  return s.replace(/\{(\d+)\}/g, (_, i) => (args[i] !== undefined ? String(args[i]) : ''));
}

module.exports = { I18N, t, langOf, DEFAULT_LANG };
