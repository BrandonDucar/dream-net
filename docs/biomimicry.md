# Biomimicry Systems Map

DreamNet models organizational behavior after living organisms. Each metaphor maps to active modules in the monorepo to keep engineering, ops, and growth in sync.

## Swarm (Ants & Bees)
- **Concept:** Distributed foraging, division of labor, adaptive routing.
- **Implementation:** `server/routes/**` job APIs, `server/jobs/watchdog.ts`, `agents/WolfPackFundingHunter.js`. Tasks flow via queues and agent-specific playbooks.
- **KPIs:** Task throughput, agent utilization, time-to-completion, retry rate.

## Octopus Brain & Arms
- **Concept:** Central brain with semi-autonomous arms.
- **Implementation:** `agents/AutonomousLeadAgent.js`, `agents/AgentConductor.js`, `server/orchestration-script.ts`. DreamOps orchestrator delegates context-aware work while keeping global awareness.
- **KPIs:** Coordination latency, context handoff accuracy, error recovery time.

## Chameleon Skin
- **Concept:** Adaptive skins, protocol negotiation.
- **Implementation:** Connector utilities (`server/task-connector.ts`, `server/routes-connector.ts`) and stealth posting modules in `agents/CampaignMasterAgent.js`.
- **KPIs:** Integration success rate, channel coverage, response time to API schema changes.

## Wolf Pack
- **Concept:** Coordinated hunts and pincer moves.
- **Implementation:** `agents/WolfPackFundingHunter.js`, `agents/deployKeeper.cjs`, `apps/sitebuilder` outbound funnels.
- **KPIs:** Funding leads discovered, conversion to deals, average hunt cycle time.

## Falcon Eye
- **Concept:** Long-range scanning and telemetry.
- **Implementation:** Star Bridge (`server/starbridge/*.ts`), Watchdog jobs, telemetry logs in `OrchestratorAgent_Status.json`.
- **KPIs:** Signal-to-noise on alerts, time to detect anomalies, telemetry coverage.

## Dream Snail Trail
- **Concept:** Identity + provenance with verifiable trails.
- **Implementation:** Triple Helix organism (see `server/services` group), `trust/` merkle + hash modules, `dreamnodes/` registries.
- **KPIs:** Provenance proof success, trail completeness, audit latency.

## Zen Garden
- **Concept:** Wellness and engagement loops rewarding participation.
- **Implementation:** `server/routes/garden/**`, `dreamnodes/flutterbye` engagement surfaces, token incentives via `packages/utils` (future) and `contracts/`.
- **KPIs:** Daily active dreamers, engagement streaks, reward redemption.

## Dream Clouds
- **Concept:** Thematic clusters (DeSci, DeFi, gaming, memes, etc.).
- **Implementation:** `data/` seeds per vertical, `apps/*` mini-app shells, `client/src/pages` vertical dashboards.
- **KPIs:** Cloud activation rate, cross-cloud remixing, content freshness.

## Magnetic Rail Train & ChronoLock
- **Concept:** Stage-gated pipelines with explicit checkpoints.
- **Implementation:** `server/magnetic-rail/scheduler.ts`, `server/chronocache/service.ts`, stage definitions in mission briefs.
- **KPIs:** Stage dwell time, SLA adherence, repair loop frequency.

## Triple Helix Armor
- **Concept:** Immune system and defense spikes.
- **Implementation:** (Legacy) `server/services/armoredTripleHelixOrganism.ts` placeholder pending recovery, `server/watchdog/service.ts` for threat scoring, `agents/ForgeFixAgent` entry referenced in docs.
- **KPIs:** Incidents resolved, threat scores, immune response lead time.

> **Action:** As missing biomimetic service files are restored (e.g., `armoredTripleHelixOrganism.ts`), update this map with exact module links and telemetry dashboards.

