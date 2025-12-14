/**
 * Latent Sessions API Routes
 * Provides endpoints for querying latent collaboration sessions
 */

import { Router } from 'express';
import { db } from '../db';
import { latentSessions } from '../../shared/schema';
import { desc, eq, sql } from 'drizzle-orm';

const router = Router();

// Get latent sessions
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const source = req.query.source as string;
    
    let query = db
      .select()
      .from(latentSessions)
      .orderBy(desc(latentSessions.createdAt))
      .limit(limit);
    
    if (source) {
      query = query.where(eq(latentSessions.source, source)) as any;
    }
    
    const sessions = await query;
    res.json(sessions);
  } catch (error: any) {
    console.error('[LatentSessions] Error fetching sessions:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch sessions' });
  }
});

// Get agent's latent sessions
router.get('/agent/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const sessions = await db
      .select()
      .from(latentSessions)
      .where(
        sql`${latentSessions.relatedAgents} @> ${JSON.stringify([agentId])}`
      )
      .orderBy(desc(latentSessions.createdAt))
      .limit(limit);
    
    res.json(sessions);
  } catch (error: any) {
    console.error('[LatentSessions] Error fetching agent sessions:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch agent sessions' });
  }
});

export default router;

