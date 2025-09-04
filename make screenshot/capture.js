// capture.js
const puppeteer = require('puppeteer');

const PAGE_URL = 'https://got-kingsroad.com/botdiscord.php';
const VIEWPORT = { width: 1280, height: 720 };

// Délais / timeouts
const TIMEOUT_EL = 20000;     // attente d'éléments
const TIMEOUT_GOTO = 60000;   // navigation
const RETRIES = 3;            // tentatives si échec
const PAUSE_AFTER_CENTER = 500; // petite pause après recentrage

const SEL = {
  mapRoot: '#devmap',
  mapFallback: '.leaflet-container',
  searchInput: '#marker-search-input',
  searchItem: '.search-result-item',
  popup: '.leaflet-popup',
};

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

/**
 * Attend que la carte Leaflet soit "stable":
 * - aucune tuile en chargement (.leaflet-tile-loading)
 * - au moins quelques tuiles présentes
 * - pas d'animation/mouvement en cours
 */
async function waitForMapSettled(page, totalTimeoutMs = 12000) {
  const start = Date.now();
  while (Date.now() - start < totalTimeoutMs) {
    const ok = await page.evaluate(() => {
      const root = document.querySelector('.leaflet-container');
      if (!root || !window.L) return false;

      const loading = root.querySelectorAll('.leaflet-tile-loading').length;
      const tiles = root.querySelectorAll('img.leaflet-tile').length;

      // si la map existe, tente de lire quelques flags internes
      let moving = false;
      try {
        const m = window.map || window.devmap || window.__leaflet_map || window.L?.map?.instance;
        // On essaye ce qui est dispo
        if (m) {
          moving =
            !!m._animatingZoom ||
            !!m._zooming ||
            !!m._panAnim?._inProgress ||
            !!m._sizeChanged ||
            !!m._moving;
        }
      } catch (_e) {}

      // au moins 4 tuiles et aucune en chargement, pas de mouvement
      return tiles >= 4 && loading === 0 && !moving;
    });

    if (ok) return true;
    await wait(150);
  }
  return false; // timeout
}

/**
 * Tape le nom dans l'input et sélectionne un résultat (ou Enter en fallback).
 */
async function searchAndFocusMarker(page, markerName) {
  // Attend la carte + input
  await page.waitForFunction((inputSel) => {
    return (
      window && window.L &&
      document.querySelector('.leaflet-container') &&
      document.querySelector(inputSel)
    );
  }, { timeout: TIMEOUT_EL }, SEL.searchInput);

  // Tape le nom et déclenche les events
  await page.evaluate((sel, name) => {
    const input = document.querySelector(sel);
    if (input) {
      input.value = name;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, SEL.searchInput, markerName);

  // Laisse l'autocomplete apparaître
  await wait(250);

  // Essaye de cliquer un résultat
  let clicked = false;
  try {
    await page.waitForSelector(SEL.searchItem, { timeout: 1500 });
    const candidates = await page.$$(SEL.searchItem);
    for (const it of candidates) {
      const txt = (await page.evaluate(el => (el.textContent || '').trim().toLowerCase(), it));
      if (!txt || !markerName) continue;
      if (txt.includes(markerName.toLowerCase())) {
        await it.click();
        clicked = true;
        break;
      }
    }
    // Si pas de correspondance stricte, clique le premier
    if (!clicked && candidates[0]) {
      await candidates[0].click();
      clicked = true;
    }
  } catch {
    // pas d'items détectés dans le temps imparti
  }

  // Fallback: Enter déclenche parfois la sélection
  if (!clicked) {
    await page.keyboard.press('Enter');
  }

  // Attend l'ouverture d'un popup
  await page.waitForFunction((popupSel) => {
    return !!document.querySelector(popupSel);
  }, { timeout: TIMEOUT_EL }, SEL.popup);
}

/**
 * Masque l’UI pour une capture propre (zoom, search, attribution, toolbars…)
 */
async function hideUi(page) {
  await page.evaluate(() => {
    const hide = (sel) => {
      const el = document.querySelector(sel);
      if (el && el.style) el.style.display = 'none';
    };
    hide('.leaflet-control-zoom-in');
    hide('.leaflet-control-zoom-out');
    hide('#marker-search-wrapper');
    hide('.search-bar');
    hide('.map-toolbar');
    hide('.controls');
    hide('.leaflet-control-attribution'); // "Leaflet | GilloDaby"
  });
}

/**
 * Capture la carte (div #devmap si dispo, sinon .leaflet-container)
 */
async function screenshotMap(page) {
  const handle =
    (await page.$(SEL.mapRoot)) ||
    (await page.$(SEL.mapFallback));
  if (!handle) throw new Error('Élément carte introuvable (#devmap / .leaflet-container)');
  return await handle.screenshot({ type: 'webp' });
}

/**
 * API publique: capture centrée sur un marqueur.
 * Renvoie un Buffer (WEBP).
 */
async function captureMarkerScreenshot(markerName) {
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    let browser;
    try {
      console.log(`📸 Tentative ${attempt} pour "${markerName}"`);

      browser = await puppeteer.launch({
        headless: 'new', // selon version: true fonctionne aussi
        defaultViewport: VIEWPORT,
        // args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      await page.goto(PAGE_URL, { waitUntil: 'networkidle2', timeout: TIMEOUT_GOTO });

      // 1) attendre que les tuiles initiales se chargent
      await waitForMapSettled(page, 15000);

      // 2) activer toutes les couches si des toggles existent
      await page.evaluate(() => {
        document.querySelectorAll('input[type="checkbox"]').forEach(el => {
          if (!el.checked) el.click();
        });
      });

      // 3) recherche + focus + attente popup
      await searchAndFocusMarker(page, markerName);

      // 4) attendre que la carte finisse de se recentrer et que les tuiles de ce zoom soient prêtes
      await wait(PAUSE_AFTER_CENTER);
      await waitForMapSettled(page, 30000);

      // 5) masquer l’UI et courte pause pour reflow
      await hideUi(page);
      await wait(80);

      // 6) screenshot
      const buffer = await screenshotMap(page);
      if (!buffer || buffer.length < 1000) {
        throw new Error('Image vide ou trop petite (chargement incomplet)');
      }

      await browser.close();
      return buffer;

    } catch (err) {
      console.error(`⚠️ Tentative ${attempt} échouée : ${err.message}`);
      try { if (browser) await browser.close(); } catch {}
      if (attempt === RETRIES) {
        throw new Error(`❌ Échec après ${RETRIES} tentatives pour "${markerName}"`);
      }
      // Pause avant retry (laisse le serveur/tiles respiro)
      await wait(700);
    }
  }
}

module.exports = { captureMarkerScreenshot };
