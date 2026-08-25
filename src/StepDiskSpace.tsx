import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { invoke } from "@tauri-apps/api/core";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function StepDiskSpace({ 
  onNext, 
  onBack,
  selectedOS,
  osSpace,
  setOsSpace
}: { 
  onNext: () => void, 
  onBack: () => void,
  selectedOS: string[],
  osSpace: number,
  setOsSpace: (val: number) => void
}) {
  const osName = selectedOS.length > 0 ? selectedOS[0].replace(/_/g, " ").toUpperCase() : "TARGET OS";
  
  const [totalGb, setTotalGb] = useState(500);

  useEffect(() => {
    invoke<any>("get_sys_info")
      .then((info) => {
        if (info && info.disk_total_gb) {
          setTotalGb(Math.round(info.disk_total_gb));
        }
      })
      .catch(console.error);
  }, []);

  const MIN_WINDOWS_GB = 100;
  const MIN_OS_GB = 50;

  const windowsSpace = totalGb - osSpace;
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleDrag = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    
    let newWindowsSpace = Math.round(percent * totalGb);
    
    if (newWindowsSpace < MIN_WINDOWS_GB) newWindowsSpace = MIN_WINDOWS_GB;
    if (totalGb - newWindowsSpace < MIN_OS_GB) newWindowsSpace = totalGb - MIN_OS_GB;
    
    setOsSpace(totalGb - newWindowsSpace);
  };

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      handleDrag(e.clientX);
    };
    const onPointerUp = () => {
      isDragging.current = false;
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  const startDrag = (e: React.PointerEvent) => {
    isDragging.current = true;
    handleDrag(e.clientX);
    
    const onPointerMove = (ev: PointerEvent) => {
      if (!isDragging.current) return;
      handleDrag(ev.clientX);
    };
    
    const onPointerUp = () => {
      isDragging.current = false;
      document.removeEventListener("pointermove", onPointerMove);
    };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp, { once: true });
  };

  return (
    <div className="w-full h-full flex flex-col items-center pt-8 pb-4">
      <div className="bg-[#111522]/95 border border-white/10 rounded-3xl max-w-[840px] p-8 w-full animate-[fadeIn_0.3s_ease-out] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        
        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
          <span className="text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">Step 4 of 7</span>
        </div>
        
        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1">
          Non-Destructive Storage Allocation
        </h2>
        <p className="text-slate-400 text-sm mb-8">
          Adjust the visual slider to dynamically slice partition boundaries. Host files remain 100% untouched.
        </p>

        {/* Partition Size Readout */}
        <div className="mb-10">
          <div className="flex justify-between text-white font-bold text-xl mb-3 px-1">
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs font-mono font-semibold uppercase tracking-wider mb-0.5">Host Windows C:</span>
              <span className="text-white font-bold">{windowsSpace} GB</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-blue-400 text-xs font-mono font-semibold uppercase tracking-wider mb-0.5">{osName}</span>
              <span className="text-blue-400 font-bold">{osSpace} GB</span>
            </div>
          </div>

          {/* Interactive Partition Slider */}
          <div 
            ref={sliderRef}
            className="relative w-full h-20 bg-[#090b10] rounded-2xl border border-white/10 overflow-hidden flex shadow-inner cursor-ew-resize"
            onPointerDown={(e) => handleDrag(e.clientX)}
            style={{ touchAction: "none" }}
          >
            {/* Windows Bar */}
            <motion.div 
              className="h-full bg-gradient-to-r from-slate-800 to-slate-700 flex items-center pl-5 select-none"
              animate={{ width: `${(windowsSpace / totalGb) * 100}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.15 }}
            >
              <span className="text-white/60 font-semibold text-sm">Windows C: ({windowsSpace} GB)</span>
            </motion.div>
            
            {/* New OS Bar */}
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-end pr-5 select-none"
              animate={{ width: `${(osSpace / totalGb) * 100}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.15 }}
            >
              <span className="text-white font-semibold text-sm">{osName} ({osSpace} GB)</span>
            </motion.div>

            {/* Draggable Handle */}
            <motion.div 
              onPointerDown={(e) => { e.stopPropagation(); startDrag(e); }}
              className="absolute top-0 bottom-0 w-3.5 bg-white hover:bg-blue-100 cursor-ew-resize flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.6)] z-10 rounded-sm"
              style={{ transform: "translateX(-50%)" }}
              animate={{ left: `${(windowsSpace / totalGb) * 100}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.15 }}
            >
              <div className="w-0.5 h-6 bg-slate-400 rounded-full pointer-events-none"></div>
            </motion.div>
          </div>
          
          <div className="flex justify-between text-[11px] text-slate-400 mt-2 px-1 font-mono">
            <span>Minimum: {MIN_WINDOWS_GB} GB</span>
            <span>Total Capacity: {totalGb} GB</span>
            <span>Minimum: {MIN_OS_GB} GB</span>
          </div>
        </div>
        
        {/* Footer Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
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
            Confirm Allocation <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
