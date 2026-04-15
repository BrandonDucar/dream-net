# Railway Build Memory Fix
## Addressing Out-of-Memory Errors

**Issue**: Build failing after 21+ minutes with `FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`

**Memory Usage**: ~5.6GB before crash  
**Build Time**: 21+ minutes (too long)

---

## Fixes Applied

### 1. **Increased Memory Limit**
- Updated `NODE_OPTIONS` from `6144` to `8192` (8GB)
- Set in both `nixpacks.toml` variables and build commands

### 2. **More Aggressive Vite Chunking**
- Split React, Radix UI, Web3, Solana, TanStack Query, Forms, UI libraries into separate chunks
- Added `mini-apps` chunk for base-mini-apps package
- Reduced `chunkSizeWarningLimit` from 1000 to 500

### 3. **Build Optimization**
- Enabled Terser minification with console/debugger removal
- Set `NODE_ENV=production` for better optimizations

---

## Alternative Solutions

If memory issues persist, consider:

### Option A: Split Frontend/Backend Deployment
- **Frontend**: Deploy to Vercel/Cloudflare Pages (better for static sites)
- **Backend**: Deploy to Railway (better for APIs)
- **Pros**: Faster builds, better caching, lower memory usage
- **Cons**: Two deployments to manage

### Option B: Use Railway Build Cache
- Railway caches `node_modules` between builds
- Ensure `.railwayignore` excludes unnecessary files
- May reduce build time significantly

### Option C: Reduce Dependencies
- Audit large dependencies (Solana, Web3 libraries)
- Consider lazy loading for heavy libraries
- Remove unused packages

### Option D: Build Locally & Deploy Pre-built
- Build frontend locally
- Commit `client/dist/` to git
- Railway only builds backend
- **Pros**: No memory issues
- **Cons**: Need to commit build artifacts

---

## Current Configuration

### `nixpacks.toml`
```toml
[variables]
NODE_OPTIONS = "--max-old-space-size=8192"
NODE_ENV = "production"

[phases.build]
cmds = [
  "cd .. && NODE_OPTIONS='--max-old-space-size=8192' npx pnpm --filter client build",
  "cd server && npx pnpm build"
]
```

### `client/vite.config.ts`
- More aggressive chunking (7+ vendor chunks)
- Terser minification
- Smaller chunk size warnings

---

## Monitoring

Watch Railway build logs for:
- Memory usage (should stay under 8GB)
- Build time (should be < 10 minutes)
- Chunk sizes (should be < 500KB each)

---

## Next Steps

1. **Test Current Fix**: Push changes and monitor build
2. **If Still Failing**: Consider Option A (split deployment)
3. **If Successful**: Monitor build times and optimize further

---

**Status**: Applied fixes, ready to test! 🚀

