# Base Mini-Apps Deployment Guide

## 🎯 Complete Deployment Pipeline

All 8 Base mini-apps are now **fully implemented** with:
- ✅ Solidity contracts (Passport & Governance)
- ✅ React frontend components
- ✅ Hardhat deployment scripts
- ✅ Integration with DreamNet systems
- ✅ Tests

## 📦 What Was Built

### Smart Contracts

1. **DreamPassportNFT.sol**
   - ERC721 NFT contract
   - 6 passport tiers (Visitor → Founder)
   - Minting and upgrading
   - Onchain identity verification

2. **DreamStateGovernance.sol**
   - Proposal creation
   - Tier-weighted voting
   - Proposal execution
   - Integration with Passport contract

### Frontend Components

All 8 React components ready:
- `PassportMintApp.tsx` - Mint interface
- `GovernanceApp.tsx` - Voting interface
- `APIKeeperDashboard.tsx` - API management
- `WolfPackPortal.tsx` - Funding portal
- `SocialHub.tsx` - Social feed
- `WhalePackCommerce.tsx` - Commerce dashboard
- `Treasury.tsx` - Treasury viewer
- `ShieldMonitor.tsx` - Security monitor

### Deployment Scripts

- `deploy-passport.ts` - Deploy passport contract
- `deploy-governance.ts` - Deploy governance contract
- `deploy-all.ts` - Deploy everything

## 🚀 Deployment Steps

### 1. Setup Environment

```bash
cd packages/base-mini-apps
pnpm install
```

Create `.env`:
```env
PRIVATE_KEY=your_private_key_here
BASE_MAINNET_RPC_URL=https://mainnet.base.org
BASE_SCAN_API_KEY=your_basescan_api_key
PASSPORT_CONTRACT_ADDRESS=0x... # After first deployment
```

### 2. Compile Contracts

```bash
pnpm compile
```

### 3. Deploy Contracts

```bash
# Deploy passport first
pnpm deploy:passport

# Then deploy governance (uses passport address)
export PASSPORT_CONTRACT_ADDRESS=0x...
pnpm deploy:governance

# Or deploy all at once
pnpm deploy:all
```

### 4. Verify Contracts

```bash
npx hardhat verify --network base <CONTRACT_ADDRESS> [CONSTRUCTOR_ARGS]
```

### 5. Update Frontend

Update contract addresses in frontend components:
- `PassportMintApp.tsx` - Set `passportContractAddress`
- `GovernanceApp.tsx` - Set both addresses

### 6. Test

```bash
pnpm test
```

## 📋 Contract Addresses

After deployment, save these:

```
PASSPORT_CONTRACT_ADDRESS=0x...
GOVERNANCE_CONTRACT_ADDRESS=0x...
```

## 🔗 BaseScan Links

- Passport: `https://basescan.org/address/{PASSPORT_ADDRESS}`
- Governance: `https://basescan.org/address/{GOVERNANCE_ADDRESS}`

## ✅ Deployment Checklist

- [ ] Environment variables set
- [ ] Contracts compiled
- [ ] Passport contract deployed
- [ ] Governance contract deployed
- [ ] Contracts verified on BaseScan
- [ ] Frontend updated with addresses
- [ ] Tests passing
- [ ] First passport minted
- [ ] First proposal created

## 🎉 You're Ready!

All 8 Base mini-apps are fully implemented and ready to deploy to Base! 🚀

