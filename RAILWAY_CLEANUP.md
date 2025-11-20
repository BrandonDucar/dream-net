# Railway Cleanup Guide

Railway auto-detected multiple services from your monorepo, but you only need **ONE** service.

## What to Keep ✅

1. **`@dreamnet/server`** - This is your main backend (serves both API and frontend)
2. **`Postgres`** - Your database (already working)

## What to Delete ❌

Delete these services (they're old apps or parts of the monorepo, not separate services):

- `@dreamnet/site` 
- `dreamos`
- `@dreamnet/seo`
- `@dreamnet/sitebuilder`
- `@dreamnet/hub`

## Steps to Clean Up

### 1. Delete Unused Services

For each service above:
1. Click on the service card
2. Click the **Settings** tab (gear icon)
3. Scroll to the bottom
4. Click **Delete Service** (red button)
5. Confirm deletion

### 2. Configure `@dreamnet/server`

After deleting the others, configure the main server:

1. Click on **`@dreamnet/server`** service
2. Go to **Settings** tab
3. Update these settings:

**Root Directory:** `server` (should already be set)

**Build Command:** 
```bash
cd .. && pnpm --filter client build && cd server && pnpm build
```

**Start Command:** 
```bash
pnpm start
```

**Environment Variables:**
- `NODE_ENV=production`
- `DATABASE_URL` (your Neon Postgres connection string)
- Any other API keys you need

### 3. Redeploy

After configuring, Railway will automatically redeploy. Or click **Deploy** manually.

## Result

- ✅ Only one service: `@dreamnet/server`
- ✅ Frontend + Backend served from same Railway service
- ✅ No Vercel needed!
- ✅ Frontend will be at `https://api.dreamnet.ink` (or your Railway domain)

## Why This Happened

Railway scanned your monorepo and found multiple `package.json` files in different directories (`apps/dreamos`, `apps/hub`, etc.). It tried to deploy them all as separate services, but they're not meant to be deployed separately - they're just parts of the monorepo structure.

The only thing that should be deployed is `server/` which serves both the backend API and the frontend.

