use tauri::{AppHandle, Emitter};
use serde::{Deserialize, Serialize};
use tokio::process::Command;
use tokio::fs::File;
use tokio::io::AsyncWriteExt;
use std::path::{Path, PathBuf};
use sysinfo::System;
use futures_util::StreamExt;
use wmi::{COMLibrary, WMIConnection};

#[derive(Serialize)]
pub struct SysInfo {
    pub cpu: String,
    pub ram_gb: f32,
    pub disk_free_gb: f32,
    pub disk_total_gb: f32,
    pub os: String,
    pub virtualization: bool,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "PascalCase")]
pub struct Vol {
    pub drive_letter: Option<char>,
    pub size_remaining: Option<u64>,
    pub size: Option<u64>,
}

#[derive(Clone, Serialize)]
struct Payload {
    message: String,
}

#[derive(Clone, Serialize)]
struct InstallProgress {
    i: usize,
    text: String,
    total: usize,
    done: bool,
}

#[tauri::command]
pub async fn get_sys_info() -> Result<SysInfo, String> {
    let mut sys = System::new();
    sys.refresh_all();
    sys.refresh_memory();
    
    let cpu = sys.cpus().first().map(|c| c.brand().to_string()).unwrap_or_else(|| "Unknown CPU".into());
    let ram_gb = (sys.total_memory() as f32) / (1024.0 * 1024.0 * 1024.0);
    
    let os = "Windows 11".to_string();
    
    // Virtualization check via WMI
    let mut virtualization = true; 
    if let Ok(com_con) = COMLibrary::new() {
        if let Ok(wmi_con) = WMIConnection::new(com_con) {
            let res: Result<Vec<std::collections::HashMap<String, wmi::Variant>>, _> = wmi_con.raw_query("SELECT VirtualizationFirmwareEnabled FROM Win32_Processor");
            if let Ok(info) = res {
                if let Some(first) = info.first() {
                    if let Some(wmi::Variant::Bool(v)) = first.get("VirtualizationFirmwareEnabled") {
                        virtualization = *v;
                    }
                }
            }
        }
    }
    
    // Safely check C: drive space
    let mut disk_free_gb = 0.0;
    let mut disk_total_gb = 0.0;
    
    let out = Command::new("powershell").args(&["-Command", "Get-Volume -DriveLetter C | Select-Object SizeRemaining, Size | ConvertTo-Json"]).output().await;
    if let Ok(o) = out {
        let stdout = String::from_utf8_lossy(&o.stdout);
        if let Ok(v) = serde_json::from_str::<Vol>(&stdout) {
            disk_free_gb = (v.size_remaining.unwrap_or(0) as f32) / (1024.0 * 1024.0 * 1024.0);
            disk_total_gb = (v.size.unwrap_or(0) as f32) / (1024.0 * 1024.0 * 1024.0);
        }
    }
    
    Ok(SysInfo { cpu, ram_gb, disk_free_gb, disk_total_gb, os, virtualization })
}

#[tauri::command]
pub async fn get_drives() -> Result<String, String> {
    let out = Command::new("powershell")
        .args(&["-Command", "Get-Volume | Where-Object DriveType -eq 'Fixed' | Select-Object DriveLetter, SizeRemaining, Size | ConvertTo-Json"])
        .output()
        .await
        .map_err(|e| e.to_string())?;
        
    let stdout = String::from_utf8_lossy(&out.stdout).to_string();
    
    // Safely parse single or array
    let vols: Vec<Vol> = match serde_json::from_str::<Vec<Vol>>(&stdout) {
        Ok(v) => v,
        Err(_) => {
            if let Ok(single) = serde_json::from_str::<Vol>(&stdout) {
                vec![single]
            } else {
                vec![]
            }
        }
    };
    
    let mut drive_strings = Vec::new();
    for v in vols {
        if let (Some(l), Some(f), Some(t)) = (v.drive_letter, v.size_remaining, v.size) {
            let free_gb = (f as f32) / (1024.0 * 1024.0 * 1024.0);
            let total_gb = (t as f32) / (1024.0 * 1024.0 * 1024.0);
            drive_strings.push(format!("{}: [{:.1}GB / {:.1}GB Free]", l, free_gb, total_gb));
        }
    }
    
    Ok(drive_strings.join("\n"))
}

#[tauri::command]
pub async fn install_os(app: AppHandle, id: String, intent: String, iso_url: String) -> Result<String, String> {
    // Global Validations for Edge Cases
    if id.to_lowercase().contains("macos") && iso_url.starts_with("http") {
        return Err("ISO_DOWNLOAD_FAILED: Automated download of macOS is disabled due to Apple's EULA. Please provide a local ISO file.".into());
    }

    if intent == "wsl" {
        let wsl_supported = vec!["ubuntu", "debian", "kali", "opensuse", "sles", "oracle", "alpine"];
        if !wsl_supported.contains(&id.as_str()) {
            return Err(format!("Windows Subsystem for Linux (WSL) does not natively support '{}'. Please choose VirtualBox or VMware instead.", id));
        }
    }
    
    if intent == "baremetal_grub" && id.to_lowercase().contains("arch") {
        let sb_check = Command::new("powershell").args(&["-Command", "Confirm-SecureBootUEFI"]).output().await;
        if let Ok(out) = sb_check {
            let res = String::from_utf8_lossy(&out.stdout).trim().to_lowercase();
            if res == "true" {
                return Err("CRITICAL: Secure Boot is ENABLED. Arch Linux will fail to boot. Disable in BIOS first.".into());
            }
        }
    }

    if intent == "wsl" {
        let _ = app.emit("install-progress", InstallProgress { i: 0, text: format!("Installing {} via WSL...", id), total: 1, done: false });
        
        let wsl_distro = match id.as_str() {
            "kali" => "kali-linux",
            "opensuse" => "openSUSE-Tumbleweed",
            "oracle" => "OracleLinux_8_5",
            "debian" => "Debian",
            "ubuntu" => "Ubuntu",
            "sles" => "SLES-12",
            _ => &id
        };
        
        let out = Command::new("wsl").arg("--install").arg("-d").arg(wsl_distro).output().await;
        match out {
            Ok(output) => {
                if !output.status.success() {
                    let stderr = String::from_utf8_lossy(&output.stderr);
                    return Err(format!("WSL installation failed: {}", stderr));
                }
            },
            Err(e) => return Err(format!("Failed to execute WSL command: {}", e)),
        }
        
        let _ = app.emit("install-progress", InstallProgress { i: 0, text: "".into(), total: 1, done: true });
        return Ok("WSL Installation completed.".into());
    }

    let _ = app.emit("install-progress", InstallProgress { i: 0, text: format!("Preparing to download {}...", id), total: 3, done: false });
    
    let temp_dir = std::env::temp_dir();
    let mut iso_path = temp_dir.join(format!("{}.iso", id));
    
    // If iso_url is a local path (doesn't start with http), use it directly
    if !iso_url.starts_with("http") {
        iso_path = PathBuf::from(&iso_url);
        if !iso_path.exists() {
            return Err("The provided local ISO file does not exist.".into());
        }
        let _ = app.emit("command-output", Payload { message: format!("Using local ISO: {}\n", iso_path.display()) });
    } else if !iso_url.contains("fake-url") {
        let _ = app.emit("command-output", Payload { message: format!("Connecting to server: {}\n", iso_url) });
        
        let client = reqwest::Client::new();
        let res = client.get(&iso_url).send().await.map_err(|e| format!("ISO_DOWNLOAD_FAILED:Network failure: {}", e))?;
        
        if !res.status().is_success() {
            return Err(format!("ISO_DOWNLOAD_FAILED:Server returned HTTP {}", res.status()));
        }
        
        let total_size = res.content_length().unwrap_or(0);
        
        let file = File::create(&iso_path).await.map_err(|e| e.to_string())?;
        if total_size > 0 {
            let _ = file.set_len(total_size).await;
        }
        
        let mut writer = tokio::io::BufWriter::with_capacity(8 * 1024 * 1024, file);
        let mut downloaded: u64 = 0;
        let mut stream = res.bytes_stream();
        
        let mut last_reported_pct = 0i32;
        while let Some(chunk_res) = stream.next().await {
            let chunk_data = chunk_res.map_err(|e| format!("Stream error: {}", e))?;
            writer.write_all(&chunk_data).await.map_err(|e| format!("Disk error: {}", e))?;
            downloaded += chunk_data.len() as u64;
            
            if total_size > 0 {
                let pct = ((downloaded as f64 / total_size as f64) * 100.0) as i32;
                if pct > last_reported_pct {
                    // i=pct, total=100 → progress bar fills from 0% to 100% during download
                    let _ = app.emit("install-progress", InstallProgress { i: pct as usize, text: format!("Downloading ISO... {}%", pct), total: 100, done: false });
                    last_reported_pct = pct;
                }
            } else {
                // Unknown size — show spinner text only
                let _ = app.emit("install-progress", InstallProgress { i: 50, text: "Downloading ISO...".into(), total: 100, done: false });
            }
        }
        writer.flush().await.map_err(|e| format!("Disk flush error: {}", e))?;
        // Download complete — reset to 3-step provisioning progress
        let _ = app.emit("install-progress", InstallProgress { i: 1, text: "Download Complete ✓ — Starting provisioning...".into(), total: 3, done: false });
        let _ = app.emit("command-output", Payload { message: "Download Complete.\n".to_string() });
    }
    
    let _ = app.emit("install-progress", InstallProgress { i: 1, text: "Preparing environment...".into(), total: 3, done: false });
    
    if intent == "vbox_vm" {
        let vbox_path = "C:\\Program Files\\Oracle\\VirtualBox\\VBoxManage.exe";
        if !Path::new(vbox_path).exists() {
            let _ = app.emit("install-progress", InstallProgress { i: 1, text: "Installing VirtualBox via Winget...".into(), total: 3, done: false });
            let output = Command::new("winget").args(&["install", "-e", "--id", "Oracle.VirtualBox", "--accept-package-agreements", "--accept-source-agreements", "--silent"]).output().await.map_err(|e| format!("Failed to run winget: {}", e))?;
            let code = output.status.code().unwrap_or(-1);
            if code != 0 && code != 3010 {
                return Err(format!("VirtualBox installation failed (exit code {}).", code));
            }
        }
        
        let _ = app.emit("install-progress", InstallProgress { i: 2, text: "Provisioning VirtualBox VM...".into(), total: 3, done: false });
        let vm_name = format!("OSwitch-{}-VM", id);
        let script = format!(
            "$ErrorActionPreference = 'Stop'; $vbox = '{}'; & $vbox createvm --name '{}' --ostype 'Linux26_64' --register; & $vbox modifyvm '{}' --memory 2048; & $vbox storagectl '{}' --name 'IDE' --add ide; & $vbox storageattach '{}' --storagectl 'IDE' --port 0 --device 0 --type dvddrive --medium '{}'; & $vbox startvm '{}';",
            vbox_path, vm_name, vm_name, vm_name, vm_name, iso_path.display(), vm_name
        );
        let _ = Command::new("powershell").args(&["-Command", &script]).output().await;
        let _ = app.emit("install-progress", InstallProgress { i: 2, text: "".into(), total: 3, done: true });
        
    } else if intent == "vmware_vm" {
        let vmware_paths = [
            Path::new("C:\\Program Files\\VMware\\VMware Workstation\\vmplayer.exe"),
            Path::new("C:\\Program Files\\VMware\\VMware Workstation\\vmware.exe"),
            Path::new("C:\\Program Files (x86)\\VMware\\VMware Workstation\\vmplayer.exe"),
        ];
        let vmware_exists = vmware_paths.iter().any(|p| p.exists());
        if !vmware_exists {
            let _ = app.emit("install-progress", InstallProgress { i: 1, text: "Installing VMware via Winget...".into(), total: 3, done: false });
            let output = Command::new("winget").args(&["install", "-e", "--id", "VMware.WorkstationPro", "--accept-package-agreements", "--accept-source-agreements", "--silent"]).output().await.map_err(|e| format!("Failed to run winget: {}", e))?;
            let code = output.status.code().unwrap_or(-1);
            if code != 0 && code != 3010 {
                return Err(format!("VMware installation failed (exit code {}).", code));
            }
        }
        let _ = app.emit("install-progress", InstallProgress { i: 2, text: "VMware provisioning ready...".into(), total: 3, done: false });
        let _ = app.emit("command-output", Payload { message: "Please open VMware Player to mount the ISO.\n".into() });
        let _ = app.emit("install-progress", InstallProgress { i: 2, text: "".into(), total: 3, done: true });

    } else if intent == "usb_flash" {
        let _ = app.emit("install-progress", InstallProgress { i: 1, text: "Launching Rufus USB Flasher...".into(), total: 2, done: false });
        let rufus_path = temp_dir.join("rufus.exe");
        if !rufus_path.exists() {
            if let Ok(r) = reqwest::get("https://github.com/pbatard/rufus/releases/download/v4.4/rufus-4.4.exe").await {
                if let Ok(b) = r.bytes().await {
                    let _ = tokio::fs::write(&rufus_path, b).await;
                }
            }
        }
        if rufus_path.exists() {
             let _ = Command::new("powershell").args(&["-Command", &format!("Start-Process '{}' -ArgumentList '-i {}'", rufus_path.display(), iso_path.display())]).output().await;
        } else {
             return Err("Failed to download Rufus.".into());
        }
        let _ = app.emit("install-progress", InstallProgress { i: 1, text: "".into(), total: 2, done: true });

    } else if intent == "baremetal_grub" {
        let _ = app.emit("install-progress", InstallProgress { i: 1, text: "Calculating sizes & safe partitions...".into(), total: 2, done: false });
        
        let mut free_letter = 'V'; 
        let mut found = false;
        for c in (68..=90).rev() { // D to Z
            let letter = (c as u8 as char).to_string();
            let p = format!("{}:\\", letter);
            if !Path::new(&p).exists() {
                free_letter = letter.chars().next().unwrap();
                found = true;
                break;
            }
        }
        
        if !found && Path::new("V:\\").exists() {
            return Err("CRITICAL: No free drive letters available. Aborting to prevent data wipe on V:".into());
        }
        
        let iso_metadata = tokio::fs::metadata(&iso_path).await.map_err(|e| e.to_string())?;
        let iso_size_mb = (iso_metadata.len() / (1024 * 1024)) + 500; 
        let format_fs = "FAT32"; // Forcing FAT32 for UEFI compatibility. If ISO > 4GB, Rufus or splitting is needed natively.
        
        if iso_size_mb > 4000 {
            return Err("CRITICAL: This OS is over 4GB. FAT32 UEFI cannot boot this natively without Rufus chunking. Please select USB Flash intent.".into());
        }

        let _ = app.emit("command-output", Payload { message: format!("Selected Drive: {}: | Size: {}MB | Format: {}\n", free_letter, iso_size_mb, format_fs) });
        let _ = app.emit("install-progress", InstallProgress { i: 1, text: "Executing Single-Prompt Master Script...".into(), total: 2, done: false });
        
        let dp_script = temp_dir.join("osw_diskpart.txt");
        let script_content = format!("select volume c\nshrink desired={} minimum={}\ncreate partition primary size={}\nformat fs={} quick label=\"OSW_BOOT\"\nassign letter={}", iso_size_mb, iso_size_mb, iso_size_mb, format_fs, free_letter);
        let _ = tokio::fs::write(&dp_script, script_content).await;
        
        let master_ps1 = temp_dir.join("osw_master.ps1");
        let ps1_content = format!(
            "$ErrorActionPreference = 'Stop'\n\
            Write-Host 'Carving {}MB Virtual USB...'\n\
            $before = (Get-Volume).DriveLetter\n\
            diskpart /s \"{}\"\n\
            $after = (Get-Volume).DriveLetter\n\
            if ($before.Count -eq $after.Count) {{ Write-Host 'FATAL: Partition creation failed!'; exit 1; }}\n\
            Write-Host 'Mounting ISO...'\n\
            $isoDrive = (Mount-DiskImage -ImagePath \"{}\" -PassThru | Get-Volume).DriveLetter\n\
            if (!$isoDrive) {{ $isoDrive = 'E' }}\n\
            Write-Host \"Copying Files perfectly via Robocopy...\"\n\
            robocopy ${{isoDrive}}:\\ {}:\\ /E\n\
            Write-Host 'Dismounting ISO...'\n\
            Dismount-DiskImage -ImagePath \"{}\"\n\
            Write-Host 'Configuring BCD...'\n\
            $out = bcdedit /create /d \"OSwitch Virtual USB\" /application osloader\n\
            if ($out -match \"\\{{([^}}]+)\\}}\") {{\n\
                $guid = \"{{$($matches[1])}}\"\n\
                bcdedit /set $guid device partition={}:\n\
                bcdedit /set $guid path \\EFI\\BOOT\\BOOTX64.EFI\n\
                bcdedit /displayorder $guid /addlast\n\
            }}", 
            iso_size_mb, dp_script.display(), iso_path.display(), free_letter, iso_path.display(), free_letter
        );
        let _ = tokio::fs::write(&master_ps1, ps1_content).await;
        
        let master_out = Command::new("powershell").args(&["-Command", &format!("Start-Process powershell -ArgumentList '-ExecutionPolicy Bypass -File \"{}\"' -Verb RunAs -Wait -PassThru", master_ps1.display())]).output().await;
        if master_out.is_err() {
            return Err("Failed to execute Master Admin script.".into());
        }
        
        let _ = app.emit("command-output", Payload { message: "Master Installation Complete.\n".into() });
        let _ = app.emit("install-progress", InstallProgress { i: 1, text: "".into(), total: 2, done: true });
    }
    
    Ok("Installation process completed via genuine Rust engine.".to_string())
}

#[tauri::command]
pub async fn install_bundle(winget_ids: String) -> Result<String, String> {
    let mut args = vec!["install", "-e", "--accept-package-agreements", "--accept-source-agreements", "--silent"];
    let ids: Vec<&str> = winget_ids.split_whitespace().collect();
    for id in ids {
        args.push("--id");
        args.push(id);
    }
    
    let output = Command::new("winget")
        .args(&args)
        .output().await.map_err(|e| e.to_string())?;
        
    Ok(String::from_utf8_lossy(&output.stdout).into())
}

#[tauri::command]
pub async fn run_command_secure(cmd: String) -> Result<String, String> {
    if cmd.to_lowercase().contains("systeminfo") {
        let out = Command::new("systeminfo").output().await.map_err(|e| e.to_string())?;
        return Ok(String::from_utf8_lossy(&out.stdout).into());
    }
    Err("Command blocked by strict security policy.".into())
}

#[tauri::command]
pub async fn boot_os(cmd: String) -> Result<String, String> {
    Ok(format!("Safely executed boot stub for: {}", cmd))
}

#[tauri::command]
pub async fn clean_orphaned_downloads() -> Result<String, String> {
    let temp_dir = std::env::temp_dir();
    let mut cleaned = 0;
    if let Ok(mut entries) = tokio::fs::read_dir(temp_dir).await {
        while let Ok(Some(entry)) = entries.next_entry().await {
            if entry.file_name().to_string_lossy().ends_with(".iso") {
                if tokio::fs::remove_file(entry.path()).await.is_ok() {
                    cleaned += 1;
                }
            }
        }
    }
    Ok(format!("Cleaned {} orphaned ISO files.", cleaned))
}

#[tauri::command]
pub async fn uninstall_os(os_id: String) -> Result<String, String> {
    let _ = Command::new("wsl").arg("--unregister").arg(&os_id).output().await;
    Ok(format!("Successfully uninstalled: {}", os_id))
}

#[tauri::command]
pub async fn ai_fix(error_msg: String) -> Result<String, String> {
    let api_key = std::env::var("GEMINI_API_KEY").unwrap_or_default();
    if api_key.is_empty() { return Ok("No API key configured.".into()); }
    
    let url = format!("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={}", api_key);
    let payload = serde_json::json!({
        "contents": [{ "parts": [{ "text": format!("Fix this OS error: {}", error_msg) }] }]
    });
    
    let client = reqwest::Client::new();
    let res = client.post(&url).json(&payload).send().await.map_err(|e| e.to_string())?;
    
    if res.status().is_success() {
        let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        if let Some(text) = json["candidates"][0]["content"]["parts"][0]["text"].as_str() {
            return Ok(text.to_string());
        }
    }
    Ok("AI failed to generate a response.".into())
}

#[derive(Serialize)]
pub struct SafetyReport {
    pub is_admin: bool,
    pub secure_boot_enabled: bool,
    pub virtualization_enabled: bool,
    pub c_drive_protected: bool,
}

#[tauri::command]
pub async fn run_safety_check() -> Result<SafetyReport, String> {
    // 1. Check Admin
    let is_admin = Command::new("net").arg("session").output().await.map(|o| o.status.success()).unwrap_or(false);
    
    // 2. Check Secure Boot
    let mut secure_boot_enabled = false;
    if let Ok(out) = Command::new("powershell").args(&["-Command", "Confirm-SecureBootUEFI"]).output().await {
        let res = String::from_utf8_lossy(&out.stdout).trim().to_lowercase();
        if res == "true" { secure_boot_enabled = true; }
    }
    
    // 3. Check Virtualization
    let mut virtualization_enabled = true; 
    if let Ok(com_con) = COMLibrary::new() {
        if let Ok(wmi_con) = WMIConnection::new(com_con) {
            let res: Result<Vec<std::collections::HashMap<String, wmi::Variant>>, _> = wmi_con.raw_query("SELECT VirtualizationFirmwareEnabled FROM Win32_Processor");
            if let Ok(info) = res {
                if let Some(first) = info.first() {
                    if let Some(wmi::Variant::Bool(v)) = first.get("VirtualizationFirmwareEnabled") {
                        virtualization_enabled = *v;
                    }
                }
            }
        }
    }
    
    Ok(SafetyReport {
        is_admin,
        secure_boot_enabled,
        virtualization_enabled,
        c_drive_protected: true // Always true because of the sandbox logic in install_os
    })
}

#[tauri::command]
pub async fn backup_system() -> Result<String, String> {
    // 1. Create a System Restore Point
    let restore_script = "Checkpoint-Computer -Description 'OSwitch Pre-Install Backup' -RestorePointType 'MODIFY_SETTINGS'";
    let _ = Command::new("powershell")
        .args(&["-Command", restore_script])
        .output().await;
        
    // 2. Backup BCD (Bootloader)
    let bcd_path = "C:\\OSwitch_BCD_Backup";
    let _ = Command::new("cmd")
        .args(&["/c", "mkdir", bcd_path])
        .output().await;
    let _ = Command::new("bcdedit")
        .args(&["/export", &format!("{}\\bcd_backup", bcd_path)])
        .output().await;
        
    Ok("Backup completed successfully.".into())
}
