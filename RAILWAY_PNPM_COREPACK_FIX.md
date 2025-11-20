# Railway pnpm Corepack Signature Fix

## Issue

**Error:** `Cannot find matching keyid` when using `corepack prepare pnpm@10.21.0 --activate`

Corepack signature verification is failing in Railway's Metal Build Beta environment. This is a known issue with corepack in some CI environments.

## Solution

Switched from corepack to npm for installing pnpm:

**Before (failing):**
```toml
[phases.install]
cmds = [
  "corepack enable",
  "corepack prepare pnpm@10.21.0 --activate",
  "pnpm install --no-frozen-lockfile"
]
```

**After (working):**
```toml
[phases.install]
cmds = [
  "npm install -g pnpm@10.21.0",
  "pnpm install --no-frozen-lockfile"
]
```

## Why npm Instead of Corepack?

1. **More reliable** - npm is always available in Node.js installations
2. **No signature issues** - npm doesn't have the same signature verification problems
3. **CI-friendly** - Works consistently across all CI/build environments
4. **Same result** - Still installs pnpm@10.21.0 as specified in package.json

## Alternative Solutions

If npm doesn't work, you can also:

1. **Use npx (no global install):**
   ```bash
   npx pnpm@10.21.0 install --no-frozen-lockfile
   ```

2. **Use curl script (pnpm's official installer):**
   ```bash
   curl -fsSL https://get.pnpm.io/install.sh | sh -
   ```

But `npm install -g` is the simplest and most reliable for Railway builds.

