/**
 * Agent Gateway Tool Registry
 * Defines available tools and their access requirements
 */

import type { ClusterId } from "@dreamnet/dreamnet-control-core/clusters";
import type { PortId } from "@dreamnet/port-governor/types";

export type ToolId =
  | "env.get"
  | "env.set"
  | "env.delete"
  | "api.listKeys"
  | "api.rotateKey"
  | "vercel.deploy"
  | "vercel.listProjects"
  | "cloudrun.deploy"
  | "cloudrun.scale"
  | "cloudrun.update"
  | "cloudrun.list"
  | "cloudrun.getStatus"
  | "cloudrun.setKeepAlive"
  | "diagnostics.ping"
  | string;

export interface ToolCostProfile {
  // Rough estimate per call
  estimatedTokenCost?: number;
  estimatedDollarCost?: number;
}

export type ToolRiskLevel = "low" | "medium" | "high" | "critical";

export interface ToolConfig {
  id: ToolId;
  label: string;
  description?: string;
  clusterId: ClusterId;
  portId: PortId;
  // Minimum tier/role to use this tool
  minTier: "SEED" | "BUILDER" | "OPERATOR" | "GOD_MODE";
  requiredOfficeIds?: string[];
  requiredCabinetIds?: string[];
  cost?: ToolCostProfile;
  riskLevel?: ToolRiskLevel;
}

export const TOOL_REGISTRY: Record<ToolId, ToolConfig> = {
  "env.get": {
    id: "env.get",
    label: "Get environment variable",
    description: "Read an environment variable (redacted where needed).",
    clusterId: "ENVKEEPER_CORE" as ClusterId,
    portId: "ENVKEEPER_PORT" as PortId,
    minTier: "OPERATOR",
    requiredCabinetIds: ["DATA_PRIVACY_CABINET"],
    cost: { estimatedTokenCost: 0, estimatedDollarCost: 0 },
    riskLevel: "medium",
  },
  "env.set": {
    id: "env.set",
    label: "Set environment variable",
    description: "Create or update an env var via Env Keeper.",
    clusterId: "ENVKEEPER_CORE" as ClusterId,
    portId: "ENVKEEPER_PORT" as PortId,
    minTier: "OPERATOR",
    requiredCabinetIds: ["DATA_PRIVACY_CABINET"],
    cost: { estimatedTokenCost: 0, estimatedDollarCost: 0 },
    riskLevel: "high",
  },
  "env.delete": {
    id: "env.delete",
    label: "Delete environment variable",
    description: "Delete an environment variable via Env Keeper.",
    clusterId: "ENVKEEPER_CORE" as ClusterId,
    portId: "ENVKEEPER_PORT" as PortId,
    minTier: "OPERATOR",
    requiredCabinetIds: ["DATA_PRIVACY_CABINET"],
    cost: { estimatedTokenCost: 0, estimatedDollarCost: 0 },
    riskLevel: "high",
  },
  "api.listKeys": {
    id: "api.listKeys",
    label: "List API keys",
    description: "List all API keys managed by API Keeper.",
    clusterId: "API_KEEPER" as ClusterId,
    portId: "APIKEEPER_PORT" as PortId,
    minTier: "OPERATOR",
    requiredCabinetIds: ["TREASURY_CABINET"],
    cost: { estimatedTokenCost: 0, estimatedDollarCost: 0 },
    riskLevel: "high",
  },
  "api.rotateKey": {
    id: "api.rotateKey",
    label: "Rotate API key",
    description: "Rotate an API key (generate new, deprecate old).",
    clusterId: "API_KEEPER" as ClusterId,
    portId: "APIKEEPER_PORT" as PortId,
    minTier: "OPERATOR",
    requiredCabinetIds: ["TREASURY_CABINET"],
    cost: { estimatedTokenCost: 0, estimatedDollarCost: 0 },
    riskLevel: "critical",
  },
  "vercel.deploy": {
    id: "vercel.deploy",
    label: "Trigger Vercel deployment",
    description: "Trigger a Vercel deployment for a project.",
    clusterId: "DEPLOYKEEPER_CORE" as ClusterId,
    portId: "VERCEL_PORT" as PortId,
    minTier: "OPERATOR",
    requiredOfficeIds: ["FOUNDER", "MINISTER_OF_WOLF_OPERATIONS"],
    cost: { estimatedTokenCost: 0, estimatedDollarCost: 0.02 },
    riskLevel: "high",
  },
  "vercel.listProjects": {
    id: "vercel.listProjects",
    label: "List Vercel projects",
    description: "List all Vercel projects tracked by Vercel Agent.",
    clusterId: "DEPLOYKEEPER_CORE" as ClusterId,
    portId: "VERCEL_PORT" as PortId,
    minTier: "BUILDER",
    requiredOfficeIds: ["FOUNDER", "MINISTER_OF_WOLF_OPERATIONS"],
    cost: { estimatedTokenCost: 0, estimatedDollarCost: 0 },
    riskLevel: "medium",
  },
  "cloudrun.deploy": {
    id: "cloudrun.deploy",
    label: "Deploy to Cloud Run",
    description: "Deploy a service to Google Cloud Run with specified configuration.",
    clusterId: "CLOUD_RUN_CORE" as ClusterId,
    portId: "CLOUD_RUN_PORT" as PortId,
    minTier: "OPERATOR",
    requiredOfficeIds: ["FOUNDER", "MINISTER_OF_WOLF_OPERATIONS"],
    cost: { estimatedTokenCost: 0, estimatedDollarCost: 0.05 },
    riskLevel: "critical",
  },
  "cloudrun.scale": {
    id: "cloudrun.scale",
    label: "Scale Cloud Run service",
    description: "Update min/max instances for a Cloud Run service (governed by budget).",
    clusterId: "CLOUD_RUN_CORE" as ClusterId,
    portId: "CLOUD_RUN_PORT" as PortId,
    minTier: "OPERATOR",
    requiredOfficeIds: ["FOUNDER", "MINISTER_OF_WOLF_OPERATIONS"],
    cost: { estimatedTokenCost: 0, estimatedDollarCost: 0.01 },
    riskLevel: "high",
  },
  "cloudrun.update": {
    id: "cloudrun.update",
    label: "Update Cloud Run service",
    description: "Update environment variables, resources, or other Cloud Run service settings.",
    clusterId: "CLOUD_RUN_CORE" as ClusterId,
    portId: "CLOUD_RUN_PORT" as PortId,
    minTier: "OPERATOR",
    requiredOfficeIds: ["FOUNDER", "MINISTER_OF_WOLF_OPERATIONS"],
    cost: { estimatedTokenCost: 0, estimatedDollarCost: 0.02 },
    riskLevel: "high",
  },
  "cloudrun.list": {
    id: "cloudrun.list",
    label: "List Cloud Run services",
    description: "List all Cloud Run services in the project.",
    clusterId: "CLOUD_RUN_CORE" as ClusterId,
    portId: "CLOUD_RUN_PORT" as PortId,
    minTier: "OPERATOR",
    cost: { estimatedTokenCost: 0, estimatedDollarCost: 0 },
    riskLevel: "medium",
  },
  "cloudrun.getStatus": {
    id: "cloudrun.getStatus",
    label: "Get Cloud Run service status",
    description: "Get current status, health, and configuration of a Cloud Run service.",
    clusterId: "CLOUD_RUN_CORE" as ClusterId,
    portId: "CLOUD_RUN_PORT" as PortId,
    minTier: "OPERATOR",
    cost: { estimatedTokenCost: 0, estimatedDollarCost: 0 },
    riskLevel: "low",
  },
  "cloudrun.setKeepAlive": {
    id: "cloudrun.setKeepAlive",
    label: "Set Cloud Run keep-alive",
    description: "Configure minInstances to prevent scale-to-zero (governed by budget).",
    clusterId: "CLOUD_RUN_CORE" as ClusterId,
    portId: "CLOUD_RUN_PORT" as PortId,
    minTier: "OPERATOR",
    requiredOfficeIds: ["FOUNDER", "MINISTER_OF_WOLF_OPERATIONS"],
    cost: { estimatedTokenCost: 0, estimatedDollarCost: 0.01 },
    riskLevel: "high",
  },
  "diagnostics.ping": {
    id: "diagnostics.ping",
    label: "Ping DreamNet core",
    description: "Basic connectivity check to DreamNet core systems.",
    clusterId: "DREAM_STATE" as ClusterId, // Using DREAM_STATE as placeholder for core diagnostics
    portId: "AGENT_GATEWAY" as PortId,
    minTier: "SEED",
    cost: { estimatedTokenCost: 0, estimatedDollarCost: 0 },
    riskLevel: "low",
  },
};

export function getToolConfig(id: ToolId): ToolConfig | undefined {
  return TOOL_REGISTRY[id];
}

export function listTools(): ToolConfig[] {
  return Object.values(TOOL_REGISTRY);
}

