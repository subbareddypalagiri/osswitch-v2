const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WINGET_PATH = `${process.env.LOCALAPPDATA}\\Microsoft\\WindowsApps\\winget.exe`;

const departments = [
  "General / Independent",
  "Computer Science",
  "Cyber Forensics",
  "Artificial Intelligence",
  "Machine Learning",
  "Deep Learning",
  "Data Science",
  "Civil Engineering",
  "Mechanical Engineering",
  "Electronics (ECE)",
  "Electrical (EEE)",
  "Biotechnology",
  "Aerospace",
  "Robotics",
  "Game Development",
  "Cloud Computing",
  "DevOps",
  "Reverse Engineering",
  "Penetration Testing",
  "Blockchain/Web3",
  "OSINT",
  "Network Administration",
  "UI/UX Design",
  "3D Animation",
  "System Utilities",
  "Audio & Video",
  "Office & Productivity"
];

const roles = [
  "Independent User",
  "Penetration Tester",
  "Cyber Forensic Investigator",
  "Machine Learning Engineer",
  "Cloud Architect",
  "DevOps Engineer",
  "Full Stack Developer",
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
  "UI/UX Designer"
];

// 1. MUST-HAVE HAND-CURATED EXPERT TOOLS ACROSS DEPARTMENTS
const curatedExpertTools = [
  // CYBER FORENSICS & REVERSE ENGINEERING
  { name: "Autopsy", wingetId: "SleuthKit.Autopsy", desc: "Industry-standard digital forensics platform & media analyzer", dept: "Cyber Forensics", role: "Cyber Forensic Investigator", eligibility: "windows_winget", source: "Winget Registry", vendorUrl: "https://www.autopsy.com/" },
  { name: "FTK Imager", wingetId: "Exterro.FTKImager", desc: "Data preview and imaging tool for digital forensics", dept: "Cyber Forensics", role: "Cyber Forensic Investigator", eligibility: "vendor_direct", source: "Exterro Vendor", vendorUrl: "https://www.exterro.com/ftk-imager" },
  { name: "EnCase Forensic", wingetId: "OpenText.EnCase", desc: "Enterprise court-proven digital investigation platform", dept: "Cyber Forensics", role: "Cyber Forensic Investigator", eligibility: "vendor_direct", source: "OpenText Vendor", vendorUrl: "https://www.opentext.com/products/encase-forensic" },
  { name: "Volatility 3", wingetId: "VolatilityFoundation.Volatility3", desc: "Advanced memory extraction and analysis framework", dept: "Cyber Forensics", role: "Cyber Forensic Investigator", eligibility: "linux_vm", source: "Kali / Linux Repo", vendorUrl: "https://www.volatilityfoundation.org/" },
  { name: "LastActivityView", wingetId: "NirSoft.LastActivityView", desc: "Forensic log viewer of all user activities and executed actions", dept: "Cyber Forensics", role: "Cyber Forensic Investigator", eligibility: "windows_winget", source: "NirSoft Forensics", vendorUrl: "https://www.nirsoft.net/utils/computer_activity_view.html" },
  { name: "USBDeview", wingetId: "NirSoft.USBDeview", desc: "Forensic USB device history extractor and registry parser", dept: "Cyber Forensics", role: "Cyber Forensic Investigator", eligibility: "windows_winget", source: "NirSoft Forensics", vendorUrl: "https://www.nirsoft.net/utils/usb_devices_view.html" },
  { name: "BrowsingHistoryView", wingetId: "NirSoft.BrowsingHistoryView", desc: "Multi-browser forensic history aggregator for Web artifacts", dept: "Cyber Forensics", role: "Cyber Forensic Investigator", eligibility: "windows_winget", source: "NirSoft Forensics", vendorUrl: "https://www.nirsoft.net/utils/browsing_history_view.html" },
  { name: "ExifTool", wingetId: "PhilHarvey.ExifTool", desc: "Read, write, and manipulate metadata in images & documents", dept: "Cyber Forensics", role: "Cyber Forensic Investigator", eligibility: "windows_winget", source: "Winget Registry", vendorUrl: "https://exiftool.org/" },
  { name: "Dumpzilla", wingetId: "Dumpzilla.Dumpzilla", desc: "Firefox forensic analysis of cookies, history, and passwords", dept: "Cyber Forensics", role: "Cyber Forensic Investigator", eligibility: "linux_vm", source: "Linux Security", vendorUrl: "https://www.dumpzilla.org/" },
  { name: "The Sleuth Kit", wingetId: "SleuthKit.TSK", desc: "Library and command line digital forensics tools", dept: "Cyber Forensics", role: "Cyber Forensic Investigator", eligibility: "windows_winget", source: "Winget Registry", vendorUrl: "https://www.sleuthkit.org/" },
  { name: "Recuva", wingetId: "Piriform.Recuva", desc: "Deep file recovery for undeleting formatted or corrupt drives", dept: "Cyber Forensics", role: "Cyber Forensic Investigator", eligibility: "windows_winget", source: "Piriform Vendor", vendorUrl: "https://www.ccleaner.com/recuva" },
  { name: "4DDiG Data Recovery", wingetId: "Tenorshare.4DDiG", desc: "Advanced drive & partition data recovery software", dept: "Cyber Forensics", role: "Cyber Forensic Investigator", eligibility: "vendor_direct", source: "Tenorshare Vendor", vendorUrl: "https://4ddig.tenorshare.com/" },
  { name: "Ghidra", wingetId: "NationalSecurityAgency.Ghidra", desc: "NSA SRE reverse engineering disassembler & decompiler suite", dept: "Reverse Engineering", role: "Malware Analyst", eligibility: "windows_winget", source: "NSA Open Source", vendorUrl: "https://ghidra-sre.org/" },
  { name: "x64dbg", wingetId: "x64dbg.x64dbg", desc: "Open-source x64/x32 debugger for Windows malware analysis", dept: "Reverse Engineering", role: "Malware Analyst", eligibility: "windows_winget", source: "Winget Registry", vendorUrl: "https://x64dbg.com/" },

  // PENETRATION TESTING & SECURITY
  { name: "Wireshark", wingetId: "WiresharkFoundation.Wireshark", desc: "World standard network packet analyzer & sniffer", dept: "Penetration Testing", role: "SOC Analyst", eligibility: "windows_winget", source: "Winget Registry", vendorUrl: "https://www.wireshark.org/" },
  { name: "Nmap", wingetId: "Insecure.Nmap", desc: "Network discovery and vulnerability scanning engine", dept: "Penetration Testing", role: "Penetration Tester", eligibility: "windows_winget", source: "Winget Registry", vendorUrl: "https://nmap.org/" },
  { name: "Burp Suite Community", wingetId: "PortSwigger.BurpSuite.Community", desc: "Web security testing & HTTP proxy interceptor", dept: "Penetration Testing", role: "Penetration Tester", eligibility: "windows_winget", source: "PortSwigger", vendorUrl: "https://portswigger.net/burp" },
  { name: "Metasploit Framework", wingetId: "Rapid7.MetasploitFramework", desc: "Penetration testing & exploit development platform", dept: "Penetration Testing", role: "Penetration Tester", eligibility: "linux_vm", source: "Rapid7 / Kali", vendorUrl: "https://www.metasploit.com/" },
  { name: "Hashcat", wingetId: "Hashcat.Hashcat", desc: "World's fastest password recovery and hash cracking engine", dept: "Penetration Testing", role: "Penetration Tester", eligibility: "windows_winget", source: "Winget Registry", vendorUrl: "https://hashcat.net/hashcat/" },

  // ELECTRONICS (ECE & EEE)
  { name: "KiCad EDA", wingetId: "KiCad.KiCad", desc: "Open-source schematic capture & PCB layout software", dept: "Electronics (ECE)", role: "Electronics Engineer", eligibility: "windows_winget", source: "Winget Registry", vendorUrl: "https://www.kicad.org/" },
  { name: "LTspice", wingetId: "AnalogDevices.LTspice", desc: "High-performance SPICE simulation software & circuit waveform viewer", dept: "Electronics (ECE)", role: "Electronics Engineer", eligibility: "windows_winget", source: "Analog Devices", vendorUrl: "https://www.analog.com/ltspice" },
  { name: "Fritzing", wingetId: "Fritzing.Fritzing", desc: "Electronic design automation for breadboards and prototypes", dept: "Electronics (ECE)", role: "Electronics Engineer", eligibility: "windows_winget", source: "Winget Registry", vendorUrl: "https://fritzing.org/" },
  { name: "Arduino IDE", wingetId: "Arduino.ArduinoIDE", desc: "Microcontroller programming & serial hardware debugger", dept: "Electronics (ECE)", role: "Electronics Engineer", eligibility: "windows_winget", source: "Arduino", vendorUrl: "https://www.arduino.cc/" },
  { name: "STM32CubeIDE", wingetId: "STMicroelectronics.STM32CubeIDE", desc: "C/C++ development platform for STM32 microcontrollers", dept: "Electronics (ECE)", role: "Electronics Engineer", eligibility: "vendor_direct", source: "STMicroelectronics", vendorUrl: "https://www.st.com/stm32cubeide" },

  // AI, ML & DATA SCIENCE
  { name: "Anaconda3", wingetId: "Anaconda.Anaconda3", desc: "Python Data Science, AI/ML package & environment manager", dept: "Artificial Intelligence", role: "Machine Learning Engineer", eligibility: "windows_winget", source: "Anaconda Inc", vendorUrl: "https://www.anaconda.com/" },
  { name: "JupyterLab", wingetId: "Jupyter.JupyterLab", desc: "Interactive notebook UI for Data Science & AI research", dept: "Data Science", role: "Data Analyst", eligibility: "windows_winget", source: "Project Jupyter", vendorUrl: "https://jupyter.org/" },
  { name: "CUDA Toolkit", wingetId: "Nvidia.CUDA", desc: "GPU-accelerated parallel computing development environment", dept: "Deep Learning", role: "Machine Learning Engineer", eligibility: "windows_winget", source: "NVIDIA", vendorUrl: "https://developer.nvidia.com/cuda-toolkit" },
  { name: "Ollama", wingetId: "Ollama.Ollama", desc: "Run open-source LLMs (Llama 3, Mistral, DeepSeek) locally", dept: "Artificial Intelligence", role: "Machine Learning Engineer", eligibility: "windows_winget", source: "Ollama", vendorUrl: "https://ollama.com/" },

  // MECHANICAL & CIVIL
  { name: "FreeCAD", wingetId: "FreeCAD.FreeCAD", desc: "Parametric 3D CAD modeler for mechanical design & 3D printing", dept: "Mechanical Engineering", role: "Mechanical Engineer", eligibility: "windows_winget", source: "FreeCAD Project", vendorUrl: "https://www.freecadweb.org/" },
  { name: "Blender 3D", wingetId: "BlenderFoundation.Blender", desc: "3D animation, rendering, modeling, and simulation suite", dept: "3D Animation", role: "3D Artist", eligibility: "windows_winget", source: "Blender Foundation", vendorUrl: "https://www.blender.org/" },
  { name: "LibreCAD", wingetId: "LibreCAD.LibreCAD", desc: "Open-source 2D CAD drafting application for Civil & Mech", dept: "Civil Engineering", role: "Civil Engineer", eligibility: "windows_winget", source: "LibreCAD", vendorUrl: "https://librecad.org/" },

  // COMPUTER SCIENCE & DEVOPS
  { name: "Visual Studio Code", wingetId: "Microsoft.VisualStudioCode", desc: "Code editing redefined. Industry standard IDE", dept: "Computer Science", role: "Full Stack Developer", eligibility: "windows_winget", source: "Microsoft", vendorUrl: "https://code.visualstudio.com/" },
  { name: "Docker Desktop", wingetId: "Docker.DockerDesktop", desc: "Container virtualization platform for developers & DevOps", dept: "Cloud Computing", role: "DevOps Engineer", eligibility: "windows_winget", source: "Docker Inc", vendorUrl: "https://www.docker.com/" },
  { name: "Postman", wingetId: "Postman.Postman", desc: "API development, HTTP testing, and documentation platform", dept: "Computer Science", role: "Full Stack Developer", eligibility: "windows_winget", source: "Postman", vendorUrl: "https://www.postman.com/" },
  { name: "Git", wingetId: "Git.Git", desc: "Distributed version control system", dept: "Computer Science", role: "Full Stack Developer", eligibility: "windows_winget", source: "Git Software", vendorUrl: "https://git-scm.com/" }
];

console.log("🚀 Building Master Universal Super-Catalog...");

const seenIds = new Set();
const tools = [];
let counter = 1;

// Inject Curated Expert Tools first
for (const item of curatedExpertTools) {
  seenIds.add(item.wingetId.toLowerCase());
  tools.push({
    id: `tool-${counter++}`,
    name: item.name,
    wingetId: item.wingetId,
    description: item.desc,
    department: item.dept,
    role: item.role,
    eligibility: item.eligibility,
    source: item.source,
    vendorUrl: item.vendorUrl,
    icon: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random&color=fff`
  });
}

// Fetch remaining from Winget Registry
function categorizeWinget(name, id) {
  const combined = (name + " " + id).toLowerCase();
  
  if (combined.match(/forensic|autopsy|hash|reconstruct|sleuth/)) return { dept: "Cyber Forensics", role: "Cyber Forensic Investigator", el: "windows_winget", src: "Winget Registry" };
  if (combined.match(/pcap|wire|nmap|net|sniff|port|packet|router|proxy|wireshark|putty|ssh/)) return { dept: "Network Administration", role: "SOC Analyst", el: "windows_winget", src: "Winget Registry" };
  if (combined.match(/burp|hack|pentest|metasploit|exploit|vulnerability|hydra|nmap|sec/)) return { dept: "Penetration Testing", role: "Penetration Tester", el: "windows_winget", src: "Winget Registry" };
  if (combined.match(/ghidra|ida|binary|reverse|disassembler|decompiler|x64dbg|peid/)) return { dept: "Reverse Engineering", role: "Malware Analyst", el: "windows_winget", src: "Winget Registry" };
  if (combined.match(/cuda|tensor|torch|keras|onnx|nvidia|ai|llm|ollama|chatgpt|claude|gemini/)) return { dept: "Artificial Intelligence", role: "Machine Learning Engineer", el: "windows_winget", src: "Winget Registry" };
  if (combined.match(/python|conda|jupyter|anaconda|rstudio|pandas|numpy|scikit|matlab|scilab/)) return { dept: "Data Science", role: "Data Analyst", el: "windows_winget", src: "Winget Registry" };
  if (combined.match(/kicad|fritzing|ltspice|schematic|pcb|circuit|electronics|microchip|arduino|stm32/)) return { dept: "Electronics (ECE)", role: "Electronics Engineer", el: "windows_winget", src: "Winget Registry" };
  if (combined.match(/cad|freecad|blender|autocad|solidworks|mesh|3d|stl|revit|civil/)) return { dept: "Mechanical Engineering", role: "Mechanical Engineer", el: "windows_winget", src: "Winget Registry" };
  if (combined.match(/unity|unreal|godot|game|epic|steam|render|opengl|vulkan|directx/)) return { dept: "Game Development", role: "Game Engine Developer", el: "windows_winget", src: "Winget Registry" };
  if (combined.match(/docker|kube|kubernetes|kubectl|terraform|ansible|vagrant|aws|azure|gcp|cloud|helm/)) return { dept: "Cloud Computing", role: "Cloud Architect", el: "windows_winget", src: "Winget Registry" };
  if (combined.match(/git|github|vscode|visual studio|code|jetbrains|postman|node|npm|rust|go|java|clang|gcc|cmake/)) return { dept: "Computer Science", role: "Full Stack Developer", el: "windows_winget", src: "Winget Registry" };
  if (combined.match(/figma|adobe|photoshop|illustrator|gimp|inkscape|ui|ux|canva|design/)) return { dept: "UI/UX Design", role: "UI/UX Designer", el: "windows_winget", src: "Winget Registry" };
  if (combined.match(/ffmpeg|vlc|obs|audacity|handbrake|media|player|video|audio|mp3|mp4/)) return { dept: "Audio & Video", role: "Independent User", el: "windows_winget", src: "Winget Registry" };
  if (combined.match(/office|pdf|word|excel|libreoffice|notes|obsidian|notion|document/)) return { dept: "Office & Productivity", role: "Independent User", el: "windows_winget", src: "Winget Registry" };
  
  return { dept: "General / Independent", role: "Independent User", el: "windows_winget", src: "Winget Registry" };
}

const queries = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "dev", "code", "tool", "cad", "net", "data", "sys", "sec", "ui", "ai", "ml", "db", "cli", "sdk", "lib", "studio", "pro", "open",
  "free", "manager", "editor", "viewer", "player", "converter", "utility", "work", "game", "audio", "video", "office", "web", "server",
  "cloud", "python", "java", "cpp", "node", "go", "rust", "docker", "git", "k8s"
];

for (const q of queries) {
  try {
    const cmd = `"${WINGET_PATH}" search -n 1000 "${q}"`;
    const output = execSync(cmd, { encoding: 'utf8', timeout: 15000, maxBuffer: 10 * 1024 * 1024 });
    const lines = output.split(/\r?\n/);
    
    let isHeader = false;
    for (const line of lines) {
      if (line.includes("------")) {
        isHeader = true;
        continue;
      }
      if (!isHeader || !line.trim()) continue;
      
      const parts = line.split(/\s{2,}/);
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const id = parts[1].trim();
        const version = parts[2] ? parts[2].trim() : "Latest";
        
        if (!id || id.length < 3 || seenIds.has(id.toLowerCase())) continue;
        if (id.startsWith("9N") && id.length === 12) continue;
        
        seenIds.add(id.toLowerCase());
        const { dept, role, el, src } = categorizeWinget(name, id);
        
        tools.push({
          id: `tool-${counter++}`,
          name: name,
          wingetId: id,
          description: `Official ${name} (${version}) package for Windows. Silent 1-click deployment via Winget.`,
          department: dept,
          role: role,
          eligibility: el,
          source: src,
          vendorUrl: `https://github.com/microsoft/winget-pkgs`,
          icon: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`
        });
      }
    }
    if (tools.length >= 10500) break;
  } catch (err) {
    // Continue
  }
}

const catalog = {
  departments: Array.from(new Set(departments)),
  roles: Array.from(new Set(roles)),
  tools: tools
};

const outPath = path.join(__dirname, '..', 'public', 'tools-catalog.json');
fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2));

console.log(`\n🎉 Super Catalog Generated with ${tools.length} STRICTLY UNIQUE real tools!`);
