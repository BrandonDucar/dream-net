# Ops Sentinel - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Ops Sentinel enforces the **DreamNet OPS_CONTRACT** at runtime and in CI. It validates Vercel configuration, package scripts, repository structure, and provides build/deploy plans and integration configuration. Ensures operational consistency across DreamNet deployments.

---

## Key Features

### Contract Enforcement
- OPS_CONTRACT loading
- Runtime validation
- CI validation
- Configuration validation

### Validation Checks
- Vercel configuration validation
- Package scripts validation
- Repository structure validation
- Repository setup validation

### Advice Generation
- Frontend build plans
- Backend deploy plans
- Integration configuration
- Required environment variables

---

## Architecture

### Components

1. **Contracts** (`contracts.ts`)
   - OPS_CONTRACT definition
   - Frontend configuration
   - Backend configuration
   - Integration descriptors
   - Environment variable descriptors

2. **Checks** (`checks.ts`)
   - Validation functions
   - Configuration checks
   - Structure checks
   - Setup checks

3. **Advice** (`advice.ts`)
   - Build plan generation
   - Deploy plan generation
   - Integration configuration
   - Environment variable requirements

---

## API Reference

### Contract Loading

#### `loadOpsContract(): OpsContract`
Loads the canonical OPS_CONTRACT definition.

**Example**:
```typescript
import { loadOpsContract } from '@dreamnet/ops-sentinel';

const contract = loadOpsContract();
console.log(`Version: ${contract.version}`);
console.log(`Frontend: ${contract.frontend.rootDirectory}`);
console.log(`Backend: ${contract.backend.serviceRoot}`);
```

### Validation

#### `validateVercelConfig(): ValidationResult`
Validates Vercel configuration.

**Example**:
```typescript
import { validateVercelConfig } from '@dreamnet/ops-sentinel';

const result = validateVercelConfig();
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

#### `validatePackageScripts(): ValidationResult`
Validates package scripts.

**Example**:
```typescript
import { validatePackageScripts } from '@dreamnet/ops-sentinel';

const result = validatePackageScripts();
```

#### `validateRepoStructure(): ValidationResult`
Validates repository structure.

**Example**:
```typescript
import { validateRepoStructure } from '@dreamnet/ops-sentinel';

const result = validateRepoStructure();
```

#### `validateRepoSetup(): ValidationResult`
Validates repository setup.

**Example**:
```typescript
import { validateRepoSetup } from '@dreamnet/ops-sentinel';

const result = validateRepoSetup();
```

### Advice Generation

#### `getFrontendBuildPlan(): BuildPlan`
Gets frontend build plan.

**Example**:
```typescript
import { getFrontendBuildPlan } from '@dreamnet/ops-sentinel';

const plan = getFrontendBuildPlan();
console.log(`Root directory: ${plan.rootDirectory}`);
console.log(`Build command: ${plan.buildCommand}`);
```

#### `getBackendDeployPlan(): DeployPlan`
Gets backend deploy plan.

**Example**:
```typescript
import { getBackendDeployPlan } from '@dreamnet/ops-sentinel';

const plan = getBackendDeployPlan();
console.log(`Service root: ${plan.serviceRoot}`);
console.log(`Start command: ${plan.startCommand}`);
```

#### `getIntegrationConfig(name: string): IntegrationDescriptor | undefined`
Gets integration configuration.

**Example**:
```typescript
import { getIntegrationConfig } from '@dreamnet/ops-sentinel';

const vercel = getIntegrationConfig('Vercel');
if (vercel) {
  console.log(`Category: ${vercel.category}`);
  console.log(`Status: ${vercel.status}`);
}
```

#### `getRequiredEnvVars(): EnvVarDescriptor[]`
Gets required environment variables.

**Example**:
```typescript
import { getRequiredEnvVars } from '@dreamnet/ops-sentinel';

const envVars = getRequiredEnvVars();
envVars.forEach(envVar => {
  console.log(`${envVar.name}: ${envVar.description}`);
});
```

---

## Data Models

### OpsContract

```typescript
interface OpsContract {
  version: string;
  frontend: FrontendConfig;
  backend: BackendConfig;
  integrations: IntegrationDescriptor[];
  envVars: EnvVarDescriptor[];
}
```

### FrontendConfig

```typescript
interface FrontendConfig {
  rootDirectory: string;
  installCommand: string;
  buildCommand: string;
  outputDirectory: string;
  rewrites: Array<{
    source: string;
    destination: string;
  }>;
}
```

### BackendConfig

```typescript
interface BackendConfig {
  serviceRoot: string;
  installCommand: string;
  buildCommand: string;
  startCommand: string;
}
```

### IntegrationDescriptor

```typescript
interface IntegrationDescriptor {
  name: string;
  category: 'Infra' | 'Blockchain' | 'Comms' | 'Payments' | 'AI' | 'Social' | 'Internal';
  codeLocations: string[];
  requiredEnvVars: string[];
  status: 'active' | 'planned' | 'deprecated';
}
```

### ValidationResult

```typescript
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}
```

---

## OPS_CONTRACT Structure

### Frontend Configuration
- Root directory: `client`
- Install command: `cd .. && pnpm --filter client... install --no-frozen-lockfile`
- Build command: `pnpm run build`
- Output directory: `dist`
- Rewrites: API proxy, SPA fallback

### Backend Configuration
- Service root: `server`
- Install command: `pnpm install`
- Build command: `pnpm run build`
- Start command: `pnpm start`

### Integrations
- Infrastructure: Vercel, Railway, Neon PostgreSQL
- Blockchain: Base Mainnet, Ethereum Mainnet
- Communications: Twilio, Resend
- Payments: Stripe
- AI: OpenAI, Anthropic
- Social: Twitter, LinkedIn
- Internal: DreamNet systems

---

## Integration Points

### DreamNet Systems
- **Deployment Core**: Deployment validation
- **DreamNet OS Core**: System validation
- **CI/CD Systems**: CI validation
- **Build Systems**: Build validation

---

## Usage Examples

### Load Contract

```typescript
const contract = loadOpsContract();
```

### Validate Configuration

```typescript
const result = validateVercelConfig();
if (!result.valid) {
  console.error('Invalid configuration');
}
```

### Get Build Plan

```typescript
const plan = getFrontendBuildPlan();
```

---

## Best Practices

1. **Contract Management**
   - Keep contract updated
   - Validate regularly
   - Enforce in CI
   - Document changes

2. **Validation**
   - Run checks in CI
   - Validate before deployment
   - Fix issues promptly
   - Monitor compliance

---

## Security Considerations

1. **Contract Security**
   - Secure contract definition
   - Validate contract integrity
   - Control contract changes
   - Audit contract usage

2. **Validation Security**
   - Secure validation process
   - Validate inputs
   - Prevent bypass
   - Monitor violations

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

