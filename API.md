# DreamNet API Documentation

## System Inspection

### GET /api/system/graph

**Purpose**: DreamNet topology inspection (internal only)

**Description**: Returns a complete snapshot of the DreamNet internal system architecture, including all registered ports, routes, and wormholes with their current state.

**Authentication**: None (for now)

**Response Format**:
```json
{
  "ports": [
    {
      "id": "dreamnet-core",
      "label": "DreamNet Core",
      "direction": "bidirectional",
      "fiber": "alpha",
      "isDefault": true
    }
  ],
  "routes": [
    {
      "fiber": "alpha",
      "type": "dreamnet.event",
      "targetPortId": "dreamnet-core",
      "description": "DreamNet Core system events"
    }
  ],
  "wormholes": [
    {
      "id": "WH-CORE-OMEGA",
      "label": "Core Omega Wormhole",
      "direction": "bidirectional",
      "fiber": "omega",
      "stats": {
        "buffered": 0,
        "enqueued": 0,
        "dropped": 0
      }
    }
  ]
}
```

**Status Codes**:
- `200`: Success
- `500`: Failed to build system graph

**Example Request**:
```bash
curl http://localhost:3000/api/system/graph
```

**Notes**:
- Read-only endpoint
- No authentication required (can be added later)
- Goes through standard middleware (rate limiting, CORS, request ID, timeouts)

