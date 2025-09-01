import type { Request, Response, NextFunction } from "express";

type Bucket = { tokens: number; updatedAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit({
  limit = 60,
  windowMs = 60_000,
}: { limit?: number; windowMs?: number } = {}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const b = buckets.get(key) ?? { tokens: limit, updatedAt: now };
    const refill = ((now - b.updatedAt) / windowMs) * limit;

    b.tokens = Math.min(limit, b.tokens + refill);
    b.updatedAt = now;

    if (b.tokens < 1) {
      res.setHeader("Retry-After", Math.ceil(windowMs / 1000).toString());
      return res.status(429).json({ error: "Rate limited" });
    }

    b.tokens -= 1;
    buckets.set(key, b);
    next();
  };
}
