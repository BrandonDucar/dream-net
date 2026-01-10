# API Keeper System Guide

## Overview

The **API Keeper** is DreamNet's intelligent API management system. It automatically discovers APIs, manages keys, routes requests based on cost/quality, and enforces safety limits (rail guards).

## Features

### 🔍 API Discovery
- Automatically discovers and catalogs API providers
- Tracks pricing, features, reliability, and quality metrics
- Currently includes: Twilio, SendGrid, OpenAI, Anthropic, Telegram, Twitter

### 🔑 Key Management
- Secure key storage (encrypted in production)
- Usage tracking and quota management
- Load balancing across multiple keys
- Automatic status updates (active, rate-limited, quota-exceeded)

### 🧭 Intelligent Routing
- **Cost-based**: Chooses cheapest provider that meets requirements
- **Quality-based**: Considers reliability, latency, and quality scores
- **Quota-aware**: Routes to keys with remaining quota
- **Load balancing**: Distributes requests across keys

### 🛡️ Rail Guards
- **Daily cost limit**: Block requests if daily spend exceeds limit
- **Monthly cost limit**: Block requests if monthly spend exceeds limit
- **Rate limiting**: Throttle requests per minute/hour
- **Custom guards**: Create your own guard rules

### 🏛️ Governance Integration
- Integrated with Dream State as "API Keeper Department"
- Can be managed via Dream State proposals
- Cost tracking integrated with Economic Engine

## Usage

### Basic Example

```typescript
import { APIKeeperCore } from "@dreamnet/api-keeper-core";

// 1. Discover APIs (automatic on first run)
APIKeeperCore.discoverAPIs();

// 2. Register API keys
const twilioKey = APIKeeperCore.registerKey(
  "twilio",
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
  { name: "Production Twilio", tags: ["production"] }
);

// 3. Route and execute request
const request = {
  id: `req:${Date.now()}`,
  category: "sms",
  operation: "send-sms",
  params: { to: "+1234567890", message: "Hello" },
  priority: "medium",
  success: false,
  requestedAt: Date.now(),
};

const executed = APIKeeperCore.executeRequest(request);
console.log(`Used ${executed.providerUsed}, cost: $${executed.cost}`);
```

### Cost-Based Routing

```typescript
// Request with max cost constraint
const aiRequest = {
  id: `req:${Date.now()}`,
  category: "ai",
  operation: "generate-text",
  params: { prompt: "Hello" },
  priority: "medium",
  maxCost: 0.02, // Prefer providers under $0.02/request
  success: false,
  requestedAt: Date.now(),
};

// API Keeper will choose Anthropic ($0.015) over OpenAI ($0.03)
const routing = APIKeeperCore.routeRequest(aiRequest);
```

### Rail Guards

```typescript
// Create a daily cost limit
APIKeeperCore.createRailGuard(
  "Daily Budget",
  "daily-cost",
  10, // $10/day
  "block" // Block requests if exceeded
);

// Check before making request
const guardCheck = APIKeeperCore.checkRailGuards(request);
if (!guardCheck.allowed) {
  console.error(`Blocked: ${guardCheck.reason}`);
}
```

## Default Rail Guards

On initialization, API Keeper creates:
- **Daily Cost Limit**: $10/day (blocks if exceeded)
- **Monthly Cost Limit**: $100/month (blocks if exceeded)
- **Rate Limit**: 60 requests/minute (throttles if exceeded)

## API Providers

### Currently Supported

| Provider | Category | Cost/Request | Quality | Features |
|----------|----------|--------------|---------|----------|
| Twilio | SMS | $0.0075 | 95% | SMS, Voice, WhatsApp |
| SendGrid | Email | Free tier: 100/month | 92% | Email, Analytics |
| OpenAI | AI | $0.03 | 98% | Text, Images, Embeddings |
| Anthropic | AI | $0.015 | 97% | Text Generation |
| Telegram Bot | Social | Free | 95% | Messaging, Files |
| Twitter API | Social | Free: 1500/month | 90% | Tweets, Mentions |

### Adding New Providers

Providers are auto-discovered via `apiDiscoverer.ts`. To add manually:

```typescript
APIKeeperCore.discoverAPIs(); // Adds all known providers
```

Or extend `apiDiscoverer.ts` to add new providers.

## Integration Points

### Dream State Governance

API Keeper is integrated as a government department:
- **Department ID**: `dept:api-keeper`
- **Leader**: `agent:APIKeeperCore`
- **Responsibilities**: API discovery, key management, cost optimization

### Spider Web Integration

API Keeper can be used by Spider Web sensors:
- Sensors can request API routing via threads
- Cost tracking integrated with Economic Engine
- Rail guards prevent runaway costs

### Economic Engine

- All API costs tracked in Economic Engine
- Monthly budgets can be set via Dream State proposals
- Cost reports available via status API

## Status & Monitoring

```typescript
const status = APIKeeperCore.status();
console.log(`Providers: ${status.providerCount}`);
console.log(`Keys: ${status.keyCount}`);
console.log(`Requests Today: ${status.requestsToday}`);
console.log(`Cost Today: $${status.costToday}`);
console.log(`Cost This Month: $${status.costThisMonth}`);
```

## Best Practices

1. **Register keys with tags**: Use tags like `["production", "testing"]` to organize keys
2. **Set quota limits**: Prevent accidental overuse
3. **Use rail guards**: Set daily/monthly budgets
4. **Monitor costs**: Check status regularly
5. **Load balance**: Register multiple keys per provider for redundancy

## Security Notes

⚠️ **In Production**:
- API keys should be encrypted at rest
- Use environment variables for key storage
- Rotate keys regularly
- Monitor for suspicious usage patterns

## Testing

```bash
pnpm exec tsx scripts/testAPIKeeper.ts
```

This tests:
- API discovery
- Key registration
- Request routing
- Cost-based selection
- Rail guards
- Dream State integration

## Future Enhancements

- [ ] Automatic API key rotation
- [ ] Provider health monitoring
- [ ] Cost prediction and budgeting
- [ ] Multi-region routing
- [ ] API usage analytics dashboard
- [ ] Integration with more providers
- [ ] Webhook-based API discovery

