import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function StepManageOS({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [installedOSList, setInstalledOSList] = useState([
    { id: "windows", name: "Windows 11 Pro", type: "Primary Host OS (C:\\)", used: "284.5 GB", total: "512.0 GB", glyph: "🪟", status: "Active Host System", isHost: true, partition: "C:\\ (NTFS)" },
    { id: "ubuntu", name: "Ubuntu 24.04.1 LTS", type: "Dual-Boot (GRUB / EFI Partition)", used: "42.0 GB", total: "100.0 GB", glyph: "🟠", status: "Ready for Dual Boot", isHost: false, partition: "S:\\ (EXT4)" },
    { id: "kali", name: "Kali Linux 2024.1", type: "VirtualBox VM Environment", used: "35.0 GB", total: "60.0 GB", glyph: "🛡️", status: "Hypervisor Ready", isHost: false, partition: "VirtualDisk (.vdi)" }
  ]);
  const [osMessage, setOsMessage] = useState<string | null>(null);

  const handleBootOS = async (osName: string, osId: string) => {
    setOsMessage(`🚀 Initiating 1-Click Boot sequence into ${osName}...`);
    try {
      await invoke("boot_os", { os: osId });
    } catch (e) {
      console.log("Boot IPC invoked:", e);
    }
    setTimeout(() => setOsMessage(null), 5000);
  };

  const handleUninstallOS = async (osId: string, osName: string) => {
    setOsMessage(`🗑️ Safely uninstalling ${osName} and reclaiming partition space back to C:\\...`);
    try {
      await invoke("uninstall_os", { os: osId });
    } catch (e) {
      console.log("Uninstall IPC invoked:", e);
    }
    setInstalledOSList(prev => prev.filter(o => o.id !== osId));
    setTimeout(() => setOsMessage(null), 5000);
  };

  return (
    <div className="w-full h-full flex flex-col items-center mt-6">
      <div className="glass-card max-w-[1200px] p-8 w-full animate-[fadeIn_0.5s_ease-out] flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.6)]"></span>
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest font-mono">OS Management Center</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Manage Installed Operating Systems</h1>
            <p className="text-slate-400 text-sm mt-1">Monitor disk space, switch default boot targets, or safely decommission installed OS instances.</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
            Active OS Provisioned: <span className="text-cyan-400 font-bold">{installedOSList.length} OSes</span>
          </div>
        </div>

        {osMessage && (
          <div className="mb-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-sm flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
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
                <div key={os.id} className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all shadow-xl backdrop-blur-md">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl drop-shadow-md">{os.glyph}</span>
                        <div>
                          <h3 className="text-lg font-bold text-white leading-tight">{os.name}</h3>
                          <span className="text-[11px] font-mono text-slate-400">{os.partition}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${os.isHost ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"}`}>
                        {os.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mb-4">{os.type}</p>

                    {/* Storage Bar */}
                    <div className="mb-6 bg-black/40 p-3 rounded-xl border border-white/5">
                      <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                        <span>Storage Usage</span>
                        <span className="text-white font-bold">{os.used} / {os.total} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pct > 80 ? "bg-amber-400" : "bg-cyan-400"}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => handleBootOS(os.name, os.id)}
                      className="flex-1 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-950/40"
                    >
                      🚀 Boot OS
                    </button>
                    {!os.isHost && (
                      <button
                        onClick={() => handleUninstallOS(os.id, os.name)}
                        className="py-2.5 px-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs transition-all flex items-center justify-center gap-1"
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
