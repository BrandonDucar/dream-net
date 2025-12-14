# Liquidity Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Liquidity Core provides **client libraries** for liquidity operations in DreamNet, including Staked Liquidity Units (SLU) system, Aerodrome integration, Uniswap V3/V4 integration, MEV protection, TWAP execution, cross-venue dispersion, and SOL bridging. Enables sophisticated liquidity management and DeFi operations.

---

## Key Features

### SLU System
- Staked Liquidity Units pools
- Triple-yield (staking + swap fees + emissions)
- Pool management
- Reward claiming
- Auto-compounding

### DEX Integration
- Aerodrome pools
- Uniswap V3 liquidity ranges
- Uniswap V4 hooks
- Pool information
- Gauge information

### MEV Protection
- Flashbots protection
- MEV Blocker integration
- CoW Swap integration
- MEV-aware execution

### Advanced Features
- TWAP execution
- Cross-venue dispersion
- Concentration bands
- SOL bridging
- Liquidity seeding

---

## Architecture

### Components

1. **SLU System** (`SLUSystem.ts`)
   - SLU pool management
   - Liquidity operations
   - Reward management

2. **SLU Seeder** (`SLUSeeder.ts`)
   - Pool seeding
   - MEV-protected seeding
   - Batch operations

3. **Aerodrome Client** (`AerodromeClient.ts`)
   - Aerodrome pool integration
   - Gauge information
   - Pool operations

4. **Uniswap V3 Client** (`UniswapV3Client.ts`)
   - Uniswap V3 integration
   - Liquidity range management
   - Pool operations

5. **Uniswap V4 Client** (`UniswapV4Client.ts`)
   - Uniswap V4 integration
   - Hook support
   - Pool operations

6. **MEV Protection** (`MEVProtection.ts`, `FlashbotsProtect.ts`, `MEVBlocker.ts`)
   - MEV protection mechanisms
   - Flashbots integration
   - MEV Blocker integration

7. **CoW Swap** (`CoWSwap.ts`)
   - CoW Swap integration
   - Intent-based swaps
   - MEV protection

8. **TWAP Executor** (`TWAPExecutor.ts`)
   - Time-weighted average price execution
   - Clip-based execution
   - Price optimization

9. **Cross-Venue Dispersion** (`CrossVenueDispersion.ts`)
   - Multi-venue execution
   - Venue allocation
   - Optimal routing

10. **SOL Bridge** (`SOLBridge.ts`)
    - SOL bridging from Solana to Base
    - Wormhole integration
    - Portal integration

11. **Stake SPK Client** (`StakeSPKClient.ts`)
    - SPK staking
    - stSPK generation
    - Staking operations

12. **SLU Full Flow** (`SLUFullFlow.ts`)
    - Complete SLU flow
    - End-to-end operations
    - Flow orchestration

---

## API Reference

### SLU System

#### `SLUSystem`
SLU pool management system.

**Example**:
```typescript
import { SLUSystem } from '@dreamnet/liquidity-core';

const sluSystem = new SLUSystem(provider, signer);

// Register pool
sluSystem.registerPool({
  poolAddress: '0x...',
  stSPKAddress: '0x...',
  pairedTokenAddress: '0x...',
  pairedTokenSymbol: 'USDC',
  name: 'stSPK/USDC',
  symbol: 'SLU-stSPK-USDC',
});

// Add liquidity
const result = await sluSystem.addLiquidity(
  '0x...',
  BigInt('1000000000000000000'), // 1 stSPK
  BigInt('2000000000') // 2000 USDC (6 decimals)
);
```

#### `addLiquidity(poolAddress: string, stSPKAmount: bigint, pairedAmount: bigint, to?: string): Promise<{ txHash: string; liquidity: bigint }>`
Adds liquidity to SLU pool.

**Example**:
```typescript
const result = await sluSystem.addLiquidity(
  poolAddress,
  stSPKAmount,
  pairedAmount
);
```

#### `claimRewards(poolAddress: string, to?: string): Promise<SLURewards>`
Claims rewards from SLU pool.

**Example**:
```typescript
const rewards = await sluSystem.claimRewards(poolAddress);
console.log(`Staking rewards: ${rewards.totalStakingRewards}`);
console.log(`Swap fees: ${rewards.totalSwapFees}`);
console.log(`Emissions: ${rewards.totalEmissions}`);
```

### SLU Seeder

#### `SLUSeeder`
Admin tool for seeding SLU pools.

**Example**:
```typescript
import { SLUSeeder } from '@dreamnet/liquidity-core';

const seeder = new SLUSeeder(provider, signer, true); // Enable MEV protection

// Register pools
seeder.registerPools(pools);

// Seed all pools
const results = await seeder.seedAllPools({
  pools,
  stSPKAmounts: new Map([['0x...', BigInt('1000000000000000000')]]),
  pairedAmounts: new Map([['0x...', BigInt('2000000000')]]),
  useMEVProtection: true,
  mevProtectionType: 'flashbots',
});
```

### MEV Protection

#### `MEVProtection`
MEV protection wrapper.

**Example**:
```typescript
import { MEVProtection } from '@dreamnet/liquidity-core';

const mevProtection = new MEVProtection(provider, signer);
const protectedTx = await mevProtection.protect(transaction, 'flashbots');
```

### TWAP Executor

#### `TWAPExecutor`
Time-weighted average price executor.

**Example**:
```typescript
import { TWAPExecutor } from '@dreamnet/liquidity-core';

const executor = new TWAPExecutor(provider, signer);
await executor.executeTWAP({
  tokenIn: '0x...',
  tokenOut: '0x...',
  totalAmount: BigInt('1000000000000000000'),
  duration: 3600, // 1 hour
  clips: 10,
});
```

### SOL Bridge

#### `SOLBridge`
SOL bridging from Solana to Base.

**Example**:
```typescript
import { SOLBridge } from '@dreamnet/liquidity-core';

const bridge = new SOLBridge({
  bridgeType: 'wormhole',
  solanaRpcUrl: 'https://api.mainnet-beta.solana.com',
  baseRpcUrl: 'https://mainnet.base.org',
}, provider, signer);

const result = await bridge.bridgeSOL(BigInt('1000000000')); // 1 SOL
```

---

## Data Models

### SLUPoolConfig

```typescript
interface SLUPoolConfig {
  poolAddress: string;
  stSPKAddress: string;
  pairedTokenAddress: string;
  pairedTokenSymbol: string;
  name: string;
  symbol: string;
}
```

### SLUInfo

```typescript
interface SLUInfo {
  pool: string;
  stSPKAmount: bigint;
  pairedAmount: bigint;
  stakingRewards: bigint;
  swapFees: bigint;
  emissions: bigint;
}
```

### SLURewards

```typescript
interface SLURewards {
  totalStakingRewards: bigint;
  totalSwapFees: bigint;
  totalEmissions: bigint;
}
```

---

## SLU System Features

### Triple-Yield Mechanism
1. **Staking Rewards**: stSPK continues earning while in pool
2. **Swap Fees**: 0.3% per trade
3. **Emissions**: Gauge staking rewards

### Pool Operations
- Add liquidity
- Remove liquidity
- Swap tokens
- Claim rewards
- Auto-compound

---

## MEV Protection Types

### Flashbots
- Private mempool
- MEV protection
- Bundle submission

### MEV Blocker
- RPC-level protection
- Automatic protection
- Seamless integration

### CoW Swap
- Intent-based
- Batch auctions
- MEV protection

---

## Integration Points

### DreamNet Systems
- **Liquidity Engine**: Pool management
- **Economic Engine Core**: Economic tracking
- **DreamNet Cost Core**: Cost tracking
- **Stablecoin Core**: Stablecoin integration

### External Systems
- **Aerodrome**: DEX integration
- **Uniswap**: DEX integration
- **Flashbots**: MEV protection
- **Wormhole/Portal**: Cross-chain bridging

---

## Usage Examples

### Add SLU Liquidity

```typescript
const result = await sluSystem.addLiquidity(
  poolAddress,
  stSPKAmount,
  pairedAmount
);
```

### Seed Pools

```typescript
const results = await seeder.seedAllPools(config);
```

### Bridge SOL

```typescript
const result = await bridge.bridgeSOL(amount);
```

---

## Best Practices

1. **Liquidity Management**
   - Use MEV protection
   - Monitor pool health
   - Optimize allocations
   - Claim rewards regularly

2. **MEV Protection**
   - Use appropriate protection
   - Monitor protection effectiveness
   - Optimize for cost
   - Track MEV savings

---

## Security Considerations

1. **Transaction Security**
   - Use MEV protection
   - Validate amounts
   - Secure signer
   - Monitor transactions

2. **Pool Security**
   - Verify pool addresses
   - Validate pool configs
   - Monitor pool health
   - Audit pool operations

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

