/**
 * Control Middleware
 * Global kill-switch and per-cluster rate limiting
 * Now with tier-based access control
 */

import type { Request, Response, NextFunction } from "express";
import { DreamNetControlCore } from "@dreamnet/dreamnet-control-core";
import type { ClusterId } from "@dreamnet/dreamnet-control-core";
import { getTraceId } from "./traceId";
import type { AuthenticatedRequest } from "./apiKeyAuth";

/**
 * Control middleware - checks kill-switch, rate limits, and tier access
 * Request flow: Trace → Idempotency → Tier Resolver → Control Core → Route Handler
 */
export function controlMiddleware(clusterId: ClusterId) {
  return (req: Request, res: Response, next: NextFunction) => {
    const traceId = req.traceId || getTraceId(req);
    const idempotencyKey = req.headers["x-idempotency-key"] as string | undefined;

    // Use callerIdentity if available (from identityResolver), otherwise fallback to legacy fields
    const callerIdentity = (req as any).callerIdentity;
    const callerTierId = callerIdentity?.tierId || req.callerTierId;
    const callerTier = callerIdentity?.tier || req.callerTier;
    const isGodVault = callerIdentity?.isGodVault || false;

    const apiKey = (req as AuthenticatedRequest).apiKey;
    const walletAddress = callerIdentity?.walletAddress || req.headers["x-wallet-address"] as string | undefined;

    const check = DreamNetControlCore.checkOperation({
      clusterId,
      operation: `${req.method} ${req.path}`,
      traceId,
      idempotencyKey,
      callerTierId,
      callerTier,
      apiKeyId: apiKey?.id,
      walletAddress,
    });

    if (!check.allowed) {
      // Log control action with God Vault status
      const godVaultMarker = isGodVault ? " [GOD_VAULT]" : "";
      console.log(`🚫 [Control] Blocked ${clusterId} - ${check.reason} - Trace: ${traceId} - Tier: ${callerTierId || "none"}${godVaultMarker}`);

      return res.status(503).json({
        ok: false,
        error: "operation_blocked",
        message: check.reason,
        clusterId,
        traceId,
        callerTierId: callerTierId || null,
        isGodVault: isGodVault || false,
        details: check.details,
      });
    }

    // Add control headers to response
    res.setHeader("X-Control-Status", "allowed");
    res.setHeader("X-Cluster-ID", clusterId);
    if (callerTierId) {
      res.setHeader("X-Caller-Tier-Id", callerTierId);
    }
    if (isGodVault) {
      res.setHeader("X-Caller-Is-God-Vault", "true");
    }

    next();
  };
}

/**
 * Create control middleware for a specific cluster
 */
export function createControlMiddleware(clusterId: ClusterId) {
  return controlMiddleware(clusterId);
}

