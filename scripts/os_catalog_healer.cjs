const fs = require('fs');
const https = require('https');
const http = require('http');
const url = require('url');
const path = require('path');

const CATALOG_PATH = path.join(__dirname, '..', 'catalog.json');

// God-Tier Check URL Function with Recursive Redirect Following
function checkUrl(testUrl, redirectCount = 0) {
  return new Promise((resolve) => {
    if (redirectCount > 5) {
      resolve({ url: testUrl, status: 'TOO_MANY_REDIRECTS' });
      return;
    }

    const parsed = new url.URL(testUrl);
    const lib = parsed.protocol === 'https:' ? https : http;
    
    // Some mirrors block HEAD requests, but most allow them. 
    // We add user-agent to bypass basic bot blockers.
    const options = {
      method: 'HEAD',
      timeout: 8000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) OSwitch/1.0' }
    };

    const req = lib.request(testUrl, options, (res) => {
      // If it's a redirect, recursively follow it
      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        if (!res.headers.location) {
          resolve({ url: testUrl, status: 'INVALID_REDIRECT' });
          return;
        }
        const redirectUrl = new url.URL(res.headers.location, testUrl).href;
        console.log(`    -> Following Redirect: ${redirectUrl}`);
        resolve(checkUrl(redirectUrl, redirectCount + 1));
        return;
      }
      
      resolve({ url: testUrl, status: res.statusCode });
    });

    req.on('error', (err) => resolve({ url: testUrl, status: `ERROR: ${err.message}` }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ url: testUrl, status: 'TIMEOUT' });
    });
    
    req.end();
  });
}

// Advanced Multi-Dimensional Version Bumping
async function attemptVersionBump(originalUrl) {
  // Matches standard versions like 22.04 or 40.1, AND trailing build hashes like _34.iso
  const versionRegex = /(\d+)\.(\d+)(?:\.(\d+))?/;
  const buildRegex = /_(\d+)\.iso$/;
  
  const match = originalUrl.match(versionRegex);
  const buildMatch = originalUrl.match(buildRegex);
  
  const candidateVersions = [];

  if (match) {
    const major = parseInt(match[1]);
    const minor = parseInt(match[2]);
    const patch = match[3] ? parseInt(match[3]) : null;

    if (patch !== null) {
      for (let i = 1; i <= 5; i++) candidateVersions.push(originalUrl.replace(match[0], `${major}.${minor}.${patch + i}`));
    }
    for (let i = 1; i <= 5; i++) {
      candidateVersions.push(originalUrl.replace(match[0], `${major}.${minor + i}${patch !== null ? '.0' : ''}`));
    }
    for (let i = 1; i <= 3; i++) {
      candidateVersions.push(originalUrl.replace(match[0], `${major + i}.0${patch !== null ? '.0' : ''}`));
    }
  }

  // If there's an ISO build number (like Pop!_OS), bump that specifically
  if (buildMatch) {
    const buildNum = parseInt(buildMatch[1]);
    for (let i = 1; i <= 10; i++) {
      candidateVersions.push(originalUrl.replace(buildMatch[0], `_${buildNum + i}.iso`));
    }
  }

  // Deduplicate candidates
  const uniqueCandidates = [...new Set(candidateVersions)];

  for (const candidateUrl of uniqueCandidates) {
    console.log(`  [HEALER] Testing candidate: ${candidateUrl}`);
    const res = await checkUrl(candidateUrl);
    
    if (res.status === 200) {
      console.log(`  [HEALER] ✅ SUCCESS! Found new valid ISO: ${candidateUrl}`);
      return candidateUrl;
    }
  }
  return null;
}

async function run() {
  console.log("⚡ OSwitch God-Tier Auto-Healer ⚡");
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
    
    process.stdout.write(`Checking [${key}]... \n`);
    const res = await checkUrl(os.isoUrl);
    
    if (res.status === 200) {
      console.log(`  [${key}] ✅ OK (200)`);
    } else {
      console.log(`  [${key}] ❌ BROKEN (${res.status})`);
      console.log(`  -> Triggering Advanced Auto-Healer for ${key}...`);
      
      const newUrl = await attemptVersionBump(os.isoUrl);
      if (newUrl) {
        catalog[key].isoUrl = newUrl;
        updatedCount++;
      } else {
        console.log(`  -> ⚠️ Healer exhausted. Manual intervention required.`);
      }
    }
  }
  
  if (updatedCount > 0) {
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));
    console.log(`\n✅ Saved ${updatedCount} healed links to catalog.json`);
  } else {
    console.log(`\n✅ Catalog is fully verified and healthy.`);
  }
}

run();
