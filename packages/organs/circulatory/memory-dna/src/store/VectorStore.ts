// @ts-ignore
import { connect, Connection, Table } from "@lancedb/lancedb";
import { pathToFileURL } from "url";
import path from "path";
import fs from "fs";

// ESM Dynamic Import Workaround for LangChain
let OpenAIEmbeddings: any;
let RecursiveCharacterTextSplitter: any;

async function loadLangChain() {
    if (OpenAIEmbeddings && RecursiveCharacterTextSplitter) return;

    const possiblePaths = [
        "@langchain/openai",
        "C:/dev/dream-net/node_modules/@langchain/openai/dist/index.js",
        pathToFileURL(path.join(process.cwd(), "node_modules/@langchain/openai/dist/index.js")).href,
        "../../../node_modules/@langchain/openai/dist/index.js"
    ];

    for (const p of possiblePaths) {
        try {
            const openai = await import(p);
            OpenAIEmbeddings = openai.OpenAIEmbeddings;
            if (OpenAIEmbeddings) {
                // console.log(`[VectorStore] ✅ Loaded OpenAIEmbeddings from ${p}`);
                break;
            }
        } catch (e) { }
    }

    const splitterPaths = [
        "@langchain/textsplitters",
        "C:/dev/dream-net/node_modules/@langchain/textsplitters/dist/index.js",
        pathToFileURL(path.join(process.cwd(), "node_modules/@langchain/textsplitters/dist/index.js")).href,
        "../../../node_modules/@langchain/textsplitters/dist/index.js"
    ];

    for (const p of splitterPaths) {
        try {
            const splitter = await import(p);
            RecursiveCharacterTextSplitter = splitter.RecursiveCharacterTextSplitter;
            if (RecursiveCharacterTextSplitter) {
                // console.log(`[VectorStore] ✅ Loaded RecursiveCharacterTextSplitter from ${p}`);
                break;
            }
        } catch (e) { }
    }

    if (!OpenAIEmbeddings || !RecursiveCharacterTextSplitter) {
        console.warn("[VectorStore] ⚠️  LangChain dependencies not found effectively. Using fallbacks.");
    }
}
pocketBase: string; // Not pocketbase, but keeping nomenclature for now

export interface VectorRecord {
    id: string;
    vector: number[];
    text: string;
    metadata: string; // JSON string
    timestamp: number;
}

export class VectorStore {
    private db: Connection | null = null;
    private table: Table | null = null;
    private embeddings: OpenAIEmbeddings;
    private dbPath: string;

    constructor(basePath: string = "./data/dream-memory") {
        if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath, { recursive: true });
        }
        this.dbPath = basePath;
    }

    async ensureEmbeddings() {
        if (this.embeddings) return;

        // Graceful Degradation: Check for API Key
        if (process.env.OPENAI_API_KEY) {
            await loadLangChain();
            this.embeddings = new OpenAIEmbeddings({
                modelName: "text-embedding-3-small",
            });
        } else {
            console.warn("[VectorStore] ⚠️  OPENAI_API_KEY missing. Using Mock Embeddings (Neural Phantom).");
            this.embeddings = {
                embedQuery: async (text: string) => new Array(1536).fill(0),
                embedDocuments: async (texts: string[]) => texts.map(() => new Array(1536).fill(0))
            } as any;
        }
    }

    async init() {
        await this.ensureEmbeddings();
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
        } catch {
            // Table doesn't exist, will be created on first add
            this.table = null;
        }
    }

    async addMemory(text: string, metadata: Record<string, any>) {
        if (!this.db) await this.init();

        let vector: number[];
        try {
            vector = await this.embeddings.embedQuery(text);
        } catch (error) {
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

        await this.ensureEmbeddings();
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
