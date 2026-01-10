
/**
 * 🧬 MEMORY-DNA: VECTOR STORE (LANCEDB)
 * 
 * "The Biomechanical Brain"
 * Persistent, queryable memory for Agents.
 */

import * as lancedb from "@lancedb/lancedb";
import * as path from "path";
import * as fs from "fs";
import { type MemoryRecord } from "../types";

// Embedding function (Stub for now, but wired for replacement)
// In production, this would call OpenAI/HF Inference.
// For now, we use a simple deterministic hashing for "fake" vectors to prove architecture.
function mockEmbedding(text: string): number[] {
    const vector = new Array(384).fill(0.0); // 384 dimensions (MiniLM standard)
    let sum = 0;
    for (let i = 0; i < text.length; i++) {
        sum += text.charCodeAt(i);
        vector[i % 384] = (vector[i % 384] + (text.charCodeAt(i) / 255)) / 2;
    }
    return vector;
}

export class VectorMemorySystem {
    private db: lancedb.Connection | null = null;
    private table: lancedb.Table | null = null;
    private dbPath = path.join(process.cwd(), ".dreamnet-memory");

    constructor() {
        this.init();
    }

    async init() {
        try {
            // Ensure directory exists
            if (!fs.existsSync(this.dbPath)) {
                fs.mkdirSync(this.dbPath, { recursive: true });
            }

            this.db = await lancedb.connect(this.dbPath);

            const tableNames = await this.db.tableNames();
            if (!tableNames.includes("memories")) {
                // strict null checks might complain if we don't handle schema carefully
                // lancedb creates table on first add mostly, or we define explicitly
                console.log("🧠 [VectorStore] Initializing new memory cortex...");
                // We'll create it on first insertion
            } else {
                this.table = await this.db.openTable("memories");
                console.log("🧠 [VectorStore] Connected to existing memory cortex.");
            }
        } catch (error) {
            console.error("❌ [VectorStore] Failed to initialize:", error);
        }
    }

    async addMemory(text: string, metadata: Record<string, any>) {
        if (!this.db) await this.init();

        try {
            const vector = mockEmbedding(text);
            const record = {
                vector,
                text,
                metadata: JSON.stringify(metadata),
                timestamp: Date.now(),
                id: crypto.randomUUID()
            };

            if (!this.table) {
                // First create
                this.table = await this.db!.createTable("memories", [record]);
                console.log("🧠 [VectorStore] Created new table 'memories'.");
            } else {
                await this.table.add([record]);
            }
            // console.log(`💾 [VectorStore] Saved memory: "${text.substring(0, 50)}..."`);
        } catch (err) {
            console.error("❌ [VectorStore] Write failed:", err);
        }
    }

    async query(searchText: string, limit = 5): Promise<any[]> {
        if (!this.table) {
            console.warn("⚠️ [VectorStore] No table found to query.");
            return [];
        }

        try {
            const vector = mockEmbedding(searchText);
            // Try .toArray() if available, otherwise fallback or fix method
            // In typical lancedb-node, typical pattern is:
            const results = await this.table.search(vector)
                .limit(limit)
                .toArray();

            console.log(`🔍 [Debug] Retrieved ${results.length} rows.`);

            if (results.length > 0) {
                console.log("🔍 [Debug] Row 0:", JSON.stringify(results[0], null, 2));
            }

            return results.map((r: any) => ({
                text: r.text,
                metadata: typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata,
                score: 0
            }));
        } catch (err) {
            console.error("❌ [VectorStore] Query failed:", err);
            return [];
        }
    }
}

// Export Singleton
export const vectorStore = new VectorMemorySystem();
