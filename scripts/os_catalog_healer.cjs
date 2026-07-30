const fs = require('fs');
const https = require('https');
const http = require('http');
const url = require('url');
const path = require('path');

const CATALOG_PATH = path.join(__dirname, '..', 'catalog.json');

// Helper to check if a URL is alive
function checkUrl(testUrl) {
  return new Promise((resolve) => {
    const parsed = new url.URL(testUrl);
    const lib = parsed.protocol === 'https:' ? https : http;
    const req = lib.request(testUrl, { method: 'HEAD', timeout: 5000 }, (res) => {
      resolve({ url: testUrl, status: res.statusCode });
    });
    req.on('error', () => resolve({ url: testUrl, status: 'ERROR' }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ url: testUrl, status: 'TIMEOUT' });
    });
    req.end();
  });
}

// Auto-Healer Heuristic: Version Bumping
async function attemptVersionBump(originalUrl) {
  const versionRegex = /(\d+)\.(\d+)(?:\.(\d+))?/;
  const match = originalUrl.match(versionRegex);
  
  if (!match) return null;
  
  const major = parseInt(match[1]);
  const minor = parseInt(match[2]);
  const patch = match[3] ? parseInt(match[3]) : null;
  
  const candidateVersions = [];
  
  if (patch !== null) {
    for (let i = 1; i <= 5; i++) candidateVersions.push(`${major}.${minor}.${patch + i}`);
  }
  for (let i = 1; i <= 5; i++) {
    candidateVersions.push(`${major}.${minor + i}${patch !== null ? '.0' : ''}`);
  }
  for (let i = 1; i <= 3; i++) {
    candidateVersions.push(`${major + i}.0${patch !== null ? '.0' : ''}`);
  }

  for (const candidate of candidateVersions) {
    const candidateUrl = originalUrl.replace(match[0], candidate);
    console.log(`  [HEALER] Testing bumped candidate: ${candidateUrl}`);
    const res = await checkUrl(candidateUrl);
    
    if (res.status === 200 || res.status === 301 || res.status === 302) {
      console.log(`  [HEALER] ? SUCCESS! Found new valid ISO: ${candidateUrl}`);
      return candidateUrl;
    }
  }
  return null;
}

async function run() {
  console.log("? OSwitch Cloud Registry Auto-Healer ?");
  console.log("=========================================");
  
  if (!fs.existsSync(CATALOG_PATH)) {
    console.error("CRITICAL: catalog.json not found!");
    process.exit(1);
  }

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  const osKeys = Object.keys(catalog);
  let updatedCount = 0;
  
  for (const key of osKeys) {
    const os = catalog[key];
    if (!os.isoUrl || os.isoUrl.includes("example.com")) continue;
    
    process.stdout.write(`Checking [${key}]... `);
    const res = await checkUrl(os.isoUrl);
    
    if (res.status === 200 || res.status === 301 || res.status === 302) {
      console.log(`OK (${res.status})`);
    } else {
      console.log(`BROKEN (${res.status})`);
      console.log(`  -> Triggering Auto-Healer for ${key}...`);
      
      const newUrl = await attemptVersionBump(os.isoUrl);
      if (newUrl) {
        catalog[key].isoUrl = newUrl;
        updatedCount++;
      } else {
        console.log(`  -> ? Healer failed to find new version. Manual intervention required.`);
      }
    }
  }
  
  if (updatedCount > 0) {
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));
    console.log(`\n? Saved ${updatedCount} healed links to catalog.json`);
  } else {
    console.log(`\n? No links were auto-healed.`);
  }
}

run();
