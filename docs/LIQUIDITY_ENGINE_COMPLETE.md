# Liquidity Engine - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Liquidity Engine provides **liquidity pool management** for DreamNet. It manages liquidity pool configurations, tracks pool states (planned, deployed, active), monitors pool health, and supports Staked Liquidity Units (SLU) pools with triple-yield rewards.

---

## Key Features

### Pool Management
- Pool configuration
- Pool state tracking
- Pool health monitoring
- Pool deployment tracking

### Pool States
- **Planned**: Intended, not on-chain yet
- **Deployed**: Pair contract exists, may be empty
- **Active**: Has liquidity + live trading
- **Deprecated**: No longer used

### Pool Health
- **Unknown**: Health not determined
- **Thin**: Low liquidity
- **Healthy**: Good liquidity
- **Imbalanced**: Token imbalance

### Staked Liquidity Units (SLU)
- Triple-yield pools
- Staking rewards
- Swap fees
- Emissions rewards
- Auto-compound support

---

## Architecture

### Components

1. **Liquidity Store** (`store/liquidityStore.ts`)
   - Config storage
   - Status storage
   - Pool management

2. **Pool Planner** (`logic/poolPlanner.ts`)
   - Pool seeding
   - Pool deployment
   - Pool activation

3. **Liquidity Scheduler** (`scheduler/liquidityScheduler.ts`)
   - Cycle execution
   - Status updates

---

## API Reference

### Configuration

#### `initConfigs(): void`
Initializes default liquidity configurations.

#### `upsertConfig(config: LiquidityPoolConfig): LiquidityPoolConfig`
Creates or updates a pool configuration.

**Example**:
```typescript
import { LiquidityEngine } from '@dreamnet/liquidity-engine';

LiquidityEngine.upsertConfig({
  id: 'pool:DREAM-SPK',
  label: 'DREAM / SPK',
  tokenA: {
    symbol: 'DREAM',
    chain: 'base',
  },
  tokenB: {
    symbol: 'SPK',
    chain: 'base',
  },
  preferred: true,
  category: 'growth',
  routingPriority: 1,
  dex: 'aerodrome',
});
```

#### `getConfig(id: string): LiquidityPoolConfig | undefined`
Gets pool configuration.

#### `listConfigs(): LiquidityPoolConfig[]`
Lists all pool configurations.

### Status Management

#### `getStatus(configId: string): LiquidityPoolStatus | undefined`
Gets pool status.

#### `listStatuses(): LiquidityPoolStatus[]`
Lists all pool statuses.

#### `markPoolDeployed(configId: string, pairAddress: string): void`
Marks pool as deployed.

#### `markPoolActive(configId: string): void`
Marks pool as active.

### Execution

#### `run(context: LiquidityEngineContext): LiquidityEngineStatus`
Runs Liquidity Engine cycle.

#### `status(): LiquidityEngineStatus`
Gets Liquidity Engine status.

---

## Data Models

### PoolState

```typescript
type PoolState =
  | 'planned'
  | 'deployed'
  | 'active'
  | 'deprecated';
```

### PoolHealth

```typescript
type PoolHealth =
  | 'unknown'
  | 'thin'
  | 'healthy'
  | 'imbalanced';
```

### LiquidityPoolConfig

```typescript
interface LiquidityPoolConfig {
  id: string;
  label: string;
  tokenA: TokenSide;
  tokenB: TokenSide;
  preferred?: boolean;
  category?: 'growth' | 'prestige' | 'stable' | 'experimental';
  routingPriority?: number;
  dex?: 'aerodrome' | 'uniswap-v3' | 'unknown';
  pairAddress?: string;
}
```

### LiquidityPoolStatus

```typescript
interface LiquidityPoolStatus {
  configId: string;
  state: PoolState;
  health: PoolHealth;
  totalLiquidityUSD?: number;
  volume24hUSD?: number;
  feeAprEstimate?: number;
  seeded?: boolean;
  updatedAt: number;
}
```

### SLUPoolConfig

```typescript
interface SLUPoolConfig extends LiquidityPoolConfig {
  stSPKAddress?: string;
  isStakedPool: boolean;
  sluPoolAddress?: string;
  wrapperAddress?: string;
}
```

### SLUInfo

```typescript
interface SLUInfo {
  pool: string;
  stSPKAmount: number;
  pairedAmount: number;
  stakingRewards: number;
  swapFees: number;
  emissions: number;
}
```

---

## Default Pools

### DREAM Pairs
- DREAM/SPK (preferred, growth)
- DREAM/AERO (growth)
- DREAM/ETH (prestige)
- DREAM/USDT (stable)

### SHEEP Pairs
- SHEEP/SPK (preferred, growth)
- SHEEP/AERO (growth)
- SHEEP/ETH (prestige)
- SHEEP/USDT (stable)

---

## Staked Liquidity Units (SLU)

### Triple-Yield System
1. **Staking Rewards**: stSPK continues earning while in pool
2. **Swap Fees**: 0.3% per trade
3. **Emissions**: Gauge staking rewards

### Auto-Compound
- Automatic reward compounding
- Configurable compound frequency
- Last compound tracking

---

## Integration Points

### DreamNet Systems
- **Field Layer**: Risk/trust fields
- **Neural Mesh**: Memory integration
- **Civic Panel**: Status display

### External Systems
- **DEXs**: Aerodrome, Uniswap V3
- **Blockchain**: On-chain pool data
- **Analytics**: Pool analytics

---

## Usage Examples

### Initialize Configs

```typescript
LiquidityEngine.initConfigs();
```

### Create Pool Config

```typescript
const config = LiquidityEngine.upsertConfig({
  id: 'pool:DREAM-SPK',
  label: 'DREAM / SPK',
  tokenA: { symbol: 'DREAM', chain: 'base' },
  tokenB: { symbol: 'SPK', chain: 'base' },
  preferred: true,
  category: 'growth',
  routingPriority: 1,
  dex: 'aerodrome',
});
```

### Mark Pool Deployed

```typescript
LiquidityEngine.markPoolDeployed('pool:DREAM-SPK', '0x1234...');
```

### Mark Pool Active

```typescript
LiquidityEngine.markPoolActive('pool:DREAM-SPK');
```

### Get Status

```typescript
const status = LiquidityEngine.getStatus('pool:DREAM-SPK');
console.log(`State: ${status?.state}`);
console.log(`Health: ${status?.health}`);
console.log(`Liquidity: $${status?.totalLiquidityUSD}`);
```

---

## Best Practices

1. **Pool Configuration**
   - Use clear IDs
   - Set appropriate categories
   - Define routing priorities
   - Mark preferred pairs

2. **Pool Management**
   - Track deployment
   - Monitor health
   - Update status regularly
   - Seed pools appropriately

---

## Security Considerations

1. **Pool Security**
   - Validate configurations
   - Protect pool data
   - Audit pool changes
   - Secure deployments

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

