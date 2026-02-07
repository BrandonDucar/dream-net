# 🔒 POST-LAUNCH SECURITY PATCH PLAN

**Created**: 2026-02-07
**Scheduled**: Monday 2026-02-10 (Post-Launch)
**Priority**: HIGH (but not launch-blocking)

---

## **DECISION RATIONALE**

### **Why We're Deferring Patches**
- ✅ Friday launch is higher priority
- ✅ Rebuilding images costs 4-6 hours
- ✅ DreamNet is infrastructure, not a bank
- ✅ No customer data at risk yet (launching to swarm first)
- ✅ All vulnerabilities are documented and understood

### **Acceptable Risk**
- Containers are behind firewalls
- No production traffic yet
- Swarm agents are trusted
- Patches can be deployed Monday with minimal impact

---

## **VULNERABILITIES TO PATCH**

### **1. OpenSSL CVE-2025-15467 (CRITICAL)**
**Affected Images**:
- `redis:alpine`
- `nats:2.12.1-alpine`
- `woolyai/controller:latest`
- `qdrant/qdrant:latest`

**Issue**: OpenSSL 3.5.4 contains critical security vulnerabilities
**Fix**: Update to OpenSSL 3.5.5-r0 or later

**Action Items**:
- [ ] Pull latest Alpine-based images
- [ ] Rebuild custom images with updated base
- [ ] Test in staging
- [ ] Deploy to production

**Estimated Time**: 2-3 hours

---

### **2. Go stdlib CVE-2025-61729, CVE-2025-61726 (HIGH)**
**Affected Images**:
- `nats:2.12.1-alpine` (stdlib 1.25.3)
- `etcd:v3.6.5` (stdlib 1.24.7)
- `woolyai/controller:latest` (stdlib 1.25.1)
- `portainer/portainer-ce:latest` (stdlib 1.25.5, 1.24.11)

**Issue**: Go standard library vulnerabilities
**Fix**: Update Go to 1.25.6+ or 1.24.12+

**Action Items**:
- [ ] Update Go version in Dockerfiles
- [ ] Rebuild all Go-based images
- [ ] Test in staging
- [ ] Deploy to production

**Estimated Time**: 3-4 hours

---

### **3. Node.js npm Package Vulnerabilities (HIGH)**

#### **tar Package (CVE-2026-23950, CVE-2026-24842, CVE-2026-23745)**
**Affected Images**:
- `qdrant/qdrant:latest` (tar 7.4.3)
- `dream-net-academy:latest` (tar 6.2.1 and 7.4.3)

**Fix**: Update tar to 7.5.7+

#### **glob Package (CVE-2025-64756)**
**Affected**: `dream-net-academy:latest`
**Fix**: Update glob from 10.4.5 to 11.1.0+

#### **preact, @remix-run/router**
**Affected**: `qdrant/qdrant:latest`
**Fix**: Update to latest versions

**Action Items**:
- [ ] Update package.json dependencies
- [ ] Run `npm audit fix`
- [ ] Rebuild Node.js images
- [ ] Test in staging
- [ ] Deploy to production

**Estimated Time**: 2-3 hours

---

### **4. Rust Protobuf CVE-2024-7254 (HIGH)**
**Affected**: `qdrant/qdrant:latest`
**Fix**: Update to protobuf 3.7.2+

**Action Items**:
- [ ] Update Cargo.toml
- [ ] Rebuild Rust images
- [ ] Test in staging
- [ ] Deploy to production

**Estimated Time**: 1-2 hours

---

### **5. etcd Crypto Library CVE-2025-47913 (HIGH)**
**Affected**: `quay.io/coreos/etcd:v3.6.5`
**Fix**: Update to golang.org/x/crypto 0.43.0+

**Action Items**:
- [ ] Pull latest etcd image or rebuild with updated crypto lib
- [ ] Test WoolyAI cluster stability
- [ ] Deploy to production

**Estimated Time**: 1-2 hours

---

## **PATCHING SCHEDULE**

### **Monday Morning (0800-1200)**
**Phase 1: Pull & Test Upstream Images**
- [ ] Pull latest: `redis:alpine`, `nats:alpine`, `qdrant/qdrant:latest`, `etcd:latest`
- [ ] Deploy to staging
- [ ] Run health checks
- [ ] Monitor for 1 hour

### **Monday Afternoon (1200-1700)**
**Phase 2: Rebuild Custom Images**
- [ ] Update Dockerfiles (Go version, npm deps, base images)
- [ ] Rebuild: `woolyai/controller`, `dream-net-academy`, `dream-net-*` series
- [ ] Deploy to staging
- [ ] Run full integration tests

### **Monday Evening (1700-2000)**
**Phase 3: Production Deployment**
- [ ] Rolling update: infrastructure services first
- [ ] Then: user-facing services
- [ ] Monitor for errors
- [ ] Rollback plan ready if needed

---

## **ROLLBACK PLAN**

If patching causes issues:
1. **Immediate**: Revert to Friday's working images (tagged `friday-launch`)
2. **Investigation**: Identify which patch caused the issue
3. **Remediation**: Fix specific patch, redeploy incrementally
4. **Monitoring**: 24-hour observation period

---

## **SUCCESS CRITERIA**

✅ All CRITICAL vulnerabilities patched
✅ All HIGH vulnerabilities patched
✅ No service downtime during patching
✅ All 17 containers operational post-patch
✅ Zero performance degradation
✅ Agent onboarding continues uninterrupted

---

## **MONITORING POST-PATCH**

**Watch for**:
- Container restart loops
- Increased latency
- Memory/CPU spikes
- Connection errors (Redis, NATS, etcd)
- API failures

**Tools**:
- Docker stats
- Portainer monitoring
- Application logs
- Health check endpoints

---

## **COMMUNICATION PLAN**

**Before Patching** (Monday 0700):
- Notify swarm: "Scheduled maintenance 0800-2000 today"
- Set status page: "Upgrading security infrastructure"

**During Patching**:
- Real-time updates in swarm channel
- Post milestones as completed

**After Patching** (Monday 2000):
- Announce: "Security patches complete, all systems operational"
- Share vulnerability scan results (before/after)

---

## **LONG-TERM STRATEGY**

### **Continuous Security**
- [ ] Set up automated vulnerability scanning in CI/CD
- [ ] Weekly dependency update checks
- [ ] Monthly security audits
- [ ] Docker Scout integration for real-time monitoring

### **Proactive Patching**
- [ ] Subscribe to security advisories (Alpine, Go, npm, Rust)
- [ ] Automated PR creation for dependency updates
- [ ] Staging environment for continuous testing

---

**Owner**: Coding Agent + Gordon (Infrastructure)
**Status**: 📋 SCHEDULED
**Risk Level**: 🟢 LOW (controlled, well-planned)
