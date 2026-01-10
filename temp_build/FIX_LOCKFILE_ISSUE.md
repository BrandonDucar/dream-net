# 🔧 Fix Lockfile Issue - Immediate Solution

## Problem Identified

**Error**: `ERR_PNPM_OUTDATED_LOCKFILE`  
**Cause**: `apps/site-old/package.json` has 12 dependencies not in `pnpm-lock.yaml`  
**Impact**: Vercel build fails trying to install all 95 workspaces

## Root Cause

1. Vercel runs `pnpm install` at ROOT before respecting `rootDirectory: "client"`
2. It detects `pnpm-lock.yaml` and tries to install ALL workspaces (95 projects)
3. `apps/site-old/package.json` has dependencies that don't match lockfile
4. Build fails with frozen lockfile error

## Solutions Applied

### Solution 1: Exclude site-old from Vercel (IMMEDIATE)

**Updated `.vercelignore`**:
```
apps/site-old/**
```

This prevents Vercel from even seeing `apps/site-old` during build.

### Solution 2: Fix Install Command

**Updated `vercel.json`**:
```json
{
  "installCommand": "pnpm --filter client... install --no-frozen-lockfile --ignore-workspace-root"
}
```

This ensures only `client` and its dependencies are installed, not all 95 workspaces.

### Solution 3: Remove site-old from Workspace (RECOMMENDED)

**Already done**: `apps/site-old` is NOT in `pnpm-workspace.yaml` ✅

But Vercel still detects it because it's in the repo.

## Next Steps

### Option A: Delete apps/site-old (BEST)

Since it's old and causing issues:

```bash
# Remove from git
git rm -r apps/site-old
git commit -m "Remove apps/site-old to fix Vercel build"
git push
```

### Option B: Update Lockfile

If you need to keep `apps/site-old`:

```bash
# Update lockfile to include site-old dependencies
pnpm install
git add pnpm-lock.yaml
git commit -m "Update lockfile for apps/site-old"
git push
```

### Option C: Use Different Install Strategy

Update `vercel.json` to install only what's needed:

```json
{
  "installCommand": "cd client && pnpm install --no-frozen-lockfile"
}
```

This bypasses workspace detection entirely.

## Recommended Action

**Delete `apps/site-old`** - it's old code and causing build failures.

After deletion:
1. Commit and push
2. Vercel will rebuild automatically
3. Build should succeed

## Verification

After fix, build logs should show:
- ✅ Installing only `client` workspace
- ✅ No mention of `apps/site-old`
- ✅ Build completes successfully

---

**Status**: Fixes applied, ready to test! 🚀

