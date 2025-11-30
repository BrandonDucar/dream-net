#!/usr/bin/env tsx
/**
 * Seed SLU Pools - Admin script to seed all SLU pools
 * 
 * Usage:
 *   pnpm tsx scripts/seed-slupools.ts
 * 
 * Environment Variables Required:
 *   - PRIVATE_KEY: Admin wallet private key
 *   - RPC_URL: Base RPC endpoint
 *   - STSPK_CONTRACT_ADDRESS: StakedSPK contract address
 *   - SPK_TOKEN_ADDRESS: SPK token contract address
 *   - POOL_ADDRESSES: Comma-separated pool addresses
 *   - PAIRED_TOKEN_ADDRESSES: Comma-separated paired token addresses
 *   - STSPK_AMOUNT: Amount of stSPK to use (or SPK_AMOUNT to stake first)
 */

import { ethers } from 'ethers';
import { SLUFullFlow, type FullFlowConfig } from '../packages/liquidity-core/src/SLUFullFlow.js';
import { type SLUPoolConfig } from '../packages/liquidity-core/src/SLUSystem.js';

async function main() {
  // Load config from environment
  const privateKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.RPC_URL || 'https://mainnet.base.org';
  const stSPKContractAddress = process.env.STSPK_CONTRACT_ADDRESS;
  const spkTokenAddress = process.env.SPK_TOKEN_ADDRESS;
  
  const poolAddresses = process.env.POOL_ADDRESSES?.split(',') || [];
  const pairedTokenAddresses = process.env.PAIRED_TOKEN_ADDRESSES?.split(',') || [];
  const pairedTokenSymbols = process.env.PAIRED_TOKEN_SYMBOLS?.split(',') || ['DREAM', 'USDC', 'ETH', 'SOL'];
  
  const spkAmountToStake = process.env.SPK_AMOUNT 
    ? ethers.parseEther(process.env.SPK_AMOUNT)
    : BigInt(0);
  
  const stSPKAmount = process.env.STSPK_AMOUNT
    ? ethers.parseEther(process.env.STSPK_AMOUNT)
    : BigInt(0);

  // Validate config
  if (!privateKey) {
    throw new Error('PRIVATE_KEY environment variable required');
  }
  if (!stSPKContractAddress) {
    throw new Error('STSPK_CONTRACT_ADDRESS environment variable required');
  }
  if (!spkTokenAddress) {
    throw new Error('SPK_TOKEN_ADDRESS environment variable required');
  }
  if (poolAddresses.length === 0) {
    throw new Error('POOL_ADDRESSES environment variable required');
  }
  if (spkAmountToStake === BigInt(0) && stSPKAmount === BigInt(0)) {
    throw new Error('Either SPK_AMOUNT or STSPK_AMOUNT must be provided');
  }

  // Setup provider and signer
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);

  console.log('🔐 Connected wallet:', await signer.getAddress());
  console.log('🌐 RPC:', rpcUrl);
  console.log('');

  // Build pool configs
  const pools: SLUPoolConfig[] = poolAddresses.map((address, i) => ({
    poolAddress: address.trim(),
    stSPKAddress: stSPKContractAddress,
    pairedTokenAddress: pairedTokenAddresses[i]?.trim() || '',
    pairedTokenSymbol: pairedTokenSymbols[i] || 'TOKEN',
    name: `SLU-${pairedTokenSymbols[i] || 'TOKEN'}`,
    symbol: `SLU-${pairedTokenSymbols[i] || 'TOKEN'}`,
  }));

  console.log('📊 Pool Configuration:');
  pools.forEach((pool, i) => {
    console.log(`   ${i + 1}. ${pool.label || pool.pairedTokenSymbol} Pool: ${pool.poolAddress}`);
  });
  console.log('');

  // Build full flow config
  const pairedAmounts = new Map<string, bigint>();
  
  // For now, use equal amounts (you can customize this)
  const pairedAmountPerPool = process.env.PAIRED_AMOUNT_PER_POOL
    ? ethers.parseEther(process.env.PAIRED_AMOUNT_PER_POOL)
    : BigInt(0);

  pools.forEach(pool => {
    if (pairedAmountPerPool > BigInt(0)) {
      pairedAmounts.set(pool.poolAddress, pairedAmountPerPool);
    }
  });

  const config: FullFlowConfig = {
    stSPKContractAddress,
    spkTokenAddress,
    pools,
    spkAmountToStake,
    pairedTokenAmounts: pairedAmounts,
    lockDuration: parseInt(process.env.LOCK_DURATION || '0'),
    useMEVProtection: process.env.USE_MEV_PROTECTION === 'true',
  };

  // Execute flow
  const flow = new SLUFullFlow(config, provider, signer);

  if (spkAmountToStake > BigInt(0)) {
    console.log('🚀 Starting FULL flow: SPK → stSPK → LP');
    console.log(`   Staking ${ethers.formatEther(spkAmountToStake)} SPK...`);
    console.log('');
    
    const results = await flow.executeFullFlow(config);
    
    console.log('');
    console.log('📋 Results:');
    results.forEach((result, i) => {
      if (result.success) {
        console.log(`   ✅ Step ${i + 1} (${result.step}): Success`);
        console.log(`      TX: ${result.txHash}`);
        if (result.stSPKReceived) {
          console.log(`      stSPK: ${ethers.formatEther(result.stSPKReceived)}`);
        }
        if (result.liquidityReceived) {
          console.log(`      Liquidity: ${ethers.formatEther(result.liquidityReceived)}`);
        }
      } else {
        console.log(`   ❌ Step ${i + 1} (${result.step}): Failed`);
        console.log(`      Error: ${result.error}`);
      }
    });
  } else if (stSPKAmount > BigInt(0)) {
    console.log('🚀 Starting PARTIAL flow: stSPK → LP (skipping staking)');
    console.log(`   Using existing ${ethers.formatEther(stSPKAmount)} stSPK...`);
    console.log('');
    
    // Just add liquidity to each pool
    const stSPKPerPool = stSPKAmount / BigInt(pools.length);
    
    for (const pool of pools) {
      const pairedAmount = pairedAmounts.get(pool.poolAddress);
      if (!pairedAmount) {
        console.log(`   ⚠️  Skipping ${pool.pairedTokenSymbol} pool (no paired amount)`);
        continue;
      }

      console.log(`   Adding liquidity to ${pool.pairedTokenSymbol} pool...`);
      const result = await flow.justAddLiquidity(
        pool.poolAddress,
        stSPKPerPool,
        pairedAmount
      );

      if (result.success) {
        console.log(`   ✅ Success: ${result.txHash}`);
      } else {
        console.log(`   ❌ Failed: ${result.error}`);
      }
    }
  }

  console.log('');
  console.log('✨ Done!');
}

main().catch(console.error);

