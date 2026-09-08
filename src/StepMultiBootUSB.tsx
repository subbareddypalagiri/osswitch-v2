import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn, Event } from "@tauri-apps/api/event";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { 
  Usb, HardDrive, Plus, Trash2, RefreshCw, CheckCircle2, AlertTriangle, 
  FolderDown, Disc, Check, Loader2, Sparkles
} from "lucide-react";

interface UsbDrive {
  name: string;
  device_id: string;
  size_gb: number;
  drive_letter: string;
  is_bootable: boolean;
}

interface UsbIsoItem {
  filename: string;
  size_mb: number;
  os_id: string;
  display_name: string;
  boot_category: string;
}

interface MultiBootStatus {
  is_multiboot: boolean;
  drive_letter: string;
  label: string;
  total_space_gb: number;
  free_space_gb: number;
  isos: UsbIsoItem[];
}

interface MultiBootProgressEvent {
  percent: number;
  bytes_copied: number;
  total_bytes: number;
  speed_mbps: number;
  status: string;
}

interface StepMultiBootUSBProps {
  catalog?: any[];
}

export default function StepMultiBootUSB({ catalog = [] }: StepMultiBootUSBProps) {
  const [drives, setDrives] = useState<UsbDrive[]>([]);
  const [selectedDriveLetter, setSelectedDriveLetter] = useState<string>("");
  const [status, setStatus] = useState<MultiBootStatus | null>(null);
  const [loadingDrives, setLoadingDrives] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copyProgress, setCopyProgress] = useState<MultiBootProgressEvent | null>(null);
  const [formatModalOpen, setFormatModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Add ISO modal/form state
  const [addIsoModalOpen, setAddIsoModalOpen] = useState(false);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");
  const [manualIsoPath, setManualIsoPath] = useState<string>("");
  const [manualIsoName, setManualIsoName] = useState<string>("");

  // Fetch connected USB drives
  const fetchDrives = useCallback(async () => {
    try {
      setLoadingDrives(true);
      setErrorMessage(null);
      const res = await invoke<UsbDrive[]>("get_connected_usb_drives");
      setDrives(res);
      if (res.length > 0) {
        // If current selection is invalid or empty, pick the first drive with a letter
        const valid = res.find(d => d.drive_letter && d.drive_letter !== "Unknown");
        if (valid && (!selectedDriveLetter || !res.some(d => d.drive_letter === selectedDriveLetter))) {
          setSelectedDriveLetter(valid.drive_letter);
        }
      } else {
        setSelectedDriveLetter("");
        setStatus(null);
      }
    } catch (e: any) {
      console.error("Failed to query USB drives:", e);
      setErrorMessage(e.toString());
    } finally {
      setLoadingDrives(false);
    }
  }, [selectedDriveLetter]);

  // Fetch MultiBoot status for selected drive
  const fetchStatus = useCallback(async (driveLetter: string) => {
    if (!driveLetter) {
      setStatus(null);
      return;
    }
    try {
      setLoadingStatus(true);
      setErrorMessage(null);
      const res = await invoke<MultiBootStatus>("get_multiboot_usb_status", { driveLetter });
      setStatus(res);
    } catch (e: any) {
      console.error("Failed to query MultiBoot status:", e);
      setErrorMessage(e.toString());
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    fetchDrives();
  }, []);

  useEffect(() => {
    if (selectedDriveLetter) {
      fetchStatus(selectedDriveLetter);
    }
  }, [selectedDriveLetter, fetchStatus]);

  // Setup event listener for copy progress
  useEffect(() => {
    let unlisten: UnlistenFn | null = null;
    let isMounted = true;

    listen<MultiBootProgressEvent>("multiboot-progress", (event: Event<MultiBootProgressEvent>) => {
      if (isMounted) {
        setCopyProgress(event.payload);
      }
    }).then(fn => {
      if (isMounted) unlisten = fn;
      else fn();
    }).catch(console.error);

    return () => {
      isMounted = false;
      if (unlisten) unlisten();
    };
  }, []);

  // Format USB as OSwitch MultiBoot Drive
  const handleFormatDrive = async () => {
    if (!selectedDriveLetter) return;
    try {
      setIsFormatting(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      setFormatModalOpen(false);

      const msg = await invoke<string>("format_and_initialize_multiboot_usb", {
        driveLetter: selectedDriveLetter,
        driveLabel: "OSWITCH_DATA"
      });

      setSuccessMessage(msg);
      await fetchDrives();
      await fetchStatus(selectedDriveLetter);
    } catch (e: any) {
      console.error("Formatting failed:", e);
      setErrorMessage(e.toString());
    } finally {
      setIsFormatting(false);
    }
  };

  // Browse local ISO
  const handleBrowseLocalIso = async () => {
    try {
      const selected = await openDialog({
        multiple: false,
        filters: [{
          name: "Disk Image",
          extensions: ["iso", "img"]
        }]
      });

      if (selected && typeof selected === "string") {
        setManualIsoPath(selected);
        // Default name from filename
        const filename = selected.split(/[\\/]/).pop() || "";
        setManualIsoName(filename.replace(/\.(iso|img)$/i, ""));
      }
    } catch (e: any) {
      console.error("File selection error:", e);
    }
  };

  // Copy ISO to MultiBoot USB
  const handleAddIso = async () => {
    if (!selectedDriveLetter || !manualIsoPath) {
      setErrorMessage("Please select a valid ISO file.");
      return;
    }

    try {
      setIsCopying(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      setAddIsoModalOpen(false);

      const osId = selectedCatalogId || "custom-linux";
      const displayName = manualIsoName || manualIsoPath.split(/[\\/]/).pop() || "Custom OS";

      const msg = await invoke<string>("copy_iso_to_multiboot_usb", {
        sourceIsoPath: manualIsoPath,
        targetDriveLetter: selectedDriveLetter,
        osId,
        displayName
      });

      setSuccessMessage(msg);
      setManualIsoPath("");
      setManualIsoName("");
      setSelectedCatalogId("");
      await fetchStatus(selectedDriveLetter);
    } catch (e: any) {
      console.error("ISO copy failed:", e);
      setErrorMessage(e.toString());
    } finally {
      setIsCopying(false);
      setCopyProgress(null);
    }
  };

  // Remove ISO from MultiBoot USB
  const handleRemoveIso = async (filename: string) => {
    if (!selectedDriveLetter) return;
    try {
      setErrorMessage(null);
      const msg = await invoke<string>("remove_iso_from_multiboot_usb", {
        targetDriveLetter: selectedDriveLetter,
        filename
      });
      setSuccessMessage(msg);
      await fetchStatus(selectedDriveLetter);
    } catch (e: any) {
      console.error("Failed to remove ISO:", e);
      setErrorMessage(e.toString());
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center pt-6 pb-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-white/95 dark:bg-[#111522]/95 border border-[#e2d8cc] dark:border-white/10 rounded-3xl max-w-[980px] p-8 w-full flex flex-col shadow-[0_20px_50px_rgba(180,140,100,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/10 dark:bg-blue-600/10 border border-amber-600/20 dark:border-blue-600/20 text-amber-700 dark:text-blue-400 flex items-center justify-center shadow-inner">
              <Usb className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                  Multi-Boot Swiss Army Knife USB Engine
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> God-Mode
                </span>
              </div>
              <p className="text-stone-600 dark:text-slate-400 text-xs">
                Store multiple Linux, Windows, & diagnostic ISOs on a single drive with dynamic GRUB2 loopback bootloader.
              </p>
            </div>
          </div>

          <button
            onClick={fetchDrives}
            disabled={loadingDrives}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-white/10 hover:bg-stone-100 dark:hover:bg-white/5 transition-colors text-stone-600 dark:text-stone-300"
            title="Refresh Connected Drives"
          >
            <RefreshCw className={`w-4 h-4 ${loadingDrives ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-700 dark:text-emerald-400 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Progress Bar (if Copying or Formatting) */}
        {(isCopying || isFormatting) && (
          <div className="mb-6 p-5 bg-[#fbf8f3] dark:bg-white/[0.03] border border-amber-700/20 dark:border-blue-500/20 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white">
                <Loader2 className="w-4 h-4 animate-spin text-amber-700 dark:text-blue-400" />
                <span>
                  {isFormatting 
                    ? "Formatting USB with GPT & Deploying GRUB2 Loopback EFI..." 
                    : copyProgress?.status || "Writing ISO to Multi-Boot USB..."}
                </span>
              </div>
              <span className="font-mono font-bold text-amber-800 dark:text-blue-400">
                {isFormatting ? "Configuring EFI..." : `${(copyProgress?.percent || 0).toFixed(1)}%`}
              </span>
            </div>

            <div className="w-full bg-stone-200 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-600 dark:bg-blue-500 h-full transition-all duration-300 rounded-full"
                style={{ width: isFormatting ? '100%' : `${copyProgress?.percent || 0}%` }}
              />
            </div>

            {copyProgress && (
              <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-slate-400">
                <span>
                  {(copyProgress.bytes_copied / (1024 * 1024)).toFixed(1)} MB / {(copyProgress.total_bytes / (1024 * 1024)).toFixed(1)} MB
                </span>
                <span>
                  Speed: {copyProgress.speed_mbps.toFixed(1)} MB/s
                </span>
              </div>
            )}
          </div>
        )}

        {/* USB Drive Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
              Select Target USB Drive
            </label>
            <span className="text-xs text-stone-400 dark:text-slate-500">
              {drives.length} removable drive(s) detected
            </span>
          </div>

          {drives.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-stone-200 dark:border-white/10 rounded-2xl text-center flex flex-col items-center justify-center space-y-2">
              <Usb className="w-8 h-8 text-stone-400 dark:text-stone-500 mb-1" />
              <p className="text-stone-700 dark:text-stone-300 font-bold text-sm">No USB Flash Drive Detected</p>
              <p className="text-stone-500 dark:text-slate-400 text-xs max-w-sm">
                Connect a USB drive (16 GB or larger recommended) to create or manage your Multi-Boot Swiss Army Knife.
              </p>
              <button
                onClick={fetchDrives}
                className="mt-3 px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/15 rounded-xl text-xs font-semibold text-stone-800 dark:text-white transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Scan Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {drives.map((d, i) => {
                const isSelected = selectedDriveLetter === d.drive_letter;
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedDriveLetter(d.drive_letter)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-amber-600 dark:border-blue-500 bg-amber-500/5 dark:bg-blue-500/10 shadow-sm' 
                        : 'border-stone-200 dark:border-white/10 hover:border-stone-300 dark:hover:border-white/20 bg-[#fbf8f3] dark:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <HardDrive className={`w-4 h-4 ${isSelected ? 'text-amber-700 dark:text-blue-400' : 'text-stone-500'}`} />
                        <span className="font-bold text-xs text-stone-900 dark:text-white">
                          Drive {d.drive_letter}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-200 dark:bg-white/10 text-stone-700 dark:text-stone-300 font-bold">
                        {d.size_gb} GB
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-slate-400 truncate" title={d.name}>
                      {d.name}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Multi-Boot Status Section */}
          {selectedDriveLetter && (
            <div className="mt-6 pt-6 border-t border-stone-200 dark:border-white/10 space-y-6">
              {loadingStatus ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-700 dark:text-blue-400 mb-2" />
                  <span className="text-xs font-mono text-stone-500 dark:text-slate-400">
                    Inspecting Drive {selectedDriveLetter} structure...
                  </span>
                </div>
              ) : status && status.is_multiboot ? (
                /* Drive IS configured as Multi-Boot */
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className="bg-[#fbf8f3] dark:bg-white/[0.02] border border-[#ebe3d5] dark:border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-stone-900 dark:text-white">
                            OSwitch Multi-Boot Master Active
                          </span>
                          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                            exFAT + GPT + EFI Loopback
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-slate-400 font-mono mt-0.5">
                          Drive {status.drive_letter} ({status.label}) • {status.isos.length} Operating System(s) Ready to Boot
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAddIsoModalOpen(true)}
                        disabled={isCopying || isFormatting}
                        className="bg-amber-800 hover:bg-amber-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add OS Image (ISO)
                      </button>

                      <button
                        onClick={() => setFormatModalOpen(true)}
                        disabled={isCopying || isFormatting}
                        className="p-2 border border-stone-200 dark:border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-600 dark:hover:text-red-400 rounded-xl text-xs transition-colors"
                        title="Reformat Multi-Boot USB"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Storage Allocation Bar */}
                  <div className="p-4 bg-[#fbf8f3] dark:bg-white/[0.02] border border-[#ebe3d5] dark:border-white/10 rounded-2xl space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-stone-600 dark:text-slate-400">
                        Total Capacity: {status.total_space_gb.toFixed(1)} GB
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {status.free_space_gb.toFixed(1)} GB Available
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-600 dark:bg-blue-500 h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, Math.max(0, ((status.total_space_gb - status.free_space_gb) / (status.total_space_gb || 1)) * 100))}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Installed ISOs Grid */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-slate-400 flex items-center gap-2">
                        <Disc className="w-4 h-4 text-amber-700 dark:text-blue-400" />
                        Installed Operating Systems ({status.isos.length})
                      </h3>
                      <span className="text-[11px] text-stone-400 dark:text-slate-500">
                        GRUB2 loopback auto-discovery active
                      </span>
                    </div>

                    {status.isos.length === 0 ? (
                      <div className="p-8 border border-stone-200 dark:border-white/10 rounded-2xl text-center flex flex-col items-center justify-center space-y-2">
                        <FolderDown className="w-6 h-6 text-stone-400" />
                        <p className="text-xs font-bold text-stone-700 dark:text-stone-300">
                          No ISOs installed yet on this drive
                        </p>
                        <p className="text-[11px] text-stone-500 dark:text-slate-400">
                          Click "Add OS Image" above to drop an Ubuntu, Arch, Kali, or custom ISO directly onto the drive.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {status.isos.map((iso, idx) => (
                          <div 
                            key={idx}
                            className="p-4 bg-white dark:bg-white/[0.03] border border-stone-200 dark:border-white/10 rounded-2xl flex items-center justify-between hover:border-amber-700/30 dark:hover:border-blue-500/30 transition-all shadow-sm"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Disc className="w-4 h-4 text-amber-700 dark:text-blue-400" />
                                <span className="font-bold text-xs text-stone-900 dark:text-white truncate max-w-[220px]" title={iso.display_name}>
                                  {iso.display_name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 dark:text-slate-400">
                                <span>{(iso.size_mb / 1024).toFixed(2)} GB</span>
                                <span>•</span>
                                <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-white/10 text-stone-700 dark:text-stone-300">
                                  {iso.boot_category}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleRemoveIso(iso.filename)}
                              disabled={isCopying}
                              className="p-2 text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                              title="Delete ISO from USB"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Drive NOT configured as Multi-Boot */
                <div className="p-8 bg-[#fbf8f3] dark:bg-white/[0.02] border border-[#ebe3d5] dark:border-white/10 rounded-3xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-blue-500/10 border border-amber-500/20 dark:border-blue-500/20 text-amber-700 dark:text-blue-400 flex items-center justify-center mx-auto">
                    <Usb className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h3 className="text-base font-extrabold text-stone-900 dark:text-white">
                      Initialize Drive {selectedDriveLetter} as Multi-Boot Master
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-slate-400">
                      Convert this flash drive to a multi-OS Swiss Army Knife with dynamic GRUB2 loopback bootloader. Store user files alongside multiple bootable ISOs on exFAT.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setFormatModalOpen(true)}
                      disabled={isFormatting}
                      className="bg-amber-800 hover:bg-amber-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 mx-auto shadow-md transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Initialize OSwitch Multi-Boot Drive
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal: Format Confirmation */}
        {formatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white dark:bg-[#181c2b] border border-stone-200 dark:border-white/10 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                    Format Drive {selectedDriveLetter}?
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-slate-400">
                    All existing partitions & files on Drive {selectedDriveLetter} will be erased.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-800 dark:text-amber-300 text-xs space-y-1">
                <p className="font-bold">What will happen:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>Creates a clean GPT partition layout</li>
                  <li>Formats partition with exFAT labeled <code>OSWITCH_DATA</code></li>
                  <li>Deploys standalone EFI loopback GRUB2 bootloader</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setFormatModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFormatDrive}
                  className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Confirm & Erase Drive
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add ISO to USB */}
        {addIsoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white dark:bg-[#181c2b] border border-stone-200 dark:border-white/10 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-blue-500/10 border border-amber-500/20 dark:border-blue-500/20 text-amber-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                    Add OS Image to Multi-Boot USB
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-slate-400">
                    Select an ISO from your PC or match against the 101+ catalog.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-mono font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                    Select ISO File on PC
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={manualIsoPath}
                      placeholder="Click Browse to select .iso file..."
                      className="w-full bg-[#fbf8f3] dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-stone-800 dark:text-stone-200 font-mono truncate"
                    />
                    <button
                      onClick={handleBrowseLocalIso}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/15 text-stone-800 dark:text-white text-xs font-semibold rounded-xl shrink-0 transition-colors"
                    >
                      Browse...
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                    Display Name in Boot Menu
                  </label>
                  <input
                    type="text"
                    value={manualIsoName}
                    onChange={(e) => setManualIsoName(e.target.value)}
                    placeholder="e.g. Ubuntu 24.04 LTS (Noble Numbat)"
                    className="w-full bg-[#fbf8f3] dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-stone-800 dark:text-stone-200"
                  />
                </div>

                {catalog.length > 0 && (
                  <div>
                    <label className="text-xs font-mono font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                      Link with OS Catalog Profile (Optional)
                    </label>
                    <select
                      value={selectedCatalogId}
                      onChange={(e) => {
                        setSelectedCatalogId(e.target.value);
                        const match = catalog.find(c => c.id === e.target.value);
                        if (match && !manualIsoName) {
                          setManualIsoName(match.name);
                        }
                      }}
                      className="w-full bg-[#fbf8f3] dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-stone-800 dark:text-stone-200"
                    >
                      <option value="">-- Generic Loopback Linux --</option>
                      {catalog.slice(0, 50).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-white/10">
                <button
                  onClick={() => setAddIsoModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddIso}
                  disabled={!manualIsoPath}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl text-white shadow-md transition-all flex items-center gap-1.5 ${
                    manualIsoPath 
                      ? 'bg-amber-800 hover:bg-amber-900 dark:bg-blue-600 dark:hover:bg-blue-500' 
                      : 'bg-stone-400 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" /> Flash to Multi-Boot USB
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
