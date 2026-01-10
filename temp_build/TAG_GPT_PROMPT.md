# 🎯 TAG GPT Prompt for DreamNet Integration

Copy and paste this prompt into your TAG GPT to generate the TAG microservice for DreamNet:

---

```
I want to deploy TAG (Trusted Agent Gateway) for DreamNet, a biomimetic agent orchestration platform built on Base.

## DreamNet Overview
DreamNet is a comprehensive platform with:
- Dream Snail: Privacy layer with provenance trails
- Shield Core: Multi-layer security system
- API Keeper: Intelligent API management
- Webhook Nervous Core: Biomimetic webhook management (Jaggy agent)
- Dream State: Governance with passport tiers
- Spider Web: Event threading system

## TAG Configuration Requirements

### Core Settings
- **Signing Algorithm**: ed25519 (default), with PQC support (Dilithium, Falcon)
- **Chain Anchoring**: Optional (Base mainnet preferred)
- **AI SEO Extensions**: Yes (integrate with DreamNet AI SEO Core)
- **Geofencing Extensions**: Yes (integrate with DreamNet geofencing)
- **PQC Support**: Yes (Dilithium, Falcon algorithms)
- **Dual Ledger**: Postgres (Neon) + Optional on-chain anchor (Base)
- **Trusted Webhook IDE**: Yes (for Jaggy webhook management)
- **RBAC/SSO**: Yes (integrate with Dream State passport tiers)
- **Pricing Tier**: Enterprise (full features)

### DreamNet Integration Points

1. **Dream Snail Bridge**
   - Sign all provenance trails with cryptographic signatures
   - Action type: `snail.trail`
   - Metadata: trail ID, identity ID, event type, hash chain

2. **Shield Core Bridge**
   - Verify cryptographic signatures before threat detection
   - Action type: `shield.verify`
   - Invalid signatures = potential threats

3. **API Keeper Bridge**
   - Sign all API requests/responses
   - Action type: `api.request`, `api.response`
   - Include API key ID, endpoint, method

4. **Webhook Nervous Core Bridge**
   - Trusted Webhook IDE for inspecting signed webhook calls
   - Action type: `webhook.call`
   - Support Jaggy's webhook discovery

5. **Dream State Bridge**
   - RBAC/SSO integration with passport tiers
   - Action type: `state.access`
   - Passport tiers: Citizen, Builder, Operator, Architect, Diplomat, Head of State

6. **Spider Web Bridge**
   - Thread Proof-of-Action receipts as events
   - Action type: `spider.receipt`
   - Make all signed actions searchable

### Required Endpoints

Generate these endpoints for DreamNet integration:

1. `POST /tag/sign` - Sign an action
   - Body: `{ action, data, actor, target?, metadata?, algorithm? }`
   - Returns: `{ receipt: ProofOfActionReceipt }`

2. `POST /tag/verify` - Verify a signature
   - Body: `{ signature, data, action }`
   - Returns: `{ valid: boolean, receipt?, error? }`

3. `GET /tag/receipt/:id` - Get Proof-of-Action receipt
   - Returns: `{ receipt: ProofOfActionReceipt }`

4. `POST /tag/webhook/inspect` - Inspect signed webhook (Trusted Webhook IDE)
   - Body: `{ webhookUrl, headers, body, signature? }`
   - Returns: `{ valid, receipt?, inspection: { headers, canonicalOrder, signatureValid, timestampValid, nonceValid } }`

5. `POST /tag/ledger/query` - Query dual ledger
   - Body: `{ actor?, action?, startTime?, endTime?, limit? }`
   - Returns: `{ entries: TagLedgerEntry[] }`

6. `POST /tag/rbac/check` - Check RBAC permissions
   - Body: `{ actor, resource, action, passportTier? }`
   - Returns: `{ allowed: boolean, reason?, requiredTier? }`

### Deployment Requirements

- **Platform**: Vercel (serverless functions)
- **Database**: Neon (PostgreSQL)
- **Cache**: Upstash (Redis)
- **Chain**: Base mainnet (for optional anchoring)

### Environment Variables Needed

Generate these env vars:
- `TAG_API_URL` - TAG service URL
- `TAG_SIGNING_KEY` - ed25519 private key
- `TAG_VERIFICATION_KEY` - ed25519 public key
- `TAG_CHAIN_ANCHOR_ENABLED` - Enable chain anchoring
- `TAG_CHAIN_ANCHOR_RPC` - Base RPC URL
- `TAG_CHAIN_ANCHOR_CONTRACT` - On-chain contract address
- `TAG_DATABASE_URL` - Neon PostgreSQL URL
- `TAG_REDIS_URL` - Upstash Redis URL
- `DREAMNET_API_URL` - DreamNet API URL (https://dreamnet.ink)
- `DREAMNET_API_KEY` - DreamNet API key (for integration)

### Features to Enable

- ✅ Proof-of-Action receipts for every signed call
- ✅ Nonce TTL and clock skew protection
- ✅ Canonical header ordering
- ✅ Key rotation support
- ✅ Dual ledger (Postgres + optional on-chain anchor)
- ✅ Minimal audit web UI
- ✅ AI SEO middleware (signed structured data)
- ✅ Geofencing (CIDR/ISO allow-deny with audit logs)
- ✅ PQC algorithms (Dilithium, Falcon)
- ✅ Trusted Webhook IDE for inspecting signed calls
- ✅ SOC/SIEM export
- ✅ RBAC/SSO options
- ✅ Agent mesh verification

### Deliverables

Please generate:
1. Production-ready TypeScript code (Fastify microservice)
2. OpenAPI specification
3. SQL schema for dual ledger
4. One-click deploy templates for Vercel + Neon + Upstash
5. Environment variable configuration
6. Test cURLs for all endpoints
7. Integration guide for DreamNet
8. Ledger/audit URLs

### DreamNet Integration

After deployment, DreamNet will:
- Call `/tag/sign` to sign all actions
- Call `/tag/verify` to verify signatures
- Call `/tag/webhook/inspect` for webhook verification
- Call `/tag/rbac/check` for permission checks
- Query `/tag/ledger/query` for audit trails

Generate the complete TAG microservice with all these features and integration points.
```

---

**After TAG GPT generates the code:**
1. Deploy TAG to Vercel + Neon + Upstash
2. Get TAG API URL and keys
3. Configure DreamNet's `TagBridgeCore` with TAG endpoint
4. Enable TAG bridges in DreamNet systems

