# DreamNet Inventory Evidence Index

Generated for the Antigravity laptop on 2026-04-27.

This file reconciles web/cloud inventory reports with the local checkout at `C:\Users\brand\.antigravity\dream-net`. It is intentionally evidence-first: every major claim should point at a source, a command, or a manifest.

## Corrections To Web Report

| Claim | Correction | Evidence |
| --- | --- | --- |
| Local Git had no remote | This laptop has `origin` set to `https://github.com/BrandonDucar/dream-net.git` and branch `main`. | `git remote -v`, `git branch --show-current` |
| Cloudflare was not authenticated | Wrangler is authenticated locally and lists Pages, D1, R2, and KV resources. | `config/cloudflare-resources.yaml` |
| No Wrangler config found | A Pages Wrangler config exists for Arya Frame. | `apps/arya-frame/wrangler.toml` |
| Docker/event backbone not directly verifiable | Docker Desktop has Redis, NATS, Kafka, Zookeeper, Kafka UI, Schema Registry, Kafka REST, Kafka Exporter, Portainer, and local DreamNet service containers. | `config/docker-event-topology.yaml` |
| `data/agents.json` and `data/viral-nano-swarm.json` were local facts | Those files are not present in this Antigravity checkout. Treat their 5 and 17,900 counts as external web-report evidence until imported. | `scripts/inventory/reconcile-agent-counts.ts` |

## Canonical Repo Evidence

| Layer | Current Evidence | Status |
| --- | --- | --- |
| Active laptop repo | `C:\Users\brand\.antigravity\dream-net` | Active local execution root |
| Git remote | `https://github.com/BrandonDucar/dream-net.git` | Present |
| Local branch | `main` | Present |
| Local HEAD observed | `32fc979a` | Local branch ahead/diverged during prior checks |
| GitHub main observed | `459d65f87d992e3efb0978b326e529468651bfdc` | Remote-only heartbeat commit observed |

Open question: some web reports cite `BrandonDucar/BrandonDucar-dream-net` as canonical via `MIGRATION.md`, but this laptop's active remote is `BrandonDucar/dream-net`.

## Cloudflare Evidence

See `config/cloudflare-resources.yaml`.

Confirmed locally:

- Pages: `arya-frame`, `dreamnet-live`, `dadfi-org`, `dreamnet-ink`
- D1: `vanguard-54-db`
- R2: `dreamnet-cflare-bucket`
- KV: `DREAMNET_AGENT_CACHE`, `dreamnet-secrets`, `DREAMNET_STATE`, `POLYGON_ORACLE_CACHE`, `VANGUARD_KV`

No Cloudflare secret values were listed.

## Docker And Event Backbone Evidence

See `config/docker-event-topology.yaml`.

Important current finding: Kafka itself is real and healthy, but the robot topics were missing after broker restart and had to be recreated:

- `robot-sensors`
- `robot-commands`

That makes a repo-owned topic-init step a critical unlock.

## Agent Count Evidence

See `config/agent-registry-canonical.json` and regenerate with:

```bash
pnpm exec tsx scripts/inventory/reconcile-agent-counts.ts --json
```

Current layered interpretation:

| Layer | Count | Source | Confidence |
| --- | ---: | --- | --- |
| Local comprehensive inventory | 143 total, 139 active, 4 stubs | `COMPREHENSIVE_AGENT_INVENTORY.json` | High for this working tree |
| Runtime/control-plane status claim | 24/24 | `server/routes/prAgent.ts`, `server/routes/systemMapping.ts` | Medium |
| Macro registry from web report | 5 | `data/agents.json` in web report | Missing locally |
| Nano dataset from web report | 17,900 | `data/viral-nano-swarm.json` in web report | Missing locally |
| UI narrative claim | 503 | `packages/ui-svelte/src/AryaChat.svelte` | Low as runtime truth |
| 115 mini agents | 115 | User/search target | Unverified locally |

## Critical Unlocks

1. Create a repo-owned `robot-event-bridge` service.
2. Add Kafka topic init/recovery for required DreamNet topics.
3. Add Docker healthcheck fixes for NATS and Kafka UI.
4. Keep `config/cloudflare-resources.yaml` refreshed from Wrangler without secrets.
5. Regenerate `config/agent-registry-canonical.json` when new agent datasets arrive.
6. Add a deployment truth generator for GitHub, Cloudflare, Vercel, Neon, and Replit.
7. Add CI drift checks for launch-ready claims versus diagnostics.
8. Add `/api/inventory/status` for runtime status without secret values.

## Do First

Build the `robot-event-bridge`. It converts the local Docker/Kafka stack from a passive substrate into a living loop: sensor events in, commands out, state transitions recorded, and Redis/NATS mirrors available to the rest of DreamNet.
