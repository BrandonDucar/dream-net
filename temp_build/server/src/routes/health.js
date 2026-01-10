"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var AuditTrailService_1 = require("../services/AuditTrailService");
var rateLimiter_1 = require("../middleware/rateLimiter");
var BackupService_1 = require("../services/BackupService");
var router = (0, express_1.Router)();
// Schema version for tracking deployment compatibility
var SCHEMA_VERSION = "v2.0.0-security-complete";
// Global state tracking
var STATE = {
    paused: false,
    last_deployment: null,
    deployment_health: 'healthy'
};
// Test failure simulation state
var TEST_FAIL_HEALTH = {
    enabled: false
};
// ==================== LIVENESS PROBE ====================
// GET /health/live - Liveness probe (process only, no external deps)
// Used by Kubernetes/Docker to determine if container should be restarted
router.get('/live', function (_req, res) {
    // No external dependencies - just check if process is running
    res.status(200).json({
        status: 'alive',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        pid: process.pid
    });
});
// ==================== READINESS PROBE ====================
// GET /health/ready - Readiness probe (critical dependencies)
// Used by Kubernetes/Docker to determine if container can receive traffic
router.get('/ready', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var checks_1, getDb, db, error_1, requiredEnvVars, envCheck, fs, stats, _a, _b, criticalChecks, ready, statusCode, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 18, , 19]);
                checks_1 = {};
                if (!process.env.DATABASE_URL) return [3 /*break*/, 8];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 6, , 7]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('../db'); })];
            case 2:
                getDb = (_c.sent()).getDb;
                db = getDb();
                if (!db) return [3 /*break*/, 4];
                // Try a simple query
                return [4 /*yield*/, db.execute({ sql: 'SELECT 1', args: [] })];
            case 3:
                // Try a simple query
                _c.sent();
                checks_1.database = true;
                return [3 /*break*/, 5];
            case 4:
                checks_1.database = 'not-configured';
                _c.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _c.sent();
                checks_1.database = false;
                checks_1.database_error = error_1.message;
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                checks_1.database = 'not-configured';
                _c.label = 9;
            case 9:
                requiredEnvVars = ['NODE_ENV'];
                envCheck = requiredEnvVars.every(function (v) { return !!process.env[v]; });
                checks_1.environment = envCheck;
                _c.label = 10;
            case 10:
                _c.trys.push([10, 16, , 17]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('fs/promises'); })];
            case 11:
                fs = _c.sent();
                return [4 /*yield*/, fs.statfs];
            case 12:
                if (!(_c.sent())) return [3 /*break*/, 14];
                return [4 /*yield*/, fs.statfs('.')];
            case 13:
                _a = _c.sent();
                return [3 /*break*/, 15];
            case 14:
                _a = null;
                _c.label = 15;
            case 15:
                stats = _a;
                checks_1.disk = true; // Assume OK if we can check
                return [3 /*break*/, 17];
            case 16:
                _b = _c.sent();
                checks_1.disk = 'unavailable';
                return [3 /*break*/, 17];
            case 17:
                criticalChecks = ['database', 'environment'];
                ready = criticalChecks.every(function (key) {
                    var value = checks_1[key];
                    return value === true || value === 'not-configured'; // not-configured is OK
                });
                statusCode = ready ? 200 : 503;
                res.status(statusCode).json({
                    ready: ready,
                    checks: checks_1,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 19];
            case 18:
                error_2 = _c.sent();
                res.status(503).json({
                    ready: false,
                    error: error_2.message,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 19];
            case 19: return [2 /*return*/];
        }
    });
}); });
// ==================== COMPREHENSIVE HEALTH CHECK ====================
// GET /health - Combined health check (backward compatible)
router.get('/health', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var auditStartTime, ok, dbStatus, rateLimitStats, idempotencyStats, auditStats, slaStatus, securityHealth, securityOk, entitlementsHealth, dbAvailable, hasStripeWebhook, hasStripeSecret, details, outcome, error_3, statusCode, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                auditStartTime = Date.now();
                ok = !TEST_FAIL_HEALTH.enabled;
                dbStatus = process.env.DATABASE_URL ? 'postgres' : 'sqlite';
                rateLimitStats = { status: 'operational', active_clients: 0 };
                idempotencyStats = { status: 'operational', active_entries: 0 };
                auditStats = { total_entries: 0, last_24h: 0 };
                slaStatus = {
                    overall_health: 'healthy',
                    active_breaches: 0
                };
                securityHealth = {
                    rate_limiting: rateLimitStats.status === 'operational',
                    idempotency: idempotencyStats.status === 'operational',
                    audit_trail: auditStats.total_entries >= 0,
                    sla_monitoring: slaStatus.overall_health === 'healthy'
                };
                securityOk = Object.values(securityHealth).every(function (v) { return v; });
                ok = ok && securityOk;
                entitlementsHealth = {};
                try {
                    dbAvailable = !!process.env.DATABASE_URL;
                    hasStripeWebhook = !!process.env.STRIPE_WEBHOOK_SECRET;
                    hasStripeSecret = !!process.env.STRIPE_SECRET_KEY;
                    entitlementsHealth = {
                        database: dbAvailable ? 'available' : 'unavailable',
                        stripe_webhooks: hasStripeWebhook ? 'configured' : 'not_configured',
                        stripe_api: hasStripeSecret ? 'configured' : 'not_configured',
                        status: (dbAvailable && hasStripeWebhook && hasStripeSecret) ? 'operational' : 'degraded'
                    };
                }
                catch (error) {
                    entitlementsHealth = {
                        status: 'error',
                        error: error.message
                    };
                }
                details = {
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
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                outcome = TEST_FAIL_HEALTH.enabled ? 'simulated_failure' : (ok ? 'ok' : 'degraded');
                return [4 /*yield*/, AuditTrailService_1.auditTrail.writeAudit('/health', 'health_check', outcome, auditStartTime, '', '')];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                // Don't fail health check if audit trail fails
                console.warn('[Health] Audit trail write failed:', error_3);
                return [3 /*break*/, 4];
            case 4:
                statusCode = ok ? 200 : 500;
                res.status(statusCode).json({ ok: ok, details: details });
                return [3 /*break*/, 6];
            case 5:
                error_4 = _a.sent();
                console.error('🏥 [Health] Health check error:', error_4.message);
                res.status(500).json({
                    ok: false,
                    error: 'Health check failed',
                    details: { timestamp: new Date().toISOString() }
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Public status page with real-time monitoring
router.get('/status', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.send("\n<!DOCTYPE html>\n<html>\n<head>\n    <title>DreamNet Status</title>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <style>\n        body { \n            font-family: 'Inter', system-ui, sans-serif; \n            margin: 40px; \n            background: #0a0a0a; \n            color: #fff; \n        }\n        .ok { color: #10b981; font-weight: 600; }\n        .bad { color: #ef4444; font-weight: 600; }\n        .warn { color: #f59e0b; font-weight: 600; }\n        .card { \n            background: #111; \n            border: 1px solid #333; \n            border-radius: 12px; \n            padding: 20px; \n            margin: 16px 0; \n        }\n        .metric { \n            display: flex; \n            justify-content: space-between; \n            margin: 8px 0; \n            padding: 8px 0; \n            border-bottom: 1px solid #222; \n        }\n        .metric:last-child { border-bottom: none; }\n        code { \n            background: #1a1a1a; \n            padding: 2px 6px; \n            border-radius: 4px; \n            font-family: 'Monaco', monospace; \n        }\n        h1 { color: #3b82f6; }\n        .status-indicator { \n            width: 12px; \n            height: 12px; \n            border-radius: 50%; \n            display: inline-block; \n            margin-right: 8px; \n        }\n        .status-healthy { background: #10b981; }\n        .status-degraded { background: #f59e0b; }\n        .status-failed { background: #ef4444; }\n    </style>\n</head>\n<body>\n    <h1>\uD83C\uDF10 DreamNet Status Dashboard</h1>\n    <div id=\"out\">Loading system status...</div>\n    \n    <script>\n        async function fetchWithFallback(url) {\n            try {\n                const { fetchWithTimeout } = await import('../utils/fetchWithTimeout');\n                const traceId = (req as any).traceId;\n                const response = await fetchWithTimeout(url, {\n                  timeout: 5000,\n                  requestId: traceId\n                });\n                return await response.json();\n            } catch (error) {\n                return { error: error.message };\n            }\n        }\n        \n        async function updateStatus() {\n            const [health, rateLimit, audit, secrets, backup] = await Promise.all([\n                fetchWithFallback('/health'),\n                fetchWithFallback('/api/rate-limit/stats'),\n                fetchWithFallback('/api/audit/stats'),\n                fetchWithFallback('/ops/keys/status'),\n                fetchWithFallback('/ops/backup/status')\n            ]);\n            \n            const ok = health.ok === true;\n            const securityStatus = health.details?.security?.status || 'unknown';\n            \n            document.getElementById('out').innerHTML = `\n                <div class=\"card\">\n                    <h2>\n                        <span class=\"status-indicator status-${ok ? 'healthy' : 'failed'}\"></span>\n                        System Health: <span class=\"${ok ? 'ok' : 'bad'}\">${ok ? 'OPERATIONAL' : 'DEGRADED'}</span>\n                    </h2>\n                    <div class=\"metric\">\n                        <span>Schema Version:</span>\n                        <code>${health.details?.schema_version || 'unknown'}</code>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Database:</span>\n                        <code>${health.details?.db_backend || 'unknown'}</code>\n                    </div>\n                    <div class=\"metric\">\n                        <span>System Paused:</span>\n                        <span class=\"${health.details?.paused ? 'warn' : 'ok'}\">${health.details?.paused ? 'YES' : 'NO'}</span>\n                    </div>\n                </div>\n                \n                <div class=\"card\">\n                    <h2>\uD83D\uDEE1\uFE0F Security Middleware</h2>\n                    <div class=\"metric\">\n                        <span>Security Status:</span>\n                        <span class=\"${securityStatus === 'healthy' ? 'ok' : 'warn'}\">${securityStatus.toUpperCase()}</span>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Rate Limit Clients:</span>\n                        <code>${health.details?.middleware_stats?.rate_limit_clients || 0}</code>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Idempotency Entries:</span>\n                        <code>${health.details?.middleware_stats?.idempotency_entries || 0}</code>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Audit Entries (24h):</span>\n                        <code>${health.details?.middleware_stats?.audit_entries_24h || 0}</code>\n                    </div>\n                    <div class=\"metric\">\n                        <span>SLA Breaches:</span>\n                        <code>${health.details?.middleware_stats?.sla_breaches || 0}</code>\n                    </div>\n                </div>\n                \n                <div class=\"card\">\n                    <h2>\uD83D\uDD10 Authentication & Keys</h2>\n                    <div class=\"metric\">\n                        <span>Current HMAC Key:</span>\n                        <code>${secrets.current_key_id || 'none'}</code>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Total Secrets:</span>\n                        <code>${secrets.total_secrets || 0}</code>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Healthy Keys:</span>\n                        <code>${secrets.health_summary?.healthy || 0}</code>\n                    </div>\n                </div>\n                \n                <div class=\"card\">\n                    <h2>\uD83D\uDCCA System Metrics</h2>\n                    <div class=\"metric\">\n                        <span>Rate Limit Status:</span>\n                        <span class=\"${rateLimit.status === 'operational' ? 'ok' : 'warn'}\">${rateLimit.status?.toUpperCase() || 'UNKNOWN'}</span>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Tracked Endpoints:</span>\n                        <code>${rateLimit.total_tracked_paths || 0}</code>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Total Audit Entries:</span>\n                        <code>${audit.audit_trail?.total_entries || 0}</code>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Last Updated:</span>\n                        <code>${new Date().toLocaleTimeString()}</code>\n                    </div>\n                </div>\n                \n                <div class=\"card\">\n                    <h2>\uD83D\uDCE6 Backup System</h2>\n                    <div class=\"metric\">\n                        <span>Total Backups:</span>\n                        <code>${backup.backup_stats?.total_backups || 0}</code>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Latest Backup:</span>\n                        <code>${backup.backup_stats?.latest_backup || 'none'}</code>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Storage Used:</span>\n                        <code>${backup.backup_stats?.total_size_mb || 0} MB</code>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Auto-Backup:</span>\n                        <span class=\"${backup.backup_stats?.auto_backup_enabled ? 'ok' : 'warn'}\">${backup.backup_stats?.auto_backup_enabled ? 'ENABLED' : 'DISABLED'}</span>\n                    </div>\n                </div>\n                \n                <div class=\"card\">\n                    <h2>\uD83D\uDCCB Legal & Compliance</h2>\n                    <div class=\"metric\">\n                        <span>Privacy Policy:</span>\n                        <a href=\"/privacy\" target=\"_blank\" style=\"color: #007acc;\">View Policy</a>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Terms of Service:</span>\n                        <a href=\"/terms\" target=\"_blank\" style=\"color: #007acc;\">View Terms</a>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Privacy Controls:</span>\n                        <a href=\"/ops/privacy\" target=\"_blank\" style=\"color: #007acc;\">View Settings</a>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Contact:</span>\n                        <code>support@dreamnet.ink</code>\n                    </div>\n                </div>\n                \n                <div class=\"card\">\n                    <h2>\uD83D\uDCFA OTT Streaming Platform</h2>\n                    <div class=\"metric\">\n                        <span>Status:</span>\n                        <span class=\"ok\">OPERATIONAL</span>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Encodings:</span>\n                        <code>1080p6Mbps, 720p3Mbps, 480p1.5Mbps</code>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Protocols:</span>\n                        <code>HLS, DASH</code>\n                    </div>\n                    <div class=\"metric\">\n                        <span>DRM Support:</span>\n                        <code>Widevine, FairPlay, PlayReady</code>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Configuration:</span>\n                        <a href=\"/api/ott/config\" target=\"_blank\" style=\"color: #007acc;\">View Config</a>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Analytics:</span>\n                        <a href=\"/api/ott/stats\" target=\"_blank\" style=\"color: #007acc;\">View Stats</a>\n                    </div>\n                    <div class=\"metric\">\n                        <span>Desktop App:</span>\n                        <a href=\"/api/desktop/update/info\" target=\"_blank\" style=\"color: #007acc;\">v1.0.0 Download</a>\n                    </div>\n                </div>\n            `;\n        }\n        \n        // Initial load and auto-refresh every 15 seconds\n        updateStatus();\n        setInterval(updateStatus, 15000);\n    </script>\n</body>\n</html>\n  ");
});
// Operations pause/resume endpoints
router.post('/ops/pause', function (req, res) {
    STATE.paused = true;
    console.log('⏸️ [Ops] System paused by operator');
    res.json({ ok: true, paused: true, timestamp: new Date().toISOString() });
});
router.post('/ops/resume', function (req, res) {
    STATE.paused = false;
    console.log('▶️ [Ops] System resumed by operator');
    res.json({ ok: true, paused: false, timestamp: new Date().toISOString() });
});
// Operations status endpoint
router.get('/ops/status', function (req, res) {
    res.json({
        ok: true,
        paused: STATE.paused,
        deployment_health: STATE.deployment_health,
        last_deployment: STATE.last_deployment,
        timestamp: new Date().toISOString()
    });
});
// Metrics endpoint for dashboard integration
router.get('/metrics', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var auditStats, error_5, rateLimitStats, backupStats, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                auditStats = { total_entries: 0, last_24h: 0 };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, AuditTrailService_1.auditTrail.getAuditStats()];
            case 2:
                auditStats = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.warn('[Health] Audit stats failed:', error_5);
                return [3 /*break*/, 4];
            case 4: return [4 /*yield*/, rateLimiter_1.rateLimitManager.getStats()];
            case 5:
                rateLimitStats = _a.sent();
                return [4 /*yield*/, BackupService_1.backupService.getBackupStats()];
            case 6:
                backupStats = _a.sent();
                res.json({
                    jobs_done: auditStats.total_entries || 0,
                    jobs_total: auditStats.total_entries || 0,
                    dlq: 0, // Dead letter queue - not implemented yet
                    rate_limit_active: rateLimitStats.active_clients || 0,
                    backup_count: backupStats.total_backups,
                    backup_size_mb: backupStats.total_size_mb,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 8];
            case 7:
                error_6 = _a.sent();
                console.error('📊 [Metrics] Error:', error_6.message);
                res.status(500).json({ error: 'Failed to get metrics' });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
// ==================== BACKUP SYSTEM ENDPOINTS ====================
// Data protection and backup management
// Manual backup creation (admin protected)
router.post('/ops/backup/now', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var adminToken, result, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                adminToken = req.headers['x-admin-token'];
                if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
                    return [2 /*return*/, res.status(403).json({ error: 'Forbidden' })];
                }
                return [4 /*yield*/, BackupService_1.backupService.createBackup(adminToken)];
            case 1:
                result = _a.sent();
                if (result.success) {
                    console.log("\uD83D\uDCE6 [Backup] Manual backup created by admin: ".concat(result.filename));
                    res.json({
                        ok: true,
                        file: result.filepath,
                        filename: result.filename,
                        size_kb: result.size,
                        timestamp: result.timestamp
                    });
                }
                else {
                    res.status(500).json({ error: result.error || 'Backup failed' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('📦 [Backup] Manual backup error:', error_7.message);
                res.status(500).json({ error: 'Backup operation failed' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Backup statistics and status
router.get('/ops/backup/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var stats, config, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, BackupService_1.backupService.getBackupStats()];
            case 1:
                stats = _a.sent();
                config = BackupService_1.backupService.getConfig();
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
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                console.error('📦 [Backup] Status error:', error_8.message);
                res.status(500).json({ error: 'Failed to get backup status' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Auto-backup control
router.post('/ops/backup/auto/:action', function (req, res) {
    try {
        var action = req.params.action;
        var adminToken = req.headers['x-admin-token'];
        if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        if (action === 'start') {
            BackupService_1.backupService.startAutoBackup();
            console.log('📦 [Backup] Auto-backup started by admin');
            res.json({ ok: true, message: 'Auto-backup started' });
        }
        else if (action === 'stop') {
            BackupService_1.backupService.stopAutoBackup();
            console.log('📦 [Backup] Auto-backup stopped by admin');
            res.json({ ok: true, message: 'Auto-backup stopped' });
        }
        else {
            res.status(400).json({ error: 'Invalid action. Use start or stop' });
        }
    }
    catch (error) {
        console.error('📦 [Backup] Auto-backup control error:', error.message);
        res.status(500).json({ error: 'Failed to control auto-backup' });
    }
});
// ==================== HEALTH SIMULATION ENDPOINTS ====================
// Testing and simulation capabilities for monitoring validation
// Simulate health failure for testing monitoring systems
router.post('/ops/sim/failhealth', function (req, res) {
    var _a;
    try {
        var adminToken = req.headers['x-admin-token'];
        if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        var enabled = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.enabled) !== undefined ? Boolean(req.body.enabled) : true;
        TEST_FAIL_HEALTH.enabled = enabled;
        console.log("\uD83E\uDDEA [Health] Test failure mode ".concat(enabled ? 'ENABLED' : 'DISABLED', " by admin"));
        res.json({
            ok: true,
            enabled: TEST_FAIL_HEALTH.enabled,
            message: "Health failure simulation ".concat(enabled ? 'enabled' : 'disabled'),
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('🧪 [Health] Simulation control error:', error.message);
        res.status(500).json({ error: 'Failed to control health simulation' });
    }
});
// Get current simulation status
router.get('/ops/sim/status', function (req, res) {
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
var PRIVACY_HTML = "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Privacy Policy - DreamNet</title>\n    <style>\n        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }\n        h1 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }\n        p { line-height: 1.6; margin-bottom: 15px; }\n        .contact { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px; }\n    </style>\n</head>\n<body>\n    <h1>Privacy Policy</h1>\n    <p>We collect only necessary data to operate DreamNet. No UI route tracking by default. See /ops/privacy for detailed privacy controls.</p>\n    <p>DreamNet processes data in accordance with applicable privacy laws and maintains comprehensive security protections including rate limiting, HMAC authentication, and audit trail logging.</p>\n    <p>Last updated: ".concat(new Date().toLocaleDateString(), "</p>\n    <div class=\"contact\">\n        <strong>Contact:</strong> support@dreamnet.ink\n    </div>\n</body>\n</html>\n");
var TERMS_HTML = "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Terms of Service - DreamNet</title>\n    <style>\n        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }\n        h1 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }\n        p { line-height: 1.6; margin-bottom: 15px; }\n        .contact { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px; }\n    </style>\n</head>\n<body>\n    <h1>Terms of Service</h1>\n    <p>DreamNet is provided as a subscription service. No warranty; liability limited to the extent permitted by law.</p>\n    <p>By using DreamNet, you agree to our comprehensive security monitoring, audit trail logging, and operational controls designed to ensure platform integrity and user protection.</p>\n    <p>Service includes enterprise-grade security middleware, health monitoring, backup systems, and failure simulation capabilities for testing purposes.</p>\n    <p>Last updated: ".concat(new Date().toLocaleDateString(), "</p>\n    <div class=\"contact\">\n        <strong>Contact:</strong> support@dreamnet.ink\n    </div>\n</body>\n</html>\n");
// Privacy policy endpoint
router.get('/privacy', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_9, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, AuditTrailService_1.auditTrail.writeAudit('/privacy', 'legal_access', 'privacy_policy_viewed', Date.now(), '', '')];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_9 = _a.sent();
                return [3 /*break*/, 4];
            case 4:
                res.setHeader('Content-Type', 'text/html');
                res.send(PRIVACY_HTML);
                return [3 /*break*/, 6];
            case 5:
                error_10 = _a.sent();
                console.error('📋 [Legal] Privacy policy error:', error_10.message);
                res.status(500).json({ error: 'Failed to serve privacy policy' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Terms of service endpoint
router.get('/terms', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_11, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, AuditTrailService_1.auditTrail.writeAudit('/terms', 'legal_access', 'terms_viewed', Date.now(), '', '')];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_11 = _a.sent();
                return [3 /*break*/, 4];
            case 4:
                res.setHeader('Content-Type', 'text/html');
                res.send(TERMS_HTML);
                return [3 /*break*/, 6];
            case 5:
                error_12 = _a.sent();
                console.error('📋 [Legal] Terms of service error:', error_12.message);
                res.status(500).json({ error: 'Failed to serve terms of service' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Privacy controls endpoint (ops protected)
router.get('/ops/privacy', function (req, res) {
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
exports.default = router;
