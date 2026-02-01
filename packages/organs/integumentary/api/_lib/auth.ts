const HEADER = 'x-agent-key';

export function requireAgentKey(req: any, res: any) {
  const expected = process.env.AGENT_API_KEY || '';
  if (!expected) return res.status(500).json({ error: 'AGENT_API_KEY missing' });
  const provided = (req.headers[HEADER] as string) || '';
  if (provided !== expected) return res.status(401).json({ error: 'unauthorized' });
}

export function ipAllowlist(req: any, res: any) {
  const list = (process.env.IP_ALLOWLIST || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (list.length === 0) return;
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || (req.socket as any)?.remoteAddress || '';
  if (!list.includes(ip)) return res.status(403).json({ error: 'IP not allowed' });
}
