# Base Mini-Apps Contract Mapping

**Last Updated:** 2025-01-27  
**Status:** ✅ Complete - All 55 apps mapped  
**Total Apps:** 55  
**Apps with Contracts:** 29  
**Apps without Contracts:** 26  

---

## Overview

This document maps all 55 Base mini-apps to their deployed smart contracts on Base mainnet (chain ID 8453). Contract addresses are sourced from `contracts/deployment.json` (source of truth).

---

## Apps with Contracts (29)

### Core Identity & Governance (2)
1. **passport-mint** - Dream Passport Mint
   - Contract: `DreamPassport`
   - Address: `0x62805dBCc7fb37b62d9Ca92e14aFf63d1e1424CC`

2. **governance** - Dream State Governance
   - Contract: `DreamGovernance`
   - Address: `0x44a2E7ee89EEa63C6EAC6532c6B356be1655ff16`

### Creative & Social (5)
3. **dream-vault** - Dream Vault
   - Contract: `DreamVault`
   - Address: `0x832876CDAaC6e7BAd9C4B953efce19AF0D89Fbd7`

4. **dream-remix** - Dream Remix Studio
   - Contract: `DreamRemixRegistry`
   - Address: `0x66Ef7DDb340537E22F567D60d6c22EDA2B8c3619`

5. **whisper-messenger** - Whisper Messenger
   - Contract: `WhisperMessenger`
   - Address: `0x1cBf5C4AB1aa0f1D0Db0fF17f978EC1e165E1002`

6. **time-capsule** - Dream Time Capsule
   - Contract: `DreamTimeCapsule`
   - Address: `0x891A71eB2D20692D22bF7106B16Ba48253826409`

7. **badge-board** - Badge Board
   - Contract: `BadgeNFT`
   - Address: `0x6Ece1531C0547b366Fd10814Fae5963788d2c2a1`

### Commerce & Bounties (3)
8. **bounty-board** - Bounty Board
   - Contract: `BountyEscrow`
   - Address: `0x21c4BD450a6689353aFfB3EDCA887aa9F908Fc2c`

9. **dream-shop-mini** - Dream Shop Mini
   - Contract: `DreamShop`
   - Address: `0xa1E35292c736a68B9CAB7b9e5c271575632F442d`

10. **tribute-gate-mini** - Tribute Gate Mini
    - Contract: `TributeGate`
    - Address: `0x318292412250E906951f849eB3446c00b7688a6B`

### Events & Missions (3)
11. **seasonal-events** - Seasonal Events Hub
    - Contract: `SeasonalEventsRegistry`
    - Address: `0xdf30a28fA5DbF392DD76Ed761852a31F772AcC27`

12. **mission-center** - Mission Center
    - Contract: `MissionRegistry`
    - Address: `0x73999460083aC079A199B10f1DE1f4A9cA3db837`

13. **nightmare-network** - Nightmare Network
    - Contract: `NightmareRegistry`
    - Address: `0x29f2E979E5E2ec0683B1D0ee660824eeb12B7AdF`

### DeFi & Revenue (3)
14. **revenue-sharing** - Revenue Sharing Dashboard
    - Contract: `RevenueSplitter`
    - Address: `0x07ed77169aD71905aF3778b42760F3269a0D0C74`

15. **prediction-market** - Dream Prediction Market
    - Contract: `DreamPredictionMarket`
    - Address: `0x036b043Ebb894f16639452fC35B7C379bbD05593`

16. **wallet-score-dashboard** - Wallet Score Dashboard
    - Contract: `WalletScoreRegistry`
    - Address: `0x61A0523f068246E72a77e70f7B30AC2e4bfa87D5`

### Utility & Progression (3)
17. **progression-tracker** - Progression Tracker
    - Contract: `ProgressionRegistry`
    - Address: `0xDa02C8383D42C9b0943d532fC9F95C27C9A8055B`

18. **dna-sequencer** - Dream DNA Sequencer
    - Contract: `DreamDNASequencer`
    - Address: `0xd9B140aFB0ef0b358f8342fe6381f6589d450A87`

19. **dream-drifters** - Dream Drifters DAO
    - Contract: `DreamDriftersRegistry`
    - Address: `0x3987902f05Dfca6197D08AcB694e48BE5Df8cE65`

### Gaming (10) - All use GameRegistry
20. **jaggy-stealth-run** - Jaggy Stealth Run
    - Contract: `GameRegistry`
    - Address: `0xB38005e10E376D5D43699B45E7fc2f06A8465a5D`

21. **dna-sequencer-game** - Dream DNA Sequencer Game
    - Contract: `GameRegistry`
    - Address: `0xB38005e10E376D5D43699B45E7fc2f06A8465a5D`

22. **dream-lattice-game** - Dream Lattice Game
    - Contract: `GameRegistry`
    - Address: `0xB38005e10E376D5D43699B45E7fc2f06A8465a5D`

23. **wormhole-escape** - Wormhole Escape
    - Contract: `GameRegistry`
    - Address: `0xB38005e10E376D5D43699B45E7fc2f06A8465a5D`

24. **dream-bet-arcade** - Dream Bet Arcade
    - Contract: `GameRegistry`
    - Address: `0xB38005e10E376D5D43699B45E7fc2f06A8465a5D`

25. **octopus-pattern-master** - Octopus Pattern Master
    - Contract: `GameRegistry`
    - Address: `0xB38005e10E376D5D43699B45E7fc2f06A8465a5D`

26. **labubu-pop-smash** - Labubu Pop Smash
    - Contract: `GameRegistry`
    - Address: `0xB38005e10E376D5D43699B45E7fc2f06A8465a5D`

27. **reaction-test** - Reaction Test Mini
    - Contract: `GameRegistry`
    - Address: `0xB38005e10E376D5D43699B45E7fc2f06A8465a5D`

28. **dream-snail-drift** - Dream Snail Drift
    - Contract: `GameRegistry`
    - Address: `0xB38005e10E376D5D43699B45E7fc2f06A8465a5D`

29. **dream-cloud-builder** - Dream Cloud Builder
    - Contract: `GameRegistry`
    - Address: `0xB38005e10E376D5D43699B45E7fc2f06A8465a5D`

### Creative Tools (1)
30. **card-forge-pro** - Card Forge Pro
    - Contract: `CardForgeNFT`
    - Address: `0x34e1079820b4c733bE7D67A5F980ea4c752DbD47`

**Note:** All 10 game apps also use `GameAchievementNFT` at `0x4AF7a82908C64e554584bD6A0F9145521F1913d6` for achievement tracking.

---

## Apps without Contracts (26) - Frontend-Only

### Government Offices (4)
- api-keeper-office
- jaggy-office
- mycelium-office
- api-keeper (dashboard)

### Commerce & Social (3)
- wolf-pack
- social-hub
- whale-pack

### Treasury & Monitoring (2)
- treasury
- shield-monitor
- shield-monitor-mini

### Exploration & Dashboards (4)
- dream-gallery
- ecosystem-dashboard
- network-explorer
- agent-dashboard

### Ops & Tools (8)
- dreamscope-ops
- dreamscope-ops-mini
- onboarding
- onboarding-wizard-mini
- creator-studio
- creator-studio-mini
- social-ops-mini
- wormhole-router-mini

### Funding & Analytics (3)
- wolf-pack-funding-hud
- inbox-squared
- coinsensei

### Hub Apps (2)
- dreamnet-hub (wrapper component)
- dreamnet-hub-wrapper (wrapper component)

---

## Contract Summary

### Total Contracts Deployed: 20

1. DreamPassport
2. DreamGovernance
3. DreamVault
4. BountyEscrow
5. BadgeNFT
6. DreamRemixRegistry
7. WhisperMessenger
8. SeasonalEventsRegistry
9. NightmareRegistry
10. RevenueSplitter
11. ProgressionRegistry
12. MissionRegistry
13. DreamDriftersRegistry
14. DreamTimeCapsule
15. DreamDNASequencer
16. DreamPredictionMarket
17. DreamShop
18. TributeGate
19. WalletScoreRegistry
20. GameRegistry
21. GameAchievementNFT
22. CardForgeNFT

---

## Usage

### Get Contract Address for an App

```typescript
import { getContractAddress } from './contractResolver';

const address = getContractAddress('dream-vault');
// Returns: '0x832876CDAaC6e7BAd9C4B953efce19AF0D89Fbd7'
```

### Check if App Has Contract

```typescript
import { hasContract } from './contractResolver';

if (hasContract('dream-vault')) {
  // App has a contract
}
```

### Get All Apps Using a Contract

```typescript
import { getAppsByContractAddress } from './contractResolver';

const gameApps = getAppsByContractAddress('0xB38005e10E376D5D43699B45E7fc2f06A8465a5D');
// Returns all 10 game app IDs
```

---

## Files

- **Source of Truth:** `packages/base-mini-apps/contracts/deployment.json`
- **Frontend Config:** `packages/base-mini-apps/frontend/config.ts`
- **App Registry:** `packages/base-mini-apps/frontend/index.tsx`
- **Contract Resolver:** `packages/base-mini-apps/frontend/contractResolver.ts`

