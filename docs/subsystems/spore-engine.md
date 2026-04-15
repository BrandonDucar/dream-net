# Spore Engine

The Spore Engine is DreamNet's prompt spore distribution and lineage system. It manages prompt spores (templates, configurations, workflows) and tracks their distribution to agents and squads.

## Overview

- **Package**: `@dreamnet/spore-engine`
- **Location**: `packages/spore-engine/`
- **Purpose**: Prompt spore distribution, lineage tracking, and version management

## Core Concepts

### Spores

Spores are reusable prompt templates, configurations, or workflows. Each spore has:
- **Type**: prompt, template, config, workflow, custom
- **Status**: draft, published, archived, deprecated
- **Content**: Spore content (string or object)
- **Metadata**: Tags, author, version, parentId, branchId, lineage
- **Distribution**: Target agents, squads, or roles
- **Stats**: Usage count, success count, failure count, last used

### Lineage

Spores can have parent-child relationships:
- **Parent**: Source spore (if forked)
- **Children**: Spores forked from this spore
- **Siblings**: Spores with the same parent
- **Ancestors**: Parent, grandparent, etc.
- **Descendants**: Children, grandchildren, etc.

### Distribution

Spores can be distributed to:
- **Agents**: Specific agents
- **Squads**: Specific squads
- **Roles**: Agents with specific roles

## API Endpoints

### Spores

- `GET /api/spores` - List all spores (optionally filter by type, status, tag)
- `GET /api/spores/:id` - Get spore by ID
- `POST /api/spores` - Create a new spore
- `PUT /api/spores/:id` - Update a spore
- `DELETE /api/spores/:id` - Delete a spore

### Lineage

- `GET /api/spores/:id/lineage` - Get spore lineage
- `POST /api/spores/:id/fork` - Fork a spore
- `POST /api/spores/:id/merge` - Merge a spore into another

### Distribution

- `POST /api/spores/:id/deploy` - Deploy a spore to agents/squads
- `POST /api/spores/:id/revoke` - Revoke a spore deployment
- `GET /api/spores/:id/distributions` - Get spore distributions
- `GET /api/agents/:agentId/spores` - Get spores deployed to an agent
- `GET /api/squads/:squadId/spores` - Get spores deployed to a squad

## Integration

### Graft Engine

Spore Engine integrates with Graft Engine:
- When a spore is deployed (config/template types), a graft is created
- Graft contains spore metadata and distribution info
- Graft can be installed to add the spore to the system

### Event Wormholes

Spore Engine emits events for:
- Spore deployment (`spore.deployed`)
- Spore usage (tracked in stats)

## Usage Example

```typescript
import { createSpore, deploySpore, forkSpore } from "@dreamnet/spore-engine";

// Create a spore
const spore = createSpore({
  name: "Default Prompt Spore",
  type: "prompt",
  status: "draft",
  content: "You are a helpful AI assistant.",
  metadata: {
    tags: ["default", "prompt"],
    version: "1.0.0",
  },
});

// Publish the spore
updateSpore(spore.id, { status: "published" });

// Deploy the spore
await deploySpore(spore.id, {
  role: "DreamKeeper",
});

// Fork the spore
const forked = forkSpore(spore.id, "Custom Prompt Spore");
```

## Spore Types

### Prompt
- Text prompts for AI agents
- Used for agent interactions
- Content: string

### Template
- Code templates
- Used for code generation
- Content: string or object

### Config
- Configuration templates
- Used for system configuration
- Content: object

### Workflow
- Workflow definitions
- Used for process automation
- Content: object

### Custom
- Custom spore types
- Content: string or object

## Status Flow

```
draft → published → archived/deprecated
```

## Lineage Operations

### Fork
- Create a new spore from an existing spore
- New spore has the parent spore as its parent
- Lineage is tracked

### Merge
- Merge one spore into another
- Content is merged
- Lineage is updated

## Distribution Flow

```
spore (published) → deploy → graft (created) → install → system
```

## Safety Guarantees

- Only published spores can be deployed
- Spore usage is tracked and logged
- Lineage is maintained and queryable
- Distribution is logged and reversible

## Stats Tracking

- **Usage Count**: Number of times spore was used
- **Success Count**: Number of successful uses
- **Failure Count**: Number of failed uses
- **Last Used**: Timestamp of last use

