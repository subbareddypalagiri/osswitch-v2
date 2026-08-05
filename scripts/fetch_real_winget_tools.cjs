const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

function categorize(name, id) {
  const combined = (name + " " + id).toLowerCase();
  
  if (combined.match(/forensic|autopsy|hash|reconstruct|sleuth/)) return { dept: "Cyber Forensics", role: "Cyber Forensic Investigator" };
  if (combined.match(/pcap|wire|nmap|net|sniff|port|packet|router|proxy|wireshark|putty|ssh/)) return { dept: "Network Administration", role: "SOC Analyst" };
  if (combined.match(/burp|hack|pentest|metasploit|exploit|vulnerability|hydra|nmap|sec/)) return { dept: "Penetration Testing", role: "Penetration Tester" };
  if (combined.match(/ghidra|ida|binary|reverse|disassembler|decompiler|x64dbg|peid/)) return { dept: "Reverse Engineering", role: "Malware Analyst" };
  if (combined.match(/cuda|tensor|torch|keras|onnx|nvidia|ai|llm|ollama|chatgpt|claude|gemini/)) return { dept: "Artificial Intelligence", role: "Machine Learning Engineer" };
  if (combined.match(/python|conda|jupyter|anaconda|rstudio|pandas|numpy|scikit|matlab|scilab/)) return { dept: "Data Science", role: "Data Analyst" };
  if (combined.match(/kicad|fritzing|ltspice|schematic|pcb|circuit|electronics|microchip|arduino|stm32/)) return { dept: "Electronics (ECE)", role: "Electronics Engineer" };
  if (combined.match(/cad|freecad|blender|autocad|solidworks|mesh|3d|stl|revit|civil/)) return { dept: "Mechanical Engineering", role: "Mechanical Engineer" };
  if (combined.match(/unity|unreal|godot|game|epic|steam|render|opengl|vulkan|directx/)) return { dept: "Game Development", role: "Game Engine Developer" };
  if (combined.match(/docker|kube|kubernetes|kubectl|terraform|ansible|vagrant|aws|azure|gcp|cloud|helm/)) return { dept: "Cloud Computing", role: "Cloud Architect" };
  if (combined.match(/git|github|vscode|visual studio|code|jetbrains|postman|node|npm|rust|go|java|clang|gcc|cmake/)) return { dept: "Computer Science", role: "Full Stack Developer" };
  if (combined.match(/figma|adobe|photoshop|illustrator|gimp|inkscape|ui|ux|canva|design/)) return { dept: "UI/UX Design", role: "UI/UX Designer" };
  if (combined.match(/ffmpeg|vlc|obs|audacity|handbrake|media|player|video|audio|mp3|mp4/)) return { dept: "Audio & Video", role: "Independent User" };
  if (combined.match(/office|pdf|word|excel|libreoffice|notes|obsidian|notion|document/)) return { dept: "Office & Productivity", role: "Independent User" };
  
  return { dept: "General / Independent", role: "Independent User" };
}

const queries = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "dev", "code", "tool", "cad", "net", "data", "sys", "sec", "ui", "ai", "ml", "db", "cli", "sdk", "lib", "studio", "pro", "open",
  "free", "manager", "editor", "viewer", "player", "converter", "utility", "work", "game", "audio", "video", "office", "web", "server",
  "cloud", "python", "java", "cpp", "node", "go", "rust", "docker", "git", "k8s"
];

console.log("🚀 Querying Microsoft Winget Package Registry for 10,000+ Real Tools...");

const seenIds = new Set();
const tools = [];

let counter = 1;

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
        
        const { dept, role } = categorize(name, id);
        
        tools.push({
          id: `tool-${counter++}`,
          name: name,
          wingetId: id,
          description: `Official ${name} (${version}) package for Windows. Silent 1-click deployment via Winget.`,
          department: dept,
          role: role,
          icon: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`
        });
      }
    }
    console.log(`Query '${q}': Total Unique Real Tools collected so far = ${tools.length}`);
    if (tools.length >= 10500) break;
  } catch (err) {
    // Keep collecting across queries
  }
}

console.log(`\n🎉 Total Unique Real Winget Packages collected: ${tools.length}`);

const catalog = {
  departments: Array.from(new Set(departments)),
  roles: Array.from(new Set(roles)),
  tools: tools
};

const outPath = path.join(__dirname, '..', 'public', 'tools-catalog.json');
fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2));

console.log(`\n✅ Saved ${tools.length} STRICTLY UNIQUE real tools to ${outPath}!`);
