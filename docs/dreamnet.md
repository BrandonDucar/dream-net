# DreamNet OS (Minimal)

DreamNet OS routes requests to agents that perform checks, deployments, and relays. The core lives in `server/core` for now and exposes a unified HTTP entrypoint at `POST /api/agent`.

- Agents register a `name`, `description`, and `run(ctx, input)` method.
- The OS provides `runAgent({ agent, input, userId, metadata })`.
- Starbridge/mesh continues to operate in parallel; the OS is a simple orchestrator.

Dev buttons:
- `pnpm scan:env` – verify required env vars
- `pnpm scan:deploy` – quick deploy sanity (mock)
- `pnpm run:agent dreamkeeper "list"` – run an agent locally
- `pnpm gen:agent <name>` – scaffold a new agent

HTTP:

POST /api/agent
```
{ "agent": "dreamkeeper", "input": "list", "userId": "ui" }
```

Response:
```
{ "ok": true, "agent": "dreamkeeper", "result": { ... } }
```


