# Staked Liquidity Units (SLU) - User Guide

## Overview

**Staked Liquidity Units (SLUs)** are a novel DeFi innovation where staked tokens (stSPK) act as the **base asset** in liquidity pools, earning triple yield:
1. **Staking Rewards** - stSPK continues earning while in pool
2. **Swap Fees** - 0.3% fee on every trade
3. **Emissions** - Gauge staking rewards

## The Flow: SPK → stSPK → LP

### Step 1: Stake SPK to Get stSPK

**What happens**: You stake your SPK tokens and receive stSPK (Staked SPK) receipt tokens.

**How to do it**:

```typescript
import { StakeSPKClient } from '@dreamnet/liquidity-core';
import { ethers } from 'ethers';

// Setup
const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const stakeClient = new StakeSPKClient(
  {
    stSPKContractAddress: '0x...', // StakedSPK contract address
    spkTokenAddress: '0x...',      // SPK token address
  },
  provider,
  signer
);

// Stake SPK
const spkAmount = ethers.parseEther('1000'); // 1000 SPK
const result = await stakeClient.stakeSPK(spkAmount, 0); // 0 = no lock

console.log(`Staked ${ethers.formatEther(spkAmount)} SPK`);
console.log(`Received ${ethers.formatEther(result.stSPKReceived)} stSPK`);
console.log(`TX: ${result.txHash}`);
```

**What you get**: stSPK receipt tokens (1:1 ratio with SPK initially, grows with rewards)

**Optional Lock**: You can lock stSPK for a period (e.g., 30 days) to potentially earn higher rewards.

### Step 2: Add stSPK + Paired Token to LP

**What happens**: You add stSPK + another token (DREAM/USDC/ETH/SOL) to the SLU pool and receive SLU tokens.

**How to do it**:

```typescript
import { SLUSystem } from '@dreamnet/liquidity-core';

const sluSystem = new SLUSystem(provider, signer);

// Register pool
sluSystem.registerPool({
  poolAddress: '0x...', // SLUPool contract address
  stSPKAddress: '0x...',
  pairedTokenAddress: '0x...', // DREAM/USDC/ETH/SOL
  pairedTokenSymbol: 'DREAM',
  name: 'SLU-DREAM',
  symbol: 'SLU-DREAM',
});

// Add liquidity
const stSPKAmount = ethers.parseEther('100'); // 100 stSPK
const pairedAmount = ethers.parseEther('100'); // 100 DREAM (or whatever ratio)

const result = await sluSystem.addLiquidity(
  '0x...', // pool address
  stSPKAmount,
  pairedAmount
);

console.log(`Added liquidity`);
console.log(`Received ${ethers.formatEther(result.liquidity)} SLU tokens`);
console.log(`TX: ${result.txHash}`);
```

**What you get**: SLU tokens representing your position in the pool

**Triple Yield**: Your SLU tokens now earn:
- Staking rewards (from stSPK)
- Swap fees (from trades)
- Emissions (from gauge staking)

### Step 3: Claim Rewards (Optional)

**What happens**: You claim accumulated rewards (staking + fees + emissions).

**How to do it**:

```typescript
const rewards = await sluSystem.claimRewards('0x...'); // pool address

console.log(`Claimed rewards`);
console.log(`Staking: ${ethers.formatEther(rewards.stakingRewards)}`);
console.log(`Fees: ${ethers.formatEther(rewards.swapFees)}`);
console.log(`Emissions: ${ethers.formatEther(rewards.emissions)}`);
```

**Auto-Compounding**: Rewards are automatically reinvested into the pool (increases your SLU value over time).

## Complete Flow Script

**For admins seeding pools**:

```bash
# Set environment variables
export PRIVATE_KEY="your-private-key"
export RPC_URL="https://mainnet.base.org"
export STSPK_CONTRACT_ADDRESS="0x..."
export SPK_TOKEN_ADDRESS="0x..."
export POOL_ADDRESSES="0x...,0x...,0x...,0x..."
export PAIRED_TOKEN_ADDRESSES="0x...,0x...,0x...,0x..."
export PAIRED_TOKEN_SYMBOLS="DREAM,USDC,ETH,SOL"
export SPK_AMOUNT="10000"  # Amount of SPK to stake
export PAIRED_AMOUNT_PER_POOL="1000"  # Amount of paired token per pool
export USE_MEV_PROTECTION="true"

# Run script
pnpm tsx scripts/seed-slupools.ts
```

**What it does**:
1. Stakes SPK → gets stSPK
2. Adds liquidity to all 4 pools (stSPK+DREAM, stSPK+USDC, stSPK+ETH, stSPK+SOL)
3. Uses MEV protection (Flashbots/MEV-Blocker) to prevent front-running

## If You Already Have stSPK

**Skip Step 1** and go straight to Step 2:

```bash
# Set STSPK_AMOUNT instead of SPK_AMOUNT
export STSPK_AMOUNT="5000"  # Amount of stSPK you already have
export SPK_AMOUNT=""  # Leave empty

# Run script
pnpm tsx scripts/seed-slupools.ts
```

## Using the Full Flow Client

**For programmatic use**:

```typescript
import { SLUFullFlow } from '@dreamnet/liquidity-core';

const flow = new SLUFullFlow(
  {
    stSPKContractAddress: '0x...',
    spkTokenAddress: '0x...',
    pools: [
      { poolAddress: '0x...', pairedTokenSymbol: 'DREAM', ... },
      // ... more pools
    ],
    spkAmountToStake: ethers.parseEther('10000'),
    pairedTokenAmounts: new Map([
      ['0x...', ethers.parseEther('1000')], // pool => amount
    ]),
    useMEVProtection: true,
  },
  provider,
  signer
);

// Execute full flow
const results = await flow.executeFullFlow(config);
```

## Checking Your Position

**View your SLU info**:

```typescript
const sluInfo = await sluSystem.getSLUInfo(
  '0x...', // pool address
  '0x...'  // your address
);

console.log(`Your Position:`);
console.log(`  stSPK: ${ethers.formatEther(sluInfo.stSPKAmount)}`);
console.log(`  Paired Token: ${ethers.formatEther(sluInfo.pairedAmount)}`);
console.log(`  Staking Rewards: ${ethers.formatEther(sluInfo.stakingRewards)}`);
console.log(`  Swap Fees: ${ethers.formatEther(sluInfo.swapFees)}`);
console.log(`  Emissions: ${ethers.formatEther(sluInfo.emissions)}`);
```

## Removing Liquidity

**When you want to exit**:

```typescript
const liquidity = ethers.parseEther('50'); // Amount of SLU tokens to remove

const result = await sluSystem.removeLiquidity(
  '0x...', // pool address
  liquidity
);

console.log(`Removed liquidity`);
console.log(`Received ${ethers.formatEther(result.stSPKAmount)} stSPK`);
console.log(`Received ${ethers.formatEther(result.pairedAmount)} paired token`);
```

**Note**: You'll receive stSPK back (not SPK). To convert stSPK → SPK, use `unstakeSPK()`:

```typescript
const stakeClient = new StakeSPKClient(...);
const result = await stakeClient.unstakeSPK(stSPKAmount);
// Now you have SPK back
```

## Summary

**The Complete Journey**:

```
1. SPK (in wallet)
   ↓ stake()
2. stSPK (receipt token, earning staking rewards)
   ↓ addLiquidity()
3. SLU tokens (earning triple yield: staking + fees + emissions)
   ↓ claimRewards() / autoCompound()
4. More SLU tokens (rewards reinvested)
   ↓ removeLiquidity()
5. stSPK + paired token (back in wallet)
   ↓ unstake()
6. SPK + paired token (original tokens back)
```

**Key Points**:
- **stSPK** is the receipt token you get from staking SPK
- **SLU tokens** represent your position in the liquidity pool
- **Triple yield** = staking rewards + swap fees + emissions
- **Auto-compounding** = rewards automatically reinvested
- **MEV protection** = use Flashbots/MEV-Blocker when seeding

---

**Questions?** Check the main documentation: `docs/STAKED_LIQUIDITY_UNITS_SYSTEM.md`

