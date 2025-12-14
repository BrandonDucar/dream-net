# Directory and Network Blueprints Complete Documentation

## Overview

Directory and Network Blueprints are foundational infrastructure systems for DreamNet entity discovery and network bootstrapping.

**Directory Package**: `@dreamnet/directory`  
**Location**: `packages/directory/`

**Network Blueprints Package**: `@dreamnet/network-blueprints`  
**Location**: `packages/network-blueprints/`

---

## Table of Contents

1. [Directory System](#directory-system)
2. [Network Blueprints System](#network-blueprints-system)
3. [Integration](#integration)
4. [Usage Examples](#usage-examples)

---

## Directory System

### Purpose

Central registry for all DreamNet entities (citizens, agents, dreams, nodes, ports, conduits). Provides entity discovery, search, and ID management.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Directory Registry                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │   Citizens   │    │    Agents    │    │    Dreams    │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │    Nodes     │    │    Ports     │    │   Conduits   │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              ID Generator & Bootstrap                     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Entity Types

#### 1. Citizens

**Type**: `citizen`  
**Purpose**: Humans/entities with DreamState passports

```typescript
interface CitizenDirectoryEntry {
  id: DirectoryId;              // e.g., "CIT-BRANDON"
  type: "citizen";
  citizenId: string;            // e.g., "CIT-000001" or "CIT-BRANDON"
  label: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 2. Agents

**Type**: `agent`  
**Purpose**: Software actors (AI agents)

```typescript
interface AgentDirectoryEntry {
  id: DirectoryId;              // e.g., "AGENT-WOLF-PACK-001"
  type: "agent";
  agentId: string;              // From Agent Registry
  clusterId?: string;           // e.g., "WOLF_PACK"
  kind?: string;                 // e.g., "funding-hunter"
  label: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 3. Dreams

**Type**: `dream`  
**Purpose**: Projects/verticals

```typescript
interface DreamDirectoryEntry {
  id: DirectoryId;              // e.g., "DREAM-0001"
  type: "dream";
  dreamId: string;
  founderCitizenId?: string;    // e.g., "CIT-BRANDON"
  status?: string;               // "seed" | "sprout" | "active"
  label: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 4. Nodes

**Type**: `node`  
**Purpose**: Cores/organs (biomimetic clusters)

```typescript
interface NodeDirectoryEntry {
  id: DirectoryId;              // e.g., "NODE-SHIELD-CORE"
  type: "node";
  nodeId: string;
  clusterId?: string;          // e.g., "SHIELD_CORE"
  label: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 5. Ports

**Type**: `port`  
**Purpose**: Edge ports (fiber-optic ports)

```typescript
interface PortDirectoryEntry {
  id: DirectoryId;              // e.g., "PORT-AGENT_GATEWAY"
  type: "port";
  portId: string;               // e.g., "AGENT_GATEWAY"
  label: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 6. Conduits

**Type**: `conduit`  
**Purpose**: Port → cluster → tool lines

```typescript
interface ConduitDirectoryEntry {
  id: DirectoryId;              // e.g., "CONDUIT-AGENT_GATEWAY::ENVKEEPER_CORE::env.set"
  type: "conduit";
  conduitId: string;
  portId: string;
  clusterId: string;
  toolId: string;
  label: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

### API

#### Registration

```typescript
import {
  registerCitizen,
  registerAgent,
  registerDream,
  registerNode,
  registerPort,
  registerConduit,
} from '@dreamnet/directory/registry';

// Register citizen
const citizen = registerCitizen({
  citizenId: 'CIT-BRANDON',
  label: 'Brandon (Founder of DreamNet)',
  description: 'Founder and primary steward of DreamNet.',
});

// Register agent
const agent = registerAgent({
  agentId: 'wolf-pack-001',
  label: 'Wolf Pack Funding Hunter',
  clusterId: 'WOLF_PACK',
  kind: 'funding-hunter',
  description: 'Discovers funding opportunities and grants.',
});

// Register dream
const dream = registerDream({
  dreamId: 'DREAM-0001',
  label: 'DreamNet Core Infrastructure',
  founderCitizenId: 'CIT-BRANDON',
  status: 'active',
  description: 'The foundational DreamNet infrastructure dream.',
});

// Register node
const node = registerNode({
  nodeId: 'NODE-SHIELD-CORE',
  label: 'Shield Core',
  clusterId: 'SHIELD_CORE',
  description: 'Security, threat detection, rate limiting',
});

// Register port
const port = registerPort({
  portId: 'AGENT_GATEWAY',
  label: 'Agent Gateway',
  description: 'Central routing and proxy for external requests',
});

// Register conduit
const conduit = registerConduit({
  conduitId: 'AGENT_GATEWAY::ENVKEEPER_CORE::env.set',
  portId: 'AGENT_GATEWAY',
  clusterId: 'ENVKEEPER_CORE',
  toolId: 'env.set',
  label: 'Agent → EnvKeeper → env.set',
  description: 'High-risk mutation of env vars via EnvKeeper',
});
```

#### Lookup

```typescript
import {
  getEntry,
  listEntriesByType,
  listAllEntries,
  searchEntries,
} from '@dreamnet/directory/registry';

// Get entry by ID
const entry = getEntry('CIT-BRANDON');

// List entries by type
const citizens = listEntriesByType('citizen');
const agents = listEntriesByType('agent');
const dreams = listEntriesByType('dream');

// List all entries
const allEntries = listAllEntries();

// Search entries
const results = searchEntries('wolf');
```

### ID Generation

**Location**: `packages/directory/src/idGenerator.ts`

```typescript
import {
  generateCitizenId,
  generateDreamId,
  wrapNodeId,
} from '@dreamnet/directory/idGenerator';

// Generate citizen ID
const citizenId1 = generateCitizenId();              // "CIT-000001"
const citizenId2 = generateCitizenId('BRANDON');    // "CIT-BRANDON"

// Generate dream ID
const dreamId = generateDreamId();                   // "DREAM-000001"

// Wrap node ID
const nodeId = wrapNodeId('SHIELD_CORE');           // "NODE-SHIELD-CORE"
```

### Bootstrap

**Location**: `packages/directory/src/bootstrap.ts`

Initializes Directory with existing entities on startup:

```typescript
import { initDirectory } from '@dreamnet/directory/bootstrap';

// Initialize Directory (called on server startup)
await initDirectory();
```

**What Gets Registered**:
1. **Founder Citizen** - `CIT-BRANDON`
2. **Core Nodes** - All biomimetic clusters (Wolf Pack, Octopus, Spider Web, etc.)
3. **Ports** - All ports from Port Governor
4. **Conduits** - All conduits from Control Core

**Bootstrap Output**:
```
[Directory] 🔍 Initializing Directory - Registering existing entities...
[Directory] ✅ Directory initialized - Registered 12 nodes, 5 ports, 20 conduits
```

---

## Network Blueprints System

### Purpose

Network configuration templates for bootstrapping DreamNet instances. Allows defining complete network configurations (citizens, agents, dreams, ports, conduits) that can be applied to bootstrap new DreamNet instances.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Network Blueprints Registry                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Blueprint Definition                         │ │
│  │  - DreamNet Core Blueprint                               │ │
│  │  - TravelNet Blueprint                                   │ │
│  │  - Custom Blueprints                                     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Bootstrap Engine                            │ │
│  │  - Register citizens                                     │ │
│  │  - Register agents                                       │ │
│  │  - Register dreams                                       │ │
│  │  - Register ports                                        │ │
│  │  - Register conduits                                     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Blueprint Structure

```typescript
interface NetworkBlueprint {
  id: string;                    // e.g., "DREAMNET_CORE"
  label: string;                 // e.g., "DreamNet Core"
  slug: string;                  // e.g., "dreamnet-core"
  primaryDomain?: string;         // e.g., "dreamnet.ai"
  description?: string;
  version?: string;               // e.g., "1.0.0"
  
  citizens?: Array<{
    citizenId: string;
    label: string;
    description?: string;
  }>;
  
  agents?: Array<{
    agentId: string;
    label: string;
    clusterId?: string;
    kind?: string;
    description?: string;
  }>;
  
  dreams?: Array<{
    dreamId: string;
    label: string;
    founderCitizenId?: string;
    status?: string;
    description?: string;
  }>;
  
  ports?: Array<{
    portId: string;
    label: string;
    description?: string;
  }>;
  
  conduits?: Array<{
    conduitId: string;
    portId: string;
    clusterId: string;
    toolId: string;
    label: string;
    description?: string;
  }>;
  
  metadata?: Record<string, unknown>;
}
```

### Predefined Blueprints

#### 1. DreamNet Core Blueprint

**ID**: `DREAMNET_CORE`  
**Location**: `packages/network-blueprints/src/dreamnetCore.ts`

The canonical bootstrap configuration for DreamNet Core network.

```typescript
import { DreamNetCoreBlueprint } from '@dreamnet/network-blueprints/dreamnetCore';

// Contains:
// - Founder citizen (CIT-BRANDON)
// - Core dream (DREAM-CORE-0001)
// - Auto-registered on import
```

#### 2. TravelNet Blueprint

**ID**: `TRAVELNET_CORE`  
**Location**: `packages/network-blueprints/src/travelNet.ts`

A stub blueprint for a travel-focused DreamNet vertical.

```typescript
import { TravelNetBlueprint } from '@dreamnet/network-blueprints/travelNet';

// Contains:
// - Travel pioneer citizen (CIT-TINA)
// - Travel dream (DREAM-TRAVEL-0001)
```

### API

#### Define Blueprint

```typescript
import { defineNetworkBlueprint } from '@dreamnet/network-blueprints/define';

const blueprint = defineNetworkBlueprint({
  id: 'MY_NETWORK',
  label: 'My Network',
  slug: 'my-network',
  primaryDomain: 'mynetwork.ai',
  description: 'A custom DreamNet network',
  version: '1.0.0',
  
  citizens: [
    {
      id: 'CIT-ALICE',
      label: 'Alice',
      description: 'Network founder',
    },
  ],
  
  dreams: [
    {
      id: 'DREAM-001',
      label: 'My Dream',
      founderCitizenId: 'CIT-ALICE',
      status: 'active',
    },
  ],
  
  agents: [],
  ports: [],
  conduits: [],
});
```

#### Register Blueprint

```typescript
import { registerBlueprint } from '@dreamnet/network-blueprints/registry';

registerBlueprint(blueprint);
```

#### Get Blueprint

```typescript
import {
  getBlueprint,
  listBlueprints,
  getBlueprintBySlug,
} from '@dreamnet/network-blueprints/registry';

// Get by ID
const blueprint = getBlueprint('DREAMNET_CORE');

// List all blueprints
const blueprints = listBlueprints();

// Get by slug
const blueprintBySlug = getBlueprintBySlug('dreamnet-core');
```

#### Bootstrap from Blueprint

```typescript
import { bootstrapFromBlueprint } from '@dreamnet/network-blueprints/bootstrap';

const result = bootstrapFromBlueprint(blueprint);

// Result:
// {
//   blueprintId: 'DREAMNET_CORE',
//   citizensRegistered: 1,
//   agentsRegistered: 0,
//   dreamsRegistered: 1,
//   portsRegistered: 0,
//   conduitsRegistered: 0,
//   success: true,
//   errors: undefined,
// }
```

### Bootstrap Process

1. **Register Citizens** - Creates citizen entries in Directory
2. **Register Agents** - Creates agent entries in Directory
3. **Register Dreams** - Creates dream entries in Directory
4. **Register Ports** - Creates port entries in Directory
5. **Register Conduits** - Creates conduit entries in Directory

**Error Handling**: Bootstrap continues even if individual registrations fail, collecting errors in the result.

---

## Integration

### Server Routes

**Location**: `server/routes/directory.ts`

```typescript
// GET /api/directory/entity/:id
router.get('/directory/entity/:id', async (req, res) => {
  const entry = getEntry(req.params.id);
  res.json({ ok: true, entry });
});

// GET /api/directory/citizens
router.get('/directory/citizens', async (req, res) => {
  const citizens = listEntriesByType('citizen');
  res.json({ ok: true, citizens });
});

// GET /api/directory/agents
router.get('/directory/agents', async (req, res) => {
  const agents = listEntriesByType('agent');
  res.json({ ok: true, agents });
});

// GET /api/directory/search?q=wolf
router.get('/directory/search', async (req, res) => {
  const results = searchEntries(req.query.q as string);
  res.json({ ok: true, results });
});
```

### Directory Bootstrap Integration

Directory bootstrap is called during server initialization:

```typescript
// server/index.ts
import { initDirectory } from '@dreamnet/directory/bootstrap';

// On server startup
await initDirectory();
```

### Network Blueprints Integration

Network blueprints are auto-registered on import:

```typescript
// packages/network-blueprints/src/index.ts
import './dreamnetCore';  // Auto-registers DreamNet Core Blueprint
import './travelNet';      // Auto-registers TravelNet Blueprint
```

---

## Usage Examples

### Example 1: Register a New Citizen

```typescript
import { registerCitizen, generateCitizenId } from '@dreamnet/directory/registry';

const citizenId = generateCitizenId('ALICE');
const citizen = registerCitizen({
  citizenId,
  label: 'Alice',
  description: 'New DreamNet citizen',
});

console.log(citizen);
// {
//   id: 'CIT-ALICE',
//   type: 'citizen',
//   citizenId: 'CIT-ALICE',
//   label: 'Alice',
//   description: 'New DreamNet citizen',
//   createdAt: '2025-01-27T...',
//   updatedAt: '2025-01-27T...',
// }
```

### Example 2: Search for Entities

```typescript
import { searchEntries } from '@dreamnet/directory/registry';

// Search for "wolf"
const results = searchEntries('wolf');
// Returns all entries with "wolf" in label, id, or description

// Results might include:
// - Agent: "Wolf Pack Funding Hunter"
// - Node: "Wolf Pack"
// - Conduit: "AGENT_GATEWAY::WOLF_PACK::..."
```

### Example 3: Create Custom Blueprint

```typescript
import { defineNetworkBlueprint, bootstrapFromBlueprint } from '@dreamnet/network-blueprints';

// Define custom blueprint
const myBlueprint = defineNetworkBlueprint({
  id: 'MY_VERTICAL',
  label: 'My Vertical Network',
  slug: 'my-vertical',
  description: 'A custom DreamNet vertical',
  
  citizens: [
    {
      id: 'CIT-FOUNDER',
      label: 'Founder',
      description: 'Network founder',
    },
  ],
  
  dreams: [
    {
      id: 'DREAM-001',
      label: 'Main Dream',
      founderCitizenId: 'CIT-FOUNDER',
      status: 'active',
    },
  ],
});

// Bootstrap from blueprint
const result = bootstrapFromBlueprint(myBlueprint);
console.log(result);
// {
//   blueprintId: 'MY_VERTICAL',
//   citizensRegistered: 1,
//   dreamsRegistered: 1,
//   success: true,
// }
```

### Example 4: List All Entities by Type

```typescript
import { listEntriesByType } from '@dreamnet/directory/registry';

// List all citizens
const citizens = listEntriesByType('citizen');
console.log(`Found ${citizens.length} citizens`);

// List all agents
const agents = listEntriesByType('agent');
console.log(`Found ${agents.length} agents`);

// List all dreams
const dreams = listEntriesByType('dream');
console.log(`Found ${dreams.length} dreams`);
```

---

## Summary

**Directory System**:
- ✅ Central registry for all DreamNet entities
- ✅ 6 entity types (citizens, agents, dreams, nodes, ports, conduits)
- ✅ ID generation and bootstrap
- ✅ Search and lookup APIs
- ✅ Auto-registration on server startup

**Network Blueprints System**:
- ✅ Network configuration templates
- ✅ Bootstrap engine for new instances
- ✅ Predefined blueprints (DreamNet Core, TravelNet)
- ✅ Custom blueprint definition API
- ✅ Error handling and reporting

**Status**: ✅ Fully implemented and integrated into server routes and bootstrap process.

**Usage**: Directory is used for entity discovery and search. Network Blueprints are used for bootstrapping new DreamNet instances.

