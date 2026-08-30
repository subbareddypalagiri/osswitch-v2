pub mod engine;
pub mod boot_switcher;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(target_os = "linux")]
    {
        std::env::set_var("WEBKIT_DISABLE_SANDBOX_THIS_IS_DANGEROUS", "1");
        std::env::set_var("WEBKIT_FORCE_SANDBOX", "0");
        std::env::set_var("WEBKIT_DISABLE_COMPOSITING_MODE", "1");
        std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
    }

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
            engine::get_installed_tools,
            engine::launch_installed_tool,
            engine::get_host_platform,
            engine::get_connected_usb_drives,
            engine::run_preflight_safety_check,
            engine::safe_carve_unallocated_space,
            boot_switcher::get_boot_menu,
            boot_switcher::set_default_boot
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
