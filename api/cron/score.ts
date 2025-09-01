import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DreamScoreEngine } from '../../server/dream-score-engine';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const agentKey = req.headers['x-agent-key'] as string | undefined;
  const cronHeader = req.headers['x-vercel-cron'] as string | undefined;
  if (agentKey !== process.env.AGENT_API_KEY && !cronHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const engine = new DreamScoreEngine();
  try {
    await engine.updateAllDreamScores();
    return res.status(200).json({ ok: true, ran: 'score' });
  } catch (error: any) {
    console.error('Error in score cron', error);
    return res.status(500).json({ error: 'Score cron failed' });
  }
}
