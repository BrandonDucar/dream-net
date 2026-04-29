# DreamNet Vault Core

`@dreamnet/vault-core` is the index-first Master Vault foundation.

It does not try to own every external system. It creates a canonical index, emits append-only receipts, and keeps secret values out of searchable content.

## Commands

```bash
pnpm vault:inventory -- --jobs local,github,docker,cloudflare,cli,health,connectors
pnpm vault:heartbeat
pnpm vault:schema
```

Runtime output defaults to `~/.dreamnet/vault`. On Primo's Linux host, set:

```bash
export DREAMNET_VAULT_HOME=/srv/dreamnet/vault
```

## Storage Contract

- `sources/*.jsonl`: discovered systems and auth state
- `objects/*.jsonl`: indexed objects and pointers
- `events/*.jsonl`: warnings, blockers, and health findings
- `receipts/*.jsonl`: append-only scan receipts with hash chaining
- `latest/*.json`: latest compact summary snapshots
- `blobs/sha256/*`: optional content-addressed mirrors

## Secret Handling

Secret-like values are redacted before indexing. The vault records secret names, file paths, auth state, and rotation metadata only.
