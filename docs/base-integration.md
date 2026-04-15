# Base L2 Integration Guide

## Overview
DreamNet is now configured to deploy and interact with Base L2 network. This includes ERC20 token ($SHEEP) and ERC1155 NFT (Dreamer Pass) contracts.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in:
- `BASE_MAINNET_RPC_URL` - Base mainnet RPC endpoint
- `BASE_SEPOLIA_RPC_URL` - Base Sepolia testnet RPC endpoint  
- `BASE_SCAN_API_KEY` - Basescan API key for contract verification
- `PRIVATE_KEY` - Your wallet private key for deployment

### 3. Compile Contracts
```bash
npm run compile
```

## Deployment

### Deploy to Base Sepolia (Testnet)
```bash
npm run deploy:base-sepolia
```

### Deploy to Base Mainnet
```bash
npm run deploy:base-mainnet
```

After deployment, save the contract addresses to your `.env` file:
```
SHEEP_TOKEN_ADDRESS=0x...
DREAMER_PASS_ADDRESS=0x...
```

## Contracts

### SheepToken (ERC20)
- **Name:** Sheep Token
- **Symbol:** SHEEP
- **Decimals:** 18
- **Total Supply:** 1,000,000,000 SHEEP
- **Features:** Minting (owner only), burning

### DreamerPass (ERC1155)
- **Name:** Dreamer Pass
- **Symbol:** DREAMER
- **Tiers:** Bronze (ID: 1), Silver (ID: 2), Gold (ID: 3), Platinum (ID: 4)
- **Features:** Multi-tier passes, configurable supply limits, minting control

## Verification

### Verify Base Network Connection
```bash
npm run verify:base
```

This script checks:
- Network connection (Base Mainnet or Sepolia)
- RPC endpoint accessibility
- Current block number and gas prices
- Contract deployment status (if addresses provided)

## Next Steps

1. **Frontend Integration**
   - Install `@coinbase/onchainkit`
   - Wrap app in `<OnchainProviders chainId={8453}>`
   - Add SmartWallet login
   - Configure Paymaster for gas sponsorship

2. **Health Checks**
   - Add Base RPC health checks to DreamOps
   - Set up event watchers for token transfers
   - Monitor contract interactions

3. **Reward Engine**
   - Initialize ZenGarden reward engine
   - Map user actions to ERC20 reward minting
   - Implement Dreamer Pass gating logic

## Resources

- [Base Documentation](https://docs.base.org/)
- [Basescan](https://basescan.org/)
- [Coinbase OnchainKit](https://onchainkit.xyz/)
- [Hardhat Documentation](https://hardhat.org/docs)

