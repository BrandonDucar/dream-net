# Vercel Network Error Fix

## Problem

`ERR_INVALID_THIS` and `ERR_PNPM_META_FETCH_FAIL` errors during `pnpm install` on Vercel.

## Root Cause

1. **Network/Registry Issues**: Temporary npm registry connectivity problems
2. **pnpm Version**: May need specific pnpm version
3. **Lockfile**: Should use `--frozen-lockfile` for consistent installs

## Fixes Applied

### 1. Updated vercel.json

Added `--frozen-lockfile` flag to ensure consistent installs:

```json
{
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "cd client && pnpm install --frozen-lockfile && pnpm build"
}
```

### 2. What This Does

- `--frozen-lockfile`: Uses exact versions from `pnpm-lock.yaml`
- Prevents version mismatches
- Faster installs (no resolution needed)
- More reliable on Vercel

## If Still Failing

### Option 1: Retry Deployment

Network errors are often temporary. Just **redeploy** - it might work on retry.

### Option 2: Use npm Instead (Fallback)

If pnpm keeps failing, temporarily switch to npm:

```json
{
  "installCommand": "npm ci",
  "buildCommand": "cd client && npm ci && npm run build"
}
```

### Option 3: Check pnpm-lock.yaml

Ensure `pnpm-lock.yaml` is committed to git:

```bash
git add pnpm-lock.yaml
git commit -m "Ensure lockfile is committed"
git push
```

### Option 4: Add .npmrc

Create `.npmrc` in repo root:

```
registry=https://registry.npmjs.org/
strict-peer-dependencies=false
```

## Next Steps

1. ✅ **Redeploy** - The `--frozen-lockfile` fix should help
2. ⏳ **Wait** - Network errors often resolve on retry
3. 🔍 **Monitor** - Check if errors persist

## Common Causes

- **Temporary npm registry issues** (most common)
- **Vercel build machine network problems**
- **pnpm version incompatibility**
- **Missing lockfile**

The `--frozen-lockfile` fix addresses most of these!

