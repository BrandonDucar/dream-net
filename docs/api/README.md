# DreamNet API Documentation

This directory contains API documentation for all DreamNet subsystems.

## API Endpoints

### Squad Builder
- [Squad Builder API](./squad-builder.md) - Agent orchestration and task dispatch

### Event Wormholes
- [Event Wormholes API](./event-wormholes.md) - Event bus and routing

### Spore Engine
- [Spore Engine API](./spore-engine.md) - Prompt spore distribution

### Dark Fabric
- [Dark Fabric API](./dark-fabric.md) - Code generation and testing

### HALO Loop
- [HALO Loop API](./halo-loop.md) - System analysis and optimization

### Graft Engine
- [Graft Engine API](./graft-engine.md) - System expansion

### Memory DNA
- [Memory DNA API](./memory-dna.md) - Persistent memory

### Alive Mode
- [Alive Mode API](./alive-mode.md) - System health monitoring

## Base URL

All API endpoints are prefixed with `/api`:

- Development: `http://localhost:5000/api`
- Production: `https://api.dreamnet.ink/api`

## Authentication

Currently, all endpoints are unauthenticated. Authentication will be added in a future release.

## Response Format

All API responses follow this format:

```json
{
  "ok": true,
  "data": { ... },
  "error": "Error message (if ok is false)"
}
```

## Error Handling

Errors are returned with `ok: false` and an `error` field:

```json
{
  "ok": false,
  "error": "Error message"
}
```

## Rate Limiting

Rate limiting is not currently implemented. It will be added in a future release.

## Versioning

API versioning is not currently implemented. It will be added in a future release.

## Examples

See individual API documentation files for examples of using each endpoint.

