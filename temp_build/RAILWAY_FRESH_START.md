# Railway Fresh Start Guide

## Step 1: Delete Current Service

1. Go to Railway Dashboard
2. Click on `@dreamnet/server` service
3. Go to **Settings** tab
4. Scroll to bottom
5. Click **Delete Service** (red button)
6. Confirm deletion

**Keep:** Postgres service (don't delete this!)

## Step 2: Create New Service

1. In Railway Dashboard, click **+ New**
2. Select **GitHub Repo**
3. Choose your `dream-net` repository
4. Railway will auto-detect services

## Step 3: Configure the Service

When Railway shows detected services, you might see multiple. **Only configure ONE:**

### Select: `server` (or `@dreamnet/server`)

**Settings:**
- **Root Directory:** `server`
- **Build Command:** `cd .. && pnpm install --no-frozen-lockfile && pnpm --filter client build && cd server && pnpm build`
- **Start Command:** `pnpm start`

## Step 4: Environment Variables

Add these in Railway → Service → Variables:

**Required:**
- `NODE_ENV=production`
- `DATABASE_URL` - Your Neon Postgres connection string

**Optional (add as needed):**
- API keys (OpenAI, Stripe, etc.)
- Any other env vars

## Step 5: Connect Postgres (If Needed)

If you deleted Postgres too:
1. Click **+ New** → **Database** → **Add Postgres**
2. Railway will create a new Postgres instance
3. Copy the `DATABASE_URL` from Postgres service
4. Add it to your server service variables

## Step 6: Deploy

Railway will automatically:
1. Install dependencies (`pnpm install`)
2. Run build command
3. Start server

## What This Does

- ✅ Builds frontend (`client/dist/`)
- ✅ Builds backend (`server/dist/`)
- ✅ Serves both from same Railway service
- ✅ No Vercel needed!

## Result

Your app will be live at Railway's generated domain (e.g., `https://your-app.up.railway.app`)

Frontend + Backend both served from the same URL!

## Troubleshooting

**Build fails?**
- Check Railway logs
- Verify build command is correct
- Make sure `pnpm` is detected (check package.json has `packageManager`)

**Server won't start?**
- Check `PORT` is set (Railway auto-injects)
- Verify `server/dist/index.js` exists
- Check server logs

**Frontend not loading?**
- Verify `client/dist/` was built
- Check `server/vite.ts` serves from `client/dist`
- Check Railway logs

