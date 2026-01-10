/**
 * DreamNet RBAC Core
 * Role-Based Access Control system
 */
import type { RoleDefinition, UserRole, PermissionCheck } from "./types";
export declare const DreamNetRBACCore: {
    /**
     * Define a custom role
     */
    defineRole(role: RoleDefinition): void;
    /**
     * Get a role definition
     */
    getRole(roleId: string): RoleDefinition | undefined;
    /**
     * Get all role definitions
     */
    getAllRoles(): RoleDefinition[];
    /**
     * Assign a role to a user
     */
    assignRole(userId: string, roleId: string, clusterId?: string, grantedBy?: string): void;
    /**
     * Get roles for a user
     */
    getUserRoles(userId: string): UserRole[];
    /**
     * Check if a user has a permission
     */
    checkPermission(check: PermissionCheck): boolean;
    /**
     * Revoke a role from a user
     */
    revokeRole(userId: string, roleId: string, clusterId?: string): void;
};
export * from "./types";
export default DreamNetRBACCore;
