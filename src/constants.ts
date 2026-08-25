export interface OSEdition {
  id: string;
  name: string;
  size: string;
  desc?: string;
  isoUrl: string;
  recommended?: boolean;
}

export interface OSConfig {
  id: string;
  name: string;
  category: "Linux" | "Windows" | "Security" | "Server" | "macOS" | "BSD" | "Other";
  isoUrl?: string;
  officialSite?: string;
  locked?: boolean;
  frugalKernel?: string;
  frugalInitrd?: string;
  frugalAppend?: string;
  editions?: OSEdition[];
}

export const OS_CATALOG: OSConfig[] = [
  { 
    id: "ubuntu", 
    name: "Ubuntu 24.04 LTS", 
    category: "Linux", 
    isoUrl: "https://releases.ubuntu.com/24.04.1/ubuntu-24.04.1-desktop-amd64.iso", 
    officialSite: "https://ubuntu.com/download/desktop", 
    frugalKernel: "/casper/vmlinuz", 
    frugalInitrd: "/casper/initrd", 
    frugalAppend: "boot=casper iso-scan/filename=__ISO_PATH__ noprompt noeject",
    editions: [
      { id: "desktop", name: "Desktop (GNOME GUI)", size: "5.8 GB", desc: "Recommended • Full Official Ubuntu Desktop Experience", isoUrl: "https://releases.ubuntu.com/24.04.1/ubuntu-24.04.1-desktop-amd64.iso", recommended: true },
      { id: "server", name: "Server Edition (CLI)", size: "2.6 GB", desc: "Headless High-Performance Server OS", isoUrl: "https://releases.ubuntu.com/24.04/ubuntu-24.04.1-live-server-amd64.iso" },
      { id: "minimal", name: "Minimal Netboot", size: "150 MB", desc: "Ultra-Lightweight Core Base", isoUrl: "https://releases.ubuntu.com/24.04/ubuntu-24.04.1-live-server-amd64.iso" }
    ]
  },
  { 
    id: "kali", 
    name: "Kali Linux 2024.2", 
    category: "Security", 
    isoUrl: "https://cdimage.kali.org/kali-images/current/kali-linux-2024.2-installer-amd64.iso", 
    officialSite: "https://www.kali.org/get-kali/#kali-installer-images", 
    frugalKernel: "/install.amd/vmlinuz", 
    frugalInitrd: "/install.amd/initrd.gz", 
    frugalAppend: "iso-scan/filename=__ISO_PATH__",
    editions: [
      { id: "installer", name: "Installer XFCE", size: "3.9 GB", desc: "Recommended • Standard Penetration Testing Environment", isoUrl: "https://cdimage.kali.org/kali-images/current/kali-linux-2024.2-installer-amd64.iso", recommended: true },
      { id: "everything", name: "Everything Live", size: "9.8 GB", desc: "Complete Pre-Packaged Offline Security Tools", isoUrl: "https://cdimage.kali.org/kali-images/current/kali-linux-2024.2-live-everything-amd64.iso" },
      { id: "netinst", name: "Netinstaller", size: "500 MB", desc: "Minimal Network Boot Installer", isoUrl: "https://cdimage.kali.org/kali-images/current/kali-linux-2024.2-netinst-amd64.iso" }
    ]
  },
  { 
    id: "win11", 
    name: "Windows 11 Pro", 
    category: "Windows", 
    isoUrl: "https://software.download.prss.microsoft.com/db/Win11_English_x64v2.iso", 
    officialSite: "https://www.microsoft.com/software-download/windows11", 
    locked: true,
    editions: [
      { id: "pro", name: "Windows 11 Pro 64-bit", size: "6.2 GB", desc: "Official Multi-Edition ISO (Pro / Home / Ent)", isoUrl: "https://software.download.prss.microsoft.com/db/Win11_English_x64v2.iso", recommended: true }
    ]
  },
  { 
    id: "fedora", 
    name: "Fedora Workstation 41", 
    category: "Linux", 
    isoUrl: "https://download.fedoraproject.org/pub/fedora/linux/releases/41/Workstation/x86_64/iso/Fedora-Workstation-Live-x86_64-41-1.4.iso", 
    officialSite: "https://fedoraproject.org/workstation/download", 
    frugalKernel: "/images/pxeboot/vmlinuz", 
    frugalInitrd: "/images/pxeboot/initrd.img", 
    frugalAppend: "root=live:CDLABEL=Fedora iso-scan/filename=__ISO_PATH__",
    editions: [
      { id: "workstation", name: "Workstation (GNOME)", size: "2.2 GB", desc: "Official Flagship Fedora Desktop", isoUrl: "https://download.fedoraproject.org/pub/fedora/linux/releases/41/Workstation/x86_64/iso/Fedora-Workstation-Live-x86_64-41-1.4.iso", recommended: true },
      { id: "kde", name: "KDE Plasma Spin", size: "2.4 GB", desc: "Modern Wayland Plasma Desktop", isoUrl: "https://download.fedoraproject.org/pub/fedora/linux/releases/41/Spins/x86_64/iso/Fedora-KDE-Live-x86_64-41-1.4.iso" },
      { id: "server", name: "Server Edition", size: "2.5 GB", desc: "Enterprise Server Infrastructure", isoUrl: "https://download.fedoraproject.org/pub/fedora/linux/releases/41/Server/x86_64/iso/Fedora-Server-dvd-x86_64-41-1.4.iso" }
    ]
  },
  { 
    id: "pop", 
    name: "Pop!_OS 22.04", 
    category: "Linux", 
    isoUrl: "https://iso.pop-os.org/22.04/amd64/intel/36/pop-os_22.04_amd64_intel_36.iso", 
    officialSite: "https://pop.system76.com/", 
    frugalKernel: "/casper/vmlinuz.efi", 
    frugalInitrd: "/casper/initrd.gz", 
    frugalAppend: "boot=casper iso-scan/filename=__ISO_PATH__ noprompt noeject",
    editions: [
      { id: "standard", name: "Intel / AMD Edition", size: "3.2 GB", desc: "For systems with Intel or AMD Graphics", isoUrl: "https://iso.pop-os.org/22.04/amd64/intel/36/pop-os_22.04_amd64_intel_36.iso", recommended: true },
      { id: "nvidia", name: "NVIDIA Dedicated Edition", size: "3.5 GB", desc: "Pre-packaged with Proprietary NVIDIA Drivers", isoUrl: "https://iso.pop-os.org/22.04/amd64/nvidia/36/pop-os_22.04_amd64_nvidia_36.iso" }
    ]
  },
  { 
    id: "debian", 
    name: "Debian 12", 
    category: "Linux", 
    isoUrl: "https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-13.6.0-amd64-netinst.iso", 
    officialSite: "https://www.debian.org/distrib/", 
    frugalKernel: "/install.amd/vmlinuz", 
    frugalInitrd: "/install.amd/initrd.gz", 
    frugalAppend: "iso-scan/filename=__ISO_PATH__",
    editions: [
      { id: "netinst", name: "Netinst Minimal", size: "620 MB", desc: "Recommended Standard Rock-Solid Installer", isoUrl: "https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-13.6.0-amd64-netinst.iso", recommended: true },
      { id: "gnome_live", name: "Live GNOME Desktop", size: "3.2 GB", desc: "Full Live Graphical Desktop", isoUrl: "https://cdimage.debian.org/debian-cd/current-live/amd64/iso-hybrid/debian-live-12.6.0-amd64-gnome.iso" },
      { id: "kde_live", name: "Live KDE Plasma", size: "3.4 GB", desc: "Feature-rich Plasma Desktop", isoUrl: "https://cdimage.debian.org/debian-cd/current-live/amd64/iso-hybrid/debian-live-12.6.0-amd64-kde.iso" }
    ]
  },
  { 
    id: "arch", 
    name: "Arch Linux", 
    category: "Linux", 
    isoUrl: "https://geo.mirror.pkgbuild.com/iso/latest/archlinux-x86_64.iso", 
    officialSite: "https://archlinux.org/download/", 
    frugalKernel: "/arch/boot/x86_64/vmlinuz-linux", 
    frugalInitrd: "/arch/boot/x86_64/initramfs-linux.img", 
    frugalAppend: "archisobasedir=arch img_loop=__ISO_PATH__",
    editions: [
      { id: "standard", name: "Official Standard Live", size: "1.1 GB", desc: "Latest Rolling Release with archinstall automated installer", isoUrl: "https://geo.mirror.pkgbuild.com/iso/latest/archlinux-x86_64.iso", recommended: true },
      { id: "bootstrap", name: "Arch Bootstrap Core", size: "250 MB", desc: "Minimal RootFS Container Image", isoUrl: "https://geo.mirror.pkgbuild.com/iso/latest/archlinux-bootstrap-x86_64.tar.gz" }
    ]
  },
  { 
    id: "mint", 
    name: "Linux Mint 22", 
    category: "Linux", 
    isoUrl: "https://mirrors.kernel.org/linuxmint/stable/22/linuxmint-22-cinnamon-64bit.iso", 
    officialSite: "https://linuxmint.com/download.php", 
    frugalKernel: "/casper/vmlinuz", 
    frugalInitrd: "/casper/initrd.lz", 
    frugalAppend: "boot=casper iso-scan/filename=__ISO_PATH__ noprompt noeject",
    editions: [
      { id: "cinnamon", name: "Cinnamon Edition", size: "2.9 GB", desc: "Flagship Modern Desktop (Recommended)", isoUrl: "https://mirrors.kernel.org/linuxmint/stable/22/linuxmint-22-cinnamon-64bit.iso", recommended: true },
      { id: "mate", name: "MATE Edition", size: "2.8 GB", desc: "Classic Traditional Lightweight Desktop", isoUrl: "https://mirrors.kernel.org/linuxmint/stable/22/linuxmint-22-mate-64bit.iso" },
      { id: "xfce", name: "XFCE Edition", size: "2.7 GB", desc: "Ultra-Lightweight Resource Saver", isoUrl: "https://mirrors.kernel.org/linuxmint/stable/22/linuxmint-22-xfce-64bit.iso" }
    ]
  },
  { 
    id: "manjaro", 
    name: "Manjaro KDE", 
    category: "Linux", 
    isoUrl: "https://download.manjaro.org/kde/24.0.2/manjaro-kde-24.0.2-240618-linux69.iso", 
    officialSite: "https://manjaro.org/download/",
    editions: [
      { id: "kde", name: "KDE Plasma Edition", size: "3.6 GB", desc: "Modern Wayland Experience (Recommended)", isoUrl: "https://download.manjaro.org/kde/24.0.2/manjaro-kde-24.0.2-240618-linux69.iso", recommended: true },
      { id: "xfce", name: "XFCE Edition", size: "3.4 GB", desc: "Lightweight Flagship Edition", isoUrl: "https://download.manjaro.org/xfce/24.0.2/manjaro-xfce-24.0.2-240618-linux69.iso" },
      { id: "gnome", name: "GNOME Edition", size: "3.5 GB", desc: "Gesture-Driven Clean Desktop", isoUrl: "https://download.manjaro.org/gnome/24.0.2/manjaro-gnome-24.0.2-240618-linux69.iso" }
    ]
  },
  { id: "centos", name: "CentOS Stream 9", category: "Server", isoUrl: "https://mirrors.centos.org/mirrorlist?path=9-stream/BaseOS/x86_64/iso/CentOS-Stream-9-latest-x86_64-dvd1.iso", officialSite: "https://www.centos.org/download/" },
  { id: "rocky", name: "Rocky Linux 9", category: "Server", isoUrl: "https://download.rockylinux.org/pub/rocky/9/isos/x86_64/Rocky-9.3-x86_64-dvd.iso", officialSite: "https://rockylinux.org/download" },
  { id: "almalinux", name: "AlmaLinux 9", category: "Server", isoUrl: "https://repo.almalinux.org/almalinux/9/isos/x86_64/AlmaLinux-9.3-x86_64-dvd.iso", officialSite: "https://almalinux.org/get-almalinux/" },
  { 
    id: "opensuse", 
    name: "openSUSE Tumbleweed", 
    category: "Linux", 
    isoUrl: "https://download.opensuse.org/tumbleweed/iso/openSUSE-Tumbleweed-DVD-x86_64-Current.iso", 
    officialSite: "https://get.opensuse.org/tumbleweed/",
    editions: [
      { id: "tumbleweed", name: "Tumbleweed (Rolling)", size: "4.4 GB", desc: "Latest Bleeding-Edge Rolling Release", isoUrl: "https://download.opensuse.org/tumbleweed/iso/openSUSE-Tumbleweed-DVD-x86_64-Current.iso", recommended: true },
      { id: "leap", name: "Leap 15.6 (Enterprise LTS)", size: "4.0 GB", desc: "Rock-Solid Long Term Stability", isoUrl: "https://download.opensuse.org/distribution/leap/15.6/iso/openSUSE-Leap-15.6-DVD-x86_64-Media.iso" }
    ]
  },
  { id: "chromeos", name: "ChromeOS Flex", category: "Linux", isoUrl: "https://dl.google.com/chromeos-flex/images/latest.bin.zip", officialSite: "https://chromeenterprise.google/os/chromeosflex/" },
  { id: "oracle", name: "Oracle Linux", category: "Server", isoUrl: "https://yum.oracle.com/ISOS/OracleLinux/OL9/u3/x86_64/OracleLinux-R9-U3-x86_64-dvd.iso", officialSite: "https://www.oracle.com/linux/" },
  { id: "sles", name: "SUSE Linux Enterprise", category: "Server", isoUrl: "https://www.suse.com/download/sles/" },
  { id: "tails", name: "Tails 6.5", category: "Security", isoUrl: "https://mirrors.wikimedia.org/tails/stable/tails-amd64-6.5/tails-amd64-6.5.iso" },
  { 
    id: "parrot", 
    name: "Parrot Security 6.1", 
    category: "Security", 
    isoUrl: "https://deb.parrot.sh/parrot/iso/6.1/Parrot-security-6.1_amd64.iso",
    editions: [
      { id: "security", name: "Security Edition (Pentest)", size: "4.8 GB", desc: "Full Pentest & Vulnerability Assessment Suite", isoUrl: "https://deb.parrot.sh/parrot/iso/6.1/Parrot-security-6.1_amd64.iso", recommended: true },
      { id: "home", name: "Home Edition (Workstation)", size: "2.4 GB", desc: "Lightweight Privacy & Daily Development Desktop", isoUrl: "https://deb.parrot.sh/parrot/iso/6.1/Parrot-home-6.1_amd64.iso" }
    ]
  },
  { 
    id: "blackarch", 
    name: "BlackArch Linux", 
    category: "Security", 
    isoUrl: "https://ftp.halifax.rwth-aachen.de/blackarch/iso/blackarch-linux-slim-2023.05.01-x86_64.iso",
    editions: [
      { id: "slim", name: "Slim Edition (XFCE GUI)", size: "5.2 GB", desc: "Recommended • Fast Download & Top Pentesting Tools", isoUrl: "https://ftp.halifax.rwth-aachen.de/blackarch/iso/blackarch-linux-slim-2023.05.01-x86_64.iso", recommended: true },
      { id: "full", name: "Full ISO (Complete Suite)", size: "22.0 GB", desc: "All 2,800+ Offensive Tools Offline Pre-installed", isoUrl: "https://ftp.halifax.rwth-aachen.de/blackarch/iso/blackarch-linux-full-2023.05.01-x86_64.iso" },
      { id: "netinst", name: "Netinstaller (Minimal)", size: "850 MB", desc: "Lightweight Base Network Installer", isoUrl: "https://ftp.halifax.rwth-aachen.de/blackarch/iso/blackarch-linux-netinst-2023.05.01-x86_64.iso" }
    ]
  },
  { 
    id: "win10", 
    name: "Windows 10 Pro", 
    category: "Windows", 
    isoUrl: "https://software.download.prss.microsoft.com/db/Win10_English_x64.iso", 
    locked: true,
    editions: [
      { id: "pro", name: "Windows 10 Pro 64-bit", size: "5.8 GB", desc: "Official Multi-Edition ISO (Pro / Home / Ent)", isoUrl: "https://software.download.prss.microsoft.com/db/Win10_English_x64.iso", recommended: true }
    ]
  },
  { id: "winserver", name: "Windows Server 2022", category: "Server", isoUrl: "https://go.microsoft.com/fwlink/p/?LinkID=2164993", locked: true },
  { id: "ubuntu-server", name: "Ubuntu Server 24.04", category: "Server", isoUrl: "https://releases.ubuntu.com/24.04/ubuntu-24.04.1-live-server-amd64.iso" },
  { 
    id: "alpine", 
    name: "Alpine Linux", 
    category: "Linux", 
    isoUrl: "https://dl-cdn.alpinelinux.org/alpine/v3.19/releases/x86_64/alpine-standard-3.19.1-x86_64.iso",
    editions: [
      { id: "standard", name: "Alpine Standard", size: "200 MB", desc: "Minimal General Purpose Linux Core", isoUrl: "https://dl-cdn.alpinelinux.org/alpine/v3.19/releases/x86_64/alpine-standard-3.19.1-x86_64.iso", recommended: true },
      { id: "extended", name: "Alpine Extended", size: "800 MB", desc: "Includes Extra Firmware & Drivers", isoUrl: "https://dl-cdn.alpinelinux.org/alpine/v3.19/releases/x86_64/alpine-extended-3.19.1-x86_64.iso" }
    ]
  },
  { 
    id: "nixos", 
    name: "NixOS 24.05", 
    category: "Linux", 
    isoUrl: "https://channels.nixos.org/nixos-24.05/latest-nixos-gnome-x86_64-linux.iso",
    editions: [
      { id: "gnome", name: "NixOS GNOME Graphical", size: "2.6 GB", desc: "Reproducible Desktop with GNOME", isoUrl: "https://channels.nixos.org/nixos-24.05/latest-nixos-gnome-x86_64-linux.iso", recommended: true },
      { id: "plasma", name: "NixOS Plasma Graphical", size: "2.7 GB", desc: "Reproducible Desktop with KDE Plasma", isoUrl: "https://channels.nixos.org/nixos-24.05/latest-nixos-plasma5-x86_64-linux.iso" },
      { id: "minimal", name: "NixOS Minimal (CLI)", size: "1.0 GB", desc: "Minimal Headless Command Line", isoUrl: "https://channels.nixos.org/nixos-24.05/latest-nixos-minimal-x86_64-linux.iso" }
    ]
  },
  { id: "elementary", name: "elementary OS 7.1", category: "Linux", isoUrl: "https://ams3.dl.elementary.io/elementaryos-7.1-stable.20230926rc.iso" },
  { 
    id: "zorin", 
    name: "Zorin OS 17.1", 
    category: "Linux", 
    isoUrl: "https://mirrors.edge.kernel.org/zorinos/17/Zorin-OS-17.1-Core-64-bit.iso",
    editions: [
      { id: "core", name: "Zorin OS 17.1 Core", size: "3.2 GB", desc: "Full Windows-like Desktop", isoUrl: "https://mirrors.edge.kernel.org/zorinos/17/Zorin-OS-17.1-Core-64-bit.iso", recommended: true },
      { id: "lite", name: "Zorin OS 17.1 Lite", size: "2.6 GB", desc: "For Lower Spec / Older Hardware", isoUrl: "https://mirrors.edge.kernel.org/zorinos/17/Zorin-OS-17.1-Lite-64-bit.iso" }
    ]
  },
  { id: "deepin", name: "Deepin 20.9", category: "Linux", isoUrl: "https://cdimage.deepin.com/releases/20.9/deepin-desktop-community-20.9-amd64.iso" },
  { 
    id: "garuda", 
    name: "Garuda Linux Dr460nized", 
    category: "Linux", 
    isoUrl: "https://iso.builds.garudalinux.org/iso/garuda/dr460nized/231029/garuda-dr460nized-linux-zen-231029.iso",
    editions: [
      { id: "dr460nized", name: "Garuda Dr460nized", size: "3.2 GB", desc: "Ultimate Neon Gaming & Performance UI", isoUrl: "https://iso.builds.garudalinux.org/iso/garuda/dr460nized/231029/garuda-dr460nized-linux-zen-231029.iso", recommended: true },
      { id: "kde_lite", name: "Garuda KDE Lite", size: "2.4 GB", desc: "Clean Lightweight Performance Arch", isoUrl: "https://iso.builds.garudalinux.org/iso/garuda/kde-lite/240501/garuda-kde-lite-linux-zen-240501.iso" }
    ]
  },
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
  { id: "macos", name: "macOS", category: "macOS", isoUrl: "https://swcdn.apple.com/content/downloads/macos/official-recovery.dmg", officialSite: "https://support.apple.com/en-us/102662", locked: true },
  { id: "omnios", name: "OmniOS", category: "Server", isoUrl: "https://omnios.org/download/omnios-r151048.iso" },
    { id: "gentoo", name: "Gentoo", category: "Linux", isoUrl: "https://distfiles.gentoo.org/releases/amd64/autobuilds/20240407T170428Z/install-amd64-minimal-20240407T170428Z.iso" },
  { id: "slackware", name: "Slackware", category: "Linux", isoUrl: "https://mirrors.slackware.com/slackware/slackware-iso/slackware64-15.0-iso/slackware64-15.0-install-dvd.iso" },
  { id: "kdeneon", name: "KDE Neon", category: "Linux", isoUrl: "https://files.kde.org/neon/images/user/20240411-0714/neon-user-20240411-0714.iso" },
  { id: "nobara", name: "Nobara Linux", category: "Linux", isoUrl: "https://nobaraproject.org/download/nobara-39-official.iso" },
  { id: "vanillaos", name: "Vanilla OS", category: "Linux", isoUrl: "https://github.com/Vanilla-OS/os/releases/download/v2.0.0/VanillaOS-2.0.0.iso" },
  { id: "blissos", name: "Bliss OS", category: "Linux", isoUrl: "https://sourceforge.net/projects/blissos-dev/files/BlissOS/BlissOS-16/BlissOS-16.iso" },
  { id: "templeos", name: "TempleOS", category: "Server", isoUrl: "https://templeos.org/Downloads/TempleOS.ISO" },
  { id: "kolibrios", name: "KolibriOS", category: "Linux", isoUrl: "http://kolibrios.org/releases/KolibriOS-0.7.7.0.iso" },
  { id: "rhel", name: "Red Hat Enterprise Linux", category: "Server", isoUrl: "https://developers.redhat.com/content-gateway/rest/mirror/pub/openshift-v4/dependencies/rhcos/latest/rhcos-live.x86_64.iso", officialSite: "https://developers.redhat.com/products/rhel/download", locked: true },
  { id: "tens", name: "TENS (NSA/DoD)", category: "Security", isoUrl: "https://www.tens.af.mil/iso/tens-3.1.2-public.iso" },
  { id: "kodachi", name: "Linux Kodachi", category: "Security", isoUrl: "https://sourceforge.net/projects/linuxkodachi/files/latest/download" },
  { id: "hardenedbsd", name: "HardenedBSD", category: "Security", isoUrl: "https://installer.hardenedbsd.org/pub/HardenedBSD/releases/amd64/amd64/ISO-IMAGES/13-STABLE/HardenedBSD-13-STABLE-v1300063-amd64-disc1.iso" },
  { id: "integrity", name: "Green Hills INTEGRITY", category: "Server", isoUrl: "https://www.ghs.com/products/rtos/integrity.html", officialSite: "https://www.ghs.com/products/rtos/integrity.html", locked: true },
  { id: "subgraph", name: "Subgraph OS", category: "Security", isoUrl: "https://subgraph.com/sgos/download/subgraph-os-alpha-latest.iso" },
  { id: "pureos", name: "PureOS", category: "Linux", isoUrl: "https://downloads.puri.sm/pureos/gnome/gnome-live-latest-amd64.iso" },
  { id: "sel4", name: "seL4 Microkernel", category: "Security", isoUrl: "https://github.com/seL4/seL4/releases/download/v12.1.0/seL4-x86_64.iso", officialSite: "https://sel4.systems/", locked: true },
  { id: "clearlinux", name: "Clear Linux", category: "Linux", isoUrl: "https://cdn.download.clearlinux.org/releases/latest/clear/clear-linux-live-desktop.iso" },
  { id: "septor", name: "Septor Linux", category: "Security", isoUrl: "https://sourceforge.net/projects/septor/files/latest/download" },
  { id: "alpine-extended", name: "Alpine Extended", category: "Server", isoUrl: "https://dl-cdn.alpinelinux.org/alpine/v3.19/releases/x86_64/alpine-extended-3.19.1-x86_64.iso" },
  { id: "grapheneos", name: "GrapheneOS", category: "Security", isoUrl: "https://releases.grapheneos.org/shiba-install-2024050100.zip", officialSite: "https://grapheneos.org/install", locked: true },
  { id: "cachyos", name: "CachyOS", category: "Linux", isoUrl: "https://mirror.cachyos.org/ISO/desktop/240609/cachyos-desktop-linux-240609.iso", officialSite: "https://cachyos.org/" },
  { id: "bazzite", name: "Bazzite Gaming OS", category: "Linux", isoUrl: "https://github.com/ublue-os/bazzite/releases/latest/download/bazzite-gnome.iso", officialSite: "https://bazzite.gg/" },
  { id: "athena", name: "Athena OS", category: "Security", isoUrl: "https://sourceforge.net/projects/athena-os/files/latest/download", officialSite: "https://athenaos.org/" },
  { id: "proxmox", name: "Proxmox VE 8.2", category: "Server", isoUrl: "https://www.proxmox.com/en/downloads/item/proxmox-ve-8-2-iso-installer", officialSite: "https://www.proxmox.com/" },
  { id: "ghostbsd", name: "GhostBSD 24.01", category: "BSD", isoUrl: "https://ghostbsd.org/download", officialSite: "https://ghostbsd.org/" },
  { id: "freedos", name: "FreeDOS 1.3", category: "Other", isoUrl: "https://www.freedos.org/download/download/FD13-FullUSB.zip", officialSite: "https://www.freedos.org/" },
  { id: "commandovm", name: "Commando VM", category: "Security", isoUrl: "https://github.com/mandiant/commando-vm", officialSite: "https://www.mandiant.com/" },
  { id: "eurolinux", name: "EuroLinux 9", category: "Server", isoUrl: "https://fdd.el.euro-linux.com/iso/eurolinux-9-x86_64-latest.iso", officialSite: "https://en.euro-linux.com/" },
  { id: "pop-cosmic", name: "Pop!_OS 24.04 COSMIC", category: "Linux", isoUrl: "https://iso.pop-os.org/24.04/amd64/intel/pop-os_24.04_amd64_intel.iso", officialSite: "https://pop.system76.com/" },
  { id: "asahi", name: "Asahi Linux (Apple Silicon)", category: "Linux", isoUrl: "https://asahilinux.org/", officialSite: "https://asahilinux.org/" },
  
  // PHASE 1: 10 NEW SPECIALIZED WORKSTATION & RECOVERY OSES
  { id: "garuda-dragonfly", name: "Garuda Linux Wayfire", category: "Linux", isoUrl: "https://iso.builds.garudalinux.org/iso/garuda/wayfire/240501/garuda-wayfire-linux-zen-240501.iso", officialSite: "https://garudalinux.org/" },
  { id: "fedora-kinoite", name: "Fedora Kinoite 40", category: "Linux", isoUrl: "https://download.fedoraproject.org/pub/fedora/linux/releases/40/Kinoite/x86_64/iso/Fedora-Kinoite-ostree-x86_64-40-1.14.iso", officialSite: "https://fedoraproject.org/kinoite/" },
  { id: "fedora-silverblue", name: "Fedora Silverblue 40", category: "Linux", isoUrl: "https://download.fedoraproject.org/pub/fedora/linux/releases/40/Silverblue/x86_64/iso/Fedora-Silverblue-ostree-x86_64-40-1.14.iso", officialSite: "https://fedoraproject.org/silverblue/" },
  { id: "opensuse-leap", name: "openSUSE Leap 15.6", category: "Server", isoUrl: "https://download.opensuse.org/distribution/leap/15.6/iso/openSUSE-Leap-15.6-DVD-x86_64-Media.iso", officialSite: "https://get.opensuse.org/leap/" },
  { id: "systemrescue", name: "SystemRescue 11.01", category: "Security", isoUrl: "https://osdn.net/dl/systemrescue/systemrescue-11.01-amd64.iso", officialSite: "https://www.system-rescue.org/" },
  { id: "clonezilla", name: "Clonezilla Live 3.1.2", category: "Security", isoUrl: "https://free.nchc.org.tw/clonezilla-live/alternative/testing/3.1.2-22/clonezilla-live-3.1.2-22-amd64.iso", officialSite: "https://clonezilla.org/" },
  { id: "gparted-live", name: "GParted Live 1.6", category: "Other", isoUrl: "https://sourceforge.net/projects/gparted/files/gparted-live-stable/1.6.0-1/gparted-live-1.6.0-1-amd64.iso", officialSite: "https://gparted.org/" },
  { id: "endlessos", name: "Endless OS 6", category: "Linux", isoUrl: "https://images-flatpak.endlessm.com/eos-amd64-amd64/base/eos-amd64-amd64.6.0.0.iso", officialSite: "https://endlessos.org/" },
  { id: "kaos", name: "KaOS 2024", category: "Linux", isoUrl: "https://sourceforge.net/projects/kaosx/files/ISO/KaOS-2024.05-x86_64.iso/download", officialSite: "https://kaosx.us/" },
  { id: "easyos", name: "EasyOS 6.0", category: "Linux", isoUrl: "https://distro.ibiblio.org/easyos/amd64/releases/bookworm/2024/easy-6.0-amd64.img", officialSite: "https://easyos.org/" },
  
  // PHASE 2: 10 NEW ENTERPRISE, GAMING & SPECIALIZED UNIX OSES
  { id: "miraclelinux", name: "Miracle Linux 9", category: "Server", isoUrl: "https://miraclelinux.com/iso/MiracleLinux-9.2-x86_64-dvd.iso", officialSite: "https://miraclelinux.com/" },
  { id: "springdale", name: "Springdale Linux 9", category: "Server", isoUrl: "http://springdale.math.ias.edu/data/puias/9.3/x86_64/os/images/boot.iso", officialSite: "http://springdale.math.ias.edu/" },
  { id: "solus", name: "Solus 4.5 Resilience", category: "Linux", isoUrl: "https://cdn.getsol.us/images/Solus-4.5-Budgie.iso", officialSite: "https://getsol.us/" },
  { id: "void", name: "Void Linux", category: "Linux", isoUrl: "https://repo-default.voidlinux.org/live/current/void-live-x86_64-20230628-xfce.iso", officialSite: "https://voidlinux.org/" },
  { id: "devuan", name: "Devuan GNU/Linux 5", category: "Linux", isoUrl: "https://files.devuan.org/devuan_daedalus/desktop-live/devuan_daedalus_5.0.0_amd64_desktop-live.iso", officialSite: "https://www.devuan.org/" },
  { id: "q4os", name: "Q4OS 5.4 Aquarius", category: "Linux", isoUrl: "https://sourceforge.net/projects/q4os/files/stable/q4os-5.4-x64.r1.iso", officialSite: "https://q4os.org/" },
  { id: "zorin-lite", name: "Zorin OS 17.1 Lite", category: "Linux", isoUrl: "https://mirrors.edge.kernel.org/zorinos/17/Zorin-OS-17.1-Lite-64-bit.iso", officialSite: "https://zorin.com/os/" },
  { id: "lakka", name: "LAKKA Retrogaming OS", category: "Other", isoUrl: "https://le.builds.lakka.tv/Generic.x86_64/Lakka-Generic.x86_64-5.0.img.gz", officialSite: "https://www.lakka.tv/" },
  { id: "batocera", name: "Batocera.linux 39", category: "Other", isoUrl: "https://mirrors.kodi.tv/batocera/x86_64/batocera-x86_64-39-20240304.img.gz", officialSite: "https://batocera.org/" },
  { id: "arcaos", name: "ArcaOS 5.1 (OS/2 Warp)", category: "Other", isoUrl: "https://www.arcanoae.com/arcaos-5-1-0-now-available/", locked: true, officialSite: "https://www.arcanoae.com/" }
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
      { id: "Python.Python.3.12", name: "Python 3.12", defaultSelected: true },
      { id: "OpenJS.NodeJS", name: "Node.js", defaultSelected: true },
      { id: "Docker.DockerDesktop", name: "Docker Desktop", defaultSelected: false },
      { id: "Postman.Postman", name: "Postman", defaultSelected: false },
      { id: "Microsoft.WindowsTerminal", name: "Windows Terminal", defaultSelected: true },
      { id: "Microsoft.VisualStudio.2022.Community", name: "Visual Studio Community", defaultSelected: false },
      { id: "JetBrains.IntelliJIDEA.Community", name: "IntelliJ IDEA", defaultSelected: false },
      { id: "JetBrains.PyCharm.Community", name: "PyCharm", defaultSelected: false },
      { id: "JetBrains.WebStorm", name: "WebStorm", defaultSelected: false },
      { id: "Neovim.Neovim", name: "Neovim", defaultSelected: false },
      { id: "GoLang.Go", name: "Go Language", defaultSelected: false },
      { id: "Rustlang.Rustup", name: "Rust (Rustup)", defaultSelected: false },
      { id: "GitHub.GitHubDesktop", name: "GitHub Desktop", defaultSelected: false }
    ]
  },
  {
    id: "devops", name: "Cloud & DevOps", icon: "☁️", description: "Infrastructure as code, containers, and cloud CLI tools.",
    items: [
      { id: "Amazon.AWSCLI", name: "AWS CLI", defaultSelected: true },
      { id: "Microsoft.AzureCLI", name: "Azure CLI", defaultSelected: false },
      { id: "Google.CloudSDK", name: "Google Cloud SDK", defaultSelected: false },
      { id: "Hashicorp.Terraform", name: "Terraform", defaultSelected: true },
      { id: "Kubernetes.kubectl", name: "Kubernetes CLI", defaultSelected: true },
      { id: "Helm.Helm", name: "Helm", defaultSelected: false },
      { id: "RedHat.Ansible", name: "Ansible", defaultSelected: false }
    ]
  },
  {
    id: "mobile_dev", name: "Mobile Development", icon: "📱", description: "Android, iOS, and cross-platform app development.",
    items: [
      { id: "Google.AndroidStudio", name: "Android Studio", defaultSelected: true },
      { id: "Google.Flutter", name: "Flutter SDK", defaultSelected: false },
      { id: "Appium.Appium", name: "Appium Server", defaultSelected: false },
      { id: "Genymobile.Genymotion", name: "Genymotion Emulator", defaultSelected: false }
    ]
  },
  {
    id: "creator", name: "End-to-End Creator", icon: "🎨", description: "World-class tools for 3D, Video, and Audio production.",
    items: [
      { id: "OBSProject.OBSStudio", name: "OBS Studio", defaultSelected: true },
      { id: "BlenderFoundation.Blender", name: "Blender", defaultSelected: true },
      { id: "EpicGames.UnrealEngine", name: "Unreal Engine", defaultSelected: false },
      { id: "Unity.UnityHub", name: "Unity Hub", defaultSelected: false },
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
      { id: "Blizzard.BattleNet", name: "Battle.net", defaultSelected: false },
      { id: "RiotGames.RiotClient", name: "Riot Client", defaultSelected: false },
      { id: "Microsoft.XboxApp", name: "Xbox App", defaultSelected: false },
      { id: "GOG.Galaxy", name: "GOG Galaxy", defaultSelected: false },
      { id: "Nvidia.GeForceNow", name: "GeForce NOW", defaultSelected: false },
      { id: "ElectronicArts.EADesktop", name: "EA app", defaultSelected: false },
      { id: "Ubisoft.Connect", name: "Ubisoft Connect", defaultSelected: false },
      { id: "Razer.Synapse", name: "Razer Synapse", defaultSelected: false },
      { id: "Logitech.GHUB", name: "Logitech G HUB", defaultSelected: false },
      { id: "TeamSpeakSystems.TeamSpeakClient", name: "TeamSpeak 3", defaultSelected: false }
    ]
  },
  {
    id: "office", name: "Office & Productivity", icon: "💼", description: "Docs, spreadsheets, and seamless teamwork tools.",
    items: [
      { id: "Microsoft.Office", name: "Microsoft Office 365", defaultSelected: false },
      { id: "TheDocumentFoundation.LibreOffice", name: "LibreOffice", defaultSelected: true },
      { id: "SlackTechnologies.Slack", name: "Slack", defaultSelected: true },
      { id: "Zoom.Zoom", name: "Zoom", defaultSelected: true },
      { id: "Microsoft.Teams", name: "Microsoft Teams", defaultSelected: false },
      { id: "Adobe.Acrobat.Reader.64-bit", name: "Acrobat Reader", defaultSelected: true },
      { id: "Obsidian.Obsidian", name: "Obsidian", defaultSelected: false },
      { id: "Notion.Notion", name: "Notion", defaultSelected: false },
      { id: "Atlassian.Trello", name: "Trello", defaultSelected: false },
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
      { id: "RARLab.WinRAR", name: "WinRAR", defaultSelected: false },
      { id: "9NKSQGP7F2NH", name: "WhatsApp", defaultSelected: true },
      { id: "Spotify.Spotify", name: "Spotify", defaultSelected: false },
      { id: "AgileBits.1Password", name: "1Password", defaultSelected: false },
      { id: "Microsoft.PowerToys", name: "PowerToys", defaultSelected: false },
      { id: "Bitwarden.Bitwarden", name: "Bitwarden", defaultSelected: false },
      { id: "ShareX.ShareX", name: "ShareX", defaultSelected: true },
      { id: "qBittorrent.qBittorrent", name: "qBittorrent", defaultSelected: false },
      { id: "voidtools.Everything", name: "Everything Search", defaultSelected: true }
    ]
  },
  {
    id: "security", name: "Cyber Security & Privacy", icon: "🔐", description: "VPNs, crypto tools, and network analysis.",
    items: [
      { id: "TorProject.TorBrowser", name: "Tor Browser", defaultSelected: true },
      { id: "Proton.ProtonVPN", name: "ProtonVPN", defaultSelected: true },
      { id: "OpenVPN.OpenVPN", name: "OpenVPN Connect", defaultSelected: false },
      { id: "Malwarebytes.Malwarebytes", name: "Malwarebytes", defaultSelected: true },
      { id: "WiresharkFoundation.Wireshark", name: "Wireshark", defaultSelected: false },
      { id: "Npcap.Npcap", name: "Npcap", defaultSelected: false },
      { id: "PortSwigger.BurpSuite.Community", name: "Burp Suite Community", defaultSelected: false },
      { id: "Hashcat.Hashcat", name: "Hashcat", defaultSelected: false },
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
      { id: "TimKosse.FileZillaClient", name: "FileZilla", defaultSelected: false },
      { id: "Cyberduck.Cyberduck", name: "Cyberduck", defaultSelected: false },
      { id: "Figma.Figma", name: "Figma", defaultSelected: true },
      { id: "ApacheFriends.Xampp.8.2", name: "XAMPP", defaultSelected: false },
      { id: "Insomnia.Insomnia", name: "Insomnia", defaultSelected: false }
    ]
  },
  {
    id: "data", name: "Data Science & Local AI", icon: "🧠", description: "Heavy lifters for analytics and local LLMs.",
    items: [
      { id: "Anaconda.Anaconda3", name: "Anaconda3", defaultSelected: true },
      { id: "Ollama.Ollama", name: "Ollama (Local AI)", defaultSelected: true },
      { id: "LMStudio.LMStudio", name: "LM Studio", defaultSelected: false },
      { id: "RProject.R", name: "R Language", defaultSelected: true },
      { id: "Posit.RStudio", name: "RStudio", defaultSelected: true },
      { id: "dbeaver.dbeaver", name: "DBeaver Community", defaultSelected: true },
      { id: "Oracle.MySQLWorkbench", name: "MySQL Workbench", defaultSelected: false },
      { id: "DBBrowserForSQLite.DBBrowserForSQLite", name: "DB Browser for SQLite", defaultSelected: false },
      { id: "Microsoft.PowerBI", name: "PowerBI Desktop", defaultSelected: false },
      { id: "MongoDB.Compass.Community", name: "MongoDB Compass", defaultSelected: false }
    ]
  },
  {
    id: "media", name: "Media & Entertainment", icon: "🎬", description: "Media servers, players, and streaming.",
    items: [
      { id: "Plex.Plex", name: "Plex Media Player", defaultSelected: true },
      { id: "Jellyfin.Jellyfin", name: "Jellyfin Media Player", defaultSelected: false },
      { id: "Kodi.Kodi", name: "Kodi", defaultSelected: false },
      { id: "Apple.iTunes", name: "Apple iTunes", defaultSelected: false }
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