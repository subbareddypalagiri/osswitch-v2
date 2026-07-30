import { useState, useEffect } from "react";
import StepWelcome from "./StepWelcome";
import StepScan from "./StepScan";
import StepChooseOS from "./StepChooseOS";
import StepConfigure from "./StepConfigure";
import StepBundles from "./StepBundles";
import StepTools from "./StepTools";
import StepInstall from "./StepInstall";
import StepBootSwitch from "./StepBootSwitch";
import SplashScreen from "./SplashScreen";
import Onboarding from "./Onboarding";
import { OS_CATALOG } from "./constants";
import "./App.css";

// 🌐 Cloud Catalog URL — auto-updated weekly by GitHub Actions
const CLOUD_CATALOG_URL = "https://raw.githubusercontent.com/subbareddypalagiri/oswitch-v2/master/catalog.json";


const NAV_SECTIONS = [
  {
    title: "GENERAL",
    items: [
      { index: 0, label: "Welcome", icon: "🏠" },
      { index: 1, label: "System Scan", icon: "🔍" }
    ]
  },
  {
    title: "OS MANAGEMENT",
    items: [
      { index: 2, label: "Install OS", icon: "💿" },
      { index: 5, label: "Boot Switcher", icon: "🔄" }
    ]
  },
  {
    title: "APP STORE",
    items: [
      { index: 3, label: "Software Bundles", icon: "📦" },
      { index: 4, label: "Infinite Store", icon: "🌌" }
    ]
  },
  {
    title: "EXECUTION",
    items: [
      { index: 6, label: "Permissions", icon: "🛡️" },
      { index: 7, label: "Run Console", icon: "🚀" }
    ]
  }
];

const STEPS = [
  "Welcome",
  "System Scan",
  "Choose OS",
  "Software Bundles",
  "Infinite Store",
  "Boot Switcher",
  "Permissions",
  "Run Console"
];

function App() {
  const [viewState, setViewState] = useState<"splash" | "onboarding" | "app">("splash");
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOS, setSelectedOS] = useState<string[]>([]);
  const [selectedIntents, setSelectedIntents] = useState<Record<string, string>>({});
  const [selectedBundles, setSelectedBundles] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [backupEnabled, setBackupEnabled] = useState(true);
  const [perms, setPerms] = useState<boolean[]>([false, false, false, false]);
  const [catalog, setCatalog] = useState(OS_CATALOG);
  const [isInstalling, setIsInstalling] = useState(false);

  // 🌐 Fetch fresh ISO URLs from GitHub cloud catalog on startup
  useEffect(() => {
    fetch(CLOUD_CATALOG_URL)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((cloudData) => {
        if (!cloudData || typeof cloudData !== "object" || Array.isArray(cloudData)) return;
        setCatalog(prev => {
            const currentIds = new Set(prev.map(e => e.id));
            const newEntries: any[] = [];
            for (const key in cloudData) {
                const normalizedId = key.replace("_", "-");
                if (!currentIds.has(normalizedId) && !currentIds.has(key)) {
                    newEntries.push({
                        id: normalizedId,
                        name: cloudData[key].name || "Unknown OS",
                        category: cloudData[key].category || "Other",
                        isoUrl: cloudData[key].isoUrl || ""
                    });
                }
            }
            return [...prev.map(entry => {
          const normalizedId = entry.id.replace("-", "_");
            const cloud = cloudData[normalizedId] || cloudData[entry.id];
          if (cloud && typeof cloud === "object") {
            return {
              ...entry,
              isoUrl: (typeof cloud.isoUrl === "string" && cloud.isoUrl.trim() !== "") ? cloud.isoUrl : entry.isoUrl,
              officialSite: typeof cloud.officialSite === "string" ? cloud.officialSite : entry.officialSite
            };
          }
          return entry;
            }), ...newEntries];
        });
        console.log("✅ [OSwitch] Cloud catalog loaded — ISO URLs are fresh!");
      })
      .catch(() => {
        console.warn("⚠️ [OSwitch] Cloud catalog unavailable — using local fallback URLs.");
      });
  }, []);

  const goNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(prev => prev + 1);
  };

  const isStepCompleted = (index: number) => {
    // In Dashboard mode, we only show green ticks for steps that have queued items
    if (index === 2) return selectedOS.length > 0; // Choose OS
    if (index === 3) return selectedBundles.length > 0; // Bundles
    if (index === 4) return selectedTools.length > 0; // Infinite Store
    return false; // Other tabs always show their icon
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (viewState === "splash") {
    return <SplashScreen onFinish={() => setViewState("onboarding")} />;
  }

  if (viewState === "onboarding") {
    return <Onboarding onFinish={() => setViewState("app")} />;
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-[#05050A]">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="flex w-full h-full">
        {/* Sidebar */}
        <aside className="w-[280px] shrink-0 h-full flex flex-col border-r border-white/10 glass-panel bg-gradient-to-b from-[#0F142333] to-[#05050ACC] py-8 px-5">
          <div className="font-['Poppins'] text-[26px] font-extrabold flex items-center gap-2.5 mb-10 tracking-tight">
            <span className="text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,1)]">⚡</span>
            <span>OSwitch</span>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-6">
            {NAV_SECTIONS.map((section, sIdx) => (
              <div key={sIdx}>
                <div className="text-xs font-bold text-slate-500 mb-3 tracking-widest pl-4">
                  {section.title}
                </div>
                <ul className="list-none space-y-1">
                  {section.items.map((item) => {
                    const isActive = currentStep === item.index;
                    const isCompleted = isStepCompleted(item.index);
                    
                    return (
                      <li 
                        key={item.index}
                        className={`px-4 py-2.5 rounded-xl flex items-center gap-3 font-medium transition-all
                          ${isActive ? 'bg-blue-500/15 text-blue-500 border-l-4 border-blue-500 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]' : 
                            isInstalling ? 'text-slate-500 cursor-not-allowed opacity-50' : 'text-slate-300 hover:bg-white/5 hover:text-white cursor-pointer'}`}
                        onClick={() => !isInstalling && setCurrentStep(item.index)}
                      >
                        <div className={`text-lg transition-transform ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'opacity-70'}`}>
                          {isCompleted && !isActive ? <span className="text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]">✓</span> : item.icon}
                        </div>
                        <span className="text-sm">{item.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow flex flex-col h-full min-h-0 relative">
          <div className="pt-6 pb-6 px-14 flex-grow min-h-0 custom-scrollbar overflow-y-auto">
            {currentStep === 0 && <StepWelcome onNext={goNext} />}
            {currentStep === 1 && (
              <StepScan onNext={goNext} onBack={goBack} />
            )}
            {currentStep === 2 && (
              <StepChooseOS 
                onNext={goNext} 
                onBack={goBack} 
                selectedOS={selectedOS} 
                setSelectedOS={setSelectedOS}
                selectedIntents={selectedIntents}
                setSelectedIntents={setSelectedIntents}
                catalog={catalog}
              />
            )}
            {currentStep === 3 && (
              <StepBundles 
                onNext={goNext} 
                onBack={goBack} 
                selectedBundles={selectedBundles} 
                setSelectedBundles={setSelectedBundles} 
              />
            )}
            {currentStep === 4 && (
              <StepTools 
                onNext={goNext} 
                onBack={goBack} 
                selectedTools={selectedTools} 
                setSelectedTools={setSelectedTools} 
              />
            )}
            {currentStep === 5 && (
              <StepBootSwitch onBack={goBack} onNext={goNext} />
            )}
            {currentStep === 6 && (
              <StepConfigure 
                onNext={goNext} 
                onBack={goBack} 
                backupEnabled={backupEnabled}
                setBackupEnabled={setBackupEnabled}
                perms={perms}
                setPerms={setPerms}
              />
            )}
            {currentStep === 7 && (
              <StepInstall 
                onNext={goNext} 
                onBack={goBack}
                selectedOS={selectedOS}
                selectedIntents={selectedIntents}
                selectedBundles={selectedBundles}
                selectedTools={selectedTools}
                backupEnabled={backupEnabled}
                catalog={catalog}
                isInstalling={isInstalling}
                setIsInstalling={setIsInstalling}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
