# 🌐 Unified Dream Hub Architecture

## 🎯 The Vision

**Dream Hub = Social + Economy + Apps = Complete Ecosystem**

One unified experience where:
- **DREAM Token** powers everything
- **Social features** (Dream Feed) integrated
- **Mini Apps** accessible from hub
- **Economy** (token, staking, rewards) built-in

## 🏗️ Architecture Decision: **BLEND IT ALL**

### ✅ Recommended: Unified Dream Hub

**Domain**: `dreamhub.dream` or `dreamnet.dream`

**Structure**:
```
Dream Hub (dreamhub.dream)
│
├── 🏠 Home (/)
│   ├── Dream Feed (social layer)
│   ├── DREAM Balance (economy layer)
│   ├── Mini Apps Grid (apps layer)
│   └── Wallet Connection
│
├── 💭 Dream Feed (/dream-feed)
│   ├── Dreams posted
│   ├── Remixes (cost DREAM)
│   ├── Comments (cost DREAM)
│   ├── Tips (send DREAM)
│   └── Shares
│
├── 💎 Economy (/economy)
│   ├── DREAM Balance
│   ├── Send/Receive DREAM
│   ├── Transaction History
│   ├── Staking Dashboard
│   ├── Rewards & Earnings
│   └── Governance Voting
│
├── 📱 Mini Apps (/miniapps)
│   ├── Agent Foundry
│   ├── DreamStar (music)
│   ├── Science Hub
│   ├── Travel Planner
│   ├── All Verticals
│   └── Each powered by DREAM
│
└── 👛 Wallet (/wallet)
    ├── Connect Wallet
    ├── View DREAM Balance
    ├── View Other Tokens (SHEEP, FLBY, CORE)
    ├── Send/Receive
    └── Transaction History
```

## 💎 DREAM Token Integration

### Smart Contract
- **Location**: `contracts/DreamToken.sol`
- **Network**: Base L2 (or your preferred chain)
- **Integration**: Via ethers.js/web3

### Integration Points

1. **Dream Hub Homepage**
   - Display DREAM balance prominently
   - Quick send/receive
   - Staking status

2. **Dream Feed**
   - Post dream: Cost DREAM
   - Remix dream: Cost DREAM
   - Tip creator: Send DREAM
   - Comment: Cost DREAM (optional)

3. **Mini Apps**
   - Each app accepts DREAM
   - Cross-app transactions
   - Unified wallet

4. **Economy Dashboard**
   - Full token management
   - Staking interface
   - Governance voting
   - Rewards tracking

## 🎨 User Experience Flow

### New User Journey:
1. **Land on Dream Hub** (`dreamhub.dream`)
2. **Connect Wallet** → See DREAM balance
3. **Browse Dream Feed** → See social layer
4. **Explore Mini Apps** → Access verticals
5. **Use DREAM** → Power interactions

### Existing User Journey:
1. **Open Dream Hub** → See personalized feed
2. **Check DREAM Balance** → See earnings
3. **Use Mini Apps** → Spend/earn DREAM
4. **Stake DREAM** → Earn rewards
5. **Governance** → Vote with DREAM

## 🔗 DREAM Token Contract Integration

### Contract Address
Deploy DREAM token to Base L2:
```bash
pnpm deploy:base-mainnet
# or
pnpm deploy:base-sepolia  # for testing
```

### Frontend Integration
```typescript
// client/src/lib/dreamToken.ts
import { ethers } from 'ethers';
import DreamTokenABI from '../contracts/DreamToken.json';

export async function getDreamBalance(walletAddress: string): Promise<string> {
  const provider = new ethers.providers.JsonRpcProvider(BASE_RPC_URL);
  const contract = new ethers.Contract(DREAM_TOKEN_ADDRESS, DreamTokenABI, provider);
  const balance = await contract.balanceOf(walletAddress);
  return ethers.utils.formatEther(balance);
}
```

### Backend Integration
```typescript
// server/routes/dream-token.ts
router.get('/balance/:wallet', async (req, res) => {
  const balance = await getDreamBalance(req.params.wallet);
  res.json({ balance, symbol: 'DREAM' });
});
```

## 📊 Implementation Plan

### Phase 1: Dream Hub Foundation ✅
- [x] Dream Hub page exists (`/dream-cloud`, `/admin`)
- [ ] Unify into single `/dream-hub` route
- [ ] Add DREAM balance display
- [ ] Integrate wallet connection

### Phase 2: DREAM Token Integration
- [ ] Connect DreamToken.sol contract
- [ ] Display balance on hub
- [ ] Send/receive DREAM
- [ ] Transaction history

### Phase 3: Social + Economy
- [ ] Dream Feed with DREAM tips
- [ ] Remix costs DREAM
- [ ] Staking interface
- [ ] Governance voting

### Phase 4: Mini Apps Integration
- [ ] Each app accepts DREAM
- [ ] Cross-app transactions
- [ ] Unified wallet

## 🎯 Final Answer

**YES - Blend DREAM into Dream Hub!**

- **Dream Hub** = Main entry point
- **DREAM Token** = Economic backbone
- **Mini Apps** = Vertical experiences
- **All Unified** = One ecosystem

**No separate DREAM site needed** - it's all part of Dream Hub!

---

**One Hub. One Token. One Economy. One Experience.** 🚀

