"use strict";
/**
 * RBAC API Routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dreamnet_rbac_core_1 = require("../../packages/dreamnet-rbac-core");
var router = (0, express_1.Router)();
// GET /api/rbac/roles - Get all roles
router.get("/roles", function (req, res) {
    try {
        var roles = dreamnet_rbac_core_1.DreamNetRBACCore.getAllRoles();
        res.json({ success: true, roles: roles });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/rbac/roles/:roleId - Get specific role
router.get("/roles/:roleId", function (req, res) {
    try {
        var roleId = req.params.roleId;
        var role = dreamnet_rbac_core_1.DreamNetRBACCore.getRole(roleId);
        if (!role) {
            return res.status(404).json({ error: "Role not found" });
        }
        res.json({ success: true, role: role });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/rbac/roles - Create custom role
router.post("/roles", function (req, res) {
    try {
        var role = req.body;
        dreamnet_rbac_core_1.DreamNetRBACCore.defineRole(role);
        res.json({ success: true, role: role });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/rbac/users/:userId/roles - Get user roles
router.get("/users/:userId/roles", function (req, res) {
    try {
        var userId = req.params.userId;
        var roles = dreamnet_rbac_core_1.DreamNetRBACCore.getUserRoles(userId);
        res.json({ success: true, roles: roles });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/rbac/users/:userId/roles - Assign role to user
router.post("/users/:userId/roles", function (req, res) {
    try {
        var userId = req.params.userId;
        var _a = req.body, roleId = _a.roleId, clusterId = _a.clusterId, grantedBy = _a.grantedBy;
        dreamnet_rbac_core_1.DreamNetRBACCore.assignRole(userId, roleId, clusterId, grantedBy);
        res.json({ success: true, message: "Role assigned" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// DELETE /api/rbac/users/:userId/roles/:roleId - Revoke role from user
router.delete("/users/:userId/roles/:roleId", function (req, res) {
    try {
        var _a = req.params, userId = _a.userId, roleId = _a.roleId;
        var clusterId = req.query.clusterId;
        dreamnet_rbac_core_1.DreamNetRBACCore.revokeRole(userId, roleId, clusterId);
        res.json({ success: true, message: "Role revoked" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/rbac/check - Check permission
router.post("/check", function (req, res) {
    try {
        var _a = req.body, userId = _a.userId, walletAddress = _a.walletAddress, permission = _a.permission, clusterId = _a.clusterId, resourceId = _a.resourceId;
        var hasPermission = dreamnet_rbac_core_1.DreamNetRBACCore.checkPermission({
            userId: userId,
            walletAddress: walletAddress,
            permission: permission,
            clusterId: clusterId,
            resourceId: resourceId,
        });
        res.json({ success: true, hasPermission: hasPermission });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
