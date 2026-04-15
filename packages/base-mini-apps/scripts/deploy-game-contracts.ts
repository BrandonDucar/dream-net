/**
 * Deploy Game Contracts
 * Deploys GameRegistry first, then GameAchievementNFT (which depends on GameRegistry)
 */

import hre from "hardhat";
const { ethers } = hre;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MANIFEST_PATH = path.join(__dirname, "../contracts/deployment.json");

async function main() {
  console.log("===============================================");
  console.log(" 🎮 Deploying Game Contracts");
  console.log("===============================================\n");

  const network = await ethers.provider.getNetwork();
  const networkName = network.name === "unknown" ? "base" : network.name;
  const chainId = Number(network.chainId);

  console.log(`Network: ${networkName} (Chain ID: ${chainId})\n`);

  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    throw new Error("No signers available. Check PRIVATE_KEY in .env file.");
  }
  const [deployer] = signers;
  console.log("Deployer:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH\n");

  // Load manifest
  let manifest: any = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  } else {
    manifest = { base: { chainId: chainId, contracts: {} } };
  }

  const contracts = manifest.base.contracts;

  // Step 1: Deploy GameRegistry
  let gameRegistryAddress = contracts["GameRegistry"];
  
  if (!gameRegistryAddress) {
    console.log("📦 Deploying GameRegistry...");
    const GameRegistryFactory = await ethers.getContractFactory("GameRegistry");
    const gameRegistry = await GameRegistryFactory.deploy(deployer.address);
    const deployTx = gameRegistry.deploymentTransaction();
    if (deployTx) {
      console.log(`⏳ Waiting for GameRegistry deployment...`);
      await deployTx.wait(2); // Wait for 2 confirmations
    }
    await gameRegistry.waitForDeployment();
    gameRegistryAddress = await gameRegistry.getAddress();
    contracts["GameRegistry"] = gameRegistryAddress;
    console.log(`✅ GameRegistry deployed: ${gameRegistryAddress}`);
    console.log(`📄 TX: ${deployTx?.hash || ""}\n`);
    
    // Wait a bit for network to sync
    console.log("⏳ Waiting for network sync...");
    await new Promise(resolve => setTimeout(resolve, 3000));
  } else {
    console.log(`⏭️  GameRegistry already deployed: ${gameRegistryAddress}\n`);
  }

  // Step 2: Deploy GameAchievementNFT (depends on GameRegistry)
  let gameNFTAddress = contracts["GameAchievementNFT"];
  
  if (!gameNFTAddress) {
    console.log("📦 Deploying GameAchievementNFT...");
    const GameNFTFactory = await ethers.getContractFactory("GameAchievementNFT");
    const gameNFT = await GameNFTFactory.deploy(deployer.address, gameRegistryAddress);
    const deployTxNFT = gameNFT.deploymentTransaction();
    if (deployTxNFT) {
      console.log(`⏳ Waiting for GameAchievementNFT deployment...`);
      await deployTxNFT.wait(2); // Wait for 2 confirmations
    }
    await gameNFT.waitForDeployment();
    gameNFTAddress = await gameNFT.getAddress();
    contracts["GameAchievementNFT"] = gameNFTAddress;
    console.log(`✅ GameAchievementNFT deployed: ${gameNFTAddress}`);
    console.log(`📄 TX: ${deployTxNFT?.hash || ""}\n`);
  } else {
    console.log(`⏭️  GameAchievementNFT already deployed: ${gameNFTAddress}\n`);
  }

  // Save manifest
  manifest.base.contracts = contracts;
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log("===============================================");
  console.log(" ✅ Game Contracts Deployment Complete");
  console.log("===============================================\n");

  console.log("📋 Deployed Contracts:");
  if (contracts["GameRegistry"]) {
    console.log(`   GameRegistry: ${contracts["GameRegistry"]}`);
  }
  if (contracts["GameAchievementNFT"]) {
    console.log(`   GameAchievementNFT: ${contracts["GameAchievementNFT"]}`);
  }

  console.log("\n📄 Contract Addresses (for config.ts):");
  console.log("```typescript");
  if (contracts["GameRegistry"]) {
    console.log(`  GameRegistry: getEnv('VITE_GAME_REGISTRY_ADDRESS', "${contracts["GameRegistry"]}"),`);
  }
  if (contracts["GameAchievementNFT"]) {
    console.log(`  GameAchievementNFT: getEnv('VITE_GAME_ACHIEVEMENT_NFT_ADDRESS', "${contracts["GameAchievementNFT"]}"),`);
  }
  console.log("```");

  console.log("\n🔗 View on BaseScan:");
  const baseScanUrl = chainId === 8453 
    ? "https://basescan.org/address/"
    : "https://sepolia.basescan.org/address/";
  if (contracts["GameRegistry"]) {
    console.log(`   GameRegistry: ${baseScanUrl}${contracts["GameRegistry"]}`);
  }
  if (contracts["GameAchievementNFT"]) {
    console.log(`   GameAchievementNFT: ${baseScanUrl}${contracts["GameAchievementNFT"]}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

