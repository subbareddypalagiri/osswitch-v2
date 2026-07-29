import { useEffect } from 'react';
import logo from './assets/logo.jpg';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-[#070b14] flex flex-col items-center justify-center z-50 animate-[fadeIn_0.5s_ease-out]">
      <div className="relative flex flex-col items-center">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full w-64 h-64 -z-10"></div>
        
        <img 
          src={logo} 
          alt="OSwitch Logo" 
          className="w-32 h-32 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-[pulse_2s_infinite] mb-6 object-cover"
        />
        
        <h1 className="text-5xl font-bold text-white tracking-tight mb-2">
          OSwitch
        </h1>
        <p className="text-blue-400 tracking-[0.2em] font-medium uppercase text-sm mb-12">
          System Core Online
        </p>

        <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full animate-[progress_2.5s_ease-in-out_forwards]"></div>
        </div>
      </div>
      
      <style>{`
        @keyframes progress {
          0% { width: 0%; opacity: 0.5; }
          100% { width: 100%; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
