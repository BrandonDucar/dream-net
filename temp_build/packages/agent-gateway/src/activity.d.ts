/**
 * Agent Activity Buffer
 * Tracks recent tool executions for DreamScope/Civic Panel
 */
import type { ToolId } from "./tools";
export interface AgentActivityRecord {
    id: string;
    timestamp: string;
    toolId: ToolId;
    intent: string;
    citizenId?: string;
    tierId?: string;
    ok: boolean;
    latencyMs?: number;
    riskLevel?: string;
    error?: string;
    portId?: string;
    conduitId?: string;
}
export declare function recordAgentActivity(record: Omit<AgentActivityRecord, "id" | "timestamp">): void;
export declare function getRecentAgentActivity(limit?: number): AgentActivityRecord[];
export declare function getActivityStats(): {
    total: number;
    byTool: Record<string, number>;
    byStatus: {
        ok: number;
        failed: number;
    };
    byRiskLevel: Record<string, number>;
};
