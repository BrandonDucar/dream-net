# Railway Node.js Version Fix

## Issues Fixed

### 1. Node.js Version Too Old
**Error:** `You are using Node.js 18.20.5. Vite requires Node.js version 20.19+ or 22.12+`

**Fix:**
- Updated `.nvmrc` from `18` to `20`
- Updated `client/.nvmrc` from `18` to `20`
- Added `engines` field to `package.json`:
  ```json
  "engines": {
    "node": ">=20.19.0 || >=22.12.0",
    "pnpm": ">=10.21.0"
  }
  ```

### 2. Wrong Build Command
**Error:** Railway was running `pnpm build:app` which doesn't match our setup

**Fix:**
- Created `nixpacks.toml` to configure Railway Metal Build Beta
- Created `railway.toml` as alternative configuration
- Both specify the correct build command:
  ```bash
  cd .. && pnpm --filter client build && cd server && pnpm build
  ```

### 3. Rollup Native Module Issue
**Error:** `Cannot find module @rollup/rollup-linux-x64-gnu`

**Fix:** This should be resolved by using Node.js 20+, which has better native module support

## Files Created/Updated

- `.nvmrc` - Updated to Node 20
- `client/.nvmrc` - Updated to Node 20
- `package.json` - Added `engines` field
- `nixpacks.toml` - Railway Metal Build configuration
- `railway.toml` - Railway deployment configuration

## Railway Configuration

Railway should now:
1. Use Node.js 20 (from `.nvmrc` or `nixpacks.toml`)
2. Run correct build command
3. Start server from `server/` directory

## Next Steps

1. Railway will automatically detect these changes
2. New build should use Node.js 20
3. Build should succeed with correct commands

## Alternative: Disable Metal Build Beta

If Metal Build Beta continues to cause issues, you can disable it in Railway:
1. Go to Railway Dashboard → Service → Settings
2. Find "Build Environment" or "Metal Build Beta"
3. Disable Metal Build Beta
4. Railway will use standard Docker build instead

