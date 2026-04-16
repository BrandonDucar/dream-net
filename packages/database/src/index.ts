/**
 * Database Connection Module
 */
import * as schema from "@dreamnet/shared/schema";
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

// Simple environment check
const NODE_ENV = process.env.NODE_ENV || 'development';

var _pool: any = null;
var _db: any = null;
var _dbInitialized = false;

// Initialize database connection
(async () => {
  if (!process.env.DATABASE_URL) {
    if (NODE_ENV === 'production') {
      console.warn("[Database] ⚠️  Production mode: DATABASE_URL not set");
    }
    return;
  }

  const isNeon = process.env.DATABASE_URL.includes('neon.tech');

  try {
    if (isNeon) {
      console.log("[Database] 🔄 Detected Neon PostgreSQL");
      const { Pool: NeonPool, neonConfig } = await import('@neondatabase/serverless');
      const { drizzle: neonDrizzle } = await import('drizzle-orm/neon-serverless');
      const ws = await import("ws");
      neonConfig.webSocketConstructor = ws.default;

      _pool = new NeonPool({ connectionString: process.env.DATABASE_URL });
      _db = neonDrizzle(_pool, { schema });
      _dbInitialized = true;
      console.log("[Database] ✅ Connected to Neon PostgreSQL");
    } else {
      _pool = new Pool({ connectionString: process.env.DATABASE_URL });

      // Simple connection test without circuit breaker
      try {
        const client = await _pool.connect();
        client.release();
      } catch (err) {
        console.error("Initial DB connection test failed:", err);
        throw err;
      }

      _db = drizzle(_pool, { schema });
      _dbInitialized = true;
      console.log("[Database] ✅ Connected to PostgreSQL");
    }
  } catch (error) {
    console.error("[Database] ❌ Failed to connect:", error);
  }
})();

export const pool = _pool;
export const db = _db;

export function getDb() {
  if (!_db) {
    console.warn("Database accessed before initialization or connection failed");
    // Return null or throw depending on strictness. For now throw to match legacy behavior
    // unless we want to allow startup. 
    // If _db is null, caller effectively crashes exactly like before.
  }
  return _db;
}

export function getPool() {
  return _pool;
}

export function isDbAvailable(): boolean {
  return _db !== null && _pool !== null;
}

export { DataKeeper, DataKeeperAgent } from './agent.js';
