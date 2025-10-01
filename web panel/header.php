<?php
// ===== META HREFLANG + CANONICAL =====
$languages = ['fr','en','es','ru','pt','br','de','it','ja','th','tr','zh-tw'];
$host = 'https://got-kingsroad.com';

// Détecte et retire le préfixe de langue dans le chemin (ex: /fr/achievement → /achievement)
$requestUri = $_SERVER['REQUEST_URI'];
$path = preg_replace('#^/(fr|en|es|ru|pt|br|de|it|ja|th|tr|zh[_-]tw)(/|$)#i', '/', $requestUri);

// Nettoie les éventuels paramètres GET
$pathClean = strtok($path, '?');

// Hreflang alternates
foreach ($languages as $lang) {
  echo '<link rel="alternate" hreflang="'.$lang.'" href="'.$host.'/'.$lang.$pathClean."\" />\n";
}
// Lien par défaut
echo '<link rel="alternate" hreflang="x-default" href="'.$host.$pathClean."\" />\n";

// Canonical dynamique
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http";
$canonicalURL = htmlspecialchars("$protocol://".$_SERVER['HTTP_HOST'].strtok($_SERVER['REQUEST_URI'], '?'), ENT_QUOTES, 'UTF-8');
echo '<link rel="canonical" href="'.$canonicalURL."\" />\n";
?>
<!-- ============ HEADER ============= -->
<style>
:root{ --timer-height:24px; --header-bottom:94px; }
body{ padding-top:var(--header-bottom); }
header{ top:var(--timer-height); }
html,body{ height:100%; overflow-y:auto !important; }
.hidden{ display:none !important; }

/* Header */
header{
  background:#1a1a1a; color:#fff; padding:10px 24px;
  position:fixed; left:0; right:0; width:100%;
  border-radius:0 0 12px 12px; margin:0; z-index:999999;
}
.header-container{ max-width:1400px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; gap:10px; }
.header-left{ display:flex; align-items:center; gap:10px; min-width:0; }
.header-left img{ height:44px; }
.header-title{ font-size:18px; font-weight:700; color:#facc15; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:48vw; }

/* Nav */
.nav-wrapper{ flex:1; display:flex; justify-content:center; }
.nav{ display:flex; gap:16px; align-items:center; }
.nav-item{ position:relative; }
.nav-link{ padding:8px 12px; background:#1f1f1f; border-radius:6px; text-decoration:none; color:#e5e7eb; font-weight:500; transition:background .2s; }
.nav-link:hover{ background:#333; }
.dropdown-menu{
  position:absolute; top:100%; left:50%; transform:translateX(-50%);
  background:#1a1a1a; border-radius:6px; display:none; min-width:240px;
  padding:12px; box-shadow:0 4px 10px rgba(0,0,0,.6);
}
.dropdown-menu a{ display:block; padding:6px 10px; color:#ddd; text-decoration:none; border-radius:4px; }
.dropdown-menu a:hover{ background:#333; }
.nav-item:hover .dropdown-menu, .nav-item:focus-within .dropdown-menu{ display:block; }

/* Langues / login */
.lang-wrapper{ position:relative; display:flex; align-items:center; gap:12px; }
.lang-button{ background:#1f1f1f; border:none; border-radius:6px; padding:6px 12px; display:flex; align-items:center; gap:8px; cursor:pointer; color:#fff; font-weight:600; font-size:14px; box-shadow:0 0 0 1px rgba(255,255,255,.08); transition:background .2s, box-shadow .2s; }
.lang-button:hover{ background:#262626; box-shadow:0 0 0 1px rgba(255,255,255,.18); }
.lang-button img{ width:24px; height:16px; margin:0; object-fit:cover; border-radius:3px; box-shadow:0 0 0 1px rgba(255,255,255,.3); }
.lang-dropdown{ position:absolute; top:calc(100% + 8px); right:0; background:#1a1a1a; border-radius:8px; padding:8px 0; min-width:190px; border:1px solid rgba(255,255,255,.12); box-shadow:0 18px 40px rgba(0,0,0,.45); display:none; overflow:hidden; z-index:10000060; }
.lang-dropdown.is-open{ display:block; }
.lang-dropdown div{ display:flex; align-items:center; gap:10px; padding:8px 14px; cursor:pointer; color:#fff; font-size:14px; transition:background .2s; }
.lang-dropdown div:hover{ background:#2a2a2a; }
.lang-dropdown div img{ width:24px; height:16px; object-fit:cover; border-radius:3px; box-shadow:0 0 0 1px rgba(255,255,255,.25); }
.lang-dropdown div span{ flex:1; }
.profile-button{ background:#1f1f1f; color:#fff; border:none; border-radius:6px; padding:6px 12px; display:flex; align-items:center; gap:8px; text-decoration:none; font-weight:700; }
.profile-button img{ height:28px; width:28px; border-radius:50%; }
.login-dropdown{ position:absolute; top:110%; right:0; background:#1a1a1a; border-radius:6px; padding:8px; display:none; flex-direction:column; gap:8px; z-index:999; }

/* Region selector */
.region-selector{ position:relative; display:flex; align-items:center; height:100%; flex-shrink:0;  z-index:9999999; }
#regionDropdownButton{ background:#1f1f1f; border:1px solid rgba(255,255,255,.2); border-radius:8px; padding:4px 10px; display:flex; align-items:center; gap:6px; color:#fff; font-weight:600; z-index:9999999; font-size:12px; letter-spacing:0.02em; height:28px; transition:background .2s, border-color .2s; }
#regionDropdownButton:hover{ background:#262626; border-color:rgba(255,255,255,.35); }
#regionDropdownButton svg{ width:10px; height:10px; }
#regionDropdownMenu{ display:none; position:absolute; top:calc(100% + 67px); right:0; background:#1a1a1a; border:1px solid rgba(255,255,255,.15); border-radius:10px; box-shadow:0 18px 40px rgba(0,0,0,.45); overflow:hidden; width:220px; z-index:9999999; }
#regionDropdownMenu:not(.hidden){ display:block; }
#regionDropdownMenu .region-btn{ background:none; border:0; width:100%; text-align:left; color:#fff; font-size:13px; padding:9px 14px; display:flex; align-items:center; gap:8px; cursor:pointer; border-radius:0;  z-index:9999999; transition:background .2s, color .2s; }
#regionDropdownMenu .region-btn:hover,
#regionDropdownMenu .region-btn:focus{ background:#2a2a2a; outline:none; }

/* Timer/header wrapper */
#site-header{ position:relative; background:#1a1a1a; z-index:500; }

/* Burger */
.hamburger{ display:none; margin-left:10px; background:#1f1f1f; border:1px solid rgba(255,255,255,.15); border-radius:8px; padding:8px 10px; cursor:pointer; }
.hamburger-bar{ display:block; width:22px; height:2px; background:#e5e7eb; margin:4px 0; border-radius:2px; }
.hamburger.is-open .hamburger-bar:nth-child(1){ transform:translateY(6px) rotate(45deg); }
.hamburger.is-open .hamburger-bar:nth-child(2){ opacity:0; }
.hamburger.is-open .hamburger-bar:nth-child(3){ transform:translateY(-6px) rotate(-45deg); }

/* Timer bar */
.timer-bar{ padding-top:max(0px, env(safe-area-inset-top)); width:100%; }

/* Mobile */
@media (max-width:1024px){
  .hamburger{ display:inline-flex; align-items:center; }
  .header-title{ font-size:16px; max-width:40vw; }
  .lang-wrapper{ flex-shrink:0; }

  .nav-wrapper{ display:none; }
  .nav-wrapper.is-open{
    display:block; position:fixed; left:0; right:0; top:var(--header-bottom,96px);
    background:#1a1a1a; border-bottom-left-radius:12px; border-bottom-right-radius:12px;
    box-shadow:0 14px 40px rgba(0,0,0,.45); z-index:10000000001;
    max-height:calc(100vh - var(--header-bottom,96px)); overflow:auto;
  }
  .nav{ flex-direction:column; align-items:stretch; gap:8px; padding:10px; }
  .nav-link{ display:flex; justify-content:space-between; align-items:center; font-size:15px; cursor:pointer; -webkit-tap-highlight-color:transparent; }

  /* Désactive le hover auto et n’ouvre que via .open */
  .nav-item:hover > .dropdown-menu,
  .nav-item:focus-within > .dropdown-menu{ display:none !important; }
  .dropdown-menu{ position:static; transform:none; background:transparent; box-shadow:none; padding:6px 4px 8px; border-radius:0; display:none !important; }
  .nav-item.open > .dropdown-menu{ display:block !important; }

  .dropdown-menu a{ background:#1f1f1f; border:1px solid rgba(255,255,255,.08); }

  .timer-bar .container{ display:flex; flex-wrap:nowrap !important; overflow-x:auto; -webkit-overflow-scrolling:touch; white-space:nowrap; gap:12px !important; padding:0 8px; }
  .timer-bar .container > *{ flex:0 0 auto; min-width:max-content; }
}
@media (max-width:520px){ .header-title{ display:none; } }
@media (max-width:420px){ .timer-bar{ font-size:12px; } }

/* Nettoyage des traits/ombres dans la zone header */
#site-header, #site-header *{ border:0 !important; box-shadow:none !important; background-image:none !important; }
#site-header::before, #site-header::after, #site-header *::before, #site-header *::after,
.timer-bar::before, .timer-bar::after, .timer-bar .container::before, .timer-bar .container::after,
header::before, header::after{ content:none !important; display:none !important; }

body.menu-open{ overflow:hidden; }

</style>

<script>
// ====== FONCTIONS GLOBALES UTILES EN AMONT ======
const supportedLangs = [
  "fr",
  "en",
  "es",
  "ru",
  "pt",
  "br",
  "de",
  "it",
  "ja",
  "th",
  "tr",
  "zh-tw"
];

// Toujours défini AVANT usage
window.syncHeaderOffset = function(){
  const header = document.querySelector('header');
  const bar = document.querySelector('.timer-bar');
  const barH = bar ? Math.ceil(bar.getBoundingClientRect().height) : 0;

  document.documentElement.style.setProperty('--timer-height', barH + 'px');
  if (header) header.style.top = barH + 'px';

  const headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
  const bottom = barH + headerH;

  document.documentElement.style.setProperty('--header-bottom', bottom + 'px');
  document.body.style.paddingTop = bottom + 'px';
};

// Recalcule aux moments clés
addEventListener('load', window.syncHeaderOffset, {passive:true});
addEventListener('resize', window.syncHeaderOffset, {passive:true});
addEventListener('orientationchange', window.syncHeaderOffset, {passive:true});
if (document.fonts && document.fonts.ready){ document.fonts.ready.then(window.syncHeaderOffset); }
setTimeout(window.syncHeaderOffset, 250);
setTimeout(window.syncHeaderOffset, 800);

// Langues + login helpers
function setLanguage(lang){
  localStorage.MapLng = lang.toUpperCase();
  const menu = document.getElementById("langMenu");
  if (menu) menu.classList.remove("is-open");
  location.reload();
}
function toggleLangDropdown(event){
  const menu = document.getElementById("langMenu");
  if (!menu) return;
  if (event && typeof event.stopPropagation === "function") event.stopPropagation();
  menu.classList.toggle("is-open");
}
function toggleLoginDropdown(){
  const loginMenu = document.getElementById("loginDropdown");
  if (!loginMenu) return;
  loginMenu.style.display = (loginMenu.style.display === "flex") ? "none" : "flex";
}
function openLoginPopup(provider){
  const width=600, height=700;
  const left=(window.innerWidth - width)/2, top=(window.innerHeight - height)/2;
  const url = provider==="google" ? "https://got-kingsroad.com/google-login.php?popup=true"
                                  : "https://got-kingsroad.com/discord-login.php?popup=true";
  const popup = window.open(url, "LoginPopup", `width=${width},height=${height},left=${left},top=${top}`);
  const timer = setInterval(()=>{ if (popup.closed){ clearInterval(timer); location.reload(); } }, 500);
}
</script>

<div id="site-header">
  <!-- ===== BARRE TIMERS ===== -->
  <div class="timer-bar fixed top-0 left-0 right-0 z-[10000000000] text-white text-sm py-1 px-4" style="background:#1a1a1a !important;">
    <div class="container mx-auto flex flex-wrap justify-center items-center gap-x-6">

      <!-- Daily Reset -->
      <div class="flex items-center whitespace-nowrap">
        <img src="/media/icones/weekly.webp" alt="Daily Reset Icon" loading="lazy" class="h-5 w-5 rounded-full border border-gray-600 mr-1">
        <span class="font-bold" data-key="timer-daily">Daily Reset:</span>
        <span id="dailyResetTimer" class="font-bold text-red-500 ml-1">23h 59m 59s</span>
      </div>

      <!-- Drogon Timer -->
      <div class="flex items-center whitespace-nowrap">
        <img src="/media/icones/drogon2.webp" alt="Drogon Icon" loading="lazy" class="h-5 w-5 rounded-full border border-gray-600 mr-1">
        <span class="font-bold" data-key="timer-drogon">Drogon Timer:</span>
        <span id="drogonTimer" class="font-bold text-red-500 ml-1">--:--</span>
      </div>

      <!-- Peddler Timer -->
      <div class="flex items-center whitespace-nowrap">
        <img src="/media/icones/peddler.webp" alt="Peddler Icon" loading="lazy" class="h-5 w-5 rounded-full border border-gray-600 mr-1">
        <span class="font-bold" data-key="timer-peddler">Peddler Timer:</span>
        <span id="peddlerTimer" class="font-bold text-red-500 ml-1">--:--</span>
      </div>

      <!-- Weekly Reset -->
      <div class="flex items-center whitespace-nowrap">
        <img src="/media/icones/reload.webp" alt="Weekly Reset Icon" loading="lazy" class="h-5 w-5 rounded-full border border-gray-600 mr-1">
        <span class="font-bold" data-key="timer-weekly">Weekly Reset:</span>
        <span id="weeklyResetTimer" class="font-bold text-red-500 ml-1">--:--</span>
      </div>

      <!-- Online Counter -->
      <div class="flex items-center whitespace-nowrap">
        <img src="/media/anonyme.webp" alt="Online Icon" loading="lazy" class="h-5 w-5 rounded-full border border-gray-600 mr-1">
        <span id="online-count" data-no-translate class="font-bold" data-count="0">
          <span class="label" data-key="players-online-label">Players online:</span>
          <span class="count text-red-500">0</span>
        </span>
      </div>

      <!-- Region Dropdown -->
      <div class="region-selector flex items-center h-full whitespace-nowrap flex-shrink-0 ml-2">
        <button id="regionDropdownButton" type="button"
          class="text-white text-[0.65rem] px-2 py-[2px] rounded-md border border-gray-600 h-[1.25rem] flex items-center shadow-sm hover:bg-gray-700 transition leading-none"
          >
          <span id="currentRegion" class="leading-none">NA</span>
          <svg class="ml-[4px] w-[10px] h-[10px] fill-current" viewBox="0 0 20 20"><path d="M5.5 7l4.5 4 4.5-4z" /></svg>
        </button>

        <div id="regionDropdownMenu"
          class="absolute hidden top-[110%] right-0 w-40 bg-[#1a1a1a]/100 text-white border border-gray-600 rounded-lg shadow-xl z-50 overflow-hidden">
          <div class="p-2 space-y-1 text-sm">
            <button class="region-btn flex items-center gap-2 whitespace-nowrap w-full text-left px-3 py-1.5 hover:bg-gray-700 rounded transition" data-region="NA">North America (NA)</button>
            <button class="region-btn flex items-center gap-2 whitespace-nowrap w-full text-left px-3 py-1.5 hover:bg-gray-700 rounded transition" data-region="EU">Europe (EU)</button>
            <button class="region-btn flex items-center gap-2 whitespace-nowrap w-full text-left px-3 py-1.5 hover:bg-gray-700 rounded transition" data-region="SEA">Southeast Asia (SEA)</button>
            <button class="region-btn flex items-center gap-2 whitespace-nowrap w-full text-left px-3 py-1.5 hover:bg-gray-700 rounded transition" data-region="SA">South America (SA)</button>
            <button class="region-btn flex items-center gap-2 whitespace-nowrap w-full text-left px-3 py-1.5 hover:bg-gray-700 rounded transition" data-region="RU">Russia (RU)</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== HEADER ===== -->
  <header>
    <div class="header-container">
      <div class="header-left">
        <a href="https://got-kingsroad.com">
          <img src="https://got-kingsroad.com/media/logotransparent.webp" alt="Logo">
        </a>
        <span class="header-title" data-key="title-site">Carte interactive GOT Kingsroad</span>
      </div>

      <!-- Burger (mobile) -->
      <button id="menuToggle" class="hamburger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="siteNav">
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      </button>

      <div class="nav-wrapper" id="navWrapper">
        <nav class="nav" id="siteNav">
          <a class="nav-link" href="https://got-kingsroad.com/" data-key="menu-interactive2">Interactive Map</a>

          <div class="nav-item">
            <span class="nav-link" data-key="menu-tools"><span class="label">Outils</span> ▼</span>
            <div class="dropdown-menu">
              <a href="https://got-kingsroad.com/gear-planner" data-key="tool-equip">Équipement</a>
              <a href="https://got-kingsroad.com/charactorsimulator" data-key="tool-charactercreator">Character Creator</a>
              <a href="https://got-kingsroad.com/artifactsimulator" data-key="tool-artifact">Artifact Simulator</a>
              <a href="https://got-kingsroad.com/battle/lobbies/lobby" data-key="menu-battle">Online Battle Mode</a>
              <a href="https://got-kingsroad.com/jewelrysimulator" data-key="tool-jewelry">Jewelry Simulator</a>
              <a href="https://got-kingsroad.com/boxsimulator" data-key="tool-box">Box Simulator</a>
              <a href="https://got-kingsroad.com/timer" data-key="tool-timer">Minuteur</a>
              <a href="https://got-kingsroad.com/grind-timer" data-key="tool-grindtimer">Grind Timer</a>
              <a href="https://got-kingsroad.com/database/database" data-key="tool-database">Base de données</a>
            </div>
          </div>

          <div class="nav-item">
            <span class="nav-link" data-key="menu-guides"><span class="label">Guides</span> ▼</span>
            <div class="dropdown-menu">
              <a href="https://got-kingsroad.com/guides" data-key="guide-all">Tous les guides</a>
            </div>
          </div>

          <div class="nav-item">
            <span class="nav-link" data-key="menu-usefull"><span class="label">Utile</span> ▼</span>
            <div class="dropdown-menu">
              <a href="https://got-kingsroad.com/coupons" data-key="menu-coupons">Coupons</a>
              <a href="https://got-kingsroad.com/profile.php?view=list" data-key="menu-profile">Profil</a>
              <a href="https://got-kingsroad.com/ranking" data-key="menu-success">Ranking</a>
              <a href="https://got-kingsroad.com/achievement" data-key="menu-achievement">Achievement</a>
              <a href="https://got-kingsroad.com/setup-bot" data-key="footer-discord-bot">Discord Bot Timer</a>
            </div>
          </div>

          <div class="nav-item">
            <span class="nav-link" data-key="menu-others"><span class="label">Autres</span> ▼</span>
            <div class="dropdown-menu">
              <a href="https://got-kingsroad.com/feedback" data-key="menu-feedback">Commentaire</a>
              <a href="https://got-kingsroad.com/credits" data-key="menu-credits">Crédits</a>
              <a href="https://got-kingsroad.com/about" data-key="menu-about">À propos</a>
            </div>
          </div>
        </nav>
      </div>

      <div class="lang-wrapper">
        <button class="lang-button" type="button" onclick="toggleLangDropdown(event)">
          <img id="langFlagImg" src="https://flagcdn.com/us.svg" alt="flag">
          <span data-key="lang-selected">FR</span>
        </button>
        <div class="lang-dropdown" id="langMenu">
          <div onclick="setLanguage('EN')"><img src="https://flagcdn.com/us.svg"> <span data-key="lang-en">Anglais</span></div>
          <div onclick="setLanguage('FR')"><img src="https://flagcdn.com/fr.svg"> <span data-key="lang-fr">Français</span></div>
          <div onclick="setLanguage('RU')"><img src="https://flagcdn.com/ru.svg"> <span data-key="lang-ru">Russe</span></div>
          <div onclick="setLanguage('ES')"><img src="https://flagcdn.com/es.svg"> <span data-key="lang-es">Espagnol</span></div>
          <div onclick="setLanguage('PT')"><img src="https://flagcdn.com/pt.svg"> <span data-key="lang-pt">Portugais</span></div>
          <div onclick="setLanguage('BR')"><img src="https://flagcdn.com/br.svg"> <span data-key="lang-br">Brésilien</span></div>
          <div onclick="setLanguage('DE')"><img src="https://flagcdn.com/de.svg"> <span data-key="lang-de">Deutsch</span></div>
          <div onclick="setLanguage('IT')"><img src="https://flagcdn.com/it.svg"> <span data-key="lang-it">Italien</span></div>
          <div onclick="setLanguage('JA')"><img src="https://flagcdn.com/jp.svg"> <span data-key="lang-ja">Japonais</span></div>
          <div onclick="setLanguage('TH')"><img src="https://flagcdn.com/th.svg"> <span data-key="lang-th">Thaï</span></div>
          <div onclick="setLanguage('TR')"><img src="https://flagcdn.com/tr.svg"> <span data-key="lang-tr">Turc</span></div>
          <div onclick="setLanguage('ZH_TW')"><img src="https://flagcdn.com/tw.svg"> <span data-key="lang-zh_tw">Chinois (Taïwan)</span></div>
        </div>

        <div id="loginOrProfile"></div>
      </div>
    </div>
  </header>
</div>

<!-- Traductions (fichier de clés) -->
<script type="text/javascript" src="/assets/js/text.js"></script>
<script>
// ===== Sélection de langue + applyTranslations =====
const LANGUAGE_RESOURCES = {
  EN: window.langEN,
  FR: window.langFR,
  RU: window.langRU,
  ES: window.langES,
  PT: window.langPT,
  BR: window.langBR,
  DE: window.langDE,
  IT: window.langIT,
  JA: window.langJA,
  TH: window.langTH,
  TR: window.langTR,
  ZH_TW: window.langZHTW
};

const LANGUAGE_ALIASES = {
  PT_BR: 'BR',
  ZH: 'ZH_TW',
  ZH_HANT: 'ZH_TW',
  ZH_TW: 'ZH_TW'
};

function resolveLanguageResource(code) {
  const fallback = 'EN';
  if (!code) return LANGUAGE_RESOURCES[fallback];

  const normalized = String(code).toUpperCase().replace(/-/g, '_');
  if (LANGUAGE_RESOURCES[normalized]) {
    return LANGUAGE_RESOURCES[normalized];
  }

  const aliasKey = LANGUAGE_ALIASES[normalized];
  if (aliasKey && LANGUAGE_RESOURCES[aliasKey]) {
    return LANGUAGE_RESOURCES[aliasKey];
  }

  const base = normalized.split('_')[0];
  if (base) {
    const baseAlias = LANGUAGE_ALIASES[base];
    if (baseAlias && LANGUAGE_RESOURCES[baseAlias]) {
      return LANGUAGE_RESOURCES[baseAlias];
    }
    if (LANGUAGE_RESOURCES[base]) {
      return LANGUAGE_RESOURCES[base];
    }
  }

  return LANGUAGE_RESOURCES[fallback];
}

const langue = resolveLanguageResource(localStorage.MapLng);
window.langue = langue;

function applyTranslations(){
  if (typeof langue === 'undefined') return;
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key'); const t = langue[key]; if (!t) return;
    if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) { el.setAttribute("placeholder", t); return; }
    const labelSpan = el.querySelector('.label'); if (labelSpan){ labelSpan.textContent = t; return; }
    const img = el.querySelector('img'); if (img){ el.innerHTML=''; el.appendChild(img); el.appendChild(document.createTextNode(' '+t)); return; }
    el.innerHTML = t;
  });
  document.querySelectorAll('[data-key-title]').forEach(el => {
    const k = el.getAttribute('data-key-title'); if (langue[k]) el.setAttribute('title', langue[k]);
  });
}
document.addEventListener("DOMContentLoaded", applyTranslations);
</script>

<script>
// ===== REGION + TIMERS =====
document.addEventListener('DOMContentLoaded', () => {
  const langMenu = document.getElementById('langMenu');
  const langWrapper = document.querySelector('.lang-wrapper');
  if (langMenu && langWrapper){
    langMenu.addEventListener('click', (e)=> e.stopPropagation());
    document.addEventListener('click', (e)=>{
      if (!langWrapper.contains(e.target)) langMenu.classList.remove('is-open');
    });
    document.addEventListener('keydown', (e)=>{
      if (e.key === 'Escape') langMenu.classList.remove('is-open');
    });
  }

  // Region dropdown
  const dropdownBtn = document.getElementById('regionDropdownButton');
  const dropdownMenu = document.getElementById('regionDropdownMenu');
  const regionDisplay = document.getElementById('currentRegion');

  const regionTimezones = {
    'NA': 'America/New_York',
    'EU': 'Europe/Paris',
    'SEA': 'Asia/Singapore',
    'SA': 'America/Sao_Paulo',
    'RU': 'Europe/Moscow'
  };

  function applySelectedRegion(){
    const savedRegion = localStorage.getItem('selectedRegion') || 'NA';
    if (regionDisplay) regionDisplay.textContent = savedRegion;
  }

  if (dropdownBtn && dropdownMenu){
    dropdownBtn.addEventListener('click', (e)=>{ e.stopPropagation(); dropdownMenu.classList.toggle('hidden'); });
    document.addEventListener('click', (e)=>{ if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) dropdownMenu.classList.add('hidden'); });
    dropdownMenu.querySelectorAll('.region-btn').forEach(btn => {
      btn.addEventListener('click', (e)=>{ e.stopPropagation(); localStorage.setItem('selectedRegion', btn.dataset.region); applySelectedRegion(); dropdownMenu.classList.add('hidden'); });
    });
    applySelectedRegion();
  }

  // Timers
  function format(ms){
    const h = String(Math.max(0, Math.floor(ms / 3600000))).padStart(2,'0');
    const m = String(Math.max(0, Math.floor((ms % 3600000) / 60000))).padStart(2,'0');
    const s = String(Math.max(0, Math.floor((ms % 60000) / 1000))).padStart(2,'0');
    return `${h}h ${m}m ${s}s`;
  }
  function getNowWithOffset(){
    const savedRegion = localStorage.getItem('selectedRegion') || 'NA';
    const tz = regionTimezones[savedRegion] || 'America/New_York';
    const now = new Date();
    const localStr = now.toLocaleString('en-US', { timeZone: tz });
    return new Date(localStr);
  }
  function getTimers(){
    const now = getNowWithOffset();
    const timers = {};

    // Daily 1:00
    const daily = new Date(now); daily.setHours(1,0,0,0); if (now >= daily) daily.setDate(daily.getDate()+1);
    timers.daily = daily;

    // Drogon every odd hour at :00
    let drogonHour = now.getHours(); drogonHour = drogonHour % 2 === 0 ? drogonHour + 1 : drogonHour + 2; if (drogonHour >= 24) drogonHour -= 24;
    const drogon = new Date(now); drogon.setHours(drogonHour,0,0,0); if (drogon <= now) drogon.setDate(drogon.getDate()+1);
    timers.drogon = drogon;

    // Peddler odd hours at :30
    const spawnHours = [1,3,5,7,9,11,13,15,17,19,21,23];
    let nextPeddler = null;
    for (let h of spawnHours){
      const t = new Date(now); t.setHours(h,30,0,0); if (now < t){ nextPeddler = t; break; }
    }
    if (!nextPeddler){ nextPeddler = new Date(now); nextPeddler.setDate(nextPeddler.getDate()+1); nextPeddler.setHours(1,30,0,0); }
    timers.peddler = nextPeddler;

    // Weekly Thursday 1:00
    const weekly = new Date(now); weekly.setHours(1,0,0,0);
    const day = now.getDay(); // 0=Sun, 4=Thu
    const passed = day > 4 || (day === 4 && now.getHours() >= 1);
    weekly.setDate(weekly.getDate() + (passed ? (7 - day + 4) : (4 - day)));
    timers.weekly = weekly;

    // Kraken Saturday 19:00
    const kraken = new Date(now); kraken.setHours(19,0,0,0);
    const daysUntilSaturday = (6 - now.getDay() + (now > kraken ? 7 : 0)) % 7;
    if (daysUntilSaturday || now > kraken) kraken.setDate(kraken.getDate() + daysUntilSaturday);
    timers.kraken = kraken;

    return timers;
  }

  function updateTimers(){
    const now = getNowWithOffset();
    const timers = getTimers();

    const elDaily = document.getElementById("dailyResetTimer"); if (elDaily) elDaily.textContent = format(timers.daily - now);
    const elDrogon = document.getElementById("drogonTimer");   if (elDrogon) elDrogon.textContent = format(timers.drogon - now);
    const elWeekly = document.getElementById("weeklyResetTimer"); if (elWeekly) elWeekly.textContent = format(timers.weekly - now);
    const elPeddler = document.getElementById("peddlerTimer"); if (elPeddler) elPeddler.textContent = format(timers.peddler - now);
    const elKraken = document.getElementById("krakenTimer");   if (elKraken) elKraken.textContent = format(timers.kraken - now);

    requestAnimationFrame(updateTimers);
  }
  updateTimers();
});
</script>

<!-- Socket.io client -->
<script src="/socket/socket.io/socket.io.js"></script>
<script>
// ===== Players online via socket.io =====
const socket = io("https://got-kingsroad.com", { path: "/socket/socket.io", transports: ["polling"] });
let lastUpdate = 0;
socket.on("updateUserCount", (count) => {
  const now = Date.now();
  if (now - lastUpdate < 1000) return;
  lastUpdate = now;

  const onlineCountElement = document.getElementById("online-count");
  const labelSpan = onlineCountElement?.querySelector(".label");
  const countSpan = onlineCountElement?.querySelector(".count");
  if (!onlineCountElement || !countSpan || !labelSpan) return;

  onlineCountElement.setAttribute("data-count", count);
  countSpan.textContent = count;

  const key = "players-online";
  const template = (window.langue && window.langue[key]) || "Players online: {count}";
  const label = template.replace("{count}", "").trim();
  labelSpan.textContent = label;
});
</script>

<script>
// ===== Langue + Login UI =====
document.addEventListener("DOMContentLoaded", () => {
  const currentLang = (localStorage.MapLng || 'EN').toUpperCase();
  const flagMap = {
    EN: 'us',
    FR: 'fr',
    RU: 'ru',
    ES: 'es',
    PT: 'pt',
    BR: 'br',
    DE: 'de',
    IT: 'it',
    JA: 'jp',
    TH: 'th',
    TR: 'tr',
    ZH_TW: 'tw'
  };
  const normalizedLangKey = currentLang.replace(/-/g, '_');
  const aliasKey = LANGUAGE_ALIASES[normalizedLangKey];
  const baseKey = normalizedLangKey.split('_')[0];
  const flagCode =
    flagMap[normalizedLangKey] ||
    (aliasKey && flagMap[aliasKey]) ||
    flagMap[currentLang] ||
    (baseKey && flagMap[baseKey]) ||
    'us';
  const flagImg = document.getElementById('langFlagImg');
  if (flagImg) flagImg.src = `https://flagcdn.com/${flagCode}.svg`;

  // Chargement du profil / bouton login
  fetch('/api/status.php', { credentials:'include' })
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("loginOrProfile");
      if (!container) return;

      if (data.loggedIn && data.user){
        container.innerHTML = `
          <a href="#" class="profile-button" onclick="event.preventDefault(); fetch('/api/t/logout.php', { method: 'POST' }).then(() => location.reload());">
            <img src="${data.user.avatar}" alt="profile">
            ${data.user.name} (<span data-key="btn-logout">Déconnexion</span>)
          </a>`;
        applyTranslations();

        const userBox = document.getElementById('discord-user');
        if (userBox) userBox.style.display = 'block';
      } else {
        container.innerHTML = `
          <div style="position: relative;">
            <button class="nav-link" onclick="toggleLoginDropdown()" data-key="login-title">Connexion</button>
            <div id="loginDropdown" class="login-dropdown">
              <button onclick="openLoginPopup('discord')">
                <img src="https://got-kingsroad.com/media/icones/discord.webp" alt="Discord">
                <span data-key="login-discord">Discord</span>
              </button>
              <button onclick="openLoginPopup('google')">
                <img src="https://got-kingsroad.com/media/icones/google.webp" alt="Google">
                <span data-key="login-google">Google</span>
              </button>
            </div>
          </div>`;
      }

      window.currentUser = data.loggedIn ? data.user : null; // globale
    });
});
</script>

<script>
// ===== Remap des liens selon sous-domaine =====
document.addEventListener("DOMContentLoaded", () => {
  const currentHost = window.location.hostname; // ex: fr.got-kingsroad.com
  const isSubdomain = supportedLangs.some(l => currentHost.startsWith(l + '.'));
  const effectiveHost = isSubdomain ? currentHost : 'got-kingsroad.com';

  document.querySelectorAll('.nav a, .dropdown-menu a, .header-left a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('https://got-kingsroad.com')) return;
    const url = new URL(href);
    const newHref = `https://${effectiveHost}${url.pathname}${url.search}${url.hash}`;
    link.setAttribute('href', newHref);
  });
});
</script>

<script>
// ====================== MENU MOBILE ROBUSTE ======================
document.addEventListener('DOMContentLoaded', () => {
  const mq = window.matchMedia('(max-width:1024px)');
  const navWrap = document.getElementById('navWrapper') || document.querySelector('.nav-wrapper');
  const siteNav = document.getElementById('siteNav') || document.querySelector('.nav');
  if (navWrap && !navWrap.id) navWrap.id = 'navWrapper';
  if (siteNav && !siteNav.id) siteNav.id = 'siteNav';
  const burger  = document.getElementById('menuToggle');

  const openMenu = (open) => {
    if (!navWrap) return;
    navWrap.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (burger){
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    }
    if (!open && siteNav){
      siteNav.querySelectorAll('.nav-item.open').forEach(i => i.classList.remove('open'));
    }
    window.syncHeaderOffset && window.syncHeaderOffset();
  };

  // Burger
  burger?.addEventListener('click', (e)=>{ e.stopPropagation(); openMenu(!navWrap.classList.contains('is-open')); });

  // Évite fermeture instantanée quand on clique dans le panneau
  navWrap?.addEventListener('click', (e)=> e.stopPropagation());

  // Ouvre/ferme les sous-catégories en mobile
  siteNav?.querySelectorAll('.nav-item > .nav-link').forEach(link => {
    link.setAttribute('role','button'); link.setAttribute('tabindex','0');
    link.addEventListener('click', (e) => {
      if (!mq.matches) return; // seulement en mobile
      e.preventDefault();
      const item = link.parentElement;
      const willOpen = !item.classList.contains('open');
      siteNav.querySelectorAll('.nav-item.open').forEach(i => { if (i !== item) i.classList.remove('open'); });
      item.classList.toggle('open', willOpen);
    });
  });

  // Fermer au clic extérieur / ESC (mobile)
  document.addEventListener('click', (e) => {
    if (!mq.matches) return;
    if (!navWrap?.classList.contains('is-open')) return;
    if (!navWrap.contains(e.target) && !burger?.contains(e.target)) openMenu(false);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') openMenu(false); });

  // Reset quand on repasse desktop
  window.addEventListener('resize', () => {
    window.syncHeaderOffset && window.syncHeaderOffset();
    if (!mq.matches){ openMenu(false); }
  }, {passive:true});
});
</script>