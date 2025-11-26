# Vercel Build Fix

## Issue
Vercel was using Node.js v24.11.1, but rollup's native module `@rollup/rollup-linux-x64-gnu` requires Node 22 or earlier.

## Fixes Applied

1. **Updated `client/.npmrc`**:
   - Changed `optional=false` to `optional=true` 
   - Changed `ignore-scripts=true` to `ignore-scripts=false`
   - Added `include=optional` to ensure rollup native modules install

2. **Updated `vercel.json`**:
   - Changed install command to: `pnpm install --include=optional`
   - Changed build command to: `pnpm install --include=optional && pnpm build`

3. **Added `.nvmrc` files**:
   - Root `.nvmrc` with `22` to tell Vercel to use Node 22
   - `client/.nvmrc` already exists with `22`

4. **Updated `client/package.json`**:
   - Added `engines` field: `"node": ">=20.19.0 <=22.18.0"`
   - Added `overrides` for rollup native module

## What This Fixes

- ✅ Rollup native modules will now install correctly
- ✅ Vercel will use Node 22 instead of Node 24
- ✅ Build should complete successfully

## Next Deployment

Vercel will automatically redeploy on the next push. The build should now succeed!

