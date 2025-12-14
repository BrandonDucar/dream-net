# DreamState - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

DreamState provides **governance layer** for DreamNet, including Passports, Offices, and Cabinets. It bootstraps governance state with founder, offices, and cabinets, providing a structured governance system for DreamNet operations.

---

## Key Features

### Governance Structure
- Passport system
- Office definitions
- Cabinet management
- Founder authority

### Bootstrap System
- Founder wallet addresses
- Default offices
- Default cabinets
- Initial state seeding

### Office Management
- Office definitions
- Required tiers
- Powers and permissions
- Cluster scoping

---

## Architecture

### Components

1. **DreamState Registry** (`registry.ts`)
   - Bootstrap state
   - Office definitions
   - Cabinet definitions
   - State management

2. **DreamState Types** (`types.ts`)
   - Type definitions
   - Passport types
   - Office types
   - Cabinet types

---

## API Reference

### Registry Operations

#### `getDreamStateSnapshot(): DreamStateSnapshot`
Gets DreamState snapshot.

**Example**:
```typescript
import { getDreamStateSnapshot } from '@dreamnet/dreamstate';

const snapshot = getDreamStateSnapshot();
console.log(`Founder: ${snapshot.founderCitizenId}`);
console.log(`Offices: ${Object.keys(snapshot.offices).length}`);
```

---

## Data Models

### DreamStateSnapshot

```typescript
interface DreamStateSnapshot {
  version: number;
  createdAt: string;
  updatedAt: string;
  initializedBy: string;
  initializedAt: string;
  isReadOnlyBootstrap: boolean;
  founderCitizenId: string;
  godVaultCitizenId: string;
  defaultCitizenTemplateTierId: string;
  defaultStatus: string;
  nextCitizenIdSeed: number;
  nextOfficeIdSuffix: number;
  nextCabinetIdSuffix: number;
  note: string;
  offices: Record<string, Office>;
  cabinets: Record<string, Cabinet>;
}
```

### Office

```typescript
interface Office {
  id: OfficeId;
  name: string;
  description: string;
  clusterScope?: ClusterId[];
  requiredTierId: TierId;
  isSingleSeat: boolean;
  powers: string[];
}
```

### Cabinet

```typescript
interface Cabinet {
  id: CabinetId;
  name: string;
  description: string;
  offices: OfficeId[];
  clusterScope?: ClusterId[];
}
```

---

## Default Offices

### Founder
- **ID**: `FOUNDER`
- **Tier**: `GOD_MODE`
- **Powers**: Override all decisions, appoint/remove offices, emergency kill switch, full system access

### Minister of Wolf Operations
- **ID**: `MINISTER_OF_WOLF_OPERATIONS`
- **Tier**: `OPERATOR`
- **Cluster**: `WOLF_PACK`
- **Powers**: Manage Wolf Pack operations, approve actions, configure settings

### Chief of AI SEO
- **ID**: `CHIEF_OF_AI_SEO`
- **Tier**: `OPERATOR`
- **Cluster**: `AI_SEO`
- **Powers**: Manage AI SEO operations, configure SEO rules, approve changes

### Geo Boundary Architect
- **ID**: `GEO_BOUNDARY_ARCHITECT`
- **Tier**: `OPERATOR`
- **Powers**: Manage geofencing, configure boundaries, approve changes

---

## Bootstrap Process

### Founder Wallets
- Loaded from environment variables
- `DN_FOUNDER_WALLET_1` through `DN_FOUNDER_WALLET_10`
- Automatically registered as founders

### Initial State
- Founder citizen ID: `FOUNDER_BRANDON`
- God vault citizen ID: `FOUNDER_BRANDON`
- Default tier: `SEED`
- Default status: `active`

---

## Integration Points

### DreamNet Systems
- **Dream State Core**: Governance integration
- **Identity Grid**: Identity mapping
- **DreamNet RBAC Core**: Permission management
- **DreamNet Control Core**: Tier configuration

---

## Usage Examples

### Get Snapshot

```typescript
const snapshot = getDreamStateSnapshot();
```

### Access Offices

```typescript
const founderOffice = snapshot.offices.FOUNDER;
console.log(`Founder powers: ${founderOffice.powers.join(', ')}`);
```

---

## Best Practices

1. **Governance**
   - Use appropriate offices
   - Assign correct tiers
   - Define clear powers
   - Maintain structure

2. **Bootstrap**
   - Configure founder wallets
   - Set default tiers
   - Initialize offices
   - Seed cabinets

---

## Security Considerations

1. **Governance Security**
   - Secure founder wallets
   - Validate office assignments
   - Enforce tier requirements
   - Audit governance actions

2. **Bootstrap Security**
   - Protect founder wallets
   - Secure environment variables
   - Validate bootstrap state
   - Monitor initialization

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

