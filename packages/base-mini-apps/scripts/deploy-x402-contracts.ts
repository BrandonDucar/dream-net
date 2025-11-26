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
    const deployTx = contract.deploymentTransaction();
    const txHash = deployTx?.hash || "unknown";
    
    console.log(`✅ ${name} deployed to: ${address}`);
    console.log(`   Transaction: ${txHash}`);
    
    return { address, tx: txHash };
  } catch (error: any) {
    console.error(`❌ Failed to deploy ${name}:`, error.message);
    return null;
  }
}

async function main() {
  console.log("🚀 Deploying X402 Contracts to Base Mainnet\n");
  console.log("=".repeat(60));
  
  const [deployer] = await ethers.getSigners();
  console.log(`\n📝 Deploying from: ${deployer.address}`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH\n`);
  
  if (balance < ethers.parseEther("0.0001")) {
    console.error("❌ Insufficient balance! Need at least 0.0001 ETH for gas");
    process.exit(1);
  }
  
  console.log(`⚠️  Low balance warning: You have ${ethers.formatEther(balance)} ETH`);
  console.log(`   These contracts are simple and should deploy with ~0.0005 ETH\n`);
  
  const manifest = await loadManifest();
  
  // Deploy X402 contracts
  const contracts = [
    { name: "X402ServiceMarketplace", factory: "X402ServiceMarketplace", args: [] },
    { name: "X402TransactionRegistry", factory: "X402TransactionRegistry", args: [] },
  ];
  
  for (const contract of contracts) {
    // Skip if already deployed
    if (manifest.base.contracts[contract.name]) {
      console.log(`⏭️  ${contract.name} already deployed: ${manifest.base.contracts[contract.name]}`);
      continue;
    }
    
    const deployment = await deployContract(contract.name, contract.factory, contract.args);
    
    if (deployment) {
      manifest.base.contracts[contract.name] = deployment.address;
    }
  }
  
  await saveManifest(manifest);
  
  console.log("\n" + "=".repeat(60));
  console.log("✅ X402 Contracts Deployment Complete!\n");
  console.log("📋 Deployed Contracts:");
  for (const [name, address] of Object.entries(manifest.base.contracts)) {
    if (name.startsWith("X402")) {
      console.log(`   ${name}: ${address}`);
    }
  }
  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

