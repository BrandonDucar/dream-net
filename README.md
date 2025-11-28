# DreamnetV2
dreamnet upgrade

<!-- chore: trigger redeploy -->

## Security

### Pre-Deploy Requirements

Before deploying, ensure:

1. **Docker images are pinned** with SHA256 digests (prevents supply-chain attacks)
   ```bash
   pnpm run security:verify-docker
   ```

2. **Dependencies are audited** for compromised packages
   ```bash
   pnpm run security:audit
   ```

3. **Environment variables are set** (see [SECURITY_DEPLOYMENT_CHECKLIST.md](SECURITY_DEPLOYMENT_CHECKLIST.md))

4. **Security gate passes** before deployment
   ```bash
   bash scripts/pre-deploy-security-gate.sh
   ```

### Security Tools

- `pnpm run check:deploy` - Verify environment parity across local/CI/production
- `pnpm run analyze:build-logs <log-file>` - Analyze build failures and get fixes
- `pnpm run dns:hint --provider=vercel --domain=dreamnet.ink` - Generate DNS configuration
- `pnpm run security:audit` - Audit dependencies for supply-chain attacks
- `pnpm run security:verify-docker` - Verify Docker image pinning
- `pnpm run security:verify-lockfile` - Verify lockfile integrity

### Rollback Procedures

See [SECURITY_DEPLOYMENT_CHECKLIST.md](SECURITY_DEPLOYMENT_CHECKLIST.md) for:
- Cloud Run rollback commands
- Vercel rollback steps
- Firebase rollback procedures
- Emergency response for supply-chain attacks

### Known Threats (Nov 2025)

- **Shai-Hulud 2.0** - npm supply-chain worm (protected via Docker pinning + audits)
- **CVE-2025-10894** - Nx compromise (we don't use Nx - safe)
- **150k+ suspicious npm packages** - Registry poisoning risk (mitigated via lockfile checks)