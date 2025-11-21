# 🚀 Google Cloud Setup - Do This Now

**Status**: Authentication ✅ | Billing ❌ | APIs ❌  
**Time**: 5 minutes total

---

## ✅ Step 1: Enable Billing (2 minutes)

**Direct Link**: https://console.cloud.google.com/billing?project=dreamnet-62b49

**What to Do**:
1. Click the link above
2. If you see a billing account: Select it → "Set Account"
3. If you don't: Click "Create Billing Account" → Fill form → Submit
4. Link to project `dreamnet-62b49`

**Verify**:
```bash
pnpm check:gcp-setup
```
Should show "Billing: ✅ Enabled"

---

## ✅ Step 2: Enable APIs (2 minutes)

**After billing is enabled**, run:
```bash
pnpm enable:gcp-apis
```

This enables all 24 required APIs automatically.

**Or enable manually**:
- Go to: https://console.cloud.google.com/apis/library?project=dreamnet-62b49
- Enable: Kubernetes Engine, Compute Engine, Cloud SQL, BigQuery, Storage, Cloud Build, Cloud Run, Functions, Pub/Sub, Service Usage

---

## ✅ Step 3: Set Application Default Credentials (1 minute)

**Run**:
```bash
gcloud auth application-default login
```

This opens your browser. Click "Allow" to grant permissions.

---

## ✅ Step 4: Verify Everything Works

**Run**:
```bash
pnpm check:gcp-setup
```

**Should show**:
- ✅ Billing: Enabled
- ✅ Authentication: Configured  
- ✅ APIs: Enabled

---

## 🚀 Step 5: Deploy!

**Deploy Data Infrastructure**:
```bash
pnpm deploy:data-gcp
```

**Deploy to Kubernetes**:
```bash
pnpm deploy:gke
```

**Or Deploy to Cloud Run**:
```bash
pnpm deploy:gcp
```

---

## 📋 Quick Checklist

- [ ] **Enable Billing**: https://console.cloud.google.com/billing?project=dreamnet-62b49
- [ ] **Enable APIs**: `pnpm enable:gcp-apis`
- [ ] **Set ADC**: `gcloud auth application-default login`
- [ ] **Verify**: `pnpm check:gcp-setup`
- [ ] **Deploy**: `pnpm deploy:gke`

---

## 💡 What You Get

### After Setup:
- ✅ **Cloud SQL Postgres** (production database)
- ✅ **BigQuery** (analytics warehouse)
- ✅ **Redis Memorystore** (caching)
- ✅ **GKE Cluster** (Kubernetes, auto-scaling)
- ✅ **Cloud Storage** (object storage)
- ✅ **Cloud Run** (serverless containers)
- ✅ **Cloud Functions** (serverless functions)

### Credits:
- 💰 **$1,300 available** - Won't be charged until credits run out

---

**Total Time**: 5 minutes  
**Direct Billing Link**: https://console.cloud.google.com/billing?project=dreamnet-62b49  
**Next**: Enable billing → Enable APIs → Deploy! 🚀

