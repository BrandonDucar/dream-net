# DreamNet Code Examples

Practical examples for integrating with DreamNet.

## Examples

### Basic API Calls

**File:** `basic-api-call.ts`

Demonstrates:
- Health check endpoints
- Metrics retrieval
- API key authentication
- Wallet authentication (SIWE)
- Creating dreams
- Querying Wolf Pack

**Usage:**
```typescript
import { checkDreamNetHealth, getGoldenSignals } from './basic-api-call';

// Check system health
await checkDreamNetHealth();

// Get metrics
await getGoldenSignals();
```

### Agent Integration

**File:** `agent-integration.ts`

Demonstrates:
- Registering agents
- Querying agent status
- Submitting tasks to agents
- Monitoring agent health
- Using Wolf Pack for funding

**Usage:**
```typescript
import { registerAgent, getAgentStatus } from './agent-integration';

// Register a new agent
await registerAgent({
  name: 'MyAgent',
  purpose: 'Process user requests',
  category: 'utility',
  capabilities: ['process', 'analyze', 'respond']
});
```

## Getting Started

1. **Get API Key**: Connect wallet or use existing API key
2. **Set Base URL**: `https://dreamnet.ink` (production) or `http://localhost:3000` (local)
3. **Import Examples**: Use the provided TypeScript examples
4. **Customize**: Adapt examples to your use case

## API Documentation

See [docs/API.md](../docs/API.md) for complete API reference.

## Authentication

### API Key
```typescript
headers: {
  'Authorization': `Bearer ${apiKey}`
  // OR
  // 'X-API-Key': apiKey
}
```

### Wallet (SIWE)
```typescript
// Get nonce → Sign message → Verify → Get JWT token
const token = await authenticateWithWallet(address, signature);
headers: {
  'Authorization': `Bearer ${token}`
}
```

## Common Use Cases

### Monitor System Health
```typescript
const health = await checkDreamNetHealth();
if (health.ok) {
  console.log('System is healthy!');
}
```

### Get Metrics
```typescript
const metrics = await getGoldenSignals();
console.log(`RPS: ${metrics.traffic.requestsPerSecond}`);
console.log(`Error Rate: ${metrics.errors.errorRate}`);
```

### Create a Dream
```typescript
const dream = await createDream(apiKey, {
  title: 'My Dream',
  description: 'A dream that will change the world'
});
```

### Discover Funding
```typescript
const opportunities = await discoverFundingOpportunities(apiKey, {
  vertical: 'web3',
  minAmount: 10000
});
```

---

**Need Help?** See [docs/QUICK_START.md](../docs/QUICK_START.md) or open an issue.

