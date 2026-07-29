use tauri::command;
use std::process::Command;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct BootEntry {
    pub id: String,
    pub name: String,
}

#[command]
pub fn get_boot_menu() -> Result<Vec<BootEntry>, String> {
    let output = Command::new("bcdedit")
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

#[command]
pub fn set_default_boot(identifier: String) -> Result<String, String> {
    let output = Command::new("bcdedit")
        .args(&["/default", &identifier])
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
