import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function SafetyGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function runCheck() {
      try {
        const report: any = await invoke("run_safety_check");
        if (!report.is_admin) {
          setError("CRITICAL ERROR: OSwitch requires Administrator privileges to modify disk partitions and WSL safely. Please restart the app as Administrator.");
        } else {
          // Everything is safe for launch (Secure Boot & Virtualization are checked later per-intent)
          setLoading(false);
        }
      } catch (e: any) {
        console.error(e);
        setError("Failed to run safety check: " + e.toString());
      }
    }
    
    // Slight delay for dramatic effect / visual scanning feedback
    setTimeout(runCheck, 1500);
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-10 max-w-[600px] shadow-[0_0_50px_rgba(239,68,68,0.2)] flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
            <span className="text-4xl">🛡️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Pre-Flight Safety Check Failed</h2>
          <p className="text-slate-300 mb-8">{error}</p>
          <button 
            className="bg-red-600 hover:bg-red-500 text-slate-900 dark:text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            onClick={() => window.location.reload()}
          >
            Acknowledge & Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
          Initializing Safety Guard
        </h2>
        <p className="text-slate-400 font-mono text-sm">Verifying System Integrity and Permissions...</p>
      </div>
    );
  }

  return <>{children}</>;
}
