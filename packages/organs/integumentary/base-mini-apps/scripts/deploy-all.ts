import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("===============================================");
  console.log(" 🚀 Deploying All Base Mini-Apps");
  console.log("===============================================\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  const deployments: Record<string, { address: string; tx: string }> = {};

  // 1. Deploy Passport Contract
  console.log("📱 1/2 Deploying Dream Passport NFT...");
  const DreamPassportNFT = await ethers.getContractFactory("DreamPassportNFT");
  const passport = await DreamPassportNFT.deploy();
  await passport.waitForDeployment();
  const passportAddress = await passport.getAddress();
  const passportTx = passport.deploymentTransaction()?.hash || "";
  
  deployments["passport"] = { address: passportAddress, tx: passportTx };
  console.log(`   ✅ Deployed: ${passportAddress}`);
  console.log(`   📄 TX: ${passportTx}\n`);

  // 2. Deploy Governance Contract
  console.log("📱 2/2 Deploying Dream State Governance...");
  const DreamStateGovernance = await ethers.getContractFactory("DreamStateGovernance");
  const governance = await DreamStateGovernance.deploy(passportAddress);
  await governance.waitForDeployment();
  const governanceAddress = await governance.getAddress();
  const governanceTx = governance.deploymentTransaction()?.hash || "";
  
  deployments["governance"] = { address: governanceAddress, tx: governanceTx };
  console.log(`   ✅ Deployed: ${governanceAddress}`);
  console.log(`   📄 TX: ${governanceTx}\n`);

  console.log("===============================================");
  console.log(" ✅ Deployment Complete");
  console.log("===============================================\n");

  console.log("📋 Deployment Summary:");
  console.log(`   Passport Contract: ${passportAddress}`);
  console.log(`   Governance Contract: ${governanceAddress}\n`);

  console.log("📝 Contract Addresses (save these!):");
  console.log(`   PASSPORT_CONTRACT_ADDRESS=${passportAddress}`);
  console.log(`   GOVERNANCE_CONTRACT_ADDRESS=${governanceAddress}\n`);

  console.log("🔗 BaseScan Links:");
  console.log(`   Passport: https://basescan.org/address/${passportAddress}`);
  console.log(`   Governance: https://basescan.org/address/${governanceAddress}\n`);

  console.log("💡 Next Steps:");
  console.log("   1. Verify contracts on BaseScan");
  console.log("   2. Update frontend with contract addresses");
  console.log("   3. Test minting passports");
  console.log("   4. Create first governance proposal");
  console.log("   5. Launch mini-apps!");
  console.log("");

  return deployments;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

