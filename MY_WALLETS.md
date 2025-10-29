# 💼 My Wallet Addresses

**Quick reference for your crypto wallets across all chains**

## ⚠️ Important Security Notes:
- ✅ **Public addresses are SAFE** to store here
- ❌ **NEVER store private keys or seed phrases** anywhere in code
- ℹ️ These are just convenience references - your real wallets stay secure

---

## 🔗 My Wallets

### Phantom (Solana)
**Chain:** `solana`  
**Address:** `YOUR_PHANTOM_ADDRESS_HERE`  
**Use for:** SOL + SPL tokens (meme coins, alts)

### Uniswap/MetaMask (Ethereum)
**Chain:** `ethereum`  
**Address:** `YOUR_METAMASK_ADDRESS_HERE`  
**Use for:** ETH + ERC-20 tokens (memes, alts, DeFi)

### Coinbase (Ethereum)
**Chain:** `ethereum`  
**Address:** `YOUR_COINBASE_ADDRESS_HERE`  
**Use for:** ETH + ERC-20 tokens (your safe holdings)

### VeChain
**Chain:** `vechain`  
**Address:** `YOUR_VECHAIN_ADDRESS_HERE`  
**Use for:** VET + VTHO

### Kaspa
**Chain:** `kaspa`  
**Address:** `YOUR_KASPA_ADDRESS_HERE`  
**Use for:** KAS (blockDAG network)

---

## 🚀 How to Add These to DreamNet

### Option 1: Via API (Recommended)
```bash
# Phantom
curl -X POST http://localhost:5000/api/wallets \
  -H "Content-Type: application/json" \
  -d '{"address":"YOUR_PHANTOM_ADDRESS","chain":"solana","nickname":"My Phantom"}'

# MetaMask
curl -X POST http://localhost:5000/api/wallets \
  -H "Content-Type: application/json" \
  -d '{"address":"YOUR_METAMASK_ADDRESS","chain":"ethereum","nickname":"My MetaMask"}'

# Coinbase
curl -X POST http://localhost:5000/api/wallets \
  -H "Content-Type: application/json" \
  -d '{"address":"YOUR_COINBASE_ADDRESS","chain":"ethereum","nickname":"My Coinbase"}'

# VeChain
curl -X POST http://localhost:5000/api/wallets \
  -H "Content-Type: application/json" \
  -d '{"address":"YOUR_VECHAIN_ADDRESS","chain":"vechain","nickname":"My VeChain"}'

# Kaspa
curl -X POST http://localhost:5000/api/wallets \
  -H "Content-Type: application/json" \
  -d '{"address":"YOUR_KASPA_ADDRESS","chain":"kaspa","nickname":"My Kaspa"}'
```

### Option 2: In UI (Coming Soon)
Add wallets directly in the `/crypto` dashboard

---

## 📊 What You'll See:

After adding wallets, you can analyze them to get:
- ✅ Real native token balances (ETH, SOL, VET, KAS, etc.)
- ✅ ALL tokens (meme coins, alts, stablecoins)
- ✅ USD values (calculated with real-time prices)
- ✅ Portfolio risk analysis
- ✅ Yield opportunities
- ✅ NFT counts

---

## 🔐 Why NOT Use Replit Secrets?

**Replit Secrets are for SENSITIVE data like:**
- API keys (Alchemy, Helius, Stripe)
- Private keys (if ever needed for server wallets)
- Database passwords

**Public wallet addresses DON'T need secrets because:**
- Anyone can see them on blockchain explorers
- They're safe to share publicly
- No security risk storing them in code

**Best practice:** Just add them via the API or use environment variables for quick reference!
