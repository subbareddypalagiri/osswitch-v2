import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export interface BootEntry {
  id: string;
  name: string;
}

export default function StepBootSwitch({ onBack }: { onBack: () => void }) {
  const [entries, setEntries] = useState<BootEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: BootEntry[] = await invoke("get_boot_menu");
      setEntries(data);
      if (data.length > 0) setSelectedId(data[0].id);
    } catch (e: any) {
      setError(e?.toString() || "Failed to load boot menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleSetDefault = async () => {
    if (!selectedId) return;
    try {
      setSaving(true);
      setSaved(false);
      await invoke("set_default_boot", { identifier: selectedId });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e?.toString() || "Failed to set default boot entry");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center mt-10">
      <div className="glass-card max-w-[800px] p-10 w-full animate-[fadeIn_0.5s_ease-out] flex flex-col h-[700px]">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_rgba(147,51,234,0.5)]"></span>
          <span className="text-purple-500 text-sm font-bold uppercase tracking-widest">Boot Manager</span>
        </div>

        <h2 className="text-[32px] font-bold text-white tracking-tight mb-2">
          Boot <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Switcher</span>
        </h2>
        <p className="text-slate-400 mb-8">
          Select which operating system to boot into on your next restart.
        </p>

        {error && (
          <div role="alert" className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-red-400">
            <strong>Error:</strong> {error}
            <button className="ml-4 underline text-red-300 hover:text-white" onClick={fetchEntries}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-slate-400">Reading boot entries from BCD...</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <span className="text-4xl mb-4 block">📭</span>
            <p className="text-slate-400">No boot entries found. Install an OS first to see entries here.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-8 overflow-y-auto custom-scrollbar flex-grow content-start pr-2">
            {entries.map((entry, i) => (
              <div
                key={entry.id}
                onClick={() => setSelectedId(entry.id)}
                className={`bg-white/5 border rounded-2xl p-5 cursor-pointer transition-all flex items-center gap-4
                  ${selectedId === entry.id
                    ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(147,51,234,0.2)]'
                    : 'border-white/10 hover:bg-white/10'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0
                  ${selectedId === entry.id ? 'border-purple-500 bg-purple-500' : 'border-slate-500'}`}>
                  {selectedId === entry.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-lg truncate">{entry.name}</div>
                  <div className="text-slate-400 text-xs font-mono mt-1 opacity-50">{entry.id}</div>
                </div>
                {i === 0 && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-medium shrink-0">Current Default</span>
                )}
              </div>
            ))}
          </div>
        )}

        {saved && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 text-green-400 text-center animate-[fadeIn_0.3s_ease-out]">
            ✅ Default boot entry updated! Changes take effect on next restart.
          </div>
        )}

        <div className="flex justify-between gap-4 mt-auto">
          <button
            className="bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 border border-white/10"
            onClick={onBack}
          >
            <span>←</span> Back
          </button>
          <button
            className={`font-semibold py-3 px-8 rounded-xl transition-all flex items-center gap-2
              ${selectedId && !saving
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]'
                : 'bg-white/10 text-slate-500 cursor-not-allowed'}`}
            onClick={handleSetDefault}
            disabled={!selectedId || saving}
          >
            {saving ? "Applying..." : "Set as Default Boot"} <span>⚡</span>
          </button>
        </div>
      </div>
    </div>
  );
}
