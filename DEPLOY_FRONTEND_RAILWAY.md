# Deploy Frontend to Railway (No Vercel Needed!)

Since Vercel is causing issues, we'll deploy the frontend **from the same Railway service** that hosts the backend.

## How It Works

The backend server (`server/index.ts`) already has code to serve static files in production. We just need to:
1. Build the frontend (`client/dist`)
2. Update Railway to build both frontend and backend
3. Server will serve frontend from `client/dist`

## Railway Configuration

### Update Railway Service Settings:

**Root Directory:** `server` (keep as is)

**Build Command:** 
```bash
cd .. && pnpm --filter client build && cd server && pnpm build
```

This will:
1. Build the frontend (`client/dist`)
2. Build the backend (`server/dist`)

**Start Command:** 
```bash
pnpm start
```
(unchanged - runs `node dist/index.js`)

## What Changed

1. **`server/vite.ts`** - Updated `serveStatic()` to serve from `client/dist` instead of `server/public`
2. **`server/package.json`** - Added `build:full` script for local testing

## Result

- Frontend will be served from `https://api.dreamnet.ink` (same domain as backend)
- No need for Vercel!
- API routes still work at `/api/*`
- Frontend routes work at `/*` (SPA routing)

## Next Steps

1. Update Railway build command
2. Redeploy
3. Frontend will be live at `https://api.dreamnet.ink`

## Optional: Custom Domain

If you want `dreamnet.ink` to point to Railway instead of Vercel:
1. Update DNS to point to Railway's domain
2. Configure custom domain in Railway dashboard
