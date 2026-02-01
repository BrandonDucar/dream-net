# 🔧 Build Fixes Applied

## Issues Fixed

1. **Missing `@tanstack/query-core` dependency**
   - Added to both root `package.json` and `client/package.json`
   - Aligned versions (5.90.10) across both

2. **Dependency resolution in Docker build**
   - Updated `.npmrc` to hoist `@tanstack` packages to root
   - Simplified Dockerfile to rely on hoisted dependencies
   - Removed redundant client dependency install step

3. **Vite build configuration**
   - Added `optimizeDeps` to explicitly include `@tanstack` packages
   - Updated rollup options for better dependency resolution

## Next Steps

1. Run `pnpm install` to update lockfile with new dependencies
2. Run `pnpm deploy:now` to deploy

## Files Changed

- `package.json` - Added `@tanstack/query-core`, aligned versions
- `client/package.json` - Added `@tanstack/query-core`
- `Dockerfile` - Simplified client build step
- `.npmrc` - Added hoisting configuration
- `vite.config.ts` - Added optimizeDeps configuration

