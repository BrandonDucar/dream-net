/**
 * Database Connection Module
 *
 * PRIMARY TARGET: Google Cloud SQL / AlloyDB PostgreSQL
 * LEGACY SUPPORT: Neon PostgreSQL (for development/backward compatibility)
 *
 * This module automatically detects the database provider from DATABASE_URL:
 * - Cloud SQL/AlloyDB: Uses standard pg driver (primary path)
 * - Neon: Uses @neondatabase/serverless driver (legacy path)
 *
 * DATABASE_URL format:
 * - Cloud SQL: postgresql://user:pass@host:5432/dbname
 * - Cloud SQL via Proxy: postgresql://user:pass@/dbname?host=/cloudsql/project:region:instance
 * - Neon: postgresql://user:pass@ep-xxx.neon.tech/dbname
 *
 * The server can start without DATABASE_URL, but database features will be unavailable.
 */
import * as schema from "@dreamnet/shared/schema";
import { NODE_ENV } from './config/env';
// DATABASE_URL is optional for startup - server can start without DB
// Routes that need DB will handle errors gracefully
let _pool = null;
let _db = null;
let _dbInitialized = false;
// Initialize database connection
(async () => {
    if (!process.env.DATABASE_URL) {
        if (NODE_ENV === 'production') {
            console.warn("[Database] ⚠️  Production mode: DATABASE_URL not set - database features will be unavailable");
            console.warn("[Database] 💡 Set DATABASE_URL to your Cloud SQL connection string");
        }
        else {
            console.warn("[Database] ⚠️  Development mode: DATABASE_URL not set - database features will be unavailable");
        }
        return;
    }
    // Detect database provider from connection string
    // PRIMARY: Cloud SQL / AlloyDB / standard Postgres (default)
    // LEGACY: Neon (detected by 'neon.tech' in URL)
    const isNeon = process.env.DATABASE_URL.includes('neon.tech');
    try {
        if (isNeon) {
            // LEGACY PATH: Neon serverless driver (for backward compatibility)
            console.log("[Database] 🔄 Detected Neon PostgreSQL (legacy mode)");
            const { Pool, neonConfig } = await import('@neondatabase/serverless');
            const { drizzle } = await import('drizzle-orm/neon-serverless');
            const ws = await import("ws");
            neonConfig.webSocketConstructor = ws.default;
            _pool = new Pool({ connectionString: process.env.DATABASE_URL });
            _db = drizzle({ client: _pool, schema });
            _dbInitialized = true;
            console.log("[Database] ✅ Connected to Neon PostgreSQL (legacy)");
        }
        else {
            // PRIMARY PATH: Standard pg driver for Cloud SQL / AlloyDB / standard Postgres
            const { Pool } = await import('pg');
            const { drizzle } = await import('drizzle-orm/node-postgres');
            const { withCircuitBreaker } = await import('./core/circuit-breaker');
            _pool = new Pool({ connectionString: process.env.DATABASE_URL });
            // Wrap initial connection test
            await withCircuitBreaker('db-connect', async () => {
                const client = await _pool.connect();
                client.release();
            });
            _db = drizzle({ client: _pool, schema });
            _dbInitialized = true;
            // Detect Cloud SQL by connection name pattern or host
            const isCloudSQL = process.env.DATABASE_URL.includes('/cloudsql/') ||
                process.env.CLOUD_SQL_INSTANCE_CONNECTION_NAME;
            if (isCloudSQL) {
                console.log("[Database] ✅ Connected to Google Cloud SQL PostgreSQL");
            }
            else {
                console.log("[Database] ✅ Connected to PostgreSQL");
            }
            if (NODE_ENV === 'production') {
                console.log("[Database] Production mode: Database connection active");
            }
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("[Database] ❌ Failed to connect:", errorMessage);
        if (NODE_ENV === 'production') {
            console.error("[Database] ⚠️  Production mode: Database connection failure may impact core functionality");
            console.error("[Database] 💡 Verify DATABASE_URL points to your Cloud SQL instance");
        }
        else {
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
export function isDbAvailable() {
    const available = _db !== null && _pool !== null;
    if (!available && NODE_ENV === 'production') {
        console.warn('[Database] ⚠️  Database check: Not available (production mode)');
    }
    return available;
}
// Get database initialization status
export function getDbStatus() {
    return {
        initialized: _dbInitialized,
        available: isDbAvailable(),
        hasUrl: !!process.env.DATABASE_URL
    };
}
// MongoDB-style collection interface for compatibility
export const mongoDb = {
    collection: (name) => ({
        insertOne: async (document) => {
            // For now, we'll use a mock implementation that matches MongoDB structure
            const id = `${name}-${Date.now()}`;
            return { insertedId: id };
        },
        find: (query) => ({
            toArray: async () => {
                // Mock implementation for compatibility
                return [];
            }
        })
    })
};
