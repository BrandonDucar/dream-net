#!/usr/bin/env tsx
import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  console.log("🔍 Verifying Account & Balance\n");
  
  const [signer] = await ethers.getSigners();
  console.log("Account from .env private key:", signer.address);
  console.log("\n⚠️  Make sure this matches your MetaMask account with ETH!\n");
  
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const balance = await provider.getBalance(signer.address);
  const balanceEth = parseFloat(ethers.formatEther(balance));
  const balanceUsd = balanceEth * 3000;
  
  console.log(`Balance: ${balanceEth.toFixed(6)} ETH (~$${balanceUsd.toFixed(2)})`);
  
  if (balanceEth === 0) {
    console.log("\n❌ No ETH found on this account.");
    console.log("\nTo fix:");
    console.log("1. Check your MetaMask - what address has the ETH?");
    console.log("2. Make sure that address's private key is in .env");
    console.log("3. Or send ETH to this address:", signer.address);
    return;
  }
  
  // Check if we can deploy
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice || 0n;
  
  const dreamTokenGas = 1_500_000n;
  const dreamTokenCost = gasPrice * dreamTokenGas;
  const dreamTokenEth = parseFloat(ethers.formatEther(dreamTokenCost));
  const dreamTokenUsd = dreamTokenEth * 3000;
  
  console.log(`\nDreamToken cost: ~${dreamTokenEth.toFixed(6)} ETH (~$${dreamTokenUsd.toFixed(2)})`);
  
  if (balance >= dreamTokenCost) {
    console.log("\n✅ You have enough to deploy DreamToken!");
    
    const sheepTokenCost = gasPrice * 1_500_000n;
    if (balance >= dreamTokenCost + sheepTokenCost) {
      console.log("✅ You can deploy DreamToken + SheepToken!");
      
      const totalCost = dreamTokenCost + sheepTokenCost + 
                       (gasPrice * 3_000_000n) + // DreamerPass
                       (gasPrice * 3_000_000n) + // SubscriptionBadge
                       (gasPrice * 2_500_000n);  // SubscriptionHub
      
      if (balance >= totalCost) {
        console.log("✅ You can deploy ALL contracts!");
        console.log("\n🚀 Ready to deploy! Run: pnpm deploy:base-mainnet");
      } else {
        console.log("✅ You can deploy essential contracts!");
        console.log("\n🚀 Deploy essential: pnpm deploy:essential");
        console.log("   Or wait and deploy all: pnpm deploy:base-mainnet");
      }
    } else {
      console.log("\n🚀 Deploy just DreamToken: pnpm deploy:essential");
    }
  } else {
    const needed = dreamTokenCost - balance;
    const neededEth = parseFloat(ethers.formatEther(needed));
    const neededUsd = neededEth * 3000;
    console.log(`\n❌ Need ~${neededEth.toFixed(6)} ETH (~$${neededUsd.toFixed(2)}) more`);
  }
}

main().catch(console.error);

