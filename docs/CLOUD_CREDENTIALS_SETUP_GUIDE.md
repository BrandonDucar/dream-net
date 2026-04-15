# ☁️ Cloud Credentials Setup Guide

**Date**: 2025-01-27  
**Status**: Setup Instructions

---

## 📋 Quick Setup

### Google Cloud Platform

#### Step 1: Set Project
```bash
gcloud config set project dreamnet-62b49
```

#### Step 2: Authenticate (Interactive - Opens Browser)
```bash
gcloud auth login
gcloud auth application-default login
```

**Note**: This will open your browser. Complete the authentication flow.

#### Step 3: Verify
```bash
gcloud config get-value project
# Should show: dreamnet-62b49

gcloud auth list
# Should show your authenticated account
```

#### Step 4: Set Environment Variables
```powershell
# PowerShell
$env:GCP_PROJECT_ID = "dreamnet-62b49"
$env:GOOGLE_CLOUD_PROJECT = "dreamnet-62b49"

# Or add to your .env file:
# GCP_PROJECT_ID=dreamnet-62b49
# GOOGLE_CLOUD_PROJECT=dreamnet-62b49
```

---

### AWS

#### Step 1: Verify Credentials (Already Done ✅)
```bash
aws sts get-caller-identity
# Should show:
# {
#   "Account": "001092882186",
#   "Arn": "arn:aws:iam::001092882186:user/Dreamnet",
#   "UserId": "AIDAQAQJEB4FAN4NFOXEW"
# }
```

#### Step 2: Install AWS SDK Packages
```bash
pnpm add -w @aws-sdk/client-amplify @aws-sdk/client-s3 @aws-sdk/client-lambda @aws-sdk/client-sts
```

#### Step 3: Add IAM Permissions

Go to AWS Console → IAM → Users → Dreamnet → Add Permissions

**Required Policies**:
- `AmazonS3FullAccess` (or custom S3 policy)
- `AmazonEC2ContainerRegistryFullAccess` (for ECR)
- `AWSAppRunnerFullAccess` (for App Runner)
- `CloudFrontFullAccess` (for CloudFront)

**Direct Link**: https://console.aws.amazon.com/iam/home#/users/Dreamnet

#### Step 4: Verify Permissions
```bash
# Test S3 access
aws s3 ls

# Test ECR access
aws ecr describe-repositories --region us-east-1
```

---

## 🧪 Test Setup

### Run Test Script
```bash
pnpm tsx scripts/test-cloud-integrations-simple.ts
```

### Test Google Cloud
```bash
pnpm tsx scripts/test-google-cloud-sdk.ts
```

### Test AWS
```bash
pnpm tsx scripts/test-aws-sdk.ts
```

### Test Both
```bash
pnpm tsx scripts/test-cloud-sdks.ts
```

---

## 📊 Current Status

### Google Cloud
- ✅ **CLI Installed**: gcloud v548.0.0
- ✅ **SDK Packages**: Installed
- ✅ **Project Set**: dreamnet-62b49
- ⚠️ **Authentication**: Needs `gcloud auth application-default login`
- 💰 **Credits**: $1,300 available

### AWS
- ✅ **CLI Installed**: aws-cli v2.32.2
- ✅ **Credentials**: Configured (Account: 001092882186)
- ✅ **SDK Packages**: Installing...
- ⚠️ **IAM Permissions**: Need to add policies
- 💰 **Credits**: $100 available

---

## 🚀 Next Steps After Setup

### 1. Test Deployments
```bash
# Test Google Cloud deployment
pnpm deploy:gcp

# Test AWS deployment
pnpm deploy:aws
```

### 2. Verify API Endpoints
```bash
# Start server
pnpm dev:app

# Test Google Cloud API
curl http://localhost:5000/api/google-cloud/status

# Test AWS API
curl http://localhost:5000/api/aws/status
```

### 3. Deploy Mini-Apps
Once credentials are set up, you can deploy:
- To Google Cloud Run
- To AWS Amplify/Lambda
- To Vercel (already working)
- To Railway (already working)

---

## 🔧 Troubleshooting

### Google Cloud Authentication Issues

**Problem**: `gcloud auth application-default login` fails
**Solution**: 
1. Make sure you're logged in: `gcloud auth login`
2. Try again: `gcloud auth application-default login`
3. If still failing, use service account JSON:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
   ```

### AWS Permission Issues

**Problem**: `AccessDenied` errors
**Solution**:
1. Go to AWS Console → IAM → Users → Dreamnet
2. Add required policies (see Step 3 above)
3. Wait 1-2 minutes for permissions to propagate
4. Test again: `aws s3 ls`

### SDK Package Issues

**Problem**: Packages not found
**Solution**:
```bash
# Install with workspace root flag
pnpm add -w @aws-sdk/client-amplify @aws-sdk/client-s3 @aws-sdk/client-lambda @aws-sdk/client-sts

# Verify installation
pnpm list | grep "@aws-sdk"
```

---

## 📝 Environment Variables

Add these to your `.env` file or environment:

```bash
# Google Cloud
GCP_PROJECT_ID=dreamnet-62b49
GOOGLE_CLOUD_PROJECT=dreamnet-62b49
GCP_REGION=us-central1
GOOGLE_CLOUD_REGION=us-central1

# Optional: Service Account JSON path
# GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key  # Already configured via AWS CLI
AWS_SECRET_ACCESS_KEY=your-secret-key  # Already configured via AWS CLI
```

---

## ✅ Setup Checklist

- [ ] Google Cloud project set (`dreamnet-62b49`)
- [ ] Google Cloud authenticated (`gcloud auth application-default login`)
- [ ] AWS credentials verified (`aws sts get-caller-identity`)
- [ ] AWS SDK packages installed (`pnpm add -w @aws-sdk/...`)
- [ ] AWS IAM permissions added (S3, ECR, App Runner, CloudFront)
- [ ] Environment variables set (GCP_PROJECT_ID, AWS_REGION)
- [ ] Test scripts passing (`pnpm tsx scripts/test-cloud-integrations-simple.ts`)

---

**Status**: Ready to configure  
**Next**: Complete Google Cloud authentication and AWS IAM permissions

