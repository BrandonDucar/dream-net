#!/usr/bin/env tsx
import { ethers } from "ethers";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const targetWallet = "0x57d7789e4e90f6fe692cab607d69ec591581d354";
  
  console.log("🔐 Verifying Private Key Match\n");
  console.log("Target wallet:", targetWallet);
  console.log("");
  
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey) {
    console.log("❌ PRIVATE_KEY not found in .env");
    console.log("   Add your private key to .env file");
    return;
  }
  
  if (!privateKey.startsWith("0x")) {
    console.log("⚠️  Private key should start with 0x");
    console.log("   Adding 0x prefix...");
  }
  
  try {
    const wallet = new ethers.Wallet(privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`);
    const address = wallet.address.toLowerCase();
    const target = targetWallet.toLowerCase();
    
    console.log("Wallet from private key:", address);
    console.log("Target wallet:          ", target);
    console.log("");
    
    if (address === target) {
      console.log("✅ MATCH! Private key is correct!");
      console.log("\n🚀 Ready to deploy!");
      console.log("   Run: pnpm deploy:base-mainnet");
    } else {
      console.log("❌ MISMATCH! Private key doesn't match wallet");
      console.log("\nTo fix:");
      console.log("1. Open MetaMask");
      console.log("2. Settings → Security & Privacy → Show Private Key");
      console.log("3. Copy the private key for address:", targetWallet);
      console.log("4. Update .env: PRIVATE_KEY=0x...");
    }
  } catch (error) {
    console.log("❌ Invalid private key format");
    console.log("   Error:", (error as Error).message);
  }
}

main().catch(console.error);

