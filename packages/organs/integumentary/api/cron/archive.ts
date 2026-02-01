import { requireAgentKey, ipAllowlist } from '../_lib/auth';

export default async function handler(req: any, res: any) {
  ipAllowlist(req, res); if (res.writableEnded) return;
  requireAgentKey(req, res); if (res.writableEnded) return;

  // TODO: archive old rows, prune logs.
  res.status(200).json({ ok: true, ran: 'archive', at: new Date().toISOString() });
}
