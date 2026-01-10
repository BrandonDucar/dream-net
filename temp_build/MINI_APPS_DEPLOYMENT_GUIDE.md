# DreamNet Mini-Apps Deployment Guide 🚀

## Overview

This guide covers deploying all DreamNet mini-apps to Base blockchain and integrating them into the Dream Hub.

---

## 📋 Prerequisites

1. **Environment Setup**
   ```bash
   # Install dependencies
   pnpm install

   # Set up environment variables
   cp .env.example .env
   ```

2. **Required Environment Variables**
   ```bash
   # Base Network
   BASE_MAINNET_RPC_URL=https://mainnet.base.org
   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   BASE_SCAN_API_KEY=your_basescan_api_key

   # Deployer Wallet
   PRIVATE_KEY=your_deployer_private_key

   # Frontend (optional, for contract addresses)
   VITE_PASSPORT_ADDRESS=0x...
   VITE_GOVERNANCE_ADDRESS=0x...
   # ... etc
   ```

3. **Wallet Requirements**
   - Deployer wallet with ETH on Base (for gas)
   - Recommended: 0.1+ ETH on Base Mainnet

---

## 🏗️ Smart Contracts

### Contract Inventory

#### Core Contracts (Already Deployed)
- ✅ `DreamPassport` - Identity/NFT minting
- ✅ `DreamGovernance` - DAO governance
- ✅ `DreamVault` - NFT vault
- ✅ `BountyEscrow` - Bounty system
- ✅ `BadgeNFT` - Badge system

#### Mini-App Contracts (Deployed)
- ✅ `DreamRemixRegistry` - Remix tracking
- ✅ `WhisperMessenger` - Messaging system
- ✅ `SeasonalEventsRegistry` - Events system
- ✅ `NightmareRegistry` - Nightmare tracking
- ✅ `MissionRegistry` - Mission system
- ✅ `RevenueSplitter` - Revenue distribution
- ✅ `ProgressionRegistry` - Progression tracking
- ✅ `DreamDriftersRegistry` - DAO registry
- ✅ `DreamTimeCapsule` - Time capsule
- ✅ `DreamDNASequencer` - DNA sequencing
- ✅ `DreamPredictionMarket` - Prediction market

#### New Contracts (To Deploy)
- 🆕 `DreamShop` - On-chain storefront
- 🆕 `TributeGate` - Tribute/payment system
- 🆕 `WalletScoreRegistry` - Wallet scoring

#### Games (No Contracts Needed)
- 🎮 All 10 fun/game apps are client-side only
- No blockchain interaction required

---

## 📦 Deployment Steps

### Step 1: Compile Contracts

```bash
cd packages/base-mini-apps
pnpm hardhat compile
```

### Step 2: Deploy All Contracts

**Base Sepolia (Testnet):**
```bash
pnpm hardhat run scripts/deploy-all-mini-contracts.ts --network baseSepolia
```

**Base Mainnet:**
```bash
pnpm hardhat run scripts/deploy-all-mini-contracts.ts --network base
```

### Step 3: Verify Contracts (Optional)

```bash
pnpm hardhat verify --network base <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

### Step 4: Update Frontend Config

After deployment, update `packages/base-mini-apps/frontend/config.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  // ... existing contracts
  DreamShop: "0x...", // From deployment.json
  TributeGate: "0x...",
  WalletScoreRegistry: "0x...",
};
```

Or set environment variables:
```bash
VITE_DREAM_SHOP_ADDRESS=0x...
VITE_TRIBUTE_GATE_ADDRESS=0x...
VITE_WALLET_SCORE_ADDRESS=0x...
```

---

## 🎯 Mini-App Categories

### Games (No Contracts)
These apps are fully client-side and don't need contracts:
1. Jaggy Stealth Run
2. Dream DNA Sequencer Game
3. Dream Lattice Game
4. Wormhole Escape
5. Dream Bet Arcade
6. Octopus Pattern Master
7. Labubu Pop Smash
8. Reaction Test Mini
9. Dream Snail Drift
10. Dream Cloud Builder

### Practical Apps (Some Need Contracts)

**With Contracts:**
- Dream Shop → `DreamShop.sol`
- Tribute Gate → `TributeGate.sol`
- Wallet Score Dashboard → `WalletScoreRegistry.sol`

**No Contracts (Client-Side Only):**
- DreamScope Ops Console Mini
- Shield Monitor Mini
- Wormhole Router Mini
- Onboarding Wizard Mini
- Creator Studio Mini
- Social Ops Mini
- Wolf Pack Funding HUD
- Inbox² Mini

---

## 🔧 Contract Details

### DreamShop.sol
**Purpose:** On-chain storefront for NFTs and tokens
**Features:**
- Create shop items
- Purchase with ETH or ERC20
- NFT and token sales
- Supply management
- Revenue tracking

**Deployment:**
```bash
# Constructor: owner address
DreamShop(deployer.address)
```

### TributeGate.sol
**Purpose:** Send tributes (payments) to Dreams, Agents, Nodes
**Features:**
- Multi-token support (ETH + ERC20)
- Target-specific tributes
- Message attachments
- Token whitelist
- Withdrawal system

**Deployment:**
```bash
# Constructor: owner address
TributeGate(deployer.address)
```

### WalletScoreRegistry.sol
**Purpose:** On-chain wallet score storage
**Features:**
- Score, risk, diversity, engagement metrics
- Verification system
- Batch updates
- Threshold management

**Deployment:**
```bash
# Constructor: owner address
WalletScoreRegistry(deployer.address)
```

---

## 📱 Frontend Integration

### Hub Registration

All mini-apps are registered in:
- `packages/base-mini-apps/frontend/index.tsx` - Registry
- `packages/base-mini-apps/frontend/DreamNetHubWrapper.tsx` - Component mapping

### Contract Integration

Apps that use contracts should:
1. Import contract addresses from `config.ts`
2. Use `useContract` hook (if available)
3. Connect via Wagmi/Ethers.js

Example:
```typescript
import { CONTRACT_ADDRESSES } from './config';
import { useContractRead, useContractWrite } from 'wagmi';

// Read from contract
const { data } = useContractRead({
  address: CONTRACT_ADDRESSES.DreamShop,
  abi: DreamShopABI,
  functionName: 'getItem',
  args: [itemId],
});
```

---

## 🚀 Deployment Checklist

- [ ] Environment variables set
- [ ] Deployer wallet funded
- [ ] Contracts compiled
- [ ] Contracts deployed to Base Sepolia (test)
- [ ] Contracts verified on BaseScan
- [ ] Contracts deployed to Base Mainnet
- [ ] Frontend config updated
- [ ] Environment variables set in production
- [ ] Hub integration verified
- [ ] Mini-apps accessible in Hub

---

## 📊 Deployment Output

After deployment, check:
- `packages/base-mini-apps/contracts/deployment.json` - Contract addresses
- Hardhat console output - Transaction hashes
- BaseScan - Contract verification

---

## 🔗 Useful Commands

```bash
# Compile contracts
pnpm hardhat compile

# Deploy all contracts
pnpm hardhat run scripts/deploy-all-mini-contracts.ts --network base

# Deploy single contract
pnpm hardhat run scripts/deploy-shop.ts --network base

# Verify contract
pnpm hardhat verify --network base <ADDRESS> <ARGS>

# Check deployment status
cat packages/base-mini-apps/contracts/deployment.json
```

---

## 🎨 Hub Integration Status

### ✅ Fully Integrated
All 20+ mini-apps are registered in the Hub and accessible at:
- `/hub` - Main Hub page
- `/hub/<app-id>` - Direct app access

### 📝 Contract Integration Status

| App | Contract | Status |
|-----|----------|--------|
| Dream Shop | DreamShop | ✅ Ready |
| Tribute Gate | TributeGate | ✅ Ready |
| Wallet Score | WalletScoreRegistry | ✅ Ready |
| Dream Vault | DreamVaultNFT | ✅ Deployed |
| Bounty Board | BountyEscrow | ✅ Deployed |
| Dream Remix | DreamRemixRegistry | ✅ Deployed |
| Whisper | WhisperMessenger | ✅ Deployed |
| All Games | None | ✅ Client-side |

---

## 🐛 Troubleshooting

### Contract Deployment Fails
- Check PRIVATE_KEY is set
- Verify wallet has ETH for gas
- Check network RPC URL is correct

### Frontend Can't Find Contracts
- Verify CONTRACT_ADDRESSES in config.ts
- Check environment variables
- Ensure contracts are deployed to correct network

### Hub Not Showing Apps
- Verify app is in MINI_APPS registry
- Check component is exported
- Verify COMPONENT_MAP includes app

---

## 📚 Next Steps

1. **Deploy contracts** to Base Mainnet
2. **Update frontend** with contract addresses
3. **Test integration** in Hub
4. **Monitor** contract usage
5. **Iterate** based on feedback

---

**Status:** 🚀 Ready for Deployment  
**Network:** Base (Chain ID: 8453)  
**All mini-apps:** Registered and ready

