# 🔧 Final Build Fix - Stop Stuck Build

## Problem

1. **Build stuck** with spinner wheel
2. **Lockfile error**: `apps/site-old/package.json` has dependencies not in lockfile
3. **Vercel installing 95 workspaces** instead of just `client`

## Root Cause

Vercel auto-detects `pnpm-lock.yaml` and runs `pnpm install --frozen-lockfile` at ROOT, trying to install ALL workspaces including `apps/site-old` which has outdated dependencies.

## Immediate Fix

### Step 1: Cancel Stuck Build ⚠️ CRITICAL

**Go to Vercel Dashboard**:
1. https://vercel.com/dashboard
2. Your project → **Deployments** tab
3. Find stuck build (spinner) → Click **"..."** → **"Cancel Deployment"**

### Step 2: Update Lockfile

The lockfile needs to include `apps/site-old` dependencies:

```bash
# Update lockfile (this will take a few minutes - installing 95 workspaces)
pnpm install --no-frozen-lockfile

# Commit updated lockfile
git add pnpm-lock.yaml vercel.json .vercelignore
git commit -m "Fix Vercel build: update lockfile for apps/site-old"
git push
```

### Step 3: Verify vercel.json

Current `vercel.json`:
```json
{
  "rootDirectory": "client",
  "installCommand": "pnpm --filter client... install --no-frozen-lockfile",
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist"
}
```

This should:
- Only install `client` workspace (not all 95)
- Use `--no-frozen-lockfile` to avoid errors
- Build from `client/` directory

## Why This Works

After updating lockfile:
- ✅ Lockfile matches all workspace `package.json` files
- ✅ Vercel can install without lockfile errors
- ✅ `installCommand` limits installation to `client` workspace only
- ✅ Build completes successfully

## Alternative: Remove site-old

If you don't need `apps/site-old`:

```bash
# Remove directory
rm -rf apps/site-old

# Commit
git add .
git commit -m "Remove apps/site-old to fix build"
git push
```

## Expected Result

After fix:
- ✅ Build completes in 2-3 minutes (not stuck)
- ✅ Only installing `client` workspace (~20 packages, not 95)
- ✅ No lockfile errors
- ✅ `dreamnet.ink` serves mini app hub

---

**Action Required**: 
1. Cancel stuck build in Vercel Dashboard
2. Run `pnpm install --no-frozen-lockfile` locally
3. Commit and push updated `pnpm-lock.yaml`
4. New build will trigger automatically

🚀 Ready to fix!

