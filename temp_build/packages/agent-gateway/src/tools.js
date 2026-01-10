"use strict";
/**
 * Agent Gateway Tool Registry
 * Defines available tools and their access requirements
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOOL_REGISTRY = void 0;
exports.getToolConfig = getToolConfig;
exports.listTools = listTools;
exports.TOOL_REGISTRY = {
    "env.get": {
        id: "env.get",
        label: "Get environment variable",
        description: "Read an environment variable (redacted where needed).",
        clusterId: "ENVKEEPER_CORE",
        portId: "ENVKEEPER_PORT",
        minTier: "OPERATOR",
        requiredCabinetIds: ["DATA_PRIVACY_CABINET"],
        cost: { estimatedTokenCost: 0, estimatedDollarCost: 0 },
        riskLevel: "medium",
    },
    "env.set": {
        id: "env.set",
        label: "Set environment variable",
        description: "Create or update an env var via Env Keeper.",
        clusterId: "ENVKEEPER_CORE",
        portId: "ENVKEEPER_PORT",
        minTier: "OPERATOR",
        requiredCabinetIds: ["DATA_PRIVACY_CABINET"],
        cost: { estimatedTokenCost: 0, estimatedDollarCost: 0 },
        riskLevel: "high",
    },
    "env.delete": {
        id: "env.delete",
        label: "Delete environment variable",
        description: "Delete an environment variable via Env Keeper.",
        clusterId: "ENVKEEPER_CORE",
        portId: "ENVKEEPER_PORT",
        minTier: "OPERATOR",
        requiredCabinetIds: ["DATA_PRIVACY_CABINET"],
        cost: { estimatedTokenCost: 0, estimatedDollarCost: 0 },
        riskLevel: "high",
    },
    "api.listKeys": {
        id: "api.listKeys",
        label: "List API keys",
        description: "List all API keys managed by API Keeper.",
        clusterId: "API_KEEPER",
        portId: "APIKEEPER_PORT",
        minTier: "OPERATOR",
        requiredCabinetIds: ["TREASURY_CABINET"],
        cost: { estimatedTokenCost: 0, estimatedDollarCost: 0 },
        riskLevel: "high",
    },
    "api.rotateKey": {
        id: "api.rotateKey",
        label: "Rotate API key",
        description: "Rotate an API key (generate new, deprecate old).",
        clusterId: "API_KEEPER",
        portId: "APIKEEPER_PORT",
        minTier: "OPERATOR",
        requiredCabinetIds: ["TREASURY_CABINET"],
        cost: { estimatedTokenCost: 0, estimatedDollarCost: 0 },
        riskLevel: "critical",
    },
    "vercel.deploy": {
        id: "vercel.deploy",
        label: "Trigger Vercel deployment",
        description: "Trigger a Vercel deployment for a project.",
        clusterId: "DEPLOYKEEPER_CORE",
        portId: "VERCEL_PORT",
        minTier: "OPERATOR",
        requiredOfficeIds: ["FOUNDER", "MINISTER_OF_WOLF_OPERATIONS"],
        cost: { estimatedTokenCost: 0, estimatedDollarCost: 0.02 },
        riskLevel: "high",
    },
    "vercel.listProjects": {
        id: "vercel.listProjects",
        label: "List Vercel projects",
        description: "List all Vercel projects tracked by Vercel Agent.",
        clusterId: "DEPLOYKEEPER_CORE",
        portId: "VERCEL_PORT",
        minTier: "BUILDER",
        requiredOfficeIds: ["FOUNDER", "MINISTER_OF_WOLF_OPERATIONS"],
        cost: { estimatedTokenCost: 0, estimatedDollarCost: 0 },
        riskLevel: "medium",
    },
    "diagnostics.ping": {
        id: "diagnostics.ping",
        label: "Ping DreamNet core",
        description: "Basic connectivity check to DreamNet core systems.",
        clusterId: "DREAM_STATE", // Using DREAM_STATE as placeholder for core diagnostics
        portId: "AGENT_GATEWAY",
        minTier: "SEED",
        cost: { estimatedTokenCost: 0, estimatedDollarCost: 0 },
        riskLevel: "low",
    },
};
function getToolConfig(id) {
    return exports.TOOL_REGISTRY[id];
}
function listTools() {
    return Object.values(exports.TOOL_REGISTRY);
}
