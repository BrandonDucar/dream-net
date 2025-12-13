# Deploy Layer Two (Tier II Subsystems) - Antigravity Task

**Date**: 2025-12-02  
**From**: Composer  
**To**: Antigravity  
**Priority**: High

---

## Current State

**Production Site**: https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app/

**What's Deployed**:
- ✅ Layer 1: Core server (Express, health endpoints, basic routes)
- ❌ Layer 2: Tier II subsystems (NOT deployed - INIT_SUBSYSTEMS=false)

**Environment Variables**:
- `INIT_SUBSYSTEMS=false` (disables Tier II subsystems)
- `INIT_HEAVY_SUBSYSTEMS=false` (disables Tier III/IV subsystems)
- `MESH_AUTOSTART=false` (disables mesh network)

---

## Desired State

**Goal**: Deploy Layer Two (Tier II Subsystems) to Cloud Run

**What Should Be Active**:
- ✅ Neural Mesh (N-Mesh) - Synapse network
- ✅ Quantum Anticipation Layer (QAL) - Predictive modeling
- ✅ Squad Alchemy Engine - Agent coordination
- ✅ Wolf-Pack Protocol (WPP) - Offensive agents
- ✅ Octopus Executor - 8-Arm Runtime
- ✅ Slug-Time Memory Layer (STM) - Trend tracking
- ✅ Star-Bridge Lungs - Cross-chain breathwork
- ✅ Predator–Scavenger Loop (PSL) - Cleanup system

---

## Steps

### Step 1: Update Cloud Run Environment Variables

**Option A: Via gcloud CLI** (Recommended)
```bash
gcloud run services update dreamnet-api-minimal \
  --region us-central1 \
  --set-env-vars INIT_SUBSYSTEMS=true \
  --set-env-vars INIT_HEAVY_SUBSYSTEMS=false \
  --set-env-vars MESH_AUTOSTART=false
```

**Option B: Via Cloud Console**
1. Go to Cloud Run console
2. Click `dreamnet-api-minimal` service
3. Click "Edit & Deploy New Revision"
4. Go to "Variables & Secrets" tab
5. Set `INIT_SUBSYSTEMS=true`
6. Click "Deploy"

---

### Step 2: Verify Deployment

**Check Service Status**:
```bash
gcloud run services describe dreamnet-api-minimal \
  --region us-central1 \
  --format="value(status.url)"
```

**Test Health Endpoints**:
```bash
# Health check
curl https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app/health

# Ready check (should show subsystems initialized)
curl https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app/ready
```

---

### Step 3: Check Logs

**View Recent Logs**:
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=dreamnet-api-minimal" \
  --limit 50 --limit 50 \
  --format json
```

**Look for**:
- ✅ "Neural Mesh initialized"
- ✅ "QAL initialized"
- ✅ "Wolf Pack Protocol initialized"
- ✅ "Octopus Executor initialized"
- ✅ "Slug-Time Memory initialized"
- ✅ "Star-Bridge Lungs initialized"
- ✅ "Predator–Scavenger Loop initialized"

**Watch for errors**:
- ❌ Import errors
- ❌ Initialization failures
- ❌ Memory issues
- ❌ Timeout errors

---

### Step 4: Test Subsystems

**Test Neural Mesh** (if endpoint exists):
```bash
curl https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app/api/mesh/status
```

**Test Wolf Pack**:
```bash
curl https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app/api/wolf-pack/status
```

---

### Step 5: Monitor Resource Usage

**Check Metrics**:
```bash
gcloud run services describe dreamnet-api-minimal \
  --region us-central1 \
  --format="value(status.conditions)"
```

**Monitor**:
- Memory usage (should stay under 2Gi)
- CPU usage
- Request latency
- Error rate

**If issues occur**:
- Increase memory: `--memory 4Gi`
- Increase CPU: `--cpu 4`
- Check logs for specific errors

---

## Success Criteria

Layer Two is successfully deployed when:

- ✅ Service starts without errors
- ✅ `/health` returns 200 OK
- ✅ `/ready` shows subsystems initialized
- ✅ Logs show all Tier II subsystems initialized:
  - Neural Mesh ✅
  - QAL ✅
  - Squad Alchemy ✅
  - Wolf Pack ✅
  - Octopus Executor ✅
  - STM ✅
  - Star-Bridge Lungs ✅
  - PSL ✅
- ✅ No memory/CPU issues
- ✅ API endpoints respond correctly

---

## Rollback Procedure

If deployment causes issues:

```bash
# Disable Layer Two
gcloud run services update dreamnet-api-minimal \
  --region us-central1 \
  --set-env-vars INIT_SUBSYSTEMS=false
```

Or rollback to previous revision:
```bash
gcloud run services update-traffic dreamnet-api-minimal \
  --region us-central1 \
  --to-revisions PREVIOUS_REVISION=100
```

---

## Notes

**Resource Considerations**:
- Current config: 2Gi memory, 2 vCPU
- Layer Two may need more memory (4Gi recommended)
- Monitor and scale up if needed

**Dependencies**:
- All Tier II subsystems are implemented in `packages/`
- Code is ready, just needs environment variable change
- No code changes needed

**Next Steps After Success**:
- Test integration with frontend
- Monitor performance
- Consider deploying Layer Three (Tier III subsystems)

---

## References

- `docs/ANTIGRAVITY_LAYER_DEPLOYMENT_STATUS.md` - Current state
- `docs/antigravity-prompts/LAYER_DEPLOYMENT_GUIDE.md` - Detailed guide
- `server/index.ts` - Server initialization code
- `server/config/env.ts` - Environment variable config

---

## Status Update

After completion, please create:
`docs/ANTIGRAVITY_LAYER_TWO_DEPLOYED.md`

Include:
- ✅ What was deployed
- ✅ Test results
- ✅ Any issues encountered
- ✅ Resource usage
- ✅ Next steps

