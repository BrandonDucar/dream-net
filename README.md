# DreamnetV2
dreamnet upgrade

<!-- chore: trigger redeploy -->

## 🏰 The Citadel - Strategic Command Center

**The Citadel** is DreamNet's strategic command center that orchestrates 8 specialized Vertex AI agents to generate comprehensive snapshots, reports, and blueprints.

### Quick Start

```bash
# Generate snapshot (Agent 1)
curl -X POST http://localhost:3000/api/snapshot/generate

# Run drone dome analysis (Agent 2)
curl -X POST http://localhost:3000/api/drone-dome/analyze

# Get latest snapshot
curl http://localhost:3000/api/snapshot
```

### The 8 Agents

1. **Agent 1**: Snapshot Engine - Creates foundational snapshot of DreamNet state
2. **Agent 2**: Drone Dome Scanner - Analyzes health, risks, and priorities
3. **Agent 3**: Event Fabric Builder - Designs event fabric and monitoring blueprint
4. **Agent 4**: DreamKeeper Architect - Designs health scores and diagnostic systems
5. **Agent 5**: DeployKeeper Architect - Designs unified deployment model *(Pending)*
6. **Agent 6**: Data Spine Architect - Transforms domains into data spine *(Pending)*
7. **Agent 7**: SocialOps Architect - Maps external platforms *(Pending)*
8. **Agent 8**: Master Blueprint Planner - Synthesizes all outputs *(Pending)*

### Features

- ✅ **Automatic execution** - Runs with every orchestrator cycle (every 60 seconds)
- ✅ **Dependency validation** - Agents only run when dependencies are available
- ✅ **Output storage** - All outputs stored in `data/agent-outputs/`
- ✅ **REST APIs** - Manual triggering and querying available
- ✅ **Status tracking** - Monitor which agents ran and any errors

### Documentation

See [docs/THE_CITADEL.md](docs/THE_CITADEL.md) for complete documentation.

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