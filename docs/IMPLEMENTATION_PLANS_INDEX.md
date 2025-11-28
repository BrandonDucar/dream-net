# DreamNet Implementation Plans Index

## Completed: Security CVE Remediation ✅

**Status:** Fully implemented and ready for deployment

**What was done:**
- ✅ Docker images pinned with SHA256 digests (prevents supply-chain attacks)
- ✅ Dependency audit scripts (detect Shai-Hulud 2.0, CVE-2025-10894)
- ✅ Security check tools (DeployChecker, BuildLogSummarizer, DnsAutoHint)
- ✅ Pre-deploy security gate (fail-fast on security issues)
- ✅ GitHub Actions security workflow (automated checks)
- ✅ Complete documentation (SECURITY_DEPLOYMENT_CHECKLIST.md)

**Files created:**
- `scripts/verify-docker-pinning.sh`
- `scripts/audit-supply-chain.sh`
- `scripts/preinstall-security-check.sh`
- `scripts/verify-lockfile-integrity.sh`
- `scripts/deploy-checker.ts`
- `scripts/build-log-summarizer.ts`
- `scripts/dns-auto-hint.ts`
- `scripts/pre-deploy-security-gate.sh`
- `.github/workflows/security-checks.yml`
- `SECURITY_DEPLOYMENT_CHECKLIST.md`

**Next steps:** Run `pnpm run security:verify-docker` and `bash scripts/pre-deploy-security-gate.sh` before deployments

---

## Ready for Implementation: Sync Tech (CRDTs & Replicache)

**Plan:** [`docs/plans/SYNC_TECH_IMPLEMENTATION_PLAN.md`](plans/SYNC_TECH_IMPLEMENTATION_PLAN.md)

**Overview:** Implement collaborative sync using Yjs (rich editors), Automerge 3.0 (memory fabric), and Replicache (transactional flows)

**Key decisions:**
- Yjs + TipTap for text editing
- Yjs + Perfect-Freehand for canvas
- Automerge 3.0 for dream lineage/history
- Replicache for payments/credits with wallet signatures

**Estimated timeline:** 2-3 weeks

---

## Ready for Implementation: MCP Migration

**Plan:** [`docs/plans/MCP_MIGRATION_PLAN.md`](plans/MCP_MIGRATION_PLAN.md)

**Overview:** Migrate custom tool connectors to Model Context Protocol standard

**Why:** Eliminates M×N integration problem, future-proofs for new agent frameworks, enables better governance

**Migration phases:**
1. Audit existing connectors
2. Deploy MCP backplane
3. Migrate high-value tools (GitHub, Database, Cloud Run)
4. Refactor agents to MCP clients
5. Add observability & governance
6. CI/eval gates

**Estimated timeline:** 2-3 weeks for initial migration

---

## Ready for Implementation: Observability (OpenTelemetry)

**Plan:** [`docs/plans/OBSERVABILITY_OPENTELEMETRY_PLAN.md`](plans/OBSERVABILITY_OPENTELEMETRY_PLAN.md)

**Overview:** Implement OpenTelemetry → Google Cloud Trace + Honeycomb with cost-aware sampling

**Key features:**
- 1% head sampling + 100% tail sampling (errors/slow)
- Standard trace paths: `wallet_create → agent_tool_call → base_rpc`
- Metric cardinality caps
- Platform support: Cloud Run, Vercel, Firebase

**Estimated timeline:** 1-2 weeks

---

## Ready for Implementation: Base/DeFi Liquidity Strategy

**Plan:** [`docs/plans/BASE_DEFI_LIQUIDITY_PLAN.md`](plans/BASE_DEFI_LIQUIDITY_PLAN.md)

**Overview:** Liquidity seeding and MEV-protected swaps on Base using Aerodrome, Uniswap v3/v4

**Key strategies:**
- Aerodrome gauge-staking before epoch cutoff
- Concentrated liquidity on Uniswap v3/v4
- MEV protection (Flashbots Protect, MEV-Blocker, CoW Swap)
- TWAP execution + cross-venue dispersion

**Estimated timeline:** 1-2 weeks

---

## Ready for Implementation: Stablecoin/CCTP V2 Architecture

**Plan:** [`docs/plans/STABLECOIN_CCTP_V2_PLAN.md`](plans/STABLECOIN_CCTP_V2_PLAN.md)

**Overview:** Institutional-grade stablecoin flows with CCTP V2, Proof-of-Reserve, compliance gates

**Key components:**
- CCTP V2 for native USDC cross-chain transfers
- Chainlink Proof-of-Reserve + circuit breaker
- Regulated on-ramps + KYC/geofencing
- SOC-audited custody + public attestation

**Estimated timeline:** 3-4 weeks

---

## Implementation Priority Recommendation

1. **Security** ✅ (COMPLETED - ready to use)
2. **Observability** (High value, low risk, quick wins)
3. **Sync Tech** (Core feature for collaborative editing)
4. **MCP Migration** (Architectural improvement, can be gradual)
5. **Base/DeFi Liquidity** (When launching tokens)
6. **Stablecoin/CCTP V2** (When needing institutional compliance)

---

## Quick Start Commands

### Security (Ready Now)
```bash
# Verify Docker pinning
pnpm run security:verify-docker

# Audit dependencies
pnpm run security:audit

# Check deployment readiness
pnpm run check:deploy

# Analyze build logs
pnpm run analyze:build-logs <log-file>

# Generate DNS config
pnpm run dns:hint --provider=vercel --domain=dreamnet.ink
```

### Future Implementations
See individual plan files in `docs/plans/` for detailed implementation steps.

