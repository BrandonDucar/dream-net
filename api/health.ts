import type { VercelRequest, VercelResponse } from '@vercel/node';
import { health as getHealth } from '../server/os';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const result = await getHealth();
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Health check failed' });
  }
}
