import type { Squad } from '../types.js';
import { SquadRegistry } from '../registry/squadRegistry.js';
import { getSquads } from "@dreamnet/squad-builder";

/**
 * Bridge between Squad-Builder and Squad Alchemy
 * Syncs Squad-Builder squads into Squad Alchemy registry
 */
export function syncSquadBuilderSquads(): number {
  try {
    const builderSquads = getSquads();
    let synced = 0;

    for (const builderSquad of builderSquads) {
      // Convert Squad-Builder squad to Squad Alchemy format
      const alchemySquad: Squad = {
        id: builderSquad.id,
        role: mapSquadRole(builderSquad.role || "generic"),
        members: (builderSquad.agents || []).map((agent: any) => ({
          id: agent.id || agent.name || `agent-${Date.now()}`,
          capabilities: agent.capabilities || [],
          loadFactor: agent.loadFactor,
        })),
        tags: (builderSquad as any).tags || [],
        createdAt: builderSquad.createdAt?.getTime() || Date.now(),
        updatedAt: builderSquad.updatedAt?.getTime() || Date.now(),
        lineage: {
          generation: 1,
        },
      };

      SquadRegistry.upsert(alchemySquad);
      synced++;
    }

    return synced;
  } catch (error) {
    console.warn("[SquadAlchemy] Failed to sync Squad-Builder squads:", error);
    return 0;
  }
}

/**
 * Map Squad-Builder role to Squad Alchemy role
 */
function mapSquadRole(role: string): Squad["role"] {
  const roleMap: Record<string, Squad["role"]> = {
    repair: "repair",
    deploy: "deploy",
    monitor: "monitor",
    routing: "routing",
    governance: "governance",
    experimental: "experimental",
    generic: "generic",
  };

  return roleMap[role.toLowerCase()] || "generic";
}

