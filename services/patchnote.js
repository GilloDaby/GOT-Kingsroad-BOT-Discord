const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

function getLatestPatchnoteEmbed(settings = {}) {
  const DEFAULT_LANG = 'en';
  const lang = (settings.language || DEFAULT_LANG).toLowerCase();
  const L = ['en', 'fr', 'es', 'pt-br'].includes(lang) ? lang : DEFAULT_LANG;

  const version = config.version || 'v3.0.0';
  const dateISO = new Date().toISOString().slice(0, 10);

  const blocks = {
    en: {
      title: `GOT KINGSROAD DISCORD BOT — ${version} (${dateISO}) | PATCHNOTE`,
      body:
`**NEW**
• 🧩 **Modular split**: bot refactored into services/commands/utils/events for easier maintenance.
• 🌐 **Full i18n coverage**: FR / EN / ES / PT-BR for *all* user/admin replies (+ /about localized).
• 👤 **Private /about**: auto-ephemeral when relevant (admin/private contexts).
• 🐺 **Beast Timer** (Toronto/EST base): **03:00, 07:00, 11:00, 15:00, 19:00, 23:00** (shown in your server TZ).
• 🛍️ **Limited Time Deal**: **05:00, 11:00, 17:00, 23:00** (shown in your server TZ).
• 🔔 **DM Reminders**: \`add | list | remove | clear | clearall\` per timer (Drogon/Peddler/Daily/Weekly/Beast/Limited Time Deal).
• 🧭 **/summon**: manually ping one alert (role-gated, localized).
• 🗂️ **Config export/import** (JSON) and **Permissions check** command.
• 🕒 **Timezone autocomplete** (IANA) incl. **UTC (Global)**.
• 🗺️ **/searchmarker** with official **autocomplete** + live **screenshot**.
• 📝 **Patchnote tracking**: auto-update on startup; one-click \`/gotkingsroad patchnote\`.

**IMPROVEMENTS**
• ⏱️ **Timer message** (compact/embed) shows **Drogon, Peddler, Daily, Weekly, Beast, Limited Time Deal** with live countdowns.
• 📡 “**5-min before**” pings for all timers (roles mention once per occurrence, now includes Limited Time Deal).
• 🧩 **Auto-setup** creates categories/channels/roles & posts ranks selector.
• 🔁 **/reload** regenerates patchnote & timer if missing.
• 🧹 **/cleanup**: keeps newest ranks message, deletes duplicates, and re-saves its ID.
• 🔐 Clear **permission** checks per channel (view/send/embed/reactions).
• 💾 **Ranks ID restore** on boot so reactions keep working after restarts.

**FIXES**
• More robust timer refresh & error handling (graceful edits).
• Safer DM failures: explicit messages if DMs are closed; auto-clean reminders for unreachable users.
• Better handling when channels/messages were deleted (DB cleanup on startup).
• Unified, localized help texts and errors.

**KNOWN ISSUES**
• Under heavy Discord rate limits, some “5-min before” pings can be skipped.
• If the bot role is **below** alert roles, reaction assignment won’t work.

**CHEATSHEET**
• **User**: \`/gotkingsroad timers\`, \`searchmarker\`, \`reminder add|list|remove|clear|clearall\`, \`about\`, \`help\`
• **Admin**:
  • Setup: \`setup\`, \`reload\`, \`cleanup\`, \`permissions\`
  • Prefs: \`set timezone|language|style\` (TZ autocomplete, **UTC**)
  • Channels: \`channel timer|warning|patchnote\`
  • Timers: \`message\` (post/refresh), \`reset\` (delete)
  • Ranks: \`rank post\`, \`rank drogon|peddler|daily|weekly|beast|limiteddeal\`
  • Misc: \`status\`, \`uptime\`, \`summon\`, \`patchnote\`

🔗 https://got-kingsroad.com/`
    },

    fr: {
      title: `GOT KINGSROAD DISCORD BOT — ${version} (${dateISO}) | PATCHNOTE`,
      body:
`**NOUVEAUTÉS**
• 🧩 **Refonte modulaire** : services/commands/utils/events — maintenance simplifiée.
• 🌐 **i18n complet** : FR / EN / ES / PT-BR pour *toutes* les réponses (incl. \`/about\` traduit).
• 👤 **/about privé** : réponse éphémère automatiquement selon le contexte.
• 🐺 **Timer Beast** (base Toronto/EST) : **03:00, 07:00, 11:00, 15:00, 19:00, 23:00** (affiché dans le TZ du serveur).
• 🛍️ **Offre limitée** : **05:00, 11:00, 17:00, 23:00** (affichée dans le TZ du serveur).
• 🔔 **Rappels en DM** : \`add | list | remove | clear | clearall\` par timer (Drogon/Peddler/Daily/Weekly/Beast/Offre limitée).
• 🧭 **/summon** : ping manuel d’une alerte (avec rôle & texte localisé).
• 🗂️ **Export/Import de config** (JSON) et **vérification des permissions**.
• 🕒 **Autocomplete des fuseaux** (IANA) incluant **UTC (Global)**.
• 🗺️ **/searchmarker** avec **autocomplete** officiel + **capture** en direct.
• 📝 **Suivi du patchnote** : MAJ auto au démarrage ; commande \`/gotkingsroad patchnote\`.

**AMÉLIORATIONS**
• ⏱️ **Message Timers** (compact/embed) : **Drogon, Peddler, Daily, Weekly, Beast, Offre limitée** avec décomptes en direct.
• 📡 Ping “**5 min avant**” pour tous les timers (mention une fois par occurrence, incl. Offre limitée).
• 🧩 **Auto-setup** : crée catégories/salons/rôles & poste le sélecteur des ranks.
• 🔁 **/reload** régénère patchnote & timer si manquants.
• 🧹 **/cleanup** : garde le message de ranks le plus récent, supprime les doublons, ré-enregistre l’ID.
• 🔐 Contrôles de **permissions** par salon (voir/envoyer/embed/réactions).
• 💾 **Restauration de l’ID des ranks** au démarrage pour garder les réactions actives.

**CORRECTIONS**
• Rafraîchissement des timers plus robuste + meilleure gestion d’erreurs.
• DMs fermés : messages explicites et nettoyage auto des rappels injoignables.
• Nettoyage DB au démarrage si salons/messages supprimés.
• Aides/erreurs unifiées et traduites.

**PROBLÈMES CONNUS**
• Sous fortes limites Discord, certains pings “5 min avant” peuvent être ignorés.
• Si le rôle du bot est **sous** les rôles d’alerte, l’assignation par réactions échoue.

**RÉCAP**
• **Utilisateur** : \`/gotkingsroad timers\`, \`searchmarker\`, \`reminder add|list|remove|clear|clearall\`, \`about\`, \`help\`
• **Admin** :
  • Setup : \`setup\`, \`reload\`, \`cleanup\`, \`permissions\`
  • Préfs : \`set timezone|language|style\` (autocomplete, **UTC**)
  • Salons : \`channel timer|warning|patchnote\`
  • Timers : \`message\` (poste/refresh), \`reset\` (supprime)
  • Rôles : \`rank post\`, \`rank drogon|peddler|daily|weekly|beast|limiteddeal\`
  • Divers : \`status\`, \`uptime\`, \`summon\`, \`patchnote\`

🔗 https://got-kingsroad.com/`
    },

    es: {
      title: `GOT KINGSROAD DISCORD BOT — ${version} (${dateISO}) | PATCHNOTE`,
      body:
`**NUEVO**
• 🧩 **Estructura modular**: services/commands/utils/events para mejor mantenimiento.
• 🌐 **i18n completo**: FR / EN / ES / PT-BR para *todas* las respuestas (incl. \`/about\`).
• 👤 **/about privado**: respuesta efímera cuando corresponde.
• 🐺 **Timer Beast** (Toronto/EST): **03:00, 07:00, 11:00, 15:00, 19:00, 23:00** (mostrado en la zona del servidor).
• 🛍️ **Oferta limitada**: **05:00, 11:00, 17:00, 23:00** (mostrada en la zona del servidor).
• 🔔 **Recordatorios por DM**: \`add | list | remove | clear | clearall\` por temporizador (Drogon/Peddler/Daily/Weekly/Beast/Oferta Limitada).
• 🧭 **/summon**: anuncia manualmente una alerta (con rol y texto localizado).
• 🗂️ **Exportar/Importar config** (JSON) y **chequeo de permisos**.
• 🕒 **Autocompletado de zona horaria** (IANA) incl. **UTC (Global)**.
• 🗺️ **/searchmarker** con **autocompletado** oficial + **captura** en vivo.
• 📝 **Patchnote** con actualización automática al iniciar; comando \`/gotkingsroad patchnote\`.

**MEJORAS**
• ⏱️ **Mensaje de timers** (compact/embed) con **Drogon, Peddler, Daily, Weekly, Beast, Oferta Limitada** y cuenta regresiva.
• 📡 Avisos “**5 min antes**” para todos los temporizadores (una vez por ocurrencia, incluye Oferta Limitada).
• 🧩 **Auto-setup**: crea categorías/canales/roles y publica selector de rangos.
• 🔁 **/reload** regenera patchnote & timer si faltan.
• 🧹 **/cleanup**: conserva el mensaje de rangos más reciente, elimina duplicados y guarda su ID.
• 🔐 Comprobaciones de **permisos** por canal.
• 💾 **Restaura** el ID del mensaje de rangos al iniciar para mantener reacciones.

**CORRECCIONES**
• Actualización de timers más estable y mejor manejo de errores.
• DMs cerrados: mensajes claros y limpieza automática de recordatorios.
• Limpieza de DB al iniciar si faltan canales/mensajes.
• Ayudas/errores unificados y localizados.

**PROBLEMAS CONOCIDOS**
• Con límites de Discord, algunos avisos “5 min antes” pueden perderse.
• Si el rol del bot está **debajo** de roles de alerta, fallará la asignación por reacciones.

**ATAJOS**
• **Usuario**: \`/gotkingsroad timers\`, \`searchmarker\`, \`reminder add|list|remove|clear|clearall\`, \`about\`, \`help\`
• **Admin**:
  • Setup: \`setup\`, \`reload\`, \`cleanup\`, \`permissions\`
  • Prefs: \`set timezone|language|style\` (autocomplete, **UTC**)
  • Canales: \`channel timer|warning|patchnote\`
  • Timers: \`message\` (post/refresh), \`reset\` (delete)
  • Rangos: \`rank post\`, \`rank drogon|peddler|daily|weekly|beast|limiteddeal\`
  • Varios: \`status\`, \`uptime\`, \`summon\`, \`patchnote\`

🔗 https://got-kingsroad.com/`
    },

    'pt-br': {
      title: `GOT KINGSROAD DISCORD BOT — ${version} (${dateISO}) | PATCHNOTE`,
      body:
`**NOVO**
• 🧩 **Estrutura modular**: services/commands/utils/events — manutenção facilitada.
• 🌐 **i18n completo**: FR / EN / ES / PT-BR em *todas* as respostas (incl. \`/about\`).
• 👤 **/about privado**: resposta efêmera quando apropriado.
• 🐺 **Timer Beast** (Toronto/EST): **03:00, 07:00, 11:00, 15:00, 19:00, 23:00** (mostrado no fuso do servidor).
• 🛍️ **Oferta limitada**: **05:00, 11:00, 17:00, 23:00** (mostrada no fuso do servidor).
• 🔔 **Lembretes por DM**: \`add | list | remove | clear | clearall\` por timer (Drogon/Peddler/Daily/Weekly/Beast/Oferta Limitada).
• 🧭 **/summon**: avisa manualmente uma alerta (com cargo e texto localizado).
• 🗂️ **Exportar/Importar config** (JSON) e **checagem de permissões**.
• 🕒 **Autocomplete de fuso** (IANA) incluindo **UTC (Global)**.
• 🗺️ **/searchmarker** com **autocomplete** oficial + **screenshot** ao vivo.
• 📝 **Patchnote** com atualização automática ao iniciar; comando \`/gotkingsroad patchnote\`.

**MELHORIAS**
• ⏱️ **Mensagem de timers** (compact/embed) com **Drogon, Peddler, Daily, Weekly, Beast, Oferta Limitada** e contagem regressiva.
• 📡 Avisos “**5 min antes**” para todos os timers (uma vez por ocorrência, inclui Oferta Limitada).
• 🧩 **Auto-setup** cria categorias/canais/cargos e publica o seletor de ranks.
• 🔁 **/reload** regenera patchnote & timer se faltarem.
• 🧹 **/cleanup** mantém a mensagem de ranks mais recente, apaga duplicatas e salva o ID.
• 🔐 Verificações claras de **permissões** por canal.
• 💾 **Restauração do ID** do ranks no boot para manter reações.

**CORREÇÕES**
• Atualização de timers mais estável + melhor tratamento de erros.
• DMs fechados: mensagens claras e limpeza automática de lembretes.
• Limpeza de DB no boot se canais/mensagens sumiram.
• Ajuda/erros unificados e localizados.

**PROBLEMAS CONHECIDOS**
• Com limites do Discord, alguns avisos “5 min antes” podem falhar.
• Se o cargo do bot ficar **abaixo** dos cargos de alerta, a atribuição por reação falha.

**ATALHOS**
• **Usuário**: \`/gotkingsroad timers\`, \`searchmarker\`, \`reminder add|list|remove|clear|clearall\`, \`about\`, \`help\`
• **Admin**:
  • Setup: \`setup\`, \`reload\`, \`cleanup\`, \`permissions\`
  • Preferências: \`set timezone|language|style\` (autocomplete, **UTC**)
  • Canais: \`channel timer|warning|patchnote\`
  • Timers: \`message\` (post/refresh), \`reset\` (delete)
  • Ranks: \`rank post\`, \`rank drogon|peddler|daily|weekly|beast|limiteddeal\`
  • Vários: \`status\`, \`uptime\`, \`summon\`, \`patchnote\`

🔗 https://got-kingsroad.com/`
    }
  };

  const pack = blocks[L];

  return new EmbedBuilder()
    .setTitle(`📢 ${pack.title}`)
    .setDescription(pack.body) // keep under 4096 chars
    .setColor(0x5865F2)
    .setFooter({ text: `Language: ${L.toUpperCase()} • This is an embed to bypass the 2000-char content limit` });
}

function getLatestPatchnotePayload(settings = {}) {
  const embed = getLatestPatchnoteEmbed(settings);
  return { content: null, embeds: [embed] };
}

module.exports = { getLatestPatchnoteEmbed, getLatestPatchnotePayload };
