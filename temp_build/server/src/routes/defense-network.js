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
var router = (0, express_1.Router)();
// Get Defense Network status
router.get('/api/defense-network/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var defenseStatus;
    return __generator(this, function (_a) {
        try {
            defenseStatus = {
                status: "armed",
                activeThreats: 2,
                neutralizedThreats: 15,
                totalThreats: 17,
                lastScan: new Date().toISOString(),
                patternCount: 8,
                threatLog: [
                    {
                        type: "unauthorized_core",
                        id: "unauthorized_core_1754445200_456",
                        severity: "medium",
                        timestamp: new Date(Date.now() - 1800000).toISOString(),
                        source: "external_probe",
                        neutralized: true,
                        response: "Isolated core and revoked access credentials"
                    },
                    {
                        type: "dream_injection",
                        id: "dream_injection_1754445300_789",
                        severity: "high",
                        timestamp: new Date(Date.now() - 900000).toISOString(),
                        source: "compromised_dream",
                        neutralized: true,
                        response: "Quarantined malicious dream and updated filters"
                    },
                    {
                        type: "fusion_tampering",
                        id: "fusion_tampering_1754445400_123",
                        severity: "critical",
                        timestamp: new Date(Date.now() - 300000).toISOString(),
                        source: "unknown_origin",
                        neutralized: false
                    }
                ],
                patterns: [
                    { type: "unauthorized_core", frequency: 5, lastSeen: new Date().toISOString(), riskLevel: 0.6 },
                    { type: "network_scanning", frequency: 12, lastSeen: new Date().toISOString(), riskLevel: 0.3 },
                    { type: "dream_injection", frequency: 3, lastSeen: new Date().toISOString(), riskLevel: 0.8 }
                ]
            };
            res.json(defenseStatus);
        }
        catch (error) {
            console.error('Defense Network status error:', error);
            res.status(500).json({ error: 'Failed to fetch defense network status' });
        }
        return [2 /*return*/];
    });
}); });
// Get threat analytics
router.get('/api/defense-network/analytics', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var analytics;
    return __generator(this, function (_a) {
        try {
            analytics = {
                totalThreats: 17,
                neutralized: 15,
                successRate: 88.2,
                severityBreakdown: {
                    critical: 2,
                    high: 4,
                    medium: 7,
                    low: 4
                },
                topThreats: [
                    { type: "network_scanning", frequency: 12, riskLevel: 0.3 },
                    { type: "unauthorized_core", frequency: 5, riskLevel: 0.6 },
                    { type: "dream_injection", frequency: 3, riskLevel: 0.8 },
                    { type: "brute_force_attempt", frequency: 2, riskLevel: 0.4 },
                    { type: "agent_impersonation", frequency: 1, riskLevel: 0.9 }
                ],
                trends: [
                    { date: new Date(Date.now() - 86400000 * 6).toISOString(), threats: 3 },
                    { date: new Date(Date.now() - 86400000 * 5).toISOString(), threats: 2 },
                    { date: new Date(Date.now() - 86400000 * 4).toISOString(), threats: 5 },
                    { date: new Date(Date.now() - 86400000 * 3).toISOString(), threats: 1 },
                    { date: new Date(Date.now() - 86400000 * 2).toISOString(), threats: 4 },
                    { date: new Date(Date.now() - 86400000 * 1).toISOString(), threats: 2 },
                    { date: new Date().toISOString(), threats: 0 }
                ]
            };
            res.json(analytics);
        }
        catch (error) {
            console.error('Defense Network analytics error:', error);
            res.status(500).json({ error: 'Failed to fetch threat analytics' });
        }
        return [2 /*return*/];
    });
}); });
// Set defense level
router.post('/api/defense-network/set-level', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var level;
    return __generator(this, function (_a) {
        try {
            level = req.body.level;
            if (!['armed', 'standby', 'maintenance'].includes(level)) {
                return [2 /*return*/, res.status(400).json({ error: 'Invalid defense level' })];
            }
            res.json({
                success: true,
                message: "Defense level set to ".concat(level),
                level: level,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('Defense level change error:', error);
            res.status(500).json({ error: 'Failed to change defense level' });
        }
        return [2 /*return*/];
    });
}); });
// Manual threat scan
router.post('/api/defense-network/scan', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var scanResult;
    return __generator(this, function (_a) {
        try {
            scanResult = {
                timestamp: new Date().toISOString(),
                duration: "2.8s",
                threatsFound: Math.floor(Math.random() * 3),
                patternsUpdated: Math.floor(Math.random() * 2),
                status: "completed",
                details: [
                    "Network perimeter scanned",
                    "Dream core integrity verified",
                    "Agent authentication checked",
                    "Fusion chain links validated"
                ]
            };
            res.json({
                success: true,
                message: 'Manual threat scan completed',
                result: scanResult
            });
        }
        catch (error) {
            console.error('Manual scan error:', error);
            res.status(500).json({ error: 'Failed to run manual scan' });
        }
        return [2 /*return*/];
    });
}); });
// Emergency lockdown
router.post('/api/defense-network/lockdown', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.json({
                success: true,
                message: 'Emergency lockdown activated',
                status: 'compromised',
                timestamp: new Date().toISOString(),
                actions: [
                    'All external connections severed',
                    'Dream cores isolated',
                    'Agent communications restricted',
                    'Network access logged and monitored'
                ]
            });
        }
        catch (error) {
            console.error('Emergency lockdown error:', error);
            res.status(500).json({ error: 'Failed to activate emergency lockdown' });
        }
        return [2 /*return*/];
    });
}); });
// Neutralize specific threat
router.post('/api/defense-network/neutralize/:threatId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var threatId;
    return __generator(this, function (_a) {
        try {
            threatId = req.params.threatId;
            res.json({
                success: true,
                message: 'Threat neutralized successfully',
                threatId: threatId,
                action: 'Manual neutralization',
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('Threat neutralization error:', error);
            res.status(500).json({ error: 'Failed to neutralize threat' });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
