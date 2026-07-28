import { useState, useEffect, memo, useMemo } from "react";
import { OS_LIST } from "./StepChooseOS";
import { OS_CATALOG, BUNDLES } from "./constants";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { open as openDialog } from "@tauri-apps/plugin-dialog";

export const InstallProgressBar = memo(function InstallProgressBar() {
  const [progress, setProgress] = useState({ i: 0, text: "", total: 1 });

  useEffect(() => {
    let unlistenFn: UnlistenFn | null = null;
    let isMounted = true;

    listen("install-progress", (event: any) => {
      if (isMounted) {
        requestAnimationFrame(() => setProgress(event.payload));
      }
    }).then(unlisten => {
      if (isMounted) unlistenFn = unlisten;
      else unlisten();
    });

    return () => {
      isMounted = false;
      if (unlistenFn) unlistenFn();
    };
  }, []);

  const percentage = Math.min(100, Math.max(0, (progress.i / (progress.total || 1)) * 100));

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-blue-400 mb-8 font-mono">{progress.text || "Running provisioning sequence..."}</p>
      <div className="w-full max-w-md bg-white/5 rounded-full h-3 mb-6 overflow-hidden border border-white/10 relative">
        <div 
          className="bg-gradient-to-r from-blue-600 to-purple-500 h-full origin-left transition-transform duration-150 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
          style={{ transform: `scaleX(${percentage / 100})` }}
        ></div>
      </div>
    </div>
  );
});

export default function StepInstall({ 
  onNext: _onNext, 
  onBack,
  selectedOS,
  selectedIntents,
  selectedBundles,
  backupEnabled
}: { 
  onNext: () => void, 
  onBack: () => void,
  selectedOS: string[],
  selectedIntents: Record<string, string>,
  selectedBundles: string[],
  backupEnabled: boolean
}) {
  const targets = useMemo(() => selectedOS.filter(id => id !== 'windows'), [selectedOS]);
  const [activeTab, setActiveTab] = useState(targets.length > 0 ? targets[0] : null);
  const [isAdmin] = useState(true); 
  const [isInstalling, setIsInstalling] = useState(false);
  const [installStatus, setInstallStatus] = useState<Record<string, { status: "success" | "error", message?: string }>>({});
  const [fallbackMode, setFallbackMode] = useState<{active: boolean, url: string, id: string}>({active: false, url: "", id: ""});
  
  const runInstall = async (id: string, localIsoPath?: string) => {
    try {
      setIsInstalling(true);
      setInstallStatus(prev => ({ ...prev, [id]: { status: "error", message: "" } })); // clear previous
      setFallbackMode({active: false, url: "", id: ""});

      if (backupEnabled) {
        await invoke("backup_system");
      }

      const intent = selectedIntents[id] || "vbox_vm";
      const catalogEntry = OS_CATALOG.find(o => o.id === id);
      const iso_url = localIsoPath || catalogEntry?.isoUrl || "";
      await invoke("install_os", { id: id, intent: intent, isoUrl: iso_url });
      
      if (selectedBundles.length > 0) {
        for (const bundleId of selectedBundles) {
          const bundleDef = BUNDLES.find(b => b.id === bundleId);
          if (bundleDef) {
             await invoke("install_bundle", { wingetIds: bundleDef.wingetId });
          }
        }
      }
      setInstallStatus(prev => ({ ...prev, [id]: { status: "success" } }));
    } catch (e: any) {
      console.error(e);
      let errMsg = typeof e === "string" ? e : e?.message || JSON.stringify(e);
      
      if (errMsg.includes("ISO_DOWNLOAD_FAILED") || errMsg.includes("MACOS_RESTRICTION")) {
        const catalogEntry = OS_CATALOG.find(o => o.id === id);
        const officialUrl = catalogEntry?.officialSite || "https://google.com/search?q=" + encodeURIComponent((catalogEntry?.name || id) + " download");
        setFallbackMode({active: true, url: officialUrl, id});
        setIsInstalling(false);
        return;
      }
      
      setInstallStatus(prev => ({ ...prev, [id]: { status: "error", message: "Failed to install " + id + ": " + errMsg } }));
    } finally {
      setIsInstalling(false);
    }
  };

  const handleSelectLocalIso = async () => {
    const file = await openDialog({
      multiple: false,
      filters: [{
        name: 'Disk Image',
        extensions: ['iso', 'img']
      }]
    });
    
    if (file && typeof file === 'string') {
      runInstall(fallbackMode.id, file);
    }
  };

  if (targets.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="text-slate-400 text-lg">No OS selected. Go back and select an OS.</div>
        <button 
          className="mt-4 bg-white/5 hover:bg-white/10 text-white font-semibold py-2 px-6 rounded-xl transition-colors border border-white/10"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    );
  }

  const activeOSDetails = useMemo(() => OS_LIST.find(o => o.id === activeTab), [activeTab]);

  if (fallbackMode.active) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-10">
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-8 rounded-2xl max-w-lg text-center shadow-[0_0_30px_rgba(234,179,8,0.15)] flex flex-col items-center">
           <div className="w-16 h-16 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
           </div>
           <h2 className="text-xl font-bold text-white mb-2">Automatic Download Blocked</h2>
           <p className="text-slate-300 text-sm mb-6">
              The official server for this OS restricts automated downloads (or the link expired). 
              Please download the ISO manually from their official website, then select it below.
           </p>
           <div className="flex flex-col gap-3 w-full">
             <button 
               className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-colors border border-white/10 flex items-center justify-center gap-2"
               onClick={() => window.open(fallbackMode.url, '_blank')}
             >
               1. Open Official Website <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
             </button>
             <button 
               className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-transform hover:-translate-y-0.5 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
               onClick={handleSelectLocalIso}
             >
               2. Select Downloaded ISO
             </button>
             <button 
               className="mt-4 text-slate-400 hover:text-white text-sm px-4 py-2"
               onClick={() => setFallbackMode({active:false, url:"", id:""})}
             >
               Cancel
             </button>
           </div>
        </div>
      </div>
    );
  }

  if (isInstalling) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-10">
        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">⚡</div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Installing Operating System</h2>
          <InstallProgressBar />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center mt-10">
      <div className="glass-card max-w-[900px] p-10 w-full animate-[fadeIn_0.5s_ease-out] flex flex-col h-[750px]">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
          <span className="text-blue-500 text-sm font-bold uppercase tracking-widest">Step 6 of 6</span>
        </div>
        
        <h2 className="text-[32px] font-bold text-white tracking-tight mb-6">
          Run <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Console</span>
        </h2>
        
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
          {targets.map(id => {
            const os = OS_LIST.find(o => o.id === id);
            if (!os) return null;
            return (
              <button
                key={id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap
                  ${activeTab === id ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                onClick={() => setActiveTab(id)}
              >
                <span>{os.glyph}</span> {os.name}
              </button>
            );
          })}
        </div>
        
        <div className="bg-black/40 border border-white/10 rounded-2xl flex flex-col flex-grow overflow-hidden mb-6">
          <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2 text-xs font-mono text-slate-400">
            <div className="flex gap-1.5 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            Terminal - {activeOSDetails?.name}
          </div>
          
          <div className="p-4 font-mono text-sm overflow-y-auto flex-grow custom-scrollbar">
            <div className="text-slate-500 mb-1"># Universal Provisioning Engine</div>
            <div className="text-green-400 mb-1">$ Target OS: {activeOSDetails?.name}</div>
            <div className="text-green-400 mb-1">$ Intent: {selectedIntents[activeTab || ""] || "vbox_vm"}</div>
            {selectedBundles.length > 0 && (
               <div className="text-yellow-400 mb-1">$ Bundles: {selectedBundles.length} selected for post-install</div>
            )}
            <div className="text-slate-500 mb-4"># Status: Ready for Dynamic Provisioning</div>
            
            {installStatus[activeTab || ""]?.status === "error" && (
              <div className="text-red-400 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <strong>Error:</strong> {installStatus[activeTab || ""].message}
              </div>
            )}

            {installStatus[activeTab || ""]?.status === "success" && (
              <div className="text-green-400 mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <strong>Success:</strong> Installation completed perfectly!
              </div>
            )}
            
            <button 
              className={`w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors mb-6
                ${!isAdmin || isInstalling ? 'bg-white/10 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}
              disabled={!isAdmin || isInstalling}
              onClick={() => activeTab && runInstall(activeTab)}
            >
              {isInstalling ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Installing...
                </>
              ) : isAdmin ? (
                <><span>▶</span> Install {activeOSDetails?.name} now</>
              ) : (
                <><span>🔒</span> Restart as Admin</>
              )}
            </button>
            
            <div className="text-slate-400">Ready to execute backend commands...</div>
          </div>
        </div>

        <div className="flex justify-between mt-auto">
          <button 
            className="bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 border border-white/10"
            onClick={onBack}
            disabled={isInstalling}
          >
            <span>←</span> Back
          </button>
          
          <button 
            className="bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center gap-2"
            onClick={() => window.location.reload()}
          >
            Finish <span>✓</span>
          </button>
        </div>
      </div>
    </div>
  );
}
