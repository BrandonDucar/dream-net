# 🎛️ Event Fabric & Policy Engine - Complete Implementation

## Overview

The Event Fabric and Policy Engine have been successfully integrated into the Control Core middleware, providing observability and extensible policy evaluation without changing the core shape.

---

## Files Created

### 1. **`packages/dreamnet-control-core/eventFabric.ts`** ✅
**Purpose**: Event bus for Control Core events

**Key Features**:
- Captures: `traceId`, `callerIdentity`, `clusterId`, `routeId`, `decision`
- Emits typed events to in-memory bus
- Logs all events with appropriate log levels
- Maintains event history (last 1000 events)
- Provides filtering: `getEventsByDecision()`, `getEventsByCluster()`
- Subscribable: `onControlCoreEvent(listener)` returns unsubscribe function

**Event Types**:
- `allowed` - Request allowed
- `allowed_god_vault` - God Vault bypass
- `denied_global_kill_switch` - Global kill-switch active
- `denied_cluster_disabled` - Cluster disabled
- `denied_feature_flag` - Feature flag missing
- `denied_rate_limited` - Rate limit exceeded
- `denied_unknown_cluster` - Cluster not found
- `denied_identity_required` - No caller identity
- `bypassed_no_cluster` - Unclustered route

**Usage**:
```typescript
import { onControlCoreEvent } from "@dreamnet/dreamnet-control-core/eventFabric";

const unsubscribe = onControlCoreEvent((event) => {
  if (event.decision === "denied_rate_limited") {
    // Handle rate limit denial
    console.log(`Rate limited: ${event.clusterId} by ${event.callerIdentity?.tierId}`);
  }
});

// Later: unsubscribe();
```

---

### 2. **`packages/dreamnet-control-core/policyEngine.ts`** ✅
**Purpose**: Extensible policy evaluation engine

**Key Features**:
- `evaluate(context)` returns `{ allowed, reason?, extraFlags? }`
- Called inside `controlCoreMiddleware` before final allow/deny
- Can override base Control Core decisions
- Returns `extraFlags` for downstream processing:
  - `riskScore` (0-100)
  - `estimatedCost` (USD)
  - `integrationHealth` ("healthy" | "degraded" | "down")
  - `requiresAudit` (boolean)
  - Custom flags

**Current Implementation** (Stub):
- Basic risk scoring based on tier, cluster, route
- Basic cost estimation
- Always returns "healthy" for integration health
- Requires audit for high-risk or OPERATOR/GOD_MODE tiers

**Extensible Points**:
- `calculateRiskScore()` - Add real risk scoring
- `estimateCost()` - Add real cost estimation
- `checkIntegrationHealth()` - Add real health checks
- Can add: time-based policies, geographic restrictions, custom business rules

**Usage**:
```typescript
import { evaluatePolicy } from "@dreamnet/dreamnet-control-core/policyEngine";

const result = evaluatePolicy({
  traceId: "abc123",
  callerIdentity: identity,
  clusterId: "WOLF_PACK",
  routeId: "POST /api/wolf-pack/run-job",
  baseDecision: "allow",
  context: { tierId: "BUILDER" },
});

if (!result.allowed) {
  // Policy denied
}

if (result.extraFlags?.requiresAudit) {
  // Log to audit system
}
```

---

### 3. **`packages/dreamnet-control-core/controlCoreMiddleware.ts`** ✅ UPDATED
**Integration**: Now emits events and calls policy engine

**Flow**:
1. Base checks (kill-switch, cluster, feature flag, rate limit)
2. Track `baseDecision` and `baseReason`
3. Build `PolicyContext` with all context
4. Call `evaluatePolicy(context)`
5. If policy denies → emit event → return 403
6. If policy allows → emit event with `extraFlags` → add headers → `next()`

**Event Emission**:
- Every decision point emits an event
- Events include full context (traceId, callerIdentity, clusterId, routeId, decision)
- Policy flags included in event metadata
- Events logged with appropriate log levels

**Policy Integration**:
- Policy engine called after base checks pass
- Policy can override base decision
- Policy flags added to response headers:
  - `X-Policy-Risk-Score`
  - `X-Policy-Estimated-Cost`
  - `X-Policy-Requires-Audit`

---

## How It Works

### Event Flow

```
Request arrives
    ↓
Control Core checks (kill-switch, cluster, feature flag, rate limit)
    ↓
Emit event with base decision
    ↓
Policy engine evaluates context
    ↓
If policy denies → Emit denial event → Return 403
    ↓
If policy allows → Emit success event with extraFlags → Add headers → next()
```

### Policy Evaluation Flow

```
PolicyContext created with:
  - traceId
  - callerIdentity (tier, source, isGodVault)
  - clusterId
  - routeId (method + path)
  - baseDecision ("allow" | "deny")
  - baseReason (if denied)
  - context (tierId, effectiveRateLimit, etc.)
    ↓
evaluatePolicy(context)
    ↓
Calculate risk score (stub)
    ↓
Estimate cost (stub)
    ↓
Check integration health (stub)
    ↓
Return { allowed, reason?, extraFlags }
```

---

## Integration Points

### Event Listeners

You can subscribe to events for:
- **Analytics**: Track allow/deny rates per cluster/tier
- **Alerting**: Alert on high-risk operations
- **Auditing**: Log all operations requiring audit
- **Cost Tracking**: Track estimated costs per operation
- **Dashboards**: Real-time Control Core metrics

**Example**:
```typescript
import { onControlCoreEvent } from "@dreamnet/dreamnet-control-core/eventFabric";

// Track rate limit denials
onControlCoreEvent((event) => {
  if (event.decision === "denied_rate_limited") {
    // Send to analytics
    analytics.track("rate_limit_exceeded", {
      clusterId: event.clusterId,
      tierId: event.metadata?.tierId,
      traceId: event.traceId,
    });
  }
});

// Audit high-risk operations
onControlCoreEvent((event) => {
  if (event.metadata?.requiresAudit) {
    auditLog.record({
      traceId: event.traceId,
      clusterId: event.clusterId,
      tierId: event.metadata?.tierId,
      riskScore: event.metadata?.riskScore,
      estimatedCost: event.metadata?.estimatedCost,
    });
  }
});
```

### Policy Extensions

You can extend the policy engine with:

**Risk Scoring**:
```typescript
// In policyEngine.ts
private calculateRiskScore(tierId, clusterId, routeId): number {
  // Add real risk scoring:
  // - Historical patterns
  // - Time of day
  // - Geographic location
  // - Recent failures
  // - User behavior patterns
}
```

**Cost Budgets**:
```typescript
// In policyEngine.ts
private checkCostBudget(tierId, estimatedCost): boolean {
  // Check if tier has budget remaining
  // Check daily/monthly cost limits
  // Return false if budget exceeded
}
```

**Integration Health**:
```typescript
// In policyEngine.ts
private checkIntegrationHealth(clusterId): "healthy" | "degraded" | "down" {
  // Check cluster status
  // Check dependent services
  // Check recent error rates
  // Check circuit breaker status
}
```

---

## Example: Extending Policy Engine

### Add Cost Budget Check

```typescript
// In policyEngine.ts evaluate() method
const estimatedCost = this.estimateCost(clusterId, context.routeId);

// Check cost budget
const tierId = context.callerIdentity?.tierId || "SEED";
const budgetRemaining = this.getBudgetRemaining(tierId);

if (estimatedCost > budgetRemaining) {
  return {
    allowed: false,
    reason: `Cost budget exceeded. Estimated: $${estimatedCost}, Remaining: $${budgetRemaining}`,
    extraFlags: {
      riskScore: 0,
      estimatedCost,
      requiresAudit: true,
    },
  };
}
```

### Add Risk-Based Denial

```typescript
// In policyEngine.ts evaluate() method
const riskScore = this.calculateRiskScore(tierId, clusterId, context.routeId);

// Deny if risk too high (unless God Vault)
if (riskScore > 80 && !context.callerIdentity?.isGodVault) {
  return {
    allowed: false,
    reason: `Risk score too high: ${riskScore}/100`,
    extraFlags: {
      riskScore,
      requiresAudit: true,
    },
  };
}
```

### Add Integration Health Check

```typescript
// In policyEngine.ts evaluate() method
const integrationHealth = this.checkIntegrationHealth(clusterId);

// Deny if integration down (unless God Vault)
if (integrationHealth === "down" && !context.callerIdentity?.isGodVault) {
  return {
    allowed: false,
    reason: `Integration health check failed: ${clusterId} is down`,
    extraFlags: {
      integrationHealth: "down",
      requiresAudit: true,
    },
  };
}
```

---

## Response Headers

When policy engine adds `extraFlags`, they're included in response headers:

```
X-Control-Core-Status: allowed
X-Cluster-ID: WOLF_PACK
X-Caller-Tier-Id: BUILDER
X-Policy-Risk-Score: 15
X-Policy-Estimated-Cost: 0.001
X-Policy-Requires-Audit: true
```

---

## Event History

Events are stored in memory (last 1000 events):

```typescript
import { eventFabric } from "@dreamnet/dreamnet-control-core/eventFabric";

// Get recent events
const recent = eventFabric.getHistory(100);

// Get rate limit denials
const rateLimitDenials = eventFabric.getEventsByDecision("denied_rate_limited", 50);

// Get events for specific cluster
const wolfPackEvents = eventFabric.getEventsByCluster("WOLF_PACK", 100);
```

---

## Testing

### Test Event Emission

```typescript
import { onControlCoreEvent, eventFabric } from "@dreamnet/dreamnet-control-core/eventFabric";

const events: ControlCoreEvent[] = [];

const unsubscribe = onControlCoreEvent((event) => {
  events.push(event);
});

// Make request
// ... request code ...

// Check events
console.log(events); // Array of emitted events

unsubscribe();
```

### Test Policy Engine

```typescript
import { evaluatePolicy } from "@dreamnet/dreamnet-control-core/policyEngine";

const result = evaluatePolicy({
  traceId: "test-123",
  callerIdentity: {
    source: "apiKey",
    tierId: "BUILDER",
    tier: TIERS.BUILDER,
    isGodVault: false,
  },
  clusterId: "WOLF_PACK",
  routeId: "POST /api/wolf-pack/run-job",
  baseDecision: "allow",
});

console.log(result);
// {
//   allowed: true,
//   extraFlags: {
//     riskScore: 15,
//     estimatedCost: 0.001,
//     integrationHealth: "healthy",
//     requiresAudit: false,
//   }
// }
```

---

## Summary

### Event Fabric
- **Location**: `packages/dreamnet-control-core/eventFabric.ts`
- **Purpose**: Observability - captures all Control Core decisions
- **Features**: In-memory bus, event history, filtering, subscriptions
- **TODO**: Replace with Redis pub/sub or Kafka in production

### Policy Engine
- **Location**: `packages/dreamnet-control-core/policyEngine.ts`
- **Purpose**: Extensible policy evaluation
- **Features**: Risk scoring (stub), cost estimation (stub), health checks (stub)
- **Extensible**: Add risk scoring, cost budgets, integration health, custom rules

### Integration
- **Location**: `packages/dreamnet-control-core/controlCoreMiddleware.ts`
- **Flow**: Base checks → Policy evaluation → Event emission → Allow/Deny
- **Headers**: Policy flags added to response headers
- **Events**: All decisions emitted with full context

---

## Next Steps

1. **Add Real Risk Scoring**:
   - Historical patterns
   - Time-based risk
   - Geographic risk
   - User behavior patterns

2. **Add Cost Budgets**:
   - Per-tier budgets
   - Daily/monthly limits
   - Budget tracking

3. **Add Integration Health**:
   - Cluster status checks
   - Dependent service checks
   - Circuit breaker integration

4. **Replace Event Bus**:
   - Redis pub/sub
   - Kafka
   - Event streaming service

5. **Add Policy Dashboard**:
   - Visualize risk scores
   - Track cost estimates
   - Monitor integration health

---

## Status

✅ **Event Fabric implemented and integrated**
✅ **Policy Engine implemented and integrated**
✅ **Control Core middleware updated**
✅ **Events emitted at all decision points**
✅ **Policy evaluation before final allow/deny**
✅ **Policy flags in response headers**
✅ **Extensible architecture ready for enhancements**

🎛️ **Event Fabric & Policy Engine operational!**

---

*The Control Core now has full observability and extensible policy evaluation.* 🎛️

