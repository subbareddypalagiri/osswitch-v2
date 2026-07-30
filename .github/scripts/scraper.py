import urllib.request
import re
import json
import os

print("🚀 Starting God-Tier Autonomous ISO Scraper...")

# The output catalog file
CATALOG_PATH = "catalog.json"

# Load existing catalog
if os.path.exists(CATALOG_PATH):
    with open(CATALOG_PATH, "r") as f:
        catalog = json.load(f)
else:
    catalog = {}

def get_html(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (OSwitch Auto-Scraper)'})
    try:
        with urllib.request.urlopen(req) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")
        return ""

print("Scraping Kali Linux...")
kali_html = get_html("https://www.kali.org/get-kali/")
# Regex to find the absolute installer ISO link (e.g., https://cdimage.kali.org/kali-images/kali-2024.2/kali-linux-2024.2-installer-amd64.iso)
kali_matches = re.findall(r'href="(https://cdimage\.kali\.org/kali-images/[^"]+-installer-amd64\.iso)"', kali_html)
if kali_matches:
    latest_kali = kali_matches[0]
    print(f"✅ Found latest Kali: {latest_kali}")
    if "kali" not in catalog: catalog["kali"] = {}
    catalog["kali"]["isoUrl"] = latest_kali
else:
    print("❌ Failed to scrape Kali")

print("Scraping Manjaro KDE...")
manjaro_html = get_html("https://manjaro.org/download/")
# Manjaro links typically point to github releases or download.manjaro.org
manjaro_matches = re.findall(r'href="(https://download\.manjaro\.org/kde/[^"]+\.iso)"', manjaro_html)
if manjaro_matches:
    latest_manjaro = manjaro_matches[0]
    print(f"✅ Found latest Manjaro: {latest_manjaro}")
    if "manjaro" not in catalog: catalog["manjaro"] = {}
    catalog["manjaro"]["isoUrl"] = latest_manjaro
else:
    print("❌ Failed to scrape Manjaro")

print("Saving master catalog.json...")
with open(CATALOG_PATH, "w") as f:
    json.dump(catalog, f, indent=2)

print("🎉 Auto-Scraper completed successfully!")
