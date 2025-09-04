const fs = require('fs');
const path = require('path');
const { captureMarkerScreenshot } = require('./capture');

const inputFile = 'marker_titles.txt';
const outputDir = path.join(__dirname, 'screenshots');
const CONCURRENCY_LIMIT = 1;

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const titles = fs.readFileSync(inputFile, 'utf-8')
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0);

async function processBatch(batch) {
  return Promise.all(batch.map(async (title) => {
    const filename = `screenshot-${title.replace(/[^À-ÿ\w\s-]/g, '').replace(/\s+/g, '_')}.webp`;
    const fullPath = path.join(outputDir, filename);
    const tempPath = fullPath + '.tmp';

    // ✅ Vérifie si le fichier est déjà bon
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      if (stats.size > 1024) {
        console.log(`⏩ Déjà généré : ${filename}`);
        return;
      } else {
        console.warn(`⚠️ Fichier corrompu détecté : ${filename} (taille ${stats.size}B), régénération...`);
        fs.unlinkSync(fullPath); // Supprimer pour régénérer
      }
    }

    try {
      console.log(`📸 Capture de "${title}"`);
      const buffer = await captureMarkerScreenshot(title);

      // Vérifie que le buffer est correct
      if (!buffer || buffer.length < 1024) {
        throw new Error('❌ Image vide ou trop petite');
      }

      fs.writeFileSync(tempPath, buffer);         // écriture temporaire
      fs.renameSync(tempPath, fullPath);          // déplacement une fois complet

      console.log(`✅ Sauvegardé : ${filename}`);
    } catch (e) {
      console.error(`❌ Échec pour "${title}" :`, e.message);
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); // Nettoyage
    }
  }));
}


(async () => {
  for (let i = 0; i < titles.length; i += CONCURRENCY_LIMIT) {
    const batch = titles.slice(i, i + CONCURRENCY_LIMIT);
    console.log(`🚀 Lancement batch ${i / CONCURRENCY_LIMIT + 1} (${batch.length} marqueurs)`);
    await processBatch(batch);
  }
})();
