# API Keeper Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

API Keeper Core is a **zero-touch API management system** that automatically discovers, manages, and routes API keys and requests. It provides intelligent API routing, cost optimization, and rail guard protection.

---

## Key Features

### Zero-Touch Auto-Discovery
- Automatically discovers API keys from ALL sources
- Scans environment variables, config files, and external services
- Runs continuously every cycle
- No manual configuration needed

### Intelligent API Routing
- Routes requests to best provider/key based on:
  - Cost optimization
  - Quality/availability
  - Rate limits
  - Quota management

### Rail Guards
- Cost protection (budget limits)
- Rate limiting
- Quota enforcement
- Request blocking

### Provider Management
- API provider registry
- Feature-based provider search
- Provider status monitoring
- Category-based organization

---

## Architecture

### Components

1. **API Discoverer** (`logic/apiDiscoverer.ts`)
   - Discovers API providers
   - Searches providers by category/feature
   - Maintains provider registry

2. **Key Auto-Discoverer** (`logic/keyAutoDiscoverer.ts`)
   - Zero-touch key discovery
   - Scans environment variables
   - Scans config files
   - Scans external services (Vercel, etc.)

3. **Key Manager** (`logic/keyManager.ts`)
   - Key registration
   - Status management
   - Usage tracking
   - Best key selection

4. **API Router** (`logic/apiRouter.ts`)
   - Request routing
   - Provider selection
   - Cost optimization
   - Quality scoring

5. **Rail Guards** (`logic/railGuards.ts`)
   - Cost protection
   - Rate limiting
   - Quota enforcement
   - Request validation

6. **API Store** (`store/apiStore.ts`)
   - Provider storage
   - Key storage
   - Request history
   - Rail guard storage

---

## API Reference

### Provider Management

#### `discoverAPIs(): APIProvider[]`
Discovers new API providers.

#### `searchProviders(category?: APICategory, feature?: string): APIProvider[]`
Searches providers by category and features.

#### `getProvider(id: string): APIProvider | undefined`
Gets provider by ID.

#### `listProviders(): APIProvider[]`
Lists all providers.

#### `listActiveProviders(): APIProvider[]`
Lists active providers only.

### Key Management

#### `registerKey(providerId: string, key: string, secret?: string, options?: {...}): APIKey`
Registers a new API key.

**Options**:
- `name`: User-friendly name
- `quotaLimit`: Monthly quota limit
- `tags`: Tags for organization

#### `autoDiscoverKeys(): APIKey[]`
**Zero-touch**: Auto-discovers keys from all sources.

#### `getKey(id: string): APIKey | undefined`
Gets key by ID.

#### `listKeys(): APIKey[]`
Lists all keys.

#### `listKeysForProvider(providerId: string): APIKey[]`
Lists keys for a provider.

#### `updateKeyStatus(keyId: string, status: APIKeyStatus, reason?: string): boolean`
Updates key status (active, inactive, expired, rate_limited).

#### `recordUsage(keyId: string, cost?: number): boolean`
Records key usage and cost.

### Request Routing

#### `routeRequest(request: APIRequest): APIRoutingDecision | null`
Routes request to best provider/key.

**Returns**: Routing decision with provider, key, cost estimate, and alternatives.

#### `executeRequest(request: APIRequest): APIRequest`
Executes request via routed provider/key.

### Rail Guards

#### `ensureDefaultRailGuards(): APIRailGuard[]`
Ensures default rail guards are created.

#### `createRailGuard(name: string, type: APIRailGuard["type"], limit: number, action: APIRailGuard["action"]): APIRailGuard`
Creates a new rail guard.

**Types**:
- `cost`: Cost-based protection
- `rate_limit`: Rate limiting
- `quota`: Quota enforcement

**Actions**:
- `block`: Block request
- `throttle`: Throttle request
- `alert`: Send alert

#### `checkRailGuards(request: APIRequest): { allowed: boolean; reason?: string }`
Checks if request passes all rail guards.

#### `listRailGuards(): APIRailGuard[]`
Lists all rail guards.

#### `listActiveRailGuards(): APIRailGuard[]`
Lists active rail guards.

---

## Data Models

### APIProvider

```typescript
interface APIProvider {
  id: string;
  name: string;
  category: APICategory; // 'ai', 'database', 'storage', 'payment', etc.
  features: string[];
  baseUrl?: string;
  pricing?: {
    perRequest?: number;
    perToken?: number;
    monthly?: number;
  };
  status: 'active' | 'inactive';
  lastCheckedAt: number;
}
```

### APIKey

```typescript
interface APIKey {
  id: string;
  providerId: string;
  name: string;
  key: string; // Encrypted
  secret?: string; // Encrypted
  status: 'active' | 'inactive' | 'expired' | 'rate_limited';
  usageCount: number;
  usageThisMonth: number;
  quotaLimit?: number;
  quotaUsed?: number;
  costThisMonth: number;
  costTotal: number;
  rateLimitResetAt?: number;
  rateLimitRemaining?: number;
  createdAt: number;
  lastUsedAt: number;
  expiresAt?: number;
  tags?: string[];
}
```

### APIRequest

```typescript
interface APIRequest {
  id: string;
  category: APICategory;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  requiredFeatures?: string[];
  preferredProvider?: string;
  maxCost?: number;
  providerUsed?: string;
  keyUsed?: string;
  success?: boolean;
  error?: string;
  cost?: number;
  latency?: number;
  completedAt?: number;
}
```

### APIRoutingDecision

```typescript
interface APIRoutingDecision {
  providerId: string;
  keyId: string;
  estimatedCost: number;
  reason: string;
  alternatives?: Array<{
    providerId: string;
    keyId: string;
    estimatedCost: number;
    reason: string;
  }>;
}
```

### APIRailGuard

```typescript
interface APIRailGuard {
  id: string;
  name: string;
  type: 'cost' | 'rate_limit' | 'quota';
  limit: number;
  current: number;
  action: 'block' | 'throttle' | 'alert';
  enabled: boolean;
  createdAt: number;
}
```

---

## Zero-Touch Auto-Discovery

### Discovery Sources

1. **Environment Variables**
   - Scans `process.env`
   - Pattern matching for API keys
   - Automatic provider detection

2. **Config Files**
   - `.env` files
   - `config.json` files
   - Other config formats

3. **External Services**
   - Vercel environment variables
   - Other cloud providers
   - Secret management services

### Discovery Process

```
Every Cycle:
1. Scan all sources
2. Detect new keys
3. Auto-register keys
4. Classify providers
5. Update status
```

### Key Patterns Detected

- `OPENAI_API_KEY` → OpenAI provider
- `ANTHROPIC_API_KEY` → Anthropic provider
- `TWILIO_AUTH_TOKEN` → Twilio provider
- `VERCEL_TOKEN` → Vercel provider
- Generic patterns: `*_API_KEY`, `*_TOKEN`, `*_SECRET`

---

## Request Routing Algorithm

### Scoring Factors

1. **Cost** (40% weight)
   - Lower cost = higher score
   - Considers per-request and per-token pricing

2. **Availability** (30% weight)
   - Active status
   - Rate limit availability
   - Quota availability

3. **Quality** (20% weight)
   - Provider reliability
   - Historical success rate
   - Latency history

4. **Features** (10% weight)
   - Required features match
   - Preferred provider bonus

### Routing Flow

```
Request → Check Rail Guards → Find Providers → Score Providers → Select Best → Return Decision
```

---

## Rail Guards

### Default Rail Guards

1. **Cost Protection**
   - Monthly budget limit
   - Per-request cost limit
   - Automatic blocking

2. **Rate Limiting**
   - Per-provider rate limits
   - Per-key rate limits
   - Automatic throttling

3. **Quota Enforcement**
   - Monthly quota limits
   - Automatic blocking when exceeded

### Custom Rail Guards

Create custom rail guards for:
- Specific provider limits
- Feature-based limits
- Time-based limits
- Cost-based limits

---

## Integration Points

### DreamNet Systems
- **Nervous System Core**: Publishes API events
- **Metrics Core**: Tracks API usage metrics
- **Cost Core**: Tracks API costs
- **Control Core**: Rail guard enforcement

### External Systems
- **Vercel**: Environment variable sync
- **Cloud Providers**: Secret management
- **API Providers**: Direct integration

---

## Usage Examples

### Auto-Discovery

```typescript
// Automatically runs every cycle
// No manual calls needed!

// Force discovery (usually not needed)
const keys = APIKeeperCore.forceDiscovery();
console.log(`Discovered ${keys.length} keys`);
```

### Register Key Manually

```typescript
const key = APIKeeperCore.registerKey(
  'openai',
  'sk-...',
  undefined,
  {
    name: 'Production OpenAI Key',
    quotaLimit: 100000,
    tags: ['production', 'gpt-4'],
  }
);
```

### Route Request

```typescript
const request: APIRequest = {
  id: 'req-123',
  category: 'ai',
  endpoint: '/v1/chat/completions',
  method: 'POST',
  requiredFeatures: ['chat', 'gpt-4'],
  maxCost: 0.01,
};

const decision = APIKeeperCore.routeRequest(request);
if (decision) {
  console.log(`Using ${decision.providerId} (cost: $${decision.estimatedCost})`);
  const result = APIKeeperCore.executeRequest(request);
}
```

### Create Rail Guard

```typescript
const guard = APIKeeperCore.createRailGuard(
  'Monthly Budget',
  'cost',
  1000, // $1000/month
  'block'
);
```

---

## Status & Monitoring

### Status Object

```typescript
interface APIKeeperStatus {
  providers: {
    total: number;
    active: number;
  };
  keys: {
    total: number;
    active: number;
    rateLimited: number;
  };
  requests: {
    total: number;
    successful: number;
    failed: number;
    totalCost: number;
  };
  railGuards: {
    total: number;
    active: number;
    triggered: number;
  };
  lastRunAt: number | null;
}
```

### Monitoring

- Track API usage
- Monitor costs
- Watch rail guard triggers
- Monitor key status
- Track provider health

---

## Best Practices

1. **Let Auto-Discovery Work**
   - Don't manually register keys unless necessary
   - Let system discover and manage keys automatically

2. **Use Rail Guards**
   - Set cost limits
   - Configure rate limits
   - Enforce quotas

3. **Monitor Usage**
   - Check status regularly
   - Review costs
   - Monitor rail guard triggers

4. **Tag Keys**
   - Use tags for organization
   - Tag by environment (production, staging)
   - Tag by purpose (testing, backup)

---

## Security Considerations

1. **Key Encryption**
   - All keys encrypted at rest
   - Secrets encrypted separately
   - No plaintext storage

2. **Access Control**
   - Key access logging
   - Usage tracking
   - Audit trail

3. **Rail Guard Protection**
   - Cost protection
   - Rate limit protection
   - Quota protection

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

