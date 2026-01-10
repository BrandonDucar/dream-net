/**
 * RBAC Store
 * Stores role definitions and user roles
 */
import type { RoleDefinition, UserRole, PermissionCheck } from "../types";
declare class RBACStore {
    private roles;
    private userRoles;
    constructor();
    private initializeDefaultRoles;
    defineRole(role: RoleDefinition): void;
    getRole(roleId: string): RoleDefinition | undefined;
    getAllRoles(): RoleDefinition[];
    assignRole(userId: string, roleId: string, clusterId?: string, grantedBy?: string): void;
    getUserRoles(userId: string): UserRole[];
    checkPermission(check: PermissionCheck): boolean;
    revokeRole(userId: string, roleId: string, clusterId?: string): void;
}
export declare const rbacStore: RBACStore;
export {};
