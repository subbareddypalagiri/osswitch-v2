import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { 
  Cpu, HardDrive, Layers, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, 
  RefreshCw, Monitor, Wifi, KeyRound, Wrench, AlertTriangle, 
  Terminal, Shield, Zap, Check
} from "lucide-react";

export default function StepScan({ 
  onNext, 
  onBack 
}: { 
  onNext: () => void, 
  onBack: () => void 
}) {
  const [sysInfo, setSysInfo] = useState<any>(null);
  const [deepDiag, setDeepDiag] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAhciPrestaging, setIsAhciPrestaging] = useState(false);
  const [ahciSuccessMsg, setAhciSuccessMsg] = useState<string | null>(null);
  const [isSuspendingBitLocker, setIsSuspendingBitLocker] = useState(false);
  const [bitlockerSuccessMsg, setBitlockerSuccessMsg] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchAllDiagnostics = async () => {
    try {
      setError(null);
      const [sys, diag] = await Promise.all([
        invoke("get_sys_info"),
        invoke("run_deep_hardware_diagnostic").catch(e => {
          console.warn("Deep hardware diagnostic fallback:", e);
          return null;
        })
      ]);
      setSysInfo(sys);
      setDeepDiag(diag);
    } catch (e: any) {
      console.error(e);
      setError(e.toString());
    }
  };

  useEffect(() => {
    fetchAllDiagnostics();
  }, []);

  const handlePrestageAhci = async () => {
    try {
      setIsAhciPrestaging(true);
      setActionError(null);
      const res = await invoke<string>("enable_safe_ahci_prestage");
      setAhciSuccessMsg(res);
    } catch (err: any) {
      setActionError(err.toString());
    } finally {
      setIsAhciPrestaging(false);
    }
  };

  const handleSuspendBitLocker = async () => {
    try {
      setIsSuspendingBitLocker(true);
      setActionError(null);
      const res = await invoke<string>("suspend_bitlocker_for_reboot");
      setBitlockerSuccessMsg(res);
    } catch (err: any) {
      setActionError(err.toString());
    } finally {
      setIsSuspendingBitLocker(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full h-full flex flex-col items-center pt-6 pb-6">
      <div className="bg-white/95 dark:bg-[#111522]/95 border border-[#e2d8cc] dark:border-white/10 rounded-3xl max-w-[960px] p-8 w-full animate-[fadeIn_0.3s_ease-out] flex flex-col shadow-[0_20px_50px_rgba(180,140,100,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 dark:bg-blue-500 shadow-[0_0_8px_rgba(217,119,6,0.8)] dark:shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
            <span className="text-amber-800 dark:text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">Step 2 of 7</span>
          </div>
          <span className="text-xs px-2.5 py-1 bg-amber-500/10 dark:bg-blue-500/10 text-amber-700 dark:text-blue-400 border border-amber-500/20 dark:border-blue-500/20 rounded-full font-mono font-medium flex items-center gap-1.5">
            <Zap className="w-3 h-3" /> God-Mode PCI Diagnostics Active
          </span>
        </div>
        
        <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-1">
          Hardware & Virtualization Audit
        </h2>
        <p className="text-stone-600 dark:text-slate-400 text-sm mb-6">
          Verifying host compute capacity, hypervisor acceleration, PCI devices, and storage controllers.
        </p>
        
        <div className="flex-grow space-y-6">
          {error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="text-red-600 dark:text-red-400 mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-xs font-mono">
                <strong>Hardware Scan Error:</strong> {error}
              </div>
              <button 
                className="bg-amber-800 hover:bg-amber-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold py-2 px-5 rounded-xl transition-all flex items-center gap-2 text-xs"
                onClick={fetchAllDiagnostics}
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Scan
              </button>
            </div>
          ) : sysInfo ? (
            <>
              {/* Top Grid: Primary System Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* CPU Card */}
                <div className="bg-[#fbf8f3] dark:bg-white/[0.02] border border-[#ebe3d5] dark:border-white/10 p-4 rounded-2xl flex flex-col justify-between hover:border-amber-700/30 dark:hover:border-white/20 transition-colors shadow-sm">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-blue-500/10 border border-amber-500/20 dark:border-blue-500/20 text-amber-700 dark:text-blue-400 flex items-center justify-center">
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-stone-500 dark:text-slate-400 text-[11px] font-mono font-semibold uppercase tracking-wider">Processor</span>
                  </div>
                  <span className="text-xs text-stone-900 dark:text-white font-bold tracking-tight truncate" title={sysInfo.cpu}>
                    {sysInfo.cpu}
                  </span>
                </div>
                
                {/* RAM Card */}
                <div className="bg-[#fbf8f3] dark:bg-white/[0.02] border border-[#ebe3d5] dark:border-white/10 p-4 rounded-2xl flex flex-col justify-between hover:border-amber-700/30 dark:hover:border-white/20 transition-colors shadow-sm">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-stone-500 dark:text-slate-400 text-[11px] font-mono font-semibold uppercase tracking-wider">Memory</span>
                  </div>
                  <span className="text-sm text-stone-900 dark:text-white font-bold tracking-tight">
                    {formatBytes(sysInfo.ram_gb * 1024 * 1024 * 1024)}
                  </span>
                </div>

                {/* Disk Space Card */}
                <div className="bg-[#fbf8f3] dark:bg-white/[0.02] border border-[#ebe3d5] dark:border-white/10 p-4 rounded-2xl flex flex-col justify-between hover:border-amber-700/30 dark:hover:border-white/20 transition-colors shadow-sm">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <HardDrive className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-stone-500 dark:text-slate-400 text-[11px] font-mono font-semibold uppercase tracking-wider">Free Space</span>
                  </div>
                  <span className="text-sm text-stone-900 dark:text-white font-bold tracking-tight">
                    {formatBytes(sysInfo.disk_free_gb * 1024 * 1024 * 1024)}
                  </span>
                </div>

                {/* Virtualization Card */}
                <div className="bg-[#fbf8f3] dark:bg-white/[0.02] border border-[#ebe3d5] dark:border-white/10 p-4 rounded-2xl flex flex-col justify-between hover:border-amber-700/30 dark:hover:border-white/20 transition-colors shadow-sm">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-cyan-400 flex items-center justify-center">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-stone-500 dark:text-slate-400 text-[11px] font-mono font-semibold uppercase tracking-wider">VT-x / AMD-V</span>
                  </div>
                  <span className="text-xs font-bold">
                    {sysInfo.virtualization ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
                      </span>
                    ) : (
                      <span className="text-amber-700 dark:text-amber-400">
                        Disabled (Bare-Metal)
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Action Banner for Feedback */}
              {actionError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* God-Mode Deep Hardware Diagnostic Subsystem */}
              {deepDiag && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-700 dark:text-blue-400" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      PCI Subsystems & Predictive Kernel Matrix
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* GPU & Display Card */}
                    <div className="bg-[#fbf8f3] dark:bg-white/[0.02] border border-[#ebe3d5] dark:border-white/10 p-4 rounded-2xl shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-amber-700 dark:text-blue-400" />
                          <span className="text-xs font-bold text-stone-900 dark:text-white">Graphics Adapters (GPU)</span>
                        </div>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-stone-200 dark:bg-white/10 text-stone-700 dark:text-stone-300">
                          {deepDiag.gpus?.length || 0} Detected
                        </span>
                      </div>
                      
                      <div className="space-y-2 mt-2">
                        {deepDiag.gpus?.map((gpu: any, idx: number) => (
                          <div key={idx} className="bg-white/60 dark:bg-white/5 p-2.5 rounded-xl border border-stone-200/60 dark:border-white/5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-stone-900 dark:text-white truncate max-w-[220px]" title={gpu.name}>
                                {gpu.name}
                              </span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                                gpu.vendor === 'NVIDIA' ? 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20' :
                                gpu.vendor === 'AMD' ? 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20' :
                                'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20'
                              }`}>
                                {gpu.vendor}
                              </span>
                            </div>
                            {gpu.requires_nomodeset && (
                              <div className="mt-1.5 text-[11px] text-amber-700 dark:text-amber-400 font-mono bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20 flex items-center gap-1.5">
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                <span>Optimus freeze guard: auto-injecting <code className="text-amber-900 dark:text-amber-300 font-bold">{gpu.recommended_param}</code></span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Wi-Fi & Network Card */}
                    <div className="bg-[#fbf8f3] dark:bg-white/[0.02] border border-[#ebe3d5] dark:border-white/10 p-4 rounded-2xl shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Wifi className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs font-bold text-stone-900 dark:text-white">Wi-Fi & Wireless Chipsets</span>
                        </div>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-stone-200 dark:bg-white/10 text-stone-700 dark:text-stone-300">
                          {deepDiag.wifis?.length || 0} Detected
                        </span>
                      </div>

                      <div className="space-y-2 mt-2">
                        {deepDiag.wifis?.length > 0 ? (
                          deepDiag.wifis.map((wifi: any, idx: number) => (
                            <div key={idx} className="bg-white/60 dark:bg-white/5 p-2.5 rounded-xl border border-stone-200/60 dark:border-white/5 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-stone-900 dark:text-white truncate max-w-[200px]" title={wifi.name}>
                                  {wifi.name}
                                </span>
                                <span className="text-[10px] font-mono text-stone-600 dark:text-stone-400 bg-stone-200/80 dark:bg-white/10 px-1.5 py-0.5 rounded">
                                  {wifi.vendor}
                                </span>
                              </div>
                              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-slate-400 font-mono">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span>{wifi.linux_driver_status}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-stone-500 dark:text-slate-400 italic p-3 text-center">
                            No dedicated wireless chip detected. Default kernel net drivers will be used.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Storage Controller & Intel VMD Card */}
                    <div className="bg-[#fbf8f3] dark:bg-white/[0.02] border border-[#ebe3d5] dark:border-white/10 p-4 rounded-2xl shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="text-xs font-bold text-stone-900 dark:text-white">NVMe / Storage Controller</span>
                        </div>
                        {deepDiag.storage?.has_intel_vmd ? (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                            Intel VMD RAID Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                            AHCI Safe
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 mt-2">
                        {deepDiag.storage?.controller_names?.map((ctrl: string, idx: number) => (
                          <div key={idx} className="bg-white/60 dark:bg-white/5 p-2 rounded-xl border border-stone-200/60 dark:border-white/5 text-xs text-stone-700 dark:text-slate-300 font-mono truncate">
                            {ctrl}
                          </div>
                        ))}

                        {deepDiag.storage?.has_intel_vmd && (
                          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs space-y-2 mt-2">
                            <div className="flex items-start gap-2 text-amber-800 dark:text-amber-300 font-medium">
                              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                              <span>
                                Intel VMD hides NVMe drives from Linux installers. Pre-staging AHCI allows safe switching in BIOS without causing Windows BSOD.
                              </span>
                            </div>

                            {ahciSuccessMsg ? (
                              <div className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px] flex items-center gap-1.5 pt-1">
                                <Check className="w-3.5 h-3.5 shrink-0" />
                                <span>{ahciSuccessMsg}</span>
                              </div>
                            ) : (
                              <button
                                onClick={handlePrestageAhci}
                                disabled={isAhciPrestaging}
                                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-1.5 px-3 rounded-lg transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm"
                              >
                                <Wrench className="w-3.5 h-3.5" />
                                {isAhciPrestaging ? "Configuring Windows AHCI Services..." : "Pre-Stage Safe AHCI (Prevent Windows BSOD)"}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Firmware Security & BitLocker Card */}
                    <div className="bg-[#fbf8f3] dark:bg-white/[0.02] border border-[#ebe3d5] dark:border-white/10 p-4 rounded-2xl shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="text-xs font-bold text-stone-900 dark:text-white">Firmware Security & TPM</span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-600 dark:text-stone-400">
                          {deepDiag.firmware?.secure_boot_enabled ? "UEFI Secure Boot ON" : "Secure Boot OFF"}
                        </span>
                      </div>

                      <div className="space-y-2 mt-2">
                        <div className="bg-white/60 dark:bg-white/5 p-2.5 rounded-xl border border-stone-200/60 dark:border-white/5 text-xs flex items-center justify-between">
                          <span className="text-stone-700 dark:text-slate-300">Fast Startup Dirty-Bit:</span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {deepDiag.firmware?.fast_startup_dirty_bit_cleared ? "Cleared / NTFS Safe" : "Checked"}
                          </span>
                        </div>

                        <div className="bg-white/60 dark:bg-white/5 p-2.5 rounded-xl border border-stone-200/60 dark:border-white/5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-stone-700 dark:text-slate-300">BitLocker PCR7 Protection:</span>
                            <span className={`font-mono font-bold ${
                              deepDiag.firmware?.bitlocker_active 
                                ? 'text-amber-700 dark:text-amber-400' 
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}>
                              {deepDiag.firmware?.bitlocker_active ? "Protection Active" : "Not Enforcing"}
                            </span>
                          </div>

                          {deepDiag.firmware?.bitlocker_active && (
                            <div className="mt-2 pt-2 border-t border-stone-200/60 dark:border-white/5">
                              {bitlockerSuccessMsg ? (
                                <div className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px] flex items-center gap-1.5">
                                  <Check className="w-3.5 h-3.5 shrink-0" />
                                  <span>{bitlockerSuccessMsg}</span>
                                </div>
                              ) : (
                                <button
                                  onClick={handleSuspendBitLocker}
                                  disabled={isSuspendingBitLocker}
                                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-1.5 px-3 rounded-lg transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                  <KeyRound className="w-3.5 h-3.5" />
                                  {isSuspendingBitLocker ? "Disabling Protectors..." : "Suspend BitLocker for Next Boot (Prevent Lockout)"}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Predicted Kernel Parameters Bar */}
                  {deepDiag.recommended_kernel_params?.length > 0 && (
                    <div className="bg-stone-900 dark:bg-black/50 border border-stone-800 dark:border-white/10 rounded-2xl p-3 text-xs flex flex-wrap items-center gap-2">
                      <span className="text-amber-400 font-mono text-[11px] font-bold flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" />
                        Predicted Kernel Boot Args:
                      </span>
                      {deepDiag.recommended_kernel_params.map((param: string, idx: number) => (
                        <span key={idx} className="bg-stone-800 text-emerald-400 font-mono text-[11px] px-2.5 py-0.5 rounded-md border border-stone-700">
                          {param}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-amber-700 dark:border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <span className="text-stone-500 dark:text-slate-400 text-xs font-mono">Running Deep PCI & Virtualization Diagnostic...</span>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-[#ebe3d5] dark:border-white/10 mt-6">
          <button 
            className="bg-[#f0ebe1] hover:bg-[#e4ddce] text-stone-800 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white text-xs font-semibold py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 border border-[#ded3c4] dark:border-white/10"
            onClick={onBack}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          
          <button 
            className="bg-amber-800 hover:bg-amber-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-all shadow-[0_2px_12px_rgba(180,100,50,0.35)] dark:shadow-[0_2px_12px_rgba(59,130,246,0.4)] flex items-center gap-2"
            onClick={onNext}
          >
            Continue <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
