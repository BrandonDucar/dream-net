# DreamNet Operations Contract

**Version**: 1.0.0  
**Last Updated**: 2025-01-27  
**Status**: Enforced

---

## Purpose

This document is the **SINGLE SOURCE OF TRUTH** for how DreamNet's infrastructure, deployments, and integrations must behave. It is not marketing; it is a rulebook that all tools, agents, and developers must follow.

**Any tool/agent (Cursor, DreamNet agents, Vercel AI, Replit, etc.) can read this contract and know exactly:**
- How to build
- What to deploy
- Where to route tasks
- When to call DreamNet
- How to respect all integrations coherently

---

## 1. Repo Layout Contract

### Directory Structure

- **`client/`** = Primary production frontend (DreamNet Hub)
  - Main web UI served at `dreamnet.ink`
  - Built with Vite + React + TypeScript
  - Output: `client/dist/`

- **`server/`** = Primary production backend API
  - Express.js API server
  - Hosted on Railway
  - Entry: `server/index.ts`
  - Build output: `server/dist/`

- **`apps/*`** = Optional/auxiliary applications
  - `apps/api-forge` - API tooling
  - `apps/dreamos` - OS interface
  - `apps/hub` - Legacy hub
  - `apps/seo` - SEO tools
  - `apps/sitebuilder` - Site builder
  - **NOT part of primary production deployment**

- **`packages/*`** = Shared libraries, agents, bridge packages, UI kits
  - Core packages: `dreamnet-bridge`, `api-keeper-core`, `shield-core`, etc.
  - Mini-app frontends: `base-mini-apps/frontend`
  - Agent packages: `dreamnet-vercel-agent`, `dreamnet-voice-twilio`, etc.
  - Used by `client/` and `server/` via workspace dependencies

- **`contracts/`** = Smart contracts (Solidity)
  - Hardhat configuration
  - Deployed on Base Mainnet/Sepolia

- **`scripts/`** = Tooling, migrations, setup scripts

### Rules

**RULE 1.1**: All build and deploy processes MUST treat `client/` as the primary production frontend.

**RULE 1.2**: All backend hosting MUST treat `server/` as the primary production backend.

**RULE 1.3**: `apps/*` directories are NOT part of the primary production build path.

**RULE 1.4**: Packages in `packages/*` are dependencies, not standalone deployable units.

---

## 2. Build & Deploy Contract

### Root Scripts (Canonical)

Defined in root `package.json`:

- **`dev`** → `pnpm -r --parallel run dev`
  - Starts all workspaces in parallel development mode

- **`build`** → `pnpm -r --if-present run build`
  - Builds all workspaces that have a build script

- **`vercel-build`** → `pnpm build:app`
  - **DEPRECATED**: Use Vercel config instead (see below)

- **`start`** → `NODE_ENV=production node server/dist/index.js`
  - Starts production backend server

- **`dev:app`** → `NODE_ENV=development tsx server/index.ts`
  - Starts development backend server

### Frontend Deployment (Vercel)

**Configuration**: `vercel.json` at repo root

```json
{
  "version": 2,
  "rootDirectory": "client",
  "installCommand": "cd .. && pnpm --filter client... install --no-frozen-lockfile",
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://api.dreamnet.ink/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**RULE 2.1**: Vercel MUST use `rootDirectory: "client"`.

**RULE 2.2**: Vercel install command MUST filter to `client` workspace only: `pnpm --filter client... install --no-frozen-lockfile`

**RULE 2.3**: Vercel build command MUST run `pnpm run build` from within `client/` directory.

**RULE 2.4**: Vercel output directory MUST be `dist` (relative to `client/`).

**RULE 2.5**: Vercel MUST NOT attempt to build or install the entire monorepo.

**RULE 2.6**: API routes (`/api/*`) MUST proxy to `https://api.dreamnet.ink`.

### Backend Deployment (Railway)

**Configuration**: `railway.json`, `railway.toml`, `nixpacks.toml`

- **Service root**: `server/`
- **Install**: `pnpm install` (from repo root, installs all workspaces)
- **Build**: `pnpm run build` (builds server workspace)
- **Start**: `pnpm start` (runs `server/dist/index.js`)

**RULE 2.7**: Railway MUST NOT attempt to serve frontend assets.

**RULE 2.8**: Railway MUST use `server/` as the service root.

**RULE 2.9**: Railway build MUST produce `server/dist/index.js`.

### Client Build Scripts

Defined in `client/package.json`:

- **`dev`** → `vite` (development server)
- **`build`** → `vite build` (production build)
- **`preview`** → `vite preview` (preview production build)

### Server Build Scripts

Defined in `server/package.json`:

- **`dev`** → `tsx index.ts` (development with hot reload)
- **`build`** → `node build.cjs` (production build via esbuild)
- **`start`** → `node dist/index.js` (production server)

---

## 3. Environment & Secrets Contract

### Environment Variable Management

**RULE 3.1**: Root `.env.example` is the authoritative master list of all env var names.

**RULE 3.2**: `client/.env.example` and `server/.env.example` contain only what each side needs (subset of root).

**RULE 3.3**: All secrets MUST live in:
- **Vercel project env** for frontend (`client/` needs)
- **Railway env** for backend (`server/` needs)

**RULE 3.4**: Code MUST NOT hardcode secrets; MUST read from `process.env`.

**RULE 3.5**: Required env vars MUST be documented in `.env.example` files.

### Common Environment Variables

**Frontend (Vercel)**:
- `NODE_ENV=production`
- `VITE_API_URL=https://api.dreamnet.ink` (if needed)
- `VITE_BASE_RPC_URL` (Base RPC)
- `VITE_BASE_SCAN_API_KEY` (BaseScan API key)

**Backend (Railway)**:
- `NODE_ENV=production`
- `DATABASE_URL` or `NEON_DATABASE_URL` (PostgreSQL)
- `PORT` (server port, defaults to 3000)
- `SESSION_SECRET` (express-session secret)
- `DREAMNET_API_KEY` (internal API key)
- `VERCEL_TOKEN` (for Vercel agent)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` (Twilio)
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` (AI services)
- `STRIPE_SECRET_KEY` (Stripe)
- `BASE_MAINNET_RPC_URL`, `BASE_SEPOLIA_RPC_URL` (Blockchain RPCs)
- `BASE_SCAN_API_KEY` (BaseScan)

**Full list**: See `DREAMNET_INTEGRATIONS_INVENTORY.md` for complete env var requirements per integration.

---

## 4. Bridge & Agents Contract

### DreamNet Bridge

**Location**: `packages/dreamnet-bridge/index.ts`

**Purpose**: Exclusive gateway for high-level system queries.

**Exports**:
- `dnStatus()` - System status (infra, agents, health)
- `dnEconomy(query)` - Economic/token/liquidity queries
- `dnDevOps(query)` - DevOps/deployment queries
- `dnWalletIntel(query)` - Wallet/portfolio analytics (READ_ONLY)

**RULE 4.1**: Any agent/tool that needs:
- System status → MUST call `dnStatus()`
- Economic info → MUST call `dnEconomy()`
- DevOps/infra guidance → MUST call `dnDevOps()`
- Wallet intelligence → MUST call `dnWalletIntel()`

**RULE 4.2**: Agents MUST call the bridge instead of reinventing logic.

**RULE 4.3**: Bridge requires `DREAMNET_API_KEY` env var.

### Agent Architecture

**Cursor** = Code editor + local orchestrator
- Reads OPS_CONTRACT.md
- Uses ops-sentinel for validation
- Calls dreamnet-bridge for system status
- Edits code/config according to contract

**DreamNet (via bridge)** = Truth source for infra, economy, wallets
- Provides authoritative system status
- Coordinates with internal agents (DreamKeeper, DeployKeeper, CoinSensei)
- Never exposes secrets or private keys

---

## 5. Integration Contract

### Integration Inventory

**Location**: `DREAMNET_INTEGRATIONS_INVENTORY.md` (root)

**RULE 5.1**: Every integration MUST be cataloged in `DREAMNET_INTEGRATIONS_INVENTORY.md`.

**RULE 5.2**: Every integration MUST have:
- Name
- Category (Infra, Blockchain, Comms, Payments, AI, Social, Internal)
- Code location(s)
- Required env vars (by name only, not values)
- Status (active / planned / deprecated)

**RULE 5.3**: Integrations MUST expose only typed, well-defined wrappers in code (no ad-hoc fetches sprinkled everywhere).

**RULE 5.4**: Integrations MUST use environment variables as defined in this contract.

### Integration Categories

**Infrastructure**:
- Vercel (frontend hosting)
- Railway (backend hosting)
- Neon PostgreSQL (database)

**Blockchain**:
- Base Mainnet/Sepolia (primary chain)
- Hardhat (contract development)
- Ethers.js, Wagmi, Viem (interaction libraries)
- Coinbase OnChainKit, Solana Wallet Adapter (wallets)

**Communication**:
- Twilio (SMS/Voice)
- Gmail API (email)
- Telegram Bot API
- Discord Bot API

**AI Services**:
- OpenAI (GPT models)
- Anthropic Claude

**Payments**:
- Stripe

**Social**:
- X/Twitter API
- Facebook API
- Instagram API
- Farcaster

**Internal Connectors**:
- Agent Gateway (`packages/agent-gateway`)
- ConnectorBot (`packages/connectorbot`)
- Star Bridge (`packages/star-bridge-lungs`)
- Nerve Fabric (`packages/nerve`)

**For full integration list and details, see `DREAMNET_INTEGRATIONS_INVENTORY.md` (root).**

**RULE 5.5**: The integrations inventory MUST reference this OPS_CONTRACT as the governing document.

---

## 6. Coordination Rules for Tools

### Task Routing

**RULE 6.1**: If a task involves infra status, economic flows, or wallets → call DreamNet bridge (`dnStatus`, `dnEconomy`, `dnWalletIntel`).

**RULE 6.2**: If a task involves code changes or config → edit the monorepo according to this contract.

**RULE 6.3**: If a task involves external APIs directly → use the typed wrapper modules, not raw `fetch` in random files.

**RULE 6.4**: If a task involves deployment → validate configuration using ops-sentinel before deploying.

**RULE 6.5**: If a task involves secrets → NEVER commit secrets; use environment variables.

### Tool Behavior

**Cursor / ChatGPT / Agents**:
1. Read `docs/OPS_CONTRACT.md` first
2. Use `packages/ops-sentinel` for validation and build/deploy plans
3. Use `packages/dreamnet-bridge` for high-level system status
4. Do NOT bypass these layers

**DreamNet Internal Agents**:
- DreamKeeper: Health monitoring → calls bridge for status
- DeployKeeper: DevOps automation → validates via ops-sentinel
- CoinSensei: Wallet intelligence → uses bridge `dnWalletIntel`
- EnvKeeper: Environment management → validates via ops-sentinel

---

## 7. Validation & Enforcement

### Ops Sentinel

**Location**: `packages/ops-sentinel`

**Purpose**: Enforce this contract at runtime/in CI.

**Functions**:
- `loadOpsContract()` - Load contract definition
- `validateRepoSetup()` - Validate repo structure and configs
- `getFrontendBuildPlan()` - Get Vercel build plan
- `getBackendDeployPlan()` - Get Railway deploy plan
- `getIntegrationConfig(name)` - Get integration configuration

**RULE 7.1**: All deployment scripts MUST validate via ops-sentinel before executing.

**RULE 7.2**: CI/CD pipelines MUST run ops-sentinel validation.

---

## 8. Changes & Updates

### Modifying This Contract

**RULE 8.1**: Changes to this contract MUST be:
1. Documented with rationale
2. Reflected in ops-sentinel code
3. Communicated to all agents/tools
4. Versioned (update version number at top)

**RULE 8.2**: Breaking changes require:
1. Migration plan
2. Update to all affected configs (`vercel.json`, `railway.json`, etc.)
3. Update to ops-sentinel validation rules

---

## Summary

This contract ensures:
- ✅ Vercel builds only `client/` frontend
- ✅ Railway serves only `server/` backend
- ✅ All integrations are cataloged and governed
- ✅ Any agent can follow the OPS Contract + Ops Sentinel + DreamNet Bridge triangle and behave correctly without guesswork

**For usage instructions, see `docs/OPS_README.md`.**

