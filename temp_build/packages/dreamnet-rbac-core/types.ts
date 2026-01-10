/**
 * DreamNet RBAC Core Types
 * Role-Based Access Control system
 */

export type Role = "admin" | "operator" | "viewer" | "custom";

export type Permission =
  | "kill_switch:enable"
  | "kill_switch:disable"
  | "rate_limit:create"
  | "rate_limit:update"
  | "rate_limit:delete"
  | "circuit_breaker:trip"
  | "circuit_breaker:reset"
  | "cluster:enable"
  | "cluster:disable"
  | "billable:view"
  | "billable:charge"
  | "audit:view"
  | "audit:export"
  | "config:view"
  | "config:update";

export interface RoleDefinition {
  id: string;
  name: string;
  permissions: Permission[];
  clusterScoped?: boolean; // If true, permissions apply per-cluster
}

export interface UserRole {
  userId: string;
  walletAddress?: string;
  roleId: string;
  clusterId?: string; // If specified, role applies only to this cluster
  grantedAt: number;
  grantedBy: string;
}

export interface PermissionCheck {
  userId: string;
  walletAddress?: string;
  permission: Permission;
  clusterId?: string;
  resourceId?: string;
}

