# Layer Deployment Guide for Antigravity

**Purpose**: Step-by-step guide for deploying DreamNet subsystems layer by layer to Cloud Run

---

## Overview

DreamNet subsystems are organized into layers:
- **Layer 1**: Core server (already deployed ✅)
- **Layer 2**: Tier II subsystems (Neural Mesh, QAL, Wolf Pack, etc.) - **READY TO DEPLOY**
- **Layer 3**: Tier III subsystems (Dream Cortex, Reputation Lattice, etc.)
- **Layer 4**: Tier IV subsystems (Dream Vault, Dream Shop, etc.)

---

## Prerequisites

1. **Google Cloud CLI** installed and authenticated
2. **Project ID**: `dreamnet-62b49` (or your project)
3. **Service Name**: `dreamnet-api-minimal`
4. **Region**: `us-central1`

---

## Deployment Process

### Step 1: Check Current State

```bash
# Get current service config
gcloud run services describe dreamnet-api-minimal \
  --region us-central1 \
  --format="value(spec.template.spec.containers[0].env)"
```

**Expected**: `INIT_SUBSYSTEMS=false`, `INIT_HEAVY_SUBSYSTEMS=false`

---

### Step 2: Deploy Layer Two (Tier II Subsystems)

#### Option A: Update via gcloud CLI (Recommended)

```bash
# Update environment variables
gcloud run services update dreamnet-api-minimal \
  --region us-central1 \
  --set-env-vars INIT_SUBSYSTEMS=true \
  --set-env-vars INIT_HEAVY_SUBSYSTEMS=false \
  --set-env-vars MESH_AUTOSTART=false
```

#### Option B: Update via Cloud Console

1. Go to Cloud Run console
2. Click on `dreamnet-api-minimal` service
3. Click "Edit & Deploy New Revision"
4. Go to "Variables & Secrets" tab
5. Add/Update:
   - `INIT_SUBSYSTEMS` = `true`
   - `INIT_HEAVY_SUBSYSTEMS` = `false` (keep false for now)
   - `MESH_AUTOSTART` = `false` (optional)
6. Click "Deploy"

#### Option C: Update Deployment Script

Edit `infrastructure/google/deploy-all.ts`:
```typescript
// Change this line:
`--set-env-vars=NODE_ENV=production,INIT_HEAVY_SUBSYSTEMS=false`

// To:
`--set-env-vars=NODE_ENV=production,INIT_SUBSYSTEMS=true,INIT_HEAVY_SUBSYSTEMS=false`
```

Then redeploy:
```bash
cd infrastructure/google
pnpm deploy:gcp
```

---

### Step 3: Verify Deployment

#### Check Service Status
```bash
# Get service URL
gcloud run services describe dreamnet-api-minimal \
  --region us-central1 \
  --format="value(status.url)"
```

#### Test Health Endpoints
```bash
# Health check
curl https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app/health

# Ready check (should show subsystems initialized)
curl https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app/ready
```

#### Check Logs
```bash
# View recent logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=dreamnet-api-minimal" \
  --limit 50 \
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

### Step 4: Test Each Subsystem

#### Neural Mesh (N-Mesh)
```bash
# Check if mesh is running (if MESH_AUTOSTART=true)
curl https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app/api/mesh/status
```

#### Quantum Anticipation Layer (QAL)
```bash
# Check QAL status (if endpoint exists)
curl https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app/api/qal/status
```

#### Wolf Pack Protocol
```bash
# Check Wolf Pack status
curl https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app/api/wolf-pack/status
```

---

### Step 5: Monitor Resource Usage

```bash
# Check service metrics
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

## Rollback Procedure

If deployment causes issues:

```bash
# Rollback to previous revision
gcloud run services update-traffic dreamnet-api-minimal \
  --region us-central1 \
  --to-revisions PREVIOUS_REVISION=100
```

Or disable subsystems:
```bash
# Disable Layer Two
gcloud run services update dreamnet-api-minimal \
  --region us-central1 \
  --set-env-vars INIT_SUBSYSTEMS=false
```

---

## Next Layers

### Layer Three (Tier III Subsystems)

After Layer Two is stable:

```bash
gcloud run services update dreamnet-api-minimal \
  --region us-central1 \
  --set-env-vars INIT_HEAVY_SUBSYSTEMS=true
```

**Includes**:
- Dream Cortex
- Reputation Lattice
- Narrative Field
- Identity Grid

### Layer Four (Tier IV Subsystems)

Already included when `INIT_HEAVY_SUBSYSTEMS=true`:
- Dream Vault
- Dream Shop
- Field Layer
- And more...

---

## Troubleshooting

### Subsystems Not Initializing

1. **Check logs** for import errors
2. **Verify packages** exist in `packages/`
3. **Check dependencies** are installed
4. **Verify environment variables** are set correctly

### Memory Issues

1. **Increase memory**: `--memory 4Gi`
2. **Check for memory leaks** in logs
3. **Disable non-essential subsystems** temporarily

### Startup Timeout

1. **Increase timeout**: `--timeout 600s`
2. **Check initialization order** in `server/index.ts`
3. **Disable slow subsystems** temporarily

---

## Success Criteria

Layer Two is successfully deployed when:

- ✅ Service starts without errors
- ✅ `/health` returns 200 OK
- ✅ `/ready` shows subsystems initialized
- ✅ Logs show all Tier II subsystems initialized
- ✅ No memory/CPU issues
- ✅ API endpoints respond correctly

---

## References

- `docs/ANTIGRAVITY_LAYER_DEPLOYMENT_STATUS.md` - Current state
- `server/index.ts` - Server initialization code
- `server/config/env.ts` - Environment variable config
- `Dockerfile` - Container configuration

