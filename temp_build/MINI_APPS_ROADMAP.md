# Mini Apps Roadmap - What We'll Build

## 🎯 Phase 1: Deploy Contracts (Now)
- ✅ DreamToken contract
- ✅ SheepToken contract  
- ✅ SubscriptionHub contract
- ✅ DreamerPass NFT
- ✅ SubscriptionBadge NFT

## 📱 Phase 2: Build Mini Apps (After Deployment)

### 1. **DREAM Rewards Mini App** ⭐ Priority
**What it does:**
- Users claim daily/weekly DREAM rewards
- View DREAM/SHEEP balances
- Convert internal DREAM to on-chain tokens
- Streak tracking

**Uses contracts:**
- DreamToken (mint on claims)
- SheepToken (display balance)

**Where:** `apps/site/src/pages/miniapps/rewards.tsx`

### 2. **Subscription Hub Mini App**
**What it does:**
- Browse subscription tiers
- Mint subscription badges (NFTs)
- Manage active subscriptions
- Auto-renewal status

**Uses contracts:**
- SubscriptionHub (subscribe/unsubscribe)
- SubscriptionBadge (mint/view NFTs)

**Where:** `apps/site/src/pages/miniapps/subscriptions.tsx`

### 3. **Token Balance Mini App**
**What it does:**
- Check wallet DREAM/SHEEP balances
- View on-chain vs internal balances
- Token gating (access based on holdings)
- Transfer tokens

**Uses contracts:**
- DreamToken (balanceOf)
- SheepToken (balanceOf)

**Where:** `apps/site/src/pages/miniapps/balance.tsx`

### 4. **Dreamer Pass Mini App**
**What it does:**
- Mint/claim DreamerPass NFT
- View pass benefits
- Access gated features
- Pass marketplace (future)

**Uses contracts:**
- DreamerPass (mint/view)

**Where:** `apps/site/src/pages/miniapps/pass.tsx`

## 🛠️ Implementation Plan

### Step 1: After Contract Deployment
```bash
# Get contract addresses from deployment output
DREAM_TOKEN_ADDRESS=0x...
SHEEP_TOKEN_ADDRESS=0x...
SUBSCRIPTION_HUB_ADDRESS=0x...
```

### Step 2: Install Base MiniKit
```bash
cd apps/site
pnpm add @coinbase/onchainkit ethers
```

### Step 3: Create Mini App Pages
```bash
# Create directory
mkdir -p apps/site/src/pages/miniapps

# Create each mini app
# - rewards.tsx
# - subscriptions.tsx
# - balance.tsx
# - pass.tsx
```

### Step 4: Connect to Contracts
```typescript
// Create contract instances
import { ethers } from 'ethers';
import DreamTokenABI from '@/contracts/DreamToken.json';

const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
const dreamToken = new ethers.Contract(
  process.env.DREAM_TOKEN_ADDRESS!,
  DreamTokenABI,
  provider
);
```

### Step 5: Deploy to Vercel
```bash
# Your site is already on Vercel
# Mini apps will be at:
# - dreamnet.ink/miniapps/rewards
# - dreamnet.ink/miniapps/subscriptions
# etc.
```

### Step 6: Register with Base
- Submit mini app URLs to Base
- They appear in Base app directory
- Users discover and use them

## 🎨 Mini App Features

### All Mini Apps Will Have:
- ✅ Wallet connection (MetaMask/Base wallet)
- ✅ On-chain contract interaction
- ✅ Real-time balance updates
- ✅ Transaction status
- ✅ Mobile-friendly UI
- ✅ Base app integration

### Example Mini App Structure:
```
miniapps/
├── rewards/
│   ├── index.tsx          # Main rewards page
│   ├── ClaimButton.tsx   # Claim daily/weekly
│   ├── BalanceCard.tsx    # Show DREAM/SHEEP
│   └── StreakBadge.tsx   # Streak display
├── subscriptions/
│   ├── index.tsx
│   ├── TierCard.tsx
│   └── SubscribeButton.tsx
└── balance/
    ├── index.tsx
    └── TokenCard.tsx
```

## 🚀 Quick Start After Deployment

1. **Get contract addresses** from deployment
2. **Create first mini app** (DREAM Rewards)
3. **Test locally** with MetaMask
4. **Deploy to Vercel**
5. **Test in Base app** (if you have access)
6. **Submit to Base directory**

## 💡 Pro Tips

- Start with **DREAM Rewards** mini app (simplest)
- Use your existing **RewardsWidget** component
- Connect it to **on-chain contracts**
- Make it work in **Base app** context

---

**Ready to build mini apps once contracts are deployed!** 🚀

