// @ts-nocheck
/**
 * MemoryClaw MCP Server
 * Qdrant vector memory for persistent agent recall across sessions.
 * Agents can store memories, query by semantic similarity, and maintain context.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { QdrantClient } from "@qdrant/js-client-rest";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const PORT       = Number(process.env.PORT || 8090);
const QDRANT_URL = process.env.QDRANT_URL || "http://dreamnet_qdrant:6333";

// Collection names for different memory types
const COLLECTIONS = {
  conversations: "dreamnet_conversations",
  facts:         "dreamnet_facts",
  tasks:         "dreamnet_tasks",
  market_intel:  "dreamnet_market_intel",
  agent_state:   "dreamnet_agent_state",
};

const qdrant = new QdrantClient({ url: QDRANT_URL });

const server = new Server(
  { name: "memoryclaw", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

const tools = [
  {
    name: "memory_store",
    description: "Store a memory in Qdrant vector database. Agents can recall this later via semantic search.",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string", description: "The memory text to store" },
        namespace: { type: "string", description: "Memory namespace: conversations, facts, tasks, market_intel, agent_state", enum: Object.keys(COLLECTIONS) },
        agent: { type: "string", description: "Agent name storing this memory" },
        metadata: { type: "object", description: "Optional metadata (urls, timestamps, tags)" },
        importance: { type: "number", description: "Importance score 0-1 (default 0.5)" },
      },
      required: ["text", "namespace", "agent"],
    },
  },
  {
    name: "memory_recall",
    description: "Query memories by semantic similarity. Returns most relevant past memories.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Query text to find semantically similar memories" },
        namespace: { type: "string", description: "Memory namespace to search" },
        limit: { type: "number", description: "Number of results (default 5, max 20)" },
        agent: { type: "string", description: "Filter to specific agent's memories" },
        min_score: { type: "number", description: "Minimum similarity threshold 0-1 (default 0.7)" },
      },
      required: ["query", "namespace"],
    },
  },
  {
    name: "memory_forget",
    description: "Delete a specific memory by ID or filter",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { type: "string", description: "Memory namespace" },
        id: { type: "string", description: "Specific memory ID to delete" },
        filter: { type: "object", description: "Filter object to match memories for deletion" },
      },
      required: ["namespace"],
    },
  },
  {
    name: "memory_list_namespaces",
    description: "List all available memory namespaces/collections",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "memory_get_agent_context",
    description: "Get full context for an agent — all their recent memories across namespaces",
    inputSchema: {
      type: "object",
      properties: {
        agent: { type: "string", description: "Agent name" },
        limit: { type: "number", description: "Memories per namespace (default 10)" },
      },
      required: ["agent"],
    },
  },
  {
    name: "memory_status",
    description: "Check Qdrant connection and collection status",
    inputSchema: { type: "object", properties: {} },
  },
];

// Simple embedding function (in production, use real embeddings API)
async function generateEmbedding(text: string): Promise<number[]> {
  // For now, use a simple hash-based pseudo-embedding
  // In production, call OpenAI, Azure, or local embedding model
  const hash = text.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
  const embedding = new Array(384).fill(0).map((_, i) => {
    const val = Math.sin(hash * (i + 1)) * 0.5 + 0.5;
    return parseFloat(val.toFixed(4));
  });
  return embedding;
}

async function ensureCollection(name: string): Promise<void> {
  try {
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some(c => c.name === name);
    if (!exists) {
      await qdrant.createCollection(name, {
        vectors: { size: 384, distance: "Cosine" },
      });
      console.log(`[MemoryClaw] Created collection: ${name}`);
    }
  } catch (e) {
    console.error(`[MemoryClaw] Collection error for ${name}:`, e.message);
  }
}

async function executeTool(name: string, args: any): Promise<any> {
  try {
    switch (name) {
      case "memory_store": {
        const collection = COLLECTIONS[args.namespace as keyof typeof COLLECTIONS] || args.namespace;
        await ensureCollection(collection);
        
        const embedding = await generateEmbedding(args.text);
        const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        
        await qdrant.upsert(collection, {
          points: [{
            id,
            vector: embedding,
            payload: {
              text: args.text,
              agent: args.agent,
              namespace: args.namespace,
              importance: args.importance || 0.5,
              metadata: args.metadata || {},
              timestamp: new Date().toISOString(),
            },
          }],
        });
        
        return { ok: true, id, namespace: args.namespace, stored: true };
      }

      case "memory_recall": {
        const collection = COLLECTIONS[args.namespace as keyof typeof COLLECTIONS] || args.namespace;
        await ensureCollection(collection);
        
        const embedding = await generateEmbedding(args.query);
        const limit = Math.min(args.limit || 5, 20);
        
        const filter = args.agent ? { must: [{ key: "agent", match: { value: args.agent } }] } : undefined;
        
        const results = await qdrant.search(collection, {
          vector: embedding,
          limit,
          filter,
          with_payload: true,
          score_threshold: args.min_score || 0.5,
        });
        
        return {
          ok: true,
          query: args.query,
          namespace: args.namespace,
          results: results.map(r => ({
            id: r.id,
            score: r.score,
            text: r.payload?.text,
            agent: r.payload?.agent,
            timestamp: r.payload?.timestamp,
            metadata: r.payload?.metadata,
          })),
        };
      }

      case "memory_forget": {
        const collection = COLLECTIONS[args.namespace as keyof typeof COLLECTIONS] || args.namespace;
        
        if (args.id) {
          await qdrant.delete(collection, { points: [args.id] });
          return { ok: true, deleted: 1, id: args.id };
        }
        
        if (args.filter) {
          // Delete by filter
          await qdrant.delete(collection, { filter: args.filter });
          return { ok: true, deleted_by_filter: true };
        }
        
        return { ok: false, error: "Provide id or filter to delete" };
      }

      case "memory_list_namespaces": {
        const collections = await qdrant.getCollections();
        return {
          ok: true,
          namespaces: Object.keys(COLLECTIONS),
          collections: collections.collections.map(c => c.name),
          collections_detail: COLLECTIONS,
        };
      }

      case "memory_get_agent_context": {
        const agent = args.agent;
        const limit = args.limit || 10;
        const context: Record<string, any[]> = {};
        
        for (const [key, collection] of Object.entries(COLLECTIONS)) {
          try {
            await ensureCollection(collection);
            const results = await qdrant.scroll(collection, {
              filter: { must: [{ key: "agent", match: { value: agent } }] },
              limit,
              with_payload: true,
            });
            context[key] = results.points.map(p => ({
              id: p.id,
              text: p.payload?.text,
              timestamp: p.payload?.timestamp,
              importance: p.payload?.importance,
            }));
          } catch (e) {
            context[key] = [];
          }
        }
        
        return { ok: true, agent, context };
      }

      case "memory_status": {
        try {
          const collections = await qdrant.getCollections();
          const health = await fetch(`${QDRANT_URL}/health`).then(r => r.ok).catch(() => false);
          return {
            ok: true,
            qdrant_connected: true,
            qdrant_url: QDRANT_URL,
            collections: collections.collections.map(c => ({ name: c.name, points_count: c.points_count })),
            health,
          };
        } catch (e: any) {
          return { ok: false, error: e.message, qdrant_connected: false };
        }
      }

      default:
        return { error: `Unknown tool: ${name}` };
    }
  } catch (e: any) {
    return { error: e.message, tool: name };
  }
}

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  return { content: [{ type: "text", text: JSON.stringify(await executeTool(name, args)) }] };
});

async function main() {
  const transportMode = (process.env.MCP_TRANSPORT || "http").toLowerCase();

  if (transportMode === "stdio") {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("[MemoryClaw] Running in stdio mode");
  } else {
    const app = express();
    app.use(express.json());

    app.get("/health", async (_req, res) => {
      try {
        await qdrant.getCollections();
        res.json({ ok: true, service: "memoryclaw-mcp", qdrant: QDRANT_URL, status: "connected" });
      } catch (e: any) {
        res.status(503).json({ ok: false, error: e.message });
      }
    });

    app.post("/mcp", async (req, res) => {
      const { method, params, id } = req.body || {};
      try {
        if (method === "listTools") {
          res.json({ jsonrpc: "2.0", result: { tools }, id });
        } else if (method === "callTool") {
          const result = await executeTool(params?.name, params?.arguments);
          res.json({ jsonrpc: "2.0", result, id });
        } else {
          res.status(404).json({ jsonrpc: "2.0", error: { code: -32601, message: `Unknown: ${method}` }, id: id ?? null });
        }
      } catch (e: any) {
        res.status(500).json({ jsonrpc: "2.0", error: { code: -32000, message: e.message }, id: id ?? null });
      }
    });

    app.listen(PORT, () => {
      console.log(`[MemoryClaw] MCP server on port ${PORT}`);
      console.log(`[MemoryClaw] Qdrant: ${QDRANT_URL}`);
    });
  }

  await new Promise(() => {});
}

main().catch((e) => { console.error("[MemoryClaw] Fatal:", e); process.exit(1); });
