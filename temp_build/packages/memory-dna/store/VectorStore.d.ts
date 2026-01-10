/**
 * 🧬 MEMORY-DNA: VECTOR STORE (LANCEDB)
 *
 * "The Biomechanical Brain"
 * Persistent, queryable memory for Agents.
 */
export declare class VectorMemorySystem {
    private db;
    private table;
    private dbPath;
    constructor();
    init(): Promise<void>;
    addMemory(text: string, metadata: Record<string, any>): Promise<void>;
    query(searchText: string, limit?: number): Promise<any[]>;
}
export declare const vectorStore: VectorMemorySystem;
