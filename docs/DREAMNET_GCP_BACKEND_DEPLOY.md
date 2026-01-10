# DreamNet Backend Deployment to Google Cloud Run

**Target:** `https://api.dreamnet.ink`  
**Platform:** Google Cloud Run  
**Approach:** Docker-based deployment using root `Dockerfile`

---

## Prerequisites

1. **Google Cloud CLI** installed and authenticated

   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Docker** installed (for local testing, optional)

3. **Environment Variables** prepared (see section below)

4. **Billing enabled** on your GCP project

---

## Deployment Approach

We use the **root `Dockerfile`** which:

- Builds both frontend (`client/`) and backend (`server/`)
- Uses pnpm workspace for monorepo dependencies
- Serves frontend static files + backend API from a single Cloud Run service
- Optimized for Cloud Run serverless deployment

### Why Root Dockerfile?

The root `Dockerfile` handles the monorepo structure correctly:

- Installs all workspace dependencies
- Builds frontend first (client → dist)
- Builds backend (server → dist)
- Serves both from `server/dist/index.js`

## 🏗️ The "GCP Serverless" Stack (Fastest to Value)

To ship safely and scale-to-zero, we use the following native GCP stack:

1. **Core Runtime**: **Cloud Run** services fronted by **Cloud Load Balancer**.
2. **Orchestration**: **Google Workflows** to sequence/coordinate services and jobs.
3. **Secrets**: **Secret Manager** wired directly into Cloud Run.
4. **Ops**: **Cloud Monitoring** + **Error Reporting** + **Cloud Trace**.

**Why this rocks:** Zero K8s maintenance, scale-to-zero economics, and native workflow orchestration via Google Workflows.

---

## Environment Variables

### Required

Create these in Cloud Run or use Secret Manager:

```bash
# Core
NODE_ENV=production
PORT=8080

# Database (Cloud SQL or external)
DATABASE_URL=postgresql://user:password@host:5432/database

# Optional: Cloud SQL Unix Socket (if using Cloud SQL)
CLOUD_SQL_INSTANCE_CONNECTION_NAME=project:region:instance
```

### Optional (Feature-Specific)

```bash
# AI Features
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Payments
STRIPE_SECRET_KEY=sk_live_...

# Communications
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...

# Feature Flags
INIT_HEAVY_SUBSYSTEMS=false
INIT_SUBSYSTEMS=false
MESH_AUTOSTART=true
```

---

## Deployment Commands

### Option 1: Deploy via gcloud CLI (Recommended)

**Step 1: Build and push Docker image**

```bash
# Set your project ID
export GCP_PROJECT_ID=your-project-id
export GCP_REGION=us-central1

# Build and submit to Cloud Build
gcloud builds submit --tag gcr.io/$GCP_PROJECT_ID/dreamnet:latest .
```

**Step 2: Deploy to Cloud Run**

```bash
gcloud run deploy dreamnet \
  --image gcr.io/$GCP_PROJECT_ID/dreamnet:latest \
  --platform managed \
  --region $GCP_REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production,PORT=8080
```

**Step 3: Add DATABASE_URL (if using Cloud SQL)**

```bash
# Option A: Direct connection string
gcloud run services update dreamnet \
  --region $GCP_REGION \
  --set-env-vars DATABASE_URL="postgresql://user:password@host:5432/database"

# Option B: Cloud SQL Unix Socket
gcloud run services update dreamnet \
  --region $GCP_REGION \
  --add-cloudsql-instances PROJECT:REGION:INSTANCE \
  --set-env-vars DATABASE_URL="postgresql://user:password@/database?host=/cloudsql/PROJECT:REGION:INSTANCE"
```

### Option 2: Deploy via Cloud Console

1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Click **"Create Service"**
3. Select **"Deploy from source repository"** or **"Deploy from existing container image"**
4. Configure:
   - **Service name:** `dreamnet`
   - **Region:** `us-central1` (or preferred)
   - **Authentication:** ✅ Allow unauthenticated invocations
   - **Container port:** `8080`
   - **Memory:** `2Gi`
   - **CPU:** `2`
   - **Max instances:** `10`
5. Add environment variables (see above)
6. Click **"Deploy"**

---

## Updating an Existing Service

### Quick Update (Code Changes Only)

```bash
# Rebuild and deploy
gcloud builds submit --tag gcr.io/$GCP_PROJECT_ID/dreamnet:latest .

gcloud run deploy dreamnet \
  --image gcr.io/$GCP_PROJECT_ID/dreamnet:latest \
  --region $GCP_REGION
```

### Update Environment Variables

```bash
# Add/update a single variable
gcloud run services update dreamnet \
  --region $GCP_REGION \
  --set-env-vars NEW_VAR=value

# Update multiple variables
gcloud run services update dreamnet \
  --region $GCP_REGION \
  --set-env-vars VAR1=value1,VAR2=value2
```

### Update Resource Limits

```bash
gcloud run services update dreamnet \
  --region $GCP_REGION \
  --memory 4Gi \
  --cpu 4
```

---

## Rollback

### Rollback to Previous Revision

```bash
# List revisions
gcloud run revisions list --service dreamnet --region $GCP_REGION

# Rollback to specific revision
gcloud run services update-traffic dreamnet \
  --region $GCP_REGION \
  --to-revisions REVISION_NAME=100
```

### Emergency Rollback

```bash
# Route 100% traffic to previous revision
gcloud run services update-traffic dreamnet \
  --region $GCP_REGION \
  --to-latest=false \
  --to-revisions PREVIOUS_REVISION=100
```

---

## Custom Domain Setup

### Map Custom Domain

1. **Via Console:**
   - Go to Cloud Run → Select service → **"Manage Custom Domains"**
   - Add `api.dreamnet.ink`
   - Follow DNS verification steps

2. **Via CLI:**

   ```bash
   gcloud run domain-mappings create \
     --service dreamnet \
     --domain api.dreamnet.ink \
     --region $GCP_REGION
   ```

3. **Update DNS:**
   - Add the CNAME record provided by Google Cloud
   - Wait for DNS propagation (5-30 minutes)

---

## Monitoring & Logs

### View Logs

```bash
# Real-time logs
gcloud run services logs tail dreamnet --region $GCP_REGION

# Recent logs
gcloud run services logs read dreamnet --region $GCP_REGION --limit 100
```

### View Metrics

```bash
# Service details
gcloud run services describe dreamnet --region $GCP_REGION

# List revisions
gcloud run revisions list --service dreamnet --region $GCP_REGION
```

### Cloud Console Monitoring

- Go to [Cloud Run Console](https://console.cloud.google.com/run)
- Select `dreamnet` service
- View **Metrics**, **Logs**, **Revisions** tabs

---

## Local Testing (Cloud Run-like Mode)

### Build Docker Image Locally

```bash
docker build -t dreamnet:local .
```

### Run Locally

```bash
docker run -p 8080:8080 \
  -e NODE_ENV=production \
  -e PORT=8080 \
  -e DATABASE_URL="your-database-url" \
  dreamnet:local
```

### Test Endpoints

```bash
# Health check
curl http://localhost:8080/health

# API test
curl http://localhost:8080/api/health
```

---

## Troubleshooting

### Build Fails

**Issue:** TypeScript errors during build  
**Solution:** The build script (`server/build.cjs`) is configured to emit files even with type errors. Check that `dist/index.js` is created.

**Issue:** Workspace dependencies not found  
**Solution:** Ensure `pnpm-workspace.yaml` is copied in Dockerfile and `pnpm install --frozen-lockfile` runs at root.

### Deployment Fails

**Issue:** "Permission denied"  
**Solution:**

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

**Issue:** "Service account does not have permission"  
**Solution:** Grant Cloud Run Admin and Cloud Build Editor roles to your user or service account.

### Runtime Errors

**Issue:** "Cannot find module"  
**Solution:** Verify all workspace packages are built. Check `packages/*/package.json` for build scripts.

**Issue:** Database connection fails  
**Solution:**

- Verify `DATABASE_URL` format
- For Cloud SQL, ensure instance is running and `--add-cloudsql-instances` is set
- Check Cloud SQL IAM permissions

### Performance Issues

**Issue:** Cold starts are slow  
**Solution:**

- Increase memory allocation (2Gi → 4Gi)
- Set minimum instances: `--min-instances 1`

**Issue:** Timeout errors  
**Solution:** Increase timeout: `--timeout 600`

---

## Security Best Practices

1. **Use Secret Manager** for sensitive environment variables:

   ```bash
   # Create secret
   echo -n "your-secret-value" | gcloud secrets create DATABASE_URL --data-file=-
   
   # Grant access to Cloud Run service account
   gcloud secrets add-iam-policy-binding DATABASE_URL \
     --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
     --role="roles/secretmanager.secretAccessor"
   
   # Reference in Cloud Run
   gcloud run services update dreamnet \
     --region $GCP_REGION \
     --set-secrets DATABASE_URL=DATABASE_URL:latest
   ```

2. **Enable VPC Connector** for private database access

3. **Use Cloud Armor** for DDoS protection

4. **Enable Cloud Audit Logs** for compliance

---

## Cost Optimization

### Free Tier Limits

Cloud Run free tier (per month):

- 2 million requests
- 360,000 GB-seconds
- 180,000 vCPU-seconds

### Optimization Tips

1. **Scale to zero:** Set `--min-instances 0` (default)
2. **Right-size resources:** Start with 2Gi/2CPU, adjust based on metrics
3. **Use caching:** Implement Redis/Memorystore for frequently accessed data
4. **Optimize cold starts:** Reduce Docker image size, lazy-load heavy dependencies

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - id: auth
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      
      - name: Deploy to Cloud Run
        run: |
          gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/dreamnet:latest .
          gcloud run deploy dreamnet \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/dreamnet:latest \
            --region us-central1 \
            --platform managed
```

### Cloud Build Trigger

1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Create trigger for GitHub repository
3. Use `cloudbuild.yaml`:

```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/dreamnet:latest', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/dreamnet:latest']
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'dreamnet'
      - '--image=gcr.io/$PROJECT_ID/dreamnet:latest'
      - '--region=us-central1'
      - '--platform=managed'
```

---

## Next Steps

1. ✅ Deploy backend to Cloud Run
2. ✅ Verify health endpoint: `https://YOUR-SERVICE-URL/health`
3. ✅ Map custom domain: `api.dreamnet.ink`
4. ✅ Set up monitoring and alerts
5. ✅ Configure CI/CD pipeline
6. ✅ Implement Cloud SQL backups
7. ✅ Enable Cloud CDN (optional)

---

## Quick Reference

### Essential Commands

```bash
# Deploy
gcloud builds submit --tag gcr.io/$GCP_PROJECT_ID/dreamnet:latest .
gcloud run deploy dreamnet --image gcr.io/$GCP_PROJECT_ID/dreamnet:latest --region us-central1

# Update env vars
gcloud run services update dreamnet --region us-central1 --set-env-vars KEY=value

# View logs
gcloud run services logs tail dreamnet --region us-central1

# Rollback
gcloud run services update-traffic dreamnet --region us-central1 --to-revisions REVISION=100

# Delete service
gcloud run services delete dreamnet --region us-central1
```

### Service URL

After deployment, your service will be available at:

- **Auto-generated:** `https://dreamnet-[hash]-uc.a.run.app`
- **Custom domain:** `https://api.dreamnet.ink` (after DNS setup)

---

**Last Updated:** 2025-11-26  
**Maintained by:** DreamNet Infrastructure Team
