import requests
import re

url = 'https://got-kingsroad.com/exports/all_markers_2025-09-04_103920.js'
response = requests.get(url)
content = response.text

# 🪓 Couper après le bon commentaire
split_point = content.find('// Liste des Marqueurs')
if split_point == -1:
    print("❌ Le commentaire '// Liste des Marqueurs' est introuvable.")
    exit(1)

content = content[split_point:]  # On garde tout après ce point

# 📦 Extraire tous les titres à partir des objets JSON
titles = set(re.findall(r'"title"\s*:\s*"([^"]+)"', content))

if not titles:
    print("⚠️ Aucun titre trouvé après // Liste des Marqueurs")
else:
    print(f"✅ {len(titles)} titres extraits :\n")
    for title in sorted(titles):
        print(title)
with open("marker_titles.txt", "w", encoding="utf-8") as f:
    for title in sorted(titles):
        f.write(title + "\n")

print(f"\n📝 Liste enregistrée dans marker_titles.txt")
