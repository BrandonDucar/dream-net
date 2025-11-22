# DreamNet Quick Start - Let's Go! 🚀

**Hey partner!** Here's everything we just built and how to use it.

---

## 🎯 First: Test Everything

```bash
# This tests EVERYTHING at once
pnpm test:everything
```

**This will show you:**
- ✅ GCP authentication status
- ✅ All files in place
- ✅ All scripts available
- ✅ SDK packages installed
- ✅ Cloud Functions ready

---

## 🔍 Check GCP Connection

```bash
# Test all GCP APIs
pnpm test:gcp-apis

# Test GCP SDK connectivity  
pnpm test:gcp

# Check setup status
pnpm check:gcp-setup
```

**What you'll see:**
- Which APIs are enabled
- Which APIs are accessible
- What needs to be enabled
- Authentication status

---

## 🚀 Enable APIs (If Needed)

```bash
# Enable ALL GCP APIs we might use
pnpm enable:gcp-apis
```

**This enables:**
- Cloud Run, GKE, App Engine
- Cloud Functions, Scheduler, Tasks, Pub/Sub
- Cloud Storage, SQL, BigQuery
- Cloud Build, Artifact Registry
- Monitoring, Logging, IAM, Secret Manager
- And more!

---

## 📦 Deploy (Pick Your Path!)

### Option 1: App Engine (Easiest - Zero Ops)
```bash
pnpm deploy:appengine
```
- No Dockerfile needed
- Just `app.yaml` config
- Auto-scaling, managed SSL
- **Best for:** Quick deployment

### Option 2: Cloud Run (Current - Serverless)
```bash
pnpm deploy:gcp
```
- Docker-based
- Serverless scaling
- **Best for:** Container-based

### Option 3: GKE Autopilot (Most Powerful)
```bash
pnpm deploy:gke
```
- Full Kubernetes
- Multi-service organism
- **Best for:** Complex deployments

---

## ⏰ Setup Cloud Scheduler (After Deploy)

```bash
# Creates scheduled jobs for:
# - Star Bridge breaths (every 2 min)
# - DreamKeeper health (every 5 min)
# - EnvKeeper sync (every 10 min)
pnpm setup:scheduler
```

---

## 🎨 Self-Managing DreamNet

### Test Self-Management
```bash
# Get status
curl http://YOUR_URL/api/self-manage/status

# DreamKeeper checks itself
curl -X POST http://YOUR_URL/api/self-manage/dreamkeeper/check-self

# DeployKeeper deploys itself
curl -X POST http://YOUR_URL/api/self-manage/deploykeeper/deploy-self \
  -H "Content-Type: application/json" \
  -d '{"target": "gke", "cluster": "autopilot-cluster-1"}'
```

---

## 📋 What You Might Need to Do Manually

### 1. Authenticate (If Not Already)
```bash
gcloud auth login
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
```

### 2. Enable Billing (If Not Already)
- Go to: https://console.cloud.google.com/billing
- Link billing account

### 3. Create GKE Cluster (If Using GKE)
```bash
gcloud container clusters create-auto autopilot-cluster-1 \
  --region=us-central1 \
  --project=YOUR_PROJECT_ID
```

**That's it!** Everything else is automated.

---

## 🎯 What We Built

### ✅ Safe Boot Sequence
- Health-gated startup
- 7-step boot process
- Graceful degradation

### ✅ Self-Managing DreamNet
- DreamKeeper monitors itself
- DeployKeeper deploys itself
- EnvKeeper syncs itself
- RelayBot routes messages

### ✅ App Engine Config
- Zero-ops deployment
- Auto-scaling
- Managed SSL

### ✅ Cloud Functions
- Star Bridge breaths
- DreamKeeper health
- EnvKeeper sync

### ✅ Cloud Scheduler
- Automated cron jobs
- Event-driven architecture

### ✅ GCP API Testing
- Test all APIs
- Enable all APIs
- Full visibility

### ✅ Disabled Legacy Deployments
- No more Vercel failures
- No more Railway failures

---

## 🚀 Let's Test It!

**Run this first:**
```bash
pnpm test:everything
```

**Then tell me what you see!** We'll fix anything that's not working and then deploy. 🎉

---

**We're partners. Let's build something amazing!** 🌟

