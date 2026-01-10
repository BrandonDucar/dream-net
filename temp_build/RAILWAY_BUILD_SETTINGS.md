# Railway Build Settings

## Service: @dreamnet/server

### Root Directory
```
server
```

### Build Command
```bash
cd .. && pnpm install --no-frozen-lockfile && pnpm --filter client build && cd server && pnpm build
```

This will:
1. Build the frontend (`client/dist`)
2. Build the backend (`server/dist`)

### Start Command
```bash
pnpm start
```

This runs: `node dist/index.js`

## Environment Variables

Add these in Railway → Service → Variables:

**Required:**
- `NODE_ENV=production`
- `PORT` (Railway auto-injects this, but server uses `process.env.PORT || 3000`)

**Database:**
- `DATABASE_URL` - Your Neon Postgres connection string
  - Format: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`

**Optional (add as needed):**
- API keys (OpenAI, Stripe, etc.)
- Any other env vars your server needs

## How It Works

1. Railway runs build command from repo root
2. Builds frontend → `client/dist/`
3. Builds backend → `server/dist/`
4. Server starts and serves:
   - API routes at `/api/*`
   - Frontend static files at `/*` (from `client/dist/`)

## Result

- ✅ Frontend + Backend served from same Railway service
- ✅ No Vercel needed!
- ✅ Frontend will be at your Railway domain (e.g., `https://api.dreamnet.ink`)

## Troubleshooting

**Build fails?**
- Check Railway logs
- Make sure `pnpm` is available (Railway should auto-detect)
- Verify `client/` and `server/` directories exist

**Server won't start?**
- Check `PORT` is set (Railway auto-injects)
- Verify `server/dist/index.js` exists after build
- Check server logs for errors

**Frontend not loading?**
- Verify `client/dist/` was built
- Check `server/vite.ts` is serving from `client/dist`
- Check Railway logs for static file serving

