# Chunked Build & Deployment Guide
## Split Build Process + Base Contract Deployment

---

## 🏗️ Chunked Railway Build

The Railway build is now split into chunks to reduce memory pressure:

### Build Phases

1. **Install Dependencies** (nixpacks handles this)
   - Installs all packages with pnpm

2. **Build Frontend** (Step 1 - Memory Intensive)
   - Runs: `cd .. && npx pnpm --filter client build`
   - Uses 8GB memory limit
   - Creates `client/dist/`

3. **Build Backend** (Step 2 - Lightweight)
   - Runs: `cd server && npx pnpm build`
   - Much lighter, builds `server/dist/`

### Benefits

- ✅ Reduced peak memory usage
- ✅ Better error isolation
- ✅ Faster recovery if one step fails
- ✅ Clearer build logs

---

## 🔐 Base Contract Deployment

### Using Your Private Key

Your private key is stored in **Railway environment variables** and can be used for contract deployment.

### Deploy Contracts

**Option 1: Using Root Script** (Recommended)
```bash
# From repo root
pnpm run deploy:base-contracts
```

**Option 2: Direct Deployment**
```bash
cd packages/base-mini-apps
pnpm run deploy:card-forge
```

### Environment Variables

The script automatically uses:
- `PRIVATE_KEY` (primary)
- `BASE_DEPLOYER_PRIVATE_KEY` (fallback)

**Set in Railway**:
1. Go to Railway Dashboard → Your Service → Variables
2. Add: `PRIVATE_KEY=0xYourPrivateKey`
3. Or: `BASE_DEPLOYER_PRIVATE_KEY=0xYourPrivateKey`

**Set Locally**:
```bash
# Create .env in packages/base-mini-apps/
PRIVATE_KEY=0xYourPrivateKey
```

### What Gets Deployed

1. **CardForgeNFT** - NFT card minting contract
2. **Other contracts** - Can deploy all with `pnpm run deploy:all`

### After Deployment

- Contract addresses saved to `contracts/deployment.json`
- Frontend config updated automatically
- Ready to use in `/hub/apps/card-forge-pro`

---

## 🚀 Quick Start

### 1. Set Private Key in Railway

```bash
# Railway Dashboard → Service → Variables
PRIVATE_KEY=0xYourPrivateKeyFromMetaMask
```

### 2. Deploy Contracts

```bash
# From repo root
pnpm run deploy:base-contracts
```

### 3. Verify Deployment

- Check `packages/base-mini-apps/contracts/deployment.json`
- Visit BaseScan: `https://basescan.org/address/0xContractAddress`

---

## 💰 Cost

- **Deploy Contract**: ~$0.10-$1.00 (gas fees)
- **Mint NFT**: ~$0.01 per mint

**Paid from**: Your MetaMask wallet (via PRIVATE_KEY)

---

## 🔒 Security Notes

- ✅ Private key stored in Railway environment variables (encrypted)
- ✅ Never committed to git (`.env` in `.gitignore`)
- ✅ Script validates private key format
- ✅ Shows deployer address before deploying

---

## 📋 Deployment Checklist

- [ ] Private key set in Railway environment variables
- [ ] ETH in deployer wallet (check balance)
- [ ] Contracts compiled (`pnpm run compile`)
- [ ] Ready to deploy!

---

**Ready?** Just run `pnpm run deploy:base-contracts` and it uses your Railway `PRIVATE_KEY`! 🚀

