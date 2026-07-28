/**
 * OSwitch God-Level OS Catalog Scraper
 * Runs weekly via GitHub Actions to keep all ISO URLs fresh.
 * Output: catalog.json (committed back to repo)
 */

const fs = require('fs');

const CATALOG = [
  // ── Linux ──────────────────────────────────────────────────
  { id: "ubuntu",     name: "Ubuntu 24.04 LTS",         scrapeUrl: "https://releases.ubuntu.com/24.04/",         regex: /href="(ubuntu-24\.04(?:\.\d+)?-desktop-amd64\.iso)"/, base: "https://releases.ubuntu.com/24.04/",    officialSite: "https://ubuntu.com/download/desktop" },
  { id: "fedora",     name: "Fedora Workstation 40",     scrapeUrl: "https://fedoraproject.org/workstation/download/", regex: null, staticUrl: "https://download.fedoraproject.org/pub/fedora/linux/releases/40/Workstation/x86_64/iso/Fedora-Workstation-Live-x86_64-40-1.14.iso", officialSite: "https://fedoraproject.org/workstation/download/" },
  { id: "debian",     name: "Debian 12",                 scrapeUrl: null, staticUrl: "https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-12.5.0-amd64-netinst.iso",    officialSite: "https://www.debian.org/distrib/" },
  { id: "kali",       name: "Kali Linux 2024.2",         scrapeUrl: null, staticUrl: "https://cdimage.kali.org/kali-2024.2/kali-linux-2024.2-installer-amd64.iso",                   officialSite: "https://www.kali.org/get-kali/#kali-installer-images" },
  { id: "arch",       name: "Arch Linux",                scrapeUrl: "https://archlinux.org/download/",           regex: /href="(https:\/\/.*?archlinux-\d{4}\.\d{2}\.\d{2}-x86_64\.iso)"/, base: "", officialSite: "https://archlinux.org/download/" },
  { id: "manjaro",    name: "Manjaro GNOME",             scrapeUrl: null, staticUrl: "https://download.manjaro.org/gnome/23.1.4/manjaro-gnome-23.1.4-231229-linux66.iso",             officialSite: "https://manjaro.org/download/" },
  { id: "mint",       name: "Linux Mint 21.3",           scrapeUrl: null, staticUrl: "https://mirrors.edge.kernel.org/linuxmint/stable/21.3/linuxmint-21.3-cinnamon-64bit.iso",        officialSite: "https://www.linuxmint.com/download.php" },
  { id: "pop",        name: "Pop!_OS 22.04",             scrapeUrl: null, staticUrl: "https://iso.pop-os.org/22.04/amd64/intel/pop-os_22.04_amd64_intel_34.iso",                      officialSite: "https://pop.system76.com/" },
  { id: "zorin",      name: "Zorin OS 17",               scrapeUrl: null, staticUrl: "https://releases.zorinos.com/17/Zorin-OS-17-Core-64-bit.iso",                                   officialSite: "https://zorin.com/os/download/" },
  { id: "opensuse",   name: "openSUSE Leap 15.5",        scrapeUrl: null, staticUrl: "https://download.opensuse.org/distribution/leap/15.5/iso/openSUSE-Leap-15.5-DVD-x86_64.iso",    officialSite: "https://get.opensuse.org/leap/" },
  // ── Security ────────────────────────────────────────────────
  { id: "parrot",     name: "Parrot OS Security",        scrapeUrl: null, staticUrl: "https://deb.parrot.sh/parrot/iso/6.1/Parrot-security-6.1_amd64.iso",                            officialSite: "https://www.parrotsec.org/download/" },
  { id: "tails",      name: "Tails OS",                  scrapeUrl: null, staticUrl: "https://download.tails.net/tails/stable/tails-amd64-6.2/tails-amd64-6.2.img",                  officialSite: "https://tails.boum.org/install/" },
  { id: "blackarch",  name: "BlackArch Linux",           scrapeUrl: null, staticUrl: "https://ftp.halifax.rwth-aachen.de/blackarch/iso/blackarch-linux-full-2024.01.01-x86_64.iso",   officialSite: "https://blackarch.org/downloads.html" },
  // ── Windows ─────────────────────────────────────────────────
  { id: "win11",      name: "Windows 11 Pro",            scrapeUrl: null, staticUrl: "https://software.download.prss.microsoft.com/db/Win11_English_x64v2.iso",                       officialSite: "https://www.microsoft.com/software-download/windows11" },
  { id: "win10",      name: "Windows 10",                scrapeUrl: null, staticUrl: "https://software.download.prss.microsoft.com/db/Win10_22H2_English_x64.iso",                    officialSite: "https://www.microsoft.com/software-download/windows10" },
  { id: "macos",      name: "macOS Sonoma",              scrapeUrl: null, staticUrl: null,  officialSite: "https://support.apple.com/en-us/102662" },
  // ── Server ──────────────────────────────────────────────────
  { id: "rockylinux", name: "Rocky Linux 9",             scrapeUrl: null, staticUrl: "https://download.rockylinux.org/pub/rocky/9/isos/x86_64/Rocky-9.3-x86_64-dvd.iso",              officialSite: "https://rockylinux.org/download/" },
  { id: "almalinux",  name: "AlmaLinux 9",               scrapeUrl: null, staticUrl: "https://repo.almalinux.org/almalinux/9/isos/x86_64/AlmaLinux-9.3-x86_64-dvd.iso",              officialSite: "https://almalinux.org/get-almalinux/" },
  { id: "ubuntu_server", name: "Ubuntu Server 24.04",   scrapeUrl: null, staticUrl: "https://releases.ubuntu.com/24.04/ubuntu-24.04-live-server-amd64.iso",                          officialSite: "https://ubuntu.com/download/server" },
  { id: "freebsd",    name: "FreeBSD 14",                scrapeUrl: null, staticUrl: "https://download.freebsd.org/releases/amd64/amd64/ISO-IMAGES/14.0/FreeBSD-14.0-RELEASE-amd64-dvd1.iso", officialSite: "https://www.freebsd.org/where/" },
];

async function scrapeUrl(entry) {
  if (!entry.scrapeUrl || !entry.regex) return entry.staticUrl;
  try {
    const res = await fetch(entry.scrapeUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (OSwitch Bot/1.0)' }, signal: AbortSignal.timeout(10000) });
    const html = await res.text();
    const match = entry.regex.exec(html);
    if (match) {
      const href = match[1];
      return href.startsWith('http') ? href : entry.base + href;
    }
  } catch (e) {
    console.warn(`⚠️  Scrape failed for ${entry.id}: ${e.message}`);
  }
  return entry.staticUrl;
}

async function main() {
  console.log('🤖 OSwitch Cloud Bot v2.0 — Starting catalog refresh...\n');
  const catalog = {};
  
  for (const entry of CATALOG) {
    process.stdout.write(`  Scanning ${entry.name}... `);
    const isoUrl = await scrapeUrl(entry);
    catalog[entry.id] = {
      name: entry.name,
      isoUrl: isoUrl || null,
      officialSite: entry.officialSite,
      last_updated: new Date().toISOString()
    };
    console.log(isoUrl ? `✅` : `⚠️  No URL found`);
  }

  fs.writeFileSync('catalog.json', JSON.stringify(catalog, null, 2));
  console.log('\n✅ catalog.json updated successfully!');
}

main();
