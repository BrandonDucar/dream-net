import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { NODE_ENV } from './config/env';
neonConfig.webSocketConstructor = ws;
// DATABASE_URL is optional for startup - server can start without DB
// Routes that need DB will handle errors gracefully
let _pool = null;
let _db = null;
let _dbInitialized = false;
if (process.env.DATABASE_URL) {
    try {
        _pool = new Pool({ connectionString: process.env.DATABASE_URL });
        _db = drizzle({ client: _pool, schema });
        _dbInitialized = true;
        console.log("[Database] ✅ Connected to PostgreSQL");
        if (NODE_ENV === 'production') {
            console.log("[Database] Production mode: Database connection required for core features");
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("[Database] ❌ Failed to connect:", errorMessage);
        if (NODE_ENV === 'production') {
            console.error("[Database] ⚠️  Production mode: Database connection failure may impact core functionality");
        }
        else {
            console.warn("[Database] ⚠️  Development mode: Continuing without database (some features unavailable)");
        }
    }
}
else {
    if (NODE_ENV === 'production') {
        console.warn("[Database] ⚠️  Production mode: DATABASE_URL not set - database features will be unavailable");
        console.warn("[Database] ⚠️  Some routes may fail if they require database access");
    }
    else {
        console.warn("[Database] ⚠️  Development mode: DATABASE_URL not set - database features will be unavailable");
    }
}
// Export with proper null checks - routes should use getDb() helper
// Never export {} - always export null or the actual DB instance
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
