export default async function handler(_req: any, res: any) {
  res.status(200).json({
    ok: true,
    ts: new Date().toISOString(),
    env: {
      db: !!process.env.NEON_DATABASE_URL,
      stripe: !!process.env.STRIPE_SECRET_KEY
    }
  });
}
