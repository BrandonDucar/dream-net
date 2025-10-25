import type { NextApiRequest, NextApiResponse } from 'next';
import registry from '../data/registry.json';

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  // Serve the registry JSON with cache control headers
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.status(200).json(registry);
}
