# 🚀 DreamNet Deployment Checklist

## Pre-Deployment Verification

### ✅ Server & Backend
- [ ] Server starts without errors (`pnpm dev:app`)
- [ ] Health endpoints respond (`/health`, `/health/live`, `/health/ready`)
- [ ] API endpoints accessible (`/api/*`)
- [ ] Database connection (if configured)
- [ ] Environment variables set

### ✅ Frontend
- [ ] Frontend builds successfully (`pnpm build`)
- [ ] Vite dev server works (`pnpm dev:app`)
- [ ] API client configured (`client/src/lib/queryClient.ts`)
- [ ] Routes accessible in browser

### ✅ Middleware
- [ ] CORS configured
- [ ] Rate limiting active
- [ ] Trace ID middleware
- [ ] Idempotency middleware
- [ ] Tier resolver middleware
- [ ] Control core middleware
- [ ] Auto SEO middleware

### ✅ Domain Configuration
- [ ] Domains issued (`pnpm issue:all-verticals`)
- [ ] DNS zones created (`pnpm setup:gcp-domains`)
- [ ] DNS records configured
- [ ] SSL certificates ready

## Deployment Options

### Option 1: Cloud Run (Easiest)
```bash
# 1. Build and deploy
pnpm deploy:gcp

# 2. Configure custom domain in Cloud Run console
# 3. Update DNS records
```

**Checklist:**
- [ ] GCP project configured
- [ ] Cloud Run API enabled
- [ ] Docker image builds
- [ ] Service deploys successfully
- [ ] Custom domain added
- [ ] DNS records updated

### Option 2: App Engine (Zero-Ops)
```bash
# 1. Deploy
pnpm deploy:appengine

# 2. App Engine handles SSL and routing automatically
```

**Checklist:**
- [ ] `app.yaml` configured
- [ ] App Engine API enabled
- [ ] Deployment successful
- [ ] Custom domain mapped
- [ ] SSL certificate provisioned

### Option 3: GKE (Most Control)
```bash
# 1. Set up prerequisites
pnpm setup:gcp-domains
gcloud compute addresses create dreamnet-ip --global

# 2. Deploy
pnpm deploy:gke
```

**Checklist:**
- [ ] Static IP created
- [ ] DNS zones created
- [ ] Kubernetes secrets configured
- [ ] Deployment manifests valid
- [ ] Ingress configured
- [ ] SSL certificate provisioned
- [ ] DNS records updated

## Post-Deployment Verification

### Health Checks
- [ ] `/health` returns 200
- [ ] `/health/live` returns 200
- [ ] `/health/ready` returns 200
- [ ] Database health check passes (if configured)

### API Endpoints
- [ ] `/api/health` accessible
- [ ] `/api/auth/nonce` works
- [ ] `/api/dreams` accessible
- [ ] `/api/domains/*` accessible
- [ ] CORS headers present

### Frontend
- [ ] Frontend loads at root `/`
- [ ] API calls succeed
- [ ] Wallet connection works
- [ ] Routes navigate correctly

### Domain Verification
- [ ] `dreamnet.ink` resolves
- [ ] SSL certificate valid
- [ ] All vertical domains resolve (if issued)
- [ ] DNS propagation complete

## Domain-Specific Checklists

### dreamnet.ink
- [ ] DNS A record points to service IP
- [ ] SSL certificate provisioned
- [ ] Ingress configured
- [ ] Health checks passing

### dreamnet.live
- [ ] DNS zone created
- [ ] DNS records configured
- [ ] SSL certificate ready
- [ ] Service deployed

### dadfi.org
- [ ] DNS zone created
- [ ] DNS records configured
- [ ] SSL certificate ready
- [ ] Service deployed

### .dream Domains (Issued)
- [ ] Domains issued via API
- [ ] DNS CNAME records configured
- [ ] SSL certificates ready (if needed)
- [ ] Services deployed

## Monitoring & Maintenance

### Monitoring Setup
- [ ] Cloud Monitoring enabled
- [ ] Health check alerts configured
- [ ] Error tracking setup
- [ ] Performance monitoring active

### Backup & Recovery
- [ ] Database backups configured
- [ ] Secrets backed up
- [ ] Recovery plan documented
- [ ] Rollback procedure tested

## Quick Verification Commands

```bash
# Verify connections
pnpm verify:connections

# Verify startup prerequisites
pnpm verify:startup

# Verify Docker build
pnpm verify:docker

# Test everything
pnpm test:everything

# Scan domains
pnpm scan:domains
```

## Troubleshooting

### Server Won't Start
1. Check environment variables
2. Verify database connection (if required)
3. Check port availability
4. Review error logs

### Frontend Not Loading
1. Check Vite dev server
2. Verify API endpoints
3. Check CORS configuration
4. Review browser console

### API Errors
1. Check middleware configuration
2. Verify route registration
3. Check authentication
4. Review server logs

### Domain Issues
1. Check DNS propagation
2. Verify SSL certificate
3. Check Ingress configuration
4. Review DNS records

## Success Criteria

✅ **Server**: Starts and responds to health checks
✅ **Frontend**: Loads and connects to API
✅ **API**: All endpoints accessible
✅ **Domains**: Resolve and have valid SSL
✅ **Monitoring**: Health checks passing
✅ **Documentation**: Deployment guide complete

---

**Ready to deploy?** Run `pnpm verify:connections` first!

