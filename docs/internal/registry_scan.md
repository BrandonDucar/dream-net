# Registry Scan Artifact

**Date:** 2025-11-26
**Scope:** `server/core`, `server/shared`, `packages/agent-registry-core`

## Summary
The DreamNet Agent Registry is currently a hybrid system:
1.  **SuperSpine (Monolith):** The active orchestration layer in `server/core`.
2.  **Agent Registry Core (Microservices):** A newer, configuration-based registry in `packages/agent-registry-core`.

## 1. SuperSpine Agents (Active)
*Source: `server/shared/agents.ts` & `server/core/SuperSpine.ts`*

These agents are actively loaded into the SuperSpine memory and database.

| Agent Key | Name | Tier | Unlock Condition | Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| `lucid` | LUCID | Standard | Default | code, analysis |
| `canvas` | CANVAS | Standard | Default | design, code |
| `root` | ROOT | Standard | Trust Score > 60 | code, analysis |
| `cradle` | CRADLE | Premium | Trust Score > 80 or Token Boost | code, analysis |
| `wing` | WING | Premium | Stake 1000 $SHEEP or 10 dreams | communication |
| `wolf-pack` | Wolf Pack | Premium | Premium Subscription | funding, communication, analysis |
| `glitch` | GLITCH | Nightmare | Hidden infection unlock | *Unknown* |

## 2. Agent Registry Core (Configuration)
*Source: `packages/agent-registry-core/logic/healthUpdater.ts`*

These agents are defined in the new registry format, likely for the microservices architecture.

| ID | Name | Kind | Subsystem | Tags |
| :--- | :--- | :--- | :--- | :--- |
| `agent:DreamOps` | DreamOps Orchestrator | infra | DreamNet OS | orchestration, devops |
| `agent:DeployKeeper` | DeployKeeper | infra | Deployments | deploy, health |
| `agent:EnvKeeper` | EnvKeeper | infra | Env Vars | env, security |
| `agent:WolfPack` | Wolf Pack Protocol | swarm | WolfPack | swarm, risk |
| `agent:SwarmPatrol` | Swarm Repair Patrol | swarm | Halo-Loop | repair, infra |
| `agent:FieldLayer` | Field Layer Engine | economy | FieldLayer | risk, trust, fields |
| `agent:EconomicEngine` | Economic Engine Core | economy | EconomicEngineCore | rewards, simulation |
| `agent:ZenGarden` | Zen Garden Core | wellness | ZenGardenCore | zen, wellness |
| `agent:DreamTank` | Dream Tank Incubator | governance | DreamTankCore | incubator, dreams |
| `agent:SocialHub` | Social Hub Core | social | SocialHubCore | social, feed |
| `agent:WolfPackFunding` | Wolf Pack Funding Core | economy | WolfPackFundingCore | funding, outreach, email |

## 3. Observations & Discrepancies
- **Wolf Pack Duplication:** "Wolf Pack" exists in both systems (`wolf-pack` vs `agent:WolfPack`).
- **Missing Core Agents in New Registry:** LUCID, CANVAS, etc., are not explicitly listed in `agent-registry-core` seeds, implying they might be treated differently or are yet to be migrated.
- **New Agents:** The new registry introduces infrastructure agents (`DreamOps`, `DeployKeeper`) not present in SuperSpine.
