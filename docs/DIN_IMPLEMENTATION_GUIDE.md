# DIN Nervous System Implementation Guide

**Generated:** 2025-01-27  
**Status:** Implementation Roadmap

---

## Overview

This guide provides step-by-step implementation instructions for integrating DIN concepts into DreamNet. Each component builds on existing DreamNet infrastructure while adding production-grade capabilities.

---

## Phase 1: Nervous System Foundation

### Step 1.1: Enhance Nerve Bus with Topic-Based Routing

**File**: `packages/nervous-system-core/messageBus.ts`

**Implementation**:
```typescript
import { NERVE_BUS, type NerveEvent } from '@dreamnet/nerve/bus';

type Role = 'sensor' | 'orchestrator' | 'worker' | 'system';
type Topic = 'intel.snapshot' | 'task.plan' | 'task.exec' | 'alert' | 'telemetry' | 'state.delta';

interface NervousMessage<T = unknown> {
  id: string;        // ULID
  ts: number;        // epoch ms
  role: Role;
  topic: Topic;
  key?: string;      // routing key (wallet, appId)
  corr?: string;     // correlation id
  ttlMs?: number;    // optional expiry
  priority?: 1|2|3;  // 1=high
  payload: T;
  sig?: string;      // optional signed envelope
}

class NervousMessageBus {
  private topicSubscribers: Map<Topic, Set<(msg: NervousMessage) => void>> = new Map();
  
  publish<T>(message: NervousMessage<T>): void {
    // Convert to NerveEvent for backward compatibility
    const nerveEvent: NerveEvent = {
      id: message.id,
      channelId: `nervous.${message.topic}`,
      kind: message.role,
      priority: message.priority ?? 3,
      context: {
        topic: message.topic,
        key: message.key,
        corr: message.corr,
        ttlMs: message.ttlMs,
      },
      payload: message.payload,
    };
    
    // Publish to Nerve Bus (backward compatible)
    NERVE_BUS.publish(nerveEvent);
    
    // Also notify topic subscribers
    const subscribers = this.topicSubscribers.get(message.topic);
    if (subscribers) {
      subscribers.forEach(sub => sub(message));
    }
  }
  
  subscribe(topic: Topic, handler: (msg: NervousMessage) => void): () => void {
    if (!this.topicSubscribers.has(topic)) {
      this.topicSubscribers.set(topic, new Set());
    }
    this.topicSubscribers.get(topic)!.add(handler);
    
    return () => {
      this.topicSubscribers.get(topic)?.delete(handler);
    };
  }
}

export const nervousMessageBus = new NervousMessageBus();
```

**Integration Points**:
- Uses existing `NERVE_BUS` from `@dreamnet/nerve/bus`
- Maintains backward compatibility with channel-based subscriptions
- Adds topic-based routing layer on top

---

### Step 1.2: Create Shared Memory Layer

**File**: `packages/nervous-system-core/sharedMemory.ts`

**Implementation**:
```typescript
import { NeuralMesh } from '@dreamnet/neural-mesh';

interface SharedMemory {
  kv: {
    get<T>(key: string): Promise<T|null>;
    put<T>(key: string, value: T, ttlSec?: number): Promise<void>;
    del(key: string): Promise<void>;
  };
  doc: {
    read(id: string): Promise<Record<string,any>|null>;
    upsert(id: string, doc: Record<string,any>): Promise<void>;
    query(q: Record<string,any>): Promise<Record<string,any>[]>;
  };
  vec: {
    upsert(id: string, embedding: number[], meta?: Record<string,any>): Promise<void>;
    search(embedding: number[], k: number, filter?: Record<string,any>): Promise<Array<{id:string,score:number,meta:any}>>;
  };
}

class SharedMemoryImpl implements SharedMemory {
  private kvStore: Map<string, { value: any; expiresAt?: number }> = new Map();
  private docStore: Map<string, Record<string,any>> = new Map();
  
  kv = {
    async get<T>(key: string): Promise<T|null> {
      const entry = this.kvStore.get(key);
      if (!entry) return null;
      
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        this.kvStore.delete(key);
        return null;
      }
      
      return entry.value as T;
    },
    
    async put<T>(key: string, value: T, ttlSec?: number): Promise<void> {
      const expiresAt = ttlSec ? Date.now() + ttlSec * 1000 : undefined;
      this.kvStore.set(key, { value, expiresAt });
    },
    
    async del(key: string): Promise<void> {
      this.kvStore.delete(key);
    },
  };
  
  doc = {
    async read(id: string): Promise<Record<string,any>|null> {
      return this.docStore.get(id) ?? null;
    },
    
    async upsert(id: string, doc: Record<string,any>): Promise<void> {
      this.docStore.set(id, doc);
    },
    
    async query(q: Record<string,any>): Promise<Record<string,any>[]> {
      const results: Record<string,any>[] = [];
      for (const [id, doc] of this.docStore.entries()) {
        let matches = true;
        for (const [key, value] of Object.entries(q)) {
          if (doc[key] !== value) {
            matches = false;
            break;
          }
        }
        if (matches) results.push({ id, ...doc });
      }
      return results;
    },
  };
  
  vec = {
    async upsert(id: string, embedding: number[], meta?: Record<string,any>): Promise<void> {
      // Use Neural Mesh's latent memory store
      await NeuralMesh.storeLatent('shared-memory', embedding, JSON.stringify(meta ?? {}), {
        id,
        ...meta,
      });
    },
    
    async search(embedding: number[], k: number, filter?: Record<string,any>): Promise<Array<{id:string,score:number,meta:any}>> {
      // Use Neural Mesh's latent memory retrieval
      const results = await NeuralMesh.retrieveLatent(embedding, k);
      return results.map(r => ({
        id: r.id,
        score: 0.8, // Placeholder - Neural Mesh doesn't return scores yet
        meta: r.metadata,
      }));
    },
  };
}

export const sharedMemory = new SharedMemoryImpl();
```

**Integration Points**:
- KV/Doc layers: New in-memory stores (can be replaced with Redis/Postgres later)
- Vec layer: Uses existing `NeuralMesh.storeLatent` and `NeuralMesh.retrieveLatent`

---

### Step 1.3: Enhance Citadel Core with Message Bus

**File**: `packages/nervous-system-core/citadel.ts`

**Implementation**:
```typescript
import { CitadelCore } from '@dreamnet/citadel-core';
import { nervousMessageBus } from './messageBus';
import { sharedMemory } from './sharedMemory';

export async function runCitadelWithMessageBus(context?: any): Promise<void> {
  // Run existing Citadel cycle
  const result = await CitadelCore.run(context);
  
  // Publish task.plan messages for each agent plan
  for (const agentId of result.agentsRun) {
    const plan = await getAgentPlan(agentId);
    
    nervousMessageBus.publish({
      id: `plan-${Date.now()}-${agentId}`,
      ts: Date.now(),
      role: 'orchestrator',
      topic: 'task.plan',
      payload: {
        agentId,
        plan,
        dependencies: result.dependencies,
      },
    });
    
    // Store plan in shared memory
    await sharedMemory.doc.upsert(`plan:${agentId}`, plan);
  }
  
  // Subscribe to task.exec messages
  nervousMessageBus.subscribe('task.exec', async (msg) => {
    const { agentId, execution } = msg.payload;
    
    // Execute task
    await executeAgentTask(agentId, execution);
    
    // Update shared memory
    await sharedMemory.doc.upsert(`exec:${agentId}`, {
      agentId,
      execution,
      completedAt: Date.now(),
    });
  });
}
```

**Integration Points**:
- Enhances existing `CitadelCore.run()` without replacing it
- Publishes `task.plan` messages when plans are generated
- Subscribes to `task.exec` messages for execution

---

### Step 1.4: Create Drone Dome Agent

**File**: `packages/nervous-system-core/droneDome.ts`

**Implementation**:
```typescript
import { runDroneDomeAnalysis } from '../../server/services/DroneDomeScanner';
import { nervousMessageBus } from './messageBus';
import { sharedMemory } from './sharedMemory';

export async function runDroneDomeWithMessageBus(): Promise<void> {
  // Run existing Drone Dome analysis
  const report = await runDroneDomeAnalysis();
  
  // Publish intel.snapshot message
  nervousMessageBus.publish({
    id: `intel-${Date.now()}`,
    ts: Date.now(),
    role: 'sensor',
    topic: 'intel.snapshot',
    payload: {
      overallHealth: report.overall_health,
      riskZones: report.risk_zones,
      priorityZones: report.priority_zones,
      maps: report.maps,
    },
  });
  
  // Store snapshot in shared memory
  await sharedMemory.doc.upsert('intel:latest', report);
  
  // Subscribe to telemetry messages
  nervousMessageBus.subscribe('telemetry', async (msg) => {
    const { source, metrics } = msg.payload;
    
    // Cache telemetry in shared memory
    await sharedMemory.kv.put(`telemetry:${source}`, metrics, 300); // 5min TTL
  });
}
```

**Integration Points**:
- Enhances existing `runDroneDomeAnalysis()` without replacing it
- Publishes `intel.snapshot` messages with world state
- Subscribes to `telemetry` messages from sensors

---

## Phase 2: Detector Generator System

### Step 2.1: Create Detector Generator Core

**File**: `packages/detector-generator-core/generator.ts`

**Implementation**:
```typescript
import { DreamNetMetricsCore } from '@dreamnet/dreamnet-metrics-core';

interface Detector {
  id: string;
  surface: string; // 'latency', 'error_rate', 'queue_depth', etc.
  metric: string;
  threshold: number;
  windowSize: number;
  score?: number;
}

const EPS = 0.85; // Precision threshold to avoid overfitting

export function generateDetectors(surface: string, historicalData: any[]): Detector[] {
  const detectors: Detector[] = [];
  
  // Generate latency detectors (p95, p99)
  if (surface === 'latency') {
    const p95 = computePercentile(historicalData, 0.95);
    const p99 = computePercentile(historicalData, 0.99);
    
    detectors.push({
      id: `latency-p95-${Date.now()}`,
      surface: 'latency',
      metric: 'p95',
      threshold: p95 * 1.5, // 1.5x baseline
      windowSize: 60, // 60 seconds
    });
    
    detectors.push({
      id: `latency-p99-${Date.now()}`,
      surface: 'latency',
      metric: 'p99',
      threshold: p99 * 1.5,
      windowSize: 60,
    });
  }
  
  // Generate error rate detectors
  if (surface === 'error_rate') {
    const avgErrorRate = computeAverageErrorRate(historicalData);
    
    detectors.push({
      id: `error-rate-${Date.now()}`,
      surface: 'error_rate',
      metric: 'error_percentage',
      threshold: avgErrorRate * 2, // 2x baseline
      windowSize: 60,
    });
  }
  
  // Score detectors (eps=0.85)
  return detectors.map(d => ({
    ...d,
    score: scoreDetector(d, historicalData),
  })).filter(d => d.score && d.score >= EPS);
}

function scoreDetector(detector: Detector, historicalData: any[]): number {
  // Compute precision (eps=0.85 threshold)
  const truePositives = countTruePositives(detector, historicalData);
  const falsePositives = countFalsePositives(detector, historicalData);
  const precision = truePositives / (truePositives + falsePositives);
  return precision >= EPS ? precision : 0;
}
```

**Integration Points**:
- Uses `DreamNetMetricsCore` for metrics collection
- Generates M≈1-5k detectors per surface
- Scores detectors with eps=0.85 threshold

---

## Phase 3: Resilience Early-Warning System

### Step 3.1: Create Resilience Signal Calculator

**File**: `packages/resilience-early-warning/signalCalculator.ts`

**Implementation**:
```typescript
import { DreamNetMetricsCore } from '@dreamnet/dreamnet-metrics-core';

export function computeVarianceAndAC1(metrics: number[], windowSize: number): {
  variance: number;
  ac1: number;
} {
  const window = metrics.slice(-windowSize);
  const mean = window.reduce((a, b) => a + b, 0) / window.length;
  
  // Compute variance (σ²)
  const variance = window.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / window.length;
  
  // Compute AC1 (lag-1 autocorrelation)
  let ac1 = 0;
  for (let i = 1; i < window.length; i++) {
    ac1 += (window[i] - mean) * (window[i-1] - mean);
  }
  ac1 /= (window.length - 1) * variance;
  
  return { variance, ac1 };
}

export function computeResilienceIndex(variance: number, ac1: number, baseline: { variance: number; ac1: number }): number {
  // Normalize variance and AC1 against baseline
  const varianceRatio = variance / baseline.variance;
  const ac1Ratio = ac1 / baseline.ac1;
  
  // Higher variance + AC1 = lower resilience
  const resilience = 100 - (varianceRatio * 30 + ac1Ratio * 20);
  
  return Math.max(0, Math.min(100, resilience));
}
```

**Integration Points**:
- Uses `DreamNetMetricsCore` for metrics collection
- Computes variance and AC1 over rolling windows
- Calculates Resilience Index (0-100)

---

### Step 3.2: Create Guardrails

**File**: `packages/resilience-early-warning/guardrails.ts`

**Implementation**:
```typescript
import { DreamNetControlCore } from '@dreamnet/dreamnet-control-core';
import { DreamNetAutoscaleCore } from '@dreamnet/dreamnet-autoscale-core';
import { nervousMessageBus } from '@dreamnet/nervous-system-core/messageBus';

export async function triggerGuardrails(resilienceIndex: number, serviceId: string): Promise<void> {
  if (resilienceIndex < 50) {
    // Autoscale trigger
    await DreamNetAutoscaleCore.scaleUp(serviceId, { factor: 1.5 });
    
    nervousMessageBus.publish({
      id: `guardrail-autoscale-${Date.now()}`,
      ts: Date.now(),
      role: 'system',
      topic: 'alert',
      payload: {
        type: 'autoscale',
        serviceId,
        resilienceIndex,
      },
    });
  }
  
  if (resilienceIndex < 30) {
    // Rate-limit trigger
    await DreamNetControlCore.setRateLimit({
      clusterId: serviceId,
      maxRequestsPerMinute: 100, // Reduce to 100/min
    });
    
    nervousMessageBus.publish({
      id: `guardrail-rate-limit-${Date.now()}`,
      ts: Date.now(),
      role: 'system',
      topic: 'alert',
      payload: {
        type: 'rate_limit',
        serviceId,
        resilienceIndex,
      },
    });
  }
  
  if (resilienceIndex < 20) {
    // Brownout trigger (disable non-critical features)
    await DreamNetControlCore.enableGlobalKillSwitch('Brownout mode - resilience critical');
    
    nervousMessageBus.publish({
      id: `guardrail-brownout-${Date.now()}`,
      ts: Date.now(),
      role: 'system',
      topic: 'alert',
      payload: {
        type: 'brownout',
        serviceId,
        resilienceIndex,
      },
    });
  }
}
```

**Integration Points**:
- Uses `DreamNetControlCore` for rate limiting and kill-switches
- Uses `DreamNetAutoscaleCore` for autoscaling
- Publishes alerts to Nervous Message Bus

---

## Phase 4: DIN Infrastructure Security

### Step 4.1: Create Staking Mechanism

**File**: `packages/din-infrastructure-core/staking.ts`

**Implementation**:
```typescript
import { ethers } from 'ethers';

interface NodeOperator {
  id: string;
  walletAddress: string;
  stakedAmount: bigint; // in wei
  performanceScore: number; // 0-100
  violations: Violation[];
}

interface Violation {
  type: 'downtime' | 'bad_data' | 'misbehavior';
  timestamp: number;
  durationMinutes?: number;
}

export class DINStaking {
  private operators: Map<string, NodeOperator> = new Map();
  
  async stake(operatorId: string, amount: bigint): Promise<void> {
    const operator = this.operators.get(operatorId);
    if (!operator) {
      throw new Error(`Operator ${operatorId} not found`);
    }
    
    // In production, this would interact with EigenLayer-style contract
    // For now, just update in-memory state
    operator.stakedAmount += amount;
    
    // Emit event
    console.log(`[DIN] Operator ${operatorId} staked ${ethers.formatEther(amount)} ETH`);
  }
  
  async slash(operatorId: string, violations: Violation[]): Promise<bigint> {
    const operator = this.operators.get(operatorId);
    if (!operator) return 0n;
    
    let slashAmount = 0n;
    
    for (const violation of violations) {
      switch (violation.type) {
        case 'downtime':
          slashAmount += BigInt(violation.durationMinutes ?? 0) * (operator.stakedAmount / 100n); // 1% per minute
          break;
        case 'bad_data':
          slashAmount += operator.stakedAmount / 20n; // 5%
          break;
        case 'misbehavior':
          slashAmount += operator.stakedAmount / 10n; // 10%
          break;
      }
    }
    
    // Max 50% slash
    const maxSlash = operator.stakedAmount / 2n;
    slashAmount = slashAmount > maxSlash ? maxSlash : slashAmount;
    
    operator.stakedAmount -= slashAmount;
    operator.violations.push(...violations);
    
    return slashAmount;
  }
}
```

**Integration Points**:
- Uses `ethers` for blockchain interactions
- Integrates with `packages/agent-wallet-manager` for wallet management
- Integrates with `packages/star-bridge-lungs` for RPC routing performance

---

## Phase 5: Registry Proofs System

### Step 5.1: Deploy DreamRegistry Contract

**File**: `packages/registry-proofs-core/contracts/DreamRegistry.sol`

**Implementation**:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DreamRegistry {
  mapping(address => uint256) public registryFlags;
  mapping(address => address) public attesters; // who attested this account
  
  // Registry bits (uint256 bitmap):
  uint8 constant KYC = 0;
  uint8 constant KYB = 1;
  uint8 constant ACCREDITED = 2;
  uint8 constant REGION_US = 3;
  uint8 constant REGION_EU = 4;
  uint8 constant SANCTIONS_CLEAR = 5;
  uint8 constant PROFESSIONAL_INVESTOR = 6;
  uint8 constant NODE_OPERATOR = 7;
  
  modifier onlyAttester() {
    require(attesters[msg.sender] != address(0), "Not an attester");
    _;
  }
  
  function setFlag(address account, uint8 flagBit, bool value) external onlyAttester {
    if (value) {
      registryFlags[account] |= (1 << flagBit);
    } else {
      registryFlags[account] &= ~(1 << flagBit);
    }
    
    attesters[account] = msg.sender;
  }
  
  function hasFlag(address account, uint8 flagBit) external view returns (bool) {
    return (registryFlags[account] & (1 << flagBit)) != 0;
  }
  
  function getFlags(address account) external view returns (uint256) {
    return registryFlags[account];
  }
}
```

**Integration Points**:
- Deploys to Base mainnet (or testnet for testing)
- Integrates with `packages/identity-grid` for identity management
- Integrates with `packages/dream-state-core` for passport system

---

## Phase 6: Intent-Based Routing

### Step 6.1: Create Intent Router

**File**: `packages/intent-router-core/intentProcessor.ts`

**Implementation**:
```typescript
import { StarBridgeLungs } from '@dreamnet/star-bridge-lungs';
import { SlimeMoldRouter } from '@dreamnet/slime-mold-router';

interface Intent {
  id: string;
  type: 'swap' | 'bridge' | 'multi-step';
  user: string;
  constraints: {
    maxSlippage?: number;
    deadline?: number;
    preferredChains?: string[];
  };
  steps: IntentStep[];
}

export async function processIntent(intent: Intent): Promise<IntentExecution> {
  // Find matching solvers
  const solvers = findMatchingSolvers(intent);
  
  // Optimize execution path using Slime-Mold Router
  const executionPath = await SlimeMoldRouter.findOptimalPath(intent, solvers);
  
  // Execute with MEV protection
  return executeWithMEVProtection(executionPath);
}
```

**Integration Points**:
- Uses `StarBridgeLungs` for cross-chain routing
- Uses `SlimeMoldRouter` for network topology optimization
- Integrates with `packages/base-mini-apps` for mini-app intent handling

---

## Testing Strategy

### Unit Tests
- Test detector generator with synthetic metrics
- Test resilience calculator with known variance/AC1 values
- Test guardrails with mock control/autoscale systems

### Integration Tests
- Test Nervous Message Bus with real Nerve Bus
- Test Shared Memory with Neural Mesh
- Test Citadel/Drone Dome message flow

### End-to-End Tests
- Test full cycle: Event → Spider Web → Nerve Bus → Nervous Message Bus → Citadel → Drone Dome
- Test resilience early-warning with real metrics
- Test guardrails with real control systems

---

## Deployment Checklist

- [ ] Deploy Nervous System Core package
- [ ] Deploy Detector Generator Core package
- [ ] Deploy Resilience Early-Warning package
- [ ] Deploy DIN Infrastructure Core package
- [ ] Deploy Registry Proofs Core package (including contract)
- [ ] Deploy Intent Router Core package
- [ ] Deploy Chain Abstraction Core package
- [ ] Deploy Startup Sequence Core package
- [ ] Deploy Incident Runbook Core package
- [ ] Deploy Vertex Agent Integration package
- [ ] Deploy LangGraph Orchestration package
- [ ] Update server/index.ts with startup sequence
- [ ] Update orchestrator-core with resilience early-warning cycle
- [ ] Configure feature flags in config/feature-flags.yaml
- [ ] Set up health checks in config/HEALTHCHECKS.md
- [ ] Create runbook in config/RUNBOOK.md

---

## Next Steps

1. **Start with Phase 1** (Nervous System Foundation)
   - Enhance Nerve Bus
   - Create Shared Memory
   - Enhance Citadel/Drone Dome

2. **Then Phase 2** (Detector Generator)
   - Generate detectors
   - Score detectors
   - Wire to metrics pipeline

3. **Then Phase 3** (Resilience Early-Warning)
   - Compute variance/AC1
   - Calculate Resilience Index
   - Hook guardrails

4. **Continue with remaining phases** as documented

---

## Notes

- All implementations integrate with existing DreamNet systems
- Backward compatibility maintained throughout
- In-memory stores can be replaced with Redis/Postgres later
- Contract deployments should be tested on testnet first
- Feature flags allow gradual rollout

