import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("🚀 Deploying Dream Passport NFT Contract...\n");

  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    throw new Error("No signers available. Check PRIVATE_KEY in .env file.");
  }
  const [deployer] = signers;
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const DreamPassportNFT = await ethers.getContractFactory("DreamPassportNFT");
  const passport = await DreamPassportNFT.deploy();

  await passport.waitForDeployment();

  const address = await passport.getAddress();
  console.log("\n✅ Dream Passport NFT deployed to:", address);

  // Get deployment transaction
  const deploymentTx = passport.deploymentTransaction();
  if (deploymentTx) {
    console.log("📄 Deployment TX:", deploymentTx.hash);
  }

  console.log("\n🎉 Deployment complete!");
  console.log("\nNext steps:");
  console.log(`1. Update passportContractAddress in frontend: ${address}`);
  console.log("2. Verify contract on BaseScan");
  console.log("3. Update BaseMiniApps with contract address");

  return { address, passport };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

