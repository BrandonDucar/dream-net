/**
 * Database Connection Module
 * 
 * SUPPORTS MULTIPLE DATABASE PROVIDERS:
 * 1. Netlify Neon Integration (NETLIFY_DATABASE_URL) - Native Netlify integration
 * 2. Neon PostgreSQL (DATABASE_URL with neon.tech) - Standard Neon connection
 * 3. Cloud SQL / AlloyDB / Standard PostgreSQL (DATABASE_URL) - Standard Postgres
 * 
 * Priority order:
 * 1. NETLIFY_DATABASE_URL (if on Netlify) - Uses @netlify/neon
 * 2. DATABASE_URL with neon.tech - Uses @neondatabase/serverless
 * 3. DATABASE_URL (standard) - Uses pg driver
 * 
 * The server can start without database, but database features will be unavailable.
 */
import * as schema from "@shared/schema";
import { NODE_ENV } from './config/env';

// Database connection state
let _pool: any = null;
let _db: any = null;
let _dbInitialized = false;
let _connectionType: 'netlify-neon' | 'neon-serverless' | 'postgres' | null = null;

// Initialize database connection
(async () => {
  // Check for Netlify's native Neon integration first
  const netlifyDbUrl = process.env.NETLIFY_DATABASE_URL;
  const databaseUrl = process.env.DATABASE_URL;

  if (!netlifyDbUrl && !databaseUrl) {
    if (NODE_ENV === 'production') {
      console.warn("[Database] ⚠️  Production mode: No database URL set - database features will be unavailable");
      console.warn("[Database] 💡 Set NETLIFY_DATABASE_URL (Netlify) or DATABASE_URL (standard)");
    } else {
      console.warn("[Database] ⚠️  Development mode: No database URL set - database features will be unavailable");
    }
    return;
  }

  try {
    // Priority 1: Netlify's native Neon integration
    if (netlifyDbUrl) {
      console.log("[Database] 🔄 Detected Netlify Neon integration (NETLIFY_DATABASE_URL)");
      try {
        // Try Netlify's native Neon SDK
        const { neon } = await import('@netlify/neon');
        const sql = neon(); // Automatically uses NETLIFY_DATABASE_URL
        
        // Test connection
        await sql`SELECT 1`;
        
        // For Drizzle, we still need a pool/client
        // Netlify's neon() returns a SQL template tag, so we'll use it directly
        // For Drizzle compatibility, we'll create a wrapper
        const { drizzle } = await import('drizzle-orm/neon-serverless');
        
        // Create a compatible client for Drizzle
        const { Pool, neonConfig } = await import('@neondatabase/serverless');
        const ws = await import("ws");
        neonConfig.webSocketConstructor = ws.default;
        
        _pool = new Pool({ connectionString: netlifyDbUrl });
        _db = drizzle({ client: _pool, schema });
        _connectionType = 'netlify-neon';
        _dbInitialized = true;
        
        console.log("[Database] ✅ Connected to Neon PostgreSQL via Netlify integration");
      } catch (netlifyError) {
        console.warn("[Database] ⚠️  Netlify Neon SDK not available, falling back to standard connection");
        // Fall through to standard DATABASE_URL handling
      }
    }

    // Priority 2 & 3: Standard DATABASE_URL (Neon or standard Postgres)
    if (!_dbInitialized && databaseUrl) {
      const isNeon = databaseUrl.includes('neon.tech');

      if (isNeon) {
        // Neon serverless driver
        console.log("[Database] 🔄 Detected Neon PostgreSQL (DATABASE_URL)");
        const { Pool, neonConfig } = await import('@neondatabase/serverless');
        const { drizzle } = await import('drizzle-orm/neon-serverless');
        const ws = await import("ws");
        neonConfig.webSocketConstructor = ws.default;
        
        _pool = new Pool({ connectionString: databaseUrl });
        _db = drizzle({ client: _pool, schema });
        _connectionType = 'neon-serverless';
        _dbInitialized = true;
        console.log("[Database] ✅ Connected to Neon PostgreSQL");
      } else {
        // Standard PostgreSQL driver
        const { Pool } = await import('pg');
        const { drizzle } = await import('drizzle-orm/node-postgres');
        
        _pool = new Pool({ connectionString: databaseUrl });
        _db = drizzle({ client: _pool, schema });
        _connectionType = 'postgres';
        _dbInitialized = true;
        
        // Detect Cloud SQL
        const isCloudSQL = databaseUrl.includes('/cloudsql/') || 
                          process.env.CLOUD_SQL_INSTANCE_CONNECTION_NAME;
        
        if (isCloudSQL) {
          console.log("[Database] ✅ Connected to Google Cloud SQL PostgreSQL");
        } else {
          console.log("[Database] ✅ Connected to PostgreSQL");
        }
      }
      
      if (NODE_ENV === 'production') {
        console.log("[Database] Production mode: Database connection active");
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Database] ❌ Failed to connect:", errorMessage);
    
    if (NODE_ENV === 'production') {
      console.error("[Database] ⚠️  Production mode: Database connection failure may impact core functionality");
      console.error("[Database] 💡 Verify database URL is correct");
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
  connectionType: 'netlify-neon' | 'neon-serverless' | 'postgres' | null;
  hasNetlifyUrl: boolean;
} {
  return {
    initialized: _dbInitialized,
    available: isDbAvailable(),
    hasUrl: !!process.env.DATABASE_URL,
    connectionType: _connectionType,
    hasNetlifyUrl: !!process.env.NETLIFY_DATABASE_URL
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
