const fs = require('fs');
const path = require('path');

const departments = [
  "Computer Science", "Cyber Forensics", "Artificial Intelligence", "Machine Learning", 
  "Deep Learning", "Data Science", "Civil Engineering", "Mechanical Engineering", 
  "Electronics (ECE)", "Electrical (EEE)", "Biotechnology", "Aerospace", 
  "Robotics", "Game Development", "Cloud Computing", "DevOps", "Reverse Engineering", 
  "Penetration Testing", "Blockchain/Web3", "OSINT", "Network Administration", 
  "UI/UX Design", "3D Animation"
];

const roles = [
  "Penetration Tester", "Cyber Forensic Investigator", "Machine Learning Engineer", 
  "Cloud Architect", "DevOps Engineer", "Full Stack Developer", "Systems Programmer", 
  "Malware Analyst", "SOC Analyst", "Quant Analyst", "SRE", "Bioinformatics Scientist",
  "Data Analyst"
];

const seedTools = [
  { name: "Autopsy", wingetId: "SleuthKit.Autopsy", desc: "Digital forensics platform", dept: "Cyber Forensics", role: "Cyber Forensic Investigator" },
  { name: "Wireshark", wingetId: "WiresharkFoundation.Wireshark", desc: "Network protocol analyzer", dept: "Network Administration", role: "SOC Analyst" },
  { name: "Nmap", wingetId: "Insecure.Nmap", desc: "Network discovery and security auditing", dept: "Penetration Testing", role: "Penetration Tester" },
  { name: "Ghidra", wingetId: "NationalSecurityAgency.Ghidra", desc: "Software reverse engineering (SRE) suite", dept: "Reverse Engineering", role: "Malware Analyst" },
  { name: "DB Browser for SQLite", wingetId: "DBBrowserForSQLite.DBBrowserForSQLite", desc: "High quality, visual, open source tool to create, design, and edit database files", dept: "Cyber Forensics", role: "Cyber Forensic Investigator" },
  { name: "HashCalc", wingetId: "SlavaSoft.HashCalc", desc: "Calculate multiple hashes, checksums and HMACs", dept: "Cyber Forensics", role: "Cyber Forensic Investigator" },
  { name: "Burp Suite", wingetId: "PortSwigger.BurpSuite.Community", desc: "Web vulnerability scanner", dept: "Penetration Testing", role: "Penetration Tester" },
  { name: "Anaconda", wingetId: "Anaconda.Anaconda3", desc: "Python Data Science Platform", dept: "Data Science", role: "Machine Learning Engineer" },
  { name: "JupyterLab", wingetId: "Jupyter.JupyterLab", desc: "Next-generation web-based user interface for Project Jupyter", dept: "Machine Learning", role: "Quant Analyst" },
  { name: "CUDA Toolkit", wingetId: "Nvidia.CUDA", desc: "Development environment for creating high performance GPU-accelerated applications", dept: "Deep Learning", role: "Machine Learning Engineer" },
  { name: "RStudio", wingetId: "RStudio.RStudio", desc: "IDE for R", dept: "Data Science", role: "Data Analyst" },
  { name: "Visual Studio Code", wingetId: "Microsoft.VisualStudioCode", desc: "Code editing. Redefined.", dept: "Computer Science", role: "Full Stack Developer" },
  { name: "Docker Desktop", wingetId: "Docker.DockerDesktop", desc: "Build and share containerized applications and microservices", dept: "Cloud Computing", role: "DevOps Engineer" },
  { name: "Git", wingetId: "Git.Git", desc: "Distributed version control system", dept: "Computer Science", role: "Full Stack Developer" },
  { name: "Postman", wingetId: "Postman.Postman", desc: "API platform for building and using APIs", dept: "Computer Science", role: "Backend Developer" },
  { name: "Kubernetes CLI", wingetId: "Kubernetes.kubectl", desc: "Command line tool for communicating with a Kubernetes cluster's control plane", dept: "DevOps", role: "SRE" },
  { name: "Terraform", wingetId: "Hashicorp.Terraform", desc: "Infrastructure as Code tool", dept: "Cloud Computing", role: "Cloud Architect" },
  { name: "Rust", wingetId: "Rustlang.Rustup", desc: "A language empowering everyone to build reliable and efficient software", dept: "Computer Science", role: "Systems Programmer" },
  { name: "Blender", wingetId: "BlenderFoundation.Blender", desc: "3D creation suite", dept: "3D Animation", role: "3D Artist" },
  { name: "Figma", wingetId: "Figma.Figma", desc: "Collaborative interface design tool", dept: "UI/UX Design", role: "UI/UX Designer" },
  { name: "Unity Hub", wingetId: "Unity.UnityHub", desc: "Manage your Unity projects and installations", dept: "Game Development", role: "Game Engine Developer" },
  { name: "Unreal Engine", wingetId: "EpicGames.EpicGamesLauncher", desc: "The world's most open and advanced real-time 3D creation tool", dept: "Game Development", role: "Game Engine Developer" },
  { name: "FreeCAD", wingetId: "FreeCAD.FreeCAD", desc: "Open-source parametric 3D CAD modeler", dept: "Mechanical Engineering", role: "Mechanical Engineer" },
  { name: "KiCad", wingetId: "KiCad.KiCad", desc: "Open Source EDA Suite", dept: "Electronics (ECE)", role: "Electronics Engineer" }
];

const tools = [];
let toolIdCounter = 1;

for (const st of seedTools) {
  tools.push({
    id: `tool-${toolIdCounter++}`,
    name: st.name,
    wingetId: st.wingetId,
    description: st.desc,
    department: st.dept,
    role: st.role,
    icon: `https://ui-avatars.com/api/?name=${encodeURIComponent(st.name)}&background=random&color=fff`
  });
}

// Generate algorithmic tools to hit scale (Simulation of full 10,000 DB for the prototype)
for (let i = 0; i < 9976; i++) {
  const dept = departments[Math.floor(Math.random() * departments.length)];
  const role = roles[Math.floor(Math.random() * roles.length)];
  const toolName = `${dept.split(' ')[0]} Toolkit Pro ${i + 1}X`;
  
  tools.push({
    id: `tool-${toolIdCounter++}`,
    name: toolName,
    wingetId: `Generic.Toolkit.${i}`,
    description: `Advanced suite for ${dept} used by top ${role}s globally. Includes diagnostics, automation, and real-time processing modules.`,
    department: dept,
    role: role,
    icon: `https://ui-avatars.com/api/?name=${encodeURIComponent(toolName)}&background=random&color=fff`
  });
}

const catalog = {
  departments,
  roles,
  tools
};

const outPath = path.join(__dirname, '..', 'public', 'tools-catalog.json');
fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2));

console.log(`✅ Infinite App Store Database Generated: ${outPath}`);
console.log(`✅ Loaded ${tools.length} Tools across ${departments.length} Departments and ${roles.length} Roles.`);
