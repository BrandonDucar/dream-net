# Browser Agent Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Browser Agent Core provides **safe, governed browser automation** for DreamNet agents. It enables agents to perform browser actions (navigation, clicking, typing, extraction) within controlled missions with domain restrictions, step limits, and audit logging.

---

## Key Features

### Safe Browser Automation
- Read-only mode
- Limited write mode
- Domain allowlisting
- Step limits
- Mission expiration

### Browser Actions
- Open URL
- Click elements
- Type text
- Wait/delay
- Extract text
- Screenshots

### Mission Management
- Mission creation
- Mission tracking
- Step counting
- Status monitoring
- Audit logging

### Credential Management
- Credential profiles
- Secure storage
- Profile-based login
- Never exposed to models

### Playwright Integration
- Playwright executor
- Screenshot capture
- Action execution
- Browser cleanup

---

## Architecture

### Components

1. **Mission Manager** (`mission.ts`)
   - Mission creation
   - Mission tracking
   - Authorization checks
   - Domain validation

2. **Executor** (`executor.ts`)
   - Action execution
   - Browser control
   - Error handling
   - Cleanup

3. **Playwright Executor** (`playwright-executor.ts`)
   - Playwright integration
   - Screenshot capture
   - Action sequences
   - Browser management

4. **Logger** (`logger.ts`)
   - Mission logging
   - Audit trails
   - Log export
   - Mission replay

5. **Credentials** (`credentials.ts`)
   - Credential profiles
   - Secure storage
   - Profile management
   - Login automation

---

## API Reference

### Mission Creation

#### `createMission(agentId: string, allowedDomains: string[], description: string, mode?: "read_only" | "limited_write", maxSteps?: number, expiresInHours?: number): BrowserMission`
Creates a new browser mission.

**Example**:
```typescript
import { BrowserAgentCore } from '@dreamnet/browser-agent-core';

const browserAgent = new BrowserAgentCore();

const mission = browserAgent.createMission(
  'agent-123',
  ['dreamnet.ink', 'example.com'],
  'Research competitor pricing',
  'read_only',
  50,
  24
);
```

### Action Execution

#### `executeStep(mission: BrowserMission | string, goal: string, action?: BrowserAction): Promise<BrowserToolOutput>`
Executes a browser action step.

**Example**:
```typescript
const result = await browserAgent.executeStep(
  mission.missionId,
  'Navigate to pricing page',
  { type: 'open_url', url: 'https://example.com/pricing' }
);

console.log(`Success: ${result.observation.success}`);
console.log(`URL: ${result.observation.url}`);
```

### Mission Management

#### `getMission(missionId: string): BrowserMission | undefined`
Gets mission by ID.

#### `endMission(missionId: string): void`
Ends a mission.

#### `listActiveMissions(): BrowserMission[]`
Lists active missions.

---

## Data Models

### BrowserMission

```typescript
interface BrowserMission {
  missionId: string;
  allowedDomains: string[];
  mode: "read_only" | "limited_write";
  maxSteps: number;
  expiresAt: string; // ISO timestamp
  description: string;
  agentId: string;
  createdAt: string; // ISO timestamp
  status: "active" | "completed" | "failed" | "aborted";
  currentStep: number;
}
```

### BrowserAction

```typescript
type BrowserAction =
  | { type: "open_url"; url: string }
  | { type: "click"; selector: string }
  | { type: "type"; selector: string; text: string }
  | { type: "wait"; ms: number }
  | { type: "extract_text"; selector?: string }
  | { type: "screenshot"; label?: string };
```

### BrowserObservation

```typescript
interface BrowserObservation {
  url: string;
  htmlSnippet?: string;
  textSnippet?: string;
  screenshotId?: string;
  notes?: string;
  success: boolean;
  error?: string;
}
```

### BrowserToolOutput

```typescript
interface BrowserToolOutput {
  observation: BrowserObservation;
  notes: string;
  missionStatus: BrowserMission["status"];
  remainingSteps: number;
}
```

---

## Mission Modes

### Read-Only Mode
- Navigation only
- Text extraction
- Screenshots
- No form submission
- No clicking buttons

### Limited Write Mode
- Form filling
- Button clicking
- Limited interactions
- Controlled actions
- Audit logging

---

## Browser Actions

### Open URL
- Navigate to URL
- Domain validation
- URL verification
- Error handling

### Click
- Element clicking
- Selector validation
- Click verification
- Error handling

### Type
- Text input
- Form filling
- Selector validation
- Input verification

### Wait
- Delay execution
- Time-based waiting
- Element waiting
- Conditional waiting

### Extract Text
- Text extraction
- Selector-based
- Full page extraction
- Structured data

### Screenshot
- Page screenshots
- Element screenshots
- Labeled screenshots
- Storage management

---

## Integration Points

### DreamNet Systems
- **Agent Registry Core**: Agent authorization
- **Dream Keeper**: Mission reporting
- **DreamNet Audit Core**: Audit logging
- **Spider Web Core**: Mission integration

### External Systems
- **Playwright**: Browser automation
- **Credential Storage**: Secure credentials
- **Screenshot Storage**: Media storage

---

## Usage Examples

### Create Mission

```typescript
const mission = browserAgent.createMission(
  'agent-123',
  ['dreamnet.ink'],
  'Research pricing',
  'read_only'
);
```

### Execute Actions

```typescript
// Navigate
await browserAgent.executeStep(mission.missionId, 'Navigate', {
  type: 'open_url',
  url: 'https://dreamnet.ink/pricing'
});

// Extract text
const result = await browserAgent.executeStep(mission.missionId, 'Extract pricing', {
  type: 'extract_text',
  selector: '.pricing-table'
});
```

### Login with Profile

```typescript
await browserAgent.loginWithProfile(
  mission.missionId,
  'dreamnet_admin'
);
```

---

## Best Practices

1. **Mission Design**
   - Set appropriate step limits
   - Use read-only when possible
   - Restrict domains strictly
   - Set expiration times

2. **Action Execution**
   - Validate selectors
   - Handle errors gracefully
   - Monitor step count
   - Log actions

3. **Security**
   - Never expose credentials
   - Use credential profiles
   - Audit all actions
   - Monitor missions

---

## Security Considerations

1. **Domain Restrictions**
   - Strict allowlisting
   - URL validation
   - Domain verification
   - Block unauthorized domains

2. **Credential Security**
   - Never expose to models
   - Use secure storage
   - Profile-based access
   - Audit credential usage

3. **Action Security**
   - Validate actions
   - Monitor step limits
   - Track mission status
   - Audit all actions

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27
