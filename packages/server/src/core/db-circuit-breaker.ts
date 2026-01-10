/**
 * Database Circuit Breaker Helper
 * Wraps database operations with circuit breaker protection
 */

import { withCircuitBreaker } from './circuit-breaker';
import { getDb } from '../db';

// Helper for critical queries (no circuit breaker)
export async function executeDirect<T>(operation: (db: any) => Promise<T>): Promise<T> {
    const db = getDb();
    return operation(db);
}

// Helper for regular queries (protected by circuit breaker)
export async function executeWithCircuitBreaker<T>(
    name: string,
    operation: (db: any) => Promise<T>
): Promise<T> {
    const db = getDb();

    return withCircuitBreaker(`db-${name}`, async () => {
        return operation(db);
    }, {
        failureThreshold: 5,
        resetTimeout: 10000, // 10s
        requestTimeout: 5000 // 5s timeout for DB queries
    });
}
