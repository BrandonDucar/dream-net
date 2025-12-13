# Dream Vault - Complete Documentation

**Package**: `@dreamnet/dream-vault`  
**Status**: ✅ Complete  
**Last Updated**: 2025-01-27

---

## Overview

Dream Vault provides a **centralized repository** for DreamNet items (dreams, blueprints, assets, templates, rituals, prompts, configs). It stores items with versioning, metadata references, tags, and links, and provides search capabilities.

### Key Features

- **Item Management**: Store and version items (dreams, blueprints, templates, etc.)
- **Metadata References**: Link items to DreamNet entities (dreams, identities, routes, chains, agents)
- **Search**: Search by text, tags, kind, state, and references
- **Versioning**: Automatic version tracking for all items
- **Index System**: Fast search index for efficient queries
- **State Management**: Track item lifecycle (draft, active, archived, deprecated, experimental)

---

## Architecture

### How It Works

```
Item Creation → Versioning → Index Update → Search Query → Results
```

1. **Item Creation**: Items created with metadata (title, description, content, tags, refs)
2. **Versioning**: Each update increments version number
3. **Index Update**: Index entry created/updated for fast search
4. **Search Query**: Search filters by text, tags, kind, state, refs
5. **Results**: Filtered items returned

### Why This Design

- **Centralized**: Single source of truth for all DreamNet items
- **Versioned**: Version tracking enables history and rollback
- **Searchable**: Index enables fast text/tag/kind searches
- **Referential**: Metadata refs enable linking to DreamNet entities
- **Flexible**: Supports multiple item kinds and states

---

## API Reference

### Types

```typescript
export type VaultItemKind =
  | "dream"
  | "blueprint"
  | "asset"
  | "template"
  | "ritual"
  | "prompt"
  | "config";

export type VaultState =
  | "draft"
  | "active"
  | "archived"
  | "deprecated"
  | "experimental";

export interface VaultMetaRef {
  type: "dream" | "identity" | "route" | "chain" | "agent" | "other";
  id: string;
  label?: string;
}

export interface VaultItem {
  id: string;
  kind: VaultItemKind;
  state: VaultState;
  title: string;
  description?: string;
  content?: string;           // Text, JSON stringified, or small configs
  tags?: string[];
  links?: string[];           // URLs, IPFS, etc.
  refs?: VaultMetaRef[];      // Links to DreamNet entities
  createdAt: number;
  updatedAt: number;
  version: number;
}

export interface VaultSearchQuery {
  text?: string;
  tag?: string;
  kind?: VaultItemKind;
  state?: VaultState;
  refId?: string;             // Matches items with ref to this id
  limit?: number;
}
```

### Functions

#### `upsertItem(item: Omit<VaultItem, "createdAt" | "updatedAt" | "version">): VaultItem`

Create or update an item.

**Example**:
```typescript
import { DreamVault } from "@dreamnet/dream-vault";

const item = DreamVault.upsertItem({
  id: "vault:blueprint-123",
  kind: "blueprint",
  state: "active",
  title: "DreamNet Architecture Blueprint",
  description: "Complete architecture blueprint",
  content: JSON.stringify({ architecture: "..." }),
  tags: ["architecture", "blueprint"],
  refs: [
    { type: "dream", id: "dream:dreamnet", label: "DreamNet" },
  ],
});
```

#### `getItem(id: string): VaultItem | undefined`

Get item by ID.

#### `listAll(): VaultItem[]`

List all items.

#### `search(query: VaultSearchQuery): VaultItem[]`

Search items.

**Example**:
```typescript
// Search by text
const results = DreamVault.search({
  text: "architecture",
  limit: 10,
});

// Search by kind
const blueprints = DreamVault.search({
  kind: "blueprint",
  state: "active",
});

// Search by tag
const tagged = DreamVault.search({
  tag: "architecture",
});

// Search by reference
const dreamItems = DreamVault.search({
  refId: "dream:dreamnet",
});
```

#### `run(context: VaultContext): VaultStatus`

Run vault cycle (updates index, aggregates status).

#### `status(): VaultStatus`

Get current vault status.

---

## Integration Points

### Consumes

- **Dream Cortex**: Links to dreams
- **Identity Grid**: Links to identities
- **Other Systems**: Links via metadata refs

### Produces

- **Vault Items**: Items used by Dream Shop, Dream Tank, etc.

### Integration Pattern

```typescript
// Item creation flow
DreamVault.upsertItem({
  id: "vault:blueprint-123",
  kind: "blueprint",
  refs: [{ type: "dream", id: "dream:dreamnet" }],
})
  → Index updated
  → Dream Shop can link offer to vault item
```

---

## Usage Examples

### Create Blueprint

```typescript
import { DreamVault } from "@dreamnet/dream-vault";

const blueprint = DreamVault.upsertItem({
  id: "vault:api-blueprint",
  kind: "blueprint",
  state: "active",
  title: "API Blueprint",
  description: "REST API blueprint",
  content: JSON.stringify({ endpoints: [...] }),
  tags: ["api", "rest"],
  refs: [
    { type: "dream", id: "dream:api-dream" },
  ],
});
```

### Search Items

```typescript
// Text search
const results = DreamVault.search({
  text: "api",
  limit: 20,
});

// Kind + state filter
const activeBlueprints = DreamVault.search({
  kind: "blueprint",
  state: "active",
});

// Reference search
const dreamItems = DreamVault.search({
  refId: "dream:dreamnet",
});
```

---

## Best Practices

1. **Consistent IDs**: Use consistent ID format (e.g., `vault:kind-id`)
2. **Tags**: Add relevant tags for discoverability
3. **References**: Link items to DreamNet entities via refs
4. **Versioning**: Let system handle versioning automatically
5. **State Management**: Use appropriate states for lifecycle

---

## Security Considerations

- **Content Validation**: Validate content before storing
- **Reference Validation**: Verify referenced entities exist
- **Access Control**: Implement access control for sensitive items
- **Version History**: Consider version history retention policies

---

## Related Systems

- **Dream Shop**: Links offers to vault items
- **Dream Tank**: Links dreams to vault blueprints
- **Dream Cortex**: Links dreams to vault items
- **Zen Garden**: Links sessions to vault rituals

---

**Status**: ✅ Complete  
**Next**: Continue with Dream Tank Core documentation
