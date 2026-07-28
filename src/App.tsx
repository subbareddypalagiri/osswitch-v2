import { useState } from "react";
import StepWelcome from "./StepWelcome";
import StepScan from "./StepScan";
import StepChooseOS from "./StepChooseOS";
import StepConfigure from "./StepConfigure";
import StepBundles from "./StepBundles";
import StepInstall from "./StepInstall";
import "./App.css";

const STEPS = [
  "Welcome",
  "System Scan",
  "Choose OS",
  "Software Bundles",
  "Permissions",
  "Run Console"
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOS, setSelectedOS] = useState<string[]>([]);
  const [selectedIntents, setSelectedIntents] = useState<Record<string, string>>({});
  const [selectedBundles, setSelectedBundles] = useState<string[]>([]);
  const [backupEnabled, setBackupEnabled] = useState(false);

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-[#05050A]">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="flex w-full h-full">
        {/* Sidebar */}
        <aside className="w-[280px] h-full flex flex-col border-r border-white/10 glass-panel bg-gradient-to-b from-[#0F142333] to-[#05050ACC] py-8 px-5">
          <div className="font-['Poppins'] text-[26px] font-extrabold flex items-center gap-2.5 mb-10 tracking-tight">
            <span className="text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,1)]">⚡</span>
            <span>OSwitch</span>
          </div>

          <ul className="list-none flex-grow space-y-2">
            {STEPS.map((step, index) => {
              const isActive = currentStep === index;
              const isPast = currentStep > index;
              
              return (
                <li 
                  key={index}
                  className={`px-4 py-3 rounded-xl cursor-pointer flex items-center gap-3 font-medium transition-all
                    ${isActive ? 'bg-blue-500/15 text-blue-500 border-l-4 border-blue-500' : 
                      isPast ? 'text-slate-300 hover:bg-white/5' : 'text-slate-500 cursor-not-allowed'}`}
                  onClick={() => isPast && setCurrentStep(index)}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs 
                    ${isActive ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 
                      isPast ? 'bg-green-500 text-white' : 'bg-white/5'}`}
                  >
                    {isPast ? '✓' : index + 1}
                  </div>
                  {step}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-grow flex flex-col h-full relative">
          <div className="pt-10 px-14 flex-grow custom-scrollbar overflow-y-auto">
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
              <StepConfigure 
                onNext={goNext} 
                onBack={goBack} 
                backupEnabled={backupEnabled}
                setBackupEnabled={setBackupEnabled}
              />
            )}
            {currentStep === 5 && (
              <StepInstall 
                onNext={goNext} 
                onBack={goBack}
                selectedOS={selectedOS}
                selectedIntents={selectedIntents}
                selectedBundles={selectedBundles}
                backupEnabled={backupEnabled}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
