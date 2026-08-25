import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Cpu, HardDrive, Layers, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";

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
    <div className="w-full h-full flex flex-col items-center pt-8 pb-4">
      <div className="bg-[#111522]/95 border border-white/10 rounded-3xl max-w-[840px] p-8 w-full animate-[fadeIn_0.3s_ease-out] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        
        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
          <span className="text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">Step 2 of 7</span>
        </div>
        
        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1">
          Hardware & Virtualization Audit
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Verifying host compute capacity, hypervisor acceleration, and storage partitions.
        </p>
        
        <div className="flex-grow">
          {error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="text-red-400 mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-xs font-mono">
                <strong>Hardware Scan Error:</strong> {error}
              </div>
              <button 
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-5 rounded-xl transition-all flex items-center gap-2 text-xs"
                onClick={fetchSysInfo}
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Scan
              </button>
            </div>
          ) : sysInfo ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* CPU Card */}
              <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-colors shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="text-slate-400 text-xs font-mono font-semibold uppercase tracking-wider">Processor</span>
                </div>
                <span className="text-base text-white font-bold tracking-tight">{sysInfo.cpu}</span>
              </div>
              
              {/* RAM Card */}
              <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-colors shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-slate-400 text-xs font-mono font-semibold uppercase tracking-wider">System Memory</span>
                </div>
                <span className="text-base text-white font-bold tracking-tight">{formatBytes(sysInfo.ram_gb * 1024 * 1024 * 1024)}</span>
              </div>

              {/* Disk Space Card */}
              <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-colors shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <span className="text-slate-400 text-xs font-mono font-semibold uppercase tracking-wider">Available Storage</span>
                </div>
                <span className="text-base text-white font-bold tracking-tight">{formatBytes(sysInfo.disk_free_gb * 1024 * 1024 * 1024)} Free</span>
              </div>

              {/* Virtualization Card */}
              <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-colors shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-slate-400 text-xs font-mono font-semibold uppercase tracking-wider">VT-x / AMD-V Hardware Acceleration</span>
                </div>
                <span className="text-base font-bold">
                  {sysInfo.virtualization ? (
                    <span className="text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Enabled & Ready
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-2">
                      Disabled (Bare-Metal Only)
                    </span>
                  )}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <span className="text-slate-400 text-xs font-mono">Querying hardware descriptors...</span>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-6">
          <button 
            className="bg-white/5 hover:bg-white/10 text-white text-xs font-semibold py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 border border-white/10"
            onClick={onBack}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          
          <button 
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-all shadow-[0_2px_12px_rgba(59,130,246,0.4)] flex items-center gap-2"
            onClick={onNext}
          >
            Continue <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
