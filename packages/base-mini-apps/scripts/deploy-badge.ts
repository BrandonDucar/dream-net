import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("🚀 Deploying Badge NFT Contract...\n");

  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    throw new Error("No signers available. Check PRIVATE_KEY in .env file.");
  }
  const [deployer] = signers;
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  const BadgeNFT = await ethers.getContractFactory("BadgeNFT");
  const badge = await BadgeNFT.deploy();

  await badge.waitForDeployment();

  const address = await badge.getAddress();
  console.log("\n✅ Badge NFT deployed to:", address);

  const deploymentTx = badge.deploymentTransaction();
  if (deploymentTx) {
    console.log("📄 Deployment TX:", deploymentTx.hash);
  }

  console.log("\n🎉 Deployment complete!");
  console.log("\nNext steps:");
  console.log(`1. Update badgeContractAddress in frontend: ${address}`);
  console.log("2. Verify contract on BaseScan");
  console.log(`3. Save to .env: BADGE_CONTRACT_ADDRESS=${address}`);

  return { address, badge };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

