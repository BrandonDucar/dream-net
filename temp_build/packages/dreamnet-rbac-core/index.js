"use strict";
/**
 * DreamNet RBAC Core
 * Role-Based Access Control system
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DreamNetRBACCore = void 0;
const rbacStore_1 = require("./store/rbacStore");
exports.DreamNetRBACCore = {
    /**
     * Define a custom role
     */
    defineRole(role) {
        rbacStore_1.rbacStore.defineRole(role);
    },
    /**
     * Get a role definition
     */
    getRole(roleId) {
        return rbacStore_1.rbacStore.getRole(roleId);
    },
    /**
     * Get all role definitions
     */
    getAllRoles() {
        return rbacStore_1.rbacStore.getAllRoles();
    },
    /**
     * Assign a role to a user
     */
    assignRole(userId, roleId, clusterId, grantedBy = "system") {
        rbacStore_1.rbacStore.assignRole(userId, roleId, clusterId, grantedBy);
    },
    /**
     * Get roles for a user
     */
    getUserRoles(userId) {
        return rbacStore_1.rbacStore.getUserRoles(userId);
    },
    /**
     * Check if a user has a permission
     */
    checkPermission(check) {
        return rbacStore_1.rbacStore.checkPermission(check);
    },
    /**
     * Revoke a role from a user
     */
    revokeRole(userId, roleId, clusterId) {
        rbacStore_1.rbacStore.revokeRole(userId, roleId, clusterId);
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.DreamNetRBACCore;
