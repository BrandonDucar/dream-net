# 🚨 IMMEDIATE FIX - Stop Stuck Build

## Problem

1. **Build stuck** - Spinner wheel, logs not loading
2. **Lockfile error** - `apps/site-old/package.json` has dependencies not in lockfile
3. **Vercel installing 95 workspaces** - Should only install `client` workspace

## Root Cause

Vercel is **ignoring** `installCommand` in `vercel.json` and auto-detecting pnpm, then trying to install ALL 95 workspaces including `apps/site-old` which has outdated dependencies.

## Immediate Actions

### Step 1: Cancel Stuck Build

**Go to Vercel Dashboard**:
1. Open your project
2. Go to **Deployments** tab
3. Find the stuck build (spinner wheel)
4. Click **"..."** → **"Cancel Deployment"**

### Step 2: Delete apps/site-old (BEST FIX)

Since it's old code and causing lockfile issues:

```bash
# Remove the directory
git rm -r apps/site-old
git commit -m "Remove apps/site-old to fix Vercel lockfile error"
git push
```

This will trigger a new build that won't try to install site-old.

### Step 3: Alternative - Update Lockfile

If you need to keep `apps/site-old`:

```bash
# Update lockfile to include site-old dependencies
pnpm install
git add pnpm-lock.yaml
git commit -m "Update lockfile for apps/site-old dependencies"
git push
```

### Step 4: Force Fresh Build

After fixing:
1. Go to Vercel Dashboard → Deployments
2. Click **"Redeploy"** on latest
3. **UNCHECK "Use existing Build Cache"**
4. Redeploy

## Why This Happens

Vercel's build process:
1. Detects `pnpm-lock.yaml` at root
2. Auto-runs `pnpm install --frozen-lockfile` (ignoring your installCommand)
3. Tries to install ALL workspaces (95 projects)
4. Finds `apps/site-old` with mismatched dependencies
5. Fails with lockfile error

## Prevention

After fixing, ensure:
- ✅ `apps/site-old` is removed OR lockfile is updated
- ✅ `.vercelignore` excludes `apps/site-old/**`
- ✅ `vercel.json` has correct `installCommand`

## Quick Fix Command

```bash
# Remove site-old and push
git rm -r apps/site-old
git commit -m "Remove apps/site-old to fix Vercel build"
git push
```

This will automatically trigger a new build that should succeed! 🚀

