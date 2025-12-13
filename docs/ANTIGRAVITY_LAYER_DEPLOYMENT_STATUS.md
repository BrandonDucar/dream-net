# Antigravity Layer Deployment Status

**Date**: 2025-12-02  
**Purpose**: Current state of layer deployment on Cloud Run

---

## Current Deployment State

### Production Site
- **URL**: https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app/
- **Service Name**: `dreamnet-api-minimal`
- **Region**: `us-central1`
- **Status**: ✅ **Running** (minimal mode)

### What's Currently Deployed

**✅ Active (Layer 1 - Core Server)**:
- Express server with basic middleware
- Health endpoints (`/health`, `/ready`)
- Core API routes (`/api/agent`, `/api/heartbeat`, etc.)
- Static file serving (client/dist)
- Basic error handling

**❌ NOT Active (Layer 2 - Tier II Subsystems)**:
- Neural Mesh (N-Mesh) - Synapse network
- Quantum Anticipation Layer (QAL) - Predictive modeling
- Squad Alchemy Engine - Agent coordination
- Wolf-Pack Protocol (WPP) - Offensive agents
- Octopus Executor - 8-Arm Runtime
- Slug-Time Memory Layer (STM) - Trend tracking
- Star-Bridge Lungs - Cross-chain breathwork
- Predator–Scavenger Loop (PSL) - Cleanup system

**❌ NOT Active (Layer 3 - Tier III Subsystems)**:
- Dream Cortex - Global intent/goal engine
- Reputation Lattice - Trust weave
- Narrative Field - Global story stream
- Identity Grid - Wallet + agent identity layer

**❌ NOT Active (Layer 4 - Tier IV Subsystems)**:
- Dream Vault, Dream Shop, Field Layer, etc.
- (Only loads if INIT_HEAVY_SUBSYSTEMS=true)

---

## Environment Variables (Current)

### Set in Dockerfile (Hardcoded)
```bash
NODE_ENV=production
PORT=8080
INIT_SUBSYSTEMS=false          # ❌ Disables Tier II subsystems
INIT_HEAVY_SUBSYSTEMS=false    # ❌ Disables Tier III/IV subsystems
MESH_AUTOSTART=false           # ❌ Disables mesh network
```

### Set in Cloud Run Deployment
- See `cloudbuild.yaml` and `infrastructure/google/deploy-all.ts`
- Currently: `INIT_HEAVY_SUBSYSTEMS=false` (hardcoded in deploy script)

---

## Layer Two Status

**Layer Two = Tier II Subsystems**

**Status**: ❌ **NOT DEPLOYED**

**Why**: `INIT_SUBSYSTEMS=false` in Dockerfile and Cloud Run config

**What Needs to Happen**:
1. Set `INIT_SUBSYSTEMS=true` in Cloud Run environment variables
2. Redeploy service
3. Test each subsystem after deployment
4. Monitor resource usage (Tier II subsystems are resource-intensive)

---

## Available Subsystems (Ready to Deploy)

### Tier II (Core Biomimetic) - Layer 2
All implemented in `packages/`:
- ✅ `packages/neural-mesh/` - Neural Mesh
- ✅ `packages/quantum-anticipation/` - QAL
- ✅ `packages/squad-alchemy-engine/` - Squad Alchemy
- ✅ `packages/wolf-pack/` - Wolf Pack Protocol
- ✅ `packages/octopus-executor/` - Octopus Executor
- ✅ `packages/slug-time-memory/` - STM
- ✅ `packages/star-bridge-lungs/` - Star Bridge Lungs
- ✅ `packages/predator-scavenger-loop/` - PSL

### Tier III (Advanced) - Layer 3
- ✅ `packages/dream-cortex/` - Dream Cortex
- ✅ `packages/reputation-lattice/` - Reputation Lattice
- ✅ `packages/narrative-field/` - Narrative Field
- ✅ `packages/identity-grid/` - Identity Grid

### Tier IV (Application Layer) - Layer 4
- ✅ All implemented (requires INIT_HEAVY_SUBSYSTEMS=true)

---

## Deployment Checklist

### To Deploy Layer Two (Tier II Subsystems)

- [ ] Update Cloud Run environment variables:
  - Set `INIT_SUBSYSTEMS=true`
  - Keep `INIT_HEAVY_SUBSYSTEMS=false` (for now)
  - Keep `MESH_AUTOSTART=false` (optional, can enable later)

- [ ] Update deployment script (`infrastructure/google/deploy-all.ts`):
  - Change `--set-env-vars=...,INIT_SUBSYSTEMS=false` to `INIT_SUBSYSTEMS=true`

- [ ] Or update Cloud Run directly:
  ```bash
  gcloud run services update dreamnet-api-minimal \
    --region us-central1 \
    --set-env-vars INIT_SUBSYSTEMS=true
  ```

- [ ] Test after deployment:
  - Check `/health` endpoint
  - Check `/ready` endpoint
  - Check server logs for subsystem initialization
  - Monitor resource usage

- [ ] Verify subsystems loaded:
  - Check logs for "Neural Mesh initialized"
  - Check logs for "QAL initialized"
  - Check logs for other Tier II subsystems

---

## Resource Considerations

**Current Cloud Run Config**:
- Memory: 2Gi
- CPU: 2 vCPU
- Max Instances: 10
- Timeout: 300s

**With Layer Two (Tier II Subsystems)**:
- May need more memory (4Gi recommended)
- CPU should be fine (2 vCPU)
- Startup time will increase (subsystems initialize)
- Cold start may be slower

**Recommendation**: Start with current config, monitor, scale up if needed.

---

## Next Steps

1. **Antigravity**: Deploy Layer Two (Tier II subsystems)
   - Update environment variables
   - Test each subsystem
   - Monitor performance

2. **Me**: Continue frontend work
   - Landing page with Mini Apps
   - Deployment automation
   - User-facing features

3. **Together**: Test integration
   - Frontend → Backend API calls
   - Mini Apps → Subsystem integration
   - End-to-end testing

---

## References

- `server/index.ts` - Server initialization code
- `server/config/env.ts` - Environment variable config
- `Dockerfile` - Current deployment config
- `cloudbuild.yaml` - Cloud Build deployment
- `infrastructure/google/deploy-all.ts` - Deployment script

