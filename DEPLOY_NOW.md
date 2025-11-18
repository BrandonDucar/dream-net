# 🚀 Deploy to Base Mainnet - Quick Guide

## ⚠️ Important: Check Your Private Key

The account detected is a test account. Make sure your `.env` has your **real MetaMask private key**:

1. **Get your MetaMask private key:**
   - Open MetaMask
   - Click account icon → Settings → Security & Privacy
   - Click "Show Private Key"
   - Enter password
   - Copy the key (starts with `0x`)

2. **Update `.env`:**
   ```
   PRIVATE_KEY=0x_your_real_metamask_key_here
   ```

3. **Verify account:**
   ```bash
   pnpm tsx scripts/check-account.ts
   ```
   Should show your MetaMask address with ETH balance.

## 🚀 Deploy Commands

Once your account has ETH:

```bash
# Deploy all contracts to Base mainnet
pnpm deploy:base-mainnet
```

## 📋 What Gets Deployed

1. **DreamToken** - Main DREAM token (ERC20)
2. **SheepToken** - SHEEP soft currency (ERC20)
3. **DreamerPass** - NFT passes
4. **SubscriptionBadge** - Subscription NFTs
5. **SubscriptionHub** - Subscription manager

## 💰 Gas Costs

- **Total estimated**: ~0.05-0.1 ETH
- Make sure you have enough ETH in that account!

## ✅ After Deployment

Save the contract addresses from the output and add to `.env`:
```
DREAM_TOKEN_ADDRESS=0x...
SHEEP_TOKEN_ADDRESS=0x...
DREAMER_PASS_ADDRESS=0x...
SUBSCRIPTION_BADGE_ADDRESS=0x...
SUBSCRIPTION_HUB_ADDRESS=0x...
```

Then we can build the mini apps! 🎉

