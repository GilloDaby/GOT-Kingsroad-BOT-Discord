<?php
session_start();
if (!empty($_COOKIE['got_user'])) {
  $cookieData = json_decode($_COOKIE['got_user'], true);
  if (isset($cookieData['id']) && isset($cookieData['name'])) {
    $_SESSION['user'] = $cookieData;
  }
}

$isLoggedIn = isset($_SESSION['user']);
$userName = $isLoggedIn ? htmlspecialchars($_SESSION['user']['name'], ENT_QUOTES, 'UTF-8') : null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Setup Discord Bot | GOT Kingsroad - Game of Thrones Utility</title>
  <meta name="description" content="Configure your Discord bot for GOT Kingsroad. Easy setup panel to link players, track events and manage your guild on the interactive Westeros map." />
  <meta name="keywords" content="GOT Kingsroad, Game of Thrones bot, Discord setup, Kingsroad setup panel, map tracker, game tools" />
  <meta name="author" content="GOT Kingsroad Team" />

  <meta property="og:title" content="Setup Discord Bot | GOT Kingsroad" />
  <meta property="og:description" content="Easily configure your GOT Kingsroad bot for Discord. Link players, manage events and track in-game progress." />
  <meta property="og:image" content="https://got-kingsroad.com/media/banner-setup.jpg" />
  <meta property="og:url" content="https://got-kingsroad.com/setupbot" />
  <meta property="og:type" content="website" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Setup Discord Bot | GOT Kingsroad" />
  <meta name="twitter:description" content="Use our setup panel to link your Discord bot to GOT Kingsroad. Enhance your guild’s gameplay!" />
  <meta name="twitter:image" content="https://got-kingsroad.com/media/bannieres.webp" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-HoL0zY6vTvxJLj0CuxnxOQk4LLx7sMMEZe2qVD/3GQXffNk31DJ7tY+DbDeihdj5Z8SGvtQvVCOH14V/2QR8mg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="icon" href="https://got-kingsroad.com/media/icones/favicon.ico" />

  <?php include($_SERVER['DOCUMENT_ROOT'] . '/header.php'); ?>

  <style>
    body.setup-page {
      font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(180deg, #0b0d13 0%, #161616 45%, #0b0d13 100%);
      color: #f3f4f6;
      min-height: 100vh;
    }

    .bot-setup-main {
      position: relative;
      max-width: 1200px;
      margin: 0 auto;
      padding: 140px 24px 120px;
    }

    .bot-setup-main::before {
      content: '';
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at 18% 20%, rgba(250, 204, 21, 0.08), transparent 48%),
        radial-gradient(circle at 82% 8%, rgba(253, 186, 116, 0.08), transparent 42%),
        radial-gradient(circle at 78% 78%, rgba(34, 197, 94, 0.06), transparent 55%);
      z-index: -2;
    }

    .bot-setup-main::after {
      content: '';
      position: fixed;
      inset: 0;
      background: linear-gradient(160deg, rgba(26, 26, 26, 0.9) 0%, rgba(15, 15, 15, 0.92) 45%, rgba(9, 9, 9, 0.94) 100%);
      z-index: -3;
    }

    .hero-card {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 32px;
      padding: 36px;
      background: linear-gradient(135deg, rgba(26, 26, 26, 0.92), rgba(55, 65, 81, 0.55));
      border-radius: 28px;
      border: 1px solid rgba(148, 163, 184, 0.14);
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(16px);
    }

    .hero-card h1 {
      font-size: clamp(2.1rem, 4vw, 2.8rem);
      font-weight: 700;
      margin-bottom: 12px;
      color: #f9fafb;
    }

    .hero-card p {
      color: rgba(226, 232, 240, 0.82);
      font-size: 1.05rem;
      line-height: 1.6;
    }

    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 999px;
      background: rgba(250, 204, 21, 0.12);
      color: #facc15;
      font-weight: 600;
      font-size: 0.95rem;
      width: fit-content;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      margin-top: 12px;
    }

    .hero-actions .btn-primary,
    .hero-actions .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 22px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #facc15, #f97316);
      color: #111827;
      box-shadow: 0 12px 30px rgba(250, 204, 21, 0.35);
      border: none;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 16px 36px rgba(249, 115, 22, 0.4);
      color: #0b0d13;
    }

    .btn-secondary {
      background: rgba(148, 163, 184, 0.12);
      color: #f8fafc;
      border: 1px solid rgba(148, 163, 184, 0.28);
    }

    .btn-secondary:hover {
      background: rgba(148, 163, 184, 0.22);
      transform: translateY(-2px);
    }

    .hero-highlights {
      display: grid;
      gap: 16px;
      padding: 20px;
      border-radius: 20px;
      background: rgba(15, 23, 42, 0.55);
      border: 1px solid rgba(148, 163, 184, 0.15);
    }

    .highlight {
      display: flex;
      gap: 14px;
      align-items: center;
      font-size: 0.95rem;
      color: rgba(226, 232, 240, 0.85);
    }

    .highlight i {
      color: #facc15;
      font-size: 1.15rem;
    }

    .page-layout {
      margin-top: 48px;
      display: grid;
      gap: 28px;
      grid-template-columns: 280px 1fr;
    }

    .section-nav {
      background: rgba(26, 26, 26, 0.76);
      border-radius: 20px;
      border: 1px solid rgba(148, 163, 184, 0.12);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      position: sticky;
      top: 140px;
      height: fit-content;
    }

    .section-nav h2 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #f1f5f9;
      margin-bottom: 4px;
    }

    .section-nav p {
      font-size: 0.9rem;
      color: rgba(226, 232, 240, 0.65);
      margin-bottom: 12px;
    }
    .tab-button {
      appearance: none;
      border: none;
      background: rgba(148, 163, 184, 0.08);
      color: rgba(226, 232, 240, 0.85);
      padding: 12px 16px;
      border-radius: 12px;
      font-weight: 600;
      text-align: left;
      cursor: pointer;
      transition: background 0.2s ease, transform 0.2s ease;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .tab-button i {
      color: #facc15;
      width: 20px;
    }

    .tab-button.is-active {
      background: linear-gradient(135deg, rgba(250, 204, 21, 0.25), rgba(249, 115, 22, 0.25));
      color: #111827;
      box-shadow: 0 12px 30px rgba(250, 204, 21, 0.2);
    }

    .tab-button:hover {
      transform: translateX(4px);
      background: rgba(148, 163, 184, 0.16);
    }

    .tab-panels {
      display: grid;
      gap: 28px;
    }

    .tab-panel {
      display: none;
      animation: fadeIn 0.4s ease;
    }

    .tab-panel.is-visible {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .command-grid {
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    .command-card {
      background: rgba(31, 41, 55, 0.78);
      border-radius: 20px;
      border: 1px solid rgba(148, 163, 184, 0.16);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: inset 0 1px 0 rgba(148, 163, 184, 0.12);
    }

    .command-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 6px;
    }

    .command-card h3 i {
      color: #facc15;
      font-size: 1.2rem;
    }

    .command-card p,
    .command-card li {
      color: rgba(226, 232, 240, 0.78);
      font-size: 0.95rem;
      line-height: 1.55;
    }

    .command-card ul {
      padding-left: 18px;
      margin: 0;
      display: grid;
      gap: 8px;
    }

    .command-card code {
      background: rgba(15, 23, 42, 0.9);
      padding: 2px 6px;
      border-radius: 6px;
      border: 1px solid rgba(148, 163, 184, 0.2);
      color: #facc15;
      font-size: 0.85rem;
    }

    .panel-stack {
      display: grid;
      gap: 24px;
    }

    .panel-card {
      position: relative;
      background: rgba(15, 23, 42, 0.78);
      border-radius: 24px;
      border: 1px solid rgba(148, 163, 184, 0.14);
      padding: 28px;
      box-shadow: 0 20px 50px rgba(2, 6, 23, 0.45);
      overflow: hidden;
    }

    .panel-card h3 {
      font-size: 1.15rem;
      font-weight: 600;
      margin-bottom: 18px;
      color: #f8fafc;
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .panel-card h3 .step-index {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: rgba(37, 99, 235, 0.25);
      color: #bfdbfe;
      font-weight: 700;
      font-size: 0.95rem;
    }

    .panel-card p {
      color: rgba(226, 232, 240, 0.75);
      margin-bottom: 20px;
      font-size: 0.95rem;
    }

    .panel-card .card-body {
      position: relative;
      display: grid;
      gap: 18px;
    }

    .field-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
    }

    .field-row label {
      font-weight: 600;
      font-size: 0.9rem;
      color: rgba(226, 232, 240, 0.75);
      min-width: 140px;
    }

    .field-row select,
    .field-row textarea,
    .field-row input {
      flex: 1;
      min-width: 180px;
    }

    select,
    textarea,
    input[type="text"],
    input[type="number"] {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.22);
      border-radius: 12px;
      padding: 10px 14px;
      color: #e2e8f0;
      font-size: 0.95rem;
      transition: border 0.2s ease, box-shadow 0.2s ease;
    }

    select:focus,
    textarea:focus,
    input[type="text"]:focus,
    input[type="number"]:focus {
      outline: none;
      border-color: rgba(37, 99, 235, 0.55);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
    }

    textarea {
      width: 100%;
      resize: vertical;
      min-height: 120px;
    }

    .action-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .panel-note {
      margin-top: 18px;
      font-size: 0.85rem;
      color: rgba(148, 163, 184, 0.8);
    }

    .subgrid {
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      margin-top: 8px;
    }

    .panel-card.is-locked .card-body {
      filter: blur(1px);
      opacity: 0.45;
      pointer-events: none;
      user-select: none;
    }

    .locked-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: rgba(2, 6, 23, 0.82);
      backdrop-filter: blur(6px);
      gap: 16px;
      text-align: center;
      padding: 32px;
    }

    .locked-overlay h4 {
      font-size: 1.15rem;
      color: #f8fafc;
      font-weight: 600;
    }

    .locked-overlay p {
      color: rgba(226, 232, 240, 0.75);
      margin: 0;
    }

    .locked-overlay button {
      margin-top: 6px;
      padding: 12px 22px;
      border-radius: 12px;
      background: linear-gradient(135deg, #5865f2, #4338ca);
      color: #f8fafc;
      border: none;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      gap: 10px;
      align-items: center;
      box-shadow: 0 12px 30px rgba(88, 101, 242, 0.35);
    }

    .panel-card hr {
      border: 0;
      border-top: 1px solid rgba(148, 163, 184, 0.12);
      margin: 12px 0;
    }

    .inline-note {
      font-size: 0.85rem;
      color: rgba(148, 163, 184, 0.78);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(148, 163, 184, 0.12);
      color: rgba(226, 232, 240, 0.75);
      font-size: 0.75rem;
      font-weight: 600;
    }
    @media (max-width: 1080px) {
      .page-layout {
        grid-template-columns: 1fr;
      }

      .section-nav {
        position: static;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px;
      }

      .section-nav h2,
      .section-nav p {
        flex-basis: 100%;
      }

      .section-nav p {
        margin-bottom: 0;
      }

      .tab-button {
        flex: 1 1 200px;
        justify-content: center;
        text-align: center;
      }
    }

    @media (max-width: 768px) {
      .bot-setup-main {
        padding: 120px 16px 100px;
      }

      .hero-card {
        padding: 28px;
      }

      .field-row {
        flex-direction: column;
        align-items: stretch;
      }

      .field-row label {
        min-width: 0;
      }
    }

    @media (max-width: 520px) {
      .hero-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .hero-actions .btn-primary,
      .hero-actions .btn-secondary {
        width: 100%;
        justify-content: center;
      }
    }
  </style>

  <script type="text/javascript" src="assets/js/text.js"></script>
</head>
<body class="setup-page">
  <main class="bot-setup-main">
    <section class="hero-card">
      <div>
        <span class="status-chip">
          <i class="fas fa-magic"></i>
          <span data-key="panel-web">Web Panel</span>
        </span>
        <h1 data-key="setup-title">Command your GOT Kingsroad Discord bot</h1>
        <p data-key="panel-guide-intro">Connect your Discord account, pick a server and orchestrate every automated feature of the GOT Kingsroad bot from a single modern dashboard.</p>

        <div class="hero-actions">
          <a href="https://discord.com/oauth2/authorize?client_id=1359206763785752807&permissions=8&integration_type=0&scope=bot" class="btn-primary" target="_blank" rel="noopener" data-key="add-bot-button">
            <i class="fas fa-plus-circle"></i> Add bot to a new server
          </a>
          <?php if ($isLoggedIn): ?>
            <span class="btn-secondary" style="cursor: default;">
              <i class="fas fa-circle-user"></i>
              <span data-key="logged-in-as">Connected as</span>
              <strong><?php echo $userName; ?></strong>
            </span>
          <?php else: ?>
            <button class="btn-secondary" onclick="openLoginPopup('discord');" type="button">
              <i class="fab fa-discord"></i>
              <span data-key="login-discord">Login with Discord</span>
            </button>
          <?php endif; ?>
        </div>
      </div>

      <div class="hero-highlights">
        <div class="highlight">
          <i class="fas fa-server"></i>
          <span data-key="panel-highlight-guilds">Manage channels, roles and command messages for every guild you own.</span>
        </div>
        <div class="highlight">
          <i class="fas fa-robot"></i>
          <span data-key="panel-highlight-automation">Send tutorials, reminders and timer embeds without touching Discord.</span>
        </div>
        <div class="highlight">
          <i class="fas fa-shield-alt"></i>
          <span data-key="panel-highlight-security">All actions require Discord authentication and administrator rights.</span>
        </div>
      </div>
    </section>

    <section class="page-layout">
      <aside class="section-nav">
        <div>
          <h2 data-key="panel-section-title">Panel Sections</h2>
          <p data-key="panel-section-desc">Browse the command library or dive into the interactive control center.</p>
        </div>
        <button class="tab-button is-active" data-tab-target="overview">
          <i class="fas fa-compass"></i>
          <span data-key="panel-full-tutorial">Command overview</span>
        </button>
        <button class="tab-button" data-tab-target="control">
          <i class="fas fa-sliders-h"></i>
          <span data-key="panel-web">Control center</span>
        </button>
      </aside>

      <div class="tab-panels">
        <article id="overview" class="tab-panel is-visible" data-tab="overview">
          <div class="command-grid">
            <div class="command-card">
              <h3><i class="fas fa-cogs"></i> <span data-key="setup-admin-title">Admin setup commands</span></h3>
              <p data-key="setup-admin-desc">These commands require administrator permissions:</p>
              <ul>
                <li><code>/gotkingsroad setup</code> – Auto-create the recommended channels, roles and baseline configuration.</li>
                <li><code>/gotkingsroad reload</code> – Refresh stored settings and recreate missing timer or patchnote messages.</li>
                <li><code>/gotkingsroad cleanup</code> – Remove duplicate bot posts and tidy outdated automation messages.</li>
                <li><code>/gotkingsroad permissions</code> – Audit the bot permissions in each configured channel.</li>
                <li><code>/gotkingsroad status</code> – Display the saved timezone, style, channels and alert roles for this guild.</li>
                <li><code>/gotkingsroad message</code> – Send or refresh the multi-timer message (Daily, Drogon, Weekly, Peddler, Beast, Limited Time Deal).</li>
                <li><code>/gotkingsroad reset</code> – Delete the active timer message if you need to move it or clean up.</li>
                <li><code>/gotkingsroad patchnote</code> – Publish the latest patchnote message and keep it synchronised.</li>
                <li><code>/gotkingsroad summon &lt;target&gt;</code> – Manually trigger an alert (Drogon, Peddler, Daily, Weekly, Beast, Limited Time Deal).</li>
                <li><code>/gotkingsroad helpadmin</code> – List every admin-only command directly in Discord.</li>
              </ul>
              <h4 class="badge"><i class="fas fa-sliders-h"></i> Configuration &amp; exports</h4>
              <ul>
                <li><code>/gotkingsroad config export</code> – Download the full guild configuration as JSON.</li>
                <li><code>/gotkingsroad config import</code> – Restore a configuration from a previously exported JSON file.</li>
                <li><code>/gotkingsroad set timezone</code> – Set the server timezone using an IANA identifier (e.g. <code>Europe/Paris</code>).</li>
                <li><code>/gotkingsroad set language</code> – Choose the bot language (<code>fr</code>, <code>en</code>, <code>es</code>, <code>pt-br</code>).</li>
                <li><code>/gotkingsroad set style</code> – Switch the timer message between <code>compact</code> and <code>embed</code> modes.</li>
              </ul>
              <h4 class="badge"><i class="fas fa-bullhorn"></i> Alert roles &amp; reaction panel</h4>
              <ul>
                <li><code>/gotkingsroad rank post</code> – Send the reaction-role selector so members can opt-in.</li>
                <li><code>/gotkingsroad rank drogon @role</code> – Assign the role pinged for Drogon alerts.</li>
                <li><code>/gotkingsroad rank peddler @role</code> – Assign the role pinged for Peddler alerts.</li>
                <li><code>/gotkingsroad rank daily @role</code> – Assign the role pinged before the daily reset.</li>
                <li><code>/gotkingsroad rank weekly @role</code> – Assign the role pinged before the weekly reset.</li>
                <li><code>/gotkingsroad rank beast @role</code> – Assign the role pinged for Beast appearances.</li>
                <li><code>/gotkingsroad rank limiteddeal @role</code> – Assign the role pinged for Limited Time Deal alerts.</li>
              </ul>
              <h4 class="badge"><i class="fas fa-hourglass-half"></i> Advanced scheduling</h4>
              <ul>
                <li><code>/gotkingsroad customtimer add</code> – Register a custom timer with a name and timestamp.</li>
                <li><code>/gotkingsroad customtimer list</code> – Display all custom timers saved for the guild.</li>
                <li><code>/gotkingsroad customtimer remove</code> – Delete one of the custom timers by name.</li>
              </ul>
            </div>

            <div class="command-card">
              <h3><i class="fas fa-user"></i> <span data-key="setup-user-title">General user commands</span></h3>
              <ul>
                <li><code>/gotkingsroad help</code> – Display the public command list for every member.</li>
                <li><code>/gotkingsroad ping</code> – Check the bot latency and confirm it is online.</li>
                <li><code>/gotkingsroad timers</code> – Show the next Drogon, Daily, Weekly, Peddler, Beast and Limited Time Deal timers.</li>
                <li><code>/gotkingsroad uptime</code> – Reveal how long the bot has been running without interruption.</li>
                <li><code>/gotkingsroad about</code> – Learn more about the project, authors and support links.</li>
                <li><code>/gotkingsroad event</code> – Receive the current in-game event calendar screenshot.</li>
              </ul>

              <h3 style="margin-top: 16px;"><i class="fas fa-bell"></i> <span data-key="setup-reminder-title">Reminders</span></h3>
              <p data-key="setup-reminder-desc">Receive private DMs shortly before a timer triggers:</p>
              <ul>
                <li><code>/gotkingsroad reminder add</code> – Schedule a DM reminder for Drogon, Peddler, Daily, Weekly, Beast or Limited Time Deal.</li>
                <li><code>/gotkingsroad reminder list</code> – Display every reminder you have configured.</li>
                <li><code>/gotkingsroad reminder remove</code> – Delete one reminder by selecting the timer and the number of minutes.</li>
                <li><code>/gotkingsroad reminder clear</code> – Clear all reminders for a single timer.</li>
                <li><code>/gotkingsroad reminder clearall</code> – Wipe every reminder you have with one command.</li>
              </ul>
            </div>

            <div class="command-card">
              <h3><i class="fas fa-map-marker-alt"></i> <span data-key="setup-marker-title">Search marker</span></h3>
              <p data-key="cmd-searchmarker-desc">Start typing a marker name — an autocomplete list will suggest existing markers from the official map. Once selected, the bot returns a preview image.</p>
              <ul>
                <li><code>/gotkingsroad searchmarker</code> – <span data-key="cmd-searchmarker">Search for a marker by name and get a screenshot of its location.</span></li>
              </ul>

              <div class="panel-note">
                <span class="badge"><i class="fas fa-lightbulb"></i> Tip</span>
                <span data-key="panel-search-tip">Pair this command with the tutorial message to onboard new guild members.</span>
              </div>
            </div>
          </div>
        </article>

        <article id="control" class="tab-panel" data-tab="control">
          <div class="panel-stack">
            <div class="panel-card <?php echo $isLoggedIn ? '' : 'is-locked'; ?>" data-auth-card>
              <h3>
                <span class="step-index">1</span>
                <span data-key="webpanel-guild-title">Select Discord server</span>
              </h3>
              <p data-key="webpanel-guild-desc">Choose a server where the bot is installed and you have administrator permissions.</p>
              <div class="card-body">
                <div class="field-row">
                  <label for="guildSelect" data-key="label-select-guild">Select server</label>
                  <select id="guildSelect" class="form-select"></select>
                  <button id="refreshGuildsBtn" class="btn btn-outline-info btn-sm" title="Reload guilds">
                    <i class="fas fa-sync-alt"></i>
                  </button>
                </div>
                <p class="inline-note" data-key="panel-guild-tip">Switching the server updates every section below instantly.</p>
              </div>
              <?php if (!$isLoggedIn): ?>
              <div class="locked-overlay">
                <h4 data-key="panel-login-required-title">Connect with Discord</h4>
                <p data-key="panel-login-required-desc">Log in with your Discord account to list your guilds and unlock automation tools.</p>
                <button type="button" onclick="openLoginPopup('discord');">
                  <i class="fab fa-discord"></i>
                  <span data-key="login-discord">Login with Discord</span>
                </button>
              </div>
              <?php endif; ?>
            </div>

            <div class="panel-card <?php echo $isLoggedIn ? '' : 'is-locked'; ?>" data-auth-card>
              <h3>
                <span class="step-index">2</span>
                <span data-key="webpanel-reminders-title">Roles &amp; timer channels</span>
              </h3>
              <p data-key="panel-reminder-desc">Map each alert to the correct Discord role and define the broadcast channels for timers, warnings and patchnotes.</p>
              <div class="card-body">
                <div class="subgrid">
                  <div>
                    <h4 class="badge"><i class="fas fa-bell"></i> <span data-key="webpanel-reminders-title">Reminders</span></h4>
                    <div class="field-row">
                      <label for="role-drogon" data-key="label-role-drogon">Role for Drogon</label>
                      <select id="role-drogon" class="form-select">
                        <option value="" data-key="option-select-role">Select role</option>
                      </select>
                    </div>
                    <div class="field-row">
                      <label for="role-daily" data-key="label-role-daily">Role for Daily reset</label>
                      <select id="role-daily" class="form-select">
                        <option value="" data-key="option-select-role">Select role</option>
                      </select>
                    </div>
                    <div class="field-row">
                      <label for="role-weekly" data-key="label-role-weekly">Role for Weekly reset</label>
                      <select id="role-weekly" class="form-select">
                        <option value="" data-key="option-select-role">Select role</option>
                      </select>
                    </div>
                    <div class="field-row">
                      <label for="role-peddler" data-key="label-role-peddler">Role for Peddler</label>
                      <select id="role-peddler" class="form-select">
                        <option value="" data-key="option-select-role">Select role</option>
                      </select>
                    </div>
                    <div class="field-row">
                      <label for="role-beast">Role for Beast</label>
                      <select id="role-beast" class="form-select">
                        <option value="">Select role</option>
                      </select>
                    </div>
                    <div class="field-row">
                      <label for="role-limited">Role for Limited Time Deal</label>
                      <select id="role-limited" class="form-select">
                        <option value="">Select role</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <h4 class="badge"><i class="fas fa-comments"></i> <span data-key="webpanel-channels-title">Channels</span></h4>
                    <div class="field-row">
                      <label for="channel-timer" data-key="label-channel-timer">Timer messages channel</label>
                      <select id="channel-timer" class="form-select">
                        <option value="" data-key="option-select-channel">Select channel</option>
                      </select>
                    </div>
                    <div class="field-row">
                      <label for="channel-warning" data-key="label-channel-warning">Warning messages channel</label>
                      <select id="channel-warning" class="form-select">
                        <option value="" data-key="option-select-channel">Select channel</option>
                      </select>
                    </div>
                    <div class="field-row">
                      <label for="channel-patchnote">Patchnote channel</label>
                      <select id="channel-patchnote" class="form-select">
                        <option value="">Select channel</option>
                      </select>
                    </div>
                    <div class="action-buttons">
                      <button id="reloadRolesBtn" class="btn btn-outline-light btn-sm">
                        <i class="fas fa-sync"></i> <span data-key="btn-reload-roles">Reload roles</span>
                      </button>
                      <button id="save-reminders" class="btn btn-success">
                        <i class="fas fa-save"></i> <span data-key="btn-save-config">Save configuration</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <?php if (!$isLoggedIn): ?>
              <div class="locked-overlay">
                <h4 data-key="panel-login-required-title">Connect with Discord</h4>
                <p data-key="panel-login-required-desc">Select a guild to configure reminder roles and delivery channels.</p>
                <button type="button" onclick="openLoginPopup('discord');">
                  <i class="fab fa-discord"></i>
                  <span data-key="login-discord">Login with Discord</span>
                </button>
              </div>
              <?php endif; ?>
            </div>

            <div class="panel-card <?php echo $isLoggedIn ? '' : 'is-locked'; ?>" data-auth-card>
              <h3>
                <span class="step-index">3</span>
                <span data-key="webpanel-broadcast-title">Broadcast tutorials &amp; helpers</span>
              </h3>
              <p data-key="panel-broadcast-desc">Instantly send ready-made embeds to onboard your community.</p>
              <div class="card-body">
                <div class="subgrid">
                  <div>
                    <h4 class="badge"><i class="fas fa-robot"></i> <span data-key="webpanel-bottutorial-title">Bot overview tutorial</span></h4>
                    <div class="field-row">
                      <label for="botTutorialChannel" data-key="label-select-channel">Channel</label>
                      <select id="botTutorialChannel" class="form-select"></select>
                    </div>
                    <button id="sendBotTutorialBtn" class="btn btn-outline-info">
                      <i class="fas fa-paper-plane"></i> <span data-key="btn-send-message">Send message</span>
                    </button>
                  </div>

                  <div>
                    <h4 class="badge"><i class="fas fa-map"></i> <span data-key="webpanel-searchmarker-title">SearchMarker tutorial</span></h4>
                    <div class="field-row">
                      <label for="tutorialChannel" data-key="label-select-channel">Channel</label>
                      <select id="tutorialChannel" class="form-select"></select>
                    </div>
                    <button id="sendTutorialMessageBtn" class="btn btn-outline-info">
                      <i class="fas fa-paper-plane"></i> <span data-key="btn-send-message">Send message</span>
                    </button>
                  </div>

                  <div>
                    <h4 class="badge"><i class="fas fa-bell"></i> <span data-key="webpanel-reminder-title">Reminder help</span></h4>
                    <div class="field-row">
                      <label for="reminderChannel" data-key="label-select-channel">Channel</label>
                      <select id="reminderChannel" class="form-select"></select>
                    </div>
                    <button id="sendReminderMessageBtn" class="btn btn-outline-info">
                      <i class="fas fa-paper-plane"></i> <span data-key="btn-send-message">Send message</span>
                    </button>
                  </div>
                </div>
              </div>
              <?php if (!$isLoggedIn): ?>
              <div class="locked-overlay">
                <h4 data-key="panel-login-required-title">Connect with Discord</h4>
                <p data-key="panel-login-required-desc">Send onboarding messages directly from the dashboard once you are authenticated.</p>
                <button type="button" onclick="openLoginPopup('discord');">
                  <i class="fab fa-discord"></i>
                  <span data-key="login-discord">Login with Discord</span>
                </button>
              </div>
              <?php endif; ?>
            </div>

            <div class="panel-card <?php echo $isLoggedIn ? '' : 'is-locked'; ?>" data-auth-card>
              <h3>
                <span class="step-index">4</span>
                <span data-key="webpanel-global-timer-title">Global timer &amp; custom broadcasts</span>
              </h3>
              <p data-key="panel-global-desc">Trigger the official timer embed or craft your own announcement.</p>
              <div class="card-body">
                <div>
                  <div class="field-row">
                    <label for="channel-global-timer" data-key="webpanel-global-timer-label">Selected timer channel</label>
                    <input type="text" id="channel-global-timer" class="form-control" readonly />
                    <button id="sendGlobalTimerMessageBtn" class="btn btn-outline-info">
                      <i class="fas fa-broadcast-tower"></i> <span data-key="btn-send-message">Send timer message</span>
                    </button>
                  </div>
                </div>
                <hr />
                <div>
                  <h4 class="badge"><i class="fas fa-comment"></i> <span data-key="webpanel-custom-title">Custom message</span></h4>
                  <div class="field-row">
                    <label for="customChannel" data-key="label-select-channel">Channel</label>
                    <select id="customChannel" class="form-select"></select>
                    <button id="refreshChannels" class="btn btn-outline-light btn-sm" title="Reload channels">
                      <i class="fas fa-sync-alt" id="refresh-status"></i>
                    </button>
                  </div>
                  <div class="field-row">
                    <label for="customMessage" data-key="label-custom-message">Message</label>
                    <textarea id="customMessage" placeholder="Type your message here..." data-key="placeholder-custom-message"></textarea>
                  </div>
                  <button id="sendMessageBtn" class="btn btn-primary">
                    <i class="fas fa-paper-plane"></i> <span data-key="btn-send-message">Send message</span>
                  </button>
                </div>
              </div>
              <?php if (!$isLoggedIn): ?>
              <div class="locked-overlay">
                <h4 data-key="panel-login-required-title">Connect with Discord</h4>
                <p data-key="panel-login-required-desc">Login to trigger timer embeds or push custom announcements.</p>
                <button type="button" onclick="openLoginPopup('discord');">
                  <i class="fab fa-discord"></i>
                  <span data-key="login-discord">Login with Discord</span>
                </button>
              </div>
              <?php endif; ?>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>

  <?php include($_SERVER['DOCUMENT_ROOT'] . '/footer.php'); ?>

  <script>
    const SetupBotPage = (() => {
      const isLoggedIn = <?php echo $isLoggedIn ? 'true' : 'false'; ?>;

      function init() {
        initTabs();
        if (!isLoggedIn) {
          return;
        }

        loadAvailableGuilds();
        bindRefreshControls();
        bindBroadcastButtons();
        bindSaveConfiguration();
        bindGlobalTimer();
        bindCustomMessage();
      }

      function initTabs() {
        const buttons = document.querySelectorAll('.tab-button');
        const panels = document.querySelectorAll('.tab-panel');

        buttons.forEach((btn) => {
          btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab-target');
            buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
            panels.forEach((panel) => {
              panel.classList.toggle('is-visible', panel.getAttribute('data-tab') === target);
            });
          });
        });
      }

      async function loadAvailableGuilds() {
        const select = document.getElementById('guildSelect');
        if (!select) return;

        select.innerHTML = '<option disabled selected>Loading...</option>';

        try {
          const res = await fetch('/discord/user-guilds.php');
          if (!res.ok) throw new Error('Not logged in or error fetching guilds');

          const guilds = await res.json();
          select.innerHTML = '';

          if (!Array.isArray(guilds) || guilds.length === 0) {
            select.innerHTML = '<option disabled selected>No server found with the bot</option>';
            return;
          }

          guilds.forEach((guild, index) => {
            const opt = document.createElement('option');
            opt.value = guild.id;
            opt.textContent = guild.name;
            if (index === 0) {
              opt.selected = true;
            }
            select.appendChild(opt);
          });

          if (select.value) {
            await loadGuildInfo(select.value);
          }

          select.addEventListener('change', () => {
            if (select.value) {
              loadGuildInfo(select.value);
            }
          });
        } catch (error) {
          console.error(error);
          select.innerHTML = '<option disabled selected>Error loading guilds</option>';
        }
      }

      async function loadGuildInfo(guildId) {
        try {
          const res = await fetch('/discord/guild-info.php?id=' + guildId);
          if (!res.ok) throw new Error('Failed to load guild info');
          const { roles, channels, config } = await res.json();

          populateRoleSelectors(roles, config);
          populateChannelSelectors(channels, config);
          syncGlobalTimerDisplay();
        } catch (err) {
          console.error('Error loading guild info:', err);
        }
      }

      function populateRoleSelectors(roles = [], config = {}) {
        const mapping = {
          'role-drogon': 'drogonRoleId',
          'role-peddler': 'peddlerRoleId',
          'role-daily': 'dailyRoleId',
          'role-weekly': 'weeklyRoleId',
          'role-beast': 'beastRoleId',
          'role-limited': 'limitedDealRoleId'
        };

        Object.entries(mapping).forEach(([id, key]) => {
          const select = document.getElementById(id);
          if (!select) return;
          select.innerHTML = '<option value="">Select role</option>';
          roles.forEach((role) => {
            const opt = document.createElement('option');
            opt.value = role.id;
            opt.textContent = role.name;
            if (config[key] === role.id) {
              opt.selected = true;
            }
            select.appendChild(opt);
          });
        });
      }

      function populateChannelSelectors(channels = [], config = {}) {
        const channelFields = [
          'tutorialChannel',
          'reminderChannel',
          'customChannel',
          'channel-warning',
          'channel-timer',
          'channel-patchnote',
          'botTutorialChannel'
        ];

        const mapping = {
          'channel-timer': 'globalTimerChannelId',
          'channel-warning': 'drogonWarningChannelId',
          'channel-patchnote': 'patchnoteChannelId',
          'botTutorialChannel': 'botTutorialChannelId'
        };

        channelFields.forEach((id) => {
          const select = document.getElementById(id);
          if (!select) return;
          select.innerHTML = '<option value="">Select channel</option>';
          channels
            .filter((channel) => channel.type === 0)
            .forEach((channel) => {
              const opt = document.createElement('option');
              opt.value = channel.id;
              opt.textContent = `#${channel.name}`;
              if (mapping[id] && config[mapping[id]] === channel.id) {
                opt.selected = true;
              }
              select.appendChild(opt);
            });
        });
      }

      function syncGlobalTimerDisplay() {
        const channelTimerSelect = document.getElementById('channel-timer');
        const channelGlobalTimerInput = document.getElementById('channel-global-timer');
        if (!channelTimerSelect || !channelGlobalTimerInput) return;

        const update = () => {
          const selected = channelTimerSelect.selectedOptions[0];
          channelGlobalTimerInput.value = selected ? selected.textContent : '';
        };

        update();
        channelTimerSelect.addEventListener('change', update);
      }

      function bindRefreshControls() {
        const refreshGuildsBtn = document.getElementById('refreshGuildsBtn');
        if (refreshGuildsBtn) {
          refreshGuildsBtn.addEventListener('click', () => loadAvailableGuilds());
        }

        const refreshChannelsBtn = document.getElementById('refreshChannels');
        if (refreshChannelsBtn) {
          refreshChannelsBtn.addEventListener('click', async () => {
            const guildSelect = document.getElementById('guildSelect');
            if (!guildSelect || !guildSelect.value) return;
            const icon = document.getElementById('refresh-status');
            icon?.classList.add('fa-spin');
            await loadGuildInfo(guildSelect.value);
            icon?.classList.remove('fa-spin');
          });
        }

        const reloadRolesBtn = document.getElementById('reloadRolesBtn');
        if (reloadRolesBtn) {
          reloadRolesBtn.addEventListener('click', () => {
            const guildSelect = document.getElementById('guildSelect');
            if (guildSelect && guildSelect.value) {
              loadGuildInfo(guildSelect.value);
            }
          });
        }
      }

      function bindBroadcastButtons() {
        const botTutorialBtn = document.getElementById('sendBotTutorialBtn');
        botTutorialBtn?.addEventListener('click', () => {
          sendPrebuiltMessage('botTutorialChannel', `**__GOT Kingsroad Discord Bot – Command Overview__**
*Your personal assistant for automation, reminders and map navigation.*

__**Server setup**__
• \`/gotkingsroad setup\` – Auto-create recommended channels and alert roles.
• \`/gotkingsroad reload\` – Refresh saved settings and recreate missing messages.
• \`/gotkingsroad cleanup\` – Remove duplicate bot posts and tidy outdated automation messages.
• \`/gotkingsroad permissions\` – Check that the bot can post in every configured channel.
• \`/gotkingsroad status\` – Show configured timezone, style, channels and roles.
• \`/gotkingsroad message\` – Send or refresh the combined timer post.
• \`/gotkingsroad patchnote\` – Publish the latest patch notes.
• \`/gotkingsroad summon <target>\` – Trigger an alert manually (Drogon, Peddler, Daily, Weekly, Beast, Limited Time Deal).
• \`/gotkingsroad helpadmin\` – List every admin-only command directly in Discord.

__**Configuration & roles**__
• \`/gotkingsroad config export\` / \`import\` – Backup or restore your guild settings.
• \`/gotkingsroad set timezone\` – Choose the timezone used for countdowns.
• \`/gotkingsroad set language\` – Switch between fr, en, es and pt-br.
• \`/gotkingsroad set style\` – Toggle between compact or embed timers.
• \`/gotkingsroad rank post\` – Publish the reaction-role selector.
• \`/gotkingsroad rank drogon|peddler|daily|weekly|beast|limiteddeal @role\` – Map alerts to roles.

__**Member tools**__
• \`/gotkingsroad help\` – Public help menu.
• \`/gotkingsroad timers\` – Upcoming timers for every activity.
• \`/gotkingsroad event\` – Current event calendar screenshot.
• \`/gotkingsroad searchmarker <name>\` – Map screenshot centred on a marker.
• \`/gotkingsroad reminder add|list|remove|clear|clearall\` – Personal DM reminders.
• \`/gotkingsroad customtimer add|list|remove\` – Extra guild timers.
• \`/gotkingsroad about\` – Project credits and support links.

Need more help? https://got-kingsroad.com/`);
        });

        const tutorialBtn = document.getElementById('sendTutorialMessageBtn');
        tutorialBtn?.addEventListener('click', () => {
          sendPrebuiltMessage('tutorialChannel', `🔍 **Search any marker location on the map!**

• \`/gotkingsroad searchmarker <name>\` – Instantly locate any marker on the map.
• Autocomplete suggests every official marker as you type.
• The bot will generate a screenshot centered on the marker.
• Try with examples like: \`Drogon\`, \`Castle Black\`, or \`Iron Bank\`.

Make sure the bot has access to the selected channel!`);
        });

        const reminderBtn = document.getElementById('sendReminderMessageBtn');
        reminderBtn?.addEventListener('click', () => {
          sendPrebuiltMessage('reminderChannel', `🧭 **Configure your DM reminders in seconds**

• \`/gotkingsroad reminder add\` – Pick the timer (Drogon, Peddler, Daily, Weekly, Beast, Limited Time Deal) and minutes before.
• \`/gotkingsroad reminder list\` – Review every reminder you currently have.
• \`/gotkingsroad reminder remove\` – Delete one reminder by selecting the timer and minute value.
• \`/gotkingsroad reminder clear\` – Clear reminders for a single timer.
• \`/gotkingsroad reminder clearall\` – Wipe all reminders at once.

Tip: run these commands in DM for a fully private setup.`);
        });
      }

      async function sendPrebuiltMessage(selectId, message) {
        const channelId = document.getElementById(selectId)?.value;
        if (!channelId) {
          alert('Please select a channel first.');
          return;
        }

        try {
          const res = await fetch('/discord/send-message.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ channelId, message })
          });

          const data = await res.json();
          if (res.ok && data.success) {
            alert('✅ Message sent!');
          } else {
            alert(`❌ Failed to send message: ${data.error || 'Unknown error'}`);
          }
        } catch (err) {
          console.error('Send error:', err);
          alert(`❌ Error sending message: ${err.message}`);
        }
      }

      function bindSaveConfiguration() {
        const saveBtn = document.getElementById('save-reminders');
        saveBtn?.addEventListener('click', async () => {
          const guildId = document.getElementById('guildSelect')?.value;
          if (!guildId) {
            alert('Please select a guild.');
            return;
          }

          const payload = {
            guildId,
            drogon: document.getElementById('role-drogon')?.value || null,
            peddler: document.getElementById('role-peddler')?.value || null,
            daily: document.getElementById('role-daily')?.value || null,
            weekly: document.getElementById('role-weekly')?.value || null,
            beast: document.getElementById('role-beast')?.value || null,
            limitedDeal: document.getElementById('role-limited')?.value || null,
            timerChannel: document.getElementById('channel-timer')?.value || null,
            warningChannel: document.getElementById('channel-warning')?.value || null,
            patchnoteChannel: document.getElementById('channel-patchnote')?.value || null,
            botTutorialChannel: document.getElementById('botTutorialChannel')?.value || null
          };

          try {
            const res = await fetch('/discord/save-roles.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });

            const result = await res.json();
            if (result.success) {
              alert('✅ Configuration saved!');
            } else {
              alert('❌ Error: ' + (result.error || 'Unknown'));
            }
          } catch (err) {
            console.error(err);
            alert('❌ Failed to save configuration.');
          }
        });
      }

      function bindGlobalTimer() {
        const button = document.getElementById('sendGlobalTimerMessageBtn');
        button?.addEventListener('click', async () => {
          const guildId = document.getElementById('guildSelect')?.value;
          const channelId = document.getElementById('channel-timer')?.value;
          if (!guildId || !channelId) {
            alert('Please select a guild and a channel.');
            return;
          }

          const payload = { guildId, command: '/gotkingsroad message', channelId };

          try {
            const res = await fetch('/discord/execute-command.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });

            const result = await res.json();
            if (result.success) {
              alert('✅ Command executed successfully!');
            } else {
              alert('❌ Error: ' + (result.error || 'Unknown error'));
            }
          } catch (err) {
            console.error(err);
            alert('❌ Failed to execute command.');
          }
        });
      }

      function bindCustomMessage() {
        const sendBtn = document.getElementById('sendMessageBtn');
        sendBtn?.addEventListener('click', async () => {
          const channelId = document.getElementById('customChannel')?.value;
          const message = document.getElementById('customMessage')?.value.trim();

          if (!channelId || !message) {
            alert('❌ Please select a channel and enter a message.');
            return;
          }

          try {
            const res = await fetch('/discord/send-message.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ channelId, message })
            });

            const data = await res.json();
            if (res.ok && data.success) {
              alert('✅ Custom message sent!');
              document.getElementById('customMessage').value = '';
            } else {
              alert(`❌ Failed to send message: ${data.error || 'Unknown error'}`);
            }
          } catch (err) {
            console.error('Send error:', err);
            alert(`❌ Error sending message: ${err.message}`);
          }
        });
      }

      return { init };
    })();

    document.addEventListener('DOMContentLoaded', SetupBotPage.init);
  </script>
</body>
</html>
