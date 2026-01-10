# Validation Steps

**Missions:** Registry Cartographer & Free-Tier Governor
**Date:** 2025-11-26

## Mission 1: Agent Registry Validation

### 1. Verify Documentation
- Check that `docs/AGENT_REGISTRY_OVERVIEW.md` exists and is readable.
- Confirm it lists both SuperSpine agents (LUCID, etc.) and System agents (DreamOps, etc.).

### 2. Verify Code Consistency
- Run a grep search to ensure no agents were deleted from `server/core/SuperSpine.ts`.
- **Command:** `grep -r "LUCID" server/core/SuperSpine.ts`

### 3. Registry Health Check (Manual)
- If the server is running, access the health endpoint (if available) or check logs for `[Super Spine] ✅ Loaded ... agents`.
- **Log Check:** Look for "Initialized Core Agents" in server startup logs.

## Mission 4: Free-Tier Governor Validation

### 1. Verify Stubbed State
- Confirm `docs/DREAMNET_FREE_TIER_GOVERNOR.md` clearly states the system is "UNWIRED".
- Confirm `docs/internal/governor_wiring_report.md` details the missing middleware.

### 2. Unit Test Logic (Simulation)
Since the system is unwired, you can verify the logic by running a simple script:

```typescript
// validation_script.ts
import { DreamNetCostCore } from './packages/dreamnet-cost-core';

// 1. Record a fake cost
DreamNetCostCore.recordCost({
  id: 'test-1',
  clusterId: 'test-cluster',
  provider: 'gcp',
  operation: 'test',
  cost: 5.00,
  currency: 'USD',
  timestamp: Date.now()
});

// 2. Check summary
const summary = DreamNetCostCore.getCostSummary('test-cluster');
console.log('Cost Today:', summary.costToday); // Should be 5.00
```

### 3. Verify No Regressions
- Ensure `packages/dreamnet-cost-core` still builds and exports its types.
