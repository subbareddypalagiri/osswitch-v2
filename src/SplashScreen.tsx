import { useEffect } from 'react';
import Logo from './Logo';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-[#090b10] flex flex-col items-center justify-center z-50 animate-[fadeIn_0.4s_ease-out]">
      <div className="relative flex flex-col items-center select-none">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-blue-500/10 blur-[90px] rounded-full w-72 h-72 -z-10 pointer-events-none"></div>
        
        {/* Precision Geometric Brand Logo */}
        <div className="w-28 h-28 mb-6 drop-shadow-[0_10px_25px_rgba(59,130,246,0.25)]">
          <Logo className="w-full h-full" />
        </div>
        
        {/* Brilliant High-Contrast Title */}
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
          OSwitch
        </h1>
        <p className="text-slate-400 font-medium tracking-wide text-xs mb-10">
          Next-Gen Multi-OS & Software Provisioning Engine
        </p>

        {/* Minimalist Shimmer Loading Indicator */}
        <div className="w-56 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-[progress_2.2s_ease-in-out_forwards]"></div>
        </div>
      </div>
      
      <style>{`
        @keyframes progress {
          0% { width: 0%; opacity: 0.6; }
          100% { width: 100%; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
