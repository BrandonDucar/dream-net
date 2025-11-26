# Deploy Remaining Contracts - Quick Guide

## Status
- ✅ **20 contracts already deployed** (see `contracts/deployment.json`)
- ⏳ **9 contracts need deployment**

## Remaining Contracts to Deploy

1. **SocialHubRegistry** - `pnpm deploy:social-hub`
2. **WolfPackRegistry** - `pnpm deploy:wolf-pack`
3. **WhalePackRegistry** - `pnpm deploy:whale-pack`
4. **TreasuryRegistry** - `pnpm deploy:treasury`
5. **OnboardingRegistry** - `pnpm deploy:onboarding`
6. **CreatorStudioRegistry** - `pnpm deploy:creator-studio`
7. **SocialOpsRegistry** - `pnpm deploy:social-ops`
8. **InboxSquaredRegistry** - `pnpm deploy:inbox-squared`
9. **CoinSenseiRegistry** - `pnpm deploy:coinsensei`

## Quick Deploy (PowerShell)

Run from `packages/base-mini-apps`:

```powershell
.\scripts\deploy-all-remaining.ps1
```

## Manual Deploy (One at a Time)

```powershell
cd packages/base-mini-apps

# Deploy each one:
pnpm deploy:social-hub
pnpm deploy:wolf-pack
pnpm deploy:whale-pack
pnpm deploy:treasury
pnpm deploy:onboarding
pnpm deploy:creator-studio
pnpm deploy:social-ops
pnpm deploy:inbox-squared
pnpm deploy:coinsensei
```

## What Each Script Does

1. Compiles the contract
2. Deploys to Base mainnet (chain ID 8453)
3. Waits for deployment confirmation
4. Updates `contracts/deployment.json` with the new address
5. Prints the contract address and BaseScan link

## Requirements

- MetaMask connected to Base mainnet
- Base ETH for gas fees (~$0.10-0.50 per contract)
- Private key in `.env` or MetaMask approval for each deployment

## After Deployment

All addresses will be automatically saved to `contracts/deployment.json`. The frontend will pick them up automatically via the contract resolver.

