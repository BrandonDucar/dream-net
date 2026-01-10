# DreamNet Deployment Core Overview

**Status:** Active (Providers Stubbed)
**Package:** `@dreamnet/deployment-core`
**Last Updated:** 2025-11-27

## Introduction

The Deployment Core is DreamNet's unified deployment abstraction layer. Instead of being dependent on a single platform like Vercel, DreamNet **IS** the deployment platform, providing a consistent interface across 15+ hosting providers.

## Philosophy

> **"Why be dependent on Vercel when we can BE Vercel?"**

The Deployment Core allows DreamNet to:
1. Deploy to any platform with a single API
2. Switch providers without code changes
3. Deploy to multiple platforms simultaneously
4. Build our own native DreamNet hosting platform

## Supported Platforms

| Platform | Provider Class | Status |
|----------|----------------|--------|
| `dreamnet` | `DreamNetDeploymentProvider` | 🟡 Stubbed |
| `vercel` | `VercelDeploymentProvider` | 🟡 Stubbed |
| `netlify` | `NetlifyDeploymentProvider` | 🟡 Stubbed |
| `railway` | `RailwayDeploymentProvider` | 🟡 Stubbed |
| `cloudflare-pages` | `CloudflarePagesDeploymentProvider` | 🟡 Stubbed |
| `render` | `RenderDeploymentProvider` | 🟡 Stubbed |
| `fly-io` | - | 🔴 Not Implemented |
| `aws-amplify` | - | 🔴 Not Implemented |
| `azure-static-web-apps` | - | 🔴 Not Implemented |
| `github-pages` | - | 🔴 Not Implemented |
| `surge` | - | 🔴 Not Implemented |
| `firebase-hosting` | - | 🔴 Not Implemented |
| `digitalocean-app-platform` | - | 🔴 Not Implemented |
| `heroku` | - | 🔴 Not Implemented |
| `pixl` | - | 🔴 Not Implemented |

## Usage

### Basic Deployment

```typescript
import { getDeploymentManager } from '@dreamnet/deployment-core';

const manager = getDeploymentManager();

const result = await manager.deploy({
  platform: 'vercel',
  projectName: 'my-app',
  sourceDirectory: './client',
  buildCommand: 'pnpm run build',
  outputDirectory: 'dist',
  environmentVariables: {
    VITE_API_URL: 'https://api.dreamnet.ink'
  }
});

console.log(`Deployed to: ${result.url}`);
```

### Deploy to Multiple Platforms

```typescript
const results = await manager.deployToAll({
  projectName: 'my-app',
  sourceDirectory: './client',
  buildCommand: 'pnpm run build',
  outputDirectory: 'dist'
});

results.forEach(result => {
  if (result.success) {
    console.log(`✅ ${result.platform}: ${result.url}`);
  } else {
    console.error(`❌ ${result.platform}: ${result.error}`);
  }
});
```

### List Available Platforms

```typescript
const platforms = manager.listAvailablePlatforms();
// ['dreamnet', 'vercel', 'netlify', 'railway', ...]
```

## Architecture

### DeploymentManager
**File:** `packages/deployment-core/src/index.ts`
**Role:** Singleton orchestrator that routes deployments to the appropriate provider.

### Provider Interface

```typescript
export interface DeploymentProvider {
  name: DeploymentPlatform;
  deploy(config: DeploymentConfig): Promise<DeploymentResult>;
  getStatus(deploymentId: string): Promise<DeploymentResult>;
  listDeployments(): Promise<DeploymentResult[]>;
}
```

### Base Provider

```typescript
export abstract class BaseDeploymentProvider implements DeploymentProvider {
  abstract name: DeploymentPlatform;
  abstract deploy(config: DeploymentConfig): Promise<DeploymentResult>;
  abstract getStatus(deploymentId: string): Promise<DeploymentResult>;
  abstract listDeployments(): Promise<DeploymentResult[]>;

  protected validateConfig(config: DeploymentConfig): void {
    // Common validation logic
  }
}
```

## Spine Integration

**Status:** ✅ **Integrated**

The Deployment Core is now integrated with the Interop Spine via `DeploymentWrapper`.

**Integration Point:**
`spine/wrappers/DeploymentWrapper.ts` wraps the `DeploymentManager` and emits lifecycle events (`DEPLOYMENT_STARTED`, `DEPLOYMENT_COMPLETE`) to the central Event Bus.

```typescript
// spine/wrappers/DeploymentWrapper.ts
export class DeploymentWrapper {
  constructor(private spine: InteropSpine) {}

  async deploy(config: DeploymentConfig) {
    const manager = getDeploymentManager();
    const result = await manager.deploy(config);

    // Publish to Spine event bus
    this.spine.publish('deployment.complete', result);

    return result;
  }
}
```

See [SPINE_OVERVIEW.md](file:///c:/Users/brand/OneDrive/Documents/GitHub/dream-net/docs/SPINE_OVERVIEW.md) for details.

## Implementation Status

### Completed
- ✅ Core architecture and interfaces
- ✅ DeploymentManager singleton
- ✅ Provider registration system
- ✅ Base provider class with validation

### Stubbed (Needs Implementation)
- 🟡 Vercel provider (API integration)
- 🟡 Netlify provider (API integration)
- 🟡 Railway provider (API integration)
- 🟡 Cloudflare Pages provider (API integration)
- 🟡 Render provider (API integration)
- 🟡 DreamNet native provider (full implementation)

### Not Started
- 🔴 Remaining 9 platforms
- 🔴 Deployment rollback
- 🔴 Blue/green deployments
- 🔴 Deployment analytics

## Related Documentation

- [Agent Registry Overview](file:///c:/Users/brand/OneDrive/Documents/GitHub/dream-net/docs/AGENT_REGISTRY_OVERVIEW.md)
- [Spine Overview](file:///c:/Users/brand/OneDrive/Documents/GitHub/dream-net/docs/SPINE_OVERVIEW.md)
- [Registry-Spine Topology Map](file:///c:/Users/brand/OneDrive/Documents/GitHub/dream-net/docs/internal/registry_spine_topology.md)
