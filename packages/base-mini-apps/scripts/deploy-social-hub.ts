import hre from "hardhat";
const { ethers } = hre;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MANIFEST_PATH = path.join(__dirname, "../contracts/deployment.json");

async function main() {
  console.log("🚀 Deploying SocialHubRegistry...\n");

  const SocialHubRegistry = await ethers.getContractFactory("SocialHubRegistry");
  const registry = await SocialHubRegistry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  const tx = registry.deploymentTransaction()?.hash || "";

  console.log(`✅ SocialHubRegistry deployed: ${address}`);
  console.log(`📄 TX: ${tx}`);
  console.log(`🔗 BaseScan: https://basescan.org/address/${address}\n`);

  // Update deployment.json
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  manifest.base.contracts.SocialHubRegistry = address;
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log("💾 Updated deployment.json");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

