# 🚀 DreamNet Production Deployment - Google Cloud Run

**Status:** ✅ **READY TO DEPLOY**  
**Target:** `dreamnet.ink` on Google Cloud Run  
**Date:** 2025-01-27

---

## 🎯 What This Does

Deploys DreamNet to **Google Cloud Run** as a single production service:
- ✅ **Backend API** at `/api/*`
- ✅ **Admin Dashboard** at `/admin/*`
- ✅ **Main Frontend** at `/*`
- ✅ **Real APIs** (OpenAI, Twilio, etc. - no mocks)
- ✅ **Custom Domain** `dreamnet.ink` (you'll point DNS from Namecheap)

---

## 💰 Google Cloud Costs

**Free Tier:**
- 2 million requests/month free
- 360,000 GB-seconds compute free
- 180,000 vCPU-seconds free

**After Free Tier:**
- ~$0.40 per million requests
- ~$0.00002400 per GB-second
- ~$0.00001000 per vCPU-second

**Estimated Monthly Cost (Low Traffic):** $5-20/month

---

## 📋 Pre-Deployment Checklist

### ✅ Required: Google Cloud Project
1. Create GCP project: https://console.cloud.google.com/projectcreate
2. Enable billing (you have $1,300 credits)
3. Enable APIs:
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable artifactregistry.googleapis.com
   gcloud services enable secretmanager.googleapis.com
   gcloud services enable sqladmin.googleapis.com  # If using Cloud SQL
   ```

### ✅ Required: Environment Variables & Secrets

**Critical (Must Have):**
- `NODE_ENV=production`
- `PORT=8080` (auto-set by Cloud Run)
- `DATABASE_URL` (PostgreSQL connection string)
- `SESSION_SECRET` (random string for sessions)

**API Keys (Real APIs - No Mocks):**
- `OPENAI_API_KEY` - Real OpenAI API
- `ANTHROPIC_API_KEY` - Real Anthropic API (optional)
- `TWILIO_ACCOUNT_SID` - Real Twilio SMS
- `TWILIO_AUTH_TOKEN` - Real Twilio SMS
- `TWILIO_PHONE_NUMBER` - Your Twilio number
- `DREAMNET_VOICE_RECIPIENT` - SMS recipient (+15613378933)

**Blockchain (Real RPCs):**
- `BASE_MAINNET_RPC_URL` - Base mainnet RPC
- `BASE_SEPOLIA_RPC_URL` - Base Sepolia RPC (optional)
- `BASE_SCAN_API_KEY` - BaseScan API key (optional)

**Optional:**
- `VERCEL_TOKEN` - If using Vercel integration
- `STRIPE_SECRET_KEY` - If using payments
- `GCP_PROJECT_ID` - Auto-detected if not set
- `GCP_REGION` - Defaults to us-central1

---

## 🔐 Step 1: Store Secrets in Google Secret Manager

**Create secrets for sensitive values:**

```bash
# Set your GCP project
export PROJECT_ID=your-gcp-project-id
export REGION=us-central1

# Create secrets
gcloud secrets create database-url --data-file=- <<< "postgresql://user:pass@host/db"
gcloud secrets create session-secret --data-file=- <<< "$(openssl rand -hex 32)"
gcloud secrets create openai-api-key --data-file=- <<< "sk-..."
gcloud secrets create anthropic-api-key --data-file=- <<< "sk-ant-..."  # Optional
gcloud secrets create twilio-account-sid --data-file=- <<< "AC..."
gcloud secrets create twilio-auth-token --data-file=- <<< "..."
gcloud secrets create twilio-phone-number --data-file=- <<< "+1234567890"
gcloud secrets create dreamnet-voice-recipient --data-file=- <<< "+15613378933"
gcloud secrets create base-mainnet-rpc-url --data-file=- <<< "https://mainnet.base.org"
gcloud secrets create base-scan-api-key --data-file=- <<< "..."  # Optional
gcloud secrets create vercel-token --data-file=- <<< "..."  # Optional
gcloud secrets create stripe-secret-key --data-file=- <<< "sk_live_..."  # Optional
```

**Or use a secrets file:**

```bash
# Create secrets from .env file
cat > .env.production << EOF
DATABASE_URL=postgresql://user:pass@host/db
SESSION_SECRET=$(openssl rand -hex 32)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
DREAMNET_VOICE_RECIPIENT=+15613378933
BASE_MAINNET_RPC_URL=https://mainnet.base.org
BASE_SCAN_API_KEY=...
VERCEL_TOKEN=...
STRIPE_SECRET_KEY=sk_live_...
EOF

# Upload each secret
while IFS='=' read -r key value; do
  [[ $key =~ ^#.*$ ]] && continue
  [[ -z "$key" ]] && continue
  echo "$value" | gcloud secrets create "$(echo "$key" | tr '[:upper:]' '[:lower:]' | tr '_' '-')" --data-file=-
done < .env.production
```

---

## 🏗️ Step 2: Create Artifact Registry Repository

```bash
# Create Artifact Registry repo for Docker images
gcloud artifacts repositories create dreamnet-repo \
  --repository-format=docker \
  --location=$REGION \
  --description="DreamNet Docker images"
```

---

## 🐳 Step 3: Build & Deploy Docker Image

### Option A: Using Cloud Build (Recommended)

```bash
# Deploy using cloudbuild.yaml
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_REGION=$REGION,_SERVICE_NAME=dreamnet,_ARTIFACT_REGISTRY_REPO=dreamnet-repo,_MEMORY=2Gi,_CPU=2,_TIMEOUT=300s,_MAX_INSTANCES=10,_MIN_INSTANCES=0
```

### Option B: Manual Build & Deploy

```bash
# Build locally
docker build -t gcr.io/$PROJECT_ID/dreamnet:latest -f Dockerfile .

# Push to Artifact Registry
docker push gcr.io/$PROJECT_ID/dreamnet:latest

# Deploy to Cloud Run
gcloud run deploy dreamnet \
  --image gcr.io/$PROJECT_ID/dreamnet:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300s \
  --max-instances 10 \
  --min-instances 0 \
  --set-env-vars NODE_ENV=production,INIT_SUBSYSTEMS=false,INIT_HEAVY_SUBSYSTEMS=false,MESH_AUTOSTART=false \
  --set-secrets DATABASE_URL=database-url:latest,SESSION_SECRET=session-secret:latest,OPENAI_API_KEY=openai-api-key:latest,ANTHROPIC_API_KEY=anthropic-api-key:latest,TWILIO_ACCOUNT_SID=twilio-account-sid:latest,TWILIO_AUTH_TOKEN=twilio-auth-token:latest,TWILIO_PHONE_NUMBER=twilio-phone-number:latest,DREAMNET_VOICE_RECIPIENT=dreamnet-voice-recipient:latest,BASE_MAINNET_RPC_URL=base-mainnet-rpc-url:latest,BASE_SCAN_API_KEY=base-scan-api-key:latest,VERCEL_TOKEN=vercel-token:latest,STRIPE_SECRET_KEY=stripe-secret-key:latest
```

**Note:** Adjust `--set-secrets` based on which secrets you actually created.

---

## 🌐 Step 4: Map Custom Domain (dreamnet.ink)

### In Google Cloud Console:

1. Go to **Cloud Run** → Select `dreamnet` service
2. Click **"MANAGE CUSTOM DOMAINS"**
3. Click **"ADD MAPPING"**
4. Enter: `dreamnet.ink`
5. Google will show you DNS records to add

### In Namecheap:

1. Go to **Domain List** → **Manage** for `dreamnet.ink`
2. Go to **Advanced DNS**
3. Add the DNS records Google provided (usually A or CNAME records)

**Example DNS Records:**
```
Type: A
Host: @
Value: [IP from Google]

Type: CNAME
Host: www
Value: ghs.googlehosted.com
```

**Wait 5-10 minutes** for DNS propagation, then verify:
```bash
# Check DNS
dig dreamnet.ink
nslookup dreamnet.ink
```

---

## ✅ Step 5: Verify Deployment

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe dreamnet --region=$REGION --format='value(status.url)')
echo "Service URL: $SERVICE_URL"

# Test health endpoint
curl $SERVICE_URL/health

# Test API
curl $SERVICE_URL/api/heartbeat

# Test admin dashboard
curl -I $SERVICE_URL/admin
```

**Expected Results:**
- ✅ `/health` returns `{"ok":true}`
- ✅ `/api/heartbeat` returns system status
- ✅ `/admin` serves Admin Dashboard HTML

---

## 🔄 Step 6: Continuous Deployment (Optional)

### Using GitHub Actions:

See `.github/workflows/deploy-cloud-run.yml` - it's already configured!

**Required GitHub Secrets:**
- `GCP_PROJECT_ID` - Your GCP project ID
- `GCP_SA_KEY` - Service account JSON key (see below)

**Create Service Account for GitHub:**

```bash
# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Deployer"

# Grant permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create and download key
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=github-actions@$PROJECT_ID.iam.gserviceaccount.com

# Add to GitHub Secrets (copy the JSON content)
cat github-actions-key.json
```

---

## 🚨 Troubleshooting

### Container Won't Start

**Check logs:**
```bash
gcloud run services logs read dreamnet --region=$REGION --limit=50
```

**Common Issues:**
- ❌ Missing `DATABASE_URL` → Create secret and redeploy
- ❌ Port binding error → Ensure server binds to `0.0.0.0:$PORT`
- ❌ Startup timeout → Increase `--timeout` or disable heavy subsystems

### API Keys Not Working

**Verify secrets are accessible:**
```bash
# Test secret access
gcloud secrets versions access latest --secret=openai-api-key
```

**Check service account permissions:**
```bash
# Grant Secret Manager access
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Domain Not Working

**Check DNS:**
```bash
dig dreamnet.ink
nslookup dreamnet.ink
```

**Verify domain mapping:**
```bash
gcloud run domain-mappings describe dreamnet.ink --region=$REGION
```

---

## 📊 Monitoring & Costs

**View Logs:**
```bash
gcloud run services logs read dreamnet --region=$REGION --follow
```

**View Metrics:**
- Go to **Cloud Run** → **dreamnet** → **Metrics**
- Monitor: Requests, Latency, Errors, CPU, Memory

**Cost Tracking:**
- Go to **Billing** → **Reports**
- Filter by service: `Cloud Run`

---

## 🎉 You're Live!

Once deployed:
- ✅ **API:** `https://dreamnet.ink/api/*`
- ✅ **Admin:** `https://dreamnet.ink/admin`
- ✅ **Frontend:** `https://dreamnet.ink/*`
- ✅ **All APIs Real** (OpenAI, Twilio, etc.)

**Next Steps:**
1. Test all endpoints
2. Monitor logs for errors
3. Set up alerts in Cloud Monitoring
4. Configure auto-scaling if needed

---

## 📝 Quick Reference Commands

```bash
# Deploy
gcloud builds submit --config cloudbuild.yaml

# Update secrets
echo "new-value" | gcloud secrets versions add secret-name --data-file=-

# Redeploy (after code changes)
gcloud builds submit --config cloudbuild.yaml

# View logs
gcloud run services logs read dreamnet --region=$REGION --follow

# Scale manually
gcloud run services update dreamnet --region=$REGION --min-instances=1 --max-instances=20

# Delete service (if needed)
gcloud run services delete dreamnet --region=$REGION
```

---

**Status:** ✅ **READY TO DEPLOY** - All systems configured for production!

