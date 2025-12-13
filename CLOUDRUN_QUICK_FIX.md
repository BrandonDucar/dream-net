# 🚀 Cloud Run Quick Fix - Restore Client UI

## ✅ Good News
The full `server/index.ts` already has `serveStatic()` configured (line 2377).

## 🔍 Likely Issues

### Issue 1: Client Dist Not Built/Copied
The Dockerfile builds client, but maybe it's not being copied correctly.

**Check**: Look at Dockerfile lines 73-76
```dockerfile
RUN mkdir -p ./client/dist
COPY --from=builder /app/client/dist ./client/dist
```

### Issue 2: serveStatic() Not Being Called
Check if the condition is met in `server/index.ts` around line 2375.

### Issue 3: Port Mismatch
Cloud Run uses PORT env var (8080), but server might be listening on wrong port.

## 🚀 Quick Fix Commands

### Option 1: Force Redeploy (Easiest)
```bash
# Just redeploy existing image
gcloud run deploy dreamnet-api-minimal \
  --image gcr.io/YOUR_PROJECT/dreamnet-api:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars NODE_ENV=production
```

### Option 2: Rebuild with Debug
```bash
# Build with verbose logging
gcloud builds submit --config cloudbuild.yaml --verbosity=debug

# Check build logs for client/dist
```

### Option 3: Check Current Deployment
```bash
# Get service details
gcloud run services describe dreamnet-api-minimal --region=us-central1

# Check logs
gcloud run services logs read dreamnet-api-minimal --region=us-central1 --limit=100

# Look for:
# - "Serving static files from..."
# - "Warning: Static directory not found..."
```

## 🔧 Manual Verification

### Test Locally First
```bash
# Build client
cd client && pnpm build

# Check dist exists
ls -la client/dist/

# Run server locally in production mode
cd server
NODE_ENV=production PORT=8080 pnpm dev

# Test
curl http://localhost:8080/
# Should return HTML, not JSON
```

## 📋 What Should Happen

When server starts in production:
1. Should see log: `"Serving static files from /app/client/dist"`
2. Root `/` should serve `client/dist/index.html`
3. `/api/*` routes should still work

## 🎯 Most Likely Fix

**The client/dist might not be in the Docker image.** Check build logs to confirm client build succeeded.

If client build failed, fix that first, then redeploy.

