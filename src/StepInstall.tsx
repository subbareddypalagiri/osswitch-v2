import { useState, useEffect, memo, useRef } from "react";
import { OS_LIST } from "./StepChooseOS";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn, Event } from "@tauri-apps/api/event";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { openUrl } from "@tauri-apps/plugin-opener";

// Safety guard: Tauri APIs only work inside the desktop app, not in a browser
const isTauri = () => typeof window !== 'undefined' && !!(window as any).__TAURI_INTERNALS__;

export const InstallProgressBar = memo(function InstallProgressBar() {
  const [progress, setProgress] = useState({ i: 0, text: "", total: 1 });

  useEffect(() => {
    let unlistenFn: UnlistenFn | null = null;
    let isMounted = true;
    let rafId: number | null = null;
    if (!isTauri()) return;

    listen("install-progress", (event: Event<{i: number, text: string, total: number}>) => {
      if (isMounted) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => setProgress(event.payload));
      }
    }).then(unlisten => {
      if (isMounted) unlistenFn = unlisten;
      else unlisten();
    }).catch(console.error);

    return () => {
      isMounted = false;
      if (rafId) cancelAnimationFrame(rafId);
      if (unlistenFn) unlistenFn();
    };
  }, []);

  const percentage = Math.min(100, Math.max(0, (progress.i / (progress.total || 1)) * 100));

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-blue-400 mb-8 font-mono break-all text-center max-w-xl px-4 text-sm">{progress.text || "Running provisioning sequence..."}</p>
      <div className="w-full max-w-md bg-white/5 rounded-full h-3 mb-6 overflow-hidden border border-black/10 dark:border-white/10 relative">
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
  selectedTools = [],
  backupEnabled,
  catalog,
  isInstalling,
  setIsInstalling,
  osSpace
}: { 
  onNext: () => void, 
  onBack: () => void,
  selectedOS: string[],
  selectedIntents: Record<string, string>,
  selectedBundles: string[],
  selectedTools?: string[],
  backupEnabled: boolean,
  catalog: { id: string, name: string, isoUrl?: string, officialSite?: string, frugalKernel?: string, frugalInitrd?: string, frugalAppend?: string }[],
  isInstalling: boolean,
  setIsInstalling: (b: boolean) => void,
  osSpace: number
}) {
  const targets = selectedOS.filter(id => id !== 'windows');
  const [activeTab, setActiveTab] = useState(targets.length > 0 ? targets[0] : "tools_only");
  const [installStatus, setInstallStatus] = useState<Record<string, { status: "success" | "error" | "idle", message?: string }>>({});
  const [safetyPromptState, setSafetyPromptState] = useState<{show: boolean, id: string, path?: string, accepted: boolean}>({show: false, id: "", accepted: false});
  const [usbPromptState, setUsbPromptState] = useState<{show: boolean, id: string, path?: string, detected: boolean}>({show: false, id: "", detected: false});
  const [fallbackMode, setFallbackMode] = useState<{active: boolean, url: string, id: string}>({active: false, url: "", id: ""});
  const [bundleProgress, setBundleProgress] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // AI Integration States
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");
  const [modelsList, setModelsList] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [fetchingModels, setFetchingModels] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [liveLog, setLiveLog] = useState("");
  const [pkgProgressState, setPkgProgressState] = useState<{ i: number, total: number }>({ i: 0, total: 1 });
  
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let unlisten: UnlistenFn | null = null;
    let unlistenLog: UnlistenFn | null = null;
    let isMounted = true;
    if (!isTauri()) return;
    
    listen("bundle-progress", (event: Event<{id: string, status: string}>) => {
      if (isMounted) {
        setBundleProgress(prev => ({ ...prev, [event.payload.id]: event.payload.status }));
      }
    }).then(un => { if (isMounted) unlisten = un; else un(); }).catch(console.error);

    listen("install-progress", (event: Event<{i: number, text: string, total: number}>) => {
      if (isMounted) {
        setLiveLog(event.payload.text);
        if (event.payload.total > 0) {
          setPkgProgressState({ i: event.payload.i, total: event.payload.total });
        }
      }
    }).then(un => { if (isMounted) unlistenLog = un; else un(); }).catch(console.error);

    return () => {
      isMounted = false;
      if (unlisten) unlisten();
      if (unlistenLog) unlistenLog();
    };
  }, []);

  const fetchAiModels = async () => {
    if (!apiKey.trim()) {
      setAiError("Please enter a Gemini API Key first.");
      return;
    }
    localStorage.setItem("gemini_api_key", apiKey.trim());
    try {
      setFetchingModels(true);
      setAiError(null);
      const models: string[] = await invoke("get_gemini_models", { apiKey: apiKey.trim() });
      setModelsList(models);
      if (models.length > 0) setSelectedModel(models[0]);
    } catch (e: any) {
      setAiError(e.toString());
    } finally {
      setFetchingModels(false);
    }
  };

  const checkAiForError = async (errMsg: string) => {
    if (!apiKey.trim() || !selectedModel) return;
    try {
      const suggestion: string = await invoke("ai_fix", { 
        errorMsg: errMsg, 
        apiKey: apiKey.trim(),
        model: selectedModel.replace('models/', '') 
      });
      setAiSuggestion(suggestion);
    } catch(e) {
      console.error("AI check failed:", e);
    }
  };

  
  const runInstall = async (id: string, localIsoPath?: string) => {
    try {
      const intent = selectedIntents[id] || "vbox_vm";
      // tools_only mode: skip all OS-related prompts, go straight to package install
      if (id === "tools_only") {
        await executeInstall(id, localIsoPath);
        return;
      }
      if (intent === "baremetal_grub") {
        setSafetyPromptState({show: true, id, path: localIsoPath, accepted: false});
        return;
      }
      if (intent === "usb_flash") {
        setUsbPromptState({show: true, id, path: localIsoPath, detected: false});
        return;
      }
      await executeInstall(id, localIsoPath);
    } catch (e: any) {
      alert("CRASH in runInstall: " + e.toString());
    }
  };

  const executeInstall = async (id: string, localIsoPath?: string) => {
    if (!isTauri()) {
      setInstallStatus(prev => ({ ...prev, [id]: { status: "error", message: "Please open the OSwitch desktop app, not a browser. Tauri APIs are not available in browser mode." } }));
      return;
    }
    try {
      setIsInstalling(true);
      setInstallStatus(prev => ({ ...prev, [id]: { status: "idle", message: "" } })); // clear previous
      setFallbackMode({active: false, url: "", id: ""});

      if (backupEnabled) {
        await invoke("backup_system");
      }

      const intent = selectedIntents[id] || "vbox_vm";
      const catalogEntry = catalog.find(o => o.id === id);
      const iso_url = localIsoPath || catalogEntry?.isoUrl || "";
      
      // Step 1: Install OS (Skip if tools_only)
      if (id !== "tools_only") {
        await invoke("install_os", { 
          id: id, 
          intent: intent, 
          isoUrl: iso_url, 
          osSpace: osSpace,
          frugalKernel: catalogEntry?.frugalKernel,
          frugalInitrd: catalogEntry?.frugalInitrd,
          frugalAppend: catalogEntry?.frugalAppend
        });
      }
      
      // Step 2: Install Packages (Bundles + Tools)
      const packagesToInstall = [...selectedBundles, ...(selectedTools || [])];
      if (packagesToInstall.length > 0) {
          setInstallStatus(prev => ({ ...prev, [id]: { status: "idle", message: "Installing selected tools and bundles via Winget..." } }));
          await invoke("install_packages", { 
            packages: packagesToInstall, 
            targetOs: id === "tools_only" ? null : id, 
            intent: id === "tools_only" ? null : intent, 
            apiKey: apiKey, 
            aiModel: selectedModel ? selectedModel.replace("models/", "") : "gemini-2.5-flash" 
          });
      }
      
    } catch (e: unknown) {
      console.error(e);
      let errMsg = typeof e === "string" ? e : (e as Error)?.message || JSON.stringify(e);
      
      if (id !== "tools_only" && (errMsg.includes("ISO_DOWNLOAD_FAILED") || errMsg.includes("MACOS_RESTRICTION") || errMsg.includes("does not exist") || !catalog.find(o => o.id === id)?.isoUrl)) {
        const catalogEntry = catalog.find(o => o.id === id);
        const officialUrl = catalogEntry?.officialSite || "https://google.com/search?q=" + encodeURIComponent((catalogEntry?.name || id) + " download");
        setFallbackMode({active: true, url: officialUrl, id});
        setIsInstalling(false);
        return;
      }
      
      setInstallStatus(prev => ({ ...prev, [id]: { status: "error", message: "Failed to install OS " + id + ": " + errMsg } }));
      checkAiForError(errMsg);
      setIsInstalling(false);
      return;
    }



    setInstallStatus(prev => ({ ...prev, [id]: { status: "success" } }));
    setIsInstalling(false);
  };

  const handleSelectLocalIso = async () => {
    try {
      const file = await openDialog({
        multiple: false,
        filters: [{
          name: 'Disk Image',
          extensions: ['iso', 'img']
        }]
      });
      
      if (file && typeof file === 'string') {
        await runInstall(fallbackMode.id, file);
      }
    } catch (err) {
      console.error("Failed to open dialog", err);
    }
  };

  if (targets.length === 0 && selectedBundles.length === 0 && selectedTools?.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="text-slate-400 text-lg">No OS or Tools selected. Go back and make a selection.</div>
        <button 
          className="mt-4 bg-white/5 hover:bg-white/10 text-slate-900 dark:text-white font-semibold py-2 px-6 rounded-xl transition-colors border border-black/10 dark:border-white/10"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    );
  }

  const getOSDetails = (osId: string) => {
    const staticMeta = OS_LIST.find(o => o.id === osId);
    const catalogMeta = catalog.find((o: any) => o.id === osId);
    if (!staticMeta && !catalogMeta) return null;
    return {
      id: osId,
      name: catalogMeta?.name || staticMeta?.name || osId,
      sub: staticMeta?.sub || (catalogMeta as any)?.category || "",
      glyph: staticMeta?.glyph || "📦",
      locked: staticMeta?.locked || false
    };
  };

  const activeOSDetails = getOSDetails(activeTab || "");

  if (fallbackMode.active) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-10">
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-8 rounded-2xl max-w-lg text-center shadow-[0_0_30px_rgba(234,179,8,0.15)] flex flex-col items-center">
           <div className="w-16 h-16 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
           </div>
           <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Automatic Download Blocked</h2>
           <p className="text-slate-300 text-sm mb-6">
              The official server for this OS restricts automated downloads (or the link expired). 
              Please download the ISO manually from their official website, then select it below.
           </p>
           <div className="flex flex-col gap-3 w-full">
             <button 
               className="bg-white/10 hover:bg-white/20 text-slate-900 dark:text-white font-medium py-3 px-6 rounded-xl transition-colors border border-black/10 dark:border-white/10 flex items-center justify-center gap-2"
               onClick={async () => {
                try { await openUrl(fallbackMode.url); }
                catch (e) { console.error("Failed to open URL", e); alert("Failed to open browser. Please copy this link manually: " + fallbackMode.url); }
              }}
             >
               1. Open Official Website <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
             </button>
             <button 
               className="bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-bold py-3 px-6 rounded-xl transition-transform hover:-translate-y-0.5 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
               onClick={handleSelectLocalIso}
             >
               2. Select Downloaded ISO
             </button>
             <button 
               className="mt-4 text-slate-400 hover:text-slate-900 dark:text-white text-sm px-4 py-2"
               onClick={() => setFallbackMode({active:false, url:"", id:""})}
             >
               Cancel
             </button>
           </div>
        </div>
      </div>
    );
  }

  if (isInstalling && activeTab !== "tools_only") {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-10">
        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">⚡</div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Installing Operating System</h2>
          <InstallProgressBar />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center mt-10">
      <div className="glass-card max-w-[900px] p-10 w-full animate-[fadeIn_0.5s_ease-out] flex flex-col max-h-full">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
          <span className="text-blue-500 text-sm font-bold uppercase tracking-widest">Step 6 of 7</span>
        </div>
        
        <h2 className="text-[32px] font-bold text-slate-900 dark:text-white tracking-tight mb-6">
          Run <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Console</span>
        </h2>
        
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
          {activeTab === "tools_only" && (
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap bg-blue-600 text-slate-900 dark:text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]"><span>📦</span> App Store Execution</button>
          )}
          {targets.map(id => {
            const os = getOSDetails(id);
            if (!os) return null;
            return (
              <button
                key={id}
                disabled={isInstalling}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap
                  ${activeTab === id ? 'bg-blue-600 text-slate-900 dark:text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-900 dark:text-white'}
                  ${isInstalling ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setActiveTab(id)}
              >
                <span>{os.glyph}</span> {os.name}
              </button>
            );
          })}
        </div>
        
        
        {/* AI Assistant Panel */}
        <div className="w-full bg-white/5 border border-purple-500/30 rounded-xl p-4 mb-6 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-purple-400">✨</span>
            <span className="text-slate-900 dark:text-white font-bold text-sm tracking-wide">GEMINI AI AUTO-FIX</span>
          </div>
          <div className="flex gap-2">
            <input 
              type="password"
              placeholder="Enter Gemini API Key..."
              value={apiKey}
              onChange={e => {
                setApiKey(e.target.value);
                localStorage.setItem("gemini_api_key", e.target.value);
              }}
              className="flex-1 bg-slate-100 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-500"
            />
            <button 
              onClick={fetchAiModels}
              disabled={isInstalling || fetchingModels || !apiKey.trim()}
              className="bg-purple-600/80 hover:bg-purple-500 text-slate-900 dark:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {fetchingModels ? "Fetching..." : "Connect"}
            </button>
            {modelsList.length > 0 && (
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isInstalling}
                className="bg-slate-100 dark:bg-black/40 border border-purple-500/50 rounded-lg px-3 py-2 text-sm text-purple-300 focus:outline-none focus:border-purple-500 max-w-[200px]"
              >
                {modelsList.map(m => (
                  <option key={m} value={m}>{m.replace('models/', '')}</option>
                ))}
              </select>
            )}
          </div>
          {aiError && <div className="text-xs text-red-400 mt-2">{aiError}</div>}
        </div>

        <div className="bg-slate-100 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl flex flex-col flex-grow overflow-hidden mb-6">
          <div className="bg-white/5 px-4 py-2 border-b border-black/10 dark:border-white/10 flex items-center gap-2 text-xs font-mono text-slate-400">
            <div className="flex gap-1.5 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            Terminal - {activeTab === "tools_only" ? "Package Manager" : activeOSDetails?.name}
          </div>
          
          <div className="p-4 font-mono text-sm overflow-y-auto flex-grow custom-scrollbar">
            <div className="text-slate-500 mb-1"># Universal Provisioning Engine</div>
            {activeTab !== "tools_only" && <div className="text-green-400 mb-1">$ Target OS: {activeOSDetails?.name}</div>}
            {activeTab !== "tools_only" && <div className="text-green-400 mb-1">$ Intent: {selectedIntents[activeTab || ""] || "vbox_vm"}</div>}
            {selectedBundles.length > 0 && (
               <div className="text-yellow-400 mb-1">$ Bundles: {selectedBundles.length} selected for post-install</div>
            )}
            {selectedTools.length > 0 && (
               <div className="text-purple-400 mb-1">$ Tools: {selectedTools.length} specialized tools queued for install</div>
            )}
            <div className="text-slate-500 mb-4"># Status: Ready for Dynamic Provisioning</div>
            
            {installStatus[activeTab || ""]?.status === "error" && (
              <div className="text-red-400 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <strong>Error:</strong> {installStatus[activeTab || ""].message}
              </div>
            )}

            {(isInstalling || Object.entries(bundleProgress).length > 0) && (
              <div className="mb-4">
                <div className="text-slate-500"># Package Installation Progress</div>
                {[...selectedBundles, ...(selectedTools || [])].map(pkg => {
                  return (
                    <div key={pkg} className="flex items-center gap-2">
                      {bundleProgress[pkg] === "success" ? <span className="text-green-500 font-bold">[OK]</span> : 
                        bundleProgress[pkg] === "error" ? <span className="text-red-500 font-bold">[ERR]</span> :
                        bundleProgress[pkg] === "installing" ? <span className="text-blue-400 font-bold animate-pulse">[..]</span> :
                        <span className="text-slate-600 font-bold">[  ]</span>}
                      <span className={bundleProgress[pkg] === "success" ? "text-green-400" : "text-slate-300"}>{pkg}</span>
                    </div>
                  )
                })}
                
                {isInstalling && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    {(() => {
                      const cleanLog = liveLog ? liveLog.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '').replace(/[\x00-\x1F\x7F-\x9F]/g, ' ') : "";
                      const percentMatch = cleanLog.match(/(\d+)%/);
                      const mbMatch = cleanLog.match(/([\d\.]+)\s*(MB|GB|KB)\s*[\/|of]\s*([\d\.]+)\s*(MB|GB|KB)/i);
                      
                      let packageSubPct = 0;
                      let mbText = "";
                      let hasRealData = false;

                      if (percentMatch) {
                        packageSubPct = parseInt(percentMatch[1], 10);
                        hasRealData = true;
                      } else if (mbMatch) {
                        const cur = parseFloat(mbMatch[1]) * (mbMatch[2].toUpperCase() === "GB" ? 1024 : mbMatch[2].toUpperCase() === "KB" ? 0.001 : 1);
                        const tot = parseFloat(mbMatch[3]) * (mbMatch[4].toUpperCase() === "GB" ? 1024 : mbMatch[4].toUpperCase() === "KB" ? 0.001 : 1);
                        packageSubPct = Math.min(100, Math.round((cur / (tot || 1)) * 100));
                        mbText = `(${mbMatch[1]} ${mbMatch[2]} / ${mbMatch[3]} ${mbMatch[4]})`;
                        hasRealData = true;
                      }

                      const totalPkgs = pkgProgressState.total || 1;
                      const currentPkgIdx = Math.min(pkgProgressState.i, totalPkgs - 1);
                      const weightPerPkg = 100 / totalPkgs;
                      const overallPct = Math.min(99, Math.round((currentPkgIdx * weightPerPkg) + ((packageSubPct * weightPerPkg) / 100)));

                      let displayLabel = "";
                      if (hasRealData) {
                        displayLabel = `${overallPct}% Completed ${mbText}`;
                      } else if (currentPkgIdx > 0) {
                        displayLabel = `${overallPct}% Completed (Initializing...)`;
                      } else {
                        displayLabel = `Initializing Download...`;
                      }

                      return (
                        <>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-500"># Live Telemetry Stream</span>
                            <span className="text-cyan-400 font-mono text-xs font-bold bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/30">
                              {displayLabel}
                            </span>
                          </div>
                          
                          {/* Dynamic Progress Bar */}
                          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-2 border border-white/10 relative">
                            <div 
                              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 h-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                              style={{ width: `${Math.max(5, overallPct)}%` }}
                            />
                          </div>
                          
                          <span className="text-cyan-400 font-mono text-xs font-bold break-all block">{cleanLog || "Initializing package provisioning..."}</span>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
            
            {installStatus[activeTab || ""]?.status === "success" && !installStatus[activeTab || ""]?.message && (
              <div className="mb-4 p-5 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-xl shadow-lg">
                <h3 className="text-blue-300 font-bold text-lg mb-2 flex items-center gap-2">
                  <span className="text-2xl">🎉</span> Installation Successful!
                </h3>
                <div className="text-slate-300 text-sm leading-relaxed">
                  {selectedIntents[activeTab || ""] === "usb_flash" && (
                    <p><strong>Next Steps (USB):</strong> Please restart your computer. As it boots up, rapidly tap your BIOS key (usually <strong>F12, F2, F8, or DEL</strong>) to open the Boot Menu. Select your USB Flash Drive to begin installing the OS.</p>
                  )}
                  {selectedIntents[activeTab || ""] === "baremetal_grub" && (
                    <p><strong>Next Steps (Dual Boot):</strong> A Virtual USB partition has been safely carved on your drive. Please restart your computer. The Windows Boot Manager will automatically ask you to choose the new OS partition.</p>
                  )}
                  {(selectedIntents[activeTab || ""] === "vbox_vm" || selectedIntents[activeTab || ""] === "vmware_vm") && (
                    <p><strong>Next Steps (Virtual Machine):</strong> Your virtual machine has been fully provisioned! Open VirtualBox or VMware from your Start Menu, select your new VM, and click Start.</p>
                  )}
                  {selectedIntents[activeTab || ""] === "wsl" && (
                    <p><strong>Next Steps (WSL):</strong> The Linux subsystem has been natively installed. Open your Windows Start Menu and search for your new Linux distribution to launch the terminal immediately.</p>
                  )}
                </div>
              </div>
            )}
            
            {installStatus[activeTab || ""]?.status === "success" && installStatus[activeTab || ""]?.message && (
              <div className="text-yellow-400 mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <strong>Warning:</strong> {installStatus[activeTab || ""].message}
              </div>
            )}
            
            <button 
              className={`w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors mb-6
                ${isInstalling ? 'bg-white/10 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}
              disabled={isInstalling}
              onClick={() => activeTab && runInstall(activeTab)}
            >
              {isInstalling ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Installing...
                </>
              ) : (
                <><span>▶</span> {activeTab === "tools_only" ? "Execute Package Installation" : `Install ${activeOSDetails?.name} now`}</>
              )}
            </button>
            
            <div className="text-slate-400">Ready to execute backend commands...</div>

          {aiSuggestion && (
            <div className="mt-4 p-4 rounded-xl bg-purple-900/40 border border-purple-500/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🤖</span>
                <div>
                  <h4 className="text-purple-300 font-bold text-sm mb-1 uppercase tracking-wider">AI Suggestion</h4>
                  <p className="text-slate-900 dark:text-white text-sm leading-relaxed whitespace-pre-wrap">{aiSuggestion}</p>
                </div>
              </div>
            </div>
          )}
          <div ref={consoleEndRef} />

          </div>
        </div>

        <div className="flex justify-between mt-auto">
          <button 
            className="bg-white/5 hover:bg-white/10 text-slate-900 dark:text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 border border-black/10 dark:border-white/10"
            onClick={onBack}
            disabled={isInstalling}
          >
            <span>←</span> Back
          </button>
          
          <button 
            className={`font-semibold py-3 px-8 rounded-xl transition-all flex items-center gap-2 ${isInstalling ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-slate-900 dark:text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'}`}
            onClick={() => setShowSuccessModal(true)}
            disabled={isInstalling}
          >
            Finish <span>✓</span>
          </button>
        </div>
      </div>


      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-8 shadow-2xl space-y-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">Provisioning Complete!</h3>
                <p className="text-sm text-slate-400">Your OS installation media is ready.</p>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700/50 space-y-4 text-sm">
              <h4 className="font-semibold text-indigo-400 uppercase tracking-wider text-xs">🚀 How to Boot Your Test Laptop:</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li><strong className="text-white">Unplug USB</strong> safely & insert it into your test laptop.</li>
                <li>Press the <strong className="text-white">POWER ON</strong> button on your laptop.</li>
                <li><strong className="text-emerald-400">Immediately & continuously tap F12 or F2</strong> as soon as the screen turns on!</li>
                <li>Select your <strong className="text-white">USB Drive</strong> from the Boot Menu and press Enter.</li>
              </ol>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs bg-black/40 p-3 rounded-lg border border-white/5 text-slate-400">
              <div><strong>Dell / Lenovo:</strong> F12</div>
              <div><strong>HP / Asus:</strong> F9 / F2</div>
              <div><strong>Acer / MSI:</strong> F12 / Del</div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/40"
            >
              Done & Return to Dashboard
            </button>
          </div>
        </div>
      )}

      {usbPromptState.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/20 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none" />
            
            <div className="mb-6 relative z-10">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${usbPromptState.detected ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400 animate-pulse'}`}>
                <span className="text-4xl">💾</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 relative z-10">
              {usbPromptState.detected ? "USB Detected! ✅" : "Insert USB Drive"}
            </h2>
            
            <p className="text-slate-400 mb-8 relative z-10">
              {usbPromptState.detected 
                ? "Rufus will now launch. Please select your USB drive in Rufus and click START."
                : "Please plug your empty USB Flash Drive into the computer now."}
            </p>
            
            <div className="flex gap-4 relative z-10">
              <button 
                onClick={() => setUsbPromptState({show: false, id: "", detected: false})}
                className="flex-1 py-3 px-4 rounded-xl font-medium border border-black/10 dark:border-white/10 hover:bg-white/5 text-slate-900 dark:text-white transition-colors"
              >
                Cancel
              </button>
              
              {!usbPromptState.detected ? (
                <button 
                  onClick={() => setUsbPromptState(prev => ({...prev, detected: true}))}
                  className="flex-1 py-3 px-4 rounded-xl font-medium bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white transition-colors"
                >
                  I've Inserted It
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setUsbPromptState(prev => ({...prev, show: false}));
                    executeInstall(usbPromptState.id, usbPromptState.path);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl font-medium bg-green-600 hover:bg-green-500 text-slate-900 dark:text-white shadow-lg shadow-green-500/20 transition-colors"
                >
                  Launch Rufus
                </button>
              )}
            </div>
          </div>
        </div>
      )}


      {safetyPromptState.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-indigo-500/30 p-8 rounded-2xl max-w-lg w-full shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-amber-500/10 pointer-events-none" />
            
            <div className="mb-6 relative z-10 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/30">
                <span className="text-3xl">🛡️</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">System Preparation</h2>
              <p className="text-slate-300 text-sm">
                OSwitch is ready to install your new Operating System natively. To ensure zero data loss, please review our automated safety measures.
              </p>
            </div>
            
            <div className="bg-slate-100 dark:bg-black/40 rounded-xl p-4 mb-6 border border-black/5 dark:border-white/5 relative z-10 text-left space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-amber-400 mt-0.5">⚡</span>
                <div>
                  <h4 className="text-slate-900 dark:text-white font-medium text-sm">Automated Bootloader Backup</h4>
                  <p className="text-slate-400 text-xs">Your Windows boot configuration will be safely backed up before any changes are made.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 mt-0.5">🔒</span>
                <div>
                  <h4 className="text-slate-900 dark:text-white font-medium text-sm">Safe Partition Carving</h4>
                  <p className="text-slate-400 text-xs">We will only use free, unallocated space. Your existing personal files and Windows data will remain untouched.</p>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 mb-8 cursor-pointer relative z-10 group">
              <div className="mt-1 relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 appearance-none border border-slate-500 rounded bg-black/30 checked:bg-indigo-500 checked:border-indigo-500 transition-all cursor-pointer"
                  checked={safetyPromptState.accepted}
                  onChange={(e) => setSafetyPromptState(prev => ({...prev, accepted: e.target.checked}))}
                />
                {safetyPromptState.accepted && (
                  <svg className="absolute w-3 h-3 text-slate-900 dark:text-white pointer-events-none" viewBox="0 0 14 14" fill="none">
                    <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-sm text-slate-300 group-hover:text-slate-900 dark:text-white transition-colors">
                I understand that OS installation alters hardware partitions. I have saved my open work and am ready to proceed.
              </span>
            </label>
            
            <div className="flex gap-4 relative z-10">
              <button 
                onClick={() => setSafetyPromptState({show: false, id: "", accepted: false})}
                className="flex-1 py-3 px-4 rounded-xl font-medium border border-black/10 dark:border-white/10 hover:bg-white/5 text-slate-900 dark:text-white transition-colors"
              >
                Cancel
              </button>
              
              <button 
                onClick={() => {
                  if (safetyPromptState.accepted) {
                    setSafetyPromptState(prev => ({...prev, show: false}));
                    executeInstall(safetyPromptState.id, safetyPromptState.path);
                  }
                }}
                disabled={!safetyPromptState.accepted}
                className={"flex-[2] py-3 px-4 rounded-xl font-medium transition-all " + (safetyPromptState.accepted ? "bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white shadow-lg shadow-indigo-500/20" : "bg-slate-800 text-slate-500 cursor-not-allowed")}
              >
                Proceed Securely
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
