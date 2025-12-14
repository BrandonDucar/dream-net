# Cursor DreamNet Client - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Cursor DreamNet Client provides **a Cursor-friendly wrapper** around DreamNetAgent for easy integration with Cursor IDE workflows. It offers convenient methods for common operations, better error handling, and improved types for Cursor development.

---

## Key Features

### Cursor Integration
- Cursor-friendly API
- Easy workflow integration
- Better error handling
- Improved types

### Authentication
- API key validation
- Key info retrieval
- Secure authentication
- Error handling

### System Status
- Heartbeat checks
- System state
- Health monitoring
- Core status

### Dream Management
- Dream queries
- Dream creation
- Dream updates
- Dream retrieval

### Agent Management
- Agent status
- Agent queries
- Agent operations
- Agent monitoring

---

## Architecture

### Components

1. **Cursor DreamNet Client** (`index.ts`)
   - Main client class
   - API wrapper
   - Error handling
   - Type definitions

---

## API Reference

### Initialization

#### `new CursorDreamNetClient(options?: CursorDreamNetClientOptions): CursorDreamNetClient`
Creates Cursor DreamNet Client instance.

**Example**:
```typescript
import { CursorDreamNetClient } from '@dreamnet/cursor-dreamnet-client';

const client = new CursorDreamNetClient({
  apiKey: process.env.DREAMNET_API_KEY,
  baseUrl: 'https://dreamnet.world',
  maxRetries: 3,
  retryBaseDelayMs: 1000,
  timeoutMs: 30000,
});
```

### Authentication

#### `validateApiKey(): Promise<boolean>`
Validates API key.

**Example**:
```typescript
const isValid = await client.validateApiKey();
if (!isValid) {
  console.error('Invalid API key');
}
```

#### `getApiKeyInfo(): Promise<any>`
Gets API key info.

**Example**:
```typescript
const info = await client.getApiKeyInfo();
console.log(`API Key Info:`, info);
```

### System Status

#### `getHeartbeat(): Promise<SystemStatus>`
Gets system heartbeat.

**Example**:
```typescript
const status = await client.getHeartbeat();
console.log(`System OK: ${status.ok}`);
console.log(`Uptime: ${status.uptime}`);
```

#### `isHealthy(): Promise<boolean>`
Quick health check.

**Example**:
```typescript
const healthy = await client.isHealthy();
if (!healthy) {
  console.error('System is unhealthy');
}
```

### Dream Operations

#### `queryDreams(options?: QueryOptions): Promise<Dream[]>`
Queries dreams.

**Example**:
```typescript
const dreams = await client.queryDreams({
  text: 'AI agent',
  limit: 10,
});

dreams.forEach(dream => {
  console.log(`${dream.title}: ${dream.content}`);
});
```

### Agent Operations

#### `getAgentStatus(agentName: string): Promise<AgentStatus | null>`
Gets agent status.

**Example**:
```typescript
const status = await client.getAgentStatus('wolf-pack');
if (status) {
  console.log(`Agent: ${status.name}`);
  console.log(`Status: ${status.status}`);
  console.log(`Health: ${status.health}`);
}
```

---

## Data Models

### CursorDreamNetClientOptions

```typescript
interface CursorDreamNetClientOptions {
  apiKey?: string;
  baseUrl?: string;
  maxRetries?: number;
  retryBaseDelayMs?: number;
  timeoutMs?: number;
}
```

### SystemStatus

```typescript
interface SystemStatus {
  ok: boolean;
  timestamp: string;
  uptime?: number;
  version?: string;
  cores?: Record<string, any>;
  agents?: Record<string, any>;
  [key: string]: any;
}
```

### Dream

```typescript
interface Dream {
  id: string;
  title?: string;
  content?: string;
  author?: string;
  lucidityScore?: number;
  [key: string]: any;
}
```

### AgentStatus

```typescript
interface AgentStatus {
  name: string;
  status: "active" | "inactive" | "error";
  health?: number;
  lastActivity?: string;
  [key: string]: any;
}
```

---

## Core Status Endpoints

### Spider Web Status
- `getSpiderWebStatus()`: Get Spider Web Core status

### Shield Status
- `getShieldStatus()`: Get Shield Core status
- `getShieldCoreStatus()`: Get Shield Core status (system)

### Control Plane Status
- `getControlPlaneStatus()`: Get Control Plane status

### Dream State Status
- `getDreamStateStatus()`: Get Dream State status

---

## Integration Points

### Cursor IDE
- Direct integration
- Workflow automation
- Code completion
- Error handling

### DreamNet Systems
- DreamNet Agent Client
- All DreamNet subsystems
- API endpoints
- Agent systems

---

## Usage Examples

### Basic Setup

```typescript
const client = new CursorDreamNetClient({
  apiKey: process.env.DREAMNET_API_KEY,
});
```

### Health Check

```typescript
const healthy = await client.isHealthy();
if (healthy) {
  console.log('DreamNet is healthy');
}
```

### Query Dreams

```typescript
const dreams = await client.queryDreams({
  text: 'AI',
  limit: 5,
});
```

### Get Agent Status

```typescript
const status = await client.getAgentStatus('wolf-pack');
console.log(`Status: ${status?.status}`);
```

---

## Best Practices

1. **Error Handling**
   - Handle errors gracefully
   - Check return values
   - Log errors
   - Retry on failure

2. **API Usage**
   - Use appropriate timeouts
   - Set retry limits
   - Monitor rate limits
   - Cache responses

3. **Authentication**
   - Secure API keys
   - Validate keys
   - Rotate keys regularly
   - Monitor usage

---

## Security Considerations

1. **API Key Security**
   - Protect API keys
   - Use environment variables
   - Never commit keys
   - Rotate regularly

2. **Request Security**
   - Validate inputs
   - Sanitize data
   - Monitor requests
   - Audit access

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

