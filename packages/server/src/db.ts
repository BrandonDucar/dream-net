/**
 * Database Bridge Module (Legacy Compatibility Layer)
 * 
 * This module bridges the server's legacy database interface to the unified
 * @dreamnet/database workspace package and the DataKeeper Agent.
 */
import { DataKeeper, isDbAvailable as checkDbAvailable } from "@dreamnet/database";
import { withCircuitBreaker } from './core/circuit-breaker.js';

// Export the core instances from the unified workspace
export const db = DataKeeper.db;
export const DataKeeperAgent = DataKeeper;

/**
 * Safely access the database instance.
 * @throws Error if database is not available.
 */
export function getDb() {
  const instance = DataKeeper.db;
  if (!instance) {
    throw new Error('Database not available. DataKeeperAgent may not be initialized or connection failed.');
  }
  return instance;
}

/**
 * Check if the database is currently available.
 */
export function isDbAvailable(): boolean {
  return checkDbAvailable();
}

/**
 * Get the current status of the database agent.
 */
export function getDbStatus() {
  return DataKeeper.status();
}

/**
 * Perform a guarded health check using the circuit breaker.
 */
export async function checkHealth() {
  return withCircuitBreaker('db-health', async () => {
    if (!isDbAvailable()) {
      throw new Error("Database is offline");
    }
    return true;
  });
}

// MongoDB-style collection interface for backward compatibility
export const mongoDb = {
  collection: (name: string) => ({
    insertOne: async (document: any) => {
      const id = `${name}-${Date.now()}`;
      return { insertedId: id };
    },
    find: (query: any) => ({
      toArray: async () => []
    })
  })
};
