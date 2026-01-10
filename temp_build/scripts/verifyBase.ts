import { ethers } from "hardhat";

/**
 * Verify Base network contracts are deployed and accessible
 */
async function main() {
  const network = await ethers.provider.getNetwork();
  console.log("Checking Base network connection...");
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId);
  
  // Check if we're on Base
  const isBaseMainnet = network.chainId === BigInt(8453);
  const isBaseSepolia = network.chainId === BigInt(84532);
  
  if (!isBaseMainnet && !isBaseSepolia) {
    console.warn("⚠️  Not connected to Base network!");
    console.log("Expected Chain ID: 8453 (Base Mainnet) or 84532 (Base Sepolia)");
    return;
  }
  
  console.log(`✅ Connected to Base ${isBaseMainnet ? "Mainnet" : "Sepolia"}`);
  
  // Test RPC connection
  try {
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log("Current block number:", blockNumber);
    
    const block = await ethers.provider.getBlock("latest");
    console.log("Latest block timestamp:", new Date(Number(block?.timestamp) * 1000).toISOString());
    
    // Get gas price
    const feeData = await ethers.provider.getFeeData();
    console.log("Gas price:", ethers.formatUnits(feeData.gasPrice || 0n, "gwei"), "gwei");
    
    console.log("\n✅ Base RPC connection verified!");
  } catch (error) {
    console.error("❌ Error connecting to Base RPC:", error);
  }
  
  // Check contract addresses if provided
  const sheepTokenAddress = process.env.SHEEP_TOKEN_ADDRESS;
  const dreamerPassAddress = process.env.DREAMER_PASS_ADDRESS;
  
  if (sheepTokenAddress) {
    try {
      const code = await ethers.provider.getCode(sheepTokenAddress);
      if (code === "0x") {
        console.log("⚠️  SheepToken not found at:", sheepTokenAddress);
      } else {
        console.log("✅ SheepToken contract verified at:", sheepTokenAddress);
      }
    } catch (error) {
      console.error("Error checking SheepToken:", error);
    }
  }
  
  if (dreamerPassAddress) {
    try {
      const code = await ethers.provider.getCode(dreamerPassAddress);
      if (code === "0x") {
        console.log("⚠️  DreamerPass not found at:", dreamerPassAddress);
      } else {
        console.log("✅ DreamerPass contract verified at:", dreamerPassAddress);
      }
    } catch (error) {
      console.error("Error checking DreamerPass:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

