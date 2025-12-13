# Agent SuperAGI - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Agent SuperAGI provides **agent marketplace integration** for DreamNet's Agent Foundry vertical. It integrates with SuperAGI marketplace patterns for agent discovery, template browsing, and agent deployment, enabling users to discover and deploy pre-built agent templates.

---

## Key Features

### Agent Marketplace
- Template browsing
- Category filtering
- Template details
- Agent deployment

### API Integration
- SuperAGI API integration
- Template management
- Agent instance management
- Error handling

---

## Architecture

### Components

1. **SuperAGI Marketplace** (`SuperAGIMarketplace.ts`)
   - API client wrapper
   - Template operations
   - Agent deployment

---

## API Reference

### Initialization

#### `new SuperAGIMarketplace(config?: SuperAGIConfig): SuperAGIMarketplace`
Creates SuperAGI marketplace client instance.

**Example**:
```typescript
import { SuperAGIMarketplace } from '@dreamnet/agent-superagi';

const marketplace = new SuperAGIMarketplace({
  apiUrl: 'https://api.superagi.com',
  apiKey: process.env.SUPERAGI_API_KEY,
});
```

### Template Operations

#### `browseTemplates(category?: string, limit?: number): Promise<AgentTemplate[]>`
Browses agent templates.

**Example**:
```typescript
const templates = await marketplace.browseTemplates('research', 20);
templates.forEach(template => {
  console.log(`${template.name}: ${template.description}`);
});
```

#### `getTemplate(templateId: string): Promise<AgentTemplate | null>`
Gets template by ID.

**Example**:
```typescript
const template = await marketplace.getTemplate('template-id');
if (template) {
  console.log(`Tools: ${template.tools.join(', ')}`);
}
```

### Agent Deployment

#### `deployAgent(templateId: string, config: Record<string, any>): Promise<{ success: boolean; agentId?: string; error?: string }>`
Deploys agent from template.

**Example**:
```typescript
const result = await marketplace.deployAgent('template-id', {
  name: 'My Agent',
  config: {},
});

if (result.success) {
  console.log(`Agent deployed: ${result.agentId}`);
}
```

---

## Data Models

### SuperAGIConfig

```typescript
interface SuperAGIConfig {
  apiUrl?: string;
  apiKey?: string;
}
```

### AgentTemplate

```typescript
interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tools: string[];
  config: Record<string, any>;
  author: string;
  downloads: number;
  rating?: number;
}
```

### AgentInstance

```typescript
interface AgentInstance {
  id: string;
  templateId: string;
  name: string;
  status: "running" | "stopped" | "error";
  createdAt: number;
  config: Record<string, any>;
}
```

---

## Integration Points

### DreamNet Systems
- **Agent Foundry**: Agent creation vertical
- **Agent Registry Core**: Agent registration
- **Dream Vault**: Agent templates
- **Dream Shop**: Agent marketplace

---

## Usage Examples

### Browse and Deploy Agent

```typescript
const marketplace = new SuperAGIMarketplace({
  apiKey: process.env.SUPERAGI_API_KEY,
});

const templates = await marketplace.browseTemplates('research');
const template = templates[0];

const result = await marketplace.deployAgent(template.id, {
  name: 'Research Agent',
});
```

---

## Best Practices

1. **Template Selection**
   - Review template details
   - Check ratings and downloads
   - Verify tool compatibility
   - Test templates

2. **Agent Deployment**
   - Configure properly
   - Monitor deployment
   - Handle errors
   - Track instances

---

## Security Considerations

1. **API Security**
   - Secure API keys
   - Validate configurations
   - Monitor usage
   - Control access

2. **Agent Security**
   - Validate templates
   - Review permissions
   - Monitor execution
   - Audit deployments

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

