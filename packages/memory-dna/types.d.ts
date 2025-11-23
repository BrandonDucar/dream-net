export type EntityType = "agent" | "squad" | "endpoint" | "spore";
export interface Trait {
    key: string;
    value: number;
    lastUpdated: string;
}
export interface MemoryHistoryEntry {
    timestamp: string;
    summary: string;
    metrics?: Record<string, unknown>;
}
export interface MemoryRecord {
    id: string;
    entityType: EntityType;
    entityId: string;
    traits: Trait[];
    tags: string[];
    history: MemoryHistoryEntry[];
    createdAt: string;
    updatedAt: string;
}
export type ResonanceSeverity = "low" | "medium" | "high";
export interface ResonanceInsight {
    id: string;
    createdAt: string;
    entityType?: EntityType;
    entityIds?: string[];
    pattern: string;
    description: string;
    suggestedActions: string[];
    severity: ResonanceSeverity;
}
