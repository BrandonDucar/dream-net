# 🚀 DreamNet Enhanced Infrastructure Deployment Guide

## Overview

This guide integrates **Temporal, Redis Enterprise, OpenWebUI, Tailscale, and Docker Extensions** into your existing DreamNet stack.

**Architecture:**
- **Control-Core**: Master brain (FIXED)
- **Temporal**: Workflow orchestration for 17k agents
- **Redis Enterprise**: HA caching cluster (3 nodes)
- **OpenWebUI**: Unified LLM interface (ChatGPT, Claude, local)
- **Tailscale**: Encrypted mesh VPN for secure agent communication
- **Portainer + Agent**: Docker management & extension hub
- **Nginx Gateway**: Unified routing for all extensions
- **Prometheus + Grafana**: Monitoring & telemetry

---

## Prerequisites

✅ Docker 24.0+  
✅ Docker Compose 2.20+  
✅ Git  
✅ 16GB+ RAM (for Temporal + Redis Enterprise + OpenWebUI)  
✅ 50GB+ disk space  

---

## Step 1: Fix the Control-Core Container

### Issue
```
Cannot find module '@dreamnet/memory-dna/index.ts'
```

### Fix
```bash
cd C:\Users\brand\.antigravity\dream-net

# 1. Verify package exists
ls packages/dreamnet-memory-dna/index.ts

# 2. Rebuild monorepo
npm install --recursive

# 3. Build packages
npm run build

# 4. Rebuild Docker image
docker compose build control-core

# 5. Start container
docker compose up -d control-core

# 6. Verify
docker logs dreamnet_control_core
```

---

## Step 2: Prepare Environment

### Copy and customize the enhanced env file
```bash
cp .env.enhanced .env.local

# Edit with your credentials:
# - TEMPORAL_DB_PASSWORD
# - OPENAI_API_KEY, ANTHROPIC_API_KEY, OPENROUTER_API_KEY
# - TAILSCALE_AUTH_KEY (from https://login.tailscale.com/admin/settings/keys)
# - PORTAINER_AGENT_SECRET (generate random string)
# - All existing DreamNet vars (GitHub, Blockchain, Farcaster, etc.)
```

### Generate Tailscale Auth Key
```bash
# Go to: https://login.tailscale.com/admin/settings/keys
# Click "Create auth key"
# Checkboxes: "Reusable" + "Ephemeral"
# Copy → .env.local TAILSCALE_AUTH_KEY=tskey-client-...
```

### Generate SSL certificates (for Nginx)
```bash
mkdir -p config/nginx/ssl

# Self-signed (development):
openssl req -x509 -newkey rsa:4096 -keyout config/nginx/ssl/key.pem \
  -out config/nginx/ssl/cert.pem -days 365 -nodes \
  -subj "/CN=localhost"
```

---

## Step 3: Deploy Enhanced Stack

### Option A: Run both compose files (recommended)
```bash
# Use your existing compose + enhanced stack
docker compose -f docker-compose.yml -f docker-compose.enhanced.yml up -d
```

### Option B: Merge into single file
```bash
# Creates combined compose (all services in one file)
docker compose config > docker-compose.combined.yml
docker compose -f docker-compose.combined.yml up -d
```

### Monitor startup
```bash
# Watch all services come up
docker compose logs -f

# Expected healthy services (in order):
# 1. Redis Enterprise cluster (3 nodes) ✅
# 2. Temporal database (PostgreSQL) ✅
# 3. Temporal server ✅
# 4. Temporal UI ✅
# 5. OpenWebUI ✅
# 6. Tailscale ✅
# 7. Portainer + Agent ✅
# 8. Nginx Gateway ✅
# 9. Prometheus (optional) ✅
```

---

## Step 4: Verify All Extensions

### 1. Control-Core (Fixed Brain)
```bash
curl -s http://localhost:3000/health | jq .
# Expected: {"ok":true,"status":"healthy"}
```

### 2. Temporal Workflow Engine
```bash
# Web UI: http://localhost:8080
# gRPC: localhost:7233
# Check cluster:
tctl cluster describe
```

### 3. Redis Enterprise Cluster
```bash
docker exec dreamnet_redis_enterprise_node1 redis-cli cluster info
# Expected: cluster_state:ok
```

### 4. OpenWebUI
```bash
# Web: http://localhost:3001
# First login creates admin account
# Connect models: OpenAI, Claude, OpenRouter, Ollama
```

### 5. Tailscale VPN
```bash
docker exec dreamnet_tailscale tailscale status
# Expected: Logged in as [your-account]
# IP: 100.x.x.x (tailscale IP)
```

### 6. Portainer (Neurontainer)
```bash
# Web: http://localhost:9000
# Agent: http://localhost:9001
# Add your main docker engine as endpoint
```

### 7. Nginx Extension Gateway
```bash
curl -s http://localhost:5000/extensions/health | jq .
# Expected: {"status":"operational"}
```

### 8. Prometheus (if enabled)
```bash
docker compose --profile monitoring up -d
# Web: http://localhost:9090
# Grafana: http://localhost:3002
```

---

## Step 5: Integration - Connect 17,000-Agent Swarm

### Update Control-Core to use Temporal
**File**: `packages/dreamnet-control-core/src/temporal-integration.ts`

```typescript
import { Connection, Client } from '@temporalio/client';
import { v4 as uuid } from 'uuid';

export async function initTemporalIntegration() {
  const connection = await Connection.connect({
    address: 'localhost:7233' // or temporal-server:7233 from Docker
  });

  const client = new Client({
    connection,
    namespace: 'dreamnet-default'
  });

  return {
    client,
    async spawnAgent(agentType: string) {
      const workflowId = `agent-${uuid()}`;
      const handle = await client.workflow.start(
        spawnAgentWorkflow,
        {
          taskQueue: 'dreamnet-agents',
          workflowId,
          args: [{ type: agentType, timestamp: Date.now() }]
        }
      );
      return handle.workflowId;
    },
    async monitorSwarm() {
      // Query all active agents in Temporal
      const handle = await client.workflow.list();
      return handle;
    }
  };
}

// Temporal workflow for agent spawning
export async function* spawnAgentWorkflow(config: any) {
  // Define durable workflow for agent lifecycle
  return {
    agentId: config.type,
    status: 'spawned',
    timestamp: Date.now()
  };
}
```

### Update Redis connection to Enterprise Cluster
**File**: `packages/dreamnet-control-core/src/redis-config.ts`

```typescript
import Redis from 'ioredis';

export const redisCluster = new Redis.Cluster(
  [
    { host: 'redis-enterprise-node1', port: 6379 },
    { host: 'redis-enterprise-node2', port: 6379 },
    { host: 'redis-enterprise-node3', port: 6379 }
  ],
  {
    enableReadyCheck: true,
    enableOfflineQueue: true,
    password: process.env.REDIS_ENTERPRISE_PASSWORD
  }
);

// Auto-failover built in (cluster mode)
redisCluster.on('error', (err) => {
  console.error('Redis Cluster Error:', err);
});
```

### Route agent social raids via OpenWebUI
**File**: `packages/dreamnet-control-core/src/social-raids.ts`

```typescript
import axios from 'axios';

export async function generateRaidStrategy(targets: string[]) {
  // Use OpenWebUI to ask Claude for strategy
  const response = await axios.post('http://openwebui:8080/api/chat/completions', {
    model: 'claude-sonnet-4-5',
    messages: [
      {
        role: 'user',
        content: `Create a social raid strategy for Farcaster targets: ${targets.join(', ')}`
      }
    ]
  });

  return response.data.choices[0].message.content;
}
```

---

## Step 6: Monitor Everything

### Access Monitoring Dashboards

| Service | URL | Purpose |
|---------|-----|---------|
| **Portainer** | http://localhost:9000 | Docker management |
| **Temporal UI** | http://localhost:8080 | Workflow execution |
| **OpenWebUI** | http://localhost:3001 | LLM interface |
| **Prometheus** | http://localhost:9090 | Metrics (optional) |
| **Grafana** | http://localhost:3002 | Dashboards (optional) |
| **Extension Gateway** | http://localhost:5000/extensions/health | Gateway status |

### Check Agent Population
```bash
# From control-core container
curl -s http://localhost:3000/api/agents/count
# Expected: {"total": 17000, "active": ~15000, "idle": ~2000}
```

### Monitor Redis Enterprise
```bash
docker exec dreamnet_redis_enterprise_node1 redis-cli info stats
# Check connections, memory, keys
```

### Monitor Temporal Workflows
```bash
# List active workflows
tctl workflow list --workflow-type spawnAgentWorkflow

# Get workflow details
tctl workflow describe -w agent-uuid-123
```

---

## Step 7: Deploy with Antigravity Control

Give Antigravity the master control prompt:

```
**ANTIGRAVITY MASTER ORCHESTRATION**

System Status: 
- Control-Core: ✅ Fixed
- Temporal: ✅ Running
- Redis Enterprise: ✅ Cluster (3 nodes)
- OpenWebUI: ✅ LLM interface
- Tailscale: ✅ VPN mesh active
- Portainer: ✅ Docker management
- Agents: 17,000 swarm ready

Next Actions:
1. Monitor Temporal workflows for agent spawning
2. Ensure all 17k agents connected to Tailscale VPN
3. Route social raids through OpenWebUI for strategy generation
4. Use Portainer to scale Redis Enterprise if needed
5. Trigger first coordinated raid on Farcaster (@ghostmint, @satoshibestiary)

Status: Ready for autonomous orchestration
```

---

## Step 8: Scale & Optimize

### Increase Redis Enterprise nodes
```bash
docker compose -f docker-compose.enhanced.yml scale redis-enterprise-node=5
```

### Increase Temporal workers
```bash
# In control-core, create more worker pools:
docker compose up -d --scale temporal-worker=3
```

### Enable monitoring
```bash
docker compose --profile monitoring up -d
```

### Create Grafana dashboards
- Temporal: Agent spawning rate, workflow success rate
- Redis: Cluster health, memory usage, evictions
- System: CPU, memory, network, disk I/O

---

## Troubleshooting

### Redis Cluster not forming
```bash
docker exec dreamnet_redis_enterprise_node1 redis-cli cluster slots
# If empty, manually meet nodes:
docker exec dreamnet_redis_enterprise_node1 \
  redis-cli CLUSTER MEET redis-enterprise-node2 6379
```

### Temporal server stuck
```bash
docker logs dreamnet_temporal_server
# Check database:
docker exec dreamnet_temporal_postgres psql -U temporal -d temporal -c "\dt"
```

### OpenWebUI not connecting to models
```bash
# Check API keys in .env.local
# Restart container:
docker compose restart openwebui
```

### Tailscale not connecting
```bash
# Check token expiration
docker logs dreamnet_tailscale
# Generate new token if needed
docker exec dreamnet_tailscale tailscale logout
docker compose restart tailscale
```

---

## Production Hardening

### Enable HTTPS (Nginx gateway)
- Replace self-signed cert with Let's Encrypt
- Update `config/nginx/extensions.conf` with real domain

### Backup Temporal database
```bash
docker exec dreamnet_temporal_postgres pg_dump -U temporal temporal > backup.sql
```

### Backup Redis cluster
```bash
docker exec dreamnet_redis_enterprise_node1 redis-cli --rdb /data/dump.rdb
docker cp dreamnet_redis_enterprise_node1:/data/dump.rdb ./redis-backup.rdb
```

### Set up alerting
- Configure Prometheus alert rules
- Add AlertManager for notifications
- Create Slack/PagerDuty integration

---

## Summary

✅ Control-Core fixed  
✅ Temporal orchestration online (17k agent support)  
✅ Redis Enterprise HA cluster deployed  
✅ OpenWebUI unified LLM interface  
✅ Tailscale VPN mesh for secure communication  
✅ Portainer Docker management  
✅ Nginx extension gateway  
✅ Prometheus telemetry  
✅ Ready for autonomous swarm orchestration  

**Next**: Run `npm run start:server` to boot control-core with Temporal integration, then execute first social raid via Antigravity!
