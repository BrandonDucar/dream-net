# Quick Start: Deploy to Base

## 🚀 Fast Track (5 minutes)

### 1. Get Your Private Key
```bash
# From MetaMask:
# Settings → Security & Privacy → Show Private Key
# Copy the key (starts with 0x)
```

### 2. Create .env File
```bash
# Copy the example
cp .env.example .env

# Edit .env and add:
PRIVATE_KEY=0x_your_private_key_here
```

### 3. Check Setup
```bash
pnpm tsx scripts/setup-base-deployment.ts
```

### 4. Compile Contracts
```bash
pnpm compile
```

### 5. Deploy to Base Sepolia (Testnet)
```bash
pnpm deploy:base-sepolia
```

### 6. Deploy to Base Mainnet 🎯
```bash
pnpm deploy:base-mainnet
```

## 📋 What Gets Deployed

1. **DreamToken** - Your main DREAM token (ERC20)
2. **SheepToken** - SHEEP soft currency (ERC20)
3. **DreamerPass** - NFT passes
4. **SubscriptionBadge** - Subscription NFTs
5. **SubscriptionHub** - Subscription manager

## 💰 Gas Costs

- **Base Sepolia**: Free (testnet ETH from faucet)
- **Base Mainnet**: ~0.05-0.1 ETH total
  - DreamToken: ~0.01-0.02 ETH
  - SheepToken: ~0.01-0.02 ETH
  - Other contracts: ~0.01-0.03 ETH each

## ✅ After Deployment

1. **Save the addresses** from the deployment output
2. **Update .env** with contract addresses:
   ```
   DREAM_TOKEN_ADDRESS=0x...
   SHEEP_TOKEN_ADDRESS=0x...
   ```
3. **Update dreamTokenBridge.ts** - The bridge is ready, just needs addresses
4. **Test minting** - Use the Operator Panel to mint test tokens

## 🔗 Integration

Once deployed, your rewards engine can:
- Mint DREAM tokens when users claim
- Track on-chain balances
- Enable real token transfers

## 🆘 Need Help?

- Check `BASE_DEPLOYMENT.md` for detailed guide
- Run `pnpm tsx scripts/setup-base-deployment.ts` to check setup
- Make sure you have ETH in MetaMask for gas!

