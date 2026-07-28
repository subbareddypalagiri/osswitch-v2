const fs = require('fs');

async function scrapeUbuntuLatest() {
    console.log("🤖 [Cloud Bot] Waking up...");
    console.log("🤖 [Cloud Bot] Connecting to https://releases.ubuntu.com/24.04/");
    
    try {
        const response = await fetch("https://releases.ubuntu.com/24.04/");
        const html = await response.text();
        
        // Regex to hunt for the latest desktop amd64 iso link in the raw HTML
        console.log("🤖 [Cloud Bot] Scanning HTML for latest ISO file...");
        const regex = /<a href="(ubuntu-24\.04(?:\.\d+)?-desktop-amd64\.iso)">/g;
        
        let match;
        let latestIso = null;
        
        while ((match = regex.exec(html)) !== null) {
            latestIso = match[1];
        }
        
        if (latestIso) {
            const finalUrl = `https://releases.ubuntu.com/24.04/${latestIso}`;
            console.log(`✅ [Cloud Bot] SCRAPE SUCCESS! Found new link: ${finalUrl}`);
            
            const fakeCatalog = {
                "ubuntu": {
                    "isoUrl": finalUrl,
                    "last_updated": new Date().toISOString()
                }
            };
            
            fs.writeFileSync('catalog.json', JSON.stringify(fakeCatalog, null, 2));
            console.log("✅ [Cloud Bot] Successfully updated catalog.json (Ready for GitHub push!)");
        } else {
            console.log("❌ [Cloud Bot] Scrape failed. Could not find ISO link.");
        }
    } catch (e) {
        console.log("❌ [Cloud Bot] Server Error: " + e.message);
    }
}

scrapeUbuntuLatest();
