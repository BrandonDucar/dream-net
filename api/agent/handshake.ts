import { requireAgentKey, ipAllowlist } from '../_lib/auth';

export default async function handler(req: any, res: any) {
  ipAllowlist(req, res); if (res.writableEnded) return;
  requireAgentKey(req, res); if (res.writableEnded) return;

  const checks = {
    db: !!process.env.NEON_DATABASE_URL,
    stripe: !!process.env.STRIPE_SECRET_KEY
  };
  res.status(200).json({
    ok: true,
    message: 'DreamNet v2.0 handshake acknowledged',
    checks,
    at: new Date().toISOString()
  });
}
