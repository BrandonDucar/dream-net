# DreamNet Overview

## Purpose
DreamNet is a biomimetic AI + Web3 ecosystem that treats every product initiative as a living organism. The monorepo powers evolution cycles (Seed → Cocoon → Node → Networked Organism → Launched Product), multi-agent orchestration, Base mini-app deployments, and tokenized economics. The current production directive is **ALL-IN DREAMNET CLOSE & PUBLISH v1**.

## Monorepo Layout
- `client/` — Vite/React command center (`dreamops-launcher`) with MetalsMint, Crypto dashboards, and landing experiences.
- `server/` — TypeScript service mesh (Express, Drizzle, agents, pipelines) exposing DreamNet APIs, jobs, and biomimetic subsystems.
- `apps/*` — Satellite services (DreamOS, Hub, SEO, Sitebuilder). Each is now part of the pnpm workspace with dedicated build/typecheck targets.
- `packages/utils` — Shared utility package placeholder awaiting real helpers.
- `agents/` — Operational agents (DeployKeeper, DreamKeeper, IntegrationScanner, WolfPackFundingHunter) used for automation and funding hunts.
- `docs/` — Living knowledge base (this file + biomimicry + agents).
- `contracts/` — Hardhat contracts for DreamerPass, SheepToken, Subscription assets.
- `dream-agent-store/`, `dreamnodes/`, `apps_extracted/` — legacy or auxiliary surfaces to audit before inclusion in the core workspace.

## Tooling & Standards
- Package manager: `pnpm@10.21.0` (workspace declared in root).
- TypeScript base config: `tsconfig.base.json` with strict flags and path aliases for `@/*` and `@shared/*`.
- Root scripts (conventional):
  - `pnpm install`
  - `pnpm typecheck`
  - `pnpm build`
  - `pnpm dev`
  - `pnpm lint|format|test|clean` (fan out with `--if-present`).
- Each workspace package implements `build` and `typecheck` scripts that call `tsc`.

## Current Health Snapshot
- Install succeeds. Workspace typecheck/build fail due to pre-existing issues in `server/` (Drizzle enum mismatches, missing schema properties, absent deps like `blake3`, `snarkjs`, `@vitejs/plugin-react` resolution).
- No deterministic deployment metadata (`.vercel/project.json`) checked in. Manual Vercel alignment required.
- `/health` and `/api/version` endpoints need confirmation/implementation to satisfy DeployKeeper.

## Immediate Priorities
1. Stabilize server type system — align Drizzle schema enums, ensure shared Zod schemas meet constraints, resolve missing dependencies.
2. Produce typed env schema + `.env.example` (not yet present).
3. Unify frontend deployment (replace legacy `dreamnet-site` production surface with `client/`).
4. Reconstruct governance stack (ComputeGovernor, RealWorldDataGovernor) if missing from repo or restore from history.

