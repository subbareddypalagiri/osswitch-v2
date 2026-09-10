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

/// Prepares the unattended files on disk for the given OS
pub fn stage_unattended_media(
    target_dir: &Path, 
    os_id: &str, 
    username: &str, 
    password: &str, 
    hostname: &str
) -> Result<PathBuf, String> {
    let lower = os_id.to_lowercase();
    let is_windows = lower.contains("win");
    let is_fedora = lower.contains("fedora") || lower.contains("rhel") || lower.contains("centos");

    let out_dir = target_dir.join("unattended_cidata");
    std::fs::create_dir_all(&out_dir).map_err(|e| format!("Failed to create unattended staging dir: {}", e))?;

    if is_windows {
        let xml = generate_autounattend_xml(username, password, hostname);
        let xml_path = out_dir.join("autounattend.xml");
        std::fs::write(&xml_path, xml).map_err(|e| format!("Failed to write autounattend.xml: {}", e))?;
        let _ = std::fs::copy(&xml_path, target_dir.join("autounattend.xml"));
        Ok(xml_path)
    } else if is_fedora {
        let ks = generate_kickstart_cfg(username, password, hostname);
        let ks_path = out_dir.join("ks.cfg");
        std::fs::write(&ks_path, ks).map_err(|e| format!("Failed to write ks.cfg: {}", e))?;
        let _ = std::fs::copy(&ks_path, target_dir.join("ks.cfg"));
        Ok(ks_path)
    } else {
        // Default Subiquity / cloud-init (Ubuntu, Debian, Mint)
        let user_data = generate_cloud_init_user_data(username, password, hostname);
        let meta_data = generate_cloud_init_meta_data(hostname);
        
        let user_data_path = out_dir.join("user-data");
        let meta_data_path = out_dir.join("meta-data");
        
        std::fs::write(&user_data_path, user_data).map_err(|e| format!("Failed to write user-data: {}", e))?;
        std::fs::write(&meta_data_path, meta_data).map_err(|e| format!("Failed to write meta-data: {}", e))?;

        let _ = std::fs::write(out_dir.join("vendor-data"), "");

        Ok(user_data_path)
    }
}
