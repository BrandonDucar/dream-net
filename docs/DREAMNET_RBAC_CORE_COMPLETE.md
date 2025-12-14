# DreamNet RBAC Core - Complete Documentation

**Package**: `@dreamnet/dreamnet-rbac-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

DreamNet RBAC Core provides **Role-Based Access Control system** for managing roles and permissions. It enables defining custom roles, assigning roles to users, and checking permissions.

### Key Features

- **Role Definitions**: Define custom roles with permissions
- **Role Assignment**: Assign roles to users with cluster scope
- **Permission Checking**: Check if users have specific permissions
- **Cluster Scoping**: Roles can be scoped to specific clusters
- **Role Revocation**: Revoke roles from users

---

## API Reference

### Types

```typescript
export interface RoleDefinition {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface UserRole {
  userId: string;
  roleId: string;
  clusterId?: string;
  grantedBy: string;
  grantedAt: number;
}

export interface PermissionCheck {
  userId: string;
  resource: string;
  action: string;
  clusterId?: string;
}
```

### Main Export

#### `DreamNetRBACCore`

**Methods**:
- **`defineRole(role): void`**
- **`getRole(roleId): RoleDefinition | undefined`**
- **`getAllRoles(): RoleDefinition[]`**
- **`assignRole(userId, roleId, clusterId?, grantedBy?): void`**
- **`getUserRoles(userId): UserRole[]`**
- **`checkPermission(check): boolean`**
- **`revokeRole(userId, roleId, clusterId?): void`**

---

**Status**: ✅ Implemented

