import { BUNDLES } from './constants';
import { Package, Check, ArrowRight, ArrowLeft } from 'lucide-react';

export default function StepBundles({ 
  onNext, 
  onBack,
  selectedBundles,
  setSelectedBundles
}: { 
  onNext: () => void, 
  onBack: () => void,
  selectedBundles: string[],
  setSelectedBundles: (val: string[]) => void
}) {
  const togglePackage = (pkgId: string) => {
    if (selectedBundles.includes(pkgId)) {
      setSelectedBundles(selectedBundles.filter(id => id !== pkgId));
    } else {
      setSelectedBundles([...selectedBundles, pkgId]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center pt-8 pb-4">
      <div className="bg-[#111522]/95 border border-white/10 rounded-3xl max-w-[1240px] p-8 w-full flex-grow flex flex-col overflow-hidden animate-[fadeIn_0.3s_ease-out] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
              <span className="text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">Step 5 of 7</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Software Suite Bundles
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Select pre-configured software suites to automate desktop environment provisioning.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-colors"
            >
              Back
            </button>
            <button 
              onClick={onNext}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-[0_2px_10px_rgba(59,130,246,0.4)] transition-all"
            >
              {selectedBundles.length > 0 ? `Queue ${selectedBundles.length} Bundles` : 'Skip Bundles'}
            </button>
          </div>
        </div>

        {/* Scrollable Bundles Category Grid */}
        <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 pb-6">
          {BUNDLES.map((group: any) => (
            <div key={group.name} className="mb-6 last:mb-0">
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {group.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {group.items.map((pkg: any) => {
                  const isSelected = selectedBundles.includes(pkg.id);
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => togglePackage(pkg.id)}
                      className={`text-left p-3.5 rounded-2xl border transition-all duration-150 relative group ${
                        isSelected 
                          ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-white leading-tight">
                          {pkg.name}
                        </span>
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                          isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-white/20 bg-black/40'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block truncate">{pkg.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-auto">
          <button 
            className="bg-white/5 hover:bg-white/10 text-white text-xs font-semibold py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 border border-white/10"
            onClick={onBack}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          
          <div className="text-xs text-slate-400 font-mono">
            {selectedBundles.length} bundle packages queued
          </div>

          <button 
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-all shadow-[0_2px_12px_rgba(59,130,246,0.4)] flex items-center gap-2"
            onClick={onNext}
          >
            {selectedBundles.length > 0 ? `Queue ${selectedBundles.length} Bundles` : 'Continue'} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
