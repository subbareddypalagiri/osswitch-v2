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
