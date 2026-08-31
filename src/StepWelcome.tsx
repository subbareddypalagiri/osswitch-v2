import { ShieldCheck, ArrowRight } from "lucide-react";
import Logo from "./Logo";

export default function StepWelcome({ onNext }: { onNext: () => void }) {

  return (
    <div className="w-full h-full flex flex-col items-center pt-10 pb-6">
      <div className="bg-white/95 dark:bg-[#111522]/95 border border-[#e2d8cc] dark:border-white/10 rounded-3xl max-w-[780px] p-10 w-full animate-[fadeIn_0.3s_ease-out] shadow-[0_20px_50px_rgba(180,140,100,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 dark:bg-blue-600/10 blur-[90px] rounded-full pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10">
            <Logo className="w-full h-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-blue-500 shadow-[0_0_8px_rgba(217,119,6,0.8)] dark:shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
              <span className="text-amber-800 dark:text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">Setup & Initialization</span>
            </div>
            <span className="text-xs text-stone-500 dark:text-slate-400 font-mono">OSwitch v2 Enterprise Architecture</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white mb-4 tracking-tight leading-tight">
          Next-Generation Multi-OS &<br />
          <span className="text-amber-700 dark:text-blue-400">Software Provisioning Platform</span>
        </h1>
        
        <p className="text-sm text-stone-600 dark:text-slate-300 mb-8 max-w-xl leading-relaxed">
          Automated multi-boot configuration, safe non-destructive partition isolation, direct hypervisor orchestration, and 10,500+ one-click developer toolkits.
        </p>

        {/* System Access Card */}
        <div className="bg-[#fbf8f3] dark:bg-white/[0.02] border border-[#ebe3d5] dark:border-white/10 p-5 rounded-2xl mb-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-900 dark:text-white">System Privileges Verified</div>
              <div className="text-xs text-stone-500 dark:text-slate-400">UEFI bootloader hooks and physical disk permissions are active.</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            Ready
          </span>
        </div>

        <div className="flex justify-start">
          <button 
            className="bg-amber-800 hover:bg-amber-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold py-2.5 px-7 rounded-xl transition-all shadow-[0_2px_12px_rgba(180,100,50,0.35)] dark:shadow-[0_2px_12px_rgba(59,130,246,0.4)] flex items-center gap-2 text-sm"
            onClick={onNext}
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
