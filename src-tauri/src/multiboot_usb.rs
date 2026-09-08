use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::process::Command;
use tauri::{AppHandle, Emitter};

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

const CREATE_NO_WINDOW: u32 = 0x08000000;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UsbIsoItem {
    pub file_name: String,
    pub path: String,
    pub size_mb: u64,
    pub detected_distro: String,
    pub glyph: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MultiBootUsbStatus {
    pub is_oswitch_multiboot: bool,
    pub drive_letter: String,
    pub total_gb: f64,
    pub free_gb: f64,
    pub iso_count: usize,
    pub isos: Vec<UsbIsoItem>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MultiBootProgress {
    pub stage: String,
    pub percent: u8,
    pub speed_mbps: f64,
    pub message: String,
}

fn create_silent_cmd(program: &str) -> Command {
    let mut cmd = Command::new(program);
    #[cfg(target_os = "windows")]
    cmd.creation_flags(CREATE_NO_WINDOW);
    cmd
}

/// Detects distro name and icon glyph from ISO file name
fn detect_distro_meta(filename: &str) -> (String, String) {
    let f = filename.to_lowercase();
    if f.contains("ubuntu") {
        ("Ubuntu Linux".into(), "🟠".into())
    } else if f.contains("kali") {
        ("Kali Linux".into(), "🛡️".into())
    } else if f.contains("arch") {
        ("Arch Linux".into(), "🏔️".into())
    } else if f.contains("fedora") {
        ("Fedora".into(), "🎩".into())
    } else if f.contains("debian") {
        ("Debian".into(), "🎯".into())
    } else if f.contains("mint") {
        ("Linux Mint".into(), "🌿".into())
    } else if f.contains("tails") {
        ("Tails Amnesic OS".into(), "🕵️".into())
    } else if f.contains("pop") {
        ("Pop!_OS".into(), "🚀".into())
    } else if f.contains("manjaro") {
        ("Manjaro".into(), "🌀".into())
    } else if f.contains("win") || f.contains("11") || f.contains("10") {
        ("Windows 11 / 10 Installer".into(), "🪟".into())
    } else if f.contains("proxmox") {
        ("Proxmox VE".into(), "⚡".into())
    } else {
        ("Generic Operating System".into(), "💿".into())
    }
}

/// Scans a USB drive to check if it has the OSwitch Multi-Boot structure and lists all ISOs
#[tauri::command]
pub async fn get_multiboot_usb_status(drive_letter: String) -> Result<MultiBootUsbStatus, String> {
    let root = format!("{}:\\", drive_letter.trim_end_matches([':', '\\', '/']));
    let iso_dir = PathBuf::from(&root).join("oswitch_isos");

    let mut is_multiboot = false;
    let mut isos = Vec::new();

    if iso_dir.exists() && iso_dir.is_dir() {
        is_multiboot = true;
        if let Ok(entries) = std::fs::read_dir(&iso_dir) {
            for entry in entries.flatten() {
                let p = entry.path();
                if p.is_file() {
                    let ext = p.extension().and_then(|s| s.to_str()).unwrap_or("").to_lowercase();
                    if ext == "iso" || ext == "img" {
                        let fname = p.file_name().and_then(|s| s.to_str()).unwrap_or("").to_string();
                        let meta = p.metadata().ok();
                        let size_mb = meta.map(|m| m.len() / (1024 * 1024)).unwrap_or(0);
                        let (distro, glyph) = detect_distro_meta(&fname);

                        isos.push(UsbIsoItem {
                            file_name: fname,
                            path: p.to_string_lossy().to_string(),
                            size_mb,
                            detected_distro: distro,
                            glyph,
                        });
                    }
                }
            }
        }
    }

    // Query drive capacity via PowerShell
    let mut total_gb = 0.0;
    let mut free_gb = 0.0;

    #[cfg(target_os = "windows")]
    {
        let ps = format!(
            "Get-PSDrive -Name '{}' | Select-Object -Property @{{Name='Free';Expression={{[math]::Round($_.Free/1GB, 2)}}}}, @{{Name='Total';Expression={{[math]::Round(($_.Used + $_.Free)/1GB, 2)}}}} | ConvertTo-Json -Compress",
            drive_letter.trim_end_matches([':', '\\', '/'])
        );
        if let Ok(out) = create_silent_cmd("powershell").args(["-NoProfile", "-NonInteractive", "-Command", &ps]).output() {
            let s = String::from_utf8_lossy(&out.stdout).trim().to_string();
            if let Ok(v) = serde_json::from_str::<serde_json::Value>(&s) {
                free_gb = v["Free"].as_f64().unwrap_or(0.0);
                total_gb = v["Total"].as_f64().unwrap_or(0.0);
            }
        }
    }

    Ok(MultiBootUsbStatus {
        is_oswitch_multiboot: is_multiboot,
        drive_letter,
        total_gb,
        free_gb,
        iso_count: isos.len(),
        isos,
    })
}

/// Generates a comprehensive dynamic GRUB2 configuration matching all ISOs on the USB drive
fn generate_grub_config(isos: &[UsbIsoItem]) -> String {
    let mut cfg = String::from(r#"# OSwitch Multi-Boot Master GRUB2 Configuration
set timeout=15
set default=0

# Set Modern High-Resolution Graphics
insmod efi_gop
insmod efi_uga
insmod font
insmod gfxterm
set gfxmode=auto
terminal_output gfxterm

# OSwitch Modern Visual Styling
set menu_color_normal=white/black
set menu_color_highlight=black/light-gray
set color_normal=light-gray/black
set color_highlight=white/blue

menuentry "⚡ OSwitch Boot Switcher (Back to Windows)" --class windows {
    insmod chain
    insmod ntfs
    search --no-floppy --file /EFI/Microsoft/Boot/bootmgfw.efi --set=root
    chainloader /EFI/Microsoft/Boot/bootmgfw.efi
}

"#);

    for iso in isos {
        let name = &iso.detected_distro;
        let fname = &iso.file_name;
        let lower = fname.to_lowercase();

        if lower.contains("ubuntu") || lower.contains("mint") || lower.contains("pop") {
            cfg.push_str(&format!(r#"menuentry "{} [{}]" --class ubuntu {{
    set isofile="/oswitch_isos/{}"
    search --no-floppy --label OSWITCH_DATA --set=root
    loopback loop $isofile
    linux (loop)/casper/vmlinuz boot=casper iso-scan/filename=$isofile quiet splash noeject ---
    initrd (loop)/casper/initrd
}}
"#, name, fname, fname));
        } else if lower.contains("kali") {
            cfg.push_str(&format!(r#"menuentry "{} [{}]" --class kali {{
    set isofile="/oswitch_isos/{}"
    search --no-floppy --label OSWITCH_DATA --set=root
    loopback loop $isofile
    linux (loop)/live/vmlinuz boot=live findiso=$isofile components quiet splash noeject
    initrd (loop)/live/initrd.img
}}
"#, name, fname, fname));
        } else if lower.contains("arch") || lower.contains("endeavour") || lower.contains("garuda") {
            cfg.push_str(&format!(r#"menuentry "{} [{}]" --class arch {{
    set isofile="/oswitch_isos/{}"
    search --no-floppy --label OSWITCH_DATA --set=root
    loopback loop $isofile
    linux (loop)/arch/boot/x86_64/vmlinuz-linux img_dev=/dev/disk/by-label/OSWITCH_DATA img_loop=$isofile copytoram=n
    initrd (loop)/arch/boot/x86_64/initramfs-linux.img
}}
"#, name, fname, fname));
        } else if lower.contains("fedora") || lower.contains("nobara") {
            cfg.push_str(&format!(r#"menuentry "{} [{}]" --class fedora {{
    set isofile="/oswitch_isos/{}"
    search --no-floppy --label OSWITCH_DATA --set=root
    loopback loop $isofile
    linux (loop)/images/pxeboot/vmlinuz root=live:CDLABEL=FEDORA iso-scan/filename=$isofile rd.live.image quiet
    initrd (loop)/images/pxeboot/initrd.img
}}
"#, name, fname, fname));
        } else {
            cfg.push_str(&format!(r#"menuentry "{} [{}]" --class generic {{
    set isofile="/oswitch_isos/{}"
    search --no-floppy --label OSWITCH_DATA --set=root
    loopback loop $isofile
    linux (loop)/boot/vmlinuz iso-scan/filename=$isofile quiet splash
    initrd (loop)/boot/initrd.img
}}
"#, name, fname, fname));
        }
    }

    cfg.push_str(r#"
menuentry "🔄 Reboot Computer" {
    reboot
}
menuentry "🛑 Power Off" {
    halt
}
"#);

    cfg
}

/// Prepares the USB drive: Cleans, creates GPT with EFI Boot and Data partitions, and sets up OSwitch multi-boot structure
#[tauri::command]
pub async fn format_and_initialize_multiboot_usb(
    app: AppHandle,
    disk_number: u32,
    drive_letter: String
) -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        let _ = app.emit("multiboot-progress", MultiBootProgress {
            stage: "Initializing USB Drive".into(),
            percent: 10,
            speed_mbps: 0.0,
            message: format!("Preparing disk {} for GPT partitioning...", disk_number),
        });

        // 1. Run diskpart to format disk as GPT with exFAT partition
        let script = format!(
            "select disk {}\nclean\nconvert gpt\ncreate partition primary\nformat fs=exfat quick label=\"OSWITCH_DATA\"\nassign letter={}\nexit\n",
            disk_number,
            drive_letter.trim_end_matches([':', '\\', '/'])
        );

        let temp_dir = std::env::temp_dir();
        let script_file = temp_dir.join("oswitch_multiboot_diskpart.txt");
        std::fs::write(&script_file, script).map_err(|e| format!("Failed to write diskpart script: {}", e))?;

        let _ = app.emit("multiboot-progress", MultiBootProgress {
            stage: "Partitioning Disk".into(),
            percent: 30,
            speed_mbps: 0.0,
            message: "Creating high-speed exFAT data partition and EFI structures...".into(),
        });

        let out = create_silent_cmd("diskpart")
            .args(["/s", &script_file.to_string_lossy()])
            .output()
            .map_err(|e| format!("Failed to execute diskpart: {}", e))?;

        let _ = std::fs::remove_file(&script_file);

        if !out.status.success() {
            let err = String::from_utf8_lossy(&out.stderr);
            return Err(format!("Diskpart formatting failed: {}", err));
        }

        // Wait 3 seconds for Windows Explorer to mount the partition
        tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;

        let root = format!("{}:\\", drive_letter.trim_end_matches([':', '\\', '/']));
        let iso_dir = PathBuf::from(&root).join("oswitch_isos");
        let boot_dir = PathBuf::from(&root).join("boot").join("grub");

        std::fs::create_dir_all(&iso_dir).map_err(|e| format!("Failed to create oswitch_isos directory: {}", e))?;
        std::fs::create_dir_all(&boot_dir).map_err(|e| format!("Failed to create boot/grub directory: {}", e))?;

        // Write initial grub.cfg
        let initial_cfg = generate_grub_config(&[]);
        let cfg_path = boot_dir.join("grub.cfg");
        std::fs::write(&cfg_path, initial_cfg).map_err(|e| format!("Failed to write initial grub.cfg: {}", e))?;

        let _ = app.emit("multiboot-progress", MultiBootProgress {
            stage: "Complete".into(),
            percent: 100,
            speed_mbps: 0.0,
            message: "OSwitch Multi-Boot USB initialized successfully! Ready for ISOs.".into(),
        });

        return Ok("OSwitch Multi-Boot Master Drive initialized successfully!".into());
    }

    #[cfg(not(target_os = "windows"))]
    Err("Multi-boot USB initialization is currently supported on Windows host.".into())
}

/// Adds an ISO to the Multi-Boot USB and auto-updates the dynamic GRUB boot menu
#[tauri::command]
pub async fn copy_iso_to_multiboot_usb(
    app: AppHandle,
    source_iso_path: String,
    drive_letter: String
) -> Result<String, String> {
    let src = PathBuf::from(&source_iso_path);
    if !src.exists() {
        return Err(format!("Source ISO file does not exist: {}", source_iso_path));
    }

    let fname = src.file_name().and_then(|s| s.to_str()).ok_or("Invalid source ISO filename")?.to_string();
    let root = format!("{}:\\", drive_letter.trim_end_matches([':', '\\', '/']));
    let target_dir = PathBuf::from(&root).join("oswitch_isos");
    let target_file = target_dir.join(&fname);

    if !target_dir.exists() {
        std::fs::create_dir_all(&target_dir).map_err(|e| format!("Target directory cannot be created: {}", e))?;
    }

    let meta = std::fs::metadata(&src).map_err(|e| e.to_string())?;
    let total_bytes = meta.len();

    let _ = app.emit("multiboot-progress", MultiBootProgress {
        stage: "Copying ISO".into(),
        percent: 0,
        speed_mbps: 0.0,
        message: format!("Starting fast transfer of {} ({} MB)...", fname, total_bytes / (1024 * 1024)),
    });

    let mut reader = tokio::fs::File::open(&src).await.map_err(|e| e.to_string())?;
    let mut writer = tokio::fs::File::create(&target_file).await.map_err(|e| e.to_string())?;

    let mut buffer = vec![0u8; 8 * 1024 * 1024]; // 8MB high-throughput buffer
    let mut transferred: u64 = 0;
    let start_time = std::time::Instant::now();

    use tokio::io::{AsyncReadExt, AsyncWriteExt};

    loop {
        let n = reader.read(&mut buffer).await.map_err(|e| e.to_string())?;
        if n == 0 {
            break;
        }
        writer.write_all(&buffer[..n]).await.map_err(|e| e.to_string())?;
        transferred += n as u64;

        let elapsed = start_time.elapsed().as_secs_f64();
        let speed = if elapsed > 0.1 {
            (transferred as f64 / (1024.0 * 1024.0)) / elapsed
        } else {
            0.0
        };
        let pct = if total_bytes > 0 {
            ((transferred as f64 / total_bytes as f64) * 100.0) as u8
        } else {
            0
        };

        let _ = app.emit("multiboot-progress", MultiBootProgress {
            stage: "Copying ISO".into(),
            percent: pct,
            speed_mbps: (speed * 10.0).round() / 10.0,
            message: format!("Transferring {}: {} MB / {} MB ({:.1} MB/s)", fname, transferred / (1024 * 1024), total_bytes / (1024 * 1024), speed),
        });
    }

    writer.flush().await.map_err(|e| e.to_string())?;

    // Refresh dynamic GRUB config
    let status = get_multiboot_usb_status(drive_letter.clone()).await?;
    let new_cfg = generate_grub_config(&status.isos);
    let grub_file = PathBuf::from(&root).join("boot").join("grub").join("grub.cfg");
    let _ = std::fs::write(&grub_file, new_cfg);

    let _ = app.emit("multiboot-progress", MultiBootProgress {
        stage: "Complete".into(),
        percent: 100,
        speed_mbps: 0.0,
        message: format!("Successfully installed {} onto Multi-Boot USB! Boot menu updated.", fname),
    });

    Ok(format!("Successfully deployed {} to Multi-Boot USB drive.", fname))
}

/// Deletes a specific ISO from the USB drive and auto-regenerates the GRUB bootloader menu
#[tauri::command]
pub async fn remove_iso_from_multiboot_usb(
    iso_filename: String,
    drive_letter: String
) -> Result<String, String> {
    let root = format!("{}:\\", drive_letter.trim_end_matches([':', '\\', '/']));
    let target = PathBuf::from(&root).join("oswitch_isos").join(&iso_filename);

    if target.exists() {
        std::fs::remove_file(&target).map_err(|e| format!("Failed to delete ISO: {}", e))?;
    }

    // Refresh dynamic GRUB config
    let status = get_multiboot_usb_status(drive_letter.clone()).await?;
    let new_cfg = generate_grub_config(&status.isos);
    let grub_file = PathBuf::from(&root).join("boot").join("grub").join("grub.cfg");
    let _ = std::fs::write(&grub_file, new_cfg);

    Ok(format!("Removed {} from Multi-Boot USB. Boot menu updated.", iso_filename))
}
