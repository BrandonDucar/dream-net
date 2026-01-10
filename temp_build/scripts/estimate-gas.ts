#!/usr/bin/env tsx
import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  console.log("💰 Gas Cost Estimation for Base Mainnet\n");
  
  // Rough estimates per contract (in ETH)
  const estimates = {
    DreamToken: 0.015,      // ~$45-50
    SheepToken: 0.015,      // ~$45-50
    DreamerPass: 0.02,      // ~$60-70
    SubscriptionBadge: 0.02, // ~$60-70
    SubscriptionHub: 0.02,  // ~$60-70
  };
  
  const total = Object.values(estimates).reduce((a, b) => a + b, 0);
  
  console.log("Estimated costs per contract:");
  Object.entries(estimates).forEach(([name, cost]) => {
    console.log(`  ${name}: ~${cost.toFixed(3)} ETH (~$${(cost * 3000).toFixed(0)})`);
  });
  
  console.log(`\nTotal (all contracts): ~${total.toFixed(3)} ETH (~$${(total * 3000).toFixed(0)})`);
  
  // Check current balance
  const [signer] = await ethers.getSigners();
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const balance = await provider.getBalance(signer.address);
  const balanceEth = parseFloat(ethers.formatEther(balance));
  
  console.log(`\nYour balance: ${balanceEth.toFixed(4)} ETH (~$${(balanceEth * 3000).toFixed(2)})`);
  
  if (balanceEth >= total) {
    console.log("\n✅ You have enough to deploy all contracts!");
  } else if (balanceEth >= estimates.DreamToken + estimates.SheepToken) {
    console.log("\n⚠️  You can deploy the essential contracts:");
    console.log("   - DreamToken");
    console.log("   - SheepToken");
    console.log("\n   Deploy the rest later when you have more ETH.");
  } else {
    console.log("\n❌ Not enough ETH for deployment.");
    console.log(`   You need at least ~${(estimates.DreamToken + estimates.SheepToken).toFixed(3)} ETH for essential contracts.`);
  }
  
  console.log("\n💡 Tip: Base gas is cheap! You might get better rates than estimated.");
}

main().catch(console.error);

