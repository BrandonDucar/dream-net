#!/usr/bin/env tsx
/**
 * Calculate SLU Seeding Amounts
 * 
 * Helps you figure out how to distribute your stSPK across pools
 * 
 * Usage:
 *   pnpm tsx scripts/calculate-sluseeding.ts --total=1000 --currency=USD
 */

// Simple calculation script - no ethers needed

interface PoolConfig {
  symbol: string;
  name: string;
  recommendedRatio: number; // Percentage of total
  minLiquidity?: number; // Minimum USD for healthy pool
}

const POOLS: PoolConfig[] = [
  {
    symbol: 'DREAM',
    name: 'stSPK + DREAM',
    recommendedRatio: 30, // 30% - Primary pair
    minLiquidity: 200,
  },
  {
    symbol: 'USDC',
    name: 'stSPK + USDC',
    recommendedRatio: 30, // 30% - Stable pair
    minLiquidity: 200,
  },
  {
    symbol: 'ETH',
    name: 'stSPK + ETH',
    recommendedRatio: 25, // 25% - Prestige pair
    minLiquidity: 150,
  },
  {
    symbol: 'SOL',
    name: 'stSPK + SOL',
    recommendedRatio: 15, // 15% - Experimental pair
    minLiquidity: 100,
  },
];

interface CalculationResult {
  totalUSD: number;
  pools: Array<{
    symbol: string;
    name: string;
    stSPKUSD: number;
    pairedTokenUSD: number;
    totalLiquidityUSD: number;
    stSPKAmount: string; // Formatted
    pairedTokenAmount: string; // Formatted
    ratio: string; // e.g., "1:1"
  }>;
  summary: {
    totalStSPKUSD: number;
    totalPairedTokenUSD: number;
    totalLiquidityUSD: number;
    remainingUSD: number;
  };
}

/**
 * Calculate optimal distribution
 */
function calculateSeeding(
  totalUSD: number,
  stSPKPriceUSD: number = 1, // Default: assume 1:1 with SPK
  useEqualPairs: boolean = true // If true, stSPK:paired = 1:1
): CalculationResult {
  const pools = POOLS.map(pool => {
    const stSPKUSD = (totalUSD * pool.recommendedRatio) / 100;
    const pairedTokenUSD = useEqualPairs ? stSPKUSD : stSPKUSD * 0.5; // 1:1 or 2:1 ratio
    
    // Convert to token amounts (assuming 18 decimals, formatted as string)
    const stSPKAmount = (stSPKUSD / stSPKPriceUSD).toFixed(4);
    
    // For paired tokens, assume same price for simplicity (adjust as needed)
    const pairedTokenPrice = 1; // Adjust based on actual token price
    const pairedTokenAmount = (pairedTokenUSD / pairedTokenPrice).toFixed(4);

    return {
      symbol: pool.symbol,
      name: pool.name,
      stSPKUSD: Math.round(stSPKUSD * 100) / 100,
      pairedTokenUSD: Math.round(pairedTokenUSD * 100) / 100,
      totalLiquidityUSD: Math.round((stSPKUSD + pairedTokenUSD) * 100) / 100,
      stSPKAmount,
      pairedTokenAmount,
      ratio: useEqualPairs ? '1:1' : '2:1',
    };
  });

  const totalStSPKUSD = pools.reduce((sum, p) => sum + p.stSPKUSD, 0);
  const totalPairedTokenUSD = pools.reduce((sum, p) => sum + p.pairedTokenUSD, 0);
  const totalLiquidityUSD = totalStSPKUSD + totalPairedTokenUSD;
  const remainingUSD = totalUSD - totalStSPKUSD;

  return {
    totalUSD,
    pools,
    summary: {
      totalStSPKUSD: Math.round(totalStSPKUSD * 100) / 100,
      totalPairedTokenUSD: Math.round(totalPairedTokenUSD * 100) / 100,
      totalLiquidityUSD: Math.round(totalLiquidityUSD * 100) / 100,
      remainingUSD: Math.round(remainingUSD * 100) / 100,
    },
  };
}

/**
 * Print results
 */
function printResults(result: CalculationResult) {
  console.log('\n💰 SLU Pool Seeding Calculator\n');
  console.log(`Total Budget: $${result.totalUSD.toLocaleString()}\n`);
  console.log('📊 Recommended Distribution:\n');

  result.pools.forEach((pool, i) => {
    console.log(`${i + 1}. ${pool.name}`);
    console.log(`   stSPK:     $${pool.stSPKUSD.toLocaleString()} (${pool.stSPKAmount} stSPK)`);
    console.log(`   ${pool.symbol.padEnd(6)}: $${pool.pairedTokenUSD.toLocaleString()} (${pool.pairedTokenAmount} ${pool.symbol})`);
    console.log(`   Total LP:  $${pool.totalLiquidityUSD.toLocaleString()} (${pool.ratio} ratio)`);
    console.log('');
  });

  console.log('📈 Summary:');
  console.log(`   Total stSPK:     $${result.summary.totalStSPKUSD.toLocaleString()}`);
  console.log(`   Total Paired:   $${result.summary.totalPairedTokenUSD.toLocaleString()}`);
  console.log(`   Total Liquidity: $${result.summary.totalLiquidityUSD.toLocaleString()}`);
  if (result.summary.remainingUSD > 0) {
    console.log(`   Remaining:       $${result.summary.remainingUSD.toLocaleString()}`);
  }
  console.log('');

  console.log('💡 Recommendations:');
  console.log('   • Start with DREAM and USDC pools (most liquid)');
  console.log('   • ETH pool for prestige/volume');
  console.log('   • SOL pool is experimental (can skip if budget tight)');
  console.log('   • Minimum $200 per pool for healthy liquidity');
  console.log('   • Use MEV protection when seeding');
  console.log('');
}

/**
 * Generate environment variables
 */
function generateEnvVars(result: CalculationResult) {
  console.log('📝 Environment Variables for seed-slupools.ts:\n');
  
  const stSPKAmounts = result.pools.map(p => p.stSPKAmount);
  const pairedAmounts = result.pools.map(p => p.pairedTokenAmount);
  const symbols = result.pools.map(p => p.symbol);
  
  const totalStSPK = stSPKAmounts.reduce((sum, amt) => sum + parseFloat(amt), 0);
  console.log(`# Total stSPK to use: ${totalStSPK.toFixed(4)}`);
  console.log(`export STSPK_AMOUNT="${totalStSPK.toFixed(4)}"`);
  console.log(`export PAIRED_AMOUNT_PER_POOL="${pairedAmounts[0]}"  # Adjust per pool if needed`);
  console.log(`export PAIRED_TOKEN_SYMBOLS="${symbols.join(',')}"`);
  console.log('');
  console.log('# Per-pool amounts (if using custom amounts):');
  result.pools.forEach((pool, i) => {
    console.log(`# Pool ${i + 1} (${pool.symbol}):`);
    console.log(`#   stSPK: ${pool.stSPKAmount}`);
    console.log(`#   ${pool.symbol}: ${pool.pairedTokenAmount}`);
  });
  console.log('');
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const totalArg = args.find(a => a.startsWith('--total='));
  const currencyArg = args.find(a => a.startsWith('--currency='));
  const equalPairsArg = args.find(a => a === '--equal-pairs');

  const totalUSD = totalArg ? parseFloat(totalArg.split('=')[1]) : 1000;
  const currency = currencyArg ? currencyArg.split('=')[1] : 'USD';
  const useEqualPairs = equalPairsArg === undefined ? true : true; // Default to 1:1

  if (isNaN(totalUSD) || totalUSD <= 0) {
    console.error('Error: Invalid total amount');
    console.log('Usage: pnpm tsx scripts/calculate-sluseeding.ts --total=1000 [--equal-pairs]');
    process.exit(1);
  }

  // Calculate
  const result = calculateSeeding(totalUSD, 1, useEqualPairs);

  // Print
  printResults(result);
  generateEnvVars(result);

  // Warnings
  if (result.summary.totalLiquidityUSD < 800) {
    console.log('⚠️  Warning: Total liquidity < $800 may result in thin pools');
    console.log('   Consider focusing on 2-3 pools instead of all 4\n');
  }

  const minPool = Math.min(...result.pools.map(p => p.totalLiquidityUSD));
  if (minPool < 200) {
    console.log('⚠️  Warning: Some pools below $200 minimum');
    console.log('   Consider rebalancing or skipping smaller pools\n');
  }
}

main().catch(console.error);

