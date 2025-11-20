# Deploy Base Contracts - Quick Guide
## What You Need & How to Do It

**Contract**: CardForgeNFT  
**Network**: Base Mainnet (Chain ID: 8453)  
**Estimated Cost**: ~0.001-0.01 ETH (gas fees)

---

## ✅ What You Need

### 1. **Private Key** (Required)
- Your wallet's private key for deployment
- **⚠️ SECURITY**: Never commit this to git!
- Keep it in `.env` file (already in `.gitignore`)

### 2. **ETH on Base** (Required)
- Need ETH to pay gas fees (~$0.10-$1.00)
- Bridge ETH to Base: https://bridge.base.org
- Or use Base faucet if testing on Sepolia

### 3. **RPC URL** (Optional - has defaults)
- Mainnet: `https://mainnet.base.org` (default)
- Sepolia: `https://sepolia.base.org` (default)
- Or use Alchemy/Infura for better reliability

### 4. **BaseScan API Key** (Optional)
- Only needed for contract verification
- Get free key: https://basescan.org/apis

---

## 🚀 Step-by-Step Deployment

### Step 1: Set Up Environment Variables

Create `.env` file in `packages/base-mini-apps/`:

```bash
# Required: Your wallet private key (starts with 0x)
PRIVATE_KEY=0xYourPrivateKeyHere

# Optional: Custom RPC URLs (defaults work fine)
BASE_MAINNET_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Optional: For contract verification
BASE_SCAN_API_KEY=your_basescan_api_key
```

**⚠️ IMPORTANT**: 
- `.env` is already in `.gitignore` - safe to create
- Never share your private key!
- Use a dedicated deployment wallet (not your main wallet)

---

### Step 2: Get ETH on Base

**Option A: Bridge from Ethereum**
1. Go to https://bridge.base.org
2. Connect wallet
3. Bridge ETH from Ethereum → Base
4. Wait for confirmation (~5-10 min)

**Option B: Buy on Base**
1. Use Coinbase (supports Base natively)
2. Buy ETH directly on Base
3. Transfer to your deployment wallet

**Option C: Use Testnet (Sepolia)**
1. Get free ETH: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
2. Deploy to Sepolia first to test
3. Then deploy to mainnet

---

### Step 3: Compile Contracts

```bash
cd packages/base-mini-apps
pnpm run compile
```

This compiles all contracts and creates artifacts.

**Expected Output**:
```
Compiled 1 Solidity file successfully
```

---

### Step 4: Deploy CardForgeNFT

**To Base Mainnet**:
```bash
cd packages/base-mini-apps
pnpm run deploy:card-forge
```

**To Base Sepolia (Testnet)**:
```bash
# Edit hardhat.config.cjs to use baseSepolia, or:
pnpm run deploy:card-forge -- --network baseSepolia
```

**What Happens**:
1. ✅ Connects to Base network
2. ✅ Checks wallet balance
3. ✅ Deploys CardForgeNFT contract
4. ✅ Saves address to `contracts/deployment.json`
5. ✅ Updates `frontend/config.ts` automatically
6. ✅ Shows contract address and explorer link

**Expected Output**:
```
🚀 Deploying CardForgeNFT with account: 0xYourAddress
📊 Account balance: 1000000000000000000 (1 ETH)
✅ CardForgeNFT deployed to: 0xContractAddress
📝 Deployment info saved to: contracts/deployment.json
🎉 Deployment complete!
   Contract: 0xContractAddress
   Network: base (Chain ID: 8453)
   Explorer: https://basescan.org/address/0xContractAddress
```

---

### Step 5: Verify Deployment

1. **Check Explorer**:
   - Visit: `https://basescan.org/address/0xContractAddress`
   - Should show contract code

2. **Check Files**:
   - `packages/base-mini-apps/contracts/deployment.json` should have address
   - `packages/base-mini-apps/frontend/config.ts` should be updated

3. **Test in Frontend**:
   - Go to `/hub/apps/card-forge-pro`
   - Connect wallet
   - Try minting a card as NFT

---

## 🎯 Deploy Other Contracts

### Deploy Single Contract

```bash
# Passport
pnpm run deploy:passport

# Governance
pnpm run deploy:governance

# Vault
pnpm run deploy:vault

# Bounty
pnpm run deploy:bounty

# Badge
pnpm run deploy:badge

# ... etc (see package.json scripts)
```

### Deploy All Contracts

```bash
# Deploy all mini-app contracts
pnpm run deploy:all-mini

# Or deploy everything
pnpm run deploy:all
```

---

## 🔧 Troubleshooting

### Error: "No signers available"
**Problem**: `PRIVATE_KEY` not set in `.env`  
**Fix**: Add `PRIVATE_KEY=0xYourKey` to `.env` file

### Error: "Insufficient funds"
**Problem**: Not enough ETH for gas  
**Fix**: Bridge/buy more ETH on Base

### Error: "Network not found"
**Problem**: RPC URL incorrect  
**Fix**: Check `BASE_MAINNET_RPC_URL` in `.env` or use default

### Error: "Contract compilation failed"
**Problem**: Solidity version mismatch or syntax error  
**Fix**: Run `pnpm run compile` first, check errors

### Error: "Transaction reverted"
**Problem**: Contract deployment failed  
**Fix**: Check gas limit, ensure sufficient balance, verify contract code

---

## 📋 Pre-Deployment Checklist

- [ ] `.env` file created with `PRIVATE_KEY`
- [ ] ETH in deployment wallet (check balance)
- [ ] Contracts compiled (`pnpm run compile`)
- [ ] Network RPC URL configured (or using defaults)
- [ ] Ready to deploy!

---

## 🎉 After Deployment

### 1. Update Environment Variables (Vercel/Railway)

Add to your deployment platform:
```
VITE_CARD_FORGE_NFT_ADDRESS=0xDeployedAddress
```

### 2. Test the Contract

1. Go to `/hub/apps/card-forge-pro`
2. Connect wallet (must be on Base network)
3. Create a card
4. Mint as NFT
5. Verify on BaseScan

### 3. Verify Contract Source (Optional)

```bash
npx hardhat verify --network base 0xContractAddress 0xOwnerAddress
```

---

## 💡 Pro Tips

1. **Test on Sepolia First**: Deploy to testnet, verify everything works, then mainnet
2. **Use Dedicated Wallet**: Don't use your main wallet for deployment
3. **Save Gas**: Deploy during low-traffic times (gas is cheaper)
4. **Backup Addresses**: Save contract addresses somewhere safe
5. **Verify Contracts**: Makes them more trustworthy on BaseScan

---

## 📊 Cost Estimate

- **Gas Price**: ~0.00001 ETH per transaction
- **Deploy CardForgeNFT**: ~0.001-0.01 ETH (~$0.10-$1.00)
- **Mint NFT**: ~0.0001 ETH per mint (~$0.01)

**Total for CardForgeNFT**: ~$0.10-$1.00

---

## 🚀 Quick Start (Copy-Paste)

```bash
# 1. Navigate to package
cd packages/base-mini-apps

# 2. Create .env file (if not exists)
echo "PRIVATE_KEY=0xYourPrivateKeyHere" > .env

# 3. Compile contracts
pnpm run compile

# 4. Deploy CardForgeNFT
pnpm run deploy:card-forge

# 5. Check deployment.json
cat contracts/deployment.json
```

---

**Ready to deploy?** Just need your `PRIVATE_KEY` and some ETH on Base! 🚀

