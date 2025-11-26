# 🎛️ Cloud Run Governor Integration

## Overview

Cloud Run lifecycle management is now fully integrated into DreamNet's Governor/Throttle system. This means:

- ✅ **Rate limiting** for Cloud Run operations (via Conduit Governor)
- ✅ **Budget control** for Cloud Run costs (via Budget Control Service)
- ✅ **Access control** via Port Governor (tier/office requirements)
- ✅ **Keep-alive governance** (prevents runaway costs from minInstances)

---

## What Was Added

### 1. **CLOUD_RUN_PORT** (Port Profile)
- **Location:** `packages/port-governor/src/ports.ts`
- **Access:** OPERATOR tier or higher
- **Required Offices:** FOUNDER, MINISTER_OF_WOLF_OPERATIONS
- **Rate Limits:**
  - 10 requests/minute
  - 100 requests/hour
  - 3 concurrent requests
- **Cost Budget:** $0.01/minute

### 2. **CLOUD_RUN_CORE** (Cluster)
- **Location:** `packages/dreamnet-control-core/clusters.ts`
- **Rate Limits:**
  - 10 requests/minute
  - 100 requests/hour
- **Feature Flag:** `canManageDeployments`

### 3. **Cloud Run Tools** (Agent Gateway)
- **Location:** `packages/agent-gateway/src/tools.ts`
- **Tools Added:**
  - `cloudrun.deploy` - Deploy service (CRITICAL risk, $0.05 cost)
  - `cloudrun.scale` - Scale service (HIGH risk, $0.01 cost)
  - `cloudrun.update` - Update service (HIGH risk, $0.02 cost)
  - `cloudrun.list` - List services (MEDIUM risk, $0 cost)
  - `cloudrun.getStatus` - Get status (LOW risk, $0 cost)
  - `cloudrun.setKeepAlive` - Set keep-alive (HIGH risk, variable cost)

### 4. **Cloud Run Conduits** (Per-Line Budgets)
- **Location:** `packages/dreamnet-control-core/src/conduits.ts`
- **Conduits:**
  - `cloudrun.deploy`: 2/min, 10/hour, $5/day max
  - `cloudrun.scale`: 5/min, 20/hour, $2/day max
  - `cloudrun.setKeepAlive`: 3/min, 10/hour, $1/day max
  - `cloudrun.update`: 5/min, 30/hour, $1/day max
  - `cloudrun.list`: 30/min, 200/hour (cached 60s)
  - `cloudrun.getStatus`: 60/min, 500/hour (cached 30s)

### 5. **Cloud Run Governor** (Specialized Logic)
- **Location:** `packages/dreamnet-control-core/src/cloudRunGovernor.ts`
- **Functions:**
  - `evaluateCloudRunOperation()` - Checks conduit + budget + keep-alive
  - `recordCloudRunCost()` - Records costs to Budget Control Service
  - `getCloudRunBudgetStatus()` - Returns budget status

---

## How It Works

### Request Flow

```
Agent Request
    ↓
Port Governor (tier/office check)
    ↓
Conduit Governor (rate limit check)
    ↓
Cloud Run Governor (budget + keep-alive check)
    ↓
Budget Control Service (cost tracking)
    ↓
Cloud Run API (if all checks pass)
```

### Example: Setting Keep-Alive

```typescript
import { evaluateCloudRunOperation, recordCloudRunCost } from "@dreamnet/dreamnet-control-core/cloudRunGovernor";

const request = {
  serviceName: "dreamnet",
  minInstances: 1, // Keep service alive
  maxInstances: 10,
};

// Check if allowed
const decision = evaluateCloudRunOperation(
  "setKeepAlive",
  "CLOUD_RUN_PORT",
  "CLOUD_RUN_CORE",
  "cloudrun.setKeepAlive",
  request
);

if (decision.allowed) {
  // Execute Cloud Run API call
  await deployToCloudRun(request);
  
  // Record cost
  recordCloudRunCost("setKeepAlive", request);
} else {
  // Blocked: decision.reason explains why
  console.error(`Blocked: ${decision.reason}`);
}
```

---

## Budget Control

### Two Budget Providers

1. **`cloudrun`** - General Cloud Run operations
   - Deployments, updates, scaling
   - Default: Unlimited (set via API)

2. **`cloudrun-keepalive`** - Keep-alive costs
   - Running instances (minInstances > 0)
   - Default: Unlimited (set via API)
   - Cost: ~$20/month per instance

### Setting Budgets

```typescript
import { BudgetControlService } from "../server/services/BudgetControlService";

// Set monthly budget for Cloud Run operations
BudgetControlService.setBudgetLimit("cloudrun", 50); // $50/month

// Set monthly budget for keep-alive
BudgetControlService.setBudgetLimit("cloudrun-keepalive", 30); // $30/month (1-2 instances)
```

### Checking Budget Status

```typescript
import { getCloudRunBudgetStatus } from "@dreamnet/dreamnet-control-core/cloudRunGovernor";

const status = getCloudRunBudgetStatus();
console.log(status.cloudrun); // { limit, used, remaining, overBudget }
console.log(status.keepalive); // { limit, used, remaining, overBudget }
```

---

## Integration with Existing Systems

### ✅ Port Governor
- Cloud Run operations require OPERATOR tier
- Requires FOUNDER or MINISTER_OF_WOLF_OPERATIONS office
- Rate limited at port level (10/min, 100/hour)

### ✅ Conduit Governor
- Per-operation rate limits (deploy: 2/min, scale: 5/min, etc.)
- Daily cost budgets ($5/day for deployments)
- Execution timeouts (5min for deploy, 30s for scale)

### ✅ Budget Control Service
- Tracks Cloud Run API costs
- Tracks keep-alive costs separately
- Blocks operations when over budget

### ✅ Agent Gateway
- Tools are registered and accessible to agents
- Risk levels and costs are defined
- Tier/office requirements enforced

---

## Usage Examples

### Example 1: Deploy Service (Governed)

```typescript
// Agent tries to deploy
const toolId = "cloudrun.deploy";
const portId = "CLOUD_RUN_PORT";
const clusterId = "CLOUD_RUN_CORE";

// Conduit Governor checks rate limits
const conduitDecision = evaluateConduit(portId, clusterId, toolId);
if (!conduitDecision.allowed) {
  // Blocked: rate limit exceeded
  return;
}

// Cloud Run Governor checks budget
const decision = evaluateCloudRunOperation(
  "deploy",
  portId,
  clusterId,
  toolId,
  { serviceName: "dreamnet", image: "..." }
);

if (decision.allowed) {
  await deployToCloudRun(...);
  recordCloudRunCost("deploy", ...);
}
```

### Example 2: Set Keep-Alive (Budget-Controlled)

```typescript
// Agent tries to set minInstances=1
const decision = evaluateCloudRunOperation(
  "setKeepAlive",
  "CLOUD_RUN_PORT",
  "CLOUD_RUN_CORE",
  "cloudrun.setKeepAlive",
  { serviceName: "dreamnet", minInstances: 1 }
);

if (decision.allowed) {
  // Cost: ~$0.67/day ($20/month / 30 days)
  await updateCloudRunService("dreamnet", { minInstances: 1 });
  recordCloudRunCost("setKeepAlive", { minInstances: 1 });
} else if (decision.reason === "KEEPALIVE_BUDGET_EXCEEDED") {
  // Budget exceeded - use keep-alive pings instead
  console.log("Keep-alive budget exceeded, using ping-based keep-alive");
}
```

---

## Benefits

1. **Cost Control** - Prevents runaway Cloud Run costs
2. **Rate Limiting** - Prevents deployment spam
3. **Access Control** - Only authorized users can manage Cloud Run
4. **Budget Governance** - Keep-alive costs are tracked separately
5. **Unified System** - Uses same Governor/Throttle infrastructure

---

## Next Steps

1. **Set Budgets:**
   ```typescript
   BudgetControlService.setBudgetLimit("cloudrun", 100); // $100/month
   BudgetControlService.setBudgetLimit("cloudrun-keepalive", 30); // $30/month
   ```

2. **Use in Routes:**
   - Add Cloud Run routes that use `withPort("CLOUD_RUN_PORT")`
   - Check `evaluateCloudRunOperation()` before executing

3. **Monitor:**
   - Check `getCloudRunBudgetStatus()` regularly
   - Set up alerts when budgets approach limits

---

**Cloud Run is now fully governed! 🎛️**

