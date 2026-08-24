import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, Search, Disc, HardDrive, Package, Infinity as InfinityIcon, 
  Power, ShieldCheck, TerminalSquare, Cpu
} from "lucide-react";
import StepWelcome from "./StepWelcome";
import StepScan from "./StepScan";
import StepChooseOS from "./StepChooseOS";
import StepManageOS from "./StepManageOS";
import StepDiskSpace from "./StepDiskSpace";
import StepConfigure from "./StepConfigure";
import StepBundles from "./StepBundles";
import StepTools from "./StepTools";
import StepInstall from "./StepInstall";
import StepBootSwitch from "./StepBootSwitch";
import SplashScreen from "./SplashScreen";
import Onboarding from "./Onboarding";
import { OS_CATALOG } from "./constants";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import "./App.css";

// 🌐 Cloud Catalog URL
const CLOUD_CATALOG_URL = "https://raw.githubusercontent.com/subbareddypalagiri/osswitch-v2/master/catalog.json";

const NAV_SECTIONS = [
  {
    title: "GENERAL",
    items: [
      { index: 0, label: "Welcome", icon: Home },
      { index: 1, label: "System Scan", icon: Search }
    ]
  },
  {
    title: "OS MANAGEMENT",
    items: [
      { index: 2, label: "Install OS", icon: Disc },
      { index: 9, label: "Manage OS", icon: Cpu },
      { index: 3, label: "Disk Partition", icon: HardDrive },
      { index: 6, label: "Boot Switcher", icon: Power }
    ]
  },
  {
    title: "APP STORE",
    items: [
      { index: 4, label: "Software Bundles", icon: Package },
      { index: 5, label: "Infinite Store", icon: InfinityIcon }
    ]
  },
  {
    title: "EXECUTION",
    items: [
      { index: 7, label: "Permissions", icon: ShieldCheck },
      { index: 8, label: "Run Console", icon: TerminalSquare }
    ]
  }
];

const STEPS = [
  "Welcome",
  "System Scan",
  "Choose OS",
  "Disk Partition",
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
  const [osSpace, setOsSpace] = useState(100);
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [hostName, setHostName] = useState("");
  
  // 0ms Latency Local Caching Engine
  const [catalog, setCatalog] = useState(() => {
    try {
      localStorage.removeItem("oswitch_catalog_cache");
    } catch (e) {}
    return OS_CATALOG;
  });
  
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Silently check edge CDN in the background
    fetch(CLOUD_CATALOG_URL, { cache: "no-store" })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((cloudData) => {
        if (!cloudData || typeof cloudData !== "object" || Array.isArray(cloudData)) return;
        
        // Save to local physical cache for instant loading next time
        localStorage.setItem("oswitch_catalog_cache", JSON.stringify(cloudData));
        
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
        console.log("✅ [OSwitch] Cloud Edge CDN catalog synced to Local Cache.");
      })
      .catch(() => console.warn("⚠️ [OSwitch] Edge CDN unavailable, relying on Local Cache."));
  }, []);

  const goNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(prev => prev + 1);
  };

  const isStepCompleted = (index: number) => {
    if (index === 2) return selectedOS.length > 0;
    if (index === 3) return selectedOS.length > 0; // Disk Partition completed if OS selected
    if (index === 4) return selectedBundles.length > 0;
    if (index === 5) return selectedTools.length > 0;
    return false; 
  };

  const goBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (viewState === "splash") {
    return <SplashScreen onFinish={() => setViewState("onboarding")} />;
  }

  if (viewState === "onboarding") {
    return <Onboarding onFinish={() => setViewState("app")} />;
  }

  // Content for the active step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return <StepWelcome onNext={goNext} />;
      case 1: return <StepScan onNext={goNext} onBack={goBack} />;
      case 2: return <StepChooseOS 
                onNext={goNext} onBack={goBack} 
                selectedOS={selectedOS} setSelectedOS={setSelectedOS}
                selectedIntents={selectedIntents} setSelectedIntents={setSelectedIntents}
                catalog={catalog} />;
      case 3: return <StepDiskSpace
                onNext={goNext} onBack={goBack}
                selectedOS={selectedOS} 
                osSpace={osSpace} setOsSpace={setOsSpace} />;
      case 4: return <StepBundles 
                onNext={goNext} onBack={goBack} 
                selectedBundles={selectedBundles} setSelectedBundles={setSelectedBundles} />;
      case 5: return <StepTools 
                onNext={goNext} onBack={goBack} 
                selectedTools={selectedTools} setSelectedTools={setSelectedTools} />;
      case 6: return <StepBootSwitch onBack={goBack} onNext={goNext} />;
      case 7: return <StepConfigure 
                onNext={goNext} onBack={goBack} 
                backupEnabled={backupEnabled} setBackupEnabled={setBackupEnabled}
                perms={perms} setPerms={setPerms}
                userName={userName} setUserName={setUserName}
                userPassword={userPassword} setUserPassword={setUserPassword}
                hostName={hostName} setHostName={setHostName} />;
      case 8: return <StepInstall 
                onNext={goNext} onBack={goBack}
                selectedOS={selectedOS} selectedIntents={selectedIntents}
                selectedBundles={selectedBundles} selectedTools={selectedTools}
                osSpace={osSpace}
                backupEnabled={backupEnabled} catalog={catalog}
                isInstalling={isInstalling} setIsInstalling={setIsInstalling}
                userName={userName} userPassword={userPassword} hostName={hostName} />;
      case 9: return <StepManageOS onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(2)} />;
      default: return null;
    }
  };

  return (
    <>
      <ThemeToggle />

      <div className="mesh-bg">
        <div className="mesh-blob mesh-blob-1"></div>
        <div className="mesh-blob mesh-blob-2"></div>
        <div className="mesh-blob mesh-blob-3"></div>
      </div>

      <div className="flex w-full h-full text-slate-900 dark:text-[#f5f5f7]">
        {/* Apple-Tier Sidebar */}
        <aside className="w-[260px] shrink-0 h-full flex flex-col border-r border-black/5 dark:border-white/5 bg-white/50 dark:bg-[#141419]/50 backdrop-blur-3xl pt-10 pb-6 px-4">
          <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer transition-opacity hover:opacity-80">
            <Logo className="w-8 h-8" />
            <span className="font-semibold text-xl tracking-tight">OSwitch</span>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar pr-1 space-y-6">
            {NAV_SECTIONS.map((section, sIdx) => (
              <div key={sIdx}>
                <div className="text-[10px] font-bold text-slate-500 dark:text-[#86868b] mb-2 tracking-wider pl-3 uppercase">
                  {section.title}
                </div>
                <ul className="list-none space-y-1">
                  {section.items.map((item) => {
                    const isActive = currentStep === item.index;
                    const isCompleted = isStepCompleted(item.index);
                    const Icon = item.icon;
                    
                    return (
                      <li 
                        key={item.index}
                        onClick={() => !isInstalling && setCurrentStep(item.index)}
                        className={`
                          px-3 py-2 rounded-lg flex items-center gap-3 text-[13px] font-medium transition-all duration-200 cursor-pointer
                          ${isActive 
                            ? 'bg-[#007aff]/15 text-[#007aff] shadow-[inset_0_0_0_1px_rgba(0,122,255,0.2)]' 
                            : isInstalling 
                              ? 'text-slate-500 dark:text-[#86868b] cursor-not-allowed opacity-50' 
                              : 'text-[#a1a1a6] hover:bg-white/5 hover:text-slate-900 dark:text-white'}
                        `}
                      >
                        <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                          <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className={isCompleted && !isActive ? "text-[#34c759]" : ""} />
                        </div>
                        <span>{item.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area with Framer Motion Transitions */}
        <main className="flex-grow flex flex-col h-full min-h-0 relative">
          <div className="pt-8 pb-8 px-16 flex-grow min-h-0 custom-scrollbar overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                className="h-full"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
