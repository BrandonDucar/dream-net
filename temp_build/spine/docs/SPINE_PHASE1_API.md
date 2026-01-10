# Spine Phase I API Documentation

## Overview
The DreamNet Spine is the central nervous system for agent interoperability. Phase I implements core in-memory functionality without external dependencies.

## Event Bus API

### DreamEventBus
Central pub/sub event system for all Spine components.

**Methods:**
- `subscribe<T>(type: string, handler: EventHandler<T>): () => void`
  - Subscribe to events of a specific type
  - Returns an unsubscribe function
- `publish<T>(event: EventEnvelope<T>): void`
  - Publish an event to all subscribers
- `createEnvelope<T>(type, source, payload, metadata?): EventEnvelope<T>`
  - Helper to create properly formatted event envelopes

### EventEnvelope
```typescript
interface EventEnvelope<T> {
  id: string;
  type: string;
  timestamp: number;
  source: string;
  payload: T;
  metadata?: Record<string, unknown>;
}
```

### EventTypes
Predefined event type constants including:
- `AGENT_ROUTE_ANNOUNCED` / `AGENT_ROUTE_WITHDRAWN`
- `INTEROP_PROVIDER_REGISTERED` / `INTEROP_PROVIDER_REMOVED`
- `SECURITY_THREAT_EVALUATED` / `SECURITY_INCIDENT_REPORTED`
- `BROWSER_NAVIGATION_BLOCKED`
- `DEPLOYMENT_ANNOUNCED` / `DEPLOYMENT_RESULT_RECORDED`
- `DREAMKEEPER_HEALTH_REPORTED` / `DREAMKEEPER_STATE_CHANGED`
- `MINIAPP_EVENT`
- `FREETIER_USAGE_RECORDED` / `FREETIER_QUOTA_CHECKED`

## Agent BGP API

### RouteTable
Manages agent routing information.

**Methods:**
- `addRoute(route: AgentRoute): void`
- `removeRoute(prefix: AgentPrefix): void`
- `getRoute(prefix: AgentPrefix): AgentRoute | undefined`
- `getAllRoutes(): AgentRoute[]`

### RouteAnnouncements
Publishes route changes to the Event Bus.

**Methods:**
- `announceRoute(route: AgentRoute): void`
- `withdrawRoute(route: AgentRoute): void`

### RoutingStrategies
Static routing selection algorithms.

**Methods:**
- `selectFirstMatch(prefix, routes): AgentRoute | undefined`
- `selectLongestPrefixMatch(prefix, routes): AgentRoute | undefined`

## Agent Interop Registry API

### AgentInteropRegistry
Manages provider registration and capability queries.

**Methods:**
- `registerProvider(provider: ProviderDescriptor): void`
- `getProvider(name: string): ProviderDescriptor | undefined`
- `listProviders(): ProviderDescriptor[]`
- `supportsCapability(capability: string): ProviderDescriptor[]`

### Provider Stubs
Pre-defined provider descriptors:
- `OpenAIProvider` - llm.chat, llm.embed, llm.completion
- `GeminiProvider` - llm.chat, llm.multimodal, llm.reasoning
- `CursorProvider` - code.edit, code.completion, code.analysis
- `SlackAgentProvider` - messaging.send, messaging.receive, workflow.trigger
- `SalesforceAgentForceProvider` - crm.query, crm.update, workflow.automation
- `AntigravityProvider` - code.generation, code.refactor, project.scaffold, deployment.manage

## OS Linker API

### RuntimeContext
Interface for runtime environment information.

```typescript
interface RuntimeContext {
  env: 'dev' | 'staging' | 'prod' | string;
  identity?: { id: string; roles?: string[] };
  capabilities: string[];
  metadata?: Record<string, unknown>;
}
```

### CapabilitiesMap
Maps capabilities to providers.

**Methods:**
- `addProvider(provider: ProviderDescriptor): void`
- `getProviders(capability: string): ProviderDescriptor[]`
- `listAllCapabilities(): string[]`

## MCP Bridge API

### MCPBridge
Manages MCP providers and sessions.

**Methods:**
- `registerProvider(provider: MCPProviderDescriptor): void`
- `createSession(providerName: string): MCPSessionContext`
- `getSession(sessionId: string): MCPSessionContext | undefined`
- `getToolRegistry(): MCPTools`

### MCPTools
Registry for MCP tools.

**Methods:**
- `registerTool(providerName: string, toolName: string): void`
- `listTools(providerName?: string): { providerName: string; toolName: string }[]`

## Wrappers API

All wrappers accept a `DreamEventBus` instance and emit events.

### ShieldCoreWrapper
- `evaluateThreat(input: unknown): void`
- `reportIncident(details: unknown): void`

### BrowserAgentWrapper
- `isAllowed(url: string): boolean`
- `reportBlockedNavigation(url: string): void`

### FreeTierWrapper
- `recordUsage(service: string, amount: number): void`
- `checkQuota(service: string): { allowed: boolean; remaining?: number }`

### DeploymentWrapper
- `announceDeploy(platform: string): void`
- `recordDeployResult(platform: string, success: boolean): void`

### DreamKeeperWrapper
- `reportHealth(entityId: string, status: string): void`
- `emitStateChange(entityId: string, state: string): void`

### MiniAppWrapper
- `reportMiniAppEvent(appId: string, eventType: string, payload?: unknown): void`

## Stability Guarantees

**Phase I Stable:**
- EventEnvelope structure
- Core EventTypes
- RouteTable interface
- Registry interface
- All wrapper method signatures

**Phase II Evolution:**
- Additional event types
- Routing strategies
- Provider implementations
- Integration with server/client
