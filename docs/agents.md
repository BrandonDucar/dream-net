# Agent Mesh Directory

DreamNet coordinates a mesh of specialized agents. Each agent has a home module, required environment inputs, and expected outputs for the Magnetic Rail pipeline. This document tracks live agents and the gaps we must close to keep DeployKeeper satisfied.

| Agent | Module | Role | Inputs (env / data) | Outputs | Notes |
| --- | --- | --- | --- | --- | --- |
| **DreamOps Orchestrator** | `agents/AgentConductor.js`, `server/orchestration-script.ts` | Primary conductor for repos, CI/CD, and workflow handoffs. | `DREAMOPS_API_KEY`, GitHub token, Vercel token | Build triggers, pipeline status events, task assignments. | Ensure `/health` + `/api/version` endpoints exist for DeployKeeper checks. |
| **DeployKeeper** | `agents/deployKeeper.cjs`, `agents/status.cjs` | Validates deploys, DNS, routing, and health endpoints. | `DEPLOYKEEPER_API_KEY`, service URLs | Deployment approval/rollback guidance. | Requires deterministic builds (`pnpm install:ci`, `pnpm build`). |
| **EnvKeeper** | _Missing in repo (expected under `agents/` or `server/lib`)_ | Manages `.env` hygiene, schema propagation, rotation. | `ENVKEEPER_API_KEY`, env manifests | Typed `.env` diffs, secrets sync. | TODO: Rebuild module + generate `docs/env.schema.md`. |
| **DreamKeeper** | `agents/dreamnetv2_main` snapshots, `server/watchdog/service.ts` | Diagnostics and health scoring. | `DREAMKEEPER_API_KEY`, Star Bridge telemetry | Dream Health Index, repair plans. | Align with `server/watchdog/service.ts` outputs. |
| **RelayBot** | `agents/AutonomousLeadAgent.js` (messaging hooks), `agents/CampaignMasterAgent.js` | Cross-platform messaging dispatcher (Telegram, X, IG, email). | `RELAYBOT_API_KEY`, connector creds | Formatted outbound posts, channel analytics. | Configure connectors in `.env.example`. |
| **IntegrationScanner** | `agents/integrationScanner.cjs`, `apps/dreamos/src/registry/capabilities.json` | Audits available GitHub/Vercel integrations, recommends or installs. | GitHub PAT, Vercel token | Integration reports, actionable suggestions. | Works with DreamOS mini-app. |
| **Wallet Score Engine (FlutterAI)** | `dreamnodes/flutterbye/**/*.ts`, `server/vector-ledger/service.ts` | Wallet analytics, scoring, forecasting. | Chain RPC keys, analytics config, wallet list. | Score reports via forthcoming `/api/wallet/:address/*`. | Type errors in vector ledger indicate schema mismatches to fix. |
| **Wolf Pack Funding Hunter** | `agents/WolfPackFundingHunter.js` | Orchestrates coordinated funding hunts (grants/partnerships). | CRM data, outreach templates, token incentives. | Funding lead pipeline updates. | Connect to Project Chimera budget once ComputeGovernor is restored. |
| **Deploy Assistant** | `agents/deploymentAssistant.ts` | Helper routines for multi-step deploys. | Environment map, release metadata. | Step-by-step release plans. | Update to call `pnpm install:ci` and `pnpm build` now that workspace exists. |
| **Nano Agents** | `agents/nano/*.cjs` | Lightweight task runners executed by orchestrator. | Task payloads | Quick responses, localized automation. | Ensure each has typecheck or validation before execution. |

## Operational Expectations
1. **Deterministic Runs** — Use `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm build` before DeployKeeper approvals.
2. **Telemetry** — Star Bridge (`server/starbridge/*.ts`) must emit status information consumed by DreamKeeper and RelayBot for comms.
3. **Governance Stack** — Restore `ComputeGovernor.ts`, `RealWorldDataGovernor.ts`, and Daemon docs referenced in `mission_brief.md`. Without them, Project Chimera Hunt cannot enforce budgets.
4. **Documentation Loop** — Update this file whenever an agent is added, deprecated, or migrates modules. Tie into `docs/pipelines.md` once created.

> **Action Items:** locate or reconstruct missing EnvKeeper and governance agent modules, then wire type-safe env schema + health endpoints so DeployKeeper can pass the repo for launch.

