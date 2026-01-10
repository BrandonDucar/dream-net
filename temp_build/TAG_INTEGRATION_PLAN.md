# 🔐 Trusted Agent Gateway (TAG) ↔ DreamNet Integration Plan

## 🎯 Overview

TAG provides cryptographic provenance, signing, and verification for agent and API traffic. This integration enhances DreamNet's existing systems with cryptographic trust layers.

## 🔗 Integration Points

### 1. **Dream Snail ↔ TAG** (Provenance Enhancement)
- **Current**: Dream Snail tracks trails with hash chains
- **TAG Enhancement**: Add cryptographic signing (ed25519/PQC) to all trails
- **Benefit**: Verifiable cryptographic provenance for all Dream Snail trails

### 2. **Shield Core ↔ TAG** (Verification Layer)
- **Current**: Shield Core detects threats via pattern matching
- **TAG Enhancement**: Verify cryptographic signatures on all requests
- **Benefit**: Cryptographic proof of request authenticity

### 3. **API Keeper ↔ TAG** (Signed API Traffic)
- **Current**: API Keeper routes and manages API keys
- **TAG Enhancement**: Sign all API requests/responses with Proof-of-Action receipts
- **Benefit**: Every API call has cryptographic proof

### 4. **Webhook Nervous Core ↔ TAG** (Trusted Webhook IDE)
- **Current**: Jaggy discovers and manages webhooks
- **TAG Enhancement**: TAG's "Trusted Webhook IDE" for inspecting signed webhook calls
- **Benefit**: Cryptographic verification of all webhook traffic

### 5. **Dream State ↔ TAG** (RBAC/SSO)
- **Current**: Dream State has passport-based permissions
- **TAG Enhancement**: TAG's RBAC/SSO integration with passport tiers
- **Benefit**: Enhanced access control with cryptographic verification

### 6. **Spider Web ↔ TAG** (Proof-of-Action Threads)
- **Current**: Spider Web threads operational events
- **TAG Enhancement**: Thread TAG Proof-of-Action receipts as events
- **Benefit**: All signed actions become searchable threads

## 🚀 Using TAG GPT to Configure TAG for DreamNet

### Step 1: Deploy TAG Microservice

**Prompt for TAG GPT:**
```
I want to deploy TAG for DreamNet, a biomimetic agent orchestration platform.

Requirements:
- Signing algorithm: ed25519 (default)
- Chain anchoring: Optional (Base chain preferred)
- AI SEO extensions: Yes (integrate with DreamNet AI SEO Core)
- Geofencing extensions: Yes (integrate with DreamNet geofencing)
- PQC support: Yes (Dilithium, Falcon)
- Dual ledger: Postgres (Neon) + Optional on-chain anchor (Base)
- Trusted Webhook IDE: Yes (for Jaggy webhook management)
- RBAC/SSO: Yes (integrate with Dream State passports)
- Pricing tier: Enterprise (full features)

DreamNet Integration Points:
1. Dream Snail - Sign all provenance trails
2. Shield Core - Verify signatures on threats
3. API Keeper - Sign all API requests/responses
4. Webhook Nervous Core - Trusted Webhook IDE
5. Dream State - RBAC/SSO with passports
6. Spider Web - Thread Proof-of-Action receipts

Generate production-ready TypeScript code, OpenAPI spec, SQL schema, and one-click deploy templates for Vercel + Neon + Upstash.
```

### Step 2: Integration Configuration

**TAG GPT will generate:**
- Fastify microservice code
- OpenAPI specification
- SQL schema for dual ledger
- Vercel deployment template
- Neon database setup
- Upstash Redis configuration
- Environment variables
- Test cURLs
- Integration endpoints

### Step 3: Connect TAG to DreamNet

**Integration endpoints TAG should expose:**
- `POST /tag/sign` - Sign a request/action
- `POST /tag/verify` - Verify a signature
- `GET /tag/receipt/:id` - Get Proof-of-Action receipt
- `POST /tag/webhook/inspect` - Inspect signed webhook (Trusted Webhook IDE)
- `GET /tag/ledger` - Query dual ledger
- `POST /tag/rbac/check` - Check RBAC permissions

## 📦 DreamNet TAG Bridge Package

We'll create `@dreamnet/tag-bridge-core` to connect TAG to DreamNet systems.

### Features:
1. **Snail Bridge** - Sign Dream Snail trails with TAG
2. **Shield Bridge** - Verify signatures via TAG before threat detection
3. **API Bridge** - Sign all API Keeper requests/responses
4. **Webhook Bridge** - Route webhooks through TAG's Trusted Webhook IDE
5. **State Bridge** - Integrate TAG RBAC with Dream State passports
6. **Spider Bridge** - Thread TAG receipts to Spider Web

## 🔧 Implementation Steps

1. **Deploy TAG** (using TAG GPT)
   - Generate code with TAG GPT
   - Deploy to Vercel + Neon + Upstash
   - Get TAG API endpoint and keys

2. **Create TAG Bridge Package**
   - `packages/tag-bridge-core/`
   - Bridge logic for each DreamNet system
   - Type definitions

3. **Integrate into DreamNet**
   - Update `server/index.ts` to initialize TAG Bridge
   - Add middleware for signing/verification
   - Update each system to use TAG

4. **Test Integration**
   - Sign/verify test requests
   - Verify Proof-of-Action receipts
   - Test Trusted Webhook IDE
   - Verify RBAC integration

## 📋 TAG Configuration for DreamNet

### Environment Variables (from TAG GPT):
```env
# TAG Core
TAG_API_URL=https://tag.dreamnet.ink
TAG_SIGNING_KEY=ed25519_private_key
TAG_VERIFICATION_KEY=ed25519_public_key

# Chain Anchoring (Optional)
TAG_CHAIN_ANCHOR_ENABLED=true
TAG_CHAIN_ANCHOR_RPC=https://mainnet.base.org
TAG_CHAIN_ANCHOR_CONTRACT=0x...

# Database (Neon)
TAG_DATABASE_URL=postgresql://...
TAG_REDIS_URL=redis://... (Upstash)

# DreamNet Integration
DREAMNET_API_URL=https://dreamnet.ink
DREAMNET_API_KEY=dn_live_...
DREAMNET_SNAIL_ENABLED=true
DREAMNET_SHIELD_ENABLED=true
DREAMNET_WEBHOOK_ENABLED=true
DREAMNET_STATE_ENABLED=true
```

### TAG Features Enabled:
- ✅ ed25519 signing (default)
- ✅ PQC algorithms (Dilithium, Falcon)
- ✅ Nonce TTL and clock skew protection
- ✅ Canonical header ordering
- ✅ Key rotation
- ✅ Dual ledger (Postgres + Base chain)
- ✅ AI SEO middleware (signed structured data)
- ✅ Geofencing (CIDR/ISO allow-deny)
- ✅ Trusted Webhook IDE
- ✅ RBAC/SSO
- ✅ SOC/SIEM export
- ✅ Audit web UI

## 🎯 Expected Benefits

1. **Cryptographic Trust**: Every action has cryptographic proof
2. **Audit Trail**: Complete, verifiable audit trail via dual ledger
3. **Webhook Security**: Trusted Webhook IDE for Jaggy
4. **Enhanced RBAC**: Cryptographic verification of permissions
5. **Chain Anchoring**: Optional on-chain proof of critical actions
6. **Compliance**: SOC/SIEM export for enterprise compliance

## 📚 Next Steps

1. Use TAG GPT to generate TAG microservice
2. Deploy TAG to Vercel + Neon + Upstash
3. Create `@dreamnet/tag-bridge-core` package
4. Integrate TAG Bridge into DreamNet systems
5. Test end-to-end signing/verification
6. Enable chain anchoring for critical actions
7. Deploy Trusted Webhook IDE for Jaggy

---

**Ready to integrate TAG!** Use the TAG GPT prompt above to generate the TAG microservice, then we'll create the DreamNet bridge package.

