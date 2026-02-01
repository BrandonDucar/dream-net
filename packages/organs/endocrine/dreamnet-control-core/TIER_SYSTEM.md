# DreamNet Access Tier System

Strongly-typed access tier system integrated into the control core for rate limiting and feature flag enforcement.

## Overview

The tier system provides four access levels:
- **SEED**: Lowest limits, minimal features
- **BUILDER**: Mid limits, most features
- **OPERATOR**: High limits, all features
- **GOD_MODE**: Internal-only, max limits, clearly marked dangerous

## Where Tier Config Lives

**Location**: `packages/dreamnet-control-core/tierConfig.ts`

The tier configuration is exported as `TIERS: Record<TierId, TierConfig>`:

```typescript
import { TIERS, TierId, TierConfig } from "@dreamnet/dreamnet-control-core/tierConfig";

// Access tier config
const seedTier = TIERS.SEED;
const builderTier = TIERS.BUILDER;
```

## How a Request Gets Its Tier

**Request Flow**: `Trace → Idempotency → Tier Resolver → Control Core → Route Handler`

1. **Tier Resolver Middleware** (`server/middleware/tierResolver.ts`) reads the `x-dreamnet-api-key` header
2. Maps API key to `TierId` using in-memory map (or defaults to SEED)
3. Attaches `callerTierId` and `callerTier` to request context
4. Logs `traceId + tierId` for observability

**Example**:
```typescript
// Request with API key header
curl -H "x-dreamnet-api-key: dn_live_abc123..." \
     -H "X-Trace-Id: trace-123" \
     http://localhost:5000/api/wolf-pack/status

// Tier resolver logs:
// [TierResolver] Trace: trace-123, Tier: BUILDER, API-Key: present
```

## How Control Core Uses Tier

The control core uses tier information for:

### 1. Rate Limiting

**Effective Limit = min(cluster limit, tier limit)**

```typescript
// Example:
// - Cluster limit: 60 req/min
// - Tier limit (BUILDER): 60 req/min
// - Effective limit: min(60, 60) = 60 req/min

// If tier limit is lower:
// - Cluster limit: 60 req/min
// - Tier limit (SEED): 10 req/min
// - Effective limit: min(60, 10) = 10 req/min
```

### 2. Feature Flag Enforcement

Each cluster maps to a feature flag. If the tier doesn't have the flag enabled, access is denied with a 403 response:

```json
{
  "ok": false,
  "error": "feature_not_available",
  "message": "Feature flag 'canAccessWolfPack' is not enabled for tier SEED",
  "callerTierId": "SEED",
  "requiredFlag": "canAccessWolfPack",
  "traceId": "trace-123"
}
```

**Cluster → Feature Flag Mapping**:
- `wolf-pack` → `canAccessWolfPack`
- `octopus-executor` → `canAccessOctopus`
- `shield-core` → `canAccessShield`
- `webhook-nervous` → `canAccessWebhookNervous`
- `jaggy-core` → `canAccessDreamKeeper`
- `dream-state` → `canAccessDreamKeeper`
- `star-bridge` → `canAccessOctopus`
- `all` → `canManageClusters`

## Adding a New Tier

1. **Add TierId to type**:
```typescript
// packages/dreamnet-control-core/tierConfig.ts
export type TierId = "SEED" | "BUILDER" | "OPERATOR" | "GOD_MODE" | "NEW_TIER";
```

2. **Add tier config to TIERS**:
```typescript
export const TIERS: Record<TierId, TierConfig> = {
  // ... existing tiers
  NEW_TIER: {
    id: "NEW_TIER",
    label: "New Tier",
    maxRequestsPerMinute: 100,
    maxRequestsPerHour: 5000,
    maxConcurrentRequests: 20,
    featureFlags: {
      canAccessWolfPack: true,
      canAccessOctopus: false,
      // ... other flags
    },
  },
};
```

3. **Update tier resolver** (if needed):
The tier resolver automatically handles new tiers - no changes needed.

## Mapping API Keys → Tiers

**Current Implementation**: In-memory map (TODO: Move to database)

```typescript
import { mapApiKeyToTier } from "./middleware/tierResolver";

// Map an API key to a tier
mapApiKeyToTier("dn_live_abc123...", "BUILDER");
mapApiKeyToTier("dn_live_xyz789...", "OPERATOR");
```

**Future**: Store in database
- Add `tier_id` column to `dreamnet_api_keys` table
- Query on API key validation
- Support Stripe customer → tier mapping

## Checking Feature Flags

### From Route Handlers

```typescript
import { requireFeature } from "./middleware/tierResolver";

router.post("/api/wolf-pack/execute", requireFeature("canAccessWolfPack"), async (req, res) => {
  // Only tiers with canAccessWolfPack=true can access
  const tier = req.callerTierId; // "BUILDER"
  const config = req.callerTier; // TierConfig
});
```

### From Other Middlewares

```typescript
import { requireFeature } from "./middleware/tierResolver";

// Use as middleware
app.use("/api/wolf-pack", requireFeature("canAccessWolfPack"));
```

### Manual Check

```typescript
import { tierHasFeature } from "@dreamnet/dreamnet-control-core/tierConfig";

const hasAccess = tierHasFeature("BUILDER", "canAccessWolfPack"); // true
```

## Requiring Minimum Tier

```typescript
import { requireTier } from "./middleware/tierResolver";

router.post("/api/deploy", requireTier("BUILDER"), async (req, res) => {
  // Only BUILDER, OPERATOR, or GOD_MODE can access
  // SEED tier will get 403 response
});
```

## Example: Protected Route

```typescript
import express from "express";
import { controlMiddleware } from "./middleware/control";
import { requireFeature } from "./middleware/tierResolver";

const router = express.Router();

// Apply control middleware (checks kill-switch, rate limits, tier access)
router.use(controlMiddleware("wolf-pack"));

// Require feature flag
router.post("/execute", requireFeature("canAccessWolfPack"), async (req, res) => {
  const tier = req.callerTierId; // "BUILDER"
  const tierConfig = req.callerTier; // TierConfig
  
  // Your route handler
  res.json({ success: true, tier });
});
```

## Testing

1. **Map an API key to a tier**:
```typescript
import { mapApiKeyToTier } from "./middleware/tierResolver";
mapApiKeyToTier("test-key-123", "BUILDER");
```

2. **Make request with API key**:
```bash
curl -H "x-dreamnet-api-key: test-key-123" \
     -H "X-Trace-Id: test-123" \
     http://localhost:5000/api/wolf-pack/status
```

3. **Check response headers**:
- `X-Caller-Tier-Id`: Tier ID (e.g., "BUILDER")
- `X-Control-Status`: "allowed" or "blocked"

## Integration Points

- **Trace ID**: Tier resolver logs `traceId + tierId` for observability
- **Idempotency**: Works seamlessly with idempotency middleware
- **Control Core**: Tier information flows through `checkOperation()`
- **Rate Limiting**: Uses `min(clusterLimit, tierLimit)` for effective limits
- **Feature Flags**: Enforced at control core level, returns 403 with traceId, tierId, requiredFlag

## Summary

- **Tier Config**: `packages/dreamnet-control-core/tierConfig.ts` - `TIERS` export
- **Tier Resolution**: `server/middleware/tierResolver.ts` - reads `x-dreamnet-api-key` header
- **Control Core**: Uses `callerTierId` and `callerTier` for rate limiting and feature flag checks
- **Effective Limits**: `min(clusterLimit, tierLimit)`
- **Feature Flags**: Returns 403 with `traceId`, `callerTierId`, `requiredFlag` if not enabled

