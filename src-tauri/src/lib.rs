pub mod engine;
pub mod boot_switcher;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            engine::clean_orphaned_downloads,
            engine::run_command_secure,
            engine::uninstall_os,
            engine::ai_fix,
            engine::get_gemini_models,
            engine::run_safety_check,
            engine::backup_system,
            engine::install_packages,
            engine::search_winget,
            engine::get_sys_info,
            engine::get_drives,
            engine::install_os,
            engine::boot_os,
            engine::get_installed_os_list,
                                    boot_switcher::get_boot_menu,
            boot_switcher::set_default_boot
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
