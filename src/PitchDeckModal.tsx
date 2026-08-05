import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Presentation, Award, Rocket, CheckCircle2, ShieldAlert, Cpu, Users, DollarSign, Target } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    title: "OSwitch",
    subtitle: "The Ultimate Zero-Touch OS Installer & Dev Environment Provisioner",
    icon: Rocket,
    tag: "Incubator Pitch Deck",
    bullets: [
      "1-Click Dual-Boot & Hypervisor Automation",
      "Automated Developer Environment Provisioning (10,590+ Tools)",
      "Zero-Touch Motherboard EFI & VHD Orchestration Engine"
    ]
  },
  {
    id: 2,
    title: "The Core Problem",
    subtitle: "OS Installation & Developer Setup is Dangerous, Slow, and Broken",
    icon: ShieldAlert,
    tag: "Market Friction",
    bullets: [
      "Manual Dual-Booting wiping C: drives due to partition errors",
      "Hours wasted downloading Rufus, flashing ISOs, and adjusting BIOS",
      "Installing Linux leaves developers with a blank OS and 20+ missing packages"
    ]
  },
  {
    id: 3,
    title: "The Solution: OSwitch",
    subtitle: "End-to-End Zero-Touch OS & Toolchain Automation Platform",
    icon: CheckCircle2,
    tag: "Product Vision",
    bullets: [
      "Select OS → Pick Method (Baremetal / VM) → Pick Tools → 1-Click Go",
      "10,590+ Real Software Tools pre-indexed across 32 engineering departments",
      "Walk away and return to a fully installed, fully configured Developer Workstation"
    ]
  },
  {
    id: 4,
    title: "Deep Tech & Architecture",
    subtitle: "Engineered in Rust & Proprietary Hypervisor Injection Engine",
    icon: Cpu,
    tag: "Under The Hood",
    bullets: [
      "Blazing-fast memory-safe Rust backend (`engine.rs`) with Stdio telemetry streaming",
      "Proprietary Dual-VHD & EFI Script Injector (`auto-install.sh`) for unattended setup",
      "Live Cloud Search API querying 14,000+ packages dynamically in <0.5s"
    ]
  },
  {
    id: 5,
    title: "Target Market & Audience",
    subtitle: "Reaching Millions of Students, Engineers, and Enterprise IT Depts",
    icon: Users,
    tag: "Market Opportunity",
    bullets: [
      "B2C: CS/ECE/EEE Students needing Linux labs + Senior Software Developers",
      "B2B: University Computer Labs needing 1-click 100+ machine re-provisioning",
      "Enterprise IT: Onboarding new hires with pre-configured dev laptops"
    ]
  },
  {
    id: 6,
    title: "Monetization & Business Model",
    subtitle: "High-Margin SaaS + Enterprise Campus Site Licenses",
    icon: DollarSign,
    tag: "Revenue Streams",
    bullets: [
      "Freemium B2C: Core installer free for rapid student adoption",
      "OSwitch PRO ($15 / ₹999): Hypervisor automation, custom bundles & AI Auto-Fix",
      "University Campus License ($500 / ₹40,000/yr): Multi-seat lab provisioning"
    ]
  },
  {
    id: 7,
    title: "Competitive Moat",
    subtitle: "Why We Beat Rufus, BalenaEtcher, and Manual Setup",
    icon: Target,
    tag: "Unfair Advantage",
    bullets: [
      "Rufus / Etcher ONLY flash USBs — OSwitch handles partitioning, OS setup & tool installs",
      "0-Install WebApp Integration + Dynamic Winget Cloud Registry",
      "First true end-to-end Zero-Touch Workstation Creator"
    ]
  },
  {
    id: 8,
    title: "Traction & Rollout Strategy",
    subtitle: "Validation Across College CSE Departments & Incubators",
    icon: Award,
    tag: "Go-To-Market",
    bullets: [
      "MVP fully developed with 10,590+ real software packages in Infinite Store",
      "Initial campus beta deployment across 500+ student laptops",
      "Organic viral loop via watermarked 'Installed by OSwitch' desktop environment"
    ]
  },
  {
    id: 9,
    title: "The Incubator Ask",
    subtitle: "Partnering with V-Hub to Scale to 100,000 Active Developers",
    icon: Rocket,
    tag: "Funding & Growth",
    bullets: [
      "Mentorship from veteran SaaS founders & IT infrastructure leaders",
      "Cloud credits (AWS/Azure) for high-speed ISO download mirrors",
      "Seed Grant (₹2L - ₹5L) for early marketing, server infrastructure & IP filing"
    ]
  },
  {
    id: 10,
    title: "Thank You!",
    subtitle: "Let's Make OS Management & Developer Workstations 1-Click Simple",
    icon: Presentation,
    tag: "Q&A Session",
    bullets: [
      "OSwitch — Universal Operating Platform",
      "Founder & CEO: Subba Reddy Palagiri",
      "Ready to demo live in the OSwitch App Store & Console!"
    ]
  }
];

export default function PitchDeckModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slide = SLIDES[currentSlide];
  const Icon = slide.icon;

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) setCurrentSlide(prev => prev + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(prev => prev - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out] p-6">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col justify-between min-h-[550px] overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header bar */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase">
              {slide.tag}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Slide {currentSlide + 1} of {SLIDES.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Slide Content */}
        <div className="my-8 z-10 flex-grow flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg">
                  <Icon size={32} />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{slide.title}</h2>
                  <p className="text-slate-400 text-base mt-1">{slide.subtitle}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {slide.bullets.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                    <span className="text-slate-200 text-base leading-relaxed font-medium">{b}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between z-10 pt-4 border-t border-white/10">
          <div className="flex gap-1.5">
            {SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${idx === currentSlide ? "w-8 bg-cyan-400" : "w-2 bg-white/20 hover:bg-white/40"}`}
              ></button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all disabled:opacity-30 flex items-center gap-1"
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <button
              onClick={nextSlide}
              disabled={currentSlide === SLIDES.length - 1}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-30 flex items-center gap-1"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
