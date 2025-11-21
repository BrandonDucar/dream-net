# 🔐 Google Cloud Authentication Options

**Date**: 2025-01-27  
**Status**: Multiple Options Available

---

## Option 1: Service Account (Recommended for Automation)

### Create Service Account

1. **Go to**: https://console.cloud.google.com/iam-admin/serviceaccounts?project=dreamnet-62b49
2. **Click**: "Create Service Account"
3. **Name**: `dreamnet-deployer`
4. **Description**: `Service account for DreamNet deployments`
5. **Click**: "Create and Continue"

### Grant Roles

Add these roles:
- ✅ **Kubernetes Engine Admin** - For GKE
- ✅ **Cloud SQL Admin** - For databases
- ✅ **Storage Admin** - For Cloud Storage
- ✅ **BigQuery Admin** - For data warehouse
- ✅ **Cloud Build Editor** - For building images
- ✅ **Service Usage Admin** - For enabling APIs
- ✅ **Compute Admin** - For compute resources
- ✅ **Cloud Run Admin** - For Cloud Run
- ✅ **Pub/Sub Admin** - For messaging
- ✅ **Cloud Functions Admin** - For serverless

**Click**: "Continue" → "Done"

### Create Key

1. **Click** on the service account
2. **Go to**: "Keys" tab
3. **Click**: "Add Key" → "Create New Key"
4. **Select**: JSON
5. **Click**: "Create"
6. **Download** the JSON file

### Use the Key

**Option A: Environment Variable**
```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
export GCP_PROJECT_ID=dreamnet-62b49
```

**Option B: Use Setup Script**
```bash
pnpm setup:gcp-service-account /path/to/service-account.json
```

**Option C: Place in Project**
```bash
# Place key in project root (will be gitignored)
cp /path/to/service-account.json .gcp-service-account.json
export GOOGLE_APPLICATION_CREDENTIALS=.gcp-service-account.json
```

---

## Option 2: User Account (Browser Login)

### Authenticate

```bash
# This opens your browser
gcloud auth login

# Set application default credentials
gcloud auth application-default login
```

### Set Project

```bash
gcloud config set project dreamnet-62b49
gcloud config set account brandonducar1234@gmail.com
```

---

## Option 3: Provide Credentials to Me

If you want me to set it up, you can:

1. **Create service account** (steps above)
2. **Download JSON key**
3. **Share the path** or **content** (I'll set it up)

Or just tell me:
- Service account email
- I can help you create the key

---

## ✅ After Authentication

### Test Access
```bash
pnpm tsx scripts/test-google-cloud-sdk.ts
```

### Enable APIs
```bash
pnpm enable:gcp-apis
```

### Deploy
```bash
pnpm deploy:gke
```

---

## 🔒 Security Notes

- ✅ Service account keys are sensitive - keep them secure
- ✅ Never commit keys to git (they're in .gitignore)
- ✅ Rotate keys periodically
- ✅ Use least privilege (only grant needed roles)

---

**Recommended**: Use Option 1 (Service Account) for production automation

