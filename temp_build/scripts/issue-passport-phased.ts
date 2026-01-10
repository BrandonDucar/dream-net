

#!/usr/bin / env tsx
/**
 * Phased Passport Issuance Script
 * Issue passports to agents/systems one or a few at a time
 * 
 * Usage:
 *   pnpm tsx scripts/issue-passport-phased.ts --agent LUCID
 *   pnpm tsx scripts/issue-passport-phased.ts --fleet aegis --count 3
 *   pnpm tsx scripts/issue-passport-phased.ts --list-pending
 */

import { CitizenshipStore } from "@dreamnet/dream-state-core/store/citizenshipStore";
import { registerAgent, registerCitizen } from "@dreamnet/directory/registry";
import type { DreamPassportTier } from "@dreamnet/dream-state-core/types";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read agent inventory
const inventoryPath = join(__dirname, "..", "COMPREHENSIVE_AGENT_INVENTORY.json");
const COMPREHENSIVE_AGENT_INVENTORY = JSON.parse(readFileSync(inventoryPath, "utf-8"));

interface AgentEntry {
  id: string;
  name: string;
  file: string;
  type: string;
  status: string;
  description?: string;
}

// Fleet definitions
const FLEETS = {
  aegis: {
    name: "Aegis Fleet",
    clusterId: "AEGIS_FLEET",
    department: "dept:security",
    tier: "architect" as DreamPassportTier,
    agents: [
      "AegisCommand",
      "AegisSentinel",
      "AegisPrivacyLab",
      "AegisCipherMesh",
      "AegisInteropNexus",
      "AegisLogisticsNetwork", // ✅ Built
      "AegisMaintenanceIntelligence",
      "AegisVanguard",
      "AegisReliefCommand",
      "AegisSandbox"
    ]
  },
  travel: {
    name: "Travel Fleet",
    clusterId: "TRAVEL_FLEET",
    department: "dept:commerce",
    tier: "operator" as DreamPassportTier,
    agents: [
      "GroundAtlas" // ✅ Built
    ]
  },
  legal: {
    name: "Legal Fleet",
    clusterId: "LEGAL_FLEET",
    department: "dept:governance",
    tier: "architect" as DreamPassportTier,
    agents: [
      "LawyerAgent",
      "ComplianceChecker"
    ]
  },
  creative: {
    name: "Creative Fleet",
    clusterId: "CREATIVE_FLEET",
    department: "dept:communications",
    tier: "operator" as DreamPassportTier,
    agents: [
      "ShowBuilder",
      "DesignStudio"
    ]
  },
  ott: {
    name: "OTT Fleet",
    clusterId: "OTT_FLEET",
    department: "dept:communications",
    tier: "operator" as DreamPassportTier,
    agents: [
      // TBD - OTT agents
    ]
  },
  science: {
    name: "Science Fleet",
    clusterId: "SCIENCE_FLEET",
    department: "dept:research",
    tier: "operator" as DreamPassportTier,
    agents: [
      "Archimedes" // TBD
    ]
  }
};

// Core Dream agents (highest priority)
const CORE_DREAM_AGENTS = [
  "LUCID",
  "CANVAS",
  "ROOT",
  "ECHO",
  "CRADLE",
  "WING"
];

// Keeper agents (high priority)
const KEEPER_AGENTS = [
  "DreamKeeper",
  "DeployKeeper",
  "EnvKeeper",
  "APIKeeper",
  "CoinSensei"
];

function cleanAgentId(id: string): string {
  return id.replace(/^(server-|client-|package-|foundry-|system-|legacy-|nano-)/, "");
}

function determineTier(agent: AgentEntry | string): DreamPassportTier {
  const name = typeof agent === "string" ? agent : agent.name.toUpperCase();

  // Core Dream agents
  if (CORE_DREAM_AGENTS.includes(name)) {
    return "operator";
  }

  // Keeper agents
  if (KEEPER_AGENTS.some(k => name.includes(k.toUpperCase()))) {
    return "operator";
  }

  // Aegis agents
  if (name.startsWith("AEGIS")) {
    return "architect";
  }

  // Critical systems
  if (name.includes("SPINE") || name.includes("NERVE") || name.includes("SHIELD")) {
    return "architect";
  }

  return "citizen";
}

function determineFlags(agent: AgentEntry | string, fleet?: string): string[] {
  const flags: string[] = [];
  const name = typeof agent === "string" ? agent : agent.name.toUpperCase();

  if (typeof agent !== "string" && agent.status === "active") {
    flags.push("active");
  }

  if (fleet) {
    flags.push(`fleet:${fleet}`);
  }

  if (name.includes("CORE") || name.includes("KEEPER")) {
    flags.push("core");
  }

  if (name.startsWith("AEGIS")) {
    flags.push("aegis", "defense");
  }

  return flags;
}

function determineClusterId(agent: AgentEntry | string, fleet?: string): string | undefined {
  const name = typeof agent === "string" ? agent : agent.name.toUpperCase();

  if (fleet && FLEETS[fleet as keyof typeof FLEETS]) {
    return FLEETS[fleet as keyof typeof FLEETS].clusterId;
  }

  if (name.startsWith("AEGIS")) return "AEGIS_FLEET";
  if (name.includes("TRAVEL") || name === "GROUNDATLAS") return "TRAVEL_FLEET";
  if (name.includes("OTT")) return "OTT_FLEET";
  if (name.includes("SCIENCE") || name === "ARCHIMEDES") return "SCIENCE_FLEET";
  if (name.includes("LEGAL") || name === "LAWYERAGENT") return "LEGAL_FLEET";
  if (name.includes("CREATIVE") || name === "SHOWBUILDER") return "CREATIVE_FLEET";

  // Biomimetic clusters
  if (name.includes("WOLF") || name.includes("PACK")) return "WOLF_PACK";
  if (name.includes("OCTOPUS")) return "OCTOPUS";
  if (name.includes("SPIDER") || name.includes("WEB")) return "SPIDER_WEB";
  if (name.includes("SHIELD")) return "SHIELD_CORE";
  if (name.includes("API") || name.includes("KEEPER")) return "API_KEEPER";
  if (name.includes("STAR") || name.includes("BRIDGE")) return "STAR_BRIDGE";

  return undefined;
}

/**
 * Issue passport to a single agent
 */
async function issuePassportToAgent(
  agentName: string,
  fleet?: string
): Promise<{ success: boolean; passport?: any; error?: string }> {
  try {
    // Find agent in inventory
    const agents = (COMPREHENSIVE_AGENT_INVENTORY as any).agents as AgentEntry[];
    const agent = agents.find(a =>
      a.name.toUpperCase() === agentName.toUpperCase() ||
      cleanAgentId(a.id).toUpperCase() === agentName.toUpperCase()
    );

    if (!agent && !fleet) {
      // Check if it's a fleet agent
      const fleetAgents = Object.values(FLEETS).flatMap(f => f.agents);
      const fleetAgent = fleetAgents.find(a => a.toUpperCase() === agentName.toUpperCase());

      if (!fleetAgent) {
        return { success: false, error: `Agent "${agentName}" not found` };
      }

      // It's a fleet agent - create synthetic entry
      const syntheticAgent: AgentEntry = {
        id: `fleet-${agentName.toLowerCase()}`,
        name: agentName,
        file: `fleet/${agentName}`,
        type: "fleet",
        status: "active",
        description: `Fleet agent: ${agentName}`
      };

      return await issuePassportToAgentEntry(syntheticAgent, fleet);
    }

    if (!agent) {
      return { success: false, error: `Agent "${agentName}" not found` };
    }

    return await issuePassportToAgentEntry(agent, fleet);
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Issue passport to agent entry
 */
async function issuePassportToAgentEntry(
  agent: AgentEntry,
  fleet?: string
): Promise<{ success: boolean; passport?: any; error?: string }> {
  try {
    const agentId = cleanAgentId(agent.id);
    const tier = determineTier(agent);
    const flags = determineFlags(agent, fleet);
    const clusterId = determineClusterId(agent, fleet);

    // Check if passport already exists
    const identityId = `agent:${agentId}`;
    const existingPassport = CitizenshipStore.getPassport(identityId);

    if (existingPassport) {
      return {
        success: true,
        passport: existingPassport,
        error: "Passport already exists"
      };
    }

    // 1. Register agent in Directory
    registerAgent({
      agentId,
      label: agent.name,
      clusterId,
      kind: agent.type === "server" ? "infra" : agent.type === "client" ? "social" : "system",
      description: agent.description || `Agent from ${agent.file}`
    });

    // 2. Issue passport
    const passport = CitizenshipStore.issuePassport(identityId, tier, flags);

    // 3. Register as citizen
    const citizenId = `CIT-${agentId}`;
    registerCitizen({
      citizenId,
      label: `${agent.name} (Agent Citizen)`,
      description: `Agent citizen with passport ${passport.id}, tier ${tier}`
    });

    const clusterInfo = clusterId ? ` [${clusterId}]` : "";
    console.log(`✅ ${agent.name} → Citizen ${citizenId} (Passport: ${passport.id}, Tier: ${tier}${clusterInfo})`);

    return { success: true, passport };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Issue passports to fleet agents (one or a few at a time)
 */
async function issuePassportsToFleet(
  fleetName: string,
  count?: number
): Promise<{ success: boolean; issued: number; errors: string[] }> {
  const fleet = FLEETS[fleetName as keyof typeof FLEETS];

  if (!fleet) {
    console.error(`❌ Fleet "${fleetName}" not found`);
    return { success: false, issued: 0, errors: [`Fleet "${fleetName}" not found`] };
  }

  console.log(`\n🏛️ Issuing passports to ${fleet.name}...\n`);

  const agentsToProcess = count
    ? fleet.agents.slice(0, count)
    : fleet.agents;

  const results = {
    issued: 0,
    errors: [] as string[]
  };

  for (const agentName of agentsToProcess) {
    const result = await issuePassportToAgent(agentName, fleetName);

    if (result.success) {
      results.issued++;
    } else {
      results.errors.push(`${agentName}: ${result.error}`);
      console.error(`❌ Failed to issue passport to ${agentName}: ${result.error}`);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Issued: ${results.issued}/${agentsToProcess.length}`);
  console.log(`   Errors: ${results.errors.length}`);

  return { success: results.issued > 0, issued: results.issued, errors: results.errors };
}

/**
 * List pending agents (not yet issued passports)
 */
function listPendingAgents(fleet?: string): void {
  const agents = (COMPREHENSIVE_AGENT_INVENTORY as any).agents as AgentEntry[];
  const passports = CitizenshipStore.listPassports();
  const passportIdentityIds = new Set(passports.map(p => p.identityId));

  const pending = agents.filter(agent => {
    if (agent.status === "stub") return false;

    const identityId = `agent:${cleanAgentId(agent.id)}`;
    return !passportIdentityIds.has(identityId);
  });

  if (fleet) {
    const fleetAgents = FLEETS[fleet as keyof typeof FLEETS]?.agents || [];
    const fleetPending = pending.filter(agent =>
      fleetAgents.some(fa => agent.name.toUpperCase() === fa.toUpperCase())
    );

    console.log(`\n📋 Pending agents in ${fleet}:`);
    fleetPending.forEach(agent => {
      console.log(`   - ${agent.name} (${agent.type})`);
    });
    console.log(`\n   Total: ${fleetPending.length} pending`);
  } else {
    console.log(`\n📋 Pending agents (not yet issued passports):`);

    // Group by priority
    const corePending = pending.filter(a => CORE_DREAM_AGENTS.includes(a.name.toUpperCase()));
    const keeperPending = pending.filter(a => KEEPER_AGENTS.some(k => a.name.toUpperCase().includes(k.toUpperCase())));
    const fleetPending = pending.filter(a =>
      Object.values(FLEETS).some(f => f.agents.some(fa => a.name.toUpperCase() === fa.toUpperCase()))
    );
    const otherPending = pending.filter(a =>
      !corePending.includes(a) && !keeperPending.includes(a) && !fleetPending.includes(a)
    );

    if (corePending.length > 0) {
      console.log(`\n   🔴 Core Dream Agents (${corePending.length}):`);
      corePending.forEach(a => console.log(`      - ${a.name}`));
    }

    if (keeperPending.length > 0) {
      console.log(`\n   🟠 Keeper Agents (${keeperPending.length}):`);
      keeperPending.forEach(a => console.log(`      - ${a.name}`));
    }

    if (fleetPending.length > 0) {
      console.log(`\n   🟡 Fleet Agents (${fleetPending.length}):`);
      fleetPending.forEach(a => console.log(`      - ${a.name}`));
    }

    if (otherPending.length > 0) {
      console.log(`\n   ⚪ Other Agents (${otherPending.length}):`);
      otherPending.slice(0, 10).forEach(a => console.log(`      - ${a.name}`));
      if (otherPending.length > 10) {
        console.log(`      ... and ${otherPending.length - 10} more`);
      }
    }

    console.log(`\n   Total: ${pending.length} pending`);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--list-pending")) {
    const fleetArg = args.find(a => a.startsWith("--fleet="));
    const fleet = fleetArg ? fleetArg.split("=")[1] : undefined;
    listPendingAgents(fleet);
    return;
  }

  if (args.includes("--agent")) {
    const agentIndex = args.indexOf("--agent");
    const agentName = args[agentIndex + 1];
    const fleetArg = args.find(a => a.startsWith("--fleet="));
    const fleet = fleetArg ? fleetArg.split("=")[1] : undefined;

    if (!agentName) {
      console.error("❌ --agent requires agent name");
      process.exit(1);
    }

    console.log(`\n🏛️ Issuing passport to agent: ${agentName}${fleet ? ` (Fleet: ${fleet})` : ""}\n`);
    const result = await issuePassportToAgent(agentName, fleet);

    if (result.success) {
      console.log(`\n✅ Success! Passport issued: ${result.passport?.id}`);
    } else {
      console.error(`\n❌ Failed: ${result.error}`);
      process.exit(1);
    }
    return;
  }

  if (args.includes("--fleet")) {
    const fleetIndex = args.indexOf("--fleet");
    const fleetName = args[fleetIndex + 1];
    const countArg = args.find(a => a.startsWith("--count="));
    const count = countArg ? parseInt(countArg.split("=")[1]) : undefined;

    if (!fleetName) {
      console.error("❌ --fleet requires fleet name");
      console.log("Available fleets: aegis, travel, ott, science");
      process.exit(1);
    }

    const result = await issuePassportsToFleet(fleetName, count);

    if (result.success) {
      console.log(`\n✅ Success! Issued ${result.issued} passport(s)`);
    } else {
      console.error(`\n❌ Failed: ${result.errors.join(", ")}`);
      process.exit(1);
    }
    return;
  }

  // Default: Show help
  console.log(`
🏛️ Phased Passport Issuance Script

Usage:
  # Issue passport to single agent
  pnpm tsx scripts/issue-passport-phased.ts --agent LUCID
  
  # Issue passport to agent in fleet
  pnpm tsx scripts/issue-passport-phased.ts --agent AegisLogisticsNetwork --fleet=aegis
  
  # Issue passports to fleet (all agents)
  pnpm tsx scripts/issue-passport-phased.ts --fleet aegis
  
  # Issue passports to fleet (first N agents)
  pnpm tsx scripts/issue-passport-phased.ts --fleet aegis --count=3
  
  # List pending agents
  pnpm tsx scripts/issue-passport-phased.ts --list-pending
  
  # List pending agents in fleet
  pnpm tsx scripts/issue-passport-phased.ts --list-pending --fleet=aegis

Available Fleets:
  - aegis    (Aegis Fleet - Military/Defense)
  - travel   (Travel Fleet - Travel & Logistics)
  - ott      (OTT Fleet - Communications & Media)
  - science  (Science Fleet - Research & Development)

Priority Agents:
  Core Dream: ${CORE_DREAM_AGENTS.join(", ")}
  Keepers: ${KEEPER_AGENTS.join(", ")}
`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { issuePassportToAgent, issuePassportsToFleet, listPendingAgents };

