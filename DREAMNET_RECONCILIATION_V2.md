# DreamNet Reconciliation V2 (Implementation-Ready Handoff)

_Date: 2026-04-27 (UTC)_

## Corrections to prior report
1. **Remote configuration statement corrected**:
   - In **this current workspace** (`/workspace/BrandonDucar-dream-net`), `git remote -v` is empty and branch is `work`.
   - In your **Antigravity laptop environment** (`C:\Users\brand\.antigravity\dream-net`), you provided validated git facts: `origin=https://github.com/BrandonDucar/dream-net.git`, branch `main`, local HEAD `32fc979a`, GitHub main `459d65f8`.
   - These are not contradictory once environment scope is separated.
2. **Cloudflare config correction**:
   - Prior report said no Wrangler config found in this checkout root; that is still true for this workspace.
   - You provided a verified path in local canonical repo: `apps/arya-frame/wrangler.toml`.
3. **Heartbeat correction**:
   - You reported remote-only heartbeat update touching `bridge/heartbeat/lil-miss-claw.json`.
   - Public GitHub view confirms this file exists on `BrandonDucar/dream-net` main and includes a `2026-04-26` timestamp in-file.

## Updated canonical repo verdict

### Verdict
**Canonical operational repo should be treated as `BrandonDucar/dream-net` (main) for current local execution**, with `BrandonDucar/BrandonDucar-dream-net` treated as historical consolidation intent unless currently reachable and proven active in your local runtime.

### Reconciliation evidence
- `MIGRATION.md` in this workspace claims canonical was `BrandonDucar/BrandonDucar-dream-net` (historical consolidation statement).
- Antigravity local git facts show active runtime repo is `BrandonDucar/dream-net` on `main` with divergence between local and remote heads.
- GitHub web view (public) confirms `BrandonDucar/dream-net` exists, branch `main`, and contains `bridge/heartbeat/lil-miss-claw.json`.

### Practical canonical rule
Use a **two-axis canonical model**:
1. **Execution canonical** = what Antigravity laptop is currently running (`dream-net` main).
2. **Consolidation canonical** = what migration docs historically designated (`BrandonDucar-dream-net`).

Then resolve drift by evidence index + sync plan instead of narrative preference.

## Updated Cloudflare verdict

### Verified local Cloudflare resources (authoritative now)
- Pages: `arya-frame`, `dreamnet-live`, `dadfi-org`, `dreamnet-ink`
- D1: `vanguard-54-db`
- R2: `dreamnet-cflare-bucket`
- KV: `DREAMNET_AGENT_CACHE`, `dreamnet-secrets`, `DREAMNET_STATE`, `POLYGON_ORACLE_CACHE`, `VANGUARD_KV`
- Queues: none listed

### Repo alignment state
- This workspace does not contain a root `wrangler.toml`.
- Local canonical repo reportedly contains `apps/arya-frame/wrangler.toml` (needs commit pin + import into evidence index).
- Action: treat Cloudflare as **live + verified**, but IaC parity is incomplete until resource manifest and bindings are committed and versioned.

## Updated Docker / event bus verdict

### Verified local runtime reality
- Kafka/NATS/Redis and DreamNet service containers are alive.
- Kafka topics `robot-sensors` and `robot-commands` exist.
- Offsets are `0` and consumer groups are empty, so broker exists but robot-agent loop is idle/inactive.

### Operational interpretation
- **Infrastructure plane**: healthy-enough (brokers online).
- **Control/data plane**: not yet flowing (no consumers / no offset movement).
- Immediate unlock is not provisioning infra; it is wiring producer/consumer loops + health/lag telemetry.

## Updated agent-count reconciliation

| Count | Source | Classification | Current status |
|---|---|---|---|
| 5 | `data/agents.json` in this repo | Structured registry-like file | Valid for macro registry subset only |
| 24/24 | `ops/DIAG_SUMMARY.json` + audit docs | Historical runtime snapshot (Aug 24, 2025) | Useful but stale for present-tense operations |
| 143 (+4 stubs) | Antigravity `COMPREHENSIVE_AGENT_INVENTORY.json` | Current local runtime/registry evidence | Treat as current local truth pending repo import |
| 17,900 | `data/viral-nano-swarm.json` parsed count | Generated swarm dataset | Valid dataset cardinality, not macro orchestrator count |
| 21,271 | `DEPLOYMENT_STATUS.md` | Narrative/status doc claim | Older conflicting claim, likely stale |
| 503+ / 115 mini | prompts/narrative references | Aspirational/narrative | Unverified without canonical registry artifacts |

### Resolution policy
Never publish a single “agent total” without scope label:
- `macro_active`
- `macro_declared`
- `mini_declared`
- `nano_dataset`
- `narrative_claim`

## Implementation-ready data schemas

### 1) Canonical Agent Registry (`config/agent-registry-canonical.json`)
```json
{
  "generated_at": "2026-04-27T00:00:00Z",
  "sources": [
    {"name": "antigravity_inventory", "path": "COMPREHENSIVE_AGENT_INVENTORY.json", "commit": "<sha>", "confidence": "high"},
    {"name": "repo_macro_registry", "path": "data/agents.json", "commit": "<sha>", "confidence": "medium"},
    {"name": "nano_dataset", "path": "data/viral-nano-swarm.json", "commit": "<sha>", "confidence": "high"},
    {"name": "diagnostic_snapshot", "path": "ops/DIAG_SUMMARY.json", "timestamp": "2025-08-24T09:40:48.556Z", "confidence": "medium"}
  ],
  "counts": {
    "macro_active": 0,
    "macro_declared": 0,
    "mini_declared": 0,
    "nano_dataset": 0,
    "stubs": 0,
    "narrative_claims": [503, 115]
  },
  "agents": [
    {
      "id": "string",
      "family": "macro|mini|nano",
      "role": "string",
      "status": "active|inactive|stub|unknown",
      "source": "string",
      "source_ref": "path_or_url",
      "last_seen": "ISO8601",
      "runtime_verified": true
    }
  ],
  "conflicts": [
    {
      "field": "counts.macro_active",
      "values": [24, 143],
      "resolution": "prefer_antigravity_runtime",
      "notes": "DIAG snapshot is historical"
    }
  ]
}
```

### 2) Cloudflare Resource Manifest (`config/cloudflare-resources.yaml`)
```yaml
generated_at: "2026-04-27T00:00:00Z"
account_alias: "dreamnet"
source: "wrangler_cli"
resources:
  pages:
    - name: arya-frame
    - name: dreamnet-live
    - name: dadfi-org
    - name: dreamnet-ink
  d1:
    - name: vanguard-54-db
  r2:
    - name: dreamnet-cflare-bucket
  kv:
    - name: DREAMNET_AGENT_CACHE
    - name: dreamnet-secrets
    - name: DREAMNET_STATE
    - name: POLYGON_ORACLE_CACHE
    - name: VANGUARD_KV
  queues: []
bindings:
  - app: apps/arya-frame
    wrangler_file: apps/arya-frame/wrangler.toml
    envs: [dev, staging, prod]
notes:
  - "No secret values stored here"
```

### 3) Docker/Event Topology (`config/docker-event-topology.json`)
```json
{
  "generated_at": "2026-04-27T00:00:00Z",
  "brokers": {
    "kafka": {"running": true, "topics": ["robot-sensors", "robot-commands"]},
    "nats_jetstream": {"running": true, "streams": []},
    "redis": {"running": true}
  },
  "services": [
    {"name": "agent-health", "running": true, "produces": [], "consumes": []},
    {"name": "message-bus", "running": true, "produces": [], "consumes": []},
    {"name": "agent-spawn", "running": true, "produces": [], "consumes": []},
    {"name": "signal-screener", "running": true, "produces": [], "consumes": []}
  ],
  "kafka_runtime": {
    "topics": [
      {"name": "robot-sensors", "offsets_total": 0, "consumer_groups": 0},
      {"name": "robot-commands", "offsets_total": 0, "consumer_groups": 0}
    ],
    "robot_loop_active": false
  },
  "alerts": [
    "Broker up but no consumer groups attached",
    "No offset movement on robot topics"
  ]
}
```

## Exact files to add/edit for local Codex

### Add
- `config/agent-registry-canonical.json`
- `config/cloudflare-resources.yaml`
- `config/docker-event-topology.json`
- `docs/INVENTORY_EVIDENCE_INDEX.md`
- `docs/REPO_CANONICAL_DECISION_LOG.md`
- `scripts/inventory/reconcile-agent-counts.ts`
- `scripts/inventory/export-cloudflare-resources.ts`
- `scripts/inventory/export-docker-topology.ts`
- `scripts/inventory/generate-deployment-truth.ts`
- `scripts/inventory/check-drift.ts`
- `scripts/bridge/robot-event-bridge.ts` (NATS↔Kafka glue + heartbeat)

### Edit
- `MIGRATION.md` (append current canonical decision + date)
- `README.md` (canonical repo + runtime truth references)
- `.github/workflows/dreamnet-ci-cd.yml` (add drift check job)
- `ops/DIAG_SUMMARY.json` generation path (if generated, include source commit)

## Commands to verify (read-only)
```bash
# Canonical git truth (Antigravity repo)
cd C:\Users\brand\.antigravity\dream-net
git remote -v
git branch --show-current
git rev-parse --short HEAD
git fetch origin
git rev-parse --short origin/main
git log --oneline -- bridge/heartbeat/lil-miss-claw.json

# Cloudflare truth
wrangler pages project list
wrangler d1 list
wrangler r2 bucket list
wrangler kv namespace list

# Docker + event bus truth
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
# Kafka checks (adapt container names)
docker exec -it <kafka_container> kafka-topics --bootstrap-server localhost:9092 --list
docker exec -it <kafka_container> kafka-consumer-groups --bootstrap-server localhost:9092 --all-groups --describe

# Topic activity proof
# Expect 0 offsets / no groups currently for robot-* topics
```

## Term search reconciliation (by location class)

| Term/group | Present in canonical repo | Present only untracked Antigravity files | Present only Gordon/Docker cagent workspaces | Present only narrative docs | Not found |
|---|---|---|---|---|---|
| `lil-miss-claw` | Yes (GitHub `bridge/heartbeat/lil-miss-claw.json`) | Possible | Unknown | Yes | No |
| `arya` / `arya-frame` | User-verified local path/config (`apps/arya-frame/wrangler.toml`) | Likely | Unknown | Some mentions | In this workspace checkout: not found |
| `kafka`, `nats`, `jetstream`, `daemon` | Yes (docs/code mentions) | Also present in local runtime tooling | Yes (runtime infra) | Yes | No |
| `project her`, `piclaw/pyclaw/flareclaw/kubeclaw`, `clawedette` | Not evidenced in this checkout scan | Possible | Possible | Some prompt/narrative traces | Mostly not found in canonical code scan |
| `sovereign`, `gnosis`, `passports`, `blueprints`, `topology` | Topology/blueprint/passport hits exist; sovereign/gnosis weaker | Possible | Unknown | Yes | Partial |
| `farcaster`, `neynar`, `clawstore.app`, `polymarket`, `blackboard.md` | Weak/no strong config-level hits in this checkout | Possible | Possible | Some narrative references | Mostly not found in canonical code scan |

> Use `docs/TERM_ENTITY_INDEX.md` to turn this into deterministic evidence with commit hashes.

## Top 10 implementation tickets for local Codex (re-ranked)
1. **robot-event-bridge MVP** (`scripts/bridge/robot-event-bridge.ts`): produce/consume loop for `robot-sensors` and `robot-commands`, heartbeat every 30s.
2. **canonical agent registry** (`config/agent-registry-canonical.json` + reconcile script).
3. **Cloudflare resource manifest** (`config/cloudflare-resources.yaml` from Wrangler output).
4. **Docker daemon topology export** (`config/docker-event-topology.json`).
5. **Inventory evidence index** (`docs/INVENTORY_EVIDENCE_INDEX.md`).
6. **Deployment truth generator** (repo+cloud status snapshot).
7. **Drift checks** in CI (doc claims vs measured truth).
8. **Canonical repo decision log** with dated decisions + rollback path.
9. **Heartbeat parity task** (sync `bridge/heartbeat/lil-miss-claw.json` divergence locally).
10. **Term/entity index** to separate canonical vs narrative vs external workspace artifacts.

## Do first (recommended)
**Do Ticket #1: robot-event-bridge MVP first.**

### Rationale
- Your infrastructure is already up (Kafka/NATS/Redis + services running), but the robot loop is idle (offsets 0, no consumers).
- Activating one real producer/consumer + heartbeat provides immediate runtime signal and validates bus plumbing end-to-end.
- Once loop is active, the remaining registry/inventory/drift work can measure real data instead of static assumptions.
