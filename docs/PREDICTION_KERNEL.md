# Prediction Kernel - Implementation Plan

## Overview

The Prediction Kernel is a new layer in DreamNet that enables agents to make predictions, stake DREAM tokens on outcomes, learn from results, and coordinate through latent collaboration. It integrates with existing systems (Latent Collaboration, Neural Mesh, Agent Wallets) and eventually connects to Base mainnet smart contracts.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Prediction Kernel                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Domain Model │  │ Latent Int.  │  │ Agent API    │    │
│  │ (Pure TS)    │→ │ (Phase 2)    │→ │ (Phase 3)    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│         │                  │                  │            │
│         └──────────────────┴──────────────────┘            │
│                            │                                │
│                   ┌────────▼────────┐                       │
│                   │ Orchestrator    │                       │
│                   │ Hooks (Phase 4) │                       │
│                   └────────┬────────┘                       │
│                            │                                │
│                   ┌────────▼────────┐                       │
│                   │ Onchain Adapter │                       │
│                   │ (Phase 5 - Stub)│                       │
│                   └─────────────────┘                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Phase 0: Repo Scan and Spec Anchor

### Files to Create
- `docs/PREDICTION_KERNEL.md` (this file)
- `packages/prediction-core/` (new package directory)

### Files to Reference
- `packages/latent-collaboration/` - For Phase 2 integration
- `packages/neural-mesh/` - For storing prediction patterns
- `packages/agent-wallet-manager/` - For agent staking
- `packages/orchestrator-core/logic/runCycle.ts` - For Phase 4 hooks
- `server/citadel/runCitadelOnce.ts` - For CitadelState interface
- `shared/schema.ts` - For database schema additions
- `packages/runtime-bridge-core/types.ts` - For RuntimeContext extension

### Checklist
- [x] Create spec document
- [x] Identify integration points
- [ ] Complete Phase 1
- [ ] Complete Phase 2
- [ ] Complete Phase 3
- [ ] Complete Phase 4
- [ ] Complete Phase 5

---

## Phase 1: Core Prediction Model (TypeScript Domain Layer)

**Location**: `packages/prediction-core/`

### 1.1 Create Package Structure

```
packages/prediction-core/
├── src/
│   ├── types.ts           # Core domain types
│   ├── model.ts            # Pure domain functions
│   ├── index.ts             # Exports
│   └── agentBridge.ts       # Phase 3 - Agent API
├── package.json
└── tsconfig.json
```

### 1.2 Define Core Types (`types.ts`)

```typescript
/**
 * Unique identifier for a prediction market
 */
export type PredictionMarketId = string;

/**
 * Possible outcomes for a prediction
 */
export type PredictionOutcome = 'yes' | 'no' | 'multiple' | 'numeric';

/**
 * Market metadata (off-chain)
 */
export interface PredictionMarketMeta {
  id: PredictionMarketId;
  title: string;
  description: string;
  creatorAgentId: string;
  createdAt: Date;
  resolutionDeadline: Date;
  outcomeType: PredictionOutcome;
  tags?: string[];
  sourceSignals?: string[]; // What signals led to this market
}

/**
 * Market state (on-chain + off-chain)
 */
export interface PredictionMarketState {
  marketId: PredictionMarketId;
  meta: PredictionMarketMeta;
  
  // Staking pools
  yesPool: bigint;      // Total staked on "yes"
  noPool: bigint;       // Total staked on "no"
  totalStaked: bigint;
  
  // Resolution
  resolved: boolean;
  resolvedAt?: Date;
  actualOutcome?: PredictionOutcome;
  resolverAgentId?: string;
  
  // Performance tracking
  impliedOdds?: {
    yes: number;  // 0-1 probability
    no: number;   // 0-1 probability
  };
}

/**
 * Agent's decision/prediction
 */
export interface PredictionDecision {
  decisionId: string;
  marketId: PredictionMarketId;
  agentId: string;
  outcome: PredictionOutcome;
  stakeAmount: bigint;  // Amount staked
  confidence: number;    // 0-1 confidence score
  reasoning?: string;    // Why agent made this decision
  createdAt: Date;
  latentSessionId?: string; // Link to latent collaboration
}

/**
 * Performance snapshot for an agent
 */
export interface PredictionPerformanceSnapshot {
  agentId: string;
  snapshotAt: Date;
  
  // Metrics
  totalPredictions: number;
  correctPredictions: number;
  accuracy: number;  // correctPredictions / totalPredictions
  
  // Financial
  totalStaked: bigint;
  totalWinnings: bigint;
  netProfit: bigint;  // winnings - staked
  
  // Confidence calibration
  avgConfidence: number;
  confidenceAccuracy: number; // How well confidence matches actual accuracy
  
  // Recent performance
  recentAccuracy: number;  // Last 10 predictions
  trend: 'improving' | 'declining' | 'stable';
}
```

### 1.3 Implement Domain Functions (`model.ts`)

```typescript
import type {
  PredictionMarketState,
  PredictionDecision,
  PredictionPerformanceSnapshot,
} from './types';

/**
 * Compute implied odds from staking pools
 * Uses constant product AMM formula: odds = pool / totalPool
 */
export function computeImpliedOdds(
  state: PredictionMarketState
): { yes: number; no: number } {
  if (state.totalStaked === 0n) {
    return { yes: 0.5, no: 0.5 }; // Default to 50/50 if no stakes
  }
  
  const yesOdds = Number(state.yesPool) / Number(state.totalStaked);
  const noOdds = Number(state.noPool) / Number(state.totalStaked);
  
  return {
    yes: Math.max(0, Math.min(1, yesOdds)),
    no: Math.max(0, Math.min(1, noOdds)),
  };
}

/**
 * Compute payouts after market resolution
 * Winners get their stake back + proportional share of losing pool
 */
export function computePayoutsAfterResolution(
  state: PredictionMarketState,
  decisions: PredictionDecision[]
): Map<string, bigint> {
  const payouts = new Map<string, bigint>();
  
  if (!state.resolved || !state.actualOutcome) {
    return payouts; // No payouts if not resolved
  }
  
  const winningDecisions = decisions.filter(
    d => d.marketId === state.marketId && d.outcome === state.actualOutcome
  );
  
  if (winningDecisions.length === 0) {
    return payouts; // No winners
  }
  
  const winningPool = state.actualOutcome === 'yes' ? state.yesPool : state.noPool;
  const losingPool = state.actualOutcome === 'yes' ? state.noPool : state.yesPool;
  
  // Total stake from winners
  const totalWinningStake = winningDecisions.reduce(
    (sum, d) => sum + d.stakeAmount,
    0n
  );
  
  // Calculate payouts
  for (const decision of winningDecisions) {
    // User gets stake back + proportional share of losing pool
    const share = (decision.stakeAmount * losingPool) / totalWinningStake;
    const payout = decision.stakeAmount + share;
    payouts.set(decision.decisionId, payout);
  }
  
  return payouts;
}

/**
 * Compute performance score for an agent
 * Combines accuracy, confidence calibration, and financial performance
 */
export function computePerformanceScore(
  snapshot: PredictionPerformanceSnapshot
): number {
  // Weighted combination:
  // - 40% accuracy
  // - 30% confidence calibration
  // - 30% financial performance (normalized)
  
  const accuracyScore = snapshot.accuracy;
  
  // Confidence calibration: how well confidence matches accuracy
  const confidenceDiff = Math.abs(snapshot.avgConfidence - snapshot.accuracy);
  const calibrationScore = 1 - confidenceDiff;
  
  // Financial performance (normalize to 0-1, assume max profit = 10x staked)
  const profitRatio = snapshot.totalStaked > 0n
    ? Number(snapshot.netProfit) / Number(snapshot.totalStaked)
    : 0;
  const financialScore = Math.max(0, Math.min(1, (profitRatio + 1) / 11)); // Normalize -1 to 10
  
  const score = (
    accuracyScore * 0.4 +
    calibrationScore * 0.3 +
    financialScore * 0.3
  );
  
  return Math.max(0, Math.min(1, score));
}

/**
 * Determine if a market should be created from signals
 * Simple heuristic: if multiple agents have similar signals, create market
 */
export function shouldCreateMarketFromSignals(
  signals: Array<{ agentId: string; signal: string; strength: number }>,
  threshold: number = 0.7
): boolean {
  if (signals.length < 2) return false;
  
  // Group signals by similarity (simplified)
  const signalGroups = new Map<string, number>();
  for (const s of signals) {
    const key = s.signal.toLowerCase().trim();
    signalGroups.set(key, (signalGroups.get(key) || 0) + s.strength);
  }
  
  // Check if any signal group exceeds threshold
  const maxStrength = Math.max(...Array.from(signalGroups.values()));
  return maxStrength >= threshold;
}
```

### 1.4 Package Configuration

**`package.json`**:
```json
{
  "name": "@dreamnet/prediction-core",
  "version": "1.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "dependencies": {}
}
```

**`tsconfig.json`**:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

---

## Phase 2: Integration with LatentCollaboration + Neural Mesh

### 2.1 Extend Latent Collaboration (`packages/latent-collaboration/src/predictionLatent.ts`)

```typescript
import { encodeToLatent } from './latentSpace';
import { logLatentSession } from './logging';
import type { PredictionDecision } from '@dreamnet/prediction-core';

/**
 * Encode a prediction decision to latent representation
 */
export async function encodePredictionDecisionToLatent(
  decision: PredictionDecision,
  marketMeta: { title: string; description: string }
): Promise<number[]> {
  const thought = `Agent ${decision.agentId} predicts "${decision.outcome}" on market "${marketMeta.title}" with confidence ${decision.confidence}. Reasoning: ${decision.reasoning || 'N/A'}`;
  
  const latentRep = await encodeToLatent(thought, decision.agentId, {
    task: 'prediction_market',
    context: {
      marketId: decision.marketId,
      outcome: decision.outcome,
      confidence: decision.confidence,
    },
    onchainContext: {
      chain: 'base',
      tokenAddress: '0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77', // DREAM token
    },
  });
  
  return latentRep.latentVector;
}

/**
 * Log prediction decision as latent session
 */
export async function logPredictionLatentSession(
  decision: PredictionDecision,
  marketMeta: { title: string; description: string }
): Promise<void> {
  const latentRep = await encodePredictionDecisionToLatent(decision, marketMeta);
  
  await logLatentSession({
    source: decision.agentId,
    task: 'prediction_market',
    inputPrompt: `Predict "${decision.outcome}" on "${marketMeta.title}"`,
    latentRep,
    decodedOutput: decision.reasoning || 'N/A',
    relatedAgents: [decision.agentId],
    onchainContext: {
      chain: 'base',
      tokenAddress: '0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77',
    },
    metadata: {
      marketId: decision.marketId,
      decisionId: decision.decisionId,
      outcome: decision.outcome,
      confidence: decision.confidence,
      stakeAmount: decision.stakeAmount.toString(),
    },
  });
}
```

### 2.2 Update LatentCollaborationCore (`packages/latent-collaboration-core/index.ts`)

Add method to record prediction decisions:

```typescript
import { logPredictionLatentSession } from '../latent-collaboration/src/predictionLatent';
import type { PredictionDecision } from '@dreamnet/prediction-core';

export class LatentCollaborationCore {
  // ... existing methods ...
  
  /**
   * Record a prediction decision in latent space
   */
  async recordPredictionDecision(
    decision: PredictionDecision,
    marketMeta: { title: string; description: string }
  ): Promise<void> {
    try {
      await logPredictionLatentSession(decision, marketMeta);
    } catch (error) {
      console.warn('[LatentCollaboration] Failed to log prediction decision:', error);
    }
  }
}
```

### 2.3 Update DreamScope UI (`client/src/components/latent-sessions-panel.tsx`)

Add filtering and badges for prediction markets:

```typescript
// In the component, add filtering:
{sessions
  .filter(s => s.task === 'prediction_market')
  .map(session => (
    <div key={session.id} className="border rounded p-4">
      {/* ... existing code ... */}
      {session.metadata?.marketId && (
        <Badge variant="secondary" className="bg-purple-600/30 text-purple-300">
          Market: {session.metadata.marketId.slice(0, 8)}...
        </Badge>
      )}
      {session.metadata?.outcome && (
        <Badge variant="outline">
          {session.metadata.outcome}
        </Badge>
      )}
    </div>
  ))}
```

---

## Phase 3: Agent-Facing Prediction Kernel API

### 3.1 Create Agent Bridge (`packages/prediction-core/src/agentBridge.ts`)

```typescript
import type {
  PredictionMarketId,
  PredictionMarketMeta,
  PredictionDecision,
  PredictionPerformanceSnapshot,
} from './types';
import { computeImpliedOdds, computePerformanceScore } from './model';

/**
 * Agent-facing API for Prediction Kernel
 */
export class PredictionKernelAgentAPI {
  private markets: Map<PredictionMarketId, any> = new Map();
  private decisions: PredictionDecision[] = [];
  private performanceSnapshots: Map<string, PredictionPerformanceSnapshot> = new Map();
  
  /**
   * Propose a new market from agent signals
   */
  async proposeMarketFromSignals(
    agentId: string,
    signals: Array<{ signal: string; strength: number }>,
    title: string,
    description: string,
    resolutionDeadline: Date
  ): Promise<PredictionMarketId | null> {
    // Check if signals warrant a market
    const signalArray = signals.map(s => ({ agentId, ...s }));
    const shouldCreate = shouldCreateMarketFromSignals(signalArray);
    
    if (!shouldCreate) {
      return null;
    }
    
    // Create market
    const marketId = `market-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const market: PredictionMarketMeta = {
      id: marketId,
      title,
      description,
      creatorAgentId: agentId,
      createdAt: new Date(),
      resolutionDeadline,
      outcomeType: 'yes',
      sourceSignals: signals.map(s => s.signal),
    };
    
    this.markets.set(marketId, market);
    return marketId;
  }
  
  /**
   * Record an agent's prediction decision
   */
  async recordDecision(decision: PredictionDecision): Promise<void> {
    this.decisions.push(decision);
    
    // Update market state
    const market = this.markets.get(decision.marketId);
    if (market) {
      // Update staking pools (simplified - in real implementation, this would be onchain)
      // For now, just track decisions
    }
    
    // Update performance snapshot
    await this.updatePerformanceSnapshot(decision.agentId);
  }
  
  /**
   * Update performance snapshot for an agent
   */
  async updatePerformanceSnapshot(agentId: string): Promise<void> {
    const agentDecisions = this.decisions.filter(d => d.agentId === agentId);
    const resolvedDecisions = agentDecisions.filter(d => {
      const market = this.markets.get(d.marketId);
      return market && (market as any).resolved;
    });
    
    const correctDecisions = resolvedDecisions.filter(d => {
      const market = this.markets.get(d.marketId);
      return market && (market as any).actualOutcome === d.outcome;
    });
    
    const snapshot: PredictionPerformanceSnapshot = {
      agentId,
      snapshotAt: new Date(),
      totalPredictions: agentDecisions.length,
      correctPredictions: correctDecisions.length,
      accuracy: agentDecisions.length > 0
        ? correctDecisions.length / agentDecisions.length
        : 0,
      totalStaked: agentDecisions.reduce((sum, d) => sum + d.stakeAmount, 0n),
      totalWinnings: 0n, // TODO: Calculate from resolved markets
      netProfit: 0n, // TODO: Calculate
      avgConfidence: agentDecisions.length > 0
        ? agentDecisions.reduce((sum, d) => sum + d.confidence, 0) / agentDecisions.length
        : 0,
      confidenceAccuracy: 0, // TODO: Calculate
      recentAccuracy: correctDecisions.slice(-10).length / Math.min(10, resolvedDecisions.length),
      trend: 'stable', // TODO: Calculate trend
    };
    
    this.performanceSnapshots.set(agentId, snapshot);
  }
  
  /**
   * Get agent's performance snapshot
   */
  getPerformanceSnapshot(agentId: string): PredictionPerformanceSnapshot | null {
    return this.performanceSnapshots.get(agentId) || null;
  }
  
  /**
   * Get all active markets
   */
  getActiveMarkets(): PredictionMarketMeta[] {
    const now = new Date();
    return Array.from(this.markets.values()).filter(
      m => m.resolutionDeadline > now && !(m as any).resolved
    );
  }
}

// Singleton instance
let predictionKernelAPI: PredictionKernelAgentAPI | null = null;

export function getPredictionKernelAgentAPI(): PredictionKernelAgentAPI {
  if (!predictionKernelAPI) {
    predictionKernelAPI = new PredictionKernelAgentAPI();
  }
  return predictionKernelAPI;
}
```

### 3.2 Wire into RuntimeBridgeCore (`packages/runtime-bridge-core/types.ts`)

Add to `RuntimeContext`:

```typescript
export interface RuntimeContext {
  // ... existing fields ...
  PredictionKernel?: {
    proposeMarketFromSignals: (agentId: string, signals: any[], title: string, description: string, deadline: Date) => Promise<string | null>;
    recordDecision: (decision: any) => Promise<void>;
    getPerformanceSnapshot: (agentId: string) => any;
  };
}
```

---

## Phase 4: Orchestrator Hooks (NO ONCHAIN YET)

### 4.1 Add Orchestrator Hook (`packages/orchestrator-core/logic/runCycle.ts`)

Add after Latent Collaboration step:

```typescript
// 0.6) Prediction Kernel - Agents propose markets and record decisions
if (process.env.USE_PREDICTION_KERNEL === 'true' && ctx.PredictionKernel) {
  try {
    // Extract signals from Citadel snapshot
    const signals: Array<{ agentId: string; signal: string; strength: number }> = [];
    
    if (citadelState?.snapshot) {
      signals.push({
        agentId: 'Citadel',
        signal: JSON.stringify(citadelState.snapshot),
        strength: 0.8,
      });
    }
    
    // Propose market from signals (if threshold met)
    if (signals.length > 0) {
      const marketId = await ctx.PredictionKernel.proposeMarketFromSignals(
        'Citadel',
        signals,
        `Market from Citadel signals ${Date.now()}`,
        'Generated from Citadel strategic planning',
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      );
      
      if (marketId) {
        console.log(`[PredictionKernel] Proposed market: ${marketId}`);
      }
    }
    
    // Record dummy decisions for testing
    // In real implementation, agents would make decisions based on their reasoning
    if (ctx.agents && ctx.agents.length > 0) {
      const activeMarkets = ctx.PredictionKernel.getActiveMarkets?.() || [];
      if (activeMarkets.length > 0) {
        const market = activeMarkets[0];
        // Dummy decision for first agent
        await ctx.PredictionKernel.recordDecision({
          decisionId: `decision-${Date.now()}`,
          marketId: market.id,
          agentId: ctx.agents[0].id || 'agent-1',
          outcome: 'yes',
          stakeAmount: 1000n, // Dummy stake
          confidence: 0.7,
          reasoning: 'Test decision',
          createdAt: new Date(),
        });
      }
    }
  } catch (error) {
    console.warn('[PredictionKernel] Orchestrator hook error:', error);
  }
}
```

### 4.2 Add API Route (`server/routes/prediction.ts`)

```typescript
import { Router } from 'express';
import { getPredictionKernelAgentAPI } from '@dreamnet/prediction-core';

const router = Router();
const predictionAPI = getPredictionKernelAgentAPI();

// Get latest decisions
router.get('/latest-decisions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const agentId = req.query.agentId as string;
    
    // In real implementation, fetch from database
    // For now, return empty array
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Get agent performance
router.get('/agent/:agentId/performance', async (req, res) => {
  try {
    const { agentId } = req.params;
    const snapshot = predictionAPI.getPerformanceSnapshot(agentId);
    res.json(snapshot || { error: 'No performance data' });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

export default router;
```

Register in `server/routes/index.ts`:
```typescript
import predictionRouter from './prediction';
app.use('/api/prediction', predictionRouter);
```

### 4.3 Add DreamScope Panel (`client/src/components/prediction-kernel-panel.tsx`)

```typescript
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PredictionKernelPanel() {
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/prediction/latest-decisions?limit=10')
      .then(res => res.json())
      .then(data => {
        setDecisions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch prediction decisions:', err);
        setLoading(false);
      });
  }, []);

  return (
    <Card className="bg-gray-900 border-gray-400/30">
      <CardHeader>
        <CardTitle className="text-purple-300">Prediction Kernel Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : decisions.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No prediction decisions yet. Enable USE_PREDICTION_KERNEL to start.
          </p>
        ) : (
          <div className="space-y-4">
            {decisions.map(decision => (
              <div key={decision.decisionId} className="border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-white">{decision.agentId}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(decision.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-300">
                  <strong>Market:</strong> {decision.marketId}
                </p>
                <p className="text-sm text-gray-300">
                  <strong>Outcome:</strong> {decision.outcome} ({decision.confidence * 100}% confidence)
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

Add to DreamScope UI (`client/src/pages/dreamscope-ui.tsx`):
```typescript
import PredictionKernelPanel from '@/components/prediction-kernel-panel';

// Add to render:
<PredictionKernelPanel />
```

---

## Phase 5: Onchain Wiring Stub (Base Mainnet Aware, Not Deploying Yet)

### 5.1 Create Onchain Adapter Interface (`packages/prediction-core/src/onchainAdapter.ts`)

```typescript
import type { PredictionMarketId, PredictionMarketMeta, PredictionDecision } from './types';

/**
 * Interface for onchain prediction market operations
 */
export interface PredictionOnchainAdapter {
  /**
   * Create a market onchain
   */
  createMarketOnchain(
    meta: PredictionMarketMeta
  ): Promise<{ txHash: string; marketId: PredictionMarketId }>;
  
  /**
   * Resolve a market onchain
   */
  resolveMarketOnchain(
    marketId: PredictionMarketId,
    outcome: string,
    resolverAgentId: string
  ): Promise<{ txHash: string }>;
  
  /**
   * Fetch market state from chain
   */
  fetchMarketStateOnchain(
    marketId: PredictionMarketId
  ): Promise<{
    yesPool: bigint;
    noPool: bigint;
    totalStaked: bigint;
    resolved: boolean;
  }>;
  
  /**
   * Fetch user performance from chain
   */
  fetchUserPerformanceOnchain(
    agentId: string
  ): Promise<{
    totalStaked: bigint;
    totalWinnings: bigint;
    netProfit: bigint;
  }>;
}

/**
 * Null adapter - stub implementation that does nothing
 */
export class NullPredictionOnchainAdapter implements PredictionOnchainAdapter {
  async createMarketOnchain(meta: PredictionMarketMeta): Promise<{ txHash: string; marketId: PredictionMarketId }> {
    console.warn('[PredictionOnchainAdapter] createMarketOnchain called but adapter is null stub');
    return {
      txHash: `0xNULL_${Date.now()}`,
      marketId: meta.id,
    };
  }
  
  async resolveMarketOnchain(marketId: PredictionMarketId, outcome: string, resolverAgentId: string): Promise<{ txHash: string }> {
    console.warn('[PredictionOnchainAdapter] resolveMarketOnchain called but adapter is null stub');
    return { txHash: `0xNULL_${Date.now()}` };
  }
  
  async fetchMarketStateOnchain(marketId: PredictionMarketId): Promise<{
    yesPool: bigint;
    noPool: bigint;
    totalStaked: bigint;
    resolved: boolean;
  }> {
    return {
      yesPool: 0n,
      noPool: 0n,
      totalStaked: 0n,
      resolved: false,
    };
  }
  
  async fetchUserPerformanceOnchain(agentId: string): Promise<{
    totalStaked: bigint;
    totalWinnings: bigint;
    netProfit: bigint;
  }> {
    return {
      totalStaked: 0n,
      totalWinnings: 0n,
      netProfit: 0n,
    };
  }
}
```

### 5.2 Extend Agent API to Accept Adapter

Update `packages/prediction-core/src/agentBridge.ts`:

```typescript
import type { PredictionOnchainAdapter } from './onchainAdapter';
import { NullPredictionOnchainAdapter } from './onchainAdapter';

export class PredictionKernelAgentAPI {
  private onchainAdapter: PredictionOnchainAdapter;
  
  constructor(onchainAdapter?: PredictionOnchainAdapter) {
    this.onchainAdapter = onchainAdapter || new NullPredictionOnchainAdapter();
  }
  
  // ... existing methods ...
  
  /**
   * Set onchain adapter (for future use)
   */
  setOnchainAdapter(adapter: PredictionOnchainAdapter): void {
    this.onchainAdapter = adapter;
  }
}
```

---

## Environment Variables

Add to `.env.example`:

```bash
# Prediction Kernel
USE_PREDICTION_KERNEL=false
PREDICTION_KERNEL_CONTRACT_ADDRESS=  # Future: Base mainnet contract address
```

Add to `server/config/env.ts`:

```typescript
export const USE_PREDICTION_KERNEL = process.env.USE_PREDICTION_KERNEL === 'true';
export const PREDICTION_KERNEL_CONTRACT_ADDRESS = process.env.PREDICTION_KERNEL_CONTRACT_ADDRESS;
```

---

## Implementation Checklist

### Phase 0: Spec Anchor
- [x] Create `docs/PREDICTION_KERNEL.md`
- [x] Identify integration points
- [ ] Document all phases

### Phase 1: Core Domain Model
- [ ] Create `packages/prediction-core/` package
- [ ] Implement `types.ts` with all domain types
- [ ] Implement `model.ts` with pure domain functions
- [ ] Create `package.json` and `tsconfig.json`
- [ ] Export from `index.ts`

### Phase 2: Latent Integration
- [ ] Create `packages/latent-collaboration/src/predictionLatent.ts`
- [ ] Update `LatentCollaborationCore` with `recordPredictionDecision`
- [ ] Update `LatentSessionsPanel` to filter/badge prediction markets

### Phase 3: Agent API
- [ ] Create `packages/prediction-core/src/agentBridge.ts`
- [ ] Implement `PredictionKernelAgentAPI` class
- [ ] Wire into `RuntimeBridgeCore` context

### Phase 4: Orchestrator Hooks
- [ ] Add Prediction Kernel step to `runCycle.ts`
- [ ] Create `server/routes/prediction.ts` API routes
- [ ] Create `PredictionKernelPanel` component
- [ ] Add panel to DreamScope UI

### Phase 5: Onchain Adapter Stub
- [ ] Create `packages/prediction-core/src/onchainAdapter.ts`
- [ ] Implement `PredictionOnchainAdapter` interface
- [ ] Implement `NullPredictionOnchainAdapter` stub
- [ ] Extend `PredictionKernelAgentAPI` to accept adapter

---

## Future Work (Post-Phase 5)

- Deploy prediction market contract to Base mainnet
- Implement real onchain adapter using ethers/viem
- Add database persistence for markets and decisions
- Implement market resolution automation
- Add performance tracking dashboard
- Integrate with ReputationLattice for agent scoring
- Add multi-outcome markets (beyond yes/no)
- Implement market discovery and browsing UI

---

## Notes

- **No onchain writes in Phases 1-4**: All operations are in-memory or database-only
- **Phase 5 is a stub**: Provides interface but doesn't actually interact with chain
- **DREAM token integration**: Uses existing token address `0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77`
- **Latent collaboration**: Prediction decisions are encoded and stored in latent space
- **Agent wallets**: Agents use existing `AgentWalletManager` for staking (future)


