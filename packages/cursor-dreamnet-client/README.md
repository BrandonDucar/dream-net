# Cursor DreamNet Client

A Cursor-friendly client for accessing DreamNet APIs directly from Cursor.

## Features

- ✅ **Direct API Access** - Full HTTP client with authentication
- ✅ **Real-Time Events** - Server-Sent Events (SSE) streaming for live updates
- ✅ **Type-Safe** - TypeScript types for all responses
- ✅ **Error Handling** - Robust error handling and retries
- ✅ **Convenience Methods** - Easy-to-use methods for common operations
- ✅ **Natural Language** - Query DreamNet using natural language

## Installation

This package is part of the DreamNet monorepo. It's automatically available when you install dependencies:

```bash
pnpm install
```

## Quick Start

```typescript
import { CursorDreamNetClient } from "@dreamnet/cursor-dreamnet-client";

// Create client (uses DREAMNET_API_KEY from environment)
const client = new CursorDreamNetClient();

// Check system health
const isHealthy = await client.isHealthy();
console.log("DreamNet is healthy:", isHealthy);

// Get full system status
const status = await client.getHeartbeat();
console.log("System status:", status);

// Query dreams
const dreams = await client.queryDreams({ limit: 10 });
console.log("Dreams:", dreams);

// Natural language query
const result = await client.query("What's the current system status?");
console.log("Query result:", result);

// Real-time event streaming
import { createEventStream, StarbridgeTopic } from "@dreamnet/cursor-dreamnet-client";

const stream = createEventStream(client, {
  topics: [StarbridgeTopic.System, StarbridgeTopic.Deploy],
  autoReconnect: true,
});

stream.onAll((event) => {
  console.log("Event:", event.type, event.payload);
});

await stream.connect();
```

## Environment Setup

Set your API key in environment variables:

```bash
# .env file
DREAMNET_API_KEY=dn_live_your_key_here
DREAMNET_API_URL=https://dreamnet.world  # Optional, defaults to dreamnet.world
```

Or pass it directly:

```typescript
const client = new CursorDreamNetClient({
  apiKey: "dn_live_your_key_here",
  baseUrl: "https://dreamnet.world"
});
```

## API Methods

### System Status

- `getHeartbeat()` - Get full system heartbeat
- `getSystemState()` - Get system state
- `isHealthy()` - Quick health check (returns boolean)
- `getSpiderWebStatus()` - Get Spider Web Core status
- `getShieldStatus()` - Get Shield Core status
- `getControlPlaneStatus()` - Get Control Plane status

### Dreams

- `queryDreams(options)` - Search/query dreams
- `getDream(id)` - Get specific dream by ID

### Agents

- `queryAgent(agentName, query)` - Query an agent
- `getAgentContext()` - Get agent context/info

### Natural Language

- `query(message, options)` - Send natural language query to DreamNet

### Shield Core

- `getShieldThreats(options)` - Get security threats

### Wolf Pack

- `getWolfPackOpportunities(options)` - Get funding opportunities
- `getWolfPackStatus()` - Get Wolf Pack status

### Spider Web

- `getSpiderWebThreads(options)` - Get Spider Web threads

### Vercel (DevOps)

- `listVercelProjects()` - List Vercel projects
- `getVercelProject(name)` - Get project details
- `analyzeCleanupOpportunities(options)` - Analyze cleanup

## Examples

### Check System Health

```typescript
const client = new CursorDreamNetClient();
const healthy = await client.isHealthy();
if (!healthy) {
  console.error("DreamNet is not healthy!");
}
```

### Query Dreams

```typescript
const client = new CursorDreamNetClient();

// Search dreams by text
const dreams = await client.queryDreams({
  text: "AI",
  limit: 10
});

// Get specific dream
const dream = await client.getDream("dream-id-123");
```

### Natural Language Query

```typescript
const client = new CursorDreamNetClient();

// Ask DreamNet anything
const result = await client.query("What threats has Shield Core detected?");
console.log(result);
```

### Query Specific Agent

```typescript
const client = new CursorDreamNetClient();

// Query DeployKeeper
const result = await client.queryAgent(
  "DeployKeeper",
  "What's the deployment status?"
);
```

### Get System Status

```typescript
const client = new CursorDreamNetClient();

// Get full heartbeat
const status = await client.getHeartbeat();
console.log("Cores:", status.cores);
console.log("Agents:", status.agents);
```

## Error Handling

The client includes automatic retries and error handling:

```typescript
try {
  const status = await client.getHeartbeat();
} catch (error) {
  console.error("Failed to get heartbeat:", error);
}
```

## Low-Level Access

If you need access to methods not wrapped here, you can get the underlying agent:

```typescript
const client = new CursorDreamNetClient();
const agent = client.getAgent();

// Use any method from DreamNetAgent
const result = await agent.checkSystemStatus();
```

## TypeScript Support

Full TypeScript support with types for all responses:

```typescript
import { CursorDreamNetClient, SystemStatus, Dream } from "@dreamnet/cursor-dreamnet-client";

const client = new CursorDreamNetClient();
const status: SystemStatus = await client.getHeartbeat();
const dreams: Dream[] = await client.queryDreams();
```

## Memory Access (Bidirectional)

### DreamVault Operations

Read and write dreams to DreamVault:

```typescript
const memory = client.getMemory();

// Search dreams
const dreams = await memory.searchDreams({ text: "AI", limit: 10 });

// Get specific dream
const dream = await memory.getDream("dream-id-123");

// Get dreams by wallet
const myDreams = await memory.getDreamsByWallet("0x...");

// Create a new dream
const newDream = await memory.createDream({
  title: "My Dream",
  description: "Dream description",
  type: "vision",
  tags: ["ai", "future"],
});

// Update a dream
await memory.updateDream("dream-id-123", {
  title: "Updated Title",
  description: "Updated description",
});

// Store Cursor analysis as a dream
const analysis = await memory.storeCursorAnalysis({
  title: "System Analysis",
  content: "Analysis content...",
  findings: ["Finding 1", "Finding 2"],
  recommendations: ["Recommendation 1"],
});
```

### Event Log Operations

Read and write event logs:

```typescript
const memory = client.getMemory();

// Get recent events
const events = await memory.getRecentEvents(50);

// Query events with filters
const systemEvents = await memory.getEventLogs({
  type: "system.startup",
  since: new Date(Date.now() - 24 * 60 * 60 * 1000),
  limit: 100,
});

// Log an event
await memory.logEvent("cursor.action", {
  action: "analysis_complete",
  details: { ... },
});

// Log Cursor action (convenience method)
await memory.logCursorAction("code_analysis", {
  files: ["file1.ts", "file2.ts"],
  findings: [...],
});
```

### Agent State Operations

Read and update agent states:

```typescript
const memory = client.getMemory();

// Get specific agent state
const agentState = await memory.getAgentState("DeployKeeper");

// Get all agent states
const allStates = await memory.getAllAgentStates();

// Update agent state (if write access available)
await memory.updateAgentState("DeployKeeper", {
  status: "active",
  metadata: { lastCheck: new Date().toISOString() },
});
```

## Agent Communication

### Direct Agent Messaging

Send messages to agents and query them:

```typescript
const agents = client.getAgents();

// Send a message to an agent
await agents.sendMessage("DeployKeeper", "What's the deployment status?", {
  topic: "deployment",
  meta: { priority: "high" },
});

// Query an agent
const result = await agents.queryAgent("DeployKeeper", "What's the current deployment status?");

// Trigger an agent action
await agents.triggerAction("DeployKeeper", "check_deployments", {
  environment: "production",
});

// Get agent status
const status = await agents.getAgentStatus("DeployKeeper");
```

### Agent Gateway (Tool Execution)

Execute tools via the Agent Gateway:

```typescript
const agents = client.getAgents();

// List available tools
const tools = await agents.listTools();
console.log("Available tools:", tools.map(t => t.id));

// Execute using natural language intent
const result = await agents.executeIntent("Show me system status", {});

// Execute specific tool
const toolResult = await agents.executeTool("env.get", { key: "NODE_ENV" });
```

### Multi-Agent Coordination

Coordinate multiple agents:

```typescript
const agents = client.getAgents();

// Coordinate multiple agents for a task
const results = await agents.coordinateAgents(
  ["DeployKeeper", "DreamKeeper", "ShieldCore"],
  "What's your current status?",
  { context: "system-check" }
);

// Execute a workflow
const workflow = {
  steps: [
    { agent: "DeployKeeper", action: "get_status" },
    { agent: "DreamKeeper", action: "get_health", waitFor: "DeployKeeper" },
  ],
  parallel: false,
};

const workflowResults = await agents.executeWorkflow(workflow);
```

### Convenience Methods

Quick access to common agents:

```typescript
const agents = client.getAgents();

// Ask specific agents
await agents.askDeployKeeper("What's the deployment status?");
await agents.askCoinSensei("What's the current DREAM token price?");
await agents.askEconomicBrain("Show me treasury balance");
await agents.askDreamKeeper("What's the system health?");
await agents.askShieldCore("Any recent threats?");
```

## Autonomous Action System

### Safety Checks

Check if an action is safe to execute:

```typescript
const actions = client.getActions();

const safetyCheck = await actions.checkSafety({
  actionId: "deploy",
  actionType: "execute",
  target: "production",
  params: { version: "1.0.0" },
  description: "Deploy new version",
});

if (!safetyCheck.safe) {
  console.log("Action not safe:", safetyCheck.reasons);
}

if (safetyCheck.requiresApproval) {
  console.log("Approval needed:", safetyCheck.approvalTypes);
}
```

### Action Execution

Execute actions with automatic safety checks and approval workflows:

```typescript
const actions = client.getActions();

// Execute a safe action (auto-approved if safe)
const result = await actions.executeAction({
  actionId: "query_status",
  actionType: "read",
  target: "system",
  params: {},
}, {
  autoApprove: true, // Auto-approve if safe
});

if (result.executed && result.result?.success) {
  console.log("Action succeeded:", result.result.data);
}
```

### Approval Workflows

For high-risk actions, request approval:

```typescript
const actions = client.getActions();

// Request approval
const approval = await actions.requestApproval({
  actionId: "kill_switch",
  actionType: "system",
  target: "control-core",
  params: { enabled: true },
});

// Wait for approval
const finalApproval = await actions.waitForApproval(approval.approvalId);

if (finalApproval.status === "approved") {
  // Execute the action
  const result = await actions.executeAction({
    actionId: "kill_switch",
    actionType: "system",
    target: "control-core",
    params: { enabled: true },
  }, {
    skipApproval: true, // Already approved
  });
}
```

### Workflow Execution

Execute multi-step workflows:

```typescript
const actions = client.getActions();

const workflow = {
  workflowId: "deploy-workflow",
  steps: [
    {
      stepId: "check",
      action: {
        actionId: "check_status",
        actionType: "read",
        target: "system",
        params: {},
      },
    },
    {
      stepId: "deploy",
      action: {
        actionId: "deploy",
        actionType: "execute",
        target: "production",
        params: { version: "1.0.0" },
      },
      waitFor: ["check"], // Wait for check to complete
    },
  ],
  parallel: false,
  status: "pending",
  results: {},
};

const result = await actions.executeWorkflow(workflow);
```

## Next Steps

This is Phase 5 of the Cursor-DreamNet integration. All critical unlocks are now complete!

- ✅ Phase 1: Direct API Access
- ✅ Phase 2: Event Streaming (SSE)
- ✅ Phase 3: Bidirectional Memory Access
- ✅ Phase 4: Agent Communication Protocol
- ✅ Phase 5: Autonomous Action System

