# DomainKeeper - Automated Domain Management

## Overview

DomainKeeper automates the connection between `dreamnet.ink` and your Vercel project, ensuring:
- ✅ `dreamnet.ink` is ALWAYS attached to the correct Vercel project
- ✅ DNS records point to Vercel's infrastructure
- ✅ Post-deploy self-healing (verifies domain after each deployment)
- ✅ Idempotent operations (safe to call multiple times)

## Architecture

```
DomainKeeper
├── Vercel Client (server/integrations/vercelClient.ts)
│   └── Manages Vercel project domain attachments
├── DNS Provider Abstraction (server/integrations/dnsProvider.ts)
│   └── Interface for DNS record management
├── Cloudflare Implementation (server/integrations/cloudflareDns.ts)
│   └── Cloudflare DNS API integration
└── DomainKeeper Service (server/services/DomainKeeper.ts)
    └── Orchestrates Vercel + DNS sync
```

## Environment Variables

### Required
- `VERCEL_TOKEN` - Vercel API token (get from https://vercel.com/account/tokens)

### Optional Vercel
- `VERCEL_TEAM_ID` - Vercel team ID (if account is under a team)
- `VERCEL_PROJECT_NAME` - Vercel project name (default: "dream-net")
- `PRIMARY_DOMAIN` - Primary production domain (default: "dreamnet.ink")
- `STAGING_DOMAIN` - Staging/preview domain (optional, default: "staging.dreamnet.ink")

### Optional DNS (Cloudflare)
- `DNS_PROVIDER` - DNS provider name (e.g., "cloudflare", "none")
- `CF_API_TOKEN` - Cloudflare API token
- `CF_ZONE_ID` - Cloudflare zone ID
- `CF_ZONE_NAME` - Cloudflare zone name (optional, auto-detected)

## Usage

### Automatic (Post-Deploy)

DomainKeeper automatically syncs domains after successful Vercel deployments:

```typescript
// In server/routes/deployment.ts
if (result.success && config.platform === 'vercel') {
  getDomainKeeper()
    .syncProductionDomain()
    .then((syncResult) => {
      console.log(`Domain sync: ${syncResult.action}`);
    })
    .catch((error) => {
      console.error('Domain sync error (non-blocking):', error);
    });
}
```

### Manual API Call

```bash
POST /api/deployment/sync-domains
```

Response:
```json
{
  "success": true,
  "summary": {
    "total": 2,
    "successful": 2,
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

### Programmatic

```typescript
import { getDomainKeeper } from './services/DomainKeeper';

const keeper = getDomainKeeper();

// Sync production domain only
const result = await keeper.syncProductionDomain();

// Sync staging domain (if configured)
const stagingResult = await keeper.syncStagingDomain();

// Sync all domains
const allResults = await keeper.syncAllDomains();
```

## How It Works

### 1. Production Domain Sync (`syncProductionDomain()`)

1. **Find Vercel Project**: Looks up project by `VERCEL_PROJECT_NAME`
2. **Attach Domain**: Ensures `PRIMARY_DOMAIN` is attached to the project
3. **Sync DNS**: Updates DNS records to point to Vercel:
   - Apex domains (`dreamnet.ink`): A record or CNAME flattening
   - Subdomains (`staging.dreamnet.ink`): CNAME to `cname.vercel-dns.com`

### 2. Staging Domain Sync (`syncStagingDomain()`)

Same as production, but:
- Attached as preview/alias (not primary)
- Uses different git branch if configured

### 3. DNS Provider Abstraction

- **Cloudflare**: Full DNS management via Cloudflare API
- **NoOp**: Safe fallback if DNS provider not configured (logs warnings)

## Idempotency

All operations are idempotent:
- ✅ If domain already attached → no-op
- ✅ If DNS record already correct → no-op
- ✅ If record exists but wrong → update it
- ✅ Safe to call multiple times

## Error Handling

- **Non-blocking**: DNS sync failures don't fail deployments
- **Logging**: All actions logged for debugging
- **Graceful degradation**: Falls back to NoOp provider if DNS not configured

## Integration Points

1. **Post-Deploy Hook**: Automatically syncs after Vercel deployments
2. **API Endpoint**: `/api/deployment/sync-domains` for manual triggers
3. **DreamOps**: Can be called by agents for domain management
4. **Cron Jobs**: Can be scheduled for periodic verification

## Future Enhancements

- Support for multiple DNS providers (AWS Route53, Google Cloud DNS, etc.)
- Automatic DNS record discovery from Vercel API
- Health checks and monitoring
- Rollback capabilities
- Multi-domain support beyond staging

---

**DomainKeeper ensures dreamnet.ink is always correctly configured!** 🚀

