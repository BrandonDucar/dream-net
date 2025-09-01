import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runArchiveProcess } from '../../server/archive-scheduler';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const agentKey = req.headers['x-agent-key'] as string | undefined;
  const cronHeader = req.headers['x-vercel-cron'] as string | undefined;
  if (agentKey !== process.env.AGENT_API_KEY && !cronHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    await runArchiveProcess();
    return res.status(200).json({ ok: true, ran: 'archive' });
  } catch (error: any) {
    console.error('Error in archive cron', error);
    return res.status(500).json({ error: 'Archive cron failed' });
  }
}
