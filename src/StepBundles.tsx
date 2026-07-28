import { BUNDLES } from "./constants";

export default function StepBundles({ 
  onNext, 
  onBack,
  selectedBundles,
  setSelectedBundles
}: { 
  onNext: () => void, 
  onBack: () => void,
  selectedBundles: string[],
  setSelectedBundles: (s: string[]) => void
}) {
  const toggleBundle = (id: string) => {
    if (selectedBundles.includes(id)) {
      setSelectedBundles(selectedBundles.filter(b => b !== id));
    } else {
      setSelectedBundles([...selectedBundles, id]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center mt-10">
      <div className="glass-card max-w-[800px] p-10 w-full animate-[fadeIn_0.5s_ease-out] flex flex-col h-[700px]">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
          <span className="text-blue-500 text-sm font-bold uppercase tracking-widest">Step 4 of 6</span>
        </div>
        
        <h2 className="text-[32px] font-bold text-white tracking-tight mb-2">
          Software <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Bundles</span>
        </h2>
        <p className="text-slate-400 mb-8">
          Select optional software packages to automatically install alongside your OS setup using Winget.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow overflow-y-auto custom-scrollbar content-start">
          {BUNDLES.map(bundle => {
            const isSelected = selectedBundles.includes(bundle.id);
            return (
              <div 
                key={bundle.id}
                onClick={() => toggleBundle(bundle.id)}
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col items-start gap-3
                  ${isSelected 
                    ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors
                    ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-500 text-transparent'}`}>
                    ✓
                  </div>
                  <h3 className="text-lg font-bold text-white">{bundle.name}</h3>
                </div>
                <div className="text-sm text-slate-400 font-mono bg-black/30 p-2 rounded w-full">
                  {bundle.wingetId.split(' ').map(id => (
                    <div key={id}>- {id}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-start gap-4 mt-8">
          <button 
            className="bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 border border-white/10"
            onClick={onBack}
          >
            <span>←</span> Back
          </button>
          <button 
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center gap-2"
            onClick={onNext}
          >
            {selectedBundles.length > 0 ? `Continue with ${selectedBundles.length} Bundles` : 'Skip Bundles'} <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
