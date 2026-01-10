/**
 * Dead-Letter Buffer
 * Quarantine for high-risk conduit failures and timeouts
 */
import type { ConduitId } from "./conduits";
import type { PortId } from "../../port-governor/src/types";
import type { ClusterId } from "../clusters";
import type { ToolId } from "../../agent-gateway/src/tools";
export interface DeadLetterRecord {
    id: string;
    conduitId: ConduitId;
    traceId: string;
    toolId: ToolId;
    portId: PortId;
    clusterId: ClusterId;
    error: string;
    errorType: "TIMEOUT" | "FAILURE" | "ERROR";
    timestamp: string;
    citizenId?: string;
    tierId?: string;
}
/**
 * Add a record to the dead-letter buffer
 */
export declare function addDeadLetterRecord(params: {
    conduitId: ConduitId;
    traceId: string;
    toolId: ToolId;
    portId: PortId;
    clusterId: ClusterId;
    error: string;
    errorType: "TIMEOUT" | "FAILURE" | "ERROR";
    citizenId?: string;
    tierId?: string;
}): DeadLetterRecord;
/**
 * Get all dead-letter records
 */
export declare function getDeadLetterRecords(limit?: number): DeadLetterRecord[];
/**
 * Get dead-letter records by conduit
 */
export declare function getDeadLetterRecordsByConduit(conduitId: ConduitId): DeadLetterRecord[];
/**
 * Get dead-letter stats
 */
export declare function getDeadLetterStats(): {
    total: number;
    byConduit: Record<string, number>;
    byErrorType: Record<string, number>;
    recentFailures: DeadLetterRecord[];
};
