/**
 * Tier Resolver Middleware
 * Resolves access tier from API key header (x-dreamnet-api-key) or wallet signature
 * 
 * Request flow: Trace → Idempotency → Tier Resolver → Control Core → Route Handler
 * 
 * Now integrates with God Vault detection via identityResolver
 * 
 * @module server/middleware/tierResolver
 */

import type { Request, Response, NextFunction } from "express";
import type { TierId } from "@dreamnet/dreamnet-control-core/tierConfig";
import { TIERS, getTierConfig } from "@dreamnet/dreamnet-control-core/tierConfig";
import { identityAndTierResolver, type RequestWithIdentity, type CallerIdentity } from "@dreamnet/dreamnet-control-core/identityResolver";
import { getTraceId } from "./traceId";

declare global {
  namespace Express {
    interface Request {
      /** Resolved tier ID */
      callerTierId?: TierId;

      /** Resolved tier configuration */
      callerTier?: import("@dreamnet/dreamnet-control-core/tierConfig").TierConfig;

      /** Full caller identity (from identityResolver) */
      callerIdentity?: CallerIdentity;
    }
  }
}

/**
 * In-memory API key → tier mapping
 * 
 * TODO: Move to database/Redis for production
 * 
 * Usage:
 * ```typescript
 * import { mapApiKeyToTier } from "./middleware/tierResolver";
 * mapApiKeyToTier("dn_live_abc123...", "BUILDER");
 * ```
 */
const apiKeyToTierMap = new Map<string, TierId>();

/**
 * Map an API key to a tier
 * 
 * @param apiKey - API key string (e.g., "dn_live_abc123...")
 * @param tierId - Tier ID to assign
 * 
 * @example
 * ```typescript
 * mapApiKeyToTier("dn_live_abc123...", "BUILDER");
 * ```
 */
export function mapApiKeyToTier(apiKey: string, tierId: TierId): void {
  apiKeyToTierMap.set(apiKey, tierId);
}

/**
 * Get tier for an API key
 * 
 * @param apiKey - API key string
 * @returns Tier ID or null if not mapped
 */
export function getApiKeyTier(apiKey: string): TierId | null {
  return apiKeyToTierMap.get(apiKey) || null;
}

/**
 * Resolve tier from request
 * Reads x-dreamnet-api-key header and maps to tier
 * Defaults to SEED if unknown
 * 
 * @param req - Express request
 * @returns Resolved tier ID and config
 */
export function resolveTier(req: Request): {
  tierId: TierId;
  tierConfig: import("@dreamnet/dreamnet-control-core/tierConfig").TierConfig;
} {
  // Read API key from header
  const apiKey = req.headers["x-dreamnet-api-key"] as string | undefined;

  if (apiKey) {
    const mappedTier = getApiKeyTier(apiKey);
    if (mappedTier) {
      return {
        tierId: mappedTier,
        tierConfig: getTierConfig(mappedTier),
      };
    }
  }

  // Default to SEED tier
  return {
    tierId: "SEED",
    tierConfig: getTierConfig("SEED"),
  };
}

/**
 * Tier resolver middleware
 * 
 * Uses identityAndTierResolver to resolve tier from:
 * - x-dreamnet-api-key (including God Vault keys)
 * - x-dreamnet-wallet-address + x-dreamnet-wallet-signature
 * 
 * Attaches to request:
 * - req.callerIdentity: Full caller identity
 * - req.callerTierId: Tier ID (for backward compatibility)
 * - req.callerTier: Tier configuration (for backward compatibility)
 * 
 * Logs traceId + tierId + isGodVault for observability
 * 
 * @example
 * ```typescript
 * app.use(tierResolverMiddleware);
 * 
 * router.get("/api/wolf-pack", (req, res) => {
 *   const identity = req.callerIdentity; // CallerIdentity
 *   const tier = req.callerTierId; // "BUILDER"
 *   const isGod = identity?.isGodVault; // false
 * });
 * ```
 */
export function tierResolverMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Use identityAndTierResolver which handles God Vault detection
  identityAndTierResolver(req as RequestWithIdentity, res, (err?: any) => {
    if (err) {
      console.error("[TierResolver] Error in identity resolver:", err);
      // Default to SEED on error
      req.callerTierId = "SEED";
      req.callerTier = getTierConfig("SEED");
      return next();
    }

    try {
      const identity = (req as RequestWithIdentity).callerIdentity;
      const traceId = req.traceId || getTraceId(req);

      if (identity) {
        // Attach full identity
        (req as RequestWithIdentity).callerIdentity = identity;

        // Also attach for backward compatibility
        req.callerTierId = identity.tierId;
        req.callerTier = identity.tier;

        // Log for observability
        console.log(`[TierResolver] Trace: ${traceId}, Tier: ${identity.tierId}, Source: ${identity.source}, GodVault: ${identity.isGodVault}`);

        // Add tier info to response headers for debugging
        if (process.env.DEBUG_TIER === "true") {
          res.setHeader("X-Caller-Tier-Id", identity.tierId);
          res.setHeader("X-Caller-Tier-Label", identity.tier.label);
          res.setHeader("X-Caller-Is-God-Vault", identity.isGodVault ? "true" : "false");
          res.setHeader("X-Caller-Source", identity.source);
        }
      } else {
        // Fallback to legacy resolver
        const { tierId, tierConfig } = resolveTier(req);
        req.callerTierId = tierId;
        req.callerTier = tierConfig;

        console.log(`[TierResolver] Fallback - Trace: ${traceId}, Tier: ${tierId}`);
      }

      next();
    } catch (error) {
      console.error("[TierResolver] Error processing identity:", error);
      // Default to SEED on error
      req.callerTierId = "SEED";
      req.callerTier = getTierConfig("SEED");
      next();
    }
  });
}

/**
 * Middleware to require a minimum tier
 * 
 * @param minTierId - Minimum tier required
 * @returns Express middleware
 * 
 * @example
 * ```typescript
 * router.post("/api/deploy", requireTier("BUILDER"), async (req, res) => {
 *   // Only BUILDER, OPERATOR, or GOD_MODE can access
 * });
 * ```
 */
export function requireTier(minTierId: TierId) {
  const tierOrder: TierId[] = ["SEED", "BUILDER", "OPERATOR", "GOD_MODE"];

  return (req: Request, res: Response, next: NextFunction) => {
    const callerTierId = req.callerTierId || "SEED";
    const callerTierIndex = tierOrder.indexOf(callerTierId);
    const minTierIndex = tierOrder.indexOf(minTierId);

    if (callerTierIndex < minTierIndex) {
      const traceId = req.traceId || getTraceId(req);

      return res.status(403).json({
        ok: false,
        error: "insufficient_tier",
        message: `This endpoint requires ${minTierId} tier or higher`,
        callerTierId,
        requiredTierId: minTierId,
        traceId,
      });
    }

    next();
  };
}

/**
 * Middleware to require a specific feature flag
 * 
 * Returns 403 with traceId, tierId, and requiredFlag if feature is not enabled
 * 
 * @param featureFlag - Feature flag name to check
 * @returns Express middleware
 * 
 * @example
 * ```typescript
 * import { requireFeature } from "./middleware/tierResolver";
 * 
 * router.post("/api/wolf-pack/execute", requireFeature("canAccessWolfPack"), async (req, res) => {
 *   // Only tiers with canAccessWolfPack=true can access
 * });
 * ```
 */
export function requireFeature(featureFlag: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const callerTierId = req.callerTierId || "SEED";
    const callerTier = req.callerTier || getTierConfig("SEED");

    const hasFeature = callerTier.featureFlags[featureFlag] === true;

    if (!hasFeature) {
      const traceId = req.traceId || getTraceId(req);

      return res.status(403).json({
        ok: false,
        error: "feature_not_available",
        message: `Feature flag '${featureFlag}' is not enabled for tier ${callerTierId}`,
        callerTierId,
        requiredFlag: featureFlag,
        traceId,
      });
    }

    next();
  };
}
