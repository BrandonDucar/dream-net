# DreamNet RBAC Core - Complete Documentation

**Package**: `@dreamnet/dreamnet-rbac-core`  
**Status**: ✅ Complete  
**Last Updated**: 2025-01-27

---

## Overview

DreamNet RBAC Core provides **role-based access control** for DreamNet operations. It manages roles (admin, operator, viewer, custom), permissions, and user role assignments with support for cluster-scoped permissions.

### Key Features

- **Role Definitions**: Pre-defined roles (admin, operator, viewer) plus custom roles
- **Permission System**: Fine-grained permissions for kill-switches, rate limits, circuit breakers, etc.
- **Cluster Scoping**: Roles can be cluster-specific or global
- **User Management**: Assign/revoke roles per user with audit trail
- **Permission Checks**: Fast permission validation for operations

---

## Architecture

### How It Works

```
Role Definition → User Assignment → Permission Check → Access Granted/Denied
```

1. **Role Definition**: Roles define sets of permissions (e.g., admin has all permissions)
2. **User Assignment**: Users are assigned roles, optionally scoped to clusters
3. **Permission Check**: When an operation is requested, RBAC checks if user has required permission
4. **Access Control**: Operation proceeds if permission granted, denied otherwise

### Why This Design

- **Separation of Concerns**: Access control is separate from business logic
- **Flexible**: Supports both global and cluster-scoped permissions
- **Auditable**: All role assignments tracked with timestamps and grantors
- **Performance**: In-memory store for fast permission checks
- **Extensible**: Custom roles allow fine-grained control

---

## API Reference

### Types

```typescript
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
```

### Default Roles

#### Admin Role
- **Permissions**: All permissions (full access)
- **Scope**: Global (not cluster-scoped)
- **Use Case**: System administrators

#### Operator Role
- **Permissions**: Operational permissions (rate limits, circuit breakers, clusters)
- **Scope**: Cluster-scoped (per-cluster permissions)
- **Use Case**: Cluster operators

#### Viewer Role
- **Permissions**: Read-only permissions (view billable, audit, config)
- **Scope**: Global
- **Use Case**: Observers, auditors

### Functions

#### `defineRole(role: RoleDefinition): void`

Define a custom role.

**Example**:
```typescript
DreamNetRBACCore.defineRole({
  id: "custom-operator",
  name: "Custom Operator",
  permissions: [
    "rate_limit:update",
    "circuit_breaker:reset",
    "config:view",
  ],
  clusterScoped: true,
});
```

#### `getRole(roleId: string): RoleDefinition | undefined`

Get a role definition.

#### `getAllRoles(): RoleDefinition[]`

Get all role definitions.

#### `assignRole(userId: string, roleId: string, clusterId?: string, grantedBy?: string): void`

Assign a role to a user.

**Example**:
```typescript
// Global admin
DreamNetRBACCore.assignRole("user-123", "admin", undefined, "system");

// Cluster-scoped operator
DreamNetRBACCore.assignRole("user-456", "operator", "api-cluster", "admin-user-123");
```

#### `getUserRoles(userId: string): UserRole[]`

Get all roles for a user.

**Example**:
```typescript
const roles = DreamNetRBACCore.getUserRoles("user-123");
// Returns: [{ roleId: "admin", clusterId: undefined, ... }]
```

#### `checkPermission(check: PermissionCheck): boolean`

Check if a user has a permission.

**Example**:
```typescript
const canEnableKillSwitch = DreamNetRBACCore.checkPermission({
  userId: "user-123",
  permission: "kill_switch:enable",
});

const canUpdateRateLimit = DreamNetRBACCore.checkPermission({
  userId: "user-456",
  permission: "rate_limit:update",
  clusterId: "api-cluster", // Check cluster-scoped permission
});
```

#### `revokeRole(userId: string, roleId: string, clusterId?: string): void`

Revoke a role from a user.

**Example**:
```typescript
DreamNetRBACCore.revokeRole("user-456", "operator", "api-cluster");
```

---

## Integration Points

### Consumes

- None (standalone system)

### Produces

- **Permission Checks**: Used by Control Core, Audit Core, etc.

### Integration Pattern

```typescript
// Before performing operation
if (!DreamNetRBACCore.checkPermission({
  userId,
  permission: "kill_switch:enable",
})) {
  throw new Error("Permission denied");
}

// Perform operation
DreamNetControlCore.enableGlobalKillSwitch();
```

---

## Usage Examples

### Basic Permission Check

```typescript
import { DreamNetRBACCore } from "@dreamnet/dreamnet-rbac-core";

// Check permission before operation
function enableKillSwitch(userId: string) {
  if (!DreamNetRBACCore.checkPermission({
    userId,
    permission: "kill_switch:enable",
  })) {
    throw new Error("Permission denied: kill_switch:enable");
  }
  
  // Proceed with operation
  DreamNetControlCore.enableGlobalKillSwitch();
}
```

### Cluster-Scoped Permissions

```typescript
// Assign cluster-scoped operator role
DreamNetRBACCore.assignRole("operator-123", "operator", "api-cluster", "admin");

// Check cluster-scoped permission
const canUpdate = DreamNetRBACCore.checkPermission({
  userId: "operator-123",
  permission: "rate_limit:update",
  clusterId: "api-cluster", // ✅ Allowed
});

const canUpdateOther = DreamNetRBACCore.checkPermission({
  userId: "operator-123",
  permission: "rate_limit:update",
  clusterId: "other-cluster", // ❌ Denied (different cluster)
});
```

### Custom Role

```typescript
// Define custom role
DreamNetRBACCore.defineRole({
  id: "rate-limit-manager",
  name: "Rate Limit Manager",
  permissions: [
    "rate_limit:create",
    "rate_limit:update",
    "rate_limit:delete",
    "config:view",
  ],
  clusterScoped: true,
});

// Assign custom role
DreamNetRBACCore.assignRole("manager-123", "rate-limit-manager", "api-cluster");
```

---

## Best Practices

1. **Principle of Least Privilege**: Assign minimum permissions needed
2. **Cluster Scoping**: Use cluster-scoped roles for operators managing specific clusters
3. **Audit Trail**: Track who granted roles (`grantedBy` parameter)
4. **Regular Reviews**: Periodically review role assignments
5. **Custom Roles**: Create custom roles for specific use cases rather than using admin

---

## Security Considerations

- **Permission Checks**: Always check permissions before sensitive operations
- **Role Escalation**: Prevent users from granting themselves admin roles
- **Cluster Isolation**: Cluster-scoped roles prevent cross-cluster access
- **Audit Logging**: All role assignments should be logged (via Audit Core)

---

## Related Systems

- **DreamNet Control Core**: Uses RBAC for permission checks
- **DreamNet Audit Core**: Logs role assignments
- **DreamNet Snail Core**: Tracks role changes for provenance

---

**Status**: ✅ Complete  
**Next**: Continue with Scheduler Core documentation
