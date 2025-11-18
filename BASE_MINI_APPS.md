# Base Mini Apps - How It Works

## 🎯 Two Types of "Apps" on Base

### 1. **Smart Contracts** (What we're deploying now)
- Deploy directly to Base blockchain
- Live forever on-chain
- Examples: DreamToken, SheepToken, SubscriptionHub
- **Deploy from here** → **Live on Base blockchain**

### 2. **Mini Apps** (Web apps that use those contracts)
- Web applications that run inside Base app/Farcaster
- Use Base's MiniKit framework
- Interact with your smart contracts
- **Deploy to web server** → **Accessible in Base app**

## 🚀 What We're Deploying Right Now

### Smart Contracts (Blockchain):
1. **DreamToken** - Your utility token
2. **SheepToken** - Soft currency
3. **DreamerPass** - NFT passes
4. **SubscriptionBadge** - Subscription NFTs
5. **SubscriptionHub** - Subscription manager

These deploy **directly to Base blockchain** and are **permanent**.

## 📱 Mini Apps You Can Build

Once contracts are deployed, you can create mini apps that use them:

### 1. **DREAM Rewards Mini App**
- Users claim daily/weekly rewards
- View DREAM/SHEEP balances
- Claim internal DREAM as on-chain tokens
- **Uses**: DreamToken, SheepToken contracts

### 2. **Subscription Hub Mini App**
- Browse subscription tiers
- Mint subscription badges
- Manage renewals
- **Uses**: SubscriptionHub, SubscriptionBadge contracts

### 3. **Token Balance Mini App**
- Check wallet holdings
- View DREAM/SHEEP balances
- Access gating based on tokens
- **Uses**: DreamToken, SheepToken contracts

### 4. **Dreamer Pass Mini App**
- Mint/claim DreamerPass NFTs
- View pass benefits
- Access gated features
- **Uses**: DreamerPass contract

## 🔄 How It Works

### Step 1: Deploy Smart Contracts (Now)
```bash
pnpm deploy:base-mainnet
```
✅ Contracts are now **live on Base blockchain**
✅ They have addresses like `0x...`
✅ Anyone can interact with them

### Step 2: Build Mini App (Next)
```bash
# Create mini app with Base MiniKit
npx create-onchain@latest --mini dream-rewards

# Or use your existing React app
# Just add Base MiniKit integration
```

### Step 3: Connect Mini App to Contracts
```typescript
// In your mini app
import { createOnchainKit } from '@coinbase/onchainkit';

const onchainKit = createOnchainKit({
  apiKey: 'YOUR_API_KEY',
  chain: 'base',
  // Your deployed contract addresses
  contracts: {
    dreamToken: '0x...', // From deployment
    sheepToken: '0x...',
    subscriptionHub: '0x...',
  }
});
```

### Step 4: Deploy Mini App
```bash
# Deploy to Vercel/Netlify/etc
vercel deploy

# Or use Base's hosting
# Your mini app URL becomes accessible in Base app
```

### Step 5: Register in Base App
- Submit your mini app to Base
- It appears in Base app's mini app directory
- Users can discover and use it

## 📦 What You Already Have

Looking at your code, you already have:
- ✅ **Subscription Hub** mini app concept
- ✅ **Token Balance** mini app concept
- ✅ React frontend ready
- ✅ Wallet integration (MetaMask/SIWE)

## 🎯 Quick Start: Create Your First Mini App

### Option 1: Use Base MiniKit (Recommended)
```bash
npx create-onchain@latest --mini dream-rewards
cd dream-rewards
# Connect to your deployed contracts
# Deploy to Vercel
```

### Option 2: Add to Existing Site
```bash
# In your existing apps/site
pnpm add @coinbase/onchainkit

# Create pages/miniapps/rewards.tsx
# Connect to deployed DreamToken contract
# Deploy to Vercel
```

## 🔗 The Flow

```
1. Deploy Contracts (Base Blockchain)
   ↓
2. Get Contract Addresses
   ↓
3. Build Mini App (Web App)
   ↓
4. Connect Mini App to Contracts
   ↓
5. Deploy Mini App (Web Server)
   ↓
6. Register in Base App
   ↓
7. Users Discover & Use
```

## 💡 Example: DREAM Rewards Mini App

```typescript
// apps/site/src/pages/miniapps/rewards.tsx
import { useOnchainKit } from '@coinbase/onchainkit';
import { DreamToken } from '@/contracts/DreamToken';

export default function RewardsMiniApp() {
  const { address, connectWallet } = useOnchainKit();
  const dreamToken = DreamToken.connect('0x...'); // Your deployed address
  
  const claimDaily = async () => {
    // Call your backend API
    await fetch('/api/rewards/daily-claim', {
      headers: { 'x-user-id': address }
    });
    
    // Then mint on-chain DREAM
    await dreamToken.mint(address, amount);
  };
  
  return (
    <div>
      <h1>DREAM Rewards</h1>
      <button onClick={claimDaily}>Claim Daily</button>
    </div>
  );
}
```

## 🚀 Next Steps

1. **Deploy contracts** (what we're doing now)
2. **Get contract addresses** from deployment
3. **Create mini app pages** in your existing site
4. **Connect to contracts** using ethers.js/viem
5. **Deploy site** to Vercel
6. **Submit to Base** for mini app directory

## 📚 Resources

- [Base MiniKit Docs](https://docs.base.org/minikit)
- [Base Mini Apps Guide](https://docs.base.org/cookbook/introduction-to-mini-apps)
- [OnchainKit](https://onchainkit.xyz/)

---

**TL;DR**: 
- **Smart contracts** = Deploy to blockchain (what we're doing)
- **Mini apps** = Web apps that use those contracts (build next)
- They work together: contracts live on-chain, mini apps make them user-friendly!

