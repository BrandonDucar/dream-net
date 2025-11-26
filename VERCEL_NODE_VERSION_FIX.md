# Vercel Node Version Fix

## Issue
Vercel is using Node.js v24.11.1, but rollup requires Node 22. The `.nvmrc` file isn't being respected.

## Solution Options

### Option 1: Set Node Version in Vercel Dashboard (Recommended)
1. Go to your Vercel project settings
2. Navigate to: Settings → General → Node.js Version
3. Select: **22.x**
4. Save and redeploy

### Option 2: Use Environment Variable
Add to Vercel project environment variables:
```
NODE_VERSION=22
```

### Option 3: Use Build Script
We've already:
- Added `@rollup/rollup-linux-x64-gnu` to devDependencies
- Changed minify to esbuild (doesn't need rollup native)
- Updated install command to include optional dependencies

## Current Status
- ✅ Rollup native module added to package.json
- ✅ Minify changed to esbuild
- ✅ Install command updated
- ⚠️ Still need to set Node version in Vercel dashboard

## Next Step
**Go to Vercel dashboard and set Node.js version to 22.x manually.**

