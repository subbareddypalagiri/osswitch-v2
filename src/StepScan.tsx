import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function StepScan({ 
  onNext, 
  onBack 
}: { 
  onNext: () => void, 
  onBack: () => void 
}) {
  const [sysInfo, setSysInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSysInfo = async () => {
    try {
      setError(null);
      const data = await invoke("get_sys_info");
      setSysInfo(data);
    } catch (e: any) {
      console.error(e);
      setError(e.toString());
    }
  };

  useEffect(() => {
    fetchSysInfo();
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full h-full flex flex-col items-center mt-10">
      <div className="glass-card max-w-[800px] p-10 w-full animate-[fadeIn_0.5s_ease-out] flex flex-col min-h-[500px]">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
          <span className="text-blue-500 text-sm font-bold uppercase tracking-widest">Step 2 of 6</span>
        </div>
        
        <h2 className="text-[32px] font-bold mb-8 text-slate-900 dark:text-white tracking-tight hero-title">System Scan</h2>
        
        <div className="flex-grow">
          {error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="text-red-400 mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                <strong>Scan Failed:</strong> {error}
              </div>
              <button 
                className="bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-semibold py-2 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                onClick={fetchSysInfo}
              >
                Retry Scan
              </button>
            </div>
          ) : sysInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-2xl flex flex-col hover:bg-white/10 transition-colors">
                <span className="text-slate-400 text-sm uppercase tracking-[1.5px] mb-2 font-medium">CPU</span>
                <span className="text-xl text-slate-900 dark:text-white font-semibold">{sysInfo.cpu}</span>
              </div>
              
              <div className="bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-2xl flex flex-col hover:bg-white/10 transition-colors">
                <span className="text-slate-400 text-sm uppercase tracking-[1.5px] mb-2 font-medium">RAM</span>
                <span className="text-xl text-slate-900 dark:text-white font-semibold">{formatBytes(sysInfo.ram_gb * 1024 * 1024 * 1024)}</span>
              </div>

              <div className="bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-2xl flex flex-col hover:bg-white/10 transition-colors">
                <span className="text-slate-400 text-sm uppercase tracking-[1.5px] mb-2 font-medium">Disk Space</span>
                <span className="text-xl text-slate-900 dark:text-white font-semibold">{formatBytes(sysInfo.disk_free_gb * 1024 * 1024 * 1024)} free</span>
              </div>

              <div className="bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-2xl flex flex-col hover:bg-white/10 transition-colors">
                <span className="text-slate-400 text-sm uppercase tracking-[1.5px] mb-2 font-medium">Virtualization</span>
                <span className="text-xl font-semibold">
                  {sysInfo.virtualization ? (
                    <span className="text-blue-400 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div> Enabled
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-400"></div> Disabled
                    </span>
                  )}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <span className="text-slate-400 text-lg">Scanning hardware...</span>
            </div>
          )}
        </div>

        <div className="flex justify-start gap-4 mt-10">
          <button 
            className="bg-white/5 hover:bg-white/10 text-slate-900 dark:text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 border border-black/10 dark:border-white/10"
            onClick={onBack}
          >
            <span>←</span> Back
          </button>
          <button 
            className={`font-semibold py-3 px-8 rounded-xl transition-all flex items-center gap-2
              ${sysInfo ? 'bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-white/10 text-slate-500 cursor-not-allowed'}`}
            onClick={onNext}
            disabled={!sysInfo}
          >
            Continue <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
