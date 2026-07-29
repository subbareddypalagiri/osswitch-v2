import { useState, useEffect, memo, useRef } from "react";
import { OS_LIST } from "./StepChooseOS";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn, Event } from "@tauri-apps/api/event";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { openUrl } from "@tauri-apps/plugin-opener";

export const InstallProgressBar = memo(function InstallProgressBar() {
  const [progress, setProgress] = useState({ i: 0, text: "", total: 1 });

  useEffect(() => {
    let unlistenFn: UnlistenFn | null = null;
    let isMounted = true;
    let rafId: number | null = null;

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
  backupEnabled,
  catalog,
  isInstalling,
  setIsInstalling
}: { 
  onNext: () => void, 
  onBack: () => void,
  selectedOS: string[],
  selectedIntents: Record<string, string>,
  selectedBundles: string[],
  backupEnabled: boolean,
  catalog: { id: string, name: string, isoUrl?: string, officialSite?: string }[],
  isInstalling: boolean,
  setIsInstalling: (b: boolean) => void
}) {
  const targets = selectedOS.filter(id => id !== 'windows');
  const [activeTab, setActiveTab] = useState(targets.length > 0 ? targets[0] : null);
  const [installStatus, setInstallStatus] = useState<Record<string, { status: "success" | "error" | "idle", message?: string }>>({});
  const [fallbackMode, setFallbackMode] = useState<{active: boolean, url: string, id: string}>({active: false, url: "", id: ""});

  // AI Integration States
  const [apiKey, setApiKey] = useState("");
  const [modelsList, setModelsList] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [fetchingModels, setFetchingModels] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const fetchAiModels = async () => {
    if (!apiKey.trim()) {
      setAiError("Please enter a Gemini API Key first.");
      return;
    }
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
      setIsInstalling(true);
      setInstallStatus(prev => ({ ...prev, [id]: { status: "idle", message: "" } })); // clear previous
      setFallbackMode({active: false, url: "", id: ""});

      if (backupEnabled) {
        await invoke("backup_system");
      }

      const intent = selectedIntents[id] || "vbox_vm";
      const catalogEntry = catalog.find(o => o.id === id);
      const iso_url = localIsoPath || catalogEntry?.isoUrl || "";
      await invoke("install_os", { id: id, intent: intent, isoUrl: iso_url });
      
    } catch (e: unknown) {
      console.error(e);
      let errMsg = typeof e === "string" ? e : (e as Error)?.message || JSON.stringify(e);
      
      if (errMsg.includes("ISO_DOWNLOAD_FAILED") || errMsg.includes("MACOS_RESTRICTION") || errMsg.includes("does not exist") || !catalog.find(o => o.id === id)?.isoUrl) {
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
           <h2 className="text-xl font-bold text-white mb-2">Automatic Download Blocked</h2>
           <p className="text-slate-300 text-sm mb-6">
              The official server for this OS restricts automated downloads (or the link expired). 
              Please download the ISO manually from their official website, then select it below.
           </p>
           <div className="flex flex-col gap-3 w-full">
             <button 
               className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-colors border border-white/10 flex items-center justify-center gap-2"
               onClick={async () => {
                try { await openUrl(fallbackMode.url); }
                catch (e) { console.error("Failed to open URL", e); alert("Failed to open browser. Please copy this link manually: " + fallbackMode.url); }
              }}
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
      <div className="glass-card max-w-[900px] p-10 w-full animate-[fadeIn_0.5s_ease-out] flex flex-col max-h-full">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
          <span className="text-blue-500 text-sm font-bold uppercase tracking-widest">Step 6 of 7</span>
        </div>
        
        <h2 className="text-[32px] font-bold text-white tracking-tight mb-6">
          Run <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Console</span>
        </h2>
        
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
          {targets.map(id => {
            const os = getOSDetails(id);
            if (!os) return null;
            return (
              <button
                key={id}
                disabled={isInstalling}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap
                  ${activeTab === id ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}
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
            <span className="text-white font-bold text-sm tracking-wide">GEMINI AI AUTO-FIX</span>
          </div>
          <div className="flex gap-3">
            <input 
              type="password" 
              placeholder="Enter Gemini API Key..." 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isInstalling}
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-500"
            />
            <button 
              onClick={fetchAiModels}
              disabled={isInstalling || fetchingModels || !apiKey.trim()}
              className="bg-purple-600/80 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {fetchingModels ? "Fetching..." : "Connect"}
            </button>
            {modelsList.length > 0 && (
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isInstalling}
                className="bg-black/40 border border-purple-500/50 rounded-lg px-3 py-2 text-sm text-purple-300 focus:outline-none focus:border-purple-500 max-w-[200px]"
              >
                {modelsList.map(m => (
                  <option key={m} value={m}>{m.replace('models/', '')}</option>
                ))}
              </select>
            )}
          </div>
          {aiError && <div className="text-xs text-red-400 mt-2">{aiError}</div>}
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
                ${isInstalling ? 'bg-white/10 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}
              disabled={isInstalling}
              onClick={() => activeTab && runInstall(activeTab)}
            >
              {isInstalling ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Installing...
                </>
              ) : (
                <><span>▶</span> Install {activeOSDetails?.name} now</>
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
                  <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{aiSuggestion}</p>
                </div>
              </div>
            </div>
          )}
          <div ref={consoleEndRef} />

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
            className={`font-semibold py-3 px-8 rounded-xl transition-all flex items-center gap-2 ${isInstalling ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'}`}
            onClick={() => window.location.reload()}
            disabled={isInstalling}
          >
            Finish <span>✓</span>
          </button>
        </div>
      </div>
    </div>
  );
}
