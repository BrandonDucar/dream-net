#!/usr/bin/env tsx
import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  console.log("🔍 Checking REAL Base Mainnet Gas Costs\n");
  
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  
  // Get current gas price
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice;
  
  console.log("Current Base gas price:", ethers.formatUnits(gasPrice || 0n, "gwei"), "gwei");
  
  // Estimate contract sizes (rough)
  // Base is L2, so gas is MUCH cheaper
  const estimates = {
    DreamToken: {
      gas: 1_500_000n, // Typical ERC20 deployment
      description: "Simple ERC20 token"
    },
    SheepToken: {
      gas: 1_500_000n,
      description: "Simple ERC20 token"
    },
    DreamerPass: {
      gas: 3_000_000n, // NFT contracts are bigger
      description: "ERC721 NFT"
    },
    SubscriptionBadge: {
      gas: 3_000_000n,
      description: "ERC1155 NFT"
    },
    SubscriptionHub: {
      gas: 2_500_000n,
      description: "Complex contract"
    }
  };
  
  console.log("\nEstimated costs (Base L2 - much cheaper!):\n");
  
  let totalCost = 0n;
  for (const [name, estimate] of Object.entries(estimates)) {
    const cost = (gasPrice || 0n) * estimate.gas;
    const costEth = parseFloat(ethers.formatEther(cost));
    const costUsd = costEth * 3000; // Rough ETH price
    totalCost += cost;
    
    console.log(`${name}:`);
    console.log(`  Gas: ${estimate.gas.toLocaleString()}`);
    console.log(`  Cost: ~${costEth.toFixed(6)} ETH (~$${costUsd.toFixed(2)})`);
    console.log(`  ${estimate.description}\n`);
  }
  
  const totalEth = parseFloat(ethers.formatEther(totalCost));
  const totalUsd = totalEth * 3000;
  
  console.log(`Total (all contracts): ~${totalEth.toFixed(6)} ETH (~$${totalUsd.toFixed(2)})`);
  
  // Check user balance
  const [signer] = await ethers.getSigners();
  const balance = await provider.getBalance(signer.address);
  const balanceEth = parseFloat(ethers.formatEther(balance));
  const balanceUsd = balanceEth * 3000;
  
  console.log(`\nYour balance: ${balanceEth.toFixed(6)} ETH (~$${balanceUsd.toFixed(2)})`);
  
  // Check what we can deploy
  const dreamTokenCost = (gasPrice || 0n) * estimates.DreamToken.gas;
  const dreamTokenEth = parseFloat(ethers.formatEther(dreamTokenCost));
  const dreamTokenUsd = dreamTokenEth * 3000;
  
  console.log(`\nDreamToken alone: ~${dreamTokenEth.toFixed(6)} ETH (~$${dreamTokenUsd.toFixed(2)})`);
  
  if (balance >= dreamTokenCost) {
    console.log("\n✅ You CAN deploy DreamToken!");
    if (balance >= dreamTokenCost + (gasPrice || 0n) * estimates.SheepToken.gas) {
      console.log("✅ You might be able to deploy DreamToken + SheepToken!");
    }
  } else {
    const needed = dreamTokenCost - balance;
    const neededEth = parseFloat(ethers.formatEther(needed));
    const neededUsd = neededEth * 3000;
    console.log(`\n❌ Need ~${neededEth.toFixed(6)} ETH (~$${neededUsd.toFixed(2)}) more for DreamToken`);
  }
  
  console.log("\n💡 Base is L2 - gas is MUCH cheaper than Ethereum!");
  console.log("   Actual costs might be even lower than estimates.");
}

main().catch(console.error);

