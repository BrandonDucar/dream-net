# DreamNet Server Routes Map

**Complete mapping of all API routes and their handlers**

---

## Route Organization

Routes are registered in `server/index.ts` in order. **First match wins**, so order matters!

---

## Core Routes (Early Registration)

### Health & Status

- `GET /health` - Basic health check (non-blocking DB check)
- `GET /ready` - Readiness probe (alias for `/health/ready`)
- `GET /api/health` - Health router (detailed health checks)
- `GET /api/health/ready` - Readiness probe (checks critical services)
- `GET /api/health/live` - Liveness probe (server is running)
- `GET /healthz` - Standard healthz endpoint

### Observability

- `GET /api/observability/golden-signals` - Traffic, errors, latency metrics
- `GET /api/observability/health-gates` - Service readiness status
- `GET /api/observability/circuit-breakers` - Circuit breaker states
- `GET /api/system/graph` - System topology (ports, routes, wormholes)

---

## Agent Routes

### Core Agents

- `POST /api/agent` - Agent operations
- `GET /api/agent/:id` - Get agent by ID
- `POST /api/agent/:id/command` - Send command to agent
- `GET /api/agents` - List all agents

### Agent Marketplace

- `GET /api/marketplace` - Agent marketplace
- `POST /api/marketplace/register` - Register agent
- `GET /api/marketplace/:id` - Get agent details

### Agent Wallets

- `GET /api/agent-wallets` - List agent wallets
- `POST /api/agent-wallets/create` - Create agent wallet
- `GET /api/agent-wallets/:id` - Get wallet details
- `POST /api/agent-wallets/:id/transfer` - Transfer tokens

### Agent Operations

- `GET /api/agent-ops` - Agent activity tracking (admin)
- `GET /api/agent-ops/:id` - Agent activity details
- `POST /api/agent-ops/:id/quarantine` - Quarantine agent

### Agent Gateway

- `POST /api/agent-gateway` - AI-native ingress for ChatGPT/Cursor agents
- `POST /api/agent-gateway/chat` - Chat interface
- `POST /api/agent-gateway/command` - Command interface

### Agent Outputs

- `GET /api/agent-outputs` - List agent outputs
- `GET /api/agent-outputs/:id` - Get output by ID
- `POST /api/agent-outputs` - Create output

---

## Dream Routes

### Core Dream Operations

- `GET /api/dream` - List dreams
- `POST /api/dream` - Create dream
- `GET /api/dream/:id` - Get dream by ID
- `PUT /api/dream/:id` - Update dream
- `DELETE /api/dream/:id` - Delete dream

### Dream Interactions

- `POST /api/dream-interactions` - Create interaction
- `GET /api/dream-interactions/:dreamId` - Get interactions for dream
- `POST /api/dream-interactions/:id/like` - Like interaction
- `POST /api/dream-interactions/:id/comment` - Comment on interaction

### Dream Contributions

- `POST /api/dream-contributions` - Create contribution
- `GET /api/dream-contributions/:dreamId` - Get contributions for dream
- `PUT /api/dream-contributions/:id` - Update contribution

### Dream Storage

- `GET /api/dream-storage` - List stored dreams
- `POST /api/dream-storage` - Store dream
- `GET /api/dream-storage/:id` - Get stored dream

### Dream Remix

- `POST /api/dream-remix` - Remix dream
- `GET /api/dream-remix/:id` - Get remix by ID

---

## Pack Routes

### Wolf Pack

- `GET /api/wolf-pack` - Wolf Pack status
- `POST /api/wolf-pack/activate` - Activate Wolf Pack
- `GET /api/wolf-pack/targets` - List targets
- `POST /api/wolf-pack/targets` - Add target

### Activate Packs

- `POST /api/activate-packs` - Activate packs for real-world work
- `GET /api/activate-packs/status` - Get activation status

### Super Spine

- `GET /api/super-spine` - Super Spine status
- `POST /api/super-spine/command` - Send command

---

## Brain & Orchestration

### Super Brain

- `GET /api/brain` - Brain status
- `POST /api/brain/command` - Send command to brain
- `GET /api/brain/cycles` - Get cycle history

### Citadel

- `GET /api/citadel` - Citadel status
- `POST /api/citadel/command` - Send command to Citadel
- `GET /api/citadel/agents` - List Citadel agents

### Orchestrator

- `GET /api/orchestrator` - Orchestrator status
- `POST /api/orchestrator/cycle` - Trigger cycle manually

---

## Mesh & Network

### Mesh

- `GET /api/mesh` - Mesh status
- `POST /api/mesh/event` - Publish event
- `GET /api/mesh/events` - List events

### Instant Mesh

- `GET /api/instant-mesh` - Instant Mesh status
- `POST /api/instant-mesh/route` - Route packet

### Nerve

- `GET /api/nerve/stats` - Nerve Bus statistics
- `GET /api/nerve/recent-events` - Recent events
- `GET /api/nerve/metrics` - Nerve metrics

---

## Shield & Security

### Shield Core

- `GET /api/shield` - Shield status
- `POST /api/shield/spike` - Fire shield spike
- `GET /api/shield/threats` - List threats

### Shield Risk

- `GET /api/shield-risk` - Risk profiles (admin)
- `POST /api/shield-risk/decision` - Adaptive decision

### Guardian

- `GET /api/guardian` - Guardian status
- `POST /api/guardian/scan` - Scan for threats
- `GET /api/guardian/drones` - List personal drones

---

## Marketplace Routes

### Agent Marketplace

- `GET /api/marketplace` - Browse agents
- `POST /api/marketplace/list` - List agent
- `GET /api/marketplace/:id` - Get agent details

### Orca Marketplace

- `GET /api/orca-marketplace` - Orca marketplace
- `POST /api/orca-marketplace/list` - List item

### X402 Payment Gateway

- `POST /api/x402/payment` - Process payment
- `GET /api/x402/balance` - Get balance
- `POST /api/x402/withdraw` - Withdraw funds

---

## Social & Communication

### Social Media Ops

- `GET /api/social-media-ops` - Campaign status
- `POST /api/social-media-ops/campaign` - Create campaign
- `GET /api/social-media-ops/campaigns` - List campaigns

### Social Media Auth

- `POST /api/social-media-auth/connect` - Connect account
- `GET /api/social-media-auth/status` - Auth status

### Email

- `POST /api/email/send` - Send email
- `GET /api/email/history` - Email history

### Voice (Twilio SMS)

- `POST /api/voice/sms` - Send SMS
- `GET /api/voice/history` - SMS history

---

## Integration Routes

### Inbox Squared

- `GET /api/inbox-squared` - Inbox status
- `POST /api/inbox-squared/process` - Process inbox
- `GET /api/inbox-squared/messages` - List messages

### CoinSensei

- `GET /api/coinsensei` - CoinSensei status
- `POST /api/coinsensei/analyze` - Analyze portfolio

### Dream Snail

- `GET /api/dream-snail` - Privacy lattice status
- `POST /api/dream-snail/encrypt` - Encrypt data

### Biomimetic Systems

- `GET /api/biomimetic-systems` - System status
- `POST /api/biomimetic-systems/evolve` - Trigger evolution

---

## Foundry & Tools

### Foundry

- `GET /api/foundry` - Foundry status
- `POST /api/foundry/build` - Build agent
- `GET /api/foundry/agents` - List built agents

### Browser Agent

- `POST /api/browser-agent/execute` - Execute browser task
- `GET /api/browser-agent/tasks` - List tasks
- `GET /api/browser-agent/tasks/:id` - Get task status

---

## DreamKeeper & DroneDome

### DreamKeeper

- `GET /api/dreamkeeper` - DreamKeeper status
- `POST /api/dreamkeeper/scan` - Scan for issues
- `GET /api/dreamkeeper/issues` - List issues

### DroneDome

- `GET /api/drone-dome` - DroneDome status
- `POST /api/drone-dome/scan` - Start scan
- `GET /api/drone-dome/scans` - List scans

---

## Event & Fabric Routes

### Event Fabric

- `GET /api/event-fabric` - Fabric status
- `POST /api/event-fabric/event` - Publish event
- `GET /api/event-fabric/events` - List events

### Snapshot

- `GET /api/snapshot` - System snapshot
- `POST /api/snapshot/create` - Create snapshot
- `GET /api/snapshot/:id` - Get snapshot

---

## Market Data & Intelligence

### Market Data

- `GET /api/market-data` - Market data status
- `GET /api/market-data/metals` - Metals prices
- `GET /api/market-data/crypto` - Crypto prices
- `GET /api/market-data/stocks` - Stock prices

### Competitive Intelligence

- `GET /api/competitive-intelligence` - CI status
- `POST /api/competitive-intelligence/research` - Research company
- `GET /api/competitive-intelligence/companies` - List companies

### Data Integrity

- `GET /api/data-integrity` - Integrity status
- `POST /api/data-integrity/audit` - Create audit trail
- `GET /api/data-integrity/audits` - List audits

---

## Admin Routes

### Admin

- `GET /api/admin` - Admin dashboard
- `POST /api/admin/users` - Create user
- `GET /api/admin/users` - List users
- `DELETE /api/admin/users/:id` - Delete user

### Admin Wallets

- `GET /api/admin-wallets` - List admin wallets
- `POST /api/admin-wallets/create` - Create admin wallet

### Control

- `POST /api/control/kill-switch` - Emergency kill switch
- `POST /api/control/rate-limit` - Set rate limit
- `GET /api/control/status` - Control status

### Audit

- `GET /api/audit` - Audit log
- `GET /api/audit/:id` - Get audit entry

### RBAC

- `GET /api/rbac/roles` - List roles
- `POST /api/rbac/roles` - Create role
- `POST /api/rbac/assign` - Assign role

---

## System Routes

### Ports Ops

- `GET /api/ports/ops` - Port health summary (admin)
- `GET /api/ports/ops/env-keeper` - Env Keeper stats
- `GET /api/ports/ops/api-keeper` - API Keeper stats

### Dead Letter

- `GET /api/dead-letter` - Dead letter buffer (admin)
- `POST /api/dead-letter/retry` - Retry failed message

### Grid Lines

- `GET /api/grid-lines` - Conduit heat metrics (admin)

### Directory

- `GET /api/directory` - Entity discovery (admin)
- `GET /api/directory/:id` - Get entity

### Networks

- `GET /api/networks` - Network blueprints (admin)
- `GET /api/networks/:id` - Get network

### Discovery

- `GET /api/discovery` - Network discovery (admin)
- `POST /api/discovery/scan` - Start scan

### Debug Summary

- `GET /api/debug-summary` - Debug summary (admin)

---

## Legacy Routes

### Halo (Disabled)

- Routes commented out - using placeholder metrics engine

### Forge (Disabled)

- Routes disabled - forge tables not in schema yet

### Media (Disabled)

- Routes disabled - @dreamnet/media-vault missing

### Poster (Disabled)

- Routes disabled - @dreamnet/media-vault missing

---

## Route Registration Order

Routes are registered in this order (first match wins):

1. `/api/mesh`
2. `/api/graft`
3. `/api/grafted`
4. `/api` (catch-all for many routes)
5. `/api/dna`
6. `/api/resonance`
7. `/api/alive`
8. `/api/dream`
9. `/api/brain`
10. `/api/citadel`
11. `/api/health`
12. `/api/observability`
13. ... (many more)

**Important**: More specific routes should be registered BEFORE catch-all routes like `/api`.

---

## Route Handler Pattern

All route handlers follow this pattern:

```typescript
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/endpoint', async (req: Request, res: Response) => {
  try {
    // Handler logic
    res.json({ ok: true, data: result });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
```

---

## Authentication & Authorization

### API Key Auth

- Header: `x-dreamnet-api-key`
- Resolved by: `tierResolverMiddleware`
- Attached to: `req.tier`

### Wallet Auth

- Header: `x-wallet-address`
- Resolved by: `tierResolverMiddleware`
- Attached to: `req.walletAddress`

### Admin Routes

- Protected by: `requireAdmin` middleware
- Checks: `OPERATOR_WALLETS` env var

---

## Rate Limiting

- Global: 100 requests per 15 minutes per IP
- Bypassed: `/health`, `/ready`
- Per-cluster: Enforced by Control Core middleware

---

## Error Handling

All routes should:
1. Use try-catch blocks
2. Return JSON: `{ ok: boolean, error?: string, data?: any }`
3. Set appropriate status codes
4. Include trace ID in errors

Global error handler catches unhandled errors and returns 500.

---

**Last Updated**: 2025-01-27

