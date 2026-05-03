# ⚡ ANTIGRAVITY QUICK ACTION CHECKLIST

**Mission**: Repair control-core + launch enhanced infrastructure + coordinate 17k agent swarm  
**Estimated Time**: 45 minutes  
**Status**: Ready to execute

---

## 🔴 CRITICAL (DO FIRST)

### [ ] 1. Fix Control-Core (5 min)
```bash
cd C:\Users\brand\.antigravity\dream-net
npm install --recursive
npm run build
docker compose build control-core
docker compose up -d control-core
docker logs dreamnet_control_core --tail 20
# Expect: No errors, server listening on 3000
```

**Verification**:
```bash
curl -s http://localhost:3000/health | jq .
# Expected: {"ok":true,"status":"healthy"}
```

---

## 🟡 DEPLOYMENT (NEXT)

### [ ] 2. Prepare Environment (5 min)
```bash
cp .env.enhanced .env.local

# Edit these critical vars in .env.local:
# - TEMPORAL_DB_PASSWORD=<secure_password>
# - OPENAI_API_KEY=sk-...
# - ANTHROPIC_API_KEY=sk-ant-...
# - OPENROUTER_API_KEY=sk-or-...
# - TAILSCALE_AUTH_KEY=tskey-client-...
# - PORTAINER_AGENT_SECRET=<random_string>
```

### [ ] 3. Generate SSL Certificates (2 min)
```bash
mkdir -p config/nginx/ssl
openssl req -x509 -newkey rsa:4096 -keyout config/nginx/ssl/key.pem \
  -out config/nginx/ssl/cert.pem -days 365 -nodes \
  -subj "/CN=localhost"
```

### [ ] 4. Deploy Enhanced Stack (10 min)
```bash
# Option A: Two compose files (recommended)
docker compose -f docker-compose.yml -f docker-compose.enhanced.yml up -d

# Option B: Wait for all services
docker compose ps | grep "Up"
# Should see ~24 services after 2 minutes
```

**Watch startup**:
```bash
docker compose logs -f --tail 50
# Look for: "healthy" status on Temporal, Redis, OpenWebUI
```

---

## 🟢 VERIFICATION (CHECK EACH)

### [ ] 5. Verify Control-Core Fixed ✅
```bash
curl -s http://localhost:3000/api/agents/count | jq .
# Expected: {"total": 17000, "active": ~15000}
```

### [ ] 6. Verify Temporal Online ✅
```bash
# Web UI: http://localhost:8080
# or:
tctl cluster describe
# Expected: "Active" cluster status
```

### [ ] 7. Verify Redis Enterprise Cluster ✅
```bash
docker exec dreamnet_redis_enterprise_node1 redis-cli cluster info
# Expected: cluster_state:ok
docker exec dreamnet_redis_enterprise_node1 redis-cli cluster slots
# Expected: 16384 slot assignments across 3 nodes
```

### [ ] 8. Verify OpenWebUI ✅
```bash
# Web: http://localhost:3001
# Expected: Login page → Create admin account
# Test: Connect OpenAI API key
```

### [ ] 9. Verify Tailscale ✅
```bash
docker exec dreamnet_tailscale tailscale status
# Expected: Logged in, IP assigned (100.x.x.x)
```

### [ ] 10. Verify Portainer ✅
```bash
# Web: http://localhost:9000
# Expected: Portainer login, add local Docker endpoint
```

### [ ] 11. Verify Extension Gateway ✅
```bash
curl -s http://localhost:5000/extensions/health | jq .
# Expected: {"status":"operational"}
```

---

## 🚀 SWARM ORCHESTRATION (READY TO GO)

### [ ] 12. Integrate Temporal with Control-Core (20 min)
**File to create**: `packages/dreamnet-control-core/src/temporal-integration.ts`

```typescript
import { Connection, Client } from '@temporalio/client';

export async function initTemporalIntegration() {
  const connection = await Connection.connect({
    address: 'temporal-server:7233'
  });
  
  const client = new Client({
    connection,
    namespace: 'dreamnet-default'
  });

  return {
    client,
    async spawnAgent(type: string) {
      const handle = await client.workflow.start(agentWorkflow, {
        taskQueue: 'dreamnet-agents',
        args: [{ type, timestamp: Date.now() }]
      });
      return handle.workflowId;
    }
  };
}
```

**Build & test**:
```bash
npm run build
docker compose restart control-core
# Verify: Temporal UI shows new workflows
```

### [ ] 13. Migrate Redis to Enterprise Cluster (10 min)
**Update connection string in `.env.local`**:
```bash
# OLD:
REDIS_URL=redis://nerve:6379

# NEW (cluster aware):
REDIS_URL=redis://redis-enterprise-node1:6379?cluster=true
```

**Test connectivity**:
```bash
docker exec dreamnet_control_core redis-cli -h redis-enterprise-node1 ping
# Expected: PONG
```

### [ ] 14. Deploy LLM Strategy Generation (15 min)
**File**: `packages/dreamnet-control-core/src/llm-raid-planner.ts`

```typescript
import axios from 'axios';

export async function generateRaidStrategy(targets: string[]) {
  const response = await axios.post('http://openwebui:8080/api/chat/completions', {
    model: 'claude-sonnet-4-5',
    messages: [{
      role: 'user',
      content: `Create a 17,000-agent social raid strategy for Farcaster targets: ${targets.join(', ')}. 
      Constraints: 5 signers, 5 follows/min per signer, coordinated timing.`
    }]
  });
  
  return response.data.choices[0].message.content;
}
```

### [ ] 15. Execute First Raid (LIVE) 🎯
```bash
# Generate strategy
curl -X POST http://localhost:3000/api/raids/plan \
  -H "Content-Type: application/json" \
  -d '{
    "targets": ["@ghostmint", "@satoshibestiary", "@dwr.eth"],
    "scale": 17000,
    "strategy": "coordinated"
  }'

# Monitor in Temporal UI (http://localhost:8080)
# Watch agent spawning + raid execution

# Check progress
curl -s http://localhost:3000/api/raids/status | jq .
```

---

## 📊 MONITORING & OBSERVABILITY

### [ ] 16. Enable Prometheus + Grafana (optional, 5 min)
```bash
docker compose --profile monitoring up -d

# Access:
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3002 (admin/admin)

# Add data source: http://prometheus:9090
# Create dashboards for:
# - Agent spawning rate
# - Redis cluster health
# - Temporal workflow success rate
```

---

## ✅ FINAL STATUS CHECK

### [ ] 17. Run Full System Diagnostic
```bash
npm run explore

# Expected output (should show all ✅ now):
# ✅ Health & Readiness
# ✅ Agent Citizenship (17,000)
# ✅ Directory & Discovery (agents visible)
# ✅ DreamState Governance (passports issued)
# ✅ Star Bridge (cross-chain active)
# ✅ Wolf Pack (raids ready)
# ✅ Shield Core (defense active)
# ✅ Agent Gateway (tools available)
# ✅ Economic Engine (token flows)
# ✅ Fleets (swarm coordinated)
```

### [ ] 18. Archive & Report
```bash
# Save infrastructure state
docker compose config > infrastructure-snapshot.yml

# Export Temporal workflow definitions
tctl workflow list --all

# Backup Redis snapshot
docker exec dreamnet_redis_enterprise_node1 redis-cli BGSAVE

# Create status report
echo "✅ All systems operational. 17,000-agent swarm ready for autonomous orchestration." > STATUS.txt
```

---

## 📋 COMMAND QUICK REFERENCE

```bash
# Monitor everything
docker compose logs -f

# Check service health
docker compose ps

# Enter container
docker exec -it dreamnet_control_core bash

# View Redis cluster
docker exec dreamnet_redis_enterprise_node1 redis-cli cluster info

# View Temporal status
tctl cluster describe

# View agent population
curl http://localhost:3000/api/agents/count

# View social raids
curl http://localhost:3000/api/raids/status

# View extension gateway
curl http://localhost:5000/extensions/health

# Restart specific service
docker compose restart openwebui

# View Temporal workflows
tctl workflow list

# Get workflow details
tctl workflow describe -w [workflow-id]
```

---

## 🎯 SUCCESS CRITERIA

✅ **Control-Core**: Responding on :3000  
✅ **Temporal**: Workflow engine online on :7233  
✅ **Redis**: Cluster operational (3 nodes)  
✅ **OpenWebUI**: LLM interface responsive on :3001  
✅ **Tailscale**: VPN mesh active  
✅ **Portainer**: Docker endpoint added  
✅ **Extension Gateway**: Routing all services  
✅ **17k Agents**: Connected + awaiting commands  
✅ **Social Raids**: Automated via LLM strategy  

---

## 🚨 TROUBLESHOOTING

### Control-Core not starting?
```bash
docker logs dreamnet_control_core
# If @dreamnet/memory-dna error: Re-run Step 1
```

### Temporal database not connecting?
```bash
docker logs dreamnet_temporal_server
# If connection error: Check temporal-postgres is healthy
docker exec dreamnet_temporal_postgres pg_isready
```

### Redis cluster not forming?
```bash
docker exec dreamnet_redis_enterprise_node1 redis-cli cluster slots
# If slots empty: Run cluster meet commands from deployment guide
```

### OpenWebUI models not working?
```bash
# Check API keys in .env.local
# Restart container:
docker compose restart openwebui
```

### Tailscale not connected?
```bash
docker logs dreamnet_tailscale
# If auth error: Token may be expired, generate new one
```

---

## ⏱️ TIMELINE SUMMARY

| Task | Time | Status |
|------|------|--------|
| Fix Control-Core | 5 min | 🔴 DO NOW |
| Prep Environment | 5 min | ⏳ Next |
| Deploy Stack | 10 min | ⏳ Next |
| Verification (11 items) | 15 min | ⏳ After Deploy |
| Temporal Integration | 20 min | 🟢 When Ready |
| Redis Migration | 10 min | 🟢 When Ready |
| LLM Strategy | 15 min | 🟢 When Ready |
| **TOTAL** | **~90 min** | **Ready** |

---

## 🎬 EXECUTION

**Ready?** Execute in order:

```bash
# 1. Fix (required)
npm install --recursive && npm run build && docker compose build control-core

# 2. Deploy (execute once control-core fixed)
docker compose -f docker-compose.yml -f docker-compose.enhanced.yml up -d

# 3. Verify (run after 2 min startup)
docker compose ps

# 4. Monitor
docker compose logs -f
npm run explore
```

---

**Status**: 🟢 **READY FOR AUTONOMOUS ORCHESTRATION**  
**Next Command**: Execute Step 1 NOW  
**Antigravity Authority**: ACTIVATED  

---
