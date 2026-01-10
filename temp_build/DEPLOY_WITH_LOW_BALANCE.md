# 💰 Deploying with Limited ETH

## Your Situation
- **You have**: ~$8.80 worth of ETH (~0.003 ETH)
- **Full deployment needs**: ~$270 (~0.09 ETH)
- **Essential contracts need**: ~$90 (~0.03 ETH)

## 🎯 Strategy: Deploy Essential First

Since you have limited funds, we'll deploy **just the essential contracts** first:

1. **DreamToken** - Your main token (~$45)
2. **SheepToken** - Soft currency (~$45)

Then deploy the rest later when you have more ETH.

## 🚀 Deploy Essential Contracts

Once your ETH is swapped to Base:

```bash
# Deploy just DreamToken (and SheepToken if you have enough)
pnpm deploy:essential
```

This will:
- ✅ Deploy DreamToken first
- ✅ Check if you have enough for SheepToken
- ✅ Deploy SheepToken if possible
- ✅ Save addresses for later

## 📋 What You'll Get

After deployment, you'll have:
- ✅ **DreamToken** address (most important!)
- ✅ **SheepToken** address (if deployed)
- ✅ Contract addresses saved

## 🔄 Deploy Rest Later

When you have more ETH (~$180 more), deploy the rest:

```bash
# Deploy remaining contracts
pnpm deploy:base-mainnet
```

This will deploy:
- DreamerPass NFT
- SubscriptionBadge NFT
- SubscriptionHub

## 💡 Alternative: Wait for More ETH

If you want to deploy everything at once:
1. Get ~$270 worth of ETH on Base
2. Run: `pnpm deploy:base-mainnet`
3. Deploy all contracts in one go

## ✅ After Essential Deployment

1. **Save the addresses** from output
2. **Add to .env**:
   ```
   DREAM_TOKEN_ADDRESS=0x...
   SHEEP_TOKEN_ADDRESS=0x...
   ```
3. **Start building mini apps** with DreamToken!
4. **Deploy rest later** when you have more ETH

---

**Bottom line**: Deploy DreamToken now with what you have, build mini apps, deploy rest later! 🚀

