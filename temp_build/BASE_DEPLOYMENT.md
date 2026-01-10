# Base Deployment Guide

## Prerequisites

1. **MetaMask Wallet** with real ETH on Base
2. **Private Key** exported from MetaMask (for deployment)
3. **Base RPC URL** (use public or get from Alchemy/Infura)
4. **BaseScan API Key** (optional, for contract verification)

## Step 1: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Base Network Configuration
PRIVATE_KEY=your_metamask_private_key_here
BASE_MAINNET_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Optional: For contract verification
BASE_SCAN_API_KEY=your_basescan_api_key

# Optional: For rewards engine minter
DREAM_TOKEN_ADDRESS=0x... # Will be set after deployment
```

### Getting Your Private Key from MetaMask

1. Open MetaMask
2. Click the account icon (top right)
3. Go to **Settings** → **Security & Privacy**
4. Click **Show Private Key**
5. Enter your password
6. Copy the private key (starts with `0x`)

⚠️ **SECURITY WARNING**: Never commit your private key to git! Add `.env` to `.gitignore`.

## Step 2: Compile Contracts

```bash
pnpm compile
```

This compiles all Solidity contracts including:
- `DreamToken.sol` - Main DREAM token (ERC20)
- `SheepToken.sol` - SHEEP token (ERC20)
- `DreamerPass.sol` - NFT pass
- `SubscriptionBadge.sol` - Subscription NFT
- `SubscriptionHub.sol` - Subscription management

## Step 3: Deploy to Base Sepolia (Testnet)

First, test on Base Sepolia:

```bash
pnpm deploy:base-sepolia
```

This will:
1. Deploy all contracts
2. Print deployment addresses
3. Save deployment info as JSON

**Expected Output:**
```
Deploying contracts with account: 0x...
Account balance: 1000000000000000000

=== Deploying DreamToken ===
DreamToken deployed to: 0x...

=== Deploying SheepToken ===
SheepToken deployed to: 0x...

=== Deployment Summary ===
Network: baseSepolia
Chain ID: 84532
DreamToken: 0x...
SheepToken: 0x...
...
```

## Step 4: Verify Contracts (Optional)

After deployment, verify on BaseScan:

```bash
pnpm verify:base
```

## Step 5: Deploy to Base Mainnet

Once tested on Sepolia, deploy to mainnet:

```bash
pnpm deploy:base-mainnet
```

⚠️ **MAKE SURE YOU HAVE ENOUGH ETH FOR GAS!**

Base mainnet gas costs:
- DreamToken deployment: ~0.01-0.02 ETH
- SheepToken deployment: ~0.01-0.02 ETH
- Other contracts: ~0.01-0.03 ETH each
- **Total: ~0.05-0.1 ETH** (depending on gas prices)

## Step 6: Update Dream Token Bridge

After deployment, update `packages/dream-token/dreamTokenBridge.ts`:

```typescript
// Replace the TODO with actual address
const DREAM_TOKEN_ADDRESS = "0x..."; // Your deployed address
```

Then update the bridge functions to use the real contract.

## Step 7: Configure Rewards Engine

Update the rewards engine to use the deployed contract:

1. Set `DREAM_TOKEN_ADDRESS` in `.env`
2. The rewards engine can now mint DREAM tokens when users claim

## Mini Apps on Base

### What Can You Deploy?

1. **DreamToken Contract** - Core utility token
2. **SheepToken Contract** - Soft currency token
3. **DreamerPass NFT** - Access passes
4. **SubscriptionBadge NFT** - Subscription tokens
5. **SubscriptionHub** - Subscription management

### Integration Points

- **Frontend**: Use `ethers.js` or `viem` to interact with contracts
- **Backend**: Use the deployed addresses in `dreamTokenBridge.ts`
- **Rewards**: Mint tokens when users claim internal DREAM

## Troubleshooting

### "Insufficient funds"
- Make sure you have ETH in your MetaMask wallet
- Base mainnet requires real ETH (not testnet ETH)

### "Nonce too high"
- Reset your MetaMask account nonce
- Or wait a few minutes and try again

### "Contract deployment failed"
- Check your private key is correct
- Verify RPC URL is accessible
- Ensure you have enough gas

## Next Steps

1. ✅ Deploy contracts to Base
2. ✅ Update `dreamTokenBridge.ts` with contract addresses
3. ✅ Test token minting from rewards engine
4. ✅ Integrate frontend wallet connection
5. ✅ Enable DREAM token claims

## Resources

- [Base Documentation](https://docs.base.org/)
- [BaseScan Explorer](https://basescan.org/)
- [Base Faucet (Sepolia)](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
- [Hardhat Base Guide](https://hardhat.org/hardhat-runner/docs/guides/deploying)

