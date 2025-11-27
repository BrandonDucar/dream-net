# Wrappers Layer Specification

## Overview

The Wrappers Layer provides thin, typed interfaces around existing DreamNet subsystems. This allows Antigravity to reason about and interact with DreamNet subsystems without modifying core code directly.

## Purpose

The wrappers serve to:
- Provide clean interfaces to existing subsystems
- Enable Antigravity to wrap subsystems with additional logic
- Maintain separation of concerns
- Allow gradual migration to new implementations

## Wrapper Principles

1. **Thin Wrappers**: Wrappers are thin interfaces, not heavy abstractions
2. **No Core Modifications**: Wrappers don't modify existing subsystems
3. **Type Safety**: All wrappers are fully typed
4. **Extensibility**: Easy to extend wrappers with new functionality

## Available Wrappers

### BrowserAgentWrapper

Wraps Browser Agent Core functionality:

```typescript
class BrowserAgentWrapper {
  async executeMission(mission: BrowserMission): Promise<BrowserMissionResult> {
    // Will call actual Browser Agent Core
  }
}
```

**Purpose**: Allows Antigravity to:
- Execute browser automation missions
- Monitor browser agent health
- Integrate browser agent with other agents

### ShieldCoreWrapper

Wraps Shield Core (security system) functionality:

```typescript
class ShieldCoreWrapper {
  async checkThreat(threat: Threat): Promise<ThreatAssessment> {
    // Will call actual Shield Core
  }
}
```

**Purpose**: Allows Antigravity to:
- Check threats through Shield Core
- Integrate security checks into agent workflows
- Monitor security events

### FreeTierWrapper

Wraps Free Tier quota management:

```typescript
class FreeTierWrapper {
  async checkQuota(): Promise<QuotaStatus> {
    // Will call actual Free Tier service
  }
}
```

**Purpose**: Allows Antigravity to:
- Check Google Cloud Free Tier quotas
- Enforce quota limits
- Monitor resource usage

### DeploymentWrapper

Wraps deployment system functionality:

```typescript
class DeploymentWrapper {
  async deploy(config: DeploymentConfig): Promise<DeploymentResult> {
    // Will call actual deployment system
  }
}
```

**Purpose**: Allows Antigravity to:
- Deploy applications
- Monitor deployments
- Rollback deployments

### DreamKeeperWrapper

Wraps DreamKeeper functionality:

```typescript
class DreamKeeperWrapper {
  async keepDream(dream: Dream): Promise<DreamStatus> {
    // Will call actual DreamKeeper
  }
}
```

**Purpose**: Allows Antigravity to:
- Manage dreams through DreamKeeper
- Track dream status
- Integrate dream management into agent workflows

### MiniAppWrapper

Wraps Mini App system functionality:

```typescript
class MiniAppWrapper {
  async createMiniApp(config: MiniAppConfig): Promise<MiniApp> {
    // Will call actual Mini App system
  }
}
```

**Purpose**: Allows Antigravity to:
- Create mini apps
- Manage mini app lifecycle
- Integrate mini apps into agent workflows

## Wrapper Usage Pattern

```typescript
// Antigravity will use wrappers like this:
const browserWrapper = new BrowserAgentWrapper();
const result = await browserWrapper.executeMission({
  url: "https://example.com",
  actions: ["screenshot", "extract_data"]
});

const shieldWrapper = new ShieldCoreWrapper();
const threatCheck = await shieldWrapper.checkThreat({
  source: "external",
  type: "suspicious_request"
});
```

## Integration Strategy

1. **Phase 1**: Create wrapper interfaces (current state)
2. **Phase 2**: Antigravity implements wrapper logic to call actual subsystems
3. **Phase 3**: Antigravity adds additional logic around wrappers
4. **Phase 4**: Gradually migrate subsystems to use wrappers

## Current State

All wrappers are empty stubs. Antigravity will:
- Implement wrapper methods to call actual subsystems
- Add error handling and logging
- Add monitoring and metrics
- Integrate with Event Bus for event propagation

## Benefits

1. **Non-Breaking**: Wrappers don't modify existing code
2. **Testable**: Easy to mock wrappers for testing
3. **Extensible**: Easy to add new wrapper functionality
4. **Maintainable**: Clear separation between wrapper and core logic

## Future Enhancements

1. **Wrapper Composition**: Compose multiple wrappers
2. **Wrapper Middleware**: Add middleware to wrappers
3. **Wrapper Caching**: Cache wrapper results
4. **Wrapper Analytics**: Track wrapper usage and performance

