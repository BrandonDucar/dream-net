import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

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