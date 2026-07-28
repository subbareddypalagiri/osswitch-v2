# OSwitch V1 vs V2 Mismatch Report

This report outlines the functionality, error handling, and UI feature discrepancies between the original `oswitch-app` (V1 - Electron) and `oswitch-v2` (V2 - Tauri).

## 1. Operating System Catalog
* **V1:** Supports **40** different operating systems (including niche OSes like TempleOS, ReactOS, KolibriOS, and numerous BSD/Linux variants) defined in `commands.js`.
* **V2:** The `OS_LIST` in `StepChooseOS.tsx` is currently hardcoded to only **15** operating systems. 25 operating systems are missing from the selection.

## 2. Boot Control & Boot Switcher
* **V1:** Implements a comprehensive `BOOT_CMDS` mapping that provides specific logic to boot into an OS (e.g., launching a WSL distro, executing `VBoxManage.exe`, or displaying BIOS boot instructions). 
* **V2:** Lacks any backend boot logic or UI step for the Boot Switcher. The "Boot Switcher ->" button in `StepInstall.tsx` exists, but there is no actual implementation for booting into the installed OS.

## 3. Uninstallation & Reversion
* **V1:** Features an `uninstall-os` IPC handler that can unregister WSL distros or restore the Windows Boot Manager (`bcdedit /export C:\OSwitch_Uninstall_Backup`) and open `diskmgmt.msc`.
* **V2:** Completely missing uninstallation or rollback functionality.

## 4. Error Handling & AI Assistant
* **V1:** Includes an AI-powered error fixer. It has endpoints (`get-gemini-models` and `ai-fix`) that send error strings to the Gemini API to suggest fixes for installation errors.
* **V2:** Lacks AI integration and the associated UI for inputting API keys or displaying AI suggestions.

## 5. Security & Error Prevention
* **V1:** Implements `runCommandSecure`, a regex-based security guard that blocks destructive commands (e.g., `format c:`, `rmdir c:\`).
* **V2:** Does not currently implement a robust safeguard against destructive commands being executed through the backend.

## 6. Software Bundles Integration
* **V1:** Supports installing software bundles post-installation via `WingetInstaller` and the `install-bundle` endpoint.
* **V2:** Software bundles are completely absent from the wizard and backend.

## 7. Storage & Drive Management
* **V1:**
  * Uses `get-drives` to actively scan and detect external USB drives for physical USB flashing.
  * Implements `cleanup-virtual-usb` to clean up partitions.
  * Cleans up orphaned `.iso` downloads automatically via `cleanOrphanedDownloads()` on startup.
* **V2:** Missing USB drive detection, partition cleanup, and orphaned ISO cleanup mechanisms.

## 8. UI Workflow Paradigm
* **V1:** Uses a centralized "Dashboard/Boot Control Center" layout with a sidebar, live output terminal, and OS grid all accessible from a primary view.
* **V2:** Shifted to a **5-step wizard flow** (`Welcome` -> `System Scan` -> `Choose OS` -> `Permissions` -> `Run Console`). 
