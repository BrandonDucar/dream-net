# Deployment Checklist

## Pre-Deployment

### ✅ Build Status
- [x] TypeScript compiles without errors
- [x] Vite build succeeds
- [x] All packages build correctly

### Environment Variables Needed
- `VITE_API_URL` - API base URL (defaults to empty string, uses relative paths)
- API should be accessible at configured URL

### Vercel Configuration
- ✅ `vercel.json` configured
- ✅ Build command: `pnpm --filter @dreamnet/site build`
- ✅ Output directory: `apps/site/dist`
- ✅ API rewrites configured to `https://api.dreamnet.ink`

## Deployment Steps

1. **Link Vercel Project** (if not already)
   ```bash
   vercel link
   ```

2. **Set Environment Variables** (if needed)
   ```bash
   vercel env add VITE_API_URL
   ```

3. **Deploy to Preview**
   ```bash
   vercel
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Post-Deployment

- [ ] Test all routes
- [ ] Test mini apps
- [ ] Test wallet connections
- [ ] Verify API rewrites work
- [ ] Check Farcaster manifest

## Notes

- API rewrites point to `https://api.dreamnet.ink`
- If API is on different domain, update `vercel.json`
- Site uses relative API paths by default (works with rewrites)

