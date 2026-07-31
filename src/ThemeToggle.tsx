import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("oswitch-theme") as Theme;
    if (saved) {
      setTheme(saved);
      applyTheme(saved);
    } else {
      applyTheme("dark"); // Default to dark instead of system initially for OSwitch
    }
  }, []);

  const applyTheme = (t: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (t === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(t);
    }
    localStorage.setItem("oswitch-theme", t);
  };

  const handleThemeChange = (t: Theme) => {
    setTheme(t);
    applyTheme(t);
  };

  const tabs = [
    { id: "light", icon: Sun },
    { id: "system", icon: Monitor },
    { id: "dark", icon: Moon },
  ] as const;

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-black/10 dark:border-white/10 p-0.5 rounded-full shadow-lg transition-colors">
      {tabs.map((tab) => {
        const isActive = theme === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => handleThemeChange(tab.id)}
            className={`relative flex items-center justify-center w-7 h-7 rounded-full transition-colors z-10 ${
              isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="theme-bubble"
                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon size={14} className="relative z-20" />
          </button>
        );
      })}
    </div>
  );
}
