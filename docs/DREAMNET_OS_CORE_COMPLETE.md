# DreamNet OS Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

DreamNet OS Core provides the **operating system layer** for DreamNet. It monitors subsystem health, generates recovery actions, detects integration gaps, and provides a unified view of DreamNet's operational status.

---

## Key Features

### Health Monitoring
- Subsystem health tracking
- Global health scores
- Health history
- Trend detection

### Alert System
- Active alerts
- Recent alerts
- Alert resolution
- Alert statistics

### Auto-Recovery
- Recovery action generation
- Automatic fixes
- Recovery recommendations
- Action execution

### Auto-Integration
- Integration gap detection
- Automatic integration fixes
- Integration monitoring
- Gap resolution

---

## Architecture

### Components

1. **OS Store** (`store/osStore.ts`)
   - Status storage
   - Snapshot management
   - Health tracking

2. **Heartbeat Alerts** (`logic/heartbeatAlerts.ts`)
   - Alert detection
   - Alert resolution
   - Health statistics
   - Trend analysis

3. **Auto Recovery** (`logic/autoRecovery.ts`)
   - Recovery action generation
   - Fix recommendations
   - Action execution

4. **Auto Integration** (`logic/autoIntegration.ts`)
   - Gap detection
   - Integration fixes
   - Gap monitoring

---

## API Reference

### Status & Snapshots

#### `status(): DreamNetOSStatus`
Gets DreamNet OS status.

#### `getSnapshot(): DreamNetOSSnapshot`
Gets OS snapshot.

**Example**:
```typescript
import { DreamNetOSCore } from '@dreamnet/dreamnet-os-core';

const snapshot = DreamNetOSCore.getSnapshot();
console.log(`Version: ${snapshot.version.label}`);
console.log(`Health: ${snapshot.globalHealth.infraHealth}`);
```

### Alert System

#### `getActiveAlerts(): Alert[]`
Gets active alerts.

#### `getRecentAlerts(limit?: number): Alert[]`
Gets recent alerts.

#### `getHealthHistory(): HealthHistoryEntry[]`
Gets health history.

#### `getHealthStats(): HealthStats`
Gets health statistics.

#### `detectTrends(): Trend[]`
Detects health trends.

#### `resolveAlert(alertId: string): boolean`
Resolves an alert.

### Recovery System

#### `generateRecoveryActions(context: DreamNetOSContext): RecoveryAction[]`
Generates recovery actions.

### Integration System

#### `detectIntegrationGaps(context: DreamNetOSContext): IntegrationGap[]`
Detects integration gaps.

#### `autoFixIntegrationGaps(context: DreamNetOSContext): FixResult[]`
Automatically fixes integration gaps.

#### `getIntegrationGaps(): IntegrationGap[]`
Gets current integration gaps.

---

## Data Models

### DreamNetVersionInfo

```typescript
interface DreamNetVersionInfo {
  major: number;
  minor: number;
  patch: number;
  label?: string;
}
```

### SubsystemSummary

```typescript
interface SubsystemSummary {
  name: string;
  status: 'ok' | 'warn' | 'error' | 'unknown';
  details?: string;
  lastUpdatedAt?: number;
}
```

### GlobalHealthScores

```typescript
interface GlobalHealthScores {
  infraHealth: number; // 0–1
  economyHealth: number; // 0–1
  socialHealth: number; // 0–1
  dreamPipelineHealth: number; // 0–1
}
```

### DreamNetOSSnapshot

```typescript
interface DreamNetOSSnapshot {
  version: DreamNetVersionInfo;
  heartbeatAt: number;
  globalHealth: GlobalHealthScores;
  subsystems: SubsystemSummary[];
}
```

### DreamNetOSStatus

```typescript
interface DreamNetOSStatus {
  lastRunAt: number | null;
  snapshot: DreamNetOSSnapshot;
}
```

---

## Health Scores

### Infrastructure Health
- System availability
- Service health
- Performance metrics
- Error rates

### Economy Health
- Token economics
- Balance health
- Reward distribution
- Economic stability

### Social Health
- User engagement
- Social activity
- Community health
- Growth metrics

### Dream Pipeline Health
- Dream creation
- Dream completion
- Pipeline throughput
- Success rates

---

## Alert System

### Alert Types
- Health alerts
- Performance alerts
- Error alerts
- Integration alerts

### Alert Lifecycle
1. **Detection**: Alert detected
2. **Active**: Alert active
3. **Resolution**: Alert resolved
4. **Closed**: Alert closed

---

## Recovery Actions

### Action Types
- Service restart
- Configuration fix
- Resource scaling
- Dependency resolution

### Recovery Process
1. **Detection**: Issue detected
2. **Analysis**: Root cause analysis
3. **Action Generation**: Recovery actions
4. **Execution**: Action execution
5. **Verification**: Success verification

---

## Integration Gaps

### Gap Types
- Missing connections
- Configuration issues
- Dependency problems
- Data sync issues

### Gap Resolution
1. **Detection**: Gap detected
2. **Analysis**: Gap analysis
3. **Fix Generation**: Fix actions
4. **Execution**: Fix execution
5. **Verification**: Fix verification

---

## Integration Points

### DreamNet Systems
- **All Subsystems**: Health monitoring
- **Alerts Core**: Alert integration
- **Metrics Core**: Health metrics
- **Neural Mesh**: Pattern recognition

### External Systems
- **Monitoring**: Health dashboards
- **Alerting**: Alert notifications
- **Analytics**: Health analytics

---

## Usage Examples

### Get OS Status

```typescript
const status = DreamNetOSCore.status();
console.log(`Last run: ${status.lastRunAt}`);
console.log(`Version: ${status.snapshot.version.label}`);
```

### Get Active Alerts

```typescript
const alerts = DreamNetOSCore.getActiveAlerts();
alerts.forEach(alert => {
  console.log(`${alert.severity}: ${alert.message}`);
});
```

### Generate Recovery Actions

```typescript
const actions = DreamNetOSCore.generateRecoveryActions({
  dreamVault: dreamVault,
  dreamShop: dreamShop,
  // ... other subsystems
});

actions.forEach(action => {
  console.log(`Action: ${action.type}`);
  console.log(`Description: ${action.description}`);
});
```

### Detect Integration Gaps

```typescript
const gaps = DreamNetOSCore.detectIntegrationGaps({
  dreamVault: dreamVault,
  dreamShop: dreamShop,
  // ... other subsystems
});

gaps.forEach(gap => {
  console.log(`Gap: ${gap.type}`);
  console.log(`Description: ${gap.description}`);
});
```

---

## Best Practices

1. **Health Monitoring**
   - Monitor regularly
   - Track trends
   - Set thresholds
   - Respond quickly

2. **Alert Management**
   - Prioritize alerts
   - Resolve promptly
   - Track resolution
   - Learn from alerts

3. **Recovery Actions**
   - Generate appropriate actions
   - Execute carefully
   - Verify success
   - Document actions

---

## Security Considerations

1. **OS Security**
   - Protect OS data
   - Secure health metrics
   - Audit OS changes
   - Prevent manipulation

2. **Recovery Security**
   - Validate actions
   - Secure execution
   - Audit recoveries
   - Prevent abuse

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27
