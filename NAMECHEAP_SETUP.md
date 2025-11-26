# Namecheap API Setup Guide

## ⚠️ API Access Requirements

**To qualify for Namecheap API access, you must meet ONE of these criteria:**
- ✅ Account balance of **$50 or more**, OR
- ✅ **20 or more domains** in your account, OR
- ✅ Purchases totaling at least **$50 within the last 2 years**

**Note:** API access will be disabled if you're not compliant with Namecheap's Terms of Service and Acceptable Use Policy.

## Quick Start

1. **Check if You Qualify**
   - Review your account balance, domain count, or purchase history
   - If you don't qualify, you may need to:
     - Add funds to reach $50 balance, OR
     - Purchase more domains to reach 20 total, OR
     - Wait until you have $50 in purchases within 2 years

2. **Enable API Access in Namecheap**
   - Go to: https://ap.www.namecheap.com/settings/tools
   - Click "manage" in the "Business & Dev Tools" section
   - Find "API Access" and enable it
   - Whitelist your IP address (required for API calls)
   - Save your API credentials:
     - **API User**: Your API username
     - **API Key**: Your API key
     - **Username**: Your Namecheap account username

2. **Set Environment Variables**
   ```bash
   NAMECHEAP_API_USER=your_api_user
   NAMECHEAP_API_KEY=your_api_key
   NAMECHEAP_USERNAME=your_namecheap_username
   NAMECHEAP_CLIENT_IP=your_whitelisted_ip
   ```

3. **Set DNS Provider**
   ```bash
   DNS_PROVIDER=namecheap
   PRIMARY_DOMAIN=dreamnet.ink  # or your main domain
   ```

4. **Run Domain Scanner**
   ```bash
   pnpm tsx scripts/scan-namecheap-domains.ts
   ```

## API Endpoints

### List All Domains
```bash
GET /api/namecheap/domains
```

### Get Domain Info
```bash
GET /api/namecheap/domains/{domain}
```

### Get DNS Records
```bash
GET /api/namecheap/domains/{domain}/dns
```

### Update DNS Records
```bash
POST /api/namecheap/domains/{domain}/dns
Content-Type: application/json

{
  "records": [
    {
      "hostname": "@",
      "type": "CNAME",
      "address": "your-cloud-run-url.run.app",
      "ttl": 1800
    },
    {
      "hostname": "www",
      "type": "CNAME",
      "address": "your-cloud-run-url.run.app",
      "ttl": 1800
    }
  ]
}
```

## Pointing Domains to Cloud Run

To point your domain to Google Cloud Run:

1. **Get your Cloud Run URL**
   - Format: `https://dreamnet-xxxxx-uc.a.run.app`
   - Or use a custom domain if configured

2. **Update DNS Records**
   ```bash
   curl -X POST http://localhost:8080/api/namecheap/domains/dreamnet.ink/dns \
     -H "Content-Type: application/json" \
     -d '{
       "records": [
         {
           "hostname": "@",
           "type": "CNAME",
           "address": "dreamnet-xxxxx-uc.a.run.app",
           "ttl": 1800
         }
       ]
     }'
   ```

## Integration with DomainKeeper

The Namecheap DNS provider integrates with the existing `DomainKeeper` service. When `DNS_PROVIDER=namecheap` is set, DNS records will be automatically synced after deployments.

## Troubleshooting

### "IP address not whitelisted"
- Make sure your IP is whitelisted in Namecheap API settings
- Use `NAMECHEAP_CLIENT_IP` to specify your IP
- Or use sandbox mode: `NAMECHEAP_USE_SANDBOX=true`

### "API credentials invalid"
- Double-check your API User, API Key, and Username
- Make sure API access is enabled in your Namecheap account

### "Domain not found"
- Make sure the domain is in your Namecheap account
- Check domain spelling and TLD

## Files Created

- `packages/namecheap-api-core/` - Namecheap API client
- `server/integrations/namecheapDns.ts` - DNS provider implementation
- `server/routes/namecheap.ts` - API routes
- `scripts/scan-namecheap-domains.ts` - Domain scanner script

