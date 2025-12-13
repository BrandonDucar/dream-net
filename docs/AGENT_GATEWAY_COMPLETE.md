# Agent Gateway - Complete Documentation

**Package**: `@dreamnet/agent-gateway`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Agent Gateway is DreamNet's **high-bandwidth, AI-native ingress** for ChatGPT, Cursor, Replit, and other AI agents. It provides a secure, permissioned interface for agents to interact with DreamNet's core systems through a tool-based API.

### Key Features

- **Intent-Based Routing**: Resolves natural language intents to specific tools
- **Permission System**: Tier-based access control (SEED, BUILDER, OPERATOR, GOD_MODE)
- **Tool Registry**: Centralized registry of available tools with metadata
- **Conduit Integration**: Works with DreamNet's conduit governor for resource management
- **Activity Tracking**: Records all agent activity for DreamScope visibility
- **Timeout Handling**: Enforces execution timeouts from conduit budgets
- **Dead Letter Queue**: Captures failed critical operations for investigation

---

## Architecture

### How It Works

```
Agent Request → Intent Router → Permission Check → Conduit Evaluation → Tool Executor → Activity Logging → Response
```

1. **Intent Resolution**: Converts natural language or tool IDs to specific tool actions
2. **Permission Validation**: Checks caller tier, office, and cabinet permissions
3. **Conduit Evaluation**: Validates resource budgets and execution limits
4. **Tool Execution**: Routes to appropriate executor (env, api, vercel, cloudrun, diagnostics)
5. **Activity Logging**: Records execution for DreamScope and audit trails
6. **Nerve Events**: Emits events to Nervous System for monitoring

### Why This Design

- **Security First**: Multi-layer permission checks prevent unauthorized access
- **Resource Management**: Conduit integration prevents resource exhaustion
- **Observability**: Comprehensive logging and event emission
- **Extensibility**: Easy to add new tools and executors
- **AI-Friendly**: Natural language intent resolution for AI agents

---

## API Reference

### Types

```typescript
export interface AgentGatewayRequestBody {
  intent: string; // Natural language or tool ID (e.g., "env.get", "get environment variable")
  tools?: string[];
  constraints?: {
    maxLatencyMs?: number;
    maxCostUsd?: number;
    maxTokens?: number;
    riskCeiling?: "low" | "medium" | "high";
  };
  payload?: Record<string, unknown>;
}

export interface IntentResolution {
  tool?: ToolId;
  reason?: string;
}

export type ToolId =
  | "env.get"
  | "env.set"
  | "env.delete"
  | "api.listKeys"
  | "api.rotateKey"
  | "vercel.deploy"
  | "vercel.listProjects"
  | "cloudrun.deploy"
  | "cloudrun.scale"
  | "cloudrun.update"
  | "cloudrun.list"
  | "cloudrun.getStatus"
  | "cloudrun.setKeepAlive"
  | "diagnostics.ping"
  | string;

export interface ToolConfig {
  id: ToolId;
  label: string;
  description?: string;
  clusterId: ClusterId;
  portId: PortId;
  minTier: "SEED" | "BUILDER" | "OPERATOR" | "GOD_MODE";
  requiredOfficeIds?: string[];
  requiredCabinetIds?: string[];
  cost?: ToolCostProfile;
  riskLevel?: ToolRiskLevel;
}

export interface ToolExecutionResult {
  toolId: ToolId;
  ok: boolean;
  error?: string;
  data?: unknown;
  latencyMs?: number;
}
```

### Functions

#### `resolveIntentToTool(body: AgentGatewayRequestBody): IntentResolution`

Resolves an intent string to a tool ID. Supports:
- Direct tool ID matches (e.g., "env.get")
- Natural language patterns (e.g., "get environment variable")

**Example**:
```typescript
import { resolveIntentToTool } from "@dreamnet/agent-gateway";

const resolution = resolveIntentToTool({
  intent: "get environment variable",
  payload: { key: "DATABASE_URL" }
});

// Returns: { tool: "env.get" }
```

#### `isToolAllowedForCaller(toolId: ToolId, req: RequestWithIdentity): { allowed: boolean; reason?: string }`

Checks if the caller has permission to use a tool. Validates:
- Tier level (SEED < BUILDER < OPERATOR < GOD_MODE)
- Office IDs (if required)
- Cabinet IDs (if required)
- God Vault bypass (if applicable)

#### `executeTool(toolId: ToolId, payload: Record<string, unknown>, req: RequestWithIdentity): Promise<ToolExecutionResult>`

Executes a tool with full permission and conduit validation. Handles:
- Permission checks
- Conduit evaluation
- Timeout enforcement
- Error handling
- Dead letter queue for critical failures
- Nerve event emission
- Activity logging

**Example**:
```typescript
import { executeTool } from "@dreamnet/agent-gateway";

const result = await executeTool("env.get", { key: "DATABASE_URL" }, req);

if (result.ok) {
  console.log(result.data); // Environment variable data
} else {
  console.error(result.error); // Error reason
}
```

---

## Available Tools

### Environment Tools (`env.*`)

- **`env.get`**: Read an environment variable (redacted if secret)
- **`env.set`**: Create or update an environment variable
- **`env.delete`**: Delete an environment variable

**Required Tier**: OPERATOR  
**Required Cabinet**: DATA_PRIVACY_CABINET  
**Risk Level**: Medium (get), High (set/delete)

### API Key Tools (`api.*`)

- **`api.listKeys`**: List all API keys (summary only, no raw keys)
- **`api.rotateKey`**: Rotate an API key (generate new, deprecate old)

**Required Tier**: OPERATOR  
**Required Cabinet**: TREASURY_CABINET  
**Risk Level**: High (list), Critical (rotate)

### Vercel Tools (`vercel.*`)

- **`vercel.deploy`**: Trigger a Vercel deployment
- **`vercel.listProjects`**: List all Vercel projects

**Required Tier**: OPERATOR (deploy), BUILDER (list)  
**Required Office**: FOUNDER, MINISTER_OF_WOLF_OPERATIONS  
**Risk Level**: High (deploy), Medium (list)

### Cloud Run Tools (`cloudrun.*`)

- **`cloudrun.deploy`**: Deploy a service to Google Cloud Run
- **`cloudrun.scale`**: Update min/max instances (governed by budget)
- **`cloudrun.update`**: Update service settings (env vars, resources)
- **`cloudrun.list`**: List all Cloud Run services
- **`cloudrun.getStatus`**: Get service status and health
- **`cloudrun.setKeepAlive`**: Configure minInstances to prevent scale-to-zero

**Required Tier**: OPERATOR  
**Required Office**: FOUNDER, MINISTER_OF_WOLF_OPERATIONS (for deploy/scale/update/setKeepAlive)  
**Risk Level**: Critical (deploy), High (scale/update/setKeepAlive), Medium (list), Low (getStatus)

### Diagnostics Tools (`diagnostics.*`)

- **`diagnostics.ping`**: Basic connectivity check to DreamNet core

**Required Tier**: SEED  
**Risk Level**: Low

---

## Integration Points

### Consumes

- **Env Keeper Core**: Environment variable management
- **API Keeper Core**: API key management
- **DreamNet Vercel Agent**: Vercel project and deployment management
- **DreamNet Control Core**: Identity resolution, conduit governor, dead letter queue
- **Port Governor**: Port ID validation
- **Nerve Bus**: Event emission for monitoring

### Produces

- **Activity Logs**: Recorded for DreamScope visibility
- **Nerve Events**: Emitted to Nervous System for monitoring
- **Dead Letter Records**: Failed critical operations
- **Conduit Usage Metrics**: Resource consumption tracking

---

## Usage Examples

### Basic Tool Execution

```typescript
import { executeTool, resolveIntentToTool } from "@dreamnet/agent-gateway";
import type { RequestWithIdentity } from "@dreamnet/dreamnet-control-core/identityResolver";

// Resolve intent
const resolution = resolveIntentToTool({
  intent: "get environment variable",
  payload: { key: "DATABASE_URL" }
});

if (resolution.tool) {
  // Execute tool
  const result = await executeTool(resolution.tool, { key: "DATABASE_URL" }, req);
  
  if (result.ok) {
    console.log("Environment variable:", result.data);
  }
}
```

### Natural Language Intent

```typescript
// Natural language intents are automatically resolved
const resolution = resolveIntentToTool({
  intent: "list all API keys"
});

// Returns: { tool: "api.listKeys" }
```

### Permission Check

```typescript
import { isToolAllowedForCaller } from "@dreamnet/agent-gateway";

const check = isToolAllowedForCaller("env.set", req);

if (!check.allowed) {
  console.error("Permission denied:", check.reason);
  // Reason could be: "TIER_TOO_LOW", "OFFICE_REQUIRED", "CABINET_REQUIRED"
}
```

---

## Best Practices

1. **Always Check Permissions**: Use `isToolAllowedForCaller` before executing tools
2. **Handle Errors**: Check `result.ok` and handle errors appropriately
3. **Respect Timeouts**: Tools respect conduit timeout budgets
4. **Monitor Activity**: Check DreamScope for agent activity logs
5. **Use Appropriate Tiers**: Request appropriate tier levels for agents

---

## Security Considerations

- **Tier-Based Access**: Tools require minimum tier levels
- **Office/Cabinet Requirements**: Some tools require specific offices or cabinets
- **God Vault Bypass**: God Vault can bypass all checks (use with extreme caution)
- **Risk Level Validation**: Critical tools blocked for non-GOD_MODE tiers
- **Conduit Budgets**: Resource limits enforced via conduit governor
- **Dead Letter Queue**: Critical failures captured for investigation
- **Activity Logging**: All tool executions logged for audit

---

## Related Systems

- **DreamNet Control Core**: Identity resolution, conduit governor
- **Env Keeper Core**: Environment variable management
- **API Keeper Core**: API key management
- **Port Governor**: Port ID management
- **Nerve Bus**: Event emission
- **DreamScope**: Activity visibility

---

**Status**: ✅ Implemented  
**Next**: Continue adding tools and executors as needed

