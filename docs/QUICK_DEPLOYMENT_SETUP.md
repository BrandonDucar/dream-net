# Quick Deployment Setup
## Google Cloud Project: dreamnet-62b49

**Project ID**: `dreamnet-62b49`  
**Project Number**: `857935117713`  
**Credits**: $1,300 available

---

## 🚀 Quick Start

### Step 1: Authenticate Google Cloud

**Option A: Interactive Login**
```bash
gcloud auth login
gcloud config set project dreamnet-62b49
```

**Option B: Service Account** (if you have JSON key)
```bash
gcloud auth activate-service-account --key-file=/path/to/key.json
gcloud config set project dreamnet-62b49
```

### Step 2: Enable APIs
```bash
bash scripts/setup-google-cloud.sh
```

This enables:
- Cloud Build
- Cloud Run
- Container Registry
- Firebase

### Step 3: Deploy
```bash
bash scripts/deploy-google-cloud.sh
```

---

## 📋 Environment Variables

Create `.env` file (or set in Railway/Vercel):

```bash
# Google Cloud
GCP_PROJECT_ID=dreamnet-62b49
GCP_PROJECT_NUMBER=857935117713

# Firebase (if using)
FIREBASE_TOKEN=your-token

# Or Service Account
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
```

---

## 🎯 What Happens

1. **Build**: Cloud Build creates Docker image
2. **Push**: Image pushed to Container Registry
3. **Deploy**: Cloud Run deploys container
4. **Result**: Frontend + Backend live!

---

## 💰 Cost Estimate

**With $1,300 Credits**:
- Cloud Run: ~$10-50/month
- Cloud Build: ~$0.10/build
- Container Registry: Free tier
- **Estimated**: 6-12 months free!

---

## 🔍 Check Status

```bash
# List Cloud Run services
gcloud run services list --project dreamnet-62b49

# View logs
gcloud run services logs read dreamnet --project dreamnet-62b49

# Get service URL
gcloud run services describe dreamnet --project dreamnet-62b49 --format="value(status.url)"
```

---

## 🚀 Ready to Deploy!

Once authenticated, just run:
```bash
bash scripts/deploy-google-cloud.sh
```

**That's it!** Your app will be live on Google Cloud! 🎉

