#!/usr/bin/env ts-node
/**
 * Deploy CardForgeNFT contract to Base
 */

import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const network = process.env.NETWORK || "baseSepolia";
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error("PRIVATE_KEY environment variable is required");
  }

  // Get network config
  const networks: Record<string, { rpc: string; chainId: number }> = {
    baseSepolia: {
      rpc: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      chainId: 84532,
    },
    base: {
      rpc: process.env.BASE_MAINNET_RPC_URL || "https://mainnet.base.org",
      chainId: 8453,
    },
  };

  const networkConfig = networks[network];
  if (!networkConfig) {
    throw new Error(`Unknown network: ${network}`);
  }

  console.log(`🚀 Deploying CardForgeNFT to ${network}...`);

  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(networkConfig.rpc);
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log(`📝 Deploying from: ${wallet.address}`);

  // Read contract ABI and bytecode
  const artifactsPath = path.join(__dirname, "../artifacts/contracts/CardForgeNFT.sol/CardForgeNFT.json");
  const artifact = JSON.parse(fs.readFileSync(artifactsPath, "utf-8"));

  // Deploy contract
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  console.log("⏳ Deploying contract...");
  
  const contract = await factory.deploy(wallet.address);
  await contract.waitForDeployment();
  
  const address = await contract.getAddress();
  console.log(`✅ CardForgeNFT deployed to: ${address}`);

  // Save deployment info
  const deploymentPath = path.join(__dirname, "../contracts/deployment.json");
  let deployments: any = {};
  
  if (fs.existsSync(deploymentPath)) {
    deployments = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
  }

  if (!deployments[network]) {
    deployments[network] = {};
  }

  deployments[network].CardForgeNFT = {
    address,
    txHash: contract.deploymentTransaction()?.hash,
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(deploymentPath, JSON.stringify(deployments, null, 2));
  console.log(`📝 Deployment info saved to: ${deploymentPath}`);

  console.log("\n🎉 Deployment complete!");
  console.log(`   Contract: ${address}`);
  console.log(`   Network: ${network}`);
  console.log(`   Explorer: https://${network === 'base' ? 'basescan.org' : 'sepolia.basescan.org'}/address/${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

