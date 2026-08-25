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
  { 
    id: "centos", 
    name: "CentOS Stream 9", 
    category: "Server", 
    isoUrl: "https://mirrors.centos.org/mirrorlist?path=9-stream/BaseOS/x86_64/iso/CentOS-Stream-9-latest-x86_64-dvd1.iso", 
    officialSite: "https://www.centos.org/download/",
    editions: [
      { id: "dvd", name: "Full Binary DVD", size: "9.5 GB", desc: "Complete Enterprise BaseOS & AppStream Packages", isoUrl: "https://mirrors.centos.org/mirrorlist?path=9-stream/BaseOS/x86_64/iso/CentOS-Stream-9-latest-x86_64-dvd1.iso", recommended: true },
      { id: "boot", name: "Network Boot ISO", size: "980 MB", desc: "Lightweight Minimal Network Installer", isoUrl: "https://mirrors.centos.org/mirrorlist?path=9-stream/BaseOS/x86_64/iso/CentOS-Stream-9-latest-x86_64-boot.iso" }
    ]
  },
  { 
    id: "rocky", 
    name: "Rocky Linux 9", 
    category: "Server", 
    isoUrl: "https://download.rockylinux.org/pub/rocky/9/isos/x86_64/Rocky-9.3-x86_64-dvd.iso", 
    officialSite: "https://rockylinux.org/download",
    editions: [
      { id: "dvd", name: "Rocky 9.4 Full DVD", size: "10.2 GB", desc: "1:1 Bug-for-Bug Compatible Enterprise Server", isoUrl: "https://download.rockylinux.org/pub/rocky/9/isos/x86_64/Rocky-9.3-x86_64-dvd.iso", recommended: true },
      { id: "minimal", name: "Rocky 9.4 Minimal", size: "1.6 GB", desc: "Clean Headless Server Core", isoUrl: "https://download.rockylinux.org/pub/rocky/9/isos/x86_64/Rocky-9.3-x86_64-minimal.iso" },
      { id: "boot", name: "Rocky 9.4 Boot", size: "1.0 GB", desc: "Network Installation Boot", isoUrl: "https://download.rockylinux.org/pub/rocky/9/isos/x86_64/Rocky-9.3-x86_64-boot.iso" }
    ]
  },
  { 
    id: "almalinux", 
    name: "AlmaLinux 9", 
    category: "Server", 
    isoUrl: "https://repo.almalinux.org/almalinux/9/isos/x86_64/AlmaLinux-9.3-x86_64-dvd.iso", 
    officialSite: "https://almalinux.org/get-almalinux/",
    editions: [
      { id: "dvd", name: "AlmaLinux 9.4 Full DVD", size: "10.0 GB", desc: "Community-driven Enterprise Linux Distribution", isoUrl: "https://repo.almalinux.org/almalinux/9/isos/x86_64/AlmaLinux-9.3-x86_64-dvd.iso", recommended: true },
      { id: "minimal", name: "AlmaLinux 9.4 Minimal", size: "1.8 GB", desc: "Fast Minimal Server Base", isoUrl: "https://repo.almalinux.org/almalinux/9/isos/x86_64/AlmaLinux-9.3-x86_64-minimal.iso" },
      { id: "boot", name: "AlmaLinux 9.4 Boot", size: "1.0 GB", desc: "Network Boot ISO", isoUrl: "https://repo.almalinux.org/almalinux/9/isos/x86_64/AlmaLinux-9.3-x86_64-boot.iso" }
    ]
  },
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
  { 
    id: "chromeos", 
    name: "ChromeOS Flex", 
    category: "Linux", 
    isoUrl: "https://dl.google.com/chromeos-flex/images/latest.bin.zip", 
    officialSite: "https://chromeenterprise.google/os/chromeosflex/",
    editions: [
      { id: "flex", name: "ChromeOS Flex Official Bin", size: "2.1 GB", desc: "Official Google Cloud-First CloudReady OS", isoUrl: "https://dl.google.com/chromeos-flex/images/latest.bin.zip", recommended: true }
    ]
  },
  { 
    id: "oracle", 
    name: "Oracle Linux", 
    category: "Server", 
    isoUrl: "https://yum.oracle.com/ISOS/OracleLinux/OL9/u3/x86_64/OracleLinux-R9-U3-x86_64-dvd.iso", 
    officialSite: "https://www.oracle.com/linux/",
    editions: [
      { id: "dvd", name: "Oracle Linux 9.4 Full DVD", size: "10.5 GB", desc: "Enterprise Linux with Unbreakable Enterprise Kernel (UEK)", isoUrl: "https://yum.oracle.com/ISOS/OracleLinux/OL9/u3/x86_64/OracleLinux-R9-U3-x86_64-dvd.iso", recommended: true },
      { id: "boot", name: "Oracle Linux 9.4 Boot ISO", size: "1.0 GB", desc: "Minimal Network Installer", isoUrl: "https://yum.oracle.com/ISOS/OracleLinux/OL9/u3/x86_64/OracleLinux-R9-U3-x86_64-boot.iso" }
    ]
  },
  { 
    id: "sles", 
    name: "SUSE Linux Enterprise", 
    category: "Server", 
    isoUrl: "https://www.suse.com/download/sles/",
    editions: [
      { id: "sles15", name: "SLES 15 SP6 Enterprise", size: "4.2 GB", desc: "Mission-Critical Enterprise Server Platform", isoUrl: "https://www.suse.com/download/sles/", recommended: true }
    ]
  },
  { 
    id: "tails", 
    name: "Tails 6.5", 
    category: "Security", 
    isoUrl: "https://mirrors.wikimedia.org/tails/stable/tails-amd64-6.5/tails-amd64-6.5.iso",
    editions: [
      { id: "iso", name: "Tails 6.5 ISO (VM & DVD)", size: "1.3 GB", desc: "The Amnesic Incognito Live System (Tor Network)", isoUrl: "https://mirrors.wikimedia.org/tails/stable/tails-amd64-6.5/tails-amd64-6.5.iso", recommended: true },
      { id: "usb", name: "Tails 6.5 USB Direct Image", size: "1.3 GB", desc: "Flashable directly to Physical USB Drive", isoUrl: "https://mirrors.wikimedia.org/tails/stable/tails-amd64-6.5/tails-amd64-6.5.img" }
    ]
  },
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
  { 
    id: "winserver", 
    name: "Windows Server 2022", 
    category: "Server", 
    isoUrl: "https://go.microsoft.com/fwlink/p/?LinkID=2164993", 
    locked: true,
    editions: [
      { id: "std", name: "Server 2022 Standard", size: "5.4 GB", desc: "Physical or Minimally Virtualized Environments", isoUrl: "https://go.microsoft.com/fwlink/p/?LinkID=2164993", recommended: true },
      { id: "dc", name: "Server 2022 Datacenter", size: "5.4 GB", desc: "Highly Virtualized Datacenter & Cloud Environments", isoUrl: "https://go.microsoft.com/fwlink/p/?LinkID=2164993" }
    ]
  },
  { 
    id: "ubuntu-server", 
    name: "Ubuntu Server 24.04", 
    category: "Server", 
    isoUrl: "https://releases.ubuntu.com/24.04/ubuntu-24.04.1-live-server-amd64.iso",
    editions: [
      { id: "live", name: "Ubuntu Server 24.04 LTS Live", size: "2.6 GB", desc: "Headless High-Performance Server OS", isoUrl: "https://releases.ubuntu.com/24.04/ubuntu-24.04.1-live-server-amd64.iso", recommended: true }
    ]
  },
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
  { 
    id: "elementary", 
    name: "elementary OS 7.1", 
    category: "Linux", 
    isoUrl: "https://ams3.dl.elementary.io/elementaryos-7.1-stable.20230926rc.iso",
    editions: [
      { id: "pantheon", name: "elementary OS 7.1 Horus", size: "3.0 GB", desc: "Elegant macOS-Inspired Pantheon Desktop", isoUrl: "https://ams3.dl.elementary.io/elementaryos-7.1-stable.20230926rc.iso", recommended: true }
    ]
  },
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
  { 
    id: "deepin", 
    name: "Deepin 20.9", 
    category: "Linux", 
    isoUrl: "https://cdimage.deepin.com/releases/20.9/deepin-desktop-community-20.9-amd64.iso",
    editions: [
      { id: "dde", name: "Deepin Desktop Environment", size: "3.8 GB", desc: "Sleek Aesthetics with Deepin UI Suite", isoUrl: "https://cdimage.deepin.com/releases/20.9/deepin-desktop-community-20.9-amd64.iso", recommended: true }
    ]
  },
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
  { 
    id: "endeavouros", 
    name: "EndeavourOS", 
    category: "Linux", 
    isoUrl: "https://mirrors.kernel.org/endeavouros/iso/EndeavourOS_Galileo-Neo-2024.01.25.iso",
    editions: [
      { id: "calamares", name: "EndeavourOS Galileo-Neo", size: "2.5 GB", desc: "Arch-Based Friendly Installer with Calamares", isoUrl: "https://mirrors.kernel.org/endeavouros/iso/EndeavourOS_Galileo-Neo-2024.01.25.iso", recommended: true }
    ]
  },
  { 
    id: "mxlinux", 
    name: "MX Linux 23.2", 
    category: "Linux", 
    isoUrl: "https://sourceforge.net/projects/mx-linux/files/Final/MX-23.2_x64.iso/download",
    editions: [
      { id: "xfce", name: "MX Linux 23.2 XFCE Flagship", size: "2.2 GB", desc: "Midweight Performance Champion (Recommended)", isoUrl: "https://sourceforge.net/projects/mx-linux/files/Final/MX-23.2_x64.iso/download", recommended: true },
      { id: "kde", name: "MX Linux 23.2 KDE Advanced", size: "2.6 GB", desc: "Feature-Packed Plasma Desktop", isoUrl: "https://sourceforge.net/projects/mx-linux/files/Final/MX-23.2_KDE_x64.iso/download" },
      { id: "fluxbox", name: "MX Linux 23.2 Fluxbox", size: "1.9 GB", desc: "Ultra-Lightweight Minimalist Edition", isoUrl: "https://sourceforge.net/projects/mx-linux/files/Final/MX-23.2_fluxbox_x64.iso/download" }
    ]
  },
  { 
    id: "linuxlite", 
    name: "Linux Lite 6.8", 
    category: "Linux", 
    isoUrl: "https://osdn.net/dl/linuxlite/linux-lite-6.8-64bit.iso",
    editions: [
      { id: "xfce", name: "Linux Lite 6.8 XFCE", size: "2.4 GB", desc: "Fast, Simple, and Free Windows Alternative", isoUrl: "https://osdn.net/dl/linuxlite/linux-lite-6.8-64bit.iso", recommended: true }
    ]
  },
  { 
    id: "peppermint", 
    name: "Peppermint OS", 
    category: "Linux", 
    isoUrl: "https://peppermintos.com/iso/Peppermint-12-20240101-amd64.iso",
    editions: [
      { id: "debian", name: "Peppermint Debian Base", size: "1.6 GB", desc: "Rock-Solid Debian Core (Recommended)", isoUrl: "https://peppermintos.com/iso/Peppermint-12-20240101-amd64.iso", recommended: true },
      { id: "devuan", name: "Peppermint Devuan (No systemd)", size: "1.5 GB", desc: "SysVinit Lightweight Core", isoUrl: "https://peppermintos.com/iso/Peppermint-Devuan-12-20240101-amd64.iso" }
    ]
  },
  { 
    id: "kubuntu", 
    name: "Kubuntu 24.04", 
    category: "Linux", 
    isoUrl: "https://cdimage.ubuntu.com/kubuntu/releases/24.04/release/kubuntu-24.04-desktop-amd64.iso",
    editions: [
      { id: "kde", name: "Kubuntu 24.04 Desktop (KDE)", size: "4.2 GB", desc: "Ubuntu with KDE Plasma Desktop Experience", isoUrl: "https://cdimage.ubuntu.com/kubuntu/releases/24.04/release/kubuntu-24.04-desktop-amd64.iso", recommended: true }
    ]
  },
  { 
    id: "xubuntu", 
    name: "Xubuntu 24.04", 
    category: "Linux", 
    isoUrl: "https://cdimage.ubuntu.com/xubuntu/releases/24.04/release/xubuntu-24.04-desktop-amd64.iso",
    editions: [
      { id: "xfce", name: "Xubuntu 24.04 Desktop (XFCE)", size: "3.1 GB", desc: "Lightweight and Stable Ubuntu Flavor", isoUrl: "https://cdimage.ubuntu.com/xubuntu/releases/24.04/release/xubuntu-24.04-desktop-amd64.iso", recommended: true },
      { id: "minimal", name: "Xubuntu Minimal", size: "1.8 GB", desc: "Lean Base with Essential Apps Only", isoUrl: "https://cdimage.ubuntu.com/xubuntu/releases/24.04/release/xubuntu-24.04-minimal-amd64.iso" }
    ]
  },
  { 
    id: "lubuntu", 
    name: "Lubuntu 24.04", 
    category: "Linux", 
    isoUrl: "https://cdimage.ubuntu.com/lubuntu/releases/24.04/release/lubuntu-24.04-desktop-amd64.iso",
    editions: [
      { id: "lxqt", name: "Lubuntu 24.04 Desktop (LXQt)", size: "3.0 GB", desc: "Fast & Energy Efficient LXQt Environment", isoUrl: "https://cdimage.ubuntu.com/lubuntu/releases/24.04/release/lubuntu-24.04-desktop-amd64.iso", recommended: true }
    ]
  },
  { 
    id: "bodhi", 
    name: "Bodhi Linux 7.0", 
    category: "Linux", 
    isoUrl: "https://sourceforge.net/projects/bodhl/files/7.0.0/bodhi-7.0.0-64.iso/download",
    editions: [
      { id: "standard", name: "Bodhi 7.0 Standard", size: "1.3 GB", desc: "Moksha Desktop Lightweight Environment", isoUrl: "https://sourceforge.net/projects/bodhl/files/7.0.0/bodhi-7.0.0-64.iso/download", recommended: true },
      { id: "hwe", name: "Bodhi 7.0 HWE (Newer Kernels)", size: "1.4 GB", desc: "With Hardware Enablement Drivers for Modern PCs", isoUrl: "https://sourceforge.net/projects/bodhl/files/7.0.0/bodhi-7.0.0-64-hwe.iso/download" },
      { id: "apppack", name: "Bodhi 7.0 AppPack", size: "2.0 GB", desc: "Preloaded with Full Productivity Suite", isoUrl: "https://sourceforge.net/projects/bodhl/files/7.0.0/bodhi-7.0.0-64-apppack.iso/download" }
    ]
  },
  { 
    id: "puppy", 
    name: "Puppy Linux", 
    category: "Linux", 
    isoUrl: "https://distro.ibiblio.org/puppylinux/puppy-fossa/fossapup64-9.5.iso",
    editions: [
      { id: "fossapup", name: "FossaPup64 9.5", size: "409 MB", desc: "Runs Entirely in RAM (Ubuntu 20.04 Binary Base)", isoUrl: "https://distro.ibiblio.org/puppylinux/puppy-fossa/fossapup64-9.5.iso", recommended: true },
      { id: "bookwormpup", name: "BookwormPup64 10.0", size: "580 MB", desc: "Debian 12 Bookworm Binary Compatible", isoUrl: "https://distro.ibiblio.org/puppylinux/puppy-bookworm/BookwormPup64_10.0.6.iso" }
    ]
  },
  { 
    id: "antiX", 
    name: "antiX 23.1", 
    category: "Linux", 
    isoUrl: "https://sourceforge.net/projects/antix-linux/files/Final/antiX-23.1/antiX-23.1_x64-full.iso/download",
    editions: [
      { id: "full", name: "antiX 23.1 Full", size: "1.7 GB", desc: "Complete Systemd-Free Desktop with 4 Window Managers", isoUrl: "https://sourceforge.net/projects/antix-linux/files/Final/antiX-23.1/antiX-23.1_x64-full.iso/download", recommended: true },
      { id: "base", name: "antiX 23.1 Base", size: "1.0 GB", desc: "Lean Midweight Edition", isoUrl: "https://sourceforge.net/projects/antix-linux/files/Final/antiX-23.1/antiX-23.1_x64-base.iso/download" },
      { id: "core", name: "antiX 23.1 Core (CLI)", size: "520 MB", desc: "Minimal Command Line System", isoUrl: "https://sourceforge.net/projects/antix-linux/files/Final/antiX-23.1/antiX-23.1_x64-core.iso/download" }
    ]
  },
  { 
    id: "slax", 
    name: "Slax", 
    category: "Linux", 
    isoUrl: "https://github.com/Tomas-M/slax/releases/download/15.0.0/slax-64bit-15.0.0.iso",
    editions: [
      { id: "debian", name: "Slax Debian Based", size: "280 MB", desc: "Pocket Operating System based on Debian", isoUrl: "https://github.com/Tomas-M/slax/releases/download/15.0.0/slax-64bit-15.0.0.iso", recommended: true },
      { id: "slackware", name: "Slax Slackware Based", size: "290 MB", desc: "Modular OS based on Slackware", isoUrl: "https://github.com/Tomas-M/slax/releases/download/15.0.0/slax-64bit-slackware-15.0.0.iso" }
    ]
  },
  { 
    id: "tinycore", 
    name: "Tiny Core Linux", 
    category: "Linux", 
    isoUrl: "http://tinycorelinux.net/14.x/x86_64/release/CorePure64-14.0.iso",
    editions: [
      { id: "tinycore", name: "TinyCore GUI (64-bit)", size: "32 MB", desc: "Ultra Micro Modular Linux with FLTK Desktop", isoUrl: "http://tinycorelinux.net/14.x/x86_64/release/CorePure64-14.0.iso", recommended: true },
      { id: "coreplus", name: "CorePlus (Full Extras)", size: "160 MB", desc: "Includes Wi-Fi drivers & 7 Window Managers", isoUrl: "http://tinycorelinux.net/14.x/x86/release/CorePlus-current.iso" }
    ]
  },
  { 
    id: "qubes", 
    name: "Qubes OS 4.2.1", 
    category: "Security", 
    isoUrl: "https://mirrors.edge.kernel.org/qubes/iso/Qubes-R4.2.1-x86_64.iso",
    editions: [
      { id: "standard", name: "Qubes OS 4.2.1 Full Installer", size: "6.1 GB", desc: "Security by Compartmentalization (Xen Hypervisor)", isoUrl: "https://mirrors.edge.kernel.org/qubes/iso/Qubes-R4.2.1-x86_64.iso", recommended: true }
    ]
  },
  { 
    id: "whonix", 
    name: "Whonix XFCE", 
    category: "Security", 
    isoUrl: "https://whonix.org/wiki/Special:Download?os=windows",
    editions: [
      { id: "xfce", name: "Whonix Gateway + Workstation", size: "2.2 GB", desc: "Full Anonymous Tor-Routed OS for VirtualBox", isoUrl: "https://whonix.org/wiki/Special:Download?os=windows", recommended: true }
    ]
  },
  { 
    id: "truenas", 
    name: "TrueNAS SCALE", 
    category: "Server", 
    isoUrl: "https://download.truenas.com/TrueNAS-SCALE-Cobia/23.10.2/TrueNAS-SCALE-23.10.2.iso",
    editions: [
      { id: "scale", name: "TrueNAS SCALE (Linux / KVM)", size: "1.7 GB", desc: "Hyperconverged Infrastructure with Docker & KVM", isoUrl: "https://download.truenas.com/TrueNAS-SCALE-Cobia/23.10.2/TrueNAS-SCALE-23.10.2.iso", recommended: true },
      { id: "core", name: "TrueNAS CORE (FreeBSD / ZFS)", size: "1.1 GB", desc: "Enterprise Open-Source Storage Appliance", isoUrl: "https://download.truenas.com/TrueNAS-CORE-13.0/13.0-U6.1/TrueNAS-13.0-U6.1.iso" }
    ]
  },
  { 
    id: "freebsd", 
    name: "FreeBSD", 
    category: "Server", 
    isoUrl: "https://download.freebsd.org/releases/amd64/amd64/ISO-IMAGES/14.0/FreeBSD-14.0-RELEASE-amd64-disc1.iso",
    editions: [
      { id: "disc1", name: "FreeBSD 14.0 DVD Image", size: "4.5 GB", desc: "Complete Offline Packages & System Tools", isoUrl: "https://download.freebsd.org/releases/amd64/amd64/ISO-IMAGES/14.0/FreeBSD-14.0-RELEASE-amd64-disc1.iso", recommended: true },
      { id: "bootonly", name: "FreeBSD 14.0 Netboot", size: "450 MB", desc: "Minimal Network Installation CD", isoUrl: "https://download.freebsd.org/releases/amd64/amd64/ISO-IMAGES/14.0/FreeBSD-14.0-RELEASE-amd64-bootonly.iso" }
    ]
  },
  { 
    id: "reactos", 
    name: "ReactOS", 
    category: "Windows", 
    isoUrl: "https://reactos.org/getbuilds/ReactOS-0.4.15-live.iso",
    editions: [
      { id: "live", name: "ReactOS 0.4.15 Live CD", size: "120 MB", desc: "Free Open-Source Windows NT/XP Compatible Live OS", isoUrl: "https://reactos.org/getbuilds/ReactOS-0.4.15-live.iso", recommended: true },
      { id: "boot", name: "ReactOS 0.4.15 Install CD", size: "130 MB", desc: "Full Bootable Installer", isoUrl: "https://reactos.org/getbuilds/ReactOS-0.4.15-iso.zip" }
    ]
  },
  { 
    id: "haiku", 
    name: "Haiku OS", 
    category: "Linux", 
    isoUrl: "https://s3.wasabisys.com/haiku-nightly/x86_64/haiku-master-hrev57662-x86_64-anyboot.iso",
    editions: [
      { id: "anyboot", name: "Haiku R1/Beta Anyboot", size: "1.4 GB", desc: "Fast, Clean, and Elegant BeOS Successor", isoUrl: "https://s3.wasabisys.com/haiku-nightly/x86_64/haiku-master-hrev57662-x86_64-anyboot.iso", recommended: true }
    ]
  },
  { 
    id: "openbsd", 
    name: "OpenBSD", 
    category: "Server", 
    isoUrl: "https://cdn.openbsd.org/pub/OpenBSD/7.5/amd64/install75.iso",
    editions: [
      { id: "install", name: "OpenBSD 7.5 Full Install", size: "650 MB", desc: "Ultra-Secure by Default Unix System", isoUrl: "https://cdn.openbsd.org/pub/OpenBSD/7.5/amd64/install75.iso", recommended: true },
      { id: "miniroot", name: "OpenBSD 7.5 Miniroot", size: "10 MB", desc: "Minimal Network Boot", isoUrl: "https://cdn.openbsd.org/pub/OpenBSD/7.5/amd64/miniroot75.img" }
    ]
  },
  { 
    id: "netbsd", 
    name: "NetBSD", 
    category: "Server", 
    isoUrl: "https://cdn.netbsd.org/pub/NetBSD/NetBSD-10.0/images/NetBSD-10.0-amd64.iso",
    editions: [
      { id: "install", name: "NetBSD 10.0 Full ISO", size: "640 MB", desc: "Highly Portable Clean Architecture Unix", isoUrl: "https://cdn.netbsd.org/pub/NetBSD/NetBSD-10.0/images/NetBSD-10.0-amd64.iso", recommended: true }
    ]
  },
  { 
    id: "macos", 
    name: "macOS", 
    category: "macOS", 
    isoUrl: "https://swcdn.apple.com/content/downloads/macos/official-recovery.dmg", 
    officialSite: "https://support.apple.com/en-us/102662", 
    locked: true,
    editions: [
      { id: "sonoma", name: "macOS Sonoma (14.5)", size: "650 MB", desc: "Apple Recovery Base Image", isoUrl: "https://swcdn.apple.com/content/downloads/macos/official-recovery.dmg", recommended: true }
    ]
  },
  { 
    id: "omnios", 
    name: "OmniOS", 
    category: "Server", 
    isoUrl: "https://omnios.org/download/omnios-r151048.iso",
    editions: [
      { id: "ce", name: "OmniOS Community Edition", size: "750 MB", desc: "illumos-based Enterprise Server with ZFS & Bhyve", isoUrl: "https://omnios.org/download/omnios-r151048.iso", recommended: true }
    ]
  },
  { 
    id: "gentoo", 
    name: "Gentoo", 
    category: "Linux", 
    isoUrl: "https://distfiles.gentoo.org/releases/amd64/autobuilds/20240407T170428Z/install-amd64-minimal-20240407T170428Z.iso",
    editions: [
      { id: "minimal", name: "Gentoo Minimal CD", size: "500 MB", desc: "Source-based meta-distribution minimal installer", isoUrl: "https://distfiles.gentoo.org/releases/amd64/autobuilds/20240407T170428Z/install-amd64-minimal-20240407T170428Z.iso", recommended: true },
      { id: "livegui", name: "Gentoo LiveGUI", size: "4.8 GB", desc: "Full Graphical Live Environment for Gentoo", isoUrl: "https://distfiles.gentoo.org/releases/amd64/autobuilds/current-livegui-amd64/livegui-amd64-20240407T170428Z.iso" }
    ]
  },
  { 
    id: "slackware", 
    name: "Slackware", 
    category: "Linux", 
    isoUrl: "https://mirrors.slackware.com/slackware/slackware-iso/slackware64-15.0-iso/slackware64-15.0-install-dvd.iso",
    editions: [
      { id: "dvd", name: "Slackware 15.0 64-bit DVD", size: "3.6 GB", desc: "The Oldest Active Unix-like Linux Distribution", isoUrl: "https://mirrors.slackware.com/slackware/slackware-iso/slackware64-15.0-iso/slackware64-15.0-install-dvd.iso", recommended: true }
    ]
  },
  { 
    id: "kdeneon", 
    name: "KDE Neon", 
    category: "Linux", 
    isoUrl: "https://files.kde.org/neon/images/user/20240411-0714/neon-user-20240411-0714.iso",
    editions: [
      { id: "user", name: "KDE Neon User Edition", size: "2.5 GB", desc: "Latest Bleeding-Edge Official KDE Software", isoUrl: "https://files.kde.org/neon/images/user/20240411-0714/neon-user-20240411-0714.iso", recommended: true },
      { id: "testing", name: "KDE Neon Testing Edition", size: "2.6 GB", desc: "Pre-release Quality KDE Frameworks & Apps", isoUrl: "https://files.kde.org/neon/images/testing/20240411-0714/neon-testing-20240411-0714.iso" }
    ]
  },
  { 
    id: "nobara", 
    name: "Nobara Linux", 
    category: "Linux", 
    isoUrl: "https://nobaraproject.org/download/nobara-39-official.iso",
    editions: [
      { id: "official", name: "Nobara 39 Official (GNOME)", size: "3.8 GB", desc: "Gaming-Optimized Kernel with Proton & Wine Patches", isoUrl: "https://nobaraproject.org/download/nobara-39-official.iso", recommended: true },
      { id: "kde", name: "Nobara 39 KDE Plasma", size: "3.9 GB", desc: "Gaming & Content Creation with Plasma Desktop", isoUrl: "https://nobaraproject.org/download/nobara-39-kde.iso" },
      { id: "steamdeck", name: "Nobara 39 Handheld / Steam Deck", size: "4.0 GB", desc: "Customized for Handheld PCs (ROG Ally, Legion Go)", isoUrl: "https://nobaraproject.org/download/nobara-39-steamdeck.iso" }
    ]
  },
  { 
    id: "vanillaos", 
    name: "Vanilla OS", 
    category: "Linux", 
    isoUrl: "https://github.com/Vanilla-OS/os/releases/download/v2.0.0/VanillaOS-2.0.0.iso",
    editions: [
      { id: "orchid", name: "Vanilla OS 2 Orchid", size: "2.5 GB", desc: "Immutable On-Demand OCI Subsystem Container OS", isoUrl: "https://github.com/Vanilla-OS/os/releases/download/v2.0.0/VanillaOS-2.0.0.iso", recommended: true }
    ]
  },
  { 
    id: "blissos", 
    name: "Bliss OS", 
    category: "Linux", 
    isoUrl: "https://sourceforge.net/projects/blissos-dev/files/BlissOS/BlissOS-16/BlissOS-16.iso",
    editions: [
      { id: "bliss16", name: "Bliss OS 16 (Android 13 PC)", size: "2.1 GB", desc: "Native Android for PC with Keymapping & Gaming Tools", isoUrl: "https://sourceforge.net/projects/blissos-dev/files/BlissOS/BlissOS-16/BlissOS-16.iso", recommended: true },
      { id: "bliss15", name: "Bliss OS 15 (Android 12 PC)", size: "1.9 GB", desc: "Stable Legacy Compatibility Edition", isoUrl: "https://sourceforge.net/projects/blissos-dev/files/BlissOS/BlissOS-15/BlissOS-15.iso" }
    ]
  },
  { 
    id: "templeos", 
    name: "TempleOS", 
    category: "Server", 
    isoUrl: "https://templeos.org/Downloads/TempleOS.ISO",
    editions: [
      { id: "standard", name: "TempleOS Standard ISO", size: "17 MB", desc: "64-bit Non-preemptive HolyC Operating System", isoUrl: "https://templeos.org/Downloads/TempleOS.ISO", recommended: true }
    ]
  },
  { 
    id: "kolibrios", 
    name: "KolibriOS", 
    category: "Linux", 
    isoUrl: "http://kolibrios.org/releases/KolibriOS-0.7.7.0.iso",
    editions: [
      { id: "standard", name: "KolibriOS 0.7.7 Live", size: "5 MB", desc: "100% Written in Assembly (Boots in 1 Second)", isoUrl: "http://kolibrios.org/releases/KolibriOS-0.7.7.0.iso", recommended: true }
    ]
  },
  { 
    id: "rhel", 
    name: "Red Hat Enterprise Linux", 
    category: "Server", 
    isoUrl: "https://developers.redhat.com/content-gateway/rest/mirror/pub/openshift-v4/dependencies/rhcos/latest/rhcos-live.x86_64.iso", 
    officialSite: "https://developers.redhat.com/products/rhel/download", 
    locked: true,
    editions: [
      { id: "dvd", name: "RHEL 9.4 Binary DVD", size: "9.8 GB", desc: "Industry Standard Enterprise Server OS", isoUrl: "https://developers.redhat.com/products/rhel/download", recommended: true },
      { id: "boot", name: "RHEL 9.4 Boot ISO", size: "950 MB", desc: "Network Installation Media", isoUrl: "https://developers.redhat.com/products/rhel/download" }
    ]
  },
  { 
    id: "tens", 
    name: "TENS (NSA/DoD)", 
    category: "Security", 
    isoUrl: "https://www.tens.af.mil/iso/tens-3.1.2-public.iso",
    editions: [
      { id: "public", name: "TENS 3.1.2 Public", size: "650 MB", desc: "US Air Force / DoD Trusted End System", isoUrl: "https://www.tens.af.mil/iso/tens-3.1.2-public.iso", recommended: true }
    ]
  },
  { 
    id: "kodachi", 
    name: "Linux Kodachi", 
    category: "Security", 
    isoUrl: "https://sourceforge.net/projects/linuxkodachi/files/latest/download",
    editions: [
      { id: "standard", name: "Linux Kodachi 8.27", size: "3.5 GB", desc: "Secure Anti-Forensic Anonymous OS", isoUrl: "https://sourceforge.net/projects/linuxkodachi/files/latest/download", recommended: true }
    ]
  },
  { 
    id: "hardenedbsd", 
    name: "HardenedBSD", 
    category: "Security", 
    isoUrl: "https://installer.hardenedbsd.org/pub/HardenedBSD/releases/amd64/amd64/ISO-IMAGES/13-STABLE/HardenedBSD-13-STABLE-v1300063-amd64-disc1.iso",
    editions: [
      { id: "disc1", name: "HardenedBSD 13-STABLE", size: "1.2 GB", desc: "Exploit Mitigation & PaX ASLR Hardened Unix", isoUrl: "https://installer.hardenedbsd.org/pub/HardenedBSD/releases/amd64/amd64/ISO-IMAGES/13-STABLE/HardenedBSD-13-STABLE-v1300063-amd64-disc1.iso", recommended: true }
    ]
  },
  { 
    id: "integrity", 
    name: "Green Hills INTEGRITY", 
    category: "Server", 
    isoUrl: "https://www.ghs.com/products/rtos/integrity.html", 
    officialSite: "https://www.ghs.com/products/rtos/integrity.html", 
    locked: true,
    editions: [
      { id: "rtos", name: "INTEGRITY 178B RTOS", size: "150 MB", desc: "DO-178C / EAL 6+ Certified Safety Critical OS", isoUrl: "https://www.ghs.com/products/rtos/integrity.html", recommended: true }
    ]
  },
  { 
    id: "subgraph", 
    name: "Subgraph OS", 
    category: "Security", 
    isoUrl: "https://subgraph.com/sgos/download/subgraph-os-alpha-latest.iso",
    editions: [
      { id: "alpha", name: "Subgraph OS Alpha", size: "1.8 GB", desc: "Adversary-Resistant Sandbox Computing", isoUrl: "https://subgraph.com/sgos/download/subgraph-os-alpha-latest.iso", recommended: true }
    ]
  },
  { 
    id: "pureos", 
    name: "PureOS", 
    category: "Linux", 
    isoUrl: "https://downloads.puri.sm/pureos/gnome/gnome-live-latest-amd64.iso",
    editions: [
      { id: "gnome", name: "PureOS GNOME Live", size: "2.4 GB", desc: "FSF Endorsed 100% Free Software OS", isoUrl: "https://downloads.puri.sm/pureos/gnome/gnome-live-latest-amd64.iso", recommended: true }
    ]
  },
  { 
    id: "sel4", 
    name: "seL4 Microkernel", 
    category: "Security", 
    isoUrl: "https://github.com/seL4/seL4/releases/download/v12.1.0/seL4-x86_64.iso", 
    officialSite: "https://sel4.systems/", 
    locked: true,
    editions: [
      { id: "x86", name: "seL4 Microkernel Live", size: "50 MB", desc: "Formally Verified High-Assurance Security Kernel", isoUrl: "https://github.com/seL4/seL4/releases/download/v12.1.0/seL4-x86_64.iso", recommended: true }
    ]
  },
  { 
    id: "clearlinux", 
    name: "Clear Linux", 
    category: "Linux", 
    isoUrl: "https://cdn.download.clearlinux.org/releases/latest/clear/clear-linux-live-desktop.iso",
    editions: [
      { id: "desktop", name: "Clear Linux Desktop", size: "3.2 GB", desc: "Intel Optimized AVX-512 Performance OS", isoUrl: "https://cdn.download.clearlinux.org/releases/latest/clear/clear-linux-live-desktop.iso", recommended: true },
      { id: "server", name: "Clear Linux Server", size: "800 MB", desc: "Cloud & Container Workloads", isoUrl: "https://cdn.download.clearlinux.org/releases/latest/clear/clear-linux-server.iso" }
    ]
  },
  { 
    id: "septor", 
    name: "Septor Linux", 
    category: "Security", 
    isoUrl: "https://sourceforge.net/projects/septor/files/latest/download",
    editions: [
      { id: "kde", name: "Septor Linux KDE", size: "2.4 GB", desc: "Tor-Routed Privacy Focused Debian System", isoUrl: "https://sourceforge.net/projects/septor/files/latest/download", recommended: true }
    ]
  },
  { 
    id: "alpine-extended", 
    name: "Alpine Extended", 
    category: "Server", 
    isoUrl: "https://dl-cdn.alpinelinux.org/alpine/v3.19/releases/x86_64/alpine-extended-3.19.1-x86_64.iso",
    editions: [
      { id: "extended", name: "Alpine Extended Drivers", size: "800 MB", desc: "Includes Extra Firmware and Networking Packages", isoUrl: "https://dl-cdn.alpinelinux.org/alpine/v3.19/releases/x86_64/alpine-extended-3.19.1-x86_64.iso", recommended: true }
    ]
  },
  { 
    id: "grapheneos", 
    name: "GrapheneOS", 
    category: "Security", 
    isoUrl: "https://releases.grapheneos.org/shiba-install-2024050100.zip", 
    officialSite: "https://grapheneos.org/install", 
    locked: true,
    editions: [
      { id: "factory", name: "GrapheneOS Factory Image", size: "1.8 GB", desc: "Hardened Privacy Android OS", isoUrl: "https://releases.grapheneos.org/shiba-install-2024050100.zip", recommended: true }
    ]
  },
  { 
    id: "cachyos", 
    name: "CachyOS", 
    category: "Linux", 
    isoUrl: "https://mirror.cachyos.org/ISO/desktop/240609/cachyos-desktop-linux-240609.iso", 
    officialSite: "https://cachyos.org/",
    editions: [
      { id: "kde", name: "CachyOS KDE Plasma (x86-64-v3)", size: "2.7 GB", desc: "Optimized BORE / EEVDF Kernels with CPU Specific Instructions", isoUrl: "https://mirror.cachyos.org/ISO/desktop/240609/cachyos-desktop-linux-240609.iso", recommended: true },
      { id: "gnome", name: "CachyOS GNOME", size: "2.6 GB", desc: "Ultra-Fast Optimized GNOME Desktop", isoUrl: "https://mirror.cachyos.org/ISO/gnome/240609/cachyos-gnome-linux-240609.iso" },
      { id: "hyprland", name: "CachyOS Hyprland", size: "2.3 GB", desc: "Fluid Wayland Tiling Window Manager", isoUrl: "https://mirror.cachyos.org/ISO/hyprland/240609/cachyos-hyprland-linux-240609.iso" }
    ]
  },
  { 
    id: "bazzite", 
    name: "Bazzite Gaming OS", 
    category: "Linux", 
    isoUrl: "https://github.com/ublue-os/bazzite/releases/latest/download/bazzite-gnome.iso", 
    officialSite: "https://bazzite.gg/",
    editions: [
      { id: "gnome", name: "Bazzite GNOME Edition", size: "3.6 GB", desc: "Steam Gaming Ready with GameMode & Proton (Recommended)", isoUrl: "https://github.com/ublue-os/bazzite/releases/latest/download/bazzite-gnome.iso", recommended: true },
      { id: "kde", name: "Bazzite KDE Plasma", size: "3.8 GB", desc: "Steam Big Picture & Desktop Hybrid", isoUrl: "https://github.com/ublue-os/bazzite/releases/latest/download/bazzite-kde.iso" },
      { id: "deck", name: "Bazzite Steam Deck / Ally Edition", size: "3.9 GB", desc: "Handheld Ready with Controller Gyro Mapping", isoUrl: "https://github.com/ublue-os/bazzite/releases/latest/download/bazzite-deck.iso" }
    ]
  },
  { 
    id: "athena", 
    name: "Athena OS", 
    category: "Security", 
    isoUrl: "https://sourceforge.net/projects/athena-os/files/latest/download", 
    officialSite: "https://athenaos.org/",
    editions: [
      { id: "cyber", name: "Athena OS Cyber Security", size: "3.5 GB", desc: "InfoSec & Pentesting with Role Selection (Red/Blue Team)", isoUrl: "https://sourceforge.net/projects/athena-os/files/latest/download", recommended: true },
      { id: "student", name: "Athena OS Student Edition", size: "3.2 GB", desc: "Optimized for Ethical Hacking Learners & CTFs", isoUrl: "https://sourceforge.net/projects/athena-os/files/student/download" }
    ]
  },
  { 
    id: "proxmox", 
    name: "Proxmox VE 8.2", 
    category: "Server", 
    isoUrl: "https://www.proxmox.com/en/downloads/item/proxmox-ve-8-2-iso-installer", 
    officialSite: "https://www.proxmox.com/",
    editions: [
      { id: "ve", name: "Proxmox VE 8.2 ISO Installer", size: "1.3 GB", desc: "Enterprise Virtualization Platform (KVM & LXC)", isoUrl: "https://www.proxmox.com/en/downloads/item/proxmox-ve-8-2-iso-installer", recommended: true }
    ]
  },
  { 
    id: "ghostbsd", 
    name: "GhostBSD 24.01", 
    category: "BSD", 
    isoUrl: "https://ghostbsd.org/download", 
    officialSite: "https://ghostbsd.org/",
    editions: [
      { id: "mate", name: "GhostBSD MATE Desktop", size: "2.9 GB", desc: "User-friendly FreeBSD for Everyday Desktop Computing", isoUrl: "https://ghostbsd.org/download", recommended: true },
      { id: "xfce", name: "GhostBSD XFCE Community", size: "2.7 GB", desc: "Lightweight High Performance BSD Desktop", isoUrl: "https://ghostbsd.org/download" }
    ]
  },
  { 
    id: "freedos", 
    name: "FreeDOS 1.3", 
    category: "Other", 
    isoUrl: "https://www.freedos.org/download/download/FD13-FullUSB.zip", 
    officialSite: "https://www.freedos.org/",
    editions: [
      { id: "full", name: "FreeDOS 1.3 Full Live USB", size: "510 MB", desc: "Complete 16-bit DOS Environment with Legacy Tools & Games", isoUrl: "https://www.freedos.org/download/download/FD13-FullUSB.zip", recommended: true },
      { id: "lite", name: "FreeDOS 1.3 Lite CD", size: "20 MB", desc: "Base DOS Kernel & Command Line", isoUrl: "https://www.freedos.org/download/download/FD13-LiteCD.zip" }
    ]
  },
  { 
    id: "commandovm", 
    name: "Commando VM", 
    category: "Security", 
    isoUrl: "https://github.com/mandiant/commando-vm", 
    officialSite: "https://www.mandiant.com/",
    editions: [
      { id: "full", name: "Commando VM Complete Suite", size: "4.5 GB", desc: "Mandiant Complete Windows Red Team & Penetration Suite", isoUrl: "https://github.com/mandiant/commando-vm", recommended: true }
    ]
  },
  { 
    id: "eurolinux", 
    name: "EuroLinux 9", 
    category: "Server", 
    isoUrl: "https://fdd.el.euro-linux.com/iso/eurolinux-9-x86_64-latest.iso", 
    officialSite: "https://en.euro-linux.com/",
    editions: [
      { id: "dvd", name: "EuroLinux 9 Full DVD", size: "9.2 GB", desc: "Enterprise Server with Commercial Grade Support", isoUrl: "https://fdd.el.euro-linux.com/iso/eurolinux-9-x86_64-latest.iso", recommended: true },
      { id: "minimal", name: "EuroLinux 9 Minimal", size: "1.6 GB", desc: "Minimal Server Base", isoUrl: "https://fdd.el.euro-linux.com/iso/eurolinux-9-minimal.iso" }
    ]
  },
  { 
    id: "pop-cosmic", 
    name: "Pop!_OS 24.04 COSMIC", 
    category: "Linux", 
    isoUrl: "https://iso.pop-os.org/24.04/amd64/intel/pop-os_24.04_amd64_intel.iso", 
    officialSite: "https://pop.system76.com/",
    editions: [
      { id: "intel", name: "COSMIC Intel / AMD Edition", size: "3.4 GB", desc: "Rust-Powered Modern COSMIC Desktop Experience", isoUrl: "https://iso.pop-os.org/24.04/amd64/intel/pop-os_24.04_amd64_intel.iso", recommended: true },
      { id: "nvidia", name: "COSMIC NVIDIA Dedicated Edition", size: "3.7 GB", desc: "Preconfigured with Proprietary NVIDIA Drivers", isoUrl: "https://iso.pop-os.org/24.04/amd64/nvidia/pop-os_24.04_amd64_nvidia.iso" }
    ]
  },
  { 
    id: "asahi", 
    name: "Asahi Linux (Apple Silicon)", 
    category: "Linux", 
    isoUrl: "https://asahilinux.org/", 
    officialSite: "https://asahilinux.org/",
    editions: [
      { id: "remix", name: "Fedora Asahi Remix", size: "2.2 GB", desc: "Flagship Distribution for Apple Silicon (M1/M2/M3)", isoUrl: "https://asahilinux.org/", recommended: true }
    ]
  },
  
  // PHASE 1: SPECIALIZED WORKSTATION & RECOVERY OSES
  { 
    id: "garuda-dragonfly", 
    name: "Garuda Linux Wayfire", 
    category: "Linux", 
    isoUrl: "https://iso.builds.garudalinux.org/iso/garuda/wayfire/240501/garuda-wayfire-linux-zen-240501.iso", 
    officialSite: "https://garudalinux.org/",
    editions: [
      { id: "wayfire", name: "Garuda Wayfire 3D Desktop", size: "2.8 GB", desc: "3D Wayland Compositor with Compiz-like Effects", isoUrl: "https://iso.builds.garudalinux.org/iso/garuda/wayfire/240501/garuda-wayfire-linux-zen-240501.iso", recommended: true }
    ]
  },
  { 
    id: "fedora-kinoite", 
    name: "Fedora Kinoite 40", 
    category: "Linux", 
    isoUrl: "https://download.fedoraproject.org/pub/fedora/linux/releases/40/Kinoite/x86_64/iso/Fedora-Kinoite-ostree-x86_64-40-1.14.iso", 
    officialSite: "https://fedoraproject.org/kinoite/",
    editions: [
      { id: "kinoite", name: "Fedora Kinoite (KDE Immutable)", size: "2.9 GB", desc: "Atomic Desktop with KDE Plasma & Flatpak", isoUrl: "https://download.fedoraproject.org/pub/fedora/linux/releases/40/Kinoite/x86_64/iso/Fedora-Kinoite-ostree-x86_64-40-1.14.iso", recommended: true }
    ]
  },
  { 
    id: "fedora-silverblue", 
    name: "Fedora Silverblue 40", 
    category: "Linux", 
    isoUrl: "https://download.fedoraproject.org/pub/fedora/linux/releases/40/Silverblue/x86_64/iso/Fedora-Silverblue-ostree-x86_64-40-1.14.iso", 
    officialSite: "https://fedoraproject.org/silverblue/",
    editions: [
      { id: "silverblue", name: "Fedora Silverblue (GNOME Immutable)", size: "2.8 GB", desc: "Atomic Container-Centric Desktop OS", isoUrl: "https://download.fedoraproject.org/pub/fedora/linux/releases/40/Silverblue/x86_64/iso/Fedora-Silverblue-ostree-x86_64-40-1.14.iso", recommended: true }
    ]
  },
  { 
    id: "opensuse-leap", 
    name: "openSUSE Leap 15.6", 
    category: "Server", 
    isoUrl: "https://download.opensuse.org/distribution/leap/15.6/iso/openSUSE-Leap-15.6-DVD-x86_64-Media.iso", 
    officialSite: "https://get.opensuse.org/leap/",
    editions: [
      { id: "dvd", name: "openSUSE Leap 15.6 Full DVD", size: "4.0 GB", desc: "Enterprise Grade Stable Release built alongside SLE", isoUrl: "https://download.opensuse.org/distribution/leap/15.6/iso/openSUSE-Leap-15.6-DVD-x86_64-Media.iso", recommended: true },
      { id: "net", name: "openSUSE Leap 15.6 Netinstall", size: "200 MB", desc: "Lightweight Network Installation Media", isoUrl: "https://download.opensuse.org/distribution/leap/15.6/iso/openSUSE-Leap-15.6-NET-x86_64-Media.iso" }
    ]
  },
  { 
    id: "systemrescue", 
    name: "SystemRescue 11.01", 
    category: "Security", 
    isoUrl: "https://osdn.net/dl/systemrescue/systemrescue-11.01-amd64.iso", 
    officialSite: "https://www.system-rescue.org/",
    editions: [
      { id: "standard", name: "SystemRescue 11.01 Admin Suite", size: "850 MB", desc: "Essential Bootable Toolset for System Recovery & Repair", isoUrl: "https://osdn.net/dl/systemrescue/systemrescue-11.01-amd64.iso", recommended: true }
    ]
  },
  { 
    id: "clonezilla", 
    name: "Clonezilla Live 3.1.2", 
    category: "Security", 
    isoUrl: "https://free.nchc.org.tw/clonezilla-live/alternative/testing/3.1.2-22/clonezilla-live-3.1.2-22-amd64.iso", 
    officialSite: "https://clonezilla.org/",
    editions: [
      { id: "debian", name: "Clonezilla Live (Debian Base)", size: "390 MB", desc: "High Performance Partition & Disk Imaging", isoUrl: "https://free.nchc.org.tw/clonezilla-live/alternative/testing/3.1.2-22/clonezilla-live-3.1.2-22-amd64.iso", recommended: true },
      { id: "ubuntu", name: "Clonezilla Live (Ubuntu Base)", size: "430 MB", desc: "With Newer Drivers for New Hardware", isoUrl: "https://free.nchc.org.tw/clonezilla-live/alternative/ubuntu-3.1.2-amd64.iso" }
    ]
  },
  { 
    id: "gparted-live", 
    name: "GParted Live 1.6", 
    category: "Other", 
    isoUrl: "https://sourceforge.net/projects/gparted/files/gparted-live-stable/1.6.0-1/gparted-live-1.6.0-1-amd64.iso", 
    officialSite: "https://gparted.org/",
    editions: [
      { id: "standard", name: "GParted Live 1.6 GUI", size: "500 MB", desc: "Dedicated Partition Management & Disk Formatting", isoUrl: "https://sourceforge.net/projects/gparted/files/gparted-live-stable/1.6.0-1/gparted-live-1.6.0-1-amd64.iso", recommended: true }
    ]
  },
  { 
    id: "endlessos", 
    name: "Endless OS 6", 
    category: "Linux", 
    isoUrl: "https://images-flatpak.endlessm.com/eos-amd64-amd64/base/eos-amd64-amd64.6.0.0.iso", 
    officialSite: "https://endlessos.org/",
    editions: [
      { id: "basic", name: "Endless OS 6 Basic", size: "3.5 GB", desc: "Clean Desktop OS for Learning & Creativity", isoUrl: "https://images-flatpak.endlessm.com/eos-amd64-amd64/base/eos-amd64-amd64.6.0.0.iso", recommended: true },
      { id: "full", name: "Endless OS 6 Full (Offline Wiki)", size: "16.0 GB", desc: "Includes Entire Offline Wikipedia & Educational Content", isoUrl: "https://images-flatpak.endlessm.com/eos-amd64-amd64/full/eos-amd64-amd64.6.0.0-full.iso" }
    ]
  },
  { 
    id: "kaos", 
    name: "KaOS 2024", 
    category: "Linux", 
    isoUrl: "https://sourceforge.net/projects/kaosx/files/ISO/KaOS-2024.05-x86_64.iso/download", 
    officialSite: "https://kaosx.us/",
    editions: [
      { id: "kde", name: "KaOS 2024.05 KDE Plasma 6", size: "3.2 GB", desc: "Pure, Focused KDE & Qt Rolling Release", isoUrl: "https://sourceforge.net/projects/kaosx/files/ISO/KaOS-2024.05-x86_64.iso/download", recommended: true }
    ]
  },
  { 
    id: "easyos", 
    name: "EasyOS 6.0", 
    category: "Linux", 
    isoUrl: "https://distro.ibiblio.org/easyos/amd64/releases/bookworm/2024/easy-6.0-amd64.img", 
    officialSite: "https://easyos.org/",
    editions: [
      { id: "bookworm", name: "EasyOS 6.0 Bookworm", size: "950 MB", desc: "Containerized Desktop by the Creator of Puppy Linux", isoUrl: "https://distro.ibiblio.org/easyos/amd64/releases/bookworm/2024/easy-6.0-amd64.img", recommended: true }
    ]
  },
  
  // PHASE 2: ENTERPRISE, GAMING & SPECIALIZED UNIX OSES
  { 
    id: "miraclelinux", 
    name: "Miracle Linux 9", 
    category: "Server", 
    isoUrl: "https://miraclelinux.com/iso/MiracleLinux-9.2-x86_64-dvd.iso", 
    officialSite: "https://miraclelinux.com/",
    editions: [
      { id: "dvd", name: "Miracle Linux 9.2 DVD", size: "9.4 GB", desc: "Japanese Enterprise Red Hat Compatible Server OS", isoUrl: "https://miraclelinux.com/iso/MiracleLinux-9.2-x86_64-dvd.iso", recommended: true }
    ]
  },
  { 
    id: "springdale", 
    name: "Springdale Linux 9", 
    category: "Server", 
    isoUrl: "http://springdale.math.ias.edu/data/puias/9.3/x86_64/os/images/boot.iso", 
    officialSite: "http://springdale.math.ias.edu/",
    editions: [
      { id: "boot", name: "Springdale 9 Boot ISO", size: "900 MB", desc: "Princeton University / Institute for Advanced Study Enterprise Linux", isoUrl: "http://springdale.math.ias.edu/data/puias/9.3/x86_64/os/images/boot.iso", recommended: true }
    ]
  },
  { 
    id: "solus", 
    name: "Solus 4.5 Resilience", 
    category: "Linux", 
    isoUrl: "https://cdn.getsol.us/images/Solus-4.5-Budgie.iso", 
    officialSite: "https://getsol.us/",
    editions: [
      { id: "budgie", name: "Solus 4.5 Budgie Flagship", size: "2.8 GB", desc: "Modern, Elegant & Intuitive Desktop", isoUrl: "https://cdn.getsol.us/images/Solus-4.5-Budgie.iso", recommended: true },
      { id: "gnome", name: "Solus 4.5 GNOME Desktop", size: "2.7 GB", desc: "Refined Pure GNOME Experience", isoUrl: "https://cdn.getsol.us/images/Solus-4.5-GNOME.iso" },
      { id: "plasma", name: "Solus 4.5 KDE Plasma", size: "2.9 GB", desc: "Rich Customizability with KDE 5/6", isoUrl: "https://cdn.getsol.us/images/Solus-4.5-Plasma.iso" },
      { id: "xfce", name: "Solus 4.5 XFCE Lightweight", size: "2.6 GB", desc: "Optimized for Lightweight Responsiveness", isoUrl: "https://cdn.getsol.us/images/Solus-4.5-XFCE.iso" }
    ]
  },
  { 
    id: "void", 
    name: "Void Linux", 
    category: "Linux", 
    isoUrl: "https://repo-default.voidlinux.org/live/current/void-live-x86_64-20230628-xfce.iso", 
    officialSite: "https://voidlinux.org/",
    editions: [
      { id: "xfce_glibc", name: "Void Linux XFCE (glibc)", size: "1.1 GB", desc: "General Purpose with XBPS and runit init (Recommended)", isoUrl: "https://repo-default.voidlinux.org/live/current/void-live-x86_64-20230628-xfce.iso", recommended: true },
      { id: "base_glibc", name: "Void Linux Base CLI (glibc)", size: "600 MB", desc: "Minimal Terminal Only Base", isoUrl: "https://repo-default.voidlinux.org/live/current/void-live-x86_64-20230628-base.iso" },
      { id: "xfce_musl", name: "Void Linux XFCE (musl libc)", size: "1.0 GB", desc: "Ultra-Lightweight Musl C Library Edition", isoUrl: "https://repo-default.voidlinux.org/live/current/void-live-x86_64-musl-20230628-xfce.iso" }
    ]
  },
  { 
    id: "devuan", 
    name: "Devuan GNU/Linux 5", 
    category: "Linux", 
    isoUrl: "https://files.devuan.org/devuan_daedalus/desktop-live/devuan_daedalus_5.0.0_amd64_desktop-live.iso", 
    officialSite: "https://www.devuan.org/",
    editions: [
      { id: "desktop", name: "Devuan 5 Daedalus Desktop Live", size: "3.8 GB", desc: "Debian without systemd init freedom", isoUrl: "https://files.devuan.org/devuan_daedalus/desktop-live/devuan_daedalus_5.0.0_amd64_desktop-live.iso", recommended: true },
      { id: "minimal", name: "Devuan 5 Netinstall", size: "450 MB", desc: "Minimal Network Boot Installer", isoUrl: "https://files.devuan.org/devuan_daedalus/netinstall/devuan_daedalus_5.0.0_amd64_netinst.iso" }
    ]
  },
  { 
    id: "q4os", 
    name: "Q4OS 5.4 Aquarius", 
    category: "Linux", 
    isoUrl: "https://sourceforge.net/projects/q4os/files/stable/q4os-5.4-x64.r1.iso", 
    officialSite: "https://q4os.org/",
    editions: [
      { id: "plasma", name: "Q4OS 5.4 KDE Plasma", size: "1.4 GB", desc: "Fast & Powerful Debian Based Desktop", isoUrl: "https://sourceforge.net/projects/q4os/files/stable/q4os-5.4-x64.r1.iso", recommended: true },
      { id: "trinity", name: "Q4OS 5.4 Trinity Desktop (TDE)", size: "1.1 GB", desc: "Classic Windows-like Ultra Low Hardware Footprint", isoUrl: "https://sourceforge.net/projects/q4os/files/stable/q4os-5.4-x64-tde.r1.iso" }
    ]
  },
  { 
    id: "zorin-lite", 
    name: "Zorin OS 17.1 Lite", 
    category: "Linux", 
    isoUrl: "https://mirrors.edge.kernel.org/zorinos/17/Zorin-OS-17.1-Lite-64-bit.iso", 
    officialSite: "https://zorin.com/os/",
    editions: [
      { id: "lite", name: "Zorin OS 17.1 Lite XFCE", size: "2.6 GB", desc: "Optimized for PCs up to 15 years old", isoUrl: "https://mirrors.edge.kernel.org/zorinos/17/Zorin-OS-17.1-Lite-64-bit.iso", recommended: true }
    ]
  },
  { 
    id: "lakka", 
    name: "LAKKA Retrogaming OS", 
    category: "Other", 
    isoUrl: "https://le.builds.lakka.tv/Generic.x86_64/Lakka-Generic.x86_64-5.0.img.gz", 
    officialSite: "https://www.lakka.tv/",
    editions: [
      { id: "generic", name: "LAKKA 5.0 Generic PC x86_64", size: "720 MB", desc: "Turns any PC into a dedicated RetroArch console", isoUrl: "https://le.builds.lakka.tv/Generic.x86_64/Lakka-Generic.x86_64-5.0.img.gz", recommended: true }
    ]
  },
  { 
    id: "batocera", 
    name: "Batocera.linux 39", 
    category: "Other", 
    isoUrl: "https://mirrors.kodi.tv/batocera/x86_64/batocera-x86_64-39-20240304.img.gz", 
    officialSite: "https://batocera.org/",
    editions: [
      { id: "standard", name: "Batocera.linux 39 Full x86_64", size: "3.2 GB", desc: "Plug & Play Retrogaming Suite with EmulationStation", isoUrl: "https://mirrors.kodi.tv/batocera/x86_64/batocera-x86_64-39-20240304.img.gz", recommended: true }
    ]
  },
  { 
    id: "arcaos", 
    name: "ArcaOS 5.1 (OS/2 Warp)", 
    category: "Other", 
    isoUrl: "https://www.arcanoae.com/arcaos-5-1-0-now-available/", 
    locked: true, 
    officialSite: "https://www.arcanoae.com/",
    editions: [
      { id: "commercial", name: "ArcaOS 5.1 Commercial Edition", size: "800 MB", desc: "Modernized OS/2 Warp 4 for Modern Hardware", isoUrl: "https://www.arcanoae.com/arcaos-5-1-0-now-available/", recommended: true }
    ]
  }
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