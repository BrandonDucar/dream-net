# 🚀 Cloud Run Deployment Fix - Restore Static Serving

## Problem
Site deployed but not serving client UI. Minimal server missing static file serving.

## ✅ Fix Applied
Updated `server/index.minimal.ts` to include:
- Static file serving via `serveStatic()`
- SPA routing fallback
- Production mode detection

## 🚀 Redeploy Steps

### Option 1: Quick Redeploy (if Dockerfile unchanged)
```bash
# Rebuild and redeploy
gcloud builds submit --config cloudbuild.yaml
```

### Option 2: Manual Docker Build & Deploy
```bash
# Build
docker build -t gcr.io/YOUR_PROJECT/dreamnet-api:latest .

# Push
docker push gcr.io/YOUR_PROJECT/dreamnet-api:latest

# Deploy
gcloud run deploy dreamnet-api-minimal \
  --image gcr.io/YOUR_PROJECT/dreamnet-api:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```

### Option 3: Use Cloud Build (Recommended)
```bash
# From repo root
gcloud builds submit --config cloudbuild.yaml \
  --substitutions _SERVICE_NAME=dreamnet-api-minimal
```

## ✅ Verification

After deployment, check:
1. **Health**: `https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app/health`
2. **API**: `https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app/api`
3. **Client UI**: `https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app/` (should serve React app)

## 📋 What Changed

**Before**: Minimal server only had `/health` and `/` endpoints
**After**: Minimal server now serves:
- `/health` - Health check
- `/api/*` - API routes
- `/*` - Client UI (SPA routing)

## 🔍 Debugging

If still not working:
```bash
# Check logs
gcloud run services logs read dreamnet-api-minimal --region=us-central1 --limit=100

# Check if client/dist exists
gcloud run services describe dreamnet-api-minimal --region=us-central1

# Test locally first
docker build -t test-image .
docker run -p 8080:8080 -e NODE_ENV=production test-image
curl http://localhost:8080/
```

