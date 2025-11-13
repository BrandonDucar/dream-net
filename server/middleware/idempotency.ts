import type { Request, Response, NextFunction } from "express";

const DEFAULT_TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, number>();

export async function checkIdempotency(key: string, ttlMs = DEFAULT_TTL_MS): Promise<boolean> {
  const now = Date.now();
  const existing = cache.get(key);
  if (existing && now - existing < ttlMs) {
    return true;
  }
  cache.set(key, now);
  return false;
}

export async function idempotencyMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const key = (req.headers["x-idempotency-key"] || req.headers["idempotency-key"]) as string | undefined;
    if (!key) {
      return next();
    }

    const isReplay = await checkIdempotency(key);
    if (isReplay) {
      return res.status(409).json({
        ok: false,
        error: "duplicate_request",
        message: "Request already processed within idempotency TTL window",
      });
    }

    return next();
  } catch (error) {
    console.error("[IdempotencyMiddleware] Failed to evaluate request", error);
    return res.status(500).json({
      ok: false,
      error: "idempotency_internal_error",
    });
  }
}

