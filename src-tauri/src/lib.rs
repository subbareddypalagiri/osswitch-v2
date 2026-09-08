pub mod engine;
pub mod boot_switcher;
pub mod hardware_pci;
pub mod multiboot_usb;

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
            engine::pick_local_iso,
            engine::scan_local_iso_cache,
            boot_switcher::get_boot_menu,
            boot_switcher::set_default_boot,
            hardware_pci::run_deep_hardware_diagnostic,
            hardware_pci::enable_safe_ahci_prestage,
            hardware_pci::suspend_bitlocker_for_reboot,
            multiboot_usb::get_multiboot_usb_status,
            multiboot_usb::format_and_initialize_multiboot_usb,
            multiboot_usb::copy_iso_to_multiboot_usb,
            multiboot_usb::remove_iso_from_multiboot_usb
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
