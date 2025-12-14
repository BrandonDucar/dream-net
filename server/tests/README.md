# Server Integration Tests

Integration tests for critical DreamNet API endpoints.

## Setup

Install test dependencies:

```bash
cd server
pnpm add -D vitest supertest @vitest/ui
```

## Running Tests

### Run all tests:
```bash
pnpm test
```

### Run specific test file:
```bash
pnpm vitest tests/integration/health.test.ts
```

### Run tests in watch mode:
```bash
pnpm vitest --watch
```

### Run tests with UI:
```bash
pnpm vitest --ui
```

## Test Configuration

Tests are configured in `vitest.config.ts`. By default, tests run against:
- `http://localhost:3000` (or `TEST_BASE_URL` env var)

## Test Server

Tests require a running server. Start the server before running tests:

```bash
# Terminal 1: Start server
pnpm dev:app

# Terminal 2: Run tests
pnpm test
```

Or set `TEST_BASE_URL` to point to a remote server:

```bash
TEST_BASE_URL=https://dreamnet.ink pnpm test
```

## Test Files

- `integration/health.test.ts` - Health check endpoints
- `integration/metrics.test.ts` - Metrics endpoints
- `integration/rate-limit.test.ts` - Rate limiting behavior
- `integration/trace-id.test.ts` - Request tracing

## Writing New Tests

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';

const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';

describe('My Endpoint', () => {
  it('should work correctly', async () => {
    const response = await request(baseUrl)
      .get('/api/my-endpoint')
      .expect(200);
    
    expect(response.body).toHaveProperty('ok', true);
  });
});
```

## CI/CD

Tests can be run in CI/CD pipelines. Set `TEST_BASE_URL` to your test environment:

```yaml
# Example GitHub Actions
- name: Run integration tests
  env:
    TEST_BASE_URL: ${{ secrets.TEST_SERVER_URL }}
  run: pnpm test
```
