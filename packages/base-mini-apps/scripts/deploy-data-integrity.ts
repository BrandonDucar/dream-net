/**
 * Deploy Data Integrity Registry contract to Base
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
  console.log(" 🔗 Deploying Data Integrity Registry");
  console.log("===============================================\n");

  const network = await ethers.provider.getNetwork();
  const networkName = network.name === "unknown" ? "base" : network.name;
  const chainId = Number(network.chainId);

  console.log(`Network: ${networkName} (Chain ID: ${chainId})\n`);

  const [deployer] = await ethers.getSigners();
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

  // Deploy Data Integrity Registry
  console.log("📦 Deploying DataIntegrityRegistry...");
  const DataIntegrityRegistry = await ethers.getContractFactory("DataIntegrityRegistry");
  const registry = await DataIntegrityRegistry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  const txHash = registry.deploymentTransaction()?.hash || "";

  console.log(`✅ DataIntegrityRegistry deployed:`);
  console.log(`   Address: ${address}`);
  console.log(`   TX: ${txHash}\n`);

  // Save to manifest
  if (!manifest.base) {
    manifest.base = { chainId: chainId, contracts: {} };
  }
  manifest.base.contracts["DataIntegrityRegistry"] = address;

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log("📝 Deployment info saved to:", MANIFEST_PATH);

  console.log("\n===============================================");
  console.log(" ✅ Deployment Complete");
  console.log("===============================================\n");

  console.log("📋 Next Steps:");
  console.log(`1. Set DATA_INTEGRITY_CONTRACT_ADDRESS=${address} in .env`);
  console.log(`2. Set DATA_INTEGRITY_ENABLED=true in .env`);
  console.log(`3. Set DATA_INTEGRITY_RPC_URL in .env (or use BASE_MAINNET_RPC_URL)`);
  console.log(`4. Set DATA_INTEGRITY_PRIVATE_KEY in .env (or use PRIVATE_KEY)`);
  console.log(`5. Verify contract on BaseScan: https://basescan.org/address/${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

