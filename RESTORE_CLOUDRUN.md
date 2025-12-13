# 🚀 Restore Cloud Run Deployment

## Problem
Site deployed successfully but not serving client UI. The server needs to serve static files.

## ✅ Fix Applied
Updated `server/index.minimal.ts` to call `serveStatic()` in production mode.

## 🔧 Two Options to Fix

### Option 1: Use Updated Minimal Server (Recommended)
The minimal server now has static serving. If Dockerfile uses `server/index.ts`, we need to either:
- Change Dockerfile to use `server/index.minimal.ts`, OR
- Update `server/index.ts` to include static serving

### Option 2: Update Full Server
Make sure `server/index.ts` calls `serveStatic(app)` in production mode.

## 🚀 Quick Fix Steps

### Step 1: Check Current Dockerfile CMD
```bash
# Check what server file is being used
grep CMD Dockerfile
# Should show: server/index.ts or server/index.minimal.ts
```

### Step 2: Update Server File
If using `server/index.ts`, make sure it has:
```typescript
import { serveStatic } from "./vite";

// In production mode
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
}
```

### Step 3: Rebuild & Redeploy
```bash
# Option A: Cloud Build
gcloud builds submit --config cloudbuild.yaml

# Option B: Manual Docker
docker build -t gcr.io/YOUR_PROJECT/dreamnet-api:latest .
docker push gcr.io/YOUR_PROJECT/dreamnet-api:latest
gcloud run deploy dreamnet-api-minimal \
  --image gcr.io/YOUR_PROJECT/dreamnet-api:latest \
  --region us-central1
```

## ✅ Verification

After deployment:
1. **Health**: `curl https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app/health`
2. **API**: `curl https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app/api`
3. **Client UI**: Open `https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app/` in browser

Should see React app, not JSON.

## 🔍 Debugging

If still not working:
```bash
# Check logs
gcloud run services logs read dreamnet-api-minimal --region=us-central1 --limit=50

# Check if client/dist exists in container
# (Need to exec into container or check build logs)
```

## 📋 What serveStatic() Does

1. Serves `/admin/*` from `apps/admin-dashboard/dist`
2. Serves `/*` from `client/dist` 
3. SPA routing fallback to `index.html`
4. Skips `/api/*` routes (handled by Express routes)

## 🎯 Next Steps

1. Verify Dockerfile CMD points to correct server file
2. Ensure that file calls `serveStatic()` in production
3. Rebuild and redeploy
4. Test client UI loads

