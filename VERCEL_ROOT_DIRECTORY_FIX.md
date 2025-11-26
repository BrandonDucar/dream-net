# Vercel Root Directory Fix

## Problem
Vercel can't find the `client` directory because the Root Directory might be set incorrectly.

## Solution

### Option 1: Set Root Directory in Vercel Dashboard (RECOMMENDED)

1. Go to: https://vercel.com/[your-team]/dreamnet/settings/general
2. Scroll to **Root Directory**
3. Set to: **`.`** (just a dot, means repo root)
4. **OR** leave it **empty**
5. Save

### Option 2: Use pnpm Workspace Filtering

The updated `vercel.json` now uses pnpm workspace filtering, which works from the repo root:

**Install Command:**
```bash
corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate
```

**Build Command:**
```bash
corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate && pnpm --filter client... install --include=optional && pnpm --filter client run build
```

This way, pnpm handles finding the `client` workspace from the repo root.

---

## Updated Commands for Vercel Dashboard

If you need to set manually:

### Install Command:
```bash
corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate
```

### Build Command:
```bash
corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate && pnpm --filter client... install --include=optional && pnpm --filter client run build
```

### Output Directory:
```
client/dist
```

### Root Directory:
```
. 
```
(just a dot, or leave empty)

### Framework Preset:
```
Other
```

### Node.js Version:
```
24.x
```

---

## Why This Works

- `pnpm --filter client...` installs `client` and all its dependencies
- `pnpm --filter client run build` runs the build script in the `client` workspace
- Works from repo root, no need to `cd` into directories
- pnpm workspace system handles the path resolution

---

## Test It

After updating, trigger a new deployment and check the logs. You should see:
- ✅ `corepack enable pnpm`
- ✅ `pnpm --filter client... install`
- ✅ `pnpm --filter client run build`
- ✅ Build succeeds
