# 🚀 Antigravity: Cloud Run Fix - Restore Client UI

## Problem
Site deployed but not serving client UI. The `serveStatic()` call is async and might be failing silently.

## Root Cause
In `server/index.ts` line 2370-2384, `serveStatic()` is called in an async IIFE that:
1. Runs AFTER server starts
2. Might fail silently
3. Checks `app.get("env")` which might not be set correctly

## ✅ Quick Fix

### Option 1: Make serveStatic() Synchronous (Recommended)
Move `serveStatic()` call BEFORE server.listen():

```typescript
// In server/index.ts, BEFORE server.listen()

// Setup static serving BEFORE server starts
if (process.env.NODE_ENV === 'production') {
  try {
    const { serveStatic } = await import("./vite");
    serveStatic(app);
    console.log("✅ [Vite] Static file serving configured");
  } catch (error: any) {
    console.error("[Vite] Failed to load vite module:", error.message);
  }
}

// Then start server
server.listen(PORT, () => {
  // ...
});
```

### Option 2: Check Current Logs
```bash
# Check if serveStatic is being called
gcloud run services logs read dreamnet-api-minimal --region=us-central1 --limit=100 | grep -i "vite\|static"

# Look for:
# - "Serving static files from..."
# - "Failed to load vite module..."
# - "Static file serving configured"
```

### Option 3: Verify Client Build
```bash
# Check if client/dist exists in build
# Look at Cloud Build logs for:
# "Client build had warnings but continuing..."
# "ls -la /app/client/dist"
```

## 🚀 Immediate Action

1. **Check logs** to see if serveStatic is being called
2. **Verify client/dist exists** in Docker image
3. **Fix serveStatic call** to be synchronous
4. **Redeploy**

## 📋 Verification Checklist

After fix:
- [ ] Logs show "Serving static files from /app/client/dist"
- [ ] Root `/` serves HTML (not JSON)
- [ ] `/api` routes still work
- [ ] Client UI loads in browser

## 🔧 Most Likely Issues

1. **serveStatic() not being called** - Check logs
2. **client/dist missing** - Check Docker build logs
3. **Port mismatch** - Cloud Run uses PORT env var

## 🎯 Next Steps

1. Check Cloud Run logs first
2. If serveStatic not called → Fix async issue
3. If client/dist missing → Fix Dockerfile build
4. Redeploy and test

