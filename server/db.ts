
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Setup Neon config
neonConfig.webSocketConstructor = ws;

// --- Environment Variable Checks ---
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}
const DATABASE_URL_V2 = process.env.DATABASE_URL_V2 ?? process.env.DATABASE2_URL;
if (!DATABASE_URL_V2) {
  throw new Error(
    "DATABASE_URL_V2 must be set. Did you forget to provision a database?",
  );
}

// --- Database Connections ---
// Primary DB (from dream-net)
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Secondary DB (from DreamnetV2)
export const pool2 = new Pool({ connectionString: DATABASE_URL_V2 });
export const db2 = drizzle({ client: pool2, schema });


// --- Utility Functions from dream-net ---

/**
 * From dream-net/api/db.js
 * Execute a raw SQL query with parameters on the primary pool.
 */
export async function query(text: string, params: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}


/**
 * From dream-net/server/db.ts
 * Utility function for agents to safely execute queries with automatic retry.
 * This can be used with any drizzle instance (db or db2).
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  backoffMs: number = 1000
): Promise<T> {
  let lastError: any; // Using 'any' to be safe with different error types

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      const errorMessage = (error as Error).message;

      // Don't retry on certain errors (can be adapted)
      if (errorMessage?.includes('statement timeout') ||
          errorMessage?.includes('query timeout') ||
          errorMessage?.includes('connection timeout')) {
        console.warn(`[DB] Query timeout on attempt ${attempt}/${maxRetries}`);
        if (attempt === maxRetries) throw error;

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, backoffMs * attempt));
        continue;
      }

      // For other errors, don't retry immediately
      throw error;
    }
  }

  throw lastError;
}


/**
 * From dream-net/api/db.js
 * Initialize canary_trigger table if it doesn't exist.
 */
async function initCanaryTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS canary_trigger (
        id bigserial PRIMARY KEY,
        source text,
        seen_at timestamptz NOT NULL DEFAULT now(),
        meta jsonb
      )
    `, []);
    console.log('✅ [DB] Canary trigger table initialized');
  } catch (error: any) {
    console.error('❌ [DB] Failed to initialize canary table:', error.message);
  }
}

// --- Initialization ---
// Initialize table on module load
initCanaryTable();
