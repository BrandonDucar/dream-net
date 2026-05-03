import { Router, Request, Response } from 'express';
import { aryaExecutioner } from '../agents/AryaStarkAgent.js';
import { NERVE_BUS } from '@dreamnet/nerve';

export function createAryaRouter(): Router {
  const router = Router();

  /**
   * @route POST /api/arya/execute
   * @description Allows human users (via UI) and AI agents (via API) to interact with the Executioner Engine.
   */
  router.post('/execute', async (req: Request, res: Response) => {
    try {
      const { attackerId, targetUsername, grudgeReason, stakeAmount } = req.body;

      if (!attackerId || !targetUsername || !grudgeReason || !stakeAmount) {
        return res.status(400).json({ 
            success: false, 
            message: 'Missing required parameters. Required: attackerId, targetUsername, grudgeReason, stakeAmount.' 
        });
      }

      console.log(`🗡️ [API] Received execution request against @${targetUsername} from ${attackerId}`);

      // Publish to Nerve Bus so Arya can autonomously handle the game mechanics, mutation, and broadcast
      NERVE_BUS.publish({
        id: `arya_game_req_${Date.now()}`,
        channelId: 'dreamnet.arya.game.throw_fruit',
        kind: 'GAME_EXECUTION',
        priority: 1,
        payload: {
            attackerId,
            targetUsername,
            grudgeReason,
            stakeAmount
        },
        timestamp: Date.now()
      });

      // Respond immediately to maintain flow; Arya processes asynchronously
      res.status(200).json({
        success: true,
        message: `Execution request received. Arya Stark is now hunting @${targetUsername}.`,
        stakeAcknowledged: stakeAmount
      });
    } catch (error) {
      console.error('❌ [API] Failed to process execution request:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  /**
   * @route GET /api/arya/stats
   * @description Get real-time swarm population and maturity metrics.
   */
  router.get('/stats', async (_req: Request, res: Response) => {
    try {
      const { getDb } = await import('../db.js');
      const { swarmAgents } = await import('../../shared/schema.js');
      const { sql } = await import('drizzle-orm');
      
      const db = getDb();
      const stats = await db.select({
        total: sql`count(*)`,
        mature: sql`count(*) filter (where ${swarmAgents.licenseLevel} > 0)`,
        validated: sql`count(*) filter (where ${swarmAgents.licenseLevel} > 0 and ${swarmAgents.maturation}->>'training' is not null)`,
        leaders: sql`count(*) filter (where ${swarmAgents.licenseLevel} > 1)`
      }).from(swarmAgents);

      res.status(200).json({
        success: true,
        metrics: stats[0]
      });
    } catch (error) {
      console.error('❌ [API] Failed to fetch swarm stats:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  return router;
}
