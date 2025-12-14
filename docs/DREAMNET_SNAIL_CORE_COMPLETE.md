# DreamNet Snail Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation (Placeholder Implementation)

---

## Overview

DreamNet Snail Core provides **biomimetic privacy layer with verifiable provenance trails** for DreamNet. It implements a "Know-All Win-All" mode where everything is tracked, but users control privacy through encryption, zero-knowledge proofs, and configurable privacy levels.

**Note**: Currently implemented as a placeholder to avoid blocking server startup. Full implementation is planned.

---

## Key Features

### Privacy Trails
- Event trail recording
- Verifiable provenance
- Hash chain integrity
- Previous hash linking

### Privacy Levels
- Public trails
- Private trails
- Encrypted trails
- Zero-knowledge trails

### Privacy Configuration
- Encryption control
- Zero-knowledge enablement
- Data retention policies
- Analytics permissions
- Agent sharing

### Privacy Insights
- Pattern detection
- Anomaly identification
- Recommendations
- Privacy alerts

---

## Architecture

### Components

1. **Dream Snail Core** (`index.ts`)
   - Trail recording
   - Privacy configuration
   - Insight generation
   - Integrity verification

2. **Types** (`types.ts`)
   - Trail definitions
   - Privacy config types
   - Insight types

3. **Spider Bridge** (`logic/snailSpiderBridge.ts`)
   - Spider Web integration
   - Event bridging

4. **Auto-Record** (`logic/autoRecord.ts`)
   - Operational event recording
   - Audit event recording

---

## API Reference

### Trail Management

#### `recordTrail(identityId: string, eventType: string, eventData: Record<string, unknown>, metadata?: Partial<SnailTrail["metadata"]>): SnailTrail`
Records a privacy trail.

**Example**:
```typescript
import { DreamSnailCore } from '@dreamnet/dreamnet-snail-core';

const trail = DreamSnailCore.recordTrail(
  'identity-123',
  'user-action',
  { action: 'login', source: 'web' },
  {
    source: 'dreamnet',
    privacyLevel: 'private',
    clusterId: 'dream-state',
  }
);

console.log(`Trail ID: ${trail.id}`);
console.log(`Hash: ${trail.hash}`);
```

#### `getIdentityTrail(identityId: string, includeEncrypted?: boolean): SnailTrail[]`
Gets identity trail.

#### `verifyTrailIntegrity(identityId: string): { valid: boolean; invalidTrails: string[] }`
Verifies trail integrity.

### Privacy Configuration

#### `getPrivacyConfig(identityId: string): SnailPrivacyConfig`
Gets privacy configuration.

**Example**:
```typescript
const config = DreamSnailCore.getPrivacyConfig('identity-123');
console.log(`Encryption: ${config.encryptionEnabled}`);
console.log(`Zero-Knowledge: ${config.zeroKnowledgeEnabled}`);
console.log(`Retention: ${config.dataRetentionDays} days`);
```

#### `updatePrivacyConfig(identityId: string, updates: Partial<SnailPrivacyConfig>): SnailPrivacyConfig`
Updates privacy configuration.

### Insights

#### `getIdentityInsights(identityId: string, severity?: SnailInsight["severity"]): SnailInsight[]`
Gets privacy insights.

#### `getAnalytics(identityId: string): Analytics`
Gets privacy analytics.

### Status

#### `status(): SnailStatus`
Gets Snail Core status.

---

## Data Models

### SnailTrail

```typescript
interface SnailTrail {
  id: string;
  identityId: string;
  eventType: string;
  eventData: Record<string, unknown>;
  timestamp: string;
  hash: string;
  previousHash: string | null;
  encrypted: boolean;
  encryptionKey?: string;
  metadata: {
    source: string;
    agent?: string;
    system?: string;
    clusterId?: string;
    privacyLevel: "public" | "private" | "encrypted" | "zero-knowledge";
  };
}
```

### SnailPrivacyConfig

```typescript
interface SnailPrivacyConfig {
  identityId: string;
  encryptionEnabled: boolean;
  zeroKnowledgeEnabled: boolean;
  dataRetentionDays: number;
  allowAnalytics: boolean;
  allowTracking: boolean;
  shareWithAgents: string[];
}
```

### SnailInsight

```typescript
interface SnailInsight {
  id: string;
  identityId: string;
  insightType: "pattern" | "anomaly" | "recommendation" | "privacy-alert";
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  relatedTrails: string[];
  actionable: boolean;
  actionUrl?: string;
}
```

---

## Privacy Levels

### Public
- No encryption
- Fully accessible
- Analytics enabled
- Tracking enabled

### Private
- Limited access
- Selective sharing
- Analytics controlled
- Tracking controlled

### Encrypted
- Data encrypted
- Key management
- Access control
- Audit logging

### Zero-Knowledge
- Zero-knowledge proofs
- Privacy-preserving
- Minimal data exposure
- Advanced privacy

---

## Integration Points

### DreamNet Systems
- **Identity Grid**: Identity integration
- **Spider Web**: Event bridging
- **Narrative Field**: Privacy logging
- **DreamNet Audit Core**: Audit integration

### External Systems
- **Encryption**: Data encryption
- **Zero-Knowledge**: ZK proofs
- **Analytics**: Privacy analytics

---

## Usage Examples

### Record Trail

```typescript
const trail = DreamSnailCore.recordTrail(
  'identity-123',
  'user-action',
  { action: 'login', source: 'web' },
  {
    source: 'dreamnet',
    privacyLevel: 'private',
  }
);
```

### Configure Privacy

```typescript
const config = DreamSnailCore.updatePrivacyConfig('identity-123', {
  encryptionEnabled: true,
  zeroKnowledgeEnabled: false,
  dataRetentionDays: 365,
  allowAnalytics: true,
  allowTracking: false,
});
```

### Get Insights

```typescript
const insights = DreamSnailCore.getIdentityInsights('identity-123', 'high');
insights.forEach(insight => {
  console.log(`${insight.title}: ${insight.description}`);
});
```

### Verify Integrity

```typescript
const verification = DreamSnailCore.verifyTrailIntegrity('identity-123');
if (verification.valid) {
  console.log('Trail integrity verified');
} else {
  console.log(`Invalid trails: ${verification.invalidTrails.join(', ')}`);
}
```

---

## Best Practices

1. **Trail Recording**
   - Record all events
   - Use appropriate privacy levels
   - Link previous hashes
   - Include metadata

2. **Privacy Configuration**
   - Set appropriate levels
   - Enable encryption when needed
   - Configure retention
   - Control sharing

3. **Integrity**
   - Verify trails regularly
   - Check hash chains
   - Monitor anomalies
   - Audit access

---

## Security Considerations

1. **Privacy Security**
   - Protect encryption keys
   - Secure zero-knowledge proofs
   - Control data access
   - Audit privacy changes

2. **Trail Security**
   - Validate trail data
   - Protect trail storage
   - Secure hash chains
   - Prevent tampering

---

## Implementation Status

**Current**: Placeholder implementation  
**Planned**: Full implementation with:
- Real trail storage
- Encryption support
- Zero-knowledge proofs
- Integrity verification
- Analytics generation

---

**Status**: ✅ Complete Documentation (Placeholder)  
**Last Updated**: 2025-01-27

