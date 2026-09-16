import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { ShieldAlert, KeyRound, ArrowUpRight, RefreshCw, AlertTriangle } from "lucide-react";

export default function SafetyGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsAdmin, setNeedsAdmin] = useState(false);
  const [isElevating, setIsElevating] = useState(false);

  const runCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const report: any = await invoke("run_safety_check");
      if (!report.is_admin) {
        setNeedsAdmin(true);
        setLoading(false);
      } else {
        setNeedsAdmin(false);
        setLoading(false);
      }
    } catch (e: any) {
      console.error(e);
      setError("Failed to verify system permissions: " + e.toString());
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(runCheck, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleElevate = async () => {
    setIsElevating(true);
    try {
      await invoke("relaunch_as_admin");
    } catch (e: any) {
      console.error(e);
      setIsElevating(false);
      setError("Failed to elevate automatically. Please right-click OSwitch and choose 'Run as administrator'.");
    }
  };

  if (needsAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090b10]/95 backdrop-blur-xl p-4">
        <div className="bg-[#12161f] border border-amber-500/20 rounded-3xl p-8 md:p-10 max-w-[540px] shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col items-center text-center relative overflow-hidden">
          {/* Subtle amber gradient accent */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 shadow-inner text-amber-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight mb-2.5">
            Administrator Privileges Required
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            OSwitch requires elevated Administrator permissions to safely write bootable USB sectors, mount EFI system partitions, and configure dual-boot kernel parameters.
          </p>

          <div className="w-full bg-[#181d28] border border-white/5 rounded-2xl p-4 mb-7 text-left text-xs font-mono text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <KeyRound className="w-4 h-4 shrink-0" />
              <span>1-Click Elevation Available</span>
            </div>
            <p className="text-slate-400 leading-normal pl-6">
              Clicking below will launch the native Windows UAC prompt. Simply click <strong>Yes</strong> to restart OSwitch with full privileges.
            </p>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleElevate}
              disabled={isElevating}
              className="w-full sm:flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold py-3.5 px-6 rounded-xl transition-all shadow-[0_4px_20px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isElevating ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Waiting for UAC...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Elevate to Administrator</span>
                  <ArrowUpRight className="w-4 h-4 opacity-70" />
                </>
              )}
            </button>

            <button
              onClick={runCheck}
              disabled={isElevating}
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-slate-300 font-medium py-3.5 px-5 rounded-xl transition-colors border border-white/10 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090b10]/95 backdrop-blur-xl p-4">
        <div className="bg-[#12161f] border border-red-500/20 rounded-3xl p-8 md:p-10 max-w-[500px] shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 text-red-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Pre-Flight Safety Guard</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">{error}</p>
          <button 
            className="bg-white/10 hover:bg-white/15 text-white font-medium py-3 px-6 rounded-xl transition-colors border border-white/10 flex items-center gap-2 text-sm cursor-pointer"
            onClick={runCheck}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Environment Scan</span>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090b10] backdrop-blur-md">
        <div className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-5"></div>
        <h2 className="text-sm font-mono uppercase tracking-widest text-slate-300 mb-1">
          Safety Guard Scan
        </h2>
        <p className="text-slate-500 font-mono text-xs">Verifying hardware virtualization and elevation...</p>
      </div>
    );
  }

  return <>{children}</>;
}
