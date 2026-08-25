const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="appleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Outer infinity/circle shape */}
      <path 
        d="M20,50 C20,33.4 33.4,20 50,20 C66.6,20 80,33.4 80,50 C80,66.6 66.6,80 50,80 C33.4,80 20,66.6 20,50 Z" 
        stroke="url(#appleGradient)" 
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        filter="url(#glow)"
      />
      
      {/* Sleek Lightning Bolt crossing the O */}
      <path 
        d="M58,25 L38,55 L50,55 L42,75 L62,45 L50,45 Z" 
        fill="url(#appleGradient)"
        filter="url(#glow)"
      />
    </svg>
  );
};

export default Logo;

export const OSLogo = ({ id, className = "", size = 32 }: { id: string; className?: string; size?: number }) => {
  const normId = id.toLowerCase().replace(/[^a-z0-9]/g, "");

  // 1. Windows (Fluent 4-Pane)
  if (normId.includes("win")) {
    return (
      <svg width={size} height={size} viewBox="0 0 88 88" fill="none" className={className}>
        <path d="M0 12.4L35.6 7.5V41.6H0V12.4Z" fill="#0078D4" />
        <path d="M39.6 6.9L87.8 0V41.6H39.6V6.9Z" fill="#0078D4" />
        <path d="M0 46.4H35.6V80.5L0 75.6V46.4Z" fill="#0078D4" />
        <path d="M39.6 46.4H87.8V88L39.6 81.1V46.4Z" fill="#0078D4" />
      </svg>
    );
  }

  // 2. Ubuntu (Circle of Friends)
  if (normId.includes("ubuntu")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <circle cx="50" cy="50" r="48" fill="#E95420" />
        <circle cx="50" cy="50" r="32" stroke="white" strokeWidth="9" />
        <circle cx="21" cy="50" r="7.5" fill="#E95420" stroke="white" strokeWidth="4" />
        <circle cx="64.5" cy="25" r="7.5" fill="#E95420" stroke="white" strokeWidth="4" />
        <circle cx="64.5" cy="75" r="7.5" fill="#E95420" stroke="white" strokeWidth="4" />
      </svg>
    );
  }

  // 3. Kali Linux (Offensive Dragon)
  if (normId.includes("kali")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#0D1117" stroke="#3875D7" strokeWidth="3" />
        <path d="M25 65C30 50 45 42 60 40C68 38 75 30 78 22C72 32 60 35 52 36C40 38 32 45 28 55C24 65 20 72 15 78C20 75 25 72 25 65Z" fill="#3875D7" />
        <path d="M48 45C55 52 65 58 75 60C82 62 88 60 90 55C82 58 74 55 68 50C60 45 54 42 48 45Z" fill="#5599FF" />
        <circle cx="75" cy="28" r="3" fill="#55FFCC" />
      </svg>
    );
  }

  // 4. BlackArch Linux (Hacker Planet/Arch)
  if (normId.includes("blackarch")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#050505" stroke="#E11D48" strokeWidth="3" />
        <path d="M50 18L78 78L62 78L50 52L38 78L22 78L50 18Z" fill="#E11D48" />
        <circle cx="50" cy="40" r="5" fill="#FFFFFF" />
        <path d="M35 68L50 58L65 68" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // 5. Arch Linux
  if (normId === "arch" || normId.includes("archlinux")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <path d="M50 12L88 84L70 84L50 48L30 84L12 84L50 12Z" fill="#1793D1" />
        <path d="M42 66L50 50L58 66L42 66Z" fill="#0D1117" />
      </svg>
    );
  }

  // 6. Fedora / Kinoite / Silverblue
  if (normId.includes("fedora") || normId.includes("kinoite") || normId.includes("silverblue")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#294172" />
        <path d="M50 24C35.6 24 24 35.6 24 50C24 64.4 35.6 76 50 76C55.4 76 60.5 74.3 64.6 71.5L56 63C54.2 63.6 52.1 64 50 64C42.3 64 36 57.7 36 50C36 42.3 42.3 36 50 36C57.7 36 64 42.3 64 50V56H76V50C76 35.6 64.4 24 50 24Z" fill="#51A2DA" />
        <path d="M50 36H66V46H50V36Z" fill="#FFFFFF" />
      </svg>
    );
  }

  // 7. Pop!_OS
  if (normId.includes("pop")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#48B9C7" />
        <circle cx="36" cy="48" r="14" fill="#F8C43D" />
        <rect x="52" y="34" width="24" height="28" rx="6" fill="#FFFFFF" />
        <circle cx="64" cy="48" r="6" fill="#48B9C7" />
      </svg>
    );
  }

  // 8. Debian
  if (normId.includes("debian")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#A80030" />
        <path d="M50 22C34.5 22 22 34.5 22 50C22 65.5 34.5 78 50 78C62 78 72 70.5 76 60C72 64 64 66 56 64C46 61.5 40 54 42 45C44 36 52 32 60 34C68 36 72 44 70 50C68 56 62 58 56 56" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // 9. Linux Mint
  if (normId.includes("mint")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#87CF3E" />
        <path d="M30 35V65H42V45H50V65H62V45H70V65" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 10. openSUSE
  if (normId.includes("suse") || normId.includes("opensuse")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#73BA25" />
        <path d="M30 55C30 40 45 32 60 32C72 32 80 40 76 52C72 64 58 68 45 68C36 68 30 64 30 55Z" fill="white" />
        <circle cx="62" cy="44" r="4" fill="#73BA25" />
      </svg>
    );
  }

  // 11. Manjaro
  if (normId.includes("manjaro")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#35BF5C" />
        <rect x="24" y="24" width="16" height="52" rx="3" fill="white" />
        <rect x="44" y="40" width="16" height="36" rx="3" fill="white" />
        <rect x="64" y="24" width="16" height="52" rx="3" fill="white" />
        <rect x="44" y="24" width="16" height="12" rx="3" fill="white" />
      </svg>
    );
  }

  // 12. Apple macOS
  if (normId.includes("mac") || normId.includes("apple") || normId.includes("darwin") || normId.includes("asahi")) {
    return (
      <svg width={size} height={size} viewBox="0 0 170 170" fill="none" className={className}>
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.77-7.94-12.23-14.58-6.17-9.28-11.02-20.08-14.54-32.39-3.52-12.31-5.28-24.16-5.28-35.54 0-14.28 3.52-26.06 10.56-35.34 7.04-9.28 16.03-14.05 26.96-14.31 4.79 0 10.36 1.34 16.71 4.02 6.35 2.68 10.02 4.08 11.02 4.19 1.23-.23 5.3-1.68 12.21-4.35 6.91-2.68 12.87-3.8 17.88-3.35 13.53 1.12 24.13 6.47 31.8 16.05-11.96 7.26-17.77 17.2-17.43 29.82.34 9.94 4.15 18.23 11.45 24.87 7.3 6.65 15.82 10.45 25.56 11.4-2.23 6.81-4.8 13.35-7.72 19.63zM119.22 33.72c0-7.37 2.62-14.23 7.86-20.59 5.24-6.36 11.66-10.44 19.27-12.23 1.12 7.71-.87 14.88-5.97 21.52-5.1 6.64-11.43 10.82-19.01 12.54-.45-.45-1.12-.84-2.15-1.24z" fill="currentColor" />
      </svg>
    );
  }

  // 13. Tails
  if (normId.includes("tails")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#56347C" />
        <path d="M30 65C30 45 45 35 65 35C75 35 70 50 55 50C40 50 35 65 30 65Z" fill="#69C042" />
        <circle cx="50" cy="50" r="6" fill="white" />
      </svg>
    );
  }

  // 14. Alpine Linux
  if (normId.includes("alpine")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#0D597F" />
        <path d="M22 72L50 28L64 50L78 72H22Z" fill="white" />
        <path d="M50 28L57 39L43 61L36 72H22L50 28Z" fill="#0D597F" />
      </svg>
    );
  }

  // 15. NixOS
  if (normId.includes("nix")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#1E293B" />
        <path d="M50 18L58 34H42L50 18Z" fill="#5277C3" />
        <path d="M78 34L70 50L62 34H78Z" fill="#7EBAE4" />
        <path d="M78 66L62 66L70 50L78 66Z" fill="#5277C3" />
        <path d="M50 82L42 66H58L50 82Z" fill="#7EBAE4" />
        <path d="M22 66L30 50L38 66H22Z" fill="#5277C3" />
        <path d="M22 34L38 34L30 50L22 34Z" fill="#7EBAE4" />
      </svg>
    );
  }

  // 16. FreeBSD / GhostBSD / HardenedBSD
  if (normId.includes("bsd")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#AB1818" />
        <circle cx="50" cy="54" r="24" fill="white" />
        <path d="M36 34C36 34 38 22 46 26C46 26 44 34 36 34Z" fill="white" />
        <path d="M64 34C64 34 62 22 54 26C54 26 56 34 64 34Z" fill="white" />
        <circle cx="42" cy="52" r="4" fill="#AB1818" />
        <circle cx="58" cy="52" r="4" fill="#AB1818" />
      </svg>
    );
  }

  // 17. ChromeOS
  if (normId.includes("chrome")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <circle cx="50" cy="50" r="46" fill="#4285F4" />
        <path d="M50 24L86 46L68 76H32L14 46L50 24Z" fill="#EA4335" />
        <circle cx="50" cy="50" r="18" fill="#34A853" stroke="white" strokeWidth="6" />
      </svg>
    );
  }

  // 18. Rocky Linux
  if (normId.includes("rocky")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#10B981" />
        <path d="M25 75L50 25L75 75H25Z" fill="white" />
        <path d="M50 25L60 48L40 75H25L50 25Z" fill="#047857" />
      </svg>
    );
  }

  // 19. AlmaLinux
  if (normId.includes("alma")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#0284C7" />
        <circle cx="50" cy="50" r="28" stroke="white" strokeWidth="8" strokeDasharray="18 10" fill="none" />
        <circle cx="50" cy="50" r="10" fill="#38BDF8" />
      </svg>
    );
  }

  // 20. CentOS / RHEL
  if (normId.includes("centos") || normId.includes("rhel") || normId.includes("redhat")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#9333EA" />
        <path d="M50 20L76 35V65L50 80L24 65V35L50 20Z" fill="none" stroke="white" strokeWidth="6" />
        <path d="M50 20V80" stroke="#F59E0B" strokeWidth="4" />
        <path d="M24 35L76 65" stroke="#10B981" strokeWidth="4" />
        <path d="M24 65L76 35" stroke="#EF4444" strokeWidth="4" />
      </svg>
    );
  }

  // 21. Garuda Linux
  if (normId.includes("garuda")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#0F172A" stroke="#EC4899" strokeWidth="3" />
        <path d="M50 20C65 35 75 55 50 80C25 55 35 35 50 20Z" fill="url(#garudaGrad)" />
        <circle cx="50" cy="45" r="6" fill="#FFFFFF" />
        <defs>
          <linearGradient id="garudaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 22. Bazzite Gaming
  if (normId.includes("bazzite")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#18181B" stroke="#F97316" strokeWidth="3" />
        <rect x="25" y="35" width="50" height="30" rx="10" fill="#F97316" />
        <circle cx="38" cy="50" r="4" fill="white" />
        <circle cx="62" cy="45" r="3" fill="white" />
        <circle cx="68" cy="52" r="3" fill="white" />
      </svg>
    );
  }

  // 23. Zorin OS
  if (normId.includes("zorin")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#0EA5E9" />
        <path d="M28 32H72L42 68H72" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }

  // 24. Solus
  if (normId.includes("solus")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
        <path d="M48 22V65L68 65C68 45 58 30 48 22Z" fill="#38BDF8" />
        <path d="M30 65C35 75 65 75 70 65H30Z" fill="#F43F5E" />
      </svg>
    );
  }

  // 25. Void Linux
  if (normId.includes("void")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#1E293B" />
        <circle cx="50" cy="50" r="26" stroke="#10B981" strokeWidth="8" fill="none" />
        <circle cx="50" cy="50" r="10" fill="#34D399" />
      </svg>
    );
  }

  // 26. Proxmox
  if (normId.includes("proxmox")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#EA580C" />
        <path d="M25 50L50 25L75 50L50 75L25 50Z" fill="white" />
        <circle cx="50" cy="50" r="8" fill="#EA580C" />
      </svg>
    );
  }

  // 27. TrueNAS
  if (normId.includes("truenas")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#0891B2" />
        <circle cx="35" cy="50" r="10" fill="white" />
        <circle cx="65" cy="35" r="10" fill="white" />
        <circle cx="65" cy="65" r="10" fill="white" />
        <path d="M35 50L65 35M35 50L65 65" stroke="white" strokeWidth="6" />
      </svg>
    );
  }

  // 28. Haiku OS
  if (normId.includes("haiku")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#F59E0B" />
        <path d="M50 20C40 40 30 50 30 65C30 75 40 80 50 80C60 80 70 75 70 65C70 50 60 40 50 20Z" fill="white" />
        <path d="M50 30V75" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  // 29. ReactOS
  if (normId.includes("react")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#3B82F6" />
        <ellipse cx="50" cy="50" rx="26" ry="10" stroke="white" strokeWidth="4" transform="rotate(30 50 50)" fill="none" />
        <ellipse cx="50" cy="50" rx="26" ry="10" stroke="white" strokeWidth="4" transform="rotate(90 50 50)" fill="none" />
        <ellipse cx="50" cy="50" rx="26" ry="10" stroke="white" strokeWidth="4" transform="rotate(150 50 50)" fill="none" />
        <circle cx="50" cy="50" r="6" fill="#FACC15" />
      </svg>
    );
  }

  // 30. FreeDOS
  if (normId.includes("freedos") || normId.includes("dos")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#1D4ED8" />
        <text x="50" y="62" fill="white" fontSize="28" fontWeight="bold" fontFamily="monospace" textAnchor="middle">DOS</text>
      </svg>
    );
  }

  // 31. EndeavourOS
  if (normId.includes("endeavour")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#4F46E5" />
        <path d="M50 20L75 75L50 62L25 75L50 20Z" fill="#EC4899" />
        <path d="M50 35L65 70L50 62L35 70L50 35Z" fill="#F43F5E" />
      </svg>
    );
  }

  // 32. Clonezilla / GParted / Recovery Tools
  if (normId.includes("clone") || normId.includes("gparted") || normId.includes("rescue")) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <rect width="100" height="100" rx="22" fill="#DC2626" />
        <rect x="42" y="24" width="16" height="52" rx="4" fill="white" />
        <rect x="24" y="42" width="52" height="16" rx="4" fill="white" />
      </svg>
    );
  }

  // Dynamic Apple-Grade Deterministic Color Gradient Pill for all other OSes
  const charSum = normId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = charSum % 360;
  const hue2 = (hue1 + 45) % 360;
  const firstLetters = id.slice(0, 2).toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${hue1}, 75%, 50%), hsl(${hue2}, 85%, 40%))`
      }}
      className={`rounded-2xl flex items-center justify-center font-extrabold text-[11px] shadow-[0_4px_12px_rgba(0,0,0,0.3)] border border-white/25 text-white tracking-wider select-none ${className}`}
    >
      {firstLetters}
    </div>
  );
};
