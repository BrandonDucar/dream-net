import hardhat from "hardhat";

const { ethers } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());
  
  // Deploy SheepToken
  console.log("\n=== Deploying SheepToken ===");
  const SheepToken = await ethers.getContractFactory("SheepToken");
  const sheepToken = await SheepToken.deploy(deployer.address);
  await sheepToken.waitForDeployment();
  const sheepTokenAddress = await sheepToken.getAddress();
  console.log("SheepToken deployed to:", sheepTokenAddress);
  
  // Deploy DreamerPass
  console.log("\n=== Deploying DreamerPass ===");
  const baseURI = "https://dreamnet.ink/api/nft/";
  const DreamerPass = await ethers.getContractFactory("DreamerPass");
  const dreamerPass = await DreamerPass.deploy(deployer.address, baseURI);
  await dreamerPass.waitForDeployment();
  const dreamerPassAddress = await dreamerPass.getAddress();
  console.log("DreamerPass deployed to:", dreamerPassAddress);

  // Deploy SubscriptionBadge
  console.log("\n=== Deploying SubscriptionBadge ===");
  const defaultBadgeURI = "https://dreamnet.ink/api/subscriptions/{id}.json";
  const SubscriptionBadge = await ethers.getContractFactory("SubscriptionBadge");
  const subscriptionBadge = await SubscriptionBadge.deploy(defaultBadgeURI, deployer.address);
  await subscriptionBadge.waitForDeployment();
  const subscriptionBadgeAddress = await subscriptionBadge.getAddress();
  console.log("SubscriptionBadge deployed to:", subscriptionBadgeAddress);

  // Deploy SubscriptionHub
  console.log("\n=== Deploying SubscriptionHub ===");
  const SubscriptionHub = await ethers.getContractFactory("SubscriptionHub");
  const subscriptionHub = await SubscriptionHub.deploy(subscriptionBadgeAddress, deployer.address);
  await subscriptionHub.waitForDeployment();
  const subscriptionHubAddress = await subscriptionHub.getAddress();
  console.log("SubscriptionHub deployed to:", subscriptionHubAddress);

  // Configure badge minter
  const setMinterTx = await subscriptionBadge.setMinter(subscriptionHubAddress);
  await setMinterTx.wait();
  console.log("Configured SubscriptionHub as badge minter");
  
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("SheepToken:", sheepTokenAddress);
  console.log("DreamerPass:", dreamerPassAddress);
  console.log("SubscriptionBadge:", subscriptionBadgeAddress);
  console.log("SubscriptionHub:", subscriptionHubAddress);
  
  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    deployer: deployer.address,
    contracts: {
      SheepToken: sheepTokenAddress,
      DreamerPass: dreamerPassAddress,
      SubscriptionBadge: subscriptionBadgeAddress,
      SubscriptionHub: subscriptionHubAddress,
    },
    timestamp: new Date().toISOString(),
  };
  
  console.log("\n=== Deployment Info (save this) ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

