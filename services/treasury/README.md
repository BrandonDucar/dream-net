# Treasury Service

Autonomous payment settlement service for DreamNet deployments using Base Paymaster and Circle CCTP.

## Overview

The Treasury Service handles:
- **Base Paymaster Authorization**: EIP-4337 signature requests for transactions
- **USDC Settlement**: Cross-chain settlement via Circle CCTP (Base → Solana)
- **Revenue Tracking**: Integration with Economic Engine for deployment revenue
- **Rate Limiting**: Daily caps ($2000) and per-transaction limits ($250)
- **Governance**: Multi-sig sovereign override for emergency controls

## Architecture

```
DreamNet Orchestrator (Phase 6)
       ↓ (each cycle)
TreasuryExecutorCore (Adapter)
       ↓
Treasury Service (:3210)
       ├→ Queue Management
       ├→ Paymaster Auth (Base)
       ├→ USDC Settlement (CCTP)
       └→ Economic Engine Notification
```

## Configuration

Create `.env` from `.env.template`:

```bash
cp .env.template .env
```

**Required variables** (must set before running):
- `TREASURY_ADDRESS`: Base mainnet address receiving settlements
- `HOT_SENDER_PK`: Private key for hot wallet (use vault in production!)
- `SOVEREIGN_BEARER_TOKEN`: Token for emergency override endpoint

**Optional variables**:
- `CIRCLE_API_KEY`: For CCTP cross-chain support
- `LOG_LEVEL`: debug | info | warn | error (default: debug)
- `NODE_ENV`: development | production

## Installation

```bash
npm install
```

## Running

**Development** (current - test mode with mock endpoints):
```bash
npm start
```

Output:
```
✓ Treasury Service (test) listening on port 3210
  → http://localhost:3210/health
  → http://localhost:3210/api/treasury/status
```

**Production** (once full executor is wired):
```bash
npm run start:prod
```

## API Endpoints

All endpoints assume `Content-Type: application/json`

### Public Endpoints

#### `GET /health`
Health check endpoint.

**Response**:
```json
{
  "status": "ok",
  "service": "treasury",
  "timestamp": 1771740349361
}
```

#### `GET /api/treasury/status`
Current treasury state and limits.

**Response**:
```json
{
  "balance": 1000,
  "dailyUsage": 150,
  "pendingCount": 0,
  "agent": "treasury",
  "dailyCap": 2000,
  "transactionCap": 250
}
```

#### `GET /api/treasury/pending`
Pending settlements in queue.

**Response**:
```json
{
  "pending": [
    {
      "deploymentId": "deploy-abc123",
      "agentId": "agent-lucid",
      "amountUSD": 50,
      "serviceName": "netlify",
      "timestamp": 1771740000000
    }
  ],
  "count": 1
}
```

#### `GET /api/treasury/history`
Settlement history with filters.

**Query Parameters**:
- `agentId`: Filter by agent (optional)
- `status`: SUCCESS | FAILED | COMPENSATED (optional)
- `limit`: Max results (default 100, max 1000)
- `offset`: Pagination offset (default 0)

**Response**:
```json
{
  "history": [
    {
      "id": "op-001",
      "deploymentId": "deploy-abc123",
      "agentId": "agent-lucid",
      "amountUSD": 50,
      "status": "SUCCESS",
      "txHash": "0x...",
      "timestamp": 1771740000000
    }
  ],
  "total": 145,
  "limit": 100,
  "offset": 0
}
```

### Orchestrator-Controlled Endpoints

These are called automatically by the orchestrator via `TreasuryExecutorCore`:

#### `POST /api/treasury/queue`
Queue a settlement for processing.

**Request**:
```json
{
  "deploymentId": "deploy-abc123",
  "agentId": "agent-lucid",
  "amountUSD": 50,
  "serviceName": "netlify",
  "metadata": {
    "url": "https://app.netlify.app"
  }
}
```

**Response**:
```json
{
  "success": true,
  "queuedCount": 1,
  "operationId": "op-001"
}
```

#### `POST /api/treasury/settle`
Execute a settlement from the queue.

**Request**:
```json
{
  "operationId": "op-001"
}
```

**Response**:
```json
{
  "success": true,
  "txHash": "0x...",
  "amountSettled": 50,
  "timestamp": 1771740000000
}
```

### Admin Endpoints (Bearer Token Required)

#### `POST /api/treasury/sovereign-override`
Emergency spending controls (requires valid `Authorization: Bearer <token>`)

**Request**:
```json
{
  "action": "pause" | "resume" | "reset-daily-clock",
  "reason": "Emergency pause due to suspected compromise"
}
```

**Response**:
```json
{
  "success": true,
  "action": "paused",
  "timestamp": 1771740000000
}
```

## Integration Points

### Orchestrator Integration

Each orchestrator cycle (Phase 6) calls:
```typescript
if (ctx.TreasuryExecutorCore?.processSettlements) {
  await ctx.TreasuryExecutorCore.processSettlements({
    economicEngineCore: ctx.EconomicEngineCore,
    dreamShop: ctx.DreamShop,
    identityGrid: ctx.IdentityGrid,
    neuralMesh: ctx.NeuralMesh,
  });
}
```

### DreamShop Integration

When a deployment completes successfully:
```typescript
import { notifyDeploymentRevenue } from '@dreamnet/treasury-executor/treasury-integration-hook';

await notifyDeploymentRevenue({
  deploymentId: deploymentResult.id,
  agentId: context.agentId,
  amountUSD: calculateCost(artifact),
  serviceName: 'netlify',
  metadata: { url: 'https://app.netlify.app', ... }
});
```

### Economic Engine Integration

Settlement success notifies Economic Engine:
```typescript
await context.economicEngineCore.recordRevenue({
  source: 'treasury-settlement',
  agentId: settlement.agentId,
  amountUSD: settlement.amountUSD,
  txHash: settleResult.txHash,
});
```

## Testing

### Manual Test via curl/PowerShell

**Test health**:
```powershell
Invoke-RestMethod -Uri "http://localhost:3210/health" -Method Get
```

**Test status**:
```powershell
Invoke-RestMethod -Uri "http://localhost:3210/api/treasury/status" -Method Get
```

**Queue a settlement**:
```powershell
$settlement = @{
  deploymentId = "deploy-test-001"
  agentId = "agent-lucid"
  amountUSD = 35
  serviceName = "netlify"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3210/api/treasury/queue" `
  -Method Post `
  -Body $settlement `
  -ContentType "application/json"
```

### Run Integration Tests

```bash
node '../../../run-treasury-integration-test.js'
```

Expected output: All 6 tests passing (100%)

## Monitoring

### Prometheus Metrics (if enabled)

```bash
curl http://localhost:9090/metrics
```

Key metrics:
- `treasury_settlements_total`: Total settlements attempted
- `treasury_settlements_success`: Successful settlements
- `treasury_daily_spend_usd`: Daily spending total
- `treasury_queue_depth`: Current queue size
- `treasury_paymaster_latency_ms`: Authorization latency

### Logs

Structured JSON logs to stdout:

```
{"level":"info","service":"treasury","action":"settle","deploymentId":"deploy-001","amount":50,"timestamp":"2026-02-22T...","txHash":"0x..."}
```

Set `LOG_LEVEL=debug` for verbose output.

## Security Considerations

1. **Private Keys**: Never commit `HOT_SENDER_PK` to git. Use a secret vault (1Password, HashiCorp Vault, etc.)
2. **Bearer Tokens**: Rotate `SOVEREIGN_BEARER_TOKEN` regularly
3. **Rate Limits**: Daily caps are enforced per-service, not per-user
4. **Multi-Sig**: For production, implement threshold ECDSA for signing via `tnb-chain/tss-lib`
5. **Attestation**: All settlements are signed with EIP-712; verify signatures before broadcasting

## Troubleshooting

### Service won't start
- Check PORT 3210 is not in use: `Get-NetTcpConnection -LocalPort 3210`
- Verify `.env` file exists (or all env vars are set)
- Check logs: set `LOG_LEVEL=debug`

### Settlements failing to execute
- Verify `HOT_SENDER_PK` is correct (has USDC balance on Base)
- Check daily cap not exceeded: `GET /api/treasury/status`
- Verify RuntimeBridge connectivity: check bridge logs
- Review `CIRCLE_API_KEY` if using CCTP

### Queue not processing
- Check orchestrator is running and calling Phase 6
- Verify queue is populated: `GET /api/treasury/pending`
- Check Economic Engine is reachable: `curl $ECONOMIC_ENGINE_URL/health`

## Roadmap

- [ ] Multi-sig threshold ECDSA (TSS) for production signing
- [ ] PostgreSQL settlement ledger for auditability
- [ ] Webhook callbacks for deployment services
- [ ] Advanced routing (batch settlements, optimization)
- [ ] Gas price oracle integration for cost estimation
- [ ] Custody recovery flows (compensating settlements)

## References

- [TreasuryExecutor Core](../../packages/organs/endocrine/treasury-executor/)
- [EIP-4337 Paymaster](https://eips.ethereum.org/EIPS/eip-4337)
- [Circle CCTP](https://developers.circle.com/stablecoins/docs/transfer-usdc-across-blockchains)
- [DreamNet Orchestrator](../../packages/organs/endocrine/orchestrator-core/)
- [Complete Integration Spec](../../TREASURY_INTEGRATION_COMPLETE.md)
