# DreamNet - Needs Fixing / Upgrades / Integration Issues

**Last Updated**: 2025-01-27  
**Status**: Active tracking document

---

## 🔴 CRITICAL - Fix Immediately

### 1. Fiber-Optic Middleware Not Integrated
**WHERE**: `server/index.ts` lines 1225-1249 (commented out)  
**ISSUE**: Nerve Fiber Event Fabric initialization is commented out  
**IMPACT**: Fiber-optic middleware system exists but not active  
**DIRECTION**: Uncomment initialization, add Express middleware bridge  
**REF**: `docs/FIBER_OPTIC_MIDDLEWARE_AUDIT.md`

### 2. Missing Express Middleware Bridge
**WHERE**: `packages/internal-ports/`, `packages/internal-router/`  
**ISSUE**: No middleware to convert HTTP requests → DreamPackets → Laser Router  
**IMPACT**: Fiber-optic system can't route HTTP requests  
**DIRECTION**: Create Express middleware that wraps requests in DreamPackets  
**REF**: `docs/FIBER_OPTIC_SUMMARY.md`

### 3. Port Handlers Are Placeholders
**WHERE**: `packages/internal-ports/src/ports.ts`  
**ISSUE**: Port handlers are placeholder functions, not wired to subsystems  
**IMPACT**: Ports registered but don't actually do anything  
**DIRECTION**: Wire port handlers to actual subsystem implementations  
**REF**: `docs/FIBER_OPTIC_MIDDLEWARE_AUDIT.md`

---

## 🟡 HIGH PRIORITY - Fix Soon

### 4. Circuit Breaker Integration Incomplete
**WHERE**: Only 2 places use circuit breakers (`latent-collaboration`, `db-circuit-breaker`)  
**ISSUE**: External API calls not wrapped in circuit breakers  
**IMPACT**: Cascading failures possible  
**DIRECTION**: Wrap all external API calls (OpenAI, Google, etc.) with circuit breakers  
**REF**: `docs/CODEBASE_ANALYSIS_CRITICAL_ISSUES.md`

### 5. Health Gates Not Used
**WHERE**: `server/core/health-gates.ts` exists but not integrated  
**ISSUE**: Health gates exist but `/ready` endpoint doesn't use them  
**IMPACT**: Server may accept traffic when critical services are down  
**DIRECTION**: Integrate health gates into `/ready` endpoint  
**REF**: `docs/CODEBASE_ANALYSIS_CRITICAL_ISSUES.md`

### 6. Idempotency Key Cleanup Missing
**WHERE**: `server/middleware/idempotency.ts`  
**ISSUE**: Idempotency keys stored in-memory, never cleaned up  
**IMPACT**: Memory leak possible  
**DIRECTION**: Add TTL cleanup or use Redis for production  
**REF**: `docs/CODEBASE_ANALYSIS_CRITICAL_ISSUES.md`

### 7. Metrics Middleware Optional
**WHERE**: `server/index.ts` - metrics middleware wrapped in try-catch  
**ISSUE**: Metrics can fail silently  
**IMPACT**: Missing observability data  
**DIRECTION**: Make metrics middleware required, fail fast if missing  
**REF**: `docs/CODEBASE_ANALYSIS_CRITICAL_ISSUES.md`

### 8. Media Vault Routes Disabled
**WHERE**: `server/routes/media.ts`, `server/routes/poster.ts`  
**ISSUE**: Routes disabled because `@dreamnet/media-vault` missing  
**IMPACT**: Media functionality unavailable  
**DIRECTION**: Create `@dreamnet/media-vault` package or remove routes  
**REF**: `docs/SERVER_ROUTES_MAP.md`

---

## 🟢 MEDIUM PRIORITY - Fix Next

### 9. Spine Systems Are Scaffolding
**WHERE**: `spine/` directory  
**ISSUE**: Multiple spine systems have placeholder implementations  
**IMPACT**: Features not functional  
**DIRECTION**: Implement actual logic (Antigravity task)  
**REF**: `docs/SPINE_SYSTEMS_COMPLETE.md`

### 10. ResearchHub Integration Mock
**WHERE**: `packages/researchhub-core/`  
**ISSUE**: Has mock structure, needs actual API integration  
**IMPACT**: ResearchHub features not functional  
**DIRECTION**: Integrate with ResearchHub API  
**REF**: `docs/INTEGRATIONS_COMPLETE.md`

### 11. Store Persistence Strategy Unclear
**WHERE**: All `*Store.ts` files  
**ISSUE**: Some stores are in-memory, persistence strategy unclear  
**IMPACT**: Data lost on restart  
**DIRECTION**: Document persistence strategy, implement database persistence  
**REF**: `docs/UNDERSTANDING_ASSESSMENT.md`

### 12. Scheduler Logic Not Documented
**WHERE**: All `*Scheduler.ts` files  
**ISSUE**: Scheduler cycle logic not fully understood  
**IMPACT**: Hard to debug subsystem cycles  
**DIRECTION**: Document scheduler logic, understand cycle coordination  
**REF**: `docs/UNDERSTANDING_ASSESSMENT.md`

### 13. Subsystem Run Methods Not Deeply Understood
**WHERE**: All `run()` methods in subsystems  
**ISSUE**: Actual processing logic not fully documented  
**IMPACT**: Hard to understand what subsystems actually do  
**DIRECTION**: Deep dive into run() implementations  
**REF**: `docs/UNDERSTANDING_ASSESSMENT.md`

### 14. Algorithm Details Missing
**WHERE**: Various algorithm files (Dream Cortex, QAL, Squad Alchemy, etc.)  
**ISSUE**: Algorithms not fully understood  
**IMPACT**: Hard to optimize or debug  
**DIRECTION**: Document algorithm logic, mathematical models  
**REF**: `docs/UNDERSTANDING_ASSESSMENT.md`

---

## 🔵 LOW PRIORITY - Nice to Have

### 15. TypeScript Types Incomplete
**WHERE**: Various packages  
**ISSUE**: Some packages use `any` types  
**IMPACT**: Reduced type safety  
**DIRECTION**: Add proper type definitions  
**REF**: `docs/CODEBASE_ANALYSIS_CRITICAL_ISSUES.md`

### 16. Test Coverage Limited
**WHERE**: No test directory structure evident  
**ISSUE**: Limited test coverage  
**IMPACT**: Bugs not caught before production  
**DIRECTION**: Add test suite  
**REF**: `docs/CODEBASE_ANALYSIS_CRITICAL_ISSUES.md`

### 17. API Documentation Missing
**WHERE**: API routes  
**ISSUE**: No comprehensive API documentation  
**IMPACT**: Hard to use API  
**DIRECTION**: Generate API docs  
**REF**: `docs/CODEBASE_ANALYSIS_CRITICAL_ISSUES.md`

### 18. Deployment Guides Incomplete
**WHERE**: Deployment documentation  
**ISSUE**: Some deployment scenarios not documented  
**IMPACT**: Hard to deploy  
**DIRECTION**: Complete deployment guides  
**REF**: `docs/CODEBASE_ANALYSIS_CRITICAL_ISSUES.md`

---

## 📋 Integration Status Issues

### 19. Packages Marked "Needs Exploration"
**WHERE**: `docs/INTEGRATIONS_COMPLETE.md`  
**ISSUE**: Many packages marked as needing exploration  
**IMPACT**: Unknown integration status  
**DIRECTION**: Explore and document these packages  
**REF**: `docs/INTEGRATIONS_COMPLETE.md` lines 1668, 1745

### 20. Routes Marked "Needs Exploration"
**WHERE**: `docs/SERVER_ROUTES_CRITICAL.md`  
**ISSUE**: Some routes are placeholders or minimal  
**IMPACT**: Unknown functionality  
**DIRECTION**: Explore and document these routes  
**REF**: `docs/SERVER_ROUTES_CRITICAL.md`

---

## 🔧 Infrastructure Issues

### 21. Database Connection Health Check
**WHERE**: `server/core/startup-dag.ts`  
**ISSUE**: Database health check may not be robust  
**IMPACT**: Server may start with broken DB connection  
**DIRECTION**: Improve database health check  
**REF**: `docs/CODEBASE_ANALYSIS_CRITICAL_ISSUES.md`

### 22. Error Handling Inconsistent
**WHERE**: Various route handlers  
**ISSUE**: Some routes lack proper error handling  
**IMPACT**: Poor UX, hard to debug  
**DIRECTION**: Standardize error handling  
**REF**: `docs/CODEBASE_ANALYSIS_CRITICAL_ISSUES.md`

### 23. Observability Integration Missing
**WHERE**: Observability routes exist but not fully integrated  
**ISSUE**: Golden signals, health gates, circuit breakers not exposed  
**IMPACT**: Hard to debug production issues  
**DIRECTION**: Integrate observability endpoints  
**REF**: `docs/CODEBASE_ANALYSIS_CRITICAL_ISSUES.md`

---

## 📝 Documentation Gaps

### 24. Understanding Assessment Shows Gaps
**WHERE**: `docs/UNDERSTANDING_ASSESSMENT.md`  
**ISSUE**: Deep implementation details not fully understood  
**IMPACT**: Hard to maintain/extend system  
**DIRECTION**: Continue deep exploration of schedulers, stores, run methods  
**REF**: `docs/UNDERSTANDING_ASSESSMENT.md`

### 25. Cohesive Workflow Documentation
**WHERE**: `docs/COHESIVE_WORKFLOW_IMPLEMENTATION.md`  
**ISSUE**: Workflow documentation exists but may need updates  
**IMPACT**: Hard to understand system flow  
**DIRECTION**: Review and update workflow docs  
**REF**: `docs/COHESIVE_WORKFLOW_IMPLEMENTATION.md`

---

## 🎯 Priority Summary

**Immediate (This Week)**:
- Fix fiber-optic middleware integration (#1-3)
- Add circuit breaker integration (#4)
- Integrate health gates (#5)

**Soon (Next Week)**:
- Fix idempotency cleanup (#6)
- Make metrics required (#7)
- Fix media vault routes (#8)

**Next Sprint**:
- Implement spine systems (#9)
- Complete ResearchHub integration (#10)
- Document persistence strategy (#11)

**Backlog**:
- Everything else (#12-25)

---

## 📌 Notes

- **Keep Moving**: Document issues here, leave brief notes, continue exploration
- **Don't Block**: Don't let issues block documentation/exploration work
- **Track Progress**: Update status as issues are fixed
- **Reference Docs**: Each issue references relevant documentation

---

**Last Scanned**: 2025-01-27  
**Total Issues**: 25  
**Critical**: 3  
**High Priority**: 5  
**Medium Priority**: 8  
**Low Priority**: 9

