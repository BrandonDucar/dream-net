#!/usr/bin/env tsx
/**
 * Quick setup script for Base deployment
 * Checks prerequisites and guides through setup
 */

import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENV_FILE = join(process.cwd(), ".env");
const ENV_EXAMPLE = join(process.cwd(), ".env.example");

function checkEnvVar(name: string): boolean {
  return !!process.env[name];
}

function main() {
  console.log("🚀 Base Deployment Setup Check\n");

  // Check if .env exists
  if (!existsSync(ENV_FILE)) {
    console.log("❌ .env file not found");
    console.log("📝 Creating .env.example template...\n");
    
    const example = `# Base Network Configuration
PRIVATE_KEY=your_metamask_private_key_here
BASE_MAINNET_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Optional: For contract verification
BASE_SCAN_API_KEY=your_basescan_api_key

# Will be set after deployment
DREAM_TOKEN_ADDRESS=
SHEEP_TOKEN_ADDRESS=
DREAMER_PASS_ADDRESS=
SUBSCRIPTION_BADGE_ADDRESS=
SUBSCRIPTION_HUB_ADDRESS=
`;
    
    writeFileSync(ENV_EXAMPLE, example);
    console.log("✅ Created .env.example");
    console.log("📋 Copy .env.example to .env and fill in your values\n");
  } else {
    console.log("✅ .env file exists\n");
  }

  // Check required env vars
  console.log("Checking environment variables:\n");
  
  const checks = [
    { name: "PRIVATE_KEY", required: true, description: "MetaMask private key" },
    { name: "BASE_MAINNET_RPC_URL", required: false, description: "Base mainnet RPC" },
    { name: "BASE_SEPOLIA_RPC_URL", required: false, description: "Base Sepolia RPC" },
    { name: "BASE_SCAN_API_KEY", required: false, description: "BaseScan API key (optional)" },
  ];

  let allGood = true;
  for (const check of checks) {
    const exists = checkEnvVar(check.name);
    const status = exists ? "✅" : check.required ? "❌" : "⚠️";
    console.log(`${status} ${check.name}: ${exists ? "Set" : "Not set"} ${check.required ? "(REQUIRED)" : "(optional)"}`);
    if (check.required && !exists) {
      allGood = false;
    }
  }

  console.log("\n");

  // Check if contracts are compiled
  const artifactsDir = join(process.cwd(), "artifacts", "contracts");
  const dreamTokenArtifact = join(artifactsDir, "DreamToken.sol", "DreamToken.json");
  
  if (existsSync(dreamTokenArtifact)) {
    console.log("✅ Contracts compiled\n");
  } else {
    console.log("⚠️  Contracts not compiled yet");
    console.log("   Run: pnpm compile\n");
  }

  // Instructions
  if (!allGood) {
    console.log("📋 Next Steps:\n");
    console.log("1. Export your MetaMask private key:");
    console.log("   - MetaMask → Settings → Security & Privacy → Show Private Key");
    console.log("   - Add to .env as PRIVATE_KEY=0x...\n");
    console.log("2. Get Base RPC URL (optional, defaults work):");
    console.log("   - Public: https://mainnet.base.org");
    console.log("   - Or get from Alchemy/Infura for better reliability\n");
    console.log("3. Compile contracts:");
    console.log("   pnpm compile\n");
    console.log("4. Deploy to Base Sepolia (testnet first):");
    console.log("   pnpm deploy:base-sepolia\n");
    console.log("5. Deploy to Base Mainnet:");
    console.log("   pnpm deploy:base-mainnet\n");
  } else {
    console.log("✅ All prerequisites met!\n");
    console.log("Ready to deploy:\n");
    console.log("  Testnet: pnpm deploy:base-sepolia");
    console.log("  Mainnet: pnpm deploy:base-mainnet\n");
  }

  // Check wallet balance (if we can)
  if (checkEnvVar("PRIVATE_KEY") && checkEnvVar("BASE_MAINNET_RPC_URL")) {
    console.log("💡 Tip: Make sure you have ETH in your wallet for gas!");
    console.log("   Base mainnet requires real ETH (~0.05-0.1 ETH for all contracts)\n");
  }
}

main();

