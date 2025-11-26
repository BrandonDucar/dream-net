/**
 * DreamMemory - Memory Star
 *
 * Long-term memory, embeddings, versioned context, audit trails
 * Namespaces: code://, ops://, social://, brand://
 */
export interface MemoryEntry {
    id: string;
    namespace: "code" | "ops" | "social" | "brand";
    key: string;
    content: any;
    embedding?: number[];
    metadata?: Record<string, any>;
    version: number;
    createdAt: string;
    updatedAt: string;
}
export interface ContextPack {
    id: string;
    label: string;
    entries: string[];
    description?: string;
    createdAt: string;
}
export declare class DreamMemory {
    private memories;
    private contextPacks;
    /**
     * Store a memory entry
     */
    store(namespace: "code" | "ops" | "social" | "brand", key: string, content: any, metadata?: Record<string, any>): Promise<MemoryEntry>;
    /**
     * Recall a memory entry
     */
    recall(namespace: "code" | "ops" | "social" | "brand", key: string): Promise<MemoryEntry | undefined>;
    /**
     * Search memories by namespace and query
     */
    search(namespace: "code" | "ops" | "social" | "brand", query: string, limit?: number): Promise<MemoryEntry[]>;
    /**
     * Create a context pack for agents
     */
    createContextPack(label: string, entryIds: string[], description?: string): Promise<ContextPack>;
    /**
     * Get a context pack
     */
    getContextPack(packId: string): Promise<ContextPack | undefined>;
    /**
     * Get all memories in a context pack
     */
    getContextPackMemories(packId: string): Promise<MemoryEntry[]>;
    /**
     * Generate embeddings for a memory entry (placeholder)
     */
    generateEmbedding(content: any): Promise<number[]>;
    /**
     * Get audit trail for a memory entry
     */
    getAuditTrail(entryId: string): MemoryEntry[];
    /**
     * Get all memories in a namespace
     */
    getMemoriesByNamespace(namespace: "code" | "ops" | "social" | "brand"): MemoryEntry[];
}
export default DreamMemory;
