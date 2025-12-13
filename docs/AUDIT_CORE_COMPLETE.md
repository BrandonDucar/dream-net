# DreamNet Audit Core - Complete Documentation

**Package**: `@dreamnet/dreamnet-audit-core`  
**Status**: ✅ Complete  
**Last Updated**: 2025-01-27

---

## Overview

DreamNet Audit Core provides a **complete audit trail system** for DreamNet operations. It records all actions (kill-switch, rate limits, circuit breakers, config changes) with full context (user, cluster, IP, trace ID) and integrates with Dream Snail for provenance tracking.

### Key Features

- **Comprehensive Logging**: Records all system actions with full context
- **Query Interface**: Query logs by user, action, cluster, time range
- **Statistics**: Aggregate statistics by action type, cluster, user
- **Export**: Export logs for compliance reports
- **Dream Snail Integration**: Auto-records events to Dream Snail for provenance

---

## Architecture

### How It Works

```
Action Performed → Record Action → Store Log → Dream Snail Integration → Query/Export
```

1. **Action Performed**: System performs action (kill-switch, rate limit, etc.)
2. **Record Action**: `recordAction()` called with action type and details
3. **Store Log**: Log stored in `auditStore` with full context
4. **Dream Snail Integration**: Event auto-recorded to Dream Snail for provenance
5. **Query/Export**: Logs can be queried or exported for compliance

### Why This Design

- **Complete Trail**: Records all actions with full context
- **Compliance Ready**: Exportable logs for compliance reports
- **Provenance**: Integration with Dream Snail for verifiable provenance
- **Queryable**: Fast queries by user, action, cluster, time
- **Statistics**: Aggregate statistics for analysis

---

## API Reference

### Types

```typescript
export type AuditAction =
  | "kill_switch_enabled"
  | "kill_switch_disabled"
  | "rate_limit_changed"
  | "rate_limit_added"
  | "rate_limit_removed"
  | "circuit_breaker_tripped"
  | "circuit_breaker_reset"
  | "cluster_enabled"
  | "cluster_disabled"
  | "billable_action_charged"
  | "billable_action_failed"
  | "health_check_failed"
  | "alert_sent"
  | "config_changed"
  | "user_action";

export interface AuditLog {
  id: string;
  timestamp: number;
  userId?: string;
  walletAddress?: string;
  action: AuditAction;
  clusterId?: string;
  resourceId?: string;
  resourceType?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  traceId?: string;
  success: boolean;
  error?: string;
}

export interface AuditQuery {
  userId?: string;
  walletAddress?: string;
  action?: AuditAction;
  clusterId?: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
  offset?: number;
}

export interface AuditStats {
  totalLogs: number;
  actionsByType: Record<AuditAction, number>;
  actionsByCluster: Record<string, number>;
  actionsByUser: Record<string, number>;
  recentActivity: AuditLog[];
}
```

### Functions

#### `recordAction(action: AuditAction, details: Record<string, any>, context?: {...}): AuditLog`

Record an audit log entry.

**Example**:
```typescript
import { DreamNetAuditCore } from "@dreamnet/dreamnet-audit-core";

DreamNetAuditCore.recordAction(
  "kill_switch_enabled",
  {
    reason: "Emergency maintenance",
    enabledBy: "admin-123",
  },
  {
    userId: "admin-123",
    clusterId: "api",
    ipAddress: "192.168.1.1",
    userAgent: "DreamNet CLI/1.0",
    traceId: "trace-abc123",
    success: true,
  }
);
```

#### `queryLogs(query: AuditQuery): AuditLog[]`

Query audit logs.

**Example**:
```typescript
// Query by user
const userLogs = DreamNetAuditCore.queryLogs({
  userId: "admin-123",
  limit: 100,
});

// Query by action
const killSwitchLogs = DreamNetAuditCore.queryLogs({
  action: "kill_switch_enabled",
  startTime: Date.now() - 86400000, // Last 24 hours
});

// Query by cluster
const clusterLogs = DreamNetAuditCore.queryLogs({
  clusterId: "api",
  limit: 50,
});
```

#### `getStats(): AuditStats`

Get audit statistics.

**Example**:
```typescript
const stats = DreamNetAuditCore.getStats();
console.log(`Total logs: ${stats.totalLogs}`);
console.log(`Kill-switch actions: ${stats.actionsByType["kill_switch_enabled"]}`);
```

#### `exportLogs(query?: AuditQuery): AuditLog[]`

Export audit logs (for compliance reports).

**Example**:
```typescript
// Export all logs
const allLogs = DreamNetAuditCore.exportLogs();

// Export logs for specific time range
const complianceLogs = DreamNetAuditCore.exportLogs({
  startTime: new Date("2025-01-01").getTime(),
  endTime: new Date("2025-01-31").getTime(),
});
```

---

## Integration Points

### Consumes

- **Action Context**: User ID, wallet address, IP, trace ID from request context

### Produces

- **Audit Logs**: Stored in `auditStore`
- **Dream Snail Events**: Auto-recorded to Dream Snail for provenance

### Integration Pattern

```typescript
// Record action after operation
try {
  DreamNetControlCore.enableGlobalKillSwitch();
  
  DreamNetAuditCore.recordAction(
    "kill_switch_enabled",
    { reason: "Maintenance" },
    {
      userId: req.user.id,
      ipAddress: req.ip,
      traceId: req.traceId,
      success: true,
    }
  );
} catch (error) {
  DreamNetAuditCore.recordAction(
    "kill_switch_enabled",
    { error: error.message },
    {
      userId: req.user.id,
      success: false,
      error: error.message,
    }
  );
}
```

---

## Usage Examples

### Record Action

```typescript
import { DreamNetAuditCore } from "@dreamnet/dreamnet-audit-core";

// Record kill-switch enable
DreamNetAuditCore.recordAction(
  "kill_switch_enabled",
  {
    reason: "Emergency maintenance",
    maintenanceWindow: "2025-01-27T10:00:00Z",
  },
  {
    userId: "admin-123",
    clusterId: "api",
    ipAddress: "192.168.1.1",
    traceId: "trace-abc123",
    success: true,
  }
);
```

### Query Logs

```typescript
// Query recent actions by user
const recentActions = DreamNetAuditCore.queryLogs({
  userId: "admin-123",
  limit: 50,
});

// Query failed actions
const failedActions = DreamNetAuditCore.queryLogs({
  startTime: Date.now() - 86400000, // Last 24 hours
}).filter(log => !log.success);

// Query by cluster
const clusterActions = DreamNetAuditCore.queryLogs({
  clusterId: "api",
  limit: 100,
});
```

### Get Statistics

```typescript
const stats = DreamNetAuditCore.getStats();

console.log(`Total audit logs: ${stats.totalLogs}`);
console.log(`Kill-switch actions: ${stats.actionsByType["kill_switch_enabled"]}`);
console.log(`Actions by cluster:`, stats.actionsByCluster);
console.log(`Actions by user:`, stats.actionsByUser);
```

### Export for Compliance

```typescript
// Export logs for compliance report
const complianceLogs = DreamNetAuditCore.exportLogs({
  startTime: new Date("2025-01-01").getTime(),
  endTime: new Date("2025-01-31").getTime(),
});

// Convert to CSV or JSON for compliance
const csv = complianceLogs.map(log => 
  `${log.timestamp},${log.action},${log.userId},${log.success}`
).join('\n');
```

---

## Best Practices

1. **Always Record**: Record all actions, including failures
2. **Full Context**: Include user ID, IP, trace ID, cluster ID when available
3. **Error Details**: Include error messages in `details` for failed actions
4. **Regular Queries**: Query logs regularly to detect anomalies
5. **Compliance Export**: Export logs periodically for compliance reports

---

## Security Considerations

- **Immutable Logs**: Logs should be immutable (append-only)
- **Access Control**: Restrict access to audit logs (RBAC)
- **PII Handling**: Be careful with PII in audit logs
- **Retention**: Define retention policies for compliance
- **Encryption**: Encrypt audit logs at rest

---

## Related Systems

- **Dream Snail Core**: Receives auto-recorded events for provenance
- **DreamNet RBAC Core**: Controls access to audit logs
- **DreamNet Control Core**: Records actions for kill-switch, rate limits
- **DreamNet Scheduler Core**: Records scheduled task executions

---

**Status**: ✅ Complete  
**Phase 1 Progress**: 5/10 packages documented
