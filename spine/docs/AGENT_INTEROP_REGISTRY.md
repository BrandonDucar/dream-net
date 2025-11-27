# Agent Interop Registry Specification

## Overview

The Agent Interop Registry manages different agent providers and enables standardized communication between DreamNet and external agent systems.

## Purpose

The registry serves as a central directory for:
- Registering agent providers (OpenAI, Gemini, Cursor, Antigravity, etc.)
- Standardizing inter-agent communication
- Managing provider capabilities and configurations
- Routing interop requests to appropriate providers

## Provider Types

The registry supports multiple provider types:

- `openai` - OpenAI Agents SDK and OpenAI API
- `gemini` - Google Gemini agents
- `cursor` - Cursor IDE agents
- `antigravity` - Google Antigravity agents
- `slack` - Slack agents/bots
- `salesforce` - Salesforce Agentforce
- `custom` - Custom agent providers

## Provider Descriptor

Each provider is described by a `ProviderDescriptor`:

```typescript
{
  id: "openai-main",
  type: "openai",
  name: "OpenAI Main",
  version: "1.0.0",
  endpoint: "https://api.openai.com",
  auth: {
    type: "api_key",
    config: {
      apiKey: "sk-..."
    }
  },
  capabilities: ["chat", "completions", "embeddings", "function_calling"],
  config: {
    defaultModel: "gpt-4o",
    maxTokens: 4096
  }
}
```

## Interop Request Format

Standardized request format for agent communication:

```typescript
{
  id: "request-123",
  sourceAgent: "dreamnet-lucid",
  targetAgent: "openai-assistant", // optional for broadcast
  type: "task" | "query" | "capability" | "status" | "event",
  payload: {
    // Request-specific data
  },
  metadata: {
    priority: 100,
    timeout: 5000,
    retries: 3
  },
  timestamp: 1234567890
}
```

## Interop Response Format

Standardized response format:

```typescript
{
  requestId: "request-123",
  agentId: "openai-assistant",
  status: "success" | "error" | "pending" | "rejected",
  payload: {
    // Response data
  },
  error: {
    code: "RATE_LIMIT",
    message: "Rate limit exceeded",
    details: {}
  },
  timestamp: 1234567890
}
```

## Provider Stubs

Each provider has a stub implementation:

### OpenAI Provider
- Supports OpenAI Agents SDK (`@openai/agents`)
- Supports OpenAI SDK (`openai`)
- Supports OpenAI CLI
- See `OPENAI_AGENTS_INTEGRATION.md` for details

### Gemini Provider
- Supports Google Gemini API
- Supports Vertex AI agents
- Multi-modal capabilities

### Cursor Provider
- Integrates with Cursor IDE agents
- Code-focused capabilities
- Editor integration

### Antigravity Provider
- Google Antigravity IDE agents
- Multi-agent orchestration
- Browser automation

### Slack Provider
- Slack bot integration
- Message handling
- Workflow automation

### Salesforce Provider
- Salesforce Agentforce integration
- CRM automation
- Business process automation

## Registry Operations

### Register Provider
```typescript
registry.registerProvider({
  id: "openai",
  type: "openai",
  name: "OpenAI",
  auth: { type: "api_key", config: { apiKey: "sk-..." } }
});
```

### Get Provider
```typescript
const provider = registry.getProvider("openai");
```

### Get Providers by Type
```typescript
const openaiProviders = registry.getProvidersByType("openai");
```

### Send Interop Request
```typescript
const response = await registry.sendRequest({
  id: "req-1",
  sourceAgent: "dreamnet-lucid",
  targetAgent: "openai-assistant",
  type: "task",
  payload: { task: "generate code" },
  timestamp: Date.now()
});
```

## Integration Points

The registry integrates with:
- **Spine for agent discovery
- Agent BGP for routing decisions
- Event Bus for interop events
- OS Linker for runtime management

## Current State

All registry methods are stubbed. Antigravity will implement:
- Provider registration and management
- Request routing and execution
- Response handling and error management
- Provider health monitoring
- Capability discovery
- Authentication handling

## Future Enhancements

1. **Provider Health Monitoring**: Track provider availability and performance
2. **Automatic Failover**: Switch to backup providers on failure
3. **Load Balancing**: Distribute requests across multiple providers
4. **Cost Tracking**: Monitor API usage and costs per provider
5. **Rate Limiting**: Enforce rate limits per provider
6. **Caching**: Cache responses for common requests

