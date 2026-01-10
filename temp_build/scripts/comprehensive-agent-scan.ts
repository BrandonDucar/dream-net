/**
 * Comprehensive Agent & System Scanner
 * 
 * Deep scan of entire codebase to find ALL agents, systems, and biomimetic patterns.
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { writeFileSync } from "node:fs";

interface Agent {
  id: string;
  name: string;
  file: string;
  type: "server" | "client" | "package" | "legacy" | "foundry" | "nano" | "system";
  description?: string;
  capabilities?: string[];
  tier?: string;
  status: "active" | "stub" | "documented" | "missing";
  metadata?: Record<string, unknown>;
}

interface BiomimeticSystem {
  id: string;
  name: string;
  concept: string;
  implementation: string[];
  kpis?: string[];
  status: "active" | "documented" | "missing" | "partial";
  files?: string[];
}

const agents: Agent[] = [];
const systems: BiomimeticSystem[] = [];
const scannedFiles = new Set<string>();

function scanFile(filePath: string, type: Agent["type"]): void {
  if (scannedFiles.has(filePath)) return;
  scannedFiles.add(filePath);

  try {
    const content = readFileSync(filePath, "utf-8");
    const fileName = basename(filePath, extname(filePath));
    
    // Check if it's an agent file
    const isAgent = 
      fileName.toLowerCase().includes("agent") ||
      fileName.toLowerCase().includes("keeper") ||
      fileName.toLowerCase().includes("keeper") ||
      content.includes("export.*agent") ||
      content.includes("class.*Agent") ||
      content.includes("Agent.*=") ||
      content.match(/agent.*\{/i);

    if (isAgent) {
      const agent: Agent = {
        id: `${type}-${fileName}`,
        name: fileName,
        file: filePath,
        type,
        status: content.includes("TODO") || content.includes("stub") ? "stub" : "active",
      };

      // Extract metadata
      const descMatch = content.match(/(?:description|Description|summary|Summary)[:\s]+['"`]([^'"`]+)['"`]/);
      if (descMatch) agent.description = descMatch[1];

      const tierMatch = content.match(/(?:tier|Tier)[:\s]+['"`]([^'"`]+)['"`]/);
      if (tierMatch) agent.tier = tierMatch[1];

      const capMatch = content.match(/(?:capabilities|Capabilities)[:\s]*\[([^\]]+)\]/);
      if (capMatch) {
        agent.capabilities = capMatch[1].split(",").map(c => c.trim().replace(/['"`]/g, ""));
      }

      agents.push(agent);
    }

    // Check for biomimetic system references
    const biomimeticKeywords = [
      "swarm", "octopus", "chameleon", "wolf", "falcon", "snail", "zen.*garden",
      "cloud", "magnetic.*rail", "triple.*helix", "spine", "foundry", "forge"
    ];

    for (const keyword of biomimeticKeywords) {
      const regex = new RegExp(keyword, "i");
      if (regex.test(content) && !systems.find(s => s.name.toLowerCase().includes(keyword))) {
        systems.push({
          id: keyword.replace(/\s+/g, "-"),
          name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
          concept: `Found in ${filePath}`,
          implementation: [filePath],
          status: "active",
        });
      }
    }
  } catch (err) {
    // Skip files we can't read
  }
}

function scanDirectory(dir: string, type: Agent["type"], depth = 0): void {
  if (depth > 10) return; // Prevent infinite recursion
  if (!existsSync(dir)) return;
  if (dir.includes("node_modules") || dir.includes(".git") || dir.includes("dist")) return;

  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Special handling for known agent directories
        if (entry.name === "agents" || entry.name === "agent" || entry.name === "keepers") {
          scanDirectory(fullPath, type === "server" ? "server" : type, depth + 1);
        } else if (entry.name === "nano") {
          scanDirectory(fullPath, "nano", depth + 1);
        } else {
          scanDirectory(fullPath, type, depth + 1);
        }
      } else if (entry.isFile()) {
        const ext = extname(entry.name);
        if ([".ts", ".js", ".tsx", ".jsx", ".cjs", ".mjs"].includes(ext)) {
          scanFile(fullPath, type);
        }
      }
    }
  } catch (err) {
    // Skip directories we can't read
  }
}

// Load known systems from docs
function loadBiomimeticSystems(): void {
  try {
    const biomimicryDoc = readFileSync("docs/biomimicry.md", "utf-8");
    const systemMatches = biomimicryDoc.matchAll(/## ([^\n]+)\n- \*\*Concept:\*\* ([^\n]+)\n- \*\*Implementation:\*\* ([^\n]+)/g);

    for (const match of systemMatches) {
      const name = match[1].trim();
      const concept = match[2].trim();
      const impl = match[3].trim().replace(/`/g, "").split(", ");

      systems.push({
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        concept,
        implementation: impl,
        status: "documented",
      });
    }
  } catch (err) {
    console.warn("Could not load biomimicry.md:", err);
  }
}

console.log("🔍 Starting comprehensive scan...");

// Scan all directories
scanDirectory("server", "server");
scanDirectory("client", "client");
scanDirectory("packages", "package");
scanDirectory("agents", "legacy");
scanDirectory("lib", "system");
scanDirectory("dream-agent-store", "foundry");
scanDirectory("scripts", "system");

// Load documented systems
loadBiomimeticSystems();

// Add Super Spine and Wolf Pack (we just created these)
agents.push({
  id: "server-super-spine",
  name: "Super Spine",
  file: "server/core/SuperSpine.ts",
  type: "system",
  description: "Agent orchestration backbone",
  status: "active",
});

agents.push({
  id: "server-wolf-pack",
  name: "Wolf Pack",
  file: "server/agents/WolfPack.ts",
  type: "server",
  description: "Funding Hunter agent",
  tier: "Premium",
  capabilities: ["funding", "communication", "analysis"],
  status: "active",
});

// Generate comprehensive report
const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    totalAgents: agents.length,
    byType: {
      server: agents.filter(a => a.type === "server").length,
      client: agents.filter(a => a.type === "client").length,
      package: agents.filter(a => a.type === "package").length,
      legacy: agents.filter(a => a.type === "legacy").length,
      foundry: agents.filter(a => a.type === "foundry").length,
      nano: agents.filter(a => a.type === "nano").length,
      system: agents.filter(a => a.type === "system").length,
    },
    byStatus: {
      active: agents.filter(a => a.status === "active").length,
      stub: agents.filter(a => a.status === "stub").length,
      documented: agents.filter(a => a.status === "documented").length,
    },
    totalBiomimeticSystems: systems.length,
    systemsByStatus: {
      active: systems.filter(s => s.status === "active").length,
      documented: systems.filter(s => s.status === "documented").length,
      missing: systems.filter(s => s.status === "missing").length,
      partial: systems.filter(s => s.status === "partial").length,
    },
  },
  agents: agents.sort((a, b) => a.name.localeCompare(b.name)),
  biomimeticSystems: systems.sort((a, b) => a.name.localeCompare(b.name)),
  notes: [
    "This is an automated scan. Some agents may be referenced but not yet implemented.",
    "The user mentioned 130+ agents - this scan found the files. Full registry may be in database or config files.",
    "Biomimetic systems may have additional implementations not captured in this scan.",
  ],
};

writeFileSync("COMPREHENSIVE_AGENT_INVENTORY.json", JSON.stringify(report, null, 2));
console.log(`✅ Found ${agents.length} agents and ${systems.length} biomimetic systems`);
console.log(`📄 Report written to COMPREHENSIVE_AGENT_INVENTORY.json`);

