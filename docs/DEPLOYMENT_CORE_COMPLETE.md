# Deployment Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Deployment Core provides **unified deployment abstraction** for all hosting platforms. Instead of being dependent on Vercel, DreamNet IS the deployment platform. Supports multiple platforms including DreamNet's own platform, Vercel, Netlify, Railway, Cloudflare Pages, Render, and more.

---

## Key Features

### Multi-Platform Support
- DreamNet native platform
- Vercel
- Netlify
- Railway
- Cloudflare Pages
- Render
- And 8+ more platforms

### Unified API
- Single deployment interface
- Platform abstraction
- Consistent configuration
- Unified result format

### Deployment Management
- Deploy to single platform
- Deploy to all platforms
- Status checking
- Deployment listing

---

## Architecture

### Components

1. **Deployment Manager** (`index.ts`)
   - Provider registration
   - Deployment routing
   - Multi-platform deployment
   - Platform management

2. **Deployment Providers**
   - DreamNetDeploymentProvider
   - VercelDeploymentProvider
   - NetlifyDeploymentProvider
   - RailwayDeploymentProvider
   - CloudflarePagesDeploymentProvider
   - RenderDeploymentProvider
   - And more...

---

## API Reference

### Deployment Manager

#### `getDeploymentManager(): DeploymentManager`
Gets singleton deployment manager instance.

**Example**:
```typescript
import { getDeploymentManager } from '@dreamnet/deployment-core';

const manager = getDeploymentManager();
```

#### `deploy(config: DeploymentConfig): Promise<DeploymentResult>`
Deploys to specified platform.

**Example**:
```typescript
import { getDeploymentManager } from '@dreamnet/deployment-core';

const manager = getDeploymentManager();
const result = await manager.deploy({
  platform: 'dreamnet',
  projectName: 'my-project',
  sourceDirectory: './dist',
  buildCommand: 'npm run build',
  outputDirectory: './dist',
});

if (result.success) {
  console.log(`Deployed to: ${result.url}`);
}
```

#### `deployToAll(config: Omit<DeploymentConfig, 'platform'>): Promise<DeploymentResult[]>`
Deploys to all available platforms.

**Example**:
```typescript
const results = await manager.deployToAll({
  projectName: 'my-project',
  sourceDirectory: './dist',
});

results.forEach(result => {
  console.log(`${result.platform}: ${result.success ? result.url : result.error}`);
});
```

#### `listAvailablePlatforms(): DeploymentPlatform[]`
Lists all available platforms.

**Example**:
```typescript
const platforms = manager.listAvailablePlatforms();
console.log(`Available platforms: ${platforms.join(', ')}`);
```

### Provider Operations

#### `getProvider(platform: DeploymentPlatform): DeploymentProvider | undefined`
Gets provider for a platform.

**Example**:
```typescript
const provider = manager.getProvider('vercel');
if (provider) {
  const result = await provider.deploy(config);
}
```

#### `registerProvider(provider: DeploymentProvider): void`
Registers a custom provider.

**Example**:
```typescript
class CustomProvider extends BaseDeploymentProvider {
  name: DeploymentPlatform = 'custom';
  // ... implement methods
}

manager.registerProvider(new CustomProvider());
```

---

## Data Models

### DeploymentConfig

```typescript
interface DeploymentConfig {
  platform: DeploymentPlatform;
  projectName: string;
  sourceDirectory: string;
  buildCommand?: string;
  outputDirectory?: string;
  environmentVariables?: Record<string, string>;
  customDomain?: string;
}
```

### DeploymentResult

```typescript
interface DeploymentResult {
  success: boolean;
  deploymentId?: string;
  url?: string;
  platform: DeploymentPlatform;
  error?: string;
  logs?: string[];
}
```

### DeploymentPlatform

```typescript
type DeploymentPlatform =
  | 'dreamnet'
  | 'vercel'
  | 'netlify'
  | 'railway'
  | 'cloudflare-pages'
  | 'render'
  | 'fly-io'
  | 'aws-amplify'
  | 'azure-static-web-apps'
  | 'github-pages'
  | 'surge'
  | 'firebase-hosting'
  | 'digitalocean-app-platform'
  | 'heroku'
  | 'pixl';
```

---

## Supported Platforms

### DreamNet Native
- **Platform**: `dreamnet`
- **Features**: Full control, custom infrastructure
- **URL Format**: `https://{projectName}.dreamnet.ink`

### Vercel
- **Platform**: `vercel`
- **Features**: Edge functions, automatic HTTPS
- **URL Format**: `https://{projectName}.vercel.app`
- **Required**: `VERCEL_TOKEN` environment variable

### Netlify
- **Platform**: `netlify`
- **Features**: Git integration, form handling
- **URL Format**: `https://{projectName}.netlify.app`
- **Required**: `NETLIFY_TOKEN` environment variable

### Railway
- **Platform**: `railway`
- **Features**: Database hosting, background jobs
- **URL Format**: `https://{projectName}.railway.app`
- **Required**: `RAILWAY_TOKEN` environment variable

### Cloudflare Pages
- **Platform**: `cloudflare-pages`
- **Features**: Global CDN, Workers integration
- **URL Format**: `https://{projectName}.pages.dev`
- **Required**: `CLOUDFLARE_API_TOKEN` environment variable

### Render
- **Platform**: `render`
- **Features**: Auto-deploy, SSL certificates
- **URL Format**: `https://{projectName}.onrender.com`
- **Required**: `RENDER_API_KEY` environment variable

---

## DreamNet Native Platform

### Features
- Full control over infrastructure
- Custom CDN integration
- DreamNet-specific optimizations
- Integrated with DreamNet ecosystem

### Implementation
- Build project
- Upload to DreamNet CDN
- Configure routing
- Return deployment URL

---

## Integration Points

### DreamNet Systems
- **DreamNet OS Core**: Deployment orchestration
- **DreamNet Audit Core**: Deployment audit logging
- **DreamNet Cost Core**: Deployment cost tracking
- **Observability Core**: Deployment tracing

### External Systems
- **Platform APIs**: Platform-specific integrations
- **CI/CD Systems**: Automated deployments
- **Monitoring**: Deployment monitoring

---

## Usage Examples

### Deploy to DreamNet

```typescript
const result = await manager.deploy({
  platform: 'dreamnet',
  projectName: 'my-app',
  sourceDirectory: './dist',
});
```

### Deploy to Multiple Platforms

```typescript
const results = await manager.deployToAll({
  projectName: 'my-app',
  sourceDirectory: './dist',
});
```

### Check Deployment Status

```typescript
const provider = manager.getProvider('vercel');
const status = await provider.getStatus('deployment-id');
```

---

## Best Practices

1. **Deployment**
   - Use appropriate platform
   - Configure environment variables
   - Monitor deployments
   - Handle errors gracefully

2. **Multi-Platform**
   - Deploy to multiple platforms for redundancy
   - Monitor all deployments
   - Use platform-specific features
   - Optimize for each platform

---

## Security Considerations

1. **Platform Security**
   - Secure API tokens
   - Validate configurations
   - Monitor deployments
   - Audit deployment access

2. **Deployment Security**
   - Validate source code
   - Secure build process
   - Protect environment variables
   - Monitor deployment logs

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

