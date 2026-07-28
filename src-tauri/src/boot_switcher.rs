use tauri::command;
use std::process::Command;

#[command]
pub fn get_boot_menu() -> Result<Vec<String>, String> {
    let output = Command::new("bcdedit")
        .arg("/enum")
        .output()
        .map_err(|e| format!("Failed to execute bcdedit: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    
    // Parse the output to extract identifiers or descriptions
    let mut entries = Vec::new();
    for line in stdout.lines() {
        if line.starts_with("description") {
            let desc = line.replace("description", "").trim().to_string();
            entries.push(desc);
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
        let err = String::from_utf8_lossy(&output.stderr);
        Err(format!("bcdedit error: {}", err))
    }
}
