# DreamNet API Documentation

## Base URL

- **Production:** `https://dreamnet.ink`
- **Development:** `http://localhost:3000`

## Authentication

Most endpoints require authentication via API key or wallet JWT token.

### API Key Authentication

Include your API key in the request header:

```
Authorization: Bearer dn_live_YOUR_API_KEY_HERE
```

OR

```
X-API-Key: dn_live_YOUR_API_KEY_HERE
```

### Wallet Authentication

For wallet-based endpoints, use SIWE (Sign-In With Ethereum):

1. Get nonce: `GET /api/auth/nonce`
2. Sign message with wallet
3. Verify: `POST /api/auth/verify`
4. Use returned JWT token in `Authorization: Bearer` header

---

## Public Endpoints (No Auth Required)

### Health Check

**GET** `/health`

Returns server health status including database connectivity and metrics.

**Response:**
```json
{
  "ok": true,
  "service": "dreamnet-api",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 3600,
  "database": "healthy",
  "metrics": {
    "requestsPerSecond": 10.5,
    "errorRate": 0.01,
    "latency": {
      "p50": 50,
      "p95": 200,
      "p99": 500
    },
    "memory": {
      "used": 256,
      "total": 512
    }
  }
}
```

**Status Codes:**
- `200` - Healthy
- `503` - Unhealthy (database down, etc.)

---

### Readiness Probe

**GET** `/health/ready`

Kubernetes/Docker readiness probe endpoint. Checks critical dependencies.

**Response:**
```json
{
  "ready": true,
  "checks": {
    "database": true,
    "environment": true,
    "healthGates": {
      "ready": true,
      "gates": 5,
      "criticalReady": true
    }
  }
}
```

---

### Liveness Probe

**GET** `/health/live`

Kubernetes/Docker liveness probe endpoint. Checks if process is running.

**Response:**
```json
{
  "status": "alive",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 3600,
  "pid": 12345
}
```

---

## Metrics Endpoints

### Get Golden Signals

**GET** `/api/metrics/golden-signals`

Returns golden signals (traffic, errors, latency, saturation) for monitoring.

**Authentication:** Optional (public metrics)

**Response:**
```json
{
  "ok": true,
  "traffic": {
    "requestsPerSecond": 10.5,
    "activeConnections": 0,
    "timestamp": 1704067200000
  },
  "errors": {
    "errorRate": 0.01,
    "status4xx": 5,
    "status5xx": 1,
    "timestamp": 1704067200000
  },
  "latency": {
    "p50": 50,
    "p95": 200,
    "p99": 500,
    "timestamp": 1704067200000
  },
  "saturation": {
    "cpu": { "user": 1000000, "system": 500000 },
    "memory": {
      "rss": 536870912,
      "heapTotal": 268435456,
      "heapUsed": 134217728
    },
    "queueDepth": 0,
    "timestamp": 1704067200000
  }
}
```

---

### Get Endpoint Metrics

**GET** `/api/metrics/endpoint/:path`

Returns metrics for a specific endpoint.

**Parameters:**
- `path` (path parameter) - Endpoint path (e.g., `/api/health`)

**Response:**
```json
{
  "ok": true,
  "endpoint": "/api/health",
  "metrics": {
    "count": 1000,
    "errorRate": 0.01,
    "status4xx": 5,
    "status5xx": 1,
    "p50": 50,
    "p95": 200,
    "p99": 500
  }
}
```

---

## Authentication Endpoints

### Get Nonce

**GET** `/api/auth/nonce`

Get a nonce for wallet authentication (SIWE).

**Response:**
```json
{
  "ok": true,
  "nonce": "random-nonce-string",
  "message": "Sign this message to authenticate..."
}
```

---

### Verify Wallet Signature

**POST** `/api/auth/verify`

Verify wallet signature and get JWT token.

**Request Body:**
```json
{
  "address": "0x...",
  "signature": "0x...",
  "nonce": "nonce-from-previous-step"
}
```

**Response:**
```json
{
  "ok": true,
  "token": "jwt-token-here",
  "wallet": "0x...",
  "expiresAt": "2025-01-01T01:00:00.000Z"
}
```

---

## API Key Management

### Create API Key

**POST** `/api/keys/create`

Create a new API key (requires wallet JWT).

**Authentication:** Wallet JWT token

**Request Body:**
```json
{
  "name": "My API Key",
  "description": "For external service integration"
}
```

**Response:**
```json
{
  "ok": true,
  "key": "dn_live_...",
  "keyInfo": {
    "id": "...",
    "name": "My API Key",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### Validate API Key

**GET** `/api/keys/validate`

Validate an API key and get key information.

**Authentication:** API key

**Response:**
```json
{
  "valid": true,
  "keyInfo": {
    "id": "...",
    "name": "My API Key",
    "permissions": ["read", "write"],
    "rateLimit": 1000,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## Rate Limiting

All endpoints are rate-limited per IP address:

- **Limit:** 100 requests per 15 minutes
- **Headers:** Rate limit information is included in response headers:
  - `X-RateLimit-Limit` - Maximum requests allowed
  - `X-RateLimit-Remaining` - Remaining requests in window
  - `X-RateLimit-Reset` - When the rate limit resets
  - `Retry-After` - Seconds to wait (when rate limited)

**Rate Limit Exceeded Response:**
```json
{
  "ok": false,
  "error": "rate_limit_exceeded",
  "message": "Too many requests from this IP. Please try again later.",
  "retryAfter": 300,
  "limit": 100,
  "windowMs": 900000
}
```

**Status Code:** `429 Too Many Requests`

---

## Error Responses

All errors follow a consistent format:

```json
{
  "ok": false,
  "error": "error_code",
  "message": "Human-readable error message",
  "traceId": "trace-id-for-debugging"
}
```

### Common Error Codes

- `api_key_required` (401) - API key missing
- `invalid_api_key` (401) - API key invalid/expired
- `rate_limit_exceeded` (429) - Too many requests
- `validation_error` (400) - Invalid request data
- `not_found` (404) - Resource not found
- `internal_server_error` (500) - Server error

---

## Request Tracing

All requests include a trace ID for debugging:

- **Header:** `X-Trace-Id` (response header)
- **Request Header:** `X-Trace-Id` (optional, will generate if not provided)

Include the trace ID when reporting issues.

---

## Best Practices

1. **Always check rate limit headers** - Monitor `X-RateLimit-Remaining`
2. **Use exponential backoff** - On 429 errors, wait `retryAfter` seconds
3. **Include trace IDs** - When reporting errors, include the trace ID
4. **Handle errors gracefully** - Check `ok` field in responses
5. **Cache responses** - Public endpoints can be cached
6. **Use appropriate endpoints** - Use `/health` for health checks, not `/api/metrics`

---

## Support

For issues or questions:
- Check server logs using trace IDs
- Review error messages (they're descriptive)
- Check `/health` endpoint for system status

---

## Versioning

Current API version: **v1** (implicit)

Future versions will use URL versioning: `/api/v2/...`

---

*Last Updated: 2025-01-01*
