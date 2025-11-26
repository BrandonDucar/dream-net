# 🌐 Domain Setup Summary

## Current Status

### ❌ Dream Hub Not Deployed
- **Service URL**: `https://dreamnet-qa6y4okh2a-ue.a.run.app`
- **Status**: Placeholder page (not actual deployment)
- **Image**: `gcr.io/cloudrun/placeholder`
- **Issue**: The actual Dream Hub code hasn't been deployed yet

### ❌ Domains Not Verified
- **dreamnet.ink**: Not verified
- **dadfi.org**: Not verified
- **Error**: "You currently have no verified domains"

## What Needs to Happen

### Step 1: Deploy Dream Hub ⚠️ CRITICAL

**Before setting up domains, deploy the actual application:**

```powershell
$env:GCP_REGION = "us-east1"
.\scripts\deploy-watchable.ps1
```

**Verify deployment:**
- Visit: `https://dreamnet-qa6y4okh2a-ue.a.run.app/`
- Should see: Landing page (not placeholder)
- Visit: `https://dreamnet-qa6y4okh2a-ue.a.run.app/hub`
- Should see: Dream Hub interface

### Step 2: Verify Domains in Google Cloud

1. **Go to Domain Verification:**
   ```
   https://console.cloud.google.com/apis/credentials/domainverification?project=aqueous-tube-470317-m6
   ```

2. **Add Each Domain:**
   - Click "Add Domain"
   - Enter: `dreamnet.ink`
   - Google will provide a TXT record
   - Repeat for `dadfi.org`

3. **Add TXT Records to Namecheap:**
   - Go to: https://www.namecheap.com/myaccount/login/
   - Navigate to: Domain List → [domain] → Advanced DNS
   - Add the TXT record provided by Google
   - Wait 5-10 minutes for verification

### Step 3: Create Domain Mappings

After verification, map domains to Cloud Run:

```powershell
# Map dreamnet.ink
gcloud beta run domain-mappings create `
  --service=dreamnet `
  --domain=dreamnet.ink `
  --region=us-east1 `
  --project=aqueous-tube-470317-m6

# Map dadfi.org
gcloud beta run domain-mappings create `
  --service=dreamnet `
  --domain=dadfi.org `
  --region=us-east1 `
  --project=aqueous-tube-470317-m6
```

### Step 4: Get DNS Records

After mapping, Google will provide A records (IP addresses):

```powershell
# Get DNS records for dreamnet.ink
gcloud beta run domain-mappings describe dreamnet.ink `
  --region=us-east1 `
  --project=aqueous-tube-470317-m6 `
  --format="json" | ConvertFrom-Json | 
  Select-Object -ExpandProperty status | 
  Select-Object -ExpandProperty resourceRecords

# Get DNS records for dadfi.org
gcloud beta run domain-mappings describe dadfi.org `
  --region=us-east1 `
  --project=aqueous-tube-470317-m6 `
  --format="json" | ConvertFrom-Json | 
  Select-Object -ExpandProperty status | 
  Select-Object -ExpandProperty resourceRecords
```

### Step 5: Add DNS Records to Namecheap

You'll get 4 A records (IP addresses) for each domain.

**For each domain:**

1. **Go to Namecheap DNS:**
   - https://www.namecheap.com/myaccount/login/
   - Domain List → [domain] → Advanced DNS

2. **Add A Records:**
   - **Type**: A
   - **Host**: @ (for root domain) or www (for www subdomain)
   - **Value**: [IP address from Google]
   - **TTL**: Automatic
   - **Repeat**: Add all 4 IPs provided by Google

3. **Wait for DNS Propagation:**
   - 5-10 minutes typically
   - Up to 24 hours in some cases

## Quick Links

- **Google Cloud Console**: https://console.cloud.google.com/run?project=aqueous-tube-470317-m6
- **Domain Verification**: https://console.cloud.google.com/apis/credentials/domainverification?project=aqueous-tube-470317-m6
- **Namecheap Login**: https://www.namecheap.com/myaccount/login/
- **Cloud Run Service**: https://console.cloud.google.com/run/detail/us-east1/dreamnet?project=aqueous-tube-470317-m6

## Automation Script

Run the complete setup guide:

```powershell
.\scripts\verify-and-setup-domains-complete.ps1
```

## Important Notes

1. **Deploy First**: Dream Hub must be deployed before domains will work
2. **Verify First**: Domains must be verified before mapping
3. **DNS Propagation**: Can take 5-10 minutes (up to 24 hours)
4. **SSL Certificates**: Automatically provisioned by Google (can take up to 1 hour)

## Troubleshooting

**If domain mapping fails:**
- Ensure domain is verified first
- Check verification status in Google Cloud Console
- Verify TXT records are correctly added to Namecheap

**If Dream Hub doesn't show:**
- Deploy the application first (it's currently a placeholder)
- Check service logs: `gcloud run services logs read dreamnet --region=us-east1`

**If DNS doesn't work:**
- Wait longer for propagation
- Verify A records are correct in Namecheap
- Check DNS with: `nslookup dreamnet.ink`

