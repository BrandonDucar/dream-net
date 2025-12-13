# Vertex Agent Integration - Complete Documentation

**Package**: `@dreamnet/vertex-agent-integration`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Vertex Agent Integration provides **production-grade agent orchestration** with IAM identities and Memory Bank. It enables secure agent creation, long-term memory storage, and observability.

### Key Features

- **IAM-Based Identities**: Least-privilege agent identities
- **Memory Bank**: Long-term memory storage and retrieval
- **Observability**: Sessions, logs, and traces
- **Express Mode**: Free-tier runtime support
- **Session Management**: Create and manage agent sessions

---

## API Reference

### Types

```typescript
export interface AgentIdentity {
  agentId: string;
  iamRole: string;
  permissions: string[];
  serviceAccount?: string;
}

export interface AgentConfig {
  agentId: string;
  name: string;
  description: string;
  identity: AgentIdentity;
  tools: string[];
  memoryBankId?: string;
}

export interface MemoryBank {
  id: string;
  name: string;
  description: string;
  context: Record<string, any>;
  memories: Memory[];
}

export interface Memory {
  id: string;
  timestamp: number;
  content: string;
  metadata?: Record<string, any>;
}

export interface AgentSession {
  sessionId: string;
  agentId: string;
  startTime: number;
  endTime?: number;
  interactions: Interaction[];
  metadata?: Record<string, any>;
}
```

### Main Export

#### `VertexAgentIntegration`

**Methods**:
- **`createAgent(config): Promise<Agent>`**
- **`storeMemory(memoryBankId, memory): Promise<void>`**
- **`retrieveMemories(memoryBankId, query, limit?): Promise<Memory[]>`**
- **`createSession(agentId, metadata?): AgentSession`**
- **`getActiveSessions(): AgentSession[]`**
- **`status(): VertexAgentStatus`**

---

**Status**: ✅ Implemented

