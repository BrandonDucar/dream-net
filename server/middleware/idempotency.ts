import type { Request, Response, NextFunction } from "express";

const DEFAULT_TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, number>();

export async function checkIdempotency(key: string, traceId?: string, digest?: string, ttlMs = DEFAULT_TTL_MS): Promise<{ isReplay: boolean; record?: any }> {
  const now = Date.now();
  const existing = cache.get(key);
  if (existing && now - existing < ttlMs) {
    return { isReplay: true, record: { key, timestamp: existing } };
  }
  cache.set(key, now);
  return { isReplay: false };
}

const responseCache = new Map<string, { status: number; body: any; timestamp: number }>();

export async function storeIdempotencyResponse(key: string, response: any, ttlMs = DEFAULT_TTL_MS): Promise<void> {
  const status = typeof response === 'object' && response.status ? response.status : 200;
  const body = typeof response === 'object' && response.body ? response.body : response;
  responseCache.set(key, { status, body, timestamp: Date.now() });
  // Auto-cleanup after TTL
  setTimeout(() => {
    const cached = responseCache.get(key);
    if (cached && Date.now() - cached.timestamp >= ttlMs) {
      responseCache.delete(key);
    }
  }, ttlMs);
}

export async function getIdempotencyResponse(key: string): Promise<{ status: number; body: any } | null> {
  const cached = responseCache.get(key);
  if (!cached) {
    return null;
  }
  const now = Date.now();
  if (now - cached.timestamp >= DEFAULT_TTL_MS) {
    responseCache.delete(key);
    return null;
  }
  return { status: cached.status, body: cached.body };
}

export async function idempotencyMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const key = (req.headers["x-idempotency-key"] || req.headers["idempotency-key"]) as string | undefined;
    if (!key) {
      return next();
    }

    // Check if we have a cached response
    const cachedResponse = await getIdempotencyResponse(key);
    if (cachedResponse) {
      return res.status(cachedResponse.status).json(cachedResponse.body);
    }

    const { isReplay } = await checkIdempotency(key);
    if (isReplay) {
      return res.status(409).json({
        ok: false,
        error: "duplicate_request",
        message: "Request already processed within idempotency TTL window",
      });
    }

    // Store response after it's sent
    const originalJson = res.json.bind(res);
    res.json = function(body: any) {
      storeIdempotencyResponse(key, res.statusCode, body).catch(() => {
        // Ignore storage errors
      });
      return originalJson(body);
    };

    return next();
  } catch (error) {
    console.error("[IdempotencyMiddleware] Failed to evaluate request", error);
    return res.status(500).json({
      ok: false,
      error: "idempotency_internal_error",
    });
  }
}

