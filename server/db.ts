// Support both Neon (legacy) and standard Postgres (Cloud SQL)
import * as schema from "@shared/schema";
import { NODE_ENV } from './config/env';

// DATABASE_URL is optional for startup - server can start without DB
// Routes that need DB will handle errors gracefully
let _pool: any = null;
let _db: any = null;
let _dbInitialized = false;

// Initialize database connection
(async () => {
  if (!process.env.DATABASE_URL) {
    if (NODE_ENV === 'production') {
      console.warn("[Database] ⚠️  Production mode: DATABASE_URL not set - database features will be unavailable");
    } else {
      console.warn("[Database] ⚠️  Development mode: DATABASE_URL not set - database features will be unavailable");
    }
    return;
  }

  // Detect if we're using Neon or standard Postgres
  const isNeon = process.env.DATABASE_URL.includes('neon.tech');

  try {
    if (isNeon) {
      // Use Neon serverless driver (for legacy/development)
      const { Pool, neonConfig } = await import('@neondatabase/serverless');
      const { drizzle } = await import('drizzle-orm/neon-serverless');
      const ws = await import("ws");
      neonConfig.webSocketConstructor = ws.default;
      
      _pool = new Pool({ connectionString: process.env.DATABASE_URL });
      _db = drizzle({ client: _pool, schema });
      _dbInitialized = true;
      console.log("[Database] ✅ Connected to Neon PostgreSQL");
    } else {
      // Use standard pg driver (for Cloud SQL / standard Postgres)
      const { Pool } = await import('pg');
      const { drizzle } = await import('drizzle-orm/node-postgres');
      
      _pool = new Pool({ connectionString: process.env.DATABASE_URL });
      _db = drizzle({ client: _pool, schema });
      _dbInitialized = true;
      console.log("[Database] ✅ Connected to PostgreSQL (Cloud SQL)");
      
      if (NODE_ENV === 'production') {
        console.log("[Database] Production mode: Database connection required for core features");
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Database] ❌ Failed to connect:", errorMessage);
    
    if (NODE_ENV === 'production') {
      console.error("[Database] ⚠️  Production mode: Database connection failure may impact core functionality");
    } else {
      console.warn("[Database] ⚠️  Development mode: Continuing without database (some features unavailable)");
    }
  }
})();

// Export with proper null checks - routes should use getDb() helper
export const pool = _pool;
export const db = _db;

// Helper functions to safely access database
export function getDb() {
  if (!_db) {
    const errorMsg = 'Database not available. DATABASE_URL may not be set or connection failed.';
    console.error(`[Database] ❌ ${errorMsg}`);
    
    if (NODE_ENV === 'production') {
      console.error('[Database] ⚠️  Production mode: Database access required but unavailable');
    }
    
    throw new Error(errorMsg);
  }
  return _db;
}

export function getPool() {
  if (!_pool) {
    const errorMsg = 'Database pool not available. DATABASE_URL may not be set or connection failed.';
    console.error(`[Database] ❌ ${errorMsg}`);
    
    if (NODE_ENV === 'production') {
      console.error('[Database] ⚠️  Production mode: Database pool required but unavailable');
    }
    
    throw new Error(errorMsg);
  }
  return _pool;
}

// Check if database is available
export function isDbAvailable(): boolean {
  const available = _db !== null && _pool !== null;
  
  if (!available && NODE_ENV === 'production') {
    console.warn('[Database] ⚠️  Database check: Not available (production mode)');
  }
  
  return available;
}

// Get database initialization status
export function getDbStatus(): {
  initialized: boolean;
  available: boolean;
  hasUrl: boolean;
} {
  return {
    initialized: _dbInitialized,
    available: isDbAvailable(),
    hasUrl: !!process.env.DATABASE_URL
  };
}

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
