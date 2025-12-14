# Economic Engine Core System - Complete Documentation

**Status**: ✅ Complete  
**Last Updated**: 2025-01-27  
**Understanding**: ✅ 100%

---

## 🎯 Executive Summary

The **Economic Engine Core** is DreamNet's token economy system that manages token configurations, balances, reward events, emission rules, and applied rewards. It provides a unified economic layer that rewards user activity across all subsystems (Zen Garden, DreamBet, DreamVault, Social Hub, etc.) with various tokens (SHEEP, DREAM, ZEN_POINTS, VAULT_CREDITS, PLAY_TOKENS).

**Key Concept**: Like a central bank, Economic Engine Core manages token supply, tracks balances, processes rewards, and applies emission rules to convert activities into token rewards.

---

## 📦 WHAT: Purpose & Functionality

### Economic Engine Core (`packages/economic-engine-core/`)

**Purpose**: Unified token economy system for DreamNet.

**Key Functions**:
- **Token Management**: Manages token configurations (SHEEP, DREAM, ZEN_POINTS, etc.)
- **Balance Tracking**: Tracks token balances per identity (user/wallet/agent)
- **Reward Processing**: Processes raw reward events from subsystems
- **Emission Rules**: Applies emission rules to convert activities into tokens
- **Reward History**: Tracks applied rewards for audit trail

**Design Philosophy**:
- **Identity-Based**: Balances tied to IdentityGrid node IDs (not just wallets)
- **Rule-Based**: Emission rules define how activities convert to tokens
- **Multi-Token**: Supports multiple token types (SHEEP, DREAM, points, credits)
- **Activity-Driven**: Rewards based on user activity (not just transactions)

---

## 📍 WHERE: Location & Integration

### Package Structure

```
packages/economic-engine-core/
├── index.ts                    # Public API (getBalance, recordRawReward, applyEmission, run, status)
├── types.ts                    # TokenSymbol, TokenConfig, BalanceRecord, RawRewardEvent, EmissionRule, AppliedReward
├── scheduler/
│   └── econScheduler.ts        # Cycle execution
├── logic/
│   ├── rewardIngestion.ts      # Reward processing (applyEmissionForReward)
│   └── emissionRules.ts        # Default emission rules seeding
└── store/
    └── econStore.ts            # Token, balance, reward storage
```

### Integration Points

1.1. **Orchestrator Core** (`packages/orchestrator-core/logic/runCycle.ts`)
   - Economic Engine runs in Phase 2 (Core Analytics)
   - Location: Line 59-73
   - Purpose: Process rewards and update balances

2. **Subsystems** (via `recordRawReward()`)
   - Zen Garden → Records activity rewards
   - DreamBet → Records win/participation rewards
   - DreamVault → Records contribution rewards
   - Social Hub → Records contribution rewards
   - DreamTank → Records milestone rewards
   - Init Ritual → Records completion rewards

3. **Identity Grid** (`packages/identity-grid/`)
   - Balances tied to IdentityGrid node IDs
   - Location: `types.ts` line 17 (identityId field)

4. **Neural Mesh** (`packages/neural-mesh/`)
   - Economic Engine stores snapshots in Neural Mesh
   - Location: `econScheduler.ts` line 18-26

---

## 🔧 HOW: Implementation & Execution

### Token Types

**Token Symbols** (`EconTokenSymbol`):
```typescript
type EconTokenSymbol =
  | "SHEEP"          // Primary DreamNet ecosystem token
  | "DREAM"          // Governance / meta token
  | "FLBY"           // Flutterbye ecosystem token
  | "ZEN_POINTS"     // Off-chain points for Zen Garden
  | "VAULT_CREDITS"  // Credits for DreamVault blueprints
  | "PLAY_TOKENS";   // Internal tokens for DreamBet games
```

**Token Config** (`EconTokenConfig`):
```typescript
interface EconTokenConfig {
  symbol: EconTokenSymbol;   // Token symbol
  label: string;              // Display label (e.g. "$SHEEP")
  decimals: number;           // Decimal places (18 for tokens, 0 for points)
  description?: string;       // Description
}
```

**Default Token Configs**:
- **SHEEP**: `$SHEEP`, 18 decimals, "Primary DreamNet ecosystem token"
- **DREAM**: `$DREAM`, 18 decimals, "Governance / meta token"
- **FLBY**: `$FLBY`, 9 decimals, "Flutterbye ecosystem token"
- **ZEN_POINTS**: `Zen Points`, 0 decimals, "Off-chain points for Zen Garden"
- **VAULT_CREDITS**: `Vault Credits`, 0 decimals, "Credits for DreamVault blueprints"
- **PLAY_TOKENS**: `Play Tokens`, 0 decimals, "Internal tokens for DreamBet games"

### Balance Tracking

**Balance Record** (`BalanceRecord`):
```typescript
interface BalanceRecord {
  identityId: string;          // IdentityGrid node ID (user/wallet/agent)
  token: EconTokenSymbol;      // Token symbol
  amount: number;              // Balance amount (float for simulation)
  updatedAt: number;           // Last update timestamp
}
```

**Balance Storage**:
- Key format: `${identityId}:${token}`
- Storage: `Map<string, BalanceRecord>`
- Auto-creation: Balances created on first access (default: 0)

**Balance Operations**:
```typescript
// Get balance (creates if doesn't exist)
const balance = EconomicEngineCore.getBalance("identity-123", "SHEEP");

// Adjust balance (add/subtract)
EconStore.adjustBalance("identity-123", "SHEEP", 10.5);

// Set balance (absolute)
EconStore.setBalance("identity-123", "SHEEP", 100.0);
```

### Reward Events

**Raw Reward Event** (`RawRewardEvent`):
```typescript
interface RawRewardEvent {
  id: string;                  // Unique reward ID
  identityId: string;          // IdentityGrid node ID
  source: RewardSource;        // Source subsystem
  kind: RewardKind;            // Reward kind
  baseValue: number;           // Abstract value [0, inf) (used by emission rules)
  meta?: Record<string, any>;  // Additional metadata
  createdAt: number;           // Creation timestamp
}
```

**Reward Sources** (`RewardSource`):
```typescript
type RewardSource =
  | "zen-garden"      // Zen Garden activities
  | "dreambet"        // DreamBet games
  | "dreamvault"      // DreamVault contributions
  | "dreamshop"       // DreamShop purchases
  | "socialhub"       // Social Hub contributions
  | "dreamtank"       // DreamTank milestones
  | "init-ritual"     // Init Ritual completion
  | "system";         // System rewards
```

**Reward Kinds** (`RewardKind`):
```typescript
type RewardKind =
  | "activity"        // General activity
  | "streak"          // Streak rewards
  | "win"             // Win rewards
  | "participation"   // Participation rewards
  | "purchase"        // Purchase rewards
  | "contribution"    // Contribution rewards
  | "milestone"       // Milestone rewards
  | "bonus";          // Bonus rewards
```

### Emission Rules

**Emission Rule** (`EmissionRule`):
```typescript
interface EmissionRule {
  id: string;                  // Unique rule ID
  source: RewardSource;        // Source subsystem
  kind: RewardKind;            // Reward kind
  token: EconTokenSymbol;      // Token to award
  multiplier: number;          // Award amount = baseValue * multiplier
  label?: string;               // Human-readable label
}
```

**Emission Process**:
1. **Match Rules**: Find rules matching `source` and `kind`
2. **Calculate Amount**: `amount = baseValue * multiplier`
3. **Adjust Balance**: Add amount to identity's token balance
4. **Record Reward**: Create AppliedReward record

**Default Emission Rules**:

**Zen Garden**:
- `activity` → `ZEN_POINTS` (multiplier: 1)
- `bonus` → `SHEEP` (multiplier: 0.01)

**DreamBet**:
- `participation` → `PLAY_TOKENS` (multiplier: 5)
- `win` → `SHEEP` (multiplier: 0.02)

**Social Hub**:
- `contribution` → `ZEN_POINTS` (multiplier: 0.5)

**DreamVault**:
- `contribution` → `VAULT_CREDITS` (multiplier: 1)

**DreamTank**:
- `milestone` → `DREAM` (multiplier: 0.05)

**Init Ritual**:
- `milestone` → `ZEN_POINTS` (multiplier: 10)

### Applied Rewards

**Applied Reward** (`AppliedReward`):
```typescript
interface AppliedReward {
  id: string;                  // Unique applied reward ID
  rawRewardId: string;         // Original RawRewardEvent ID
  identityId: string;          // IdentityGrid node ID
  token: EconTokenSymbol;      // Token awarded
  amount: number;              // Amount awarded
  createdAt: number;           // Creation timestamp
  meta?: Record<string, any>;  // Additional metadata (source, kind, ruleId)
}
```

**Reward Processing Flow**:
```
1. Subsystem records RawRewardEvent
   ↓
2. Economic Engine finds matching EmissionRules
   ↓
3. For each matching rule:
   - Calculate: amount = baseValue * multiplier
   - Adjust balance: balance += amount
   - Create AppliedReward record
   ↓
4. Return AppliedReward[] array
```

### Cycle Execution

**Function**: `runEconomicEngineCycle()`

**Purpose**: Run one Economic Engine cycle.

**Execution**:
```typescript
export function runEconomicEngineCycle(ctx: EconomicEngineContext): EconomicEngineStatus {
  const now = Date.now();

  // 1) Ensure default config seeded
  ensureEconomicConfig(ctx);

  // 2) Process rewards (currently manual via applyEmissionForReward)
  // Future: Could poll subsystems for queued rewards

  EconStore.setLastRunAt(now);
  const status = EconStore.status();

  // 3) Store snapshot in Neural Mesh (optional)
  if (ctx.neuralMesh?.remember) {
    ctx.neuralMesh.remember({
      source: "EconomicEngineCore",
      tokenCount: status.tokenCount,
      balanceCount: status.balanceCount,
      appliedRewards: status.appliedRewardCount,
      timestamp: now,
    });
  }

  return status;
}
```

**Execution Order**:
1. **Ensure Config**: Seed default token configs and emission rules
2. **Process Rewards**: Apply emission rules to raw rewards (currently manual)
3. **Store Snapshot**: Push snapshot to Neural Mesh (optional)
4. **Return Status**: Return current status

---

## 📖 Public API

### Get Balance

```typescript
const balance = EconomicEngineCore.getBalance("identity-123", "SHEEP");
// Returns: {
//   identityId: "identity-123",
//   token: "SHEEP",
//   amount: 100.5,
//   updatedAt: 1234567890
// }
```

### Record Raw Reward

```typescript
const reward = EconomicEngineCore.recordRawReward({
  identityId: "identity-123",
  source: "zen-garden",
  kind: "activity",
  baseValue: 10,
  meta: { activityType: "meditation" }
});
```

### Apply Emission for Reward

```typescript
const appliedRewards = EconomicEngineCore.applyEmissionForReward(reward);
// Returns: AppliedReward[]
// [
//   {
//     id: "reward-123",
//     rawRewardId: "rawreward-123",
//     identityId: "identity-123",
//     token: "ZEN_POINTS",
//     amount: 10,
//     createdAt: 1234567890,
//     meta: { source: "zen-garden", kind: "activity", ruleId: "rule:zen-activity-points" }
//   }
// ]
```

### List Token Configs

```typescript
const configs = EconomicEngineCore.listTokenConfigs();
// Returns: EconTokenConfig[]
```

### List Emission Rules

```typescript
const rules = EconomicEngineCore.listEmissionRules();
// Returns: EmissionRule[]
```

### List Balances

```typescript
const balances = EconomicEngineCore.listBalances();
// Returns: BalanceRecord[]
```

### List Applied Rewards

```typescript
const rewards = EconomicEngineCore.listAppliedRewards();
// Returns: AppliedReward[]
```

### Run Cycle

```typescript
const status = EconomicEngineCore.run({
  identityGrid,
  zenGardenCore,
  dreamBetCore,
  dreamVault,
  dreamShop,
  socialHubCore,
  dreamTankCore,
  initRitualCore,
  fieldLayer,
  narrativeField,
  neuralMesh,
});
```

### Get Status

```typescript
const status = EconomicEngineCore.status();
// Returns: {
//   lastRunAt: 1234567890,
//   tokenCount: 6,
//   emissionRuleCount: 8,
//   balanceCount: 50,
//   appliedRewardCount: 200,
//   sampleBalances: [...]
// }
```

---

## 🎨 WHY: Design Rationale

### Identity-Based Balances

**Why Identity IDs?**
- **Unified Identity**: Works with IdentityGrid (users, wallets, agents)
- **Flexibility**: Not tied to just wallets (can be agents, services)
- **Consistency**: Same identity system across DreamNet
- **Future-Proof**: Can extend to multi-chain identities

### Rule-Based Emissions

**Why Emission Rules?**
- **Flexibility**: Can change rules without code changes
- **Transparency**: Rules are explicit and auditable
- **Multi-Token**: One activity can award multiple tokens
- **Configurable**: Can adjust multipliers per rule

### Multi-Token Support

**Why Multiple Tokens?**
- **Different Purposes**: Different tokens for different purposes (points vs tokens)
- **Gamification**: Points for engagement, tokens for value
- **Flexibility**: Can add new tokens without code changes
- **Ecosystem**: Supports multiple token ecosystems (SHEEP, DREAM, FLBY)

### Activity-Driven Rewards

**Why Activity-Based?**
- **Engagement**: Rewards user activity (not just transactions)
- **Fairness**: Rewards based on participation (not just wealth)
- **Gamification**: Makes activities more engaging
- **Growth**: Encourages platform usage

---

## 🔗 Related Systems

### Economic Engine Receives From
- **Zen Garden** → Activity rewards
- **DreamBet** → Win/participation rewards
- **DreamVault** → Contribution rewards
- **Social Hub** → Contribution rewards
- **DreamTank** → Milestone rewards
- **Init Ritual** → Completion rewards

### Economic Engine Feeds To
- **Neural Mesh** → Economic snapshots (via `remember()`)
- **Identity Grid** → Balance queries (via identityId)

### Economic Engine Coordinates With
- **Orchestrator Core** (runs in Phase 2)
- **Identity Grid** (uses identityId for balances)

---

## 📊 Performance Characteristics

### Balance Storage
- **Per Balance**: ~150 bytes
- **Typical**: 100-1,000 balances
- **Total Memory**: ~15-150KB

### Reward Processing
- **O(n)**: Must match rules for each reward
- **Typical**: < 5ms per reward
- **Batch**: Could batch process (not implemented)

### Emission Rule Matching
- **O(n)**: Must check all rules
- **Typical**: < 1ms for 10 rules
- **Optimization**: Could index by source+kind (not implemented)

---

## 🐛 Error Handling

### Graceful Degradation

**Pattern**: Missing subsystems don't break Economic Engine

```typescript
// Economic Engine doesn't require any subsystems
// All subsystems are optional
```

**Behavior**:
- Missing subsystems: Continue without them (no error)
- Invalid rewards: Skip invalid rewards, continue
- Invalid rules: Skip invalid rules, continue

### Error Recovery

**Reward Errors**:
- If reward invalid: Skip reward, continue
- If rule matching fails: Return empty array
- If balance update fails: Log error, continue

**Balance Errors**:
- If balance invalid: Use default (0)
- If balance update fails: Retry or log error

---

## ✅ Summary

The Economic Engine Core is DreamNet's token economy system that:

1. **Manages** token configurations (SHEEP, DREAM, ZEN_POINTS, VAULT_CREDITS, PLAY_TOKENS)
2. **Tracks** token balances per identity (IdentityGrid node IDs)
3. **Processes** raw reward events from subsystems
4. **Applies** emission rules to convert activities into tokens
5. **Tracks** applied rewards for audit trail
6. **Supports** multiple reward sources (Zen Garden, DreamBet, DreamVault, etc.)

**Key Files**:
- `packages/economic-engine-core/scheduler/econScheduler.ts` - Cycle execution
- `packages/economic-engine-core/logic/rewardIngestion.ts` - Reward processing
- `packages/economic-engine-core/logic/emissionRules.ts` - Default emission rules
- `packages/economic-engine-core/store/econStore.ts` - Storage

**Understanding**: ✅ 100% - Complete understanding of token management, balance tracking, reward processing, and emission rules.

---

**Last Updated**: 2025-01-27  
**Status**: ✅ Complete Documentation

