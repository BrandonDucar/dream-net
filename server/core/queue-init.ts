/**
 * Idempotent Queue/Topic Initialization
 * 
 * Declares queues/topics if missing (no-op if present).
 * Stores initialization state in database.
 */

import { getDb } from '../db';

interface QueueConfig {
  name: string;
  type: 'queue' | 'topic' | 'stream';
  config?: Record<string, any>;
}

/**
 * Initialize a queue/topic (idempotent)
 */
export async function ensureQueue(config: QueueConfig): Promise<void> {
  const db = getDb();
  if (!db) {
    console.warn(`⚠️  [QueueInit] Database not available, skipping queue init: ${config.name}`);
    return;
  }

  try {
    // Check if queue already exists
    const existing = await db.execute({
      sql: `
        SELECT name FROM queue_registry 
        WHERE name = $1
      `,
      args: [config.name],
    });

    if (existing.rows && existing.rows.length > 0) {
      console.log(`   ✅ [QueueInit] Queue "${config.name}" already exists, skipping`);
      return;
    }

    // Create queue registry entry
    await db.execute({
      sql: `
        INSERT INTO queue_registry (name, type, config, created_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (name) DO NOTHING
      `,
      args: [config.name, config.type, JSON.stringify(config.config || {})],
    });

    console.log(`   ✅ [QueueInit] Queue "${config.name}" initialized`);
  } catch (error: any) {
    // If table doesn't exist, create it first
    if (error.message?.includes('does not exist') || error.message?.includes('relation') || error.message?.includes('table')) {
      await createQueueRegistryTable(db);
      // Retry
      return ensureQueue(config);
    }
    console.error(`   ❌ [QueueInit] Failed to initialize queue "${config.name}":`, error.message);
  }
}

/**
 * Create queue_registry table if it doesn't exist
 */
async function createQueueRegistryTable(db: any): Promise<void> {
  try {
    await db.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS queue_registry (
          name TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          config JSONB,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `,
      args: [],
    });

    await db.execute({
      sql: `
        CREATE INDEX IF NOT EXISTS queue_registry_type_idx 
        ON queue_registry (type)
      `,
      args: [],
    });

    console.log(`   ✅ [QueueInit] Created queue_registry table`);
  } catch (error: any) {
    console.error(`   ❌ [QueueInit] Failed to create queue_registry table:`, error.message);
  }
}

/**
 * Initialize Spine Event Bus queues/topics
 */
export async function initializeSpineQueues(): Promise<void> {
  console.log('📬 [QueueInit] Initializing Spine Event Bus queues...');

  const queues: QueueConfig[] = [
    { name: 'dreamnet-events', type: 'topic' },
    { name: 'agent-commands', type: 'queue' },
    { name: 'agent-responses', type: 'queue' },
    { name: 'dead-letter', type: 'queue' },
  ];

  for (const queue of queues) {
    await ensureQueue(queue);
  }

  console.log(`✅ [QueueInit] Spine queues initialized`);
}

/**
 * Initialize all queues (called on startup)
 */
export async function initializeAllQueues(): Promise<void> {
  try {
    await initializeSpineQueues();
  } catch (error: any) {
    console.warn(`⚠️  [QueueInit] Queue initialization warning:`, error.message);
  }
}

