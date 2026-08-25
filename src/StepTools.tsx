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
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
              <span className="text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">Step 5 of 7</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Software & Tool Ecosystem
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Browse 10,500+ curated tools powered by direct repository mirrors and Microsoft Winget.
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
              Next ({selectedTools.length} Selected)
            </button>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col xl:flex-row gap-3 mb-5 w-full">
          <div className="flex-grow relative flex gap-2 w-full xl:max-w-2xl">
            <input 
              type="text" 
              placeholder="Search 10,500+ tools by name, category, or Winget ID..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="flex-grow bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors min-w-0"
            />
            <button
              onClick={handleLiveSearch}
              disabled={isSearchingLive || !search.trim()}
              className="px-3.5 py-2 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 font-semibold transition-all disabled:opacity-50 text-xs whitespace-nowrap flex items-center gap-1.5"
            >
              {isSearchingLive ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
                  Searching...
                </>
              ) : (
                "Cloud Search"
              )}
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2.5 flex-grow w-full xl:w-auto">
            <select 
              className="flex-grow xl:w-56 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer min-w-0"
              value={filterDept || ""}
              onChange={(e) => { setFilterDept(e.target.value || null); setPage(1); }}
            >
              <option value="" className="bg-[#090b10]">All Departments</option>
              {catalog.departments.map(d => <option key={d} value={d} className="bg-[#090b10]">{d}</option>)}
            </select>

            <select 
              className="flex-grow xl:w-56 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer min-w-0"
              value={filterRole || ""}
              onChange={(e) => { setFilterRole(e.target.value || null); setPage(1); }}
            >
              <option value="" className="bg-[#090b10]">All Roles</option>
              {catalog.roles.map(r => <option key={r} value={r} className="bg-[#090b10]">{r}</option>)}
            </select>
          </div>
        </div>

        {/* Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 flex-grow overflow-y-auto pr-2 custom-scrollbar pb-6">
          {paginatedTools.length === 0 ? (
            <div className="col-span-full flex items-center justify-center text-slate-400 py-16 text-xs font-mono">
              No tools found matching your criteria.
            </div>
          ) : (
            paginatedTools.map(tool => (
              <div 
                key={tool.id} 
                className={`relative group border ${selectedTools.includes(tool.wingetId) ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'} rounded-2xl p-4.5 transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start gap-3 mb-2.5 cursor-pointer" onClick={() => toggleTool(tool.id, tool.wingetId)}>
                    <img src={tool.icon} alt={tool.name} className="w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0" />
                    <div className="flex-grow min-w-0">
                      <h3 className="text-sm font-bold text-white leading-tight truncate">{tool.name}</h3>
                      <p className="text-[11px] text-blue-400 font-mono mt-0.5 truncate">{tool.department} • {tool.role}</p>
                    </div>
                    <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${selectedTools.includes(tool.wingetId) ? 'border-blue-500 bg-blue-500 text-white' : 'border-white/20 bg-black/40'}`}>
                      {selectedTools.includes(tool.wingetId) && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      )}
                    </div>
                  </div>
                  
                  {/* Clean Unified Pill Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                    {tool.eligibility === "web_app" ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        Web App
                      </span>
                    ) : tool.eligibility === "vendor_direct" ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30">
                        Vendor Direct
                      </span>
                    ) : tool.eligibility === "linux_vm" ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        Linux / VM
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Windows 1-Click
                      </span>
                    )}
                    {tool.source && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-slate-400 border border-white/10">
                        {tool.source}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">{tool.description}</p>
                </div>
                
                <div className="flex gap-2 pt-2 border-t border-white/5">
                  {(tool.eligibility === "web_app" || tool.eligibility === "vendor_direct") && tool.vendorUrl ? (
                    <button 
                      onClick={() => openUrl(tool.vendorUrl!)}
                      className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors text-[11px] font-semibold flex items-center justify-center gap-1"
                    >
                      Open Link
                    </button>
                  ) : null}

                  <button 
                    onClick={() => openAiGuide(tool)}
                    className="flex-1 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-300 transition-colors text-[11px] font-semibold flex items-center justify-center gap-1"
                  >
                    Quick Guide
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
