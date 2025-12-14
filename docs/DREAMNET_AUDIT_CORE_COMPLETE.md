# DreamNet Audit Core - Complete Documentation

**Package**: `@dreamnet/dreamnet-audit-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

DreamNet Audit Core provides **complete audit trail system** for tracking all actions and events in DreamNet. It records actions with context and integrates with Dream Snail for automatic recording.

### Key Features

- **Action Recording**: Record all actions with context
- **Query System**: Query audit logs by various criteria
- **Statistics**: Get audit statistics
- **Export**: Export logs for compliance reports
- **Dream Snail Integration**: Auto-record in Dream Snail
- **Context Tracking**: Track userId, walletAddress, clusterId, resourceId, IP, userAgent, traceId

---

## API Reference

### Types

```typescript
export type AuditAction = 
  | "create" | "update" | "delete" | "read" 
  | "execute" | "deploy" | "approve" | "reject"
  | "login" | "logout" | "permission_granted" | "permission_revoked"
  | string;

export interface AuditLog {
  id: string;
  timestamp: number;
  action: AuditAction;
  details: Record<string, any>;
  userId?: string;
  walletAddress?: string;
  clusterId?: string;
  resourceId?: string;
  resourceType?: string;
  ipAddress?: string;
  userAgent?: string;
  traceId?: string;
  success: boolean;
  error?: string;
}
```

### Main Export

#### `DreamNetAuditCore`

**Methods**:
- **`recordAction(action, details, context?): AuditLog`**
- **`queryLogs(query): AuditLog[]`**
- **`getStats(): AuditStats`**
- **`exportLogs(query?): AuditLog[]`**

---

**Status**: ✅ Implemented

