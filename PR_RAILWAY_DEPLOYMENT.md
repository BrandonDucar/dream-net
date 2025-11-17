# Add Railway deployment configuration and health endpoint for DreamNet server

## Summary

This PR completes the Railway deployment configuration for the DreamNet API server and adds a public `/health` endpoint for monitoring. The server can now be built and run on Railway using pnpm workspaces and the `server/` package as the root service.

## Changes

### 1. `railway.toml`

- Added at repo root
- Uses `server/` as the root directory
- Build command:
  - `pnpm install --frozen-lockfile && pnpm --filter @dreamnet/server build`
- Start command:
  - `pnpm --filter @dreamnet/server start`
- Configured health check path: `/health`

### 2. `server/package.json`

- Confirmed scripts:
  - `build: "tsc -p tsconfig.json"` (outputs to `dist/`)
  - `start: "node dist/index.js"` (runs compiled server)
- Compatible with Railway's build/start flow

### 3. Server PORT binding

- Verified in `server/index.ts`:
  - Uses `process.env.PORT || 3000`
- Ensures Railway can inject its own `PORT` value without conflicts

### 4. Public health endpoint

- Added `/health` route in `server/index.ts`
- Returns JSON:
  ```json
  {
    "ok": true,
    "service": "dreamnet-api",
    "timestamp": "<iso-string>",
    "uptime": <seconds>
  }
  ```
- No authentication required so Railway can use it as a health probe

### 5. Deployment documentation

- Added `RAILWAY_DEPLOYMENT.md` with:
  - Overview of Railway configuration
  - Environment variables checklist
  - Deployment steps
  - Smoke test checklist
  - Basic troubleshooting guidance

## How to Deploy

1. Push this branch to GitHub
2. In Railway:
   - Connect the repo
   - Ensure it uses the root `railway.toml`
   - Set required environment variables (`NODE_ENV`, `OPENAI_API_KEY`, `DREAMNET_API_KEY`, `DATABASE_URL`, etc.)
   - Trigger a deploy
3. Verify:
   - `/health` returns the expected JSON
   - Core API endpoints respond:
     - `/api/networks/blueprints`
     - `/api/networks/active`
     - `/api/directory/citizens`

## Checklist

- [x] `railway.toml` points to `server/` and uses pnpm workspace filters
- [x] Server build + start scripts work with `dist/index.js`
- [x] Server binds to `process.env.PORT`
- [x] Public `/health` endpoint added and unauthenticated
- [x] Deployment docs created in `RAILWAY_DEPLOYMENT.md`

## Testing

After deployment, verify:
- Build passes (no TypeScript/build errors)
- Logs show server listening on Railway-provided PORT
- `GET /health` returns `{ ok: true, service: "dreamnet-api" }`
- Core endpoints respond correctly
- No crash-restart cycles in Railway logs

