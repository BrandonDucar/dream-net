# Directory - Complete Documentation

**Package**: `@dreamnet/directory`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Directory is DreamNet's **central registry** for all entities (citizens, agents, dreams, nodes, ports, conduits). It provides discovery, registration, and lookup capabilities for the entire DreamNet ecosystem.

### Key Features

- **Entity Registration**: Register citizens, agents, dreams, nodes, ports, conduits
- **Type-Based Lookup**: List entries by entity type
- **Search**: Full-text search across all entries
- **ID Generation**: Automatic ID generation for entities
- **Timestamps**: Automatic createdAt/updatedAt tracking

---

## Architecture

### How It Works

```
Entity Registration → Directory Registry → Search/Lookup → Directory Entry
```

1. **Registration**: Register entity with type-specific helper functions
2. **Storage**: Store entries in in-memory Map
3. **Lookup**: Retrieve entries by ID, type, or search query
4. **Timestamps**: Automatically track creation and update times

### Why This Design

- **Centralized Discovery**: Single source of truth for all entities
- **Type Safety**: Type-specific entry interfaces
- **Simple API**: Easy-to-use helper functions for each entity type
- **Searchable**: Full-text search across labels, IDs, descriptions

---

## API Reference

### Types

```typescript
export type DirectoryEntityType =
  | "citizen"
  | "agent"
  | "dream"
  | "node"
  | "port"
  | "conduit";

export type DirectoryId = string;

export interface DirectoryBase {
  id: DirectoryId;
  type: DirectoryEntityType;
  label: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CitizenDirectoryEntry extends DirectoryBase {
  type: "citizen";
  citizenId: string;
}

export interface AgentDirectoryEntry extends DirectoryBase {
  type: "agent";
  agentId: string;
  clusterId?: string;
  kind?: string;
}

export interface DreamDirectoryEntry extends DirectoryBase {
  type: "dream";
  dreamId: string;
  founderCitizenId?: string;
  status?: string;
}

export interface NodeDirectoryEntry extends DirectoryBase {
  type: "node";
  nodeId: string;
  clusterId?: string;
}

export interface PortDirectoryEntry extends DirectoryBase {
  type: "port";
  portId: string;
}

export interface ConduitDirectoryEntry extends DirectoryBase {
  type: "conduit";
  conduitId: string;
  portId: string;
  clusterId: string;
  toolId: string;
}

export type DirectoryEntry =
  | CitizenDirectoryEntry
  | AgentDirectoryEntry
  | DreamDirectoryEntry
  | NodeDirectoryEntry
  | PortDirectoryEntry
  | ConduitDirectoryEntry;
```

### Functions

#### Registration Functions

- **`registerCitizen(props): CitizenDirectoryEntry`**
- **`registerAgent(props): AgentDirectoryEntry`**
- **`registerDream(props): DreamDirectoryEntry`**
- **`registerNode(props): NodeDirectoryEntry`**
- **`registerPort(props): PortDirectoryEntry`**
- **`registerConduit(props): ConduitDirectoryEntry`**

#### Lookup Functions

- **`getEntry(id: DirectoryId): DirectoryEntry | undefined`**
- **`listEntriesByType(type: DirectoryEntityType): DirectoryEntry[]`**
- **`listAllEntries(): DirectoryEntry[]`**
- **`searchEntries(query: string): DirectoryEntry[]`**

#### ID Generation Functions

- **`generateCitizenId(customLabel?: string): string`**
- **`generateDreamId(): string`**
- **`wrapNodeId(clusterId: string): string`**

---

## Usage Examples

### Register Citizen

```typescript
import { registerCitizen, generateCitizenId } from "@dreamnet/directory";

const citizenId = generateCitizenId("BRANDON");
const citizen = registerCitizen({
  citizenId,
  label: "Brandon",
  description: "Founder of DreamNet",
});

console.log("Registered citizen:", citizen.id);
```

### Register Agent

```typescript
import { registerAgent } from "@dreamnet/directory";

const agent = registerAgent({
  agentId: "agent:DreamOps",
  label: "DreamOps Orchestrator",
  clusterId: "DREAMNET_OS",
  kind: "infra",
  description: "Main orchestration agent",
});
```

### Register Dream

```typescript
import { registerDream, generateDreamId } from "@dreamnet/directory";

const dreamId = generateDreamId();
const dream = registerDream({
  dreamId,
  label: "DreamNet OS",
  founderCitizenId: "CIT-BRANDON",
  status: "sprout",
  description: "Operating system for DreamNet",
});
```

### Register Node

```typescript
import { registerNode } from "@dreamnet/directory";

const node = registerNode({
  nodeId: "NODE-SHIELD-CORE",
  label: "Shield Core",
  clusterId: "SHIELD_CORE",
  description: "Security and threat detection",
});
```

### Register Port

```typescript
import { registerPort } from "@dreamnet/directory";

const port = registerPort({
  portId: "AGENT_GATEWAY",
  label: "Agent Gateway",
  description: "AI-native ingress for agents",
});
```

### Register Conduit

```typescript
import { registerConduit } from "@dreamnet/directory";

const conduit = registerConduit({
  conduitId: "conduit-1",
  portId: "AGENT_GATEWAY",
  clusterId: "ENVKEEPER_CORE",
  toolId: "env.get",
  label: "Agent Gateway → Env Keeper → env.get",
  description: "Environment variable access conduit",
});
```

### Lookup Entries

```typescript
import { getEntry, listEntriesByType, searchEntries } from "@dreamnet/directory";

// Get by ID
const entry = getEntry("CIT-BRANDON");

// List by type
const citizens = listEntriesByType("citizen");
const agents = listEntriesByType("agent");
const dreams = listEntriesByType("dream");

// Search
const results = searchEntries("DreamNet");
```

---

## Best Practices

1. **ID Consistency**: Use consistent ID formats for each entity type
2. **Descriptions**: Provide clear descriptions for better searchability
3. **Labels**: Use human-readable labels
4. **Timestamps**: Timestamps are automatically managed
5. **Search**: Use search for discovery, IDs for direct lookup

---

## Related Systems

- **Agent Registry**: Agent configurations
- **Dream Vault**: Dream storage
- **Port Governor**: Port management
- **Conduit Governor**: Conduit management

---

**Status**: ✅ Implemented  
**Next**: Add persistence layer for directory entries

