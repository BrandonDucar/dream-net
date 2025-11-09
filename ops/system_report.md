# DreamNet System Report (Bootstrap/Hybrid Init)

## 1. Repo & Infrastructure Audit

- **File Inventory**: Generated comprehensive file inventories from the `dream-net` repository in batches of 50 files. These CSVs are stored in the branch under `ops` and capture every file path and SHA.  
- **Environment Variables**: `.env.example` still enumerates required variables (`DATABASE_URL`, `JWT_SECRET`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, etc.). Runtime now accepts either `DATABASE_URL_V2` or `DATABASE2_URL` for the secondary Neon instance (see `server/db.ts`). Vercel project has been populated with OpenAI/Anthropic keys and both Neon URLs; keep budget enforcement at $50/mo via Compute Governor.
- **Branches**: Created and switched to the working branch `bootstrap/hybrid-init` and committed all changes there.

## 2. Agent Manifest

A new agent manifest (`ops/agent_manifest.json`) documents the core DreamNet agents and their roles:

| Agent | Path | Description |
|------|------|-------------|
| **DeployKeeper** | `agents/deployKeeper.cjs` | Monitors deployment status across Vercel, GitHub, and Replit; triggers deployments and rollback when necessary. |
| **DreamKeeper** | `client/src/pages/dreamkeeper-core.tsx`, `lib/dreamkeeperCore.ts` | Oversees system diagnostics and orchestrates self‑healing workflows. |
| **DreamOps Launcher** | `client/src/pages/dream-ops-launcher.tsx`, `client/src/components/DreamOpsLauncher.tsx` | UI and logic for launching dream cores and orchestrating subagents (LUCID, CANVAS, ROOT, ECHO, CRADLE, WING). |
| **AI Surgeon (Dr. Dreamfix)** | `lib/aiSurgeonAgents.ts` | Performs automatic repairs and allows manual fixes; stops agents on error. |
| **DreamDefenseNet** | `lib/defenseBots.ts` | Monitors threats such as unauthorized cores or dream injection and neutralizes them. |
| **EvolutionEngine** | `lib/evolutionEngine.ts` | Runs iterative upgrade cycles, applying insights from diagnostics and threats to evolve the system. |

All agents are currently marked “stopped” in the manifest; they require activation and integration in the orchestrator.

## 3. API Endpoints

- `app/api/health`, `app/api/agents`, `app/api/runs/recent`, `app/api/changelog` – continue to serve stubbed data for the marketing layer; hydration is handled via `lib/marketing/metrics.ts` with safe fallbacks.  
- `server/routes/dreamstar.ts` – DreamStar router exposing `/api/dreamstar/ingest`, `/generate`, `/pipeline`, and `/missions`. Ingest & generate endpoints persist to Neon (`dreamstar_ingestions`, `dreamstar_generations`) and emit StarBridge events (`dreamstar.ingest.requested`, `dreamstar.generate.requested`).  
- `server/routes/dreamsnail.ts` – DreamSnail router serving `/api/dreamsnail/spec`, `/summary`, `/roadmap`, `/commit`, `/verify`, `/trail`, `/root` with events persisted to Neon (`dreamsnail_trail_events`) and real-time in-memory mirror until TrailCommit contracts go live.

## 4. Marketing Homepage

`app/page.tsx` now renders a biomimetic marketing experience (Next.js server components) comprising:

1. Hero + CTA (“Schedule a Mission Briefing”, “View Live Status”).  
2. Live stats strip (system health, agents active, latest mission).  
3. Vertical highlight cards for DreamStar, DreamSnail, and Precious Metals Intelligence.  
4. Governance showcase (Compute Governor, Daemon, StarBridge) and recent autonomous activity/changelog feed.  

Dedicated pages (`/dreamstar`, `/dreamsnail`, `/metals`) deepen each vertical; `/contact`, `/status`, `/privacy`, `/terms` cover lead capture and compliance.

## 5. System Verification

- **Health Endpoint**: `/api/health` now includes a Neon connectivity probe (`db: connected|error`) alongside commit SHA + timestamp. Verify after deploy (`https://dreamnet.ink/api/health`).  
- **DreamStar / DreamSnail Routes**: Exercised locally; production verification pending Vercel deployment.  
- **Database Query**: Execute `SELECT NOW();` on both Neon databases after deployment to confirm connectivity via the `DATABASE_URL_V2` / `DATABASE2_URL` fallback.

## 6. Next Steps

1. **Deployment** – Promote the updated marketing build to Vercel (`dreamnet.ink`) and validate all routes + hydration.  
2. **Apply Migrations** – Run `migrations/2025-11-08_dreamnet_core.sql` and `migrations/2025-11-08_dreamsnail_trail.sql` against both Neon databases (`psql "$NEON_DATABASE_URL" -f …`).  
3. **Lead Routing** – Replace the Formspree placeholder in `app/contact/page.tsx` with the preferred inbox or CRM webhook.  
4. **DreamStar Backlog** – Integrate DreamForge job templates, DreamVault fingerprinting, and mission history dashboards on top of the new Neon tables.  
5. **DreamSnail Backlog** – Implement TrailCommit contracts/circuits, replace the transitional schema with contract-driven Merkle proofs, and hook privacy shaders/UI.  
6. **Atlas Foundry Backlog** – Build trait analytics, hybrid scoring, and DreamForge interoperability for `/api/foundry`.  
7. **Database Health** – Run verification queries on both Neon instances and monitor Compute Governor spend against the $50/mo cap.  
8. **Documentation** – Continue auditing/refreshing ops docs (`replit.md`, `ops/dreamnet-site-plan.md`, `ops/assistant-memory.md`) as milestones ship.
