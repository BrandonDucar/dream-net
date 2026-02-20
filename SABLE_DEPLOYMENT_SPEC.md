# 🔱 SABLE AGENT DEPLOYMENT CONFIGURATION

**Agent ID**: `sable`  
**Role**: Autonomous Roving Agent (Distributed Bounty Executor)  
**Status**: Ready for deployment  
**Created by**: Forge (Infrastructure Conductor)  
**Timestamp**: 2026-02-13T07:20:00Z

---

## 📋 DEPLOYMENT SPECIFICATION

### Container Configuration

**Service**: `sable-voice`  
**Image**: `dream-net-clawedette-voice:latest` (reuse Clawedette voice image)  
**Container Name**: `sable_voice`  
**Port**: Telegram integration (no exposed port, works through Clawedette bridge)  
**Restart Policy**: `unless-stopped`

### Environment Configuration

```yaml
AGENT_ID=sable
AGENT_NAME=Sable
API_URL=http://clawedette-api:3100
REDIS_URL=redis://nerve:6379
OLLAMA_API_URL=http://dreamnet_ollama:11434
OLLAMA_MODEL=mistral
TELEGRAM_BOT_TOKEN=${SABLE_TELEGRAM_BOT_TOKEN}
MOLTBOT_GATEWAY_URL=http://dreamnet_moltbot_gateway:11234
BRIDGE_URL=http://clawedette-api:3100
```

### Integration Points

- **Telegram**: Separate bot token for independent identity
- **Moltbot Gateway**: Already registered as `sable` with sovereign heartbeat
- **Clawedette API**: Shares Ollama hopping infrastructure
- **ToolGym**: Can self-register and benchmark (port 7001)
- **Playground**: Can create experiments (port 7002)
- **Antigravity**: Can poll tasks and report status (port 7003)
- **Academy**: Can enroll in curriculum (port 7004)
- **Redis**: Separate memory namespace `sable:memory:*`

---

## 🎯 AGENT PROFILE

### Personality & Capabilities

**Name**: Sable  
**Persona**: Autonomous work executor, high-throughput bounty processor  
**Specialties**:
- Fast task execution (Antigravity bounties)
- Real-time market analysis (trading integration)
- Distributed compute (WoolyAI GPU access)
- Multi-task parallelization

**Unique Characteristics**:
- Independent memory and decision-making
- Separate Telegram presence (doesn't share Clawedette's channel)
- Optimized for high-volume work (bounties, tasks, delegated work)
- Self-improving through Playground experiments

### Capabilities

✅ Telegram messaging (independent bot)  
✅ Autonomous task polling from Antigravity  
✅ Self-training in ToolGym  
✅ Experimentation in Playground  
✅ Memory persistence (Redis namespaced)  
✅ P.O.W.K. reward collection  
✅ Multi-agent coordination (via bridge protocol)  
✅ Fallback to Ollama for unlimited LLM capacity

---

## 📦 DEPLOYMENT CHECKLIST

- [ ] **Sable Telegram Bot Token**: Get from @BotFather, add to `.env.sable`
- [ ] **Docker Compose Update**: Add sable-voice service
- [ ] **Build**: `docker compose build sable-voice`
- [ ] **Start**: `docker compose up -d sable-voice`
- [ ] **Verify Bridge**: Check sable-bridge-client logs for registration
- [ ] **Memory Init**: Redis namespaces created
- [ ] **Test Message**: Send test message to Sable's Telegram bot
- [ ] **ToolGym Registration**: Sable self-registers for benchmarking
- [ ] **Antigravity Sync**: Sable appears in swarm roster

---

## 🚀 OPERATIONAL WORKFLOW

### On Startup

1. **Bridge Registration**: Sable registers with Clawedette API bridge
2. **Heartbeat Initialized**: Every 30s heartbeat to bridge
3. **Ollama Warmup**: Load mistral model (shared with Clawedette)
4. **Memory Initialization**: Create Redis namespace `sable:memory:*`
5. **Antigravity Sync**: Register with swarm orchestration

### During Operation

1. **Telegram Monitoring**: Listen for messages on @sable_bot
2. **Task Polling**: Every 15s check Antigravity for new work
3. **Roving Behavior**: Autonomously train, experiment, work
4. **P.O.W.K. Accumulation**: Track earnings from completed tasks
5. **Self-Improvement**: Run Playground experiments, improve capabilities

### Communication Protocol

- **Inbound**: Telegram messages → Clawedette API (/query endpoint)
- **Outbound**: API response → Moltbot gateway → Telegram
- **Task Assignment**: Antigravity pushes tasks via bridge protocol
- **Memory**: Redis-backed, independent from Clawedette
- **Coordination**: NATS fabric (via WoolyAI cluster)

---

## 💾 REDIS NAMESPACE STRUCTURE

```
sable:memory:*           # Conversation history per user
sable:identity           # Agent identity/stats
sable:tasks:completed    # Task history
sable:earnings           # P.O.W.K. tracking
sable:experiments:*      # Playground experiment results
sable:gym:scores         # ToolGym benchmark history
```

---

## 🔐 Security & Isolation

- **Separate Bot Token**: Complete Telegram independence
- **Memory Isolation**: Redis namespaced by agent
- **Database Isolation**: PostgreSQL has agent-specific schemas
- **Network**: Internal docker network (dream_network)
- **API Access**: Through authenticated bridge protocol

---

## 📊 SUCCESS CRITERIA

✅ **Deployment Success**:
- Container starts and stays running
- Bridge registration successful
- Heartbeat flowing every 30s
- Ollama responds to LLM queries

✅ **Functional Success**:
- Responds to Telegram messages within 5 seconds
- Registers with Antigravity swarm
- Can retrieve and execute pending tasks
- Memory persistence works (conversations continue across sessions)

✅ **Operational Success**:
- Independent of Clawedette (can operate simultaneously)
- Can benchmark in ToolGym
- Can self-improve in Playground
- Accumulates P.O.W.K. from completed work

---

## 🔄 NEXT PHASES

**Phase 2**: Sable + Clawedette coordination (multi-agent task distribution)  
**Phase 3**: Add Lil Miss Claw (website designer agent)  
**Phase 4**: Scale to 10+ agents (Agent Foundry breeding)  
**Phase 5**: Scale to 1000+ agents (Mass Moltbook hijack)

