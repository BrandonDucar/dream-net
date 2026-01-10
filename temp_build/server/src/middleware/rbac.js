"use strict";
/**
 * RBAC Middleware
 * Checks permissions before allowing actions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRBACMiddleware = createRBACMiddleware;
var dreamnet_rbac_core_1 = require("../../packages/dreamnet-rbac-core");
function createRBACMiddleware(permission) {
    return function (req, res, next) {
        var userId = req.userId || req.headers["x-user-id"] || "anonymous";
        var walletAddress = req.walletAddress || req.headers["x-wallet-address"];
        var clusterId = req.params.clusterId || req.query.clusterId;
        var traceId = req.traceId;
        var hasPermission = dreamnet_rbac_core_1.DreamNetRBACCore.checkPermission({
            userId: userId,
            walletAddress: walletAddress,
            permission: permission,
            clusterId: clusterId,
            resourceId: req.params.id,
        });
        if (!hasPermission) {
            return res.status(403).json({
                ok: false,
                error: "permission_denied",
                message: "Permission '".concat(permission, "' required"),
                traceId: traceId,
                userId: userId,
                permission: permission,
                clusterId: clusterId,
            });
        }
        next();
    };
}
