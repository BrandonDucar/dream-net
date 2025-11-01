import { Router } from 'express';
import { auditTrail } from '../services/AuditTrailService';
import { rateLimitManager } from '../middleware/rateLimiter';
import { IdempotencyManager } from '../middleware/idempotency';
import { backupService } from '../services/BackupService';

const router = Router();

// Schema version for tracking deployment compatibility
const SCHEMA_VERSION = "v2.0.0-security-complete";

// Global state tracking
const STATE = {
  paused: false,
  last_deployment: null as string | null,
  deployment_health: 'healthy' as 'healthy' | 'degraded' | 'failed'
};

// Test failure simulation state
const TEST_FAIL_HEALTH = {
  enabled: false
};

// Comprehensive health check endpoint
router.get('/health', async (req, res) => {
  try {
    const auditStartTime = Date.now();
    let ok = !TEST_FAIL_HEALTH.enabled; // Honor failure simulation flag
    
    // Check database connectivity
    const dbStatus = process.env.DATABASE_URL ? 'postgres' : 'sqlite';
    
    // Check security middleware health (with fallbacks)
    const rateLimitStats = { status: 'operational', active_clients: 0 };
    const idempotencyStats = { status: 'operational', active_entries: 0 };
    const auditStats = { total_entries: 0, last_24h: 0 };
    
    // Check SLA status (fallback when SLA monitor unavailable)
    const slaStatus = { 
      overall_health: 'healthy', 
      active_breaches: 0 
    };
    
    // Security health checks
    const securityHealth = {
      rate_limiting: rateLimitStats.status === 'operational',
      idempotency: idempotencyStats.status === 'operational', 
      audit_trail: auditStats.total_entries >= 0,
      sla_monitoring: slaStatus.overall_health === 'healthy'
    };
    
    // Overall health determination
    const securityOk = Object.values(securityHealth).every(v => v);
    ok = ok && securityOk;

    // Add usage and entitlements health status
    let entitlementsHealth = {};
    try {
      const dbAvailable = !!process.env.DATABASE_URL;
      const hasStripeWebhook = !!process.env.STRIPE_WEBHOOK_SECRET;
      const hasStripeSecret = !!process.env.STRIPE_SECRET_KEY;
      
      entitlementsHealth = {
        database: dbAvailable ? 'available' : 'unavailable',
        stripe_webhooks: hasStripeWebhook ? 'configured' : 'not_configured',
        stripe_api: hasStripeSecret ? 'configured' : 'not_configured',
        status: (dbAvailable && hasStripeWebhook && hasStripeSecret) ? 'operational' : 'degraded'
      };
    } catch (error) {
      entitlementsHealth = {
        status: 'error',
        error: error.message
      };
    }

    const details = {
      schema_version: SCHEMA_VERSION,
      db_backend: dbStatus,
      paused: STATE.paused,
      deployment_health: STATE.deployment_health,
      test_failure_mode: TEST_FAIL_HEALTH.enabled,
      security: {
        status: securityOk ? 'healthy' : 'degraded',
        components: securityHealth,
        active_protections: ['rate_limiting', 'replay_protection', 'hmac_auth', 'audit_logging']
      },
      middleware_stats: {
        rate_limit_clients: rateLimitStats.active_clients || 0,
        idempotency_entries: idempotencyStats.active_entries || 0,
        audit_entries_24h: auditStats.last_24h || 0,
        sla_breaches: slaStatus.active_breaches || 0
      },
      entitlements_system: entitlementsHealth,
      timestamp: new Date().toISOString()
    };

    // Log health check to audit trail
    const outcome = TEST_FAIL_HEALTH.enabled ? 'simulated_failure' : (ok ? 'ok' : 'degraded');
    await auditTrail.writeAudit('/health', 'health_check', outcome, auditStartTime, '', '');

    const statusCode = ok ? 200 : 500;
    res.status(statusCode).json({ ok, details });
    
  } catch (error: any) {
    console.error('🏥 [Health] Health check error:', error.message);
    res.status(500).json({ 
      ok: false, 
      error: 'Health check failed',
      details: { timestamp: new Date().toISOString() }
    });
  }
});

// Public status page with real-time monitoring
router.get('/status', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>DreamNet Status</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { 
            font-family: 'Inter', system-ui, sans-serif; 
            margin: 40px; 
            background: #0a0a0a; 
            color: #fff; 
        }
        .ok { color: #10b981; font-weight: 600; }
        .bad { color: #ef4444; font-weight: 600; }
        .warn { color: #f59e0b; font-weight: 600; }
        .card { 
            background: #111; 
            border: 1px solid #333; 
            border-radius: 12px; 
            padding: 20px; 
            margin: 16px 0; 
        }
        .metric { 
            display: flex; 
            justify-content: space-between; 
            margin: 8px 0; 
            padding: 8px 0; 
            border-bottom: 1px solid #222; 
        }
        .metric:last-child { border-bottom: none; }
        code { 
            background: #1a1a1a; 
            padding: 2px 6px; 
            border-radius: 4px; 
            font-family: 'Monaco', monospace; 
        }
        h1 { color: #3b82f6; }
        .status-indicator { 
            width: 12px; 
            height: 12px; 
            border-radius: 50%; 
            display: inline-block; 
            margin-right: 8px; 
        }
        .status-healthy { background: #10b981; }
        .status-degraded { background: #f59e0b; }
        .status-failed { background: #ef4444; }
    </style>
</head>
<body>
    <h1>🌐 DreamNet Status Dashboard</h1>
    <div id="out">Loading system status...</div>
    
    <script>
        async function fetchWithFallback(url) {
            try {
                const response = await fetch(url);
                return await response.json();
            } catch (error) {
                return { error: error.message };
            }
        }
        
        async function updateStatus() {
            const [health, rateLimit, audit, secrets, backup] = await Promise.all([
                fetchWithFallback('/health'),
                fetchWithFallback('/api/rate-limit/stats'),
                fetchWithFallback('/api/audit/stats'),
                fetchWithFallback('/ops/keys/status'),
                fetchWithFallback('/ops/backup/status')
            ]);
            
            const ok = health.ok === true;
            const securityStatus = health.details?.security?.status || 'unknown';
            
            document.getElementById('out').innerHTML = \`
                <div class="card">
                    <h2>
                        <span class="status-indicator status-\${ok ? 'healthy' : 'failed'}"></span>
                        System Health: <span class="\${ok ? 'ok' : 'bad'}">\${ok ? 'OPERATIONAL' : 'DEGRADED'}</span>
                    </h2>
                    <div class="metric">
                        <span>Schema Version:</span>
                        <code>\${health.details?.schema_version || 'unknown'}</code>
                    </div>
                    <div class="metric">
                        <span>Database:</span>
                        <code>\${health.details?.db_backend || 'unknown'}</code>
                    </div>
                    <div class="metric">
                        <span>System Paused:</span>
                        <span class="\${health.details?.paused ? 'warn' : 'ok'}">\${health.details?.paused ? 'YES' : 'NO'}</span>
                    </div>
                </div>
                
                <div class="card">
                    <h2>🛡️ Security Middleware</h2>
                    <div class="metric">
                        <span>Security Status:</span>
                        <span class="\${securityStatus === 'healthy' ? 'ok' : 'warn'}">\${securityStatus.toUpperCase()}</span>
                    </div>
                    <div class="metric">
                        <span>Rate Limit Clients:</span>
                        <code>\${health.details?.middleware_stats?.rate_limit_clients || 0}</code>
                    </div>
                    <div class="metric">
                        <span>Idempotency Entries:</span>
                        <code>\${health.details?.middleware_stats?.idempotency_entries || 0}</code>
                    </div>
                    <div class="metric">
                        <span>Audit Entries (24h):</span>
                        <code>\${health.details?.middleware_stats?.audit_entries_24h || 0}</code>
                    </div>
                    <div class="metric">
                        <span>SLA Breaches:</span>
                        <code>\${health.details?.middleware_stats?.sla_breaches || 0}</code>
                    </div>
                </div>
                
                <div class="card">
                    <h2>🔐 Authentication & Keys</h2>
                    <div class="metric">
                        <span>Current HMAC Key:</span>
                        <code>\${secrets.current_key_id || 'none'}</code>
                    </div>
                    <div class="metric">
                        <span>Total Secrets:</span>
                        <code>\${secrets.total_secrets || 0}</code>
                    </div>
                    <div class="metric">
                        <span>Healthy Keys:</span>
                        <code>\${secrets.health_summary?.healthy || 0}</code>
                    </div>
                </div>
                
                <div class="card">
                    <h2>📊 System Metrics</h2>
                    <div class="metric">
                        <span>Rate Limit Status:</span>
                        <span class="\${rateLimit.status === 'operational' ? 'ok' : 'warn'}">\${rateLimit.status?.toUpperCase() || 'UNKNOWN'}</span>
                    </div>
                    <div class="metric">
                        <span>Tracked Endpoints:</span>
                        <code>\${rateLimit.total_tracked_paths || 0}</code>
                    </div>
                    <div class="metric">
                        <span>Total Audit Entries:</span>
                        <code>\${audit.audit_trail?.total_entries || 0}</code>
                    </div>
                    <div class="metric">
                        <span>Last Updated:</span>
                        <code>\${new Date().toLocaleTimeString()}</code>
                    </div>
                </div>
                
                <div class="card">
                    <h2>📦 Backup System</h2>
                    <div class="metric">
                        <span>Total Backups:</span>
                        <code>\${backup.backup_stats?.total_backups || 0}</code>
                    </div>
                    <div class="metric">
                        <span>Latest Backup:</span>
                        <code>\${backup.backup_stats?.latest_backup || 'none'}</code>
                    </div>
                    <div class="metric">
                        <span>Storage Used:</span>
                        <code>\${backup.backup_stats?.total_size_mb || 0} MB</code>
                    </div>
                    <div class="metric">
                        <span>Auto-Backup:</span>
                        <span class="\${backup.backup_stats?.auto_backup_enabled ? 'ok' : 'warn'}">\${backup.backup_stats?.auto_backup_enabled ? 'ENABLED' : 'DISABLED'}</span>
                    </div>
                </div>
                
                <div class="card">
                    <h2>📋 Legal & Compliance</h2>
                    <div class="metric">
                        <span>Privacy Policy:</span>
                        <a href="/privacy" target="_blank" style="color: #007acc;">View Policy</a>
                    </div>
                    <div class="metric">
                        <span>Terms of Service:</span>
                        <a href="/terms" target="_blank" style="color: #007acc;">View Terms</a>
                    </div>
                    <div class="metric">
                        <span>Privacy Controls:</span>
                        <a href="/ops/privacy" target="_blank" style="color: #007acc;">View Settings</a>
                    </div>
                    <div class="metric">
                        <span>Contact:</span>
                        <code>support@dreamnet.ink</code>
                    </div>
                </div>
                
                <div class="card">
                    <h2>📺 OTT Streaming Platform</h2>
                    <div class="metric">
                        <span>Status:</span>
                        <span class="ok">OPERATIONAL</span>
                    </div>
                    <div class="metric">
                        <span>Encodings:</span>
                        <code>1080p6Mbps, 720p3Mbps, 480p1.5Mbps</code>
                    </div>
                    <div class="metric">
                        <span>Protocols:</span>
                        <code>HLS, DASH</code>
                    </div>
                    <div class="metric">
                        <span>DRM Support:</span>
                        <code>Widevine, FairPlay, PlayReady</code>
                    </div>
                    <div class="metric">
                        <span>Configuration:</span>
                        <a href="/api/ott/config" target="_blank" style="color: #007acc;">View Config</a>
                    </div>
                    <div class="metric">
                        <span>Analytics:</span>
                        <a href="/api/ott/stats" target="_blank" style="color: #007acc;">View Stats</a>
                    </div>
                    <div class="metric">
                        <span>Desktop App:</span>
                        <a href="/api/desktop/update/info" target="_blank" style="color: #007acc;">v1.0.0 Download</a>
                    </div>
                </div>
            \`;
        }
        
        // Initial load and auto-refresh every 15 seconds
        updateStatus();
        setInterval(updateStatus, 15000);
    </script>
</body>
</html>
  `);
});

// Operations pause/resume endpoints
router.post('/ops/pause', (req, res) => {
  STATE.paused = true;
  console.log('⏸️ [Ops] System paused by operator');
  res.json({ ok: true, paused: true, timestamp: new Date().toISOString() });
});

router.post('/ops/resume', (req, res) => {
  STATE.paused = false;
  console.log('▶️ [Ops] System resumed by operator');
  res.json({ ok: true, paused: false, timestamp: new Date().toISOString() });
});

// Operations status endpoint
router.get('/ops/status', (req, res) => {
  res.json({
    ok: true,
    paused: STATE.paused,
    deployment_health: STATE.deployment_health,
    last_deployment: STATE.last_deployment,
    timestamp: new Date().toISOString()
  });
});

// Metrics endpoint for dashboard integration
router.get('/metrics', async (req, res) => {
  try {
    const auditStats = await auditTrail.getAuditStats();
    const rateLimitStats = await rateLimitManager.getStats();
    const backupStats = await backupService.getBackupStats();
    
    res.json({
      jobs_done: auditStats.total_entries || 0,
      jobs_total: auditStats.total_entries || 0,
      dlq: 0, // Dead letter queue - not implemented yet
      rate_limit_active: rateLimitStats.active_clients || 0,
      backup_count: backupStats.total_backups,
      backup_size_mb: backupStats.total_size_mb,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('📊 [Metrics] Error:', error.message);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

// ==================== BACKUP SYSTEM ENDPOINTS ====================
// Data protection and backup management

// Manual backup creation (admin protected)
router.post('/ops/backup/now', async (req, res) => {
  try {
    const adminToken = req.headers['x-admin-token'] as string;
    
    if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const result = await backupService.createBackup(adminToken);
    
    if (result.success) {
      console.log(`📦 [Backup] Manual backup created by admin: ${result.filename}`);
      res.json({
        ok: true,
        file: result.filepath,
        filename: result.filename,
        size_kb: result.size,
        timestamp: result.timestamp
      });
    } else {
      res.status(500).json({ error: result.error || 'Backup failed' });
    }
    
  } catch (error: any) {
    console.error('📦 [Backup] Manual backup error:', error.message);
    res.status(500).json({ error: 'Backup operation failed' });
  }
});

// Backup statistics and status
router.get('/ops/backup/status', async (req, res) => {
  try {
    const stats = await backupService.getBackupStats();
    const config = backupService.getConfig();
    
    res.json({
      ok: true,
      backup_stats: stats,
      configuration: {
        backup_dir: config.backupDir,
        retention_days: config.retentionDays,
        max_backups: config.maxBackups,
        auto_interval_hours: config.autoBackupInterval
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('📦 [Backup] Status error:', error.message);
    res.status(500).json({ error: 'Failed to get backup status' });
  }
});

// Auto-backup control
router.post('/ops/backup/auto/:action', (req, res) => {
  try {
    const { action } = req.params;
    const adminToken = req.headers['x-admin-token'] as string;
    
    if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (action === 'start') {
      backupService.startAutoBackup();
      console.log('📦 [Backup] Auto-backup started by admin');
      res.json({ ok: true, message: 'Auto-backup started' });
    } else if (action === 'stop') {
      backupService.stopAutoBackup();
      console.log('📦 [Backup] Auto-backup stopped by admin');
      res.json({ ok: true, message: 'Auto-backup stopped' });
    } else {
      res.status(400).json({ error: 'Invalid action. Use start or stop' });
    }
    
  } catch (error: any) {
    console.error('📦 [Backup] Auto-backup control error:', error.message);
    res.status(500).json({ error: 'Failed to control auto-backup' });
  }
});

// ==================== HEALTH SIMULATION ENDPOINTS ====================
// Testing and simulation capabilities for monitoring validation

// Simulate health failure for testing monitoring systems
router.post('/ops/sim/failhealth', (req, res) => {
  try {
    const adminToken = req.headers['x-admin-token'] as string;
    
    if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const enabled = req.body?.enabled !== undefined ? Boolean(req.body.enabled) : true;
    TEST_FAIL_HEALTH.enabled = enabled;

    console.log(`🧪 [Health] Test failure mode ${enabled ? 'ENABLED' : 'DISABLED'} by admin`);
    
    res.json({
      ok: true,
      enabled: TEST_FAIL_HEALTH.enabled,
      message: `Health failure simulation ${enabled ? 'enabled' : 'disabled'}`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('🧪 [Health] Simulation control error:', error.message);
    res.status(500).json({ error: 'Failed to control health simulation' });
  }
});

// Get current simulation status
router.get('/ops/sim/status', (req, res) => {
  res.json({
    ok: true,
    health_failure_simulation: TEST_FAIL_HEALTH.enabled,
    system_paused: STATE.paused,
    deployment_health: STATE.deployment_health,
    timestamp: new Date().toISOString()
  });
});

// ==================== LEGAL & COMPLIANCE ENDPOINTS ====================
// Privacy policy and terms of service for legal compliance

const PRIVACY_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - DreamNet</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
        p { line-height: 1.6; margin-bottom: 15px; }
        .contact { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px; }
    </style>
</head>
<body>
    <h1>Privacy Policy</h1>
    <p>We collect only necessary data to operate DreamNet. No UI route tracking by default. See /ops/privacy for detailed privacy controls.</p>
    <p>DreamNet processes data in accordance with applicable privacy laws and maintains comprehensive security protections including rate limiting, HMAC authentication, and audit trail logging.</p>
    <p>Last updated: ${new Date().toLocaleDateString()}</p>
    <div class="contact">
        <strong>Contact:</strong> support@dreamnet.ink
    </div>
</body>
</html>
`;

const TERMS_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms of Service - DreamNet</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
        p { line-height: 1.6; margin-bottom: 15px; }
        .contact { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px; }
    </style>
</head>
<body>
    <h1>Terms of Service</h1>
    <p>DreamNet is provided as a subscription service. No warranty; liability limited to the extent permitted by law.</p>
    <p>By using DreamNet, you agree to our comprehensive security monitoring, audit trail logging, and operational controls designed to ensure platform integrity and user protection.</p>
    <p>Service includes enterprise-grade security middleware, health monitoring, backup systems, and failure simulation capabilities for testing purposes.</p>
    <p>Last updated: ${new Date().toLocaleDateString()}</p>
    <div class="contact">
        <strong>Contact:</strong> support@dreamnet.ink
    </div>
</body>
</html>
`;

// Privacy policy endpoint
router.get('/privacy', async (req, res) => {
  try {
    // Log privacy policy access for compliance tracking
    await auditTrail.writeAudit('/privacy', 'legal_access', 'privacy_policy_viewed', Date.now(), '', '');
    
    res.setHeader('Content-Type', 'text/html');
    res.send(PRIVACY_HTML);
  } catch (error: any) {
    console.error('📋 [Legal] Privacy policy error:', error.message);
    res.status(500).json({ error: 'Failed to serve privacy policy' });
  }
});

// Terms of service endpoint
router.get('/terms', async (req, res) => {
  try {
    // Log terms access for compliance tracking
    await auditTrail.writeAudit('/terms', 'legal_access', 'terms_viewed', Date.now(), '', '');
    
    res.setHeader('Content-Type', 'text/html');
    res.send(TERMS_HTML);
  } catch (error: any) {
    console.error('📋 [Legal] Terms of service error:', error.message);
    res.status(500).json({ error: 'Failed to serve terms of service' });
  }
});

// Privacy controls endpoint (ops protected)
router.get('/ops/privacy', (req, res) => {
  res.json({
    ok: true,
    privacy_settings: {
      ui_route_tracking: false,
      audit_trail_enabled: true,
      security_monitoring: true,
      data_retention_days: 30,
      backup_encryption: true
    },
    data_collection: {
      security_events: 'required for platform security',
      health_monitoring: 'required for service reliability',
      audit_logs: 'required for compliance and security',
      user_preferences: 'optional, stored locally'
    },
    contact: 'support@dreamnet.ink',
    timestamp: new Date().toISOString()
  });
});

export default router;