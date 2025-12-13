# Minimal Server Startup - Step by Step

**Goal**: Start with absolute minimum, verify it works, then add subsystems one by one

---

## ✅ Current Status

- Server is running ✅
- Green checkmarks showing ✅
- GPT Agent Factory loaded ✅
- DreamNet OS loaded 64 agents ✅
- **Neural Mesh FAILED** ❌

---

## Phase 1: Minimal Server (Current)

**What's Running**:
- ✅ Express server
- ✅ Health endpoints
- ✅ Basic routes
- ✅ DreamNet OS (64 agents)

**What Failed**:
- ❌ Neural Mesh

**Action**: Disable Neural Mesh for now, verify server works

---

## Phase 2: Add Subsystems One by One

### Step 1: Nervous System Core
- Message Bus
- Shared Memory
- **Test**: Verify message routing works

### Step 2: Citadel Core
- Strategic command center
- **Test**: `/api/citadel/state` endpoint

### Step 3: OrchestratorCore
- Agent orchestration
- **Test**: Run orchestrator cycle

### Step 4: Agent Registry Core
- Agent registration
- **Test**: List registered agents

### Step 5: Neural Mesh (Fix First)
- Investigate why it failed
- Fix the issue
- Then enable it

---

## How to Disable Neural Mesh

Add to `.env`:
```bash
MESH_AUTOSTART=false
```

Or comment out Neural Mesh initialization in `server/index.ts`

---

## Testing After Each Addition

1. **Start server**: `pnpm dev:app`
2. **Test health**: `curl http://localhost:5000/api/health`
3. **Test new feature**: Verify the new subsystem works
4. **Check logs**: No errors
5. **Move to next**: Add next subsystem

---

**Next Step**: Disable Neural Mesh, verify server works perfectly, then add subsystems one by one

