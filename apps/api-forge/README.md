# Dream API Forge

A Postman-class API workspace built into DreamNet. Organize requests into collections, manage environments, execute HTTP requests, and run test scripts.

## Features

- **Collections**: Organize API requests into groups
- **Requests**: Full HTTP support (GET, POST, PUT, PATCH, DELETE, etc.)
- **Environments**: Variable substitution with `{{VAR_NAME}}` syntax
- **History**: Automatic execution logs with request/response snapshots
- **Test Scripts**: Sandboxed JavaScript tests with `forge.*` helpers
- **Auth**: Bearer tokens, Basic auth, API keys

## Development

```bash
# Start the Forge frontend
pnpm dev:forge

# The app runs on http://localhost:5174
# API calls proxy to http://localhost:5000/api/forge/*
```

## Database Setup

The Forge tables are part of the shared schema. Run migrations:

```bash
pnpm db:push
```

This creates:
- `forge_collections`
- `forge_requests`
- `forge_environments`
- `forge_history`

## Usage

1. Create a Collection
2. Add Requests to the collection
3. Set up Environments with variables
4. Select an environment and send requests
5. View responses and test results
6. Check history for past executions

## Test Scripts

Write JavaScript snippets that run after each request:

```javascript
forge.expectStatus(200);
forge.expectHeader("content-type", "application/json");
forge.expectBodyContains("success");
forge.log("Custom log message");
```

Available helpers:
- `forge.expectStatus(expected)` - Assert HTTP status
- `forge.expectHeader(name, value)` - Assert header value
- `forge.expectBodyContains(text)` - Assert body contains text
- `forge.log(message)` - Log a message
- `forge.response` - Access response object (status, headers, body, durationMs)

## Extension Points

The schema includes `tags` and `metadata` fields for future DreamNet integration:
- Tag requests with agent names: `["agent:DeployKeeper"]`
- Attach metadata for WebSocket/gRPC support
- Link requests to DreamNet Nodes

