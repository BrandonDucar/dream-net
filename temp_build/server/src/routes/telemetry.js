"use strict";
/**
 * DreamScope Telemetry Tiles - Minimal essential monitoring data
 * Copy/paste ready for immediate dashboard integration
 */
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
var fs_1 = require("fs");
var child_process_1 = require("child_process");
var router = (0, express_1.Router)();
// Kill switch is optional
var isHardStop = null;
try {
    var killSwitchModule = require('../core/killSwitch.js');
    isHardStop = killSwitchModule.isHardStop;
}
catch (_a) {
    console.warn("[Telemetry Router] Kill switch not available");
    isHardStop = function () { return false; }; // Fallback
}
var TelemetryCollector = /** @class */ (function () {
    function TelemetryCollector() {
    }
    TelemetryCollector.prototype.getSystemStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        // Get basic system stats
                        var memInfo = process.memoryUsage();
                        var uptime = process.uptime();
                        // Simple CPU estimation based on load
                        var loadAvg = require('os').loadavg()[0]; // 1-minute load average
                        var cpuCount = require('os').cpus().length;
                        var cpuPercent = Math.min(100, (loadAvg / cpuCount) * 100);
                        resolve({
                            cpu: Math.round(cpuPercent),
                            memory: Math.round(memInfo.rss / 1024 / 1024), // MB
                            uptime: Math.round(uptime)
                        });
                    })];
            });
        });
    };
    TelemetryCollector.prototype.getDatabaseHealth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var db, start, responseTime, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('../db.js'); })];
                    case 1:
                        db = (_a.sent()).db;
                        start = Date.now();
                        return [4 /*yield*/, db.execute('SELECT 1')];
                    case 2:
                        _a.sent();
                        responseTime = Date.now() - start;
                        return [2 /*return*/, {
                                status: responseTime < 100 ? 'healthy' : responseTime < 500 ? 'warning' : 'critical',
                                responseTime: responseTime,
                                connected: true
                            }];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, {
                                status: 'critical',
                                responseTime: 0,
                                connected: false
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TelemetryCollector.prototype.getAgentStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ps_1, output_1;
            return __generator(this, function (_a) {
                try {
                    ps_1 = (0, child_process_1.spawn)('ps', ['aux']);
                    output_1 = '';
                    return [2 /*return*/, new Promise(function (resolve) {
                            ps_1.stdout.on('data', function (data) {
                                output_1 += data.toString();
                            });
                            ps_1.on('close', function () {
                                var lines = output_1.split('\n');
                                var nodeProcesses = lines.filter(function (line) {
                                    return line.includes('node') &&
                                        (line.includes('agent') || line.includes('Agent') || line.includes('tsx'));
                                });
                                resolve({
                                    active: Math.max(1, nodeProcesses.length - 1), // Subtract main process
                                    total: 24 // Known total from logs
                                });
                            });
                            ps_1.on('error', function () {
                                resolve({ active: 1, total: 24 });
                            });
                        })];
                }
                catch (error) {
                    return [2 /*return*/, { active: 1, total: 24 }];
                }
                return [2 /*return*/];
            });
        });
    };
    TelemetryCollector.prototype.getBudgetStatus = function () {
        var hardStop = isHardStop();
        var memoryMB = Math.round(process.memoryUsage().rss / 1024 / 1024);
        return {
            hardStop: hardStop,
            memoryMB: memoryMB,
            status: hardStop ? 'critical' : memoryMB > 500 ? 'warning' : 'healthy',
            flagFileExists: fs_1.default.existsSync('/tmp/DREAMOPS_STOP.flag'),
            environmentStop: process.env.BUDGET_HARD_STOP === '1'
        };
    };
    TelemetryCollector.prototype.collectTiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, _a, systemStats, dbHealth, agentStatus, budgetStatus, tiles;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        timestamp = new Date().toISOString();
                        return [4 /*yield*/, Promise.all([
                                this.getSystemStats(),
                                this.getDatabaseHealth(),
                                this.getAgentStatus(),
                                Promise.resolve(this.getBudgetStatus())
                            ])];
                    case 1:
                        _a = _b.sent(), systemStats = _a[0], dbHealth = _a[1], agentStatus = _a[2], budgetStatus = _a[3];
                        tiles = [
                            // System Health
                            {
                                id: 'system_memory',
                                title: 'Memory Usage',
                                value: systemStats.memory,
                                unit: 'MB',
                                status: systemStats.memory > 800 ? 'critical' : systemStats.memory > 500 ? 'warning' : 'healthy',
                                trend: 'stable',
                                lastUpdate: timestamp
                            },
                            {
                                id: 'system_cpu',
                                title: 'CPU Load',
                                value: systemStats.cpu,
                                unit: '%',
                                status: systemStats.cpu > 80 ? 'critical' : systemStats.cpu > 60 ? 'warning' : 'healthy',
                                trend: 'stable',
                                lastUpdate: timestamp
                            },
                            {
                                id: 'system_uptime',
                                title: 'Uptime',
                                value: Math.floor(systemStats.uptime / 60),
                                unit: 'min',
                                status: systemStats.uptime > 300 ? 'healthy' : 'warning',
                                trend: 'up',
                                lastUpdate: timestamp
                            },
                            // Database Health
                            {
                                id: 'db_health',
                                title: 'Database',
                                value: dbHealth.connected ? 'ONLINE' : 'OFFLINE',
                                status: dbHealth.status,
                                lastUpdate: timestamp
                            },
                            {
                                id: 'db_response',
                                title: 'DB Response',
                                value: dbHealth.responseTime,
                                unit: 'ms',
                                status: dbHealth.status,
                                trend: 'stable',
                                lastUpdate: timestamp
                            },
                            // Agent Ecosystem
                            {
                                id: 'agents_active',
                                title: 'Active Agents',
                                value: "".concat(agentStatus.active, "/").concat(agentStatus.total),
                                status: agentStatus.active > 15 ? 'healthy' : agentStatus.active > 5 ? 'warning' : 'critical',
                                trend: budgetStatus.hardStop ? 'down' : 'stable',
                                lastUpdate: timestamp
                            },
                            // Budget Controls
                            {
                                id: 'budget_status',
                                title: 'Budget Control',
                                value: budgetStatus.hardStop ? 'ACTIVE' : 'NORMAL',
                                status: budgetStatus.status,
                                lastUpdate: timestamp
                            },
                            {
                                id: 'memory_safeguard',
                                title: 'Memory Guard',
                                value: budgetStatus.memoryMB,
                                unit: 'MB',
                                status: budgetStatus.memoryMB > 800 ? 'critical' : 'healthy',
                                trend: 'stable',
                                lastUpdate: timestamp
                            },
                            // System Flags
                            {
                                id: 'hard_stop',
                                title: 'Emergency Stop',
                                value: budgetStatus.hardStop ? 'ENGAGED' : 'READY',
                                status: budgetStatus.hardStop ? 'warning' : 'healthy',
                                lastUpdate: timestamp
                            },
                            // Development Status
                            {
                                id: 'environment',
                                title: 'Environment',
                                value: process.env.NODE_ENV || 'development',
                                status: 'healthy',
                                lastUpdate: timestamp
                            }
                        ];
                        return [2 /*return*/, tiles];
                }
            });
        });
    };
    return TelemetryCollector;
}());
var telemetryCollector = new TelemetryCollector();
// Main telemetry endpoint - returns all tiles
router.get('/api/telemetry/tiles', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tiles, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, telemetryCollector.collectTiles()];
            case 1:
                tiles = _a.sent();
                res.json({
                    success: true,
                    tiles: tiles,
                    meta: {
                        collected_at: new Date().toISOString(),
                        tile_count: tiles.length,
                        healthy_count: tiles.filter(function (t) { return t.status === 'healthy'; }).length,
                        warning_count: tiles.filter(function (t) { return t.status === 'warning'; }).length,
                        critical_count: tiles.filter(function (t) { return t.status === 'critical'; }).length
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('📊 [TELEMETRY] Collection error:', error_2);
                res.status(500).json({
                    success: false,
                    error: error_2 instanceof Error ? error_2.message : 'Unknown error'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Individual tile endpoint
router.get('/api/telemetry/tile/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tiles, tile, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, telemetryCollector.collectTiles()];
            case 1:
                tiles = _a.sent();
                tile = tiles.find(function (t) { return t.id === req.params.id; });
                if (!tile) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            error: 'Tile not found'
                        })];
                }
                res.json({
                    success: true,
                    tile: tile
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('📊 [TELEMETRY] Tile error:', error_3);
                res.status(500).json({
                    success: false,
                    error: error_3 instanceof Error ? error_3.message : 'Unknown error'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Health summary endpoint
router.get('/api/telemetry/health', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tiles, summary, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, telemetryCollector.collectTiles()];
            case 1:
                tiles = _a.sent();
                summary = {
                    overall_status: tiles.some(function (t) { return t.status === 'critical'; }) ? 'critical' :
                        tiles.some(function (t) { return t.status === 'warning'; }) ? 'warning' : 'healthy',
                    total_tiles: tiles.length,
                    healthy: tiles.filter(function (t) { return t.status === 'healthy'; }).length,
                    warning: tiles.filter(function (t) { return t.status === 'warning'; }).length,
                    critical: tiles.filter(function (t) { return t.status === 'critical'; }).length,
                    offline: tiles.filter(function (t) { return t.status === 'offline'; }).length,
                    last_check: new Date().toISOString()
                };
                res.json({
                    success: true,
                    health: summary
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('📊 [TELEMETRY] Health summary error:', error_4);
                res.status(500).json({
                    success: false,
                    error: error_4 instanceof Error ? error_4.message : 'Unknown error'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
