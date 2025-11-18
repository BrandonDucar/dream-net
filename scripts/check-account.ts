#!/usr/bin/env tsx
import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  console.log("🔍 Checking deployment account...\n");
  
  const [signer] = await ethers.getSigners();
  console.log("Account from private key:", signer.address);
  console.log("\nThis is the account that will deploy contracts.");
  console.log("Make sure this matches the MetaMask account with ETH!\n");
  
  // Check mainnet balance
  const mainnetProvider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const balance = await mainnetProvider.getBalance(signer.address);
  const balanceEth = ethers.formatEther(balance);
  
  console.log("Base Mainnet balance:", balanceEth, "ETH");
  
  if (parseFloat(balanceEth) >= 0.05) {
    console.log("\n✅ Ready to deploy! You have enough ETH.");
    console.log("   Run: pnpm deploy:base-mainnet\n");
  } else if (parseFloat(balanceEth) > 0) {
    console.log("\n⚠️  You have some ETH but might need more.");
    console.log("   Estimated cost: ~0.05-0.1 ETH total\n");
  } else {
    console.log("\n❌ No ETH found on this account.");
    console.log("   Make sure:");
    console.log("   1. The private key in .env matches your MetaMask account");
    console.log("   2. That account has ETH on Base mainnet");
    console.log("   3. You're connected to Base network in MetaMask\n");
  }
}

main().catch(console.error);

