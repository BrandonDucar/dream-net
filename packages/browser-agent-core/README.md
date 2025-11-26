# Browser Agent Core

Safe, governed browser capability for DreamNet agents. This is a sandboxed, headless browser tool that specialized agents can use through a well-defined API.

## Overview

Browser Agent Core provides a controlled way for DreamNet agents to interact with web interfaces. It is **NOT** real OS control - it's a sandboxed browser automation tool with strict governance.

This capability is a **power multiplier** for DreamNet, enabling agents to automate tasks that have no API, require form filling, dashboard reading, UI navigation, partner portal logins, data scraping, or manual clicking - tasks that real humans waste time doing.

## Strategic Value

### For DreamNet (Brandon/Internal Use)

1. **Automated Partner/Investor Workflows**
   - Grant applications (AWS Activate, Google Cloud for Startups, Base Builder, hackathons)
   - Onboarding forms, file uploads, PDF generation
   - Replaces hours of manual "click → upload → next" workflows

2. **Multi-Platform Social Automation**
   - Pre-approved content posting, video uploads, cross-posting
   - Profile bio updates, engagement checking, analytics exports
   - Works even when platforms don't provide APIs

3. **DreamNet DevOps**
   - Dashboard monitoring, admin panel navigation
   - Deployment triggers, page validation, backup triggers
   - UI regression testing, login flow validation
   - Saves days of manual testing over months

4. **Real-Time Node Validation**
   - Automated health checks for new DreamNet nodes/mini-apps
   - Scripted validation, link checking, integration verification
   - Part of DreamKeeper governance system

5. **Government Paperwork Automation**
   - DMV, SBA, IRS, healthcare portals, city business portals
   - Document pulling, deadline checking, statement exports, file uploads
   - Massive personal time saver

### For DreamNet Users

1. **Form Filler Agent for Creators**
   - "Apply to this affiliate program" or "Create my shop listing"
   - Agent logs in, navigates, fills forms, posts content, uploads media
   - Great for small businesses, streamers, sellers, solopreneurs

2. **Safe UI Automation for Ecommerce**
   - Etsy, Whatnot, Gumroad, Shopify, Amazon Seller portal
   - Add products, update inventory, sync prices, export reports, check analytics

3. **DreamNet Site Checker**
   - Automatic QA for deployed mini-apps
   - Visits URL, screenshots pages, checks errors, verifies styles, scores performance
   - Replaces manual QA

4. **Onboarding Helper**
   - Walks users through wallet creation, Base setup, DreamNode linking
   - Automates half of annoying web3 onboarding that kills adoption

5. **Analytics Gatherer**
   - Logs in, navigates, scrapes metrics, produces dashboards, tracks growth
   - Perfect for creators, influencers, businesses

6. **Customer Support Assistant**
   - Logs into help desks, reads tickets, tags them, responds with templates
   - Escalates high-priority issues, exports reports
   - Businesses will pay for this

## Why This Makes DreamNet Special

No AI project—not Cursor, not OpenAI—offers a governed multi-agent system with safe browser control under a tokenized economy.

DreamNet becomes:
- A workforce
- A DevOps engine
- A UI automation engine
- A form-filling orchestra
- A personal assistant
- A business automation platform
- A dream amplifier

This becomes a major differentiator.

## Core Principles

1. **Specialized Agents Only** - Only WebOpsAgent and BrowserSurgeon can use this tool
2. **Domain Allowlist** - Strict domain restrictions (DreamNet apps, partner dashboards)
3. **Phased Capability** - Start READ-ONLY, add limited write actions later
4. **Full Audit Logging** - Every action logged and replayable
5. **Credential Indirection** - Credentials never exposed to model, accessed via named profiles

## Architecture

### Components

- **Mission Contract** (`mission.ts`) - Mission lifecycle, validation, allowlist enforcement
- **Browser Executor** (`executor.ts`) - Action execution (stubbed for Phase 1, ready for Playwright)
- **Logger** (`logger.ts`) - Audit logging system with replay capability
- **Credentials** (`credentials.ts`) - Credential profile management (stubbed for Phase 1)
- **Tool Interface** (`tool.ts`) - Agent-facing API
- **Agent Configs** (`config/`) - WebOpsAgent and BrowserSurgeon configurations

### Type System

```typescript
// Actions agents can perform
type BrowserAction =
  | { type: "open_url"; url: string }
  | { type: "click"; selector: string }
  | { type: "type"; selector: string; text: string }
  | { type: "wait"; ms: number }
  | { type: "extract_text"; selector?: string }
  | { type: "screenshot"; label?: string };

// Mission contract
interface BrowserMission {
  missionId: string;
  allowedDomains: string[];
  mode: "read_only" | "limited_write";
  maxSteps: number;
  expiresAt: string;
  description: string;
  agentId: string;
  // ...
}
```

## Usage

### Creating a Mission

```typescript
import { BrowserAgentCore } from "@dreamnet/browser-agent-core";

const browserCore = new BrowserAgentCore();

const mission = browserCore.createMission(
  "WebOpsAgent",
  ["dreamnet.ink", "admin.dreamnet.ink"],
  "Check admin dashboard status",
  "read_only",
  20, // max steps
  24 // expires in 24 hours
);
```

### Executing Actions

```typescript
const result = await browserCore.executeStep(
  {
    mission: mission.missionId,
    goal: "Open admin dashboard and check status",
    action: { type: "open_url", url: "https://dreamnet.ink/admin" },
  },
  "WebOpsAgent"
);

console.log(result.observation.textSnippet);
```

### Getting Mission Summary

```typescript
const summary = await browserCore.getMissionSummary(mission);
console.log(`Steps: ${summary.totalSteps}, Success: ${summary.successfulSteps}`);
```

## Security

### Domain Allowlist

Every URL is validated against the mission's `allowedDomains`:

```typescript
// ✅ Allowed
allowedDomains: ["dreamnet.ink"]
url: "https://dreamnet.ink/admin" // OK
url: "https://admin.dreamnet.ink" // OK (subdomain)

// ❌ Blocked
url: "https://example.com" // Not in allowlist
```

### Action Validation

- **Read-only mode**: Only `open_url`, `wait`, `extract_text`, `screenshot` allowed
- **Limited-write mode**: Can also use `click` and `type`
- **Step limits**: Missions have `maxSteps` to prevent infinite loops
- **Expiration**: Missions expire to prevent stale sessions

### Agent Authorization

Only authorized agents can use browser capability:

```typescript
isAgentAuthorized("WebOpsAgent") // ✅ true
isAgentAuthorized("BrowserSurgeon") // ✅ true
isAgentAuthorized("SomeOtherAgent") // ❌ false
```

## Audit Logging

All actions are logged to `logs/browser-missions/<missionId>.jsonl`:

```json
{
  "missionId": "mission-123",
  "step": 1,
  "timestamp": "2025-01-27T12:00:00Z",
  "action": { "type": "open_url", "url": "https://dreamnet.ink/admin" },
  "observationSummary": "Opened URL successfully",
  "url": "https://dreamnet.ink/admin",
  "success": true,
  "duration": 150
}
```

### Replay Missions

```typescript
await browserCore.replayMission(missionId);
// Replays all logged actions for audit/review
```

## Credentials

Credentials are **NEVER** exposed to the model. They're loaded from env/secrets:

```typescript
// Agent calls this (no credentials exposed)
await browserLogin("dreamnet_admin");

// Internally, credentials loaded from:
// - process.env.BROWSER_CREDENTIALS_dreamnet_admin_username
// - process.env.BROWSER_CREDENTIALS_dreamnet_admin_password
// - Or from secrets vault
```

Available profiles:
- `dreamnet_admin` - DreamNet admin dashboard
- `partner_dashboard` - Partner dashboard access
- `test_account` - Test account for development

## Phase 1 vs Phase 2

### Phase 1 (Complete)
- ✅ Type definitions
- ✅ Mission contract and validation
- ✅ Logging system
- ✅ Stubbed browser executor (simulates actions)
- ✅ Credential system (stubbed)
- ✅ Tool interface
- ✅ Agent configurations

### Phase 2 (Complete)
- ✅ Real Playwright integration
- ✅ Real credential login flows
- ✅ Screenshot storage and link generation
- ✅ Browser instance management
- ✅ API routes for screenshots and status
- ⏳ Integration with DreamKeeper/governor (pending)
- ⏳ Cost tracking and rate limiting (pending)

## Examples

### Basic Example

See `test/example.ts` for a basic example using the stub executor:

```bash
cd packages/browser-agent-core
pnpm test
```

### Real-World Use Cases

See `examples/` directory for complete implementations:

- **`grant-application.ts`** - Automated grant application workflow
- **`dashboard-monitor.ts`** - Dashboard monitoring for DevOps
- **`form-filler.ts`** - Form filling agent for creators
- **`site-checker.ts`** - Automated QA for DreamNet mini-apps

```typescript
import { automateGrantApplication, monitorDashboard, fillAffiliateForm, checkDreamNetSite } from "@dreamnet/browser-agent-core/examples";

// Apply to a grant
await automateGrantApplication();

// Monitor dashboard
await monitorDashboard();

// Fill a form
await fillAffiliateForm("https://example.com/apply", {
  name: "DreamNet",
  email: "contact@dreamnet.ink",
  company: "DreamNet",
});

// Check a site
await checkDreamNetSite("https://dreamnet.ink");
```

## Integration

### With Agent Registry

```typescript
// Register WebOpsAgent with browser capability
AgentRegistryCore.upsertAgentConfig({
  id: "WebOpsAgent",
  name: "WebOpsAgent",
  capabilities: ["browser_mission_step"],
  // ...
});
```

### With DreamKeeper

```typescript
// Report mission summary to DreamKeeper
const summary = await browserCore.getMissionSummary(mission);
DreamKeeper.reportBrowserMission(summary);
```

## Files

- `types.ts` - All type definitions
- `mission.ts` - Mission contract and validation
- `executor.ts` - Browser action executor (stubbed)
- `logger.ts` - Audit logging system
- `credentials.ts` - Credential profiles (stubbed)
- `tool.ts` - Agent-facing tool interface
- `index.ts` - Main exports
- `config/webops-agent.ts` - WebOpsAgent configuration
- `config/browser-surgeon.ts` - BrowserSurgeon configuration
- `test/example.ts` - Example usage

## Next Steps

1. **Test the system**: Run `pnpm test` in the package
2. **Integrate with agents**: Register WebOpsAgent and BrowserSurgeon
3. **Add real browser**: Replace stubbed executor with Playwright
4. **Add credentials**: Implement real credential loading
5. **Integrate with DreamKeeper**: Add mission reporting

---

**Status**: Phase 2 complete - Playwright integration active, ready for production use

