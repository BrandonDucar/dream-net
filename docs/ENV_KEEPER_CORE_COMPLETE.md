# Env Keeper Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Env Keeper Core is a **zero-touch environment variable management system** that automatically discovers, classifies, and manages all environment variables. It provides secure storage, automatic classification, and seamless integration with DreamNet systems.

---

## Key Features

### Zero-Touch Auto-Discovery
- Automatically discovers ALL environment variables
- Scans process.env, .env files, and external services
- Auto-applies to process.env
- Never manually manage env vars again

### Automatic Classification
- Classifies variables by sensitivity (secret, internal, public)
- Categorizes by type (api_keys, database, auth, etc.)
- Pattern-based detection
- Registry-based tracking

### Secure Storage
- Encrypted storage for secrets
- Secure key management
- Access control
- Audit logging

### Multi-Source Sync
- Process environment
- .env files
- Vercel environment
- Other cloud providers

---

## Architecture

### Components

1. **Env Discoverer** (`logic/envDiscoverer.ts`)
   - Discovers from process.env
   - Discovers from .env files
   - Discovers from Vercel
   - Aggregates all sources

2. **Env Storage** (`logic/envStorage.ts`)
   - Secure storage
   - Encryption/decryption
   - Key-value management
   - Export/import

3. **Env Classifier** (`logic/envClassifier.ts`)
   - Sensitivity classification
   - Category detection
   - Pattern matching
   - Registry management

---

## API Reference

### Initialization

#### `init(context?: EnvKeeperContext): Promise<boolean>`
Initializes Env Keeper and auto-discovers all variables.

**Process**:
1. Discovers all env vars
2. Classifies by sensitivity
3. Stores securely
4. Auto-applies to process.env

### Discovery & Sync

#### `sync(): Promise<EnvVariable[]>`
Syncs environment variables from all sources.

#### `getSyncSources(): EnvSyncSource[]`
Gets list of sync sources.

### Variable Management

#### `get(key: string, decryptValue: boolean = false): EnvVariable | null`
Gets environment variable.

**Parameters**:
- `key`: Variable key
- `decryptValue`: Whether to decrypt secret values

#### `set(key: string, value: string, options?: {...}): EnvVariable`
Sets environment variable.

**Options**:
- `category`: Variable category
- `isSecret`: Whether it's a secret
- `description`: Description
- `environments`: Environment list

#### `list(decryptValues: boolean = false): EnvVariable[]`
Lists all environment variables.

#### `delete(key: string): boolean`
Deletes environment variable.

### Export & Generation

#### `generateEnvFile(environment?: string, includeComments: boolean = true): string`
Generates .env file content.

#### `export(decryptValues: boolean = false): Record<string, any>`
Exports variables as JSON.

### Status

#### `status(): EnvKeeperStatus`
Gets Env Keeper status.

---

## Data Models

### EnvVariable

```typescript
interface EnvVariable {
  id: string;
  key: string;
  value: string; // Encrypted if isSecret
  category: EnvCategory;
  isSecret: boolean;
  required: boolean;
  environments: string[]; // ['local', 'development', 'staging', 'production']
  createdAt: number;
  updatedAt: number;
  tags: string[];
  description?: string;
}
```

### EnvCategory

```typescript
type EnvCategory =
  | 'api_keys'
  | 'database'
  | 'auth'
  | 'services'
  | 'storage'
  | 'payment'
  | 'other';
```

### EnvKeeperStatus

```typescript
interface EnvKeeperStatus {
  initialized: boolean;
  totalVars: number;
  secretsCount: number;
  categories: Record<string, number>;
  lastSyncAt: number | null;
  syncSources: string[];
}
```

### EnvSyncSource

```typescript
interface EnvSyncSource {
  id: string;
  type: 'local' | 'env_file' | 'cloud';
  name: string;
  status: 'connected' | 'disconnected';
  lastSyncAt: number | null;
  varCount: number;
}
```

---

## Auto-Discovery Process

### Discovery Sources

1. **Process Environment** (`process.env`)
   - Scans all environment variables
   - Filters system variables
   - Pattern-based classification

2. **Environment Files** (`.env`, `.env.local`, etc.)
   - Recursive file scanning
   - Multiple file support
   - Priority-based merging

3. **Vercel Environment**
   - Syncs from Vercel project
   - Automatic updates
   - Cloud integration

### Classification Patterns

#### Known Patterns

```typescript
{
  OPENAI_API_KEY: { category: 'api_keys', isSecret: true },
  ANTHROPIC_API_KEY: { category: 'api_keys', isSecret: true },
  DATABASE_URL: { category: 'database', isSecret: true },
  JWT_SECRET: { category: 'auth', isSecret: true },
  // ... many more
}
```

#### Generic Patterns

- `*_API_KEY` → api_keys, secret
- `*_SECRET` → auth, secret
- `*_TOKEN` → api_keys, secret
- `*_PASSWORD` → database/auth, secret
- `*_DB_*` → database
- `*_AUTH_*` → auth

### Sensitivity Classification

1. **Secret**: Contains sensitive data
   - API keys
   - Passwords
   - Tokens
   - Secrets

2. **Internal**: Internal configuration
   - Service URLs
   - Internal IDs
   - Configuration values

3. **Public**: Public configuration
   - Public URLs
   - Feature flags
   - Public settings

---

## Security Features

### Encryption

- All secrets encrypted at rest
- Encryption key management
- Secure decryption
- No plaintext secrets

### Access Control

- Access logging
- Audit trail
- Permission checks
- Secure deletion

### Nerve Integration

- Publishes secret mutations
- Tracks secret access
- Monitors secret changes
- Security alerts

---

## Integration Points

### DreamNet Systems
- **Nerve Bus**: Publishes env events
- **Metrics Core**: Tracks env metrics
- **Security Systems**: Secret monitoring

### External Systems
- **Vercel**: Environment sync
- **Cloud Providers**: Secret management
- **CI/CD**: Environment injection

---

## Usage Examples

### Initialization

```typescript
// Auto-discovers and applies all env vars
await EnvKeeperCore.init();

// Status
const status = EnvKeeperCore.status();
console.log(`Discovered ${status.totalVars} variables`);
console.log(`Secrets: ${status.secretsCount}`);
```

### Get Variable

```typescript
// Get variable (decrypted)
const dbUrl = EnvKeeperCore.get('DATABASE_URL', true);
console.log(dbUrl?.value);

// Get variable (encrypted)
const apiKey = EnvKeeperCore.get('OPENAI_API_KEY', false);
console.log(apiKey?.value); // Encrypted
```

### Set Variable

```typescript
EnvKeeperCore.set('MY_API_KEY', 'sk-...', {
  category: 'api_keys',
  isSecret: true,
  description: 'My API key',
  environments: ['production'],
});
```

### Generate .env File

```typescript
const envContent = EnvKeeperCore.generateEnvFile('production', true);
fs.writeFileSync('.env.production', envContent);
```

### Export Variables

```typescript
const exportData = EnvKeeperCore.export(false); // Don't decrypt secrets
console.log(JSON.stringify(exportData, null, 2));
```

---

## Best Practices

1. **Let Auto-Discovery Work**
   - Don't manually set vars unless necessary
   - Let system discover and manage automatically

2. **Use Classification**
   - Set proper categories
   - Mark secrets correctly
   - Add descriptions

3. **Secure Storage**
   - Never store secrets in code
   - Use Env Keeper for all secrets
   - Encrypt sensitive values

4. **Monitor Changes**
   - Track secret mutations
   - Monitor access logs
   - Review audit trail

---

## Security Considerations

1. **Encryption**
   - All secrets encrypted
   - Secure key management
   - No plaintext storage

2. **Access Control**
   - Access logging
   - Permission checks
   - Audit trail

3. **Secret Management**
   - Never expose secrets
   - Secure deletion
   - Rotation support

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

