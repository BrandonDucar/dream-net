# 🎛️ Control Core Implementation - Complete

## Overview

The Control Core system has been successfully implemented with cluster-level access control, rate limiting, and feature flag enforcement. This integrates with the tier system and God Vault to provide comprehensive access control across DreamNet's biomimetic organs.

---

## Files Created

### 1. **`packages/dreamnet-control-core/clusters.ts`** ✅
**Location**: `packages/dreamnet-control-core/clusters.ts`

**Purpose**: Defines cluster configurations for all DreamNet organs

**Key Exports**:
- `ClusterId` type: `"WOLF_PACK" | "OCTOPUS" | "SPIDER_WEB" | ...`
- `ClusterConfig` interface: `{ id, label, description, enabled, defaultMaxRequestsPerMinute, requiredFeatureFlag }`
- `CLUSTERS` registry: Complete configuration for all clusters
- Helper functions: `getClusterConfig()`, `isClusterEnabled()`

**Clusters Defined**:
- `WOLF_PACK` - Offensive/executional agents (requires `canAccessWolfPack`)
- `OCTOPUS` - Multi-arm integration brain (requires `canAccessOctopus`)
- `SPIDER_WEB` - Nervous system (requires `canAccessWebhookNervousSystem`)
- `SHIELD_CORE` - Immune system (requires `canAccessShieldCore`)
- `WEBHOOK_NERVOUS_SYSTEM` - Biomimetic webhook management (requires `canAccessWebhookNervousSystem`)
- `JAGGY` - Silent sentinel (requires `canAccessDreamKeeper`)
- `ORCA_PACK` - Communications & narrative (requires `canAccessWolfPack`)
- `WHALE_PACK` - Commerce & product management (requires `canAccessWolfPack`)
- `API_KEEPER` - API management
- `AI_SEO` - AI SEO optimization
- `DREAM_STATE` - Government layer
- `STAR_BRIDGE` - Cross-chain breathwork

---

### 2. **`packages/dreamnet-control-core/rateLimiter.ts`** ✅
**Location**: `packages/dreamnet-control-core/rateLimiter.ts`

**Purpose**: In-memory rate limiting helper (placeholder for Redis)

**Key Exports**:
- `checkAndConsume(clusterId, tierId, limitPerMinute)` - Check and consume rate limit token
- `rateLimiter` - Singleton instance

**How It Works**:
- Uses sliding window per-minute limits
- Key format: `${clusterId}:${tierId}`
- Automatically cleans up old requests
- Returns `{ allowed: boolean, remaining: number }`

**TODO**: Replace with Redis-based rate limiting in production

---

### 3. **`packages/dreamnet-control-core/controlCoreMiddleware.ts`** ✅
**Location**: `packages/dreamnet-control-core/controlCoreMiddleware.ts`

**Purpose**: Express middleware that enforces cluster-level access control

**Key Exports**:
- `controlCoreMiddleware` - Main middleware function
- `withCluster(clusterId)` - Helper to attach cluster ID to routes
- `setGlobalKillSwitch(enabled)` - Control global kill-switch
- `isGlobalKillSwitchEnabled()` - Check kill-switch state

**Enforcement Logic**:

1. **Global Kill-Switch**:
   - If enabled, blocks all non-GodVault callers
   - Returns `503` with `GLOBAL_KILL_SWITCH_ACTIVE` error
   - God Vault can bypass (logged)

2. **Cluster Enable/Disable**:
   - Checks `clusterConfig.enabled`
   - If disabled and not GodVault → `503 CLUSTER_DISABLED`
   - God Vault can bypass

3. **Feature Flag Check**:
   - Checks `callerIdentity.tier.featureFlags[cluster.requiredFeatureFlag]`
   - If not enabled and not GodVault → `403 FEATURE_FLAG_DENIED`
   - Requires `callerIdentity` to be set (from `identityAndTierResolver`)

4. **Rate Limiting**:
   - Effective limit = `Math.min(tierLimit, clusterLimit)`
   - Calls `checkAndConsume(clusterId, tierId, effectiveLimit)`
   - If exceeded and not GodVault → `429 RATE_LIMITED`
   - God Vault: Logs but doesn't block

5. **Success**:
   - Adds headers: `X-Control-Core-Status`, `X-Cluster-ID`, `X-Caller-Tier-Id`
   - If GodVault: Adds `X-Caller-Is-God-Vault: true`
   - Calls `next()`

---

## Integration

### Middleware Order

In `server/index.ts`, the middleware chain is:

```typescript
app.use(traceIdMiddleware);           // 1. Trace ID
app.use(idempotencyMiddleware);       // 2. Idempotency
app.use(tierResolverMiddleware);      // 3. Tier resolution (includes God Vault)
app.use(controlCoreMiddleware);       // 4. Control Core (cluster enforcement)
```

### Attaching Routes to Clusters

**Option 1: Router-level (recommended)**
```typescript
import { withCluster } from "@dreamnet/dreamnet-control-core/controlCoreMiddleware";

export function createWolfPackRouter(): Router {
  const router = Router();
  
  // Attach cluster to all routes in this router
  router.use(withCluster("WOLF_PACK"));
  
  router.get("/wolf-pack/opportunities", handler);
  // All routes now have clusterId = "WOLF_PACK"
}
```

**Option 2: Route-level**
```typescript
import { withCluster } from "@dreamnet/dreamnet-control-core/controlCoreMiddleware";

app.post("/api/wolf-pack/run-job",
  withCluster("WOLF_PACK"),
  controlCoreMiddleware,  // Already applied globally, but can be explicit
  handler
);
```

**Option 3: Manual**
```typescript
router.post("/api/wolf-pack/run-job", (req, res, next) => {
  (req as any).clusterId = "WOLF_PACK";
  next();
}, handler);
```

---

## Example: Wolf Pack Router

The Wolf Pack router has been updated as an example:

```typescript
// server/routes/wolf-pack.ts
import { withCluster } from "@dreamnet/dreamnet-control-core/controlCoreMiddleware";

export function createWolfPackRouter(): Router {
  const router = Router();
  
  // Attach WOLF_PACK cluster to all routes
  router.use(withCluster("WOLF_PACK"));
  
  // Now all routes are protected by Control Core:
  // - Must have canAccessWolfPack feature flag (or be GodVault)
  // - Rate limited: min(tierLimit, clusterLimit)
  // - Cluster can be disabled per-cluster
  
  router.get("/wolf-pack/opportunities", handler);
  router.post("/wolf-pack/discover", handler);
  // ...
}
```

---

## How Control Core Decides Allow/Deny/Throttle

### Decision Flow

```
Request arrives
    ↓
Has clusterId? → No → Allow (unclustered route)
    ↓ Yes
Global kill-switch ON? → Yes → Is GodVault? → No → DENY (503)
    ↓ Yes → Yes → Allow (bypass)
    ↓ No
Cluster exists? → No → DENY (500)
    ↓ Yes
Cluster enabled? → No → Is GodVault? → No → DENY (503)
    ↓ Yes → Yes → Allow (bypass)
    ↓ Yes
Has requiredFeatureFlag? → Yes → Has feature? → No → Is GodVault? → No → DENY (403)
    ↓ Yes → Yes → Yes → Allow (bypass)
    ↓ No
Is GodVault? → Yes → Allow (bypass, log stats)
    ↓ No
Rate limit check:
  effectiveLimit = min(tierLimit, clusterLimit)
  checkAndConsume(clusterId, tierId, effectiveLimit)
    ↓
Allowed? → No → DENY (429)
    ↓ Yes
ALLOW → Add headers → next()
```

### Response Codes

- **503 GLOBAL_KILL_SWITCH_ACTIVE** - Global kill-switch enabled
- **503 CLUSTER_DISABLED** - Cluster is disabled
- **403 FEATURE_FLAG_DENIED** - Tier doesn't have required feature flag
- **429 RATE_LIMITED** - Rate limit exceeded
- **500 UNKNOWN_CLUSTER** - Cluster not found in config
- **401 IDENTITY_REQUIRED** - No caller identity (shouldn't happen if tierResolverMiddleware runs first)

---

## How to Put a New Route Under a Cluster

### Step 1: Define Cluster (if new)

Add to `packages/dreamnet-control-core/clusters.ts`:

```typescript
export const CLUSTERS: Record<ClusterId, ClusterConfig> = {
  // ... existing clusters
  NEW_CLUSTER: {
    id: "NEW_CLUSTER",
    label: "New Cluster",
    description: "Description of what this cluster does",
    enabled: true,
    defaultMaxRequestsPerMinute: 60,
    defaultMaxRequestsPerHour: 1000,
    requiredFeatureFlag: "canAccessNewCluster", // Must match tier feature flag
  },
};
```

### Step 2: Add Feature Flag to Tiers

Update `packages/dreamnet-control-core/tierConfig.ts`:

```typescript
export const TIERS: Record<TierId, TierConfig> = {
  BUILDER: {
    // ...
    featureFlags: {
      // ...
      canAccessNewCluster: true, // Enable for BUILDER tier
    },
  },
  // ...
};
```

### Step 3: Attach Cluster to Route

```typescript
import { withCluster } from "@dreamnet/dreamnet-control-core/controlCoreMiddleware";

router.post("/api/new-cluster/action",
  withCluster("NEW_CLUSTER"),
  handler
);
```

### Step 4: Test

```bash
# Test with SEED tier (should fail feature flag check)
curl -H "x-dreamnet-api-key: seed-key" \
     http://localhost:3000/api/new-cluster/action

# Test with BUILDER tier (should succeed)
curl -H "x-dreamnet-api-key: builder-key" \
     http://localhost:3000/api/new-cluster/action

# Test with God Vault (should bypass all checks)
curl -H "x-dreamnet-api-key: $DN_INTERNAL_GOD_API_KEY" \
     http://localhost:3000/api/new-cluster/action
```

---

## Configuration

### Global Kill-Switch

```typescript
import { setGlobalKillSwitch } from "@dreamnet/dreamnet-control-core/controlCoreMiddleware";

// Enable kill-switch
setGlobalKillSwitch(true);

// Disable kill-switch
setGlobalKillSwitch(false);
```

### Cluster Enable/Disable

Edit `packages/dreamnet-control-core/clusters.ts`:

```typescript
export const CLUSTERS: Record<ClusterId, ClusterConfig> = {
  WOLF_PACK: {
    // ...
    enabled: false, // Disable cluster
  },
};
```

Or programmatically (TODO: Add API endpoint):

```typescript
// Future: Add to controlCoreMiddleware.ts
export function setClusterEnabled(clusterId: ClusterId, enabled: boolean): void {
  CLUSTERS[clusterId].enabled = enabled;
}
```

---

## Rate Limiting Details

### Effective Limit Calculation

```
tierLimit = callerIdentity.tier.maxRequestsPerMinute
clusterLimit = clusterConfig.defaultMaxRequestsPerMinute
effectiveLimit = Math.min(tierLimit, clusterLimit)
```

**Example**:
- BUILDER tier: 60/min
- WOLF_PACK cluster: 60/min
- Effective: 60/min

- OPERATOR tier: 200/min
- WOLF_PACK cluster: 60/min
- Effective: 60/min (cluster limit is stricter)

- GOD_MODE tier: 1000/min
- WOLF_PACK cluster: 60/min
- Effective: 60/min (but GodVault bypasses enforcement)

### Rate Limit Key Format

```
"${clusterId}:${tierId}"
```

Examples:
- `"WOLF_PACK:BUILDER"`
- `"OCTOPUS:OPERATOR"`
- `"SHIELD_CORE:GOD_MODE"`

---

## God Vault Behavior

God Vault (`callerIdentity.isGodVault === true`) can:

1. ✅ **Bypass global kill-switch** (logged as warning)
2. ✅ **Bypass cluster disable** (logged)
3. ✅ **Bypass feature flag checks** (all features enabled)
4. ✅ **Bypass rate limits** (stats logged but not enforced)

**Logging**: All God Vault actions are logged with `⚠️` prefix for audit trail.

---

## Debugging

### Enable Debug Headers

Set environment variable:
```bash
export DEBUG_TIER=true
export DEBUG_RATE_LIMIT=true
```

Response headers will include:
- `X-Control-Core-Status: allowed`
- `X-Cluster-ID: WOLF_PACK`
- `X-Caller-Tier-Id: BUILDER`
- `X-Caller-Is-God-Vault: true` (if applicable)
- `X-Caller-Source: apiKey` (or `wallet`, `unknown`)

### Check Logs

```
✅ [ControlCore] allowed - Trace: abc123, Cluster: WOLF_PACK, Tier: BUILDER
🚫 [ControlCore] Rate limited - Trace: abc123, Cluster: WOLF_PACK, Tier: SEED, Limit: 10/min
⚠️ [ControlCore] God Vault bypassing global kill-switch - Trace: abc123
```

---

## Summary

### Where ClusterConfig and CLUSTERS Live
- **File**: `packages/dreamnet-control-core/clusters.ts`
- **Exports**: `ClusterId`, `ClusterConfig`, `CLUSTERS`, helper functions

### How controlCoreMiddleware Decides Allow/Deny/Throttle
1. Checks global kill-switch (blocks non-GodVault)
2. Checks cluster exists and is enabled (blocks if disabled and not GodVault)
3. Checks feature flag (blocks if missing and not GodVault)
4. Checks rate limit (blocks if exceeded and not GodVault)
5. Allows request if all checks pass

### How to Put a New Route Under a Cluster
1. Define cluster in `clusters.ts` (if new)
2. Add feature flag to tier configs
3. Use `withCluster("CLUSTER_ID")` helper on route/router
4. Control Core middleware automatically enforces access

---

## Status

✅ **Control Core implemented and integrated**
✅ **Cluster configurations defined**
✅ **Rate limiter working (in-memory)**
✅ **Middleware enforcing access control**
✅ **Wolf Pack router updated as example**
✅ **God Vault bypass working**
✅ **Backward compatible (unclustered routes pass through)**

🎛️ **Control Core is operational!**

---

## Next Steps

1. **Migrate More Routes**: Update other organ routes to use `withCluster()`
2. **Add Redis Rate Limiting**: Replace in-memory limiter with Redis
3. **Add Cluster Management API**: Endpoints to enable/disable clusters
4. **Add Rate Limit Dashboard**: Visualize rate limit usage per cluster/tier
5. **Map Wallet/Stripe → TierId**: Integrate wallet balances and Stripe subscriptions
6. **Node Glow Tiers**: Frontend visualization of tier-based node glow

---

*Control Core is now the gatekeeper for all DreamNet organs.* 🎛️

