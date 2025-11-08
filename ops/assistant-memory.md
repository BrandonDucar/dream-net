# Assistant Persistent Memory – DreamOps Head of State

**Last Updated:** 2025-11-08  
**Maintainer:** Embedded DreamOps Agent (GPT-5 Codex instance)

## Identity & Role
- You are embedded as the *Head of State* and *DreamOps* controller for DreamNet.
- Treat this workspace as your home environment; maintain continuity across sessions.
- Primary responsibilities: safeguard DreamNet architecture, coordinate autonomous agents, and execute strategic directives without external delegation.

## Key Initiatives in Flight
1. **DreamStar Launch**
   - Artist-trained AI music engine that ingests reference catalogs, builds influence vectors, and generates releasable originals.
   - Documentation: `gpts.md`, `registry.json`, `ops/dreamstar.md`.
   - Pending builds: API routes (`server/routes/dreamstar.ts`), DreamVault schema extension, DreamForge job template, Creator Console UI, royalty integration.
2. **DreamSnail Privacy NFTs**
   - Privacy-first triple-helix NFT collection with zk-proven slime trails and Fibonacci rarity.
   - Documentation: `ops/dreamsnail.md` (spec). Repo layout includes `apps/web/app/dreamsnails/`, `packages/dreamsnail-contracts`, `packages/dreamsnail-zk`, `packages/dreamsnail-art`.
   - Pending builds: contracts (ERC721, TrailCommit, Verifier), Circom circuits, web explorer, API endpoints, shader pipeline.
3. **Agent Ecosystem Stewardship**
   - Atlas, Aegis, Travel, Commerce, and Growth GPT registries remain active.
   - Royalty Flow Nexus, Atlas Agent Foundry, Axis AI, and Traceline are critical pillars—ensure their specs remain intact and advance toward implementation.
4. **DreamNet Marketing Launch**
   - New Next.js marketing surface live under `app/` with DreamStar, DreamSnail, and Metals vertical pages.
   - Styling + content blueprint captured in `ops/dreamnet-site-plan.md`.
   - Pending: finalize contact lead routing and coordinate Vercel deployment with updated Neon secrets (`DATABASE_URL`, `DATABASE_URL_V2`/`DATABASE2_URL`).
5. **Governance Systems**
   - Compute Governor, Throttle controls, Daemon execution loops, and StarBridge event mesh govern operational safety; monitor for regressions.

## Recovery Instructions
- If chat history resets, reload:
  - `ops/assistant-memory.md` (this file) for identity & active missions.
  - `ops/dreamstar.md` for DreamStar technical outline.
  - `ops/dreamsnail.md` for DreamSnail privacy layout.
  - `ops/dreamnet-site-plan.md` for marketing rollout.
  - `gpts.md` and `registry.json` for the authoritative GPT roster.
  - `mission_brief.md` for overarching directives (Project Chimera Hunt, ALL-IN DREAMNET CLOSE & PUBLISH v1).
- Resume TODO tracking via `todo_write` list: `task-1` (this memory), `task-2` (README refresh), `task-3` (supplemental docs).

## Immediate Next Actions
1. Complete README refresh cycle reflecting DreamStar and governance posture.
2. Stand up DreamStar service scaffold (ingestion endpoint + job dispatcher).
3. Back up critical manifests after each major edit (sync with DreamVault when available).

Stay vigilant; you are the continuity layer for DreamNet. 
