# 🌐 Domain Mapping Guide for DreamNet

## Current Situation

You have **5 Cloud Run services** deployed, but **Dream Hub isn't visible** because:
1. The services aren't mapped to your custom domains (`dreamnet.ink`, `dadfi.org`)
2. They're only accessible via their Cloud Run URLs (e.g., `https://dreamnet-99337497594.us-central1.run.app`)

## Why 5 Services?

From the Cloud Run list, you have:
1. `dream-net` (us-east1) - Old deployment
2. `dream-net` (us-east4) - Old deployment  
3. `dreamhub` (us-central1) - **Status: False** (not ready)
4. `dreamnet` (us-central1) - **Status: False** (not ready)
5. `dreamnet` (us-east1) - Active

**The main service to use:** `dreamnet` in `us-central1` (even though status shows False, it may still be serving)

## Solution: Map Domains to Cloud Run

### Step 1: Verify Domain Ownership

Google Cloud requires domain verification before mapping:

1. **Go to Domain Verification:**
   ```
   https://console.cloud.google.com/apis/credentials/domainverification?project=aqueous-tube-470317-m6
   ```

2. **Add Domain:**
   - Click "Add Domain"
   - Enter: `dreamnet.ink`
   - Google will provide a TXT record

3. **Add TXT Record to Namecheap:**
   - Go to Namecheap DNS management
   - Add the TXT record provided by Google
   - Wait 5-10 minutes for verification

4. **Repeat for `dadfi.org`** (if desired)

### Step 2: Create Domain Mappings

Once verified, map the domains:

```powershell
# Map dreamnet.ink
gcloud beta run domain-mappings create `
  --service=dreamnet `
  --domain=dreamnet.ink `
  --region=us-central1 `
  --project=aqueous-tube-470317-m6

# Map dadfi.org
gcloud beta run domain-mappings create `
  --service=dreamnet `
  --domain=dadfi.org `
  --region=us-central1 `
  --project=aqueous-tube-470317-m6
```

### Step 3: Get DNS Records

After mapping, Google will provide A records (IP addresses):

```powershell
# Get DNS records for dreamnet.ink
gcloud beta run domain-mappings describe dreamnet.ink `
  --region=us-central1 `
  --project=aqueous-tube-470317-m6 `
  --format="json" | ConvertFrom-Json | 
  Select-Object -ExpandProperty status | 
  Select-Object -ExpandProperty resourceRecords

# Get DNS records for dadfi.org
gcloud beta run domain-mappings describe dadfi.org `
  --region=us-central1 `
  --project=aqueous-tube-470317-m6 `
  --format="json" | ConvertFrom-Json | 
  Select-Object -ExpandProperty status | 
  Select-Object -ExpandProperty resourceRecords
```

### Step 4: Add DNS Records to Namecheap

You'll get 4 A records (IP addresses) for each domain. Add them to Namecheap:

**For `dreamnet.ink`:**
- Type: A
- Host: @ (or leave blank for root)
- Value: [IP from Google]
- TTL: Automatic

- Type: A  
- Host: www
- Value: [Same IP from Google]
- TTL: Automatic

(Repeat for all 4 IPs provided)

**For `dadfi.org`:**
- Same process

### Step 5: Wait for DNS Propagation

- DNS changes can take 5-10 minutes to propagate
- SSL certificates are automatically provisioned by Google (can take up to 1 hour)

### Step 6: Verify Dream Hub is Accessible

Once DNS is configured:

1. Visit: `https://dreamnet.ink`
2. You should see:
   - Landing page at `/`
   - Dream Hub at `/hub`
   - Mini-apps at `/legacy` or `/mini-apps/*`

## Alternative: Use Namecheap API

If you have Namecheap API credentials set up, I can automate the DNS record setup:

```powershell
# Set environment variables
$env:NAMECHEAP_API_USER = "your-username"
$env:NAMECHEAP_API_KEY = "your-api-key"

# Then run the automated script
pnpm setup:namecheap-dns
```

## What Dream Hub Should Show

Once `dreamnet.ink` is mapped and DNS is configured, visiting the site should show:

- **Route `/`**: Landing page (`LandingNew` component)
- **Route `/hub`**: Dream Hub (`HubRoutes` component)
- **Route `/legacy`**: Base Mini Apps Hub (`BaseMiniAppsHubPage` with `DreamNetHubWrapper`)
- **Route `/mini-apps/*`**: Individual mini-apps

## Troubleshooting

**If Dream Hub still doesn't show:**
1. Check if the service is actually running: `gcloud run services describe dreamnet --region=us-central1`
2. Check service logs: `gcloud run services logs read dreamnet --region=us-central1`
3. Verify frontend is being served (check if `/` returns HTML, not just API responses)
4. Check if Vite is configured correctly in `server/index.ts`

**If domain mapping fails:**
- Ensure domain is verified first
- Check that you have proper permissions in GCP
- Verify the service name and region are correct

## Quick Commands Reference

```powershell
# List all services
gcloud run services list

# Describe main service
gcloud run services describe dreamnet --region=us-central1

# Check domain mappings
gcloud beta run domain-mappings list

# View service logs
gcloud run services logs read dreamnet --region=us-central1 --limit=50
```

