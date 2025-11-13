# DreamNet Environment Guide

Use this guide as the canonical checklist for local development, Vercel deployments, and Base mini‑app launches. Store real secrets in your private `.env` files or hosted secret managers—**never commit live keys**.

---

## Core Backend

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | Neon/Postgres connection string (`sslmode=require`). |
| `MESH_AUTOSTART` | ⚙️ | `true` to boot DreamKeeper/DeployKeeper automatically on server start (default `true`). |
| `PORT` | ⚙️ | Optional override for Express server port (defaults to `5000`). |

### Example
```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
MESH_AUTOSTART=true
# PORT=5000
```

---

## Base Deploy Wallet (Hardhat)

These power `pnpm deploy:base-*` scripts. Use a dedicated wallet and keep the key offline.

| Variable | Required | Description |
| --- | --- | --- |
| `PRIVATE_KEY` | ✅ | Hex private key for the Base deploy wallet. |
| `BASE_MAINNET_RPC_URL` | ✅ | Base mainnet RPC endpoint (e.g. `https://mainnet.base.org`). |
| `BASE_SEPOLIA_RPC_URL` | ⚙️ | Base Sepolia RPC (used for dry runs). |

```
PRIVATE_KEY=0x0000...deadbeef
BASE_MAINNET_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

---

## Frontend / Vite Environment

These variables are consumed by `apps/site` and the React mini‑apps.

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | ✅ | DreamNet API base URL (`http://localhost:5000` locally, `https://api.dreamnet.ink` in production). |
| `VITE_BASE_RPC_URL` | ✅ | Fallback RPC used when a wallet is disconnected. |
| `VITE_BASE_CHAIN_ID` | ✅ | Base chain ID (`8453` mainnet, `84532` Sepolia). |
| `VITE_SUBSCRIPTION_HUB_ADDRESS` | ⚙️ | Deployed `SubscriptionHub` contract address (set after deploy). |
| `VITE_SUBSCRIPTION_BADGE_ADDRESS` | ⚙️ | Deployed `SubscriptionBadge` contract address. |

```
VITE_API_URL=http://localhost:5000
VITE_BASE_RPC_URL=https://mainnet.base.org
VITE_BASE_CHAIN_ID=8453
VITE_SUBSCRIPTION_HUB_ADDRESS=0x0000000000000000000000000000000000000000
VITE_SUBSCRIPTION_BADGE_ADDRESS=0x0000000000000000000000000000000000000000
```

---

## Deployment Cheat Sheet

1. **Local**  
   - Copy the snippets above into `.env` (root) and/or `apps/site/.env`.  
   - Run `pnpm --filter @dreamnet/server dev` and `pnpm --filter @dreamnet/site dev`.

2. **Base Mini‑App Launch**  
   - Ensure `PRIVATE_KEY` and RPC URLs are set.  
   - `pnpm compile`  
   - `pnpm deploy:base-sepolia` (optional dry run)  
   - `pnpm deploy:base-mainnet`  
   - Update `VITE_SUBSCRIPTION_*` env values with the emitted addresses.

3. **Production (Vercel)**  
   - Configure the variables under Project Settings → Environment Variables.  
   - Redeploy (`git push`) so Vercel rebuilds `apps/site`.  
   - Mesh API should be reachable at `https://api.dreamnet.ink`.

4. **Verification & Grants**  
   - Optionally run `pnpm verify:base`.  
   - Document the deployed addresses in `docs/miniapps/subscription-hub.md`.  
   - Submit to Base’s builder programs with the live URL `https://dreamnet.ink/miniapps/subscription-hub`.

> Tip: Keep a local `.env.local` or `.env.production` and reference this guide whenever new agents or mini‑apps introduce additional secrets.

