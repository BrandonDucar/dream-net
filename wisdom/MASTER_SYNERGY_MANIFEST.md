# 🧠 The Master Synergy Manifest (DreamNet Thread Sync)

> [!IMPORTANT]
> This document is designed for **Antigravity Agents** (or other LLM-based researchers) to quickly ingest the progress, architectural decisions, and "masteries" established in the primary development thread.

## 📍 Current Project State (as of Jan 2026)

* **Vercel Target**: `dreamnet.ink`
* **Architecture**: Monorepo (pnpm).
* **Core Systems**: `packages/server` (Express/Node), `packages/client` (Vite/React), `packages/agents` (Agent Framework).
* **Critical Sector**: Sector 7 (Generative Reality & UI) - Avenue 35: Data Sonification.

## 🏆 Mastered Implementations

### 1. The Heartbeat (Data Sonification)

* **Audio Engine**: Singleton pattern in `packages/client/src/systems/AudioEngine.ts`. Uses `Howler.js` + Procedural Tone fallback.
* **Visualizer**: `MetabolicWidget.tsx` (Global UI component) for canvas-based waveform visualization.
* **Integration**: Global `App.tsx` integration with `GravRemote`.

### 2. Reliability Guard & Sovereign Core

* **Backend Health**: `/health` endpoint updated to return `watchman: "ACTIVE"`.
* **Docker Hygiene**: Resolved complex merge conflicts in `Dockerfile` and `.dockerignore` to support Sovereign topological builds.
* **Agent Resilience**: `AgentGuild.ts` now uses `Promise.allSettled` for robust booting of the agent hive.

### 3. Vercel Deployment Troubleshooting

* **Dependency Resolution**: Fixed `@coinbase/onchainkit` versioning issues and missing `howler`/`styled-components` types.
* **Import Optimization**: Identified and removed duplicate `OmniDashboard` lazy imports that were crashing production builds.

## 🛠️ Operational Protocol (For Agents)

1. **Memory Access**: Read the full artifacts in `.gemini/antigravity/brain/` for deep context on "Mind Heist" avenues.
2. **Git Safety**: If an agent gets stuck during a rebase or push, check for `.git/index.lock` and running `git.exe` processes.
3. **Vercel Control**: Use the Vercel CLI with the provided service tokens (check environment variables or secure storage notes) rather than just pushing to `main` if UI updates are slow.

## 📂 Key File Map

* `packages/client/src/App.tsx`: Main routing and global component hive.
* `packages/server/src/index.ts`: The "Reliability Guard" entry point.
* `wisdom/`: High-level abstractions and agentic strategy logs.
