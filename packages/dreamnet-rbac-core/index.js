/**
 * DreamNet RBAC Core
 * Role-Based Access Control system
 */
import { rbacStore } from "./store/rbacStore";
export const DreamNetRBACCore = {
    /**
     * Define a custom role
     */
    defineRole(role) {
        rbacStore.defineRole(role);
    },
    /**
     * Get a role definition
     */
    getRole(roleId) {
        return rbacStore.getRole(roleId);
    },
    /**
     * Get all role definitions
     */
    getAllRoles() {
        return rbacStore.getAllRoles();
    },
    /**
     * Assign a role to a user
     */
    assignRole(userId, roleId, clusterId, grantedBy = "system") {
        rbacStore.assignRole(userId, roleId, clusterId, grantedBy);
    },
    /**
     * Get roles for a user
     */
    getUserRoles(userId) {
        return rbacStore.getUserRoles(userId);
    },
    /**
     * Check if a user has a permission
     */
    checkPermission(check) {
        return rbacStore.checkPermission(check);
    },
    /**
     * Revoke a role from a user
     */
    revokeRole(userId, roleId, clusterId) {
        rbacStore.revokeRole(userId, roleId, clusterId);
    },
};
export * from "./types";
export default DreamNetRBACCore;
