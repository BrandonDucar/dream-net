# 🔗 Attach AWS Policy to User - Quick Steps

**Policy Created**: ✅ `arn:aws:iam::001092882186:policy/Dreamnet`  
**Status**: Need to Attach to User

---

## 📋 Steps to Attach Policy

### Step 1: Go to User Page
**Direct Link**: https://console.aws.amazon.com/iam/home#/users/Dreamnet

### Step 2: Add Permissions
1. Click **"Permissions"** tab
2. Click **"Add Permissions"** button

### Step 3: Attach Policy
1. Select **"Attach Policies Directly"**
2. In search box, type: `Dreamnet`
3. You should see: **Dreamnet** policy
4. **Check the box** next to it
5. Click **"Next"**
6. Click **"Add Permissions"**

### Step 4: Wait
- Wait **1-2 minutes** for permissions to propagate

### Step 5: Test
```bash
aws s3 ls
aws ecr describe-repositories --region us-east-1
```

---

## ✅ After Attaching

Once attached, you'll have access to:
- ✅ S3 (storage)
- ✅ ECR (container registry)
- ✅ App Runner (serverless containers)
- ✅ CloudFront (CDN)
- ✅ Lambda (serverless functions)
- ✅ RDS, Redshift, DynamoDB (databases)
- ✅ EKS (Kubernetes)
- ✅ And more!

---

**Quick Link**: https://console.aws.amazon.com/iam/home#/users/Dreamnet

