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
export type ConduitId = string;
export type ConduitPriorityLane = 0 | 1 | 2 | 3 | 4 | 5;
export interface ConduitBudgets {
    maxCallsPerMinute?: number;
    maxCallsPerHour?: number;
    maxConcurrent?: number;
    maxDailyCostUsd?: number;
    cacheTtlSeconds?: number;
    maxExecutionTimeMs?: number;
}
export interface ConduitTransforms {
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
export declare function makeConduitId(parts: ConduitIdParts): ConduitId;
export declare const CONDUITS: Record<ConduitId, ConduitConfig>;
export declare function getConduitConfig(portId: PortId, clusterId: ClusterId, toolId: ToolId): ConduitConfig | undefined;
