/**
 * Deploy CardForgeNFT contract to Base
 * Uses Hardhat deployment pattern
 */

import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying CardForgeNFT with account:", deployer.address);
  console.log("📊 Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy CardForgeNFT
  const CardForgeNFT = await ethers.getContractFactory("CardForgeNFT");
  const cardForgeNFT = await CardForgeNFT.deploy(deployer.address);
  await cardForgeNFT.waitForDeployment();

  const address = await cardForgeNFT.getAddress();
  console.log("✅ CardForgeNFT deployed to:", address);

  // Save deployment info
  const fs = require("fs");
  const path = require("path");
  const deploymentPath = path.join(__dirname, "../contracts/deployment.json");
  
  let deployments: any = {};
  if (fs.existsSync(deploymentPath)) {
    deployments = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
  }

  const network = await ethers.provider.getNetwork();
  const networkName = network.chainId === 8453n ? "base" : network.chainId === 84532n ? "baseSepolia" : "localhost";

  if (!deployments[networkName]) {
    deployments[networkName] = { chainId: Number(network.chainId), contracts: {} };
  }

  if (!deployments[networkName].contracts) {
    deployments[networkName].contracts = {};
  }

  deployments[networkName].contracts.CardForgeNFT = address;

  fs.writeFileSync(deploymentPath, JSON.stringify(deployments, null, 2));
  console.log("📝 Deployment info saved to:", deploymentPath);

  console.log("\n🎉 Deployment complete!");
  console.log(`   Contract: ${address}`);
  console.log(`   Network: ${networkName} (Chain ID: ${network.chainId})`);
  console.log(`   Explorer: https://${networkName === 'base' ? 'basescan.org' : networkName === 'baseSepolia' ? 'sepolia.basescan.org' : 'localhost'}/address/${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

