# 🌍 dreamnet.world - Complete Setup Guide

## 🎯 What You Need to Know

**Cloud Run doesn't "issue" domains** - you buy the domain first, then Cloud Run maps it and provides SSL automatically.

Here's the process:

1. ✅ **You buy** `dreamnet.world` from a domain registrar
2. ✅ **You deploy** your app to Cloud Run
3. ✅ **Cloud Run maps** your domain to the service
4. ✅ **Cloud Run provides** DNS records to add to your registrar
5. ✅ **Cloud Run automatically provisions** SSL certificate (free!)

---

## 📋 Step-by-Step: dreamnet.world Setup

### Step 1: Buy the Domain

**Option A: Google Domains** (Recommended - easiest GCP integration)
1. Go to [domains.google.com](https://domains.google.com)
2. Search for `dreamnet.world`
3. Add to cart and purchase
4. Complete registration

**Option B: Cloudflare** (Good DNS management)
1. Go to [cloudflare.com](https://cloudflare.com)
2. Sign up/login
3. Add site → Register domain → Search `dreamnet.world`
4. Purchase

**Option C: Namecheap** (Budget-friendly)
1. Go to [namecheap.com](https://namecheap.com)
2. Search `dreamnet.world`
3. Add to cart and checkout

**Cost**: `.world` domains are typically $20-40/year

---

### Step 2: Deploy to Cloud Run

Once you have the domain, deploy your service:

```bash
# Build and deploy
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_SERVICE_NAME=dreamnet,_REGION=us-central1

# Or use the npm script
pnpm deploy:cloud-run
```

This creates a Cloud Run service that will serve:
- `https://dreamnet.world/` → Main frontend (client)
- `https://dreamnet.world/admin/*` → Admin Dashboard
- `https://dreamnet.world/api/*` → Backend API

---

### Step 3: Map Domain to Cloud Run

After deployment, map your domain:

**Using PowerShell (Windows):**
```powershell
.\scripts\setup-google-domain.ps1 -Domain "dreamnet.world" -ServiceName "dreamnet" -Region "us-central1"
```

**Or manually:**
```bash
gcloud run domain-mappings create \
  --service=dreamnet \
  --domain=dreamnet.world \
  --region=us-central1
```

**What this does:**
- Creates a domain mapping in Cloud Run
- Provides DNS records you need to add
- Starts SSL certificate provisioning (automatic, free!)

---

### Step 4: Add DNS Records

Cloud Run will give you DNS records like:

```
Type: A
Name: @
Value: 216.239.32.21

Type: A
Name: @
Value: 216.239.34.21

Type: A
Name: @
Value: 216.239.36.21

Type: A
Name: @
Value: 216.239.38.21

Type: AAAA
Name: @
Value: 2001:4860:4802:32::15

Type: AAAA
Name: @
Value: 2001:4860:4802:34::15

Type: AAAA
Name: @
Value: 2001:4860:4802:36::15

Type: AAAA
Name: @
Value: 2001:4860:4802:38::15
```

**Add these to your domain registrar:**

**If using Google Domains:**
1. Go to [domains.google.com](https://domains.google.com)
2. Click on `dreamnet.world`
3. Go to **DNS** tab
4. Click **Custom records**
5. Add each A and AAAA record
6. Save

**If using Cloudflare:**
1. Go to Cloudflare Dashboard
2. Select `dreamnet.world`
3. Go to **DNS** → **Records**
4. Add each A and AAAA record
5. Save

**If using Namecheap:**
1. Go to Namecheap Dashboard
2. Domain List → Manage `dreamnet.world`
3. **Advanced DNS** tab
4. Add each A and AAAA record
5. Save

---

### Step 5: Wait for Propagation

- **DNS Propagation**: 5-60 minutes (usually ~15 minutes)
- **SSL Certificate**: Automatically provisioned by Google (~10 minutes after DNS)

**Check status:**
```bash
gcloud run domain-mappings describe \
  --domain=dreamnet.world \
  --region=us-central1
```

Look for `status.conditions[0].status: True` - that means it's active!

---

### Step 6: Verify Everything Works

Once DNS propagates and SSL is active:

✅ **Main Frontend**: `https://dreamnet.world/`
✅ **Admin Dashboard**: `https://dreamnet.world/admin`
✅ **API Health**: `https://dreamnet.world/api/health`
✅ **SSL Certificate**: Should show green lock in browser

---

## 🎉 What Cloud Run Provides Automatically

1. ✅ **SSL Certificate** - Free, automatically renewed
2. ✅ **HTTPS** - Automatic redirect from HTTP
3. ✅ **Global CDN** - Fast worldwide
4. ✅ **DDoS Protection** - Built-in
5. ✅ **Auto-scaling** - Handles traffic spikes

**You don't need to:**
- ❌ Configure SSL manually
- ❌ Set up load balancers
- ❌ Manage certificates
- ❌ Worry about renewals

---

## 🔧 Quick Commands Reference

```bash
# Deploy service
gcloud builds submit --config cloudbuild.yaml

# Map domain
gcloud run domain-mappings create \
  --service=dreamnet \
  --domain=dreamnet.world \
  --region=us-central1

# Check domain status
gcloud run domain-mappings describe \
  --domain=dreamnet.world \
  --region=us-central1

# List all domain mappings
gcloud run domain-mappings list --region=us-central1

# Update service
gcloud run services update dreamnet \
  --region=us-central1
```

---

## 🚨 Important Notes

1. **Buy domain FIRST** - You need to own it before mapping
2. **DNS propagation takes time** - Be patient (5-60 minutes)
3. **SSL is automatic** - No manual certificate management
4. **One domain = one service** - But that service serves everything
5. **Cost**: Cloud Run charges per request (very cheap for low traffic)

---

## ✅ Checklist

- [ ] Buy `dreamnet.world` from registrar
- [ ] Deploy Cloud Run service
- [ ] Map domain to Cloud Run
- [ ] Add DNS records to registrar
- [ ] Wait for DNS propagation
- [ ] Verify SSL certificate active
- [ ] Test main frontend
- [ ] Test admin dashboard
- [ ] Test API endpoints
- [ ] Update CORS settings if needed

---

## 🎯 Next Steps

1. **Buy the domain** - Go to Google Domains/Cloudflare/Namecheap
2. **Fix client build** - So everything deploys correctly
3. **Deploy to Cloud Run** - Use the Dockerfile we've been fixing
4. **Map the domain** - Use the script or manual command
5. **Add DNS records** - Copy from Cloud Run to your registrar
6. **Wait and verify** - Check that everything works!

---

**Ready to buy `dreamnet.world`?** 🚀

Once you have it, we can deploy and map it in minutes!

