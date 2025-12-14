# DreamNet API Reference

**Generated**: 2025-01-27  
**Status**: Complete API Documentation

---

## Purpose

This document provides complete API reference for all DreamNet systems and components.

---

## Table of Contents

1. [Nervous System Core API](#nervous-system-core-api)
2. [Message Bus API](#message-bus-api)
3. [Shared Memory API](#shared-memory-api)
4. [Detector Generator API](#detector-generator-api)
5. [Resilience Early-Warning API](#resilience-early-warning-api)
6. [DIN Infrastructure API](#din-infrastructure-api)
7. [Intent Router API](#intent-router-api)
8. [Chain Abstraction API](#chain-abstraction-api)
9. [Control Core API](#control-core-api)
10. [OS Core API](#os-core-api)

---

## Nervous System Core API

### Message Bus

#### `publish(message: NervousMessage): void`

Publish a message to the message bus.

**Parameters**:
- `message`: NervousMessage object

**Example**:
```typescript
nervousMessageBus.publish({
  id: 'msg-123',
  ts: Date.now(),
  role: 'sensor',
  topic: 'intel.snapshot',
  payload: { data: '...' },
});
```

#### `subscribe(topic: Topic, handler: Handler): Subscription`

Subscribe to a topic.

**Parameters**:
- `topic`: Topic name
- `handler`: Handler function

**Returns**: Subscription object

**Example**:
```typescript
const subscription = nervousMessageBus.subscribe('intel.snapshot', (message) => {
  console.log('Received:', message);
});
```

### Shared Memory

#### `kv.get<T>(key: string): Promise<T | null>`

Get value from KV store.

**Parameters**:
- `key`: Key string

**Returns**: Value or null

**Example**:
```typescript
const value = await sharedMemory.kv.get<string>('my-key');
```

#### `kv.put<T>(key: string, value: T, ttlSec?: number): Promise<void>`

Store value in KV store.

**Parameters**:
- `key`: Key string
- `value`: Value to store
- `ttlSec`: Optional TTL in seconds

**Example**:
```typescript
await sharedMemory.kv.put('my-key', 'my-value', 3600);
```

#### `doc.read(id: string): Promise<Record<string, any> | null>`

Read document from document store.

**Parameters**:
- `id`: Document ID

**Returns**: Document or null

**Example**:
```typescript
const doc = await sharedMemory.doc.read('doc-123');
```

#### `vec.search(embedding: number[], k: number, filter?: Record<string, any>): Promise<Array<{id: string, score: number, meta: any}>>`

Search vectors.

**Parameters**:
- `embedding`: Vector embedding
- `k`: Number of results
- `filter`: Optional filter

**Returns**: Array of search results

**Example**:
```typescript
const results = await sharedMemory.vec.search(embedding, 10);
```

---

## Detector Generator API

#### `generateDetectors(surface: DetectorSurface): Promise<Detector[]>`

Generate detectors for a surface.

**Parameters**:
- `surface`: Detector surface

**Returns**: Array of detectors

**Example**:
```typescript
const detectors = await DetectorGeneratorCore.generateDetectors({
  name: 'api',
  metrics: ['latency', 'error_rate'],
});
```

#### `scoreDetector(detector: Detector): Promise<number>`

Score a detector.

**Parameters**:
- `detector`: Detector object

**Returns**: Score (0-1)

**Example**:
```typescript
const score = await DetectorGeneratorCore.scoreDetector(detector);
```

---

## Resilience Early-Warning API

#### `calculateSignals(metric: SentinelMetric): Promise<ResilienceSignal>`

Calculate resilience signals.

**Parameters**:
- `metric`: Sentinel metric

**Returns**: Resilience signal

**Example**:
```typescript
const signal = await ResilienceEarlyWarning.calculateSignals({
  name: 'p95_latency',
  values: [100, 150, 200, 250],
});
```

#### `getResilienceIndex(): Promise<number>`

Get current resilience index.

**Returns**: Resilience index (0-100)

**Example**:
```typescript
const index = await ResilienceEarlyWarning.getResilienceIndex();
```

---

## DIN Infrastructure API

#### `stake(operatorId: string, amount: bigint): Promise<void>`

Stake tokens for node operator.

**Parameters**:
- `operatorId`: Operator ID
- `amount`: Stake amount

**Example**:
```typescript
await DINInfrastructureCore.stake('op-123', ethers.parseEther('1'));
```

#### `slash(operatorId: string, reason: string, amount: bigint): Promise<void>`

Slash operator stake.

**Parameters**:
- `operatorId`: Operator ID
- `reason`: Slashing reason
- `amount`: Slash amount

**Example**:
```typescript
await DINInfrastructureCore.slash('op-123', 'Downtime', ethers.parseEther('0.1'));
```

---

## Intent Router API

#### `processIntent(intent: Intent): Promise<IntentExecution>`

Process an intent.

**Parameters**:
- `intent`: Intent object

**Returns**: Intent execution result

**Example**:
```typescript
const execution = await IntentRouterCore.processIntent({
  type: 'swap',
  fromToken: 'USDC',
  toToken: 'ETH',
  amount: ethers.parseUnits('1000', 6),
  constraints: {
    maxSlippage: 0.005,
    deadline: Date.now() + 3600000,
  },
});
```

---

## Chain Abstraction API

#### `transferCCT(transfer: CCTTransfer): Promise<string>`

Transfer CCT token across chains.

**Parameters**:
- `transfer`: CCT transfer object

**Returns**: Transaction hash

**Example**:
```typescript
const txHash = await ChainAbstractionCore.transferCCT({
  token: 'USDC',
  amount: ethers.parseUnits('1000', 6),
  from: 'base',
  to: 'ethereum',
  recipient: '0x...',
  constraints: {
    maxSlippage: 0.01,
  },
});
```

#### `selectOptimalChain(preferredChains?: ChainId[]): ChainId`

Select optimal chain.

**Parameters**:
- `preferredChains`: Optional preferred chains

**Returns**: Selected chain ID

**Example**:
```typescript
const chain = ChainAbstractionCore.selectOptimalChain(['base', 'ethereum']);
```

---

## Control Core API

#### `enableGlobalKillSwitch(reason?: string): void`

Enable global kill-switch.

**Parameters**:
- `reason`: Optional reason

**Example**:
```typescript
DreamNetControlCore.enableGlobalKillSwitch('Emergency');
```

#### `setFeatureFlag(flag: string, value: boolean): void`

Set feature flag.

**Parameters**:
- `flag`: Flag name
- `value`: Flag value

**Example**:
```typescript
DreamNetControlCore.setFeatureFlag('new_feature', true);
```

---

## OS Core API

#### `status(): DreamNetOSStatus`

Get OS status.

**Returns**: OS status object

**Example**:
```typescript
const status = DreamNetOSCore.status();
```

#### `getActiveAlerts(): Alert[]`

Get active alerts.

**Returns**: Array of alerts

**Example**:
```typescript
const alerts = DreamNetOSCore.getActiveAlerts();
```

---

## REST API Endpoints

### Health

#### `GET /api/health`

Get health status.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": 1234567890
}
```

### Metrics

#### `GET /api/metrics`

Get metrics.

**Response**:
```json
{
  "latency": {
    "p50": 100,
    "p95": 200,
    "p99": 500
  },
  "errors": {
    "rate": 0.01,
    "count": 10
  }
}
```

### Incidents

#### `POST /api/incidents`

Create incident.

**Request**:
```json
{
  "title": "High latency",
  "description": "p95 latency > 2s",
  "severity": "P1"
}
```

#### `GET /api/incidents/:id`

Get incident.

**Response**:
```json
{
  "id": "inc-123",
  "title": "High latency",
  "status": "open",
  "severity": "P1"
}
```

### Agents

#### `GET /api/agents`

List agents.

**Response**:
```json
{
  "agents": [
    {
      "id": "agent-123",
      "name": "Citadel",
      "status": "active"
    }
  ]
}
```

#### `POST /api/agents/:id/execute`

Execute agent.

**Request**:
```json
{
  "input": "Analyze system health",
  "metadata": {}
}
```

---

**Status**: ✅ API Reference Complete  
**Last Updated**: 2025-01-27

