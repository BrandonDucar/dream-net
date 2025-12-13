/**
 * Agent 1: VERTEX CORE // Snapshot Engine
 * 
 * Generates vertex_fusion_snapshot using dreamnet.config.ts as primary source of truth
 */

import { dreamnetConfig } from "../dreamnet.config.js";
import { storeOutput } from "../../services/AgentOutputStore.js";

export interface Agent1Context {
  now: () => Date;
}

export interface Agent1Result {
  agentId: "vertex_core_1";
  createdAt: string;
  payload: {
    vertex_fusion_snapshot: VertexFusionSnapshot;
  };
}

export interface VertexFusionSnapshot {
  meta: {
    name: string;
    owner: string;
    version: string;
    environment: string;
    notes: string[];
    snapshot_version: string;
    created_at: string;
    source: "CITADEL_AGENT_1";
  };
  domains: {
    codebases: Record<string, any>;
    services: Record<string, any>;
    ai_agents: any[];
    supporting_agents: any[];
    platforms: Record<string, any>;
    social: Record<string, any>;
    tokens: Record<string, any>;
    surfaces: Record<string, any>;
    world?: any; // Optional world/lore domain
  };
  focus: Record<string, boolean>;
  todo: {
    open_questions: string[];
    missing_details: string[];
    proposed_next_steps: string[];
  };
}

/**
 * Load world/lore data from dreamnet-world package (optional)
 */
async function loadWorldData(): Promise<any | null> {
  try {
    const worldModule = await import("../../../packages/dreamnet-world/src/index.js");
    
    const worldData: any = {
      regions: [],
      factions: [],
      creatures: [],
      characters: [],
      notes: "DreamNet World/Lore data loaded from dreamnet-world package",
    };

    // Get world map data
    if (worldModule.worldMap && typeof worldModule.worldMap.getAll === "function") {
      try {
        const regions = worldModule.worldMap.getAll();
        worldData.regions = regions.map((r: any) => ({
          id: r.id,
          name: r.name,
          layer: r.layer,
          description: r.description,
          tags: r.tags || [],
          connections: r.connections || [],
        }));
      } catch (e) {
        console.warn("[Agent 1] Failed to get regions:", e);
      }
    }

    // Get faction data
    if (worldModule.factionRegistry && typeof worldModule.factionRegistry.getAll === "function") {
      try {
        const factions = worldModule.factionRegistry.getAll();
        worldData.factions = factions.map((f: any) => ({
          id: f.id,
          name: f.name,
          role: f.role,
          alignment: f.alignment,
          abilities: f.abilities || [],
          weaknesses: f.weaknesses || [],
        }));
      } catch (e) {
        console.warn("[Agent 1] Failed to get factions:", e);
      }
    }

    // Get creature data
    if (worldModule.creatureRegistry && typeof worldModule.creatureRegistry.getAll === "function") {
      try {
        const creatures = worldModule.creatureRegistry.getAll();
        worldData.creatures = creatures.map((c: any) => ({
          id: c.id,
          name: c.name,
          category: c.category,
          nativeRegions: c.nativeRegions || [],
          affinity: c.affinity || [],
        }));
      } catch (e) {
        console.warn("[Agent 1] Failed to get creatures:", e);
      }
    }

    // Get character data
    if (worldModule.characterRegistry && typeof worldModule.characterRegistry.getAll === "function") {
      try {
        const characters = worldModule.characterRegistry.getAll();
        worldData.characters = characters.map((c: any) => ({
          id: c.id,
          name: c.name,
          factionId: c.factionId,
          role: c.role,
          abilities: c.abilities || [],
        }));
      } catch (e) {
        console.warn("[Agent 1] Failed to get characters:", e);
      }
    }

    // Only return if we got at least some data
    if (worldData.regions.length > 0 || worldData.factions.length > 0 || 
        worldData.creatures.length > 0 || worldData.characters.length > 0) {
      return worldData;
    }
  } catch (error) {
    // World data is optional, so we silently fail
    console.warn("[Agent 1] World data not available:", error instanceof Error ? error.message : String(error));
  }
  
  return null;
}

/**
 * Agent 1's run method
 * Generates vertex_fusion_snapshot from dreamnet.config.ts
 */
export async function run(ctx: Agent1Context): Promise<Agent1Result> {
  console.log("[Agent 1] Generating vertex_fusion_snapshot...");
  console.log(`[Agent 1] Using config: ${dreamnetConfig.meta.name} v${dreamnetConfig.meta.version}`);

  const now = ctx.now();
  const worldData = await loadWorldData();

  // Build snapshot directly from config
  const snapshot: VertexFusionSnapshot = {
    meta: {
      ...dreamnetConfig.meta,
      snapshot_version: "v" + Date.now(),
      created_at: now.toISOString(),
      source: "CITADEL_AGENT_1",
    },
    domains: {
      codebases: dreamnetConfig.codebases,
      services: dreamnetConfig.services,
      ai_agents: dreamnetConfig.agents.citadelChain.agents,
      supporting_agents: dreamnetConfig.agents.supporting,
      platforms: dreamnetConfig.platforms,
      social: dreamnetConfig.social,
      tokens: dreamnetConfig.tokens,
      surfaces: dreamnetConfig.surfaces,
    },
    focus: dreamnetConfig.focus,
    todo: {
      open_questions: [],
      missing_details: [],
      proposed_next_steps: [],
    },
  };

  // Add world data if available
  if (worldData) {
    snapshot.domains.world = worldData;
  }

  // Store the snapshot
  await storeOutput(1, "vertex_fusion_snapshot", snapshot, {
    notes: `Snapshot generated from dreamnet.config.ts v${dreamnetConfig.meta.version}${worldData ? " with world/lore data" : ""}`,
    dependencies: ["dreamnet.config.ts"],
  });

  console.log(`[Agent 1] Generated snapshot with ${snapshot.domains.ai_agents.length} Citadel agents, ${snapshot.domains.supporting_agents.length} supporting agents${worldData ? ", world/lore data included" : ""}`);

  // Return in the expected format
  return {
    agentId: "vertex_core_1",
    createdAt: now.toISOString(),
    payload: {
      vertex_fusion_snapshot: snapshot,
    },
  };
}

