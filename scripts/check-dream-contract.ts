#!/usr/bin/env tsx
/**
 * Check DREAM Token Contract Functions
 * 
 * This script checks what functions are available on the DREAM token contract.
 */

import { ethers } from 'ethers';

const DREAM_TOKEN_ADDRESS = '0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77';
const BASE_RPC = process.env.BASE_MAINNET_RPC_URL || 'https://mainnet.base.org';

// Standard ERC20 ABI (read-only functions)
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function owner() view returns (address)',
] as const;

// Common mint function signatures
const MINT_ABI_VARIANTS = [
  'function mint(address to, uint256 amount)',
  'function mint(uint256 amount)',
  'function mint(address to)',
] as const;

async function checkContract() {
  console.log('🔍 Checking DREAM Token Contract...\n');
  console.log(`Address: ${DREAM_TOKEN_ADDRESS}`);
  console.log(`RPC: ${BASE_RPC}\n`);

  const provider = new ethers.providers.JsonRpcProvider(BASE_RPC);

  try {
    // Try to read basic ERC20 info
    const contract = new ethers.Contract(DREAM_TOKEN_ADDRESS, ERC20_ABI, provider);

    console.log('📋 Basic Contract Info:');
    try {
      const name = await contract.name();
      console.log(`  Name: ${name}`);
    } catch (e) {
      console.log('  Name: Not available');
    }

    try {
      const symbol = await contract.symbol();
      console.log(`  Symbol: ${symbol}`);
    } catch (e) {
      console.log('  Symbol: Not available');
    }

    try {
      const decimals = await contract.decimals();
      console.log(`  Decimals: ${decimals}`);
    } catch (e) {
      console.log('  Decimals: Not available');
    }

    try {
      const totalSupply = await contract.totalSupply();
      console.log(`  Total Supply: ${ethers.formatUnits(totalSupply, 18)}`);
    } catch (e) {
      console.log('  Total Supply: Not available');
    }

    try {
      const owner = await contract.owner();
      console.log(`  Owner: ${owner}`);
    } catch (e) {
      console.log('  Owner: Not available (may not have Ownable)');
    }

    console.log('\n🔎 Checking for mint function...\n');

    // Try each mint variant
    let hasMint = false;
    for (const mintAbi of MINT_ABI_VARIANTS) {
      try {
        const mintContract = new ethers.Contract(DREAM_TOKEN_ADDRESS, [mintAbi], provider);
        // Try to call it (will fail but tells us if function exists)
        await mintContract.mint.staticCall('0x0000000000000000000000000000000000000000', 0).catch(() => {});
        console.log(`  ✅ Found mint function: ${mintAbi}`);
        hasMint = true;
        break;
      } catch (e: any) {
        // Check if error is about function not found vs other error
        if (e.message?.includes('function') || e.code === 'CALL_EXCEPTION') {
          // Function might exist but call failed - that's okay
          try {
            // Try to get function fragment
            const iface = new ethers.Interface([mintAbi]);
            const fragment = iface.getFunction('mint');
            if (fragment) {
              console.log(`  ✅ Found mint function: ${mintAbi}`);
              hasMint = true;
              break;
            }
          } catch {
            // Function doesn't exist
          }
        }
      }
    }

    if (!hasMint) {
      console.log('  ❌ No mint function found');
      console.log('\n💡 Options:');
      console.log('  1. Transfer tokens from your wallet to agent wallets');
      console.log('  2. Deploy a new token contract with minting');
      console.log('  3. Check if contract has a different minting mechanism');
    } else {
      console.log('\n✅ Contract has mint function!');
      console.log('   You can use the minting script to fund agent wallets.');
    }

    // Check contract bytecode to see if it's verified
    const code = await provider.getCode(DREAM_TOKEN_ADDRESS);
    if (code === '0x') {
      console.log('\n⚠️  Warning: No contract code found at this address');
    } else {
      console.log(`\n✅ Contract code found (${code.length / 2 - 1} bytes)`);
    }

  } catch (error: any) {
    console.error('\n❌ Error checking contract:', error.message);
  }
}

checkContract().catch(console.error);

