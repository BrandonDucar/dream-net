# Fleet Revenue Integration Plan

**Date**: 2025-01-27  
**Purpose**: Integrate all fleets with Economic Engine for revenue tracking and Treasury for financial management

---

## 🎯 Overview

All 4 DreamNet fleets (Aegis, Travel, OTT, Science) operate as **revenue-generating verticals**. They need integration with:

1. **Economic Engine** - Revenue tracking and token distribution
2. **Treasury Department** - Financial management and reporting
3. **Commerce Department** - Business development and partnerships
4. **Revenue Sharing System** - Multi-party revenue distribution

---

## 📋 Required Changes

### 1. Update Economic Engine Types

**File**: `packages/economic-engine-core/types.ts`

**Add Fleet Reward Sources**:
```typescript
export type RewardSource =
  | "zen-garden"
  | "dreambet"
  | "dreamvault"
  | "dreamshop"
  | "socialhub"
  | "dreamtank"
  | "init-ritual"
  | "system"
  // Fleet sources
  | "aegis-fleet"
  | "travel-fleet"
  | "ott-fleet"
  | "archimedes-fleet"
  | "science-fleet"; // Alias for archimedes-fleet
```

**Add Fleet Reward Kinds**:
```typescript
export type RewardKind =
  | "activity"
  | "streak"
  | "win"
  | "participation"
  | "purchase"
  | "contribution"
  | "milestone"
  | "bonus"
  // Fleet revenue kinds
  | "api_revenue"
  | "subscription"
  | "commission"
  | "integration_fee"
  | "data_access"
  | "consulting"
  | "licensing"
  | "marketplace_fee"
  | "partnership"
  | "revenue_share"
  | "bundle"
  | "analytics"
  | "enterprise_api";
```

### 2. Create Fleet Emission Rules

**File**: `packages/economic-engine-core/logic/emissionRules.ts` (or create new file)

**Aegis Fleet Emission Rules**:
```typescript
{
  id: "emission-aegis-api",
  source: "aegis-fleet",
  kind: "api_revenue",
  token: "SHEEP",
  multiplier: 1.0,
  label: "Aegis Fleet API Revenue"
},
{
  id: "emission-aegis-subscription",
  source: "aegis-fleet",
  kind: "subscription",
  token: "SHEEP",
  multiplier: 1.0,
  label: "Aegis Fleet Subscription"
},
{
  id: "emission-aegis-consulting",
  source: "aegis-fleet",
  kind: "consulting",
  token: "SHEEP",
  multiplier: 1.0,
  label: "Aegis Fleet Consulting"
}
```

**Travel Fleet Emission Rules**:
```typescript
{
  id: "emission-travel-commission",
  source: "travel-fleet",
  kind: "commission",
  token: "SHEEP",
  multiplier: 1.0,
  label: "Travel Fleet Commission"
},
{
  id: "emission-travel-api",
  source: "travel-fleet",
  kind: "api_revenue",
  token: "SHEEP",
  multiplier: 1.0,
  label: "Travel Fleet API Revenue"
}
```

**OTT Fleet Emission Rules**:
```typescript
{
  id: "emission-ott-subscription",
  source: "ott-fleet",
  kind: "subscription",
  token: "SHEEP",
  multiplier: 1.0,
  label: "OTT Fleet Subscription"
},
{
  id: "emission-ott-cdn",
  source: "ott-fleet",
  kind: "api_revenue",
  token: "SHEEP",
  multiplier: 1.0,
  label: "OTT Fleet CDN Revenue"
}
```

**Science Fleet Emission Rules**:
```typescript
{
  id: "emission-archimedes-subscription",
  source: "archimedes-fleet",
  kind: "subscription",
  token: "SHEEP",
  multiplier: 1.0,
  label: "Science Fleet Subscription"
},
{
  id: "emission-archimedes-data",
  source: "archimedes-fleet",
  kind: "data_access",
  token: "SHEEP",
  multiplier: 1.0,
  label: "Science Fleet Data Access"
}
```

### 3. Create Fleet Revenue Tracking Utilities

**File**: `packages/fleet-revenue-core/index.ts` (new package)

```typescript
import { EconomicEngineCore } from "@dreamnet/economic-engine-core";

export type FleetId = "aegis-fleet" | "travel-fleet" | "ott-fleet" | "archimedes-fleet";
export type FleetRevenueKind = "api_revenue" | "subscription" | "commission" | "integration_fee" | "data_access" | "consulting" | "licensing";

export interface FleetRevenueEvent {
  fleetId: FleetId;
  agentId: string;
  revenueKind: FleetRevenueKind;
  amount: number;
  token: "SHEEP" | "DREAM" | "FLBY";
  metadata?: Record<string, any>;
}

export function recordFleetRevenue(event: FleetRevenueEvent): void {
  EconomicEngineCore.recordRawReward({
    identityId: `agent:${event.agentId}`,
    source: event.fleetId,
    kind: event.revenueKind,
    baseValue: event.amount,
    meta: {
      fleet: event.fleetId,
      agent: event.agentId,
      revenue: event.amount,
      token: event.token,
      ...event.metadata
    }
  });
}

export function getFleetRevenue(fleetId: FleetId): number {
  const balances = EconomicEngineCore.listBalances();
  const fleetBalances = balances.filter(b => 
    b.identityId.startsWith(`agent:`) && 
    // Check metadata for fleet association
  );
  return fleetBalances.reduce((sum, b) => sum + b.amount, 0);
}
```

### 4. Update Treasury Department

**File**: `packages/dream-state-core/src/government/treasury.ts` (create if needed)

```typescript
import { EconomicEngineCore } from "@dreamnet/economic-engine-core";
import { getFleetRevenue } from "@dreamnet/fleet-revenue-core";

export interface FleetFinancialReport {
  fleetId: string;
  totalRevenue: number;
  expenses: number;
  profit: number;
  revenueByKind: Record<string, number>;
  period: { start: number; end: number };
}

export function generateFleetFinancialReport(
  fleetId: "aegis-fleet" | "travel-fleet" | "ott-fleet" | "archimedes-fleet",
  periodStart: number,
  periodEnd: number
): FleetFinancialReport {
  const revenue = getFleetRevenue(fleetId);
  // Calculate expenses, profit, etc.
  return {
    fleetId,
    totalRevenue: revenue,
    expenses: 0, // TODO: Track expenses
    profit: revenue,
    revenueByKind: {}, // TODO: Aggregate by revenue kind
    period: { start: periodStart, end: periodEnd }
  };
}
```

---

## 🔗 Integration Flow

### Revenue Collection Flow

```
Fleet Service (API call, subscription, etc.)
  ↓
Fleet Agent (e.g., Aegis Logistics Network)
  ↓
recordFleetRevenue() → Fleet Revenue Core
  ↓
EconomicEngineCore.recordRawReward()
  ↓
Emission Rule Applied
  ↓
Token Balance Updated (EconomicEngineCore.getBalance())
  ↓
Treasury Department Aggregates
  ↓
Revenue Sharing System Distributes
  ↓
Network Fee (10%) → DreamNet Treasury
Fleet Revenue (90%) → Fleet Participants
```

---

## 📊 Revenue Tracking by Fleet

### Aegis Fleet
- **Reward Source**: `"aegis-fleet"`
- **Revenue Kinds**: `api_revenue`, `subscription`, `consulting`
- **Tokens**: `SHEEP`, `DREAM`
- **Treasury Report**: Monthly security revenue

### Travel Fleet
- **Reward Source**: `"travel-fleet"`
- **Revenue Kinds**: `commission`, `api_revenue`, `integration_fee`
- **Tokens**: `SHEEP`, `DREAM`
- **Treasury Report**: Monthly travel revenue

### OTT Fleet
- **Reward Source**: `"ott-fleet"`
- **Revenue Kinds**: `subscription`, `api_revenue`, `licensing`
- **Tokens**: `SHEEP`, `DREAM`
- **Treasury Report**: Monthly media revenue

### Science Fleet
- **Reward Source**: `"archimedes-fleet"`
- **Revenue Kinds**: `subscription`, `data_access`, `consulting`
- **Tokens**: `SHEEP`, `DREAM`
- **Treasury Report**: Monthly research revenue

---

## 🚀 Implementation Steps

1. **Update Economic Engine Types** (1 hour)
   - Add fleet reward sources
   - Add fleet reward kinds

2. **Create Fleet Emission Rules** (2 hours)
   - Define revenue → token conversion rules
   - Set multipliers per fleet/kind

3. **Create Fleet Revenue Core Package** (4 hours)
   - Revenue tracking utilities
   - Fleet revenue aggregation
   - Integration helpers

4. **Update Treasury Department** (3 hours)
   - Fleet financial reporting
   - Revenue aggregation
   - Profit/loss tracking

5. **Integrate Existing Fleets** (2 hours)
   - Ground Atlas revenue tracking
   - Aegis Logistics Network revenue tracking

6. **Test Revenue Flow** (2 hours)
   - Test revenue recording
   - Test emission rules
   - Test treasury reporting

**Total Estimated Time**: 14 hours

---

## 📚 References

- **Economic Engine**: `packages/economic-engine-core/`
- **Treasury Department**: `packages/dream-state-core/` (government departments)
- **Revenue Sharing**: `server/routes.ts` (`/api/vaults/:vaultId/revenue`)
- **Fleet Documentation**: `docs/DREAMNET_FLEETS_COMPLETE.md`

---

**Status**: Plan ready for implementation  
**Priority**: HIGH - Revenue tracking is critical for fleet operations

