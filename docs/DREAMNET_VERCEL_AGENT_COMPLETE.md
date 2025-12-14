# DreamNet Vercel Agent - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

DreamNet Vercel Agent provides **Vercel deployment management** for DreamNet. It manages Vercel projects, analyzes cleanup opportunities, executes cleanup actions, and helps maintain a clean deployment environment.

---

## Key Features

### Vercel Management
- Project listing
- Project retrieval
- Deployment tracking
- Status monitoring

### Cleanup Analysis
- Cleanup opportunity analysis
- Project analysis
- Deployment analysis
- Domain analysis

### Cleanup Execution
- Dry-run mode
- Action execution
- Project deletion
- Deployment cleanup

---

## Architecture

### Components

1. **DreamNet Vercel Agent** (`index.ts`)
   - Main API
   - Project management
   - Cleanup operations
   - Status management

2. **Vercel Client** (`logic/vercelClient.ts`)
   - Vercel API integration
   - Project operations
   - Deployment operations

3. **Cleanup Agent** (`logic/cleanupAgent.ts`)
   - Cleanup analysis
   - Action execution
   - Cleanup logic

---

## API Reference

### Initialization

#### `init(): Promise<boolean>`
Initializes Vercel agent.

**Example**:
```typescript
import { DreamNetVercelAgent } from '@dreamnet/dreamnet-vercel-agent';

const initialized = await DreamNetVercelAgent.init();
if (initialized) {
  console.log('Vercel agent initialized');
}
```

### Project Operations

#### `listProjects(): Promise<VercelProject[]>`
Lists all projects.

**Example**:
```typescript
const projects = await DreamNetVercelAgent.listProjects();
console.log(`Found ${projects.length} projects`);
projects.forEach(project => {
  console.log(`- ${project.name} (${project.id})`);
});
```

#### `getProject(name: string): Promise<VercelProject | null>`
Gets project by name.

**Example**:
```typescript
const project = await DreamNetVercelAgent.getProject('my-project');
if (project) {
  console.log(`Project: ${project.name}`);
  console.log(`Updated: ${new Date(project.updatedAt)}`);
}
```

### Cleanup Operations

#### `analyzeCleanup(targetDomain?: string): Promise<CleanupAction[]>`
Analyzes cleanup opportunities.

**Example**:
```typescript
const actions = await DreamNetVercelAgent.analyzeCleanup('example.com');
actions.forEach(action => {
  console.log(`${action.type}: ${action.target} - ${action.reason}`);
});
```

#### `executeCleanup(actions: CleanupAction[], dryRun: boolean = true)`
Executes cleanup (dry-run by default).

**Example**:
```typescript
const actions = await DreamNetVercelAgent.analyzeCleanup();

// Dry run first
await DreamNetVercelAgent.executeCleanup(actions, true);

// Execute if dry run looks good
await DreamNetVercelAgent.executeCleanup(actions, false);
```

#### `executeAction(action: CleanupAction): Promise<boolean>`
Executes single cleanup action.

**Example**:
```typescript
const action = {
  type: 'delete_project',
  target: 'old-project',
  reason: 'Unused project',
};

const success = await DreamNetVercelAgent.executeAction(action);
if (success) {
  console.log('Action executed');
}
```

### Status

#### `status(): Promise<VercelAgentStatus>`
Gets status.

**Example**:
```typescript
const status = await DreamNetVercelAgent.status();
console.log(`Initialized: ${status.initialized}`);
console.log(`Projects found: ${status.projectsFound}`);
console.log(`Deployments found: ${status.deploymentsFound}`);
```

---

## Data Models

### VercelConfig

```typescript
interface VercelConfig {
  token: string; // Vercel API token
  teamId?: string; // Optional team ID
}
```

### VercelProject

```typescript
interface VercelProject {
  id: string;
  name: string;
  accountId: string;
  updatedAt: number;
  createdAt: number;
  latestDeployment?: {
    id: string;
    url: string;
    createdAt: number;
  };
}
```

### VercelDeployment

```typescript
interface VercelDeployment {
  id: string;
  url: string;
  name: string;
  state: "READY" | "BUILDING" | "ERROR" | "CANCELED" | "QUEUED";
  createdAt: number;
  target?: "production" | "staging" | null;
  alias?: string[];
}
```

### VercelAgentStatus

```typescript
interface VercelAgentStatus {
  initialized: boolean;
  projectsFound: number;
  deploymentsFound: number;
  lastSyncAt: number | null;
}
```

### CleanupAction

```typescript
interface CleanupAction {
  type: "delete_deployment" | "delete_project" | "update_domain" | "create_deployment";
  target: string;
  reason: string;
  metadata?: Record<string, any>;
}
```

---

## Cleanup Action Types

### Delete Deployment
- Removes old deployments
- Frees up resources
- Cleans up unused deployments

### Delete Project
- Removes unused projects
- Frees up project slots
- Cleans up abandoned projects

### Update Domain
- Updates domain configuration
- Fixes domain issues
- Optimizes domain setup

### Create Deployment
- Creates new deployments
- Updates existing deployments
- Manages deployment lifecycle

---

## Configuration

### Environment Variables
- `VERCEL_TOKEN`: Vercel API token
- `VERCEL_TEAM_ID`: Optional team ID

### Configuration Loading
- Loads from environment variables
- Validates configuration
- Stores configuration
- Provides status

---

## Integration Points

### DreamNet Systems
- **DreamNet OS Core**: Deployment management
- **DreamNet Audit Core**: Cleanup audit logging
- **DreamNet Cost Core**: Cost tracking
- **DreamNet Health Core**: Health monitoring

### External Systems
- **Vercel API**: Vercel platform
- **Deployment Systems**: Deployment tracking

---

## Usage Examples

### List Projects

```typescript
const projects = await DreamNetVercelAgent.listProjects();
```

### Analyze Cleanup

```typescript
const actions = await DreamNetVercelAgent.analyzeCleanup('example.com');
```

### Execute Cleanup

```typescript
// Dry run
await DreamNetVercelAgent.executeCleanup(actions, true);

// Execute
await DreamNetVercelAgent.executeCleanup(actions, false);
```

---

## Best Practices

1. **Cleanup Management**
   - Always dry run first
   - Review actions carefully
   - Monitor cleanup results
   - Track cleanup history

2. **Project Management**
   - Regular cleanup analysis
   - Monitor project usage
   - Track deployments
   - Optimize resources

---

## Security Considerations

1. **API Security**
   - Protect Vercel token
   - Validate actions
   - Audit cleanup operations
   - Monitor access

2. **Cleanup Security**
   - Verify actions before execution
   - Prevent accidental deletion
   - Backup before cleanup
   - Track all changes

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

