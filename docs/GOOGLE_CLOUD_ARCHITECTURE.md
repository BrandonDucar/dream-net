# Google Cloud Run Architecture for DreamNet

## Overview

DreamNet is deployed as a multi-service architecture on Google Cloud Run, with services for web, API, agents, and dreamkeeper, all routed through a central router service.

## Architecture Diagram

```mermaid
flowchart LR
  subgraph Client
    browser[User Browser / Wallet / Farcaster / Base]
  end

  subgraph GCP[Google Cloud Platform]
    subgraph CR[Cloud Run]
      web[web service\n(Next/Vite SPA)]
      api[api service\n(REST/gRPC)]
      agents[agents service\nAI orchestration]
      dreamkeeper[dreamkeeper service\nhealth + diagnostics]
      router[router service\nmulti-service routing]
    end

    db[(Cloud SQL\nPostgres)]
    storage[(Cloud Storage\nAssets / AI Outputs)]
    lb[HTTPS Load Balancer\n(optional single entrypoint)]
  end

  browser -->|HTTPS| lb
  lb --> router
  router --> web
  router --> api
  router --> agents
  router --> dreamkeeper

  web -->|/api| api
  web -->|Webhooks / WS| agents

  api --> db
  agents --> db
  dreamkeeper --> db

  api --> storage
  agents --> storage
```

## Services

### web
- **Purpose**: Frontend application (React/Vite)
- **Source**: `services/web/`
- **Build**: `npm run gcp-build` (runs `vite build`)
- **Start**: `node server.js`
- **Port**: 8080 (Cloud Run default)

### api
- **Purpose**: REST API and backend services
- **Source**: `services/api/`
- **Build**: `npm run gcp-build` (runs `tsc`)
- **Start**: `node dist/index.js`
- **Port**: 8080

### agents
- **Purpose**: AI orchestration and agent management
- **Source**: `services/agents/`
- **Build**: `npm run gcp-build` (runs `tsc`)
- **Start**: `node dist/index.js`
- **Port**: 8080

### dreamkeeper
- **Purpose**: Health diagnostics and system monitoring
- **Source**: `services/dreamkeeper/`
- **Build**: `npm run gcp-build` (runs `tsc`)
- **Start**: `node dist/index.js`
- **Port**: 8080

### router
- **Purpose**: Multi-service routing and load balancing
- **Source**: `services/router/`
- **Build**: No build step (echo only)
- **Start**: `node index.js`
- **Port**: 8080
- **Routes**:
  - `/` and `/*` → web service
  - `/api/*` → api service
  - `/agents/*` → agents service
  - `/dreamkeeper/*` → dreamkeeper service

## Deployment

### Manual Deployment

Deploy a single service:
```bash
./scripts/deploy-service.sh <service-name> [prod|staging]
```

Deploy all services:
```bash
./scripts/deploy-all.sh [prod|staging]
```

### Automated Deployment

GitHub Actions automatically deploys on push to `main` branch:
- Workflow: `.github/workflows/deploy-dreamnet.yml`
- Uses Workload Identity Federation (no JSON keys)
- Deploys all services to production

### Environment Variables

Each service can have environment-specific variables:
- `.env.prod` - Production environment variables
- `.env.staging` - Staging environment variables
- `.env.router.prod` - Router service backend URLs (production)
- `.env.router.staging` - Router service backend URLs (staging)

## Configuration

### Project Settings
- **Project ID**: `dreamnet-main`
- **Region**: `us-central1`
- **Services**: web, api, agents, dreamkeeper, router

### Custom Domain

To use a custom domain (e.g., `dreamnet.ink`):
1. Go to Cloud Run > router service > "Custom domains"
2. Map `dreamnet.ink` → router service
3. All traffic will go through router which fans out to other services

## Database

- **Cloud SQL (Postgres)**: `dreamnet-db`
- Used by: api, agents, dreamkeeper services

## Storage

- **Cloud Storage**: `dreamnet-assets`
- Used for: AI outputs, media files, static assets

## Load Balancer (Optional)

An HTTPS Load Balancer can be placed in front of all services for:
- Single domain entrypoint
- SSL termination
- Advanced routing rules
- DDoS protection

If not using a load balancer, browsers connect directly to Cloud Run URLs, and the router service handles internal routing.

