# DreamNet Backend Deployment - Quick Reference

**Target:** `https://api.dreamnet.ink` (Google Cloud Run)  
**Status:** ✅ Ready to Deploy

---

## 🚀 Deploy in 2 Commands

```bash
# 1. Build and push
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/dreamnet:latest .

# 2. Deploy
gcloud run deploy dreamnet \
  --image gcr.io/YOUR_PROJECT_ID/dreamnet:latest \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --set-env-vars NODE_ENV=production,PORT=8080
```

---

## 📋 Prerequisites

```bash
# Authenticate
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID
```

---

## 🔧 Update Service

```bash
# Update code
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/dreamnet:latest .
gcloud run deploy dreamnet --image gcr.io/YOUR_PROJECT_ID/dreamnet:latest --region us-central1

# Update env vars
gcloud run services update dreamnet --region us-central1 --set-env-vars KEY=value

# Add database
gcloud run services update dreamnet --region us-central1 --set-env-vars DATABASE_URL="postgresql://..."
```

---

## 🔄 Rollback

```bash
# List revisions
gcloud run revisions list --service dreamnet --region us-central1

# Rollback
gcloud run services update-traffic dreamnet --region us-central1 --to-revisions REVISION=100
```

---

## 📊 Monitoring

```bash
# View logs
gcloud run services logs tail dreamnet --region us-central1

# Service details
gcloud run services describe dreamnet --region us-central1
```

---

## 🧪 Test Locally

```bash
# Build Docker image
docker build -t dreamnet:local .

# Run locally
docker run -p 8080:8080 -e NODE_ENV=production -e PORT=8080 dreamnet:local

# Test endpoints
curl http://localhost:8080/health
```

---

## 🧪 Smoke Tests

```powershell
# Local
.\scripts\smoke-test.ps1 -BaseUrl "http://localhost:8080"

# Cloud Run
.\scripts\smoke-test.ps1 -BaseUrl "https://YOUR-SERVICE-URL"
```

---

## 🌐 Custom Domain

```bash
gcloud run domain-mappings create \
  --service dreamnet \
  --domain api.dreamnet.ink \
  --region us-central1
```

---

## 📚 Full Documentation

- **Deployment Playbook:** `docs/DREAMNET_GCP_BACKEND_DEPLOY.md`
- **Implementation Plan:** `docs/BACKEND_DEPLOYMENT_IMPLEMENTATION_PLAN.md`
- **Validation Steps:** `docs/BACKEND_DEPLOYMENT_VALIDATION.md`
- **Summary:** `docs/BACKEND_DEPLOYMENT_SUMMARY.md`

---

## ✅ Checklist

- [ ] Authenticated with GCP
- [ ] Project ID set
- [ ] Environment variables prepared
- [ ] Deployed to Cloud Run
- [ ] Health endpoint tested
- [ ] Custom domain mapped (optional)
- [ ] Monitoring enabled

---

**Quick Start:** `gcloud builds submit` → `gcloud run deploy` → Done! 🎉
