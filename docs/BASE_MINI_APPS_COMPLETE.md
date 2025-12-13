# Base Mini-Apps - Complete Documentation

**Package**: `@dreamnet/base-mini-apps`  
**Status**: ✅ Complete  
**Last Updated**: 2025-01-27

---

## Overview

Base Mini-Apps provides a **framework for creating and deploying mini-applications** on the Base blockchain. Mini-apps are on-chain applications that integrate with DreamNet systems (Dream State, Wolf Pack, API Keeper) and can require Dream State passports for access control.

### Key Features

- **Mini-App Registry**: Register and manage mini-applications
- **On-Chain Deployment**: Track contract addresses and deployment transactions
- **Passport Integration**: Require Dream State passports for access
- **Category System**: Organize apps by category (governance, identity, commerce, social, utility, gaming, DeFi, NFT)
- **Manifest System**: Define app permissions and dependencies
- **Status Management**: Track app status (draft, deployed, active, paused, deprecated)

---

## Architecture

### How It Works

```
Mini-App Creation → Deployment → Status Update → Registry Management → Manifest Definition
```

1. **Mini-App Creation**: Create mini-app with metadata (name, description, category)
2. **Deployment**: Deploy to Base blockchain, record contract address and tx hash
3. **Status Update**: Update status (draft → deployed → active)
4. **Registry Management**: Apps stored in registry for discovery
5. **Manifest Definition**: Define permissions and dependencies

### Why This Design

- **On-Chain Integration**: Mini-apps are Base blockchain applications
- **Passport Control**: Integration with Dream State enables access control
- **Category Organization**: Categories enable discovery and filtering
- **Manifest System**: Permissions and dependencies enable security and integration
- **Status Tracking**: Status enables lifecycle management

---

## API Reference

### Types

```typescript
export type MiniAppCategory =
  | "governance"
  | "identity"
  | "commerce"
  | "social"
  | "utility"
  | "gaming"
  | "defi"
  | "nft";

export type MiniAppStatus =
  | "draft"
  | "deployed"
  | "active"
  | "paused"
  | "deprecated";

export interface BaseMiniApp {
  id: string;
  name: string;
  description: string;
  category: MiniAppCategory;
  status: MiniAppStatus;
  contractAddress?: string;      // Base contract address
  contractName?: string;         // Contract name (e.g., 'DreamPassport')
  chainId: number;               // Base = 8453
  deploymentTx?: string;          // Deployment transaction hash
  features: string[];            // ["voting", "staking", "minting"]
  requiresPassport?: boolean;   // Requires Dream State passport?
  passportTier?: string[];       // Minimum tier required
  iconUrl?: string;
  bannerUrl?: string;
  colorScheme?: {
    primary: string;
    secondary: string;
  };
  integratesWith?: string[];     // ["dream-state", "wolf-pack", "api-keeper"]
  users?: number;
  transactions?: number;
  volume?: number;               // USD volume
  createdAt: number;
  deployedAt?: number;
  updatedAt: number;
}

export interface MiniAppManifest {
  name: string;
  version: string;
  description: string;
  entryPoint: string;            // URL or contract function
  permissions: string[];         // What it can access
  dependencies: string[];        // Other mini-apps or contracts
}
```

### Functions

#### `createMiniApp(name: string, description: string, category: MiniAppCategory, options?: {...}): BaseMiniApp`

Create a new mini-app.

**Example**:
```typescript
import { BaseMiniApps } from "@dreamnet/base-mini-apps";

const app = BaseMiniApps.createMiniApp(
  "Dream Passport",
  "Dream State passport management",
  "identity",
  {
    features: ["minting", "upgrading"],
    requiresPassport: false, // Doesn't require passport (it IS the passport)
    passportTier: [],
    integratesWith: ["dream-state"],
    iconUrl: "https://dreamnet.ink/icons/passport.png",
    colorScheme: {
      primary: "#6366f1",
      secondary: "#8b5cf6",
    },
  }
);
```

#### `createDefaultMiniApps(): BaseMiniApp[]`

Create default mini-apps (Dream Passport, Dream Vault, etc.).

**Example**:
```typescript
const defaultApps = BaseMiniApps.createDefaultMiniApps();
// Returns pre-configured apps
```

#### `deployMiniApp(appId: string, contractAddress: string, deploymentTx: string): boolean`

Record mini-app deployment.

**Example**:
```typescript
BaseMiniApps.deployMiniApp(
  "dream-passport",
  "0x1234...",
  "0xabcd..."
);
```

#### `getMiniApp(id: string): BaseMiniApp | undefined`

Get mini-app by ID.

#### `listMiniApps(): BaseMiniApp[]`

List all mini-apps.

#### `listActiveMiniApps(): BaseMiniApp[]`

List active mini-apps only.

#### `listByCategory(category: MiniAppCategory): BaseMiniApp[]`

List mini-apps by category.

**Example**:
```typescript
const governanceApps = BaseMiniApps.listByCategory("governance");
```

#### `updateMiniApp(id: string, updates: Partial<BaseMiniApp>): boolean`

Update mini-app.

**Example**:
```typescript
BaseMiniApps.updateMiniApp("dream-passport", {
  status: "active",
  users: 1000,
});
```

#### `addManifest(appId: string, manifest: MiniAppManifest): MiniAppManifest`

Add manifest for mini-app.

**Example**:
```typescript
BaseMiniApps.addManifest("dream-passport", {
  name: "Dream Passport",
  version: "1.0.0",
  description: "Dream State passport management",
  entryPoint: "0x1234...",
  permissions: ["mint", "upgrade"],
  dependencies: ["dream-state"],
});
```

#### `getManifest(appId: string): MiniAppManifest | undefined`

Get manifest for mini-app.

---

## Integration Points

### Consumes

- **Dream State Core**: Passport requirements and tier checking
- **Base Blockchain**: Contract addresses and deployment transactions

### Produces

- **Mini-App Registry**: Apps available for discovery and integration

### Integration Pattern

```typescript
// Create mini-app
const app = BaseMiniApps.createMiniApp(...);

// Deploy to Base
const tx = await deployContract(...);
BaseMiniApps.deployMiniApp(app.id, contractAddress, tx.hash);

// Update status
BaseMiniApps.updateMiniApp(app.id, { status: "active" });
```

---

## Usage Examples

### Create Mini-App

```typescript
import { BaseMiniApps } from "@dreamnet/base-mini-apps";

const app = BaseMiniApps.createMiniApp(
  "Dream Vault",
  "Token vault for DreamNet",
  "defi",
  {
    features: ["deposit", "withdraw", "staking"],
    requiresPassport: true,
    passportTier: ["dreamer", "citizen"],
    integratesWith: ["dream-state", "economic-engine"],
  }
);
```

### Deploy Mini-App

```typescript
// Deploy contract
const contract = await deployContract(...);

// Record deployment
BaseMiniApps.deployMiniApp(
  app.id,
  contract.address,
  contract.deploymentTx.hash
);

// Update status
BaseMiniApps.updateMiniApp(app.id, {
  status: "active",
  deployedAt: Date.now(),
});
```

### List Apps by Category

```typescript
// Get governance apps
const governanceApps = BaseMiniApps.listByCategory("governance");

// Get active apps
const activeApps = BaseMiniApps.listActiveMiniApps();
```

### Add Manifest

```typescript
BaseMiniApps.addManifest("dream-vault", {
  name: "Dream Vault",
  version: "1.0.0",
  description: "Token vault",
  entryPoint: "0x1234...",
  permissions: ["deposit", "withdraw"],
  dependencies: ["dream-state"],
});
```

---

## Best Practices

1. **Passport Requirements**: Set `requiresPassport` and `passportTier` for access control
2. **Category Selection**: Choose appropriate category for discovery
3. **Features List**: List all features for clarity
4. **Integration**: Specify `integratesWith` for system integration
5. **Manifest**: Define permissions and dependencies for security

---

## Security Considerations

- **Passport Control**: Use passport requirements for access control
- **Permissions**: Define permissions in manifest for security
- **Dependencies**: List dependencies to prevent circular references
- **Contract Verification**: Verify contract addresses match deployment

---

## Related Systems

- **Dream State Core**: Passport management and tier checking
- **Economic Engine Core**: Token economics for mini-apps
- **Identity Grid**: Identity management for mini-app users

---

**Status**: ✅ Complete  
**Next**: Continue with Economic Engine Core documentation
