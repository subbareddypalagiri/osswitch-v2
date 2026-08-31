import { useState } from "react";
import { User, Lock, Monitor, Zap, ShieldCheck, Layers, Check, ArrowRight, ArrowLeft } from "lucide-react";

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
  userName = "",
  setUserName,
  userPassword = "",
  setUserPassword,
  hostName = "",
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
    <div className="w-full h-full flex flex-col items-center pt-8 pb-4">
      <div className="bg-white/95 dark:bg-[#111522]/95 border border-[#e2d8cc] dark:border-white/10 rounded-3xl max-w-[840px] p-8 w-full animate-[fadeIn_0.3s_ease-out] shadow-[0_20px_50px_rgba(180,140,100,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        
        {/* Step Counter Badge */}
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 dark:bg-blue-500 shadow-[0_0_8px_rgba(217,119,6,0.8)] dark:shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
          <span className="text-amber-800 dark:text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">Step 4 of 7</span>
        </div>
        
        <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-1">
          System & Security Configuration
        </h2>
        <p className="text-stone-600 dark:text-slate-400 text-sm mb-6">
          Set up user credentials, verify pre-flight safety policies, and authorize system permissions.
        </p>

        {/* User Account Setup Card */}
        <div className="bg-[#fbf8f3] dark:bg-white/[0.03] border border-[#ebe3d5] dark:border-white/10 rounded-2xl p-5 mb-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-blue-500/10 border border-amber-500/20 dark:border-blue-500/20 text-amber-800 dark:text-blue-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-white tracking-tight">OS User Account Setup</h3>
              <p className="text-xs text-stone-500 dark:text-slate-400">Configure your primary login credentials for the target Operating System.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[11px] font-medium text-stone-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-500 dark:text-slate-400" /> Username
              </label>
              <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName && setUserName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="e.g. archer"
                className="w-full bg-white dark:bg-[#090b10] border border-[#dcd2c4] dark:border-white/15 rounded-xl px-3.5 py-2 text-stone-900 dark:text-white text-xs font-mono focus:outline-none focus:border-amber-700 dark:focus:border-blue-500 transition-colors placeholder-stone-400 dark:placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-stone-500 dark:text-slate-400" /> Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={userPassword} 
                  onChange={(e) => setUserPassword && setUserPassword(e.target.value)}
                  placeholder="Set strong password"
                  className="w-full bg-white dark:bg-[#090b10] border border-[#dcd2c4] dark:border-white/15 rounded-xl px-3.5 py-2 text-stone-900 dark:text-white text-xs font-mono focus:outline-none focus:border-amber-700 dark:focus:border-blue-500 transition-colors pr-12 placeholder-stone-400 dark:placeholder-slate-500"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2 text-[10px] text-amber-800 dark:text-slate-400 hover:text-amber-900 dark:hover:text-blue-400 font-mono font-bold uppercase"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-stone-500 dark:text-slate-400" /> Hostname
              </label>
              <input 
                type="text" 
                value={hostName} 
                onChange={(e) => setHostName && setHostName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="e.g. oswitch-pc"
                className="w-full bg-white dark:bg-[#090b10] border border-[#dcd2c4] dark:border-white/15 rounded-xl px-3.5 py-2 text-stone-900 dark:text-white text-xs font-mono focus:outline-none focus:border-amber-700 dark:focus:border-blue-500 transition-colors placeholder-stone-400 dark:placeholder-slate-500"
              />
            </div>
          </div>
        </div>

        {/* 3-Point Pre-Flight Safety Summary Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="bg-[#fbf8f3] dark:bg-white/[0.02] border border-[#ebe3d5] dark:border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-stone-900 dark:text-white font-bold text-xs">AC Power Guard</div>
              <div className="text-[11px] text-stone-500 dark:text-slate-400">Prevents mid-install shutdowns</div>
            </div>
          </div>

          <div className="bg-[#fbf8f3] dark:bg-white/[0.02] border border-[#ebe3d5] dark:border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-blue-500/10 border border-amber-500/20 dark:border-blue-500/20 text-amber-800 dark:text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-stone-900 dark:text-white font-bold text-xs">BitLocker Guard</div>
              <div className="text-[11px] text-stone-500 dark:text-slate-400">TPM protection auto-verified</div>
            </div>
          </div>

          <div className="bg-[#fbf8f3] dark:bg-white/[0.02] border border-[#ebe3d5] dark:border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-stone-900 dark:text-white font-bold text-xs">Safe Slicing</div>
              <div className="text-[11px] text-stone-500 dark:text-slate-400">Existing partitions 100% intact</div>
            </div>
          </div>
        </div>
        
        {/* Pre-Install Backup Row */}
        <div 
          className={`border rounded-2xl p-4 mb-4 cursor-pointer transition-all ${
            backupEnabled ? 'bg-emerald-500/5 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-[#fbf8f3] dark:bg-white/[0.02] border-[#ebe3d5] dark:border-white/10 hover:border-amber-700/30 dark:hover:border-white/20'
          }`}
          onClick={() => setBackupEnabled(!backupEnabled)}
        >
          <div className="flex items-start gap-3.5">
            <div className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-colors shrink-0 ${backupEnabled ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-[#dcd2c4] dark:border-white/20 bg-white dark:bg-black/40'}`}>
              {backupEnabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-stone-900 dark:text-white font-bold text-xs">Create Pre-Install System Backup</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">Recommended</span>
              </div>
              <div className="text-stone-500 dark:text-slate-400 text-xs">Creates an automated Windows restore snapshot and backs up UEFI/BCD bootloader records.</div>
            </div>
          </div>
        </div>

        {/* Permissions Checklist */}
        <div className="space-y-2 mb-6">
          {PERMS.map((p, i) => (
            <div 
              key={i} 
              className={`border rounded-xl p-3 cursor-pointer transition-all ${
                perms[i] ? 'bg-amber-500/10 border-amber-700/40 dark:bg-blue-500/5 dark:border-blue-500/30' : 'bg-[#fbf8f3] dark:bg-white/[0.02] border-[#ebe3d5] dark:border-white/10 hover:border-amber-700/30 dark:hover:border-white/20'
              }`}
              onClick={() => togglePerm(i)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-4.5 h-4.5 rounded-md border mt-0.5 flex items-center justify-center transition-colors shrink-0 ${perms[i] ? 'border-amber-800 bg-amber-800 dark:border-blue-500 dark:bg-blue-500 text-white' : 'border-[#dcd2c4] dark:border-white/20 bg-white dark:bg-black/40'}`}>
                  {perms[i] && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div>
                  <div className="text-stone-900 dark:text-white font-semibold text-xs leading-tight mb-0.5">{p.title}</div>
                  <div className="text-stone-500 dark:text-slate-400 text-[11px] leading-tight">{p.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-[#ebe3d5] dark:border-white/10">
          <button 
            className="bg-[#f0ebe1] hover:bg-[#e4ddce] text-stone-800 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white text-xs font-semibold py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 border border-[#ded3c4] dark:border-white/10"
            onClick={onBack}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          
          <button 
            className={`text-xs font-semibold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2 text-white
              ${allChecked ? 'bg-amber-800 hover:bg-amber-900 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-[0_2px_12px_rgba(180,100,50,0.35)] dark:shadow-[0_2px_12px_rgba(59,130,246,0.4)]' : 'bg-stone-200 dark:bg-white/10 text-stone-400 dark:text-slate-500 cursor-not-allowed'}`}
            onClick={onNext}
            disabled={!allChecked}
          >
            Authorize & Continue <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
