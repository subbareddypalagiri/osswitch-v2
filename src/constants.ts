export interface OSConfig {
  id: string;
  name: string;
  category: "Linux" | "Windows" | "Security" | "Server" | "macOS" | "BSD" | "Other";
  isoUrl?: string;
  officialSite?: string;
  locked?: boolean;
}

export const OS_CATALOG: OSConfig[] = [
  { id: "ubuntu", name: "Ubuntu 24.04 LTS", category: "Linux", isoUrl: "https://releases.ubuntu.com/24.04/ubuntu-24.04.4-desktop-amd64.iso", officialSite: "https://ubuntu.com/download/desktop" },
  { id: "kali", name: "Kali Linux 2024.2", category: "Security", isoUrl: "https://cdimage.kali.org/kali-images/current/kali-linux-2026.2-installer-amd64.iso", officialSite: "https://www.kali.org/get-kali/#kali-installer-images" },
  { id: "win11", name: "Windows 11 Pro", category: "Windows", isoUrl: "https://software.download.prss.microsoft.com/db/Win11_English_x64v2.iso", officialSite: "https://www.microsoft.com/software-download/windows11", locked: true },
  { id: "fedora", name: "Fedora Workstation 40", category: "Linux", isoUrl: "https://download.fedoraproject.org/pub/fedora/linux/releases/40/Workstation/x86_64/iso/Fedora-Workstation-Live-x86_64-40-1.14.iso", officialSite: "https://fedoraproject.org/workstation/download" },
  { id: "pop", name: "Pop!_OS 22.04", category: "Linux", isoUrl: "https://iso.pop-os.org/22.04/amd64/intel/pop-os_22.04_amd64_intel_34.iso", officialSite: "https://pop.system76.com/" },
  { id: "debian", name: "Debian 12", category: "Linux", isoUrl: "https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-13.6.0-amd64-netinst.iso", officialSite: "https://www.debian.org/distrib/" },
  { id: "arch", name: "Arch Linux", category: "Linux", isoUrl: "https://geo.mirror.pkgbuild.com/iso/latest/archlinux-x86_64.iso", officialSite: "https://archlinux.org/download/" },
  { id: "mint", name: "Linux Mint 21.3", category: "Linux", isoUrl: "https://mirrors.kernel.org/linuxmint/stable/21.3/linuxmint-21.3-cinnamon-64bit.iso", officialSite: "https://linuxmint.com/download.php" },
  { id: "manjaro", name: "Manjaro KDE", category: "Linux", isoUrl: "https://download.manjaro.org/kde/23.1.4/manjaro-kde-23.1.4-240406-linux66.iso", officialSite: "https://manjaro.org/download/" },
  { id: "centos", name: "CentOS Stream 9", category: "Server", isoUrl: "https://mirrors.centos.org/mirrorlist?path=9-stream/BaseOS/x86_64/iso/CentOS-Stream-9-latest-x86_64-dvd1.iso", officialSite: "https://www.centos.org/download/" },
  { id: "rocky", name: "Rocky Linux 9", category: "Server", isoUrl: "https://download.rockylinux.org/pub/rocky/9/isos/x86_64/Rocky-9.3-x86_64-dvd.iso", officialSite: "https://rockylinux.org/download" },
  { id: "almalinux", name: "AlmaLinux 9", category: "Server", isoUrl: "https://repo.almalinux.org/almalinux/9/isos/x86_64/AlmaLinux-9.3-x86_64-dvd.iso", officialSite: "https://almalinux.org/get-almalinux/" },
  { id: "opensuse", name: "openSUSE Tumbleweed", category: "Linux", isoUrl: "https://download.opensuse.org/tumbleweed/iso/openSUSE-Tumbleweed-DVD-x86_64-Current.iso", officialSite: "https://get.opensuse.org/tumbleweed/" },
  { id: "chromeos", name: "ChromeOS Flex", category: "Linux", isoUrl: "https://dl.google.com/chromeos-flex/images/latest.bin.zip", officialSite: "https://chromeenterprise.google/os/chromeosflex/" },
  { id: "oracle", name: "Oracle Linux", category: "Server", isoUrl: "https://yum.oracle.com/ISOS/OracleLinux/OL9/u3/x86_64/OracleLinux-R9-U3-x86_64-dvd.iso", officialSite: "https://www.oracle.com/linux/" },
  { id: "sles", name: "SUSE Linux Enterprise", category: "Server", isoUrl: "https://www.suse.com/download/sles/" },
  { id: "tails", name: "Tails 6.3", category: "Security", isoUrl: "https://mirrors.wikimedia.org/tails/stable/tails-amd64-6.3/tails-amd64-6.3.iso" },
  { id: "parrot", name: "Parrot Security 6.0", category: "Security", isoUrl: "https://deb.parrot.sh/parrot/iso/6.0/Parrot-security-6.0_amd64.iso" },
  { id: "blackarch", name: "BlackArch Linux", category: "Security", isoUrl: "https://blackarch.org/blackarch-linux-live-2023.12.01-x86_64.iso" },
  { id: "win10", name: "Windows 10 Pro", category: "Windows", isoUrl: "https://software.download.prss.microsoft.com/db/Win10_English_x64.iso", locked: true },
  { id: "winserver", name: "Windows Server 2022", category: "Server", isoUrl: "https://go.microsoft.com/fwlink/p/?LinkID=2164993", locked: true },
  { id: "ubuntu-server", name: "Ubuntu Server 24.04", category: "Server", isoUrl: "https://releases.ubuntu.com/24.04/ubuntu-24.04-live-server-amd64.iso" },
  { id: "alpine", name: "Alpine Linux", category: "Linux", isoUrl: "https://dl-cdn.alpinelinux.org/alpine/v3.19/releases/x86_64/alpine-standard-3.19.1-x86_64.iso" },
  { id: "nixos", name: "NixOS 24.05", category: "Linux", isoUrl: "https://channels.nixos.org/nixos-24.05/latest-nixos-gnome-x86_64-linux.iso" },
  { id: "elementary", name: "elementary OS 7.1", category: "Linux", isoUrl: "https://ams3.dl.elementary.io/elementaryos-7.1-stable.20230926rc.iso" },
  { id: "zorin", name: "Zorin OS 17.1", category: "Linux", isoUrl: "https://mirrors.edge.kernel.org/zorinos/17/Zorin-OS-17.1-Core-64-bit.iso" },
  { id: "deepin", name: "Deepin 20.9", category: "Linux", isoUrl: "https://cdimage.deepin.com/releases/20.9/deepin-desktop-community-20.9-amd64.iso" },
  { id: "garuda", name: "Garuda Linux Dr460nized", category: "Linux", isoUrl: "https://iso.builds.garudalinux.org/iso/garuda/dr460nized/231029/garuda-dr460nized-linux-zen-231029.iso" },
  { id: "endeavouros", name: "EndeavourOS", category: "Linux", isoUrl: "https://mirrors.kernel.org/endeavouros/iso/EndeavourOS_Galileo-Neo-2024.01.25.iso" },
  { id: "mxlinux", name: "MX Linux 23.2", category: "Linux", isoUrl: "https://sourceforge.net/projects/mx-linux/files/Final/MX-23.2_x64.iso/download" },
  { id: "linuxlite", name: "Linux Lite 6.8", category: "Linux", isoUrl: "https://osdn.net/dl/linuxlite/linux-lite-6.8-64bit.iso" },
  { id: "peppermint", name: "Peppermint OS", category: "Linux", isoUrl: "https://peppermintos.com/iso/Peppermint-12-20240101-amd64.iso" },
  { id: "kubuntu", name: "Kubuntu 24.04", category: "Linux", isoUrl: "https://cdimage.ubuntu.com/kubuntu/releases/24.04/release/kubuntu-24.04-desktop-amd64.iso" },
  { id: "xubuntu", name: "Xubuntu 24.04", category: "Linux", isoUrl: "https://cdimage.ubuntu.com/xubuntu/releases/24.04/release/xubuntu-24.04-desktop-amd64.iso" },
  { id: "lubuntu", name: "Lubuntu 24.04", category: "Linux", isoUrl: "https://cdimage.ubuntu.com/lubuntu/releases/24.04/release/lubuntu-24.04-desktop-amd64.iso" },
  { id: "bodhi", name: "Bodhi Linux 7.0", category: "Linux", isoUrl: "https://sourceforge.net/projects/bodhl/files/7.0.0/bodhi-7.0.0-64.iso/download" },
  { id: "puppy", name: "Puppy Linux", category: "Linux", isoUrl: "https://distro.ibiblio.org/puppylinux/puppy-fossa/fossapup64-9.5.iso" },
  { id: "antiX", name: "antiX 23.1", category: "Linux", isoUrl: "https://sourceforge.net/projects/antix-linux/files/Final/antiX-23.1/antiX-23.1_x64-full.iso/download" },
  { id: "slax", name: "Slax", category: "Linux", isoUrl: "https://github.com/Tomas-M/slax/releases/download/15.0.0/slax-64bit-15.0.0.iso" },
  { id: "tinycore", name: "Tiny Core Linux", category: "Linux", isoUrl: "http://tinycorelinux.net/14.x/x86_64/release/CorePure64-14.0.iso" },
  { id: "qubes", name: "Qubes OS 4.2.1", category: "Security", isoUrl: "https://mirrors.edge.kernel.org/qubes/iso/Qubes-R4.2.1-x86_64.iso" },
  { id: "whonix", name: "Whonix XFCE", category: "Security", isoUrl: "https://whonix.org/wiki/Special:Download?os=windows" },
  { id: "truenas", name: "TrueNAS SCALE", category: "Server", isoUrl: "https://download.truenas.com/TrueNAS-SCALE-Cobia/23.10.2/TrueNAS-SCALE-23.10.2.iso" },
  { id: "freebsd", name: "FreeBSD", category: "Server", isoUrl: "https://download.freebsd.org/releases/amd64/amd64/ISO-IMAGES/14.0/FreeBSD-14.0-RELEASE-amd64-disc1.iso" },
  { id: "reactos", name: "ReactOS", category: "Windows", isoUrl: "https://reactos.org/getbuilds/ReactOS-0.4.15-live.iso" },
  { id: "haiku", name: "Haiku OS", category: "Linux", isoUrl: "https://s3.wasabisys.com/haiku-nightly/x86_64/haiku-master-hrev57662-x86_64-anyboot.iso" },
  { id: "openbsd", name: "OpenBSD", category: "Server", isoUrl: "https://cdn.openbsd.org/pub/OpenBSD/7.5/amd64/install75.iso" },
  { id: "netbsd", name: "NetBSD", category: "Server", isoUrl: "https://cdn.netbsd.org/pub/NetBSD/NetBSD-10.0/images/NetBSD-10.0-amd64.iso" },
  { id: "macos", name: "macOS", category: "macOS", isoUrl: "https://example.com/macos-fake-url.iso", officialSite: "https://support.apple.com/en-us/102662", locked: true },
  { id: "omnios", name: "OmniOS", category: "Server", isoUrl: "https://omnios.org/download/omnios-r151048.iso" },
    { id: "gentoo", name: "Gentoo", category: "Linux", isoUrl: "https://distfiles.gentoo.org/releases/amd64/autobuilds/20240407T170428Z/install-amd64-minimal-20240407T170428Z.iso" },
  { id: "slackware", name: "Slackware", category: "Linux", isoUrl: "https://mirrors.slackware.com/slackware/slackware-iso/slackware64-15.0-iso/slackware64-15.0-install-dvd.iso" },
  { id: "kdeneon", name: "KDE Neon", category: "Linux", isoUrl: "https://files.kde.org/neon/images/user/20240411-0714/neon-user-20240411-0714.iso" },
  { id: "nobara", name: "Nobara Linux", category: "Linux", isoUrl: "https://nobaraproject.org/download/nobara-39-official.iso" },
  { id: "vanillaos", name: "Vanilla OS", category: "Linux", isoUrl: "https://github.com/Vanilla-OS/os/releases/download/v2.0.0/VanillaOS-2.0.0.iso" },
  { id: "blissos", name: "Bliss OS", category: "Linux", isoUrl: "https://sourceforge.net/projects/blissos-dev/files/BlissOS/BlissOS-16/BlissOS-16.iso" },
  { id: "templeos", name: "TempleOS", category: "Server", isoUrl: "https://templeos.org/Downloads/TempleOS.ISO" },
  { id: "kolibrios", name: "KolibriOS", category: "Linux", isoUrl: "http://kolibrios.org/releases/KolibriOS-0.7.7.0.iso" }
];

export interface SoftwareItem {
  id: string;
  name: string;
  defaultSelected: boolean;
}

export interface BundleConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  items: SoftwareItem[];
}

export const BUNDLES: BundleConfig[] = [
  {
    id: "dev", name: "End-to-End Developer", icon: "💻", description: "Everything you need to write, build, and run code.",
    items: [
      { id: "Microsoft.VisualStudioCode", name: "VS Code", defaultSelected: true },
      { id: "Git.Git", name: "Git", defaultSelected: true },
      { id: "Python.Python.3.12", name: "Python 3.11", defaultSelected: true },
      { id: "OpenJS.NodeJS", name: "Node.js", defaultSelected: true },
      { id: "Docker.DockerDesktop", name: "Docker Desktop", defaultSelected: false },
      { id: "Postman.Postman", name: "Postman", defaultSelected: false },
      { id: "Microsoft.WindowsTerminal", name: "Windows Terminal", defaultSelected: true },
      { id: "Microsoft.VisualStudio.2022.Community", name: "Visual Studio Community", defaultSelected: false },
      { id: "JetBrains.IntelliJIDEA.Community", name: "IntelliJ IDEA", defaultSelected: false },
      { id: "GitHub.GitHubDesktop", name: "GitHub Desktop", defaultSelected: false }
    ]
  },
  {
    id: "creator", name: "End-to-End Creator", icon: "🎨", description: "World-class tools for 3D, Video, and Audio production.",
    items: [
      { id: "OBSProject.OBSStudio", name: "OBS Studio", defaultSelected: true },
      { id: "BlenderFoundation.Blender", name: "Blender", defaultSelected: true },
      { id: "GIMP.GIMP", name: "GIMP", defaultSelected: true },
      { id: "Audacity.Audacity", name: "Audacity", defaultSelected: true },
      { id: "Figma.Figma", name: "Figma", defaultSelected: false },
      { id: "HandBrake.HandBrake", name: "HandBrake", defaultSelected: false },
      { id: "KDE.Kdenlive", name: "Kdenlive Video Editor", defaultSelected: false },
      { id: "KDE.Krita", name: "Krita", defaultSelected: false },
      { id: "Inkscape.Inkscape", name: "Inkscape", defaultSelected: false }
    ]
  },
  {
    id: "gaming", name: "Ultimate Gaming", icon: "🎮", description: "All the launchers, comms, and drivers for gamers.",
    items: [
      { id: "Valve.Steam", name: "Steam", defaultSelected: true },
      { id: "Discord.Discord", name: "Discord", defaultSelected: true },
      { id: "EpicGames.EpicGamesLauncher", name: "Epic Games Launcher", defaultSelected: false },
      { id: "GOG.Galaxy", name: "GOG Galaxy", defaultSelected: false },
      { id: "Nvidia.GeForceNow", name: "GeForce NOW", defaultSelected: false },
      { id: "ElectronicArts.EADesktop", name: "EA app", defaultSelected: false },
      { id: "Ubisoft.Connect", name: "Ubisoft Connect", defaultSelected: false },
      { id: "TeamSpeakSystems.TeamSpeakClient", name: "TeamSpeak 3", defaultSelected: false }
    ]
  },
  {
    id: "office", name: "Office & Productivity", icon: "💼", description: "Docs, spreadsheets, and seamless teamwork tools.",
    items: [
      { id: "TheDocumentFoundation.LibreOffice", name: "LibreOffice", defaultSelected: true },
      { id: "SlackTechnologies.Slack", name: "Slack", defaultSelected: true },
      { id: "Zoom.Zoom", name: "Zoom", defaultSelected: true },
      { id: "Microsoft.Teams", name: "Microsoft Teams", defaultSelected: false },
      { id: "Adobe.Acrobat.Reader.64-bit", name: "Acrobat Reader", defaultSelected: true },
      { id: "Notion.Notion", name: "Notion", defaultSelected: false },
      { id: "Evernote.Evernote", name: "Evernote", defaultSelected: false },
      { id: "AnyDesk.AnyDesk", name: "AnyDesk", defaultSelected: false }
    ]
  },
  {
    id: "essentials", name: "PC Essentials", icon: "🛠️", description: "The must-haves for a clean and efficient PC experience.",
    items: [
      { id: "Google.Chrome", name: "Google Chrome", defaultSelected: true },
      { id: "VideoLAN.VLC", name: "VLC Player", defaultSelected: true },
      { id: "7zip.7zip", name: "7-Zip", defaultSelected: true },
      { id: "9NKSQGP7F2NH", name: "WhatsApp", defaultSelected: true },
      { id: "Spotify.Spotify", name: "Spotify", defaultSelected: false },
      { id: "Microsoft.PowerToys", name: "PowerToys", defaultSelected: false },
      { id: "Bitwarden.Bitwarden", name: "Bitwarden", defaultSelected: false },
      { id: "voidtools.Everything", name: "Everything Search", defaultSelected: true }
    ]
  },
  {
    id: "security", name: "Cyber Security & Privacy", icon: "🔐", description: "VPNs, crypto tools, and network analysis.",
    items: [
      { id: "TorProject.TorBrowser", name: "Tor Browser", defaultSelected: true },
      { id: "Proton.ProtonVPN", name: "ProtonVPN", defaultSelected: true },
      { id: "Malwarebytes.Malwarebytes", name: "Malwarebytes", defaultSelected: true },
      { id: "WiresharkFoundation.Wireshark", name: "Wireshark", defaultSelected: false },
      { id: "IDRIX.VeraCrypt", name: "VeraCrypt", defaultSelected: false },
      { id: "KeePassXCTeam.KeePassXC", name: "KeePassXC", defaultSelected: false },
      { id: "Insecure.Nmap", name: "Nmap", defaultSelected: false }
    ]
  },
  {
    id: "system", name: "System Tweaking", icon: "⚙️", description: "Hardware diagnostics and OS-level utilities.",
    items: [
      { id: "CPUID.CPU-Z", name: "CPU-Z", defaultSelected: true },
      { id: "Rufus.Rufus", name: "Rufus", defaultSelected: true },
      { id: "CrystalDewWorld.CrystalDiskInfo", name: "CrystalDiskInfo", defaultSelected: true },
      { id: "REALiX.HWiNFO", name: "HWiNFO", defaultSelected: false },
      { id: "TechPowerUp.GPU-Z", name: "GPU-Z", defaultSelected: false },
      { id: "Balena.Etcher", name: "BalenaEtcher", defaultSelected: false },
      { id: "WinsiderSS.SystemInformer", name: "System Informer", defaultSelected: false }
    ]
  },
  {
    id: "webdev", name: "Web Dev & Design", icon: "🌐", description: "Servers, FTP, and specialized web browsers.",
    items: [
      { id: "Mozilla.Firefox.DeveloperEdition", name: "Firefox Developer", defaultSelected: true },
      { id: "WinSCP.WinSCP", name: "WinSCP", defaultSelected: true },
      { id: "Figma.Figma", name: "Figma", defaultSelected: true },
      { id: "ApacheFriends.Xampp.8.2", name: "XAMPP", defaultSelected: false },
      { id: "Insomnia.Insomnia", name: "Insomnia", defaultSelected: false }
    ]
  },
  {
    id: "data", name: "Data Science & AI", icon: "🤖", description: "Heavy lifters for analytics and machine learning.",
    items: [
      { id: "Anaconda.Anaconda3", name: "Anaconda3", defaultSelected: true },
      { id: "RProject.R", name: "R Language", defaultSelected: true },
      { id: "Posit.RStudio", name: "RStudio", defaultSelected: true },
      { id: "DBBrowserForSQLite.DBBrowserForSQLite", name: "DB Browser for SQLite", defaultSelected: true },
      { id: "Microsoft.PowerBI", name: "PowerBI Desktop", defaultSelected: false },
      { id: "MongoDB.Compass.Community", name: "MongoDB Compass", defaultSelected: false }
    ]
  },
  {
    id: "comms", name: "Communication & Social", icon: "💬", description: "Stay connected across all major networks.",
    items: [
      { id: "Telegram.TelegramDesktop", name: "Telegram", defaultSelected: true },
      { id: "OpenWhisperSystems.Signal", name: "Signal", defaultSelected: true },
      { id: "WhatsApp.WhatsApp", name: "WhatsApp", defaultSelected: true },
      { id: "Element.Element", name: "Element (Matrix)", defaultSelected: false },
      { id: "Rakuten.Viber", name: "Viber", defaultSelected: false },
      { id: "Discord.Discord", name: "Discord", defaultSelected: false }
    ]
  }
];