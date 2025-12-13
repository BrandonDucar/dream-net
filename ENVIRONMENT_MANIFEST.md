# DreamNet Environment Variables Manifest

This document catalogs all environment variables used across the DreamNet monorepo, grouped by concern and usage.

---

## 🔧 Core Configuration

### Required
- **`NODE_ENV`** (required)
  - Values: `development` | `production` | `test`
  - Used in: `server/config/env.ts`
  - Purpose: Runtime environment mode

- **`PORT`** (optional, defaults to 3000)
  - Type: number
  - Used in: `server/config/env.ts`, `server/index.ts`
  - Purpose: HTTP server port
  - Note: Cloud Run uses `PORT` env var automatically

### Optional
- **`PUBLIC_URL`** / **`PUBLIC_BASE_URL`**
  - Used in: `server/routes/twilio.ts`, various routes
  - Purpose: Public-facing base URL for webhooks and callbacks

---

## 💾 Database

### Required (for database features)
- **`DATABASE_URL`** (optional - server can start without DB)
  - Format: PostgreSQL connection string (e.g., `postgresql://user:pass@host:5432/dbname`)
  - Used in: `server/db.ts`, `server/config/env.ts`
  - Purpose: Neon Postgres connection (can be migrated to Cloud SQL/Aurora)
  - Note: Server gracefully degrades if not set

### Legacy PostgreSQL vars (for compatibility)
- **`PGHOST`**, **`PGDATABASE`**, **`PGUSER`**, **`PGPASSWORD`**, **`PGPORT`**
  - Used in: Legacy deployment configs
  - Purpose: Alternative PostgreSQL connection format

---

## 🧠 Latent Collaboration

### Optional
- **`USE_LATENT_COLLABORATION`** (optional, defaults to false)
  - Values: `true` | `false`
  - Used in: `packages/latent-collaboration-core/`, `packages/orchestrator-core/`
  - Purpose: Enable latent collaboration system for agent communication
  - Note: Requires `OPENAI_API_KEY` for embeddings

- **`LATENT_EMBEDDING_MODEL`** (optional, defaults to `text-embedding-3-small`)
  - Used in: `packages/latent-collaboration/src/latentSpace.ts`
  - Purpose: OpenAI embedding model for latent encoding
  - Default: `text-embedding-3-small`

- **`LATENT_VECTOR_SIZE`** (optional, defaults to 1536)
  - Type: number
  - Used in: `packages/latent-collaboration/src/latentSpace.ts`
  - Purpose: Dimension of latent vectors
  - Default: `1536`

---

## ⛓️ Blockchain

### Base Network
- **`VITE_BASE_RPC_URL`** (frontend)
  - Default: `https://mainnet.base.org`
  - Used in: `client/src/miniapps/subscriptions/SubscriptionApp.tsx`
  - Purpose: Base mainnet RPC endpoint

- **`VITE_BASE_CHAIN_ID`** (frontend)
  - Default: `8453`
  - Used in: `client/src/miniapps/subscriptions/SubscriptionApp.tsx`
  - Purpose: Base mainnet chain ID

### Contract Addresses (frontend)
- **`VITE_SUBSCRIPTION_HUB_ADDRESS`**
  - Used in: `client/src/miniapps/subscriptions/SubscriptionApp.tsx`
  - Purpose: Subscription Hub contract address

- **`VITE_SUBSCRIPTION_BADGE_ADDRESS`**
  - Used in: `client/src/miniapps/subscriptions/SubscriptionApp.tsx`
  - Purpose: Subscription Badge contract address

- **`NEXT_PUBLIC_SHEEP_TOKEN_ADDRESS`** / **`VITE_SHEEP_TOKEN_ADDRESS`**
  - Used in: Various mini-apps
  - Purpose: SHEEP token contract address

---

## 🤖 AI Providers

### OpenAI
- **`OPENAI_API_KEY`** (optional)
  - Used in: `server/config/env.ts`, `server/routes/website-designer.ts`
  - Purpose: OpenAI API access for content generation, SEO, dream titles

### Anthropic
- **`ANTHROPIC_API_KEY`** (optional)
  - Used in: Various AI features
  - Purpose: Anthropic Claude API access

---

## 💳 Payments

### Stripe
- **`STRIPE_SECRET_KEY`** (required for Stripe features)
  - Used in: `server/routes/stripe-checkout.ts`, `server/routes/stripe-webhook.ts`
  - Purpose: Stripe API secret key

- **`STRIPE_WEBHOOK_SECRET`** (required for webhooks)
  - Used in: `server/routes/stripe-webhook.ts`
  - Purpose: Stripe webhook signature verification

---

## 📧 Communications

### Twilio (SMS/Voice)
- **`TWILIO_ACCOUNT_SID`** (optional)
  - Used in: `server/routes/twilio.ts`, `server/index.ts`
  - Purpose: Twilio account identifier

- **`TWILIO_AUTH_TOKEN`** (optional)
  - Used in: `server/routes/twilio.ts`
  - Purpose: Twilio API authentication

- **`TWILIO_PHONE_NUMBER`** (optional)
  - Used in: `server/routes/twilio.ts`
  - Purpose: Twilio phone number for outbound calls/SMS

- **`TWILIO_MODE`** (optional)
  - Values: `off` | `sim` | `draft` | `live`
  - Used in: `server/routes/twilio.ts`
  - Purpose: Twilio feature flag mode

- **`DREAMNET_VOICE_RECIPIENT`** (optional)
  - Used in: `server/index.ts`
  - Purpose: Default recipient for voice calls

### Gmail
- **`GMAIL_REFRESH_TOKEN`** (optional)
  - Used in: `server/routes/inbox-squared.ts`
  - Purpose: Gmail API OAuth refresh token

- **`GOOGLE_CLIENT_ID`** (optional)
  - Used in: `server/routes/inbox-squared.ts`
  - Purpose: Google OAuth client ID

- **`GOOGLE_CLIENT_SECRET`** (optional)
  - Used in: `server/routes/inbox-squared.ts`
  - Purpose: Google OAuth client secret

### Discord
- **`DISCORD_WEBHOOK_URL`** (optional)
  - Used in: `server/webhook-notifier.ts`
  - Purpose: Discord webhook for notifications

### Telegram
- **`TELEGRAM_BOT_TOKEN`** (optional)
  - Used in: `server/webhook-notifier.ts`
  - Purpose: Telegram bot API token

- **`TELEGRAM_CHAT_ID`** (optional)
  - Used in: `server/webhook-notifier.ts`
  - Purpose: Telegram chat ID for notifications

---

## ☁️ Cloud Infrastructure

### Google Cloud Platform
- **`GCP_PROJECT_ID`** / **`GOOGLE_CLOUD_PROJECT`**
  - Default: `dreamnet-62b49`
  - Used in: `server/integrations/googleCloudClient.ts`, `infrastructure/google/deploy-all.ts`
  - Purpose: GCP project identifier

- **`GCP_REGION`** / **`GOOGLE_CLOUD_REGION`**
  - Default: `us-central1`
  - Used in: `server/integrations/googleCloudClient.ts`, `infrastructure/google/deploy-all.ts`
  - Purpose: GCP deployment region

- **`GCP_SERVICE_NAME`**
  - Default: `dreamnet`
  - Used in: `infrastructure/google/deploy-all.ts`
  - Purpose: Cloud Run service name

### AWS
- **`AWS_REGION`**
  - Default: `us-east-1`
  - Used in: `server/integrations/awsClient.ts`, `infrastructure/aws/deploy-all.ts`
  - Purpose: AWS deployment region

- **`AWS_S3_BUCKET`**
  - Used in: `infrastructure/aws/deploy-all.ts`
  - Purpose: S3 bucket for frontend static files

- **`AWS_CLOUDFRONT_DISTRIBUTION`**
  - Used in: `infrastructure/aws/deploy-all.ts`
  - Purpose: CloudFront distribution ID (optional)

- **`AWS_APP_RUNNER_SERVICE`**
  - Default: `dreamnet-backend`
  - Used in: `infrastructure/aws/deploy-all.ts`
  - Purpose: App Runner service name

- **`AWS_ECR_REPOSITORY`**
  - Default: `dreamnet`
  - Used in: `infrastructure/aws/deploy-all.ts`
  - Purpose: ECR repository name for Docker images

- **`AWS_ACCOUNT_ID`**
  - Used in: `infrastructure/aws/deploy-all.ts`
  - Purpose: AWS account ID (auto-detected if not set)

### Cloudflare
- **`CF_API_TOKEN`** (optional)
  - Used in: `server/integrations/cloudflareDns.ts`
  - Purpose: Cloudflare API token for DNS management

- **`CF_ZONE_ID`** (optional)
  - Used in: `server/integrations/cloudflareDns.ts`
  - Purpose: Cloudflare zone ID

- **`CF_ZONE_NAME`** (optional)
  - Used in: `server/integrations/cloudflareDns.ts`
  - Purpose: Cloudflare zone name

- **`DNS_PROVIDER`** (optional)
  - Used in: `server/integrations/cloudflareDns.ts`
  - Purpose: DNS provider selection (`cloudflare`)

### Vercel (legacy)
- **`VERCEL_TOKEN`** (optional)
  - Used in: `server/integrations/vercelClient.ts`
  - Purpose: Vercel API token

- **`VERCEL_TEAM_ID`** (optional)
  - Used in: `server/integrations/vercelClient.ts`
  - Purpose: Vercel team identifier

- **`VERCEL_PROJECT_NAME`**
  - Default: `dream-net`
  - Used in: `server/services/DomainKeeper.ts`
  - Purpose: Vercel project name

---

## 🔐 Security & Access Control

### CORS
- **`ALLOWED_ORIGINS`** (optional)
  - Format: Comma-separated list of origins
  - Used in: `server/config/env.ts`
  - Purpose: CORS allowed origins

### Admin/Operator
- **`OPERATOR_WALLETS`** (optional)
  - Format: Comma-separated list of wallet addresses
  - Used in: `server/config/env.ts`, `server/auth.ts`
  - Purpose: Admin wallet addresses

- **`ADMIN_WALLETS`** (optional)
  - Format: Comma-separated list of wallet addresses
  - Used in: `server/auth.ts`
  - Purpose: Admin wallet addresses (legacy)

- **`ADMIN_OVERRIDE`** (optional, development only)
  - Values: `true` | `false`
  - Used in: `server/auth.ts`
  - Purpose: Development override for admin access

---

## 🎛️ Feature Flags & Behavior

### Subsystem Control
- **`INIT_SUBSYSTEMS`** (optional)
  - Values: `true` | `false`
  - Used in: `server/config/env.ts`, `server/index.ts`
  - Purpose: Enable automatic subsystem initialization

- **`MESH_AUTOSTART`** (optional)
  - Values: `true` | `false` (default: `true`)
  - Used in: `server/config/env.ts`
  - Purpose: Auto-start mesh network

### Frontend Feature Flags
- **`VITE_GOVERNOR_MODE`** (optional)
  - Values: `closed` | `canary` | `open`
  - Default: `canary`
  - Used in: `client/src/governor/config.ts`
  - Purpose: Request governor mode

- **`VITE_GOVERNOR_MAX_QPS`** (optional)
  - Default: `2`
  - Used in: `client/src/governor/config.ts`
  - Purpose: Maximum queries per second

- **`VITE_GOVERNOR_MAX_CONCURRENCY`** (optional)
  - Default: `5`
  - Used in: `client/src/governor/config.ts`
  - Purpose: Maximum concurrent requests

- **`VITE_GOVERNOR_QUEUE_LIMIT`** (optional)
  - Default: `20`
  - Used in: `client/src/governor/config.ts`
  - Purpose: Request queue limit

- **`VITE_SIMULATION_MODE`** (optional)
  - Default: `true`
  - Used in: `client/src/governor/config.ts`
  - Purpose: Enable simulation mode

- **`VITE_FEATURE_AGENTS`** (optional)
  - Default: `false`
  - Used in: `client/src/governor/config.ts`
  - Purpose: Enable agent features

- **`VITE_FEATURE_PAYMENTS`** (optional)
  - Default: `false`
  - Used in: `client/src/governor/config.ts`
  - Purpose: Enable payment features

- **`VITE_DEV_AUTH`** (optional)
  - Used in: `client/src/components/auth/login-form.tsx`
  - Purpose: Enable development authentication

### API Configuration
- **`VITE_API_URL`** (optional)
  - Used in: `client/src/api/cardForge.ts`, `client/src/pages/hub/deployment.tsx`, `client/src/hooks/useMetrics.ts`
  - Purpose: Backend API base URL

### Override Modes
- **`OVERRIDE_MODE`** (optional)
  - Values: `true` | `false`
  - Used in: `server/routes.ts`
  - Purpose: Enable override mode for certain operations

- **`INACTIVITY_DAYS_BEFORE_ARCHIVE`** (optional)
  - Default: `7`
  - Used in: `server/routes.ts`
  - Purpose: Days of inactivity before archiving

---

## 🌐 Domain Management

- **`PRIMARY_DOMAIN`**
  - Default: `dreamnet.ink`
  - Used in: `server/services/DomainKeeper.ts`
  - Purpose: Primary production domain

- **`STAGING_DOMAIN`** (optional)
  - Used in: `server/services/DomainKeeper.ts`
  - Purpose: Staging environment domain

---

## 📝 Environment File Templates

### `.env.gcp` (for Google Cloud deployments)
```bash
# Core
NODE_ENV=production
PORT=8080

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# AI Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Communications
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# Security
ALLOWED_ORIGINS=https://dreamnet.ink,https://www.dreamnet.ink
OPERATOR_WALLETS=0x...,0x...
```

### `.env.aws` (for AWS deployments)
```bash
# Same structure as .env.gcp
# See above for template
```

---

## 🔄 Migration Notes

### From Vercel/Railway to Google Cloud/AWS

**Database Migration:**
- Current: `DATABASE_URL` points to Neon Postgres
- Future: Can point to Cloud SQL (GCP) or Aurora (AWS)
- No code changes needed - connection string format is compatible

**Environment Variables:**
- All existing env vars remain compatible
- New cloud-specific vars (`GCP_PROJECT_ID`, `AWS_REGION`, etc.) are optional with defaults
- Deployment scripts automatically load from `.env.gcp` or `.env.aws`

**Frontend Variables:**
- `VITE_*` variables are build-time and baked into the static bundle
- Set these before running `pnpm --filter client build`
- For Cloud Run: Set in Cloud Run service config
- For S3+CloudFront: Set during build, or use runtime config API

---

## 📚 References

- **Server Config**: `server/config/env.ts`
- **Deployment Scripts**: `infrastructure/google/deploy-all.ts`, `infrastructure/aws/deploy-all.ts`
- **Database**: `server/db.ts`
- **Integrations**: `server/integrations/*`

---

**Last Updated**: 2025-01-27  
**Maintained By**: DreamOPS

