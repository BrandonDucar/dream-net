/**
 * Retry Failed Contract Deployments
 */

import hre from "hardhat";
const { ethers } = hre;

async function main() {
  const signers = await ethers.getSigners();
  const [deployer] = signers;
  
  console.log("Retrying failed deployments...\n");
  console.log("Deployer:", deployer.address);
  
  const failedContracts = [
    { name: "SeasonalEventsRegistry", factory: "SeasonalEventsRegistry", args: [] },
    { name: "NightmareRegistry", factory: "NightmareRegistry", args: [] },
    { name: "RevenueSplitter", factory: "RevenueSplitter", args: [] },
    { name: "DreamDriftersRegistry", factory: "DreamDriftersRegistry", args: [] },
    { name: "DreamDNASequencer", factory: "DreamDNASequencer", args: [] },
    { name: "WalletScoreRegistry", factory: "WalletScoreRegistry", args: [deployer.address] },
  ];

  for (const contract of failedContracts) {
    try {
      console.log(`\n📦 Retrying ${contract.name}...`);
      const ContractFactory = await ethers.getContractFactory(contract.factory);
      const contractInstance = await ContractFactory.deploy(...contract.args);
      await contractInstance.waitForDeployment();
      
      const address = await contractInstance.getAddress();
      const txHash = contractInstance.deploymentTransaction()?.hash || "";
      
      console.log(`✅ ${contract.name} deployed:`);
      console.log(`   Address: ${address}`);
      console.log(`   TX: ${txHash}`);
    } catch (error: any) {
      console.error(`❌ Failed to deploy ${contract.name}:`, error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

