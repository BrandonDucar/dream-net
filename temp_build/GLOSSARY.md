# DreamNet Glossary

**Cursor: treat terms in GLOSSARY.md as canonical and prefer the listed paths when proposing edits.**

---

*DreamNet* — The overall monorepo + ecosystem.  
- Code roots: `/apps/site`, `/apps/api-forge`, `/packages/*`, `/server`

*DreamOps* — DevOps brain that orchestrates deploys, envs, logs.  
- Key modules: `/server/core/dreamnet-os.ts`, `/packages/halo-loop/`
- Related services: Vercel, GitHub, Neon, Firebase

*DeployKeeper* — CI/CD supervisor that verifies deployments, DNS, and runtime health.  
- Code: `/server/core/agents/deploykeeper.ts`
- Scripts: `pnpm scan:deploy`, `pnpm deploy:verify`

*EnvKeeper* — Secure env manager/rotator.  
- Code: `/scripts/scan-env.ts`
- Files: `.env.example`, environment variable validation

*RelayBot* — Message dispatcher (voice/text → Telegram/Email/etc.).  
- Code: `/server/core/agents/relaybot.ts` (if exists)
- Integrations: `/packages/integrations/*` (if exists)

*DreamKeeper* — Network health & diagnostics (surgeon agents, alerts).  
- Code: `/lib/dreamkeeperCore.ts`
- Dashboards: `/client/src/pages/dreamscope-ui.tsx`, `/client/src/pages/dreamkeeper-core.tsx`

*Octopus System* — 8‑arm I/O orchestration for connectors & tasks.  
- Code: `/packages/connectors/*` (if exists), `/server/swarm-coordinator.ts`
- Related: `/agents/AutonomousLeadAgent.js`

*Wolf Pack* — Hunter agents (grant hunting, partner outreach).  
- Code: `/agents/WolfPackFundingHunter.js`

*Super Spine* — Core event bus + scheduler ("Magnetic Rail").  
- Code: `/packages/event-wormholes/`, `/server/routes.ts` (event routing)
- Related: `/packages/halo-loop/triggers/`

*Star Bridge* — Cross‑chain & cross‑service connectors.  
- Code: `/packages/bridge/*` (if exists)
- Related: `/server/starbridge/*` (if exists)

*DreamSnail (Privacy Layer)* — Obfuscation, delayed reveal, path‑masking.  
- Code: `/apps/api/src/snail/*` (if exists), `/packages/privacy/*` (if exists)
- UI: `/apps/site/src/pages/snail/*` (if exists)

*SHEEP ($SHEEP)* — Native token (rewards/engagement).  
- Contracts: `/contracts/sheep/*` (if exists)
- Package: `/packages/rewards-engine/`

*DREAM ($DREAM)* — Tradable token (economics).  
- Contracts: `/contracts/dream/*` (if exists)
- Package: `/packages/dream-token/`

*DreamScope UI* — Real‑time dashboard & visual diagnostics.  
- Code: `/client/src/pages/dreamscope-ui.tsx`, `/client/src/pages/dreamscope-alive.tsx`

*Halo-Loop* — Self-healing system analyzer & repair coordinator.  
- Code: `/packages/halo-loop/haloEngine.ts`
- Analyzers: `/packages/halo-loop/analyzers/*`
- Strategies: `/packages/halo-loop/strategies/*`
- Triggers: `/packages/halo-loop/triggers/*`

*Squad-Builder* — Task dispatch system for agent squads.  
- Code: `/packages/squad-builder/src/orchestrator.ts`
- Registry: `/packages/squad-builder/src/registry.ts`

*Event-Wormholes* — Event routing & transformation system.  
- Code: `/packages/event-wormholes/src/wormholeEngine.ts`
- Registry: `/packages/event-wormholes/src/wormholeRegistry.ts`

*Swarm Coordinator* — Multi-bot orchestration system.  
- Code: `/server/swarm-coordinator.ts`
- Routes: `/server/routes.ts` (swarm endpoints)

*Memory-DNA* — Agent/endpoint trait tracking & resonance.  
- Code: `/packages/memory-dna/`
- Stores: `/packages/memory-dna/store/*`

*Graft-Engine* — Dynamic endpoint/module installation system.  
- Code: `/packages/graft-engine/`
- Processors: `/packages/graft-engine/processors/*`

*Dark-Fabric* — Code diff & validation engine.  
- Code: `/packages/dark-fabric/src/`

*Spore-Engine* — Content distribution & lineage tracking.  
- Code: `/packages/spore-engine/src/`

*Alive-Mode* — System liveness & heartbeat tracking.  
- Code: `/packages/alive-mode/`

