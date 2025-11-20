# Accessing Your Cloud Accounts

## What I Can Access

I can **use** your cloud credentials if they're provided as environment variables, but I **cannot directly log into** your Google Cloud or AWS accounts.

## How It Works

### What I Can Do ✅

**If credentials are set as environment variables:**
- ✅ Deploy to Google Cloud Run
- ✅ Deploy to AWS Amplify/Lambda
- ✅ Use Firebase Hosting
- ✅ Access Cloud Storage (S3, Cloud Storage)
- ✅ Manage deployments via APIs
- ✅ Use your $1,300 Google Cloud credits
- ✅ Use your $100 AWS credits

### What I Cannot Do ❌

- ❌ Log into your Google Cloud console
- ❌ Log into your AWS console
- ❌ See your account dashboard
- ❌ Access accounts without credentials

## How to Give Me Access

### Option 1: Environment Variables (Recommended)

**For Google Cloud:**
```bash
# In Railway/Vercel environment variables, add:
GOOGLE_APPLICATION_CREDENTIALS=<path-to-service-account-json>
# OR
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
FIREBASE_TOKEN=your-firebase-token
```

**For AWS:**
```bash
# In Railway/Vercel environment variables, add:
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
```

### Option 2: Service Account (Google Cloud)

1. **Create Service Account:**
   - Go to Google Cloud Console
   - IAM & Admin → Service Accounts
   - Create service account
   - Grant permissions (Cloud Run Admin, Storage Admin, etc.)

2. **Download JSON Key:**
   - Click service account → Keys → Add Key → JSON
   - Download the JSON file

3. **Set Environment Variable:**
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
   ```
   Or upload to Railway/Vercel and reference it

### Option 3: AWS IAM User

1. **Create IAM User:**
   - Go to AWS Console → IAM → Users
   - Create user with programmatic access
   - Attach policies (Amplify, S3, Lambda, etc.)

2. **Get Access Keys:**
   - User → Security Credentials → Create Access Key
   - Copy Access Key ID and Secret Access Key

3. **Set Environment Variables:**
   ```bash
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=...
   AWS_REGION=us-east-1
   ```

## Checking What's Available

Run this script to see what credentials are configured:

```bash
pnpm tsx scripts/check-cloud-credentials.ts
```

This will show:
- ✅ What credentials are set
- ✅ What I can do with them
- ✅ What's missing

## Your IDX Work

Since you mentioned working in IDX (Google's IDE) before memory got full:

**IDX typically uses:**
- Google Cloud authentication (automatic)
- Firebase projects
- Cloud Run deployments

**To access that work:**
1. Check if IDX created any projects in Google Cloud
2. Look for service accounts or credentials IDX might have created
3. Use those credentials in Railway/Vercel

## Quick Setup Guide

### For Google Cloud ($1,300 credits)

1. **Get Firebase Token:**
   ```bash
   npm install -g firebase-tools
   firebase login:ci
   # Copy the token
   ```

2. **Add to Railway/Vercel:**
   ```
   FIREBASE_TOKEN=<token-from-above>
   ```

3. **Or use Service Account:**
   - Create service account in Google Cloud Console
   - Download JSON key
   - Set `GOOGLE_APPLICATION_CREDENTIALS` to path or upload to Railway

### For AWS ($100 credits)

1. **Create IAM User:**
   - AWS Console → IAM → Users → Add User
   - Enable programmatic access
   - Attach policies: `AmplifyFullAccess`, `S3FullAccess`, `LambdaFullAccess`

2. **Get Credentials:**
   - Copy Access Key ID and Secret Access Key

3. **Add to Railway/Vercel:**
   ```
   AWS_ACCESS_KEY_ID=<access-key>
   AWS_SECRET_ACCESS_KEY=<secret-key>
   AWS_REGION=us-east-1
   ```

## What Happens Next

Once credentials are set:

1. **I can deploy** using `deployment-core`
2. **I can use your credits** automatically
3. **I can manage** deployments via APIs
4. **You can see** everything in your cloud consoles

## Security Best Practices

- ✅ Use service accounts (not your personal account)
- ✅ Limit permissions (only what's needed)
- ✅ Store credentials in Railway/Vercel (not in code)
- ✅ Rotate keys regularly
- ✅ Never commit credentials to git

## Next Steps

1. **Run credential check:**
   ```bash
   pnpm tsx scripts/check-cloud-credentials.ts
   ```

2. **Set up missing credentials** (see above)

3. **Deploy to Google Cloud:**
   ```bash
   # Via deployment-core API
   POST /api/deployment/deploy
   {
     "platform": "google-cloud-run",
     "projectName": "dreamnet"
   }
   ```

4. **Use your credits!** 💰

