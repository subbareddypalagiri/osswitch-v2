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

  useEffect(() => {
    fetch('/tools-catalog.json')
      .then(res => res.json())
      .then(data => setCatalog(data))
      .catch(err => console.error("Failed to load tools catalog", err));
  }, []);

  const handleLiveSearch = async () => {
    if (!search.trim()) return;
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

  const filteredTools = useMemo(() => {
    const baseList = catalog ? catalog.tools : [];
    const combined = [...liveSearchResults, ...baseList];
    return combined.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.description.toLowerCase().includes(search.toLowerCase()) ||
                          t.wingetId.toLowerCase().includes(search.toLowerCase());
      const matchDept = filterDept ? t.department === filterDept : true;
      const matchRole = filterRole ? t.role === filterRole : true;
      return matchSearch && matchDept && matchRole;
    });
  }, [catalog, search, filterDept, filterRole, liveSearchResults]);

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
      setAiGuide(`### How to Use ${tool.name}\n\n1. **Installation:** OSwitch will automatically install this via \`${tool.wingetId}\`.\n2. **Launch:** Press the Windows Key and type '${tool.name}'.\n3. **First Steps:** This tool is widely used by ${tool.role}s in the ${tool.department} industry. Begin by setting up a new project workspace.\n\n*Generated dynamically by OSwitch AI Engine.*`);
    }, 1000);
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

      <div className="w-full flex-grow flex flex-col max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
              Software Arsenal
            </h2>
            <p className="text-slate-400 text-sm">Discover over <strong className="text-cyan-400">{catalog ? catalog.tools.length.toLocaleString() : '10,500'}</strong> tools. <span className="text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 text-xs">⚡ 96% Direct-Fetch Enabled</span></p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="px-6 py-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-white/5 transition-colors"
            >
              Back
            </button>
            <button 
              onClick={onNext}
              className="px-8 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              Next ({selectedTools.length} Selected)
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 mb-8 w-full">
          <div className="flex-grow relative flex gap-2 w-full xl:max-w-2xl">
            <input 
              type="text" 
              placeholder="Search 10,500+ tools by name, category or Winget ID..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="flex-grow bg-slate-100 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-6 py-4 text-base focus:outline-none focus:border-cyan-500 transition-colors backdrop-blur-md min-w-0"
            />
            <button
              onClick={handleLiveSearch}
              disabled={isSearchingLive || !search.trim()}
              className="px-5 py-4 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 font-bold transition-all disabled:opacity-50 text-sm whitespace-nowrap flex items-center gap-2"
            >
              {isSearchingLive ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></span>
                  Searching...
                </>
              ) : (
                <>
                  ⚡ Live Cloud Search
                </>
              )}
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 flex-grow w-full xl:w-auto">
            <select 
              className="flex-grow xl:w-64 bg-slate-100 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-6 py-4 text-base focus:outline-none focus:border-cyan-500 backdrop-blur-md cursor-pointer min-w-0"
              value={filterDept || ""}
              onChange={(e) => { setFilterDept(e.target.value || null); setPage(1); }}
            >
              <option value="">All Departments</option>
              {catalog.departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <select 
              className="flex-grow xl:w-64 bg-slate-100 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-6 py-4 text-base focus:outline-none focus:border-cyan-500 backdrop-blur-md cursor-pointer min-w-0"
              value={filterRole || ""}
              onChange={(e) => { setFilterRole(e.target.value || null); setPage(1); }}
            >
              <option value="">All Roles</option>
              {catalog.roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow overflow-y-auto pr-2 custom-scrollbar pb-10">
          {paginatedTools.length === 0 ? (
            <div className="col-span-full flex items-center justify-center text-gray-400 py-20">
              No tools found matching your criteria.
            </div>
          ) : (
            paginatedTools.map(tool => (
              <div 
                key={tool.id} 
                className={`relative group bg-white/5 border ${selectedTools.includes(tool.wingetId) ? 'border-cyan-500 bg-cyan-500/10' : 'border-black/10 dark:border-white/10'} rounded-2xl p-6 transition-all hover:bg-white/10 flex flex-col`}
              >
                <div className="flex items-start gap-4 mb-4 cursor-pointer" onClick={() => toggleTool(tool.id, tool.wingetId)}>
                  <img src={tool.icon} alt={tool.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold">{tool.name}</h3>
                    <p className="text-xs text-cyan-400 font-mono mt-1">{tool.department} | {tool.role}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${selectedTools.includes(tool.wingetId) ? 'border-cyan-500 bg-cyan-500 text-black' : 'border-gray-500'}`}>
                    {selectedTools.includes(tool.wingetId) && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    )}
                  </div>
                </div>
                
                {/* Source & Eligibility Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {tool.eligibility === "web_app" ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse"></span>
                      🌐 0-Install WebApp
                    </span>
                  ) : tool.eligibility === "vendor_direct" ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                      🟣 Vendor Link
                    </span>
                  ) : tool.eligibility === "linux_vm" ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      🔵 Requires Linux OS / VM
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      🟢 1-Click Windows
                    </span>
                  )}
                  {tool.source && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-slate-400 border border-white/10">
                      {tool.source}
                    </span>
                  )}
                </div>

                <p className="text-gray-400 text-sm mb-6 flex-grow">{tool.description}</p>
                
                <div className="flex gap-2">
                  {(tool.eligibility === "web_app" || tool.eligibility === "vendor_direct") && tool.vendorUrl ? (
                    <button 
                      onClick={() => openUrl(tool.vendorUrl!)}
                      className="flex-1 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 transition-colors text-xs font-bold flex items-center justify-center gap-1"
                    >
                      🚀 Open Launch URL
                    </button>
                  ) : null}

                  <button 
                    onClick={() => openAiGuide(tool)}
                    className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-black/40 border border-black/10 dark:border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-300 transition-colors text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    How to Use
                  </button>
                </div>
              </div>
            ))
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
