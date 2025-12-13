# Google Cloud Run Deployment Status

## Current Deployment Status

**Service Name:** `dreamnet`  
**URL:** `https://dreamnet-qa6y4okh2a-ue.a.run.app`  
**Region:** `us-east1`  
**Status:** ⚠️ **Deployed but using placeholder image**

### What's Deployed

**Current Image:** `gcr.io/cloudrun/placeholder`  
**Issue:** This is a placeholder image, not the actual DreamNet code!

### What Should Be Deployed

Based on the Dockerfile and codebase:

**✅ Included in Dockerfile:**
- ✅ Admin Dashboard (`apps/admin-dashboard/dist`) - Served at `/admin/*`
- ✅ Main Frontend (`client/dist`) - Served at `/*`
- ✅ Server Code (`server/`) - Express server with all routes
- ✅ All Packages (`packages/`) - All workspace packages

**✅ Routes Available (when properly deployed):**
- ✅ `/api/*` - All API endpoints (852 endpoints)
- ✅ `/admin/*` - Admin Dashboard
- ✅ `/*` - Main frontend (SPA)
- ✅ `/miniapps` - Mini Apps Hub
- ✅ `/mini-apps/*` - Base Mini Apps routes
- ✅ `/dream-cloud` - Dream Hub/Cloud
- ✅ `/dream-network-explorer` - Network explorer
- ✅ All vertical integrations (19 integrations initialized)

**✅ Mini Apps Available:**
- ✅ Passport Mint (`/mini-apps/passport-mint`)
- ✅ Governance (`/mini-apps/governance`)
- ✅ Dream Vault (`/mini-apps/vault`)
- ✅ Bounty Board (`/mini-apps/bounty`)
- ✅ Time Capsule (`/mini-apps/time-capsule`)
- ✅ Prediction Market (`/mini-apps/prediction-market`)
- ✅ DreamScope Ops (`/mini-apps/dreamscope-ops`)
- ✅ Onboarding Wizard (`/mini-apps/onboarding`)
- ✅ Creator Studio (`/mini-apps/creator-studio`)
- ✅ Plus 29 Base Mini Apps from `packages/base-mini-apps/`

**✅ Vertical Integrations (19 total):**
- ✅ Agent: LangChain, CrewAI, SuperAGI
- ✅ Social: Lens Protocol, Farcaster
- ✅ Media: Jellyfin, PeerTube
- ✅ Research: ResearchHub, DeSci
- ✅ Travel: OpenTripPlanner, Valhalla
- ✅ Security: Ghidra, Metasploit
- ✅ Governance: Aragon, Snapshot
- ✅ Music: MusicGen, MusicLM
- ✅ Chat: Matrix, Rocket.Chat

## The Problem

**Current State:** Service exists but uses placeholder image  
**What This Means:** The service is deployed but not running your actual code

## How to Fix

### Option 1: Deploy Using Cloud Build (Recommended)

```bash
# Set your project
export PROJECT_ID="your-project-id"
export REGION="us-east1"

# Deploy using cloudbuild.yaml
pnpm deploy:cloud-run
# OR
gcloud builds submit --config cloudbuild.yaml --project=${PROJECT_ID}
```

This will:
1. Build Docker image with all your code
2. Push to Artifact Registry
3. Deploy to Cloud Run
4. Replace placeholder with actual DreamNet code

### Option 2: Manual Deployment

```bash
# Build and push image
gcloud builds submit --tag us-east1-docker.pkg.dev/${PROJECT_ID}/dreamnet-repo/dreamnet:latest .
docker push us-east1-docker.pkg.dev/${PROJECT_ID}/dreamnet-repo/dreamnet:latest

# Deploy to Cloud Run
gcloud run deploy dreamnet \
  --image us-east1-docker.pkg.dev/${PROJECT_ID}/dreamnet-repo/dreamnet:latest \
  --region us-east1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300s \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production,INIT_SUBSYSTEMS=false,INIT_HEAVY_SUBSYSTEMS=false,MESH_AUTOSTART=false
```

## What Will Be Available After Proper Deployment

### Frontend Routes
- `https://dreamnet-qa6y4okh2a-ue.a.run.app/` - Main landing page
- `https://dreamnet-qa6y4okh2a-ue.a.run.app/admin` - Admin Dashboard
- `https://dreamnet-qa6y4okh2a-ue.a.run.app/miniapps` - Mini Apps Hub
- `https://dreamnet-qa6y4okh2a-ue.a.run.app/dream-cloud` - Dream Hub
- `https://dreamnet-qa6y4okh2a-ue.a.run.app/dream-network-explorer` - Network Explorer

### API Endpoints
- `https://dreamnet-qa6y4okh2a-ue.a.run.app/api/*` - All 852 API endpoints
- `https://dreamnet-qa6y4okh2a-ue.a.run.app/health` - Health check

### Mini Apps
All mini apps will be accessible via the Mini Apps Hub at `/miniapps` or directly:
- `/mini-apps/passport-mint`
- `/mini-apps/governance`
- `/mini-apps/vault`
- `/mini-apps/bounty`
- `/mini-apps/time-capsule`
- `/mini-apps/prediction-market`
- `/mini-apps/dreamscope-ops`
- `/mini-apps/onboarding`
- `/mini-apps/creator-studio`
- Plus 29 Base Mini Apps

### Vertical Integrations
All 19 vertical integrations will be initialized and available via API endpoints:
- `/api/google-cloud/*` - Google Cloud operations
- `/api/aws/*` - AWS operations
- Plus integration-specific endpoints

## Next Steps

1. **Deploy Actual Code:**
   ```bash
   pnpm deploy:cloud-run
   ```

2. **Verify Deployment:**
   ```bash
   # Check service URL
   curl https://dreamnet-qa6y4okh2a-ue.a.run.app/health
   
   # Check mini apps
   curl https://dreamnet-qa6y4okh2a-ue.a.run.app/api/whale/manifest
   ```

3. **Test Dream Hub:**
   - Visit: `https://dreamnet-qa6y4okh2a-ue.a.run.app/dream-cloud`
   - Should show Dream Hub interface

4. **Test Mini Apps:**
   - Visit: `https://dreamnet-qa6y4okh2a-ue.a.run.app/miniapps`
   - Should show Mini Apps Hub with all apps

---

**Status:** ⚠️ Service deployed but needs actual code deployment  
**Action Required:** Run `pnpm deploy:cloud-run` to deploy actual DreamNet code

