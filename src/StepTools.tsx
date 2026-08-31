import { useState, useEffect, useMemo } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { openUrl } from '@tauri-apps/plugin-opener';

interface Tool {
  id: string;
  name: string;
  wingetId: string;
  description: string;
  department: string;
  role: string;
  icon: string;
  eligibility?: "windows_winget" | "linux_vm" | "vendor_direct" | "web_app";
  source?: string;
  vendorUrl?: string;
}

interface Catalog {
  departments: string[];
  roles: string[];
  tools: Tool[];
}

export default function StepTools({
  selectedTools,
  setSelectedTools,
  onNext,
  onBack
}: {
  selectedTools: string[];
  setSelectedTools: (tools: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [aiGuide, setAiGuide] = useState<string | null>(null);
  const [liveSearchResults, setLiveSearchResults] = useState<Tool[]>([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [installedApps, setInstalledApps] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<"all" | "installed" | "windows_winget" | "linux_vm" | "web_app" | "vendor_direct">("all");
  const [launchMessage, setLaunchMessage] = useState<string | null>(null);
  const [hostPlatform, setHostPlatform] = useState<"windows" | "linux">("windows");

  useEffect(() => {
    fetch('/tools-catalog.json')
      .then(res => res.json())
      .then(data => setCatalog(data))
      .catch(err => console.error("Failed to load tools catalog", err));

    invoke<string[]>('get_installed_tools')
      .then(apps => {
        if (apps) setInstalledApps(apps);
      })
      .catch(err => console.error("Failed to load installed apps:", err));

    invoke<string>('get_host_platform')
      .then(platform => setHostPlatform(platform as "windows" | "linux"))
      .catch(() => setHostPlatform("windows"));
  }, []);

  const isToolInstalled = (t: Tool) => {
    if (!installedApps || installedApps.length === 0) return false;
    const tName = t.name.toLowerCase().trim();
    const cleanT = tName.replace(/[^a-z0-9]/g, '');
    if (!cleanT || cleanT.length < 2) return false;
    const wId = (t.wingetId || '').toLowerCase().trim();
    // Derive the Linux package name the same way Rust maps it (last dot-segment)
    const linuxPkg = wId.split('.').pop()?.replace(/[^a-z0-9-]/g, '') || '';

    return installedApps.some(app => {
      const rawApp = app.toLowerCase().trim();
      const cleanApp = rawApp.replace(/[^a-z0-9]/g, '');
      if (!cleanApp) return false;

      // 1. Exact equality (e.g. "git" === "git", "docker desktop" === "docker desktop")
      if (cleanApp === cleanT) return true;

      // 2. Prefix match for versioned apps (e.g. "autopsy 4.23.1" starts with "autopsy")
      if (cleanT.length >= 4 && cleanApp.startsWith(cleanT)) return true;

      // 3. Exact Winget ID matching (Windows registry entries)
      if (wId && (rawApp === wId || (wId.length >= 8 && rawApp.includes(wId)))) {
        return true;
      }

      // 4. Linux package name match (from dpkg/pacman/flatpak scan)
      if (linuxPkg && linuxPkg.length >= 3 && (rawApp === linuxPkg || rawApp.startsWith(linuxPkg))) {
        return true;
      }

      return false;
    });
  };

  const handleLaunchApp = async (tool: Tool) => {
    try {
      setLaunchMessage(`🚀 Launching ${tool.name}...`);
      await invoke('launch_installed_tool', { toolName: tool.name, wingetId: tool.wingetId });
      setTimeout(() => setLaunchMessage(null), 3000);
    } catch (e: any) {
      setLaunchMessage(`⚠️ Error launching: ${e.toString()}`);
      setTimeout(() => setLaunchMessage(null), 4000);
    }
  };

  const handleLiveSearch = async () => {
    if (!search.trim()) return;
    // On Linux, Winget is unavailable — local catalog search is sufficient
    if (hostPlatform === 'linux') {
      setIsSearchingLive(false);
      return;
    }
    setIsSearchingLive(true);
    try {
      const res = await invoke<Array<{ name: string; id: string; version: string }>>('search_winget', { query: search });
      const converted: Tool[] = res.map((item, idx) => ({
        id: `live-winget-${idx}-${item.id}`,
        name: item.name,
        wingetId: item.id,
        description: `Official Microsoft Winget package ${item.id} (Version: ${item.version}). Ready for 1-click installation.`,
        department: "General / Independent",
        role: "Independent User",
        eligibility: "windows_winget",
        source: "Winget Cloud Registry",
        vendorUrl: "https://github.com/microsoft/winget-pkgs",
        icon: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random&color=fff`
      }));
      setLiveSearchResults(converted);
    } catch (e) {
      console.error("Live Winget search failed:", e);
    } finally {
      setIsSearchingLive(false);
    }
  };

  const installedCount = useMemo(() => {
    if (!catalog) return 0;
    return catalog.tools.filter(t => isToolInstalled(t)).length;
  }, [catalog, installedApps]);

  const filteredTools = useMemo(() => {
    const baseList = catalog ? catalog.tools : [];
    const combined = [...liveSearchResults, ...baseList];
    return combined.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.description.toLowerCase().includes(search.toLowerCase()) ||
                          t.wingetId.toLowerCase().includes(search.toLowerCase());
      const matchDept = filterDept ? t.department === filterDept : true;
      const matchRole = filterRole ? t.role === filterRole : true;
      
      let matchFilterType = true;
      if (filterType === "installed") {
        matchFilterType = isToolInstalled(t);
      } else if (filterType !== "all") {
        matchFilterType = t.eligibility === filterType;
      }

      return matchSearch && matchDept && matchRole && matchFilterType;
    });
  }, [catalog, search, filterDept, filterRole, liveSearchResults, filterType, installedApps]);

  const paginatedTools = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredTools.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTools, page]);

  const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE);

  const toggleTool = (_toolId: string, wingetId: string) => {
    if (selectedTools.includes(wingetId)) {
      setSelectedTools(selectedTools.filter(t => t !== wingetId));
    } else {
      setSelectedTools([...selectedTools, wingetId]);
    }
  };

  const openAiGuide = (tool: Tool) => {
    setActiveTool(tool);
    setAiGuide(null);
    setTimeout(() => {
      const linuxPkg = tool.wingetId.split('.').pop()?.toLowerCase() || tool.name.toLowerCase();
      const installCmd = hostPlatform === 'linux'
        ? `sudo apt install ${linuxPkg}  # or: sudo pacman -S ${linuxPkg}`
        : `winget install ${tool.wingetId}`;
      const launchNote = hostPlatform === 'linux'
        ? `Open a terminal and run \`${linuxPkg}\`, or search your application launcher.`
        : `Press the Windows Key and type '${tool.name}' or click 'Launch App' directly inside OSwitch.`;
      setAiGuide(`### How to Use ${tool.name}\n\n1. **Installation:** OSwitch will automatically install this via \`${installCmd}\`.\n2. **Launch:** ${launchNote}\n3. **First Steps:** This tool is widely used by ${tool.role}s in the ${tool.department} industry. Begin by setting up a new project workspace.\n\n*Generated dynamically by OSwitch AI Engine.*`);
    }, 600);
  };

  if (!catalog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-900 dark:text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl">Booting Infinite App Store (Loading 10,000+ Tools)...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col text-slate-900 dark:text-white relative">
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
         <div className="absolute top-[10%] left-[20%] w-[30vw] h-[30vw] bg-cyan-600/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[10%] right-[20%] w-[40vw] h-[40vw] bg-purple-600/10 rounded-full blur-[150px]"></div>
      </div>

      {launchMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.3)] font-mono text-xs flex items-center gap-2 animate-bounce">
          <span>⚡</span> {launchMessage}
        </div>
      )}

      <div className="w-full flex-grow flex flex-col max-w-7xl mx-auto">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
              <span className="text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">Step 5 of 7</span>
              {/* Host OS badge */}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                hostPlatform === 'linux'
                  ? 'bg-orange-500/10 text-orange-300 border-orange-500/30'
                  : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
              }`}>
                {hostPlatform === 'linux' ? '🐧 Linux Host' : '🪟 Windows Host'}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Software & Tool Ecosystem
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              {hostPlatform === 'linux'
                ? 'Browse 10,500+ tools — Linux-native packages auto-installed via apt / pacman / flatpak / pip.'
                : 'Browse 10,500+ curated tools powered by direct repository mirrors and Microsoft Winget.'}
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
              className="px-5 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs shadow-[0_2px_10px_rgba(180,100,50,0.4)] transition-all"
            >
              Next ({selectedTools.length} Selected)
            </button>
          </div>
        </div>

        {/* Quick Filter Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {[
            { id: "all", label: `All Tools (10,500+)`, icon: "🌐" },
            { id: "installed", label: `Installed on ${hostPlatform === 'linux' ? 'Linux' : 'PC'} (${installedCount})`, icon: "🟢", glow: installedCount > 0 },
            { id: "windows_winget", label: hostPlatform === 'linux' ? "Linux Native" : "Windows 1-Click", icon: hostPlatform === 'linux' ? "🐧" : "⚡" },
            { id: "linux_vm", label: "Linux / VM", icon: "🐉" },
            { id: "web_app", label: "Web & Cloud", icon: "☁️" },
            { id: "vendor_direct", label: "Vendor Direct", icon: "🟣" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setFilterType(tab.id as any); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                filterType === tab.id
                  ? 'bg-amber-800 text-white dark:bg-blue-600 shadow-[0_0_15px_rgba(180,100,50,0.3)] dark:shadow-[0_0_15px_rgba(59,130,246,0.35)] border border-amber-900/30 dark:border-blue-400/30'
                  : tab.id === "installed" && installedCount > 0
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-[#f0ebe1] dark:bg-white/5 text-stone-700 dark:text-slate-300 hover:bg-[#e4ddce] dark:hover:bg-white/10 border border-[#ded3c4] dark:border-white/10'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col xl:flex-row gap-3 mb-4 w-full">
          <div className="flex-grow relative flex gap-2 w-full xl:max-w-2xl">
            <input 
              type="text" 
              placeholder={hostPlatform === 'linux'
                ? "Search 10,500+ tools by name, category, or Linux package name..."
                : "Search 10,500+ tools by name, category, or Winget ID..."} 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-[#fbf8f3] dark:bg-[#090b10] border border-[#dcd2c4] dark:border-white/15 rounded-xl px-4 py-2 text-stone-900 dark:text-white text-xs placeholder-stone-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-700 dark:focus:border-blue-500 transition-colors"
            />
            {isSearchingLive && (
              <div className="absolute right-3 top-2.5">
                <div className="w-3.5 h-3.5 border-2 border-amber-700 dark:border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {hostPlatform === 'windows' && (
            <button
              onClick={handleLiveSearch}
              disabled={isSearchingLive || !search.trim()}
              className="px-3.5 py-2 rounded-xl bg-amber-800/20 text-amber-900 dark:bg-blue-600/20 dark:text-blue-300 border border-amber-800/30 dark:border-blue-500/30 hover:bg-amber-800/30 dark:hover:bg-blue-600/30 font-semibold transition-all disabled:opacity-50 text-xs whitespace-nowrap flex items-center gap-1.5"
            >
              {isSearchingLive ? "Searching..." : "Cloud Search"}
            </button>
            )}
          </div>
          
          <div className="flex gap-2 w-full xl:w-auto">
            <select 
              className="flex-grow xl:w-48 bg-[#fbf8f3] dark:bg-black/30 border border-[#dcd2c4] dark:border-white/10 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-700 dark:focus:border-blue-500 cursor-pointer min-w-0"
              value={filterDept || ""}
              onChange={(e) => { setFilterDept(e.target.value || null); setFilterRole(null); setPage(1); }}
            >
              <option value="" className="bg-[#fbf8f3] dark:bg-[#090b10]">All Categories</option>
              {catalog.departments.map(d => <option key={d} value={d} className="bg-[#fbf8f3] dark:bg-[#090b10]">{d}</option>)}
            </select>

            <select 
              className="flex-grow xl:w-56 bg-[#fbf8f3] dark:bg-black/30 border border-[#dcd2c4] dark:border-white/10 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-700 dark:focus:border-blue-500 cursor-pointer min-w-0"
              value={filterRole || ""}
              onChange={(e) => { setFilterRole(e.target.value || null); setPage(1); }}
            >
              <option value="" className="bg-[#fbf8f3] dark:bg-[#090b10]">All Roles</option>
              {catalog.roles.map(r => <option key={r} value={r} className="bg-[#fbf8f3] dark:bg-[#090b10]">{r}</option>)}
            </select>
          </div>
        </div>

        {/* Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 flex-grow overflow-y-auto pr-2 custom-scrollbar pb-6">
          {paginatedTools.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center text-stone-500 dark:text-slate-400 py-16 text-xs font-mono">
              <span className="text-2xl mb-2">🔍</span>
              {filterType === "installed" ? "No installed tools detected matching this query." : "No tools found matching your criteria."}
            </div>
          ) : (
            paginatedTools.map(tool => {
              const installed = isToolInstalled(tool);
              return (
                <div 
                  key={tool.id} 
                  className={`relative group border ${
                    installed 
                      ? 'border-emerald-500/40 bg-emerald-500/[0.04] hover:border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.08)]' 
                      : selectedTools.includes(tool.wingetId) 
                      ? 'border-amber-700 bg-amber-500/10 dark:border-blue-500 dark:bg-blue-500/10 shadow-[0_0_15px_rgba(180,100,50,0.15)] dark:shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                      : 'border-[#ebe3d5] dark:border-white/10 bg-[#fbf8f3] dark:bg-white/[0.02] hover:border-amber-700/30 dark:hover:border-white/20 hover:bg-[#f6f0e4] dark:hover:bg-white/[0.04]'
                  } rounded-2xl p-4.5 transition-all flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-start gap-3 mb-2.5 cursor-pointer" onClick={() => !installed && toggleTool(tool.id, tool.wingetId)}>
                      <img src={tool.icon} alt={tool.name} className="w-9 h-9 rounded-xl object-cover border border-[#ded3c4] dark:border-white/10 shrink-0" />
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-stone-900 dark:text-white leading-tight truncate">{tool.name}</h3>
                          {installed && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                              ✓ Installed
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-amber-800 dark:text-blue-400 font-mono mt-0.5 truncate">{tool.department} • {tool.role}</p>
                      </div>
                      
                      {!installed && (
                        <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${selectedTools.includes(tool.wingetId) ? 'border-amber-800 bg-amber-800 dark:border-blue-500 dark:bg-blue-500 text-white' : 'border-[#dcd2c4] dark:border-white/20 bg-white dark:bg-black/40'}`}>
                          {selectedTools.includes(tool.wingetId) && (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Clean Unified Pill Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                      {tool.eligibility === "web_app" ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30">
                          Web App
                        </span>
                      ) : tool.eligibility === "vendor_direct" ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/30">
                          Vendor Direct
                        </span>
                      ) : tool.eligibility === "linux_vm" ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 dark:bg-blue-500/10 text-amber-800 dark:text-blue-400 border border-amber-500/30 dark:border-blue-500/30">
                          Linux / VM
                        </span>
                      ) : hostPlatform === 'linux' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-500/30">
                          🐧 Linux Native
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                          ⚡ Windows 1-Click
                        </span>
                      )}
                      {tool.source && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#f0ebe1] dark:bg-white/5 text-stone-600 dark:text-slate-400 border border-[#ded3c4] dark:border-white/10">
                          {tool.source}
                        </span>
                      )}
                    </div>

                    <p className="text-stone-600 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">{tool.description}</p>
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t border-[#ebe3d5] dark:border-white/5">
                    {installed ? (
                      <button
                        onClick={() => handleLaunchApp(tool)}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>🚀</span> Launch App
                      </button>
                    ) : (tool.eligibility === "web_app" || tool.eligibility === "vendor_direct") && tool.vendorUrl ? (
                      <button 
                        onClick={() => openUrl(tool.vendorUrl!)}
                        className="flex-1 py-1.5 rounded-lg bg-[#f0ebe1] hover:bg-[#e4ddce] border border-[#ded3c4] text-stone-800 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-slate-300 dark:hover:text-white transition-colors text-[11px] font-semibold flex items-center justify-center gap-1"
                      >
                        Open Link
                      </button>
                    ) : null}

                    <button 
                      onClick={() => openAiGuide(tool)}
                      className="flex-1 py-1.5 rounded-lg bg-amber-800/10 hover:bg-amber-800/20 border border-amber-800/30 text-amber-900 dark:bg-blue-600/10 dark:hover:bg-blue-600/20 dark:border-blue-500/30 dark:text-blue-300 transition-colors text-[11px] font-semibold flex items-center justify-center gap-1"
                    >
                      Quick Guide
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-6 border-t border-black/10 dark:border-white/10 mt-4">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 bg-white/5 border border-black/10 dark:border-white/10 rounded-lg disabled:opacity-50 hover:bg-white/10"
            >
              Previous
            </button>
            <span className="text-gray-400 font-mono">Page {page} of {totalPages}</span>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 bg-white/5 border border-black/10 dark:border-white/10 rounded-lg disabled:opacity-50 hover:bg-white/10"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {activeTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f0f13] border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-600"></div>
            
            <div className="p-6 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <img src={activeTool.icon} alt={activeTool.name} className="w-10 h-10 rounded-lg" />
                <div>
                  <h3 className="text-xl font-bold">{activeTool.name}</h3>
                  <p className="text-xs text-gray-400">{activeTool.wingetId}</p>
                </div>
              </div>
              <button onClick={() => setActiveTool(null)} className="text-gray-400 hover:text-slate-900 dark:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-8 min-h-[300px]">
              {!aiGuide ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-purple-400 space-y-4">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="animate-pulse">Generating real-time AI usage guide...</p>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  {aiGuide.split('\n').map((line, i) => {
                    if (line.startsWith('###')) return <h3 key={i} className="text-cyan-400 text-xl font-bold mb-4">{line.replace('### ', '')}</h3>;
                    if (line.startsWith('*Generated')) return <p key={i} className="text-gray-500 text-xs italic mt-8 text-center">{line}</p>;
                    if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) return <p key={i} className="mb-2 text-gray-300" dangerouslySetInnerHTML={{__html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 dark:text-white">$1</strong>').replace(/`(.*?)`/g, '<code class="text-cyan-300 bg-cyan-900/30 px-1 rounded">$1</code>')}}></p>;
                    return <p key={i} className="mb-4 text-gray-300">{line}</p>;
                  })}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-black/10 dark:border-white/10 bg-white/5 flex justify-end">
              <button 
                onClick={() => { toggleTool(activeTool.id, activeTool.wingetId); setActiveTool(null); }}
                className="px-6 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 font-bold transition-colors"
              >
                {selectedTools.includes(activeTool.wingetId) ? "Remove from Install Queue" : "Add to Install Queue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
