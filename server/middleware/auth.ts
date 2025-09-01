import type { Request, Response, NextFunction } from "express";

const HDR_AGENT = "x-agent-key";
const HDR_VERCEL_CRON = "x-vercel-cron";
const HDR_SIG = "x-job-signature"; // optional HMAC for scheduled jobs

export function requireAgentKey(opts?: { allowVercelCron?: boolean; hmacSecretEnv?: string }) {
  const allowCron = opts?.allowVercelCron ?? true;
  const requiredKey = process.env.AGENT_API_KEY;
  const hmacSecret = opts?.hmacSecretEnv ? process.env[opts.hmacSecretEnv] : undefined;

  if (!requiredKey) throw new Error("Missing AGENT_API_KEY.");

  return function (req: Request, res: Response, next: NextFunction) {
    const presented = req.header(HDR_AGENT);
    const isCron = allowCron && Boolean(req.header(HDR_VERCEL_CRON));

    // HMAC signature (optional hardening for cron/queued jobs)
    if (isCron && hmacSecret) {
      const sig = req.header(HDR_SIG);
      if (!sig) return res.status(401).json({ error: "Missing job signature" });
      // Defer actual verification to a route-level guard if payload matters.
    }

    if (presented === requiredKey || isCron) return next();
    return res.status(401).json({ error: "Unauthorized" });
  };
}
