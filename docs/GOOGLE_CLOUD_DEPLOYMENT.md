# Google Cloud Deployment - Quick Win
## Use Your $1,300 Credits to Deploy DreamNet

**Why Google Cloud?**
- ✅ You have $1,300 in credits (free hosting!)
- ✅ Railway keeps failing (memory issues)
- ✅ Google Cloud Run is perfect for our stack
- ✅ Firebase Hosting for frontend
- ✅ One successful build = we're live!

---

## 🚀 Quick Setup (30 minutes)

### Step 1: Set Up Google Cloud Credentials

**Option A: Firebase Token** (Easiest)
```bash
npm install -g firebase-tools
firebase login:ci
# Copy the token
```

**Option B: Service Account** (More powerful)
1. Go to Google Cloud Console
2. IAM & Admin → Service Accounts
3. Create service account
4. Grant roles:
   - Cloud Run Admin
   - Cloud Build Editor
   - Storage Admin
5. Create key (JSON)
6. Download JSON file

### Step 2: Add Credentials to Railway (or Local)

**In Railway Dashboard**:
```
GOOGLE_APPLICATION_CREDENTIALS=<path-to-json>
# OR
FIREBASE_TOKEN=<token-from-step-1>
GCP_PROJECT_ID=your-project-id
```

**Or use environment variables**:
```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
export GCP_PROJECT_ID=your-project-id
```

### Step 3: Deploy to Google Cloud Run

**Using deployment-core** (if implemented):
```bash
pnpm run deploy --platform=google-cloud-run
```

**Or manually**:
```bash
# Build Docker image
docker build -t gcr.io/YOUR_PROJECT_ID/dreamnet:latest .

# Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/dreamnet:latest

# Deploy to Cloud Run
gcloud run deploy dreamnet \
  --image gcr.io/YOUR_PROJECT_ID/dreamnet:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🎯 Recommended Approach: Firebase Hosting + Cloud Run

### Frontend → Firebase Hosting
- ✅ Fast CDN
- ✅ Free SSL
- ✅ Easy custom domains
- ✅ Uses your credits

### Backend → Cloud Run
- ✅ Serverless (scales to zero)
- ✅ Pay per use
- ✅ Handles memory better than Railway
- ✅ Uses your credits

---

## 📋 Deployment Checklist

- [ ] Google Cloud project created
- [ ] Billing enabled (uses credits)
- [ ] Credentials set up (Firebase token OR service account)
- [ ] Docker image built
- [ ] Deployed to Cloud Run
- [ ] Frontend deployed to Firebase Hosting
- [ ] Custom domain connected (dreamnet.ink)

---

## 💰 Cost Estimate

**With $1,300 Credits**:
- Cloud Run: ~$10-50/month (depending on traffic)
- Firebase Hosting: Free tier (then ~$0.026/GB)
- **Estimated**: 6-12 months free hosting!

---

## 🔧 Quick Fix: Use Google Cloud Instead of Railway

**Why This Works**:
- ✅ No memory limits (Cloud Run handles it better)
- ✅ Better build system (Cloud Build)
- ✅ Uses your credits
- ✅ More reliable than Railway

**Next Steps**:
1. Set up Google Cloud credentials
2. Create Dockerfile (if needed)
3. Deploy to Cloud Run
4. Deploy frontend to Firebase Hosting
5. **Done!** 🎉

---

## 🎯 The Goal

**Get ONE successful build/deployment.**

Once that works:
- ✅ Frontend + Backend live
- ✅ Using your credits
- ✅ No more Railway headaches
- ✅ **We're long gone!** 🚀

---

**Let's get you deployed on Google Cloud and use those credits!**

