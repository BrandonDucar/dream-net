#!/usr/bin/env tsx
import { ethers } from "ethers";

async function main() {
  const walletAddress = "0x57d7789e4e90f6fe692cab607d69ec591581d354";
  
  console.log("🔍 Checking wallet:", walletAddress);
  console.log("");
  
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const balance = await provider.getBalance(walletAddress);
  const balanceEth = parseFloat(ethers.formatEther(balance));
  const balanceUsd = balanceEth * 3000;
  
  console.log(`Balance: ${balanceEth.toFixed(6)} ETH (~$${balanceUsd.toFixed(2)})`);
  
  // Check gas costs
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice || 0n;
  
  const dreamTokenCost = gasPrice * 1_500_000n;
  const dreamTokenEth = parseFloat(ethers.formatEther(dreamTokenCost));
  const dreamTokenUsd = dreamTokenEth * 3000;
  
  const allContractsCost = gasPrice * (1_500_000n + 1_500_000n + 3_000_000n + 3_000_000n + 2_500_000n);
  const allContractsEth = parseFloat(ethers.formatEther(allContractsCost));
  const allContractsUsd = allContractsEth * 3000;
  
  console.log(`\nGas costs:`);
  console.log(`  DreamToken: ~$${dreamTokenUsd.toFixed(2)}`);
  console.log(`  All contracts: ~$${allContractsUsd.toFixed(2)}`);
  
  if (balanceEth === 0) {
    console.log("\n❌ No ETH found. Make sure you've swapped to Base mainnet!");
  } else if (balance >= allContractsCost) {
    console.log("\n✅ You have enough to deploy ALL contracts!");
    console.log("   Run: pnpm deploy:base-mainnet");
  } else if (balance >= dreamTokenCost) {
    console.log("\n✅ You have enough to deploy DreamToken!");
    console.log("   Run: pnpm deploy:essential");
  } else {
    const needed = dreamTokenCost - balance;
    const neededEth = parseFloat(ethers.formatEther(needed));
    const neededUsd = neededEth * 3000;
    console.log(`\n⚠️  Need ~$${neededUsd.toFixed(2)} more for deployment`);
  }
  
  console.log("\n💡 Make sure the private key in .env matches this wallet!");
}

main().catch(console.error);

