import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("🚀 Deploying Whisper Messenger...\n");

  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    throw new Error("No signers available. Check PRIVATE_KEY in .env file.");
  }
  const [deployer] = signers;
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  const WhisperMessenger = await ethers.getContractFactory("WhisperMessenger");
  const whisper = await WhisperMessenger.deploy();
  await whisper.waitForDeployment();

  const address = await whisper.getAddress();
  const tx = whisper.deploymentTransaction()?.hash || "";

  console.log("✅ Deployed:", address);
  console.log("📄 TX:", tx);
  console.log("\n💾 Save to .env: WHISPER_MESSENGER_ADDRESS=" + address + "\n");

  return { address, tx };
}

main().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });

