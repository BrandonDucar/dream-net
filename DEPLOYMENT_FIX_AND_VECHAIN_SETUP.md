# Deployment Fix & VeChain Integration Setup

## 🚨 Current Deployment Issue

**Problem**: Vercel is serving an old build instead of the current mini app website  
**Root Cause**: Likely Vercel cache or configuration mismatch  
**Solution**: Force fresh deployment with correct configuration

---

## ✅ Correct Vercel Configuration

### Root `vercel.json` (CORRECT - Already Set)
```json
{
  "version": 2,
  "rootDirectory": "client",
  "installCommand": "pnpm --filter client... install --no-frozen-lockfile",
  "buildCommand": "pnpm --filter client run build",
  "outputDirectory": "dist",
  "framework": null,
  "env": {
    "NODE_ENV": "production"
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.dreamnet.ink/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### What Should Be Served
- **Route `/`**: `BaseMiniAppsHubPage` → `DreamNetHubWrapper` (mini app hub)
- **Build Output**: `client/dist/` directory
- **Entry Point**: `client/src/main.tsx` → `client/src/App.tsx`

---

## 🔧 Deployment Fix Steps

### Step 1: Clear Vercel Cache & Force Redeploy

```bash
# Option A: Via Vercel CLI (Recommended)
npx vercel --prod --force

# Option B: Via Vercel Dashboard
# 1. Go to Vercel Dashboard → Project → Deployments
# 2. Click "..." on latest deployment → "Redeploy"
# 3. Check "Use existing Build Cache" = OFF
# 4. Click "Redeploy"
```

### Step 2: Verify Vercel Project Settings

In Vercel Dashboard → Project → Settings → General:

- ✅ **Root Directory**: `client` (should be set automatically from vercel.json)
- ✅ **Build Command**: `pnpm --filter client run build` (or leave empty to use vercel.json)
- ✅ **Output Directory**: `dist` (or leave empty to use vercel.json)
- ✅ **Install Command**: `pnpm --filter client... install --no-frozen-lockfile` (or leave empty)

### Step 3: Add Build Cache Bypass

Create/update `.vercelignore` in root:
```
# Force fresh builds
node_modules
dist
.cache
```

### Step 4: Verify Build Output

After deployment, check:
1. Vercel build logs show `client/dist/` being created
2. `index.html` exists in `client/dist/`
3. Assets are in `client/dist/assets/`

---

## 🔗 VeChain Integration Setup

### Step 1: Install VeChain Dependencies

```bash
# Add VeChain SDK
pnpm add @vechain/sdk-core @vechain/sdk-network @vechain/sdk-transaction
pnpm add @vechain/wallet-connector @vechain/wallet-connector-react
```

### Step 2: Create VeChain Configuration

Create `packages/vechain-core/index.ts`:
```typescript
import { ThorClient, VechainProvider } from '@vechain/sdk-core';
import { Network } from '@vechain/sdk-network';

export const VeChainConfig = {
  mainnet: {
    url: 'https://mainnet.vechain.org',
    network: Network.Mainnet,
  },
  testnet: {
    url: 'https://testnet.vechain.org',
    network: Network.Testnet,
  },
};

export const createVeChainClient = (network: 'mainnet' | 'testnet' = 'mainnet') => {
  return new ThorClient(VeChainConfig[network].url);
};
```

### Step 3: Add VeChain Wallet Connector

Update `client/src/providers/VeChainProvider.tsx`:
```typescript
import { VeChainProvider } from '@vechain/wallet-connector-react';

export function VeChainWalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <VeChainProvider>
      {children}
    </VeChainProvider>
  );
}
```

### Step 4: Add VeChain Routes

Add to `client/src/App.tsx`:
```typescript
import VeChainDashboard from '@/pages/vechain-dashboard';

// In routes:
<Route path="/vechain" component={VeChainDashboard} />
```

### Step 5: Environment Variables

Add to Vercel/Railway:
```bash
VECHAIN_NETWORK=mainnet  # or testnet
VECHAIN_RPC_URL=https://mainnet.vechain.org
VECHAIN_WALLET_ADDRESS=your_wallet_address
```

---

## 🎯 Immediate Action Plan

### Priority 1: Fix Deployment (NOW)
1. ✅ Verify `vercel.json` configuration is correct (DONE - it is)
2. ⏳ Force redeploy with cache cleared
3. ⏳ Verify build logs show correct output
4. ⏳ Test `dreamnet.ink` serves `BaseMiniAppsHubPage`

### Priority 2: VeChain Integration (NEXT)
1. ⏳ Install VeChain SDK packages
2. ⏳ Create VeChain core package
3. ⏳ Add wallet connector
4. ⏳ Create VeChain dashboard page
5. ⏳ Deploy and test

---

## 📋 Verification Checklist

After deployment fix:
- [ ] `dreamnet.ink/` shows mini app hub (DreamNetHubWrapper)
- [ ] Build logs show `client/dist/` output
- [ ] No 404 errors on main routes
- [ ] API proxy works (`/api/*` → `api.dreamnet.ink`)
- [ ] Assets load correctly

After VeChain integration:
- [ ] VeChain wallet connects
- [ ] Can read VeChain network state
- [ ] Can interact with VeChain contracts
- [ ] Dashboard shows VeChain data

---

## 🚀 Quick Deploy Command

```bash
# Force fresh deployment
npx vercel --prod --force

# Or with explicit config
npx vercel --prod --force --cwd client
```

---

**Ready to execute deployment fix and VeChain setup!** 🎯

