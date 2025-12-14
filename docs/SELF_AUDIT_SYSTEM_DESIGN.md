# Self-Auditing Loop System - Design Document

**Status**: 📋 Design Document  
**Priority**: 🔴 HIGH  
**Last Updated**: 2025-01-27

---

## Overview

The **Self-Auditing Loop** is a "cron jobs meet immune system" system that enables nodes to rewrite their own configs, log anomalies, and trigger repairs automatically. It's designed as a biomimetic immune system for DreamNet infrastructure.

### Core Concept

Think of it as an **autonomous immune system**:
- **Watchers**: Background checks that run on schedule or when events fire
- **Sensors**: Quick probes (health, perf, sec, wallet state, API quotas)
- **Rules**: If a reading crosses a line, auto-fix or escalate
- **Memory**: Append-only audit log to trace every change
- **Antibodies**: Prebuilt "repair routines" (restart, roll back, re-provision, rotate key, quarantine)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Self-Auditing Loop System                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Watchers   │→ │   Sensors    │→ │    Rules     │    │
│  │  (Scheduler) │  │  (Probes)    │  │  (Thresholds)│    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                          ↓                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Memory     │← │  Antibodies  │← │   Actions    │    │
│  │  (Ledger)    │  │  (Repairs)   │  │  (Triggers)  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Watchers (Scheduler)

**Purpose**: Schedule and trigger sensor checks

**Types**:
- **Cron Watchers**: Scheduled checks (every N minutes/hours)
- **Event Watchers**: Triggered by events (error spike, alert, etc.)
- **Conditional Watchers**: Triggered by conditions (queue depth > threshold)

**Implementation**:
```typescript
interface Watcher {
  id: string;
  name: string;
  type: "cron" | "event" | "conditional";
  schedule?: string; // Cron expression
  event?: string; // Event name
  condition?: Condition; // Conditional trigger
  sensors: string[]; // Sensors to run
  enabled: boolean;
}
```

### 2. Sensors (Probes)

**Purpose**: Quick probes that check system health, performance, security, etc.

#### 10 Starter Sensors

##### 1. Heartbeat Sensor

**Purpose**: Monitor p95 latency and uptime

**Metrics**:
- p95 latency
- Uptime percentage
- Response time distribution

**Thresholds**:
- p95 > 2× trailing 24h average → Alert
- Uptime < 99% → Alert

##### 2. Error Burst Sensor

**Purpose**: Detect error rate spikes

**Metrics**:
- 5xx error rate
- Error rate over baseline
- Error burst duration

**Thresholds**:
- Error rate +300% over 15m baseline → Alert

##### 3. Key Hygiene Sensor

**Purpose**: Monitor API key expiration and usage

**Metrics**:
- Expiring keys (within 7 days)
- Unused keys (>30 days inactive)
- Key rotation status

**Thresholds**:
- Expiring keys detected → Alert
- Unused keys detected → Alert

##### 4. RPC Health Sensor

**Purpose**: Monitor blockchain RPC endpoints

**Metrics**:
- RPC response time
- RPC error rate
- RPC availability

**Thresholds**:
- RPC fail rate > 5% over 5m → Alert
- Response time > 1s → Alert

##### 5. Model Drift Sensor

**Purpose**: Detect AI model performance degradation

**Metrics**:
- Golden prompt score
- Model output quality
- Prediction accuracy

**Thresholds**:
- Golden prompt score drop > 8% → Alert

##### 6. Prompt/Tool Breakage Sensor

**Purpose**: Detect tool call failures

**Metrics**:
- Tool call failure rate
- Tool timeout rate
- Tool error types

**Thresholds**:
- Tool call failure rate > 5% → Alert

##### 7. Data Freshness Sensor

**Purpose**: Monitor cache and data staleness

**Metrics**:
- Cache age
- Data TTL violations
- Stale data percentage

**Thresholds**:
- Stale cache > TTL → Alert

##### 8. Queue Backlog Sensor

**Purpose**: Monitor job queue depth

**Metrics**:
- Queue depth
- Job age
- Processing rate

**Thresholds**:
- Jobs aging out (>1 hour) → Alert
- Queue depth > 1000 → Alert

##### 9. Strange Traffic Sensor

**Purpose**: Detect anomalous traffic patterns

**Metrics**:
- IP address patterns
- User agent patterns
- Request patterns
- Geographic patterns

**Thresholds**:
- Unknown IP/UA anomalies → Alert
- Unusual request patterns → Alert

##### 10. Economics Sensor

**Purpose**: Monitor economic health

**Metrics**:
- LP balances
- Fee balances
- Token balances
- Economic thresholds

**Thresholds**:
- LP/fee balances below floor → Alert

### Sensor Interface

```typescript
interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  probe: () => Promise<SensorReading>;
  severity: Severity;
}

interface SensorReading {
  sensorId: string;
  timestamp: number;
  value: number;
  status: "healthy" | "warning" | "critical";
  metadata?: Record<string, any>;
}
```

### 3. Rules (Thresholds & Actions)

**Purpose**: Define thresholds and actions when thresholds are crossed

**Rule Structure**:
```typescript
interface Rule {
  id: string;
  name: string;
  sensor: string; // Sensor ID
  condition: {
    operator: ">" | "<" | ">=" | "<=" | "==" | "!=";
    threshold: number;
    window: number; // Time window in seconds
    consecutive: number; // Consecutive violations required
  };
  actions: Array<{
    type: "alert" | "antibody" | "escalate";
    target: string; // Alert channel, antibody ID, or escalation level
    delay?: number; // Delay before action (seconds)
  }>;
  enabled: boolean;
}
```

### 4. Memory (Ledger)

**Purpose**: Append-only audit log of all changes

**Ledger Structure**:
```typescript
interface LedgerEntry {
  id: string;
  timestamp: number;
  type: "sensor" | "rule" | "antibody" | "config";
  action: string;
  actor: string; // "system" | "human" | "antibody"
  details: Record<string, any>;
  hash: string; // Hash of entry for integrity
  previousHash?: string; // Previous entry hash
}

interface Ledger {
  entries: LedgerEntry[];
  append(entry: Omit<LedgerEntry, "id" | "hash" | "previousHash">): LedgerEntry;
  verify(): boolean; // Verify ledger integrity
  query(filter: LedgerFilter): LedgerEntry[];
}
```

### 5. Antibodies (Repair Routines)

**Purpose**: Prebuilt repair routines that can be triggered automatically

#### 8 Default Antibodies

##### 1. Restart Worker

**Purpose**: Restart a failing worker

**Actions**:
- Graceful shutdown
- Health check
- Restart process
- Verify health

##### 2. Roll Back Config

**Purpose**: Roll back to previous configuration

**Actions**:
- Load previous config
- Apply config
- Verify functionality
- Log change

##### 3. Flush & Rebuild Cache

**Purpose**: Clear and rebuild cache

**Actions**:
- Clear cache
- Rebuild cache
- Verify cache health
- Monitor performance

##### 4. Regenerate API Key

**Purpose**: Rotate API key

**Actions**:
- Generate new key
- Update configuration
- Test new key
- Revoke old key (after delay)

##### 5. Quarantine IP

**Purpose**: Block suspicious IP addresses

**Actions**:
- Add IP to blocklist
- Update firewall rules
- Log action
- Monitor for false positives

##### 6. Trigger Safe Mode

**Purpose**: Enter reduced-feature, high-reliability mode

**Actions**:
- Disable non-essential features
- Increase health check frequency
- Reduce load
- Monitor stability

##### 7. Snapshot & Revert DB

**Purpose**: Create snapshot and revert database changes

**Actions**:
- Create DB snapshot
- Identify problematic changes
- Revert changes
- Verify data integrity

##### 8. Escalate to Human

**Purpose**: Escalate issue to human operator

**Actions**:
- Create incident ticket
- Send alert to operators
- Provide context and logs
- Wait for human response

### Antibody Interface

```typescript
interface Antibody {
  id: string;
  name: string;
  description: string;
  run: (context: AntibodyContext) => Promise<AntibodyResult>;
  rollback?: (context: AntibodyContext) => Promise<void>;
  idempotent: boolean; // Can be run multiple times safely
}

interface AntibodyContext {
  sensorReading?: SensorReading;
  rule?: Rule;
  systemState: Record<string, any>;
  metadata?: Record<string, any>;
}

interface AntibodyResult {
  success: boolean;
  actions: string[];
  changes: Record<string, any>;
  error?: string;
}
```

---

## Integration Points

### With Shield Core

**Focus Areas**:
- Integrity monitoring
- Rate spike detection
- Key usage tracking
- RPC error monitoring
- Malicious payload detection

**Integration**:
```typescript
// Shield Core sensors
- Rate spike sensor
- Key usage sensor
- RPC health sensor
- Payload analysis sensor
```

### With Latent Collaboration Core

**Focus Areas**:
- Model drift detection
- Tool failure monitoring
- Prompt/skill regression
- Stale environment variables

**Integration**:
```typescript
// Latent Collaboration sensors
- Model drift sensor
- Tool breakage sensor
- Prompt regression sensor
- Env var freshness sensor
```

### With Citadel

**Integration**:
- Event publishing (ANOMALY_DETECTED, AUTO_REPAIR_APPLIED, etc.)
- Feed integration
- Dashboard updates

### With DreamScope UI

**Display**:
- Node card badges (Healthy / Recovering / Quarantined)
- Sparklines for metrics
- "Last 5 Actions" feed
- Run Antibody dropdown

---

## Policy & Safety

### Two-Phase Changes

1. **Plan Phase**: Generate change plan
2. **Apply Phase**: Apply changes with auto-rollback on failure

### Signed Changes

- Every mutation signed by "DREAMKEEPER"
- Includes reason and diff
- Cryptographic signature verification

### Blast Radius

- Per-node feature flags
- Never global by default
- Gradual rollout support

### Rate Limits

- Repairs capped per hour
- Exponential backoff
- Circuit breaker pattern

---

## Event Vocabulary

For Citadel integration:

- `ANOMALY_DETECTED`: Sensor detected anomaly
- `AUTO_REPAIR_APPLIED`: Antibody executed successfully
- `REPAIR_FAILED`: Antibody execution failed
- `NODE_QUARANTINED`: Node quarantined
- `SAFE_MODE_ENTERED`: Safe mode activated
- `HUMAN_ESCALATION_REQUIRED`: Escalated to human

---

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1)

1. **Create `packages/self-audit-core/`**
2. **Implement scheduler + ledger**
3. **Basic sensor framework**

### Phase 2: Starter Sensors (Week 2)

1. **Add 3 sensors**:
   - Heartbeat
   - Error burst
   - RPC health

### Phase 3: Starter Antibodies (Week 2)

1. **Add 2 antibodies**:
   - Restart worker
   - Rotate endpoint

### Phase 4: Integration (Week 3)

1. **Pipe events to Citadel**
2. **DreamScope UI integration**
3. **Shield Core integration**

### Phase 5: Expansion (Week 4+)

1. **Add remaining sensors**
2. **Add remaining antibodies**
3. **Optimize and tune**

---

## Suggested Thresholds

- **Error rate**: +300% over 15m baseline
- **Latency**: p95 > 2× trailing 24h
- **Drift**: Golden-prompt score drop > 8%
- **RPC fail**: > 5% over 5m
- **Wallet ops**: Unknown contract calls > 0.5% traffic

---

## Future Enhancements

1. **ML-Based Anomaly Detection**: Learn normal patterns
2. **Predictive Antibodies**: Predict issues before they occur
3. **Cross-Node Coordination**: Coordinate repairs across nodes
4. **Advanced Rollback**: More sophisticated rollback strategies
5. **Learning System**: Learn from successful repairs

---

**Status**: 📋 Design Complete - Ready for Implementation

