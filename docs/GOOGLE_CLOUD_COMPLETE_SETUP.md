# 🔐 Google Cloud Complete Setup Guide

**Date**: 2025-01-27  
**Project**: dreamnet-62b49  
**Status**: Ready to Complete Setup

---

## ✅ Step 1: Enable Billing (Required - 2 minutes)

### Why
Most Google Cloud services require billing to be enabled, even if you're using free credits.

### How

1. **Go to Billing Console**:
   - Direct link: https://console.cloud.google.com/billing?project=dreamnet-62b49
   - Or: Google Cloud Console → Billing

2. **Link Billing Account**:
   - If you have a billing account: Select it and click "Set Account"
   - If you don't have one: Click "Create Billing Account"
     - Fill in payment info (won't be charged if you have credits)
     - Link to project `dreamnet-62b49`

3. **Verify**:
   ```bash
   gcloud billing projects describe dreamnet-62b49
   ```
   Should show billing account info (not "billing not enabled")

---

## ✅ Step 2: Enable APIs (Automated - 2 minutes)

### Option A: Use My Script (Easiest)

**After billing is enabled**, run:
```bash
pnpm enable:gcp-apis
```

This will enable all 24 required APIs automatically.

### Option B: Enable Manually

Go to: https://console.cloud.google.com/apis/library?project=dreamnet-62b49

**Enable These APIs** (click each, then "Enable"):
- ✅ Kubernetes Engine API
- ✅ Compute Engine API
- ✅ Cloud SQL Admin API
- ✅ BigQuery API
- ✅ Cloud Storage API
- ✅ Cloud Build API
- ✅ Cloud Run API
- ✅ Cloud Functions API
- ✅ Pub/Sub API
- ✅ Cloud Scheduler API
- ✅ Service Usage API
- ✅ Cloud Resource Manager API

**Or enable all at once**:
- Go to: https://console.cloud.google.com/apis/dashboard?project=dreamnet-62b49
- Click "Enable APIs and Services"
- Search and enable each one

---

## ✅ Step 3: Authentication (Choose One Method)

### Method 1: Service Account (Recommended for Automation)

**Create Service Account**:

1. **Go to**: https://console.cloud.google.com/iam-admin/serviceaccounts?project=dreamnet-62b49
2. **Click**: "Create Service Account"
3. **Name**: `dreamnet-deployer`
4. **Description**: `Service account for DreamNet deployments`
5. **Click**: "Create and Continue"

**Grant Roles** (add all of these):
- ✅ **Kubernetes Engine Admin**
- ✅ **Cloud SQL Admin**
- ✅ **Storage Admin**
- ✅ **BigQuery Admin**
- ✅ **Cloud Build Editor**
- ✅ **Service Usage Admin**
- ✅ **Compute Admin**
- ✅ **Cloud Run Admin**
- ✅ **Pub/Sub Admin**
- ✅ **Cloud Functions Admin**
- ✅ **Service Account User**

**Click**: "Continue" → "Done"

**Create Key**:
1. **Click** on the service account you just created
2. **Go to**: "Keys" tab
3. **Click**: "Add Key" → "Create New Key"
4. **Select**: JSON
5. **Click**: "Create"
6. **Download** the JSON file

**Use the Key**:
```bash
# Tell me the path, or run:
pnpm setup:gcp-service-account /path/to/service-account.json
```

---

### Method 2: User Account (Browser Login)

**Authenticate**:
```bash
# This opens your browser
gcloud auth login

# Set application default credentials
gcloud auth application-default login
```

**Set Project**:
```bash
gcloud config set project dreamnet-62b49
gcloud config set account brandonducar1234@gmail.com
```

---

## ✅ Step 4: Verify Setup

### Test Authentication
```bash
gcloud auth list
# Should show your account
```

### Test Project Access
```bash
gcloud projects describe dreamnet-62b49
# Should show project info
```

### Test Billing
```bash
gcloud billing projects describe dreamnet-62b49
# Should show billing account (not "billing not enabled")
```

### Test APIs
```bash
pnpm tsx scripts/test-google-cloud-sdk.ts
# Should show APIs accessible
```

---

## 🚀 Step 5: Deploy!

Once billing is enabled and APIs are enabled:

### Deploy Data Infrastructure
```bash
pnpm deploy:data-gcp
```

### Deploy to Kubernetes
```bash
pnpm deploy:gke
```

### Or Deploy to Cloud Run
```bash
pnpm deploy:gcp
```

---

## 📋 Quick Checklist

- [ ] **Billing Enabled** (2 min)
  - Go to: https://console.cloud.google.com/billing?project=dreamnet-62b49
  - Link billing account

- [ ] **APIs Enabled** (2 min)
  - Run: `pnpm enable:gcp-apis`
  - Or enable manually in console

- [ ] **Authentication** (2 min)
  - Service account: `pnpm setup:gcp-service-account /path/to/key.json`
  - Or: `gcloud auth application-default login`

- [ ] **Test** (1 min)
  - Run: `pnpm tsx scripts/test-google-cloud-sdk.ts`

- [ ] **Deploy** (10 min)
  - Run: `pnpm deploy:gke` or `pnpm deploy:gcp`

---

## 💡 Pro Tips

### Check Billing Status
```bash
gcloud billing projects describe dreamnet-62b49
```

### Check API Status
```bash
gcloud services list --enabled --project=dreamnet-62b49
```

### Enable Single API
```bash
gcloud services enable container.googleapis.com --project=dreamnet-62b49
```

### View Credits
- Go to: https://console.cloud.google.com/billing?project=dreamnet-62b49
- Check "Credits" section
- You have $1,300 in credits!

---

## 🎯 What Happens After Setup

### Data Infrastructure
- ✅ Cloud SQL Postgres (replaces Neon)
- ✅ BigQuery (analytics warehouse)
- ✅ Redis (Memorystore)
- ✅ Cloud Storage (object storage)

### Kubernetes
- ✅ GKE cluster (3-10 nodes)
- ✅ Auto-scaling
- ✅ Load balancer
- ✅ SSL certificates

### Serverless
- ✅ Cloud Functions
- ✅ Cloud Run
- ✅ Pub/Sub

---

**Total Time**: ~10 minutes  
**Credits Available**: $1,300  
**Next**: Enable billing → Enable APIs → Deploy! 🚀

