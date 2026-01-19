#!/usr/bin/env tsx
/**
 * Register All 143 Agents as DreamNet Citizens
 * Issues passports and registers in Directory
 * 
 * Usage: pnpm tsx scripts/register-all-agents-as-citizens.ts
 */

import { registerAgent, registerCitizen } from "../packages/directory/src/registry";
import { CitizenshipStore } from "../packages/dream-state-core/src/store/citizenshipStore";
import type { DreamPassportTier } from "../packages/dream-state-core/src/types";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read JSON file
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

function cleanAgentId(id: string): string {
  // Remove type prefixes: "server-", "client-", etc.
  return id.replace(/^(server-|client-|package-|foundry-|system-|legacy-|nano-)/, "");
}

function determineTier(agent: AgentEntry): DreamPassportTier {
  const name = agent.name.toUpperCase();

  // Core Dream agents
  if (["LUCID", "CANVAS", "ROOT", "ECHO", "CRADLE", "WING"].includes(name)) {
    return "operator";
  }

  // Keeper agents
  if (name.includes("KEEPER") || name === "COINSENSEI" || name.includes("DREAMKEEPER")) {
    return "operator";
  }

  // Aegis agents
  if (name.startsWith("AEGIS")) {
    return "architect";
  }

  // Critical systems
  if (name.includes("SPINE") || name.includes("NERVE") || name.includes("SHIELD") ||
    name.includes("DEFENSE") || name.includes("CORE")) {
    return "architect";
  }

  // Server agents (important backend)
  if (agent.type === "server" &&
    !name.includes("DEMO") &&
    !name.includes("TEST") &&
    !name.includes("ROUTE")) {
    return "citizen";
  }

  // Package agents (shared libraries)
  if (agent.type === "package") {
    return "citizen";
  }

  // Client UI agents
  if (agent.type === "client") {
    return "dreamer";
  }

  // Foundry/system agents
  if (agent.type === "foundry" || agent.type === "system") {
    return "citizen";
  }

  // Default
  return "citizen";
}

function determineFlags(agent: AgentEntry): string[] {
  const flags: string[] = [];
  const name = agent.name.toUpperCase();

  if (agent.status === "active") flags.push("active");
  if (agent.type === "server") flags.push("backend");
  if (agent.type === "client") flags.push("frontend");
  if (agent.type === "package") flags.push("shared");

  // Core system flags
  if (name.includes("CORE") || name.includes("KEEPER")) flags.push("core");
  if (name.startsWith("AEGIS")) flags.push("aegis", "defense");
  if (name.includes("SPINE") || name.includes("NERVE")) flags.push("nervous-system");
  if (name.includes("SHIELD") || name.includes("DEFENSE")) flags.push("defense");

  // Biomimetic flags
  if (name.includes("WOLF") || name.includes("PACK")) flags.push("wolf-pack");
  if (name.includes("OCTOPUS")) flags.push("octopus");
  if (name.includes("SWARM")) flags.push("swarm");
  if (name.includes("SPIDER") || name.includes("WEB")) flags.push("spider-web");
  if (name.includes("FALCON") || name.includes("EYE")) flags.push("falcon-eye");

  return flags;
}

function determineClusterId(agent: AgentEntry): string | undefined {
  const name = agent.name.toUpperCase();

  // Map agents to biomimetic clusters
  if (name.includes("WOLF") || name.includes("PACK")) return "WOLF_PACK";
  if (name.includes("OCTOPUS")) return "OCTOPUS";
  if (name.includes("SWARM")) return "SWARM";
  if (name.includes("SPIDER") || name.includes("WEB")) return "SPIDER_WEB";
  if (name.includes("FALCON") || name.includes("EYE")) return "FALCON_EYE";
  if (name.includes("SHIELD") || name.includes("DEFENSE")) return "SHIELD_CORE";
  if (name.includes("API") || name.includes("KEEPER")) {
    if (name.includes("API")) return "API_KEEPER";
    if (name.includes("ENV")) return "ENVKEEPER_CORE";
    if (name.includes("DEPLOY")) return "DEPLOYKEEPER_CORE";
    return "API_KEEPER";
  }
  if (name.includes("DREAM") && name.includes("STATE")) return "DREAM_STATE";
  if (name.includes("STAR") || name.includes("BRIDGE")) return "STAR_BRIDGE";
  if (name.includes("JAGGY") || name.includes("SILENT")) return "JAGGY";
  if (name.includes("WEBHOOK") || name.includes("NERVOUS")) return "WEBHOOK_NERVOUS_SYSTEM";
  if (name.startsWith("AEGIS")) return "AEGIS_FLEET";

  return undefined;
}

function determineKind(agentType: string): "system" | "infra" | "swarm" | "governance" | "economy" | "social" | "game" | "wellness" | "init" | "other" {
  if (agentType === "server") return "infra";
  if (agentType === "client") return "social";
  if (agentType === "package") return "system";
  if (agentType === "foundry") return "system";
  if (agentType === "system") return "system";
  return "other";
}

async function registerAllAgents() {
  console.log("🏛️ Registering All 143 Agents as DreamNet Citizens...\n");

  const agents = (COMPREHENSIVE_AGENT_INVENTORY as any).agents as AgentEntry[];
  const results = {
    registered: 0,
    passportsIssued: 0,
    citizensCreated: 0,
    skipped: 0,
    errors: [] as Array<{ agent: string; error: string }>
  };

  for (const agent of agents) {
    try {
      // Skip stub agents
      if (agent.status === "stub") {
        console.log(`⏭️  Skipping stub agent: ${agent.name}`);
        results.skipped++;
        continue;
      }

      const agentId = cleanAgentId(agent.id);
      const tier = determineTier(agent);
      const flags = determineFlags(agent);
      const clusterId = determineClusterId(agent);
      const kind = determineKind(agent.type);

      // 1. Register agent in Directory
      registerAgent({
        agentId,
        label: agent.name,
        clusterId,
        kind,
        description: agent.description || `Agent from ${agent.file}`
      });
      results.registered++;

      // 2. Issue passport
      const identityId = `agent:${agentId}`;
      const passport = CitizenshipStore.issuePassport(identityId, tier, flags);
      results.passportsIssued++;

      // 3. Register as citizen
      const citizenId = `CIT-${agentId}`;
      registerCitizen({
        citizenId,
        label: `${agent.name} (Agent Citizen)`,
        description: `Agent citizen with passport ${passport.id}, tier ${tier}`
      });
      results.citizensCreated++;

      const clusterInfo = clusterId ? ` [${clusterId}]` : "";
      console.log(`✅ ${agent.name} → Citizen ${citizenId} (Passport: ${passport.id}, Tier: ${tier}${clusterInfo})`);

    } catch (error: any) {
      results.errors.push({
        agent: agent.name,
        error: error.message
      });
      console.error(`❌ Failed to register ${agent.name}: ${error.message}`);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Registered Agents: ${results.registered}`);
  console.log(`   Passports Issued: ${results.passportsIssued}`);
  console.log(`   Citizens Created: ${results.citizensCreated}`);
  console.log(`   Skipped (stub): ${results.skipped}`);
  console.log(`   Errors: ${results.errors.length}`);

  if (results.errors.length > 0) {
    console.log(`\n❌ Errors:`);
    results.errors.forEach(({ agent, error }) => {
      console.log(`   ${agent}: ${error}`);
    });
  }

  // Verify counts
  const { listEntriesByType } = await import("../packages/directory/src/registry");
  const registeredAgents = listEntriesByType("agent");
  const registeredCitizens = listEntriesByType("citizen");
  const passports = CitizenshipStore.listPassports();

  console.log(`\n🔍 Verification:`);
  console.log(`   Directory Agents: ${registeredAgents.length}`);
  console.log(`   Directory Citizens: ${registeredCitizens.length}`);
  console.log(`   Passports: ${passports.length}`);

  return results;
}

// Run
const scriptPath = fileURLToPath(import.meta.url);
const entryPath = process.argv[1] || "";

if (scriptPath === entryPath ||
  scriptPath.replace(/\\/g, '/') === entryPath.replace(/\\/g, '/') ||
  entryPath.endsWith('register-all-agents-as-citizens.ts')) {
  registerAllAgents().catch(console.error);
}

export { registerAllAgents };

