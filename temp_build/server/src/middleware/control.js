"use strict";
/**
 * Control Middleware
 * Global kill-switch and per-cluster rate limiting
 * Now with tier-based access control
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlMiddleware = controlMiddleware;
exports.createControlMiddleware = createControlMiddleware;
var dreamnet_control_core_1 = require("../../packages/dreamnet-control-core");
var traceId_1 = require("./traceId");
/**
 * Control middleware - checks kill-switch, rate limits, and tier access
 * Request flow: Trace → Idempotency → Tier Resolver → Control Core → Route Handler
 */
function controlMiddleware(clusterId) {
    return function (req, res, next) {
        var traceId = req.traceId || (0, traceId_1.getTraceId)(req);
        var idempotencyKey = req.headers["x-idempotency-key"];
        // Use callerIdentity if available (from identityResolver), otherwise fallback to legacy fields
        var callerIdentity = req.callerIdentity;
        var callerTierId = (callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.tierId) || req.callerTierId;
        var callerTier = (callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.tier) || req.callerTier;
        var isGodVault = (callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.isGodVault) || false;
        var apiKey = req.apiKey;
        var walletAddress = (callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.walletAddress) || req.headers["x-wallet-address"];
        var check = dreamnet_control_core_1.DreamNetControlCore.checkOperation({
            clusterId: clusterId,
            operation: "".concat(req.method, " ").concat(req.path),
            traceId: traceId,
            idempotencyKey: idempotencyKey,
            callerTierId: callerTierId,
            callerTier: callerTier,
            apiKeyId: apiKey === null || apiKey === void 0 ? void 0 : apiKey.id,
            walletAddress: walletAddress,
        });
        if (!check.allowed) {
            // Log control action with God Vault status
            var godVaultMarker = isGodVault ? " [GOD_VAULT]" : "";
            console.log("\uD83D\uDEAB [Control] Blocked ".concat(clusterId, " - ").concat(check.reason, " - Trace: ").concat(traceId, " - Tier: ").concat(callerTierId || "none").concat(godVaultMarker));
            return res.status(503).json({
                ok: false,
                error: "operation_blocked",
                message: check.reason,
                clusterId: clusterId,
                traceId: traceId,
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
function createControlMiddleware(clusterId) {
    return controlMiddleware(clusterId);
}
