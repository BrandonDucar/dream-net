# DreamNet Health Checks Specification

**Last Updated**: 2025-01-27

---

## Health Check Endpoints

### `/health/live` - Liveness Probe
**Purpose**: Is the process running?  
**Used By**: Kubernetes/Docker to determine if container should be restarted  
**Response Time**: <100ms (no external dependencies)  
**Expected**: `200 OK` with `{"status": "alive", "uptime": ...}`

**Failure Mode**: Process is stuck or crashed → container restart

---

### `/health/ready` - Readiness Probe
**Purpose**: Can the service accept traffic?  
**Used By**: Load balancer to route traffic  
**Response Time**: <2s (includes DB check)  
**Expected**: `200 OK` with `{"ready": true, "checks": {...}}`

**Checks**:
- Database connectivity (if `DATABASE_URL` configured)
- Environment variables
- Disk space (basic check)

**Failure Mode**: Service not ready → traffic not routed here

---

### `/health` - Comprehensive Health Check
**Purpose**: Full system health status  
**Used By**: Monitoring dashboards, ops team  
**Response Time**: <5s  
**Expected**: `200 OK` with detailed status

**Includes**:
- Database status
- Security middleware status
- Middleware stats (rate limiting, idempotency, audit)
- Entitlements system status
- Schema version

---

## Health Gates

### Database Gate
**Service ID**: `database`  
**Critical**: Yes  
**Check**: `SELECT 1` query  
**Timeout**: 1s  
**Required Passes**: 3 consecutive  
**Expected Response**: <500ms

**Failure**: Database unavailable → service not ready

---

### DAG Gate
**Service ID**: `startup-dag`  
**Critical**: Yes  
**Check**: Are all critical services initialized?  
**Timeout**: 5s  
**Required Passes**: 3 consecutive

**Failure**: Critical service failed to start → service not ready

---

### Event Bus Gate
**Service ID**: `event-bus`  
**Critical**: No  
**Check**: Event bus connectivity  
**Timeout**: 2s  
**Required Passes**: 2 consecutive

**Failure**: Non-critical, service can still accept traffic

---

## Service-Specific Health Checks

### Neural Mesh
**Endpoint**: Internal status check  
**Expected**: `{synapses: {count: N}, memory: {count: M}}`  
**Timeout**: 3s  
**Failure Mode**: Degraded memory features, but service continues

---

### Agent Wallet Manager
**Endpoint**: Internal status check  
**Expected**: Wallet registry accessible  
**Timeout**: 2s  
**Failure Mode**: Agent wallet operations unavailable

---

### Latent Collaboration
**Endpoint**: Internal status check  
**Expected**: Latent encoding available (or hash fallback)  
**Timeout**: 5s  
**Failure Mode**: Falls back to hash-based encoding

---

## Expected Response Times

| Service | p50 | p95 | p99 |
|---------|-----|-----|-----|
| `/health/live` | <50ms | <100ms | <200ms |
| `/health/ready` | <500ms | <1s | <2s |
| `/health` | <1s | <3s | <5s |
| Database check | <200ms | <500ms | <1s |

---

## Failure Modes

### Database Unavailable
- **Symptom**: `/health/ready` returns `503`
- **Impact**: Service cannot accept traffic
- **Recovery**: Fix database connection, wait for 3 consecutive passes

### High Latency
- **Symptom**: Health checks timeout (>5s)
- **Impact**: Service marked unhealthy
- **Recovery**: Reduce load, check for bottlenecks

### Memory Pressure
- **Symptom**: Process memory >80%
- **Impact**: Service may be killed by OOM killer
- **Recovery**: Scale up, identify memory leak

### Circuit Breaker Open
- **Symptom**: External API calls failing
- **Impact**: Features using that API unavailable
- **Recovery**: Wait for reset timeout, or manually reset

---

## Monitoring

### Metrics to Watch
- Health check success rate (should be >99%)
- Health check latency (p95 <2s)
- Service readiness percentage (should be >99.9%)
- Circuit breaker open events

### Alerts
- **P0**: `/health/ready` failing for >1 minute
- **P1**: Health check latency >5s for >5 minutes
- **P2**: Circuit breaker opened

---

## Testing

### Manual Health Check Test
```bash
# Liveness
curl http://localhost:5000/health/live

# Readiness
curl http://localhost:5000/health/ready

# Comprehensive
curl http://localhost:5000/health
```

### Load Test Health Checks
```bash
# Simulate load balancer checks (every 5s)
while true; do
  curl -s http://localhost:5000/health/ready | jq '.ready'
  sleep 5
done
```

---

**Note**: Health checks should never depend on optional subsystems. Core health checks must work even if `INIT_SUBSYSTEMS=false`.

