# Browser Agent Core - Integration Guide

This guide explains how to integrate Browser Agent Core with other DreamNet systems.

## Agent Registry Integration

Browser-capable agents are automatically registered with the agent registry on server startup.

### Registered Agents

1. **WebOpsAgent**
   - Kind: `infra`
   - Subsystem: `BrowserAgentCore`
   - Tags: `browser`, `automation`, `devops`, `web-ops`

2. **BrowserSurgeon**
   - Kind: `infra`
   - Subsystem: `BrowserAgentCore`
   - Tags: `browser`, `automation`, `diagnostics`, `repair`

### Manual Registration

If you need to register agents manually:

```typescript
import { initBrowserAgentIntegration } from "@dreamnet/browser-agent-core";

initBrowserAgentIntegration();
```

## DreamKeeper Integration

Browser missions are automatically reported to DreamKeeper via Instant Mesh events.

### Event Types

1. **`browser.mission.started`**
   - Emitted when a mission starts
   - Payload: mission details, allowed domains, mode

2. **`browser.mission.completed`**
   - Emitted when a mission completes
   - Payload: mission summary, statistics, duration

3. **`browser.mission.failed`**
   - Emitted when a mission fails
   - Payload: error details, mission info

### Listening to Events

```typescript
// In your DreamKeeper implementation
instantMesh.on("browser.mission.completed", (event) => {
  const { missionId, agentId, summary } = event.payload;
  // Process mission completion
  // Track costs, update governance, etc.
});
```

### Manual Reporting

```typescript
import { reportMissionToDreamKeeper } from "@dreamnet/browser-agent-core";

await reportMissionToDreamKeeper(mission, summary);
```

## Server Integration

Browser Agent Core is automatically integrated into the main server.

### API Routes

- `GET /api/browser-agent/status` - Get mission status
- `GET /api/browser-screenshots/:screenshotId` - Serve screenshots

### Initialization

The integration happens automatically in `server/index.ts`:

```typescript
// Browser Agent Core integration
const { initBrowserAgentIntegration } = await import("@dreamnet/browser-agent-core/integration/agent-registry");
initBrowserAgentIntegration();
```

## Using Action Helpers

Utility functions for common action patterns:

```typescript
import {
  createFormFillSequence,
  createNavigationSequence,
  combineActionSequences,
  addWaitsBetweenActions,
} from "@dreamnet/browser-agent-core";

// Create form filling sequence
const formActions = createFormFillSequence({
  name: "DreamNet",
  email: "contact@dreamnet.ink",
  company: "DreamNet",
});

// Create navigation sequence
const navActions = createNavigationSequence([
  "https://dreamnet.ink",
  "https://dreamnet.ink/admin",
]);

// Combine sequences
const allActions = combineActionSequences(navActions, formActions);

// Add waits between actions
const actionsWithWaits = addWaitsBetweenActions(allActions, 1000);
```

## Custom Integrations

### Adding Custom Event Handlers

```typescript
import { BrowserAgentCore } from "@dreamnet/browser-agent-core";

const browserCore = new BrowserAgentCore();

// Wrap mission execution with custom logic
const mission = browserCore.createMission(...);

// Add custom event handling
mission.onComplete = async (summary) => {
  // Custom logic here
  await sendNotification(summary);
  await updateDatabase(summary);
};
```

### Extending Action Types

To add new action types, extend the `BrowserAction` type and update the executor:

```typescript
// In types.ts
export type BrowserAction =
  | { type: "open_url"; url: string }
  | { type: "upload_file"; selector: string; filePath: string } // New action
  | // ... other actions

// In playwright-executor.ts
case "upload_file":
  await page.setInputFiles(action.selector, action.filePath);
  return { ... };
```

## Environment Variables

### Required

None (browser agent works with stub mode by default)

### Optional

```bash
# Screenshot storage directory
BROWSER_SCREENSHOT_DIR=storage/browser-screenshots

# Credential profiles (never exposed to model)
BROWSER_CREDENTIALS_dreamnet_admin_USERNAME=admin@dreamnet.ink
BROWSER_CREDENTIALS_dreamnet_admin_PASSWORD=secure-password

BROWSER_CREDENTIALS_partner_dashboard_USERNAME=partner@example.com
BROWSER_CREDENTIALS_partner_dashboard_PASSWORD=secure-password
```

## Testing Integration

### Test Agent Registration

```typescript
import { AgentRegistryCore } from "@dreamnet/agent-registry-core";

const webOpsAgent = AgentRegistryCore.getAgentHealth("WebOpsAgent");
console.log(webOpsAgent); // Should return agent health
```

### Test DreamKeeper Events

```typescript
// In test environment
const instantMesh = (global as any).instantMesh;
instantMesh.on("browser.mission.completed", (event) => {
  console.log("Mission completed:", event.payload);
});
```

## Troubleshooting

### Agents Not Registered

- Check that `initBrowserAgentIntegration()` is called
- Verify agent registry is initialized
- Check console for error messages

### Events Not Received

- Verify Instant Mesh is initialized
- Check that `global.instantMesh` is available
- Verify event types match exactly

### Screenshots Not Serving

- Check `BROWSER_SCREENSHOT_DIR` is set correctly
- Verify directory exists and is writable
- Check API route is registered in server

---

For more information, see:
- `README.md` - Main documentation
- `USE_CASES.md` - Use case examples
- `IMPLEMENTATION_COMPLETE.md` - Implementation details

