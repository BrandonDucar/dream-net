# 🚀 DreamNet Google Cloud Run Deployment Notes

**Version:** 1.0.0  
**Date:** 2025-01-27  
**Status:** Deployment Implementation Guide  
**Purpose:** Document the Cloud Run deployment path for DreamNet as a single, externally reachable web entrypoint.

---

## 📋 Current State Audit

### What Currently Exists

1. **Dockerfile** (`server/Dockerfile`)
   - Uses Node 20-slim
   - Installs pnpm
   - Copies monorepo structure
   - Runs `pnpm start:dev` (tsx)
   - Exposes port 8080
   - Sets PORT=8080
   - **Issue**: Doesn't build frontend assets

2. **cloudbuild.yaml** (root)
   - Multi-step build process
   - Builds frontend and backend separately
   - Builds Docker image
   - Pushes to GCR
   - **Issue**: Does NOT deploy to Cloud Run

3. **GKE Deployment Scripts**
   - `infrastructure/google/gke/deploy.ts` - GKE deployment script
   - Kubernetes manifests in `infrastructure/google/gke/*.yaml`
   - Configured for GKE Autopilot

4. **Server Configuration**
   - Express server on port 3000 (default) or PORT env var (defaults to 8080)
   - Binds to `0.0.0.0` (required for Cloud Run)
   - Vite integration for dev mode
   - Static file serving capability via `serveStatic()` function
   - Health check endpoint at `/health`

### What Is Broken

1. **Cloud Run Startup Timeout**
   - Issue: Container builds successfully but fails to start within Cloud Run timeout
   - Root Cause: Heavy subsystem initialization (`INIT_HEAVY_SUBSYSTEMS`) blocks startup
   - Neural Mesh initialization may be blocking
   - Solution: Disable heavy subsystems by default via env vars

2. **Frontend Not Built in Dockerfile**
   - Current: Dockerfile doesn't build Admin Dashboard or main frontend
   - Issue: Only backend is containerized, frontend assets missing
   - Solution: Build frontend assets during Docker build, serve via Express

3. **No Cloud Run Deployment**
   - Current: cloudbuild.yaml builds image but doesn't deploy
   - Issue: Manual deployment required
   - Solution: Add Cloud Run deployment step to cloudbuild.yaml

4. **.dockerignore Excludes Apps**
   - Current: `.dockerignore` excludes `apps/` directory
   - Issue: Admin Dashboard source not available for build
   - Solution: Update `.dockerignore` to allow `apps/admin-dashboard`

### What We're About to Change

1. **Single-Service Deployment Model**
   - One Docker image containing:
     - Built backend (server code, can use tsx)
     - Built Admin Dashboard (apps/admin-dashboard/dist)
     - Built main frontend (client/dist) - optional
   - Express server serves:
     - API routes at `/api/*`
     - Admin Dashboard at `/admin/*`
     - Main frontend at `/*` (if built)

2. **Optimized Dockerfile**
   - Multi-stage build for smaller image
   - Build all frontend assets during image build (not at runtime)
   - Use production dependencies only in runtime stage
   - Ensure server binds to 0.0.0.0:$PORT

3. **Cloud Run Deployment**
   - Add deployment step to cloudbuild.yaml
   - Create GitHub Actions workflow as alternative
   - Configure Cloud Run settings (CPU, memory, timeout, concurrency)

4. **Environment Variables**
   - Document required env vars
   - Set defaults for Cloud Run (disable heavy subsystems)
   - Use Secret Manager for sensitive values

---

## 🏗️ Single-Service Deployment Model

### Architecture

```
┌─────────────────────────────────────────┐
│         Cloud Run Container             │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   Express Server (Port $PORT)     │ │
│  │                                    │ │
│  │  • /api/* → API Routes            │ │
│  │  • /admin/* → Admin Dashboard     │ │
│  │  • /* → Main Frontend (if built)  │ │
│  │  • /health → Health Check        │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   Static Assets                   │ │
│  │  • client/dist/                   │ │
│  │  • apps/admin-dashboard/dist/     │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Container Behavior

1. **Build Time** (Docker build):
   - Install all dependencies
   - Build Admin Dashboard: `pnpm --filter @dreamnet/admin-dashboard build`
   - Build main frontend: `pnpm --filter client build` (optional)
   - Build backend: `pnpm --filter server build` (optional, can use tsx)

2. **Runtime** (Container start):
   - Start Express server
   - Bind to `0.0.0.0:$PORT` (Cloud Run requirement)
   - Serve static files from built frontend directories
   - Initialize lightweight subsystems only (disable heavy by default)

### Start Script

The container runs:
```bash
cd server && pnpm start:dev
```

Which executes:
```bash
tsx index.ts
```

The server:
- Reads PORT from environment (defaults to 8080)
- Binds to `0.0.0.0:$PORT`
- Serves static files via `serveStatic()` function
- Initializes subsystems based on env vars

---

## 🐳 Dockerfile Implementation

### Location
- **Primary**: `Dockerfile` (root of monorepo)
- **Strategy**: Multi-stage build

### Stage 1: Builder
- Install all dependencies (including dev)
- Build Admin Dashboard
- Build main frontend (optional)
- Build backend (optional)

### Stage 2: Runtime
- Copy built assets
- Copy server code
- Install production dependencies (but keep tsx for TypeScript execution)
- Set up runtime environment

### Key Features

- ✅ Multi-stage build for smaller final image
- ✅ Builds Admin Dashboard during image build
- ✅ Builds main frontend during image build (optional)
- ✅ No build steps at container startup
- ✅ Server binds to `0.0.0.0:$PORT`
- ✅ Health check endpoint available
- ✅ Minimal image size

---

## ☁️ Cloud Run Configuration

### Required Settings

- **Platform**: Managed
- **Port**: 8080 (or PORT env var)
- **CPU**: 1-2 vCPU (start with 1)
- **Memory**: 512Mi-1Gi (start with 512Mi)
- **Max Instances**: 10 (adjust based on traffic)
- **Min Instances**: 0 (for cost savings)
- **Timeout**: 300s (5 minutes) - increased for startup
- **Concurrency**: 80 (Cloud Run default)
- **Startup Timeout**: 300s (5 minutes)

### Environment Variables

**Required:**
- `PORT=8080` (set by Cloud Run automatically, but we default to it)
- `NODE_ENV=production`

**Recommended (with defaults):**
- `INIT_SUBSYSTEMS=false` (disable heavy subsystems)
- `INIT_HEAVY_SUBSYSTEMS=false` (disable very heavy subsystems)
- `MESH_AUTOSTART=false` (disable mesh auto-start)

**Optional:**
- `DATABASE_URL` - PostgreSQL connection string (Cloud SQL recommended)
- `GCP_PROJECT_ID` - GCP project ID
- `GCP_REGION` - Deployment region
- `ALLOWED_ORIGINS` - CORS origins (comma-separated)
- `OPENAI_API_KEY` - OpenAI API key (if using AI features)

**Secrets (use Secret Manager):**
- `DATABASE_URL` - Store as secret
- `OPENAI_API_KEY` - Store as secret
- `JWT_SECRET` - Store as secret
- Any other sensitive credentials

---

## 📝 Deployment Commands

### Manual Deployment (gcloud CLI)

#### 1. Set Variables

```bash
export PROJECT_ID="your-project-id"
export REGION="us-central1"
export SERVICE_NAME="dreamnet"
export ARTIFACT_REGISTRY_REPO="dreamnet-repo"
export IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/dreamnet"
```

#### 2. Build and Push Image

```bash
# Build and push using Cloud Build
gcloud builds submit --tag ${IMAGE_NAME}:latest --project=${PROJECT_ID} .

# Or build locally and push
docker build -t ${IMAGE_NAME}:latest -f Dockerfile .
docker push ${IMAGE_NAME}:latest
```

#### 3. Deploy to Cloud Run (Initial)

```bash
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --platform managed \
  --region ${REGION} \
  --project ${PROJECT_ID} \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300s \
  --max-instances 10 \
  --min-instances 0 \
  --set-env-vars NODE_ENV=production,INIT_SUBSYSTEMS=false,INIT_HEAVY_SUBSYSTEMS=false,MESH_AUTOSTART=false
```

#### 4. Deploy to Cloud Run (Update)

```bash
# Simple update - just push new image and deploy
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --platform managed \
  --region ${REGION} \
  --project ${PROJECT_ID}
```

#### 5. Using Cloud Build (Recommended)

```bash
# Deploy using cloudbuild.yaml (builds and deploys in one command)
gcloud builds submit --config cloudbuild.yaml --project=${PROJECT_ID}
```

### Using GitHub Actions

1. Set up secrets in GitHub:
   - `GCP_PROJECT_ID` - Your GCP project ID
   - `GCP_SA_KEY` - Service account key JSON

2. Push to main branch or trigger workflow manually

3. Workflow will:
   - Build Docker image
   - Push to Artifact Registry
   - Deploy to Cloud Run

---

## 🔧 Required GCP Setup

### Prerequisites

1. **GCP Project**
   ```bash
   gcloud projects create ${PROJECT_ID}
   gcloud config set project ${PROJECT_ID}
   ```

2. **Enable Billing**
   - Enable billing in GCP Console

3. **Enable Required APIs**
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable artifactregistry.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   gcloud services enable secretmanager.googleapis.com
   ```

4. **Create Artifact Registry Repository**
   ```bash
   gcloud artifacts repositories create ${ARTIFACT_REGISTRY_REPO} \
     --repository-format=docker \
     --location=${REGION} \
     --project=${PROJECT_ID}
   ```

5. **Create Service Account (for CI/CD)**
   ```bash
   # Create service account
   gcloud iam service-accounts create dreamnet-deployer \
     --display-name="DreamNet Deployer" \
     --project=${PROJECT_ID}

   # Grant necessary roles
   gcloud projects add-iam-policy-binding ${PROJECT_ID} \
     --member="serviceAccount:dreamnet-deployer@${PROJECT_ID}.iam.gserviceaccount.com" \
     --role="roles/run.admin"

   gcloud projects add-iam-policy-binding ${PROJECT_ID} \
     --member="serviceAccount:dreamnet-deployer@${PROJECT_ID}.iam.gserviceaccount.com" \
     --role="roles/artifactregistry.writer"

   gcloud projects add-iam-policy-binding ${PROJECT_ID} \
     --member="serviceAccount:dreamnet-deployer@${PROJECT_ID}.iam.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"

   # Create and download key
   gcloud iam service-accounts keys create key.json \
     --iam-account=dreamnet-deployer@${PROJECT_ID}.iam.gserviceaccount.com
   ```

6. **Create Secrets (if using Secret Manager)**
   ```bash
   # Database URL
   echo -n "postgresql://user:pass@host/db" | \
     gcloud secrets create database-url --data-file=- --project=${PROJECT_ID}

   # OpenAI API Key
   echo -n "sk-..." | \
     gcloud secrets create openai-key --data-file=- --project=${PROJECT_ID}

   # JWT Secret
   echo -n "your-jwt-secret" | \
     gcloud secrets create jwt-secret --data-file=- --project=${PROJECT_ID}
   ```

7. **Grant Cloud Run Access to Secrets**
   ```bash
   gcloud secrets add-iam-policy-binding database-url \
     --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
     --role="roles/secretmanager.secretAccessor" \
     --project=${PROJECT_ID}
   ```

---

## 🧪 Local Testing

### Build Docker Image Locally

```bash
docker build -t dreamnet-local -f Dockerfile .
```

### Run Container Locally

```bash
docker run -p 8080:8080 \
  -e PORT=8080 \
  -e NODE_ENV=production \
  -e INIT_SUBSYSTEMS=false \
  -e INIT_HEAVY_SUBSYSTEMS=false \
  -e MESH_AUTOSTART=false \
  dreamnet-local
```

### Test Endpoints

Once container is running:

- **Health Check**: `http://localhost:8080/health`
  - Expected: `{"ok": true, ...}`

- **API**: `http://localhost:8080/api/admin/overview`
  - Expected: Overview snapshot JSON

- **Admin Dashboard**: `http://localhost:8080/admin/overview`
  - Expected: Admin Dashboard HTML

- **Main Frontend**: `http://localhost:8080/`
  - Expected: Main frontend HTML (if built)

### Using pnpm Script

```bash
# Build and run locally
pnpm deploy:cloud-run:local
```

---

## 📊 Expected Behavior

### Startup Sequence

1. Container starts
2. Express server initializes
3. Lightweight subsystems load (if INIT_SUBSYSTEMS=true)
4. Server binds to 0.0.0.0:$PORT
5. Health check endpoint responds
6. Cloud Run marks service as ready

### Health Check

- Endpoint: `/health`
- Expected: 200 OK with `{"ok": true, ...}`
- Cloud Run uses this to determine readiness
- Must respond within startup timeout

### Static File Serving

- **Admin Dashboard**: Served from `apps/admin-dashboard/dist` at `/admin/*`
- **Main Frontend**: Served from `client/dist` at `/*` (if built)
- **API Routes**: Served from Express routes at `/api/*`

### Routing Priority

1. `/api/*` → API routes (highest priority)
2. `/admin/*` → Admin Dashboard
3. `/*` → Main frontend (lowest priority, SPA fallback)

---

## 🚨 Troubleshooting

### Startup Timeout

**Symptom**: Container fails to start within Cloud Run timeout

**Solutions**:
1. Increase `--timeout` to 300s or more
2. Set `INIT_SUBSYSTEMS=false` and `INIT_HEAVY_SUBSYSTEMS=false`
3. Check logs: `gcloud run services logs read ${SERVICE_NAME} --region=${REGION}`
4. Verify health check endpoint responds quickly

### Port Binding Issues

**Symptom**: Service doesn't respond

**Solutions**:
1. Verify server binds to `0.0.0.0` not `127.0.0.1` (already fixed in server/index.ts)
2. Check PORT env var is set correctly (Cloud Run sets it automatically)
3. Verify EXPOSE directive in Dockerfile matches PORT

### Build Failures

**Symptom**: Docker build fails

**Solutions**:
1. Check .dockerignore excludes unnecessary files but includes needed ones
2. Verify pnpm-lock.yaml is up to date: `pnpm install`
3. Check native dependencies (blake3, sharp) build correctly
4. Verify all workspace packages are included

### Frontend Not Loading

**Symptom**: Admin Dashboard or main frontend returns 404

**Solutions**:
1. Verify frontend was built during Docker build (check build logs)
2. Check static file paths in `server/vite.ts`
3. Verify Express static middleware is configured correctly
4. Check file permissions in container

### API Routes Not Working

**Symptom**: API endpoints return 404

**Solutions**:
1. Verify API routes are registered before static file middleware
2. Check route paths match expected patterns
3. Verify Express app is configured correctly
4. Check CORS settings if accessing from browser

---

## 📚 Files Created/Updated

### New Files

1. **`Dockerfile`** (root)
   - Multi-stage build
   - Builds Admin Dashboard and frontend
   - Optimized for Cloud Run

2. **`cloudbuild.yaml`** (updated)
   - Added Cloud Run deployment step
   - Configurable via substitution variables

3. **`.github/workflows/deploy-cloud-run.yml`**
   - GitHub Actions workflow
   - Automated deployment on push

4. **`DEPLOYMENT_NOTES_GOOGLE.md`** (this file)
   - Complete deployment documentation

### Updated Files

1. **`.dockerignore`**
   - Updated to allow `apps/admin-dashboard`
   - Still excludes other apps

2. **`server/vite.ts`**
   - Updated `serveStatic()` to serve Admin Dashboard at `/admin/*`
   - Maintains backward compatibility with main frontend

3. **`package.json`** (root)
   - Added `deploy:cloud-run` script
   - Added `deploy:cloud-run:local` script for testing

---

## 🎯 Next Steps

1. **Test Locally**
   ```bash
   pnpm deploy:cloud-run:local
   ```
   Verify all endpoints work

2. **Set Up GCP**
   - Create project
   - Enable APIs
   - Create Artifact Registry
   - Create service account

3. **Initial Deployment**
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```

4. **Verify Deployment**
   - Check service URL
   - Test health endpoint
   - Test API endpoints
   - Test Admin Dashboard

5. **Monitor and Tune**
   - Check Cloud Run metrics
   - Adjust CPU/memory if needed
   - Monitor startup time
   - Optimize as needed

---

**End of Deployment Notes**

*This document will be updated as the deployment implementation progresses.*
