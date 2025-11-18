/**
 * Deploy All Contracts and Save Addresses
 * This script deploys contracts and outputs addresses in a format ready for config.ts
 */

import hre from "hardhat";
const { ethers } = hre;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DeploymentResult {
  name: string;
  address: string;
  txHash: string;
  network: string;
}

async function main() {
  console.log("===============================================");
  console.log(" 🚀 Deploying All Mini-App Contracts");
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

  if (balance === 0n) {
    console.warn("⚠️  WARNING: Deployer wallet has 0 ETH. Deployment will fail.");
    console.warn("   Please fund your wallet before deploying.\n");
  }

  const deployments: DeploymentResult[] = [];

  // Contracts that need constructor args
  const contractsToDeploy: Array<{
    name: string;
    key: string;
    factory: string;
    args?: any[];
  }> = [
    // Existing contracts (no args)
    { name: "DreamRemixRegistry", key: "DreamRemixRegistry", factory: "DreamRemixRegistry" },
    { name: "WhisperMessenger", key: "WhisperMessenger", factory: "WhisperMessenger" },
    { name: "SeasonalEventsRegistry", key: "SeasonalEventsRegistry", factory: "SeasonalEventsRegistry" },
    { name: "NightmareRegistry", key: "NightmareRegistry", factory: "NightmareRegistry" },
    { name: "MissionRegistry", key: "MissionRegistry", factory: "MissionRegistry" },
    { name: "RevenueSplitter", key: "RevenueSplitter", factory: "RevenueSplitter" },
    { name: "ProgressionRegistry", key: "ProgressionRegistry", factory: "ProgressionRegistry" },
    { name: "DreamDriftersRegistry", key: "DreamDriftersRegistry", factory: "DreamDriftersRegistry" },
    { name: "DreamTimeCapsule", key: "DreamTimeCapsule", factory: "DreamTimeCapsule" },
    { name: "DreamDNASequencer", key: "DreamDNASequencer", factory: "DreamDNASequencer" },
    { name: "DreamPredictionMarket", key: "DreamPredictionMarket", factory: "DreamPredictionMarket" },
    // New contracts (with owner arg)
    { name: "DreamShop", key: "DreamShop", factory: "DreamShop", args: [deployer.address] },
    { name: "TributeGate", key: "TributeGate", factory: "TributeGate", args: [deployer.address] },
    { name: "WalletScoreRegistry", key: "WalletScoreRegistry", factory: "WalletScoreRegistry", args: [deployer.address] },
  ];

  for (const contract of contractsToDeploy) {
    try {
      console.log(`\n📦 Deploying ${contract.name}...`);
      const ContractFactory = await ethers.getContractFactory(contract.factory);
      const deployArgs = contract.args || [];
      
      console.log(`   Constructor args: ${deployArgs.length > 0 ? deployArgs.join(", ") : "none"}`);
      
      const contractInstance = await ContractFactory.deploy(...deployArgs);
      await contractInstance.waitForDeployment();
      
      const address = await contractInstance.getAddress();
      const txHash = contractInstance.deploymentTransaction()?.hash || "";
      
      console.log(`✅ ${contract.name} deployed:`);
      console.log(`   Address: ${address}`);
      console.log(`   TX: ${txHash}`);
      
      deployments.push({
        name: contract.key,
        address,
        txHash,
        network: networkName,
      });
    } catch (error: any) {
      console.error(`❌ Failed to deploy ${contract.name}:`, error.message);
      if (error.message.includes("insufficient funds")) {
        console.error("   💡 Your wallet needs more ETH for gas fees");
      }
    }
  }

  // Save to deployment.json
  const manifestPath = path.join(__dirname, "../contracts/deployment.json");
  let manifest: any = {};
  
  if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  }
  
  if (!manifest.base) {
    manifest.base = { chainId: chainId, contracts: {} };
  }
  
  deployments.forEach((deployment) => {
    manifest.base.contracts[deployment.name] = deployment.address;
  });
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  // Output summary
  console.log("\n===============================================");
  console.log(" ✅ Deployment Complete");
  console.log("===============================================\n");

  console.log("📋 Deployed Contracts:");
  deployments.forEach((d) => {
    console.log(`   ${d.name}: ${d.address}`);
  });

  console.log("\n📄 Contract Addresses (for config.ts):");
  console.log("```typescript");
  deployments.forEach((d) => {
    const envKey = d.name.toUpperCase().replace(/([A-Z])/g, "_$1").slice(1);
    console.log(`  ${d.name}: getEnv('VITE_${envKey}_ADDRESS', "${d.address}"),`);
  });
  console.log("```");

  console.log("\n📄 Environment Variables:");
  deployments.forEach((d) => {
    const envKey = d.name.toUpperCase().replace(/([A-Z])/g, "_$1").slice(1);
    console.log(`VITE_${envKey}_ADDRESS=${d.address}`);
  });

  console.log("\n💾 Manifest saved to:", manifestPath);
  console.log("\n🔗 View on BaseScan:");
  deployments.forEach((d) => {
    const baseScanUrl = chainId === 8453 
      ? `https://basescan.org/address/${d.address}`
      : `https://sepolia.basescan.org/address/${d.address}`;
    console.log(`   ${d.name}: ${baseScanUrl}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

