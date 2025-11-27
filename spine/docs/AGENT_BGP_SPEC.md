# Agent BGP Specification

## Overview

Agent BGP (Border Gateway Protocol for Agents) is a routing system for agents inspired by the Border Gateway Protocol used in internet routing. It enables intelligent routing of agent tasks across different agent systems.

## BGP Analogy

Just as BGP routes internet traffic between Autonomous Systems (AS), Agent BGP routes agent tasks between Agent Autonomous Systems:

| Internet BGP | Agent BGP |
|-------------|-----------|
| Autonomous System (AS) | Agent System (e.g., "dreamnet-lucid", "antigravity-core") |
| IP Prefix | Agent Prefix (e.g., "code.generation", "data.analysis") |
| Route Announcement | Agent Route Announcement |
| Next Hop | Agent Next Hop |
| AS Path | Agent Path (list of agent systems) |
| BGP Capabilities | Agent Capabilities |

## Core Concepts

### Agent Prefix

An Agent Prefix identifies a capability or service namespace. Examples:
- `code.generation` - Code generation tasks
- `data.analysis` - Data analysis tasks
- `deployment.automation` - Deployment automation
- `security.threat_detection` - Security threat detection

### Agent Autonomous System

An Agent Autonomous System is a unique identifier for an agent system:
- `dreamnet-lucid` - DreamNet's LUCID agent
- `dreamnet-wolf-pack` - DreamNet's Wolf Pack
- `antigravity-core` - Antigravity core agents
- `openai-assistant` - OpenAI Assistant agents
- `gemini-agent` - Google Gemini agents

### Agent Route

An Agent Route describes how to reach an agent that can handle a specific prefix:

```typescript
{
  prefix: "code.generation",
  agentSystem: "dreamnet-lucid",
  path: ["dreamnet-lucid"],
  nextHop: {
    agentSystem: "dreamnet-lucid",
    priority: 100,
    cost: 1
  },
  originTime: 1234567890
}
```

### Route Announcement

Agent systems announce their capabilities via Route Announcements:

```typescript
{
  id: "announcement-123",
  agentSystem: "dreamnet-lucid",
  routes: [
    {
      prefix: "code.generation",
      agentSystem: "dreamnet-lucid",
      path: ["dreamnet-lucid"],
      nextHop: { agentSystem: "dreamnet-lucid" }
    }
  ],
  timestamp: 1234567890
}
```

### Next Hop

The Next Hop indicates where to route a request next. In simple cases, it's the destination agent. In complex routing, it might be an intermediate agent.

### Capabilities Exchange

Agents exchange capability information to discover what each agent can do:

```typescript
{
  capabilities: ["code", "analysis", "deployment"],
  version: "1.0.0",
  metadata: {
    maxConcurrency: 10,
    supportedLanguages: ["typescript", "python"]
  }
}
```

## Routing Strategies

The Spine defines several routing strategies (all stubs for now):

1. **Shortest Path Strategy**: Routes to agent with shortest path
2. **Lowest Cost Strategy**: Routes to agent with lowest cost
3. **Highest Priority Strategy**: Routes to agent with highest priority
4. **Weighted Strategy**: Uses weighted combination of factors

## How It Works (Future Implementation)

1. **Discovery**: Agents announce their capabilities via route announcements
2. **Route Table**: The route table stores all known routes
3. **Route Selection**: When a task arrives, the router selects the best route
4. **Forwarding**: The task is forwarded to the selected agent
5. **Path Tracking**: The full path is tracked for debugging and optimization

## Integration with DreamNet

Agent BGP will integrate with:
- **Super Spine**: For agent discovery and registration
- **Spider Web Core**: For event routing
- **Agent Interop Registry**: For provider management
- **Event Bus**: For route announcements and updates

## Example Flow (Future)

```
1. User requests: "Generate code for a React component"
2. Router looks up prefix: "code.generation"
3. Route table returns: [dreamnet-lucid, openai-assistant]
4. Router selects: dreamnet-lucid (shortest path)
5. Task forwarded to: dreamnet-lucid
6. Response routed back to user
```

## Benefits

1. **Intelligent Routing**: Tasks go to the best agent for the job
2. **Load Balancing**: Distribute tasks across multiple agents
3. **Fault Tolerance**: Automatic failover if an agent is unavailable
4. **Scalability**: Easy to add new agent systems
5. **Transparency**: Full visibility into routing decisions

## Current State

All routing logic is stubbed. Antigravity will implement:
- Route table management
- Route announcement processing
- Route selection algorithms
- Integration with Super Spine
- Real-time route updates

