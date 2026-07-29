import { useState, useEffect } from "react";
import StepWelcome from "./StepWelcome";
import StepScan from "./StepScan";
import StepChooseOS from "./StepChooseOS";
import StepConfigure from "./StepConfigure";
import StepBundles from "./StepBundles";
import StepInstall from "./StepInstall";
import StepBootSwitch from "./StepBootSwitch";
import SplashScreen from "./SplashScreen";
import Onboarding from "./Onboarding";
import { OS_CATALOG } from "./constants";
import "./App.css";

// 🌐 Cloud Catalog URL — auto-updated weekly by GitHub Actions
const CLOUD_CATALOG_URL = "https://raw.githubusercontent.com/subbareddypalagiri/oswitch-v2/master/catalog.json";

const STEPS = [
  "Welcome",
  "System Scan",
  "Choose OS",
  "Permissions",
  "Boot Switcher",
  "Run Console",
  "Software Bundles"
];

function App() {
  const [viewState, setViewState] = useState<"splash" | "onboarding" | "app">("splash");
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOS, setSelectedOS] = useState<string[]>([]);
  const [selectedIntents, setSelectedIntents] = useState<Record<string, string>>({});
  const [selectedBundles, setSelectedBundles] = useState<string[]>([]);
  const [backupEnabled, setBackupEnabled] = useState(false);
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
    if (index === 0) return true; // Welcome
    if (index === 1) return true; // Scan
    if (index === 2) return selectedOS.length > 0; // Choose OS
    if (index === 3) return true; // Permissions
    if (index === 4) return true; // Boot Switcher
    if (index === 5) return false; // Run Console
    if (index === 6) return selectedBundles.length > 0; // Bundles
    return false;
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

          <ul className="list-none flex-grow space-y-2">
            {STEPS.map((step, index) => {
              const isActive = currentStep === index;
              const isCompleted = isStepCompleted(index);
              
              return (
                <li 
                  key={index}
                  className={`px-4 py-3 rounded-xl flex items-center gap-3 font-medium transition-all
                    ${isActive ? 'bg-blue-500/15 text-blue-500 border-l-4 border-blue-500' : 
                      isInstalling ? 'text-slate-500 cursor-not-allowed opacity-50' : 'text-slate-300 hover:bg-white/5 cursor-pointer'}`}
                  onClick={() => !isInstalling && setCurrentStep(index)}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs 
                    ${isActive ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 
                      isCompleted ? 'bg-green-500 text-white' : 'bg-white/5'}`}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  {step}
                </li>
              );
            })}
          </ul>
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
              <StepConfigure 
                onNext={goNext} 
                onBack={goBack} 
                backupEnabled={backupEnabled}
                setBackupEnabled={setBackupEnabled}
                perms={perms}
                setPerms={setPerms}
              />
            )}
            {currentStep === 4 && (
              <StepBootSwitch onBack={goBack} />
            )}
            {currentStep === 5 && (
              <StepInstall 
                onNext={goNext} 
                onBack={goBack}
                selectedOS={selectedOS}
                selectedIntents={selectedIntents}
                selectedBundles={selectedBundles}
                backupEnabled={backupEnabled}
                catalog={catalog}
                isInstalling={isInstalling}
                setIsInstalling={setIsInstalling}
              />
            )}
            {currentStep === 6 && (
              <StepBundles 
                onNext={goNext} 
                onBack={goBack} 
                selectedBundles={selectedBundles} 
                setSelectedBundles={setSelectedBundles} 
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
