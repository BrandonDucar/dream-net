# 🔧 Fix: Old Site Being Served

## Problem

Build succeeds but `dreamnet.ink` is serving the old site instead of the mini app hub.

## Root Cause

**Wrong deployment is promoted to production** - Vercel is serving an old deployment that has the old site code.

## Immediate Fix

### Option 1: Promote Latest Deployment (AUTOMATIC)

Run this script to automatically promote the latest deployment:

```bash
# Set your Vercel token first
export VERCEL_TOKEN=your_token_here

# Or get it from: https://vercel.com/account/tokens

# Run the promotion script
pnpm exec tsx scripts/promote-latest-deployment.ts
```

### Option 2: Manual Fix (FASTEST)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Open your DreamNet project**
3. **Go to Deployments tab**
4. **Find the LATEST deployment** (should be recent, with your latest commit)
5. **Click "..."** (three dots) on that deployment
6. **Click "Promote to Production"**
7. **Wait 1-2 minutes** for DNS propagation
8. **Test**: Open `https://dreamnet.ink` in incognito window

### Option 3: Force Fresh Deploy

If promotion doesn't work:

1. **Go to Deployments tab**
2. **Click "Redeploy"** on latest deployment
3. **UNCHECK "Use existing Build Cache"**
4. **Click "Redeploy"**
5. **Wait for build to complete**
6. **Promote to Production** (it should auto-promote)

## Verify Fix

After promoting, check:

1. **Open `https://dreamnet.ink`** in incognito window
2. **Should see**: Mini app hub (DreamNetHubWrapper with all mini apps)
3. **Should NOT see**: Old site/homepage

## Why This Happens

- Latest build succeeded ✅
- But old deployment is still marked as "Production" ❌
- Vercel serves whatever deployment has "Production" badge
- Need to explicitly promote latest deployment

## Prevention

After fixing, Vercel should auto-promote future deployments, but if it doesn't:
- Always check which deployment has "Production" badge
- Promote latest deployment manually if needed

---

**Do this now and the site should update!** 🚀

