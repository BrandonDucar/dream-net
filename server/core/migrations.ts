/**
 * Idempotent Migration Helpers
 * 
 * Extends Drizzle's migration system with idempotent up/down functions
 * and migration state tracking.
 */

import { getDb } from '../db';

interface Migration {
  name: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

const migrations: Migration[] = [];

/**
 * Register a migration
 */
export function registerMigration(migration: Migration): void {
  migrations.push(migration);
}

/**
 * Get migration history from database
 */
async function getMigrationHistory(): Promise<string[]> {
  const db = getDb();
  if (!db) {
    return [];
  }

  try {
    // Create migrations table if it doesn't exist
    await db.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS schema_migrations (
          name TEXT PRIMARY KEY,
          applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `,
      args: [],
    });

    const result = await db.execute({
      sql: `SELECT name FROM schema_migrations ORDER BY applied_at`,
      args: [],
    });

    return result.rows?.map((row: any) => row.name) || [];
  } catch (error: any) {
    console.warn(`⚠️  [Migrations] Could not get migration history:`, error.message);
    return [];
  }
}

/**
 * Mark migration as applied
 */
async function markMigrationApplied(name: string): Promise<void> {
  const db = getDb();
  if (!db) {
    return;
  }

  try {
    await db.execute({
      sql: `
        INSERT INTO schema_migrations (name, applied_at)
        VALUES ($1, NOW())
        ON CONFLICT (name) DO NOTHING
      `,
      args: [name],
    });
  } catch (error: any) {
    console.error(`❌ [Migrations] Failed to mark migration as applied:`, error.message);
  }
}

/**
 * Run pending migrations
 */
export async function runMigrations(): Promise<void> {
  console.log('🔄 [Migrations] Checking for pending migrations...');

  const applied = await getMigrationHistory();
  const pending = migrations.filter((m) => !applied.includes(m.name));

  if (pending.length === 0) {
    console.log('✅ [Migrations] No pending migrations');
    return;
  }

  console.log(`📦 [Migrations] Running ${pending.length} pending migration(s)...`);

  for (const migration of pending) {
    try {
      console.log(`   ⏳ [Migrations] Applying: ${migration.name}`);
      await migration.up();
      await markMigrationApplied(migration.name);
      console.log(`   ✅ [Migrations] Applied: ${migration.name}`);
    } catch (error: any) {
      console.error(`   ❌ [Migrations] Failed: ${migration.name}`, error.message);
      throw error; // Stop on first failure
    }
  }

  console.log(`✅ [Migrations] All migrations applied`);
}

/**
 * Rollback last migration
 */
export async function rollbackLastMigration(): Promise<void> {
  const applied = await getMigrationHistory();
  if (applied.length === 0) {
    console.log('⚠️  [Migrations] No migrations to rollback');
    return;
  }

  const lastMigrationName = applied[applied.length - 1];
  const migration = migrations.find((m) => m.name === lastMigrationName);

  if (!migration) {
    throw new Error(`Migration not found: ${lastMigrationName}`);
  }

  try {
    console.log(`   ⏳ [Migrations] Rolling back: ${lastMigrationName}`);
    await migration.down();

    const db = getDb();
    if (db) {
      await db.execute({
        sql: `DELETE FROM schema_migrations WHERE name = $1`,
        args: [lastMigrationName],
      });
    }

    console.log(`   ✅ [Migrations] Rolled back: ${lastMigrationName}`);
  } catch (error: any) {
    console.error(`   ❌ [Migrations] Rollback failed: ${lastMigrationName}`, error.message);
    throw error;
  }
}

/**
 * Get migration status
 */
export async function getMigrationStatus(): Promise<{
  total: number;
  applied: number;
  pending: number;
  appliedMigrations: string[];
  pendingMigrations: string[];
}> {
  const applied = await getMigrationHistory();
  const pending = migrations.filter((m) => !applied.includes(m.name));

  return {
    total: migrations.length,
    applied: applied.length,
    pending: pending.length,
    appliedMigrations: applied,
    pendingMigrations: pending.map((m) => m.name),
  };
}

