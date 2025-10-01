<?php
session_start();
if (!empty($_COOKIE['got_user'])) {
  $cookieData = json_decode($_COOKIE['got_user'], true);
  if (isset($cookieData['id']) && isset($cookieData['name'])) {
    $_SESSION['user'] = $cookieData;
  }
}

$isLoggedIn = isset($_SESSION['user']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Title -->
  <title>Setup Discord Bot | GOT Kingsroad - Game of Thrones Utility</title>

  <!-- Meta SEO -->
  <meta name="description" content="Configure your Discord bot for GOT Kingsroad. Easy setup panel to link players, track events and manage your guild on the interactive Westeros map." />
  <meta name="keywords" content="GOT Kingsroad, Game of Thrones bot, Discord setup, Kingsroad setup panel, map tracker, game tools" />
  <meta name="author" content="GOT Kingsroad Team" />

  <!-- Open Graph (for social sharing) -->
  <meta property="og:title" content="Setup Discord Bot | GOT Kingsroad" />
  <meta property="og:description" content="Easily configure your GOT Kingsroad bot for Discord. Link players, manage events and track in-game progress." />
  <meta property="og:image" content="https://got-kingsroad.com/media/banner-setup.jpg" />
  <meta property="og:url" content="https://got-kingsroad.com/setupbot" />
  <meta property="og:type" content="website" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Setup Discord Bot | GOT Kingsroad" />
  <meta name="twitter:description" content="Use our setup panel to link your Discord bot to GOT Kingsroad. Enhance your guild’s gameplay!" />
  <meta name="twitter:image" content="https://got-kingsroad.com/media/bannieres.webp" />

  <!-- Stylesheets -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/setupbot-style.css">
      <script type="text/javascript" src="assets/js/text.js"></script>

  <!-- Favicon -->
    <link rel="icon" href="https://got-kingsroad.com/media/icones/favicon.ico" />
	  <?php include($_SERVER['DOCUMENT_ROOT'] . '/header.php'); ?>

</head>

<body>

<div class="guides-container">
  <div class="guides-sidebar">
    <div class="sidebar-header">
      <h2><i class="fab fa-discord"></i> <span data-key="botconfig-title">Bot Configuration</span></h2>
    </div>

    <div class="sidebar-categories">
      <div class="category">
        <h3 class="category-title" data-key="panel-section-title">Panel Sections</h3>
        <ul>
          <li><a href="#guide" class="active" data-guide="panel-guide"><i class="fas fa-book"></i> <span data-key="panel-full-tutorial">Full Tutorial</span></a></li>
          <li><a href="#webpanel" data-guide="panel-setup"><i class="fas fa-cogs"></i> <span data-key="panel-web">Web Panel</span></a></li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Full Tutorial Panel -->
  <div id="guide" class="guide-article" style="display: block;">
    <div class="content-header">
      <h1 data-key="setup-title">How to Use the Setup Panel</h1>
    </div>

    <div class="guide-section">
      <h3><i class="fas fa-cogs"></i> <span data-key="setup-admin-title">Admin Setup Commands</span></h3>
      <p data-key="setup-admin-desc">These commands require Administrator permissions:</p>
      <ul>
	    <li><code>/gotkingsroad helpadmin</code> – <span data-key="cmd-helpadmin">Show all admin-only commands.</span></li>
        <li><code>/gotkingsroad channel timer</code> – <span data-key="cmd-channel-timer">Set the channel where the bot posts global timer messages.</span></li>
        <li><code>/gotkingsroad channel warning</code> – <span data-key="cmd-channel-warning">Set the channel for Drogon warning messages.</span></li>
		<li><code>/gotkingsroad channel patchnote</code> – <span data-key="cmd-channel-patchnote">Set the channel where the bot posts patchnote messages.</span></li>
        <li><code>/gotkingsroad message</code> – <span data-key="cmd-message">Send or refresh the main timer message (Daily, Drogon, Weekly, Peddler).</span></li>
        <li><code>/gotkingsroad reset</code> – <span data-key="cmd-reset">Delete the active timer message.</span></li>
        <li><code>/gotkingsroad ranks</code> – <span data-key="cmd-ranks">Send a message with reaction buttons to let users choose their alert roles (Drogon, Peddler, Daily, Weekly).</span></li>
		<li><code>/gotkingsroad rankdaily @role</code> – <span data-key="cmd-rankdaily">Set the role to ping before the Daily Reset (07:00 UTC).</span></li>
        <li><code>/gotkingsroad rankdrogon @role</code> – <span data-key="cmd-rankdrogon">Set the role to ping 5 minutes before Drogon spawns.</span></li>
        <li><code>/gotkingsroad rankweekly @role</code> – <span data-key="cmd-rankweekly">Set the role to ping before the Weekly Reset (Thursday 05:00 UTC).</span></li>
        <li><code>/gotkingsroad rankpeddler @role</code> – <span data-key="cmd-rankpeddler">Set the role to ping before the Peddler Timer.</span></li>
        <li><code>/gotkingsroad summon</code> – <span data-key="cmd-summon">Manually summon Drogon with role ping and animation.</span></li>
		<li><code>/gotkingsroad patchnote</code> – <span data-key="cmd-patchnote">Send the latest patchnote and keep it updated automatically.</span></li>

      </ul>
    </div>

    <div class="guide-section">
      <h3><i class="fas fa-user"></i> <span data-key="setup-user-title">General User Commands</span></h3>
      <ul>
        <li><code>/gotkingsroad help</code> – <span data-key="cmd-help">Show this help message with public commands.</span></li>
        <li><code>/gotkingsroad ping</code> – <span data-key="cmd-ping">Check bot latency and confirm it's online.</span></li>
      </ul>
    </div>

    <div class="guide-section">
      <h3><i class="fas fa-bell"></i> <span data-key="setup-reminder-title">Reminders</span></h3>
      <p data-key="setup-reminder-desc">Receive private DMs shortly before a timer triggers:</p>
      <ul>
        <li><code>/gotkingsroad reminder add</code> – <span data-key="cmd-reminder-add">Set a reminder for Drogon, Daily Reset, Weekly Reset or Peddler.</span></li>
        <li><code>/gotkingsroad reminder list</code> – <span data-key="cmd-reminder-list">View your current active reminders.</span></li>
        <li><code>/gotkingsroad reminder clear</code> – <span data-key="cmd-reminder-clear">Clear all your personal reminders.</span></li>
      </ul>
    </div>

    <div class="guide-section">
      <h3><i class="fas fa-map-marker-alt"></i> <span data-key="setup-marker-title">Search Marker</span></h3>
      <ul>
        <li><code>/gotkingsroad searchmarker</code> – <span data-key="cmd-searchmarker">Search for a marker by name and get a screenshot of its location on the game map.</span></li>
      </ul>
      <p data-key="cmd-searchmarker-desc">
        Start typing a marker name — an autocomplete list will suggest existing markers from the official map.<br>
        Once selected, the bot will return a preview image (if available).
      </p>
    </div>

    <div class="guide-section text-center">
      <a href="https://discord.com/oauth2/authorize?client_id=1359206763785752807&permissions=8&integration_type=0&scope=bot"
         class="btn btn-outline-primary mt-3" target="_blank" data-key="add-bot-button">
        ➕ Add Bot to New Server
      </a>
    </div>
  </div>


  
    <!-- Panel Web Setup -->
	
 <div id="webpanel" class="guide-article" style="display: none;">
  <div class="content-header">
    <h1 data-key="webpanel-offf">Bot Setup<</h1>
  </div>


<!-- Discord Guild Selection -->
<div class="guide-section" id="guild-selection-section">
  <h3><i class="fas fa-server"></i> <span data-key="webpanel-guild-title">Select Discord Server</span></h3>
  <p class="text-muted" data-key="webpanel-guild-desc">Choose a server where the bot is installed and you have admin permissions.</p>

  <div class="mb-3 d-flex align-items-center">
    <label for="guildSelect" class="me-2 mb-0" data-key="label-select-guild">Select Server:</label>
    <select id="guildSelect" class="form-select" style="flex: 1;"></select>
    <button id="refreshGuildsBtn" class="btn btn-sm btn-outline-info ms-2" title="Reload guilds">
      <i class="fas fa-sync-alt"></i>
    </button>
  </div>
</div>

<!-- Bot Tutorial Section -->
<div class="guide-section" id="bot-tutorial-section">
  <h3><i class="fas fa-robot"></i> <span data-key="webpanel-bottutorial-title">Send Bot Tutorials</span></h3>
  <div class="mb-3 d-flex align-items-center">
    <label for="botTutorialChannel" class="me-2 mb-0" data-key="label-select-channel">Select Channel:</label>
    <select class="form-select me-2" id="botTutorialChannel" style="flex: 1;"></select>
    <button id="sendBotTutorialBtn" class="btn btn-sm btn-outline-info" title="Send bot tutorial message">
  <i class="fas fa-paper-plane"></i> <span data-key="btn-send-message">Send Message</span>
</button>

  </div>
</div>


  <!-- Search Marker Tutorial Section -->
  <div class="guide-section" id="tutorial-message-section">
    <h3><i class="fas fa-comment"></i> <span data-key="webpanel-searchmarker-title">Send SearchMarker Tutorial</span></h3>
    <div class="mb-3 d-flex align-items-center">
      <label for="tutorialChannel" class="me-2 mb-0" data-key="label-select-channel">Select Channel:</label>
      <select class="form-select me-2" id="tutorialChannel" style="flex: 1;"></select>
      <button id="sendTutorialMessageBtn" class="btn btn-sm btn-outline-info" title="Send tutorial message">
        <i class="fas fa-paper-plane"></i> <span data-key="btn-send-message">Send Message</span>
      </button>
    </div>
  </div>
  


  <!-- Reminder Help Section -->
  <div class="guide-section" id="reminder-help-section">
    <h3><i class="fas fa-bell"></i> <span data-key="webpanel-reminder-title">Send Reminder Help</span></h3>
    <div class="mb-3 d-flex align-items-center">
      <label for="reminderChannel" class="me-2 mb-0" data-key="label-select-channel">Select Channel:</label>
      <select class="form-select me-2" id="reminderChannel" style="flex: 1;"></select>
      <button id="sendReminderMessageBtn" class="btn btn-sm btn-outline-info" title="Send reminder help message">
        <i class="fas fa-paper-plane"></i> <span data-key="btn-send-message">Send Message</span>
      </button>
    </div>
  </div>
  
<!-- Global Timer Message Section -->
<div class="guide-section" id="global-timer-message-section">
  <h3><i class="fas fa-clock"></i> <span data-key="webpanel-global-timer-title">Send Global Timer Message</span></h3>
  <div class="mb-3 d-flex align-items-center gap-3">

    <div style="flex: 1;">
      <input type="text" id="channel-global-timer" class="form-control" readonly />
    </div>

    <button id="sendGlobalTimerMessageBtn" class="btn btn-sm btn-outline-info" title="Send global timer message">
      <i class="fas fa-paper-plane"></i> <span data-key="btn-send-message">Send Message</span>
    </button>
  </div>
</div>


  
  <!-- Custom Message Section -->
  <div class="guide-section" id="custom-message-section">
    <h3><i class="fas fa-comment"></i> <span data-key="webpanel-custom-title">Custom Message</span></h3>
    <div class="mb-3 d-flex align-items-center">
      <label for="customChannel" class="me-2 mb-0" data-key="label-select-channel">Select Channel:</label>
      <select class="form-select me-2" id="customChannel" style="flex: 1;"></select>
      <button id="refreshChannels" class="btn btn-sm btn-outline-info" title="Reload channels">
        <i class="fas fa-sync-alt" id="refresh-status"></i>
      </button>
    </div>
    <div class="mb-3">
      <label for="customMessage" data-key="label-custom-message">Message to Send:</label>
      <textarea class="form-control" id="customMessage" rows="4" placeholder="Type your message here..." data-key="placeholder-custom-message"></textarea>
    </div>
    <button id="sendMessageBtn" class="btn btn-primary">
      <i class="fas fa-paper-plane"></i> <span data-key="btn-send-message">Send Message</span>
    </button>
  </div>

<div class="guide-section">
  <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
    <h3><i class="fas fa-bell"></i> <span data-key="webpanel-reminders-title">Reminders</span></h3>
    <button id="reloadRolesBtn" class="btn btn-primary" data-key="btn-reload-roles">🔄 Reload Roles</button>
  </div>

  <!-- Sélecteurs de rôles -->
  <label for="role-drogon" data-key="label-role-drogon">Select Role for Drogon Timer:</label>
  <select id="role-drogon" class="form-select mb-3">
    <option value="" data-key="option-select-role">Select Role</option>
  </select>

  <label for="role-daily" data-key="label-role-daily">Select Role for Daily Reset:</label>
  <select id="role-daily" class="form-select mb-3">
    <option value="" data-key="option-select-role">Select Role</option>
  </select>

  <label for="role-weekly" data-key="label-role-weekly">Select Role for Weekly Reset:</label>
  <select id="role-weekly" class="form-select mb-3">
    <option value="" data-key="option-select-role">Select Role</option>
  </select>

  <label for="role-peddler" data-key="label-role-peddler">Select Role for Peddler Reset:</label>
  <select id="role-peddler" class="form-select mb-3">
    <option value="" data-key="option-select-role">Select Role</option>
  </select>

  <!-- Sélecteurs de canaux -->
  <h3 class="mt-4"><i class="fas fa-comment-alt"></i> <span data-key="webpanel-channels-title">Channels</span></h3>

  <label for="channel-timer" data-key="label-channel-timer">Select Channel for Timer Messages:</label>
  <select id="channel-timer" class="form-select mb-3">
    <option value="" data-key="option-select-channel">Select Channel</option>
  </select>

  <label for="channel-warning" data-key="label-channel-warning">Select Channel for Warning Messages:</label>
  <select id="channel-warning" class="form-select mb-3">
    <option value="" data-key="option-select-channel">Select Channel</option>
  </select>

  <!-- Bouton pour enregistrer -->
  <button id="save-reminders" class="btn btn-success mt-3">
    <i class="fas fa-save"></i> <span data-key="btn-save-config">Save Configuration</span>
  </button>
</div>

<!--

  <div class="guide-section">
    <h3><i class="fas fa-bell"></i> <span data-key="webpanel-commands-title">Bot Commands</span></h3>
    <button id="send-setup-message" class="btn btn-primary mb-2" data-key="btn-send-timer-message">📩 Send Timer Message</button>
    <button onclick="sendBotCommand('setup_reset')" class="btn btn-warning mb-2" data-key="btn-reset-timer">🧹 Reset Timer Message</button>
    <button onclick="sendBotCommand('ping')" class="btn btn-info mb-2" data-key="btn-ping">🏓 Ping</button>
    <button id="ping-bot" class="btn btn-outline-info mb-2" data-key="btn-status">🔌 Check Bot Status</button>
    <div id="ping-result" class="alert mt-2" style="display:none;"></div>
  </div>

  <button id="save-setup" class="btn btn-success mt-3">
    <i class="fas fa-save"></i> <span data-key="btn-save-config">Save Configuration</span>
  </button> -->
</div>
</div>

<?php include($_SERVER['DOCUMENT_ROOT'] . '/footer.php'); ?>



<script>
document.addEventListener("DOMContentLoaded", function() {
    // Fonction pour afficher le panel correspondant à l'ancre dans l'URL
    function displayPanel() {
        // Masquer tous les panels
        document.querySelectorAll('.guide-article').forEach(div => div.style.display = 'none');

        // Récupérer l'ancre dans l'URL (ex : '#tutorial' ou '#webpanel')
        const currentPanel = window.location.hash.slice(1);  // On enlève le '#' de l'ancre

        // Si l'URL n'a pas d'ancre, afficher le panel par défaut
        if (!currentPanel) {
            window.location.hash = 'guide';  // Mettre l'ancre par défaut
        }

        // Afficher le panel correspondant
        const targetPanel = document.getElementById(currentPanel);
        if (targetPanel) {
            targetPanel.style.display = 'block';  // Afficher le panel sélectionné
        }
    }

    // Ajouter un écouteur d'événement pour gérer le changement d'URL
    window.addEventListener('hashchange', displayPanel);

    // Initialiser l'affichage du bon panel au chargement de la page
    displayPanel();

    // Gérer les clics sur les liens dans la sidebar pour modifier l'URL
    document.querySelectorAll('.sidebar-categories a').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();  // Empêcher l'action par défaut (le rechargement de la page)

            // Masquer tous les panels
            document.querySelectorAll('.guide-article').forEach(div => div.style.display = 'none');

            // Récupérer l'ancre du lien (par exemple, #tutorial)
            const target = e.target.closest('a').getAttribute('href').slice(1);  // Récupérer l'ancre du lien

            // Mettre à jour l'URL avec l'ancre correspondante
            window.location.hash = target;

            // Afficher le panel correspondant
            const targetPanel = document.getElementById(target);
            if (targetPanel) {
                targetPanel.style.display = 'block';  // Afficher le panel sélectionné
            }

            // Mettre à jour la classe active sur le lien sélectionné
            document.querySelectorAll('.sidebar-categories a').forEach(a => a.classList.remove('active'));
            e.target.closest('a').classList.add('active');
        });
    });
});

</script>




<script>
async function loadAvailableGuilds() {
  const select = document.getElementById('guildSelect');
  if (!select) return;

  select.innerHTML = '<option disabled selected>Loading...</option>';

  try {
    const res = await fetch('/api/discord/user-guilds.php');
    if (!res.ok) throw new Error("Not logged in or error fetching guilds");

    const guilds = await res.json();

    select.innerHTML = '';
    if (guilds.length === 0) {
      select.innerHTML = '<option disabled selected>No server found with the bot</option>';
      return;
    }

    guilds.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g.id;
      opt.textContent = g.name;
      select.appendChild(opt);
    });

    select.value = guilds[0].id;
    loadGuildInfo(guilds[0].id);

    select.addEventListener('change', () => {
      const guildId = select.value;
      if (guildId) loadGuildInfo(guildId);
    });

  } catch (err) {
    console.error(err);
    select.innerHTML = '<option disabled selected>Error loading guilds</option>';
  }
}

async function loadGuildInfo(guildId) {
  try {
    const res = await fetch('/api/discord/guild-info.php?id=' + guildId);
    const { roles, channels, config } = await res.json();

    // 🔁 Remplir tous les sélecteurs de rôles avec pré-sélection
    const roleFields = ['role-drogon', 'role-daily', 'role-weekly', 'role-peddler'];
    roleFields.forEach(id => {
      const select = document.getElementById(id);
      if (!select) return;
      select.innerHTML = '<option value="">Select Role</option>';
      roles.forEach(role => {
        const opt = document.createElement('option');
        opt.value = role.id;
        opt.textContent = role.name;
        if (
          (id === 'role-drogon' && config.drogonRoleId === role.id) ||
          (id === 'role-daily' && config.dailyRoleId === role.id) ||
          (id === 'role-weekly' && config.weeklyRoleId === role.id) ||
          (id === 'role-peddler' && config.peddlerRoleId === role.id)
        ) {
          opt.selected = true;
        }
        select.appendChild(opt);
      });
    });

    // 🔁 Remplir tous les sélecteurs de canaux texte avec pré-sélection
    const channelFields = ['tutorialChannel', 'reminderChannel', 'customChannel', 'channel-warning', 'channel-timer', 'botTutorialChannel', 'reminderChannel'];
    channelFields.forEach(id => {
      const select = document.getElementById(id);
      if (!select) return;
      select.innerHTML = '<option value="">Select Channel</option>'; // reset options
      channels
        .filter(c => c.type === 0)
        .forEach(channel => {
          const opt = document.createElement('option');
          opt.value = channel.id;
          opt.textContent = `#${channel.name}`;

          if (
            (id === 'channel-timer' && config.globalTimerChannelId === channel.id) ||
            (id === 'channel-warning' && config.drogonWarningChannelId === channel.id)
          ) {
            opt.selected = true;
          }

          select.appendChild(opt);
        });
    });

    // Met à jour l'input readonly #channel-global-timer pour refléter la sélection dans #channel-timer
    const channelTimerSelect = document.getElementById('channel-timer');
    const channelGlobalTimerInput = document.getElementById('channel-global-timer');
    if (channelTimerSelect && channelGlobalTimerInput) {
      const updateGlobalTimerInput = () => {
        const selectedOption = channelTimerSelect.selectedOptions[0];
        channelGlobalTimerInput.value = selectedOption ? selectedOption.textContent : '';
      };

      updateGlobalTimerInput(); // initial

      channelTimerSelect.addEventListener('change', updateGlobalTimerInput);
    }

  } catch (err) {
    console.error('Error loading guild info:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadAvailableGuilds();

  // 🔄 Bouton : Reload les guildes
  const refreshGuildsBtn = document.getElementById('refreshGuildsBtn');
  if (refreshGuildsBtn) {
    refreshGuildsBtn.addEventListener('click', loadAvailableGuilds);
  }

  // 🔄 Bouton : Reload les channels uniquement
  const refreshChannelsBtn = document.getElementById('refreshChannels');
  if (refreshChannelsBtn) {
    refreshChannelsBtn.addEventListener('click', () => {
      const guildSelect = document.getElementById('guildSelect');
      const icon = document.getElementById('refresh-status');
      if (!guildSelect || !guildSelect.value) return;

      if (icon) icon.classList.add('fa-spin');
      loadGuildInfo(guildSelect.value).then(() => {
        if (icon) icon.classList.remove('fa-spin');
      });
    });
  }

  // 🔄 Bouton : Reload les rôles uniquement
  const reloadRolesBtn = document.getElementById('reloadRolesBtn');
  if (reloadRolesBtn) {
    reloadRolesBtn.addEventListener('click', () => {
      const guildSelect = document.getElementById('guildSelect');
      if (guildSelect && guildSelect.value) {
        loadGuildInfo(guildSelect.value);
      }
    });
  }
});

</script>

<script>
document.getElementById("sendMessageBtn").addEventListener("click", async () => {
  const channelId = document.getElementById("customChannel").value;
  const message = document.getElementById("customMessage").value.trim();

  if (!channelId || !message) {
    alert("❌ Please select a channel and enter a message.");
    return;
  }

  try {
    const res = await fetch("/api/discord/send-message.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId, message })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert("✅ Custom message sent!");
      document.getElementById("customMessage").value = ""; // Optionnel: reset textarea
    } else {
      alert(`❌ Failed to send message: ${data.error || "Unknown error"}`);
    }
  } catch (err) {
    console.error("Send error:", err);
    alert(`❌ Error sending message: ${err.message}`);
  }
});

document.getElementById("sendBotTutorialBtn").addEventListener("click", async () => {
  const channelId = document.getElementById("botTutorialChannel").value;
  if (!channelId) {
    alert("Please select a channel first.");
    return;
  }

  const message = `**__GOT-Kingsroad  Interactive MAP Bot – Command Overview (BETA)__**
*Your personal assistant for timers, reminders, and map navigation in Game of Thrones: Kingsroad.*

---

__**Admin Commands**__

**Configuration & Timers**
\`/gotkingsroad channel timer\` – Set channel for global timer messages
\`/gotkingsroad message\` – Send or refresh the main timer message 
\`/gotkingsroad patchnote\` – Send or refresh the patchnote message  
\`/gotkingsroad reset\` – Delete the current timer message

**Role Pings**
\`/gotkingsroad rankdaily @role\` – Ping before Daily Reset (07:00 UTC)  
\`/gotkingsroad rankdrogon @role\` – Ping 5 minutes before Drogon  
\`/gotkingsroad rankweekly @role\` – Ping before Weekly Reset (Thursday 05:00 UTC)  
\`/gotkingsroad rankpeddler @role\` – Ping before Peddler

**Channel Warnings**
\`/gotkingsroad channel warning\` – Set channel for timer warnings  
\`/gotkingsroad channel patchnote\` – Set channel for bot patchnote messages

**Manual Actions**
\`/gotkingsroad summon\` – Manually summon Drogon with ping and animation

---

__**Map Tools**__  
\`/gotkingsroad searchmarker\` – Show a screenshot centered on a specific map marker  
*Example: \`Lost Letter 16 – Oldtown Area\`*

---

__**Reminders (DM Only)**__  
\`/gotkingsroad reminder add\` – Set a personal reminder for Drogon, Daily, Peddler or Weekly  
\`/gotkingsroad reminder list\` – View your active reminders  
\`/gotkingsroad reminder clear\` – Clear all your reminders

---

__**Utility**__  
\`/gotkingsroad ping\` – Check bot response time  
\`/gotkingsroad help\` – List public commands  
\`/gotkingsroad helpadmin\` – List admin-only commands

---

*CURRENTLY IN BETA – PM me if you want to test it!*  
https://got-kingsroad.com/
---`;

  try {
    const res = await fetch('/api/discord/send-message.php', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId, message })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert("✅ Bot tutorial message sent!");
    } else {
      alert(`❌ Failed to send bot tutorial: ${data.error || "Unknown error"}`);
    }

  } catch (err) {
    console.error("Send error:", err);
    alert(`❌ Error sending bot tutorial: ${err.message}`);
  }
});


document.getElementById("sendTutorialMessageBtn").addEventListener("click", async () => {
  const channelId = document.getElementById("tutorialChannel").value;
  if (!channelId) {
    alert("Please select a channel first.");
    return;
  }

  const message = `🔍 **Search any marker location on the map!**

• \`/gotkingsroad searchmarker <name>\` – Instantly locate any marker on the map.  
• The bot will generate a screenshot centered on the marker.  
• Try with examples like: \`Drogon\`, \`Castle Black\`, or \`Iron Bank\`.

Make sure the bot has access to the selected channel!`;

  try {
    const res = await fetch('/api/discord/send-message.php', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId, message })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert("✅ SearchMarker tutorial message sent!");
    } else {
      alert(`❌ Failed to send tutorial: ${data.error || "Unknown error"}`);
    }

  } catch (err) {
    console.error("Send error:", err);
    alert(`❌ Error sending message: ${err.message}`);
  }
});


document.getElementById('sendReminderMessageBtn').addEventListener('click', async () => {
  const channelId = document.getElementById('reminderChannel').value;
  if (!channelId) return alert("❗ Please select a channel.");

const message = `🧭 **Here’s how to configure your reminder timers!**

• \`/gotkingsroad reminder add\` – Add a custom reminder  
• \`/gotkingsroad reminder list\` – List your active reminders  
• \`/gotkingsroad reminder clear\` – Delete all your reminders`;

  try {
    const res = await fetch('/api/discord/send-message.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId, message })
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Reminder message sent!");
    } else {
      console.error(data);
      alert("❌ Failed to send message.");
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Network error.");
  }
});

document.getElementById('save-reminders').addEventListener('click', async () => {
  const guildId = document.getElementById('guildSelect')?.value;
  const drogon = document.getElementById('role-drogon')?.value || null;
  const daily = document.getElementById('role-daily')?.value || null;
  const weekly = document.getElementById('role-weekly')?.value || null;
  const peddler = document.getElementById('role-peddler')?.value || null;

  // Channels à sauvegarder
  const timerChannel = document.getElementById('channel-timer')?.value || null;
  const warningChannel = document.getElementById('channel-warning')?.value || null;
  const botTutorialChannel = document.getElementById('botTutorialChannel')?.value || null;

  if (!guildId) {
    alert("Please select a guild.");
    return;
  }

  const payload = { 
    guildId, drogon, daily, weekly, peddler, 
    timerChannel, warningChannel 
  };

  try {
    const res = await fetch('/api/discord/save-roles.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.success) {
      alert("✅ Configuration saved!");
    } else {
      alert("❌ Error: " + (result.error || 'Unknown'));
    }

  } catch (e) {
    console.error(e);
    alert("❌ Failed to save configuration.");
  }
});
document.getElementById('sendGlobalTimerMessageBtn').addEventListener('click', async () => {
  const guildId = document.getElementById('guildSelect').value; // Guild ID du serveur sélectionné
  const command = '/gotkingsroad message'; // La commande à exécuter (par exemple, /gotkingsroad message)
  const channelId = document.getElementById('channel-timer').value; // Channel ID du channel sélectionné

  // Vérification que le guildId et le channelId sont bien sélectionnés
  if (!guildId || !channelId) {
    alert("Please select a guild and a channel.");
    return;
  }

  // Préparer les données à envoyer
  const payload = {
    guildId,
    command,
    channelId
  };

  // Afficher le contenu du payload dans la console pour déboguer
  console.log('Sending the following payload:', payload);

  try {
    const res = await fetch('/api/discord/execute-command.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.success) {
      alert("✅ Command executed successfully!");
    } else {
      alert("❌ Error: " + (result.error || 'Unknown error'));
    }

  } catch (e) {
    console.error(e);
    alert("❌ Failed to execute command.");
  }
});




</script>


  
 

</body>
</html>
