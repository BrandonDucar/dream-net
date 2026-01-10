/**
 * DreamNet RBAC Core
 * Role-Based Access Control system
 */

import { rbacStore } from './store/rbacStore.js';
import type { RoleDefinition, UserRole, Permission, PermissionCheck } from './types.js';

export const DreamNetRBACCore = {
  /**
   * Define a custom role
   */
  defineRole(role: RoleDefinition): void {
    rbacStore.defineRole(role);
  },

  /**
   * Get a role definition
   */
  getRole(roleId: string): RoleDefinition | undefined {
    return rbacStore.getRole(roleId);
  },

  /**
   * Get all role definitions
   */
  getAllRoles(): RoleDefinition[] {
    return rbacStore.getAllRoles();
  },

  /**
   * Assign a role to a user
   */
  assignRole(
    userId: string,
    roleId: string,
    clusterId?: string,
    grantedBy: string = "system"
  ): void {
    rbacStore.assignRole(userId, roleId, clusterId, grantedBy);
  },

  /**
   * Get roles for a user
   */
  getUserRoles(userId: string): UserRole[] {
    return rbacStore.getUserRoles(userId);
  },

  /**
   * Check if a user has a permission
   */
  checkPermission(check: PermissionCheck): boolean {
    return rbacStore.checkPermission(check);
  },

  /**
   * Revoke a role from a user
   */
  revokeRole(userId: string, roleId: string, clusterId?: string): void {
    rbacStore.revokeRole(userId, roleId, clusterId);
  },
};

export * from './types.js';
export default DreamNetRBACCore;

