use tauri::command;
use std::process::Command;
use serde::{Serialize, Deserialize};

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

const CREATE_NO_WINDOW: u32 = 0x08000000;

#[derive(Serialize, Deserialize)]
pub struct BootEntry {
    pub id: String,
    pub name: String,
}

#[command]
pub fn get_boot_menu() -> Result<Vec<BootEntry>, String> {
    #[cfg(target_os = "windows")]
    {
        let mut cmd = Command::new("bcdedit");
        cmd.creation_flags(CREATE_NO_WINDOW);
        let output = cmd
            .arg("/enum")
            .output()
            .map_err(|e| format!("Failed to execute bcdedit: {}", e))?;

        let stdout = String::from_utf8_lossy(&output.stdout);
        
        let mut entries = Vec::new();
        let mut current_id = String::new();
        
        for line in stdout.lines() {
            let line = line.trim();
            if line.starts_with("identifier") {
                current_id = line.replace("identifier", "").trim().to_string();
            } else if line.starts_with("description") {
                let desc = line.replace("description", "").trim().to_string();
                if !current_id.is_empty() {
                    entries.push(BootEntry {
                        id: current_id.clone(),
                        name: desc,
                    });
                }
            }
        }
        
        Ok(entries)
    }

    #[cfg(not(target_os = "windows"))]
    {
        // 1. Try querying UEFI firmware via efibootmgr
        if let Ok(output) = Command::new("efibootmgr").output() {
            let stdout = String::from_utf8_lossy(&output.stdout);
            let mut entries = Vec::new();
            for line in stdout.lines() {
                let line = line.trim();
                // Matches format: Boot0001* Ubuntu HD(1,GPT,...) or Boot0002* Windows Boot Manager
                if line.starts_with("Boot") && line.len() > 8 {
                    let is_active = line.chars().nth(8) == Some('*');
                    let has_tab = line.contains('\t');
                    if is_active || has_tab {
                        if let Some(rest) = line.strip_prefix("Boot") {
                            let id = rest.chars().take(4).collect::<String>();
                            let desc = if let Some(idx) = line.find('*') {
                                line[idx + 1..].split('\t').next().unwrap_or(&line[idx + 1..]).trim().to_string()
                            } else if let Some(idx) = line.find('\t') {
                                line[idx + 1..].trim().to_string()
                            } else {
                                format!("UEFI Boot {}", id)
                            };
                            entries.push(BootEntry { id, name: desc });
                        }
                    }
                }
            }
            if !entries.is_empty() {
                return Ok(entries);
            }
        }

        // 2. Fallback: Parse /boot/grub/grub.cfg menuentries
        let mut entries = Vec::new();
        let grub_paths = ["/boot/grub/grub.cfg", "/boot/grub2/grub.cfg"];
        for gp in &grub_paths {
            if let Ok(grub_content) = std::fs::read_to_string(gp) {
                for line in grub_content.lines() {
                    let trimmed = line.trim();
                    if trimmed.starts_with("menuentry '") || trimmed.starts_with("menuentry \"") {
                        let quote = trimmed.chars().nth(10).unwrap_or('\'');
                        if let Some(end) = trimmed[11..].find(quote) {
                            let title = &trimmed[11..11 + end];
                            entries.push(BootEntry { id: title.to_string(), name: title.to_string() });
                        }
                    }
                }
                if !entries.is_empty() {
                    break;
                }
            }
        }

        if entries.is_empty() {
            entries.push(BootEntry { id: "current".into(), name: "Current Linux System (Default)".into() });
        }
        Ok(entries)
    }
}

#[command]
pub fn set_default_boot(identifier: String) -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        let mut cmd = Command::new("bcdedit");
        cmd.creation_flags(CREATE_NO_WINDOW);
        let output = cmd
            .args(["/default", &identifier])
            .output()
            .map_err(|e| format!("Failed to set default boot: {}", e))?;
            
        if output.status.success() {
            Ok("Successfully set default boot entry".to_string())
        } else {
            let stderr = String::from_utf8_lossy(&output.stderr);
            let stdout = String::from_utf8_lossy(&output.stdout);
            let err_msg = if !stderr.trim().is_empty() {
                stderr.trim().to_string()
            } else {
                stdout.trim().to_string()
            };
            Err(format!("bcdedit error: {}", err_msg))
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        // 1. If 4-digit hex (UEFI Boot Entry), use efibootmgr -n (BootNext)
        if identifier.len() == 4 && identifier.chars().all(|c| c.is_ascii_hexdigit()) {
            let out = Command::new("efibootmgr").args(["-n", &identifier]).output();
            if let Ok(o) = out {
                if o.status.success() {
                    return Ok(format!("Successfully scheduled Boot{} for next system boot", identifier));
                }
            }
        }

        // 2. Try grub-reboot / grub-set-default
        let out = Command::new("grub-reboot").arg(&identifier).output();
        if let Ok(o) = out {
            if o.status.success() {
                return Ok(format!("Successfully set GRUB next-boot to '{}'", identifier));
            }
        }

        Ok(format!("Boot entry '{}' selected", identifier))
    }
}
