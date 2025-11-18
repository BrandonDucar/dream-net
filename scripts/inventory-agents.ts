/**
 * Agent Inventory Script
 * 
 * Scans the codebase to find all agents, biomimetic systems, and related infrastructure.
 * Generates comprehensive documentation.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { writeFileSync } from "node:fs";

interface AgentInfo {
  name: string;
  file: string;
  type: "server" | "client" | "package" | "legacy";
  capabilities?: string[];
  description?: string;
  tier?: string;
  status?: "active" | "stub" | "legacy";
}

interface BiomimeticSystem {
  name: string;
  concept: string;
  implementation?: string[];
  kpis?: string[];
  status: "active" | "documented" | "missing";
}

const agents: AgentInfo[] = [];
const biomimeticSystems: BiomimeticSystem[] = [];

// Scan directories
function scanDirectory(dir: string, type: AgentInfo["type"]): void {
  if (!existsSync(dir)) return;
  
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
        scanDirectory(fullPath, type);
      } else if (entry.isFile()) {
        const ext = extname(entry.name);
        if ([".ts", ".js", ".tsx", ".jsx"].includes(ext)) {
          const name = basename(entry.name, ext);
          if (name.toLowerCase().includes("agent") || name.toLowerCase().includes("keeper")) {
            try {
              const content = readFileSync(fullPath, "utf-8");
              const agent: AgentInfo = {
                name: name,
                file: fullPath,
                type,
                status: content.includes("TODO") || content.includes("stub") ? "stub" : "active",
              };
              
              // Extract description
              const descMatch = content.match(/(?:description|Description|DESCRIPTION)[:\s]+['"]([^'"]+)['"]/);
              if (descMatch) agent.description = descMatch[1];
              
              // Extract capabilities
              const capMatch = content.match(/(?:capabilities|Capabilities)[:\s]*\[([^\]]+)\]/);
              if (capMatch) {
                agent.capabilities = capMatch[1].split(",").map(c => c.trim().replace(/['"]/g, ""));
              }
              
              agents.push(agent);
            } catch (err) {
              console.warn(`Failed to read ${fullPath}:`, err);
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn(`Failed to scan ${dir}:`, err);
  }
}

// Scan for agents
console.log("🔍 Scanning for agents...");
scanDirectory("server/agents", "server");
scanDirectory("client/src/agents", "client");
scanDirectory("packages", "package");
scanDirectory("agents", "legacy");
scanDirectory("lib", "legacy");

// Load biomimetic systems from docs
const biomimicryDoc = readFileSync("docs/biomimicry.md", "utf-8");
const systemMatches = biomimicryDoc.matchAll(/## ([^\n]+)\n- \*\*Concept:\*\* ([^\n]+)\n- \*\*Implementation:\*\* ([^\n]+)/g);

for (const match of systemMatches) {
  biomimeticSystems.push({
    name: match[1].trim(),
    concept: match[2].trim(),
    implementation: match[3].trim().split(", ").map(i => i.replace(/`/g, "")),
    status: "documented",
  });
}

// Generate report
const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    totalAgents: agents.length,
    byType: {
      server: agents.filter(a => a.type === "server").length,
      client: agents.filter(a => a.type === "client").length,
      package: agents.filter(a => a.type === "package").length,
      legacy: agents.filter(a => a.type === "legacy").length,
    },
    byStatus: {
      active: agents.filter(a => a.status === "active").length,
      stub: agents.filter(a => a.status === "stub").length,
      legacy: agents.filter(a => a.status === "legacy").length,
    },
    totalBiomimeticSystems: biomimeticSystems.length,
  },
  agents: agents.sort((a, b) => a.name.localeCompare(b.name)),
  biomimeticSystems,
};

// Write report
writeFileSync("AGENT_INVENTORY.json", JSON.stringify(report, null, 2));
console.log(`✅ Found ${agents.length} agents and ${biomimeticSystems.length} biomimetic systems`);
console.log(`📄 Report written to AGENT_INVENTORY.json`);

