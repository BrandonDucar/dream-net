# DreamNet Core Algorithms - Deep Dive

**Last Updated**: 2025-01-27  
**Status**: ✅ Algorithms Documented

---

## Overview

DreamNet uses sophisticated algorithms for intent synthesis, reputation scoring, field updates, and economic rewards. Understanding these algorithms is key to understanding how DreamNet makes decisions.

---

## Dream Cortex Intent Synthesis

### Algorithm: `synthesizeDirectives()`

**WHAT**: Synthesizes directives (intents) for dreams based on their state

**HOW**:
1. **Build Goal Graph**: Gets all dream nodes from goal graph
2. **Score Each Dream**: `computeDreamScore(node, ctx)`
   - Base score: 0.5
   - Priority adjustments:
     - `low`: -0.1
     - `high`: +0.1
     - `critical`: +0.2
   - Status adjustments:
     - `completed`: -0.3
     - `blocked`/`infected`: +0.2
     - `active`: +0.05
   - Clamp to [0, 1]
3. **Pick Intent**: `pickIntentForDream(node)`
   - `blocked`/`infected` → `unblock`
   - `completed` → `monitor`
   - `idle`/`incubating` → `accelerate`
   - `active` → `stabilize`
   - Default → `monitor`
4. **Filter**: Only emit directives for dreams with score ≥ 0.3
5. **Create Directives**: Each directive includes:
   - `dreamId`: The dream ID
   - `intent`: The action to take
   - `confidence`: The computed score
   - `reason`: Human-readable explanation

**WHY**: 
- Prioritizes dreams that need attention
- Provides actionable directives
- Filters out low-priority dreams

**EXAMPLE**:
```typescript
// Dream: "Build API" (priority: high, status: blocked)
// Score: 0.5 + 0.1 (high) + 0.2 (blocked) = 0.8
// Intent: "unblock"
// Directive: { dreamId: "dream-123", intent: "unblock", confidence: 0.8 }
```

---

## Reputation Scoring Algorithm

### Algorithm: `recomputeReputation()`

**WHAT**: Computes reputation scores for entities from signals

**HOW**:
1. **Group Signals**: Group signals by entity (`entityType:entityId`)
2. **Score Each Entity**: `scoreForEntity(entityType, entityId, signals, config, now)`
   - **Exponential Decay**: `decay = Math.pow(0.5, ageMs / halfLife)`
     - Default half-life: 24 hours
     - Older signals decay exponentially
   - **Weighted Sum**: 
     - `effectiveWeight = signal.weight * decay`
     - `weightedSum += signal.value * effectiveWeight`
     - `weightTotal += effectiveWeight`
   - **Normalize**: 
     - `raw = weightedSum / weightTotal` (in [-1, 1])
     - `normalized = (raw + 1) / 2` (in [0, 1])
   - **Default**: If no signals, return 0.5
3. **Store Scores**: Update ReputationStore with computed scores

**WHY**: 
- Exponential decay = recent signals matter more
- Weighted sum = respects signal importance
- Normalization = consistent [0, 1] range

**EXAMPLE**:
```typescript
// Entity: "service:api-endpoint"
// Signals:
//   - { value: -0.4, weight: 0.6, age: 1h } → decay: 0.97
//   - { value: 0.3, weight: 0.3, age: 12h } → decay: 0.71
// Weighted sum: (-0.4 * 0.6 * 0.97) + (0.3 * 0.3 * 0.71) = -0.15
// Normalized: (-0.15 + 1) / 2 = 0.425
// Score: 0.425 (low trust)
```

---

## Reputation Signal Ingestion

### Algorithm: `ingestExternalSignals()`

**WHAT**: Collects reputation signals from external subsystems

**HOW**:
1. **Wolf Pack Targets**: 
   - Active targets → negative signals (-0.4, weight: 0.6)
   - Reason: "wolf-pack active target"
2. **Slug-Time Memory**: 
   - If snapshotCount > 0 → positive signal (+0.3, weight: 0.3)
   - Reason: "slug-time active and tracking"
3. **Dream Cortex Directives**: 
   - Map intent to value:
     - `accelerate`/`stabilize` → +0.4
     - `unblock` → -0.2
     - `deprecate` → -0.4
     - `monitor` → 0.0
   - Weight = directive confidence
4. **Star Bridge Metrics**: 
   - Chain reliability → reputation signal
   - Map [0, 1] → [-1, 1]: `(reliability * 2) - 1`
5. **Store Signals**: Add all signals to ReputationStore

**WHY**: 
- Aggregates signals from multiple sources
- Maps subsystem outputs to reputation values
- Provides unified reputation system

---

## Field Layer Update Algorithm

### Algorithm: `runFieldCycle()`

**WHAT**: Updates global parameter fields from multiple sources

**HOW**:
1. **Apply Decay**: `applyFieldDecay(now)`
   - Decays all field samples based on half-life
   - Older samples lose value over time
2. **Update from Reputation**: `updateFieldsFromReputation()`
   - Maps reputation scores → trust/risk fields
   - `trust = score`, `risk = 1 - score`
3. **Update from Star Bridge**: `updateFieldsFromStarBridge()`
   - Chain metrics → liquidity/trust/risk fields
   - `liquidity = liquidityPressure`
   - `trust = reliability`, `risk = 1 - reliability`
4. **Update from QAL**: `updateFieldsFromQAL()`
   - Creates generic "load" field (placeholder)
5. **Update from Dream Cortex**: `updateFieldsFromDreamCortex()`
   - Dream priority → `dreamPriority` field
   - Uses same scoring logic as intent synthesis
6. **Update from Wolf Pack & PSL**: `updateFieldsFromWolfPackAndPSL()`
   - Active targets → high risk (0.8)
   - Decay signals → risk fields

**WHY**: 
- Centralizes global parameters
- Samples from multiple sources
- Provides unified field system

---

## Field Sample Smoothing

### Algorithm: `upsertSample()`

**WHAT**: Updates field samples with exponential smoothing

**HOW**:
1. **Get Existing**: Look up existing sample
2. **Smooth**: 
   - `alpha = config.smoothingFactor` (default: 0.5)
   - `finalValue = alpha * newValue + (1 - alpha) * existingValue`
3. **Store**: Update field sample

**WHY**: 
- Prevents rapid oscillations
- Smooths out noise
- Provides stable field values

**EXAMPLE**:
```typescript
// Existing trust: 0.6, New trust: 0.8, Alpha: 0.5
// Final: 0.5 * 0.8 + 0.5 * 0.6 = 0.7
```

---

## Field Decay Algorithm

### Algorithm: `applyFieldDecay()`

**WHAT**: Applies exponential decay to all field samples

**HOW**:
1. **Get Config**: Retrieve decay half-life (default: 1 hour)
2. **For Each Sample**:
   - `ageMs = now - sample.updatedAt`
   - `decayFactor = Math.pow(0.5, ageMs / halfLife)`
   - `decayedValue = sample.value * decayFactor`
   - Update `sample.value = decayedValue`
3. **Result**: All samples decayed based on age

**WHY**: 
- Fields lose value over time without updates
- Recent data matters more
- Prevents stale data from persisting

**EXAMPLE**:
```typescript
// Sample: trust = 0.8, updated 2 hours ago, half-life = 1 hour
// Decay factor: Math.pow(0.5, 2/1) = 0.25
// Decayed value: 0.8 * 0.25 = 0.2
```

---

## Economic Engine Reward Algorithm

### Algorithm: `applyEmissionForReward()`

**WHAT**: Applies emission rules to raw reward events

**HOW**:
1. **Match Rules**: Find emission rules matching `source` and `kind`
2. **For Each Rule**:
   - `amount = rawReward.baseValue * rule.multiplier`
   - If amount ≤ 0, skip
   - Adjust balance: `EconStore.adjustBalance(identityId, token, amount)`
   - Create AppliedReward record
3. **Return Applied Rewards**: List of all applied rewards

**WHY**: 
- Flexible reward system
- Multiple tokens per reward
- Configurable multipliers

**EXAMPLE**:
```typescript
// Raw Reward: { source: "zen-garden", kind: "activity", baseValue: 10 }
// Matching Rule: { token: "SHEEP", multiplier: 2.0 }
// Amount: 10 * 2.0 = 20 SHEEP
// Balance updated: identityId balance += 20 SHEEP
```

---

## Key Algorithm Patterns

### 1. Exponential Decay

**USED IN**: Reputation scoring, field decay

**FORMULA**: `decay = Math.pow(0.5, ageMs / halfLife)`

**WHY**: Recent signals matter more than old ones

---

### 2. Weighted Averaging

**USED IN**: Reputation scoring

**FORMULA**: `score = weightedSum / weightTotal`

**WHY**: Respects signal importance

---

### 3. Exponential Smoothing

**USED IN**: Field updates

**FORMULA**: `value = alpha * new + (1 - alpha) * old`

**WHY**: Prevents rapid oscillations

---

### 4. Score Normalization

**USED IN**: Reputation scoring

**FORMULA**: `normalized = (raw + 1) / 2` (maps [-1, 1] → [0, 1])

**WHY**: Consistent [0, 1] range

---

### 5. Threshold Filtering

**USED IN**: Intent synthesis

**FORMULA**: `if (score < 0.3) return`

**WHY**: Filters out low-priority items

---

## Algorithm Insights

### 1. Time-Based Decay

- **Reputation**: Signals decay over 24h half-life
- **Fields**: Samples decay based on config
- **Why**: Recent data matters more

### 2. Multi-Source Aggregation

- **Reputation**: Aggregates from Wolf Pack, Slug-Time, Dream Cortex, Star Bridge
- **Fields**: Samples from Reputation, Star Bridge, QAL, Dream Cortex, Wolf Pack, PSL
- **Why**: Unified view from multiple sources

### 3. Confidence-Based Weighting

- **Reputation**: Signal weights reflect importance
- **Intent Synthesis**: Confidence = computed score
- **Why**: More confident signals matter more

### 4. Status-Driven Logic

- **Intent Synthesis**: Intent based on dream status
- **Reputation**: Signals based on subsystem status
- **Why**: Actions match current state

---

## Dream Tank Progression Algorithm

### Algorithm: `runProgressionCycle()`

**WHAT**: Progresses dreams through stages based on evaluation scores

**HOW**:
1. **Evaluate Each Dream**: `evaluateDream(ctx, dream, "stage-review")`
   - Score = `0.5 * priority + 0.3 * trust + 0.2 * (1 - risk)`
   - Samples FieldLayer for priority/risk refinement
   - Creates evaluation record
2. **Compute Next Stage**: `computeNextStage(stage, score)`
   - If score < 0.3: stay in current stage
   - Stage progression thresholds:
     - `seed` → `cocoon`: score > 0.5
     - `cocoon` → `prototype`: score > 0.6
     - `prototype` → `beta`: score > 0.7
     - `beta` → `launch-ready`: score > 0.75
     - `launch-ready` → `launched`: score > 0.8
3. **Compute Health**: `computeHealth(current, score)`
   - score < 0.2 → `infected`
   - score < 0.4 → `stalled`
   - score > 0.8 → `stable`
   - Otherwise → keep current
4. **Update Dream**: If stage or health changed, update dream

**WHY**: 
- Progressive advancement through stages
- Health reflects dream quality
- Thresholds prevent premature advancement

**EXAMPLE**:
```typescript
// Dream: "Build API" (priority: 0.7, trust: 0.8, risk: 0.2)
// Score: 0.5 * 0.7 + 0.3 * 0.8 + 0.2 * 0.8 = 0.75
// Current stage: prototype
// Next stage: beta (score 0.75 > 0.7)
// Health: stable (score 0.75 > 0.8? No, keep current)
```

---

## Dream Evaluation Algorithm

### Algorithm: `evaluateDream()`

**WHAT**: Evaluates a dream and computes a score

**HOW**:
1. **Get Base Scores**: priority, trust, risk from dream
2. **Refine from FieldLayer** (if available):
   - Sample `dreamPriority` field
   - Sample `risk` field
   - Update dream scores
3. **Compute Combined Score**:
   - `score = 0.5 * priority + 0.3 * trust + 0.2 * (1 - risk)`
   - Clamp to [0, 1]
4. **Create Evaluation Record**:
   - Includes score, priority, trust, risk
   - Stores metadata (stage, health)

**WHY**: 
- Combines multiple factors
- Refines from global fields
- Provides evaluation history

---

## Zen Garden Reward Algorithm

### Algorithm: `computeRewardsForSession()`

**WHAT**: Computes rewards for a completed zen session

**HOW**:
1. **Calculate Base Score**:
   - `totalMinutes` = sum of activity durations
   - `avgIntensity` = average intensity across activities
   - `baseScore = min(1, totalMinutes/60) * 0.6 + avgIntensity * 0.4`
2. **Add Stress Bonus** (if FieldLayer available):
   - Sample `load` field for `system:global`
   - `stressBonus = load * 0.2`
   - Higher system load = bonus for zen activities
3. **Compute Total Score**:
   - `totalScore = baseScore + stressBonus`
   - Clamp to [0, 1]
4. **Generate Rewards**:
   - **Points**: `Math.round(totalScore * 100)` ZEN_POINTS
   - **Token Hint**: If totalScore > 0.7, suggest 0.1 SHEEP
   - **Badge**: If totalMinutes ≥ 30, award badge
5. **Store Rewards**: Add to GardenStore

**WHY**: 
- Rewards based on time + intensity
- System load bonus encourages zen during stress
- Multiple reward types (points, tokens, badges)

**EXAMPLE**:
```typescript
// Session: 45 minutes, avg intensity 0.8, system load 0.7
// Base: min(1, 45/60) * 0.6 + 0.8 * 0.4 = 0.75 * 0.6 + 0.32 = 0.77
// Stress bonus: 0.7 * 0.2 = 0.14
// Total: 0.77 + 0.14 = 0.91
// Rewards: 91 ZEN_POINTS, 0.1 SHEEP hint, badge
```

---

## Economic Emission Rules

### Default Rules

**WHAT**: Pre-configured emission rules for various reward sources

**HOW**:
- **Zen Garden**:
  - `activity` → ZEN_POINTS (multiplier: 1)
  - `bonus` → SHEEP (multiplier: 0.01)
- **DreamBet**:
  - `participation` → PLAY_TOKENS (multiplier: 5)
  - `win` → SHEEP (multiplier: 0.02)
- **SocialHub**:
  - `contribution` → ZEN_POINTS (multiplier: 0.5)
- **DreamVault**:
  - `contribution` → VAULT_CREDITS (multiplier: 1)
- **DreamTank**:
  - `milestone` → DREAM (multiplier: 0.05)
- **Init Ritual**:
  - `milestone` → ZEN_POINTS (multiplier: 10)

**WHY**: 
- Configurable reward system
- Multiple tokens per source
- Encourages various activities

---

## Wolf Pack Analyst Pattern Learning

### Algorithm

### Algorithm: `runWolfPackAnalystCycle()`

**WHAT**: Learns patterns from lead data and generates insights/predictions

**HOW**:
1. **Train on Lead Scoring**: `trainOnLeadScoring(leads)`
   - Pattern: High dreamFitScore (>0.7) correlates with qualification
   - Confidence = qualified leads with high fit / total qualified
   - Stores learned patterns
2. **Train on Email Effectiveness**: `trainOnEmailEffectiveness(queueItems, leads)`
   - Learns which email patterns lead to replies
   - Stores email effectiveness patterns
3. **Generate Insights**: `generateInsights(leads, queueItems, patterns)`
   - High-value new leads (fit >0.7, priority >0.7, not contacted)
   - Stalled leads (contacted >7 days ago)
   - Email effectiveness insights
4. **Generate Predictions**: `generatePredictions(leads, patterns)`
   - Factors: dreamFitScore >0.7 (+0.15), has email (+0.1), priority >0.8 (+0.1), VC type (+0.1)
   - Probability = sum of factors (clamped to 1.0)
   - Predicts next stage based on probability thresholds:
     - new → qualified: probability >0.6
     - qualified → contacted: probability >0.7
     - contacted → replied: probability >0.75
5. **Analyze Email Effectiveness**: `analyzeEmailEffectiveness(queueItems, leads)`
   - Analyzes which emails lead to replies
   - Tracks effectiveness metrics

**WHY**: 
- Learns from historical data
- Provides actionable insights
- Predicts lead progression

**STATUS**: ⚠️ Pattern learning implemented, but uses simple heuristics

---

## Quantum Anticipation Algorithm

### Algorithm: `runQALCycle()`

**WHAT**: Predicts future events (workload spikes, failures, bottlenecks, PR hotspots)

**HOW**:
1. **Predict Workload Spikes**: `predictWorkloadSpikes(ctx)`
   - ⚠️ **PLACEHOLDER**: Returns placeholder prediction
   - TODO: Pull real metrics from Halo-Loop / Pheromone Store
2. **Predict Failure Risk**: `predictFailureRisk(ctx)`
   - ⚠️ **PLACEHOLDER**: Returns placeholder prediction
   - TODO: Analyze system health trends
3. **Predict Routing Bottlenecks**: `predictRoutingBottlenecks(ctx)`
   - ⚠️ **PLACEHOLDER**: Returns placeholder prediction
   - TODO: Analyze wormhole congestion
4. **Predict PR Hotspots**: `predictPRHotspots(ctx)`
   - ⚠️ **PLACEHOLDER**: Returns placeholder prediction
   - TODO: Analyze GitHub PR activity patterns
5. **Feed Signals**:
   - Logs to Neural Mesh
   - TODO: Pre-lay pheromone trails for workload spikes
   - TODO: Adjust slime-mold router for bottlenecks
   - TODO: Send failure risks to Halo-Loop

**WHY**: 
- Proactive system management
- Pre-emptive resource allocation
- Prevents failures before they happen

**STATUS**: ⚠️ **PLACEHOLDER** - Needs real metrics integration

---

## Squad Alchemy Optimization Algorithm

### Algorithm: `runSquadAlchemyCycle()`

**WHAT**: Optimizes squad composition through merge/split/clone operations

**HOW**:
1. **Sync Squads**: Syncs from Squad-Builder (if available)
2. **Merge Strategy**: `proposeMergeStrategy(squads)`
   - If ≥3 squads: merge two smallest squads
   - Creates merged squad with combined members
   - Preserves lineage (parent IDs, generation)
3. **Split Strategy**: `proposeSplitStrategy(squad)`
   - If squad has ≥4 members: split at midpoint
   - Creates two squads with half members each
   - Preserves lineage
4. **Clone Strategy**: `proposeCloneStrategy(squad)`
   - If specialized squad (repair/deploy/routing): clone it
   - Creates duplicate for high-pressure scenarios
5. **Apply Decisions**: Executes merge/split/clone operations
6. **Log to Neural Mesh**: Stores decisions for learning

**WHY**: 
- Optimizes squad size for efficiency
- Enables parallelization (split)
- Provides redundancy (clone)
- Consolidates resources (merge)

**STATUS**: ✅ **IMPLEMENTED** - Uses simple heuristics

---

## What's Missing

### 1. Machine Learning

**ISSUE**: Algorithms are heuristic-based

**DIRECTION**: Add ML models for:
- Better intent prediction
- Improved reputation scoring
- Smarter field updates
- Better lead scoring
- Improved squad optimization

### 2. Adaptive Parameters

**ISSUE**: Parameters are fixed (half-life, smoothing factor, thresholds)

**DIRECTION**: Make parameters adaptive:
- Learn optimal half-life
- Adjust smoothing based on volatility
- Tune thresholds dynamically

### 3. Cross-Entity Relationships

**ISSUE**: Algorithms treat entities independently

**DIRECTION**: Add relationship modeling:
- Entity graphs
- Influence propagation
- Network effects

### 4. Real Metrics Integration

**ISSUE**: QAL uses placeholder predictions

**DIRECTION**: Integrate real metrics:
- Halo-Loop health data
- Pheromone Store traffic patterns
- Event wormhole throughput
- GitHub API for PR activity

---

## Summary

**Intent Synthesis**: Scores dreams, picks intents, filters low-priority  
**Reputation Scoring**: Exponential decay, weighted averaging, normalization  
**Field Updates**: Multi-source sampling, exponential smoothing, decay  
**Economic Rewards**: Rule matching, multiplier application, balance updates  
**Dream Progression**: Stage advancement with thresholds, health computation  
**Dream Evaluation**: Combined score (priority + trust + risk), FieldLayer refinement  
**Zen Rewards**: Time + intensity scoring, stress bonus, multiple reward types  
**Wolf Pack Analyst**: Pattern learning, insights, predictions (heuristic-based)  
**Quantum Anticipation**: Workload/failure/bottleneck/PR predictions (⚠️ placeholder)  
**Squad Alchemy**: Merge/split/clone optimization (heuristic-based)

**Understanding these algorithms is key to understanding DreamNet's decision-making.**

