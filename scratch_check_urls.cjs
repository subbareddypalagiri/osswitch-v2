const fs = require('fs');

const constantsFile = fs.readFileSync('c:/Users/subba/OneDrive/Desktop/project -car/os-sum/oswitch-v2/src/constants.ts', 'utf8');

// Regex to extract all isoUrl values
const urlRegex = /isoUrl:\s*"([^"]+)"/g;
let match;
const urls = [];

while ((match = urlRegex.exec(constantsFile)) !== null) {
    if (match[1] && !match[1].includes("fake-url")) {
        urls.push(match[1]);
    }
}

async function checkUrls() {
    console.log(`Checking ${urls.length} URLs...`);
    let passed = 0;
    let failed = 0;
    
    for (const url of urls) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(url, { 
                method: 'HEAD',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok || response.status === 403 || response.status === 405 || response.status === 302 || response.status === 301) {
                // Some servers block HEAD requests (403/405) but GET works, or redirect (301/302). We count these as likely valid.
                passed++;
            } else {
                console.log(`❌ Failed: ${url} (Status: ${response.status})`);
                failed++;
            }
        } catch (error) {
            console.log(`❌ Error: ${url} (${error.message})`);
            failed++;
        }
    }
    
    console.log(`\nFinished: ${passed} Passed, ${failed} Failed.`);
}

checkUrls();
