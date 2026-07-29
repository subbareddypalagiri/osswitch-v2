import { BUNDLES } from './constants';

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

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[1200px] mx-auto">
      <div className="text-center mb-10 shrink-0">
        <h2 className="text-4xl font-bold text-white tracking-tight mb-3">Install App Bundles</h2>
        <p className="text-lg text-slate-400">Select essential software you want to install automatically.</p>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar pb-6 pr-4">
        {BUNDLES.map((group: any) => (
          <div key={group.name} className="mb-8 last:mb-0">
            <h3 className="text-xl font-semibold text-slate-200 mb-4 px-2">{group.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {group.items.map((pkg: any) => {
                const isSelected = selectedBundles.includes(pkg.id);
                return (
                  <button
                    key={pkg.id}
                    onClick={() => togglePackage(pkg.id)}
                    className={`text-left p-5 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
                      isSelected 
                        ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                        : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/80 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-lg font-semibold transition-colors ${isSelected ? 'text-blue-100' : 'text-slate-200'}`}>
                        {pkg.name}
                      </span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-500'
                      }`}>
                        {isSelected && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-slate-400 block">{pkg.id}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 mt-4 border-t border-slate-800 shrink-0">
        <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
          <button 
            className="text-slate-400 hover:text-white font-medium px-6 py-3 rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
            onClick={onBack}
          >
            <span>←</span> Back
          </button>
          <button 
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center gap-2"
            onClick={handleNext}
          >
            {selectedBundles.length > 0 ? `Queue ${selectedBundles.length} Bundles` : 'Skip Bundles'} <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
