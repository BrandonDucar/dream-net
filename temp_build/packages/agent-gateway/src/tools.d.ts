/**
 * Agent Gateway Tool Registry
 * Defines available tools and their access requirements
 */
import type { ClusterId } from "@dreamnet/dreamnet-control-core/clusters";
import type { PortId } from "@dreamnet/port-governor/types";
export type ToolId = "env.get" | "env.set" | "env.delete" | "api.listKeys" | "api.rotateKey" | "vercel.deploy" | "vercel.listProjects" | "diagnostics.ping" | string;
export interface ToolCostProfile {
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
    minTier: "SEED" | "BUILDER" | "OPERATOR" | "GOD_MODE";
    requiredOfficeIds?: string[];
    requiredCabinetIds?: string[];
    cost?: ToolCostProfile;
    riskLevel?: ToolRiskLevel;
}
export declare const TOOL_REGISTRY: Record<ToolId, ToolConfig>;
export declare function getToolConfig(id: ToolId): ToolConfig | undefined;
export declare function listTools(): ToolConfig[];
