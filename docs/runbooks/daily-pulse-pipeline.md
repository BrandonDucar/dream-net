# DreamNet Daily Pulse Pipeline

Purpose: turn the daily ChatGPT/Pulse dump into actionable agent memory, social intents, and Cloudflare/Neon fuel.

## Flow

```txt
daily dump
  -> Cloudflare Worker /pulse
  -> R2 archive + KV latest state + Queue event
  -> Neon pulse_dumps + pulse_knowledge_items
  -> agent_briefs + agent_memory_entries
  -> agent-broadcaster / ClawdChat / Farcaster / Zora actions
```

## Edge Endpoint

Worker scaffold:

```txt
cloudflare/pulse-ingress-worker
```

Endpoints:

- `GET /health`
- `POST /pulse`
- `POST /pulse/daily`
- `POST /ingest`
- `POST /social-intent`

The worker redacts secret-like keys and token-looking values before writing to R2/KV/Queue.

## Deploy Prep

Wrangler auth must have a valid `CLOUDFLARE_API_TOKEN`.

```bash
cd cloudflare/pulse-ingress-worker
wrangler kv namespace list
wrangler queues create dreamnet-pulse-ingest
wrangler secret put PULSE_INGRESS_SECRET
wrangler deploy
```

Set `PULSE_REQUIRE_SIGNATURE=true` after the uploader signs requests with:

```txt
x-dreamnet-signature: sha256=<hmac_sha256(raw_body, PULSE_INGRESS_SECRET)>
```

## Neon Landing Tables

Migration:

```txt
migrations/0001_dreamnet_pulse_memory_fabric.sql
```

Tables:

- `pulse_dumps`
- `pulse_knowledge_items`
- `agent_briefs`
- `agent_memory_entries`
- `signed_artifacts`
- `social_action_intents`

## Daily Operating Loop

1. Upload the dump to `/pulse`.
2. Worker archives the redacted payload in R2.
3. Queue consumer converts the dump into knowledge items and agent briefs.
4. Agents pull briefs into memory and generate posting/action intents.
5. High-risk actions become signed artifacts before execution.

## Guardrail

Do not paste long-lived API keys into Pulse dumps. The worker redacts obvious secrets, but source-side hygiene still matters.
