# DomainKeeper Setup Guide

## Quick Start

DomainKeeper is now implemented and ready to use! It will automatically sync domains after Vercel deployments.

## Configuration

### Required
- `VERCEL_TOKEN` - Get from https://vercel.com/account/tokens

### Optional (for automatic DNS sync)
- `DNS_PROVIDER=cloudflare`
- `CF_API_TOKEN` - Cloudflare API token
- `CF_ZONE_ID` - Cloudflare zone ID (found in Cloudflare dashboard)
- `CF_ZONE_NAME` - Zone name (optional, auto-detected)

### Optional (customization)
- `VERCEL_PROJECT_NAME` - Default: "dream-net"
- `PRIMARY_DOMAIN` - Default: "dreamnet.ink"
- `STAGING_DOMAIN` - Default: "staging.dreamnet.ink" (set to empty to disable)

## How It Works

1. **After Vercel Deployment**: DomainKeeper automatically syncs `dreamnet.ink` to your Vercel project
2. **DNS Sync**: If Cloudflare is configured, DNS records are automatically updated
3. **Manual Trigger**: Call `POST /api/deployment/sync-domains` anytime

## Testing

```bash
# Manual domain sync
curl -X POST http://localhost:5000/api/deployment/sync-domains

# Response:
{
  "success": true,
  "summary": {
    "total": 1,
    "successful": 1,
    "failed": 0,
    "results": [
      {
        "domain": "dreamnet.ink",
        "vercel": {
          "action": "attached",
          "message": "Domain attached to project dream-net"
        },
        "dns": {
          "action": "updated",
          "message": "CNAME @ -> cname.vercel-dns.com"
        }
      }
    ]
  }
}
```

## What Gets Synced

### Production Domain (dreamnet.ink)
- ✅ Attached to Vercel project as primary domain
- ✅ DNS: CNAME `@` → `cname.vercel-dns.com`

### Staging Domain (staging.dreamnet.ink) - Optional
- ✅ Attached to Vercel project as preview/alias
- ✅ DNS: CNAME `staging` → `cname.vercel-dns.com`

## Files Created

- `server/integrations/vercelClient.ts` - Vercel API client
- `server/integrations/dnsProvider.ts` - DNS provider abstraction
- `server/integrations/cloudflareDns.ts` - Cloudflare implementation
- `server/services/DomainKeeper.ts` - Main service
- `docs/DOMAIN_KEEPER.md` - Full documentation

## Next Steps

1. Set `VERCEL_TOKEN` in your environment
2. (Optional) Configure Cloudflare DNS if you want automatic DNS sync
3. Deploy to Vercel - DomainKeeper will automatically sync domains!
4. Or manually trigger: `POST /api/deployment/sync-domains`

---

**DomainKeeper ensures dreamnet.ink is always correctly configured!** 🚀

