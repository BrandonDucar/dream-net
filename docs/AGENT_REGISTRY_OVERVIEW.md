# DreamNet Agent Registry Overview

**Status:** Active
**Maintainer:** DreamKeeper
**Last Updated:** 2025-11-27

## Introduction

The DreamNet Agent Registry is the central directory for all autonomous agents operating within the network. It manages agent discovery, capabilities, access control, and health monitoring.

Currently, the registry operates in a hybrid mode:
1.  **SuperSpine (Core):** Handles real-time orchestration of user-facing agents (LUCID, CANVAS, etc.).
2.  **Agent Registry Core (System):** Manages infrastructure and background service agents.

## 1. User-Facing Agents (SuperSpine)

These agents are directly interactable by users and are managed by the `SuperSpine` system.

| Agent | Role | Tier | Access Requirements |
| :--- | :--- | :--- | :--- |
| **LUCID** | **Orchestrator** | Standard | Default |
| **CANVAS** | **Designer** | Standard | Default |
| **ROOT** | **Architect** | Standard | Trust Score > 60 |
| **CRADLE** | **Evolution** | Premium | Trust Score > 80 or Token Boost |
| **WING** | **Messenger** | Premium | Stake 1000 $SHEEP or 10 Dreams |
| **WOLF PACK** | **Funding** | Premium | Premium Subscription |

### Key Capabilities
- **Code:** LUCID, CANVAS, ROOT, CRADLE
- **Design:** CANVAS
- **Analysis:** LUCID, ROOT, CRADLE, WOLF PACK
- **Communication:** WING, WOLF PACK
- **Funding:** WOLF PACK

## 2. System & Infrastructure Agents

These agents operate in the background to maintain the DreamNet ecosystem.

| Agent ID | Name | Subsystem | Role |
| :--- | :--- | :--- | :--- |
| `agent:DreamOps` | DreamOps Orchestrator | DreamNet OS | System orchestration and DevOps |
| `agent:DeployKeeper` | DeployKeeper | Deployments | Deployment health and management |
| `agent:EnvKeeper` | EnvKeeper | Env Vars | Security and environment management |
| `agent:FieldLayer` | Field Layer Engine | FieldLayer | Trust and risk scoring |
| `agent:EconomicEngine` | Economic Engine | Economy | Rewards and simulation |
| `agent:ZenGarden` | Zen Garden | Wellness | Wellness monitoring |
| `agent:SocialHub` | Social Hub | Social | Feed and social interactions |

## 3. Integration & Wiring

### SuperSpine Wiring
- **Location:** `server/core/SuperSpine.ts`
- **Persistence:** PostgreSQL (`superSpineAgents` table) or In-Memory fallback.
- **Health Check:** Runs every minute to update `lastActiveAt` and mark inactive agents as `offline`.

### Registry Core Wiring
- **Location:** `packages/agent-registry-core`
- **Store:** `AgentStore` (In-memory/KV)
- **Scheduler:** Runs periodic cycles to refresh agent scores and health.

## 4. Deployment Core Integration

**Location:** `packages/deployment-core`
**Role:** Multi-platform deployment abstraction

The Deployment Core provides a unified interface for deploying to 15+ hosting platforms:
- DreamNet (native)
- Vercel, Netlify, Railway
- Cloudflare Pages, Render
- AWS Amplify, Azure Static Web Apps
- And more...

**Entry Point:** `getDeploymentManager()`
**Status:** Providers are stubbed; awaiting full implementation.

## 5. Interop Spine Integration

> [!NOTE]
> **Phase I Integration Complete**

The Spine integration is now active for key subsystems:
- **Shield Core:** Integrated via `ShieldCoreWrapper`
- **Browser Agent:** Integrated via `BrowserAgentWrapper`
- **Deployment Core:** Integrated via `DeploymentWrapper`

The Spine provides:
- **Event Bus:** `dreamnet-event-bus` (Active)
- **Wrappers:** Unified interfaces for all core systems.
- **BGP-for-Agents:** Ready for Phase II implementation.

See [SPINE_OVERVIEW.md](file:///c:/Users/brand/OneDrive/Documents/GitHub/dream-net/docs/SPINE_OVERVIEW.md) for the integration plan.

## 6. Governance

Agent governance is handled by **DreamKeeper**.
- **New Agents:** Must be registered via `SuperSpine.registerAgent` or added to `agent-registry-core` config.
- **Deprecation:** Agents are marked `offline` or removed from the active config.
