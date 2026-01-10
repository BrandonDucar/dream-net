# DreamNet Free-Tier Governor

**Status:** 🚧 **Stubbed / Planned**
**Package:** `@dreamnet/cost-core`
**Enforcement:** Passive (Alerting only)

## Overview
The Free-Tier Governor is designed to ensure DreamNet stays within the generous free tiers provided by cloud providers (primarily Google Cloud). It tracks usage and triggers alerts when thresholds are approached.

## Tracked Resources & Limits

The Governor monitors the following resources against their free-tier limits:

| Resource | Free Tier Limit | Warning Threshold (80%) | Critical Threshold (95%) |
| :--- | :--- | :--- | :--- |
| **Cloud Run** | 2M Requests / month | 1.6M Requests | 1.9M Requests |
| **Cloud Build** | 2,500 Minutes / month | 2,000 Minutes | 2,375 Minutes |
| **BigQuery** | 1 TB Query / month | 800 GB | 950 GB |
| **BigQuery Storage** | 10 GB Active Storage | 8 GB | 9.5 GB |

## Architecture

### Core Logic
The logic resides in `packages/dreamnet-cost-core`.
- **`CostStore`**: Maintains a rolling window of cost records.
- **`Budgets`**: Defines the limits (e.g., "Monthly Cloud Run Budget").
- **`Alerts`**: Generated when usage > threshold.

### Integration Status
> [!WARNING]
> **Current Status: UNWIRED**
> The cost tracking logic is currently **disconnected** from the live application. Usage tracking is not yet automatic.

### Future Wiring Plan
1.  **Request Tracking:** Middleware will estimate cost per HTTP request.
2.  **Cloud Sync:** A background agent will sync actual billing data from GCP.
3.  **Enforcement:** At 100% usage, non-critical agents (e.g., `DreamTank`, `ZenGarden`) will be paused to save resources.

## How to Check Status (Planned)

Once wired, status will be available via the `DreamOps` agent or the admin dashboard.

**Example Command:**
```typescript
// Check cost summary
const summary = DreamNetCostCore.getCostSummary('dreamnet-prod');
console.log(summary.costThisMonth);
```

## Overrides
To override a budget or disable the governor:
1.  Access `DreamNetCostCore` configuration.
2.  Set `budget.enabled = false` for the specific resource.
