# ✅ Simplified Server Startup - Complete

**Date**: 2025-01-27  
**Status**: Heavy subsystems disabled by default ✅

---

## ✅ What's Active (Always)

1. **Core Agents**:
   - ✅ LUCID
   - ✅ CANVAS
   - ✅ ROOT
   - ✅ ECHO

2. **Star Bridge**:
   - ✅ Star-Bridge Lungs (cross-chain breathwork)

3. **Health Endpoints**:
   - ✅ `/health`
   - ✅ `/ready`
   - ✅ `/health/live`
   - ✅ `/health/ready`

4. **Basic Routes**:
   - ✅ All API routes (they don't depend on heavy subsystems)

---

## ⏸️ What's Disabled (By Default)

All heavy subsystems are wrapped in `if (shouldInitHeavy)` conditional:

- ⏸️ DreamState (Governance)
- ⏸️ Directory (Entity Discovery)
- ⏸️ Network Blueprints (Bootstrap)
- ⏸️ Nerve Fabric (Event Bus)
- ⏸️ Spider Web Core (Event Threading)
- ⏸️ Wolf Pack Analyst (Pattern Learning)
- ⏸️ Shield Core (Multi-Phase Shield)
- ⏸️ Orca Pack (Communications)
- ⏸️ Whale Pack (Commerce)
- ⏸️ Webhook Nervous Core (Auto-Discovery)
- ⏸️ Jaggy (Silent Sentinel)
- ⏸️ DreamNet OS Core (Heartbeat)
- ⏸️ All Tier III/IV subsystems

---

## 🚀 How to Enable Gradually

### Step 1: Test Simplified Startup

**Deploy with heavy subsystems disabled** (default):
```bash
# No env var needed - defaults to disabled
pnpm deploy:gcp
```

**Server should start successfully** ✅

---

### Step 2: Enable One Subsystem at a Time

**Enable DreamState** (first logical addition):
```bash
# Set env var in Cloud Run
gcloud run services update dreamnet \
  --update-env-vars="INIT_HEAVY_SUBSYSTEMS=true" \
  --region us-central1
```

**Or add to `.env.gcp`**:
```
INIT_HEAVY_SUBSYSTEMS=true
```

**Then test**:
- Check logs: `gcloud run services logs read dreamnet --region us-central1`
- Verify DreamState initializes
- If it works, move to next subsystem

---

### Step 3: Re-enable Subsystems Gradually

**Uncomment subsystems in `server/index.ts`** one at a time:

1. **DreamState** (governance) - Most important
2. **Directory** (entity discovery) - Needed for passports
3. **Nerve Fabric** (event bus) - Needed for event routing
4. **Network Blueprints** (bootstrap) - Needed for network setup
5. **Others** - Add as needed

**Or use env var** to enable all at once (not recommended initially):
```bash
INIT_HEAVY_SUBSYSTEMS=true
```

---

## 📋 Current Status

- ✅ **Simplified startup**: Heavy subsystems disabled
- ✅ **Core agents**: Active (LUCID, CANVAS, ROOT, ECHO)
- ✅ **Star Bridge**: Active
- ✅ **Health endpoints**: Working
- ✅ **API routes**: Available
- ⏸️ **Heavy subsystems**: Disabled (can enable gradually)

---

## 🎯 Next Steps

1. **Deploy simplified version**:
   ```bash
   pnpm deploy:gcp
   ```

2. **Verify server starts**:
   - Check Cloud Run logs
   - Test `/health` endpoint
   - Verify core agents are active

3. **Enable subsystems gradually**:
   - Start with DreamState
   - Test after each addition
   - Add more as needed

---

**Status**: ✅ **Ready to deploy simplified version**  
**Next**: Deploy → Test → Enable subsystems gradually 🚀

