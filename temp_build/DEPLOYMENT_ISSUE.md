# Deployment Issue: ffi-napi Native Module

## Problem
Vercel build is failing because `ffi-napi` (a native Node.js module) cannot compile on Vercel's build environment. This module is being pulled in as a transitive dependency, likely from `vm2` or another server-side package.

## Root Cause
- The site app doesn't need `ffi-napi` - it's only needed for server-side packages
- Vercel installs all dependencies from root `package.json` for monorepo
- Native modules require compilation which fails on Vercel

## Solutions

### Option 1: Separate Site Package.json (Recommended)
Create a minimal `package.json` in `apps/site` that only includes site dependencies, excluding server-side packages.

### Option 2: Use Vercel Build Settings
Configure Vercel to only install site workspace dependencies.

### Option 3: Make Native Dependencies Optional
Mark problematic dependencies as optional in root `package.json`.

### Option 4: Use Vercel's Ignore Build Step
Configure to skip problematic dependencies during install.

## Immediate Fix Needed
The site build works locally because we're not installing all root dependencies. We need to configure Vercel similarly.

## Next Steps
1. Identify what's pulling in `ffi-napi` (likely `vm2`)
2. Either exclude it from site build or make it optional
3. Re-deploy

