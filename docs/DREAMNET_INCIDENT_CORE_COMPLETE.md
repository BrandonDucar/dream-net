# DreamNet Incident Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

DreamNet Incident Core provides **incident management** for DreamNet. It creates incidents, tracks incident timelines, manages incident status, assigns incidents, and integrates with Spider Web for operational awareness.

---

## Key Features

### Incident Management
- Incident creation
- Status tracking
- Timeline management
- Assignment handling
- Resolution tracking

### Incident Classification
- Severity levels (low, medium, high, critical)
- Status tracking (open, investigating, resolved, closed)
- Cluster association
- Tag management

### Timeline Tracking
- Event recording
- Status changes
- Comments
- Resolution notes
- Root cause analysis

### Integration
- Spider Web bridging
- Operational awareness
- Alert generation
- Status updates

---

## Architecture

### Components

1. **Incident Store** (`store/incidentStore.ts`)
   - Incident storage
   - Event storage
   - Query management

2. **Types** (`types.ts`)
   - Incident definitions
   - Event types
   - Query types

---

## API Reference

### Incident Management

#### `createIncident(title: string, description: string, severity: IncidentSeverity, clusterId?: string, metadata?: Record<string, any>): Incident`
Creates a new incident.

**Example**:
```typescript
import { DreamNetIncidentCore } from '@dreamnet/dreamnet-incident-core';

const incident = DreamNetIncidentCore.createIncident(
  'API Rate Limit Exceeded',
  'API rate limit exceeded for dream-state cluster',
  'high',
  'dream-state',
  { apiEndpoint: '/api/dreams', rateLimit: 100 }
);

console.log(`Incident Created: ${incident.id}`);
console.log(`Status: ${incident.status}`);
console.log(`Severity: ${incident.severity}`);
```

#### `getIncident(incidentId: string): Incident | undefined`
Gets incident by ID.

#### `updateIncidentStatus(incidentId: string, status: IncidentStatus, userId?: string, message?: string): void`
Updates incident status.

**Example**:
```typescript
DreamNetIncidentCore.updateIncidentStatus(
  'incident-123',
  'investigating',
  'user-123',
  'Investigating root cause'
);
```

#### `addEvent(incidentId: string, event: Omit<IncidentEvent, "id" | "timestamp">): void`
Adds event to incident timeline.

#### `queryIncidents(query: IncidentQuery): Incident[]`
Queries incidents.

#### `getOpenIncidents(): Incident[]`
Gets open incidents.

---

## Data Models

### IncidentStatus

```typescript
type IncidentStatus = "open" | "investigating" | "resolved" | "closed";
```

### IncidentSeverity

```typescript
type IncidentSeverity = "low" | "medium" | "high" | "critical";
```

### Incident

```typescript
interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  clusterId?: string;
  detectedAt: number;
  resolvedAt?: number;
  closedAt?: number;
  assignedTo?: string;
  timeline: IncidentEvent[];
  rootCause?: string;
  resolution?: string;
  tags: string[];
  metadata: Record<string, any>;
}
```

### IncidentEvent

```typescript
interface IncidentEvent {
  id: string;
  timestamp: number;
  type: "detected" | "updated" | "assigned" | "investigating" | "resolved" | "closed" | "comment";
  userId?: string;
  message: string;
  metadata?: Record<string, any>;
}
```

### IncidentQuery

```typescript
interface IncidentQuery {
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  clusterId?: string;
  startTime?: number;
  endTime?: number;
  assignedTo?: string;
  limit?: number;
  offset?: number;
}
```

---

## Incident Lifecycle

### Open
- Initial state
- Incident detected
- Timeline started
- Awaiting investigation

### Investigating
- Active investigation
- Root cause analysis
- Timeline updates
- Status tracking

### Resolved
- Issue fixed
- Resolution documented
- Root cause identified
- Awaiting closure

### Closed
- Incident closed
- Final state
- Archive ready
- Post-mortem possible

---

## Severity Levels

### Low
- Minor issues
- Non-critical
- Low impact
- Standard handling

### Medium
- Moderate issues
- Some impact
- Standard priority
- Normal handling

### High
- Significant issues
- High impact
- High priority
- Urgent handling

### Critical
- Critical issues
- System-wide impact
- Highest priority
- Immediate handling

---

## Integration Points

### DreamNet Systems
- **Spider Web Core**: Operational bridging
- **DreamNet OS Core**: System health
- **DreamNet Health Core**: Health monitoring
- **DreamNet Control Core**: Control actions

### External Systems
- **Monitoring**: Alert integration
- **Alerting**: Notification systems
- **Analytics**: Incident analytics

---

## Usage Examples

### Create Incident

```typescript
const incident = DreamNetIncidentCore.createIncident(
  'Database Connection Failed',
  'Database connection failed for dream-state cluster',
  'critical',
  'dream-state',
  { database: 'postgres', host: 'db.dreamnet.io' }
);
```

### Update Status

```typescript
DreamNetIncidentCore.updateIncidentStatus(
  incident.id,
  'investigating',
  'admin-123',
  'Investigating database connection issue'
);
```

### Add Event

```typescript
DreamNetIncidentCore.addEvent(incident.id, {
  type: 'comment',
  userId: 'admin-123',
  message: 'Database connection restored',
});
```

### Query Incidents

```typescript
const incidents = DreamNetIncidentCore.queryIncidents({
  status: 'open',
  severity: 'high',
  clusterId: 'dream-state',
  limit: 10,
});
```

### Get Open Incidents

```typescript
const openIncidents = DreamNetIncidentCore.getOpenIncidents();
openIncidents.forEach(incident => {
  console.log(`${incident.title}: ${incident.severity}`);
});
```

---

## Best Practices

1. **Incident Creation**
   - Use clear titles
   - Provide detailed descriptions
   - Set correct severity
   - Include metadata

2. **Status Management**
   - Update status promptly
   - Document changes
   - Track timeline
   - Assign appropriately

3. **Resolution**
   - Document root cause
   - Record resolution
   - Close properly
   - Learn from incidents

---

## Security Considerations

1. **Incident Security**
   - Protect incident data
   - Secure access
   - Audit changes
   - Control visibility

2. **Data Security**
   - Validate incident data
   - Protect metadata
   - Secure timeline
   - Prevent tampering

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

