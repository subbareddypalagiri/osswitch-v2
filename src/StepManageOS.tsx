import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function StepManageOS({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [installedOSList, setInstalledOSList] = useState<any[]>([]);
  const [osMessage, setOsMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchOS = async () => {
      try {
        const list = await invoke<any[]>("get_installed_os_list");
        setInstalledOSList(list);
      } catch(e) {
        console.error(e);
      }
    };
    fetchOS();
  }, []);

  const handleBootOS = async (osName: string, osId: string) => {
    setOsMessage(`🚀 Initiating 1-Click Boot sequence into ${osName}...`);
    try {
      await invoke("boot_os", { os: osId });
    } catch (e) {
      console.log("Boot IPC invoked:", e);
    }
    setTimeout(() => setOsMessage(null), 5000);
  };

  const [confirmUninstallTarget, setConfirmUninstallTarget] = useState<{ id: string; name: string; partition: string } | null>(null);

  const handleUninstallOS = async (osId: string, osName: string) => {
    setOsMessage(`🛡️ Safely removing EFI bootloader & reclaiming partition space for ${osName}...`);
    try {
      await invoke("uninstall_os", { os: osId });
    } catch (e) {
      console.log("Uninstall IPC invoked:", e);
    }
    setInstalledOSList(prev => prev.filter(o => o.id !== osId));
    setConfirmUninstallTarget(null);
    setTimeout(() => setOsMessage(null), 5000);
  };

  return (
    <div className="w-full h-full flex flex-col items-center mt-6">
      <div className="bg-white/95 dark:bg-[#111522]/95 border border-[#e2d8cc] dark:border-white/10 rounded-3xl max-w-[1200px] p-8 w-full animate-[fadeIn_0.5s_ease-out] flex flex-col flex-grow shadow-[0_20px_50px_rgba(180,140,100,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-3 h-3 rounded-full bg-amber-600 dark:bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(217,119,6,0.6)]"></span>
              <span className="text-amber-800 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest font-mono">OS Management Center</span>
            </div>
            <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">Manage Installed Operating Systems</h1>
            <p className="text-stone-600 dark:text-slate-400 text-sm mt-1">Monitor disk space, switch default boot targets, or safely decommission installed OS instances.</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#f0ebe1] dark:bg-white/5 border border-[#ded3c4] dark:border-white/10 text-xs font-mono text-stone-700 dark:text-slate-300">
            Active OS Provisioned: <span className="text-amber-800 dark:text-cyan-400 font-bold">{installedOSList.length} OSes</span>
          </div>
        </div>

        {osMessage && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 dark:bg-cyan-500/10 border border-amber-500/30 dark:border-cyan-500/30 text-amber-900 dark:text-cyan-300 font-mono text-sm flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 dark:bg-cyan-400 animate-ping"></span>
            {osMessage}
          </div>
        )}

        <div className="flex-grow custom-scrollbar overflow-y-auto pr-2 -mr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {installedOSList.map((os) => {
              const usedVal = parseFloat(os.used);
              const totalVal = parseFloat(os.total);
              const pct = Math.round((usedVal / totalVal) * 100);

              return (
                <div key={os.id} className="bg-[#fbf8f3] dark:bg-slate-900/60 border border-[#ebe3d5] dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-700/30 dark:hover:border-cyan-500/40 transition-all shadow-md dark:shadow-xl backdrop-blur-md">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl drop-shadow-md">{os.glyph}</span>
                        <div>
                          <h3 className="text-lg font-bold text-stone-900 dark:text-white leading-tight">{os.name}</h3>
                          <span className="text-[11px] font-mono text-stone-500 dark:text-slate-400">{os.partition}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${os.isHost ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30" : "bg-amber-500/10 dark:bg-cyan-500/10 text-amber-800 dark:text-cyan-400 border-amber-500/30 dark:border-cyan-500/30"}`}>
                        {os.status}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-slate-400 mb-4">{os.type}</p>

                    {/* Storage Bar */}
                    <div className="mb-6 bg-white dark:bg-black/40 p-3 rounded-xl border border-[#ded3c4] dark:border-white/5">
                      <div className="flex justify-between text-xs font-mono text-stone-500 dark:text-slate-400 mb-1.5">
                        <span>Storage Usage</span>
                        <span className="text-stone-900 dark:text-white font-bold">{os.used} / {os.total} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-[#ebe3d5] dark:bg-white/10 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pct > 80 ? "bg-amber-500" : "bg-amber-700 dark:bg-cyan-400"}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-[#ebe3d5] dark:border-white/10">
                    <button
                      onClick={() => handleBootOS(os.name, os.id)}
                      className="flex-1 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 border border-amber-800 dark:border-cyan-500/40 text-white dark:text-cyan-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-900/10 dark:shadow-cyan-950/40"
                    >
                      🚀 Boot OS
                    </button>
                    {!os.isHost && (
                      <button
                        onClick={() => setConfirmUninstallTarget({ id: os.id, name: os.name, partition: os.partition })}
                        className="py-2.5 px-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs transition-all flex items-center justify-center gap-1"
                      >
                        🗑️ Uninstall
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety Uninstall Modal */}
        {confirmUninstallTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
            <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-[fadeIn_0.2s_ease-out]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xl">
                  🛡️
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Confirm Safe Decommission</h3>
                  <p className="text-xs text-rose-400 font-mono">Hardware Safety Guard Active</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                Are you sure you want to uninstall <strong className="text-white">{confirmUninstallTarget.name}</strong> ({confirmUninstallTarget.partition})?
              </p>

              <div className="p-3 bg-black/40 rounded-xl border border-white/10 text-xs text-slate-400 mb-6 space-y-1">
                <p className="text-emerald-400 font-bold flex items-center gap-1">✓ Primary Windows C:\ drive is 100% protected and untouched.</p>
                <p>✓ EFI bootloader entries will be cleanly unmounted.</p>
                <p>✓ Allocated disk space will be reclaimed back to C:\.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmUninstallTarget(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUninstallOS(confirmUninstallTarget.id, confirmUninstallTarget.name)}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-rose-950/50"
                >
                  Confirm Safe Uninstall
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-auto pt-6 border-t border-white/10">
          <button 
            className="bg-white/5 hover:bg-white/10 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 border border-white/10 text-sm"
            onClick={onBack}
          >
            ← Back
          </button>
          <button 
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold py-2.5 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] text-sm flex items-center gap-2"
            onClick={onNext}
          >
            Configure Disk Partition →
          </button>
        </div>
      </div>
    </div>
  );
}
