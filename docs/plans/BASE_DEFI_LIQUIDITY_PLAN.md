# Base/DeFi Liquidity Strategy Implementation Plan

## Overview

Implement liquidity seeding and MEV-protected swap strategies for DreamNet tokens on Base network, leveraging Aerodrome, Uniswap v3/v4, and MEV protection services.

## Key Platforms

### Aerodrome
- **Role:** Primary liquidity hub on Base
- **Strategy:** Gauge-stake before weekly epoch cutoff (Weds 23:00 UTC)
- **Benefits:** AERO emissions + fee share

### Uniswap v3/v4
- **Role:** Concentrated liquidity for custom exposure
- **Strategy:** Tight ranges for stables, wider for volatile pairs
- **Benefits:** Capital efficiency + custom hooks (v4)

### MEV Protection
- **Flashbots Protect:** Private mempool + failed-tx protection
- **MEV-Blocker:** Anti-sandwich with rebates
- **CoW Swap:** Intent-based batch auctions

## Implementation Phases

### Phase 1: Liquidity Seeding Infrastructure

**Files to create:**
- `packages/liquidity-core/src/AerodromeClient.ts` - Aerodrome integration
- `packages/liquidity-core/src/UniswapV3Client.ts` - Uniswap v3 integration
- `packages/liquidity-core/src/UniswapV4Client.ts` - Uniswap v4 integration
- `packages/liquidity-core/src/LiquiditySeeder.ts` - Seeding orchestration

**Dependencies:**
```json
{
  "ethers": "^6.15.0",
  "@uniswap/v3-sdk": "^3.10.0",
  "@uniswap/v4-sdk": "^1.0.0"
}
```

**Features:**
- Check current gauge emissions schedule
- Calculate optimal liquidity ranges
- Execute seed transactions

### Phase 2: MEV Protection Integration

**Files to create:**
- `packages/liquidity-core/src/MEVProtection.ts` - MEV protection wrapper
- `packages/liquidity-core/src/FlashbotsProtect.ts` - Flashbots Protect client
- `packages/liquidity-core/src/MEVBlocker.ts` - MEV-Blocker client
- `packages/liquidity-core/src/CoWSwap.ts` - CoW Swap client

**RPC Endpoints:**
- MEV-Blocker: `https://rpc.mevblocker.io/noreverts` (or `/fast`, `/fullprivacy`)
- Flashbots Protect: `https://rpc.flashbots.net/fast`
- CoW Swap: Intent submission API

**Features:**
- Route selection based on order size
- Automatic fallback if protected path fails
- Revert protection for thin markets

### Phase 3: Liquidity Seeding Strategy

**Files to create:**
- `packages/liquidity-core/src/ConcentrationBands.ts` - Band calculation
- `packages/liquidity-core/src/TWAPExecutor.ts` - Time-weighted execution
- `packages/liquidity-core/src/CrossVenueDispersion.ts` - Multi-venue routing

**Strategy implementation:**
1. **Pre-seed:** Add small LP tranches above/below mid (±0.6%, ±1.2%, ±2.5%)
2. **Dry-run:** Send tiny test order (0.5-1% of size)
3. **Main execution:** Use MEV-protected path
4. **TWAP:** Break into 12-24 clips with randomized intervals
5. **Cross-venue:** Distribute across multiple pools

### Phase 4: First-Epoch Splash Strategy

**Files to create:**
- `packages/liquidity-core/src/EpochPlanner.ts` - Epoch timing logic
- `packages/liquidity-core/src/GaugeStaker.ts` - Gauge staking automation

**Workflow:**
1. Scan Base DEX map for target token-pair pools/gauges
2. Gauge-stake on Aerodrome before epoch cutoff
3. Deploy concentrated liquidity on Uniswap v3/v4 simultaneously
4. Monitor and adjust ranges post-launch

### Phase 5: Monitoring & Alerts

**Files to create:**
- `packages/liquidity-core/src/LiquidityMonitor.ts` - Real-time monitoring
- `packages/liquidity-core/src/PriceDeviationAlert.ts` - Price deviation alerts
- `packages/liquidity-core/src/RevertRateMonitor.ts` - Revert rate tracking

**Alerts:**
- Price deviation >X bps from oracle
- Revert rate spikes (switch to /noreverts path)
- Liquidity depletion warnings
- Gauge emission schedule reminders

### Phase 6: Integration with DreamNet

**Integration points:**
- **Dream deployment:** Auto-seed liquidity when dream token launches
- **Treasury management:** Use for large swaps
- **Agent integration:** Liquidity operations via agent tools

**Files to update:**
- `packages/dreamnet-control-core/src/TreasuryManager.ts` - Add liquidity methods
- `packages/deployment-core/src/index.ts` - Add liquidity seeding to deployment

## Success Criteria

- Liquidity successfully seeded on Aerodrome before epoch cutoff
- Concentrated liquidity positions on Uniswap v3/v4
- MEV protection preventing sandwich attacks
- TWAP execution reducing price impact
- Monitoring alerts working
- Integration with DreamNet deployment flow

## Risk Mitigation

- **Sandwich attacks:** MEV protection + private RPCs
- **Price impact:** TWAP + concentration bands
- **Liquidity depletion:** Cross-venue dispersion
- **Timing:** Epoch planner ensures gauge-staking before cutoff

