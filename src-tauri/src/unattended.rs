use std::path::{Path, PathBuf};

/// Generates vendor-compliant Windows autounattend.xml
/// Bypasses Windows 11 TPM 2.0, Secure Boot, RAM & CPU requirements in WinPE,
/// Automates partitioning, creates user account, suppresses OOBE telemetry,
/// and executes FirstLogon developer bootstrap.
pub fn generate_autounattend_xml(username: &str, password: &str, _hostname: &str) -> String {
    format!(
r#"<?xml version="1.0" encoding="utf-8"?>
<unattend xmlns="urn:schemas-microsoft-com:unattend">
    <settings pass="windowsPE">
        <component name="Microsoft-Windows-Setup" processorArchitecture="amd64" publicKeyToken="31bf3856ad364e35" language="neutral" versionScope="nonSxS" xmlns:wcm="http://schemas.microsoft.com/WMIConfig/2002/State" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
            <RunSynchronous>
                <RunSynchronousCommand wcm:action="add">
                    <Order>1</Order>
                    <Path>reg add HKLM\SYSTEM\Setup\LabConfig /v BypassTPMCheck /t REG_DWORD /d 1 /f</Path>
                </RunSynchronousCommand>
                <RunSynchronousCommand wcm:action="add">
                    <Order>2</Order>
                    <Path>reg add HKLM\SYSTEM\Setup\LabConfig /v BypassSecureBootCheck /t REG_DWORD /d 1 /f</Path>
                </RunSynchronousCommand>
                <RunSynchronousCommand wcm:action="add">
                    <Order>3</Order>
                    <Path>reg add HKLM\SYSTEM\Setup\LabConfig /v BypassRAMCheck /t REG_DWORD /d 1 /f</Path>
                </RunSynchronousCommand>
                <RunSynchronousCommand wcm:action="add">
                    <Order>4</Order>
                    <Path>reg add HKLM\SYSTEM\Setup\LabConfig /v BypassCPUCheck /t REG_DWORD /d 1 /f</Path>
                </RunSynchronousCommand>
                <RunSynchronousCommand wcm:action="add">
                    <Order>5</Order>
                    <Path>reg add HKLM\SYSTEM\Setup\LabConfig /v BypassStorageCheck /t REG_DWORD /d 1 /f</Path>
                </RunSynchronousCommand>
            </RunSynchronous>
            <DiskConfiguration>
                <Disk wcm:action="add">
                    <DiskID>0</DiskID>
                    <WillWipeDisk>true</WillWipeDisk>
                    <CreatePartitions>
                        <CreatePartition wcm:action="add">
                            <Order>1</Order>
                            <Type>EFI</Type>
                            <Size>260</Size>
                        </CreatePartition>
                        <CreatePartition wcm:action="add">
                            <Order>2</Order>
                            <Type>MSR</Type>
                            <Size>128</Size>
                        </CreatePartition>
                        <CreatePartition wcm:action="add">
                            <Order>3</Order>
                            <Type>Primary</Type>
                            <Extend>true</Extend>
                        </CreatePartition>
                    </CreatePartitions>
                    <ModifyPartitions>
                        <ModifyPartition wcm:action="add">
                            <Order>1</Order>
                            <PartitionID>1</PartitionID>
                            <Format>FAT32</Format>
                            <Label>System</Label>
                        </ModifyPartition>
                        <ModifyPartition wcm:action="add">
                            <Order>2</Order>
                            <PartitionID>2</PartitionID>
                        </ModifyPartition>
                        <ModifyPartition wcm:action="add">
                            <Order>3</Order>
                            <PartitionID>3</PartitionID>
                            <Format>NTFS</Format>
                            <Label>Windows</Label>
                            <Letter>C</Letter>
                        </ModifyPartition>
                    </ModifyPartitions>
                </Disk>
            </DiskConfiguration>
            <ImageInstall>
                <OSImage>
                    <InstallTo>
                        <DiskID>0</DiskID>
                        <PartitionID>3</PartitionID>
                    </InstallTo>
                    <WillShowUI>OnError</WillShowUI>
                </OSImage>
            </ImageInstall>
            <UserData>
                <ProductKey>
                    <WillShowUI>Never</WillShowUI>
                </ProductKey>
                <AcceptEula>true</AcceptEula>
                <FullName>{}</FullName>
                <Organization>OSwitch Automated Workstation</Organization>
            </UserData>
        </component>
        <component name="Microsoft-Windows-International-Core-WinPE" processorArchitecture="amd64" publicKeyToken="31bf3856ad364e35" language="neutral" versionScope="nonSxS" xmlns:wcm="http://schemas.microsoft.com/WMIConfig/2002/State" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
            <SetupUILanguage>
                <UILanguage>en-US</UILanguage>
            </SetupUILanguage>
            <InputLocale>en-US</InputLocale>
            <SystemLocale>en-US</SystemLocale>
            <UILanguage>en-US</UILanguage>
            <UserLocale>en-US</UserLocale>
        </component>
    </settings>
    <settings pass="oobeSystem">
        <component name="Microsoft-Windows-Shell-Setup" processorArchitecture="amd64" publicKeyToken="31bf3856ad364e35" language="neutral" versionScope="nonSxS" xmlns:wcm="http://schemas.microsoft.com/WMIConfig/2002/State" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
            <AutoLogon>
                <Password>
                    <Value>{}</Value>
                    <PlainText>true</PlainText>
                </Password>
                <Enabled>true</Enabled>
                <LogonCount>5</LogonCount>
                <Username>{}</Username>
            </AutoLogon>
            <OOBE>
                <HideEULAPage>true</HideEULAPage>
                <HideLocalAccountScreen>true</HideLocalAccountScreen>
                <HideOEMRegistrationScreen>true</HideOEMRegistrationScreen>
                <HideOnlineAccountScreens>true</HideOnlineAccountScreens>
                <HideWirelessSetupInOOBE>true</HideWirelessSetupInOOBE>
                <ProtectYourPC>3</ProtectYourPC>
            </OOBE>
            <UserAccounts>
                <LocalAccounts>
                    <LocalAccount wcm:action="add">
                        <Password>
                            <Value>{}</Value>
                            <PlainText>true</PlainText>
                        </Password>
                        <Description>OSwitch User</Description>
                        <DisplayName>{}</DisplayName>
                        <Group>Administrators</Group>
                        <Name>{}</Name>
                    </LocalAccount>
                </LocalAccounts>
            </UserAccounts>
            <FirstLogonCommands>
                <SynchronousCommand wcm:action="add">
                    <Order>1</Order>
                    <CommandLine>powershell -NoProfile -ExecutionPolicy Bypass -Command "if (Test-Path 'C:\OSwitch\OSwitch_setup_dev_env.bat') {{ Start-Process 'C:\OSwitch\OSwitch_setup_dev_env.bat' -NoNewWindow }}"</CommandLine>
                    <Description>OSwitch Developer Environment Auto-Provisioner</Description>
                </SynchronousCommand>
            </FirstLogonCommands>
        </component>
    </settings>
</unattend>"#,
        username, password, username, password, username, username
    )
}

/// Generates Subiquity / Cloud-Init autoinstall user-data for Ubuntu/Debian
pub fn generate_cloud_init_user_data(username: &str, password: &str, hostname: &str) -> String {
    format!(
r#"#cloud-config
autoinstall:
  version: 1
  locale: en_US.UTF-8
  keyboard:
    layout: us
  identity:
    realname: {user}
    username: {user}
    password: "$6$rounds=4096$oswitchsalt$HqVj94GZ.eF3YhC0aQd9Qd1s5uC6bM9gZ1uG3lH7sQ1yJ3mK5oP7rS9tU1vW3xY5z"
    hostname: {host}
  ssh:
    install-server: true
    allow-pw: true
  storage:
    layout:
      name: direct
  packages:
    - curl
    - wget
    - git
    - build-essential
  late-commands:
    - curtin in-target --target=/target -- bash -c "echo '{user}:{pass}' | chpasswd"
    - curtin in-target --target=/target -- bash -c "if [ -f /tmp/OSwitch_setup_dev_env.sh ]; then cp /tmp/OSwitch_setup_dev_env.sh /home/{user}/ && chmod +x /home/{user}/OSwitch_setup_dev_env.sh; fi"
"#,
        user = username,
        pass = password,
        host = hostname
    )
}

/// Generates Cloud-Init meta-data
pub fn generate_cloud_init_meta_data(hostname: &str) -> String {
    format!("instance-id: oswitch-auto-01\nlocal-hostname: {}\n", hostname)
}

/// Generates Anaconda kickstart configuration for Fedora / RHEL / CentOS
pub fn generate_kickstart_cfg(username: &str, password: &str, hostname: &str) -> String {
    format!(
r#"# OSwitch Unattended Kickstart Configuration
lang en_US.UTF-8
keyboard us
timezone Asia/Kolkata --utc
network --hostname={host}
rootpw --plaintext {pass}
user --name={user} --password={pass} --plaintext --groups=wheel
autopart
clearpart --all --initlabel
reboot

%packages
@core
curl
wget
git
%end

%post
echo "OSwitch Unattended Kickstart provisioning complete."
%end
"#,
        host = hostname,
        pass = password,
        user = username
    )
}

fn put_u16_both(buf: &mut [u8], val: u16) {
    buf[0] = (val & 0xFF) as u8;
    buf[1] = ((val >> 8) & 0xFF) as u8;
    buf[2] = ((val >> 8) & 0xFF) as u8;
    buf[3] = (val & 0xFF) as u8;
}

fn put_u32_both(buf: &mut [u8], val: u32) {
    let le = val.to_le_bytes();
    let be = val.to_be_bytes();
    buf[0..4].copy_from_slice(&le);
    buf[4..8].copy_from_slice(&be);
}

/// Generates a standardized ISO-9660 volume labeled CIDATA containing cloud-init & unattended answer files
pub fn generate_cidata_iso(target_path: &Path, files: &[(&str, &[u8])]) -> Result<(), String> {
    const SECTOR_SIZE: usize = 2048;
    
    // Files start at sector 20
    let mut file_sectors = Vec::new();
    let mut current_sector = 20u32;
    for (_name, data) in files {
        let sectors_needed = ((data.len() + SECTOR_SIZE - 1) / SECTOR_SIZE).max(1) as u32;
        file_sectors.push((current_sector, sectors_needed));
        current_sector += sectors_needed;
    }
    let total_sectors = current_sector;

    let mut iso = vec![0u8; total_sectors as usize * SECTOR_SIZE];

    // Sector 16: Primary Volume Descriptor (PVD)
    let pvd = &mut iso[16 * SECTOR_SIZE..17 * SECTOR_SIZE];
    pvd[0] = 0x01; // PVD Type
    pvd[1..6].copy_from_slice(b"CD001");
    pvd[6] = 0x01; // Version
    pvd[8..40].copy_from_slice(b"OSWITCH                         "); // System ID (32)
    pvd[40..72].copy_from_slice(b"CIDATA                          "); // Volume ID (32)
    put_u32_both(&mut pvd[80..88], total_sectors); // Volume Space Size
    put_u16_both(&mut pvd[120..124], 1); // Volume Set Size
    put_u16_both(&mut pvd[124..128], 1); // Volume Sequence Number
    put_u16_both(&mut pvd[128..132], SECTOR_SIZE as u16); // Logical Block Size
    put_u32_both(&mut pvd[132..140], 10); // Path Table Size
    pvd[140..144].copy_from_slice(&18u32.to_le_bytes()); // Type L Path Table Location
    pvd[148..152].copy_from_slice(&18u32.to_be_bytes()); // Type M Path Table Location

    // Root Directory Record in PVD (34 bytes at 156)
    pvd[156] = 34; // Record Length
    pvd[157] = 0;  // Ext Attr Length
    put_u32_both(&mut pvd[158..166], 19); // Extent Sector (Sector 19)
    put_u32_both(&mut pvd[166..174], SECTOR_SIZE as u32); // Data Length
    pvd[174..181].copy_from_slice(&[126, 10, 6, 12, 0, 0, 0]); // Date
    pvd[181] = 0x02; // Flags: Directory
    put_u16_both(&mut pvd[184..188], 1); // Volume Seq Num
    pvd[188] = 1; // File Identifier Length
    pvd[189] = 0; // Root Identifier (\0)

    pvd[813..830].copy_from_slice(b"2026100612000000\0");
    pvd[830..847].copy_from_slice(b"2026100612000000\0");
    pvd[847..864].copy_from_slice(b"0000000000000000\0");
    pvd[864..881].copy_from_slice(b"2026100612000000\0");
    pvd[881] = 0x01;

    // Sector 17: Volume Descriptor Set Terminator
    let term = &mut iso[17 * SECTOR_SIZE..18 * SECTOR_SIZE];
    term[0] = 0xFF;
    term[1..6].copy_from_slice(b"CD001");
    term[6] = 0x01;

    // Sector 18: Path Table (Type L)
    let pt = &mut iso[18 * SECTOR_SIZE..19 * SECTOR_SIZE];
    pt[0] = 1; // Dir ID len
    pt[1] = 0;
    pt[2..6].copy_from_slice(&19u32.to_le_bytes()); // Extent sector 19
    pt[6..8].copy_from_slice(&1u16.to_le_bytes());  // Parent dir index 1
    pt[8] = 0; // Root ID
    pt[9] = 0;

    // Sector 19: Root Directory Entries
    let root = &mut iso[19 * SECTOR_SIZE..20 * SECTOR_SIZE];
    let mut offset = 0;

    // Entry 0: '.'
    root[offset] = 34;
    root[offset + 1] = 0;
    put_u32_both(&mut root[offset + 2..offset + 10], 19);
    put_u32_both(&mut root[offset + 10..offset + 18], SECTOR_SIZE as u32);
    root[offset + 18..offset + 25].copy_from_slice(&[126, 10, 6, 12, 0, 0, 0]);
    root[offset + 25] = 0x02; // Dir
    put_u16_both(&mut root[offset + 28..offset + 32], 1);
    root[offset + 32] = 1;
    root[offset + 33] = 0;
    offset += 34;

    // Entry 1: '..'
    root[offset] = 34;
    root[offset + 1] = 0;
    put_u32_both(&mut root[offset + 2..offset + 10], 19);
    put_u32_both(&mut root[offset + 10..offset + 18], SECTOR_SIZE as u32);
    root[offset + 18..offset + 25].copy_from_slice(&[126, 10, 6, 12, 0, 0, 0]);
    root[offset + 25] = 0x02; // Dir
    put_u16_both(&mut root[offset + 28..offset + 32], 1);
    root[offset + 32] = 1;
    root[offset + 33] = 1;
    offset += 34;

    // File entries
    for (i, (name, data)) in files.iter().enumerate() {
        let (file_sec, _) = file_sectors[i];
        let name_bytes = name.as_bytes();
        let name_len = name_bytes.len();
        let rec_len = 33 + name_len + (if (33 + name_len) % 2 != 0 { 1 } else { 0 });

        if offset + rec_len > SECTOR_SIZE {
            break;
        }

        root[offset] = rec_len as u8;
        root[offset + 1] = 0;
        put_u32_both(&mut root[offset + 2..offset + 10], file_sec);
        put_u32_both(&mut root[offset + 10..offset + 18], data.len() as u32);
        root[offset + 18..offset + 25].copy_from_slice(&[126, 10, 6, 12, 0, 0, 0]);
        root[offset + 25] = 0x00; // File
        put_u16_both(&mut root[offset + 28..offset + 32], 1);
        root[offset + 32] = name_len as u8;
        root[offset + 33..offset + 33 + name_len].copy_from_slice(name_bytes);
        offset += rec_len;
    }

    // Sectors 20+: File contents
    for (i, (_name, data)) in files.iter().enumerate() {
        let (file_sec, _) = file_sectors[i];
        let start = file_sec as usize * SECTOR_SIZE;
        let end = start + data.len();
        iso[start..end].copy_from_slice(data);
    }

    std::fs::write(target_path, iso).map_err(|e| format!("Failed to write cidata.iso: {}", e))?;
    Ok(())
}

/// Prepares the unattended files on disk for the given OS
pub fn stage_unattended_media(
    target_dir: &Path, 
    _os_id: &str, 
    username: &str, 
    password: &str, 
    hostname: &str
) -> Result<PathBuf, String> {
    let out_dir = target_dir.join("unattended_cidata");
    std::fs::create_dir_all(&out_dir).map_err(|e| format!("Failed to create unattended staging dir: {}", e))?;

    // 1. Windows autounattend.xml
    let xml = generate_autounattend_xml(username, password, hostname);
    let xml_path = out_dir.join("autounattend.xml");
    let _ = std::fs::write(&xml_path, &xml);
    let _ = std::fs::copy(&xml_path, target_dir.join("autounattend.xml"));

    // 2. Fedora / RHEL Kickstart ks.cfg
    let ks = generate_kickstart_cfg(username, password, hostname);
    let ks_path = out_dir.join("ks.cfg");
    let _ = std::fs::write(&ks_path, &ks);
    let _ = std::fs::copy(&ks_path, target_dir.join("ks.cfg"));

    // 3. Subiquity / Cloud-Init user-data and meta-data (Ubuntu, Debian, Arch, Mint)
    let user_data = generate_cloud_init_user_data(username, password, hostname);
    let meta_data = generate_cloud_init_meta_data(hostname);
    
    let user_data_path = out_dir.join("user-data");
    let meta_data_path = out_dir.join("meta-data");
    
    let _ = std::fs::write(&user_data_path, &user_data);
    let _ = std::fs::write(&meta_data_path, &meta_data);
    let _ = std::fs::write(out_dir.join("vendor-data"), "");

    // Also place in target_dir/nocloud for Casper/NoCloud searchers
    let nocloud_dir = target_dir.join("nocloud");
    let _ = std::fs::create_dir_all(&nocloud_dir);
    let _ = std::fs::write(nocloud_dir.join("user-data"), &user_data);
    let _ = std::fs::write(nocloud_dir.join("meta-data"), &meta_data);
    let _ = std::fs::write(nocloud_dir.join("vendor-data"), "");

    // 4. Generate universal cidata.iso with volume label CIDATA
    let iso_files = [
        ("user-data", user_data.as_bytes()),
        ("meta-data", meta_data.as_bytes()),
        ("vendor-data", b"".as_slice()),
        ("autounattend.xml", xml.as_bytes()),
        ("ks.cfg", ks.as_bytes()),
        ("USER-DATA", user_data.as_bytes()),
        ("META-DATA", meta_data.as_bytes()),
        ("AUTOUNATTEND.XML", xml.as_bytes()),
        ("KS.CFG", ks.as_bytes()),
    ];
    let cidata_iso = target_dir.join("cidata.iso");
    let _ = generate_cidata_iso(&cidata_iso, &iso_files);
    let _ = std::fs::copy(&cidata_iso, out_dir.join("cidata.iso"));

    Ok(user_data_path)
}
