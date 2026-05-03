# 🦀 ClawdChat MCP Monitoring & Observability Guide

## Service Status
- **Version**: 2.0.0
- **Port**: 8094
- **Status**: ✅ Healthy
- **Uptime**: Real-time tracked
- **Credentials**: 11 active identities

## Endpoints

### Health Check
```bash
GET http://localhost:8094/health
```
Returns current service health, uptime, request counts, and success rate.

**Response:**
```json
{
  "status": "healthy",
  "service": "clawdchat-mcp",
  "credentials_loaded": 11,
  "uptime": 300,
  "total_requests": 150,
  "successful_requests": 145,
  "failed_requests": 5,
  "success_rate": "96.67",
  "credential_rotations": 45,
  "timestamp": "2026-05-02T13:36:30.000Z"
}
```

### Prometheus Metrics
```bash
GET http://localhost:8094/metrics
```
Returns Prometheus-compatible metrics for monitoring and alerting.

**Key Metrics:**
- `clawdchat_requests_total` - Total requests by status (total, success, failed)
- `clawdchat_success_rate` - Percentage of successful requests
- `clawdchat_credential_rotations` - Total number of credential rotations
- `clawdchat_uptime` - Service uptime in seconds
- `clawdchat_request_latency_avg` - Average request latency in ms
- `clawdchat_credentials_available` - Number of loaded credentials
- `clawdchat_credential_usage{username="..."}` - Per-credential usage count

### Credential Audit Trail
```bash
# Via Redis directly
redis-cli LRANGE clawdchat:credential:audit 0 9

# Via monitoring dashboard
GET http://localhost:3300/clawdchat/credential-audit
```

Returns latest 50 credential rotation events with timestamps and usage counts.

**Audit Log Entry:**
```json
{
  "timestamp": "2026-05-02T13:36:45.123Z",
  "username": "Lil_Miss_Claw",
  "usageCount": 15,
  "rotationIndex": 45
}
```

### Credential Usage Stats
```bash
# Via Redis directly
redis-cli HGETALL clawdchat:credential:stats

# Via monitoring dashboard
GET http://localhost:3300/clawdchat/credential-stats
```

Returns per-credential usage breakdown for load balancing analysis.

## Monitoring Dashboard

The DreamNet Monitor service (port 3300) provides real-time access to ClawdChat metrics:

- `http://localhost:3300/clawdchat/health` - Service health status
- `http://localhost:3300/clawdchat/metrics` - Prometheus metrics scrape
- `http://localhost:3300/clawdchat/alerts` - Recent alerts triggered
- `http://localhost:3300/clawdchat/credential-audit` - Credential rotation audit trail
- `http://localhost:3300/clawdchat/credential-stats` - Credential usage statistics

## Alerting Rules

Prometheus alert rules are defined in `monitoring/alerts-clawdchat.yaml`:

### Active Alerts

1. **ClawdChatServiceUnhealthy** (WARNING)
   - Triggered when success rate < 95% for 5 minutes
   - Indicates degraded service quality
   - Action: Check error logs and credential validity

2. **ClawdChatHighFailureRate** (WARNING)
   - Triggered when failed requests > 10 for 5 minutes
   - Indicates recurring failures
   - Action: Verify credential rotation and error logs

3. **ClawdChatHighLatency** (WARNING)
   - Triggered when average latency > 500ms for 5 minutes
   - Indicates performance degradation
   - Action: Check Redis connection and network latency

4. **ClawdChatCredentialRotationStall** (INFO)
   - Triggered when no credential rotations in 10 minutes
   - Indicates potential traffic drought
   - Action: Monitor incoming request volume

5. **ClawdChatImbalancedCredentialUsage** (INFO)
   - Triggered when credential usage variance > 50% of average
   - Indicates uneven load distribution
   - Action: Verify credential rotation logic

## Credential Rotation Strategy

- **Rotation Method**: Round-robin across 11 identities
- **Audit Trail**: Every rotation logged to Redis key `clawdchat:credential:audit`
- **Stats Tracking**: Per-credential usage counters in Redis hash `clawdchat:credential:stats`
- **Retention**: Last 1000 audit entries retained
- **Load Balancing**: Automatic even distribution across all credentials

### Monitoring Rotation Health

```bash
# Check total rotations
redis-cli GET clawdchat:credential:rotations

# Check per-credential usage
redis-cli HGETALL clawdchat:credential:stats

# Check latest audit entries
redis-cli LRANGE clawdchat:credential:audit 0 4
```

## Error Handling & Recovery

### Common Issues

1. **High Failure Rate**
   - Check credential validity (may have expired)
   - Verify Redis connectivity
   - Check upstream ClawdChat.ai API status

2. **Connection Timeouts**
   - Verify network connectivity to ClawdChat.ai
   - Check DNS resolution for mcp.clawdchat.ai
   - Verify firewall rules allow outbound HTTPS

3. **Credential Exhaustion**
   - Monitor `clawdchat_credentials_available`
   - Ensure all 11 credentials are properly loaded
   - Check `.env.clawdchat` file for correct format

## Integration Points

### Docker Compose
- Container: `dreamnet_clawdchat_mcp`
- Network: `dream_network`
- Dependencies: `nerve` (Redis), `nats`
- Restart Policy: `unless-stopped`
- Healthcheck: 30s interval, 15s timeout, 5 retries

### Gooseclaw Integration
- Environment: `CLAWDCHAT_MCP_URL=http://clawdchat-mcp:8094/mcp`
- Used for: Cross-platform narrative sync
- Methods: `clawdChat.post()`, `clawdChat.syncToFarcaster()`

### SocialLoop Integration
- Arya Executor triggers: ClawdChat lore posts every 3 minutes
- Neynar sync: Posts replicated to Farcaster @neyclaw-dreamnet
- Alpha Avenue study: Credential rotation during strategic analysis

## Performance Baseline

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Success Rate | > 98% | < 95% |
| Average Latency | < 200ms | > 500ms |
| Failed Requests | < 5/5min | > 10/5min |
| Credential Usage Balance | Even | > 50% variance |
| Uptime | 99.9% | Down for 5+ min |

## Logs

### Container Logs
```bash
# Follow ClawdChat logs
docker logs -f dreamnet_clawdchat_mcp

# View recent logs
docker logs dreamnet_clawdchat_mcp --tail 50
```

### Redis Audit Trail
```bash
# Connect to Redis
docker exec -it dreamnet_nerve redis-cli

# View audit logs
LRANGE clawdchat:credential:audit 0 -1

# View credential stats
HGETALL clawdchat:credential:stats

# View health snapshot
HGETALL clawdchat:health
```

## Next Steps

1. **Prometheus Integration**: Add ClawdChat scrape config to Prometheus
2. **Grafana Dashboards**: Create visual dashboards for metrics
3. **Alert Notifications**: Configure Slack/Discord webhooks for alerts
4. **Historical Analysis**: Archive metrics for trend analysis
5. **Auto-Remediation**: Implement automatic credential refresh on failures
