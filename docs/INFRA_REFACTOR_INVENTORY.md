# DreamNet Infrastructure Refactor Inventory

**Date:** 2025-01-27  
**Purpose:** Inventory all Neon/Vercel/Railway usage before refactoring to Google Cloud-first architecture

## Summary

- **Total files with Vercel references:** 260
- **Total files with Railway references:** 96  
- **Total files with Neon references:** 79

## Critical Runtime Files (Must Refactor)

### Database Layer

| File | Lines | Description | Category |
|------|-------|-------------|----------|
| `server/db.ts` | 1-136 | Database connection logic - detects Neon vs standard Postgres | `runtime-critical` |
| `server/config/env.ts` | 18, 68, 108 | DATABASE_URL env var definition | `runtime-critical` |
| `server/routes/health.ts` | 45, 108, 136 | Health check uses DATABASE_URL | `runtime-critical` |

**Current Behavior:**
- Detects Neon by checking if `DATABASE_URL.includes('neon.tech')`
- Uses `@neondatabase/serverless` for Neon
- Uses standard `pg` for Cloud SQL/standard Postgres
- **Action:** Keep flexible but make Cloud SQL the default/primary path

### Environment Variables

| Variable | Usage | Category |
|----------|-------|----------|
| `DATABASE_URL` | Used throughout for DB connection | `runtime-critical` |
| `VERCEL_TOKEN` | Used in Vercel agent, DomainKeeper, deployment scripts | `deployment-only` |
| `VERCEL_TEAM_ID` | Optional Vercel team ID | `deployment-only` |
| `VERCEL_PROJECT_NAME` | Vercel project name (default: "dream-net") | `deployment-only` |
| `RAILWAY_TOKEN` | Railway API token (legacy) | `deployment-only` |
| `NEON_DATABASE_URL` | Alternative Neon connection string (legacy) | `runtime-critical` |

## Deployment Scripts

### Primary (Google Cloud)

| Script | File | Description | Status |
|--------|------|-------------|--------|
| `deploy:gcp` | `package.json:43` | Deploys to Cloud Run | ✅ Primary |
| `deploy:data-gcp` | `package.json:47` | Deploys data infrastructure (Cloud SQL, BigQuery, Redis) | ✅ Primary |
| `deploy:gke` | `package.json:45` | Deploys to GKE (Kubernetes) | ✅ Primary |

### Legacy (Mark for Deprecation)

| Script | File | Description | Status |
|--------|------|-------------|--------|
| `deploy:vercel` | `package.json:42` | Deploys to Vercel | ⚠️ Legacy |
| `vercel-build` | `package.json:28` | Build command for Vercel | ⚠️ Legacy |
| `vercel:monitor` | `package.json:39` | Monitors Vercel builds | ⚠️ Legacy |
| `deploy:prebuilt` | `package.json:34` | Vercel prebuilt deployment | ⚠️ Legacy |
| `build:prebuilt` | `package.json:33` | Vercel prebuilt build | ⚠️ Legacy |

**Action:** Rename legacy scripts with `-legacy` suffix and add comments

## Config Files

### Legacy Provider Configs

| File | Purpose | Action |
|------|---------|--------|
| `vercel.json` | Vercel deployment config (frontend) | Keep with legacy comment |
| `railway.toml` | Railway deployment config | Keep with legacy comment |
| `nixpacks.toml` | Railway build config | Keep with legacy comment |

**Current Contents:**
- `vercel.json`: Routes `/api/*` to `https://api.dreamnet.ink` (needs update for Cloud Run)
- `railway.toml`: Build and start commands for Railway
- `nixpacks.toml`: Railway Metal Build configuration

**Action:** Add clear comments marking as legacy, update vercel.json API routing if needed

## Code References

### Vercel Integration Code

| File | Purpose | Category |
|------|---------|----------|
| `server/integrations/vercelClient.ts` | Vercel API client | `runtime-critical` (optional feature) |
| `server/routes/vercel.ts` | Vercel API routes | `runtime-critical` (optional feature) |
| `server/services/DomainKeeper.ts` | Uses Vercel for domain management | `runtime-critical` (optional feature) |
| `packages/dreamnet-vercel-agent/` | Vercel agent package | `runtime-critical` (optional feature) |
| `packages/env-keeper-core/logic/vercelSync.ts` | Syncs env vars to Vercel | `runtime-critical` (optional feature) |

**Action:** Keep these but make them optional - server should start without Vercel

### Railway Integration Code

| File | Purpose | Category |
|------|---------|----------|
| `packages/deployment-core/src/index.ts` | Railway deployment client | `deployment-only` |

**Action:** Mark as legacy, keep for backward compatibility

### Neon-Specific Code

| File | Lines | Description | Category |
|------|-------|-------------|----------|
| `server/db.ts` | 23-36 | Neon detection and driver initialization | `runtime-critical` |

**Action:** Keep flexible detection but prioritize Cloud SQL path

## Documentation Files

### Migration Guides (Keep, Update)

- `docs/GOOGLE_CLOUD_MIGRATION_PLAN.md`
- `docs/GOOGLE_CLOUD_YOUR_NEW_HOME.md`
- `docs/GOOGLE_CLOUD_COMPLETE_ECOSYSTEM.md`
- `docs/DEPLOYMENT_VS_VERCEL.md`

### Legacy Setup Docs (Mark as Legacy)

- `RAILWAY_*.md` (multiple files)
- `VERCEL_*.md` (multiple files)
- `RAILWAY.md`
- `VERCEL_SETUP.md`

**Action:** Add "LEGACY" prefix or move to `docs/legacy/` directory

## Environment Variable Schema

### Canonical Google Cloud Env Vars

```bash
# Required for Google Cloud deployment
GCP_PROJECT_ID=aqueous-tube-470317-m6
GCP_REGION=us-central1
GCP_SERVICE_NAME=dreamnet

# Database (works for both Cloud SQL and Neon)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Optional: Cloud SQL specific (if using Cloud SQL Proxy)
CLOUD_SQL_INSTANCE_CONNECTION_NAME=project:region:instance

# Secrets (use Secret Manager in production)
OPENAI_API_KEY=...
# ... other API keys
```

### Legacy Env Vars (Optional)

```bash
# Vercel (optional - only if using Vercel features)
VERCEL_TOKEN=...
VERCEL_TEAM_ID=...
VERCEL_PROJECT_NAME=dream-net

# Railway (legacy - not needed for GCP)
RAILWAY_TOKEN=...
```

## Refactor Plan

### Phase 1: Database Layer ✅
- [x] Already supports both Neon and Cloud SQL
- [ ] Update comments to emphasize Cloud SQL as primary
- [ ] Add Cloud SQL connection name support

### Phase 2: Deployment Scripts
- [ ] Rename legacy scripts: `deploy:vercel` → `deploy:vercel-legacy`
- [ ] Add comments in package.json marking primary vs legacy
- [ ] Ensure `deploy:gcp` and `deploy:data-gcp` are clearly primary

### Phase 3: Config Files
- [ ] Add legacy comments to `vercel.json`, `railway.toml`, `nixpacks.toml`
- [ ] Update `vercel.json` API routing to point to Cloud Run (if needed)

### Phase 4: Environment Variables
- [ ] Create/update `.env.example` with GCP-first vars
- [ ] Document which vars are required vs optional/legacy

### Phase 5: Documentation
- [ ] Update main README with GCP-first approach
- [ ] Create quick start guide for Google Cloud
- [ ] Mark legacy docs clearly

### Phase 6: Code Cleanup
- [ ] Make Vercel integrations optional (don't fail startup)
- [ ] Add feature flags for legacy provider integrations

## Next Steps

1. Apply refactor plan systematically
2. Test server startup without Neon/Vercel/Railway
3. Test GCP deployment scripts
4. Update documentation
5. Create final summary

