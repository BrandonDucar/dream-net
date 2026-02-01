export interface VectorRecord {
    id: string;
    vector: number[];
    text: string;
    metadata: string;
    timestamp: number;
}
export declare class VectorStore {
    private db;
    private table;
    private embeddings;
    private dbPath;
    constructor(basePath?: string);
    init(): Promise<void>;
    addMemory(text: string, metadata: Record<string, any>): Promise<`${string}-${string}-${string}-${string}-${string}`>;
    search(query: string, limit?: number): Promise<Array<{
        text: string;
        score: number;
        metadata: any;
    }>>;
}
export declare const vectorStore: VectorStore;
//# sourceMappingURL=VectorStore.d.ts.map