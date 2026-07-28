export default function StepWelcome({ onNext }: { onNext: () => void }) {
  const isAdmin = true; // TODO: Check actual admin status

  return (
    <div className="w-full h-full flex flex-col items-center mt-10">
      <div className="glass-card max-w-[800px] p-10 w-full animate-[fadeIn_0.5s_ease-out]">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
          <span className="text-blue-500 text-sm font-bold uppercase tracking-widest">OSwitch Setup</span>
        </div>
        <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Welcome to the future of<br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">OS Management.</span>
        </h1>
        <p className="text-xl text-slate-400 mb-8 max-w-2xl">
          Install and switch operating systems natively with a single click. No manual commands, no complex setups.
        </p>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 flex flex-col">
          <div className="flex items-center gap-3 text-lg font-semibold mb-2">
            {isAdmin ? (
              <>
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-white">System Access Granted</span>
              </>
            ) : (
              <>
                <span className="text-red-500 text-xl">!</span>
                <span className="text-red-400">Administrator Privileges Required</span>
              </>
            )}
          </div>
          <p className="text-slate-400">
            {isAdmin 
              ? 'You are ready to install new operating systems.' 
              : 'Please reopen OSwitch as an Administrator to proceed.'}
          </p>
        </div>

        <div className="flex justify-start">
          <button 
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center gap-3"
            onClick={onNext}
          >
            Get Started <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
