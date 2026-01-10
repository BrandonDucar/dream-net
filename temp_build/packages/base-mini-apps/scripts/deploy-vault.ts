import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("🚀 Deploying Dream Vault NFT Contract...\n");

  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    throw new Error("No signers available. Check PRIVATE_KEY in .env file.");
  }
  const [deployer] = signers;
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  const DreamVaultNFT = await ethers.getContractFactory("DreamVaultNFT");
  const vault = await DreamVaultNFT.deploy();

  await vault.waitForDeployment();

  const address = await vault.getAddress();
  console.log("\n✅ Dream Vault NFT deployed to:", address);

  const deploymentTx = vault.deploymentTransaction();
  if (deploymentTx) {
    console.log("📄 Deployment TX:", deploymentTx.hash);
  }

  console.log("\n🎉 Deployment complete!");
  console.log("\nNext steps:");
  console.log(`1. Update vaultContractAddress in frontend: ${address}`);
  console.log("2. Verify contract on BaseScan");
  console.log(`3. Save to .env: VAULT_CONTRACT_ADDRESS=${address}`);

  return { address, vault };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

