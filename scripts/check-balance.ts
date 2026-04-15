#!/usr/bin/env tsx
import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Checking balance for:", signer.address);
  
  // Check Sepolia
  const sepoliaProvider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  const sepoliaBalance = await sepoliaProvider.getBalance(signer.address);
  console.log("\nBase Sepolia balance:", ethers.formatEther(sepoliaBalance), "ETH");
  
  // Check Mainnet
  const mainnetProvider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const mainnetBalance = await mainnetProvider.getBalance(signer.address);
  console.log("Base Mainnet balance:", ethers.formatEther(mainnetBalance), "ETH");
  
  if (parseFloat(ethers.formatEther(mainnetBalance)) > 0.05) {
    console.log("\n✅ You have enough ETH on mainnet to deploy!");
    console.log("   Run: pnpm deploy:base-mainnet");
  } else if (parseFloat(ethers.formatEther(mainnetBalance)) > 0) {
    console.log("\n⚠️  You have some ETH but might need more (~0.05-0.1 ETH total)");
  } else {
    console.log("\n❌ No ETH on mainnet. You need ~0.05-0.1 ETH to deploy.");
  }
  
  if (parseFloat(ethers.formatEther(sepoliaBalance)) === 0) {
    console.log("\n💡 Get free Sepolia testnet ETH:");
    console.log("   https://www.coinbase.com/faucets/base-ethereum-goerli-faucet");
  }
}

main().catch(console.error);

