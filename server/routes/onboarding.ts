import { Router, Request, Response } from 'express';
import { getDb } from '../db.js';
import { swarmAgents, guilds } from '../../shared/schema.js';
import { sql } from 'drizzle-orm';

const router = Router();

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const agentsCount = await db.select({ count: sql<number>`count(*)` }).from(swarmAgents);
    const guildsCount = await db.select({ count: sql<number>`count(*)` }).from(guilds);
    
    res.json({
      success: true,
      totalAgents: agentsCount[0].count,
      totalGuilds: guildsCount[0].count,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/batch', async (req: Request, res: Response) => {
  const { agents } = req.body;
  if (!Array.isArray(agents)) {
    return res.status(400).json({ error: "Agents must be an array" });
  }

  try {
    const db = getDb();
    await db.insert(swarmAgents).values(agents);
    res.json({ success: true, message: `Batch of ${agents.length} agents onboarded.` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
