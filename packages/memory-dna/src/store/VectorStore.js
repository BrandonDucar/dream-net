// @ts-ignore
import { connect } from "@lancedb/lancedb";
// @ts-ignore
import { OpenAIEmbeddings } from "@langchain/openai";
import fs from "fs";
export class VectorStore {
    db = null;
    table = null;
    embeddings;
    dbPath;
    constructor(basePath = "./data/dream-memory") {
        // Ensure directory exists
        // Ensure directory exists
        if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath, { recursive: true });
        }
        this.dbPath = basePath;
        // Graceful Degradation: Check for API Key
        if (process.env.OPENAI_API_KEY) {
            this.embeddings = new OpenAIEmbeddings({
                modelName: "text-embedding-3-small",
            });
        }
        else {
            console.warn("[VectorStore] ⚠️  OPENAI_API_KEY missing. Using Mock Embeddings (Neural Phantom).");
            // Mock object satisfying minimal interface
            this.embeddings = {
                embedQuery: async (text) => new Array(1536).fill(0),
                embedDocuments: async (texts) => texts.map(() => new Array(1536).fill(0))
            };
        }
    }
    async init() {
        this.db = await connect(this.dbPath);
        // Check if table exists, if not create
        const tableNames = await this.db.tableNames();
        if (!tableNames.includes("memories")) {
            // Create with dummy data to define schema? LanceDB is flexible but likes schema
            // For now we'll imply it on first add
            // or explicit schema creation if API supports it well in node
        }
        // In LanceDB node, we often just 'open' or 'createTable' with data
        try {
            this.table = await this.db.openTable("memories");
        }
        catch {
            // Table doesn't exist, will be created on first add
            this.table = null;
        }
    }
    async addMemory(text, metadata) {
        if (!this.db)
            await this.init();
        let vector;
        try {
            vector = await this.embeddings.embedQuery(text);
        }
        catch (error) {
            console.warn("[VectorStore] Embedding failed (likely dependency issue), using mock vector.");
            vector = new Array(1536).fill(0); // Dummy vector to allow storage
        }
        const record = {
            id: crypto.randomUUID(),
            vector,
            text,
            metadata: JSON.stringify(metadata),
            timestamp: Date.now(),
        };
        if (!this.table) {
            if (!this.db)
                throw new Error("DB not initialized");
            this.table = await this.db.createTable("memories", [record]);
        }
        else {
            await this.table.add([record]);
        }
        return record.id;
    }
    async search(query, limit = 5) {
        if (!this.db || !this.table)
            await this.init();
        if (!this.table)
            return []; // No memories yet
        const queryVector = await this.embeddings.embedQuery(query);
        // LanceDB Node API for vector search
        // Note: API varies slightly by version, using standard query pattern
        const results = await this.table.vectorSearch(queryVector)
            .limit(limit)
            .toArray();
        return results.map((r) => ({
            text: r.text,
            score: r._distance ? 1 - r._distance : 0, // Approximate similarity from distance
            metadata: typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata
        }));
    }
}
export const vectorStore = new VectorStore();
