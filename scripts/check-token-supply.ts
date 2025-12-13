#!/usr/bin/env tsx
/**
 * Check DREAM Token Total Supply and Distribution
 */

import { ethers } from 'ethers';

const DREAM_TOKEN_ADDRESS = '0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77';
const OWNER_ADDRESS = '0x57D7789E4E90f6FE692CAb607D69ec591581D354';
const BASE_RPC = process.env.BASE_MAINNET_RPC_URL || 'https://mainnet.base.org';

const ERC20_ABI = [
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
] as const;

async function checkSupply() {
  console.log('🔍 Checking DREAM Token Supply...\n');
  
  const provider = new ethers.providers.JsonRpcProvider(BASE_RPC);
  const contract = new ethers.Contract(DREAM_TOKEN_ADDRESS, ERC20_ABI, provider);

  try {
    const name = await contract.name();
    const symbol = await contract.symbol();
    const decimals = await contract.decimals();
    
    console.log(`Token: ${name} (${symbol})`);
    console.log(`Decimals: ${decimals}\n`);

    // Check total supply
    try {
      const totalSupply = await contract.totalSupply();
      const totalSupplyFormatted = ethers.utils.formatUnits(totalSupply, decimals);
      console.log(`📊 Total Supply: ${totalSupplyFormatted} ${symbol}`);
    } catch (e) {
      console.log('❌ Could not read totalSupply');
    }

    // Check owner balance
    try {
      const ownerBalance = await contract.balanceOf(OWNER_ADDRESS);
      const ownerBalanceFormatted = ethers.utils.formatUnits(ownerBalance, decimals);
      console.log(`💰 Owner Balance: ${ownerBalanceFormatted} ${symbol}`);
      console.log(`   Owner Address: ${OWNER_ADDRESS}`);
    } catch (e) {
      console.log('❌ Could not read owner balance');
    }

    // Check contract balance (if tokens are stuck in contract)
    try {
      const contractBalance = await contract.balanceOf(DREAM_TOKEN_ADDRESS);
      const contractBalanceFormatted = ethers.utils.formatUnits(contractBalance, decimals);
      if (contractBalance.gt(0)) {
        console.log(`📦 Contract Balance: ${contractBalanceFormatted} ${symbol} (tokens stuck in contract)`);
      }
    } catch (e) {
      // Ignore
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

checkSupply().catch(console.error);


