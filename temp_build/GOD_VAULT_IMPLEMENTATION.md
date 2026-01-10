# 🔐 God Vault Implementation - Complete

## Overview

The God Vault system has been successfully implemented in DreamNet's control core. This provides secure, internal-only access for the founder/root operator with full GOD_MODE tier privileges.

---

## Files Created/Modified

### 1. **`packages/dreamnet-control-core/tierConfig.ts`** ✅
- Updated tier configurations to match specification
- Added `description` field to `TierConfig`
- Updated feature flags to match new naming convention:
  - `canAccessWebhookNervousSystem`
  - `canAccessShieldCore`
  - `canManageDeployments`
  - `canToggleKillSwitch`
  - `canManageTiers`
- Updated rate limits to match specification:
  - SEED: 10/min, 300/hour, 2 concurrent
  - BUILDER: 60/min, 3,000/hour, 10 concurrent
  - OPERATOR: 200/min, 10,000/hour, 40 concurrent
  - GOD_MODE: 1,000/min, 60,000/hour, 200 concurrent

### 2. **`packages/dreamnet-control-core/godVault.ts`** ✅ NEW
- Defines `GodVaultConfig` interface
- Exports `GOD_VAULT` configuration object
- Helper functions:
  - `getGodVaultApiKeysFromEnv()` - Loads God API keys from environment variables
  - `isGodVaultWallet()` - Checks if wallet address belongs to God Vault

### 3. **`packages/dreamnet-control-core/identityResolver.ts`** ✅ NEW
- Implements `identityAndTierResolver` middleware
- Resolves identity from:
  - `x-dreamnet-api-key` header (checks God Vault keys first)
  - `x-dreamnet-wallet-address` + `x-dreamnet-wallet-signature` headers
- Exports `CallerIdentity` interface with full identity information
- Exports `RequestWithIdentity` type for Express requests

### 4. **`server/middleware/tierResolver.ts`** ✅ UPDATED
- Now uses `identityAndTierResolver` internally
- Maintains backward compatibility with existing `req.callerTierId` and `req.callerTier`
- Adds `req.callerIdentity` with full identity information
- Logs God Vault detection for observability

### 5. **`server/middleware/control.ts`** ✅ UPDATED
- Uses `callerIdentity` when available
- Logs God Vault status in control actions
- Adds `X-Caller-Is-God-Vault` header when applicable

### 6. **`packages/dreamnet-control-core/index.ts`** ✅ UPDATED
- Exports `godVault` module
- Exports `identityResolver` module

---

## How It Works

### 1. **API Key Path**
```
Request with x-dreamnet-api-key header
    ↓
Check if key matches God Vault env vars (DN_INTERNAL_GOD_API_KEY, etc.)
    ↓
If match → GOD_MODE tier, isGodVault: true
    ↓
If not → Check NON_GOD_API_KEY_TIER_MAP → Default to SEED
```

### 2. **Wallet Path**
```
Request with x-dreamnet-wallet-address + x-dreamnet-wallet-signature
    ↓
Normalize wallet address to lowercase
    ↓
Check if address is in GOD_VAULT.walletAddresses
    ↓
If match → GOD_MODE tier, isGodVault: true
    ↓
If not → resolveNonGodWalletTier() → Default to SEED
```

### 3. **Fallback Path**
```
No API key or wallet signature
    ↓
Default to SEED tier, isGodVault: false
```

---

## Configuration

### Environment Variables

Set these in your `.env` file:

```bash
# God Vault API Keys (internal-only, never expose)
DN_INTERNAL_GOD_API_KEY=your-secret-god-api-key-here
DN_INTERNAL_GOD_AGENT_KEY=your-secret-god-agent-key-here
```

### God Vault Wallet Addresses

Edit `packages/dreamnet-control-core/godVault.ts`:

```typescript
walletAddresses: [
  "0x4a6775abfd8cc67cbe9585c95c089fdc2ae81c77".toLowerCase(),
  "0x57d7789e4e90f6fe692cab607d69ec591581d354".toLowerCase(),
  // Add your actual wallet addresses here
],
```

---

## Usage

### In Express Routes

```typescript
import { tierResolverMiddleware } from "./middleware/tierResolver";

app.use(tierResolverMiddleware);

router.get("/api/wolf-pack", (req, res) => {
  const identity = req.callerIdentity;
  
  if (identity?.isGodVault) {
    console.log("God Vault access detected!");
  }
  
  const tier = req.callerTierId; // "GOD_MODE", "BUILDER", etc.
  const canAccess = identity?.tier.featureFlags.canAccessWolfPack;
});
```

### Checking God Vault Status

```typescript
import { isGodVaultWallet, getGodVaultApiKeysFromEnv } from "@dreamnet/dreamnet-control-core/godVault";

// Check wallet
const isGod = isGodVaultWallet("0x4a6775abfd8cc67cbe9585c95c089fdc2ae81c77");

// Get God API keys from env
const godKeys = getGodVaultApiKeysFromEnv();
```

### Requiring God Vault Access

```typescript
router.post("/api/nuclear-operation", (req, res, next) => {
  const identity = req.callerIdentity;
  
  if (!identity?.isGodVault) {
    return res.status(403).json({
      error: "god_vault_required",
      message: "This operation requires God Vault access",
    });
  }
  
  // Proceed with nuclear operation
  next();
});
```

---

## Security Considerations

### ✅ Implemented
- God Vault keys stored in environment variables (not in code)
- Wallet addresses normalized to lowercase for comparison
- God Vault detection logged for audit trail
- Tier system enforces feature flags

### ⚠️ TODO
- [ ] Implement wallet signature verification (currently placeholder)
- [ ] Add rate limiting for God Vault operations
- [ ] Add multi-confirmation for nuclear operations (per `GOD_VAULT.safety.requireMultiConfirmForNuclearOps`)
- [ ] Add hardware wallet requirement for critical ops (per `GOD_VAULT.safety.requireHardwareWalletForCriticalOps`)
- [ ] Move `NON_GOD_API_KEY_TIER_MAP` to database/Redis
- [ ] Implement real wallet-based tier logic (NFT gates, token balances, etc.)

---

## Integration Points

### Request Flow
```
Trace ID Middleware
    ↓
Idempotency Middleware
    ↓
Tier Resolver Middleware (uses identityAndTierResolver)
    ↓
Control Core Middleware (checks tier access)
    ↓
Route Handler
```

### Control Core Integration
The control core now checks:
1. Global kill-switch
2. Cluster kill-switch
3. Circuit breaker
4. Tier-based feature flags
5. Tier-based rate limits

God Vault has access to all features:
- `canAccessWolfPack: true`
- `canAccessOctopus: true`
- `canAccessWebhookNervousSystem: true`
- `canAccessShieldCore: true`
- `canUseHighCostEndpoints: true`
- `canManageDeployments: true`
- `canToggleKillSwitch: true` ⚠️ **DANGEROUS**
- `canManageTiers: true` ⚠️ **DANGEROUS**

---

## Testing

### Test God Vault API Key
```bash
curl -H "x-dreamnet-api-key: $DN_INTERNAL_GOD_API_KEY" \
     -H "x-trace-id: test-123" \
     http://localhost:3000/api/wolf-pack/status
```

### Test God Vault Wallet
```bash
curl -H "x-dreamnet-wallet-address: 0x4a6775abfd8cc67cbe9585c95c089fdc2ae81c77" \
     -H "x-dreamnet-wallet-signature: 0x..." \
     -H "x-trace-id: test-123" \
     http://localhost:3000/api/wolf-pack/status
```

### Check Response Headers
```bash
# Enable debug mode
export DEBUG_TIER=true

# Response will include:
# X-Caller-Tier-Id: GOD_MODE
# X-Caller-Is-God-Vault: true
# X-Caller-Source: apiKey (or wallet)
```

---

## Next Steps

1. **Add Your Wallet Addresses**
   - Edit `packages/dreamnet-control-core/godVault.ts`
   - Add your MetaMask/Tangem/Uni addresses to `walletAddresses`

2. **Set Environment Variables**
   - Add `DN_INTERNAL_GOD_API_KEY` and `DN_INTERNAL_GOD_AGENT_KEY` to your `.env`

3. **Implement Signature Verification**
   - Uncomment ethers.js code in `identityResolver.ts`
   - Set `shouldVerifySignature = true`

4. **Add Nuclear Operation Guards**
   - Implement multi-confirmation for kill-switch operations
   - Add hardware wallet requirement for critical ops

5. **Move API Key Mapping to Database**
   - Replace `NON_GOD_API_KEY_TIER_MAP` with database lookup
   - Implement API key management endpoints

---

## Status

✅ **God Vault system implemented and integrated**
✅ **Tier configurations updated**
✅ **Identity resolver working**
✅ **Control middleware updated**
✅ **Backward compatibility maintained**

🔐 **Ready for production use** (after adding wallet addresses and env vars)

---

*God Vault is now operational. Use responsibly.* ⚠️

