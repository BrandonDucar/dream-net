# Security Deployment Checklist

## Pre-Deploy Security Checks

Run these checks before every deployment:

```bash
# 1. Verify Docker image pinning
pnpm run security:verify-docker

# 2. Audit dependencies for supply-chain attacks
pnpm run security:audit

# 3. Verify lockfile integrity
pnpm run security:verify-lockfile

# 4. Run pre-deploy security gate
bash scripts/pre-deploy-security-gate.sh
```

## Required Environment Variables

These must be set in all environments (local, CI, production):

- `NODE_ENV` - Environment (production/staging/development)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret (must be strong, random)
- `PUBLIC_BASE_URL` - Public base URL for the application

## Docker Image Pinning

**CRITICAL:** All Docker images must be pinned with SHA256 digests to prevent supply-chain attacks.

**Example:**
```dockerfile
# ✅ CORRECT - Pinned
FROM node:20-slim@sha256:fbb357f69d05c97333855b0846e4ef65462409728312df3c9ff12c941741c0a5

# ❌ WRONG - Unpinned (security risk)
FROM node:20-slim
```

**Verification:**
```bash
pnpm run security:verify-docker
```

## Supply-Chain Attack Protection

### Known Threats (as of Nov 2025)

1. **Shai-Hulud 2.0** - npm supply-chain worm that harvests CI/CD secrets
2. **CVE-2025-10894** - Nx build system compromise (we don't use Nx - safe)
3. **150k+ suspicious npm packages** - Registry noise and poisoning risk

### Protection Measures

- ✅ Docker images pinned with SHA256
- ✅ Dependency audit before deployment
- ✅ Lockfile integrity checks
- ✅ Preinstall script monitoring
- ✅ CI/CD security gates

## Rollback Procedures

### Cloud Run Rollback

```bash
# List revisions
gcloud run revisions list --service=dreamnet-api --region=us-central1

# Rollback to previous revision
gcloud run services update-traffic dreamnet-api \
  --to-revisions=PREVIOUS_REVISION=100 \
  --region=us-central1
```

### Vercel Rollback

1. Go to Vercel Dashboard → Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

### Firebase Rollback

```bash
# List releases
firebase hosting:channel:list

# Rollback to previous release
firebase hosting:channel:deploy previous-release-id
```

## Emergency Response

If supply-chain attack detected:

1. **Immediate Actions:**
   - Rotate all CI/CD secrets immediately
   - Rotate cloud credentials (AWS, GCP, Vercel tokens)
   - Review recent deployments for suspicious activity
   - Check for credential exfiltration in logs

2. **Investigation:**
   - Review dependency audit logs
   - Check for suspicious package scripts
   - Verify lockfile hasn't been tampered
   - Review build logs for unexpected network calls

3. **Containment:**
   - Rollback to last known-good deployment
   - Update all compromised dependencies
   - Regenerate lockfile from scratch
   - Re-pin all Docker images

4. **Prevention:**
   - Enable all security checks in CI/CD
   - Require security gate pass before deploy
   - Monitor for suspicious package updates
   - Regular dependency audits

## Security Tools

- `pnpm run check:deploy` - Verify environment parity
- `pnpm run analyze:build-logs <log-file>` - Analyze build failures
- `pnpm run dns:hint --provider=vercel --domain=dreamnet.ink` - Generate DNS config
- `pnpm run security:audit` - Audit dependencies
- `pnpm run security:verify-docker` - Verify Docker pinning
- `pnpm run security:verify-lockfile` - Verify lockfile integrity

## Contact

For security incidents, follow your organization's security response procedures.

