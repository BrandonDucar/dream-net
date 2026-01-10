"use strict";
/**
 * 🧬 MEMORY-DNA: VECTOR STORE (LANCEDB)
 *
 * "The Biomechanical Brain"
 * Persistent, queryable memory for Agents.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.vectorStore = exports.VectorMemorySystem = void 0;
const lancedb = __importStar(require("@lancedb/lancedb"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// Embedding function (Stub for now, but wired for replacement)
// In production, this would call OpenAI/HF Inference.
// For now, we use a simple deterministic hashing for "fake" vectors to prove architecture.
function mockEmbedding(text) {
    const vector = new Array(384).fill(0.0); // 384 dimensions (MiniLM standard)
    let sum = 0;
    for (let i = 0; i < text.length; i++) {
        sum += text.charCodeAt(i);
        vector[i % 384] = (vector[i % 384] + (text.charCodeAt(i) / 255)) / 2;
    }
    return vector;
}
class VectorMemorySystem {
    db = null;
    table = null;
    dbPath = path.join(process.cwd(), ".dreamnet-memory");
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
            }
            else {
                this.table = await this.db.openTable("memories");
                console.log("🧠 [VectorStore] Connected to existing memory cortex.");
            }
        }
        catch (error) {
            console.error("❌ [VectorStore] Failed to initialize:", error);
        }
    }
    async addMemory(text, metadata) {
        if (!this.db)
            await this.init();
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
                this.table = await this.db.createTable("memories", [record]);
                console.log("🧠 [VectorStore] Created new table 'memories'.");
            }
            else {
                await this.table.add([record]);
            }
            // console.log(`💾 [VectorStore] Saved memory: "${text.substring(0, 50)}..."`);
        }
        catch (err) {
            console.error("❌ [VectorStore] Write failed:", err);
        }
    }
    async query(searchText, limit = 5) {
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
            return results.map((r) => ({
                text: r.text,
                metadata: typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata,
                score: 0
            }));
        }
        catch (err) {
            console.error("❌ [VectorStore] Query failed:", err);
            return [];
        }
    }
}
exports.VectorMemorySystem = VectorMemorySystem;
// Export Singleton
exports.vectorStore = new VectorMemorySystem();
