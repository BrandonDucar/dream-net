/**
 * Conduit Layer
 * Defines per-line behavior for {portId, clusterId, toolId} combos
 * "Supercharges" lines that branch out from ports with power profiles, budgets, and transforms
 */

import type { PortId } from "../../port-governor/src/types";
import type { ClusterId } from "../clusters";
import type { ToolId } from "../../agent-gateway/src/tools";

export interface ConduitIdParts {
  portId: PortId;
  clusterId: ClusterId;
  toolId: ToolId;
}

export type ConduitId = string; // derived from parts

export type ConduitPriorityLane = 0 | 1 | 2 | 3 | 4 | 5;

export interface ConduitBudgets {
  maxCallsPerMinute?: number;
  maxCallsPerHour?: number;
  maxConcurrent?: number;
  maxDailyCostUsd?: number;
  cacheTtlSeconds?: number;
  maxExecutionTimeMs?: number; // Per-conduit timeout
}

export interface ConduitTransforms {
  // optional pre-execution transform hooks (for later)
  normalizePayload?: boolean;
  scrubSecrets?: boolean;
  enrichForAgents?: boolean;
}

export interface ConduitConfig {
  id: ConduitId;
  portId: PortId;
  clusterId: ClusterId;
  toolId: ToolId;
  label: string;
  description?: string;
  priorityLane: ConduitPriorityLane;
  budgets: ConduitBudgets;
  transforms?: ConduitTransforms;
}

export function makeConduitId(parts: ConduitIdParts): ConduitId {
  return `${parts.portId}::${parts.clusterId}::${parts.toolId}`;
}

export const CONDUITS: Record<ConduitId, ConduitConfig> = {};

function addConduit(cfg: Omit<ConduitConfig, "id">) {
  const id = makeConduitId({
    portId: cfg.portId,
    clusterId: cfg.clusterId,
    toolId: cfg.toolId as ToolId,
  });
  CONDUITS[id] = { ...cfg, id };
}

// High-sensitivity lines
addConduit({
  portId: "AGENT_GATEWAY",
  clusterId: "ENVKEEPER_CORE" as ClusterId,
  toolId: "env.set" as ToolId,
  label: "Agent → EnvKeeper → env.set",
  description: "High-risk mutation of env vars via EnvKeeper.",
  priorityLane: 5,
  budgets: {
    maxCallsPerMinute: 10,
    maxCallsPerHour: 100,
    maxConcurrent: 2,
    maxDailyCostUsd: 0,
    cacheTtlSeconds: 0,
    maxExecutionTimeMs: 2000, // 2s timeout
  },
  transforms: {
    normalizePayload: true,
    scrubSecrets: true,
    enrichForAgents: false,
  },
});

addConduit({
  portId: "AGENT_GATEWAY",
  clusterId: "ENVKEEPER_CORE" as ClusterId,
  toolId: "env.delete" as ToolId,
  label: "Agent → EnvKeeper → env.delete",
  priorityLane: 5,
  budgets: {
    maxCallsPerMinute: 5,
    maxCallsPerHour: 50,
    maxConcurrent: 1,
    maxDailyCostUsd: 0,
    maxExecutionTimeMs: 2000, // 2s timeout
  },
  transforms: {
    normalizePayload: true,
    scrubSecrets: true,
  },
});

addConduit({
  portId: "AGENT_GATEWAY",
  clusterId: "API_KEEPER" as ClusterId,
  toolId: "api.rotateKey" as ToolId,
  label: "Agent → APIKeeper → api.rotateKey",
  priorityLane: 5,
  budgets: {
    maxCallsPerMinute: 5,
    maxCallsPerHour: 50,
    maxConcurrent: 1,
    maxDailyCostUsd: 0,
    maxExecutionTimeMs: 2000, // 2s timeout
  },
  transforms: {
    normalizePayload: true,
    scrubSecrets: true,
  },
});

addConduit({
  portId: "AGENT_GATEWAY",
  clusterId: "DEPLOYKEEPER_CORE" as ClusterId,
  toolId: "vercel.deploy" as ToolId,
  label: "Agent → DeployKeeper → vercel.deploy",
  priorityLane: 5,
  budgets: {
    maxCallsPerMinute: 5,
    maxCallsPerHour: 30,
    maxConcurrent: 1,
    maxDailyCostUsd: 0.5,
    maxExecutionTimeMs: 15000, // 15s timeout for API calls
  },
  transforms: {
    normalizePayload: true,
    scrubSecrets: true,
    enrichForAgents: true,
  },
});

// Lower risk example
addConduit({
  portId: "AGENT_GATEWAY",
  clusterId: "DEPLOYKEEPER_CORE" as ClusterId,
  toolId: "vercel.listProjects" as ToolId,
  label: "Agent → DeployKeeper → vercel.listProjects",
  priorityLane: 2,
  budgets: {
    maxCallsPerMinute: 60,
    maxCallsPerHour: 500,
    maxConcurrent: 10,
    cacheTtlSeconds: 60,
  },
  transforms: {
    normalizePayload: true,
    enrichForAgents: true,
  },
});

// Cloud Run conduits - High sensitivity (costs money, affects infrastructure)
addConduit({
  portId: "CLOUD_RUN_PORT",
  clusterId: "CLOUD_RUN_CORE" as ClusterId,
  toolId: "cloudrun.deploy" as ToolId,
  label: "Agent → CloudRun → cloudrun.deploy",
  description: "High-risk deployment to Cloud Run. Costs money and affects production infrastructure.",
  priorityLane: 5,
  budgets: {
    maxCallsPerMinute: 2,
    maxCallsPerHour: 10,
    maxConcurrent: 1,
    maxDailyCostUsd: 5.0, // Limit daily deployment costs
    maxExecutionTimeMs: 300000, // 5 minutes for deployment
  },
  transforms: {
    normalizePayload: true,
    scrubSecrets: true,
    enrichForAgents: true,
  },
});

addConduit({
  portId: "CLOUD_RUN_PORT",
  clusterId: "CLOUD_RUN_CORE" as ClusterId,
  toolId: "cloudrun.scale" as ToolId,
  label: "Agent → CloudRun → cloudrun.scale",
  description: "Scale Cloud Run service (minInstances/maxInstances). Governed by budget.",
  priorityLane: 5,
  budgets: {
    maxCallsPerMinute: 5,
    maxCallsPerHour: 20,
    maxConcurrent: 2,
    maxDailyCostUsd: 2.0, // Limit scaling operations
    maxExecutionTimeMs: 30000, // 30s timeout
  },
  transforms: {
    normalizePayload: true,
    scrubSecrets: true,
  },
});

addConduit({
  portId: "CLOUD_RUN_PORT",
  clusterId: "CLOUD_RUN_CORE" as ClusterId,
  toolId: "cloudrun.setKeepAlive" as ToolId,
  label: "Agent → CloudRun → cloudrun.setKeepAlive",
  description: "Set keep-alive (minInstances) to prevent scale-to-zero. Governed by budget.",
  priorityLane: 5,
  budgets: {
    maxCallsPerMinute: 3,
    maxCallsPerHour: 10,
    maxConcurrent: 1,
    maxDailyCostUsd: 1.0, // Keep-alive costs money (running instances)
    maxExecutionTimeMs: 15000, // 15s timeout
  },
  transforms: {
    normalizePayload: true,
    scrubSecrets: true,
  },
});

addConduit({
  portId: "CLOUD_RUN_PORT",
  clusterId: "CLOUD_RUN_CORE" as ClusterId,
  toolId: "cloudrun.update" as ToolId,
  label: "Agent → CloudRun → cloudrun.update",
  description: "Update Cloud Run service configuration.",
  priorityLane: 4,
  budgets: {
    maxCallsPerMinute: 5,
    maxCallsPerHour: 30,
    maxConcurrent: 2,
    maxDailyCostUsd: 1.0,
    maxExecutionTimeMs: 60000, // 1 minute
  },
  transforms: {
    normalizePayload: true,
    scrubSecrets: true,
  },
});

// Lower risk Cloud Run operations
addConduit({
  portId: "CLOUD_RUN_PORT",
  clusterId: "CLOUD_RUN_CORE" as ClusterId,
  toolId: "cloudrun.list" as ToolId,
  label: "Agent → CloudRun → cloudrun.list",
  priorityLane: 2,
  budgets: {
    maxCallsPerMinute: 30,
    maxCallsPerHour: 200,
    maxConcurrent: 10,
    cacheTtlSeconds: 60, // Cache service list
  },
  transforms: {
    normalizePayload: true,
    enrichForAgents: true,
  },
});

addConduit({
  portId: "CLOUD_RUN_PORT",
  clusterId: "CLOUD_RUN_CORE" as ClusterId,
  toolId: "cloudrun.getStatus" as ToolId,
  label: "Agent → CloudRun → cloudrun.getStatus",
  priorityLane: 2,
  budgets: {
    maxCallsPerMinute: 60,
    maxCallsPerHour: 500,
    maxConcurrent: 20,
    cacheTtlSeconds: 30, // Cache status for 30s
  },
  transforms: {
    normalizePayload: true,
    enrichForAgents: true,
  },
});

export function getConduitConfig(
  portId: PortId,
  clusterId: ClusterId,
  toolId: ToolId
): ConduitConfig | undefined {
  const id = makeConduitId({ portId, clusterId, toolId });
  return CONDUITS[id];
}

