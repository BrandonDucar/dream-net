import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("🚀 Deploying Revenue Splitter...\n");

  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    throw new Error("No signers available. Check PRIVATE_KEY in .env file.");
  }
  const [deployer] = signers;
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  const RevenueSplitter = await ethers.getContractFactory("RevenueSplitter");
  const splitter = await RevenueSplitter.deploy();
  await splitter.waitForDeployment();

  const address = await splitter.getAddress();
  const tx = splitter.deploymentTransaction()?.hash || "";

  console.log("✅ Deployed:", address);
  console.log("📄 TX:", tx);
  console.log("\n💾 Save to .env: REVENUE_SPLITTER_ADDRESS=" + address + "\n");

  return { address, tx };
}

main().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });

