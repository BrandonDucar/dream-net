# Deploy Base Mini-Apps to Production

## Overview

Base mini-apps are **real React components** with **real smart contracts** deployed on Base blockchain. They're accessible through:
- **Hub**: `/hub/apps` - Shows all apps (legacy + Base mini-apps)
- **Base Mini-Apps Hub**: `/mini-apps/:appId` - Direct access to Base mini-apps
- **Vercel**: Frontend is deployed automatically (contracts are on-chain)

## Current Status

✅ **Frontend**: All Base mini-apps are real React components  
✅ **Contracts**: Most contracts are deployed (see `packages/base-mini-apps/contracts/deployment.json`)  
⏳ **CardForgeNFT**: Needs deployment  

## Deploy CardForgeNFT Contract

### Prerequisites

1. Set up `.env` in `packages/base-mini-apps/`:
```bash
PRIVATE_KEY=your_private_key_here
BASE_MAINNET_RPC_URL=https://mainnet.base.org
# OR for testnet:
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

2. Install dependencies:
```bash
cd packages/base-mini-apps
pnpm install
```

### Deploy to Base Mainnet

```bash
cd packages/base-mini-apps
pnpm run deploy:card-forge
```

This will:
1. Compile the CardForgeNFT contract
2. Deploy to Base mainnet
3. Save the address to `contracts/deployment.json`
4. Update `frontend/config.ts` automatically

### After Deployment

1. **Update Environment Variable** (for Vercel):
   - Add `VITE_CARD_FORGE_NFT_ADDRESS=<deployed_address>` to Vercel environment variables

2. **Verify Contract**:
   - Visit `https://basescan.org/address/<deployed_address>`
   - Verify the contract source code

3. **Test the App**:
   - Go to `/hub/apps` → Find "Card Forge Pro"
   - Or directly: `/mini-apps/card-forge-pro`
   - Connect wallet and mint a card as NFT

## Deploy All Contracts

To deploy all Base mini-app contracts:

```bash
cd packages/base-mini-apps
pnpm run deploy:all
```

## Frontend Deployment (Vercel)

The frontend is automatically deployed via Vercel when you push to GitHub. The contracts are **already on Base blockchain** - Vercel just serves the frontend that connects to them.

### How It Works

1. **Smart Contracts**: Deployed to Base blockchain (permanent, on-chain)
2. **Frontend**: Deployed to Vercel (serves the UI)
3. **Connection**: Frontend uses `CONTRACT_ADDRESSES` from `config.ts` to connect to contracts

## Access Apps

### Via Hub
- URL: `https://dreamnet.ink/hub/apps`
- Shows: All apps (legacy + Base mini-apps)
- Base apps are marked with a "Base" badge

### Via Base Mini-Apps Hub
- URL: `https://dreamnet.ink/mini-apps/:appId`
- Example: `https://dreamnet.ink/mini-apps/card-forge-pro`
- Shows: Full-screen Base mini-app experience

### Available Base Mini-Apps

All apps from `packages/base-mini-apps/frontend/index.tsx`:
- `card-forge-pro` - Card Forge Pro (AI card creation + NFT minting)
- `coinsensei` - CoinSensei Portfolio Analytics
- `dream-vault` - Dream Vault (NFT storage)
- `bounty-board` - Bounty Board
- `dream-remix` - Dream Remix Studio
- `whisper-messenger` - Whisper Messenger
- And 40+ more...

## Contract Addresses

All deployed contract addresses are in:
- `packages/base-mini-apps/contracts/deployment.json`
- `packages/base-mini-apps/frontend/config.ts`

## Troubleshooting

### Contract Not Found
- Check `deployment.json` for the contract address
- Verify the contract is deployed: `https://basescan.org/address/<address>`
- Ensure `VITE_*_ADDRESS` env var is set in Vercel

### Frontend Can't Connect
- Check browser console for errors
- Verify wallet is connected to Base network (Chain ID: 8453)
- Ensure contract address is correct in `config.ts`

### App Not Showing in Hub
- Check `client/src/pages/hub/apps.tsx` includes the app
- Verify app is exported in `packages/base-mini-apps/frontend/index.tsx`
- Check app is registered in `MINI_APPS` registry

