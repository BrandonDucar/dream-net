# Sync Yjs Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Sync Yjs Core provides **collaborative editing** using Yjs CRDTs. It enables real-time collaboration, document synchronization, and persistence with support for text, maps, arrays, and rich text editing.

---

## Key Features

### Collaborative Editing
- Conflict-free replicated data types (CRDTs)
- Real-time synchronization
- Automatic conflict resolution
- Multi-user collaboration

### Data Types
- Text (rich text editing)
- Maps (key-value storage)
- Arrays (ordered lists)
- Canvas (drawing/collaboration)
- TipTap integration

### Persistence
- IndexedDB persistence
- Automatic persistence
- Offline support
- Sync on reconnect

---

## Architecture

### Components

1. **Yjs Provider** (`src/YjsProvider.ts`)
   - Document management
   - Type access
   - Provider connection

2. **Yjs Storage** (`src/YjsStorage.ts`)
   - IndexedDB persistence
   - Storage management
   - Sync coordination

3. **Yjs TipTap** (`src/YjsTipTap.ts`)
   - Rich text editing
   - TipTap integration
   - Collaborative editing

4. **Yjs Canvas** (`src/YjsCanvas.ts`)
   - Canvas collaboration
   - Drawing synchronization
   - Multi-user drawing

---

## API Reference

### Provider Creation

#### `new YjsProvider(config: YjsProviderConfig): YjsProvider`
Creates a new Yjs provider.

**Example**:
```typescript
import { YjsProvider } from '@dreamnet/sync-yjs-core';

const provider = new YjsProvider({
  documentId: 'doc-123',
  roomName: 'room-123',
  enablePersistence: true,
});
```

### Document Access

#### `getDocument(): Y.Doc`
Gets the Yjs document.

#### `getText(name: string): Y.Text`
Gets a text type.

**Example**:
```typescript
const text = provider.getText('content');
text.insert(0, 'Hello');
text.insert(5, ' World');
```

#### `getMap(name: string): Y.Map<any>`
Gets a map type.

**Example**:
```typescript
const map = provider.getMap('metadata');
map.set('title', 'My Document');
map.set('author', 'user-123');
```

#### `getArray(name: string): Y.Array<any>`
Gets an array type.

**Example**:
```typescript
const array = provider.getArray('items');
array.insert(0, ['item1', 'item2']);
array.push(['item3']);
```

### Provider Connection

#### `connect(providerUrl: string): void`
Connects to a provider (WebSocket, etc.).

**Note**: Implementation pending - Antigravity will implement WebSocket provider.

#### `disconnect(): void`
Disconnects from provider.

#### `destroy(): void`
Destroys provider and cleans up.

---

## Data Models

### YjsProviderConfig

```typescript
interface YjsProviderConfig {
  documentId: string;
  roomName?: string;
  enablePersistence?: boolean;
}
```

---

## Yjs Data Types

### Text
- Rich text editing
- Collaborative text
- Character-level CRDT
- TipTap integration

### Map
- Key-value storage
- Collaborative maps
- Nested structures
- Type-safe access

### Array
- Ordered lists
- Collaborative arrays
- Insert/delete operations
- Index-based access

### Canvas
- Drawing collaboration
- Multi-user drawing
- Shape synchronization
- Real-time updates

---

## Persistence

### IndexedDB
- Automatic persistence
- Offline support
- Sync on reconnect
- Storage management

### Storage Structure
- Document-based storage
- Change tracking
- Sync state
- Metadata

---

## Integration Points

### DreamNet Systems
- **Shared Memory**: Document storage
- **Nervous System**: Document events
- **Neural Mesh**: Document patterns

### External Systems
- **WebSocket**: Real-time sync (pending)
- **TipTap**: Rich text editing
- **Frontend**: UI integration

---

## Usage Examples

### Create Provider

```typescript
import { YjsProvider } from '@dreamnet/sync-yjs-core';

const provider = new YjsProvider({
  documentId: 'doc-123',
  roomName: 'room-123',
  enablePersistence: true,
});
```

### Use Text Type

```typescript
const text = provider.getText('content');

// Insert text
text.insert(0, 'Hello');
text.insert(5, ' World');

// Observe changes
text.observe((event) => {
  console.log('Text changed:', text.toString());
});

// Get text
const content = text.toString();
```

### Use Map Type

```typescript
const map = provider.getMap('metadata');

// Set values
map.set('title', 'My Document');
map.set('author', 'user-123');
map.set('createdAt', Date.now());

// Observe changes
map.observe((event) => {
  console.log('Map changed:', map.toJSON());
});

// Get values
const title = map.get('title');
const metadata = map.toJSON();
```

### Use Array Type

```typescript
const array = provider.getArray('items');

// Insert items
array.insert(0, ['item1', 'item2']);
array.push(['item3']);

// Observe changes
array.observe((event) => {
  console.log('Array changed:', array.toArray());
});

// Get items
const items = array.toArray();
```

---

## Best Practices

1. **Document Design**
   - Use appropriate types
   - Structure data clearly
   - Name types descriptively
   - Document schema

2. **Collaboration**
   - Handle conflicts gracefully
   - Sync regularly
   - Track changes
   - Communicate updates

3. **Persistence**
   - Enable persistence for important documents
   - Monitor storage usage
   - Clean up unused documents
   - Backup documents

---

## Security Considerations

1. **Document Security**
   - Validate document data
   - Sanitize user input
   - Control access
   - Audit changes

2. **Sync Security**
   - Secure WebSocket connections
   - Validate sync data
   - Prevent malicious updates
   - Audit sync operations

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

