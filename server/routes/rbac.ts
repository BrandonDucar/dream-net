/**
 * RBAC API Routes
 */

import { Router } from "express";
import { DreamNetRBACCore } from "@dreamnet/dreamnet-rbac-core";

const router = Router();

// GET /api/rbac/roles - Get all roles
router.get("/roles", (req, res) => {
  try {
    const roles = DreamNetRBACCore.getAllRoles();
    res.json({ success: true, roles });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rbac/roles/:roleId - Get specific role
router.get("/roles/:roleId", (req, res) => {
  try {
    const { roleId } = req.params;
    const role = DreamNetRBACCore.getRole(roleId);
    
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    
    res.json({ success: true, role });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rbac/roles - Create custom role
router.post("/roles", (req, res) => {
  try {
    const role = req.body;
    DreamNetRBACCore.defineRole(role);
    res.json({ success: true, role });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rbac/users/:userId/roles - Get user roles
router.get("/users/:userId/roles", (req, res) => {
  try {
    const { userId } = req.params;
    const roles = DreamNetRBACCore.getUserRoles(userId);
    res.json({ success: true, roles });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rbac/users/:userId/roles - Assign role to user
router.post("/users/:userId/roles", (req, res) => {
  try {
    const { userId } = req.params;
    const { roleId, clusterId, grantedBy } = req.body;
    
    DreamNetRBACCore.assignRole(userId, roleId, clusterId, grantedBy);
    res.json({ success: true, message: "Role assigned" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/rbac/users/:userId/roles/:roleId - Revoke role from user
router.delete("/users/:userId/roles/:roleId", (req, res) => {
  try {
    const { userId, roleId } = req.params;
    const { clusterId } = req.query;
    
    DreamNetRBACCore.revokeRole(userId, roleId, clusterId as string | undefined);
    res.json({ success: true, message: "Role revoked" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rbac/check - Check permission
router.post("/check", (req, res) => {
  try {
    const { userId, walletAddress, permission, clusterId, resourceId } = req.body;
    
    const hasPermission = DreamNetRBACCore.checkPermission({
      userId,
      walletAddress,
      permission,
      clusterId,
      resourceId,
    });
    
    res.json({ success: true, hasPermission });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

