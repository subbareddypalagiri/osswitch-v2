const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WINGET_PATH = `${process.env.LOCALAPPDATA}\\Microsoft\\WindowsApps\\winget.exe`;

const departments = [
  "General / Independent",
  "Computer Science & Software Eng",
  "Cyber Security & Hacking",
  "Digital Forensics & DFIR",
  "Artificial Intelligence & LLMs",
  "Machine Learning & Deep Learning",
  "Data Science & Analytics",
  "Civil Engineering & Architecture",
  "Mechanical Engineering",
  "Electronics & Circuit Design (ECE)",
  "Electrical Engineering (EEE)",
  "Biotechnology & Bioinformatics",
  "Aerospace & Avionics",
  "Robotics & Automation",
  "Game Development & CG",
  "Cloud Infrastructure & DevOps",
  "Reverse Engineering & Malware",
  "Penetration Testing & Red Teaming",
  "Blockchain & Web3",
  "OSINT & Intelligence",
  "Network Administration",
  "UI/UX & Graphic Design",
  "3D Modeling & Animation",
  "System Utilities & SysAdmin",
  "Audio & Sound Production",
  "Video Editing & Streaming",
  "Office & Business Productivity",
  "Browsers & Communication",
  "Database Management",
  "Mobile App Development",
  "Embedded Systems & IoT",
  "Math & Scientific Computing"
];

const roles = [
  "Independent User",
  "Penetration Tester",
  "Cyber Forensic Investigator",
  "Machine Learning Engineer",
  "Cloud Architect",
  "DevOps Engineer",
  "Full Stack Developer",
  "Backend Developer",
  "Frontend Developer",
  "Mobile Developer",
  "Systems Programmer",
  "Malware Analyst",
  "SOC Analyst",
  "Quant Analyst",
  "SRE",
  "Bioinformatics Scientist",
  "Data Analyst",
  "Electronics Engineer",
  "Mechanical Engineer",
  "Civil Engineer",
  "3D Artist",
  "UI/UX Designer",
  "Product Manager",
  "Business Analyst",
  "System Administrator"
];

// MASTER HIGH-DEMAND MARKET SOFTWARE CATALOG (STUDENTS, DEVELOPERS, EMPLOYEES & SECURITY)
const masterMarketTools = [
  // --- CYBER SECURITY, DFIR & REVERSE ENGINEERING ---
  { name: "Autopsy", wingetId: "SleuthKit.Autopsy", desc: "Industry-standard digital forensics platform & media analyzer", dept: "Digital Forensics & DFIR", role: "Cyber Forensic Investigator", el: "windows_winget", src: "Winget Registry", url: "https://www.autopsy.com/" },
  { name: "FTK Imager", wingetId: "Exterro.FTKImager", desc: "Data preview and imaging tool for forensic acquisition", dept: "Digital Forensics & DFIR", role: "Cyber Forensic Investigator", el: "vendor_direct", src: "Exterro Vendor", url: "https://www.exterro.com/ftk-imager" },
  { name: "EnCase Forensic", wingetId: "OpenText.EnCase", desc: "Enterprise court-proven digital investigation platform", dept: "Digital Forensics & DFIR", role: "Cyber Forensic Investigator", el: "vendor_direct", src: "OpenText Vendor", url: "https://www.opentext.com/products/encase-forensic" },
  { name: "Volatility 3", wingetId: "VolatilityFoundation.Volatility3", desc: "Memory extraction and forensic analysis framework", dept: "Digital Forensics & DFIR", role: "Cyber Forensic Investigator", el: "linux_vm", src: "Kali / Linux Repo", url: "https://www.volatilityfoundation.org/" },
  { name: "LastActivityView", wingetId: "NirSoft.LastActivityView", desc: "Forensic log viewer of all user activities and executed actions", dept: "Digital Forensics & DFIR", role: "Cyber Forensic Investigator", el: "windows_winget", src: "NirSoft Forensics", url: "https://www.nirsoft.net/utils/computer_activity_view.html" },
  { name: "USBDeview", wingetId: "NirSoft.USBDeview", desc: "Forensic USB device history extractor and registry parser", dept: "Digital Forensics & DFIR", role: "Cyber Forensic Investigator", el: "windows_winget", src: "NirSoft Forensics", url: "https://www.nirsoft.net/utils/usb_devices_view.html" },
  { name: "BrowsingHistoryView", wingetId: "NirSoft.BrowsingHistoryView", desc: "Multi-browser forensic history aggregator for Web artifacts", dept: "Digital Forensics & DFIR", role: "Cyber Forensic Investigator", el: "windows_winget", src: "NirSoft Forensics", url: "https://www.nirsoft.net/utils/browsing_history_view.html" },
  { name: "ExifTool", wingetId: "PhilHarvey.ExifTool", desc: "Read, write, and manipulate metadata in images & documents", dept: "Digital Forensics & DFIR", role: "Cyber Forensic Investigator", el: "windows_winget", src: "Winget Registry", url: "https://exiftool.org/" },
  { name: "Dumpzilla", wingetId: "Dumpzilla.Dumpzilla", desc: "Firefox forensic analysis of cookies, history, and passwords", dept: "Digital Forensics & DFIR", role: "Cyber Forensic Investigator", el: "linux_vm", src: "Linux Security", url: "https://www.dumpzilla.org/" },
  { name: "The Sleuth Kit", wingetId: "SleuthKit.TSK", desc: "Library and command line digital forensics tools", dept: "Digital Forensics & DFIR", role: "Cyber Forensic Investigator", el: "windows_winget", src: "Winget Registry", url: "https://www.sleuthkit.org/" },
  { name: "Recuva", wingetId: "Piriform.Recuva", desc: "Deep file recovery for undeleting formatted or corrupt drives", dept: "Digital Forensics & DFIR", role: "Cyber Forensic Investigator", el: "windows_winget", src: "Piriform Vendor", url: "https://www.ccleaner.com/recuva" },
  { name: "4DDiG Data Recovery", wingetId: "Tenorshare.4DDiG", desc: "Advanced drive & partition data recovery software", dept: "Digital Forensics & DFIR", role: "Cyber Forensic Investigator", el: "vendor_direct", src: "Tenorshare Vendor", url: "https://4ddig.tenorshare.com/" },
  { name: "Ghidra", wingetId: "NationalSecurityAgency.Ghidra", desc: "NSA SRE reverse engineering disassembler & decompiler suite", dept: "Reverse Engineering & Malware", role: "Malware Analyst", el: "windows_winget", src: "NSA Open Source", url: "https://ghidra-sre.org/" },
  { name: "x64dbg", wingetId: "x64dbg.x64dbg", desc: "Open-source x64/x32 debugger for Windows malware analysis", dept: "Reverse Engineering & Malware", role: "Malware Analyst", el: "windows_winget", src: "Winget Registry", url: "https://x64dbg.com/" },
  { name: "Wireshark", wingetId: "WiresharkFoundation.Wireshark", desc: "World standard network packet analyzer & sniffer", dept: "Network Administration", role: "SOC Analyst", el: "windows_winget", src: "Winget Registry", url: "https://www.wireshark.org/" },
  { name: "Nmap", wingetId: "Insecure.Nmap", desc: "Network discovery and vulnerability scanning engine", dept: "Penetration Testing & Red Teaming", role: "Penetration Tester", el: "windows_winget", src: "Winget Registry", url: "https://nmap.org/" },
  { name: "Burp Suite Community", wingetId: "PortSwigger.BurpSuite.Community", desc: "Web security testing & HTTP proxy interceptor", dept: "Penetration Testing & Red Teaming", role: "Penetration Tester", el: "windows_winget", src: "PortSwigger", url: "https://portswigger.net/burp" },
  { name: "Metasploit Framework", wingetId: "Rapid7.MetasploitFramework", desc: "Penetration testing & exploit development platform", dept: "Penetration Testing & Red Teaming", role: "Penetration Tester", el: "linux_vm", src: "Rapid7 / Kali", url: "https://www.metasploit.com/" },
  { name: "Hashcat", wingetId: "Hashcat.Hashcat", desc: "World's fastest password recovery and hash cracking engine", dept: "Penetration Testing & Red Teaming", role: "Penetration Tester", el: "windows_winget", src: "Winget Registry", url: "https://hashcat.net/hashcat/" },
  { name: "Sysinternals Suite", wingetId: "Microsoft.Sysinternals", desc: "Microsoft official system monitoring & troubleshooting kernel tools", dept: "System Utilities & SysAdmin", role: "System Administrator", el: "windows_winget", src: "Microsoft Sysinternals", url: "https://learn.microsoft.com/sysinternals/" },

  // --- DEVELOPERS & SOFTWARE ENGINEERS ---
  { name: "Visual Studio Code", wingetId: "Microsoft.VisualStudioCode", desc: "Code editing redefined. Essential IDE for web, cloud & AI", dept: "Computer Science & Software Eng", role: "Full Stack Developer", el: "windows_winget", src: "Microsoft", url: "https://code.visualstudio.com/" },
  { name: "Visual Studio Community 2022", wingetId: "Microsoft.VisualStudio.2022.Community", desc: "Full-featured IDE for C++, C#, .NET & Windows development", dept: "Computer Science & Software Eng", role: "Systems Programmer", el: "windows_winget", src: "Microsoft", url: "https://visualstudio.microsoft.com/" },
  { name: "PyCharm Community", wingetId: "JetBrains.PyCharm.Community", desc: "Python IDE for professional developers & Data Scientists", dept: "Computer Science & Software Eng", role: "Backend Developer", el: "windows_winget", src: "JetBrains", url: "https://www.jetbrains.com/pycharm/" },
  { name: "IntelliJ IDEA Community", wingetId: "JetBrains.IntelliJIDEA.Community", desc: "Leading Java & Kotlin IDE for enterprise developers", dept: "Computer Science & Software Eng", role: "Backend Developer", el: "windows_winget", src: "JetBrains", url: "https://www.jetbrains.com/idea/" },
  { name: "Android Studio", wingetId: "Google.AndroidStudio", desc: "Official IDE for Android app development & Flutter", dept: "Mobile App Development", role: "Mobile Developer", el: "windows_winget", src: "Google", url: "https://developer.android.com/studio" },
  { name: "Docker Desktop", wingetId: "Docker.DockerDesktop", desc: "Container virtualization platform for microservices & cloud", dept: "Cloud Infrastructure & DevOps", role: "DevOps Engineer", el: "windows_winget", src: "Docker Inc", url: "https://www.docker.com/" },
  { name: "Postman", wingetId: "Postman.Postman", desc: "API development, REST testing & documentation platform", dept: "Computer Science & Software Eng", role: "Full Stack Developer", el: "windows_winget", src: "Postman", url: "https://www.postman.com/" },
  { name: "Insomnia", wingetId: "Kong.Insomnia", desc: "Open-source REST, GraphQL and gRPC API client", dept: "Computer Science & Software Eng", role: "Backend Developer", el: "windows_winget", src: "Kong", url: "https://insomnia.rest/" },
  { name: "Git", wingetId: "Git.Git", desc: "Distributed version control system", dept: "Computer Science & Software Eng", role: "Full Stack Developer", el: "windows_winget", src: "Git Software", url: "https://git-scm.com/" },
  { name: "GitHub Desktop", wingetId: "GitHub.GitHubDesktop", desc: "GUI client for Git & GitHub repositories", dept: "Computer Science & Software Eng", role: "Full Stack Developer", el: "windows_winget", src: "GitHub", url: "https://desktop.github.com/" },
  { name: "Node.js (LTS)", wingetId: "OpenJS.NodeJS.LTS", desc: "JavaScript runtime environment for server-side apps", dept: "Computer Science & Software Eng", role: "Full Stack Developer", el: "windows_winget", src: "OpenJS Foundation", url: "https://nodejs.org/" },
  { name: "Python 3", wingetId: "Python.Python.3.12", desc: "High-level programming language for Web, AI, Data & Automation", dept: "Computer Science & Software Eng", role: "Full Stack Developer", el: "windows_winget", src: "Python Software Foundation", url: "https://www.python.org/" },
  { name: "Rustup (Rust Compiler)", wingetId: "Rustlang.Rustup", desc: "Blazing fast systems programming language & cargo package manager", dept: "Computer Science & Software Eng", role: "Systems Programmer", el: "windows_winget", src: "Rust Foundation", url: "https://www.rust-lang.org/" },
  { name: "Go Programming Language", wingetId: "Golang.Go", desc: "Fast, concurrent language for cloud microservices", dept: "Cloud Infrastructure & DevOps", role: "Backend Developer", el: "windows_winget", src: "Google Go Team", url: "https://go.dev/" },
  { name: "DBeaver Community", wingetId: "dbeaver.dbeaver", desc: "Universal database GUI client for PostgreSQL, MySQL, SQLite, Oracle", dept: "Database Management", role: "Backend Developer", el: "windows_winget", src: "DBeaver Corp", url: "https://dbeaver.io/" },
  { name: "DB Browser for SQLite", wingetId: "DBBrowserForSQLite.DBBrowserForSQLite", desc: "Visual editor for SQLite database files", dept: "Database Management", role: "Backend Developer", el: "windows_winget", src: "SQLite Project", url: "https://sqlitebrowser.org/" },
  { name: "MongoDB Compass", wingetId: "MongoDB.Compass", desc: "GUI for MongoDB NoSQL database inspection & queries", dept: "Database Management", role: "Backend Developer", el: "windows_winget", src: "MongoDB Inc", url: "https://www.mongodb.com/products/compass" },

  // --- AI, ML & DEEP LEARNING ---
  { name: "Anaconda3", wingetId: "Anaconda.Anaconda3", desc: "Python Data Science, AI/ML package & environment manager", dept: "Artificial Intelligence & LLMs", role: "Machine Learning Engineer", el: "windows_winget", src: "Anaconda Inc", url: "https://www.anaconda.com/" },
  { name: "JupyterLab", wingetId: "Jupyter.JupyterLab", desc: "Interactive notebook UI for Data Science & AI research", dept: "Data Science & Analytics", role: "Data Analyst", el: "windows_winget", src: "Project Jupyter", url: "https://jupyter.org/" },
  { name: "CUDA Toolkit", wingetId: "Nvidia.CUDA", desc: "GPU-accelerated parallel computing development environment", dept: "Machine Learning & Deep Learning", role: "Machine Learning Engineer", el: "windows_winget", src: "NVIDIA", url: "https://developer.nvidia.com/cuda-toolkit" },
  { name: "Ollama", wingetId: "Ollama.Ollama", desc: "Run open-source LLMs (Llama 3, Mistral, DeepSeek) locally", dept: "Artificial Intelligence & LLMs", role: "Machine Learning Engineer", el: "windows_winget", src: "Ollama", url: "https://ollama.com/" },
  { name: "LM Studio", wingetId: "LMStudio.LMStudio", desc: "Discover, download, and run local LLMs on your desktop", dept: "Artificial Intelligence & LLMs", role: "Machine Learning Engineer", el: "windows_winget", src: "LM Studio", url: "https://lmstudio.ai/" },
  { name: "Jan AI", wingetId: "JanApp.Jan", desc: "Open-source local AI assistant & ChatGPT alternative", dept: "Artificial Intelligence & LLMs", role: "Independent User", el: "windows_winget", src: "Jan AI Project", url: "https://jan.ai/" },

  // --- ELECTRONICS (ECE & EEE) & HARDWARE ---
  { name: "KiCad EDA", wingetId: "KiCad.KiCad", desc: "Open-source schematic capture & PCB layout software", dept: "Electronics & Circuit Design (ECE)", role: "Electronics Engineer", el: "windows_winget", src: "KiCad Project", url: "https://www.kicad.org/" },
  { name: "LTspice", wingetId: "AnalogDevices.LTspice", desc: "SPICE simulation software & circuit waveform viewer", dept: "Electronics & Circuit Design (ECE)", role: "Electronics Engineer", el: "windows_winget", src: "Analog Devices", url: "https://www.analog.com/ltspice" },
  { name: "Fritzing", wingetId: "Fritzing.Fritzing", desc: "Electronic design automation for breadboards and prototypes", dept: "Electronics & Circuit Design (ECE)", role: "Electronics Engineer", el: "windows_winget", src: "Fritzing", url: "https://fritzing.org/" },
  { name: "Arduino IDE", wingetId: "Arduino.ArduinoIDE", desc: "Microcontroller programming & serial hardware debugger", dept: "Embedded Systems & IoT", role: "Electronics Engineer", el: "windows_winget", src: "Arduino", url: "https://www.arduino.cc/" },
  { name: "STM32CubeIDE", wingetId: "STMicroelectronics.STM32CubeIDE", desc: "C/C++ development platform for STM32 microcontrollers", dept: "Embedded Systems & IoT", role: "Electronics Engineer", el: "vendor_direct", src: "STMicroelectronics", url: "https://www.st.com/stm32cubeide" },
  { name: "PulseView (sigrok)", wingetId: "sigrok.PulseView", desc: "GUI for logic analyzers, oscilloscopes & signal decoders", dept: "Electronics & Circuit Design (ECE)", role: "Electronics Engineer", el: "windows_winget", src: "sigrok Project", url: "https://sigrok.org/" },

  // --- MECHANICAL & CIVIL ENGINEERING ---
  { name: "FreeCAD", wingetId: "FreeCAD.FreeCAD", desc: "Parametric 3D CAD modeler for mechanical design & 3D printing", dept: "Mechanical Engineering", role: "Mechanical Engineer", el: "windows_winget", src: "FreeCAD Project", url: "https://www.freecadweb.org/" },
  { name: "LibreCAD", wingetId: "LibreCAD.LibreCAD", desc: "Open-source 2D CAD drafting application for Civil & Mech", dept: "Civil Engineering & Architecture", role: "Civil Engineer", el: "windows_winget", src: "LibreCAD", url: "https://librecad.org/" },
  { name: "OpenModelica", wingetId: "OpenModelica.OpenModelica", desc: "Modelica-based cyber-physical systems simulation environment", dept: "Mechanical Engineering", role: "Mechanical Engineer", el: "windows_winget", src: "OpenModelica", url: "https://openmodelica.org/" },
  { name: "MeshLab", wingetId: "ISTI-CNR.MeshLab", desc: "Processing and editing 3D triangular meshes & point clouds", dept: "3D Modeling & Animation", role: "3D Artist", el: "windows_winget", src: "MeshLab", url: "https://www.meshlab.net/" },

  // --- DESIGNERS, CONTENT CREATORS & ENTERTAINMENT ---
  { name: "Blender 3D", wingetId: "BlenderFoundation.Blender", desc: "3D animation, rendering, modeling, and VFX simulation suite", dept: "3D Modeling & Animation", role: "3D Artist", el: "windows_winget", src: "Blender Foundation", url: "https://www.blender.org/" },
  { name: "Figma", wingetId: "Figma.Figma", desc: "Collaborative interface design tool & prototyping platform", dept: "UI/UX & Graphic Design", role: "UI/UX Designer", el: "windows_winget", src: "Figma", url: "https://www.figma.com/" },
  { name: "GIMP", wingetId: "GIMP.GIMP", desc: "GNU Image Manipulation Program for photo editing & raster graphics", dept: "UI/UX & Graphic Design", role: "UI/UX Designer", el: "windows_winget", src: "GIMP Project", url: "https://www.gimp.org/" },
  { name: "Inkscape", wingetId: "Inkscape.Inkscape", desc: "Vector graphics editor for SVG vector art and design", dept: "UI/UX & Graphic Design", role: "UI/UX Designer", el: "windows_winget", src: "Inkscape", url: "https://inkscape.org/" },
  { name: "Krita", wingetId: "KDE.Krita", desc: "Digital painting & 2D illustration software", dept: "UI/UX & Graphic Design", role: "3D Artist", el: "windows_winget", src: "KDE Project", url: "https://krita.org/" },
  { name: "OBS Studio", wingetId: "OBSProject.OBSStudio", desc: "Open-source video recording and live streaming software", dept: "Video Editing & Streaming", role: "Independent User", el: "windows_winget", src: "OBS Project", url: "https://obsproject.com/" },
  { name: "Audacity", wingetId: "Audacity.Audacity", desc: "Multi-track audio editor and sound recorder", dept: "Audio & Sound Production", role: "Independent User", el: "windows_winget", src: "Audacity Team", url: "https://www.audacityteam.org/" },
  { name: "HandBrake", wingetId: "HandBrake.HandBrake", desc: "Open-source video transcoder & converter", dept: "Video Editing & Streaming", role: "Independent User", el: "windows_winget", src: "HandBrake", url: "https://handbrake.fr/" },
  { name: "VLC Media Player", wingetId: "VideoLAN.VLC", desc: "Universal media player for all video and audio formats", dept: "Audio & Video", role: "Independent User", el: "windows_winget", src: "VideoLAN", url: "https://www.videolan.org/vlc/" },

  // --- EMPLOYEES, BUSINESS & EVERYDAY UTILITIES ---
  { name: "LibreOffice", wingetId: "TheDocumentFoundation.LibreOffice", desc: "Full office suite (Writer, Calc, Impress) alternative to MS Office", dept: "Office & Business Productivity", role: "Independent User", el: "windows_winget", src: "Document Foundation", url: "https://www.libreoffice.org/" },
  { name: "Notion", wingetId: "Notion.Notion", desc: "Connected workspace for notes, docs, tasks, and project management", dept: "Office & Business Productivity", role: "Product Manager", el: "windows_winget", src: "Notion Labs", url: "https://www.notion.so/" },
  { name: "Obsidian", wingetId: "Obsidian.Obsidian", desc: "Knowledge base & markdown note-taking app on local files", dept: "Office & Business Productivity", role: "Independent User", el: "windows_winget", src: "Obsidian", url: "https://obsidian.md/" },
  { name: "7-Zip", wingetId: "7zip.7zip", desc: "High-compression file archiver for ZIP, 7z, TAR, RAR", dept: "System Utilities & SysAdmin", role: "Independent User", el: "windows_winget", src: "Igor Pavlov", url: "https://www.7-zip.org/" },
  { name: "PowerToys", wingetId: "Microsoft.PowerToys", desc: "Microsoft official system utilities for power users", dept: "System Utilities & SysAdmin", role: "Independent User", el: "windows_winget", src: "Microsoft", url: "https://learn.microsoft.com/powertoys" },
  { name: "Bitwarden", wingetId: "Bitwarden.Bitwarden", desc: "Open-source password manager for secure credential storage", dept: "Office & Business Productivity", role: "Independent User", el: "windows_winget", src: "Bitwarden", url: "https://bitwarden.com/" },
  { name: "Slack", wingetId: "SlackTechnologies.Slack", desc: "Team messaging and business collaboration platform", dept: "Browsers & Communication", role: "Independent User", el: "windows_winget", src: "Salesforce / Slack", url: "https://slack.com/" },
  { name: "Zoom", wingetId: "Zoom.Zoom", desc: "HD video conferencing and online meeting software", dept: "Browsers & Communication", role: "Independent User", el: "windows_winget", src: "Zoom Video", url: "https://zoom.us/" },
  { name: "Brave Browser", wingetId: "Brave.Brave", desc: "Fast, privacy-focused web browser with built-in ad blocker", dept: "Browsers & Communication", role: "Independent User", el: "windows_winget", src: "Brave Software", url: "https://brave.com/" },

  // --- 0-INSTALL PORTABLE WEBAPPS ---
  { name: "CyberChef Web", wingetId: "Web.CyberChef", desc: "The Cyber Swiss Army Knife for data encoding, decoding & forensics", dept: "Digital Forensics & DFIR", role: "Cyber Forensic Investigator", el: "web_app", src: "GCHQ Open Source", url: "https://gchq.github.io/CyberChef/" },
  { name: "Photopea Online", wingetId: "Web.Photopea", desc: "Full-featured advanced image editor supporting PSD, XCF, RAW", dept: "UI/UX & Graphic Design", role: "UI/UX Designer", el: "web_app", src: "Photopea Web", url: "https://www.photopea.com/" },
  { name: "Excalidraw Web", wingetId: "Web.Excalidraw", desc: "Virtual collaborative hand-drawn style diagramming canvas", dept: "UI/UX & Graphic Design", role: "Full Stack Developer", el: "web_app", src: "Excalidraw Web", url: "https://excalidraw.com/" },
  { name: "VS Code for Web", wingetId: "Web.VSCode", desc: "Zero-install lightweight Visual Studio Code running in browser", dept: "Computer Science & Software Eng", role: "Full Stack Developer", el: "web_app", src: "Microsoft Web", url: "https://vscode.dev/" },
  { name: "Google Colaboratory", wingetId: "Web.GoogleColab", desc: "Hosted Jupyter notebook environment with free GPU/TPU access", dept: "Artificial Intelligence & LLMs", role: "Machine Learning Engineer", el: "web_app", src: "Google Research", url: "https://colab.research.google.com/" },
  { name: "VirusTotal Web", wingetId: "Web.VirusTotal", desc: "Analyze suspicious files, domains, IPs and URLs for malware", dept: "Reverse Engineering & Malware", role: "Malware Analyst", el: "web_app", src: "Google Security", url: "https://www.virustotal.com/" },
  { name: "Tinkercad Circuits", wingetId: "Web.Tinkercad", desc: "Interactive 3D design & circuit simulation for microcontrollers", dept: "Electronics & Circuit Design (ECE)", role: "Electronics Engineer", el: "web_app", src: "Autodesk Web", url: "https://www.tinkercad.com/" }
];

console.log("🚀 Building Master Mega-Catalog (10,500+ Real Tools)...");

const catalogPath = path.join(__dirname, '..', 'public', 'tools-catalog.json');
let existingTools = [];
if (fs.existsSync(catalogPath)) {
  const data = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  existingTools = data.tools || [];
}

const seenWingetIds = new Set();
const finalTools = [];
let counter = 1;

// 1. Prepend all Master Market Tools
for (const item of masterMarketTools) {
  seenWingetIds.add(item.wingetId.toLowerCase());
  finalTools.push({
    id: `tool-${counter++}`,
    name: item.name,
    wingetId: item.wingetId,
    description: item.desc,
    department: item.dept,
    role: item.role,
    eligibility: item.el,
    source: item.src,
    vendorUrl: item.url,
    icon: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random&color=fff`
  });
}

// 2. Append existing 10,551 Winget tools (avoiding duplicates)
for (const item of existingTools) {
  if (!item.wingetId || seenWingetIds.has(item.wingetId.toLowerCase())) continue;
  seenWingetIds.add(item.wingetId.toLowerCase());
  
  finalTools.push({
    id: `tool-${counter++}`,
    name: item.name,
    wingetId: item.wingetId,
    description: item.description,
    department: item.department || "General / Independent",
    role: item.role || "Independent User",
    eligibility: item.eligibility || "windows_winget",
    source: item.source || "Winget Registry",
    vendorUrl: item.vendorUrl || "https://github.com/microsoft/winget-pkgs",
    icon: item.icon || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random&color=fff`
  });
}

const catalog = {
  departments: Array.from(new Set(departments)),
  roles: Array.from(new Set(roles)),
  tools: finalTools
};

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));

console.log(`\n🎉 Mega Catalog Successfully Created with ${finalTools.length} STRICTLY UNIQUE real market tools!`);
