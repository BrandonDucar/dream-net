"use strict";
/**
 * Conduit Layer
 * Defines per-line behavior for {portId, clusterId, toolId} combos
 * "Supercharges" lines that branch out from ports with power profiles, budgets, and transforms
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONDUITS = void 0;
exports.makeConduitId = makeConduitId;
exports.getConduitConfig = getConduitConfig;
function makeConduitId(parts) {
    return `${parts.portId}::${parts.clusterId}::${parts.toolId}`;
}
exports.CONDUITS = {};
function addConduit(cfg) {
    const id = makeConduitId({
        portId: cfg.portId,
        clusterId: cfg.clusterId,
        toolId: cfg.toolId,
    });
    exports.CONDUITS[id] = { ...cfg, id };
}
// High-sensitivity lines
addConduit({
    portId: "AGENT_GATEWAY",
    clusterId: "ENVKEEPER_CORE",
    toolId: "env.set",
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
    clusterId: "ENVKEEPER_CORE",
    toolId: "env.delete",
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
    clusterId: "API_KEEPER",
    toolId: "api.rotateKey",
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
    clusterId: "DEPLOYKEEPER_CORE",
    toolId: "vercel.deploy",
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
    clusterId: "DEPLOYKEEPER_CORE",
    toolId: "vercel.listProjects",
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
function getConduitConfig(portId, clusterId, toolId) {
    const id = makeConduitId({ portId, clusterId, toolId });
    return exports.CONDUITS[id];
}
