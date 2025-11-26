# 🚀 Real-World Activation Guide

## ✅ What's Ready to Use RIGHT NOW

### 🐺 **Wolf Pack - Funding Hunter**
- **Status**: ✅ Fully Implemented
- **What it does**:
  - Discovers funding opportunities (Base grants, Optimism retro funding, etc.)
  - Scores leads automatically
  - Generates email drafts
  - Queues emails (50/day limit)
  - Creates grant application drafts
  - Tracks follow-ups

**Activate via API:**
```bash
POST /api/packs/activate
```

### 🐳 **Whale Pack - Commerce Manager**
- **Status**: ✅ Fully Implemented
- **What it does**:
  - Manages products and audiences
  - Generates content plans
  - Analyzes commerce metrics
  - Creates insights
  - Runs every 20 minutes automatically

**Activate via API:**
```bash
POST /api/packs/activate
```

### ☁️ **Google Cloud APIs - READY TO USE**
- **Status**: ✅ Fully Integrated
- **Services Available**:
  - **Cloud Run** - Deploy DreamNet Hub
  - **Cloud Storage** - Store media files
  - **Cloud Build** - CI/CD automation
  - **Cloud Functions** - Serverless functions
  - **Secret Manager** - Store API keys securely

**API Endpoints:**
```bash
GET /api/google-cloud/status - Verify credentials
GET /api/google-cloud/run/services - List services
POST /api/google-cloud/run/deploy - Deploy to Cloud Run
GET /api/google-cloud/storage/buckets - List buckets
POST /api/google-cloud/storage/upload - Upload files
```

---

## 🎯 **IMMEDIATE ACTION PLAN**

### Step 1: Activate Packs (Do This First!)
```bash
# Via API
curl -X POST http://localhost:3000/api/packs/activate

# Or run script
pnpm exec tsx scripts/activate-all-real-world.ts
```

This will:
- ✅ Seed Wolf Pack with 5 real funding opportunities
- ✅ Seed Whale Pack with 4 products and 3 audiences
- ✅ Start their background cycles
- ✅ Generate email drafts and grant applications

### Step 2: Use Google Cloud APIs

#### Deploy to Cloud Run
```bash
POST /api/google-cloud/run/deploy
{
  "serviceName": "dreamnet",
  "image": "gcr.io/dreamnet-62b49/dreamnet:latest",
  "port": 8080,
  "memory": "2Gi",
  "cpu": "2",
  "minInstances": 1,
  "maxInstances": 10,
  "environmentVariables": {
    "NODE_ENV": "production"
  }
}
```

#### Upload Media to Cloud Storage
```bash
POST /api/google-cloud/storage/upload
{
  "bucket": "dreamnet-media",
  "key": "profile-pictures/hooded-figure.png",
  "body": "<base64-encoded-image>",
  "contentType": "image/png"
}
```

### Step 3: Start Monetization

#### X402 Payment Gateway
- ✅ Already implemented
- ✅ Multi-chain support (BSC, Ethereum, Solana)
- **API**: `/api/x402/*`

#### Stripe Integration
- ✅ Already configured
- ✅ Direct bank deposits ready
- **API**: `/api/stripe/*`

#### Agent Marketplace
- ✅ 10 services ready to list
- ✅ Monetizable agents
- **API**: `/api/marketplace/*`

---

## 📊 **What's Running Automatically**

### Background Services (Already Active)
1. **Wolf Pack Cycle** - Every 15 minutes
   - Scores leads
   - Generates email drafts
   - Queues emails
   - Creates grant drafts

2. **Whale Pack Cycle** - Every 20 minutes
   - Analyzes products
   - Generates content plans
   - Creates insights

3. **Email Sending** - Every 1 minute
   - Processes email queue
   - Respects 50/day limit
   - Sends via SMTP/Resend

4. **Social Media** - Ready when APIs configured
   - Instagram (via Facebook)
   - Facebook
   - LinkedIn
   - Twitter/X
   - Farcaster (needs Neynar API key)

---

## 💰 **Revenue Streams Ready**

1. **X402 Payments** - Multi-chain micropayments
2. **Agent Marketplace** - Premium agent subscriptions
3. **Stripe** - Direct bank deposits
4. **Wolf Pack** - Funding discovery service (paid feature)
5. **Social Media Posting** - Automated posting service

---

## 🔧 **Configuration Needed**

### Google Cloud
- ✅ Project: `dreamnet-62b49`
- ✅ Region: `us-central1`
- ⚠️ Need: `GOOGLE_APPLICATION_CREDENTIALS` or `gcloud auth`

### Social Media APIs
- ⚠️ Need: Facebook Page Access Token (for Instagram + Facebook)
- ⚠️ Need: LinkedIn Access Token
- ⚠️ Need: Twitter API Keys
- ⚠️ Need: Neynar API Key (for Farcaster)

### Email
- ✅ Configured: `dreamnetgmo@gmail.com`
- ✅ SMTP/Resend ready

---

## 🚀 **Next Steps**

1. **Activate packs** - `POST /api/packs/activate`
2. **Deploy to Cloud Run** - Use Google Cloud APIs
3. **Configure social media** - Add API keys to `.env`
4. **Start posting** - Use Orca Pack to post content
5. **Monitor revenue** - Track X402 and Stripe payments

---

## 📡 **API Endpoints Summary**

### Packs
- `POST /api/packs/activate` - Activate both packs
- `GET /api/packs/status` - Get status

### Wolf Pack
- `GET /api/wolf-pack/status` - Get funding status
- `GET /api/wolf-pack/leads` - List all leads
- `GET /api/wolf-pack/queue` - List email queue
- `GET /api/wolf-pack/grant-drafts` - List grant drafts

### Whale Pack
- `GET /api/whale-pack/status` - Get commerce status
- `GET /api/whale-pack/products` - List products
- `GET /api/whale-pack/audiences` - List audiences
- `GET /api/whale-pack/insights` - Get insights

### Google Cloud
- `GET /api/google-cloud/status` - Verify credentials
- `GET /api/google-cloud/run/services` - List services
- `POST /api/google-cloud/run/deploy` - Deploy service
- `GET /api/google-cloud/storage/buckets` - List buckets
- `POST /api/google-cloud/storage/upload` - Upload file

---

**Everything is ready - just activate it!** 🚀

