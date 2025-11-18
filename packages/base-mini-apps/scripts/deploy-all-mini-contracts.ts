import hre from "hardhat";
const { ethers } = hre;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

interface Deployment {
  address: string;
  tx: string;
}

interface DeploymentManifest {
  base: {
    chainId: number;
    contracts: Record<string, string>;
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MANIFEST_PATH = path.join(__dirname, "../contracts/deployment.json");

async function loadManifest(): Promise<DeploymentManifest> {
  try {
    if (fs.existsSync(MANIFEST_PATH)) {
      const content = fs.readFileSync(MANIFEST_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.log("No existing manifest found, creating new one");
  }
  
  return {
    base: {
      chainId: 8453,
      contracts: {}
    }
  };
}

async function saveManifest(manifest: DeploymentManifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

async function deployContract(name: string, factoryName: string): Promise<Deployment | null> {
  try {
    console.log(`\n📦 Deploying ${name}...`);
    const ContractFactory = await ethers.getContractFactory(factoryName);
    const contract = await ContractFactory.deploy();
    await contract.waitForDeployment();
    
    const address = await contract.getAddress();
    const tx = contract.deploymentTransaction()?.hash || "";
    
    console.log(`✅ ${name} deployed: ${address}`);
    console.log(`📄 TX: ${tx}`);
    
    return { address, tx };
  } catch (error) {
    console.error(`❌ Failed to deploy ${name}:`, error);
    return null;
  }
}

async function main() {
  console.log("===============================================");
  console.log(" 🚀 Deploying All Mini-Apps Contracts");
  console.log("===============================================\n");

  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    throw new Error("No signers available. Check PRIVATE_KEY in .env file.");
  }
  const [deployer] = signers;
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  const manifest = await loadManifest();
  const contracts = manifest.base.contracts;

  // List of contracts to deploy (only if not already deployed)
  const contractsToDeploy = [
    { name: "DreamRemixRegistry", key: "DreamRemixRegistry", factory: "DreamRemixRegistry" },
    { name: "WhisperMessenger", key: "WhisperMessenger", factory: "WhisperMessenger" },
    { name: "SeasonalEventsRegistry", key: "SeasonalEventsRegistry", factory: "SeasonalEventsRegistry" },
    { name: "NightmareRegistry", key: "NightmareRegistry", factory: "NightmareRegistry" },
    { name: "MissionRegistry", key: "MissionRegistry", factory: "MissionRegistry" },
    { name: "RevenueSplitter", key: "RevenueSplitter", factory: "RevenueSplitter" },
    { name: "ProgressionRegistry", key: "ProgressionRegistry", factory: "ProgressionRegistry" },
    { name: "DreamDriftersRegistry", key: "DreamDriftersRegistry", factory: "DreamDriftersRegistry" },
  ];

  const deployments: Record<string, Deployment> = {};

  for (const contract of contractsToDeploy) {
    // Skip if already deployed
    if (contracts[contract.key]) {
      console.log(`⏭️  ${contract.name} already deployed: ${contracts[contract.key]}`);
      continue;
    }

    const deployment = await deployContract(contract.name, contract.factory);
    if (deployment) {
      deployments[contract.key] = deployment;
      contracts[contract.key] = deployment.address;
    }
  }

  // Update manifest
  manifest.base.contracts = contracts;
  await saveManifest(manifest);

  console.log("\n===============================================");
  console.log(" ✅ Deployment Complete");
  console.log("===============================================\n");

  console.log("📋 Deployed Contracts:");
  Object.entries(deployments).forEach(([name, deployment]) => {
    console.log(`   ${name}: ${deployment.address}`);
  });

  console.log("\n💾 Manifest saved to:", MANIFEST_PATH);
  console.log("\n🔗 All contract addresses:");
  Object.entries(contracts).forEach(([name, address]) => {
    console.log(`   ${name}: ${address}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

