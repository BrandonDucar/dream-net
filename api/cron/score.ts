import { requireAgentKey, ipAllowlist } from '../_lib/auth';

export default async function handler(req: any, res: any) {
  ipAllowlist(req, res); if (res.writableEnded) return;
  requireAgentKey(req, res); if (res.writableEnded) return;

  // TODO: run one scoring batch; no loops.
  res.status(200).json({ ok: true, ran: 'score', at: new Date().toISOString() });
}
