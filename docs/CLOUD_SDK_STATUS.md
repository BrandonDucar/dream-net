# Cloud SDK Status & Next Steps

**Generated**: 2025-01-27  
**Status**: Tests running, credentials/permissions need setup

---

## 📊 Current Status

### ✅ What's Working

**Google Cloud Platform:**
- ✅ SDK packages installed (`@google-cloud/run`, `@google-cloud/storage`, `@google-cloud/resource-manager`, `@google-cloud/cloudbuild`)
- ✅ Test script working correctly
- ⚠️ **Missing**: Application Default Credentials

**AWS:**
- ✅ AWS CLI installed (`aws-cli/2.32.2`)
- ✅ Credentials configured (Account: `001092882186`, User: `Dreamnet`)
- ✅ Account accessible
- ⚠️ **Missing**: IAM permissions for S3, ECR, App Runner, CloudFront

---

## 🔧 What You Need To Do

### Google Cloud Platform

**1. Set up Application Default Credentials:**
```powershell
gcloud auth application-default login
```

**2. Set project (if not already set):**
```powershell
gcloud config set project dreamnet-62b49
```

**3. Enable required APIs:**
```powershell
gcloud services enable run.googleapis.com
gcloud services enable storage-component.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
```

**4. Verify:**
```bash
pnpm test:gcp
```

**Expected Result**: All tests should pass ✅

---

### AWS

**1. Add IAM Permissions to User `Dreamnet`:**

Go to AWS Console → IAM → Users → Dreamnet → Add permissions

**Attach these policies:**
- `AmazonS3FullAccess` (or create custom S3 policy)
- `AmazonEC2ContainerRegistryFullAccess` (or create custom ECR policy)
- `AWSAppRunnerFullAccess` (or create custom App Runner policy)
- `CloudFrontFullAccess` (or create custom CloudFront policy)

**OR create a custom policy with these permissions:**
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

**2. Note about App Runner:**
The error mentions "subscription required" - this might mean:
- App Runner needs to be enabled/activated in your account
- Or there's a billing/subscription issue
- Check AWS Console → App Runner to see if service is available

**3. Verify:**
```bash
pnpm test:aws
```

**Expected Result**: All tests should pass ✅

---

## 🚀 After Setup

Once both tests pass, you can deploy:

```bash
# Deploy to Google Cloud
pnpm deploy:gcp

# Deploy to AWS
pnpm deploy:aws
```

---

## 📝 Environment Variables (Optional)

You can set these in your `.env` file or PowerShell:

**Google Cloud:**
```powershell
$env:GCP_PROJECT_ID = "dreamnet-62b49"
$env:GCP_REGION = "us-central1"
$env:GOOGLE_CLOUD_PROJECT = "dreamnet-62b49"
```

**AWS:**
```powershell
$env:AWS_REGION = "us-east-1"
$env:AWS_S3_BUCKET = "dreamnet-frontend"
$env:AWS_APP_RUNNER_SERVICE = "dreamnet-backend"
$env:AWS_ECR_REPOSITORY = "dreamnet"
```

---

## 🔗 Quick Links

- **Google Cloud Console**: https://console.cloud.google.com
- **AWS Console**: https://console.aws.amazon.com
- **IAM Users**: https://console.aws.amazon.com/iam/home#/users
- **Test Scripts**: `pnpm test:gcp` and `pnpm test:aws`

---

## ✅ Checklist

- [ ] Google Cloud: Run `gcloud auth application-default login`
- [ ] Google Cloud: Enable APIs (`run`, `storage`, `cloudbuild`, `resourcemanager`)
- [ ] AWS: Add IAM permissions to `Dreamnet` user
- [ ] AWS: Verify App Runner subscription/access
- [ ] Run `pnpm test:gcp` - should pass ✅
- [ ] Run `pnpm test:aws` - should pass ✅
- [ ] Ready to deploy! 🚀

---

**Next**: Follow the steps above, then run the tests again to verify everything works.

