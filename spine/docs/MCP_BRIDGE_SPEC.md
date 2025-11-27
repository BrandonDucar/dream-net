# DreamNet MCP Bridge Specification

## Overview

The DreamNet MCP Bridge enables DreamNet to interact with Model Context Protocol (MCP) providers. MCP is a protocol for connecting AI models with external tools and data sources.

## Purpose

The MCP Bridge serves to:
- Connect DreamNet with MCP-compatible providers
- Enable tool execution through MCP
- Manage MCP sessions and contexts
- Bridge MCP tools to DreamNet agents

## Supported MCP Providers

- **OpenAI MCP**: OpenAI's MCP implementation
- **Anthropic MCP**: Anthropic's MCP implementation
- **Cursor MCP**: Cursor IDE's MCP tools
- **Antigravity Tools**: Google Antigravity's tool system
- **Agentforce Tools**: Salesforce Agentforce tools
- **Custom MCP**: Custom MCP implementations

## Core Concepts

### MCP Provider Descriptor

Describes an MCP provider:

```typescript
{
  id: "openai-mcp",
  type: "openai",
  name: "OpenAI MCP",
  endpoint: "https://api.openai.com/mcp",
  auth: {
    type: "api_key",
    config: {
      apiKey: "sk-..."
    }
  },
  capabilities: ["tools", "resources", "prompts"],
  metadata: {
    version: "1.0.0"
  }
}
```

### MCP Tool

Describes a tool available through MCP:

```typescript
{
  id: "tool-123",
  name: "create_dream",
  description: "Create a new dream in DreamNet",
  inputSchema: {
    type: "object",
    properties: {
      title: { type: "string" },
      description: { type: "string" }
    }
  },
  outputSchema: {
    type: "object",
    properties: {
      dreamId: { type: "string" }
    }
  },
  providerId: "openai-mcp"
}
```

### MCP Session Context

Describes a session with an MCP provider:

```typescript
{
  sessionId: "session-123",
  providerId: "openai-mcp",
  startTime: 1234567890,
  metadata: {
    // Session metadata
  },
  state: {
    // Session state
  }
}
```

## MCP Bridge Operations

### Register Provider
```typescript
bridge.registerProvider({
  id: "openai-mcp",
  type: "openai",
  name: "OpenAI MCP",
  endpoint: "https://api.openai.com/mcp"
});
```

### Get Tools
```typescript
const tools = bridge.getTools("openai-mcp");
```

### Execute Tool
```typescript
const response = await bridge.executeTool({
  toolId: "tool-123",
  input: {
    title: "My Dream",
    description: "A great dream"
  }
});
```

### Create Session
```typescript
const session = bridge.createSession("openai-mcp");
```

## Tool Execution Flow

1. **Tool Discovery**: Discover available tools from MCP provider
2. **Tool Registration**: Register tools in DreamNet
3. **Tool Execution**: Execute tool with input
4. **Response Handling**: Handle tool response
5. **Error Handling**: Handle tool errors

## Integration with DreamNet

The MCP Bridge integrates with:
- **Agent Interop Registry**: For provider management
- **Event Bus**: For tool execution events
- **OS Linker**: For runtime management
- **Super Spine**: For agent orchestration

## Current State

All MCP Bridge logic is stubbed. Antigravity will implement:
- MCP provider registration
- Tool discovery and registration
- Tool execution
- Session management
- Error handling
- Integration with DreamNet agents

## Future Enhancements

1. **Tool Caching**: Cache tool definitions for performance
2. **Tool Composition**: Compose multiple tools into workflows
3. **Tool Versioning**: Support multiple versions of tools
4. **Tool Analytics**: Track tool usage and performance
5. **Tool Security**: Implement security policies for tool execution

