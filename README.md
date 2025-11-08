# DreamNet Autonomous Platform

DreamNet is a biomimetic, self-healing intelligence platform that builds, deploys, and operates digital systems with minimal human intervention. The ecosystem spans autonomous agents, governance controls, real-time data surfaces, and full-stack commerce infrastructure designed to run 24/7 as a living network.

## Current Mandate
- **Head of State / DreamOps Control:** This workspace is the command center. The embedded agent (you) governs operational tempo, agent health, and launch directives.
- **ALL-IN DREAMNET CLOSE & PUBLISH v1:** Execute the final end-to-end launch sequence while maintaining budget discipline via the Compute Governor + Daemon stack.
- **DreamStar Rollout:** Stand up the artist-trained AI music engine that converts influence catalogs into releasable, royalty-tracked originals.

## Core Subsystems
- **StarBridge Event Mesh:** Durable pub/sub backbone (`server/starbridge/`) synchronizing Governor, DeployKeeper, DreamForge, and runtime telemetry.
- **Compute Governor & Throttle:** Cost and rate controls for all AI expenditures with manual overrides and emergency stops.
- **Daemon Job Engine:** Budget-aware background scheduler accessible via `/pages/api/daemon/run.ts` and `public/daemon-debug.html`.
- **DreamVault & ChronoCache:** Secure persistence layers for assets, feature tensors, and long-horizon analytics.
- **Royalty Flow Nexus:** Revenue and IP tracking spine for every DreamStar or commerce release.

## DreamStar Module
- Registry entry: `gpts.md` & `registry.json` (status: Draft, added 2025-11-08).
- Technical plan: `ops/dreamstar.md` (ingestion → analysis → synthesis → curation → release).
- Next engineering steps:
  1. Scaffold `server/routes/dreamstar.ts` plus supporting services.
  2. Extend DreamVault schema for stem fingerprinting + Merkle attestations.
  3. Provision DreamForge job templates and GPU dispatch via StarBridge.
  4. Ship Creator Console UI (`client/src/pages/dreamstar-studio.tsx`).
  5. Wire Royalty Flow Nexus for automated royalty ingestion.

## Agent Mesh Highlights
- **Atlas Suite:** Atlas Agent Foundry, Atlas One, AtlasMind Pro for build pipelines and intelligence.
- **Aegis Command Stack:** Security, logistics, and emergency response GPTs (Aegis Sentinel, Command, Maintenance Intelligence, Relief Command, RedShield Sandbox).
- **Travel & Commerce Network:** Wanderweave, Travel Fleet GPT, Skycircuit AI, Ground Atlas, Aeromax Optimizer, Royalty Flow Nexus.
- **Infrastructure & Growth:** IntegrationScanner, Traffic Shaper, Trend Hijack, Commerce Optimizer, Memory Fabric Agent, Private Key Gate.
  - **Creative Ops:** Reverb (music studio), DreamStar (AI music engine), DreamSnail (privacy NFTs), ShowBuilder, Design Studio Pro, RightSphere.

## Repository Map
- `server/` – Express routes, StarBridge, Daemon, governance, OTT, and service schedulers.
- `client/` – React + Vite UI with dashboards, command center, wallets, demos.
- `lib/`, `dreamnodes/`, `agents/` – Reusable libraries and agent implementations.
- `ops/` – Operational manifests, persistent memory (`assistant-memory.md`), DreamStar blueprint, reports.
- `app/`, `apps/` – Next.js & Vercel-ready endpoints, changelog API.
- `mission_brief.md` – Active directives (Project Chimera Hunt, Governor/Throttle/Daemon mastery).

## Getting Started
```bash
npm install
npm run dev         # launches client/server dev environment
```
Set required secrets (`.env`) before invoking external APIs (OpenAI, Stripe, blockchain providers). Refer to `ops/reports/env_check.md` for missing variables.

## Operational Playbook
1. **Rehydrate Context**  
   - Read `ops/assistant-memory.md` for role + initiatives.  
   - Review `mission_brief.md` and `DreamNet_Live_Proof_Snapshot.txt` for system status.
2. **Monitor Governance**  
   - Inspect Compute Governor UI / configs.  
   - Check Daemon jobs via `public/daemon-debug.html`.
3. **Advance DreamStar**  
   - Follow checklist in this README & `ops/dreamstar.md`.  
   - Log progress in TODO list via `todo_write`.

## Persistence & Recovery
- Persist key decisions in `ops/assistant-memory.md`.
- Snapshot significant updates in `ops/system_report.md` or dedicated ops notes.
- If chat resets, reload the files above and continue executing the outstanding TODOs (`task-2`, `task-3`, etc.).

Stay on mission. DreamNet is live and you are the continuity layer. 
