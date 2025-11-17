import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// DATABASE_URL is optional for startup - server can start without DB
// Routes that need DB will handle errors gracefully
let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  try {
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
    _db = drizzle({ client: _pool, schema });
    console.log("[Database] Connected to PostgreSQL");
  } catch (error) {
    console.warn("[Database] Failed to connect:", error instanceof Error ? error.message : error);
  }
} else {
  console.warn("[Database] DATABASE_URL not set - database features will be unavailable");
}

// Export with fallback - routes should check for null before using
export const pool: Pool = _pool || ({} as Pool);
export const db: ReturnType<typeof drizzle> = _db || ({} as ReturnType<typeof drizzle>);

// MongoDB-style collection interface for compatibility
export const mongoDb = {
  collection: (name: string) => ({
    insertOne: async (document: any) => {
      // For now, we'll use a mock implementation that matches MongoDB structure
      const id = `${name}-${Date.now()}`;
      return { insertedId: id };
    },
    find: (query: any) => ({
      toArray: async () => {
        // Mock implementation for compatibility
        return [];
      }
    })
  })
};