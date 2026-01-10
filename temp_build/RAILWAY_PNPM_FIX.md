# Railway pnpm Installation Fix

## Issue

**Error:** `pnpm: command not found`

Railway's Metal Build Beta (Nixpacks) doesn't automatically install pnpm, even though Node.js 20 includes corepack.

## Solution

Updated `nixpacks.toml` to enable corepack and install pnpm before running install commands:

```toml
[phases.install]
cmds = [
  "corepack enable",
  "corepack prepare pnpm@10.21.0 --activate",
  "pnpm install --no-frozen-lockfile"
]
```

## How It Works

1. **`corepack enable`** - Enables corepack (comes with Node.js 20+)
2. **`corepack prepare pnpm@10.21.0 --activate`** - Installs and activates pnpm 10.21.0 (matches `packageManager` in package.json)
3. **`pnpm install --no-frozen-lockfile`** - Installs dependencies

## Why Corepack?

- Node.js 20+ includes corepack by default
- Corepack can install pnpm/yarn without npm
- Matches the `packageManager` field in `package.json`
- No need for global npm install

## Alternative Solutions

If corepack doesn't work, you can also:

1. **Install via npm:**
   ```bash
   npm install -g pnpm@10.21.0
   ```

2. **Use npx:**
   ```bash
   npx pnpm@10.21.0 install --no-frozen-lockfile
   ```

But corepack is the recommended approach for Node.js 20+.

