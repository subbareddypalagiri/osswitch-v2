import { useState } from 'react';
import Logo from './Logo';
import { Sparkles, Layers, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Onboarding({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "Welcome to OSwitch",
      description: "The next-generation desktop platform to provision operating systems, configure dual-boot environments, and deploy automated developer suites.",
      icon: Sparkles,
      tag: "Next-Gen Platform"
    },
    {
      title: "One-Click Software Suites",
      description: "Instant access to curated toolkits for Developers, Penetration Testers, Creators, and Enterprise Sysadmins powered by automated package engines.",
      icon: Layers,
      tag: "Ecosystem Ready"
    },
    {
      title: "Zero-Risk Partition Isolation",
      description: "Non-destructive safe slicing with automated BCD/UEFI bootloader checks. Your existing Windows and recovery partitions remain 100% untouched.",
      icon: ShieldCheck,
      tag: "Enterprise Safety"
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  const CurrentIcon = slides[step].icon;

  return (
    <div className="fixed inset-0 bg-[#090b10] flex flex-col items-center justify-center z-40 animate-[fadeIn_0.4s_ease-out]">
      <div className="bg-[#111522]/95 border border-white/10 rounded-3xl max-w-[760px] w-full p-12 flex flex-col items-center relative overflow-hidden text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        {/* Small Logo Header */}
        <div className="w-12 h-12 mb-6 z-10">
          <Logo className="w-full h-full" />
        </div>

        {/* Apple-Style Vector Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6 z-10 shadow-[0_4px_15px_rgba(59,130,246,0.15)]">
          <CurrentIcon className="w-8 h-8 stroke-[1.75]" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[11px] font-mono font-semibold tracking-wider uppercase mb-3 z-10">
          {slides[step].tag}
        </div>

        {/* High-Contrast Brilliant White Title */}
        <h2 className="text-3xl font-extrabold text-white mb-3 z-10 tracking-tight transition-all duration-300">
          {slides[step].title}
        </h2>
        
        {/* High-Contrast Slate-300 Description */}
        <p className="text-base text-slate-300 max-w-[560px] leading-relaxed mb-10 z-10 transition-all duration-300 min-h-[72px]">
          {slides[step].description}
        </p>

        {/* Pagination Dots */}
        <div className="flex gap-2.5 mb-10 z-10">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'
              }`}
            ></div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center w-full z-10 pt-4 border-t border-white/5">
          <button 
            onClick={onFinish}
            className="text-slate-400 hover:text-white text-sm font-semibold px-4 py-2.5 transition-colors"
          >
            Skip Intro
          </button>
          
          <button 
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-7 rounded-xl shadow-[0_4px_15px_rgba(59,130,246,0.35)] transition-all flex items-center gap-2 text-sm"
          >
            {step === slides.length - 1 ? "Launch OSwitch" : "Continue"} 
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
