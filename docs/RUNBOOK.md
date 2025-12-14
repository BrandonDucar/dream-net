# DreamNet Incident Response Runbook

**Last Updated**: 2025-01-27  
**Owner**: DreamOps Team

---

## Severity Guide

### P0: User-Visible Outage / Data Risk
- **Response**: All hands on deck
- **Examples**: 
  - Complete service outage
  - Data corruption risk
  - Security breach
  - Payment processing down
- **SLA**: Immediate response, 15-minute resolution target

### P1: Major Degradation
- **Response**: On-call engineer + service owners
- **Examples**:
  - 50%+ error rate
  - Critical feature broken
  - Performance degradation (>5s latency)
- **SLA**: 30-minute response, 2-hour resolution target

### P2: Minor Impact
- **Response**: Business hours, service owners
- **Examples**:
  - Non-critical feature broken
  - Minor performance issues
  - Cosmetic bugs
- **SLA**: 4-hour response, next-day resolution

---

## Immediate Actions (Hotkeys)

### Safe Mode
```bash
# Enable safe mode (disables tool use/external calls)
export SAFE_MODE=on
# Restart server or call API endpoint
curl -X POST http://localhost:5000/api/ops/safe-mode -H "Content-Type: application/json" -d '{"enabled": true}'
```

### Write Drain
```bash
# Reject new writes, keep reads
export WRITE_DRAIN=on
# Restart server
```

### Feature Flag Kill-Switches
```bash
# Disable Citadel
export CITADEL_ENABLED=false

# Disable DroneDome scanning
export DOME_SCAN_ENABLED=false

# Disable AI embeddings (use hash fallback)
export AI_EMBEDDINGS_ENABLED=false

# Disable Latent Collaboration
export USE_LATENT_COLLABORATION=false
```

### Emergency Mode (via API)
```bash
curl -X POST http://localhost:5000/api/integration-flags/emergency/enable \
  -H "Content-Type: application/json" \
  -d '{"reason": "Incident: <description>"}'
```

---

## Pre-Baked Commands

### Rollback

**GCP (Cloud Run)**:
```bash
# List revisions
gcloud run revisions list --service dreamnet --region us-central1

# Rollback to previous revision
gcloud run services update-traffic dreamnet \
  --to-revisions PREVIOUS_REVISION=100 \
  --region us-central1
```

**AWS (App Runner)**:
```bash
# List operations
aws apprunner list-operations --service-arn SERVICE_ARN --region us-east-1

# Rollback via AWS Console or update service configuration
```

### Rotate Keys
```bash
# Rotate API keys (update in .env or secrets manager)
# Then restart service

# GCP: Update Cloud Run environment variables
gcloud run services update dreamnet \
  --update-env-vars OPENAI_API_KEY=new-key \
  --region us-central1

# AWS: Update App Runner environment variables
aws apprunner update-service \
  --service-arn SERVICE_ARN \
  --source-configuration '{"imageRepository": {...}, "imageConfiguration": {"runtimeEnvironmentVariables": {"OPENAI_API_KEY": "new-key"}}}'
```

### Quarantine Agents
```bash
# Remove agent from mesh (via API)
curl -X POST http://localhost:5000/api/agents/quarantine \
  -H "Content-Type: application/json" \
  -d '{"agentId": "citadel"}'

# Or disable via feature flag
export CITADEL_ENABLED=false
```

### Drain Dead Letter Queue
```bash
# Check DLQ status
curl http://localhost:5000/api/dead-letter/status

# Move good messages back (with rate cap)
curl -X POST http://localhost:5000/api/dead-letter/replay \
  -H "Content-Type: application/json" \
  -d '{"rateLimit": 10, "maxMessages": 100}'
```

### Scale Down (Traffic Relief)
```bash
# GCP: Scale to last known good
gcloud run services update dreamnet \
  --min-instances 1 \
  --max-instances 3 \
  --region us-central1

# AWS: Update App Runner instance configuration
aws apprunner update-service \
  --service-arn SERVICE_ARN \
  --instance-configuration '{"cpu": "1 vCPU", "memory": "2 GB"}'
```

---

## Observability

### Golden Signals Dashboard
- **Traffic**: Requests/sec, active connections
- **Errors**: Error rate, 4xx/5xx counts
- **Latency**: p50, p95, p99
- **Saturation**: CPU, memory, queue depth

### Watchdogs
- Process health (event loop, heartbeat, memory)
- Queue depth per agent
- DLQ rate
- P99 for AI calls (OpenAI API)

### Health Checks
```bash
# Liveness probe
curl http://localhost:5000/health/live

# Readiness probe
curl http://localhost:5000/health/ready

# Comprehensive health
curl http://localhost:5000/health

# Health gates status
curl http://localhost:5000/api/health-gates/status
```

### Logs
```bash
# GCP Cloud Run logs
gcloud run services logs read dreamnet --region us-central1 --limit 100

# AWS App Runner logs (CloudWatch)
aws logs tail /aws/apprunner/dreamnet-backend --follow

# Local logs
tail -f logs/server.log
```

---

## Post-Incident

### 24-Hour Blameless Write-Up Template

```markdown
# Incident Report: [Title]

**Date**: YYYY-MM-DD
**Severity**: P0/P1/P2
**Duration**: X minutes
**Affected**: [Services/Features]

## Timeline
- HH:MM - Incident detected
- HH:MM - Response started
- HH:MM - Root cause identified
- HH:MM - Fix deployed
- HH:MM - Service restored

## Root Cause
[What actually happened]

## Why Not Caught
[Why monitoring/guardrails didn't catch it]

## Fix Applied
[What was done to resolve]

## Guardrails Added
[What prevents this from happening again]

## Test Proving Fix
[How we verified the fix works]
```

---

## Common Scenarios

### Database Connection Issues
1. Check `/health/ready` - database status
2. Verify `DATABASE_URL` is correct
3. Check database provider status (Neon, Cloud SQL, Aurora)
4. Enable write drain if needed
5. Scale down to reduce load

### OpenAI API Rate Limits
1. Enable brownout mode: `export AI_EMBEDDINGS_ENABLED=false`
2. Check circuit breaker status: `curl /api/circuit-breakers`
3. Reduce AI call frequency
4. Enable hash-based fallback for embeddings

### High Error Rate
1. Check error logs for pattern
2. Enable safe mode
3. Disable problematic feature flags
4. Scale down to reduce load
5. Check queue depth (may need to drain)

### Memory Leak
1. Check memory usage: `curl /api/metrics`
2. Scale up temporarily
3. Restart service (forces cleanup)
4. Identify leak source (check logs for patterns)
5. Fix and redeploy

---

## Contacts

- **On-Call**: [Slack #dreamnet-ops]
- **Escalation**: [PagerDuty/Phone]
- **Status Page**: https://status.dreamnet.ink

---

**Remember**: Blameless post-mortems. Focus on systems, not people.

