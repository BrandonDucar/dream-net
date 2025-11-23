/**
 * Conduit Governor
 * Enforces per-line budgets and limits for {portId, clusterId, toolId} combos
 */
import { getConduitConfig } from "./conduits";
import type { PortId } from "../../port-governor/src/types";
import type { ClusterId } from "../clusters";
import type { ToolId } from "../../agent-gateway/src/tools";
export { getConduitConfig };
import type { ConduitId } from "./conduits";
export interface ConduitUsage {
    windowStart: number;
    count: number;
    totalCount: number;
    failureCount: number;
    timeoutCount: number;
    lastErrorReason?: string;
}
export interface ConduitDecision {
    allowed: boolean;
    reason?: string;
    conduitId?: string;
}
export declare function evaluateConduit(portId: PortId, clusterId: ClusterId, toolId: ToolId): ConduitDecision;
/**
 * Get current usage stats for a conduit
 */
export declare function getConduitUsage(conduitId: ConduitId): ConduitUsage | undefined;
/**
 * Record a failure for a conduit
 */
export declare function recordConduitFailure(conduitId: ConduitId, errorReason: string, isTimeout?: boolean): void;
/**
 * Get all conduit usage stats
 */
export declare function getAllConduitUsage(): Array<{
    conduitId: ConduitId;
    usage: ConduitUsage;
}>;
