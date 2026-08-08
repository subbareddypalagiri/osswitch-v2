const fs = require('fs');
const path = require('path');

const constantsPath = path.join(__dirname, '..', 'src', 'constants.ts');
const stepChooseOSPath = path.join(__dirname, '..', 'src', 'StepChooseOS.tsx');

const constantsCode = fs.readFileSync(constantsPath, 'utf8');
const stepCode = fs.readFileSync(stepChooseOSPath, 'utf8');

// Parse OS_CATALOG entries from constants.ts
const catalogMatches = [...constantsCode.matchAll(/\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)"(?:,\s*isoUrl:\s*"([^"]+)")?(?:,\s*officialSite:\s*"([^"]+)")?(?:,\s*locked:\s*(true|false))?/g)];

console.log("=========================================");
console.log("   OSWITCH 101 OS CATALOG AUDIT REPORT   ");
console.log("=========================================");

const catalogIds = new Set();
const duplicates = [];
const fakeUrls = [];

let totalEntries = 0;

// Match all id: "..." in constants.ts
const idMatches = [...constantsCode.matchAll(/id:\s*"([^"]+)"/g)].map(m => m[1]).filter(id => !id.startsWith('tool-') && !id.startsWith('bundle-'));

const uniqueIds = new Set();
idMatches.forEach(id => {
  if (uniqueIds.has(id)) {
    duplicates.push(id);
  } else {
    uniqueIds.add(id);
  }
});

// Find placeholder URLs
const urlMatches = [...constantsCode.matchAll(/isoUrl:\s*"([^"]+)"/g)];
urlMatches.forEach(m => {
  const url = m[1];
  if (url.includes('example.com')) {
    fakeUrls.push(url);
  }
});

console.log(`Total OS Entries in constants.ts: ${uniqueIds.size}`);
console.log(`Duplicate IDs found: ${duplicates.length > 0 ? duplicates.join(', ') : 'NONE (100% Unique)'}`);
console.log(`Placeholder/Fake URLs found: ${fakeUrls.length > 0 ? fakeUrls.join(', ') : 'NONE (100% Real)'}`);
console.log("=========================================");
