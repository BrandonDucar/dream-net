# Vercel Configuration Fix for dreamnet.ink

## Current Issue
Build logs show:
- Building `@dreamnet/site@0.1.0` (old site) instead of `dreamops-launcher` (new client)
- Using `npm run build` instead of `pnpm run build`
- This means Vercel project settings are overriding `vercel.json`

## Correct Configuration

### In Vercel Dashboard → Project Settings:

**General Tab:**
- **Root Directory**: `client` ✅ (This is correct)

**Build & Development Settings:**
- **Framework Preset**: Other (or leave blank)
- **Build Command**: `pnpm run build` ⚠️ (Currently might be `npm run build`)
- **Output Directory**: `dist` ✅
- **Install Command**: `cd .. && pnpm --filter client... install --no-frozen-lockfile --ignore-scripts` ⚠️ (Might be missing or wrong)

**Environment Variables:**
- `NODE_ENV=production`

## Steps to Fix

1. Go to https://vercel.com/dashboard
2. Select your dreamnet.ink project
3. Go to **Settings** → **General**
4. Verify **Root Directory** is set to: `client`
5. Go to **Settings** → **Build & Development Settings**
6. Update:
   - **Build Command**: `pnpm run build`
   - **Install Command**: `cd .. && pnpm --filter client... install --no-frozen-lockfile --ignore-scripts`
   - **Output Directory**: `dist`
7. Click **Save**
8. Go to **Deployments** tab
9. Click **Redeploy** on the latest deployment (or trigger a new deployment)

## What Should Happen

After fixing, build logs should show:
```
> dreamops-launcher@0.0.0 build
> vite build
```

Not:
```
> @dreamnet/site@0.1.0 build
```

## Alternative: Use vercel.json Only

If you want Vercel to use `vercel.json` instead of dashboard settings:
1. In **Build & Development Settings**
2. Set **Build Command** to: `vercel build` (this tells Vercel to use vercel.json)
3. Or leave Build Command empty and Vercel will read from vercel.json

## Current vercel.json (Root)

```json
{
  "version": 2,
  "rootDirectory": "client",
  "installCommand": "cd .. && pnpm --filter client... install --no-frozen-lockfile --ignore-scripts",
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist"
}
```

This is correct - Vercel just needs to use it!

