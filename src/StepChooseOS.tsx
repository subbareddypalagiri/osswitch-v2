import { useState, useMemo } from "react";

export const OS_LIST = [
  {id:"windows", name:"Windows 11", sub:"Currently installed Microsoft OS", glyph:"🪟", locked:true},
  {id:"ubuntu", name:"Ubuntu", sub:"Popular Debian-based Linux", glyph:"🟠"},
  {id:"mint", name:"Linux Mint", sub:"Beginner-friendly Ubuntu derivative", glyph:"🌿"},
  {id:"pop", name:"Pop!_OS", sub:"Optimized for creators & gaming", glyph:"🚀"},
  {id:"fedora", name:"Fedora", sub:"Leading-edge RPM distribution", glyph:"🎩"},
  {id:"kali", name:"Kali Linux", sub:"Advanced Penetration Testing Linux", glyph:"🛡️"},
  {id:"manjaro", name:"Manjaro", sub:"Accessible Arch-based distribution", glyph:"🌀"},
  {id:"chromeos", name:"ChromeOS Flex", sub:"Cloud-first Google OS", glyph:"☁️"},
  {id:"debian", name:"Debian", sub:"The Universal Operating System", glyph:"🎯"},
  {id:"opensuse", name:"openSUSE", sub:"Stable & reliable Linux platform", glyph:"🦎"},
  {id:"oracle", name:"Oracle Linux", sub:"Enterprise-class Linux", glyph:"🔴"},
  {id:"sles", name:"SUSE Linux", sub:"Enterprise Server Linux", glyph:"🟢"},
  {id:"arch", name:"Arch Linux", sub:"Lightweight and flexible Linux", glyph:"🏔️"},
  {id:"elementary", name:"elementary OS", sub:"Beautiful & elegant Linux", glyph:"✨"},
  {id:"zorin", name:"Zorin OS", sub:"Windows-like transition Linux", glyph:"💎"},
  {id:"freebsd", name:"FreeBSD", sub:"High-performance UNIX system", glyph:"😈"},
  {id:"reactos", name:"ReactOS", sub:"Open-source Windows alternative", glyph:"⚛️"},
  {id:"haiku", name:"Haiku OS", sub:"Fast, BeOS-inspired desktop", glyph:"🍂"},
  {id:"endeavouros", name:"EndeavourOS", sub:"Terminal-centric Arch Linux", glyph:"🚀"},
  {id:"nixos", name:"NixOS", sub:"Declarative and reproducible Linux", glyph:"❄️"},
  {id:"openbsd", name:"OpenBSD", sub:"Proactive security UNIX", glyph:"🐡"},
  {id:"netbsd", name:"NetBSD", sub:"Highly portable UNIX", glyph:"🚩"},
  {id:"macos", name:"macOS", sub:"Apple's Desktop Operating System", glyph:"🍎", locked:true},
  {id:"omnios", name:"OmniOS (Solaris)", sub:"Illumos-based Server UNIX", glyph:"🌞"},
  {id:"almalinux", name:"AlmaLinux", sub:"Enterprise-grade RHEL clone", glyph:"💠"},
  {id:"rocky", name:"Rocky Linux", sub:"Community-driven Enterprise Linux", glyph:"🏔️"},
  {id:"alpine", name:"Alpine Linux", sub:"Security-oriented, lightweight Linux", glyph:"🗻"},
  {id:"gentoo", name:"Gentoo", sub:"Highly customizable source Linux", glyph:"🐧"},
  {id:"slackware", name:"Slackware", sub:"The oldest maintained Linux", glyph:"📜"},
  {id:"linuxlite", name:"Linux Lite", sub:"Fast and lightweight Ubuntu", glyph:"🪶"},
  {id:"deepin", name:"Deepin", sub:"Elegant and user-friendly Linux", glyph:"🌌"},
  {id:"kdeneon", name:"KDE Neon", sub:"Latest KDE Plasma desktop", glyph:"💡"},
  {id:"garuda", name:"Garuda Linux", sub:"Performance-focused Arch Linux", glyph:"🦅"},
  {id:"nobara", name:"Nobara Linux", sub:"Fedora tailored for gaming", glyph:"🎮"},
  {id:"vanillaos", name:"Vanilla OS", sub:"Immutable GNOME desktop", glyph:"🍦"},
  {id:"tails", name:"Tails", sub:"Amnesic incognito live system", glyph:"🕵️"},
  {id:"qubes", name:"Qubes OS", sub:"Reasonably secure operating system", glyph:"🧊"},
  {id:"blissos", name:"Bliss OS", sub:"Open Source Android for PC", glyph:"📱"},
  {id:"templeos", name:"TempleOS", sub:"Public domain OS by Terry A. Davis", glyph:"⛪"},
  {id:"kolibrios", name:"KolibriOS", sub:"Extremely small Assembly OS", glyph:"🕊️"},
  {id:"cachyos", name:"CachyOS", sub:"Ultra CPU-optimized Arch Linux", glyph:"⚡"},
  {id:"bazzite", name:"Bazzite Gaming OS", sub:"SteamOS alternative for PC & Handhelds", glyph:"🎮"},
  {id:"athena", name:"Athena OS", sub:"Cyber Security & Pentesting Arch OS", glyph:"🪓"},
  {id:"proxmox", name:"Proxmox VE 8.2", sub:"Enterprise Virtualization Hypervisor", glyph:"⚡"},
  {id:"ghostbsd", name:"GhostBSD 24.01", sub:"User-friendly FreeBSD desktop", glyph:"👻"},
  {id:"freedos", name:"FreeDOS 1.3", sub:"Open Source DOS for legacy & firmware", glyph:"💾"},
  {id:"commandovm", name:"Commando VM", sub:"Mandiant Windows Security Suite", glyph:"🎯"},
  {id:"eurolinux", name:"EuroLinux 9", sub:"Enterprise RHEL-compatible OS", glyph:"🇪🇺"},
  {id:"pop-cosmic", name:"Pop!_OS 24.04 COSMIC", sub:"Next-gen Rust COSMIC desktop", glyph:"🌌"},
  {id:"asahi", name:"Asahi Linux", sub:"Linux for Apple Silicon Macs", glyph:"🍎"}
];

export default function StepChooseOS({ 
  onNext, 
  onBack,
  selectedOS,
  setSelectedOS,
  selectedIntents,
  setSelectedIntents,
  catalog
}: { 
  onNext: () => void, 
  onBack: () => void,
  selectedOS: string[],
  setSelectedOS: (osList: string[]) => void,
  selectedIntents: Record<string, string>,
  setSelectedIntents: (intents: Record<string, string>) => void,
  catalog: { id: string, name: string, category: string, locked?: boolean }[]
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"install" | "manage">("install");
  const [installedOSList, setInstalledOSList] = useState([
    { id: "windows", name: "Windows 11 Pro", type: "Host Operating System (C:\\)", used: "284.5 GB", total: "512.0 GB", glyph: "🪟", status: "Active Primary Host", isHost: true },
    { id: "ubuntu", name: "Ubuntu 24.04 LTS", type: "Dual-Boot (GRUB / EFI Partition)", used: "42.0 GB", total: "100.0 GB", glyph: "🟠", status: "Ready for Boot", isHost: false },
    { id: "kali", name: "Kali Linux 2024.1", type: "VirtualBox VM Environment", used: "35.0 GB", total: "60.0 GB", glyph: "🛡️", status: "Ready for VM Launch", isHost: false }
  ]);
  const [osMessage, setOsMessage] = useState<string | null>(null);

  const filteredOS = useMemo(() => {
    const mergedList = catalog.map(catEntry => {
      const staticMeta = OS_LIST.find(o => o.id === catEntry.id);
      return {
        id: catEntry.id,
        name: catEntry.name,
        sub: staticMeta?.sub || catEntry.category,
        glyph: staticMeta?.glyph || "📦",
        locked: staticMeta?.locked || catEntry.locked || false
      };
    });

    const q = searchQuery.toLowerCase().trim();
    if (!q) return mergedList;
    return mergedList.filter((os: any) => 
      os.name.toLowerCase().includes(q) || os.sub.toLowerCase().includes(q)
    );
  }, [searchQuery, catalog]);

  const toggleOS = (id: string) => {
    if (selectedOS.includes(id)) {
      setSelectedOS(selectedOS.filter(osId => osId !== id));
    } else {
      setSelectedOS([...selectedOS, id]);
    }
  };

  const handleIntentChange = (id: string, intent: string) => {
    setSelectedIntents({
      ...selectedIntents,
      [id]: intent
    });
  };

  const handleBootOS = (osId: string) => {
    setOsMessage(`Initiating 1-Click Boot sequence into ${osId}...`);
    setTimeout(() => setOsMessage(null), 4000);
  };

  const handleUninstallOS = (osId: string) => {
    setInstalledOSList(prev => prev.filter(o => o.id !== osId));
    setOsMessage(`Successfully uninstalled ${osId} and restored allocated partition space.`);
    setTimeout(() => setOsMessage(null), 4000);
  };

  const hasSelection = useMemo(() => selectedOS.some(id => id !== 'windows'), [selectedOS]);
  const selectedOSSet = useMemo(() => new Set(selectedOS), [selectedOS]);

  return (
    <div className="w-full h-full flex flex-col items-center mt-10">
      <div className="glass-card max-w-[1200px] p-10 w-full animate-[fadeIn_0.5s_ease-out] flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
            <span className="text-blue-500 text-sm font-bold uppercase tracking-widest">Step 3 of 7</span>
          </div>

          {/* Mode Tabs */}
          <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("install")}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "install" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
            >
              📥 Install New OS
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "manage" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
            >
              🖥️ Manage Installed OSes
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">{installedOSList.length}</span>
            </button>
          </div>
        </div>

        {osMessage && (
          <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 font-mono text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            {osMessage}
          </div>
        )}

        {activeTab === "manage" ? (
          <div className="flex-grow custom-scrollbar overflow-y-auto pr-2 -mr-2">
            <div className="text-slate-400 text-base mb-6">
              View, boot, or uninstall operating systems currently provisioned on your hardware or hypervisors.
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
              {installedOSList.map(os => (
                <div key={os.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:bg-white/10 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl drop-shadow-md">{os.glyph}</span>
                        <div>
                          <h3 className="text-xl font-bold text-white">{os.name}</h3>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">{os.type}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${os.isHost ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-blue-500/10 text-blue-400 border-blue-500/30"}`}>
                        {os.status}
                      </span>
                    </div>

                    {/* Storage usage bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                        <span>Storage Allocated</span>
                        <span className="text-white font-bold">{os.used} / {os.total}</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(parseFloat(os.used) / parseFloat(os.total)) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => handleBootOS(os.name)}
                      className="flex-1 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      🚀 Boot OS
                    </button>
                    {!os.isHost && (
                      <button
                        onClick={() => handleUninstallOS(os.id)}
                        className="py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-sm transition-all flex items-center justify-center gap-1"
                      >
                        🗑️ Uninstall
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <p className="text-slate-400 text-lg">Search, pick your OS, and choose your preferred installation method.</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search OS..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 pl-12 pr-6 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all w-[300px]"
                />
              </div>
            </div>
        
        <div className="flex-grow custom-scrollbar overflow-y-auto pr-2 -mr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
            {filteredOS.map((os: any) => {
              const isSelected = selectedOSSet.has(os.id);
              const intent = selectedIntents[os.id] || 'vbox_vm';
              
              return (
                <div 
                  key={os.id}
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-disabled={os.locked}
                  tabIndex={os.locked ? -1 : 0}
                  onKeyDown={(e) => {
                    if ((e.key === ' ' || e.key === 'Enter') && !os.locked) {
                      e.preventDefault();
                      toggleOS(os.id);
                    }
                  }}
                  className={`bg-white/5 border rounded-2xl p-5 flex flex-col transition-all cursor-pointer relative
                    ${os.locked ? 'opacity-60 cursor-not-allowed border-black/10 dark:border-white/10' : 
                      isSelected ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-black/10 dark:border-white/10 hover:bg-white/10'}`}
                  onClick={() => !os.locked && toggleOS(os.id)}
                >
                  {isSelected && !os.locked && (
                    <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] z-10"></div>
                  )}
                  <div className="flex items-center gap-4 mb-3 min-w-0 pr-6">
                    <span className="text-4xl drop-shadow-md flex-shrink-0">{os.glyph}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-slate-900 dark:text-white font-bold text-lg truncate">{os.name}</div>
                      <div className="text-slate-400 text-xs leading-tight line-clamp-2">{os.sub}</div>
                    </div>
                  </div>
                  
                  {isSelected && !os.locked && (
                    <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10" onClick={(e) => e.stopPropagation()}>
                      <label className="text-xs text-slate-400 block mb-1">Install Method:</label>
                      <select 
                        className="bg-black/60 border border-black/10 dark:border-white/10 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white w-full text-sm focus:outline-none focus:border-blue-500"
                        value={intent}
                        onChange={(e) => handleIntentChange(os.id, e.target.value)}
                      >
                        <option value="baremetal_grub">Virtual USB (Direct Boot)</option>
                        <option value="usb_flash">Physical USB</option>
                        <option value="vbox_vm">VirtualBox VM</option>
                        <option value="vmware_vm">VMware VM</option>
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </>
    )}
        
        <div className="flex justify-start gap-4 mt-auto">
          <button 
            className="bg-white/5 hover:bg-white/10 text-slate-900 dark:text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 border border-black/10 dark:border-white/10"
            onClick={onBack}
          >
            <span>←</span> Back
          </button>
          <button 
            className={`font-semibold py-3 px-8 rounded-xl transition-all flex items-center gap-2
              ${hasSelection ? 'bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-white/10 text-slate-500 cursor-not-allowed'}`}
            onClick={onNext}
            disabled={!hasSelection}
          >
            Continue <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
