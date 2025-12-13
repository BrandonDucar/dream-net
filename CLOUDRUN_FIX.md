# 🚨 Cloud Run Deployment Fix

## Problem
Site deployed successfully but not serving anything. The minimal server doesn't serve static files.

## Root Cause
`server/index.minimal.ts` doesn't include:
1. Static file serving (`serveStatic()`)
2. SPA routing fallback
3. Client dist directory serving

## Solution

### Option 1: Update Minimal Server (Quick Fix)
Add static serving to `server/index.minimal.ts`:

```typescript
import { serveStatic } from "./vite";

// After middleware setup, before routes:
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
}
```

### Option 2: Use Full Server (Better)
Replace `server/index.ts` with the full server that has all the static serving logic.

## Quick Fix Steps

1. **Update server/index.minimal.ts** to include static serving
2. **Rebuild Docker image**
3. **Redeploy to Cloud Run**

## Check Current State

```bash
# Check if client/dist exists in container
gcloud run services describe dreamnet-api-minimal --region=us-central1

# Check logs
gcloud run services logs read dreamnet-api-minimal --region=us-central1 --limit=50
```

