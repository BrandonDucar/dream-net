# Squad Builder API

## Base URL

`/api/squad`

## Endpoints

### List Agents

**GET** `/api/squad/agents`

List all agents.

**Response:**
```json
{
  "ok": true,
  "agents": [
    {
      "id": "dreamkeeper",
      "name": "DreamKeeper",
      "role": "DreamKeeper",
      "description": "Biomimetic immune system that watches the mesh",
      "capabilities": ["health-check", "threat-detection"],
      "isOnline": true,
      "lastSeen": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Register Agent

**POST** `/api/squad/agents`

Register a new agent.

**Request Body:**
```json
{
  "id": "new-agent",
  "name": "New Agent",
  "role": "Custom",
  "description": "Custom agent",
  "capabilities": ["custom-action"],
  "isOnline": true
}
```

**Response:**
```json
{
  "ok": true,
  "agent": {
    "id": "new-agent",
    "name": "New Agent",
    "role": "Custom",
    "description": "Custom agent",
    "capabilities": ["custom-action"],
    "isOnline": true,
    "lastSeen": "2024-01-01T00:00:00.000Z"
  }
}
```

### List Squads

**GET** `/api/squad`

List all squads.

**Response:**
```json
{
  "ok": true,
  "squads": [
    {
      "id": "dreamops-strike",
      "name": "DreamOps Strike Team",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "agents": [...],
      "activeTaskId": null
    }
  ]
}
```

### Get Squad

**GET** `/api/squad/:id`

Get a squad by ID.

**Response:**
```json
{
  "ok": true,
  "squad": {
    "id": "dreamops-strike",
    "name": "DreamOps Strike Team",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "agents": [...],
    "activeTaskId": null
  }
}
```

### Create Squad

**POST** `/api/squad`

Create a new squad.

**Request Body:**
```json
{
  "name": "New Squad",
  "agents": [...]
}
```

**Response:**
```json
{
  "ok": true,
  "squad": {
    "id": "squad-123",
    "name": "New Squad",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "agents": [...],
    "activeTaskId": null
  }
}
```

### List Tasks

**GET** `/api/squad/tasks?sqaudId=...`

List all tasks (optionally filter by squadId).

**Response:**
```json
{
  "ok": true,
  "tasks": [
    {
      "id": "task-123",
      "type": "graft.install",
      "status": "pending",
      "payload": { "graftId": "graft-123" },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "logs": [],
      "assignedAgent": "graftbuilder"
    }
  ]
}
```

### Create Task

**POST** `/api/squad/tasks`

Create a new task.

**Request Body:**
```json
{
  "type": "graft.install",
  "status": "pending",
  "payload": { "graftId": "graft-123" },
  "squadId": "dreamops-strike"
}
```

**Response:**
```json
{
  "ok": true,
  "task": {
    "id": "task-123",
    "type": "graft.install",
    "status": "pending",
    "payload": { "graftId": "graft-123" },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "logs": [],
    "assignedAgent": null
  }
}
```

### Get Task

**GET** `/api/squad/tasks/:id`

Get a task by ID.

**Response:**
```json
{
  "ok": true,
  "task": {
    "id": "task-123",
    "type": "graft.install",
    "status": "pending",
    "payload": { "graftId": "graft-123" },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "logs": [],
    "assignedAgent": null
  }
}
```

### Dispatch Task

**POST** `/api/squad/tasks/:id/dispatch`

Dispatch a task to an agent.

**Response:**
```json
{
  "ok": true,
  "agentId": "graftbuilder"
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "ok": false,
  "error": "Error message"
}
```

## Status Codes

- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

