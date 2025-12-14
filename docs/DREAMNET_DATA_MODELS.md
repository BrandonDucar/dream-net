# DreamNet Data Models

**Generated**: 2025-01-27  
**Status**: Complete Data Model Documentation

---

## Purpose

This document defines all data models, types, and interfaces used throughout DreamNet systems.

---

## Core Types

### NervousMessage

```typescript
interface NervousMessage<T = unknown> {
  id: string;           // ULID
  ts: number;           // epoch ms
  role: Role;           // sensor | orchestrator | worker | system
  topic: Topic;         // intel.snapshot | task.plan | task.exec | alert | telemetry | state.delta
  key?: string;         // routing key (wallet, appId)
  corr?: string;        // correlation id
  ttlMs?: number;       // optional expiry
  priority?: 1 | 2 | 3; // 1=high
  payload: T;           // message payload
  sig?: string;         // optional signed envelope
}
```

### SharedMemory

```typescript
interface SharedMemory {
  kv: {
    get<T>(key: string): Promise<T | null>;
    put<T>(key: string, value: T, ttlSec?: number): Promise<void>;
    del(key: string): Promise<void>;
  };
  doc: {
    read(id: string): Promise<Record<string, any> | null>;
    upsert(id: string, doc: Record<string, any>): Promise<void>;
    query(q: Record<string, any>): Promise<Record<string, any>[]>;
  };
  vec: {
    upsert(id: string, embedding: number[], meta?: Record<string, any>): Promise<void>;
    search(embedding: number[], k: number, filter?: Record<string, any>): Promise<Array<{id: string, score: number, meta: any}>>;
  };
}
```

---

## Detector Types

### Detector

```typescript
interface Detector {
  id: string;
  surface: DetectorSurface;
  metric: DetectorMetric;
  threshold: number;
  score: number;
  active: boolean;
  createdAt: number;
  updatedAt: number;
}
```

### DetectorSurface

```typescript
interface DetectorSurface {
  name: string;
  type: 'api' | 'database' | 'queue' | 'cache' | 'custom';
  metadata?: Record<string, any>;
}
```

### DetectorMetric

```typescript
interface DetectorMetric {
  name: string;
  type: 'latency' | 'error_rate' | 'queue_depth' | 'memory' | 'throughput';
  aggregation: 'avg' | 'p50' | 'p95' | 'p99' | 'max' | 'min';
}
```

---

## Resilience Types

### ResilienceSignal

```typescript
interface ResilienceSignal {
  metric: string;
  variance: number;      // σ²
  autocorrelation: number; // AC1
  zScore: number;
  timestamp: number;
}
```

### ResilienceAlert

```typescript
interface ResilienceAlert {
  id: string;
  metric: string;
  resilienceIndex: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  triggeredAt: number;
  guardrails: GuardrailTrigger[];
}
```

### GuardrailTrigger

```typescript
interface GuardrailTrigger {
  type: 'autoscale' | 'rate_limit' | 'brownout';
  action: string;
  triggeredAt: number;
}
```

---

## DIN Infrastructure Types

### NodeOperator

```typescript
interface NodeOperator {
  id: string;
  address: string;
  stakedAmount: bigint;
  performance: PerformanceMetric;
  status: 'active' | 'inactive' | 'slashed';
  registeredAt: number;
}
```

### PerformanceMetric

```typescript
interface PerformanceMetric {
  successRate: number;    // > 0.99
  latency: number;        // < 250ms p95
  uptime: number;          // > 0.999
  requestsProcessed: number;
  lastUpdated: number;
}
```

### SlashingEvent

```typescript
interface SlashingEvent {
  id: string;
  operatorId: string;
  reason: 'misbehavior' | 'downtime' | 'performance';
  amount: bigint;
  timestamp: number;
}
```

---

## Intent Types

### Intent

```typescript
type Intent = SwapIntent | BridgeIntent | MultiStepIntent;
```

### SwapIntent

```typescript
interface SwapIntent {
  type: 'swap';
  fromToken: string;
  toToken: string;
  amount: bigint;
  constraints: {
    maxSlippage: number;
    deadline: number;
    preferredChains?: string[];
  };
}
```

### BridgeIntent

```typescript
interface BridgeIntent {
  type: 'bridge';
  token: string;
  amount: bigint;
  fromChain: ChainId;
  toChain: ChainId;
  constraints: {
    maxSlippage: number;
    deadline: number;
    preferredBridge?: string;
  };
}
```

### IntentExecution

```typescript
interface IntentExecution {
  intentId: string;
  solverId: string;
  executionPath: ExecutionStep[];
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  gasUsed?: bigint;
  totalCost?: bigint;
}
```

---

## Chain Abstraction Types

### CCTToken

```typescript
interface CCTToken {
  symbol: string;
  chains: ChainId[];
  totalSupply: Record<ChainId, bigint>;
  bridgeable: boolean;
  nativeChain?: ChainId;
  decimals: number;
}
```

### ChainScore

```typescript
interface ChainScore {
  chain: ChainId;
  score: number; // 0-100
  factors: {
    gasPrice: number;
    latency: number;
    reliability: number;
  };
}
```

---

## Registry Proofs Types

### RegistryFlag

```typescript
type RegistryFlag =
  | 'KYC'
  | 'KYB'
  | 'ACCREDITED'
  | 'REGION_US'
  | 'REGION_EU'
  | 'SANCTIONS_CLEAR'
  | 'PROFESSIONAL_INVESTOR'
  | 'NODE_OPERATOR';
```

### RegistryProof

```typescript
interface RegistryProof {
  account: string;
  flags: RegistryFlag[];
  attestationHash: string;
  attester: string;
  timestamp: number;
  expiryDate?: number;
}
```

---

## Incident Types

### Incident

```typescript
interface Incident {
  id: string;
  severity: 'P0' | 'P1' | 'P2';
  title: string;
  description: string;
  detectedAt: number;
  resolvedAt?: number;
  status: 'open' | 'investigating' | 'mitigating' | 'resolved' | 'closed';
  goldenSignals: GoldenSignals;
  rootCause?: string;
  resolution?: string;
}
```

### GoldenSignals

```typescript
interface GoldenSignals {
  latency: {
    p50: number;
    p95: number;
    p99: number;
  };
  errors: {
    rate: number;
    count: number;
  };
  traffic: {
    requestsPerSecond: number;
    changePercent: number;
  };
  saturation: {
    cpu: number;
    memory: number;
  };
}
```

---

## Startup Sequence Types

### ServiceNode

```typescript
interface ServiceNode {
  id: string;
  service: string;
  dependencies: string[];
  healthCheck: HealthCheck;
  initFunction: () => Promise<void>;
  trafficGrader?: TrafficGrader;
  priority?: number;
}
```

### DependencyDAG

```typescript
interface DependencyDAG {
  nodes: ServiceNode[];
  edges: DependencyEdge[];
}
```

### TrafficPhase

```typescript
interface TrafficPhase {
  percentage: number; // 1, 10, 50, 100
  duration: number;   // ms
  healthThreshold: number; // 0-100
}
```

---

## Vertex Agent Types

### AgentConfig

```typescript
interface AgentConfig {
  agentId: string;
  name: string;
  description: string;
  identity: AgentIdentity;
  tools: string[];
  memoryBankId?: string;
}
```

### AgentSession

```typescript
interface AgentSession {
  sessionId: string;
  agentId: string;
  startTime: number;
  endTime?: number;
  interactions: Interaction[];
  metadata?: Record<string, any>;
}
```

### Memory

```typescript
interface Memory {
  id: string;
  timestamp: number;
  content: string;
  metadata?: Record<string, any>;
}
```

---

## Common Types

### ChainId

```typescript
type ChainId =
  | 'base'
  | 'ethereum'
  | 'solana'
  | 'polygon'
  | 'arbitrum'
  | 'avalanche'
  | 'near'
  | 'monad'
  | 'unknown';
```

### Role

```typescript
type Role = 'sensor' | 'orchestrator' | 'worker' | 'system';
```

### Topic

```typescript
type Topic =
  | 'intel.snapshot'
  | 'task.plan'
  | 'task.exec'
  | 'alert'
  | 'telemetry'
  | 'state.delta';
```

---

## Status Types

### DreamNetOSStatus

```typescript
interface DreamNetOSStatus {
  version: string;
  uptime: number;
  subsystems: SubsystemSummary[];
  healthScores: GlobalHealthScores;
  snapshot: DreamNetOSSnapshot;
}
```

### SubsystemSummary

```typescript
interface SubsystemSummary {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'error';
  healthScore: number;
  lastUpdated: number;
}
```

---

**Status**: ✅ Data Models Complete  
**Last Updated**: 2025-01-27

