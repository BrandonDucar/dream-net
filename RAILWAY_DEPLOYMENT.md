# Railway Deployment Guide for DreamNet

This guide covers deploying DreamNet to Railway.app using the `railway.toml` configuration.

## Configuration Files

### railway.toml

Located at repo root, configured for:
- **Root directory**: `server/` (where the Express server lives)
- **Build command**: `pnpm install --frozen-lockfile && pnpm --filter @dreamnet/server build`
- **Start command**: `pnpm --filter @dreamnet/server start`
- **Health check**: `/health` endpoint

### Server Scripts

**server/package.json** scripts:
- `build`: `tsc -p tsconfig.json` - Compiles TypeScript to `dist/`
- `start`: `node dist/index.js` - Runs the compiled server

### PORT Binding

The server correctly binds to `process.env.PORT`:
```typescript
const port = parseInt(process.env.PORT || "3000", 10);
```

Railway automatically injects the `PORT` environment variable.

## Environment Variables

Set these in Railway Dashboard → Service → Variables:

**Required:**
- `NODE_ENV=production`
- `PORT` (automatically injected by Railway - do not set manually)
- `DATABASE_URL` or `NEON_DATABASE_URL` (Neon PostgreSQL connection string)

**Optional (add as needed):**
- `OPENAI_API_KEY`
- `DREAMNET_API_KEY`
- `STRIPE_SECRET_KEY`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- Any other API keys/secrets your app uses

## Health Check

A public health check endpoint is available at `/health`:
```json
{
  "ok": true,
  "service": "dreamnet-api",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

Railway is configured to use this endpoint for health checks.

## Deployment Steps

1. **Connect Repository**
   - Go to Railway.app
   - Create new project
   - Connect GitHub repository

2. **Railway will detect `railway.toml`**
   - Automatically uses the configuration
   - Sets root directory to `server/`
   - Runs build and start commands

3. **Set Environment Variables**
   - Go to Service → Variables
   - Add all required environment variables
   - Railway automatically injects `PORT`

4. **Deploy**
   - Railway will:
     - Run `pnpm install --frozen-lockfile`
     - Run `pnpm --filter @dreamnet/server build`
     - Run `pnpm --filter @dreamnet/server start`
     - Monitor `/health` endpoint

## Smoke Test Checklist

After deployment, verify:

- [ ] Build passes (no TypeScript/build errors in logs)
- [ ] Logs show server listening on PORT (Railway provided port)
- [ ] `GET https://your-app.up.railway.app/health` returns `{ ok: true, service: "dreamnet-api" }`
- [ ] Core endpoints respond:
  - `GET /api/networks/blueprints`
  - `GET /api/networks/active`
  - `GET /api/directory/citizens`
- [ ] No repeated crash-restart cycles in Railway logs
- [ ] No "EADDRINUSE" or port binding errors

## Troubleshooting

### Build Fails
- Check Railway logs for TypeScript errors
- Ensure all workspace packages are properly linked
- Verify `pnpm-workspace.yaml` includes `server`

### Server Won't Start
- Check logs for runtime errors
- Verify `DATABASE_URL` is set (server can start without it but logs a warning)
- Ensure `PORT` is not manually set (Railway injects it)

### Health Check Fails
- Verify `/health` endpoint is accessible (no auth required)
- Check server is actually running and listening
- Verify Railway health check path is set to `/health`

### Port Binding Errors
- Ensure server uses `process.env.PORT` (not hardcoded)
- Check no other process is trying to bind to the same port
- Verify Railway is injecting `PORT` correctly

## Architecture Notes

- **Monorepo**: DreamNet uses pnpm workspaces
- **Server Location**: `server/` directory at repo root
- **Build Output**: TypeScript compiles to `server/dist/index.js`
- **Port Binding**: Uses `process.env.PORT || 3000` (Railway-compatible)
- **Database**: Supports both `DATABASE_URL` and `NEON_DATABASE_URL`

