import hardhat from "hardhat";

const { ethers } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying ESSENTIAL contracts with account:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  
  // Check if we have enough for at least DreamToken
  const minRequired = ethers.parseEther("0.01"); // ~$30
  if (balance < minRequired) {
    console.error("\n❌ Insufficient balance!");
    console.error(`   You have: ${ethers.formatEther(balance)} ETH`);
    console.error(`   Need at least: ${ethers.formatEther(minRequired)} ETH`);
    console.error("\n   Get more ETH on Base mainnet and try again.");
    process.exit(1);
  }
  
  // Deploy DreamToken
  console.log("\n=== Deploying DreamToken ===");
  const DreamToken = await ethers.getContractFactory("DreamToken");
  const dreamToken = await DreamToken.deploy(deployer.address);
  await dreamToken.waitForDeployment();
  const dreamTokenAddress = await dreamToken.getAddress();
  console.log("✅ DreamToken deployed to:", dreamTokenAddress);
  
  // Check balance after first deployment
  const balanceAfter = await ethers.provider.getBalance(deployer.address);
  const remaining = ethers.formatEther(balanceAfter);
  console.log("Remaining balance:", remaining, "ETH");
  
  // Try to deploy SheepToken if we have enough
  if (balanceAfter >= minRequired) {
    console.log("\n=== Deploying SheepToken ===");
    const SheepToken = await ethers.getContractFactory("SheepToken");
    const sheepToken = await SheepToken.deploy(deployer.address);
    await sheepToken.waitForDeployment();
    const sheepTokenAddress = await sheepToken.getAddress();
    console.log("✅ SheepToken deployed to:", sheepTokenAddress);
    
    const finalBalance = await ethers.provider.getBalance(deployer.address);
    console.log("Final balance:", ethers.formatEther(finalBalance), "ETH");
    
    console.log("\n=== Essential Contracts Deployed ===");
    console.log("Network:", (await ethers.provider.getNetwork()).name);
    console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
    console.log("DreamToken:", dreamTokenAddress);
    console.log("SheepToken:", sheepTokenAddress);
    
    const deploymentInfo = {
      network: (await ethers.provider.getNetwork()).name,
      chainId: (await ethers.provider.getNetwork()).chainId,
      deployer: deployer.address,
      contracts: {
        DreamToken: dreamTokenAddress,
        SheepToken: sheepTokenAddress,
      },
      timestamp: new Date().toISOString(),
      note: "Essential contracts only. Deploy rest later with deploy-full.ts",
    };
    
    console.log("\n=== Deployment Info (save this) ===");
    console.log(JSON.stringify(deploymentInfo, null, 2));
  } else {
    console.log("\n⚠️  Not enough ETH left for SheepToken.");
    console.log("   Deploy it later when you have more ETH.");
    
    const deploymentInfo = {
      network: (await ethers.provider.getNetwork()).name,
      chainId: (await ethers.provider.getNetwork()).chainId,
      deployer: deployer.address,
      contracts: {
        DreamToken: dreamTokenAddress,
      },
      timestamp: new Date().toISOString(),
      note: "Only DreamToken deployed. Deploy SheepToken and others later.",
    };
    
    console.log("\n=== Deployment Info (save this) ===");
    console.log(JSON.stringify(deploymentInfo, null, 2));
  }
  
  console.log("\n💡 Next steps:");
  console.log("   1. Save the contract addresses above");
  console.log("   2. Add to .env: DREAM_TOKEN_ADDRESS=0x...");
  console.log("   3. Get more ETH and deploy rest with: pnpm deploy:base-mainnet");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

