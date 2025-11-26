# DNS Setup for dreamnet.ink → Cloud Run

## Current Status
- ✅ Cloud Run service deployed: `https://dreamnet-99337497594.us-central1.run.app`
- ✅ Domain: `dreamnet.ink` (managed in Namecheap)
- ⏳ DNS records need to be configured

## Step 1: Map Custom Domain in Google Cloud Run

First, we need to map `dreamnet.ink` in Google Cloud Run to get the DNS records:

```bash
# Navigate to Cloud Run console:
# https://console.cloud.google.com/run/detail/us-central1/dreamnet?project=YOUR_PROJECT_ID

# Or use gcloud CLI:
gcloud run domain-mappings create \
  --service=dreamnet \
  --domain=dreamnet.ink \
  --platform=managed \
  --region=us-central1
```

**Note:** This command will provide you with specific A records (IP addresses) that need to be added in Namecheap.

## Step 2: Add DNS Records in Namecheap

Once you map the domain in Cloud Run, Google will provide you with:
- **4 A records** with specific IP addresses
- These IPs point to Google's load balancer for your Cloud Run service

### Records to Add:

1. **A Record for root domain (@)**
   - Type: A
   - Host: @ (or leave blank for root)
   - Value: [IP from Google - will be provided after mapping]
   - TTL: Automatic (or 3600)

2. **A Record for www subdomain**
   - Type: A  
   - Host: www
   - Value: [Same IP from Google]
   - TTL: Automatic (or 3600)

3. **Additional A records** (Google typically provides 4 IPs for redundancy)

## Step 3: Verify DNS Propagation

After adding the records, wait 5-10 minutes for DNS propagation, then verify:

```bash
# Check DNS records
nslookup dreamnet.ink
dig dreamnet.ink

# Test the website
curl https://dreamnet.ink
```

## Alternative: Quick Setup (Temporary)

If you want to test immediately, you can add a CNAME for `www`:

- Type: CNAME
- Host: www
- Value: `dreamnet-99337497594.us-central1.run.app`
- TTL: Automatic

**Note:** Root domains (@) cannot use CNAME records, so you'll still need A records for `dreamnet.ink` (without www).

## What Happens After Setup

Once DNS is configured:
- ✅ `dreamnet.ink` → Points to your Cloud Run service
- ✅ `www.dreamnet.ink` → Points to your Cloud Run service  
- ✅ SSL certificate automatically provisioned by Google
- ✅ All mini-apps and DreamHub accessible at `dreamnet.ink`

## Current Cloud Run Service

- **Service Name:** `dreamnet`
- **Region:** `us-central1`
- **URL:** `https://dreamnet-99337497594.us-central1.run.app`
- **Status:** ✅ Deployed and running

