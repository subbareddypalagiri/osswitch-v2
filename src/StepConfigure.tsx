

export const PERMS = [
  {title:"Administrator access", desc:"OSwitch requires elevation (UAC) to run system-level commands."},
  {title:"Secure Boot & BIOS access", desc:"Dual-boot installs may require you to disable Secure Boot in BIOS."},
  {title:"Disk partition write access", desc:"Resizing partitions touches the disk table. We recommend full backups."},
  {title:"Bootloader (BCD) modification", desc:"The boot switcher changes which entry Windows Boot Manager loads next."},
];

export default function StepConfigure({ 
  onNext, 
  onBack,
  backupEnabled,
  setBackupEnabled,
  perms,
  setPerms
}: { 
  onNext: () => void, 
  onBack: () => void,
  backupEnabled: boolean,
  setBackupEnabled: (val: boolean) => void,
  perms: boolean[],
  setPerms: (perms: boolean[]) => void
}) {
  

  const togglePerm = (index: number) => {
    const newPerms = [...perms];
    newPerms[index] = !newPerms[index];
    setPerms(newPerms);
  };

  const allChecked = PERMS.length > 0 && PERMS.every((_, i) => perms[i]);

  return (
    <div className="w-full h-full flex flex-col items-center mt-10">
      <div className="glass-card max-w-[800px] p-10 w-full animate-[fadeIn_0.5s_ease-out]">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
          <span className="text-blue-500 text-sm font-bold uppercase tracking-widest">Step 4 of 7</span>
        </div>
        
        <h2 className="text-[32px] font-bold text-slate-900 dark:text-white tracking-tight mb-8">
          Permissions <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">& Safety Check</span>
        </h2>
        
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
              <div className="text-slate-400">Creates a Windows System Restore Point and backups your BCD bootloader.</div>
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
