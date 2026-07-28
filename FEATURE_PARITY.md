# OSwitch: Feature Parity Tracking (v1 Electron vs v2 Tauri)

This document tracks the progress of porting features from the original `oswitch-app` (Electron) to the new `oswitch-v2` (Tauri) scaffolding.

## 1. Core Application Framework & Setup

| Feature / Capability | v1 (Electron) | v2 (Tauri) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Framework** | Electron + HTML/JS | Tauri + React (TypeScript) | ✅ Ported (Shift) | Shifted to lighter, faster, Rust-backed stack. |
| **Administrator Privilege / Elevation** | Yes (`requireAdministrator` in package.json) | Basic detection added | 🚧 Partial | Need to configure Windows execution level in Tauri config (`requireAdministrator` in `tauri.conf.json`). |
| **State Management** | LocalStorage | `save_state` / `load_state` via Tauri backend | ✅ Ported | Backend-driven JSON state storage is implemented in Rust. |
| **Orphaned Download Cleanup** | Yes (`cleanOrphanedDownloads()`) | No | ❌ Missing | Needs Rust background task to clear old `.iso` files from temp dir. |
| **Hardware Info & Virtualization Detection** | Yes (`get-sys-info`) | Yes (`get_sys_info`) | ✅ Ported (Enhanced) | V2 adds WMI check for active virtualization (VMware/QEMU/VBox). |

## 2. Boot, Installation & Command Execution Engine

| Feature / Capability | v1 (Electron) | v2 (Tauri) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Secure Command Execution (Regex Guard)** | Yes (`runCommandSecure`) | No | ❌ Missing | Needs Rust equivalent to block destructive commands (`format c:`, `rmdir c:\`). |
| **WSL Distro Launching** (Ubuntu, Debian, etc.) | Yes (`Start-Process wsl -ArgumentList...`) | No | ❌ Missing | Needs Rust equivalent (`std::process::Command` for `wsl.exe`). |
| **VirtualBox VM Launching** (Kali, ReactOS, etc.) | Yes (`VBoxManage.exe startvm ...`) | No | ❌ Missing | Needs Rust command execution. |
| **Dual Boot Management** (`bcdedit`) | Yes (`bcdedit /enum firmware`) | No | ❌ Missing | Needs Rust command execution and parsing. |
| **Windows Restart** | Yes (`shutdown /r /t 5`) | No | ❌ Missing | Needs Rust command execution. |
| **Live USB Guidance** | Yes (Echo messages) | No | ❌ Missing | Needs UI representation. |
| **Predefined OS List & Boot Cmds** | Yes (`commands.js` - 40 OSes) | No | ❌ Missing | Needs porting of `COMMANDS` and `BOOT_CMDS` data structures. |
| **Resilient ISO Downloader** | Yes (`ResilientDownloader`) | No | ❌ Missing | Needs Rust `reqwest` or equivalent for robust ISO downloading. |
| **USB Flasher (Rufus Integration)** | Yes (`UsbFlasher`) | No | ❌ Missing | Needs Rust to launch and automate Rufus. |
| **Virtual USB Engine (Grub Injector)** | Yes (`VirtualUsbEngine`) | No | ❌ Missing | Needs baremetal GRUB injection port. |
| **External USB Drive Detection** | Yes (`get-drives` via PowerShell) | No | ❌ Missing | Needs Rust implementation (e.g. `sysinfo` or WMI) to find flash drives. |
| **Software Bundles Installer** | Yes (`WingetInstaller`) | No | ❌ Missing | Needs `winget` execution logic in Rust. |
| **OS Uninstallation / Revert** | Yes (`uninstall-os`) | No | ❌ Missing | Needs BCD reversion and WSL unregister logic. |
| **Virtual USB Cleanup** | Yes (`cleanup-virtual-usb`) | No | ❌ Missing | Needs partition cleanup port. |

## 3. UI/UX & AI Integrations

| Feature / Capability | v1 (Electron) | v2 (Tauri) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Boot Control Center UI** | Yes (Sidebar, Live Output, OS Grid) | No (Default Vite+React screen) | ❌ Missing | The React frontend needs to be built. |
| **AI Error Fixer (Gemini Integration)** | Yes (`ai-fix`, `get-gemini-models`) | No | ❌ Missing | Needs UI for API key and integration. (Note: V1 used Gemini, not Anthropic as previously documented). |

## Summary of Next Steps

1. **Rust Backend (`lib.rs` / `main.rs`)**:
   - Implement command execution endpoints (`launch_wsl`, `launch_vm`, `list_bcd`, `restart_pc`).
   - Implement Regex Guard to block destructive CLI commands.
   - Implement ISO Downloader, USB Flashing, and Virtual USB Engine.
   - Add USB drive detection and Orphaned `.iso` file cleanup.
   - Define the OS catalog data structures (or expose them to the frontend).
   - Ensure the app requests UAC Administrator privileges by default on Windows build.
2. **React Frontend (`src/`)**:
   - Port the `COMMANDS` and `BOOT_CMDS` maps.
   - Build the Dashboard / Grid UI for OS selection.
   - Build the terminal/live output component.
   - Integrate the AI Error Fixer with Gemini API key input.
