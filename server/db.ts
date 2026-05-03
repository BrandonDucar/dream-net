import * as schema from "@shared/schema";
import { NODE_ENV } from './config/env';

let _pool: any = null;
let _db: any = null;
let _dbInitialized = false;

// Initialization Promise for scripts
let _initResolve: (val: any) => void;
export const waitDb = new Promise((resolve) => {
  _initResolve = resolve;
});

async function initialize() {
  if (!process.env.DATABASE_URL) {
    console.warn("[Database] DATABASE_URL not set.");
    _initResolve(null);
    return;
  }

  const isNeon = process.env.DATABASE_URL.includes('neon.tech');

  try {
    if (isNeon) {
      console.log("[Database] 🔄 Detected Neon PostgreSQL (legacy mode)");
      const { Pool, neonConfig } = await import('@neondatabase/serverless');
      const { drizzle } = await import('drizzle-orm/neon-serverless');
      const ws = await import("ws");
      neonConfig.webSocketConstructor = ws.default;
      
      _pool = new Pool({ connectionString: process.env.DATABASE_URL });
      _db = drizzle({ client: _pool, schema });
    } else {
      const { Pool } = await import('pg');
      const { drizzle } = await import('drizzle-orm/node-postgres');
      
      _pool = new Pool({ connectionString: process.env.DATABASE_URL });
      _db = drizzle({ client: _pool, schema });
    }
    _dbInitialized = true;
    console.log("[Database] ✅ Connected to PostgreSQL");
  } catch (error) {
    console.error("[Database] ❌ Failed to connect:", error);
  } finally {
    _initResolve(_db);
  }
}

// Start initialization
initialize();

export { _db as db, _pool as pool };

export function getDb() {
  if (!_db) throw new Error('Database not available.');
  return _db;
}

export function isDbAvailable(): boolean {
  return _db !== null;
}
