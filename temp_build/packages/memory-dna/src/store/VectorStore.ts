
import * as lancedb from "@lancedb/lancedb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import path from "path";
import fs from "fs";

export interface VectorRecord {
    id: string;
    vector: number[];
    text: string;
    metadata: string; // JSON string
    timestamp: number;
}

export class VectorStore {
    private db: lancedb.Connection | null = null;
    private table: lancedb.Table | null = null;
    private embeddings: OpenAIEmbeddings;
    private dbPath: string;

    constructor(basePath: string = "./data/dream-memory") {
        // Ensure directory exists
        if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath, { recursive: true });
        }
        this.dbPath = basePath;

        // We expect OPENAI_API_KEY to be present for embeddings
        // If not, we could swap to a local embedding model (Transformer.js) later
        this.embeddings = new OpenAIEmbeddings({
            modelName: "text-embedding-3-small",
        });
    }

    async init() {
        this.db = await lancedb.connect(this.dbPath);

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
        } catch {
            // Table doesn't exist, will be created on first add
            this.table = null;
        }
    }

    async addMemory(text: string, metadata: Record<string, any>) {
        if (!this.db) await this.init();

        const vector = await this.embeddings.embedQuery(text);
        const record = {
            id: crypto.randomUUID(),
            vector,
            text,
            metadata: JSON.stringify(metadata),
            timestamp: Date.now(),
        };

        if (!this.table) {
            if (!this.db) throw new Error("DB not initialized");
            this.table = await this.db.createTable("memories", [record]);
        } else {
            await this.table.add([record]);
        }

        return record.id;
    }

    async search(query: string, limit: number = 5): Promise<Array<{ text: string, score: number, metadata: any }>> {
        if (!this.db || !this.table) await this.init();
        if (!this.table) return []; // No memories yet

        const queryVector = await this.embeddings.embedQuery(query);

        // LanceDB Node API for vector search
        // Note: API varies slightly by version, using standard query pattern
        const results = await this.table.vectorSearch(queryVector)
            .limit(limit)
            .toArray();

        return results.map((r: any) => ({
            text: r.text,
            score: r._distance ? 1 - r._distance : 0, // Approximate similarity from distance
            metadata: typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata
        }));
    }
}

export const vectorStore = new VectorStore();
