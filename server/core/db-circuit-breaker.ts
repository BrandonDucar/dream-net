/**
 * Database Circuit Breaker Wrapper
 * 
 * Wraps database queries with circuit breaker protection.
 */

import { getDb } from '../db';
import { withCircuitBreaker } from './circuit-breaker';

/**
 * Execute database query with circuit breaker protection
 */
export async function executeWithCircuitBreaker<T = any>(
  sql: string,
  args: any[] = []
): Promise<T> {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }

  return withCircuitBreaker('database', async () => {
    return await db.execute({ sql, args });
  });
}

/**
 * Execute database query (direct, no circuit breaker)
 * Use this for health checks or critical queries that shouldn't be protected
 */
export async function executeDirect<T = any>(
  sql: string,
  args: any[] = []
): Promise<T> {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }

  return await db.execute({ sql, args });
}

