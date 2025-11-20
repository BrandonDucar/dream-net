# Wallets Ready for Coin Sensei ✅

## All Wallet Addresses Documented

Your wallets are ready to be added to Coin Sensei for portfolio tracking:

### VeChain Wallets
1. **Active Wallet**: `0x73d4c431ed1fc2126cca2597d9ace1b14de8474e`
2. **Tangem Wallet** (Locked): `0x064915fAD67E70D2Fa708B14af9e01B0083a1B9E`

### Solana Wallet
3. **Solana Admin**: `9jAUEPpb74rJNrgfjAQzDpLgweCbipgdN1fujupFZZj`

### Base Wallet
4. **Owner Wallet**: `0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e`

---

## Quick Add (Once Server is Running)

### Option 1: Run Script
```bash
# Make sure server is running first
pnpm dev:app

# In another terminal:
pnpm exec tsx scripts/add-wallets-simple.ts
```

### Option 2: Via UI
1. Start server: `pnpm dev:app`
2. Open browser: `http://localhost:5173` (or your frontend URL)
3. Navigate to `/coinsensei` mini-app
4. Add wallets via the UI

### Option 3: Direct API Call
```bash
curl -X POST http://localhost:3000/api/coinsensei/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "wallets": [
      {"address": "0x73d4c431ed1fc2126cca2597d9ace1b14de8474e", "chain": "vechain", "label": "Active VeChain"},
      {"address": "0x064915fAD67E70D2Fa708B14af9e01B0083a1B9E", "chain": "vechain", "label": "Tangem (Locked)"},
      {"address": "9jAUEPpb74rJNrgfjAQzDpLgweCbipgdN1fujupFZZj", "chain": "solana", "label": "Solana"},
      {"address": "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e", "chain": "base", "label": "Owner"}
    ]
  }'
```

---

## Status

✅ **All wallet addresses documented**  
✅ **Scripts ready to run**  
⏳ **Waiting for server to be running**

Once the server is up, run the script or add via UI! 🚀

