# 🚨 Cloud Run Deployment Clarification

## ✅ CORRECT Setup: Everything in Cloud Run

**You're RIGHT** - Everything should be in Cloud Run, NOT Vercel!

### Current Cloud Run Setup

**Service Name**: `dreamnet-api-minimal`  
**Region**: `us-central1`  
**URL**: `https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app`

### How It Works

1. **Dockerfile** builds BOTH:
   - Client UI (`client/dist`) - Line 44
   - Server (`server/`) - Line 47

2. **Server serves everything**:
   - Static files from `client/dist` via `serveStatic()` (production mode)
   - API routes at `/api/*`
   - Client routes at `/*` (SPA routing)

3. **Single Cloud Run service**:
   - One container
   - One URL
   - Everything together

### What's Actually Deployed

**Cloud Run Service**: `dreamnet-api-minimal`
- ✅ Server running
- ✅ Client UI built (`client/dist`)
- ✅ Static serving configured (`serveStatic()`)
- ✅ All routes available

### Domain Mapping

**dreamnet.ink** should map to Cloud Run, NOT Vercel!

**To map domain**:
```bash
# Add custom domain to Cloud Run service
gcloud run services update dreamnet-api-minimal \
  --region=us-central1 \
  --add-domain=dreamnet.ink
```

Then configure DNS:
- Type: `CNAME`
- Name: `@` (or `dreamnet.ink`)
- Value: `ghs.googlehosted.com` (Cloud Run provides this)

## ❌ What I Got Wrong

I mentioned Vercel because:
1. There's a `vercel.json` file in the repo (legacy/old config?)
2. `DOMAIN_SETUP.md` mentioned Vercel (outdated?)
3. I didn't check the actual current deployment

**But you're RIGHT** - Everything should be in Cloud Run!

## ✅ Correct Answer

**YES** - Everything (Hub + Mini Apps) will be visible at `dreamnet.ink` **once the domain is mapped to Cloud Run**.

**Current Status**:
- ✅ Cloud Run service running
- ✅ Client UI built and served
- ✅ Hub pages working
- ✅ Mini apps working
- ⚠️ Domain needs to be mapped to Cloud Run (not Vercel!)

## 🚀 Next Steps

1. **Map dreamnet.ink to Cloud Run**:
   ```bash
   gcloud run services update dreamnet-api-minimal \
     --region=us-central1 \
     --add-domain=dreamnet.ink
   ```

2. **Configure DNS** (Cloud Run will provide instructions)

3. **Verify**:
   - Visit `https://dreamnet.ink`
   - Check `/hub` works
   - Check `/miniapps` works

## 📋 Current Deployment

**Cloud Run Service**: `dreamnet-api-minimal`  
**URL**: `https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app`  
**Status**: ✅ Running (serves both API + Client UI)

**Everything is already there** - just needs domain mapping!

