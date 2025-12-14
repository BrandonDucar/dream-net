# Sync Automerge Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Sync Automerge Core provides **collaborative document editing** using Automerge CRDTs. It enables conflict-free collaborative editing, document history tracking, and snapshot management.

---

## Key Features

### Collaborative Editing
- Conflict-free replicated data types (CRDTs)
- Real-time collaboration
- Automatic conflict resolution
- Document merging

### Document Management
- Document creation
- Document updates
- History tracking
- Snapshot management

### Lineage Tracking
- Document lineage
- Change tracking
- Version history
- Branch management

---

## Architecture

### Components

1. **Automerge Provider** (`src/AutomergeProvider.ts`)
   - Document management
   - Change tracking
   - Merge operations

2. **Automerge Snapshotter** (`src/AutomergeSnapshotter.ts`)
   - Snapshot creation
   - Snapshot loading
   - Snapshot metadata

3. **Automerge Lineage** (`src/AutomergeLineage.ts`)
   - Lineage tracking
   - Version history
   - Branch management

---

## API Reference

### Document Creation

#### `new AutomergeProvider(documentId: string, initialDoc?: AutomergeDoc): AutomergeProvider`
Creates a new Automerge provider.

**Example**:
```typescript
import { AutomergeProvider } from '@dreamnet/sync-automerge-core';

const provider = new AutomergeProvider('doc-123', {
  title: 'My Document',
  content: 'Initial content',
  author: 'user-123',
});
```

### Document Operations

#### `getDocument(): Automerge.Doc<AutomergeDoc>`
Gets the Automerge document.

#### `update(changeFn: (doc: AutomergeDoc) => void): Automerge.Doc<AutomergeDoc>`
Updates the document.

**Example**:
```typescript
provider.update(doc => {
  doc.content = 'Updated content';
  doc.updatedAt = Date.now();
});
```

#### `merge(otherDoc: Automerge.Doc<AutomergeDoc>): Automerge.Doc<AutomergeDoc>`
Merges with another document.

#### `getHistory(): Automerge.Change[]`
Gets document history.

### Snapshots

#### `createSnapshot(): Automerge.BinaryDocument`
Creates a snapshot.

#### `loadSnapshot(snapshot: Automerge.BinaryDocument): void`
Loads from snapshot.

---

## Data Models

### AutomergeDoc

```typescript
interface AutomergeDoc {
  [key: string]: any;
}
```

### AutomergeProviderConfig

```typescript
interface AutomergeProviderConfig {
  documentId: string;
  initialDoc?: AutomergeDoc;
}
```

---

## CRDT Features

### Conflict-Free
- Automatic conflict resolution
- No manual merging needed
- Deterministic results
- Order-independent

### Collaborative
- Multiple users can edit simultaneously
- Changes merge automatically
- No locking required
- Real-time updates

### History
- Complete change history
- Reversible operations
- Version tracking
- Audit trail

---

## Integration Points

### DreamNet Systems
- **Shared Memory**: Document storage
- **Nervous System**: Document events
- **Neural Mesh**: Document patterns

### External Systems
- **WebSocket**: Real-time sync
- **Storage**: Snapshot persistence
- **Frontend**: UI integration

---

## Usage Examples

### Create Document

```typescript
import { AutomergeProvider } from '@dreamnet/sync-automerge-core';

const provider = new AutomergeProvider('doc-123', {
  title: 'Collaborative Document',
  content: 'Initial content',
  author: 'user-123',
  createdAt: Date.now(),
});
```

### Update Document

```typescript
provider.update(doc => {
  doc.content = 'Updated content';
  doc.updatedAt = Date.now();
  doc.version = (doc.version || 0) + 1;
});
```

### Merge Documents

```typescript
const otherProvider = new AutomergeProvider('doc-456', {
  title: 'Other Document',
  content: 'Other content',
});

const merged = provider.merge(otherProvider.getDocument());
```

### Create Snapshot

```typescript
const snapshot = provider.createSnapshot();
// Save snapshot to storage
await saveSnapshot('doc-123', snapshot);
```

### Load Snapshot

```typescript
const snapshot = await loadSnapshot('doc-123');
provider.loadSnapshot(snapshot);
```

---

## Best Practices

1. **Document Design**
   - Use structured data
   - Keep documents focused
   - Use appropriate types
   - Document schema

2. **Collaboration**
   - Handle conflicts gracefully
   - Merge regularly
   - Track changes
   - Communicate updates

3. **Snapshots**
   - Create snapshots regularly
   - Store snapshots securely
   - Version snapshots
   - Restore from snapshots

---

## Security Considerations

1. **Document Security**
   - Validate document data
   - Sanitize user input
   - Control access
   - Audit changes

2. **Merge Security**
   - Validate merged documents
   - Check merge permissions
   - Prevent malicious merges
   - Audit merges

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

