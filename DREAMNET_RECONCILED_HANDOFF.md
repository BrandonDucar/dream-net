# DreamNet Reconciled Handoff Report (Web/Cloud + Local Codex)

_Date: 2026-04-27 (UTC)_

## Executive summary
- **Canonical repo signal is mixed but strongest in-repo evidence points to `BrandonDucar/BrandonDucar-dream-net`** via `MIGRATION.md`; meanwhile local git in this workspace has **no remote configured**, so hosted branch/PR/action truth cannot be confirmed from this checkout alone.
- **Agent counts are from different layers/timeframes** (runtime diagnostics, curated registry JSONs, UI claims, and narrative docs), not one canonical source. The only machine-readable high-cardinality artifact in this repo is `data/viral-nano-swarm.json` (parsed count: 17,900).
- **Major contradictions remain**: docs claiming “launch/live/ready” conflict with diagnostics showing Neon endpoint disabled and deployment posture `replit_only` + `vercel_ready: false`.
- **Cloudflare reconciliation**: previous report said “not visible”; your local Antigravity scan now provides concrete Cloudflare resources. Repo still lacks direct Wrangler config/bindings, so the immediate unlock is to codify those resources into versioned config manifests.
- **Highest-value next step**: create a canonical evidence index + merged agent registry + deployment surface matrix, then enforce drift checks in CI.

## Canonical repo + deployment map

### Canonical repo signals
| Signal | Evidence | Interpretation |
|---|---|---|
| Canonical repo declaration | `MIGRATION.md` says canonical is `BrandonDucar/BrandonDucar-dream-net` | Strong in-repo architectural intent |
| Local git remote | `git remote -v` returned empty in this workspace | Current clone cannot query hosted GitHub branch/PR/actions state |
| Legacy/alternate repo reference | `vault_contents.json` contains artifact referencing `https://github.com/BrandonDucar/dream-net` | Historical/alternate repo lineage still present |
| User local path (new fact) | `c:\Users\brand\.antigravity\dream-net` | Treat as active local execution root for Antigravity Codex |

### Deployment surface map (reconciled)
| Surface | Repo evidence | User-local verified | Reconciled status |
|---|---|---|---|
| Vercel | Workflow + multiple `vercel.json` configs + docs | Not explicitly re-verified in this turn | Configured in code, operational truth needs live API check |
| Replit | Multiple docs mention Replit OIDC/deploy URLs | Not explicitly re-verified in this turn | Historically primary runtime surface |
| Neon | Diagnostics: endpoint disabled | Not explicitly re-verified in this turn | **Critical blocker unless locally bypassed** |
| Cloudflare Pages/D1/R2/KV | Minimal repo config evidence | **Verified locally**: Pages (`arya-frame`, `dreamnet-live`, `dadfi-org`, `dreamnet-ink`), D1 (`vanguard-54-db`), R2 (`dreamnet-cflare-bucket`), KV namespaces listed | Cloudflare is real in local environment; repo lacks IaC parity |
| GitHub Actions | `.github/workflows/dreamnet-ci-cd.yml` | Not directly queried in hosted GitHub | Pipeline code exists; runtime status unknown from this checkout |
| Docker/Event Bus | Repo has daemon + queue docs, no compose in root | **Verified locally**: Redis, NATS/JetStream, Kafka stack + DreamNet services | Local runtime exceeds what repo currently codifies |

## Agent count reconciliation table

| Count claim | Source | Timestamp / freshness | Type | Reconciled verdict |
|---|---|---|---|---|
| **5 macro agents** | `data/agents.json` has 5 top-level agents (`social`, `deploy`, `ingest`, `surgeon`, `prompt`) | File-local, no explicit timestamp | Structured data (registry-like) | Valid for this specific registry file only |
| **24 / 24 active** | `ops/DIAG_SUMMARY.json` (`agent_swarm: 24/24_active`), plus multiple docs | `2025-08-24T09:40:48.556Z` in DIAG file | Runtime diagnostic snapshot + doc repetition | Strong historical runtime signal for that snapshot window |
| **17,900 nano agents** | Parsed from `data/viral-nano-swarm.json` (array length via local parser) | Entries show `lastActivity` around `2025-10-09T21:05:36.503Z` | Large generated data artifact | Valid for nano-swarm dataset, not equivalent to macro/runtime control plane count |
| **21,271 nano agents** | `DEPLOYMENT_STATUS.md` | Doc timestamp line states `2025-01-19` | Narrative status doc | Stale/conflicting with 17,900 dataset; treat as older claim |
| **143 total agents + 4 stubs** | User-local verified `COMPREHENSIVE_AGENT_INVENTORY.json` (outside this repo snapshot) | New user assertion (current) | External local runtime inventory | Accept as current local truth pending file import into repo evidence index |
| **503+ agents** | Mentioned in prompts/search terms; no authoritative repo registry hit found | N/A | Narrative/aspirational | Unverified in this repo snapshot |
| **115 mini agents** | Mentioned in prompts/search terms; no authoritative repo registry hit found | N/A | Narrative/aspirational | Unverified in this repo snapshot |

### Practical reconciliation rule
Use **layered truth** instead of one number:
1. **Control-plane runtime count** (active orchestrated agents now).
2. **Registry count** (declared agents in canonical registry file).
3. **Swarm dataset count** (nano entities from generated/exported telemetry).
4. **Narrative/doc claims** (non-authoritative unless backed by 1-3).

## Cloudflare evidence table

### A) User-local verified Cloudflare assets (authoritative for this handoff)
| Resource class | Verified resources |
|---|---|
| Pages | `arya-frame`, `dreamnet-live`, `dadfi-org`, `dreamnet-ink` |
| D1 | `vanguard-54-db` |
| R2 | `dreamnet-cflare-bucket` |
| KV | `DREAMNET_AGENT_CACHE`, `dreamnet-secrets`, `DREAMNET_STATE`, `POLYGON_ORACLE_CACHE`, `VANGUARD_KV` |
| Queues | none listed |

### B) Repo-side Cloudflare config evidence
| Check | Finding |
|---|---|
| `wrangler.toml` / Wrangler project config | Not found in scanned repo root tree |
| Worker/Page bindings in IaC | Not found as canonical config files |
| Cloudflare references in lockfiles | Present as optional dependency capability (`@cloudflare/workers-types` peer dependency in `dreamnet/package-lock.json`) |
| Cloudflare secrets manifest in repo | Not found as explicit CF-managed bindings; only generic secret-name docs |

## Docker / event backbone evidence table

| Backbone surface | Repo evidence | User-local verified | Reconciliation |
|---|---|---|---|
| Redis | Referenced indirectly in architecture/docs; no canonical compose in root | Yes | Local runtime exists; codify in `docker-compose.dreamnet.yml` |
| NATS/JetStream | Referenced conceptually (event bus language) | Yes | Treat as active local bus; add explicit config + health checks to repo |
| Kafka/Zookeeper/Schema Registry/Kafka UI/REST/Exporter | Mentioned in docs/log artifacts and package ecosystem context | Yes | Local stack is real; repo should include explicit topology and contracts |
| DreamNet local services (`agent-health`, `message-bus`, `agent-spawn`, `signal-screener`) | Not centrally documented in one machine-readable file | Yes | Highest priority to define service contracts + ports + readiness probes |
| Daemon system | `daemon/*`, `pages/api/daemon/*`, `docs/DAEMON_CONTROL.md` | Unknown in this environment | Strong code presence; integrate with local container orchestration docs |

## Stubs / blockers table

| Blocker | Evidence | Impact | Needed action (no secrets) |
|---|---|---|---|
| Neon endpoint disabled vs launch-ready claims | `ops/DIAG_SUMMARY.json`, `COMPREHENSIVE_AUDIT_REPORT.md` | Auth + DB-dependent features degraded | Confirm whether local environment now uses alternative DB path; if not, enable endpoint and re-run health checks |
| Vercel ready vs not configured contradiction | `ops/DIAG_SUMMARY.json` says `vercel_ready: false`; other docs claim ready/live | Deployment confidence gap | Create single deployment truth file generated from live APIs |
| Cloudflare resources verified locally but absent in repo IaC | User-local Wrangler inventory vs repo lacking wrangler config | Drift + operational fragility | Export CF resource map into repo (names/IDs/env bindings only) |
| Agent count fragmentation (5/24/143/17,900/21,271/etc.) | Multiple sources with different semantics | Governance confusion | Build canonical multi-layer agent registry + provenance fields |
| GitHub canonical uncertainty from this checkout | No git remote in current workspace | Cannot verify hosted truth | Reattach remote(s) and run read-only GitHub inventory script |
| Secrets scattered across docs | Many env names across `config/*`, `ops/*`, docs | Onboarding/security risk | Generate secrets-name manifest (name, owner, location, rotation SLA) |

## Critical unlocks ranked 1-10
1. **Canonical registry merge pipeline** (`control-plane`, `registry`, `swarm`, `doc-claims` in one JSON).
2. **Deployment truth generator** (GitHub + Vercel + Cloudflare + Neon + Replit status snapshot to one file).
3. **Cloudflare IaC parity** (import verified Pages/D1/R2/KV inventory into repo config files).
4. **Daemon/container topology file** (codify Redis/NATS/Kafka/services with ports + health endpoints).
5. **Secrets-name manifest** (names only, no values; map to services + rotation).
6. **Inventory evidence index** (each claim → file path/line/timestamp/source type).
7. **Drift checks in CI** (fail when docs claim “ready/live” but diagnostics disagree).
8. **Health scoreboard endpoint** (`/api/inventory/status`) for all platform surfaces.
9. **Canonical repo/remotes guardrail** (script to assert expected remotes/branches).
10. **Term-map harvest for special entities** (Arya/HER/Claw families/etc.) with verified/no-hit output.

## Local Codex implementation checklist

### Verified facts to carry forward
- Canonical repository intent in docs points to `BrandonDucar/BrandonDucar-dream-net`.
- This workspace currently lacks configured git remotes.
- Repo diagnostics captured a degraded DB/deploy posture in August 2025 snapshots.
- User-local environment now confirms active Cloudflare resources and a richer Docker/event backbone than prior repo-only inventory.
- Agent counts represent different layers; do not collapse them into one raw number.

### Unresolved questions
- Which repo/branch is truly production-driving _today_ (`2026-04-27`)?
- Is Neon still the production blocker in your local active stack, or is local DB routing now primary?
- Which Cloudflare Pages project is canonical for `dreamnet.ink` right now?
- Is `COMPREHENSIVE_AGENT_INVENTORY.json` generated from runtime telemetry or manual curation?
- Are 503+/115 claims planned architecture targets or stale historical numbers?

### Exact files to inspect/change (local codex)
- `MIGRATION.md`
- `ops/DIAG_SUMMARY.json`
- `ops/integrations.flags.yaml`
- `ops/webhook-hygiene.yaml`
- `config/integration-registry.yaml`
- `config/secrets-management.yaml`
- `data/agents.json`
- `data/viral-nano-swarm.json`
- `.github/workflows/dreamnet-ci-cd.yml`
- `vercel.json`, `api/vercel.json`, `dreamnet/vercel.json`
- `docs/DAEMON_CONTROL.md`
- `vault_contents.json`
- **Add**: `docs/INVENTORY_EVIDENCE_INDEX.md`
- **Add**: `config/cloudflare-resources.yaml` (names/IDs only)
- **Add**: `config/agent-registry-canonical.json`
- **Add**: `scripts/inventory/reconcile-agent-counts.ts`
- **Add**: `scripts/inventory/deployment-truth.ts`

### Commands local Codex should run (read-only)
```bash
# 1) Canonical git truth
cd c:\Users\brand\.antigravity\dream-net
git remote -v
git branch -a
git rev-parse --abbrev-ref HEAD
git log --oneline -n 20

# 2) Agent count reconciliation inputs
python - <<'PY'
import json
for p in ['data/agents.json','data/viral-nano-swarm.json','COMPREHENSIVE_AGENT_INVENTORY.json']:
    try:
        with open(p,'r',encoding='utf-8') as f:
            d=json.load(f)
        if p.endswith('agents.json'):
            print(p,'macro_count',len(d.keys()))
        elif p.endswith('viral-nano-swarm.json'):
            print(p,'nano_count',len(d.get('nanoAgents',[])))
        else:
            print(p,'keys',list(d.keys())[:12])
    except Exception as e:
        print(p,'ERROR',e)
PY

# 3) Cloudflare inventory re-export (names only)
wrangler pages project list
wrangler d1 list
wrangler r2 bucket list
wrangler kv namespace list

# 4) Docker/event backbone snapshot
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

# 5) Repo-wide term hit map for special entities
rg -n -i "dreamstar|arya|project her|piclaw|pyclaw|flareclaw|kubeclaw|axo|jaggy|lmc|clawedette|felix|dreamstate|passport|blueprint|topology|sovereign|gnosis|farcaster|neynar|clawdchat|clawstore|flash guild|kafka|nats|jetstream|debezium|open claw|nemo claw|mirofish|bettafish|uniswap|polymarket|blackboard\.md|daemon" --glob '!attached_assets/**'

# 6) Contradiction report scaffold
a) compare docs claiming launch-ready vs ops/DIAG_SUMMARY.json
b) emit markdown table with source file + line + claim text + status
```

### Focused highest-value implementation plan
1. Build `config/agent-registry-canonical.json` with sections: `runtime`, `registry`, `swarm`, `claims`.
2. Implement `scripts/inventory/reconcile-agent-counts.ts` to produce deterministic count report + confidence score.
3. Add `config/cloudflare-resources.yaml` from Wrangler outputs (names/IDs only).
4. Implement `scripts/inventory/deployment-truth.ts` to consolidate GitHub/Vercel/Cloudflare/Replit/Neon state.
5. Add `docs/INVENTORY_EVIDENCE_INDEX.md` linking every major claim to source path + line + timestamp.
6. Wire CI drift check: fail on contradictions (e.g., `launch_ready=true` while `db.endpoint_disabled=true`).

---

## Search-term sweep status (this repo snapshot)
- **Hits found**: topology/topology routes, blueprint mentions, passport libs (auth), nano-related terms, kafka mentions in docs/vault artifacts, daemon files, uniswap mention in SDK strategy docs.
- **No clear canonical hits found** (in non-`attached_assets` scan) for many requested entities: `project her`, `piclaw/pyclaw/flareclaw/kubeclaw`, `jaggy`, `lil-miss-claw`, `clawedette`, `firefly.social`, `farcaster` (except prior report text), `neynar` (except prior report text), `clawstore.app`, `polymarket` (no strong config-level artifact), `blackboard.md`.
- Recommendation: maintain `docs/TERM_ENTITY_INDEX.md` with `{term, found:boolean, source, confidence}` for deterministic tracking.
