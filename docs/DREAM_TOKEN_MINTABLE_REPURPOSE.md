# DreamToken Mintable - Repurposing Strategy

**Status**: 🎯 Strategic Plan  
**Created**: 2025-01-27

---

## 🎯 Situation

We have **TWO DreamToken contracts**:

1. **Live Trading Token** (`0x233eeF08d6A6ea467620E895054fcAc2bf1b8888`)
   - ✅ Already trading on Base
   - ✅ Public token for base.meme and trading
   - ✅ Community-facing token

2. **Mintable Contract** (`0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77`)
   - ✅ Deployed but not yet used
   - ✅ Owner-controlled minting
   - ✅ Perfect for internal ecosystem use

---

## 💡 Repurposing Strategy

### Option 1: Agent Rewards Token (RECOMMENDED) ⭐

**Use Case**: Internal token for agent rewards and ecosystem incentives

**Features**:
- Owner-controlled minting (DreamNet OS controls distribution)
- Batch minting for efficient agent payouts
- Burn functionality for token management
- Max supply: 1 billion tokens

**Implementation**:
- Rename to **"DreamNet Agent Rewards Token" (DART)** or **"DreamNet Internal Token" (DNIT)**
- Use for:
  - Agent performance rewards
  - Developer bounties
  - Creator payouts
  - Ecosystem incentives
  - Staking rewards

**Advantages**:
- ✅ Separate from public trading token
- ✅ Controlled distribution
- ✅ Can bridge to main DREAM token later
- ✅ Perfect for internal economy

---

### Option 2: Staking & Governance Token

**Use Case**: Token for staking, governance, and protocol participation

**Features**:
- Staking rewards distribution
- Governance voting weight
- Protocol participation incentives
- Burn mechanism for deflationary mechanics

**Implementation**:
- Use for DreamNet OS governance
- Staking rewards for validators/agents
- Voting power for protocol decisions
- Participation rewards

---

### Option 3: Developer & Creator Token

**Use Case**: Token specifically for developers and creators building on DreamNet

**Features**:
- Developer bounties
- Creator revenue sharing
- Platform fee distribution
- Build rewards

**Implementation**:
- Reward developers for building agents
- Pay creators for content
- Distribute platform fees
- Incentivize ecosystem growth

---

### Option 4: Bridge Token / Wrapper

**Use Case**: Bridge between internal DREAM and on-chain DREAM

**Features**:
- Wrap internal DREAM balances
- Bridge to main DREAM token
- Cross-chain compatibility
- Liquidity provision

**Implementation**:
- Users claim internal DREAM → mint mintable token
- Can swap to main DREAM token
- Provides liquidity bridge
- Enables cross-chain operations

---

## 🚀 Recommended Approach: **Option 1 - Agent Rewards Token**

### Why This Makes Sense

1. **Clear Separation**
   - Public DREAM (`0x233eeF08...`) = Trading, base.meme, community
   - Mintable DREAM (`0x4a6775ab...`) = Internal rewards, agents, ecosystem

2. **Perfect Fit for DreamNet OS**
   - 143+ agents need reward mechanism
   - Controlled distribution via owner
   - Batch minting for efficiency
   - Burn for token management

3. **Future Flexibility**
   - Can bridge to main DREAM later
   - Can create swap mechanism
   - Can use for governance
   - Can expand use cases

### Implementation Plan

#### Phase 1: Rename & Rebrand
- [ ] Rename contract to "DreamNet Agent Rewards Token" (DART)
- [ ] Update documentation
- [ ] Create new symbol (DART or DNIT)
- [ ] Update contract metadata

#### Phase 2: Integration
- [ ] Connect to Agent Registry Core
- [ ] Integrate with Economic Engine Core
- [ ] Set up reward distribution logic
- [ ] Create minting API endpoints

#### Phase 3: Agent Rewards
- [ ] Reward agents for successful tasks
- [ ] Batch mint for multiple agents
- [ ] Track agent performance
- [ ] Distribute rewards automatically

#### Phase 4: Ecosystem Expansion
- [ ] Developer bounties
- [ ] Creator payouts
- [ ] Staking rewards
- [ ] Governance participation

---

## 📋 Contract Details

**Address**: `0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77`  
**Network**: Base Mainnet  
**Type**: ERC-20 Mintable  
**Max Supply**: 1,000,000,000 tokens (1 billion)

**Functions**:
- `mint(address to, uint256 amount)` - Owner only
- `mintBatch(address[] recipients, uint256[] amounts)` - Owner only
- `burn(uint256 amount)` - Anyone can burn their own tokens

**Current Status**: Deployed, ready to use

---

## 🔗 Integration Points

### DreamNet OS Integration
- **Agent Registry Core**: Track agent performance
- **Economic Engine Core**: Calculate rewards
- **OrchestratorCore**: Distribute rewards
- **Citadel**: Strategic reward planning

### Code Updates Needed
- [ ] Update `packages/dream-token/dreamTokenBridge.ts` to support both tokens
- [ ] Create `packages/dream-token/agentRewardsToken.ts` for mintable token
- [ ] Integrate with Economic Engine Core
- [ ] Add API endpoints for minting

---

## 💰 Tokenomics

### Distribution Strategy
- **Agent Rewards**: 40% (400M tokens)
- **Developer Bounties**: 20% (200M tokens)
- **Creator Payouts**: 20% (200M tokens)
- **Staking Rewards**: 10% (100M tokens)
- **Governance**: 10% (100M tokens)

### Minting Schedule
- Mint as needed (no fixed schedule)
- Owner-controlled distribution
- Can pause if needed
- Burn excess if necessary

---

## 🎯 Next Steps

1. **Decide on Use Case** (Recommend Option 1)
2. **Update Contract Metadata** (if renaming)
3. **Integrate with DreamNet OS**
4. **Set up Distribution Logic**
5. **Launch Agent Rewards Program**

---

## 📊 Comparison: Two Tokens

| Feature | Public DREAM | Mintable DREAM |
|---------|-------------|----------------|
| **Address** | `0x233eeF08...` | `0x4a6775ab...` |
| **Purpose** | Trading, base.meme | Internal rewards |
| **Distribution** | Public trading | Owner-controlled |
| **Supply** | Fixed/trading | Up to 1B mintable |
| **Use Case** | Community token | Ecosystem rewards |
| **Control** | Decentralized | Centralized (DreamNet OS) |

---

**Status**: 🎯 Ready to Repurpose — Recommended: Agent Rewards Token!

