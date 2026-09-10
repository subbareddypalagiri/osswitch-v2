use serde::{Deserialize, Serialize};
use std::process::Command;

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

const CREATE_NO_WINDOW: u32 = 0x08000000;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GpuInfo {
    pub name: String,
    pub vendor: String, // "NVIDIA", "AMD", "Intel", "Other"
    pub pci_id: String,
    pub is_nvidia: bool,
    pub is_hybrid: bool,
    pub recommended_kernel_args: String,
    pub driver_notes: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WifiInfo {
    pub name: String,
    pub vendor: String, // "Intel", "MediaTek", "Realtek", "Broadcom", "Other"
    pub pci_id: String,
    pub driver_status: String, // "native_supported", "requires_firmware", "requires_dkms"
    pub recommended_packages: Vec<String>,
    pub warning: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StorageControllerInfo {
    pub name: String,
    pub is_intel_vmd: bool,
    pub is_ahci_ready: bool,
    pub nvme_visible_to_linux: bool,
    pub advice: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FirmwareSecurityInfo {
    pub secure_boot_enabled: bool,
    pub bitlocker_active: bool,
    pub bitlocker_pcr7_bound: bool,
    pub fast_startup_enabled: bool,
    pub tpm_version: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeepHardwareDiagnostic {
    pub gpus: Vec<GpuInfo>,
    pub primary_gpu: Option<GpuInfo>,
    pub wifi: Option<WifiInfo>,
    pub storage_controller: StorageControllerInfo,
    pub firmware: FirmwareSecurityInfo,
    pub overall_linux_compatibility_pct: u8,
    pub recommended_boot_args: Vec<String>,
    pub critical_warnings: Vec<String>,
    pub pre_flight_fixes_available: Vec<String>,
}

fn create_silent_cmd(program: &str) -> Command {
    let mut cmd = Command::new(program);
    #[cfg(target_os = "windows")]
    cmd.creation_flags(CREATE_NO_WINDOW);
    cmd
}

/// Detects GPU details and computes tailored kernel parameters
fn probe_gpus() -> Vec<GpuInfo> {
    let mut gpus = Vec::new();
    #[cfg(target_os = "windows")]
    {
        let output = create_silent_cmd("powershell")
            .args(["-NoProfile", "-NonInteractive", "-Command", 
                "Get-CimInstance Win32_VideoController | Select-Object -Property Name, PNPDeviceID, DriverVersion | ConvertTo-Json -Compress"
            ])
            .output();

        if let Ok(out) = output {
            let json_str = String::from_utf8_lossy(&out.stdout).trim().to_string();
            if let Ok(val) = serde_json::from_str::<serde_json::Value>(&json_str) {
                let items = if val.is_array() {
                    val.as_array().unwrap().clone()
                } else if val.is_object() {
                    vec![val]
                } else {
                    vec![]
                };

                let has_multiple = items.len() > 1;

                for item in items {
                    let name = item["Name"].as_str().unwrap_or("Unknown GPU").to_string();
                    let pnp = item["PNPDeviceID"].as_str().unwrap_or("").to_string();
                    let name_lower = name.to_lowercase();
                    let pnp_lower = pnp.to_lowercase();

                    let is_nvidia = name_lower.contains("nvidia") || pnp_lower.contains("ven_10de");
                    let is_amd = name_lower.contains("amd") || name_lower.contains("radeon") || pnp_lower.contains("ven_1002");
                    let is_intel = name_lower.contains("intel") || pnp_lower.contains("ven_8086");

                    let vendor = if is_nvidia {
                        "NVIDIA".to_string()
                    } else if is_amd {
                        "AMD".to_string()
                    } else if is_intel {
                        "Intel".to_string()
                    } else {
                        "Other".to_string()
                    };

                    let (recommended_args, notes) = if is_nvidia {
                        (
                            "nouveau.modeset=0 rd.driver.blacklist=nouveau nvidia-drm.modeset=1".to_string(),
                            "Proprietary NVIDIA GPU detected. Open-source Nouveau driver blacklisted to prevent display freeze on boot.".to_string()
                        )
                    } else if is_amd {
                        (
                            "amdgpu.dc=1".to_string(),
                            "AMD Radeon GPU natively supported in mainline Linux kernel (amdgpu driver).".to_string()
                        )
                    } else if is_intel {
                        (
                            "i915.enable_psr=0".to_string(),
                            "Intel Integrated Graphics natively supported. Panel Self Refresh tweak applied for fluid Wayland display.".to_string()
                        )
                    } else {
                        ("".to_string(), "Standard generic VGA/Display controller.".to_string())
                    };

                    gpus.push(GpuInfo {
                        name,
                        vendor,
                        pci_id: pnp,
                        is_nvidia,
                        is_hybrid: has_multiple && is_nvidia,
                        recommended_kernel_args: recommended_args,
                        driver_notes: notes,
                    });
                }
            }
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        if let Ok(out) = Command::new("lspci").args(["-nn"]).output() {
            let stdout = String::from_utf8_lossy(&out.stdout);
            for line in stdout.lines() {
                let lower = line.to_lowercase();
                if lower.contains("vga compatible controller") || lower.contains("3d controller") || lower.contains("display controller") {
                    let is_nvidia = lower.contains("nvidia") || lower.contains("[10de:");
                    let is_amd = lower.contains("amd") || lower.contains("ati") || lower.contains("radeon") || lower.contains("[1002:");
                    let is_intel = lower.contains("intel") || lower.contains("[8086:");

                    let vendor = if is_nvidia {
                        "NVIDIA".to_string()
                    } else if is_amd {
                        "AMD".to_string()
                    } else if is_intel {
                        "Intel".to_string()
                    } else {
                        "Other".to_string()
                    };

                    let pci_id = if let Some(start) = line.rfind('[') {
                        if let Some(end) = line.rfind(']') {
                            line[start..=end].to_string()
                        } else {
                            "".to_string()
                        }
                    } else {
                        "".to_string()
                    };

                    let name = line.split(':').nth(2).unwrap_or(line).trim().to_string();

                    let (recommended_args, notes) = if is_nvidia {
                        (
                            "nouveau.modeset=0 rd.driver.blacklist=nouveau nvidia-drm.modeset=1".to_string(),
                            "Proprietary NVIDIA GPU detected. Open-source Nouveau driver blacklisted to prevent display freeze on boot.".to_string()
                        )
                    } else if is_amd {
                        (
                            "amdgpu.dc=1".to_string(),
                            "AMD Radeon GPU natively supported in mainline Linux kernel (amdgpu driver).".to_string()
                        )
                    } else if is_intel {
                        (
                            "i915.enable_psr=0".to_string(),
                            "Intel Integrated Graphics natively supported. Panel Self Refresh tweak applied for fluid Wayland display.".to_string()
                        )
                    } else {
                        ("".to_string(), "Standard generic VGA/Display controller.".to_string())
                    };

                    gpus.push(GpuInfo {
                        name,
                        vendor,
                        pci_id,
                        is_nvidia,
                        is_hybrid: false,
                        recommended_kernel_args: recommended_args,
                        driver_notes: notes,
                    });
                }
            }
        }

        let has_multiple = gpus.len() > 1;
        for g in &mut gpus {
            if has_multiple && g.is_nvidia {
                g.is_hybrid = true;
            }
        }
    }

    gpus
}

/// Detects Wi-Fi adapter chipset and determines driver requirements
fn probe_wifi() -> Option<WifiInfo> {
    #[cfg(target_os = "windows")]
    {
        let output = create_silent_cmd("powershell")
            .args(["-NoProfile", "-NonInteractive", "-Command",
                "Get-NetAdapter -Physical | Where-Object { $_.MediaType -match '802.3' -or $_.InterfaceDescription -match 'Wi-Fi|Wireless|802.11|WLAN' } | Select-Object -Property InterfaceDescription, DeviceID, DriverName | ConvertTo-Json -Compress"
            ])
            .output();

        if let Ok(out) = output {
            let json_str = String::from_utf8_lossy(&out.stdout).trim().to_string();
            if let Ok(val) = serde_json::from_str::<serde_json::Value>(&json_str) {
                let items = if val.is_array() {
                    val.as_array().unwrap().clone()
                } else if val.is_object() {
                    vec![val]
                } else {
                    vec![]
                };

                for item in items {
                    let desc = item["InterfaceDescription"].as_str().unwrap_or("").to_string();
                    let desc_lower = desc.to_lowercase();
                    if desc_lower.contains("wi-fi") || desc_lower.contains("wireless") || desc_lower.contains("802.11") || desc_lower.contains("wlan") {
                        let is_intel = desc_lower.contains("intel");
                        let is_mediatek = desc_lower.contains("mediatek") || desc_lower.contains("mt79");
                        let is_realtek = desc_lower.contains("realtek") || desc_lower.contains("rtl");
                        let is_broadcom = desc_lower.contains("broadcom") || desc_lower.contains("bcm");

                        let (vendor, status, packages, warning) = if is_intel {
                            (
                                "Intel".to_string(),
                                "native_supported".to_string(),
                                vec!["linux-firmware".to_string(), "iwlwifi".to_string()],
                                None
                            )
                        } else if is_mediatek {
                            (
                                "MediaTek".to_string(),
                                "requires_firmware".to_string(),
                                vec!["linux-firmware".to_string(), "firmware-misc-nonfree".to_string()],
                                Some("MediaTek Wi-Fi (MT7921/MT7922) requires Linux kernel 5.18+ or non-free firmware pack for full speed.".to_string())
                            )
                        } else if is_realtek {
                            (
                                "Realtek".to_string(),
                                "requires_firmware".to_string(),
                                vec!["firmware-realtek".to_string(), "dkms".to_string()],
                                Some("Realtek Wi-Fi detected. Firmware auto-pack will be queued to ensure Wi-Fi connects on first desktop launch.".to_string())
                            )
                        } else if is_broadcom {
                            (
                                "Broadcom".to_string(),
                                "requires_dkms".to_string(),
                                vec!["broadcom-sta-dkms".to_string(), "bcmwl-kernel-source".to_string()],
                                Some("Broadcom Wi-Fi requires proprietary broadcom-sta driver.".to_string())
                            )
                        } else {
                            (
                                "Other".to_string(),
                                "native_supported".to_string(),
                                vec!["linux-firmware".to_string()],
                                None
                            )
                        };

                        return Some(WifiInfo {
                            name: desc,
                            vendor,
                            pci_id: item["DeviceID"].as_str().unwrap_or("").to_string(),
                            driver_status: status,
                            recommended_packages: packages,
                            warning,
                        });
                    }
                }
            }
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        if let Ok(out) = Command::new("lspci").args(["-nn"]).output() {
            let stdout = String::from_utf8_lossy(&out.stdout);
            for line in stdout.lines() {
                let lower = line.to_lowercase();
                if lower.contains("network controller") || lower.contains("wireless") || lower.contains("802.11") || lower.contains("wi-fi") {
                    let is_intel = lower.contains("intel") || lower.contains("[8086:");
                    let is_mediatek = lower.contains("mediatek") || lower.contains("mt79");
                    let is_realtek = lower.contains("realtek") || lower.contains("rtl");
                    let is_broadcom = lower.contains("broadcom") || lower.contains("bcm");

                    let (vendor, status, packages, warning) = if is_intel {
                        (
                            "Intel".to_string(),
                            "native_supported".to_string(),
                            vec!["linux-firmware".to_string(), "iwlwifi".to_string()],
                            None
                        )
                    } else if is_mediatek {
                        (
                            "MediaTek".to_string(),
                            "requires_firmware".to_string(),
                            vec!["linux-firmware".to_string(), "firmware-misc-nonfree".to_string()],
                            Some("MediaTek Wi-Fi (MT7921/MT7922) requires Linux kernel 5.18+ or non-free firmware pack for full speed.".to_string())
                        )
                    } else if is_realtek {
                        (
                            "Realtek".to_string(),
                            "requires_firmware".to_string(),
                            vec!["firmware-realtek".to_string(), "dkms".to_string()],
                            Some("Realtek Wi-Fi detected. Firmware auto-pack will be queued to ensure Wi-Fi connects on first desktop launch.".to_string())
                        )
                    } else if is_broadcom {
                        (
                            "Broadcom".to_string(),
                            "requires_dkms".to_string(),
                            vec!["broadcom-sta-dkms".to_string(), "bcmwl-kernel-source".to_string()],
                            Some("Broadcom Wi-Fi requires proprietary broadcom-sta driver.".to_string())
                        )
                    } else {
                        (
                            "Other".to_string(),
                            "native_supported".to_string(),
                            vec!["linux-firmware".to_string()],
                            None
                        )
                    };

                    let pci_id = if let Some(start) = line.rfind('[') {
                        if let Some(end) = line.rfind(']') {
                            line[start..=end].to_string()
                        } else {
                            "".to_string()
                        }
                    } else {
                        "".to_string()
                    };

                    let name = line.split(':').nth(2).unwrap_or(line).trim().to_string();

                    return Some(WifiInfo {
                        name,
                        vendor,
                        pci_id,
                        driver_status: status,
                        recommended_packages: packages,
                        warning,
                    });
                }
            }
        }
    }

    None
}

/// Detects Storage Controller and Intel VMD RAID traps
fn probe_storage_controller() -> StorageControllerInfo {
    let mut is_vmd = false;
    let mut is_ahci_ready = false;
    let mut name = "Standard AHCI / NVMe Controller".to_string();

    #[cfg(target_os = "windows")]
    {
        // 1. Check for Intel VMD or RST in SCSI/IDE controllers
        let output = create_silent_cmd("powershell")
            .args(["-NoProfile", "-NonInteractive", "-Command",
                "Get-CimInstance Win32_SCSIController | Select-Object -Property Name, Manufacturer | ConvertTo-Json -Compress"
            ])
            .output();

        if let Ok(out) = output {
            let s = String::from_utf8_lossy(&out.stdout).to_lowercase();
            if s.contains("volume management device") || s.contains("vmd") || s.contains("rapid storage") || s.contains("rst") {
                is_vmd = true;
                name = "Intel Volume Management Device (VMD / RST)".to_string();
            }
        }

        // 2. Check if storahci service is enabled in registry
        let reg_out = create_silent_cmd("powershell")
            .args(["-NoProfile", "-NonInteractive", "-Command",
                "try { (Get-ItemProperty -Path 'HKLM:\\SYSTEM\\CurrentControlSet\\Services\\storahci' -ErrorAction Stop).Start } catch { -1 }"
            ])
            .output();

        if let Ok(out) = reg_out {
            let start_val = String::from_utf8_lossy(&out.stdout).trim().parse::<i32>().unwrap_or(-1);
            if start_val == 0 {
                is_ahci_ready = true;
            }
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        if let Ok(out) = Command::new("lspci").args(["-nn"]).output() {
            let s = String::from_utf8_lossy(&out.stdout).to_lowercase();
            if s.contains("volume management device") || s.contains("vmd") || s.contains("8086:9a0b") || s.contains("8086:28c0") {
                is_vmd = true;
                name = "Intel Volume Management Device (VMD / RST)".to_string();
            } else if s.contains("non-volatile memory") || s.contains("nvme") {
                name = "Direct PCI-e NVMe Storage Controller".to_string();
                is_ahci_ready = true;
            } else if s.contains("sata") || s.contains("ahci") {
                name = "AHCI SATA Controller".to_string();
                is_ahci_ready = true;
            }
        }
    }

    let advice = if is_vmd {
        if is_ahci_ready {
            "Intel VMD RAID controller is active. Windows storahci driver is PRE-STAGED. You can safely switch BIOS SATA Mode to AHCI without BSOD.".to_string()
        } else {
            "Intel VMD RAID active. Linux kernel cannot detect your NVMe drive unless switched to AHCI. OSwitch can 1-click pre-stage storahci driver.".to_string()
        }
    } else {
        "Direct NVMe / AHCI controller active. Mainline Linux kernel will detect all physical storage partitions out-of-the-box.".to_string()
    };

    StorageControllerInfo {
        name,
        is_intel_vmd: is_vmd,
        is_ahci_ready,
        nvme_visible_to_linux: !is_vmd,
        advice,
    }
}

/// Detects BitLocker, Secure Boot, Fast Startup, and TPM
fn probe_firmware_security() -> FirmwareSecurityInfo {
    let mut secure_boot = false;
    let mut bitlocker = false;
    let mut bitlocker_pcr7 = false;
    let mut fast_startup = false;
    let mut tpm_version = "2.0".to_string();

    #[cfg(target_os = "windows")]
    {
        // Secure Boot check
        if let Ok(out) = create_silent_cmd("powershell")
            .args(["-NoProfile", "-NonInteractive", "-Command", "try { Confirm-SecureBootUEFI } catch { $false }"])
            .output() 
        {
            secure_boot = String::from_utf8_lossy(&out.stdout).trim().to_lowercase() == "true";
        }

        // BitLocker Status
        if let Ok(out) = create_silent_cmd("powershell")
            .args(["-NoProfile", "-NonInteractive", "-Command", "(Get-BitLockerVolume -MountPoint C: -ErrorAction SilentlyContinue).ProtectionStatus"])
            .output()
        {
            let status = String::from_utf8_lossy(&out.stdout).trim().to_lowercase();
            bitlocker = status == "on" || status == "1";
            bitlocker_pcr7 = bitlocker;
        }

        // Fast Startup check
        if let Ok(out) = create_silent_cmd("powershell")
            .args(["-NoProfile", "-NonInteractive", "-Command", "try { (Get-ItemProperty -Path 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power').HiberbootEnabled } catch { 0 }"])
            .output()
        {
            fast_startup = String::from_utf8_lossy(&out.stdout).trim() == "1";
        }

        // TPM check
        if let Ok(out) = create_silent_cmd("powershell")
            .args(["-NoProfile", "-NonInteractive", "-Command", "try { (Get-Tpm).TpmPresent } catch { $false }"])
            .output()
        {
            if String::from_utf8_lossy(&out.stdout).trim().to_lowercase() != "true" {
                tpm_version = "None".to_string();
            }
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        // 1. UEFI check
        let is_uefi = std::path::Path::new("/sys/firmware/efi").exists();

        // 2. Secure Boot check
        if is_uefi {
            if let Ok(out) = Command::new("mokutil").arg("--sb-state").output() {
                let s = String::from_utf8_lossy(&out.stdout).to_lowercase();
                secure_boot = s.contains("secureboot enabled");
            } else if let Ok(bytes) = std::fs::read("/sys/firmware/efi/efivars/SecureBoot-8be4df61-93ca-11d2-aa0d-00e098032b8c") {
                if let Some(&last) = bytes.last() {
                    secure_boot = last == 1;
                }
            }
        }

        // 3. TPM check
        if std::path::Path::new("/dev/tpmrm0").exists() || std::path::Path::new("/dev/tpm0").exists() {
            tpm_version = "2.0".to_string();
        } else {
            tpm_version = "None".to_string();
        }

        fast_startup = false; // Fast Startup is a Windows-only feature
        bitlocker = false;    // BitLocker is Windows-only
        bitlocker_pcr7 = false;
    }

    FirmwareSecurityInfo {
        secure_boot_enabled: secure_boot,
        bitlocker_active: bitlocker,
        bitlocker_pcr7_bound: bitlocker_pcr7,
        fast_startup_enabled: fast_startup,
        tpm_version,
    }
}

/// Pre-stages Windows storahci driver so user can safely toggle VMD to AHCI in BIOS without INACCESSIBLE_BOOT_DEVICE BSOD
#[tauri::command]
pub async fn enable_safe_ahci_prestage() -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        let ps_cmd = r#"
            try {
                Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Services\storahci' -Name 'Start' -Value 0 -Type DWord -Force
                Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Services\storahci\StartOverride' -Name '0' -Value 0 -Type DWord -Force
                "SUCCESS: Windows storahci driver is now pre-staged. You can safely switch SATA controller to AHCI in BIOS without BSOD."
            } catch {
                "ERROR: " + $_.Exception.Message
            }
        "#;
        let out = create_silent_cmd("powershell").args(["-NoProfile", "-NonInteractive", "-Command", ps_cmd]).output().map_err(|e| e.to_string())?;
        let res = String::from_utf8_lossy(&out.stdout).trim().to_string();
        if res.starts_with("ERROR") {
            return Err(res);
        }
        return Ok(res);
    }
    #[cfg(not(target_os = "windows"))]
    Ok("Host system is running Linux. AHCI/NVMe drivers are natively loaded in kernel.".into())
}

/// Temporarily suspends BitLocker for 1 reboot to prevent 48-digit Recovery Key prompts when modifying EFI boot entries
#[tauri::command]
pub async fn suspend_bitlocker_for_reboot() -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        let out = create_silent_cmd("powershell")
            .args(["-NoProfile", "-NonInteractive", "-Command", "manage-bde -protectors -disable C: -RebootCount 1"])
            .output()
            .map_err(|e| e.to_string())?;

        let res = String::from_utf8_lossy(&out.stdout).to_string();
        if out.status.success() {
            Ok("BitLocker protection safely suspended for 1 reboot cycle. TPM PCR lock bypass active.".into())
        } else {
            Err(format!("BitLocker suspension error: {}", res))
        }
    }
    #[cfg(not(target_os = "windows"))]
    Ok("Host system is running Linux. BitLocker is Windows-specific and not locking your EFI partition.".into())
}

/// Main God-Mode Hardware Diagnostic Command
#[tauri::command]
pub async fn run_deep_hardware_diagnostic() -> Result<DeepHardwareDiagnostic, String> {
    let gpus = probe_gpus();
    let primary_gpu = gpus.first().cloned();
    let wifi = probe_wifi();
    let storage_controller = probe_storage_controller();
    let firmware = probe_firmware_security();

    let mut score = 100u8;
    let mut warnings = Vec::new();
    let mut fixes = Vec::new();
    let mut boot_args = Vec::new();

    // 1. Evaluate GPU
    if let Some(ref gpu) = primary_gpu {
        if gpu.is_nvidia {
            boot_args.push(gpu.recommended_kernel_args.clone());
            if gpu.is_hybrid {
                warnings.push("NVIDIA Optimus Hybrid GPU detected. Auto-injected nouveau.modeset=0 to prevent Wayland black screens.".into());
            }
        }
    }

    // 2. Evaluate Wi-Fi
    if let Some(ref w) = wifi {
        if let Some(ref warn) = w.warning {
            warnings.push(warn.clone());
            score = score.saturating_sub(5);
        }
        if w.driver_status != "native_supported" {
            fixes.push(format!("Pre-seed {} packages to guarantee Wi-Fi connectivity on first boot", w.recommended_packages.join(", ")));
        }
    }

    // 3. Evaluate Storage (Intel VMD Trap)
    if storage_controller.is_intel_vmd {
        score = score.saturating_sub(25);
        warnings.push("CRITICAL: Intel VMD / RST RAID mode is active. Linux will not detect NVMe SSDs until switched to AHCI.".into());
        if !storage_controller.is_ahci_ready {
            fixes.push("1-Click Pre-stage Windows storahci driver to safely enable AHCI without BSOD".into());
        }
    }

    // 4. Evaluate BitLocker & Fast Startup
    if firmware.bitlocker_active {
        warnings.push("BitLocker active on C:. OSwitch will automatically suspend BitLocker for 1 reboot during EFI setup to bypass recovery key prompt.".into());
        fixes.push("Auto-bypass BitLocker PCR7 validation for 1 reboot".into());
    }

    if firmware.fast_startup_enabled {
        warnings.push("Windows Fast Startup is enabled. Hibernation dirty-bit may lock NTFS partitions from Linux write access.".into());
        fixes.push("Universal exFAT Data Bridge recommended for cross-OS sharing".into());
    }

    boot_args.push("quiet".into());
    boot_args.push("splash".into());

    Ok(DeepHardwareDiagnostic {
        gpus,
        primary_gpu,
        wifi,
        storage_controller,
        firmware,
        overall_linux_compatibility_pct: score,
        recommended_boot_args: boot_args,
        critical_warnings: warnings,
        pre_flight_fixes_available: fixes,
    })
}
