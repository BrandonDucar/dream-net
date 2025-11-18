# DreamNet Access Tier System - Implementation Summary

## Overview

The DreamNet access tier system has been successfully implemented and integrated into the control core. This system provides biomimetic access levels that map to rate limits, feature flags, and cluster access permissions.

## Architecture Summary

### Current Repository Structure

- **Frontend**: `apps/site` - React/Vite application
- **Backend/API**: `server/` - Express server with routes
- **Middlewares**: `server/middleware/` - traceId, idempotency, tierResolver, control
- **Control Core**: `packages/dreamnet-control-core` - kill-switch, rate limiting, and tier system

### Request Flow

The middleware chain follows this biomimetic pattern:

```
Trace ID Middleware → Idempotency Middleware → Tier Resolver → Control Core → Route Handler
```

1. **Trace ID Middleware** (`server/middleware/traceId.ts`)
   - Generates/reads `X-Trace-Id` header
   - Attaches trace context to request

2. **Idempotency Middleware** (`server/middleware/idempotency.ts`)
   - Handles `X-Idempotency-Key` header
   - Prevents duplicate requests
   - Logs deduplication proof

3. **Tier Resolver Middleware** (`server/middleware/tierResolver.ts`) ⭐ NEW
   - Resolves access tier from API key or wallet address
   - Defaults to SEED tier if no mapping found
   - Attaches tier to request object

4. **Control Core Middleware** (`server/middleware/control.ts`)
   - Checks kill-switch, rate limits, circuit breakers
   - **Now also checks tier-based access and rate limits**

5. **Route Handler**
   - Processes the actual request

## Access Tiers

### Tier Definitions

| Tier | Description | Rate Limits (per min/hour/day) | Concurrency |
|------|-------------|-------------------------------|-------------|
| **SEED** | Basic access tier - limited rate limits, core features only | 10/100/1000 | 2 |
| **BUILDER** | Can create and deploy, moderate limits | 60/1000/10000 | 10 |
| **OPERATOR** | Can manage systems, high limits | 300/10000/100000 | 50 |
| **GOD_MODE** | Unlimited access, all features | 10000/1000000/10000000 | 1000 |

### Feature Flags per Tier

Each tier has feature flags that control access to clusters:

- `canAccessWolfPack` - Access to Wolf Pack (offensive/executional agents)
- `canAccessOctopus` - Access to Octopus (multi-arm integration)
- `canAccessShield` - Access to Shield Core (security/threat detection)
- `canUseHighCostEndpoints` - Access to high-cost API endpoints
- `canDeploy` - Can deploy to Vercel/GitHub
- `canManageClusters` - Can manage cluster kill-switches
- `canAccessDreamKeeper` - Access to DreamKeeper health system
- `canAccessDreamScope` - Access to DreamScope visualization
- `canAccessZenGarden` - Access to Zen Garden rituals
- `canAccessDreamBet` - Access to DreamBet gaming
- `canAccessDreamSnail` - Access to DreamSnail privacy layer

### Tier Feature Matrix

| Feature | SEED | BUILDER | OPERATOR | GOD_MODE |
|---------|------|---------|----------|----------|
| Wolf Pack | ❌ | ✅ | ✅ | ✅ |
| Octopus | ❌ | ✅ | ✅ | ✅ |
| Shield | ❌ | ❌ | ✅ | ✅ |
| High Cost Endpoints | ❌ | ❌ | ✅ | ✅ |
| Deploy | ❌ | ✅ | ✅ | ✅ |
| Manage Clusters | ❌ | ❌ | ✅ | ✅ |
| DreamKeeper | ❌ | ✅ | ✅ | ✅ |
| DreamScope | ✅ | ✅ | ✅ | ✅ |
| Zen Garden | ✅ | ✅ | ✅ | ✅ |
| DreamBet | ❌ | ✅ | ✅ | ✅ |
| DreamSnail | ❌ | ❌ | ✅ | ✅ |

## Implementation Details

### Files Created/Modified

1. **`packages/dreamnet-control-core/types.ts`**
   - Added `AccessTier` type
   - Added `TierConfig`, `TierFeatureFlags`, `TierRateLimits` interfaces
   - Updated `ControlContext` to include tier information

2. **`packages/dreamnet-control-core/tierConfig.ts`** ⭐ NEW
   - Defines default tier configurations
   - Provides helper functions: `getTierConfig()`, `tierHasFeature()`, `getTierRateLimits()`

3. **`server/middleware/tierResolver.ts`** ⭐ NEW
   - Resolves tier from API key or wallet address
   - Provides `tierResolverMiddleware()` for automatic tier resolution
   - Provides `requireTier()` middleware for minimum tier requirements
   - Provides `requireFeature()` middleware for feature flag checks

4. **`packages/dreamnet-control-core/store/controlStore.ts`**
   - Added tier-based rate limiting methods:
     - `recordTierRequest()`
     - `checkTierRateLimit()`
     - `incrementTierConcurrency()`
     - `decrementTierConcurrency()`

5. **`packages/dreamnet-control-core/index.ts`**
   - Updated `checkOperation()` to:
     - Check tier-based feature access
     - Use tier-based rate limits when tier is available
     - Fall back to cluster rate limits if no tier

6. **`server/middleware/control.ts`**
   - Updated to pass tier information to control core
   - Adds tier to response headers

7. **`server/index.ts`**
   - Wired tier resolver middleware into request flow

## Usage Examples

### Setting Tier for API Key

```typescript
import { setApiKeyTier } from "./middleware/tierResolver";

// Set tier for an API key
setApiKeyTier("api-key-id-123", "BUILDER");
```

### Setting Tier for Wallet

```typescript
import { setWalletTier } from "./middleware/tierResolver";

// Set tier for a wallet address
setWalletTier("0x1234...", "OPERATOR");
```

### Requiring Minimum Tier in Routes

```typescript
import { requireTier } from "./middleware/tierResolver";

router.post("/api/deploy", requireTier("BUILDER"), async (req, res) => {
  // Only BUILDER, OPERATOR, or GOD_MODE can access
});
```

### Requiring Feature Flag

```typescript
import { requireFeature } from "./middleware/tierResolver";

router.post("/api/wolf-pack/execute", requireFeature("canAccessWolfPack"), async (req, res) => {
  // Only tiers with canAccessWolfPack can access
});
```

### Using Control Middleware with Tier

```typescript
import { controlMiddleware } from "./middleware/control";

router.use("/api/wolf-pack", controlMiddleware("wolf-pack"));
// Tier is automatically resolved and checked
```

## Next Steps / Future Enhancements

### TODO: Database Integration

Currently, tier mappings are stored in-memory. Future work should:

1. **Store tier mappings in database**
   - Add `tier` column to `dreamnet_api_keys` table
   - Create `wallet_tiers` table for wallet-to-tier mappings
   - Support Stripe customer → tier mapping

2. **Wallet-based tier resolution**
   - Query blockchain for token holdings
   - Map holdings to tiers (e.g., 1000+ DREAM tokens → BUILDER)
   - Cache wallet tier lookups

3. **Stripe integration**
   - Map Stripe subscription tiers to DreamNet tiers
   - Auto-update tier when subscription changes
   - Support tier upgrades/downgrades

4. **Node Grid Glow Tiers**
   - Visual representation of tier in DreamScope
   - Different glow colors/intensities per tier
   - Tier-based node styling

5. **Tier Management API**
   - Admin endpoints to manage tier assignments
   - Tier upgrade/downgrade workflows
   - Tier usage analytics

## Testing

To test the tier system:

1. **Set a tier for testing**:
   ```typescript
   import { setApiKeyTier } from "./middleware/tierResolver";
   setApiKeyTier("test-key-id", "BUILDER");
   ```

2. **Make request with API key**:
   ```bash
   curl -H "Authorization: Bearer dn_live_..." \
        -H "X-Trace-Id: test-123" \
        http://localhost:5000/api/wolf-pack/status
   ```

3. **Check response headers**:
   - `X-Access-Tier`: Should show resolved tier
   - `X-Control-Status`: Should show "allowed" or "blocked"

## Biomimetic Alignment

The tier system aligns with DreamNet's biomimetic architecture:

- **Nervous System**: Tier information flows through trace IDs and request context
- **Organs/Clusters**: Each cluster has tier-based access control
- **Bloodstream**: Tier determines rate limits (token/credit flows)
- **Immune System**: Shield Core respects tier-based access
- **Skin/Armor**: Tier acts as access control layer

## Summary

✅ **Completed**:
- Tier system with SEED, BUILDER, OPERATOR, GOD_MODE
- Tier resolver middleware
- Tier-based rate limiting
- Tier-based feature flags
- Integration with control core
- Request flow: Trace → Idempotency → Tier → Control → Route

🔄 **Ready for**:
- Database persistence
- Wallet/Stripe integration
- Node grid visualization
- Tier management APIs

The tier system is now **production-ready** for API key-based access control and can be extended to support wallet and Stripe-based tier mapping in the future.

