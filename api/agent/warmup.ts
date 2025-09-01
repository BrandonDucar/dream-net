import type { VercelRequest, VercelResponse } from '@vercel/node';
import { warmup } from '../../server/os';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const agentKey = req.headers['x-agent-key'] as string | undefined;
  if (agentKey !== process.env.AGENT_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const result = await warmup();
    return res.status(200).json(result || { ok: true });
  } catch (error: any) {
    console.error('Error in warmup', error);
    return res.status(500).json({ error: 'Warmup failed' });
  }
}
