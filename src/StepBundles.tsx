import { useState, useEffect } from 'react';
import { BUNDLES } from './constants';
import { invoke } from '@tauri-apps/api/core';
import { listen, UnlistenFn, Event } from '@tauri-apps/api/event';

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
  const [installing, setInstalling] = useState(false);
  const [installStatus, setInstallStatus] = useState<"idle" | "installing" | "success" | "error">("idle");
  const [packageStates, setPackageStates] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    // Initialize package states
    if (installing) {
      const initial: Record<string, string> = {};
      selectedBundles.forEach(b => { initial[b] = 'WAITING'; });
      setPackageStates(initial);
    }
  }, [installing, selectedBundles]);

  useEffect(() => {
    let unlistenFn: UnlistenFn | null = null;
    let isMounted = true;
    
    if (installing) {
        listen("bundle-progress", (event: Event<{id: string, status: string}>) => {
          if (isMounted) {
            setPackageStates(prev => ({ ...prev, [event.payload.id]: event.payload.status }));
          }
        }).then(unlisten => {
          if (isMounted) unlistenFn = unlisten;
          else unlisten();
        }).catch(console.error);
    }

    return () => {
      isMounted = false;
      if (unlistenFn) unlistenFn();
    };
  }, [installing]);

  const togglePackage = (pkgId: string) => {
    if (installing) return;
    if (selectedBundles.includes(pkgId)) {
      setSelectedBundles(selectedBundles.filter(id => id !== pkgId));
    } else {
      setSelectedBundles([...selectedBundles, pkgId]);
    }
  };

  const handleInstall = async () => {
    if (selectedBundles.length === 0) {
      onNext();
      return;
    }
    setInstalling(true);
    setInstallStatus("installing");
    setErrorMessage("");

    try {
      await invoke("install_packages", { packages: selectedBundles });
      setInstallStatus("success");
      setTimeout(() => {
        onNext();
      }, 3000);
    } catch (e: any) {
      console.error("Installation failed:", e);
      setInstallStatus("error");
      setErrorMessage(e.toString());
    }
  };

  if (installing) {
    return (
      <div className="flex flex-col h-full w-full max-w-[1200px] mx-auto animate-[fadeIn_0.5s_ease-out]">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white tracking-tight mb-3">Live Installation Dashboard</h2>
          <p className="text-lg text-slate-400">OSwitch is fetching and installing your selected packages in real-time.</p>
        </div>

        <div className="glass-card flex-grow overflow-hidden flex flex-col p-8 relative">
           <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
              <div className="h-full bg-blue-500 animate-[pulse_2s_infinite]" style={{width: installStatus === 'success' ? '100%' : '60%'}}></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar flex-grow pr-4">
             {selectedBundles.map(pkgId => {
               const state = packageStates[pkgId] || 'WAITING';
               let bgColor = 'bg-slate-800/50';
               let textColor = 'text-slate-400';
               let icon = '⏳';
               
               if (state === 'INSTALLING') {
                 bgColor = 'bg-blue-900/30 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]';
                 textColor = 'text-blue-400 font-semibold';
                 icon = '🔄';
               } else if (state === 'DONE') {
                 bgColor = 'bg-emerald-900/30 border border-emerald-500/30';
                 textColor = 'text-emerald-400 font-semibold';
                 icon = '✅';
               } else if (state === 'FAILED') {
                 bgColor = 'bg-red-900/30 border border-red-500/30';
                 textColor = 'text-red-400 font-semibold';
                 icon = '❌';
               }

               // Find name
               let pkgName = pkgId;
               for (const g of BUNDLES) {
                 const p = g.items.find((x: any) => x.id === pkgId);
                 if (p) pkgName = p.name;
               }

               return (
                 <div key={pkgId} className={`p-4 rounded-xl flex items-center justify-between transition-all duration-300 ${bgColor}`}>
                   <span className="text-white font-medium">{pkgName}</span>
                   <div className={`flex items-center gap-2 ${textColor}`}>
                     {state === 'INSTALLING' && <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>}
                     <span className="text-sm tracking-wider">{state}</span>
                     <span>{icon}</span>
                   </div>
                 </div>
               );
             })}
           </div>

           {installStatus === 'error' && (
             <div className="mt-6 p-4 bg-red-900/40 border border-red-500/50 rounded-xl text-red-200">
               <strong className="block mb-1">Installation Error:</strong>
               {errorMessage}
             </div>
           )}

           <div className="mt-8 flex justify-center">
             {installStatus === 'installing' && (
               <div className="text-blue-400 animate-pulse font-medium tracking-widest uppercase">Do not close OSwitch...</div>
             )}
             {installStatus === 'success' && (
               <button onClick={onNext} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-10 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all">
                 Continue Setup ➔
               </button>
             )}
             {installStatus === 'error' && (
               <button onClick={() => setInstalling(false)} className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-10 rounded-xl transition-all">
                 Go Back
               </button>
             )}
           </div>
        </div>
      </div>
    );
  }

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
            onClick={handleInstall}
          >
            {selectedBundles.length > 0 ? `Install ${selectedBundles.length} Bundles` : 'Skip Bundles'} <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
