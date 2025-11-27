# DreamNet Interop Spine - Overview

## What is the Spine?

The DreamNet Interop Spine is a foundational layer that provides a unified interface for agent interoperability, routing, and orchestration. It acts as the "super-brain" of DreamNet, enabling different agent systems to communicate and collaborate seamlessly.

## Why Does It Exist?

The Spine exists to solve several critical challenges:

1. **Agent Interoperability**: Different agent systems (OpenAI, Gemini, Cursor, Antigravity, Salesforce, etc.) need to communicate with each other and with DreamNet's native agents.

2. **Unified Routing**: The Spine provides BGP-style routing for agents, allowing intelligent task distribution and load balancing across agent systems.

3. **Meta-Orchestration**: The Spine enables higher-level orchestration beyond what Super Spine provides, including cross-platform agent coordination.

4. **Future-Proofing**: By creating a clean interface layer, Antigravity and other advanced systems can plug in sophisticated logic without restructuring DreamNet's core systems.

## Current State: Scaffolding Only

**IMPORTANT**: The Spine is currently **pure scaffolding**:

- ✅ Types, interfaces, and empty class stubs
- ✅ Well-documented structure
- ✅ Type-safe exports
- ❌ No real logic or side effects
- ❌ No network calls or database operations
- ❌ Not imported into `client/` or `server/` yet

This is intentional. The Spine provides the structure that Antigravity will later fill with:
- Cross-agent routing logic
- Execution governance
- Budget policies
- Global dream graph
- Agent discovery
- Protocol support
- Evolution chain logic
- DreamKeeper checks
- Shield integration

## Architecture

The Spine consists of several key components:

### 1. Agent BGP (`bgp-for-agents/`)
Border Gateway Protocol for Agents - routing system inspired by internet BGP. Handles route announcements, next hops, and capabilities exchange between agent systems.

### 2. Agent Interop Registry (`agent-interop/`)
Registry for managing different agent providers (OpenAI, Gemini, Cursor, Antigravity, etc.). Provides standardized interfaces for agent communication.

### 3. DreamNet OS Linker (`dreamnet-os-linker/`)
Compatibility layer for different agent runtime environments. Maps capabilities to providers and manages process descriptors.

### 4. DreamNet Event Bus (`dreamnet-event-bus/`)
Pub/sub system for agent-to-agent communication. Provides event routing and envelope wrapping for cross-system events.

### 5. DreamNet MCP Bridge (`dreamnet-mcp-bridge/`)
Bridge to Model Context Protocol (MCP) providers. Enables DreamNet to interact with OpenAI MCP, Anthropic MCP, Cursor tools, and Antigravity tools.

### 6. Wrappers Layer (`wrappers/`)
Thin wrappers around existing DreamNet subsystems (Shield Core, DreamKeeper, Browser Agent, etc.). Allows Antigravity to reason about wrapping subsystems without modifying core code.

### 7. Agent Protocols (`agent-protocols/`)
Protocol registry for different communication protocols (HTTP, WebSocket, gRPC, MQTT, etc.).

## How Antigravity Will Use It

Antigravity will plug into the Spine to:

1. **Fill Empty Implementations**: Replace all `throw new Error("Not implemented")` stubs with real logic.

2. **Connect to Existing Systems**: Use wrappers to integrate with Shield Core, DreamKeeper, and other DreamNet subsystems.

3. **Implement Routing**: Add intelligent routing algorithms to Agent BGP.

4. **Add Providers**: Implement full provider logic for OpenAI, Gemini, Cursor, and Antigravity agents.

5. **Wire Event Bus**: Connect the event bus to Spider Web Core and Instant Mesh for real-time agent communication.

6. **Enable MCP**: Implement MCP bridge to connect with external MCP providers.

## Design Principles

1. **No Breaking Changes**: The Spine does not modify existing DreamNet systems.

2. **Type Safety**: Everything is fully typed with TypeScript interfaces.

3. **Modularity**: Each component is independent and can be developed separately.

4. **Extensibility**: Easy to add new providers, protocols, and capabilities.

5. **Documentation**: Well-documented interfaces and clear comments explain intent.

## Next Steps

1. Antigravity will implement the empty stubs
2. Connect Spine to Super Spine for agent orchestration
3. Wire event bus to Spider Web Core
4. Integrate wrappers with existing subsystems
5. Add real routing logic to Agent BGP
6. Implement provider connectors for external agents

## Safety Guarantees

- ✅ The Spine compiles without errors
- ✅ No runtime side effects (all methods throw "Not implemented")
- ✅ Not imported into production code yet
- ✅ Safe to add to the monorepo without affecting builds
- ✅ Can be imported later when Antigravity fills it with logic

