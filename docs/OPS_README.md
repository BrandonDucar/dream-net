# DreamNet OPS Contract - Usage Guide

**For**: Cursor, ChatGPT, Agents, Developers  
**Purpose**: Quick reference for using the OPS Contract system

---

## Quick Start

### If you are Cursor / ChatGPT / Agent → read this first

1. **Read `docs/OPS_CONTRACT.md`** - Understand the rules
2. **Use `packages/ops-sentinel`** - For validation and build/deploy plans
3. **Use `packages/dreamnet-bridge`** - For high-level system status
4. **Do NOT bypass these layers**

---

## Using Ops Sentinel

### In Code (TypeScript)

```typescript
import {
  loadOpsContract,
  validateRepoSetup,
  getFrontendBuildPlan,
  getBackendDeployPlan,
  getIntegrationConfig,
} from '@dreamnet/ops-sentinel';

// Load contract
const contract = loadOpsContract();

// Validate setup
const validation = validateRepoSetup(contract);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}

// Get build plans
const frontendPlan = getFrontendBuildPlan(contract);
const backendPlan = getBackendDeployPlan(contract);

// Get integration config
const stripeConfig = getIntegrationConfig(contract, 'Stripe');
```

### Via API

```bash
# Get contract summary
curl https://api.dreamnet.ink/api/ops/contract

# Validate repo setup
curl https://api.dreamnet.ink/api/ops/validate

# Get frontend build plan
curl https://api.dreamnet.ink/api/ops/build-plan/frontend

# Get backend deploy plan
curl https://api.dreamnet.ink/api/ops/build-plan/backend

# Get integration config
curl https://api.dreamnet.ink/api/ops/integration/Stripe

# Get integrations by category
curl https://api.dreamnet.ink/api/ops/integrations/Blockchain

# Get required env vars
curl https://api.dreamnet.ink/api/ops/env-vars/frontend
```

---

## Using DreamNet Bridge

### In Code (TypeScript)

```typescript
import {
  dnStatus,
  dnEconomy,
  dnDevOps,
  dnWalletIntel,
  dnOpsContract,
  dnOpsValidate,
} from '@dreamnet/dreamnet-bridge';

// System status
const status = await dnStatus();

// Economic queries
const economy = await dnEconomy('Show me DREAM token liquidity');

// DevOps queries
const devops = await dnDevOps('Get deployment summary');

// Wallet intelligence (READ_ONLY)
const walletIntel = await dnWalletIntel('Analyze wallet 0x...');

// OPS Contract
const contract = await dnOpsContract();

// OPS Validation
const validation = await dnOpsValidate();
```

---

## Common Tasks

### Task: Deploy Frontend to Vercel

1. **Validate setup**:
   ```typescript
   const validation = validateRepoSetup(loadOpsContract());
   if (!validation.valid) {
     // Fix errors first
   }
   ```

2. **Get build plan**:
   ```typescript
   const plan = getFrontendBuildPlan(loadOpsContract());
   // Use plan.steps and plan.outputDirectory
   ```

3. **Check Vercel config**:
   - Ensure `vercel.json` matches contract
   - Ensure `rootDirectory: "client"`
   - Ensure install/build commands are correct

### Task: Deploy Backend to Railway

1. **Validate setup**:
   ```typescript
   const validation = validateRepoSetup(loadOpsContract());
   ```

2. **Get deploy plan**:
   ```typescript
   const plan = getBackendDeployPlan(loadOpsContract());
   // Use plan.steps
   ```

3. **Check Railway config**:
   - Ensure `server/` is service root
   - Ensure build/start commands match contract

### Task: Add New Integration

1. **Update inventory**: Add to `DREAMNET_INTEGRATIONS_INVENTORY.md`
   - Name, category, code locations, env vars, status

2. **Update ops-sentinel**: Add to `packages/ops-sentinel/src/contracts.ts`
   - Add to `integrations` array in `loadOpsContract()`

3. **Follow contract rules**:
   - Use typed wrappers (no raw fetch)
   - Use env vars (no hardcoded secrets)
   - Document in inventory

### Task: Query System Status

```typescript
// Via bridge
const status = await dnStatus();

// Or via API
const response = await fetch('https://api.dreamnet.ink/api/ops/validate');
const validation = await response.json();
```

---

## Validation Checklist

Before deploying or making changes:

- [ ] Run `validateRepoSetup()` - no errors
- [ ] Check `vercel.json` matches contract
- [ ] Check `server/package.json` has required scripts
- [ ] Check `client/package.json` has required scripts
- [ ] Verify env vars are set (not hardcoded)
- [ ] Verify integrations are in inventory
- [ ] Verify code uses typed wrappers (not raw fetch)

---

## Troubleshooting

### "Validation failed"

Check the errors array:
```typescript
const result = validateRepoSetup(loadOpsContract());
console.log(result.errors);
```

Common fixes:
- Update `vercel.json` to match contract
- Add missing scripts to `package.json`
- Fix directory structure

### "Integration not found"

1. Check `DREAMNET_INTEGRATIONS_INVENTORY.md`
2. Add to `packages/ops-sentinel/src/contracts.ts` if missing
3. Rebuild ops-sentinel: `pnpm --filter @dreamnet/ops-sentinel run build`

### "Bridge not initialized"

Ensure `DREAMNET_API_KEY` env var is set (for bridge agent queries).

---

## Architecture

```
┌─────────────────────────────────────────┐
│         OPS_CONTRACT.md                  │
│      (Single Source of Truth)            │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌──────▼──────────────┐
│ ops-sentinel│  │ dreamnet-bridge     │
│ (Validation)│  │ (System Queries)   │
└──────┬──────┘  └──────┬──────────────┘
       │                │
       └───────┬────────┘
               │
       ┌───────▼──────────┐
       │  API Routes      │
       │  /api/ops/*      │
       └──────────────────┘
```

---

## Summary

- **OPS_CONTRACT.md** = Rules
- **ops-sentinel** = Enforcement
- **dreamnet-bridge** = System queries
- **API routes** = HTTP access

**Always use these layers. Never bypass them.**

