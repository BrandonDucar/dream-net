# DreamNet Env And Secret Access Map

Captured: 2026-05-03

This packet is intentionally redacted. It records secret names, locations, bindings, missing coverage, and operational notes only. Do not store raw API keys, private keys, signer tokens, passwords, or webhook secrets in memory files.

## Access Surfaces Confirmed

- Local repo env files exist for general runtime, ClawdChat, Cloudflare, enhanced infra, and local development.
- GitHub CLI is authenticated for `BrandonDucar/dream-net` and can list or set repository Actions secrets and variables.
- Wrangler CLI is authenticated for the Cloudflare account and can inspect Workers, Pages, D1, KV, R2, Vectorize, Hyperdrive, Queues, and Worker/Page secrets.
- Neon Postgres is reachable from local env and contains the active swarm state.
- Docker is available locally for runtime/container inspection.
- GHCR is used by the repo workflow for container publishing.

## Local Env Files

`.env.local` contains runtime keys for:

- `ANTHROPIC_API_KEY`
- `BRAINSYNC_PASSPHRASE`
- `DATABASE_URL`
- `DIVINE_DREAM_DATABASE_URL`
- `ENABLE_OLLAMA`
- `GRAFANA_ADMIN_PASSWORD`
- `LINEAR_API_KEY`
- `NEYNAR_API_KEY`
- `NODE_ENV`
- `NOTION_API_KEY`
- `OLLAMA_BASE_URL`
- `OPENAI_API_KEY`
- `OPENROUTER_API_KEY`
- `PORT`
- `PORTAINER_AGENT_SECRET`
- `REDIS_CLUSTER_ENABLED`
- `REDIS_ENTERPRISE_PASSWORD`
- `REDIS_URL`
- `SLACK_SIGNING_SECRET`
- `SLACK_TOKEN`
- `TAILSCALE_AUTH_KEY`
- `TEMPORAL_DB_PASSWORD`
- `TEMPORAL_NAMESPACE`
- `TEMPORAL_WORKER_QUEUE`
- `ZAPIER_WEBHOOK_PATH`

`.env.enhanced` contains extended infra keys for:

- `ANTHROPIC_API_KEY`
- `BASE_MAINNET_RPC_URL`
- `BASE_SCAN_API_KEY`
- `BASE_SEPOLIA_RPC_URL`
- `CLOUDFLARE_TUNNEL_TOKEN`
- `DATABASE_URL`
- `DIVINE_DREAM_DATABASE_URL`
- `ENABLE_OLLAMA`
- `GITHUB_OWNER`
- `GITHUB_TOKEN`
- `GOOSE_MODEL`
- `GOOSE_PROVIDER`
- `GRAFANA_ADMIN_PASSWORD`
- `HEYGEN_API_KEY`
- `HOT_SENDER_PK`
- `NEON_DATABASE_URL`
- `NETLIFY_TOKEN`
- `NEYNAR_API_KEY`
- `NODE_ENV`
- `OLLAMA_BASE_URL`
- `OPENAI_API_KEY`
- `OPENROUTER_API_KEY`
- `PORTAINER_AGENT_SECRET`
- `PRIVATE_KEY`
- `REDIS_CLUSTER_ENABLED`
- `REDIS_ENTERPRISE_PASSWORD`
- `TAILSCALE_AUTH_KEY`
- `TEMPORAL_DB_PASSWORD`
- `TEMPORAL_NAMESPACE`
- `TEMPORAL_WORKER_QUEUE`
- `VERCEL_TOKEN`

`.env.clawdchat` contains ClawdChat MCP runtime keys:

- `CLAWDCHAT_API_KEY`
- `CLAWDCHAT_API_KEY_2` through `CLAWDCHAT_API_KEY_11`
- `CLAWDCHAT_USERNAME`
- `CLAWDCHAT_USERNAME_2` through `CLAWDCHAT_USERNAME_11`
- `CLAWDCHAT_MCP_URL`
- `CLAWDCHAT_NODE_ENV`
- `CLAWDCHAT_PORT`

Known ClawdChat gap: current local env/live MCP surface has 11 identities. The target operating set is 15 identities. Missing from the local env inventory are `dreamstar`, `jaggy`, `Felix`, and `Clawedette`. The username is also the user ID for this ClawdChat API.

`.env.cloudflare` contains Cloudflare and edge-control keys:

- `AGENT_DOMAIN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_TUNNEL_TOKEN`
- `CONTROL_CORE_DOMAIN`
- `ENABLE_EXTERNAL_WEBHOOKS`
- `LLM_DOMAIN`
- `NANOCLAW_MAX_CONCURRENT`
- `OLLAMA_HOST`
- `SPAWN_DOMAIN`
- `WEBHOOK_SECRET`
- `ZEROCLAW_ENABLED`

Farcaster/Neynar env gap: local env has `NEYNAR_API_KEY`, but no confirmed local entries for `GHOSTMINTOPS_SIGNER_UUID`, `NEYCLAW_SIGNER_UUID`, `EXTRA_API_KEY`, `NEYCLAW_API_KEY`, `GHOSTMINTOPS_API_KEY`, or `FARCASTER_SIGNER_UUID`.

## Cloudflare Inventory

Account access through Wrangler is active. The account has broad scopes for Workers, D1, Pages, AI, Queues, Pipelines, Secrets Store, Containers, KV, R2, Vectorize, Hyperdrive, and related services.

Hyperdrive configs:

- `dreamnet-platform-db` points at a Neon pooled Postgres host, database `neondb`, origin connection limit 20.
- `dreamnet-swarm-db` points at a Neon pooled Postgres host, database `neondb`, origin connection limit 20.

Pages projects:

- `arya-frame`
- `dreamnet-live`
- `dadfi-org`
- `dreamnet-ink`

Pages secret lists inspected for the above projects showed no application secret names.

Worker secret-name findings:

- `dreamnet-gooseclaw`: no secrets listed.
- `arya-generator`: no secrets listed.
- `governor-enforcer`: no secrets listed.
- `hawk-processor`: no secrets listed.
- `dreamnet-gooseclaw-prod`, `dreamnet-gooseclaw-staging`, and `farcaster-edge-worker` need follow-up verification because secret-list calls returned blank/no useful JSON.

D1:

- `vanguard-54-db` exists but currently has no app tables; only Cloudflare internal metadata was visible. D1 should not be treated as the current source of truth.

KV namespaces:

- `DREAMNET_AGENT_CACHE`
- `dreamnet-secrets`
- `DREAMNET_STATE`
- `POLYGON_ORACLE_CACHE`
- `VANGUARD_KV`

R2:

- `dreamnet-cflare-bucket`

Vectorize indexes:

- `agent-profiles`
- `dreamnet-memory-v1`
- `roast-context`
- `signal-embeddings`
- `vote-positions`

Queues:

- No Cloudflare Queues were listed. This is a major gap for autonomous social posting because queue-based throttling is the cleanest way to control Farcaster and ClawdChat action volume at the edge.

Recommended Cloudflare runtime secrets/bindings for social autonomy:

- `DATABASE_URL` or Hyperdrive binding for Neon access.
- `NEYNAR_API_KEY`
- `EXTRA_API_KEY` or `NEYCLAW_API_KEY`
- `GHOSTMINTOPS_SIGNER_UUID`
- `NEYCLAW_SIGNER_UUID`
- `CLAWDCHAT_MCP_URL`
- `CLAWDCHAT_AGENT_REGISTRY_JSON` or individual `CLAWDCHAT_USERNAME_N` / `CLAWDCHAT_API_KEY_N` pairs.
- `BASE_MAINNET_RPC_URL`
- `BASE_SEPOLIA_RPC_URL`
- `WEBHOOK_SECRET`
- `OPENAI_API_KEY` or `OPENROUTER_API_KEY` if edge agents generate text directly.
- `HOT_SENDER_PK` or `PRIVATE_KEY` only for tightly scoped, policy-gated onchain operations.

## GitHub Inventory

GitHub Actions secrets are present for:

- `ADMIN_WALLETS`
- `AGENT_API_KEY`
- `AI_GATEWAY_API_KEY`
- `ANNTHROPIC_API_KEY`
- `DATABASE2_URL`
- `DATABASE_URL`
- `DEFAULT_OBJECT_SEARCH_PATHS`
- `DOCKERHUB_TOKEN`
- `DOCKERHUB_USERNAME`
- `FIREBASE_SERVICE_ACCOUNT`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `IFTTT_WEBHOOK_KEY`
- `JWT_SECRET`
- `LINEAR_API_KEY`
- `NEON_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_ADMIN_EMIALS`
- `OPENAI_API_KEY`
- `PGDATABASE`
- `PGHOST`
- `PGPASSWORD`
- `PGPORT`
- `PGUSER`
- `PRIVATE_OBJECTIVE_DIR`
- `PUBLIC_BASE_URL`
- `PUBLISHABLE_STRIPE`
- `QUICKNODE_WEBSOCKET_API`
- `SECRET_STRIPE_API`
- `SESSION_SECRET`
- `SLACK_TEST_API_KEY`
- `SLACK_WEBHOOK_URL`
- `STRIPE_SERET_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `VERCEL_PROJECT_ID`
- `VERCEL_TOKEN`
- `VITE_API_BASE_URL`
- `VITE_STRIPE_PUBLIC`

GitHub Dependabot secrets are empty.

GitHub variables include:

- `NEON_PROJECT_ID`

Typos or naming risks to clean up:

- `ANNTHROPIC_API_KEY`
- `NEXT_PUBLIC_ADMIN_EMIALS`
- `STRIPE_SERET_KEY`

Likely missing GitHub Actions secrets for deploy automation:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `NEYNAR_API_KEY`
- `EXTRA_API_KEY` or `NEYCLAW_API_KEY`
- `GHOSTMINTOPS_SIGNER_UUID`
- `NEYCLAW_SIGNER_UUID`
- `CLAWDCHAT_AGENT_REGISTRY_JSON` or ClawdChat username/key pairs.

GHCR note: same-repo GHCR publishing can use the built-in `GITHUB_TOKEN`; no separate GHCR secret is required unless pushing across owners or outside the repo permission boundary.

## Farcaster And Neynar Access Memory

The clean agent-owned Farcaster accounts are:

- `@ghostmintops`
- `@neyclaw-dreamnet`

Do not persist the raw signer UUID values in memory. The stable env names should be:

- `GHOSTMINTOPS_SIGNER_UUID`
- `NEYCLAW_SIGNER_UUID`

The codebase currently has fallback constants and scripts for these accounts, but production automation should source them from env/secret stores.

Important code findings:

- `packages/platform-connector/src/FarcasterSignerPool.ts` maps the core ClawdChat agents onto the two Farcaster loudspeaker identities, but local env gaps can prevent registration.
- `server/workers/FarcasterActionWorker.ts` processes pending `farcaster_outbound_actions`, but it needs signer-pool/API-key awareness, scheduled-action filtering, idempotency, and stronger rate controls before draining the backlog.
- Neon currently has a very large pending Farcaster action backlog. Do not blindly run the worker against all pending actions.

## Neon And Runtime Memory

Neon is the active source of truth for swarm state. Recent inspection showed:

- `swarm_agents` has over 34,000 active agents.
- `farcaster_outbound_actions` has a very large pending backlog.
- `guilds` exists, but `guilds.member_count` appears stale compared with derived guild membership views.
- `specialized_spikes` was empty during inspection, despite the specialized-spike architecture existing in code/docs.

Redis is live locally and contains ClawdChat audit/stats and Arya posting keys. It is already useful for ClawdChat cooldowns, duplicate guards, and credential stats.

NATS JetStream is enabled in the local container, but live streams/consumers/connections were empty during inspection. The code has NATS message-bus support, but the live event fabric is not currently wired.

No active Debezium/CDC pipeline was found. Debezium should not be added before the social action queue/governor exists; first stabilize edge queues, idempotency, and throttles, then consider CDC for selected tables/events.

## Docker And Container Memory

Runtime findings:

- `dreamnet_clawdchat_mcp` is running but unhealthy and still serving the old bridge; it needs rebuild/restart to activate the newer MCP-compatible ClawdChat server.
- `dreamnet_arya_executor` is using a minimal JS posting loop, not the richer TypeScript social-loop architecture.
- `dreamnet_gooseclaw` is stuck on an interactive telemetry prompt and is not autonomous.
- `dreamnet_genealogist` is restart-looping because of a missing `/server/db` import target.
- Snapchain assets/config exist, but no running Snapchain container was observed.

## Do Not Commit These Leaks

- `.env`
- `.env.local`
- `.env.enhanced`
- `.env.clawdchat`
- `.env.cloudflare`

Known hardcoded-secret risks to migrate later:

- `packages/platform-connector/src/ClawdChatClient.ts`
- `scripts/cross-check.ts`

Any future memory update should preserve this rule: names and locations are okay; secret values are not.
