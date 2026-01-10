import type {
  AgentRegistryContext,
  AgentConfig,
  AgentHealth,
} from '../types.js';
import { AgentStore } from '../store/agentStore.js';

/**
 * Seed known agents (config only).
 * These can mirror your existing subsystems and named agents.
 */
export function ensureDefaultAgentsSeeded() {
  const existing = AgentStore.listConfigs();
  if (existing.length > 0) return;

  const agents: AgentConfig[] = [
    {
      id: "agent:DreamOps",
      name: "DreamOps Orchestrator",
      kind: "infra",
      subsystem: "DreamNet OS",
      tags: ["orchestration", "devops"],
    },
    {
      id: "agent:DeployKeeper",
      name: "DeployKeeper",
      kind: "infra",
      subsystem: "Deployments",
      tags: ["deploy", "health"],
    },
    {
      id: "agent:EnvKeeper",
      name: "EnvKeeper",
      kind: "infra",
      subsystem: "Env Vars",
      tags: ["env", "security"],
    },
    {
      id: "agent:WolfPack",
      name: "Wolf Pack Protocol",
      kind: "swarm",
      subsystem: "WolfPack",
      tags: ["swarm", "risk"],
    },
    {
      id: "agent:SwarmPatrol",
      name: "Swarm Repair Patrol",
      kind: "swarm",
      subsystem: "Halo-Loop",
      tags: ["repair", "infra"],
    },
    {
      id: "agent:FieldLayer",
      name: "Field Layer Engine",
      kind: "economy",
      subsystem: "FieldLayer",
      tags: ["risk", "trust", "fields"],
    },
    {
      id: "agent:EconomicEngine",
      name: "Economic Engine Core",
      kind: "economy",
      subsystem: "EconomicEngineCore",
      tags: ["rewards", "simulation"],
    },
    {
      id: "agent:ZenGarden",
      name: "Zen Garden Core",
      kind: "wellness",
      subsystem: "ZenGardenCore",
      tags: ["zen", "wellness"],
    },
    {
      id: "agent:DreamTank",
      name: "Dream Tank Incubator",
      kind: "governance",
      subsystem: "DreamTankCore",
      tags: ["incubator", "dreams"],
    },
    {
      id: "agent:SocialHub",
      name: "Social Hub Core",
      kind: "social",
      subsystem: "SocialHubCore",
      tags: ["social", "feed"],
    },
    {
      id: "agent:WolfPackFunding",
      name: "Wolf Pack Funding Core",
      kind: "economy",
      subsystem: "WolfPackFundingCore",
      tags: ["funding", "outreach", "email"],
    },
  ];

  agents.forEach((a) => AgentStore.upsertConfig(a));
}

/**
 * Simple heuristic: adjust trust/risk from FieldLayer + ReputationLattice if available.
 */
export function refreshAgentScores(ctx: AgentRegistryContext) {
  const healthList = AgentStore.listHealth();

  healthList.forEach((h) => {
    const now = Date.now();
    let trust = h.trustScore ?? 0.5;
    let risk = h.riskScore ?? 0.5;

    // Optionally sample FieldLayer
    if (ctx.fieldLayer?.sample) {
      const riskSample = ctx.fieldLayer.sample("risk", {
        kind: "service",
        id: `service:${h.agentId}`,
      });
      if (riskSample?.value != null) {
        risk = riskSample.value;
      }

      const trustSample = ctx.fieldLayer.sample("trust", {
        kind: "service",
        id: `service:${h.agentId}`,
      });
      if (trustSample?.value != null) {
        trust = trustSample.value;
      }
    }

    const updated: AgentHealth = {
      ...h,
      trustScore: trust,
      riskScore: risk,
      updatedAt: now,
    };

    AgentStore.upsertHealth(updated);
  });
}

/**
 * Optionally, callers (or other subsystems) can record agent activity via these helpers.
 * These do not run agents, they just record that something happened.
 */
export function recordAgentSuccess(agentId: string, latencyMs?: number) {
  const existing = AgentStore.getHealth(agentId);
  const now = Date.now();
  if (!existing) return;

  let avgLatency = existing.avgLatencyMs;
  if (latencyMs != null) {
    if (avgLatency == null) avgLatency = latencyMs;
    else avgLatency = (avgLatency * existing.successCount + latencyMs) / (existing.successCount + 1);
  }

  const updated: AgentHealth = {
    ...existing,
    state: "active",
    lastRunAt: now,
    lastSuccessAt: now,
    successCount: (existing.successCount ?? 0) + 1,
    avgLatencyMs: avgLatency,
    updatedAt: now,
  };

  AgentStore.upsertHealth(updated);
}

export function recordAgentError(agentId: string, errorMessage: string) {
  const existing = AgentStore.getHealth(agentId);
  const now = Date.now();
  if (!existing) return;

  const updated: AgentHealth = {
    ...existing,
    state: "error",
    lastRunAt: now,
    lastErrorAt: now,
    lastErrorMessage: errorMessage,
    errorCount: (existing.errorCount ?? 0) + 1,
    updatedAt: now,
  };

  AgentStore.upsertHealth(updated);
}

