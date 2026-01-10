/**
 * Conduit Metrics
 * Tracks dynamic metrics for conduit "heat" visualization
 */
import { type ConduitId } from "./conduits";
export type ConduitStatus = "ok" | "hot" | "throttled" | "blocked";
export interface ConduitMetric {
    conduitId: ConduitId;
    portId: string;
    clusterId: string;
    toolId: string;
    label: string;
    priorityLane: number;
    callsLastWindow: number;
    totalCount: number;
    failureCount: number;
    timeoutCount: number;
    lastErrorReason?: string;
    heat: number;
    status: ConduitStatus;
}
/**
 * Compute metrics for all conduits
 */
export declare function computeConduitMetrics(): ConduitMetric[];
