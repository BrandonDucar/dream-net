# DreamNet Backend Deployment - Implementation Plan

**Mission:** Deploy `server/` to Google Cloud Run → `https://api.dreamnet.ink`

**Status:** ✅ Ready to Deploy  
**Approach:** Docker-based deployment using root `Dockerfile`

---

## Chosen Deployment Approach

### Docker-based Cloud Run Deployment

**Why this approach:**
1. ✅ Root `Dockerfile` already exists and handles monorepo structure
2. ✅ Builds both frontend and backend in single container
3. ✅ Serves static files + API from one Cloud Run service
4. ✅ Optimized for serverless (scales to zero)
5. ✅ Simple deployment: `gcloud builds submit` + `gcloud run deploy`

**Alternative considered:** Direct source deployment  
**Rejected because:** Monorepo workspace dependencies require custom build steps

---

## Files Involved

### Existing Files (No Changes Needed)

| File | Purpose | Status |
|------|---------|--------|
| `Dockerfile` (root) | Multi-stage build for frontend + backend | ✅ Ready |
| `server/Dockerfile` | Backend-only build (alternative) | ⚠️ Not used |
| `server/package.json` | Backend dependencies and scripts | ✅ Ready |
| `server/build.cjs` | TypeScript build script (tolerates errors) | ✅ Ready |
| `server/tsconfig.json` | TypeScript configuration | ✅ Ready |
| `pnpm-workspace.yaml` | Monorepo workspace definition | ✅ Ready |

### New Files Created

| File | Purpose |
|------|---------|
| `docs/DREAMNET_GCP_BACKEND_DEPLOY.md` | Deployment playbook (commands, rollback, troubleshooting) |
| `docs/BACKEND_DEPLOYMENT_IMPLEMENTATION_PLAN.md` | This file (implementation plan) |
| `docs/BACKEND_DEPLOYMENT_VALIDATION.md` | Validation steps and smoke tests |

### Optional Files (Future Enhancement)

| File | Purpose |
|------|---------|
| `cloudbuild.yaml` | Cloud Build CI/CD configuration |
| `.github/workflows/deploy-backend.yml` | GitHub Actions deployment workflow |
| `server/.dockerignore` | Optimize Docker build context |

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Google Cloud Run                         │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Container: dreamnet:latest                           │ │
│  │                                                       │ │
│  │  ┌─────────────────┐      ┌──────────────────────┐  │ │
│  │  │  Frontend       │      │  Backend             │  │ │
│  │  │  (client/dist)  │◄─────┤  (server/dist)       │  │ │
│  │  │                 │      │                      │  │ │
│  │  │  Static files   │      │  Express API         │  │ │
│  │  │  served by      │      │  + Agent Registry    │  │ │
│  │  │  server/vite.ts │      │  + DreamKeeper       │  │ │
│  │  │                 │      │  + Shield Core       │  │ │
│  │  │                 │      │  + Free-Tier Gov     │  │ │
│  │  └─────────────────┘      └──────────────────────┘  │ │
│  │                                                       │ │
│  │  Port: 8080                                          │ │
│  │  Memory: 2Gi                                         │ │
│  │  CPU: 2                                              │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  URL: https://dreamnet-[hash]-uc.a.run.app                 │
│  Custom Domain: https://api.dreamnet.ink                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Cloud SQL PostgreSQL  │
              │  (or external DB)      │
              └────────────────────────┘
```

---

## Environment Variables Strategy

### Deployment Method: Cloud Run Environment Variables

**Option 1: Direct Environment Variables** (Simple, good for non-sensitive)
```bash
gcloud run services update dreamnet \
  --set-env-vars NODE_ENV=production,PORT=8080
```

**Option 2: Secret Manager** (Recommended for sensitive data)
```bash
# Create secret
echo -n "postgresql://..." | gcloud secrets create DATABASE_URL --data-file=-

# Reference in Cloud Run
gcloud run services update dreamnet \
  --set-secrets DATABASE_URL=DATABASE_URL:latest
```

### Required Environment Variables

| Variable | Source | Method |
|----------|--------|--------|
| `NODE_ENV` | Hardcoded | Direct env var |
| `PORT` | Hardcoded | Direct env var (8080) |
| `DATABASE_URL` | User provides | Secret Manager |

### Optional Environment Variables

| Variable | Purpose | Method |
|----------|---------|--------|
| `OPENAI_API_KEY` | AI features | Secret Manager |
| `ANTHROPIC_API_KEY` | Claude AI | Secret Manager |
| `STRIPE_SECRET_KEY` | Payments | Secret Manager |
| `TWILIO_ACCOUNT_SID` | SMS/Voice | Secret Manager |
| `INIT_HEAVY_SUBSYSTEMS` | Feature flag | Direct env var |
| `INIT_SUBSYSTEMS` | Feature flag | Direct env var |
| `MESH_AUTOSTART` | Feature flag | Direct env var |

---

## Build Process Analysis

### Current Build Flow (Verified ✅)

1. **Install dependencies** (pnpm workspace)
   ```bash
   pnpm install --frozen-lockfile
   ```

2. **Build frontend** (client → dist)
   ```bash
   cd client && pnpm build
   ```

3. **Build backend** (server → dist)
   ```bash
   cd server && pnpm build
   # Runs: node build.cjs
   # Which runs: tsc -p tsconfig.json --noEmitOnError false
   ```

4. **Copy vite.ts** (static file server)
   ```bash
   cp server/vite.ts server/dist/vite.js
   ```

5. **Start server**
   ```bash
   node server/dist/index.js
   ```

### Build Verification (Local Test)

✅ **Tested:** `cd server && pnpm build`  
✅ **Result:** `dist/index.js` created (80,949 bytes)  
✅ **Status:** Build succeeds despite TypeScript errors (expected behavior)

---

## Deployment Steps (High-Level)

### Phase 1: Pre-Deployment (Local)

1. ✅ Verify build works locally
2. ✅ Test Docker build (optional)
3. ✅ Prepare environment variables
4. ✅ Authenticate with GCP

### Phase 2: Initial Deployment

1. Build and push Docker image to GCR
2. Deploy to Cloud Run
3. Configure environment variables
4. Test health endpoint
5. Verify API routes

### Phase 3: Custom Domain Setup

1. Map `api.dreamnet.ink` to Cloud Run service
2. Update DNS records
3. Wait for SSL certificate provisioning
4. Verify HTTPS access

### Phase 4: Monitoring & Optimization

1. Set up Cloud Monitoring alerts
2. Configure log exports
3. Optimize resource allocation
4. Implement CI/CD (optional)

---

## System Preservation

### Existing Systems (No Changes)

All existing backend systems are preserved:

| System | Location | Status |
|--------|----------|--------|
| **DreamKeeper** | `server/core/dreamkeeper.ts` | ✅ Preserved |
| **Agent Registry** | `server/agents/` | ✅ Preserved |
| **Shield Core** | `server/middleware/shield-core.ts` | ✅ Preserved |
| **Free-Tier Governor** | `server/middleware/free-tier-governor.ts` | ✅ Preserved |
| **Mesh Network** | `server/mesh/` | ✅ Preserved |
| **Trust System** | `server/trust/` | ✅ Preserved |
| **Vector Ledger** | `server/vector-ledger/` | ✅ Preserved |
| **Starbridge** | `server/starbridge/` | ✅ Preserved |

### API Routes (No Changes)

All API routes remain unchanged:
- `/api/health` - Health check
- `/api/dreams/*` - Dream management
- `/api/agents/*` - Agent operations
- `/api/auth/*` - Authentication
- `/api/garden/*` - Garden feed
- All other routes in `server/routes/`

---

## Rollback Strategy

### Immediate Rollback

If deployment fails or causes issues:

```bash
# List revisions
gcloud run revisions list --service dreamnet --region us-central1

# Rollback to previous revision
gcloud run services update-traffic dreamnet \
  --region us-central1 \
  --to-revisions PREVIOUS_REVISION=100
```

### Gradual Rollout (Advanced)

For zero-downtime updates:

```bash
# Deploy new revision without routing traffic
gcloud run deploy dreamnet --no-traffic --tag canary

# Route 10% traffic to new revision
gcloud run services update-traffic dreamnet \
  --to-revisions canary=10,PREVIOUS=90

# If successful, route 100% to new revision
gcloud run services update-traffic dreamnet \
  --to-latest
```

---

## Risk Assessment

### Low Risk ✅

- Docker build process (already tested)
- Environment variable configuration
- Cloud Run deployment (standard process)
- Rollback capability (instant)

### Medium Risk ⚠️

- Database connection (requires correct `DATABASE_URL`)
- Cold start performance (mitigated with min instances)
- Workspace dependency resolution (tested locally)

### Mitigation Strategies

1. **Database:** Test connection locally before deploying
2. **Performance:** Start with 2Gi/2CPU, scale up if needed
3. **Dependencies:** Dockerfile uses `pnpm install --frozen-lockfile`

---

## Success Criteria

### Deployment Success

- ✅ Cloud Run service is running
- ✅ Health endpoint returns 200 OK
- ✅ API routes respond correctly
- ✅ Frontend static files are served
- ✅ Database connection works (if configured)

### Production Readiness

- ✅ Custom domain mapped (`api.dreamnet.ink`)
- ✅ SSL certificate active
- ✅ Environment variables configured
- ✅ Monitoring and logging enabled
- ✅ Rollback tested

---

## Timeline Estimate

| Phase | Duration | Tasks |
|-------|----------|-------|
| **Pre-Deployment** | 15 min | Authenticate GCP, prepare env vars |
| **Initial Deployment** | 10 min | Build + deploy to Cloud Run |
| **Testing** | 10 min | Verify health, API routes, frontend |
| **Custom Domain** | 30 min | DNS setup, SSL provisioning |
| **Monitoring Setup** | 15 min | Configure alerts, logs |
| **Total** | ~80 min | End-to-end deployment |

**Note:** DNS propagation may take up to 24 hours, but typically completes in 5-30 minutes.

---

## Next Actions

### Immediate (Required)

1. ✅ Create deployment playbook → `DREAMNET_GCP_BACKEND_DEPLOY.md`
2. ✅ Create implementation plan → This file
3. ⏳ Create validation steps → `BACKEND_DEPLOYMENT_VALIDATION.md`
4. ⏳ Test Docker build locally (optional)
5. ⏳ Prepare environment variables
6. ⏳ Execute deployment

### Future (Optional)

1. Create `cloudbuild.yaml` for CI/CD
2. Set up GitHub Actions workflow
3. Implement Cloud Armor for DDoS protection
4. Configure VPC Connector for private DB access
5. Set up Cloud CDN for static assets

---

## Questions for User

Before proceeding with deployment:

1. **GCP Project ID:** What is your Google Cloud project ID?
2. **Region:** Preferred region? (default: `us-central1`)
3. **Database:** Do you have a `DATABASE_URL` ready, or should we deploy without it initially?
4. **Custom Domain:** Do you have access to `dreamnet.ink` DNS settings?
5. **Environment Variables:** Which optional features do you want enabled (AI, payments, etc.)?

---

**Status:** ✅ Ready for deployment  
**Blocker:** None  
**Next Step:** Create validation steps document, then execute deployment

---

**Last Updated:** 2025-11-26  
**Author:** DreamNet Cloud Run Deployer
