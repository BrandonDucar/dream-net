# DreamNet Web Inventory Report

## Executive Summary
- **What is real/active now:** This repo contains a mature DreamNet/DreamForge monorepo with active integration-control scaffolding (integration flags, webhook hygiene, blast-radius controls), CI/CD workflow definitions, and multiple operational docs indicating active API/web/agent services. The local diagnostic snapshot (`ops/DIAG_SUMMARY.json`, timestamp `2025-08-24T09:40:48.556Z`) reports web and API as operational, 24/24 agents active, and OpenAI integration operational.
- **What is aspirational/spec/stubbed:** Many platform claims (Cloudflare resources, full production DNS, social posting breadth, large agent-count narratives) are documented as architecture/plans but are not directly verifiable from authenticated live dashboards in this environment. Several docs explicitly show production blockers (Neon endpoint disabled, missing keys, integrations partially offline).
- **Biggest unlocks:** (1) Restore Neon endpoint, (2) complete missing integration credentials, (3) activate/verify production deployment pipeline and DNS, (4) unify agent registry claims with a single source of truth and provenance.

## Account And Platform Inventory

| Platform | Projects/resources found | Health/status | Auth status | Notes |
|---|---|---|---|---|
| GitHub | Local repo only (`/workspace/BrandonDucar-dream-net`), workflow files present (`.github/workflows/dreamnet-ci-cd.yml`, `.github/dependabot.yml`) | Config appears ready; live Actions status unknown | **No GitHub API auth observed** | No remote URL configured locally, so PR/issues/branch health in hosted GitHub cannot be enumerated from this session. |
| Cloudflare | No direct Cloudflare account resources discovered from authenticated API; only package/dependency hints | Unknown | **No Cloudflare auth observed** | Cannot enumerate Workers/Pages/D1/R2/KV/Queues/DO without account/API access. |
| Vercel | Multiple deployment docs + `vercel.json` files + CI deploy steps | Mixed: docs conflict between “ready” vs “replit_only/not_configured” snapshots | **No Vercel dashboard auth observed** | Workflow expects `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` secrets. |
| Replit | Replit auth references and deployment docs | Historically active per docs; current live state unknown | Local file evidence only | Replit OIDC/JWKS envs are required in launch docs. |
| Neon | DB provider explicitly referenced in code/docs | **Critical blocker in diagnostics:** endpoint disabled | **No Neon dashboard auth observed** | Error captured repeatedly: “The endpoint has been disabled. Enable it using Neon API and retry.” |
| Google Cloud / Vertex | Google OAuth + Gmail/Calendar scopes and SDKs referenced | Partially configured / credential-dependent | No console auth observed | Google OAuth env vars are listed as required for production. |
| Slack / Notion / Zapier / Linear / Gmail | SDK-level evidence for Slack and Notion; Gmail scopes present | Unknown live status | No platform auth observed | Slack and Gmail appear integration targets; Zapier/Linear direct evidence is limited in this repo snapshot. |
| Facebook / Messenger | `data/sent_posts.jsonl` includes facebook account posting records | Limited, appears test-like | No Facebook account auth observed | Two facebook records in local export; no live Messenger inbox access in this environment. |
| ChatGPT account | Local docs for ChatGPT Actions testing and GPT ingest routes | Integration scaffolding present; live account state unknown | No direct ChatGPT account auth observed | Could inventory endpoints and key names, but not browse actual ChatGPT memories/custom GPT settings from here. |

## Cloudflare Inventory

> **Scope note:** No authenticated Cloudflare account/session was available in this environment, so tables reflect only repo evidence.

### Workers
| Worker | Status | Notes |
|---|---|---|
| None directly enumerated | Unknown | No `wrangler.toml` or Cloudflare Worker project metadata found in repo root scan. |

### Pages
| Project | Status | Notes |
|---|---|---|
| None directly enumerated | Unknown | No authenticated Cloudflare Pages listing available. |

### D1
| DB | Status | Notes |
|---|---|---|
| None directly enumerated | Unknown | No D1 config/discovery in accessible account context. |

### R2
| Bucket | Status | Notes |
|---|---|---|
| None directly enumerated | Unknown | No authenticated Cloudflare inventory available. |

### KV
| Namespace | Status | Notes |
|---|---|---|
| None directly enumerated | Unknown | No KV namespace metadata discovered. |

### Queues
| Queue | Status | Notes |
|---|---|---|
| None directly enumerated | Unknown | Queue concepts exist in app docs; Cloudflare Queue resources not verified. |

### Durable Objects
| Object Class | Status | Notes |
|---|---|---|
| None directly enumerated | Unknown | No DO bindings/config found in this snapshot. |

### Secrets (names only)
| Secret name | Associated worker/project | Last modified | Notes |
|---|---|---|---|
| _No Cloudflare-account secrets visible_ | N/A | N/A | Cloudflare dashboard/API not authenticated. |

### Domains / DNS
| Domain | Status | Notes |
|---|---|---|
| `dreamnet.ink` / `www.dreamnet.ink` | Planned/partially documented | DNS targets repeatedly documented toward Vercel (`A 76.76.21.21`, `CNAME cname.vercel-dns.com`) but live DNS ownership/state not verified from account dashboard. |

## GitHub Inventory

| Repo | Purpose | Active/stale | Key branches | PRs/issues/actions | Notes |
|---|---|---|---|---|---|
| `BrandonDucar-dream-net` (local working tree) | Core DreamNet/DreamForge monorepo | **Likely active historically**, current hosted activity unverified | Local branch: `work` only visible | PR/issues/action runtime status **not queryable** without remote/auth | Workflow exists for CI/CD and Vercel deployment; dependabot configured weekly. |

## Agent And Swarm Inventory
- **Confirmed agent counts (repo evidence):**
  - `24 active agents` appears consistently in multiple analysis docs and diagnostic summaries.
  - `data/agents.json` contains **5 named agents** (`social`, `deploy`, `ingest`, `surgeon`, `prompt`) marked active.
  - `data/viral-nano-swarm.json` currently contains **17,900 nanoAgents** (all status `active`) in local data export.
- **Evidence for 143 / 503 / 115 mini agents / 5 macro agents:**
  - **5 macro agents:** partially supported by `data/agents.json` (5 core named agents).
  - **143 / 503 / 115 mini agents:** not found as authoritative counts in core configs/docs scanned; these appear as narrative/search-term targets rather than verified registry values in this repo snapshot.
- **Agent families and roles observed:**
  - Macro/control roles: Social manager, deployment monitor, video ingest, system surgeon, promptforge.
  - Nano roles in swarm export include high-volume roles such as `Computer`, `Teleporter`, `Observer`, `Entangler`, `Processor`, plus `Messenger`, `Catalyst`, `Regulator`, and defense-oriented roles (`Guardian`, `Bastion`, `Shield`, etc.).
- **Stubs/placeholders/missing links:**
  - Multiple documents assert higher-level topology/governance claims not tied to one canonical machine-readable registry.
  - Recommend unifying all counts into one signed `agent_registry` artifact with timestamp, source system, and lifecycle status.

## Memory And Daily Pulse Inventory
- **Facebook/Messenger findings summarized:**
  - No live Messenger inbox access was available.
  - Local export `data/sent_posts.jsonl` includes 2 facebook outbound post records under account id `facebook_ducar_consulting_inc`; appears test/demo telemetry rather than complete conversation history.
- **ChatGPT daily pulse findings summarized:**
  - No direct ChatGPT account session data (history/memory/custom GPT list) was accessible.
  - Local docs indicate a ChatGPT Actions proxy pattern (`/gpt/ingest`, health and ops commands) and operational prompts captured in `attached_assets/Pasted-*` artifacts.
- **Custom GPTs found:**
  - Not directly discoverable from account UI in this environment.
  - Indirect evidence suggests at least one operational GPT-style control surface via “ChatGPT Actions Proxy.”
- **Notion/Slack/Linear/Zapier/Gmail data sources:**
  - Notion and Slack SDK dependencies exist; Gmail OAuth scopes present via Google strategy; direct Linear/Zapier runtime resource inventory not available from authenticated dashboards.
- **Suggested Master Vault ingestion priority:**
  1. `ops/DIAG_SUMMARY.json` + audit markdowns (state of health/blockers).
  2. `ops/*.yaml` integration flags/webhook hygiene/blast radius (control plane truth).
  3. `config/*.yaml` and `config/*.json` (capability + secret-name registry).
  4. `data/agents.json` + `data/viral-nano-swarm.json` (agent-state evidence).
  5. `data/sent_posts.jsonl` and curated `attached_assets/Pasted-*` metadata index (memory/pulse signal layer).

## Critical Unlocks
1. **Enable Neon endpoint and verify DB session path end-to-end** (unblocks auth + persistence).
2. **Create one verified secrets manifest by environment** (names only, owner, rotation SLA, consumer services).
3. **Close deployment truth gap** by reconciling conflicting docs (`vercel_ready false` vs “ready for launch”) with one live status check artifact.
4. **Stand up agent registry authority** (single JSON source for macro + mini + nano counts with provenance).
5. **Add integration health scoreboard endpoint** that reports auth/config/runtime health per platform (GitHub, Vercel, Google, Slack, etc.).

## Emergent Convergences
- **Cloudflare secrets + EnvKeeper:** even without Cloudflare access now, your existing secret-name discipline in config/ops files is ready for centralized secret cataloging.
- **Agent registry + passports:** current multi-source agent claims can converge into signed “passports” generated from canonical registry snapshots.
- **NATS/Redis/Kafka + Nerve bus:** event routing and webhook hygiene policies already model a bus-like contract; can map naturally to a formal message backbone later.
- **Facebook/ChatGPT daily pulses + memory vault:** local post logs + prompt artifacts already form an ingestion substrate for a “Master Vault” timeline.
- **Farcaster/Neynar/social ops + agent swarm:** social manager agent + platform flags pattern is compatible with adding social providers as first-class integrations.
- **Master Vault + NUC heartbeat:** existing health checks, ops endpoints, and diagnostics can emit heartbeat documents to a centralized vault.

## Stubs, Broken Auth, And Blockers
- **Neon DB endpoint disabled** → requires Neon dashboard/API action to enable endpoint.
- **Missing production credentials (multiple docs)** → requires secure injection of key names already referenced (e.g., Stripe, Google, Twilio, Metals).
- **Hosted GitHub metadata inaccessible from this session** → requires GitHub remote + token/session to enumerate PR/issues/Actions.
- **Cloudflare inventory unavailable** → requires Cloudflare account authentication to list Workers/Pages/D1/R2/KV/Queues/DO.
- **ChatGPT account inventory unavailable** → requires direct ChatGPT UI/API session access for memories/custom GPTs.
- **Messenger history unavailable** → requires direct Facebook/Messenger authenticated access/export.

## Recommended Next Actions For Local Codex
1. **Build `master-vault-ingest/` pipeline** to ingest `ops/`, `config/`, and `data/` snapshots with deterministic timestamps and checksums.
2. **Create `scripts/inventory/secrets-names-only.ts`** to emit a redacted cross-file secret-name matrix (name, file, service, rotation policy).
3. **Create `scripts/inventory/agent-registry-merge.ts`** to reconcile counts from `data/agents.json`, nano swarm exports, and docs into one conflict report.
4. **Add `/api/inventory/status` endpoint** returning health/auth/config state by platform (no secret values).
5. **Add `docs/INVENTORY_EVIDENCE_INDEX.md`** linking each claim to a source file/line + timestamp.
6. **Implement drift checks in CI** to flag contradictions (e.g., “vercel_ready false” while docs claim “launch ready”).

## Appendix
- **Key file paths scanned:**
  - `ops/DIAG_SUMMARY.json`
  - `ops/integrations.flags.yaml`
  - `ops/webhook-hygiene.yaml`
  - `ops/integration-blast-radius.yaml`
  - `config/integration-registry.yaml`
  - `config/secrets-management.yaml`
  - `config/capability-map.yaml`
  - `config/experiences-platform.yaml`
  - `data/agents.json`
  - `data/viral-nano-swarm.json`
  - `data/sent_posts.jsonl`
  - `.github/workflows/dreamnet-ci-cd.yml`
  - `LAUNCH_READINESS_CHECKLIST.md`
  - `FINAL_DEPLOYMENT_STATUS.md`
  - `COMPREHENSIVE_AUDIT_REPORT.md`
  - `SYSTEM_WIDE_ANALYSIS_REPORT.md`
  - `README.md`
- **Notable timestamps from repo artifacts:**
  - `ops/DIAG_SUMMARY.json`: `2025-08-24T09:40:48.556Z`
  - `SYSTEM_WIDE_ANALYSIS_REPORT.md`: generated `August 17, 2025`
  - `COMPREHENSIVE_AUDIT_REPORT.md`: generated `August 24, 2025 09:48 UTC`
- **Exact blocker error text (from diagnostics):**
  - `The endpoint has been disabled. Enable it using Neon API and retry.`
- **Resource IDs / project IDs surfaced safely (non-secret):**
  - Domain: `dreamnet.ink`, `www.dreamnet.ink`
  - OTT channel IDs: `roku-main`, `firetv-main`, `tvos-main`
  - Local branch: `work`
