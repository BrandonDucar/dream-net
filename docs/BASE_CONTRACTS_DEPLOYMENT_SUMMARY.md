# Base Contracts Deployment - What It Entails

## Current Status

✅ **Contracts Compiled**: All contracts are compiled and ready  
✅ **CardForgeNFT Address**: `0x34e1079820b4c733bE7D67A5F980ea4c752DbD47` (in deployment.json)  
❓ **Need to Verify**: Is this address actually deployed on-chain?

---

## What Deployment Entails

### 1. **What You Need**

#### Required:
- **Private Key**: Your wallet's private key (for signing transactions)
  - Format: `0x...` (64 hex characters)
  - ⚠️ **SECURITY**: Never commit to git! Use `.env` file
  
- **ETH on Base**: Need ETH to pay gas fees
  - Estimated: ~0.001-0.01 ETH (~$0.10-$1.00)
  - Bridge from Ethereum: https://bridge.base.org
  - Or buy directly on Base

#### Optional:
- **RPC URL**: Defaults to `https://mainnet.base.org` (works fine)
- **BaseScan API Key**: Only for contract verification (optional)

---

### 2. **The Deployment Process**

When you run `pnpm run deploy:card-forge`, here's what happens:

1. **Connects to Base Network**
   - Uses your `PRIVATE_KEY` from `.env`
   - Connects via RPC URL (default or custom)

2. **Checks Wallet Balance**
   - Verifies you have ETH for gas
   - Shows your deployer address

3. **Deploys Contract**
   - Compiles CardForgeNFT contract
   - Sends deployment transaction to Base
   - Waits for confirmation (~30 seconds)

4. **Saves Deployment Info**
   - Saves contract address to `contracts/deployment.json`
   - Updates `frontend/config.ts` automatically
   - Shows BaseScan explorer link

5. **Done!**
   - Contract is live on Base blockchain
   - Frontend can now connect to it

---

### 3. **Setup Steps**

#### Step 1: Create `.env` File

Create `packages/base-mini-apps/.env`:

```bash
PRIVATE_KEY=0xYourPrivateKeyHere
```

**⚠️ IMPORTANT**: 
- `.env` is already in `.gitignore` - safe!
- Never share your private key
- Use a dedicated deployment wallet

#### Step 2: Get ETH on Base

**Option A: Bridge from Ethereum**
1. Go to https://bridge.base.org
2. Connect wallet
3. Bridge ETH (need ~$1 worth)
4. Wait ~5-10 minutes

**Option B: Buy on Base**
- Use Coinbase (supports Base natively)
- Buy ETH directly on Base

#### Step 3: Deploy

```bash
cd packages/base-mini-apps
pnpm run deploy:card-forge
```

**That's it!** The script handles everything else.

---

### 4. **What Gets Deployed**

**CardForgeNFT Contract**:
- ERC721 NFT contract
- Stores card metadata on-chain
- Allows minting cards as NFTs
- Owner-controlled (you're the owner)

**Contract Features**:
- `mintCard()` - Mint a new card NFT
- `getUserCards()` - Get all cards for a user
- `getCardMetadata()` - Get card details
- `totalSupply()` - Total cards minted

---

### 5. **After Deployment**

#### Automatic Updates:
- ✅ `contracts/deployment.json` - Contract address saved
- ✅ `frontend/config.ts` - Frontend config updated

#### Manual Steps:
1. **Verify on BaseScan**:
   - Visit: `https://basescan.org/address/0xContractAddress`
   - Should show contract code

2. **Test in Frontend**:
   - Go to `/hub/apps/card-forge-pro`
   - Connect wallet (must be on Base network)
   - Create a card → Mint as NFT
   - Verify it appears on BaseScan

3. **Update Environment Variables** (if needed):
   - Add `VITE_CARD_FORGE_NFT_ADDRESS=0xAddress` to Vercel/Railway
   - Usually not needed (config.ts has fallback)

---

## Quick Start Commands

```bash
# 1. Navigate to package
cd packages/base-mini-apps

# 2. Create .env file (if not exists)
# Add: PRIVATE_KEY=0xYourKey

# 3. Compile contracts (already done, but good to verify)
pnpm run compile

# 4. Deploy CardForgeNFT
pnpm run deploy:card-forge

# 5. Check deployment
cat contracts/deployment.json
```

---

## Cost Breakdown

- **Gas Price**: ~0.00001 ETH per transaction
- **Deploy Contract**: ~0.001-0.01 ETH (~$0.10-$1.00)
- **Mint NFT**: ~0.0001 ETH per mint (~$0.01)

**Total**: ~$0.10-$1.00 to deploy

---

## Troubleshooting

### "No signers available"
- **Fix**: Add `PRIVATE_KEY=0x...` to `.env` file

### "Insufficient funds"
- **Fix**: Bridge/buy more ETH on Base

### "Network not found"
- **Fix**: Check RPC URL or use default

### Contract already deployed?
- **Check**: Visit `https://basescan.org/address/0x34e1079820b4c733bE7D67A5F980ea4c752DbD47`
- If it exists, you might already be deployed!
- If not, deploy fresh

---

## Summary

**What You Need**:
1. Private key (in `.env`)
2. ETH on Base (~$1 worth)
3. Run `pnpm run deploy:card-forge`

**What Happens**:
- Contract deploys to Base blockchain
- Address saved automatically
- Frontend config updated
- Ready to use!

**Time**: ~5 minutes (once you have ETH)

**Cost**: ~$0.10-$1.00

---

**Ready?** Just need your `PRIVATE_KEY` and some ETH! 🚀

