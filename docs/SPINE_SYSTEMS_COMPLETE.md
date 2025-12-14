# DreamNet Spine Systems - Complete Documentation

**Status**: ✅ Complete  
**Last Updated**: 2025-01-27  
**Total Spine Systems**: 7 systems

---

## Overview

The **DreamNet Interop Spine** is the foundational backbone layer that provides unified interfaces for agent interoperability, routing, and orchestration. It acts as the "super-brain" of DreamNet, enabling different agent systems to communicate and collaborate seamlessly.

**Current State**: The Spine is currently **pure scaffolding** - types, interfaces, and empty class stubs. This is intentional - it provides the structure that Antigravity and other advanced systems will later fill with real logic.

**Location**: `spine/` directory

---

## Spine Architecture

The Spine consists of 7 key systems:

1. **Agent BGP** - Border Gateway Protocol for Agents (routing)
2. **Agent Interop Registry** - Provider management (OpenAI, Gemini, Cursor, etc.)
3. **DreamNet OS Linker** - Runtime environment compatibility layer
4. **DreamNet Event Bus** - Pub/sub system for agent communication
5. **DreamNet MCP Bridge** - Model Context Protocol bridge
6. **Wrappers Layer** - Thin wrappers around DreamNet subsystems
7. **Agent Protocols** - Protocol registry (HTTP, WebSocket, gRPC, etc.)

---

## HOW: Spine Initialization

### WHERE: `spine/index.ts` - Root Barrel Export

**HOW**: The Spine exports all components but is **NOT imported into `client/` or `server/` yet**. This is intentional - it's scaffolding waiting for Antigravity to fill with logic.

**Current State**:
- ✅ Types, interfaces, and empty class stubs
- ✅ Well-documented structure
- ✅ Type-safe exports
- ❌ No real logic or side effects
- ❌ No network calls or database operations
- ❌ Not imported into production code yet

**WHY**: Safe scaffolding that won't break existing systems

---

## 1. Agent BGP (Border Gateway Protocol for Agents)

### WHAT

Agent routing system inspired by internet BGP

**WHERE**: `spine/bgp-for-agents/`

**Components**:
- `AgentBGP.ts` - Core BGP types and interfaces
- `RouteTable.ts` - Route table management
- `RouteAnnouncements.ts` - Route announcement/withdrawal
- `RoutingStrategies.ts` - Routing algorithms (shortest path, lowest cost, etc.)

**HOW**:
```typescript
import { RouteTable, announceRoute, ShortestPathStrategy } from "spine/bgp-for-agents";

// Create route table
const routeTable = new RouteTable();

// Announce route
announceRoute(routeTable, {
  prefix: "agent:wolf-pack",
  asn: "AS100",
  nextHop: "agent:super-spine",
  capabilities: ["funding", "outreach"],
});

// Route with strategy
const route = routeTable.findRoute("agent:wolf-pack", new ShortestPathStrategy());
```

**Key Concepts**:
- **Agent Prefix**: Agent identifier (e.g., "agent:wolf-pack")
- **Autonomous System (ASN)**: Agent system identifier
- **Next Hop**: Next agent in routing path
- **Capabilities**: What the agent can do
- **Route Announcements**: How agents advertise their capabilities

**WHY**: Enables intelligent task distribution and load balancing across agent systems, similar to how BGP routes internet traffic

**Status**: ⏳ Scaffolding (needs Antigravity implementation)

---

## 2. Agent Interop Registry

### WHAT: Registry for managing different agent providers

**WHERE**: `spine/agent-interop/`

**Components**:
- `AgentInteropRegistry.ts` - Main registry
- `OpenAIProvider.ts` - OpenAI agent provider
- `GeminiProvider.ts` - Google Gemini provider
- `CursorProvider.ts` - Cursor AI provider
- `AntigravityProvider.ts` - Antigravity provider
- `SlackAgentProvider.ts` - Slack agent provider
- `SalesforceAgentForceProvider.ts` - Salesforce provider
- `ProviderDescriptor.ts` - Provider type definitions

**HOW**:
```typescript
import { AgentInteropRegistry, OpenAIProvider } from "spine/agent-interop";

// Register provider
const registry = new AgentInteropRegistry();
registry.registerProvider(new OpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY,
}));

// Execute agent request
const response = await registry.execute({
  provider: "openai",
  capability: "text-generation",
  input: "Generate a dream analysis",
});
```

**Supported Providers**:
- OpenAI (GPT-4, GPT-3.5)
- Google Gemini
- Cursor AI
- Antigravity
- Slack Agents
- Salesforce Agent Force

**WHY**: Provides standardized interfaces for agent communication, enabling different agent systems to work together seamlessly

**Status**: ⏳ Scaffolding (needs Antigravity implementation)

---

## 3. DreamNet OS Linker

### WHAT: Compatibility layer for different agent runtime environments

**WHERE**: `spine/dreamnet-os-linker/`

**Components**:
- `OSLinker.ts` - Main linker
- `OSProcessDescriptor.ts` - Process definitions
- `RuntimeContext.ts` - Runtime context
- `EnvironmentBindings.ts` - Environment variable bindings
- `CapabilitiesMap.ts` - Capability mappings

**HOW**:
```typescript
import { OSLinker } from "spine/dreamnet-os-linker";

// Create linker
const linker = new OSLinker();

// Map capabilities to providers
linker.mapCapability("web-browsing", "browser-agent-core");

// Get runtime context
const context = linker.getRuntimeContext({
  processId: "agent:wolf-pack",
  capabilities: ["funding", "outreach"],
});
```

**Key Concepts**:
- **OS Process Descriptor**: Describes an agent process
- **Runtime Context**: Execution environment for agents
- **Environment Bindings**: Environment variable mappings
- **Capabilities Map**: Maps capabilities to providers

**WHY**: Enables agents to run in different environments (Node.js, browser, edge, etc.) with proper capability mapping

**Status**: ⏳ Scaffolding (needs Antigravity implementation)

---

## 4. DreamNet Event Bus

### WHAT: Pub/sub system for agent-to-agent communication

**WHERE**: `spine/dreamnet-event-bus/`

**Components**:
- `DreamEventBus.ts` - Main event bus (Phase I: in-memory)
- `EventEnvelope.ts` - Event wrapping and security
- `EventRouter.ts` - Event routing logic
- `EventTypes.ts` - Event type definitions

**HOW**:
```typescript
import { DreamEventBus, createEventEnvelope } from "spine/dreamnet-event-bus";

// Create event bus
const bus = new DreamEventBus();

// Subscribe to events
const unsubscribe = bus.subscribe("agent:task:completed", (event) => {
  console.log("Task completed:", event.payload);
});

// Publish event
const event = createEventEnvelope({
  type: "agent:task:completed",
  payload: { taskId: "task-123", result: "success" },
  source: "agent:wolf-pack",
});
bus.publish(event);

// Unsubscribe
unsubscribe();
```

**Features**:
- In-memory pub/sub (Phase I)
- Event envelope wrapping (security, metadata)
- Wildcard subscriptions ("*" for all events)
- Event storage for later retrieval
- Type-safe event handling

**Event Types**:
- `agent:task:completed` - Task completion
- `agent:task:failed` - Task failure
- `agent:discovered` - Agent discovered
- `security:threat:detected` - Security threat
- `deployment:completed` - Deployment completion
- And more...

**WHY**: Enables real-time agent-to-agent communication and event-driven architecture

**Status**: ✅ Phase I Complete (in-memory), ⏳ Phase II (persistence) pending

---

## 5. DreamNet MCP Bridge

### WHAT: Bridge to Model Context Protocol (MCP) providers

**WHERE**: `spine/dreamnet-mcp-bridge/`

**Components**:
- `MCPBridge.ts` - Main bridge
- `MCPProviderDescriptor.ts` - Provider definitions
- `MCPSessionContext.ts` - Session management
- `MCPTools.ts` - Tool definitions

**HOW**:
```typescript
import { MCPBridge } from "spine/dreamnet-mcp-bridge";

// Create bridge
const bridge = new MCPBridge();

// Connect to MCP provider
await bridge.connect({
  provider: "openai-mcp",
  endpoint: "https://mcp.openai.com",
  apiKey,
});

// Execute MCP tool
const result = await bridge.executeTool({
  tool: "web-search",
  input: { query: "DreamNet funding" },
});
```

**Supported MCP Providers**:
- OpenAI MCP
- Anthropic MCP
- Cursor Tools
- Antigravity Tools

**WHY**: Enables DreamNet to interact with external MCP providers, extending agent capabilities

**Status**: ⏳ Scaffolding (needs Antigravity implementation)

---

## 6. Wrappers Layer

### WHAT: Thin wrappers around existing DreamNet subsystems

**WHERE**: `spine/wrappers/`

**Components**:
- `ShieldCoreWrapper.ts` - Shield Core wrapper
- `DreamKeeperWrapper.ts` - DreamKeeper wrapper
- `BrowserAgentWrapper.ts` - Browser Agent wrapper
- `DeploymentWrapper.ts` - Deployment wrapper
- `MiniAppWrapper.ts` - Mini-app wrapper
- `FreeTierWrapper.ts` - Free tier wrapper

**HOW**:
```typescript
import { ShieldCoreWrapper } from "spine/wrappers";

// Create wrapper
const shieldWrapper = new ShieldCoreWrapper();

// Use wrapped functionality
const threat = await shieldWrapper.detectThreat({
  source: "agent:wolf-pack",
  event: "suspicious-activity",
});
```

**WHY**: Allows Antigravity to reason about wrapping subsystems without modifying core code.Status: ⏳ Scaffolding (needs Antigravity implementation)

---

## 7. Agent Protocols

### WHAT: Protocol registry for different communication protocols

**WHERE**: `spine/agent-protocols/`

**Components**:
- `ProtocolRegistry.ts` - Protocol registry
- `ProtocolTypes.ts` - Protocol type definitions

**Supported Protocols**:
- HTTP
- WebSocket
- gRPC
- MQTT
- And more...

**HOW**:
```typescript
import { ProtocolRegistry } from "spine/agent-protocols";

// Register protocol
const registry = new ProtocolRegistry();
registry.register("http", HTTPProtocol);
registry.register("websocket", WebSocketProtocol);

// Get protocol handler
const protocol = registry.get("http");
```

**WHY**: Enables agents to communicate over different protocols based on requirements**: ⏳ Scaffolding (needs Antigravity implementation)

---

## Spine Integration Points

### Current Integration Status

**NOT YET INTEGRATED**: The Spine is not imported into `client/` or `server/` yet. This is intentional.

**Future Integration Points**:
1. **Super Spine** - Agent orchestration layer
2. **Spider Web Core** - Event routing
3. **Instant Mesh** - Network connections
4. **Shield Core** - Security layer
5. **DreamKeeper** - Health monitoring

---

## Design Principles

1. **No Breaking Changes**: The Spine does not modify existing DreamNet systems
2. **Type Safety**: Everything is fully typed with TypeScript interfaces
3. **Modularity**: Each component is independent and can be developed separately
4. **Extensibility**: Easy to add new providers, protocols, and capabilities
5. **Documentation**: Well-documented interfaces and clear comments explain intent

---

## Safety Guarantees

- ✅ The Spine compiles without errors
- ✅ No runtime side effects (all methods throw "Not implemented")
- ✅ Not imported into production code yet
- ✅ Safe to add to the monorepo without affecting builds
- ✅ Can be imported later when Antigravity fills it with logic

---

## Next Steps (Antigravity Tasks)

1. **Fill Empty Implementations**: Replace all `throw new Error("Not implemented")` stubs with real logic
2. **Connect to Existing Systems**: Use wrappers to integrate with Shield Core, DreamKeeper, and other DreamNet subsystems
3. **Implement Routing**: Add intelligent routing algorithms to Agent BGP
4. **Add Providers**: Implement full provider logic for OpenAI, Gemini, Cursor, and Antigravity agents
5. **Wire Event Bus**: Connect the event bus to Spider Web Core and Instant Mesh for real-time agent communication
6. **Enable MCP**: Implement MCP bridge to connect with external MCP providers

---

## Spine System Status Summary

| System | Status | Implementation | Integration |
|--------|--------|----------------|-------------|
| **Agent BGP** | ⏳ Scaffolding | Empty stubs | Not integrated |
| **Agent Interop Registry** | ⏳ Scaffolding | Empty stubs | Not integrated |
| **DreamNet OS Linker** | ⏳ Scaffolding | Empty stubs | Not integrated |
| **DreamNet Event Bus** | ✅ Phase I | In-memory pub/sub | Not integrated |
| **DreamNet MCP Bridge** | ⏳ Scaffolding | Empty stubs | Not integrated |
| **Wrappers Layer** | ⏳ Scaffolding | Empty stubs | Not integrated |
| **Agent Protocols** | ⏳ Scaffolding | Empty stubs | Not integrated |

---

**This document covers all Spine systems with HOW, WHY, WHERE, and WHAT. The Spine is production-ready scaffolding waiting for Antigravity implementation.**

