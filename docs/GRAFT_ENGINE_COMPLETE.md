# Graft Engine - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Graft Engine provides **plugin/module system** for DreamNet, enabling dynamic installation of agents, endpoints, UI components, modules, tasks, and configurations. It includes validation, installation, and event broadcasting capabilities.

---

## Key Features

### Graft Types
- **Agent**: Agent plugins
- **Endpoint**: API endpoints
- **UI**: UI components
- **Module**: Code modules
- **Task**: Task definitions
- **Config**: Configuration files

### Graft Lifecycle
- **Pending**: Submitted, awaiting validation
- **Validated**: Passed validation
- **Installed**: Successfully installed
- **Failed**: Installation failed

### Graft Management
- Graft submission
- Graft validation
- Graft installation
- Graft registry
- Event broadcasting

---

## Architecture

### Components

1. **Graft Engine** (`graftEngine.ts`)
   - Graft submission
   - Graft validation
   - Graft installation
   - Event handling

2. **Validators** (`validators/`)
   - EndpointValidator
   - AgentValidator
   - UIValidator
   - ModuleValidator

3. **Processors** (`processors/`)
   - EndpointProcessor
   - AgentProcessor
   - UIProcessor
   - ModuleProcessor

4. **Registry** (`registry.ts`)
   - Graft storage
   - Graft lookup
   - Status updates
   - Graft management

---

## API Reference

### Graft Submission

#### `submitGraft(partial: Partial<GraftModel>): Promise<GraftModel>`
Submits a graft for installation.

**Example**:
```typescript
import { submitGraft } from '@dreamnet/graft-engine';

const graft = await submitGraft({
  type: 'agent',
  name: 'my-agent',
  path: '/path/to/agent',
  metadata: {
    description: 'Custom agent',
    version: '1.0.0',
  },
});

console.log(`Graft ID: ${graft.id}`);
console.log(`Status: ${graft.status}`);
```

### Graft Validation

#### `validateGraft(graft: GraftModel): Promise<ValidationResult>`
Validates a graft.

**Example**:
```typescript
import { validateGraft } from '@dreamnet/graft-engine';

const result = await validateGraft(graft);
if (result.ok) {
  console.log('Graft validated');
} else {
  console.error(`Validation issues: ${result.issues.join(', ')}`);
}
```

### Graft Installation

#### `installGraft(graft: GraftModel): Promise<void>`
Installs a graft.

**Example**:
```typescript
import { installGraft } from '@dreamnet/graft-engine';

await installGraft(graft);
console.log('Graft installed');
```

#### `applyGraft(graftId: string): Promise<void>`
Applies a graft (validates and installs).

**Example**:
```typescript
import { applyGraft } from '@dreamnet/graft-engine';

await applyGraft('graft-id');
```

### Graft Registry

#### `getGraftById(id: string): Promise<GraftModel | null>`
Gets graft by ID.

**Example**:
```typescript
import { getGraftById } from '@dreamnet/graft-engine';

const graft = await getGraftById('graft-id');
if (graft) {
  console.log(`Graft: ${graft.name}`);
  console.log(`Status: ${graft.status}`);
}
```

#### `getGrafts(): Promise<GraftModel[]>`
Gets all grafts.

**Example**:
```typescript
import { getGrafts } from '@dreamnet/graft-engine';

const grafts = await getGrafts();
console.log(`Total grafts: ${grafts.length}`);
```

#### `updateGraftStatus(id: string, status: GraftStatus, updates?: Partial<GraftModel>): Promise<void>`
Updates graft status.

**Example**:
```typescript
import { updateGraftStatus } from '@dreamnet/graft-engine';

await updateGraftStatus('graft-id', 'installed', {
  logs: ['Installation successful'],
});
```

---

## Data Models

### GraftModel

```typescript
interface GraftModel {
  id: string;
  type: GraftType;
  name: string;
  path: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  status: GraftStatus;
  error?: string | null;
  logs?: string[];
}
```

### GraftType

```typescript
type GraftType = "agent" | "endpoint" | "ui" | "module" | "task" | "config";
```

### GraftStatus

```typescript
type GraftStatus = "pending" | "validated" | "installed" | "failed";
```

### ValidationResult

```typescript
interface ValidationResult {
  ok: boolean;
  issues: string[];
}
```

### InstallResult

```typescript
interface InstallResult {
  ok: boolean;
  message?: string;
  logs?: string[];
}
```

---

## Graft Types Explained

### Agent
- Agent plugins
- Custom agents
- Agent capabilities
- Agent integration

### Endpoint
- API endpoints
- Route handlers
- API extensions
- Endpoint integration

### UI
- UI components
- Frontend modules
- Component libraries
- UI extensions

### Module
- Code modules
- Library modules
- Shared code
- Module integration

### Task
- Task definitions
- Workflow tasks
- Task automation
- Task scheduling

### Config
- Configuration files
- Settings
- Environment configs
- Config management

---

## Integration Points

### DreamNet Systems
- **Event Wormholes**: Event broadcasting
- **Memory DNA**: Trait updates
- **Agent Registry Core**: Agent registration
- **DreamNet Audit Core**: Audit logging

### External Systems
- **File System**: Graft storage
- **Package Managers**: Module installation

---

## Usage Examples

### Submit Graft

```typescript
const graft = await submitGraft({
  type: 'agent',
  name: 'custom-agent',
  path: '/path/to/agent',
});
```

### Validate and Install

```typescript
const validation = await validateGraft(graft);
if (validation.ok) {
  await installGraft(graft);
}
```

### Apply Graft

```typescript
await applyGraft('graft-id');
```

---

## Best Practices

1. **Graft Development**
   - Follow graft type patterns
   - Include proper metadata
   - Validate before submission
   - Test installation

2. **Graft Management**
   - Monitor graft status
   - Handle failures gracefully
   - Track installation logs
   - Update status appropriately

---

## Security Considerations

1. **Graft Security**
   - Validate graft content
   - Sanitize inputs
   - Prevent malicious grafts
   - Audit installations

2. **Installation Security**
   - Secure file paths
   - Validate permissions
   - Monitor installations
   - Handle errors securely

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

