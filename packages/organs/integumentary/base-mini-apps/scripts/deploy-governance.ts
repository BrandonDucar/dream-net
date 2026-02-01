import hre from "hardhat";
const { ethers } = hre;

async function main() {
  const passportAddress = process.env.PASSPORT_CONTRACT_ADDRESS;
  if (!passportAddress) {
    throw new Error("PASSPORT_CONTRACT_ADDRESS environment variable not set");
  }

  console.log("🚀 Deploying Dream State Governance Contract...\n");
  console.log("Passport Contract:", passportAddress);

  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    throw new Error("No signers available. Check PRIVATE_KEY in .env file.");
  }
  const [deployer] = signers;
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const DreamStateGovernance = await ethers.getContractFactory("DreamStateGovernance");
  const governance = await DreamStateGovernance.deploy(passportAddress);

  await governance.waitForDeployment();

  const address = await governance.getAddress();
  console.log("\n✅ Dream State Governance deployed to:", address);

  const deploymentTx = governance.deploymentTransaction();
  if (deploymentTx) {
    console.log("📄 Deployment TX:", deploymentTx.hash);
  }

  console.log("\n🎉 Deployment complete!");
  console.log("\nNext steps:");
  console.log(`1. Update governanceContractAddress in frontend: ${address}`);
  console.log("2. Verify contract on BaseScan");
  console.log("3. Update BaseMiniApps with contract address");

  return { address, governance };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

