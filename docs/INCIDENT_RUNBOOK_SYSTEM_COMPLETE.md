# Incident Runbook System - Complete Documentation

**Generated:** 2025-01-27  
**Status:** Complete Documentation & Implementation Plan

---

## Overview

Incident Runbook System provides P0/P1/P2 incident procedures with hotkeys and pre-baked commands. This enables rapid response to incidents with standardized procedures and automated recovery actions.

---

## Architecture

### Components

1. **Hotkey Commands** (`hotkeys.ts`)
   - SAFE_MODE - Disable tool use/external calls
   - WRITE_DRAIN - Reject new writes, keep reads
   - Feature flags - Kill-switch risky modules
   - Traffic shaping - Scale to last known good

2. **Pre-Baked Commands** (`commands.ts`)
   - Rollback: Deploy N-1 artifact
   - Rotate keys: KMS rotate + restart pods
   - Quarantine agents: Remove from mesh
   - Queue relief: Drain DLQs

3. **Incident Classification** (`classification.ts`)
   - P0: Critical (system down)
   - P1: High (major degradation)
   - P2: Medium (minor issues)

4. **Runbook Procedures** (`runbook.md`)
   - Human-readable procedures
   - Step-by-step instructions
   - Golden signals dashboards

---

## Incident Severity Levels

### P0: Critical (System Down)

**Definition**: Complete service outage or data loss

**Response Time**: Immediate (< 5 minutes)

**Procedures**:
1. Enable SAFE_MODE
2. Enable WRITE_DRAIN
3. Check golden signals (latency, errors, traffic, saturation)
4. Identify root cause
5. Execute rollback if needed
6. Restore service
7. Post-mortem

**Hotkeys**:
- `SAFE_MODE=on` - Disable all external calls
- `WRITE_DRAIN=on` - Reject writes, keep reads
- `ROLLBACK` - Deploy previous version

### P1: High (Major Degradation)

**Definition**: Significant performance degradation or partial outage

**Response Time**: < 15 minutes

**Procedures**:
1. Check golden signals
2. Identify affected components
3. Enable feature flags to disable risky modules
4. Scale up if needed
5. Monitor recovery
6. Document incident

**Hotkeys**:
- `FEATURE_FLAG=disable:<module>` - Disable specific module
- `AUTOSCALE=on` - Enable autoscaling
- `RATE_LIMIT=reduce` - Reduce rate limits

### P2: Medium (Minor Issues)

**Definition**: Minor performance issues or warnings

**Response Time**: < 1 hour

**Procedures**:
1. Check alerts
2. Review metrics
3. Apply fixes if needed
4. Monitor trends

**Hotkeys**:
- `MONITOR=increase` - Increase monitoring frequency
- `ALERT_THRESHOLD=lower` - Lower alert thresholds

---

## Hotkey Commands

### SAFE_MODE

**Purpose**: Disable tool use and external calls

**Implementation**:
```typescript
function enableSafeMode(reason?: string): void {
  DreamNetControlCore.setFeatureFlag('safe_mode', true);
  DreamNetControlCore.setFeatureFlag('tool_use', false);
  DreamNetControlCore.setFeatureFlag('external_calls', false);
  
  // Publish event
  nervousMessageBus.publish({
    id: `safe-mode-enabled-${Date.now()}`,
    ts: Date.now(),
    role: 'system',
    topic: 'alert',
    payload: {
      type: 'safe_mode_enabled',
      reason,
    },
  });
}
```

### WRITE_DRAIN

**Purpose**: Reject new writes, keep reads

**Implementation**:
```typescript
function enableWriteDrain(reason?: string): void {
  DreamNetControlCore.setFeatureFlag('write_drain', true);
  
  // Publish event
  nervousMessageBus.publish({
    id: `write-drain-enabled-${Date.now()}`,
    ts: Date.now(),
    role: 'system',
    topic: 'alert',
    payload: {
      type: 'write_drain_enabled',
      reason,
    },
  });
}
```

### Feature Flags

**Purpose**: Kill-switch risky modules

**Implementation**:
```typescript
function disableModule(module: string, reason?: string): void {
  DreamNetControlCore.setFeatureFlag(`module:${module}`, false);
  
  // Publish event
  nervousMessageBus.publish({
    id: `module-disabled-${Date.now()}`,
    ts: Date.now(),
    role: 'system',
    topic: 'alert',
    payload: {
      type: 'module_disabled',
      module,
      reason,
    },
  });
}
```

---

## Pre-Baked Commands

### Rollback

**Purpose**: Deploy previous version

**Implementation**:
```typescript
async function rollback(service: string, targetVersion?: string): Promise<void> {
  // Get current version
  const currentVersion = await getCurrentVersion(service);
  
  // Get previous version
  const previousVersion = targetVersion || await getPreviousVersion(service);
  
  // Deploy previous version
  await deployVersion(service, previousVersion);
  
  // Verify deployment
  await verifyDeployment(service, previousVersion);
  
  // Publish event
  nervousMessageBus.publish({
    id: `rollback-${Date.now()}`,
    ts: Date.now(),
    role: 'system',
    topic: 'alert',
    payload: {
      type: 'rollback_executed',
      service,
      fromVersion: currentVersion,
      toVersion: previousVersion,
    },
  });
}
```

### Rotate Keys

**Purpose**: KMS rotate + restart pods

**Implementation**:
```typescript
async function rotateKeys(service: string): Promise<void> {
  // Rotate keys in KMS
  await kmsRotateKeys(service);
  
  // Restart pods to pick up new keys
  await restartPods(service);
  
  // Verify keys are rotated
  await verifyKeyRotation(service);
  
  // Publish event
  nervousMessageBus.publish({
    id: `key-rotation-${Date.now()}`,
    ts: Date.now(),
    role: 'system',
    topic: 'alert',
    payload: {
      type: 'keys_rotated',
      service,
    },
  });
}
```

### Quarantine Agents

**Purpose**: Remove agents from mesh

**Implementation**:
```typescript
async function quarantineAgent(agentId: string, reason?: string): Promise<void> {
  // Remove from mesh
  await removeFromMesh(agentId);
  
  // Add to quarantine list
  await addToQuarantine(agentId, reason);
  
  // Publish event
  nervousMessageBus.publish({
    id: `agent-quarantined-${Date.now()}`,
    ts: Date.now(),
    role: 'system',
    topic: 'alert',
    payload: {
      type: 'agent_quarantined',
      agentId,
      reason,
    },
  });
}
```

### Queue Relief

**Purpose**: Drain dead letter queues

**Implementation**:
```typescript
async function drainDLQ(queueName: string): Promise<void> {
  // Get DLQ size
  const dlqSize = await getDLQSize(queueName);
  
  // Drain DLQ
  await drainQueue(queueName);
  
  // Publish event
  nervousMessageBus.publish({
    id: `dlq-drained-${Date.now()}`,
    ts: Date.now(),
    role: 'system',
    topic: 'alert',
    payload: {
      type: 'dlq_drained',
      queueName,
      drainedCount: dlqSize,
    },
  });
}
```

---

## Golden Signals

### Latency

**P0 Threshold**: p95 > 5s
**P1 Threshold**: p95 > 2s
**P2 Threshold**: p95 > 1s

### Errors

**P0 Threshold**: Error rate > 10%
**P1 Threshold**: Error rate > 5%
**P2 Threshold**: Error rate > 1%

### Traffic

**P0 Threshold**: Traffic drop > 50%
**P1 Threshold**: Traffic drop > 25%
**P2 Threshold**: Traffic drop > 10%

### Saturation

**P0 Threshold**: CPU/Memory > 95%
**P1 Threshold**: CPU/Memory > 85%
**P2 Threshold**: CPU/Memory > 75%

---

## Integration with DreamNet Systems

### DreamNet Incident Core

- Creates incidents from runbook triggers
- Tracks incident timeline
- Links to runbook procedures

### DreamNet Control Core

- Executes hotkey commands
- Manages feature flags
- Controls kill-switches

### DreamNet OS Core

- Monitors golden signals
- Triggers alerts
- Executes recovery actions

### Nervous System Core

- Publishes incident events
- Routes alerts
- Coordinates responses

---

## Implementation Plan

### Phase 9.1: Hotkey Commands
- [ ] Implement SAFE_MODE
- [ ] Implement WRITE_DRAIN
- [ ] Implement feature flags
- [ ] Implement traffic shaping

### Phase 9.2: Pre-Baked Commands
- [ ] Implement rollback
- [ ] Implement key rotation
- [ ] Implement agent quarantine
- [ ] Implement queue relief

### Phase 9.3: Incident Classification
- [ ] Implement P0/P1/P2 classification
- [ ] Add golden signals monitoring
- [ ] Create alert thresholds

### Phase 9.4: Runbook Procedures
- [ ] Create human-readable runbook
- [ ] Add step-by-step procedures
- [ ] Create golden signals dashboard

### Phase 9.5: Integration
- [ ] Integrate with Incident Core
- [ ] Integrate with Control Core
- [ ] Integrate with OS Core
- [ ] Integrate with Nervous System

---

## Success Criteria

- ✅ Hotkey commands operational
- ✅ Pre-baked commands working
- ✅ Incident classification accurate
- ✅ Runbook procedures documented
- ✅ Integration with all DreamNet systems

---

## Next Steps

1. Implement hotkey commands
2. Create pre-baked commands
3. Build incident classification
4. Write runbook procedures
5. Integrate with DreamNet systems

