import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

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
  const osName = selectedOS.length > 0 ? selectedOS[0].replace(/_/g, " ").toUpperCase() : "NEW OS";
  
  // Mock total disk size
  const TOTAL_GB = 500;
  const MIN_WINDOWS_GB = 100;
  const MIN_OS_GB = 50;

  const windowsSpace = TOTAL_GB - osSpace;
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleDrag = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    
    let newWindowsSpace = Math.round(percent * TOTAL_GB);
    
    // Apply constraints
    if (newWindowsSpace < MIN_WINDOWS_GB) newWindowsSpace = MIN_WINDOWS_GB;
    if (TOTAL_GB - newWindowsSpace < MIN_OS_GB) newWindowsSpace = TOTAL_GB - MIN_OS_GB;
    
    setOsSpace(TOTAL_GB - newWindowsSpace);
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
    
    // Using native DOM events on document for smoother global dragging
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
    <div className="w-full h-full flex flex-col items-center mt-10">
      <div className="glass-card max-w-[800px] p-10 w-full animate-[fadeIn_0.5s_ease-out]">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
          <span className="text-blue-500 text-sm font-bold uppercase tracking-widest">Step 3 of 8</span>
        </div>
        
        <h2 className="text-[32px] font-bold text-white tracking-tight mb-2">
          Intelligent <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Partitioning</span>
        </h2>
        <p className="text-slate-400 mb-10 text-lg">
          Drag the slider to allocate disk space. OSwitch will safely shrink your Windows drive without deleting your files.
        </p>

        {/* The Apple-Tier Slider Visualization */}
        <div className="mb-16">
          <div className="flex justify-between text-white font-bold text-2xl mb-4 px-2">
            <div className="flex flex-col">
              <span className="text-slate-400 text-sm font-normal uppercase tracking-wider mb-1">Windows C:</span>
              <span>{windowsSpace} GB</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-blue-400 text-sm font-normal uppercase tracking-wider mb-1">{osName}</span>
              <span className="text-blue-400">{osSpace} GB</span>
            </div>
          </div>

          <div 
            ref={sliderRef}
            className="relative w-full h-24 bg-[#141419] rounded-2xl border border-white/10 overflow-hidden flex shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]"
            onPointerDown={(e) => handleDrag(e.clientX)}
            style={{ touchAction: "none" }}
          >
            {/* Windows Bar */}
            <motion.div 
              className="h-full bg-gradient-to-r from-slate-800 to-slate-700 flex items-center pl-6"
              animate={{ width: `${(windowsSpace / TOTAL_GB) * 100}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.2 }}
            >
              <span className="text-white/30 font-bold text-xl select-none">🪟 Windows</span>
            </motion.div>
            
            {/* New OS Bar */}
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-end pr-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]"
              animate={{ width: `${(osSpace / TOTAL_GB) * 100}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.2 }}
            >
              <span className="text-white/80 font-bold text-xl select-none">{osName}</span>
            </motion.div>

            {/* The Draggable Handle */}
            <motion.div 
              onPointerDown={(e) => { e.stopPropagation(); startDrag(e); }}
              className="absolute top-0 bottom-0 w-4 bg-white hover:bg-blue-100 cursor-ew-resize flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] z-10"
              style={{ transform: "translateX(-50%)" }}
              animate={{ left: `${(windowsSpace / TOTAL_GB) * 100}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.2 }}
            >
              <div className="w-1 h-8 bg-slate-300 rounded-full pointer-events-none"></div>
            </motion.div>
          </div>
          
          <div className="flex justify-between text-xs text-slate-500 mt-3 px-2 font-medium tracking-wide">
            <span>Min: {MIN_WINDOWS_GB} GB</span>
            <span>Total: {TOTAL_GB} GB</span>
            <span>Min: {MIN_OS_GB} GB</span>
          </div>
        </div>
        
        <div className="flex justify-start gap-4">
          <button 
            className="bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 border border-white/10"
            onClick={onBack}
          >
            <span>←</span> Back
          </button>
          <button 
            className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] font-semibold py-3 px-8 rounded-xl transition-all flex items-center gap-2"
            onClick={onNext}
          >
            Confirm Partition <span className="text-lg">🔪</span>
          </button>
        </div>
      </div>
    </div>
  );
}
