import { useState, useMemo, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { OSLogo } from "./Logo";
import { Search, Play, Trash2, Layers, MonitorCheck } from "lucide-react";

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
  {id:"asahi", name:"Asahi Linux", sub:"Linux for Apple Silicon Macs", glyph:"🍎"},
  {id:"garuda-dragonfly", name:"Garuda Linux Wayfire", sub:"Fluid Wayfire compositor Arch Linux", glyph:"🐉"},
  {id:"fedora-kinoite", name:"Fedora Kinoite 40", sub:"Immutable KDE Plasma atomic desktop", glyph:"⚛️"},
  {id:"fedora-silverblue", name:"Fedora Silverblue 40", sub:"Immutable GNOME container-first desktop", glyph:"🛡️"},
  {id:"opensuse-leap", name:"openSUSE Leap 15.6", sub:"Enterprise stable community Linux", glyph:"🦎"},
  {id:"systemrescue", name:"SystemRescue 11.01", sub:"Linux system repair & disk recovery", glyph:"🚑"},
  {id:"clonezilla", name:"Clonezilla Live 3.1.2", sub:"Bare-metal disk imaging & cloning", glyph:"👯"},
  {id:"gparted-live", name:"GParted Live 1.6", sub:"Dedicated drive partitioning toolkit", glyph:"✂️"},
  {id:"endlessos", name:"Endless OS 6", sub:"Educational & offline-first Linux OS", glyph:"♾️"},
  {id:"kaos", name:"KaOS 2024", sub:"Independent rolling KDE Plasma & Qt OS", glyph:"💫"},
  {id:"easyos", name:"EasyOS 6.0", sub:"Containerized experimental mini Linux", glyph:"🧪"},
  {id:"miraclelinux", name:"Miracle Linux 9", sub:"Japanese Enterprise RHEL distribution", glyph:"🌸"},
  {id:"springdale", name:"Springdale Linux 9", sub:"Princeton IAS Academic Enterprise Linux", glyph:"🏫"},
  {id:"solus", name:"Solus 4.5 Resilience", sub:"Independent Budgie desktop OS", glyph:"⛵"},
  {id:"void", name:"Void Linux", sub:"Independent xbps systemd-free Linux", glyph:"🌌"},
  {id:"devuan", name:"Devuan GNU/Linux 5", sub:"Debian init freedom sans systemd", glyph:"🕊️"},
  {id:"q4os", name:"Q4OS 5.4 Aquarius", sub:"Windows-styled Trinity desktop Linux", glyph:"🖥️"},
  {id:"zorin-lite", name:"Zorin OS 17.1 Lite", sub:"Resource-friendly XFCE Zorin edition", glyph:"💎"},
  {id:"lakka", name:"LAKKA Retrogaming OS", sub:"Lightweight Libretro retrogaming OS", glyph:"🕹️"},
  {id:"batocera", name:"Batocera.linux 39", sub:"Standalone plug-and-play gaming platform", glyph:"👾"},
  {id:"arcaos", name:"ArcaOS 5.1", sub:"Modernized OS/2 Warp operating system", glyph:"🌀", locked:true}
];

export default function StepChooseOS({ 
  onNext, 
  onBack, 
  selectedOS, 
  setSelectedOS,
  catalog,
  selectedIntents = {},
  setSelectedIntents,
  selectedEditions = {},
  setSelectedEditions
}: { 
  onNext: () => void, 
  onBack: () => void, 
  selectedOS: string[], 
  setSelectedOS: (os: string[]) => void,
  catalog?: any[],
  selectedIntents?: Record<string, string>,
  setSelectedIntents?: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  selectedEditions?: Record<string, string>,
  setSelectedEditions?: React.Dispatch<React.SetStateAction<Record<string, string>>>
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"catalog" | "manage">("catalog");
  const [installedOSList, setInstalledOSList] = useState<any[]>([]);
  const [osMessage, setOsMessage] = useState<string | null>(null);

  useEffect(() => {
    invoke<any[]>("get_installed_os_list")
      .then((res) => {
        if (res && res.length > 0) {
          setInstalledOSList(res);
        } else {
          setInstalledOSList([
            { id: "windows", name: "Windows 11 Home", type: "Host Physical OS", status: "Active Primary", used: "64.2 GB", total: "512 GB", isHost: true }
          ]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch installed OS list:", err);
        setInstalledOSList([
          { id: "windows", name: "Windows 11 Home", type: "Host Physical OS", status: "Active Primary", used: "64.2 GB", total: "512 GB", isHost: true }
        ]);
      });
  }, []);

  const handleBootOS = async (osName: string) => {
    try {
      setOsMessage(`Requesting reboot into ${osName}...`);
      await invoke("boot_into_os", { osName });
    } catch (err: any) {
      setOsMessage(`Boot request error: ${err?.message || err}`);
    }
  };

  const handleUninstallOS = async (osId: string) => {
    if (!confirm(`Are you sure you want to completely uninstall ${osId}? This will free allocated disk space.`)) {
      return;
    }
    try {
      setOsMessage(`Uninstalling ${osId}...`);
      await invoke("uninstall_os", { osId });
      setInstalledOSList((prev) => prev.filter((item) => item.id !== osId));
      setOsMessage(`Successfully removed ${osId}.`);
    } catch (err: any) {
      setOsMessage(`Uninstall error: ${err?.message || err}`);
    }
  };

  const handleIntentChange = (osId: string, intent: string) => {
    if (setSelectedIntents) {
      setSelectedIntents((prev) => ({
        ...prev,
        [osId]: intent
      }));
    }
  };

  const handleEditionChange = (osId: string, editionId: string) => {
    if (setSelectedEditions) {
      setSelectedEditions((prev) => ({
        ...prev,
        [osId]: editionId
      }));
    }
  };

  const displayList = useMemo(() => {
    if (catalog && catalog.length > 0) {
      return catalog;
    }
    return OS_LIST;
  }, [catalog]);

  const filteredOS = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return displayList;
    return displayList.filter(os => {
      const name = (os?.name || "").toLowerCase();
      const sub = (os?.sub || (os as any)?.category || "").toLowerCase();
      const cat = ((os as any)?.category || "").toLowerCase();
      const id = (os?.id || "").toLowerCase();
      return name.includes(q) || sub.includes(q) || cat.includes(q) || id.includes(q);
    });
  }, [displayList, searchQuery]);

  const selectedOSSet = useMemo(() => new Set(selectedOS), [selectedOS]);

  const toggleOS = (id: string) => {
    if (selectedOSSet.has(id)) {
      setSelectedOS(selectedOS.filter(item => item !== id));
    } else {
      setSelectedOS([...selectedOS, id]);
    }
  };

  const selectableCount = selectedOS.filter(id => id !== "windows" && id !== "macos").length;

  return (
    <div className="w-full h-full flex flex-col items-center pt-8 pb-4">
      <div className="bg-[#111522]/95 border border-white/10 rounded-3xl max-w-[1240px] p-8 w-full flex-grow flex flex-col overflow-hidden animate-[fadeIn_0.3s_ease-out] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
              <span className="text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">Step 3 of 7</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Operating System Catalog
            </h2>
          </div>

          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setActiveTab("catalog")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "catalog" 
                  ? "bg-blue-600 text-white shadow-[0_2px_10px_rgba(59,130,246,0.4)]" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Install New OS
            </button>
            <button 
              onClick={() => setActiveTab("manage")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "manage" 
                  ? "bg-blue-600 text-white shadow-[0_2px_10px_rgba(59,130,246,0.4)]" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <MonitorCheck className="w-3.5 h-3.5" />
              Manage Installed
              <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full font-mono">{installedOSList.length}</span>
            </button>
          </div>
        </div>

        {osMessage && (
          <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 font-mono text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            {osMessage}
          </div>
        )}

        {activeTab === "manage" ? (
          <div className="flex-grow custom-scrollbar overflow-y-auto pr-2">
            <p className="text-slate-400 text-sm mb-6">
              View, boot, or uninstall operating systems provisioned on your local hardware or hypervisors.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-8">
              {installedOSList.map(os => (
                <div key={os.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-white/20 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3.5">
                        <OSLogo id={os.id} size={36} className="flex-shrink-0" />
                        <div>
                          <h3 className="text-base font-bold text-white leading-tight">{os.name}</h3>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">{os.type}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono border ${os.isHost ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-blue-500/10 text-blue-400 border-blue-500/30"}`}>
                        {os.status}
                      </span>
                    </div>

                    <div className="mb-5">
                      <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                        <span>Storage Allocated</span>
                        <span className="text-white font-bold">{os.used} / {os.total}</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(parseFloat(os.used) / parseFloat(os.total)) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-white/10">
                    <button
                      onClick={() => handleBootOS(os.name)}
                      className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(59,130,246,0.3)]"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Boot OS
                    </button>
                    {!os.isHost && (
                      <button
                        onClick={() => handleUninstallOS(os.id)}
                        className="py-2 px-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold text-xs transition-all flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Uninstall
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-slate-400 text-sm">
                Select your target operating system and choose the execution environment.
              </p>
              
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search 101 OS Distributions..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black/30 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all w-full sm:w-[280px]"
                />
              </div>
            </div>
        
            <div className="flex-grow custom-scrollbar overflow-y-auto pr-2 -mr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-8">
                {filteredOS.map((os: any) => {
                  const isSelected = selectedOSSet.has(os.id);
                  const intent = selectedIntents[os.id] || 'vbox_vm';
                  const editions = os.editions as any[] | undefined;
                  const currentEditionId = selectedEditions[os.id] || (editions && editions.length > 0 ? editions[0].id : undefined);
                  const activeEdition = editions?.find((e: any) => e.id === currentEditionId) || (editions && editions.length > 0 ? editions[0] : null);
                  
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
                      className={`rounded-2xl p-4.5 flex flex-col justify-between transition-all cursor-pointer relative border
                        ${os.locked ? 'opacity-50 cursor-not-allowed bg-white/[0.02] border-white/5' : 
                          isSelected ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'}`}
                      onClick={() => !os.locked && toggleOS(os.id)}
                    >
                      {isSelected && !os.locked && (
                        <div className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] z-10"></div>
                      )}

                      <div>
                        <div className="flex items-start gap-3.5 mb-2.5 pr-4">
                          <OSLogo id={os.id} size={36} className="flex-shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-white font-bold text-base leading-tight">
                                {os.name}
                              </span>
                              {activeEdition && (
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 shrink-0">
                                  {activeEdition.size}
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 text-xs leading-relaxed mt-1 line-clamp-2">
                              {os.sub || (os as any).category || "Official Release"}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {isSelected && !os.locked && (
                        <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2.5" onClick={(e) => e.stopPropagation()}>
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1 font-medium">Execution Method:</label>
                            <select 
                              className="bg-[#090b10] border border-white/15 rounded-lg px-3 py-1.5 text-white w-full text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors"
                              value={intent}
                              onChange={(e) => handleIntentChange(os.id, e.target.value)}
                            >
                              <option value="vbox_vm">VirtualBox VM (Safe Sandbox)</option>
                              <option value="baremetal_grub">Native Bare-Metal (UEFI Dual-Boot)</option>
                              <option value="usb_flash">Physical USB Flash Drive</option>
                              <option value="vmware_vm">VMware Workstation Pro VM</option>
                            </select>
                          </div>

                          {editions && editions.length > 1 && (
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-[11px] text-slate-400 font-medium">Edition / Flavor:</label>
                                {activeEdition && (
                                  <span className="text-[10px] font-mono font-bold text-blue-400">
                                    {activeEdition.size}
                                  </span>
                                )}
                              </div>
                              <select 
                                className="bg-[#090b10] border border-white/15 rounded-lg px-3 py-1.5 text-white w-full text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors"
                                value={currentEditionId}
                                onChange={(e) => handleEditionChange(os.id, e.target.value)}
                              >
                                {editions.map((ed: any) => (
                                  <option key={ed.id} value={ed.id}>
                                    {ed.name} ({ed.size})
                                  </option>
                                ))}
                              </select>
                              {activeEdition?.desc && (
                                <p className="text-[10px] text-slate-400 mt-1 font-mono leading-tight">
                                  {activeEdition.desc}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {filteredOS.length === 0 && (
                <div className="py-16 text-center text-slate-400">
                  <p className="text-base font-semibold text-white mb-1">No distributions match "{searchQuery}"</p>
                  <p className="text-xs text-slate-500">Try searching for Ubuntu, Kali, Arch, Debian, Fedora, or clear the search query.</p>
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <button 
            className="bg-white/5 hover:bg-white/10 text-white text-xs font-semibold py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 border border-white/10"
            onClick={onBack}
          >
            <span>←</span> Back
          </button>
          
          <div className="text-xs text-slate-400 font-mono">
            {selectableCount === 0 ? "Select at least 1 OS to proceed" : `${selectableCount} OS selected`}
          </div>

          <button 
            className={`text-xs font-semibold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2 text-white
              ${selectableCount > 0 
                ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_2px_12px_rgba(59,130,246,0.4)]' 
                : 'bg-white/10 text-slate-500 cursor-not-allowed'}`}
            onClick={onNext}
            disabled={selectableCount === 0}
          >
            Continue <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
