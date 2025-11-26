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

async function deployContract(name: string, factoryName: string, args: any[] = []): Promise<Deployment | null> {
  try {
    console.log(`\n📦 Deploying ${name}...`);
    const ContractFactory = await ethers.getContractFactory(factoryName);
    const contract = await ContractFactory.deploy(...args);
    await contract.waitForDeployment();
    
    const address = await contract.getAddress();
    const tx = contract.deploymentTransaction()?.hash || "";
    
    console.log(`✅ ${name} deployed: ${address}`);
    console.log(`📄 TX: ${tx}`);
    console.log(`🔗 BaseScan: https://basescan.org/address/${address}`);
    
    return { address, tx };
  } catch (error) {
    console.error(`❌ Failed to deploy ${name}:`, error);
    return null;
  }
}

async function main() {
  console.log("===============================================");
  console.log(" 🚀 Deploying Remaining 9 Mini-App Contracts");
  console.log("===============================================\n");

  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    throw new Error("No signers available. Check PRIVATE_KEY in .env file.");
  }
  const [deployer] = signers;
  console.log("Deployer:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH\n");

  if (balance < ethers.parseEther("0.001")) {
    console.warn("⚠️  Warning: Low balance. You may need more ETH for gas.");
  }

  const manifest = await loadManifest();
  const contracts = manifest.base.contracts;

  // The 9 new contracts to deploy
  const contractsToDeploy: Array<{
    name: string;
    key: string;
    factory: string;
    args?: any[];
  }> = [
    { name: "SocialHubRegistry", key: "SocialHubRegistry", factory: "SocialHubRegistry" },
    { name: "WolfPackFundingRegistry", key: "WolfPackFundingRegistry", factory: "WolfPackFundingRegistry" },
    { name: "WhalePackCommerceRegistry", key: "WhalePackCommerceRegistry", factory: "WhalePackCommerceRegistry" },
    { name: "TreasuryRegistry", key: "TreasuryRegistry", factory: "TreasuryRegistry" },
    { name: "OnboardingRegistry", key: "OnboardingRegistry", factory: "OnboardingRegistry" },
    { name: "CreatorStudioRegistry", key: "CreatorStudioRegistry", factory: "CreatorStudioRegistry" },
    { name: "SocialOpsRegistry", key: "SocialOpsRegistry", factory: "SocialOpsRegistry" },
    { name: "InboxSquaredRegistry", key: "InboxSquaredRegistry", factory: "InboxSquaredRegistry" },
    { name: "CoinSenseiRegistry", key: "CoinSenseiRegistry", factory: "CoinSenseiRegistry" },
  ];

  const deployments: Record<string, Deployment> = {};
  let totalGasUsed = BigInt(0);

  for (const contract of contractsToDeploy) {
    // Skip if already deployed
    if (contracts[contract.key]) {
      console.log(`⏭️  ${contract.name} already deployed: ${contracts[contract.key]}`);
      continue;
    }

    const deployment = await deployContract(contract.name, contract.factory, contract.args || []);
    if (deployment) {
      deployments[contract.key] = deployment;
      contracts[contract.key] = deployment.address;
      
      // Estimate gas (rough)
      const receipt = await ethers.provider.getTransactionReceipt(deployment.tx);
      if (receipt) {
        totalGasUsed += receipt.gasUsed;
      }
    }
  }

  // Update manifest
  manifest.base.contracts = contracts;
  await saveManifest(manifest);

  console.log("\n===============================================");
  console.log(" ✅ Deployment Complete");
  console.log("===============================================\n");

  console.log("📋 Newly Deployed Contracts:");
  Object.entries(deployments).forEach(([name, deployment]) => {
    console.log(`   ${name}: ${deployment.address}`);
  });

  console.log("\n💾 Manifest saved to:", MANIFEST_PATH);
  console.log("\n💰 Estimated Total Gas Used:", totalGasUsed.toString());
  console.log("💵 Estimated Cost:", ethers.formatEther(totalGasUsed * BigInt(100000000)), "ETH (at 100 gwei)");
  
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

