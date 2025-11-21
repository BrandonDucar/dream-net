# 🚀 Google Cloud Action Plan: Replace Everything

**Date**: 2025-01-27  
**Goal**: Migrate from Vercel/Railway/Neon to Google Cloud  
**Status**: ✅ Ready to Execute

---

## ✅ What You're Right About

**You DON'T Need**:
- ❌ Vercel (replaced by Cloud Run + Cloud CDN)
- ❌ Railway (replaced by Cloud Run / GKE)
- ❌ Neon (replaced by Cloud SQL)
- ❌ Any other hosting services

**You ONLY Need**:
- ✅ GitHub (code)
- ✅ Cursor (IDE)
- ✅ Google Cloud (everything)
- ✅ Base (blockchain)

---

## 🎯 Critical Unlocks (Do These First)

### 1. **Domain & DNS** (5 minutes)

**To Issue Websites**:
- Buy domain (e.g., `dreamnet.ai`) OR use existing
- Configure DNS to point to Cloud Run

**How**:
```bash
# Deploy frontend
gcloud run deploy dreamnet-frontend --source ./client

# Get URL
gcloud run services describe dreamnet-frontend --region=us-central1

# Add CNAME record in DNS:
# Name: @
# Value: [Cloud Run URL]
```

**Or Use Cloud DNS** (Managed):
```bash
# Create managed zone
gcloud dns managed-zones create dreamnet-zone \
  --dns-name=dreamnet.ai \
  --description="DreamNet DNS"
```

**Status**: ⏳ Need domain configured

---

### 2. **GitHub Auto-Deploy** (5 minutes)

**Replace Vercel Auto-Deploy**:
- Connect GitHub repo to Cloud Build
- Auto-deploy on push (same as Vercel)

**How**:
1. Go to: https://console.cloud.google.com/cloud-build/triggers?project=aqueous-tube-470317-m6
2. Click "Create Trigger"
3. Connect GitHub repo
4. Set up auto-deploy on push to `main`

**Or Use GitHub Actions**:
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloud Run
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: google-github-actions/deploy-cloudrun@v1
        with:
          service: dreamnet-api
          image: gcr.io/aqueous-tube-470317-m6/dreamnet:${{ github.sha }}
```

**Status**: ⏳ Need to set up

---

### 3. **Environment Variables** (2 minutes)

**Replace Vercel Env Vars**:
- Use Secret Manager (better than .env files)

**How**:
```bash
# Store secrets
echo -n "your-db-password" | gcloud secrets create dreamnet-db-password --data-file=-

# Use in Cloud Run
gcloud run services update dreamnet-api \
  --update-secrets=DATABASE_PASSWORD=dreamnet-db-password:latest
```

**Status**: ✅ Can do now

---

### 4. **SSL Certificates** (Automatic)

**Google Handles This**:
- Cloud Run: Automatic SSL (free)
- Cloud Load Balancer: Managed SSL (free)

**Status**: ✅ Automatic, no action needed

---

## 🚀 Deployment Plan (Do This Now)

### Phase 1: Deploy Data Infrastructure (10 minutes)

**Replace Neon Postgres**:
```bash
pnpm deploy:data-gcp
```

**What Gets Created**:
- ✅ Cloud SQL Postgres (production database)
- ✅ BigQuery (analytics warehouse)
- ✅ Memorystore Redis (caching)
- ✅ Cloud Storage buckets

**Migration**:
- Export from Neon
- Import to Cloud SQL
- Update `DATABASE_URL` env var

---

### Phase 2: Deploy Backend API (15 minutes)

**Replace Railway**:
```bash
# Option A: Cloud Run (simpler, like Railway)
pnpm deploy:gcp

# Option B: GKE (more control, like Kubernetes)
pnpm deploy:gke
```

**What Gets Created**:
- ✅ API deployment (auto-scaling)
- ✅ Load balancer
- ✅ HTTPS endpoint
- ✅ Health checks

**Migration**:
- Update `API_URL` in frontend
- Deploy API to Cloud Run/GKE
- Test endpoints

---

### Phase 3: Deploy Frontend (10 minutes)

**Replace Vercel**:
```bash
# Deploy frontend to Cloud Run
cd client
gcloud run deploy dreamnet-frontend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="API_URL=https://dreamnet-api-xxxxx.run.app"
```

**Or Static Site** (Cloud Storage + CDN):
```bash
# Build frontend
pnpm build

# Upload to Cloud Storage
gsutil -m rsync -r ./dist gs://dreamnet-frontend

# Enable CDN
gcloud compute backend-buckets create dreamnet-cdn \
  --gcs-bucket-name=dreamnet-frontend
```

**What Gets Created**:
- ✅ Frontend deployment
- ✅ HTTPS endpoint
- ✅ CDN (faster than Vercel)
- ✅ Auto-scaling

**Migration**:
- Build frontend
- Deploy to Cloud Run or Cloud Storage
- Update DNS

---

### Phase 4: Set Up Auto-Deploy (5 minutes)

**Replace Vercel Auto-Deploy**:
```bash
# Create Cloud Build trigger
gcloud builds triggers create github \
  --repo-name=dream-net \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

**What Gets Created**:
- ✅ Auto-deploy on push (same as Vercel)
- ✅ Build logs
- ✅ Deployment history

---

## 📊 What Replaces What

| Old Service | Google Cloud Replacement | Command |
|------------|-------------------------|---------|
| **Vercel Frontend** | Cloud Run + Cloud CDN | `gcloud run deploy dreamnet-frontend` |
| **Vercel Functions** | Cloud Functions Gen 2 | `gcloud functions deploy` |
| **Railway Backend** | Cloud Run / GKE | `pnpm deploy:gcp` / `pnpm deploy:gke` |
| **Neon Postgres** | Cloud SQL Postgres | `pnpm deploy:data-gcp` |
| **Vercel Env Vars** | Secret Manager | `gcloud secrets create` |
| **Vercel Auto-Deploy** | Cloud Build | `gcloud builds triggers create` |
| **Vercel Edge** | Cloud CDN | Automatic with Cloud Storage |

---

## 🎯 Quick Start: Deploy Everything Now

### Step 1: Deploy Data (10 min)
```bash
pnpm deploy:data-gcp
```

### Step 2: Deploy API (15 min)
```bash
pnpm deploy:gcp  # Cloud Run (simpler)
# OR
pnpm deploy:gke  # Kubernetes (more control)
```

### Step 3: Deploy Frontend (10 min)
```bash
cd client
gcloud run deploy dreamnet-frontend --source . --region us-central1
```

### Step 4: Set Up Auto-Deploy (5 min)
```bash
# Create Cloud Build trigger (via console or CLI)
```

**Total Time**: ~40 minutes  
**Result**: Everything running on Google Cloud, no Vercel/Railway needed ✅

---

## 💰 Cost Comparison

### Current Stack (Monthly)
- Vercel: $20-100
- Railway: $20-100
- Neon: $19-99
- **Total**: $59-299/month

### Google Cloud (Monthly)
- Cloud Run: $0-50 (free tier: 2M requests)
- Cloud SQL: $7-50 (free tier: 1 instance)
- Cloud Storage: $0-10 (free tier: 5GB)
- **Total**: $7-110/month

**Savings**: 50-80% cheaper ✅  
**Credits**: $300 available (lasts months)

---

## 🔑 Critical Unlocks Summary

1. **Domain & DNS**: Configure DNS → **Can issue websites** ✅
2. **GitHub Integration**: Connect repo → **Auto-deploy** ✅
3. **Secret Manager**: Store env vars → **Production ready** ✅
4. **Cloud CDN**: Enable for faster sites → **Better than Vercel** ✅

**Everything Else**: Already enabled! 🚀

---

## 📋 Checklist

- [x] **Billing**: Linked ($300 credits)
- [x] **APIs**: 23/24 enabled
- [x] **Authentication**: Configured
- [x] **Project**: Ready (`aqueous-tube-470317-m6`)
- [ ] **Domain**: Need to configure (optional)
- [ ] **Auto-Deploy**: Need to set up (5 minutes)
- [ ] **Deploy Data**: Ready to run
- [ ] **Deploy API**: Ready to run
- [ ] **Deploy Frontend**: Ready to run

---

## 🚀 Next Steps

1. **Deploy Data Infrastructure** (10 min):
   ```bash
   pnpm deploy:data-gcp
   ```

2. **Deploy Backend API** (15 min):
   ```bash
   pnpm deploy:gcp
   ```

3. **Deploy Frontend** (10 min):
   ```bash
   cd client
   gcloud run deploy dreamnet-frontend --source .
   ```

4. **Set Up Auto-Deploy** (5 min):
   - Connect GitHub to Cloud Build
   - Auto-deploy on push

**Total**: ~40 minutes to replace everything ✅

---

## 💡 About AWS

**AWS Status**: Policy attached, but permissions need verification

**Recommendation**: 
- ✅ **Focus on Google Cloud first** (you're right)
- ⏳ **AWS later** (if needed for redundancy or specific services)
- 🎯 **Google Cloud can do everything** (no AWS needed)

**When to Use AWS**:
- Multi-cloud redundancy (optional)
- Specific AWS-only services (rare)
- Cost optimization (Google is cheaper)

**For Now**: Google Cloud is enough ✅

---

**Status**: ✅ **READY TO DEPLOY**  
**Next**: Run `pnpm deploy:data-gcp` → `pnpm deploy:gcp` → Deploy frontend → Done! 🎉

