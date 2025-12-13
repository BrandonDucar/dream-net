# Economic Engine Core - Complete Documentation

**Package**: `@dreamnet/economic-engine-core`  
**Status**: ✅ Complete  
**Last Updated**: 2025-01-27

---

## Overview

Economic Engine Core provides **token economics, balance management, and reward emission** for DreamNet. It manages multiple token types (SHEEP, DREAM, FLBY, ZEN_POINTS, VAULT_CREDITS, PLAY_TOKENS), tracks balances per identity, and applies emission rules to convert raw reward events into token rewards.

### Key Features

- **Multi-Token Support**: Manages 6+ token types with configurable decimals
- **Identity-Based Balances**: Balances tracked per IdentityGrid node ID
- **Reward Sources**: Tracks rewards from 8+ sources (zen-garden, dreambet, dreamvault, etc.)
- **Emission Rules**: Configurable rules convert raw rewards to token amounts
- **Reward Kinds**: Supports 8 reward kinds (activity, streak, win, participation, etc.)
- **Applied Rewards**: Tracks all applied rewards with metadata

---

## Architecture

### How It Works

```
Raw Reward Event → Emission Rule Matching → Balance Adjustment → Applied Reward Recording
```

1. **Raw Reward Event**: System records raw reward (source, kind, baseValue, identityId)
2. **Emission Rule Matching**: Rules matched by source + kind
3. **Balance Adjustment**: Balance adjusted by `baseValue * multiplier`
4. **Applied Reward Recording**: Applied reward recorded with metadata

### Why This Design

- **Identity Integration**: Uses IdentityGrid node IDs for universal identity
- **Flexible Rules**: Emission rules enable different reward rates per source/kind
- **Multi-Token**: Supports multiple token types for different use cases
- **Audit Trail**: Applied rewards provide complete audit trail
- **Simulation Ready**: Float-based balances suitable for simulation

---

## API Reference

### Types

```typescript
export type EconTokenSymbol =
  | "SHEEP"
  | "DREAM"
  | "FLBY"
  | "ZEN_POINTS"
  | "VAULT_CREDITS"
  | "PLAY_TOKENS";

export interface EconTokenConfig {
  symbol: EconTokenSymbol;
  label: string;
  decimals: number;
  description?: string;
}

export interface BalanceRecord {
  identityId: string;          // IdentityGrid node id
  token: EconTokenSymbol;
  amount: number;              // Float is fine for simulation
  updatedAt: number;
}

export type RewardSource =
  | "zen-garden"
  | "dreambet"
  | "dreamvault"
  | "dreamshop"
  | "socialhub"
  | "dreamtank"
  | "init-ritual"
  | "system";

export type RewardKind =
  | "activity"
  | "streak"
  | "win"
  | "participation"
  | "purchase"
  | "contribution"
  | "milestone"
  | "bonus";

export interface RawRewardEvent {
  id: string;
  identityId: string;
  source: RewardSource;
  kind: RewardKind;
  baseValue: number;           // Abstract value [0,inf)
  meta?: Record<string, any>;
  createdAt: number;
}

export interface EmissionRule {
  id: string;
  source: RewardSource;
  kind: RewardKind;
  token: EconTokenSymbol;
  multiplier: number;          // awarded amount = baseValue * multiplier
  label?: string;
}

export interface AppliedReward {
  id: string;
  rawRewardId: string;
  identityId: string;
  token: EconTokenSymbol;
  amount: number;
  createdAt: number;
  meta?: Record<string, any>;
}

export interface EconomicEngineContext {
  identityGrid?: any;
  zenGardenCore?: any;
  dreamBetCore?: any;
  dreamVault?: any;
  dreamShop?: any;
  socialHubCore?: any;
  dreamTankCore?: any;
  initRitualCore?: any;
  fieldLayer?: any;
  narrativeField?: any;
  neuralMesh?: any;
}

export interface EconomicEngineStatus {
  lastRunAt: number | null;
  tokenCount: number;
  emissionRuleCount: number;
  balanceCount: number;
  appliedRewardCount: number;
  sampleBalances: BalanceRecord[];
}
```

### Default Tokens

- **SHEEP**: Primary utility token
- **DREAM**: Governance token
- **FLBY**: Fungible token
- **ZEN_POINTS**: Wellness points
- **VAULT_CREDITS**: Vault credits
- **PLAY_TOKENS**: Gaming tokens

### Functions

#### `ensureDefaultConfigSeeded(): void`

Seed default token configs and emission rules.

**Example**:
```typescript
import { EconomicEngineCore } from "@dreamnet/economic-engine-core";

EconomicEngineCore.ensureDefaultConfigSeeded();
```

#### `listTokenConfigs(): EconTokenConfig[]`

List all token configurations.

#### `listEmissionRules(): EmissionRule[]`

List all emission rules.

#### `getBalance(identityId: string, token: EconTokenSymbol): BalanceRecord`

Get balance for an identity and token.

**Example**:
```typescript
const balance = EconomicEngineCore.getBalance("identity:user-123", "SHEEP");
console.log(`Balance: ${balance.amount} SHEEP`);
```

#### `listBalances(): BalanceRecord[]`

List all balances.

#### `recordRawReward(ev: Omit<RawRewardEvent, "id" | "createdAt">): RawRewardEvent`

Record a raw reward event.

**Example**:
```typescript
const rawReward = EconomicEngineCore.recordRawReward({
  identityId: "identity:user-123",
  source: "zen-garden",
  kind: "activity",
  baseValue: 10,
  meta: { sessionId: "session-456" },
});
```

#### `applyEmissionForReward(ev: RawRewardEvent): AppliedReward[]`

Apply emission rules to a raw reward event.

**Example**:
```typescript
const rawReward = EconomicEngineCore.recordRawReward({...});
const appliedRewards = EconomicEngineCore.applyEmissionForReward(rawReward);
// Returns array of AppliedReward objects
```

#### `listAppliedRewards(): AppliedReward[]`

List all applied rewards.

#### `run(context: EconomicEngineContext): EconomicEngineStatus`

Run economic engine cycle.

**Example**:
```typescript
const status = EconomicEngineCore.run({
  identityGrid: IdentityGrid,
  zenGardenCore: ZenGardenCore,
});
```

#### `status(): EconomicEngineStatus`

Get current engine status.

---

## Integration Points

### Consumes

- **Identity Grid**: Identity IDs for balance tracking
- **Reward Sources**: Zen Garden, DreamBet, DreamVault, DreamShop, SocialHub, DreamTank, Init Ritual

### Produces

- **Balances**: Token balances per identity
- **Applied Rewards**: Reward history

### Integration Pattern

```typescript
// Reward flow
ZenGardenCore.completeSession(identityId)
  → EconomicEngineCore.recordRawReward({
      identityId,
      source: "zen-garden",
      kind: "activity",
      baseValue: 10,
    })
  → EconomicEngineCore.applyEmissionForReward(rawReward)
  → Balance adjusted (SHEEP, ZEN_POINTS)
  → AppliedReward recorded
```

---

## Usage Examples

### Record Reward

```typescript
import { EconomicEngineCore } from "@dreamnet/economic-engine-core";

// Record raw reward
const rawReward = EconomicEngineCore.recordRawReward({
  identityId: "identity:user-123",
  source: "zen-garden",
  kind: "activity",
  baseValue: 10,
  meta: { sessionId: "session-456" },
});

// Apply emission rules
const appliedRewards = EconomicEngineCore.applyEmissionForReward(rawReward);
// Returns: [{ token: "SHEEP", amount: 5 }, { token: "ZEN_POINTS", amount: 10 }]
```

### Check Balance

```typescript
// Get balance
const balance = EconomicEngineCore.getBalance("identity:user-123", "SHEEP");
console.log(`SHEEP balance: ${balance.amount}`);

// List all balances
const allBalances = EconomicEngineCore.listBalances();
```

### Emission Rules

```typescript
// List emission rules
const rules = EconomicEngineCore.listEmissionRules();
rules.forEach(rule => {
  console.log(`${rule.source}:${rule.kind} → ${rule.token} (x${rule.multiplier})`);
});
```

---

## Best Practices

1. **Identity IDs**: Always use IdentityGrid node IDs for `identityId`
2. **Base Values**: Use consistent base values for similar activities
3. **Emission Rules**: Configure rules to match reward sources/kinds
4. **Metadata**: Include relevant metadata in raw rewards
5. **Balance Checks**: Check balances before operations

---

## Security Considerations

- **Balance Integrity**: Balances are float-based, ensure proper rounding for production
- **Reward Validation**: Validate raw rewards before recording
- **Emission Rules**: Review emission rules to prevent abuse
- **Identity Verification**: Verify identity IDs exist in IdentityGrid

---

## Related Systems

- **Identity Grid**: Provides identity IDs
- **Zen Garden Core**: Records wellness rewards
- **DreamBet Core**: Records gaming rewards
- **DreamVault**: Records vault rewards
- **DreamShop**: Records shop rewards
- **SocialHub Core**: Records social rewards
- **DreamTank Core**: Records tank rewards
- **Init Ritual Core**: Records onboarding rewards

---

**Status**: ✅ Complete  
**Next**: Continue with Dream Shop documentation
