# Prediction Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Prediction Core provides **prediction market domain model and functions** for DreamNet. It defines the core prediction market domain with types, state management, decision tracking, and performance computation. Pure TypeScript domain layer with no external dependencies.

---

## Key Features

### Prediction Market Domain
- Market creation and management
- Outcome types (yes/no/multiple/numeric)
- Staking pools (yes/no pools)
- Market resolution
- Implied odds computation

### Agent Decisions
- Prediction decisions
- Stake amounts
- Confidence scores
- Reasoning tracking
- Latent collaboration integration

### Performance Tracking
- Agent performance snapshots
- Accuracy metrics
- Confidence calibration
- Financial performance
- Trend analysis

---

## Architecture

### Components

1. **Types** (`types.ts`)
   - Domain type definitions
   - Market metadata
   - Market state
   - Decision types
   - Performance types

2. **Model** (`model.ts`)
   - Pure domain functions
   - Implied odds computation
   - Payout calculation
   - Performance scoring
   - Market creation logic

---

## API Reference

### Domain Functions

#### `computeImpliedOdds(state: PredictionMarketState): { yes: number; no: number }`
Computes implied odds from staking pools.

**Example**:
```typescript
import { computeImpliedOdds } from '@dreamnet/prediction-core';

const odds = computeImpliedOdds(marketState);
console.log(`Yes odds: ${odds.yes}`);
console.log(`No odds: ${odds.no}`);
```

#### `computePayoutsAfterResolution(state: PredictionMarketState, decisions: PredictionDecision[]): Map<string, bigint>`
Computes payouts after market resolution.

**Example**:
```typescript
import { computePayoutsAfterResolution } from '@dreamnet/prediction-core';

const payouts = computePayoutsAfterResolution(resolvedState, decisions);
payouts.forEach((amount, decisionId) => {
  console.log(`Decision ${decisionId}: ${amount}`);
});
```

#### `computePerformanceScore(snapshot: PredictionPerformanceSnapshot): number`
Computes performance score for an agent.

**Example**:
```typescript
import { computePerformanceScore } from '@dreamnet/prediction-core';

const score = computePerformanceScore(agentSnapshot);
console.log(`Performance score: ${score}`);
```

#### `shouldCreateMarketFromSignals(signals: Signal[], threshold?: number): boolean`
Determines if a market should be created from signals.

**Example**:
```typescript
import { shouldCreateMarketFromSignals } from '@dreamnet/prediction-core';

const shouldCreate = shouldCreateMarketFromSignals(signals, 0.7);
if (shouldCreate) {
  console.log('Market should be created');
}
```

---

## Data Models

### PredictionMarketId

```typescript
type PredictionMarketId = string;
```

### PredictionOutcome

```typescript
type PredictionOutcome = 'yes' | 'no' | 'multiple' | 'numeric';
```

### PredictionMarketMeta

```typescript
interface PredictionMarketMeta {
  id: PredictionMarketId;
  title: string;
  description: string;
  creatorAgentId: string;
  createdAt: Date;
  resolutionDeadline: Date;
  outcomeType: PredictionOutcome;
  tags?: string[];
  sourceSignals?: string[];
}
```

### PredictionMarketState

```typescript
interface PredictionMarketState {
  marketId: PredictionMarketId;
  meta: PredictionMarketMeta;
  yesPool: bigint;
  noPool: bigint;
  totalStaked: bigint;
  resolved: boolean;
  resolvedAt?: Date;
  actualOutcome?: PredictionOutcome;
  resolverAgentId?: string;
  impliedOdds?: {
    yes: number;
    no: number;
  };
}
```

### PredictionDecision

```typescript
interface PredictionDecision {
  decisionId: string;
  marketId: PredictionMarketId;
  agentId: string;
  outcome: PredictionOutcome;
  stakeAmount: bigint;
  confidence: number;
  reasoning?: string;
  createdAt: Date;
  latentSessionId?: string;
}
```

### PredictionPerformanceSnapshot

```typescript
interface PredictionPerformanceSnapshot {
  agentId: string;
  snapshotAt: Date;
  totalPredictions: number;
  correctPredictions: number;
  accuracy: number;
  totalStaked: bigint;
  totalWinnings: bigint;
  netProfit: bigint;
  avgConfidence: number;
  confidenceAccuracy: number;
  recentAccuracy: number;
  trend: 'improving' | 'declining' | 'stable';
}
```

---

## Implied Odds Computation

### Formula
- Uses constant product AMM formula
- `yesOdds = yesPool / totalStaked`
- `noOdds = noPool / totalStaked`
- Defaults to 50/50 if no stakes

### Normalization
- Odds clamped to 0-1 range
- Ensures valid probability values

---

## Payout Calculation

### Winner Selection
- Winners: Decisions matching actual outcome
- Winning pool: Pool matching outcome
- Losing pool: Opposite pool

### Payout Formula
- User gets stake back
- Plus proportional share of losing pool
- `payout = stake + (stake * losingPool) / totalWinningStake`

---

## Performance Scoring

### Weighted Components
- **40%**: Accuracy (correctPredictions / totalPredictions)
- **30%**: Confidence calibration (1 - |avgConfidence - accuracy|)
- **30%**: Financial performance (normalized profit ratio)

### Score Range
- 0-1 normalized score
- Higher is better
- Combines multiple factors

---

## Integration Points

### DreamNet Systems
- **Citadel Core**: Market creation signals
- **Neural Mesh**: Latent collaboration integration
- **Economic Engine Core**: Staking and payouts
- **Agent Registry Core**: Agent performance tracking

---

## Usage Examples

### Compute Implied Odds

```typescript
const odds = computeImpliedOdds(marketState);
```

### Compute Payouts

```typescript
const payouts = computePayoutsAfterResolution(state, decisions);
```

### Compute Performance

```typescript
const score = computePerformanceScore(snapshot);
```

---

## Best Practices

1. **Market Management**
   - Use appropriate outcome types
   - Set clear resolution deadlines
   - Track source signals
   - Monitor market state

2. **Performance Tracking**
   - Regular snapshots
   - Track accuracy trends
   - Monitor confidence calibration
   - Analyze financial performance

---

## Security Considerations

1. **Market Security**
   - Validate market state
   - Secure resolution process
   - Prevent manipulation
   - Audit decisions

2. **Payout Security**
   - Verify resolution
   - Validate payouts
   - Secure transfers
   - Track payouts

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

