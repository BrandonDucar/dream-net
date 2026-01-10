# Base Mini-Apps

Dream State mini-apps deployed on Base blockchain.

## 🚀 Quick Start

### Prerequisites

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Add your PRIVATE_KEY and RPC URLs
```

### Compile Contracts

```bash
pnpm compile
```

### Deploy to Base

```bash
# Deploy passport contract
pnpm deploy:passport

# Deploy governance contract (requires passport address)
export PASSPORT_CONTRACT_ADDRESS=0x...
pnpm deploy:governance

# Or deploy all at once
pnpm deploy:all
```

### Test

```bash
pnpm test
```

## 📱 Mini-Apps

1. **Dream Passport Mint** - Mint passport NFTs
2. **Dream State Governance** - Vote on proposals
3. **API Keeper Dashboard** - Manage APIs
4. **Wolf Pack Funding Portal** - Funding leads
5. **DreamNet Social Hub** - Social network
6. **Whale Pack Commerce** - TikTok commerce
7. **DreamNet Treasury** - Treasury management
8. **Shield Status Monitor** - Security monitoring

## 🔗 Contract Addresses

After deployment, update these in your frontend:

- `PASSPORT_CONTRACT_ADDRESS` - Passport NFT contract
- `GOVERNANCE_CONTRACT_ADDRESS` - Governance contract

## 📚 Documentation

See `BASE_MINI_APPS_GUIDE.md` for full documentation.

