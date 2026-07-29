import { useState } from 'react';
import logo from './assets/logo.jpg';

export default function Onboarding({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "Welcome to OSwitch",
      description: "The ultimate tool to effortlessly switch operating systems and install software bundles. Your multi-boot environment is now in your control.",
      icon: "👋"
    },
    {
      title: "One-Click Bundles",
      description: "Install full suites of software tailored for Developers, Creators, Gamers, and more with a single click. Powered by Winget.",
      icon: "📦"
    },
    {
      title: "Safe & Secure",
      description: "OSwitch carefully checks your boot sectors (BCD) and intelligently sets the default OS, keeping your partitions perfectly intact.",
      icon: "🛡️"
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#070b14] flex flex-col items-center justify-center z-40 animate-[fadeIn_0.5s_ease-out]">
      <div className="glass-card max-w-[800px] w-full p-12 flex flex-col items-center relative overflow-hidden text-center">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full"></div>

        <img src={logo} alt="OSwitch" className="w-16 h-16 rounded-2xl mb-8 shadow-lg z-10" />

        <div className="text-6xl mb-6 z-10">{slides[step].icon}</div>
        <h2 className="text-4xl font-bold text-white mb-4 z-10 transition-all duration-300">
          {slides[step].title}
        </h2>
        <p className="text-lg text-slate-400 max-w-[600px] leading-relaxed mb-12 z-10 transition-all duration-300 min-h-[80px]">
          {slides[step].description}
        </p>

        <div className="flex gap-3 mb-12 z-10">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-10 bg-blue-500' : 'w-2 bg-slate-700'
              }`}
            ></div>
          ))}
        </div>

        <div className="flex justify-between w-full z-10">
          <button 
            onClick={onFinish}
            className="text-slate-500 hover:text-slate-300 font-medium px-6 py-3 transition-colors"
          >
            Skip Tour
          </button>
          
          <button 
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-10 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center gap-2"
          >
            {step === slides.length - 1 ? "Get Started" : "Continue"} <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
