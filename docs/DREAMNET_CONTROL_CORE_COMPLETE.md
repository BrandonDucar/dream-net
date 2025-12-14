# DreamNet Control Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

DreamNet Control Core provides **global kill-switch and per-cluster rate limiting** for DreamNet. It enables emergency shutdowns, cluster-level control, rate limiting, circuit breakers, and tier-based access control for operations.

---

## Key Features

### Kill-Switch System
- Global kill-switch
- Cluster-level kill-switches
- Reason tracking
- Disabled-by tracking

### Rate Limiting
- Per-cluster rate limits
- Requests per minute/hour/day
- Rate limit checking
- Request recording

### Circuit Breakers
- Automatic tripping
- Auto-reset support
- Trip count tracking
- Last trip tracking

### Tier-Based Access Control
- Tier definitions
- Feature gating
- Operation checking
- Tier validation

---

## Architecture

### Components

1. **Control Store** (`store/controlStore.ts`)
   - Kill-switch storage
   - Rate limit storage
   - Circuit breaker storage
   - State management

2. **Tier Config** (`tierConfig.ts`)
   - Tier definitions
   - Feature flags
   - Operation permissions

3. **Types** (`types.ts`)
   - Control types
   - Cluster types
   - Configuration types

---

## API Reference

### Kill-Switch Controls

#### `getKillSwitchState(): KillSwitchState`
Gets kill-switch state.

#### `enableGlobalKillSwitch(reason?: string, disabledBy?: string): void`
Enables global kill-switch.

**Example**:
```typescript
import { DreamNetControlCore } from '@dreamnet/dreamnet-control-core';

DreamNetControlCore.enableGlobalKillSwitch(
  'Emergency maintenance',
  'admin-123'
);
```

#### `disableGlobalKillSwitch(reason?: string): void`
Disables global kill-switch.

#### `isGlobalKillSwitchEnabled(): boolean`
Checks if global kill-switch is enabled.

#### `enableCluster(clusterId: ClusterId, reason?: string): void`
Enables a cluster.

#### `disableCluster(clusterId: ClusterId, reason?: string, disabledBy?: string): void`
Disables a cluster.

#### `isClusterEnabled(clusterId: ClusterId): boolean`
Checks if a cluster is enabled.

### Rate Limiting

#### `getRateLimit(clusterId: ClusterId): ClusterRateLimit | undefined`
Gets rate limit for a cluster.

#### `setRateLimit(limit: ClusterRateLimit): void`
Sets rate limit for a cluster.

**Example**:
```typescript
DreamNetControlCore.setRateLimit({
  clusterId: 'dream-state',
  requestsPerMinute: 100,
  requestsPerHour: 5000,
  requestsPerDay: 100000,
  enabled: true,
});
```

#### `checkRateLimit(clusterId: ClusterId): { allowed: boolean; reason?: string; remaining?: number }`
Checks if request is within rate limit.

**Example**:
```typescript
const check = DreamNetControlCore.checkRateLimit('dream-state');
if (!check.allowed) {
  console.log(`Rate limit exceeded: ${check.reason}`);
} else {
  console.log(`Remaining: ${check.remaining}`);
}
```

#### `recordRequest(clusterId: ClusterId): void`
Records a request for rate limiting.

### Circuit Breakers

#### `tripCircuitBreaker(clusterId: ClusterId, autoResetAfter?: number): void`
Trips a circuit breaker.

#### `resetCircuitBreaker(clusterId: ClusterId): void`
Resets a circuit breaker.

#### `isCircuitBreakerTripped(clusterId: ClusterId): boolean`
Checks if circuit breaker is tripped.

### Tier-Based Access Control

#### `checkOperation(context: ControlContext, callerTierId: TierId, callerTier: TierConfig): { allowed: boolean; reason?: string }`
Checks if operation is allowed for tier.

**Example**:
```typescript
import { getTierConfig } from '@dreamnet/dreamnet-control-core/tierConfig';

const tier = getTierConfig('free');
const check = DreamNetControlCore.checkOperation(
  {
    clusterId: 'dream-state',
    operation: 'create_dream',
  },
  'free',
  tier
);

if (!check.allowed) {
  console.log(`Operation not allowed: ${check.reason}`);
}
```

---

## Data Models

### ClusterId

```typescript
type ClusterId =
  | 'wolf-pack'
  | 'orca-pack'
  | 'whale-pack'
  | 'octopus-executor'
  | 'spider-web'
  | 'jaggy-core'
  | 'webhook-nervous'
  | 'shield-core'
  | 'api-keeper'
  | 'ai-seo'
  | 'dream-state'
  | 'star-bridge'
  | 'all';
```

### ClusterRateLimit

```typescript
interface ClusterRateLimit {
  clusterId: ClusterId;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  enabled: boolean;
}
```

### KillSwitchState

```typescript
interface KillSwitchState {
  globalKillSwitch: boolean;
  clusterStates: Record<ClusterId, {
    enabled: boolean;
    reason?: string;
    disabledAt?: number;
    disabledBy?: string;
  }>;
  lastUpdatedAt: number;
}
```

### ControlContext

```typescript
interface ControlContext {
  clusterId: ClusterId;
  operation: string;
  traceId?: string;
  idempotencyKey?: string;
  apiKeyId?: string;
  walletAddress?: string;
}
```

---

## Clusters

### Core Clusters
- **wolf-pack**: Anomaly detection
- **orca-pack**: Pack operations
- **whale-pack**: Pack operations
- **octopus-executor**: Task execution
- **spider-web**: Signal routing

### Infrastructure Clusters
- **jaggy-core**: Webhook hunting
- **webhook-nervous**: Webhook management
- **shield-core**: Security operations
- **api-keeper**: API management

### Application Clusters
- **ai-seo**: AI SEO operations
- **dream-state**: Dream state management
- **star-bridge**: Cross-chain operations

---

## Integration Points

### DreamNet Systems
- **Spider Web**: Kill-switch events
- **DreamNet Metrics Core**: Rate limit metrics
- **DreamNet Health Core**: Health-based control
- **DreamNet OS Core**: System control

### External Systems
- **Monitoring**: Control dashboards
- **Alerting**: Kill-switch alerts
- **Analytics**: Control analytics

---

## Usage Examples

### Enable Global Kill-Switch

```typescript
DreamNetControlCore.enableGlobalKillSwitch(
  'Emergency maintenance',
  'admin-123'
);
```

### Set Rate Limit

```typescript
DreamNetControlCore.setRateLimit({
  clusterId: 'dream-state',
  requestsPerMinute: 100,
  requestsPerHour: 5000,
  requestsPerDay: 100000,
  enabled: true,
});
```

### Check Rate Limit

```typescript
const check = DreamNetControlCore.checkRateLimit('dream-state');
if (check.allowed) {
  DreamNetControlCore.recordRequest('dream-state');
  // Process request
} else {
  // Reject request
}
```

### Trip Circuit Breaker

```typescript
DreamNetControlCore.tripCircuitBreaker('dream-state', 60000); // Auto-reset after 60s
```

---

## Best Practices

1. **Kill-Switch Management**
   - Use for emergencies
   - Document reasons
   - Track disabled-by
   - Monitor state

2. **Rate Limiting**
   - Set appropriate limits
   - Monitor usage
   - Adjust dynamically
   - Handle gracefully

3. **Circuit Breakers**
   - Trip on failures
   - Auto-reset when safe
   - Track trip counts
   - Monitor health

---

## Security Considerations

1. **Control Security**
   - Validate control actions
   - Protect control APIs
   - Audit control changes
   - Secure kill-switches

2. **Rate Limiting**
   - Prevent bypass
   - Validate limits
   - Monitor abuse
   - Protect endpoints

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27
