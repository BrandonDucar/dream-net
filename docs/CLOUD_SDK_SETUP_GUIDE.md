# Cloud SDK Setup & Testing Guide

**Complete guide for setting up and testing Google Cloud and AWS SDKs for DreamNet deployment.**

---

## 🎯 Quick Start

### Test Everything
```bash
# Test both cloud SDKs
pnpm test:clouds

# Or test individually
pnpm test:gcp    # Google Cloud Platform
pnpm test:aws    # AWS
```

---

## 📘 Google Cloud Platform Setup

### Prerequisites
- Google Cloud account
- Project created (default: `dreamnet-62b49`)
- Billing enabled

### Step 1: Install Google Cloud SDK
**Windows:**
```powershell
# Download from: https://cloud.google.com/sdk/docs/install
# Or use installer: https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe
```

**Verify:**
```powershell
gcloud --version
```

### Step 2: Authenticate
```powershell
# Login to Google Cloud
gcloud auth login

# Set default project
gcloud config set project dreamnet-62b49

# Set up Application Default Credentials (for SDK)
gcloud auth application-default login
```

### Step 3: Enable Required APIs
```powershell
# Enable Cloud Run API
gcloud services enable run.googleapis.com

# Enable Cloud Storage API
gcloud services enable storage-component.googleapis.com

# Enable Cloud Build API
gcloud services enable cloudbuild.googleapis.com

# Enable Resource Manager API
gcloud services enable cloudresourcemanager.googleapis.com
```

### Step 4: Set Environment Variables (Optional)
```powershell
# Set in PowerShell (or add to .env file)
$env:GCP_PROJECT_ID = "dreamnet-62b49"
$env:GCP_REGION = "us-central1"
$env:GOOGLE_CLOUD_PROJECT = "dreamnet-62b49"
```

### Step 5: Test SDK
```bash
pnpm test:gcp
```

**Expected Output:**
- ✅ SDK Installed
- ✅ Credentials Configured
- ✅ Project Accessible
- ✅ Cloud Run Accessible
- ✅ Storage Accessible
- ✅ Cloud Build Accessible

### Step 6: Required IAM Permissions
Your account needs these roles:
- **Cloud Run Admin** (`roles/run.admin`)
- **Storage Admin** (`roles/storage.admin`)
- **Cloud Build Editor** (`roles/cloudbuild.builds.editor`)
- **Project Viewer** (`roles/viewer`)

**Grant permissions:**
```powershell
# Replace YOUR_EMAIL with your Google account email
gcloud projects add-iam-policy-binding dreamnet-62b49 \
  --member="user:YOUR_EMAIL@gmail.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding dreamnet-62b49 \
  --member="user:YOUR_EMAIL@gmail.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding dreamnet-62b49 \
  --member="user:YOUR_EMAIL@gmail.com" \
  --role="roles/cloudbuild.builds.editor"
```

---

## 📗 AWS Setup

### Prerequisites
- AWS account
- IAM user with programmatic access
- Access keys created

### Step 1: Install AWS CLI
**Windows:**
```powershell
# Download from: https://awscli.amazonaws.com/AWSCLIV2.msi
# Or use installer: https://awscli.amazonaws.com/AWSCLIV2.msi
```

**Verify:**
```powershell
aws --version
```

### Step 2: Configure Credentials
```powershell
aws configure
```

**Enter:**
- **AWS Access Key ID**: [From IAM → Users → Security Credentials]
- **AWS Secret Access Key**: [Same place]
- **Default region**: `us-east-1`
- **Default output format**: `json`

**Or set environment variables:**
```powershell
$env:AWS_ACCESS_KEY_ID = "your-access-key"
$env:AWS_SECRET_ACCESS_KEY = "your-secret-key"
$env:AWS_REGION = "us-east-1"
```

### Step 3: Verify Account
```powershell
aws sts get-caller-identity
```

**Should show:**
```json
{
  "UserId": "...",
  "Account": "001092882186",
  "Arn": "..."
}
```

### Step 4: Set Environment Variables (Optional)
```powershell
# Set in PowerShell (or add to .env file)
$env:AWS_REGION = "us-east-1"
$env:AWS_S3_BUCKET = "dreamnet-frontend"
$env:AWS_APP_RUNNER_SERVICE = "dreamnet-backend"
$env:AWS_ECR_REPOSITORY = "dreamnet"
```

### Step 5: Test SDK
```bash
pnpm test:aws
```

**Expected Output:**
- ✅ CLI Installed
- ✅ Credentials Configured
- ✅ Account Accessible
- ✅ S3 Accessible
- ✅ ECR Accessible
- ✅ App Runner Accessible
- ✅ CloudFront Accessible

### Step 6: Required IAM Permissions
Your IAM user needs these policies:
- **AmazonS3FullAccess** (or custom S3 policy)
- **AmazonEC2ContainerRegistryFullAccess** (or custom ECR policy)
- **AWSAppRunnerFullAccess** (or custom App Runner policy)
- **CloudFrontFullAccess** (or custom CloudFront policy)

**Create IAM Policy (JSON):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:*",
        "ecr:*",
        "apprunner:*",
        "cloudfront:*",
        "sts:GetCallerIdentity"
      ],
      "Resource": "*"
    }
  ]
}
```

**Attach to user:**
1. Go to IAM → Users → Your User
2. Add permissions → Attach policies directly
3. Select policies above (or create custom policy)

---

## 🔧 Environment Variables Reference

### Google Cloud Platform
```bash
# Required
GCP_PROJECT_ID=dreamnet-62b49          # Or GOOGLE_CLOUD_PROJECT
GCP_REGION=us-central1                  # Or GOOGLE_CLOUD_REGION

# Optional (for service account)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

### AWS
```bash
# Required (via aws configure or env vars)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1

# Optional (for deployment)
AWS_S3_BUCKET=dreamnet-frontend
AWS_APP_RUNNER_SERVICE=dreamnet-backend
AWS_ECR_REPOSITORY=dreamnet
AWS_CLOUDFRONT_DISTRIBUTION=your-distribution-id
AWS_ACCOUNT_ID=001092882186
```

---

## 🚀 Deployment

### Google Cloud Platform
```bash
# Deploy to GCP
pnpm deploy:gcp
```

**What it does:**
1. Builds frontend (`client/dist`)
2. Builds Docker image
3. Pushes to Google Container Registry
4. Deploys to Cloud Run
5. Sets environment variables
6. Returns service URL

### AWS
```bash
# Deploy to AWS
pnpm deploy:aws
```

**What it does:**
1. Builds frontend (`client/dist`)
2. Creates/updates S3 bucket
3. Uploads frontend to S3
4. Creates/updates CloudFront distribution
5. Builds Docker image
6. Pushes to ECR
7. Deploys to App Runner
8. Returns service URLs

---

## 🐛 Troubleshooting

### Google Cloud Issues

**"Credentials not configured"**
```powershell
gcloud auth application-default login
```

**"Project not found"**
```powershell
gcloud config set project dreamnet-62b49
# Or set: $env:GCP_PROJECT_ID = "dreamnet-62b49"
```

**"Permission denied"**
- Check IAM roles in Google Cloud Console
- Ensure billing is enabled
- Verify APIs are enabled

### AWS Issues

**"Credentials not configured"**
```powershell
aws configure
# Or set environment variables
```

**"Access denied"**
- Check IAM user permissions
- Verify policies are attached
- Check resource-level permissions

**"Region not available"**
- Use `us-east-1` (most services available)
- Check App Runner availability in your region

---

## 📝 Next Steps

1. ✅ Run `pnpm test:clouds` to verify everything works
2. ✅ Set up environment variables (`.env.gcp` and `.env.aws` optional)
3. ✅ Test deployment: `pnpm deploy:gcp` or `pnpm deploy:aws`
4. ✅ Monitor deployments in cloud consoles

---

## 🔗 Useful Links

- **Google Cloud Console**: https://console.cloud.google.com
- **AWS Console**: https://console.aws.amazon.com
- **Google Cloud SDK Docs**: https://cloud.google.com/sdk/docs
- **AWS CLI Docs**: https://docs.aws.amazon.com/cli/

---

**Status**: Ready to test! Run `pnpm test:clouds` to verify your setup.

