import hardhat from "hardhat";

const { ethers } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying remaining contracts with account:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  
  // DreamToken already deployed: 0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77
  const dreamTokenAddress = "0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77";
  console.log("\n✅ DreamToken already deployed:", dreamTokenAddress);
  
  // Wait a bit for any pending transactions
  console.log("\n⏳ Waiting 5 seconds for pending transactions...");
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Deploy SheepToken
  console.log("\n=== Deploying SheepToken ===");
  try {
    const SheepToken = await ethers.getContractFactory("SheepToken");
    const sheepToken = await SheepToken.deploy(deployer.address);
    await sheepToken.waitForDeployment();
    const sheepTokenAddress = await sheepToken.getAddress();
    console.log("✅ SheepToken deployed to:", sheepTokenAddress);
    
    // Wait again
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Deploy DreamerPass
    console.log("\n=== Deploying DreamerPass ===");
    const baseURI = "https://dreamnet.ink/api/nft/";
    const DreamerPass = await ethers.getContractFactory("DreamerPass");
    const dreamerPass = await DreamerPass.deploy(deployer.address, baseURI);
    await dreamerPass.waitForDeployment();
    const dreamerPassAddress = await dreamerPass.getAddress();
    console.log("✅ DreamerPass deployed to:", dreamerPassAddress);
    
    // Wait again
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Deploy SubscriptionBadge
    console.log("\n=== Deploying SubscriptionBadge ===");
    const defaultBadgeURI = "https://dreamnet.ink/api/subscriptions/{id}.json";
    const SubscriptionBadge = await ethers.getContractFactory("SubscriptionBadge");
    const subscriptionBadge = await SubscriptionBadge.deploy(defaultBadgeURI, deployer.address);
    await subscriptionBadge.waitForDeployment();
    const subscriptionBadgeAddress = await subscriptionBadge.getAddress();
    console.log("✅ SubscriptionBadge deployed to:", subscriptionBadgeAddress);
    
    // Wait again
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Deploy SubscriptionHub
    console.log("\n=== Deploying SubscriptionHub ===");
    const SubscriptionHub = await ethers.getContractFactory("SubscriptionHub");
    const subscriptionHub = await SubscriptionHub.deploy(subscriptionBadgeAddress, deployer.address);
    await subscriptionHub.waitForDeployment();
    const subscriptionHubAddress = await subscriptionHub.getAddress();
    console.log("✅ SubscriptionHub deployed to:", subscriptionHubAddress);
    
    // Configure badge minter
    console.log("\n=== Configuring SubscriptionHub as badge minter ===");
    const setMinterTx = await subscriptionBadge.setMinter(subscriptionHubAddress);
    await setMinterTx.wait();
    console.log("✅ Configured SubscriptionHub as badge minter");
    
    console.log("\n=== Deployment Summary ===");
    console.log("Network:", (await ethers.provider.getNetwork()).name);
    console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
    console.log("DreamToken:", dreamTokenAddress);
    console.log("SheepToken:", sheepTokenAddress);
    console.log("DreamerPass:", dreamerPassAddress);
    console.log("SubscriptionBadge:", subscriptionBadgeAddress);
    console.log("SubscriptionHub:", subscriptionHubAddress);
    
    const deploymentInfo = {
      network: (await ethers.provider.getNetwork()).name,
      chainId: (await ethers.provider.getNetwork()).chainId,
      deployer: deployer.address,
      contracts: {
        DreamToken: dreamTokenAddress,
        SheepToken: sheepTokenAddress,
        DreamerPass: dreamerPassAddress,
        SubscriptionBadge: subscriptionBadgeAddress,
        SubscriptionHub: subscriptionHubAddress,
      },
      timestamp: new Date().toISOString(),
    };
    
    console.log("\n=== Deployment Info (save this) ===");
    console.log(JSON.stringify(deploymentInfo, null, 2));
    
  } catch (error: any) {
    console.error("\n❌ Deployment error:", error.message);
    if (error.message.includes("replacement transaction underpriced")) {
      console.log("\n💡 This usually means a transaction is pending.");
      console.log("   Wait a minute and try again, or check BaseScan for pending transactions.");
    }
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

