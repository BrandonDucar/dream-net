# 🚨 Deployment Fix Action Plan
## Fix Old Build Issue & VeChain Integration

**Status**: ✅ Local build verified working  
**Issue**: Vercel serving old build  
**Solution**: Force fresh deployment + VeChain setup

---

## ✅ Confirmed Configuration

### Root `vercel.json` (CORRECT)
```json
{
  "version": 2,
  "rootDirectory": "client",
  "installCommand": "pnpm --filter client... install --no-frozen-lockfile",
  "buildCommand": "pnpm --filter client run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://api.dreamnet.ink/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### What Should Be Served
- **Route `/`**: `BaseMiniAppsHubPage` → `DreamNetHubWrapper` ✅
- **Build Output**: `client/dist/` ✅
- **Entry**: `client/src/main.tsx` → `client/src/App.tsx` ✅

### Local Build Verified ✅
```
✓ Built successfully
✓ dist/index.html created
✓ dist/assets/ with bundles
✓ Main bundle: index-bnXc24Ao.js (3.15 MB)
```

---

## 🔧 Immediate Fix Steps

### Step 1: Force Fresh Vercel Deployment

**Option A: Via Vercel CLI (Recommended)**
```bash
# From repo root
npx vercel --prod --force

# Or explicitly
npx vercel --prod --force --cwd client
```

**Option B: Via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Find project connected to dreamnet.ink
3. Go to **Deployments** tab
4. Click **"..."** on latest deployment
5. Click **"Redeploy"**
6. **UNCHECK** "Use existing Build Cache" ⚠️ CRITICAL
7. Click **"Redeploy"**

**Option C: Trigger via Git**
```bash
git commit --allow-empty -m "Force Vercel fresh deployment"
git push origin main
```

### Step 2: Verify Deployment

After deployment:
1. Check build logs show `client/dist/` output
2. Verify `index.html` exists in output
3. Test `https://dreamnet.ink/` shows mini app hub
4. Check browser console for errors

### Step 3: Clear Browser Cache (If Needed)

If still seeing old build:
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or clear site data in browser dev tools

---

## 🔗 VeChain Integration Setup

### Step 1: Install VeChain Packages

```bash
# Add VeChain SDK packages
pnpm add @vechain/sdk-core @vechain/sdk-network @vechain/sdk-transaction
pnpm add @vechain/wallet-connector @vechain/wallet-connector-react

# Already created: packages/vechain-core/
```

### Step 2: Add to Workspace

Update `pnpm-workspace.yaml`:
```yaml
packages:
  - "apps/*"
  - "apps/dreamos"
  - "apps/hub"
  - "apps/seo"
  - "apps/sitebuilder"
  - "packages/*"
  - "packages/vechain-core"  # Add this
  - "server"
```

### Step 3: Create VeChain Provider

Create `client/src/providers/VeChainProvider.tsx`:
```typescript
'use client';

import { VeChainProvider as VeChainWalletProvider } from '@vechain/wallet-connector-react';

export function VeChainProvider({ children }: { children: React.ReactNode }) {
  return (
    <VeChainWalletProvider>
      {children}
    </VeChainWalletProvider>
  );
}
```

### Step 4: Add VeChain Dashboard Page

Create `client/src/pages/vechain-dashboard.tsx`:
```typescript
import { useWallet } from '@vechain/wallet-connector-react';
import { createVeChainClient } from '@dreamnet/vechain-core';

export default function VeChainDashboard() {
  const { account } = useWallet();
  const client = createVeChainClient('mainnet');

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-6">
      <h1 className="text-3xl font-bold mb-6">VeChain Dashboard</h1>
      {account ? (
        <div>
          <p>Connected: {account}</p>
          {/* Add VeChain features here */}
        </div>
      ) : (
        <p>Connect VeChain wallet to continue</p>
      )}
    </div>
  );
}
```

### Step 5: Add Route

Update `client/src/App.tsx`:
```typescript
import VeChainDashboard from '@/pages/vechain-dashboard';

// In routes:
<Route path="/vechain" component={VeChainDashboard} />
```

### Step 6: Environment Variables

Add to Vercel/Railway:
```bash
VECHAIN_NETWORK=mainnet
VECHAIN_MAINNET_RPC_URL=https://mainnet.vechain.org
VECHAIN_TESTNET_RPC_URL=https://testnet.vechain.org
```

---

## 📋 Verification Checklist

### Deployment Fix
- [ ] Vercel deployment triggered with cache cleared
- [ ] Build logs show `client/dist/` output
- [ ] `dreamnet.ink/` shows `DreamNetHubWrapper` (mini app hub)
- [ ] No 404 errors
- [ ] Assets load correctly
- [ ] API proxy works (`/api/*` → `api.dreamnet.ink`)

### VeChain Integration
- [ ] Packages installed
- [ ] VeChain core package created
- [ ] Provider added to app
- [ ] Dashboard page created
- [ ] Route added
- [ ] Wallet connects
- [ ] Can read VeChain network

---

## 🎯 Quick Commands

```bash
# Force fresh deployment
npx vercel --prod --force

# Install VeChain packages
pnpm add @vechain/sdk-core @vechain/sdk-network @vechain/sdk-transaction
pnpm add @vechain/wallet-connector @vechain/wallet-connector-react

# Build locally to verify
cd client && pnpm build

# Check deployment status
pnpm exec tsx scripts/fix-vercel-deployment.ts
```

---

## 🚀 Ready to Execute!

**Next Steps**:
1. ✅ Force Vercel redeploy (clear cache)
2. ✅ Verify dreamnet.ink shows mini app hub
3. ✅ Install VeChain packages
4. ✅ Create VeChain integration
5. ✅ Deploy and test

**I'm ready to execute these fixes!** 🎯

