# Deploying DreamNet Core to Railway.app

This guide explains how to deploy the DreamNet Core HTTP server to Railway.app as a single Node.js service.

## Prerequisites

- A GitHub account
- A Railway.app account (sign up at [railway.app](https://railway.app))
- This repository pushed to GitHub

## Railway Deployment Steps

### 1. Connect Repository to Railway

1. Go to [Railway.app](https://railway.app) and log in with GitHub
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose this repository (`dream-net`)

### 2. Configure Service Settings

When Railway prompts for service settings, configure:

- **Root Directory:** `server`
  - This tells Railway to run commands from the `server/` directory where the Express app lives

- **Build Command:** `pnpm install && pnpm build`
  - Installs all dependencies (including workspace packages)
  - Compiles TypeScript to JavaScript in `dist/`

- **Start Command:** `pnpm start`
  - Runs the compiled server: `node dist/index.js`

### 3. Set Environment Variables

In Railway's service settings (Project → Variables), add these environment variables:

**Required:**
- `NODE_ENV=production`
- `PORT` (Railway automatically injects this; server uses `process.env.PORT || 3000`)

**Database (Neon PostgreSQL):**
- `DATABASE_URL` or `NEON_DATABASE_URL` - Your Neon PostgreSQL connection string
  - The server supports both `DATABASE_URL` and `NEON_DATABASE_URL` (prefers `DATABASE_URL` first)
  - If you already have Neon secrets in GitHub/Vercel, copy the connection string to Railway
  - Format: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
  - **Note:** If `DATABASE_URL` is not set, the server will start but database features will be unavailable (logs a warning)

**Optional (add as needed):**
- API keys (OpenAI, Stripe, Vercel, etc.)
- Any other environment variables your local `.env` file contains

**Note:** The server will automatically use Railway's injected `PORT` environment variable. No need to set it manually.

### 4. Deploy

Railway will automatically:
1. Run `pnpm install` (installs all workspace dependencies)
2. Run `pnpm build` (compiles TypeScript to `dist/`)
3. Run `pnpm start` (starts the server)

Once deployed, Railway will provide a public URL (e.g., `https://your-app.up.railway.app`).

## Verification

After deployment, verify the server is running:

```bash
# Test core endpoints
curl https://your-app.up.railway.app/api/networks/blueprints
curl https://your-app.up.railway.app/api/directory/citizens
curl https://your-app.up.railway.app/api/discovery/map
```

## Troubleshooting

### Build Fails

- **Issue:** `ERR_MODULE_NOT_FOUND` errors
- **Solution:** Ensure all workspace packages are properly linked. Railway runs `pnpm install` at the repo root, which should link all workspace packages.

### Server Won't Start

- **Issue:** Port binding errors
- **Solution:** The server uses `process.env.PORT || 3000`. Railway automatically sets `PORT`, so this should work. If issues persist, check Railway logs.

### Missing Dependencies

- **Issue:** Runtime errors about missing packages
- **Solution:** Ensure all `@dreamnet/*` workspace packages are listed in `pnpm-workspace.yaml` and have proper `package.json` exports.

## Architecture Notes

- **Monorepo Structure:** DreamNet uses pnpm workspaces. Railway runs commands from the `server/` directory, but `pnpm install` at the repo root links all workspace packages.
- **Build Output:** TypeScript compiles to `server/dist/index.js`
- **Port Binding:** Server listens on `process.env.PORT || 3000` (Railway-compatible)
- **Database:** Uses Neon PostgreSQL via `@neondatabase/serverless`. Supports both `DATABASE_URL` and `NEON_DATABASE_URL` environment variables. Server can start without database (logs warning), but database features require a valid connection string.

## Cost

Railway offers a free tier with:
- $5/month in credits
- Sufficient for small-to-medium DreamNet deployments
- Pay-as-you-go pricing for larger deployments

See [Railway Pricing](https://railway.app/pricing) for details.
