/**
 * Logging Functions for Latent Sessions
 */

import type { LatentMetadata } from './types';

// Import db and schema - using dynamic import to avoid circular dependencies
let db: any = null;
let latentSessions: any = null;

async function getDb() {
  if (!db) {
    try {
      const dbModule = await import('../../../server/db');
      db = dbModule.db;
    } catch (error) {
      console.warn('[LatentCollaboration] Could not import db:', error);
      return null;
    }
  }
  return db;
}

async function getSchema() {
  if (!latentSessions) {
    try {
      const schemaModule = await import('../../../shared/schema');
      latentSessions = schemaModule.latentSessions;
    } catch (error) {
      console.warn('[LatentCollaboration] Could not import schema:', error);
      return null;
    }
  }
  return latentSessions;
}

export interface LatentSessionLog {
  source: string;
  task: string;
  inputPrompt: string;
  latentRep: number[];
  decodedOutput?: string;
  relatedAgents?: string[];
  onchainContext?: LatentMetadata['onchainContext'];
  metadata?: Record<string, any>;
}

/**
 * Log latent session to database
 */
export async function logLatentSession(session: LatentSessionLog): Promise<void> {
  try {
    const database = await getDb();
    const schema = await getSchema();
    
    if (!database || !schema) {
      console.warn('[LatentCollaboration] Database not available, skipping log');
      return;
    }
    
    await database.insert(schema).values({
      source: session.source,
      task: session.task,
      inputPrompt: session.inputPrompt,
      latentRep: session.latentRep,
      decodedOutput: session.decodedOutput,
      relatedAgents: session.relatedAgents,
      onchainContext: session.onchainContext,
      metadata: session.metadata,
    });
  } catch (error) {
    // Don't break main flow if logging fails
    console.error('[LatentCollaboration] Logging error:', error);
  }
}

