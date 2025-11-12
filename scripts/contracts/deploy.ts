import { ethers } from "hardhat";

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
  
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("SheepToken:", sheepTokenAddress);
  console.log("DreamerPass:", dreamerPassAddress);
  
  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    deployer: deployer.address,
    contracts: {
      SheepToken: sheepTokenAddress,
      DreamerPass: dreamerPassAddress,
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

