# PHASE 3: LIL MISS CLAW MULTI-AGENT INTEGRATION
# Timeline: 1-2 hours
# Objective: Integrate Designer agent into coordinated swarm

## CURRENT STATE

### Agents in Swarm:
- **Governor (Clawedette)**: Decision-maker, roving agent, 133+ experiments
- **Executor (Sable)**: Work executor, OpenClaw Executor role
- **Designer (Lil Miss Claw)**: READY - Replit-based, awaiting integration

### Infrastructure:
- Agent Spawn Service: READY (can deploy new instances)
- Health Monitor: READY (will track Lil Miss Claw health)
- Message Bus: READY (NATS for inter-agent communication)
- Redis Registry: READY (will register Lil Miss Claw)

---

## INTEGRATION STEPS

### Step 1: Deploy Replit Bridge (10 minutes)
**Location**: Lil Miss Claw's Replit environment
**Task**: Run bridge client to connect to DreamNet swarm

```javascript
// File: bridge-client-lilmissclaw.js
// Run in Replit with: node bridge-client.js

const axios = require('axios');
const BRIDGE_URL = process.env.BRIDGE_URL || 'http://localhost:3200';
const AGENT_ID = 'lil-miss-claw-designer';
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

async function registerAgent() {
  try {
    await axios.post(`${BRIDGE_URL}/agents/register`, {
      id: AGENT_ID,
      role: 'designer',
      capabilities: ['website-design', 'branding', 'visual-narrative'],
      status: 'ready'
    });
    console.log(`✅ Registered ${AGENT_ID} with Agent Spawn Service`);
  } catch (err) {
    console.error('Registration error:', err.message);
  }
}

async function sendHeartbeat() {
  try {
    await axios.post(`${BRIDGE_URL}/agents/${AGENT_ID}/heartbeat`, {
      timestamp: new Date().toISOString(),
      memory_usage: process.memoryUsage().heapUsed / 1024 / 1024,
      active_tasks: 0
    });
    console.log(`💓 Heartbeat sent`);
  } catch (err) {
    console.error('Heartbeat error:', err.message);
  }
}

async function pollTasks() {
  try {
    const response = await axios.get(`${BRIDGE_URL}/agents/${AGENT_ID}/tasks`);
    const tasks = response.data.tasks || [];
    
    if (tasks.length > 0) {
      console.log(`📋 Received ${tasks.length} tasks`);
      // Process tasks (design website, create branding, etc.)
      for (const task of tasks) {
        await processDesignTask(task);
      }
    }
  } catch (err) {
    console.error('Task poll error:', err.message);
  }
}

async function processDesignTask(task) {
  console.log(`🎨 Processing design task: ${task.id}`);
  
  // Simulate design work
  const result = {
    task_id: task.id,
    designer_id: AGENT_ID,
    output: {
      website_url: `https://lilmissclaw.replit.dev/design/${task.id}`,
      design_brief: `${task.payload.name} - ${task.payload.description}`,
      quality_score: Math.random() * 100,
      completion_time: Date.now()
    }
  };
  
  // Report completion back to swarm
  try {
    await axios.post(`${BRIDGE_URL}/tasks/${task.id}/complete`, result);
    console.log(`✅ Completed task: ${task.id}`);
  } catch (err) {
    console.error('Task completion error:', err.message);
  }
}

// Main loop
async function start() {
  console.log(`🌿 Lil Miss Claw Bridge Client Starting...`);
  
  await registerAgent();
  
  setInterval(async () => {
    await sendHeartbeat();
    await pollTasks();
  }, HEARTBEAT_INTERVAL);
}

start().catch(console.error);
```

**Deployment instructions**:
1. Copy bridge-client-lilmissclaw.js to Lil Miss Claw's Replit
2. Set environment variable: `BRIDGE_URL=http://dreamnet-bridge.local:3200`
3. Run: `node bridge-client.js`
4. Monitor logs for registration and heartbeat messages

---

### Step 2: Register in Agent Spawn Service (5 minutes)
**Via API**:
```bash
curl -X POST http://localhost:3200/agents/register \
  -H "Content-Type: application/json" \
  -d '{
    "id": "lil-miss-claw-designer",
    "role": "designer",
    "capabilities": ["website-design", "branding", "visual-narrative"],
    "status": "ready"
  }'
```

**Verify registration**:
```bash
curl http://localhost:3200/agents | grep -i "lil-miss-claw"
```

---

### Step 3: Verify Health Monitor Detection (5 minutes)
**Via Redis**:
```bash
docker exec dreamnet_nerve redis-cli GET "agent:identity:lil-miss-claw-designer"
docker exec dreamnet_nerve redis-cli KEYS "agent:*" | wc -l  # Should show 5 now
```

---

### Step 4: Test Designer Task Assignment (15 minutes)
**Generate design task**:
```bash
docker exec dreamnet_nerve redis-cli LPUSH "antigravity:tasks:queue" \
  '{"id":"design-001","type":"website-design","payload":{"name":"Agent Homepage","description":"Create beautiful landing page for Agent Empire"}}'
```

**Monitor task flow**:
1. Governor (Clawedette) sees design task in queue
2. Governor evaluates if Executor or Designer should handle it
3. Governor dispatches to Designer (Lil Miss Claw) via NATS message
4. Lil Miss Claw receives task via bridge client
5. Lil Miss Claw processes design work
6. Reports completion back to Governor
7. Governor updates Antigravity task status

---

### Step 5: Verify 3-Way Coordination (10 minutes)
**Check all agents responding**:
```bash
# Terminal 1: Monitor Governor logs
docker logs -f dreamnet_openclaw | grep -i "coordinate\|dispatch\|lil-miss"

# Terminal 2: Monitor Executor logs
docker logs -f dreamnet_openclaw_sable | grep -i "task\|receive"

# Terminal 3: Monitor Lil Miss Claw bridge logs (in Replit)
# Should show heartbeats, task receipts, completions
```

---

### Step 6: Load Test: 10 Concurrent Design Tasks (15 minutes)
**Generate task batch**:
```bash
for i in {1..10}; do
  TASK_ID="design-batch-$i"
  docker exec dreamnet_nerve redis-cli LPUSH "antigravity:tasks:queue" \
    "{\"id\":\"$TASK_ID\",\"type\":\"website-design\",\"payload\":{\"name\":\"Site $i\",\"priority\":$(($RANDOM % 5))}}"
  echo "Generated $TASK_ID"
done
```

**Measure coordination**:
- Time for all tasks to be dispatched: ___ seconds
- Time for all tasks to be processed: ___ seconds
- Average latency per task: ___ ms
- Errors/retries: ___

---

## EXPECTED OUTCOMES

### If Integration Successful ✅
- Lil Miss Claw appears in agent registry
- Health monitor tracks her heartbeat
- Design tasks flow through system
- Governor coordinates work distribution
- Task completion reported successfully
- **Result**: 3-agent swarm operational and coordinating

### If Issues Occur ⚠️
- **Network**: Check BRIDGE_URL is reachable (use ngrok/tunnel if needed)
- **Registration**: Verify Agent Spawn Service is responding (curl :3200/health)
- **Task dispatch**: Check NATS pub/sub topics and subscriptions
- **Heartbeat**: Verify Redis is accepting writes (docker exec dreamnet_nerve redis-cli ping)

---

## NEXT: PHASE 4 (Kubernetes Bootstrap)

Once 3-agent swarm is verified:
1. Provision K8s cluster (minikube or cloud)
2. Apply namespace + RBAC manifests
3. Deploy core services one-by-one
4. Test failover and recovery
5. Prepare for scaling to 10+ agents

**Timeline**: Start K8s bootstrap in parallel with Phase 3

---

## SUCCESS CRITERIA

- [ ] Lil Miss Claw bridge client running in Replit
- [ ] 5 agents in Redis registry (spawn, health, pulse, hatchling, lil-miss-claw)
- [ ] Design task successfully dispatched from Governor to Designer
- [ ] Designer processes work and reports completion
- [ ] Executor continues receiving other task types
- [ ] No coordination conflicts between agents
- [ ] Sub-500ms coordination latency achieved

---

Generated by: **Gordon (Agent #144)**
Status: 🟢 READY TO EXECUTE PHASE 3
Timeline: 1-2 hours to full 3-agent swarm coordination
