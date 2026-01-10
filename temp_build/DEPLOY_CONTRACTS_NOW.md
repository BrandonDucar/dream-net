# Deploy Contracts Now 🚀

## Quick Deploy Commands

### 1. Set Environment Variables

Make sure you have these in your `.env` file:

```bash
PRIVATE_KEY=your_deployer_private_key_here
BASE_MAINNET_RPC_URL=https://mainnet.base.org
BASE_SCAN_API_KEY=your_basescan_api_key
```

### 2. Deploy to Base Mainnet

```bash
cd packages/base-mini-apps
pnpm hardhat run scripts/deploy-and-save.ts --network base
```

### 3. Or Deploy to Base Sepolia (Testnet First)

```bash
cd packages/base-mini-apps
pnpm hardhat run scripts/deploy-and-save.ts --network baseSepolia
```

## What Will Be Deployed

The script will deploy these 3 new contracts:
- **DreamShop** - On-chain storefront
- **TributeGate** - Tribute/payment system  
- **WalletScoreRegistry** - Wallet scoring registry

Plus it will check/update existing contracts.

## Expected Output

After deployment, you'll see:
```
✅ DreamShop deployed: 0x...
✅ TributeGate deployed: 0x...
✅ WalletScoreRegistry deployed: 0x...

📄 Contract Addresses (for config.ts):
  DreamShop: getEnv('VITE_DREAM_SHOP_ADDRESS', "0x..."),
  TributeGate: getEnv('VITE_TRIBUTE_GATE_ADDRESS', "0x..."),
  WalletScoreRegistry: getEnv('VITE_WALLET_SCORE_ADDRESS', "0x..."),
```

Addresses will be automatically saved to `contracts/deployment.json`.

## After Deployment

1. Copy the addresses from the output
2. Update `packages/base-mini-apps/frontend/config.ts` with the new addresses
3. Or set environment variables:
   ```bash
   VITE_DREAM_SHOP_ADDRESS=0x...
   VITE_TRIBUTE_GATE_ADDRESS=0x...
   VITE_WALLET_SCORE_ADDRESS=0x...
   ```

## Verify Contracts (Optional)

```bash
pnpm hardhat verify --network base <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Example:
```bash
pnpm hardhat verify --network base 0x... <DEPLOYER_ADDRESS>
```

