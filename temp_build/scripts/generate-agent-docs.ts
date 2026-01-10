/**
 * Agent Documentation Generator
 * 
 * Generates individual documentation files for each agent and system.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

interface Agent {
  id: string;
  name: string;
  file: string;
  type: string;
  description?: string;
  capabilities?: string[];
  tier?: string;
  status: string;
}

interface System {
  id: string;
  name: string;
  concept: string;
  implementation: string[];
  status: string;
}

// Load inventory
const inventory = JSON.parse(readFileSync("COMPREHENSIVE_AGENT_INVENTORY.json", "utf-8"));
const agents: Agent[] = inventory.agents || [];
const systems: System[] = inventory.biomimeticSystems || [];

// Create docs directories
const agentDocsDir = "docs/agents";
const systemDocsDir = "docs/systems";

if (!existsSync(agentDocsDir)) mkdirSync(agentDocsDir, { recursive: true });
if (!existsSync(systemDocsDir)) mkdirSync(systemDocsDir, { recursive: true });

// Generate agent docs
for (const agent of agents) {
  const doc = `# ${agent.name}

## Overview
${agent.description || "Agent description pending"}

## Details
- **Type**: ${agent.type}
- **Tier**: ${agent.tier || "Standard"}
- **Status**: ${agent.status}
- **File**: \`${agent.file}\`

## Capabilities
${agent.capabilities ? agent.capabilities.map(c => `- ${c}`).join("\n") : "- Not specified"}

## Usage
\`\`\`typescript
// TODO: Add usage examples
\`\`\`

## API
\`\`\`
// TODO: Add API endpoints
\`\`\`

---
*Generated automatically from agent inventory*
`;

  const filename = `${agent.name.toLowerCase().replace(/\s+/g, "-")}.md`;
  writeFileSync(join(agentDocsDir, filename), doc);
}

// Generate system docs
for (const system of systems) {
  const doc = `# ${system.name}

## Concept
${system.concept}

## Implementation
${system.implementation.map(impl => `- \`${impl}\``).join("\n")}

## Status
${system.status}

## KPIs
${system.kpis ? system.kpis.map(kpi => `- ${kpi}`).join("\n") : "- Not specified"}

## Related Systems
${systems.filter(s => s.id !== system.id && s.implementation.some(i => system.implementation.includes(i))).map(s => `- [${s.name}](./${s.id.replace(/\s+/g, "-").toLowerCase()}.md)`).join("\n") || "- None"}

---
*Generated automatically from biomimetic systems inventory*
`;

  // Sanitize filename - remove special characters
  const sanitizedId = system.id.replace(/[^a-zA-Z0-9-]/g, "-").replace(/-+/g, "-").toLowerCase();
  const filename = `${sanitizedId}.md`;
  writeFileSync(join(systemDocsDir, filename), doc);
}

console.log(`✅ Generated ${agents.length} agent docs and ${systems.length} system docs`);

