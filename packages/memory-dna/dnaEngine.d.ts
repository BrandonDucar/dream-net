import type { EntityType, MemoryRecord } from "./types";
export interface EventModel {
    id: string;
    timestamp: string;
    sourceType: "agent" | "squad" | "halo" | "api" | "graft" | "spore" | "system";
    sourceId?: string;
    eventType: string;
    severity: "info" | "warning" | "error" | "critical";
    payload?: Record<string, any>;
    handled?: boolean;
}
export interface TaskModel {
    id: string;
    type: string;
    status: "pending" | "running" | "success" | "failed";
    createdAt?: string;
    updatedAt?: string;
    metadata?: Record<string, any>;
    agentIds?: string[];
    endpointId?: string;
    squadId?: string;
}
export declare function updateTraitsFromEvent(event: EventModel): Promise<void>;
export declare function updateTraitsFromTaskResult(task: TaskModel): Promise<void>;
export declare function deriveChildMemory(entityType: EntityType, parentId: string, childId: string): Promise<void>;
export declare function listAllRecords(): Promise<Record<EntityType, MemoryRecord[]>>;
