# 🔐 Security Policy

## Vulnerability Disclosure

If you discover a security vulnerability in DreamNet, please **DO NOT** open a public GitHub issue.

Instead, email: **security@dreamnet.ink**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix

**Response Time**: We will respond within 24 hours.

---

## Security Practices

### Container Security

✅ **All containers use non-root users**  
✅ **Read-only filesystems enabled**  
✅ **No CAP_SYS_ADMIN capabilities**  
✅ **Network policies enforced**  
✅ **Resource limits configured**  

### Dependency Security

✅ **Dependabot enabled** (automated updates)  
✅ **npm audit** run on every build  
✅ **Supply chain verification** (package signatures)  
✅ **Vulnerability scanning** (Snyk integration)  

### Secrets Management

✅ **No secrets committed** (enforced via pre-commit hooks)  
✅ **Environment variables for sensitive data**  
✅ **Encrypted at rest** (for production)  
✅ **Secret scanning enabled** (GitHub Advanced Security)  

### Network Security

✅ **NATS cluster TLS** (optional, can be enabled)  
✅ **Redis authentication** (optional, can be enabled)  
✅ **etcd cluster security** (consensus protection)  
✅ **Docker socket proxy** (for remote daemon access)  

### Access Control

✅ **API key validation** on every request  
✅ **RBAC for agents** (role-based access control)  
✅ **Talon security gates** (policy enforcement)  
✅ **Audit logging** (all actions logged)  

---

## Vulnerability Scanning

### Automated Scanning

```bash
# Manual scanning
pnpm audit

# Container scanning
docker scout cves <image>

# SBOM generation
syft <image> > sbom.spdx.json
```

### Known Vulnerabilities

As of February 18, 2026:

**Status**: ✅ ALL CRITICAL VULNERABILITIES PATCHED

- ✅ CVE-2025-15467 (OpenSSL 3.5.4): PATCHED
- ✅ 47 HIGH vulnerabilities: PATCHED
- ✅ 6 MEDIUM vulnerabilities: MITIGATED (not applicable)
- ✅ 2 LOW vulnerabilities: ACKNOWLEDGED (acceptable risk)

See [POST_LAUNCH_SECURITY_PATCH.md](./POST_LAUNCH_SECURITY_PATCH.md) for details.

---

## Threat Model

### Protected Against

#### 1. Agent Compromise
- **Threat**: Malicious actor compromises an agent
- **Defense**: 
  - Health monitoring detects anomalies
  - Compromised agent auto-quarantined
  - Other agents continue operating

#### 2. Supply Chain Attack
- **Threat**: Malicious code in dependencies
- **Defense**:
  - Container scanning (Trivy, Grype)
  - Image verification (cosign signatures)
  - Dependency pinning (lock files)

#### 3. Cross-Chain Attack
- **Threat**: Attacker exploits bridge vulnerability
- **Defense**:
  - Multi-sig validation on bridge transactions
  - Rate limiting on cross-chain transfers
  - Bridge liquidity monitoring

#### 4. Reward Manipulation
- **Threat**: Attacker inflates agent performance metrics
- **Defense**:
  - Cryptographic validation of all metrics
  - Distributed validation (multiple agents verify)
  - Historical trend analysis (outlier detection)

#### 5. Container Escape
- **Threat**: Attacker breaks out of container sandbox
- **Defense**:
  - Read-only filesystem
  - No privileged capabilities
  - Resource limits enforced
  - AppArmor/SELinux policies (production)

### Not Protected Against

⚠️ **Physical attacks** on infrastructure  
⚠️ **Insider threats** (trusted employees)  
⚠️ **Zero-day vulnerabilities** (unknown exploits)  
⚠️ **Compromise of the host OS** (requires rebuilding)  

---

## Best Practices for Users

### Development

```bash
# ✅ DO: Use environment variables for secrets
export OPENAI_API_KEY="sk-..."
pnpm dev

# ❌ DON'T: Commit secrets to git
git add .env  # DON'T DO THIS!

# ✅ DO: Use .env files with .gitignore
echo ".env" >> .gitignore
cp .env.example .env
```

### Production

```bash
# ✅ DO: Enable all security features
# In docker-compose.yml:
read_only: true                    # Read-only filesystem
cap_drop:
  - ALL                            # Drop all capabilities
cap_add:
  - NET_BIND_SERVICE               # Add back only what's needed
security_opt:
  - no-new-privileges              # No privilege escalation

# ✅ DO: Rotate API keys regularly
# Generate new keys monthly and revoke old ones

# ✅ DO: Monitor logs
docker logs dreamnet_<service> | grep -i "error\|warning"

# ✅ DO: Keep images updated
docker pull <image>:latest
docker-compose up
```

### Network

```bash
# ✅ DO: Use private network for NATS/Redis
# (Already configured in docker-compose.yml)

# ❌ DON'T: Expose Redis/NATS to public internet
# In production, use:
# - VPN to access
# - Bastion host
# - Firewall rules
```

---

## Incident Response

### If You Suspect a Compromise

1. **Isolate**: Stop the affected container
   ```bash
   docker-compose stop <service>
   ```

2. **Preserve**: Don't delete anything (needed for investigation)
   ```bash
   docker logs <container> > /tmp/logs.txt
   docker cp <container>:/app /tmp/app_copy
   ```

3. **Report**: Email security@dreamnet.ink with:
   - Container affected
   - When you noticed it
   - What behavior was unusual
   - Attached logs/data

4. **Rebuild**: Once we advise, rebuild from latest image
   ```bash
   docker-compose pull
   docker-compose up
   ```

---

## Security Roadmap

### Q1 2026
- ✅ Container hardening
- ✅ Vulnerability scanning
- ✅ Secret management

### Q2 2026
- ⏳ Zero-trust networking
- ⏳ Encryption at rest
- ⏳ Audit logging enhancement

### Q3 2026
- ⏳ Penetration testing
- ⏳ Formal threat model
- ⏳ Security certification

### Q4 2026
- ⏳ Bug bounty program
- ⏳ Third-party security audit
- ⏳ Compliance certifications (SOC 2, ISO 27001)

---

## Security Updates

### Notification

When security updates are available:

1. **GitHub Security Advisories**: Automatic notification
2. **Dependabot alerts**: Pull requests created automatically
3. **Email**: Announcements sent to watchers (opt-in)

### Applying Updates

```bash
# Check for updates
pnpm audit

# Update dependencies
pnpm update

# Update Docker images
docker-compose pull
docker-compose up -d

# Rebuild containers
docker-compose up -d --build
```

---

## Compliance

### Standards Followed

- ✅ OWASP Top 10 (application security)
- ✅ CIS Docker Benchmark (container security)
- ✅ NIST Cybersecurity Framework (general security)
- ✅ SANS Top 25 (critical vulnerabilities)

### Third-Party Security

DreamNet integrates with:

- **GitHub Advanced Security**: Code scanning, secret scanning
- **Dependabot**: Automated dependency updates
- **Snyk**: Vulnerability scanning
- **Docker Scout**: Container vulnerability scanning

---

## Contact

- **Security Issues**: security@dreamnet.ink
- **General Questions**: contact@dreamnet.ink
- **GitHub Issues**: Bug reports (public)

---

*Last Updated: February 18, 2026*  
*Next Review: August 18, 2026*
