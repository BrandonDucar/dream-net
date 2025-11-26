# 🌐 Google Cloud Domain Strategy - Complete Consolidation

## 🎯 Goal
Deploy **everything** (client + admin dashboard + API) on **one Google domain** via Cloud Run.

---

## 📋 Step 1: Choose Your Domain

### Domain Name Recommendations

**Option A: Brand-focused**
- `dreamnet.app` - Modern, app-focused
- `dreamnet.dev` - Developer-friendly
- `dreamnet.cloud` - Cloud-native feel
- `dreamnet.ai` - AI-focused (if available)

**Option B: Action-focused**
- `dreamnet.run` - Execution-focused
- `dreamnet.work` - Professional
- `dreamnet.space` - Creative/experimental

**Option C: Short & Memorable**
- `dreamnet.io` - Tech startup vibe
- `dreamnet.co` - Company feel
- `dreamnet.me` - Personal/brand

### Where to Buy
1. **Google Domains** (domains.google.com) - Recommended for GCP integration
2. **Cloudflare** - Good DNS management
3. **Namecheap** - Budget-friendly

**Recommendation**: Use **Google Domains** for seamless GCP integration.

---

## 🏗️ Step 2: Architecture Overview

```
your-new-domain.com
├── /                    → Main frontend (client)
├── /admin/*            → Admin Dashboard
└── /api/*              → Backend API
```

**Single Cloud Run Service** serves all three:
- ✅ No separate deployments
- ✅ Single SSL certificate
- ✅ Unified logging
- ✅ One domain to manage

---

## 🚀 Step 3: Complete Deployment Plan

### 3.1 Fix Client Build in Docker

The client build is currently failing. We need to either:
- **Option A**: Fix the build (investigate why it fails)
- **Option B**: Skip client build if not critical (admin dashboard works)
- **Option C**: Build client separately and copy dist into Docker

**Recommendation**: Let's fix the client build first.

### 3.2 Deploy to Cloud Run

```bash
# Build and deploy
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_SERVICE_NAME=dreamnet,_REGION=us-central1

# Or use the npm script
pnpm deploy:cloud-run
```

### 3.3 Map Custom Domain

```bash
# After Cloud Run service is deployed
gcloud run domain-mappings create \
  --service=dreamnet \
  --domain=your-new-domain.com \
  --region=us-central1
```

This will:
1. Create a Cloud Run domain mapping
2. Provide DNS records to add to your domain
3. Automatically provision SSL certificate

---

## 🔧 Step 4: DNS Configuration

### 4.1 Get DNS Records from Google

After creating the domain mapping, Google will provide:

```
Type: A
Name: @
Value: [IPv4 address]

Type: AAAA  
Name: @
Value: [IPv6 address]

Type: CNAME
Name: www
Value: [Cloud Run domain]
```

### 4.2 Add Records to Google Domains

1. Go to **Google Domains** → Your domain → **DNS**
2. Add the A, AAAA, and CNAME records provided by Cloud Run
3. Wait for DNS propagation (5-60 minutes)

### 4.3 Verify Domain Mapping

```bash
# Check domain mapping status
gcloud run domain-mappings describe \
  --domain=your-new-domain.com \
  --region=us-central1

# Should show status: ACTIVE
```

---

## 📝 Step 5: Update Application Configuration

### 5.1 Update CORS Settings

Update `server/config/env.ts` to allow your new domain:

```typescript
ALLOWED_ORIGINS: [
  'https://your-new-domain.com',
  'https://www.your-new-domain.com',
  // ... existing origins
]
```

### 5.2 Update Frontend API URLs

If the client has hardcoded API URLs, update them to use relative paths:

```typescript
// Instead of: 'https://api.dreamnet.ink'
// Use: '/api' (relative)
```

### 5.3 Update Environment Variables

Set in Cloud Run:

```bash
gcloud run services update dreamnet \
  --set-env-vars="ALLOWED_ORIGINS=https://your-new-domain.com,https://www.your-new-domain.com" \
  --region=us-central1
```

---

## ✅ Step 6: Verification Checklist

- [ ] Domain purchased from Google Domains
- [ ] Cloud Run service deployed successfully
- [ ] Domain mapping created in Cloud Run
- [ ] DNS records added to Google Domains
- [ ] DNS propagation complete (check with `dig your-new-domain.com`)
- [ ] SSL certificate active (automatic with Cloud Run)
- [ ] Main frontend accessible at `https://your-new-domain.com`
- [ ] Admin dashboard accessible at `https://your-new-domain.com/admin`
- [ ] API accessible at `https://your-new-domain.com/api/health`
- [ ] CORS configured correctly

---

## 🎯 What I Would Do (My Recommendation)

### Immediate Actions:

1. **Buy Domain**: `dreamnet.app` or `dreamnet.dev` from Google Domains
   - Clean, modern, memorable
   - Good for both users and developers

2. **Fix Client Build**: 
   - Investigate why `pnpm --filter client build` fails
   - Likely a dependency or TypeScript config issue
   - Fix it so everything builds in Docker

3. **Deploy to Cloud Run**:
   - Use the Dockerfile we've been fixing
   - Deploy with `gcloud run deploy`
   - Test locally first with `docker run`

4. **Map Domain**:
   - Use `gcloud run domain-mappings create`
   - Add DNS records to Google Domains
   - Wait for SSL provisioning

5. **Update All References**:
   - CORS origins
   - API URLs in frontend
   - Any hardcoded domains

### Long-term:

- **Keep Vercel as backup** (optional)
- **Use Cloud Run for everything** (primary)
- **One domain = one source of truth**
- **Simpler architecture = easier maintenance**

---

## 🚨 Important Notes

1. **DNS Propagation**: Can take up to 48 hours (usually 5-60 minutes)
2. **SSL Certificate**: Automatically provisioned by Google (takes ~10 minutes)
3. **Cost**: Cloud Run charges per request (very cheap for low traffic)
4. **Scaling**: Automatic, handles traffic spikes
5. **Cold Starts**: First request after idle may be slow (300s timeout helps)

---

## 📚 Next Steps

1. **Choose your domain** (I recommend `dreamnet.app`)
2. **Buy it from Google Domains**
3. **Fix the client build** (let's do this next)
4. **Deploy to Cloud Run**
5. **Map the domain**
6. **Test everything**

Want me to help you:
- Fix the client build issue?
- Set up the domain mapping commands?
- Create a deployment script?

