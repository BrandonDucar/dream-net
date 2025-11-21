# 🎯 Final Credentials Setup - Quick Guide

**Date**: 2025-01-27  
**Status**: Credentials Saved ✅ | Need IAM Permissions ⚠️

---

## ✅ What's Done

### Google Cloud
- ✅ Credentials saved: `C:\Users\brand\AppData\Roaming\gcloud\application_default_credentials.json`
- ✅ Authenticated as: `brandonducar1234@gmail.com`
- ✅ Project set: `dreamnet-62b49`

### AWS
- ✅ Credentials configured: Account `001092882186`, User `Dreamnet`
- ✅ SDK packages installed

---

## ⚠️ What's Needed (15 minutes total)

### 1. Google Cloud IAM Permissions (5 minutes)

**Your account needs permissions on the project.**

**Direct Link**: https://console.developers.google.com/iam-admin/iam/project?project=dreamnet-62b49

**Steps**:
1. Click the link above (or go to Google Cloud Console → IAM & Admin → IAM)
2. Find your account: `brandonducar1234@gmail.com`
3. Click "Edit" (pencil icon)
4. Add these roles:
   - ✅ **Cloud Run Admin** - For deploying services
   - ✅ **Storage Admin** - For Cloud Storage
   - ✅ **Cloud Build Editor** - For CI/CD
   - ✅ **Service Usage Consumer** - For using APIs
5. Click "Save"

**Or add all at once**: Click "Grant Access" → Add your email → Select roles above → Save

---

### 2. AWS IAM Permissions (10 minutes)

**Your user needs policies attached.**

**Direct Link**: https://console.aws.amazon.com/iam/home#/users/Dreamnet

**Steps**:
1. Click the link above (or go to AWS Console → IAM → Users → Dreamnet)
2. Click "Add Permissions" → "Attach Policies Directly"
3. Search and select these policies:
   - ✅ `AmazonS3FullAccess`
   - ✅ `AmazonEC2ContainerRegistryFullAccess`
   - ✅ `AWSAppRunnerFullAccess`
   - ✅ `CloudFrontFullAccess`
4. Click "Next" → "Add Permissions"
5. Wait 1-2 minutes for permissions to propagate

---

## 🧪 Test After Setup

### Test Google Cloud
```bash
pnpm tsx scripts/test-google-cloud-sdk.ts
```

### Test AWS
```bash
aws s3 ls
pnpm tsx scripts/test-aws-sdk.ts
```

### Test Both
```bash
pnpm tsx scripts/test-cloud-integrations-simple.ts
```

---

## 🚀 Once Permissions Are Added

### Deploy to Google Cloud
```bash
pnpm deploy:gcp
```

### Deploy to AWS
```bash
pnpm deploy:aws
```

---

## 📋 Quick Checklist

- [x] Google Cloud credentials saved
- [x] AWS credentials configured
- [ ] Google Cloud IAM permissions added
- [ ] AWS IAM permissions added
- [ ] Test scripts passing

---

**Estimated Time**: 15 minutes  
**Status**: Almost there! Just need to add permissions in both consoles.

