import { useState } from "react";

export const PERMS = [
  {title:"Administrator elevation (UAC / root)", desc:"OSwitch requires elevation to configure kernel bootloader entries."},
  {title:"Secure Boot & UEFI validation", desc:"Dual-boot installs configure genuine signed bootloader hooks."},
  {title:"Non-destructive partition isolation", desc:"Safe-slice isolation ensures existing Windows / Arch partitions remain untouched."},
  {title:"Bootloader switcher registration", desc:"Registers seamless dual-boot entry in UEFI/systemd-boot/BCD."},
];

export default function StepConfigure({ 
  onNext, 
  onBack,
  backupEnabled,
  setBackupEnabled,
  perms,
  setPerms,
  userName = "subbu",
  setUserName,
  userPassword = "3333",
  setUserPassword,
  hostName = "subbareddy",
  setHostName
}: { 
  onNext: () => void, 
  onBack: () => void,
  backupEnabled: boolean,
  setBackupEnabled: (val: boolean) => void,
  perms: boolean[],
  setPerms: (perms: boolean[]) => void,
  userName?: string,
  setUserName?: (val: string) => void,
  userPassword?: string,
  setUserPassword?: (val: string) => void,
  hostName?: string,
  setHostName?: (val: string) => void
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePerm = (index: number) => {
    const newPerms = [...perms];
    newPerms[index] = !newPerms[index];
    setPerms(newPerms);
  };

  const allChecked = PERMS.length > 0 && PERMS.every((_, i) => perms[i]);

  return (
    <div className="w-full h-full flex flex-col items-center mt-10">
      <div className="glass-card max-w-[850px] p-10 w-full animate-[fadeIn_0.5s_ease-out]">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
          <span className="text-blue-500 text-sm font-bold uppercase tracking-widest">Step 4 of 7</span>
        </div>
        
        <h2 className="text-[32px] font-bold text-slate-900 dark:text-white tracking-tight mb-6">
          Identity, <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Safety & Configuration</span>
        </h2>

        {/* 👤 Dynamic User Credentials Section */}
        <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-6 mb-8 shadow-[0_0_25px_rgba(59,130,246,0.15)] backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">👤</span>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">OS User Account Setup (Zero Hardcoding)</h3>
              <p className="text-xs text-slate-400">Configure your personalized login credentials for the new Operating System.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5 uppercase">Login Username</label>
              <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName && setUserName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="e.g. archer"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5 uppercase">Account Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={userPassword} 
                  onChange={(e) => setUserPassword && setUserPassword(e.target.value)}
                  placeholder="Set strong password"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors pr-10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white font-mono"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5 uppercase">Computer Hostname</label>
              <input 
                type="text" 
                value={hostName} 
                onChange={(e) => setHostName && setHostName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="e.g. oswitch-pc"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 🛡️ 3-Point Pre-Flight Safety Guard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
            <span className="text-emerald-400 text-xl">⚡</span>
            <div>
              <div className="text-emerald-400 font-bold text-xs">AC Power Guard</div>
              <div className="text-[11px] text-slate-400">Prevents mid-install shutdowns</div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-center gap-3">
            <span className="text-blue-400 text-xl">🔒</span>
            <div>
              <div className="text-blue-400 font-bold text-xs">BitLocker Guard</div>
              <div className="text-[11px] text-slate-400">Auto-pauses TPM locks</div>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex items-center gap-3">
            <span className="text-purple-400 text-xl">📁</span>
            <div>
              <div className="text-purple-400 font-bold text-xs">Zero-Touch Safety</div>
              <div className="text-[11px] text-slate-400">Existing data 100% untouched</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 border border-green-500/30 rounded-2xl p-6 mb-8 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setBackupEnabled(!backupEnabled)}>
          <label className="flex items-start gap-4 cursor-pointer w-full pointer-events-none">
            <input 
              type="checkbox" 
              className="mt-1 w-5 h-5 rounded bg-slate-100 dark:bg-black/40 border-white/20 text-green-500 focus:ring-green-500 focus:ring-offset-gray-900 cursor-pointer pointer-events-auto"
              checked={backupEnabled}
              readOnly
              onClick={(e) => { e.stopPropagation(); setBackupEnabled(!backupEnabled); }}
              onChange={() => {}}
            />
            <div>
              <div className="text-green-400 font-bold text-lg mb-1">Enable Pre-Install Backup (Recommended)</div>
              <div className="text-slate-400">Creates a system restore point and backups your BCD/UEFI bootloader.</div>
            </div>
          </label>
        </div>

        <div className="space-y-4 mb-8">
          {PERMS.map((p, i) => (
            <div 
              key={i} 
              className={`bg-white/5 border rounded-2xl p-5 cursor-pointer transition-colors hover:bg-white/10
                ${perms[i] ? 'border-blue-500 bg-blue-500/5' : 'border-black/10 dark:border-white/10'}`}
              onClick={() => togglePerm(i)}
            >
              <label className="flex items-start gap-4 cursor-pointer w-full pointer-events-none">
                <input 
                  type="checkbox" 
                  className="mt-1 w-5 h-5 rounded bg-slate-100 dark:bg-black/40 border-white/20 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900 cursor-pointer pointer-events-auto"
                  checked={perms[i]}
                  readOnly
                  onClick={(e) => { e.stopPropagation(); togglePerm(i); }}
                  onChange={() => {}}
                />
                <div>
                  <div className="text-slate-900 dark:text-white font-bold text-lg mb-1">{p.title}</div>
                  <div className="text-slate-400">{p.desc}</div>
                </div>
              </label>
            </div>
          ))}
        </div>
        
        <div className="flex justify-start gap-4">
          <button 
            className="bg-white/5 hover:bg-white/10 text-slate-900 dark:text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 border border-black/10 dark:border-white/10"
            onClick={onBack}
          >
            <span>←</span> Back
          </button>
          <button 
            className={`font-semibold py-3 px-8 rounded-xl transition-all flex items-center gap-2
              ${allChecked ? 'bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-white/10 text-slate-500 cursor-not-allowed'}`}
            onClick={onNext}
            disabled={!allChecked}
          >
            Unlock Console <span className="text-lg">🔓</span>
          </button>
        </div>
      </div>
    </div>
  );
}
