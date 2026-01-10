# DreamNet Domain Status & Capabilities

## 🌐 Owned Domains

DreamNet currently owns/manages the following domains:

1. **dreamnet.ink** - Primary production domain
2. **dreamnet.live** - Secondary domain
3. **dadfi.org** - DeFi-focused domain

## 📍 Current Configuration

### dreamnet.ink
- **Status**: Configured for GKE deployment
- **DNS**: Managed via Google Cloud DNS (zone: `dreamnet-ink`)
- **SSL**: Managed via Kubernetes ManagedCertificate (`dreamnet-ssl`)
- **Routing**: 
  - `/api/*` → API routes
  - `/*` → Frontend (served by API server)
- **Ingress**: Configured in `infrastructure/google/gke/ingress.yaml`
- **Static IP**: `dreamnet-ip` (needs to be created manually)

### dreamnet.live
- **Status**: Not yet configured
- **DNS**: Needs Cloud DNS zone creation
- **SSL**: Needs ManagedCertificate setup

### dadfi.org
- **Status**: Not yet configured
- **DNS**: Needs Cloud DNS zone creation
- **SSL**: Needs ManagedCertificate setup

## 🚀 When Will Mini Apps & Dream Hub Show Up?

### Current State
- ✅ **Mini Apps**: Available at `https://dreamnet.ink/miniapps`
- ✅ **Base Mini Apps Hub**: Available at `https://dreamnet.ink/mini-apps/*`
- ✅ **Dream Hub**: Available at `https://dreamnet.ink/admin` or `https://dreamnet.ink/dream-cloud`
- ✅ **Dream Network Explorer**: Available at `https://dreamnet.ink/dream-network-explorer`

### To Make Them Live
1. **Deploy to GKE**:
   ```bash
   pnpm deploy:gke
   ```
   This will:
   - Build Docker image
   - Push to GCR
   - Deploy to GKE cluster
   - Configure Ingress with SSL

2. **Or Deploy to Cloud Run** (simpler):
   ```bash
   pnpm deploy:gcp
   ```
   Then configure custom domain in Cloud Run console

3. **Or Deploy to App Engine** (zero-ops):
   ```bash
   pnpm deploy:appengine
   ```
   App Engine automatically handles SSL and domain routing

### Prerequisites for GKE
Before `pnpm deploy:gke` will work, you need to manually create:
- Static IP: `gcloud compute addresses create dreamnet-ip --global`
- DNS zones: Run `pnpm setup:gcp-domains` to create Cloud DNS zones
- Update domain registrar with Cloud DNS name servers
- Kubernetes secrets: `kubectl create secret generic dreamnet-secrets --from-literal=database-url="..."`

## 🎫 Domain Issuance Capabilities

DreamNet can issue domains to itself or to users via the Domain Issuance Core system.

### Available Domain Types
- **`.dream` domains**: Issued to DreamNet passports
- **`.sheep` domains**: Issued to wallets with staked SHEEP tokens

### API Endpoints
- `POST /api/domains/issue/dream` - Issue a .dream domain
- `POST /api/domains/issue/sheep` - Issue a .sheep domain
- `GET /api/domains/resolve/:domain` - Resolve domain to passport/wallet
- `GET /api/domains/passport/:passportId` - Get all domains for a passport
- `GET /api/domains/wallet/:walletAddress` - Get all domains for a wallet
- `POST /api/domains/link` - Link external domain to .dream domain
- `GET /api/domains/list` - List all issued domains (admin)

### Self-Issuance Example
```bash
# Issue a .dream domain to DreamNet itself
curl -X POST https://dreamnet.ink/api/domains/issue/dream \
  -H "Content-Type: application/json" \
  -d '{
    "passportId": "dreamnet-main",
    "walletAddress": "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
    "requestedName": "dreamnet",
    "tier": "premium"
  }'
```

## 🔍 Domain Scanning & Management

### Scan All Domains
```bash
pnpm scan:domains
```
Checks:
- DNS records (A, CNAME, MX, TXT, NS)
- SSL certificate validity and expiry
- HTTP status codes
- Domain routing

### Setup GCP Domains
```bash
pnpm setup:gcp-domains
```
Creates:
- Cloud DNS zones for all domains
- DNS records pointing to GCP services
- Provides name servers for domain registrar

### Domain Keeper Service
The `DomainKeeper` service (`server/services/DomainKeeper.ts`) automatically:
- Syncs `dreamnet.ink` to Vercel project (if using Vercel)
- Manages DNS records via Cloudflare (if configured)
- Ensures domain attachment after deployments

## 📋 Domain Checklist

- [ ] Static IP created (`dreamnet-ip`)
- [ ] Cloud DNS zones created for all domains
- [ ] Domain registrar updated with Cloud DNS name servers
- [ ] SSL certificates provisioned (via ManagedCertificate)
- [ ] DNS records pointing to GCP services
- [ ] Ingress configured with domain routing
- [ ] Secrets configured in Kubernetes
- [ ] Deployment successful (`pnpm deploy:gke`)

## 🛠️ Troubleshooting

### Domain Not Resolving
1. Check DNS propagation: `dig dreamnet.ink`
2. Verify name servers at registrar match Cloud DNS
3. Check DNS records: `gcloud dns record-sets list --zone=dreamnet-ink`

### SSL Certificate Not Provisioning
1. Check ManagedCertificate status: `kubectl describe managedcertificate dreamnet-ssl`
2. Verify domain ownership in Google Search Console
3. Ensure DNS records are correct

### Mini Apps Not Loading
1. Check server is running: `curl https://dreamnet.ink/health`
2. Verify frontend build exists: `ls client/dist/`
3. Check API routes: `curl https://dreamnet.ink/api/health`

## 🔗 Related Files
- `infrastructure/google/gke/ingress.yaml` - Ingress configuration
- `infrastructure/google/gke/deployment.yaml` - Kubernetes deployment
- `server/services/DomainKeeper.ts` - Domain management service
- `server/routes/domain-issuance.ts` - Domain issuance API
- `packages/domain-issuance-core/` - Domain issuance core logic
- `scripts/scan-domains.ts` - Domain scanning script
- `scripts/setup-gcp-domains.ts` - GCP domain setup script

