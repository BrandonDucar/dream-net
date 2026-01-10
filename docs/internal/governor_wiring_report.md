# Free-Tier Governor Wiring Report

**Date:** 2025-11-26
**Status:** ⚠️ **UNWIRED / STUBBED**
**Component:** `packages/dreamnet-cost-core`

## Executive Summary
The Free-Tier Governor logic exists within the `dreamnet-cost-core` package but is **not currently integrated** into the active server or application flow. No calls to `recordCost` were found in the codebase outside of the package itself.

## 1. Existing Logic
*Location: `packages/dreamnet-cost-core`*

The core logic is implemented and functional in isolation:
- **`CostStore`**: In-memory storage for cost records.
- **`DreamNetCostCore.recordCost()`**: Main entry point to track usage.
- **Budgets & Alerts**: Logic exists to check budgets and trigger alerts when thresholds are crossed.
- **Economic Bridge**: Wiring exists to send alerts to the Economic Engine (`@dreamnet/cost-economic-bridge`).

## 2. Missing Wiring (The Gap)
The following integration points are missing:

### A. Middleware Integration
There is no middleware intercepting API requests to calculate and record costs.
- **Required:** A middleware in `server/index.ts` or specific route handlers that calls `DreamNetCostCore.recordCost()`.

### B. Cloud Platform Integration
There is no connection to Google Cloud Billing or Usage APIs.
- **Current State:** The system relies on *manual* cost recording (push model) rather than pulling from cloud providers.
- **Impact:** "Cloud Run" and "BigQuery" usage is not automatically tracked unless the application manually self-reports.

### C. Persistence
The `CostStore` is currently **in-memory only**.
- **Risk:** All cost data is lost on server restart.
- **Recommendation:** Connect `CostStore` to the PostgreSQL database used by SuperSpine.

## 3. Recommendations for Activation

1.  **Implement Middleware:**
    ```typescript
    // Example Middleware
    app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        DreamNetCostCore.recordCost({
          clusterId: 'dreamnet-prod',
          provider: 'gcp',
          operation: 'http_request',
          cost: 0.0001, // Estimated cost per request
          currency: 'USD',
          timestamp: Date.now()
        });
      });
      next();
    });
    ```

2.  **Connect to Real Data:**
    - Create a cron job agent (`CostGovernorAgent`) that polls GCP Billing API daily and updates the `CostStore`.

3.  **Persist Data:**
    - Update `CostStore` to write to a `costs` table in the database.
