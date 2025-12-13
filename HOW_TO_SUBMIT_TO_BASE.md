# 🚀 How to Make Mini Apps Show Up on Base

## Overview

To make your mini apps discoverable in Base's ecosystem, you need to **submit them to Base's Mini Apps directory**. Currently, your apps work via direct URLs but won't appear in Base's discovery until submitted.

---

## Current Status

✅ **Built & Deployed**: 59 mini apps on `dreamnet.ink`  
✅ **Functional**: All apps work via direct URLs  
❌ **Not Submitted**: Apps not yet in Base directory  
❌ **Not Discoverable**: Can't find via Base search  

---

## Step-by-Step Submission Process

### Step 1: Prepare Your Mini Apps

#### 1.1 Ensure Apps Are Live
```bash
# Test each app is accessible:
https://dreamnet.ink/miniapps/token-balance
https://dreamnet.ink/miniapps/simple-swap
https://dreamnet.ink/miniapps/subscription-hub
# ... etc for all 59 apps
```

#### 1.2 Create Required Assets

**For Each Mini App, You Need:**

1. **App Icon** (512x512px PNG)
   - Location: `public/icons/{app-id}.png`
   - Example: `public/icons/token-balance.png`

2. **Splash Image** (1200x630px PNG)
   - Location: `public/splash/{app-id}.png`
   - Example: `public/splash/token-balance.png`

3. **Screenshots** (at least 1, recommended 3-5)
   - Location: `public/screenshots/{app-id}-{n}.png`
   - Example: `public/screenshots/token-balance-1.png`

4. **App Description** (150-500 characters)
   - Clear, concise description
   - Highlight key features

5. **Category** (choose one):
   - `utility` - Tools and utilities
   - `defi` - DeFi applications
   - `gaming` - Games
   - `social` - Social features
   - `commerce` - Buying/selling
   - `creative` - Creation tools
   - `governance` - DAO/governance
   - `identity` - Identity/passport

---

### Step 2: Create Base Mini App Manifests

Base uses a manifest format similar to Farcaster. Create manifests for each app:

#### 2.1 Manifest Structure

Create `public/.well-known/base-mini-apps/{app-id}.json`:

```json
{
  "name": "Token Balance",
  "description": "View your token balances on Base L2",
  "iconUrl": "https://dreamnet.ink/icons/token-balance.png",
  "splashImageUrl": "https://dreamnet.ink/splash/token-balance.png",
  "screenshots": [
    "https://dreamnet.ink/screenshots/token-balance-1.png",
    "https://dreamnet.ink/screenshots/token-balance-2.png"
  ],
  "category": "utility",
  "url": "https://dreamnet.ink/miniapps/token-balance",
  "version": "1.0.0",
  "developer": {
    "name": "DreamNet",
    "url": "https://dreamnet.ink"
  },
  "tags": ["tokens", "balance", "wallet"],
  "requiresWallet": true,
  "chainIds": [8453],
  "contractAddresses": []
}
```

#### 2.2 Create Manifest Generator Script

Create `scripts/generate-base-manifests.ts`:

```typescript
import { MINI_APPS } from '../packages/base-mini-apps/frontend/index';
import fs from 'fs';
import path from 'path';

const manifestDir = path.join(process.cwd(), 'public', '.well-known', 'base-mini-apps');

// Ensure directory exists
if (!fs.existsSync(manifestDir)) {
  fs.mkdirSync(manifestDir, { recursive: true });
}

// Generate manifest for each app
Object.entries(MINI_APPS).forEach(([appId, app]) => {
  const manifest = {
    name: app.name,
    description: app.description || `${app.name} on DreamNet`,
    iconUrl: `https://dreamnet.ink/icons/${appId}.png`,
    splashImageUrl: `https://dreamnet.ink/splash/${appId}.png`,
    screenshots: [
      `https://dreamnet.ink/screenshots/${appId}-1.png`,
      `https://dreamnet.ink/screenshots/${appId}-2.png`
    ],
    category: app.category,
    url: `https://dreamnet.ink/miniapps/${appId}`,
    version: "1.0.0",
    developer: {
      name: "DreamNet",
      url: "https://dreamnet.ink"
    },
    tags: [app.category],
    requiresWallet: app.requiresPassport || false,
    chainIds: [8453], // Base mainnet
    contractAddresses: app.contractAddress ? [app.contractAddress] : []
  };

  fs.writeFileSync(
    path.join(manifestDir, `${appId}.json`),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log(`✅ Generated manifest for ${appId}`);
});

console.log(`\n✅ Generated ${Object.keys(MINI_APPS).length} manifests`);
```

---

### Step 3: Submit to Base

#### Option A: Base Developer Portal (Recommended)

1. **Find Base Developer Portal**
   - Go to: `https://base.org/developers` or `https://developers.base.org`
   - Look for "Mini Apps" or "Submit App" section

2. **Create Developer Account**
   - Sign up/login with Coinbase account
   - Verify your identity if required

3. **Submit Each Mini App**
   - Fill out submission form for each app
   - Provide manifest URL: `https://dreamnet.ink/.well-known/base-mini-apps/{app-id}.json`
   - Upload screenshots/assets
   - Add description and tags

4. **Wait for Review**
   - Base team reviews (typically 1-2 weeks)
   - May request changes or clarification
   - Once approved, app appears in directory

#### Option B: Base API (If Available)

If Base provides an API for mini app registration:

```typescript
// Example API submission (if available)
const submitToBase = async (appId: string) => {
  const manifestUrl = `https://dreamnet.ink/.well-known/base-mini-apps/${appId}.json`;
  
  const response = await fetch('https://api.base.org/v1/mini-apps/submit', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${BASE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      manifestUrl,
      appId,
      developerId: 'your-developer-id'
    })
  });
  
  return response.json();
};
```

#### Option C: Contact Base Team Directly

1. **Base Discord**
   - Join: Base Discord server
   - Channel: `#mini-apps` or `#developers`
   - Ask about submission process

2. **Base Twitter/X**
   - DM: `@base` or `@base_devs`
   - Ask about mini app submission

3. **Base Grants Program**
   - If applying for grants, mention mini apps
   - May get direct guidance

---

### Step 4: Optimize for Base Discovery

#### 4.1 Add Base Detection

Update your mini apps to detect when opened from Base:

```typescript
// client/src/utils/baseDetection.ts
export function isBaseApp() {
  if (typeof window === 'undefined') return false;
  
  // Check for Base app user agent
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.includes('base') || ua.includes('coinbase');
}

export function getBaseContext() {
  if (!isBaseApp()) return null;
  
  // Base may pass context via URL params or postMessage
  const params = new URLSearchParams(window.location.search);
  return {
    userId: params.get('userId'),
    walletAddress: params.get('walletAddress'),
    chainId: params.get('chainId') || '8453'
  };
}
```

#### 4.2 Add Base Meta Tags

Add to each mini app page:

```html
<!-- Base Mini App Meta Tags -->
<meta name="base:mini-app" content="true" />
<meta name="base:category" content="utility" />
<meta name="base:chain-id" content="8453" />
<link rel="manifest" href="/.well-known/base-mini-apps/{app-id}.json" />
```

#### 4.3 Ensure Mobile Responsiveness

Base apps are primarily mobile, so ensure:
- ✅ Responsive design (mobile-first)
- ✅ Touch-friendly UI
- ✅ Fast loading (< 3 seconds)
- ✅ Works offline (if possible)

---

### Step 5: Track Submissions

Create a tracking document:

```markdown
# Base Mini Apps Submission Tracker

| App ID | Name | Status | Submitted Date | Approved Date | Notes |
|--------|------|--------|----------------|---------------|-------|
| token-balance | Token Balance | Pending | 2024-01-XX | - | - |
| simple-swap | Simple Swap | Pending | 2024-01-XX | - | - |
| ... | ... | ... | ... | ... | ... |
```

---

## Quick Start Checklist

- [ ] All 59 apps are live and functional
- [ ] Created icons (512x512px) for each app
- [ ] Created splash images (1200x630px) for each app
- [ ] Created screenshots (at least 1 per app)
- [ ] Generated manifests for all apps
- [ ] Deployed manifests to `/.well-known/base-mini-apps/`
- [ ] Found Base submission portal/API
- [ ] Submitted first batch of apps (start with 3-5)
- [ ] Added Base detection code
- [ ] Ensured mobile responsiveness
- [ ] Tracked all submissions

---

## Priority Apps to Submit First

Start with these high-value apps:

1. **Token Balance** - Most useful utility
2. **Simple Swap** - Core DeFi functionality
3. **Subscription Hub** - Unique social feature
4. **Dream Vault** - Creative/unique feature
5. **Bounty Board** - Commerce feature

Submit these first to test the process, then submit the rest in batches.

---

## Resources

- **Base Docs**: https://docs.base.org
- **Base Discord**: (Find link on base.org)
- **Base Twitter**: @base
- **Base Developer Portal**: (Check base.org/developers)

---

## Notes

- Base may have specific requirements (check their docs)
- Submission process may change - check Base's latest docs
- Some apps may need approval before appearing
- Consider applying for Base grants if eligible

---

**Next Steps**: Start by creating assets for your top 5 apps, then submit them to Base! 🚀

