import type { SporeModel, SporeDistribution } from './types.js';
import { getSporeById, incrementUsage } from './registry.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DISTRIBUTION_LOG_PATH = join(__dirname, "../store/distributionLog.json");

function loadDistributions(): SporeDistribution[] {
  if (!existsSync(DISTRIBUTION_LOG_PATH)) {
    return [];
  }
  try {
    const content = readFileSync(DISTRIBUTION_LOG_PATH, "utf-8");
    return JSON.parse(content).map((d: any) => ({
      ...d,
      deployedAt: new Date(d.deployedAt),
    }));
  } catch {
    return [];
  }
}



function saveDistributions(distributions: SporeDistribution[]): void {
  const dir = join(DISTRIBUTION_LOG_PATH, "..");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(DISTRIBUTION_LOG_PATH, JSON.stringify(distributions, null, 2), "utf-8");
}

export async function deploySpore(
  sporeId: string,
  target: {
    agentId?: string;
    squadId?: string;
    role?: string;
  },
  deployedBy?: string,
): Promise<SporeDistribution | null> {
  const spore = getSporeById(sporeId);
  if (!spore || spore.status !== "published") {
    return null;
  }

  const distributions = loadDistributions();
  const distribution: SporeDistribution = {
    sporeId,
    targetAgentId: target.agentId,
    targetSquadId: target.squadId,
    targetRole: target.role,
    deployedAt: new Date(),
    deployedBy,
    status: "deployed",
  };

  distributions.push(distribution);
  saveDistributions(distributions);

  // Increment usage stats
  incrementUsage(sporeId, true);

  // Create a graft for the spore if it's a config/template type
  if (spore.type === "config" || spore.type === "template") {
    try {
      const { submitGraft } = await import("@dreamnet/graft-engine");
      await submitGraft({
        type: spore.type === "config" ? "module" : "endpoint",
        name: `spore-${spore.name}`,
        path: `spores/${spore.id}`,
        metadata: {
          sporeId: spore.id,
          sporeType: spore.type,
          distributedTo: target,
        },
        status: "pending",
        logs: [`Deployed from spore: ${spore.name}`],
      });

      // Emit Event Wormhole event for spore deployment
      try {
        const { emitEvent } = await import("@dreamnet/event-wormholes");
        await emitEvent({
          sourceType: "spore",
          eventType: "spore.deployed",
          severity: "info",
          payload: {
            sporeId: spore.id,
            sporeName: spore.name,
            target,
          },
        });
      } catch {
        // Event Wormholes not available, continue
      }
    } catch {
      // Graft Engine not available, continue
    }
  }

  // TODO: Actually deploy to agent/squad (Phase 2)
  // For now, create a graft and log the distribution

  return distribution;
}

export function revokeSpore(sporeId: string, target: { agentId?: string; squadId?: string; role?: string }): boolean {
  const distributions = loadDistributions();
  const index = distributions.findIndex(
    (d) =>
      d.sporeId === sporeId &&
      d.status === "deployed" &&
      (target.agentId ? d.targetAgentId === target.agentId : true) &&
      (target.squadId ? d.targetSquadId === target.squadId : true) &&
      (target.role ? d.targetRole === target.role : true),
  );

  if (index < 0) return false;

  distributions[index].status = "revoked";
  saveDistributions(distributions);

  // TODO: Actually revoke from agent/squad (Phase 2)

  return true;
}

export function getSporeDistributions(sporeId: string): SporeDistribution[] {
  return loadDistributions().filter((d) => d.sporeId === sporeId);
}

export function getAgentSpores(agentId: string): SporeDistribution[] {
  return loadDistributions().filter((d) => d.targetAgentId === agentId && d.status === "deployed");
}

export function getSquadSpores(squadId: string): SporeDistribution[] {
  return loadDistributions().filter((d) => d.targetSquadId === squadId && d.status === "deployed");
}

