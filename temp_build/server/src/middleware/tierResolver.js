"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapApiKeyToTier = mapApiKeyToTier;
exports.getApiKeyTier = getApiKeyTier;
exports.resolveTier = resolveTier;
exports.tierResolverMiddleware = tierResolverMiddleware;
exports.requireTier = requireTier;
exports.requireFeature = requireFeature;
var tierConfig_1 = require("../../packages/dreamnet-control-core/tierConfig");
var identityResolver_1 = require("../../packages/dreamnet-control-core/identityResolver");
var traceId_1 = require("./traceId");
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
var apiKeyToTierMap = new Map();
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
function mapApiKeyToTier(apiKey, tierId) {
    apiKeyToTierMap.set(apiKey, tierId);
}
/**
 * Get tier for an API key
 *
 * @param apiKey - API key string
 * @returns Tier ID or null if not mapped
 */
function getApiKeyTier(apiKey) {
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
function resolveTier(req) {
    // Read API key from header
    var apiKey = req.headers["x-dreamnet-api-key"];
    if (apiKey) {
        var mappedTier = getApiKeyTier(apiKey);
        if (mappedTier) {
            return {
                tierId: mappedTier,
                tierConfig: (0, tierConfig_1.getTierConfig)(mappedTier),
            };
        }
    }
    // Default to SEED tier
    return {
        tierId: "SEED",
        tierConfig: (0, tierConfig_1.getTierConfig)("SEED"),
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
function tierResolverMiddleware(req, res, next) {
    // Use identityAndTierResolver which handles God Vault detection
    (0, identityResolver_1.identityAndTierResolver)(req, res, function (err) {
        if (err) {
            console.error("[TierResolver] Error in identity resolver:", err);
            // Default to SEED on error
            req.callerTierId = "SEED";
            req.callerTier = (0, tierConfig_1.getTierConfig)("SEED");
            return next();
        }
        try {
            var identity = req.callerIdentity;
            var traceId = req.traceId || (0, traceId_1.getTraceId)(req);
            if (identity) {
                // Attach full identity
                req.callerIdentity = identity;
                // Also attach for backward compatibility
                req.callerTierId = identity.tierId;
                req.callerTier = identity.tier;
                // Log for observability
                console.log("[TierResolver] Trace: ".concat(traceId, ", Tier: ").concat(identity.tierId, ", Source: ").concat(identity.source, ", GodVault: ").concat(identity.isGodVault));
                // Add tier info to response headers for debugging
                if (process.env.DEBUG_TIER === "true") {
                    res.setHeader("X-Caller-Tier-Id", identity.tierId);
                    res.setHeader("X-Caller-Tier-Label", identity.tier.label);
                    res.setHeader("X-Caller-Is-God-Vault", identity.isGodVault ? "true" : "false");
                    res.setHeader("X-Caller-Source", identity.source);
                }
            }
            else {
                // Fallback to legacy resolver
                var _a = resolveTier(req), tierId = _a.tierId, tierConfig = _a.tierConfig;
                req.callerTierId = tierId;
                req.callerTier = tierConfig;
                console.log("[TierResolver] Fallback - Trace: ".concat(traceId, ", Tier: ").concat(tierId));
            }
            next();
        }
        catch (error) {
            console.error("[TierResolver] Error processing identity:", error);
            // Default to SEED on error
            req.callerTierId = "SEED";
            req.callerTier = (0, tierConfig_1.getTierConfig)("SEED");
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
function requireTier(minTierId) {
    var tierOrder = ["SEED", "BUILDER", "OPERATOR", "GOD_MODE"];
    return function (req, res, next) {
        var callerTierId = req.callerTierId || "SEED";
        var callerTierIndex = tierOrder.indexOf(callerTierId);
        var minTierIndex = tierOrder.indexOf(minTierId);
        if (callerTierIndex < minTierIndex) {
            var traceId = req.traceId || (0, traceId_1.getTraceId)(req);
            return res.status(403).json({
                ok: false,
                error: "insufficient_tier",
                message: "This endpoint requires ".concat(minTierId, " tier or higher"),
                callerTierId: callerTierId,
                requiredTierId: minTierId,
                traceId: traceId,
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
function requireFeature(featureFlag) {
    return function (req, res, next) {
        var callerTierId = req.callerTierId || "SEED";
        var callerTier = req.callerTier || (0, tierConfig_1.getTierConfig)("SEED");
        var hasFeature = callerTier.featureFlags[featureFlag] === true;
        if (!hasFeature) {
            var traceId = req.traceId || (0, traceId_1.getTraceId)(req);
            return res.status(403).json({
                ok: false,
                error: "feature_not_available",
                message: "Feature flag '".concat(featureFlag, "' is not enabled for tier ").concat(callerTierId),
                callerTierId: callerTierId,
                requiredFlag: featureFlag,
                traceId: traceId,
            });
        }
        next();
    };
}
