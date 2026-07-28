import { useState } from "react";

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
  {id:"macos", name:"macOS", sub:"Apple's Desktop Operating System", glyph:"🍎"},
  {id:"omnios", name:"OmniOS (Solaris)", sub:"Illumos-based Server UNIX", glyph:"🌞"},
  {id:"almalinux", name:"AlmaLinux", sub:"Enterprise-grade RHEL clone", glyph:"💠"},
  {id:"rockylinux", name:"Rocky Linux", sub:"Community-driven Enterprise Linux", glyph:"🏔️"},
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
  {id:"kolibrios", name:"KolibriOS", sub:"Extremely small Assembly OS", glyph:"🕊️"}
];

export default function StepChooseOS({ 
  onNext, 
  onBack,
  selectedOS,
  setSelectedOS,
  selectedIntents,
  setSelectedIntents
}: { 
  onNext: () => void, 
  onBack: () => void,
  selectedOS: string[],
  setSelectedOS: (osList: string[]) => void,
  selectedIntents: Record<string, string>,
  setSelectedIntents: (intents: Record<string, string>) => void
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOS = OS_LIST.filter(os => 
    os.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    os.sub.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const hasSelection = selectedOS.filter(id => id !== 'windows').length > 0;

  return (
    <div className="w-full h-full flex flex-col items-center mt-10">
      <div className="glass-card max-w-[1000px] p-10 w-full animate-[fadeIn_0.5s_ease-out] flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
          <span className="text-blue-500 text-sm font-bold uppercase tracking-widest">Step 3 of 6</span>
        </div>
        
        <h2 className="text-[32px] font-bold text-white tracking-tight mb-2">
          Choose <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Operating Systems</span>
        </h2>
        
        <div className="flex justify-between items-center mb-8">
          <p className="text-slate-400 text-lg">Search, pick your OS, and choose your preferred installation method.</p>
          <input 
            type="text" 
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white w-[300px] focus:outline-none focus:border-blue-500 transition-colors" 
            placeholder="Search OS..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 overflow-y-auto max-h-[500px] custom-scrollbar pr-2">
          {filteredOS.map(os => {
            const isSelected = selectedOS.includes(os.id);
            const intent = selectedIntents[os.id] || 'vbox_vm';
            
            return (
              <div 
                key={os.id}
                className={`bg-white/5 border rounded-2xl p-5 flex flex-col transition-all cursor-pointer relative
                  ${os.locked ? 'opacity-60 cursor-not-allowed border-white/10' : 
                    isSelected ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-white/10 hover:bg-white/10'}`}
                onClick={() => !os.locked && toggleOS(os.id)}
              >
                {isSelected && !os.locked && (
                  <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                )}
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-4xl drop-shadow-md">{os.glyph}</span>
                  <div>
                    <div className="text-white font-bold text-lg">{os.name}</div>
                    <div className="text-slate-400 text-xs leading-tight">{os.sub}</div>
                  </div>
                </div>
                
                {isSelected && !os.locked && (
                  <div className="mt-3 pt-3 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                    <label className="text-xs text-slate-400 block mb-1">Install Method:</label>
                    <select 
                      className="bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white w-full text-sm focus:outline-none focus:border-blue-500"
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
        
        <div className="flex justify-start gap-4 mt-auto">
          <button 
            className="bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 border border-white/10"
            onClick={onBack}
          >
            <span>←</span> Back
          </button>
          <button 
            className={`font-semibold py-3 px-8 rounded-xl transition-all flex items-center gap-2
              ${hasSelection ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-white/10 text-slate-500 cursor-not-allowed'}`}
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
