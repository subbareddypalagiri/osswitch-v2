import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { 
  Play, 
  Trash2, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Monitor, 
  HardDrive, 
  ShieldAlert, 
  ArrowLeft, 
  ArrowRight, 
  X,
  Laptop
} from "lucide-react";

interface InstalledOS {
  id: string;
  name: string;
  glyph: string;
  partition: string;
  status: string;
  type: string;
  used: string;
  total: string;
  isHost: boolean;
}

export default function StepManageOS({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [installedOSList, setInstalledOSList] = useState<InstalledOS[]>([]);
  const [osMessage, setOsMessage] = useState<string | null>(null);
  const [bootError, setBootError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmUninstallTarget, setConfirmUninstallTarget] = useState<{ id: string; name: string; partition: string } | null>(null);

  const fetchOS = async () => {
    setIsLoading(true);
    try {
      const list = await invoke<InstalledOS[]>("get_installed_os_list");
      setInstalledOSList(list);
    } catch(e) {
      console.error("Failed to query installed OS list:", e);
      setBootError(String(e));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOS();
  }, []);

  const handleBootOS = async (osName: string, osId: string) => {
    setBootError(null);
    setOsMessage(`Initiating high-performance boot sequence for ${osName}...`);
    try {
      const res = await invoke<string>("boot_os", { os: osId });
      setOsMessage(res || `Successfully booted ${osName}!`);
      setTimeout(() => setOsMessage(null), 6000);
      await fetchOS();
    } catch (e) {
      console.error("Boot error:", e);
      setOsMessage(null);
      setBootError(String(e));
    }
  };

  const handleUninstallOS = async (osId: string, osName: string) => {
    setBootError(null);
    setOsMessage(`Safely decommissioning EFI bootloader & reclaiming partition space for ${osName}...`);
    try {
      const res = await invoke<string>("uninstall_os", { os: osId });
      setOsMessage(res || `Successfully uninstalled ${osName}.`);
      setInstalledOSList(prev => prev.filter(o => o.id !== osId));
      setConfirmUninstallTarget(null);
      setTimeout(() => setOsMessage(null), 5000);
      await fetchOS();
    } catch (e) {
      console.error("Uninstall error:", e);
      setOsMessage(null);
      setBootError(String(e));
      setConfirmUninstallTarget(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center mt-6">
      <div className="bg-white/95 dark:bg-[#111522]/95 border border-[#e2d8cc] dark:border-white/10 rounded-3xl max-w-[1200px] p-8 w-full animate-[fadeIn_0.5s_ease-out] flex flex-col flex-grow shadow-[0_20px_50px_rgba(180,140,100,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 dark:bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(217,119,6,0.6)]"></span>
              <span className="text-amber-800 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest font-mono">OS Management Center</span>
            </div>
            <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">Manage Installed Operating Systems</h1>
            <p className="text-stone-600 dark:text-slate-400 text-sm mt-1">Monitor disk allocation, switch default boot targets, or safely decommission installed OS instances.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={fetchOS}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-[#f0ebe1] dark:bg-white/5 hover:bg-[#e4ddce] dark:hover:bg-white/10 border border-[#ded3c4] dark:border-white/10 text-stone-700 dark:text-slate-300 transition-all flex items-center gap-2 text-xs font-medium"
              title="Refresh installed OS list"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-cyan-400" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <div className="px-4 py-2 rounded-xl bg-[#f0ebe1] dark:bg-white/5 border border-[#ded3c4] dark:border-white/10 text-xs font-mono text-stone-700 dark:text-slate-300 flex items-center gap-2">
              <Monitor className="w-3.5 h-3.5 text-amber-700 dark:text-cyan-400" />
              <span>Active OS: <strong className="text-amber-800 dark:text-cyan-400">{installedOSList.length}</strong></span>
            </div>
          </div>
        </div>

        {/* Success / Status Banner */}
        {osMessage && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 dark:bg-cyan-500/10 border border-amber-500/30 dark:border-cyan-500/30 text-amber-900 dark:text-cyan-300 font-mono text-xs sm:text-sm flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-cyan-400 shrink-0" />
              <span>{osMessage}</span>
            </div>
            <button onClick={() => setOsMessage(null)} className="text-stone-500 hover:text-stone-700 dark:hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Boot Error Alert Banner */}
        {bootError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start justify-between gap-3 shadow-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Boot sequence interrupted</p>
                <p className="font-mono text-xs opacity-90 leading-relaxed">{bootError}</p>
              </div>
            </div>
            <button onClick={() => setBootError(null)} className="text-rose-400 hover:text-rose-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* OS Grid Cards */}
        <div className="flex-grow custom-scrollbar overflow-y-auto pr-2 -mr-2">
          {installedOSList.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <HardDrive className="w-12 h-12 text-stone-400 dark:text-slate-600 mb-3" />
              <p className="text-stone-700 dark:text-slate-300 font-medium">No installed operating systems detected.</p>
              <p className="text-stone-500 dark:text-slate-500 text-xs mt-1">Install an OS from the Catalog to manage it here.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {installedOSList.map((os) => {
              const usedVal = parseFloat(os.used) || 0;
              const totalVal = parseFloat(os.total) || 1;
              const pct = Math.min(100, Math.max(0, Math.round((usedVal / totalVal) * 100)));
              const isDiskMissing = os.status.toLowerCase().includes("missing");
              const isRunning = os.status.toLowerCase() === "running";

              return (
                <div 
                  key={os.id} 
                  className={`bg-[#fbf8f3] dark:bg-slate-900/60 border rounded-2xl p-6 flex flex-col justify-between transition-all shadow-md dark:shadow-xl backdrop-blur-md ${
                    isDiskMissing 
                      ? "border-rose-500/40 hover:border-rose-500/60 bg-rose-50/20 dark:bg-rose-950/10" 
                      : "border-[#ebe3d5] dark:border-white/10 hover:border-amber-700/30 dark:hover:border-cyan-500/40"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-[#ded3c4] dark:border-white/10 flex items-center justify-center text-2xl shadow-inner">
                          {os.glyph || <Laptop className="w-6 h-6 text-stone-600 dark:text-slate-300" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-stone-900 dark:text-white leading-tight">{os.name}</h3>
                          <span className="text-[11px] font-mono text-stone-500 dark:text-slate-400 block mt-0.5">{os.partition}</span>
                        </div>
                      </div>
                      
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1.5 ${
                        os.isHost 
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30" 
                          : isRunning
                          ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 animate-pulse"
                          : isDiskMissing
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                          : "bg-amber-500/10 dark:bg-cyan-500/10 text-amber-800 dark:text-cyan-400 border-amber-500/30 dark:border-cyan-500/30"
                      }`}>
                        {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>}
                        {isDiskMissing && <AlertTriangle className="w-3 h-3 text-rose-500" />}
                        {os.status}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-slate-400 mb-4">{os.type}</p>

                    {/* Missing Disk Advisory Warning */}
                    {isDiskMissing && (
                      <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Virtual Disk Not Found</span>
                        </div>
                        <p className="opacity-90 leading-normal">
                          This VM's disk was cleared by Windows temporary file cleanup. Click <strong>Uninstall</strong> to unregister the stale entry, then reinstall from the Catalog.
                        </p>
                      </div>
                    )}

                    {/* Storage Allocation Bar */}
                    <div className="mb-6 bg-white dark:bg-black/40 p-3 rounded-xl border border-[#ded3c4] dark:border-white/5">
                      <div className="flex justify-between text-xs font-mono text-stone-500 dark:text-slate-400 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <HardDrive className="w-3 h-3" />
                          <span>Storage Allocation</span>
                        </span>
                        <span className="text-stone-900 dark:text-white font-bold">{os.used} / {os.total} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-[#ebe3d5] dark:bg-white/10 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isDiskMissing 
                              ? "bg-stone-400 dark:bg-slate-600" 
                              : pct > 80 
                              ? "bg-amber-500" 
                              : "bg-amber-700 dark:bg-cyan-400"
                          }`} 
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-[#ebe3d5] dark:border-white/10">
                    <button
                      onClick={() => handleBootOS(os.name, os.id)}
                      disabled={isDiskMissing || os.isHost}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
                        os.isHost
                          ? "bg-stone-200 dark:bg-white/5 text-stone-400 dark:text-slate-500 cursor-not-allowed border border-transparent"
                          : isDiskMissing
                          ? "bg-stone-200 dark:bg-white/5 text-stone-400 dark:text-slate-500 cursor-not-allowed border border-transparent"
                          : "bg-amber-800 hover:bg-amber-900 dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 border border-amber-800 dark:border-cyan-500/40 text-white dark:text-cyan-300 hover:shadow-md hover:shadow-cyan-950/20 active:scale-[0.98]"
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{os.isHost ? "Active Host OS" : "Boot OS"}</span>
                    </button>
                    
                    {!os.isHost && (
                      <button
                        onClick={() => setConfirmUninstallTarget({ id: os.id, name: os.name, partition: os.partition })}
                        className={`py-2.5 px-3.5 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                          isDiskMissing
                            ? "bg-rose-600 hover:bg-rose-500 text-white border-rose-600 shadow-sm"
                            : "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-600 dark:text-rose-400"
                        }`}
                        title="Safely uninstall and deregister"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Uninstall</span>
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
                <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Confirm Safe Decommission</h3>
                  <p className="text-xs text-rose-400 font-mono">Hardware Safety Guard Active</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                Are you sure you want to uninstall <strong className="text-white">{confirmUninstallTarget.name}</strong> ({confirmUninstallTarget.partition})?
              </p>

              <div className="p-3 bg-black/40 rounded-xl border border-white/10 text-xs text-slate-400 mb-6 space-y-1.5 font-mono">
                <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Primary Windows C:\ partition remains 100% protected and untouched.
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  EFI bootloader entries will be cleanly unmounted.
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  Allocated virtual disk space will be completely reclaimed.
                </p>
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
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Confirm Safe Uninstall
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex justify-between items-center mt-auto pt-6 border-t border-stone-200 dark:border-white/10">
          <button 
            className="bg-[#f0ebe1] hover:bg-[#e4ddce] dark:bg-white/5 dark:hover:bg-white/10 text-stone-800 dark:text-white font-semibold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 border border-[#ded3c4] dark:border-white/10 text-sm"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button 
            className="bg-amber-800 hover:bg-amber-900 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-black font-extrabold py-2.5 px-8 rounded-xl transition-all shadow-md dark:shadow-[0_0_20px_rgba(6,182,212,0.4)] text-sm flex items-center gap-2"
            onClick={onNext}
          >
            <span>Configure Disk Partition</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
