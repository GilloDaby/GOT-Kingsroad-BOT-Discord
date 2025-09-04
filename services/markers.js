const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

async function getAllMarkerNames() {
  const url = 'https://got-kingsroad.com/exports/all_markers_2025-09-04_103920.js';
  const res = await fetch(url);
  const text = await res.text();
  const startIndex = text.indexOf('// Liste des Marqueurs');
  if (startIndex === -1) throw new Error('Section "// Liste des Marqueurs" not found.');
  const relevantText = text.slice(startIndex);
  const regex = /(?:var|let|const)?\s*(\w+)\s*=\s*(\[[\s\S]*?\])\s*;/g;
  const titles = new Set();
  let m;
  while ((m = regex.exec(relevantText)) !== null) {
    const rawArray = m[2];
    try {
      const parsed = Function('\"use strict\"; return (' + rawArray + ')')();
      parsed.forEach(entry => { if (entry?.[2]?.title) titles.add(entry[2].title); });
    } catch {}
  }
  if (!titles.size) throw new Error('No titles extracted.');
  return [...titles].sort();
}

module.exports = { getAllMarkerNames };
