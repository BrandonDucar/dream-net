# 🛑 Stop Stuck Build & Fix Lockfile Issue

## Immediate Actions

### Step 1: Cancel Stuck Build

**Go to Vercel Dashboard**:
1. https://vercel.com/dashboard
2. Open your DreamNet project
3. Go to **Deployments** tab
4. Find the build with spinner wheel (stuck)
5. Click **"..."** (three dots) → **"Cancel Deployment"**

### Step 2: Fix Lockfile Issue

The error shows:
```
ERR_PNPM_OUTDATED_LOCKFILE
Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with apps/site-old/package.json
```

**Solution**: Update the lockfile to include `apps/site-old` dependencies:

```bash
# Update lockfile
pnpm install --no-frozen-lockfile

# Commit the updated lockfile
git add pnpm-lock.yaml
git commit -m "Update lockfile to include apps/site-old dependencies"
git push
```

### Step 3: Alternative - Remove site-old

If you don't need `apps/site-old`:

```bash
# Remove from filesystem (if it exists)
rm -rf apps/site-old

# Remove from git (if tracked)
git rm -r apps/site-old

# Commit
git commit -m "Remove apps/site-old to fix build"
git push
```

## Why Build is Stuck

Vercel is:
1. Detecting `pnpm-lock.yaml` at root
2. Auto-running `pnpm install --frozen-lockfile` (ignoring your installCommand)
3. Trying to install ALL 95 workspaces
4. Finding `apps/site-old` with mismatched dependencies
5. Failing and getting stuck

## Prevention After Fix

Updated `vercel.json` to use:
```json
{
  "installCommand": "pnpm --filter client... install --no-frozen-lockfile"
}
```

This should:
- Only install `client` workspace (not all 95)
- Use `--no-frozen-lockfile` to avoid lockfile errors
- Skip `apps/site-old` if it's not a dependency

## Quick Fix Commands

```bash
# Option 1: Update lockfile (if keeping site-old)
pnpm install --no-frozen-lockfile
git add pnpm-lock.yaml vercel.json .vercelignore
git commit -m "Fix Vercel build: update lockfile and install command"
git push

# Option 2: Remove site-old (if not needed)
rm -rf apps/site-old
git add vercel.json .vercelignore
git commit -m "Fix Vercel build: remove apps/site-old"
git push
```

After push, Vercel will automatically trigger a new build that should succeed! 🚀

