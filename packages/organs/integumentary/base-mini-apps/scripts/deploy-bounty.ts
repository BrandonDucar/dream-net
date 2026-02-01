import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("🚀 Deploying Bounty Escrow Contract...\n");

  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    throw new Error("No signers available. Check PRIVATE_KEY in .env file.");
  }
  const [deployer] = signers;
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  const BountyEscrow = await ethers.getContractFactory("BountyEscrow");
  const bounty = await BountyEscrow.deploy();

  await bounty.waitForDeployment();

  const address = await bounty.getAddress();
  console.log("\n✅ Bounty Escrow deployed to:", address);

  const deploymentTx = bounty.deploymentTransaction();
  if (deploymentTx) {
    console.log("📄 Deployment TX:", deploymentTx.hash);
  }

  console.log("\n🎉 Deployment complete!");
  console.log("\nNext steps:");
  console.log(`1. Update bountyContractAddress in frontend: ${address}`);
  console.log("2. Verify contract on BaseScan");
  console.log(`3. Save to .env: BOUNTY_CONTRACT_ADDRESS=${address}`);

  return { address, bounty };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

