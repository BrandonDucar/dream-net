import type { EntityType, MemoryHistoryEntry, MemoryRecord } from "./types";
export declare function getMemoryRecord(entityType: EntityType, entityId: string): Promise<MemoryRecord | null>;
export declare function upsertMemoryRecord(record: MemoryRecord): Promise<MemoryRecord>;
export declare function listMemoryRecords(entityType: EntityType): Promise<MemoryRecord[]>;
export declare function appendHistory(entityType: EntityType, entityId: string, historyEntry: MemoryHistoryEntry): Promise<void>;
