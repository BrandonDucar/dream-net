# How to Retrieve Admin Wallets from Production

## Current Status

**Local Environment:**
- Found 2 wallets in `ADMIN_WALLETS`:
  - `0xAbCdEf1234567890abcdef1234567890aBcDeF01` (placeholder)
  - `0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e` (owner wallet)

**Production Environment (Railway):**
- Your VeChain Tangem wallet and Solana wallet are likely in Railway's `ADMIN_WALLETS` env var
- Need to check Railway dashboard to retrieve them

---

## Method 1: Check Railway Dashboard (Recommended)

1. Go to [Railway Dashboard](https://railway.app)
2. Open your DreamNet backend project
3. Go to **Variables** tab
4. Look for `ADMIN_WALLETS` environment variable
5. Copy the value (comma-separated wallet addresses)

The format should be something like:
```
0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e,0x[VeChainTangemAddress],SolanaWalletAddressHere
```

---

## Method 2: Use API Endpoint (After Deploying)

I've created an API endpoint to list admin wallets:

**Endpoint:** `GET /api/admin-wallets`  
**Auth:** Requires admin wallet authentication

**Usage:**
```bash
curl -X GET https://api.dreamnet.ink/api/admin-wallets \
  -H "x-wallet-address: 0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e"
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "wallets": [
    {
      "address": "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
      "type": "ethereum-base-vechain",
      "chain": "ethereum"
    },
    {
      "address": "0x[VeChainTangem]",
      "type": "ethereum-base-vechain",
      "chain": "ethereum"
    },
    {
      "address": "SolanaAddressHere",
      "type": "solana",
      "chain": "solana"
    }
  ],
  "source": "environment"
}
```

---

## Method 3: Run Script Locally (If You Have Access)

If you have Railway CLI or can export env vars:

```bash
# Export ADMIN_WALLETS from Railway
railway variables

# Or run the script with env var
ADMIN_WALLETS="wallet1,wallet2,wallet3" pnpm exec tsx scripts/list-admin-wallets.ts
```

---

## Identifying Wallet Types

**Ethereum/Base/VeChain:**
- Format: `0x` prefix, 42 characters total
- Example: `0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e`

**Solana:**
- Format: Base58 encoded, 32-44 characters, NO `0x` prefix
- Example: `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`

---

## Next Steps

1. **Check Railway Dashboard** for `ADMIN_WALLETS` env var
2. **Copy the wallet addresses** (especially VeChain Tangem and Solana)
3. **Update `MY_WALLETS.md`** with the addresses
4. **Add to Coin Sensei** for portfolio tracking

---

## Adding to Coin Sensei

Once you have the addresses:

```bash
POST /api/coinsensei/analyze
{
  "wallets": [
    {
      "address": "0x73d4c431ed1fc2126cca2597d9ace1b14de8474e",
      "chain": "vechain",
      "label": "My Active VeChain Wallet"
    },
    {
      "address": "[Tangem VeChain Address]",
      "chain": "vechain",
      "label": "Tangem Wallet (Locked)"
    },
    {
      "address": "[Solana Address]",
      "chain": "solana",
      "label": "My Solana Wallet"
    }
  ]
}
```

---

## Security Note

✅ **Public addresses are SAFE** to store in code/docs  
❌ **NEVER store private keys** or recovery phrases  
✅ Coin Sensei is **READ-ONLY** - can't move your funds

