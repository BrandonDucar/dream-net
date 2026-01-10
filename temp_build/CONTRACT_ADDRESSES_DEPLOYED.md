# ✅ Deployed Contract Addresses on Base

## 🎉 Successfully Deployed Contracts

### New Contracts (Just Deployed)

| Contract | Address | BaseScan |
|----------|---------|----------|
| **DreamShop** | `0xa1E35292c736a68B9CAB7b9e5c271575632F442d` | [View](https://basescan.org/address/0xa1E35292c736a68B9CAB7b9e5c271575632F442d) |
| **TributeGate** | `0x318292412250E906951f849eB3446c00b7688a6B` | [View](https://basescan.org/address/0x318292412250E906951f849eB3446c00b7688a6B) |

### Additional Contracts Deployed

| Contract | Address | BaseScan |
|----------|---------|----------|
| DreamRemixRegistry | `0x66Ef7DDb340537E22F567D60d6c22EDA2B8c3619` | [View](https://basescan.org/address/0x66Ef7DDb340537E22F567D60d6c22EDA2B8c3619) |
| WhisperMessenger | `0x1cBf5C4AB1aa0f1D0Db0fF17f978EC1e165E1002` | [View](https://basescan.org/address/0x1cBf5C4AB1aa0f1D0Db0fF17f978EC1e165E1002) |
| MissionRegistry | `0x73999460083aC079A199B10f1DE1f4A9cA3db837` | [View](https://basescan.org/address/0x73999460083aC079A199B10f1DE1f4A9cA3db837) |
| ProgressionRegistry | `0xDa02C8383D42C9b0943d532fC9F95C27C9A8055B` | [View](https://basescan.org/address/0xDa02C8383D42C9b0943d532fC9F95C27C9A8055B) |
| DreamTimeCapsule | `0x891A71eB2D20692D22bF7106B16Ba48253826409` | [View](https://basescan.org/address/0x891A71eB2D20692D22bF7106B16Ba48253826409) |
| DreamPredictionMarket | `0x036b043Ebb894f16639452fC35B7C379bbD05593` | [View](https://basescan.org/address/0x036b043Ebb894f16639452fC35B7C379bbD05593) |

### Previously Deployed Contracts

| Contract | Address |
|----------|---------|
| DreamPassport | `0x62805dBCc7fb37b62d9Ca92e14aFf63d1e1424CC` |
| DreamGovernance | `0x44a2E7ee89EEa63C6EAC6532c6B356be1655ff16` |
| DreamVault | `0x832876CDAaC6e7BAd9C4B953efce19AF0D89Fbd7` |
| BountyEscrow | `0x21c4BD450a6689353aFfB3EDCA887aa9F908Fc2c` |
| BadgeNFT | `0x6Ece1531C0547b366Fd10814Fae5963788d2c2a1` |

### ⚠️ Contracts That Need Retry

These failed due to "replacement transaction underpriced" (pending transactions):
- SeasonalEventsRegistry
- NightmareRegistry  
- RevenueSplitter
- DreamDriftersRegistry
- DreamDNASequencer
- WalletScoreRegistry

**To retry:** Run `pnpm hardhat run scripts/deploy-failed.ts --network base`

---

## 📝 For Frontend Config

Add to `packages/base-mini-apps/frontend/config.ts`:

```typescript
DreamShop: getEnv('VITE_DREAM_SHOP_ADDRESS', "0xa1E35292c736a68B9CAB7b9e5c271575632F442d"),
TributeGate: getEnv('VITE_TRIBUTE_GATE_ADDRESS', "0x318292412250E906951f849eB3446c00b7688a6B"),
```

Or set environment variables:
```bash
VITE_DREAM_SHOP_ADDRESS=0xa1E35292c736a68B9CAB7b9e5c271575632F442d
VITE_TRIBUTE_GATE_ADDRESS=0x318292412250E906951f849eB3446c00b7688a6B
```

---

## 🎯 Summary

✅ **2 new contracts deployed** (DreamShop, TributeGate)  
✅ **6 additional contracts deployed** (various registries)  
⚠️ **6 contracts need retry** (pending transaction issues)

All deployed contracts are live on **Base Mainnet** (Chain ID: 8453)!

