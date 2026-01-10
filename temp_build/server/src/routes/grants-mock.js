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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGrantsMockRoutes = registerGrantsMockRoutes;
var express_1 = require("express");
// Mock grants data for when database is unavailable
var mockOpportunities = [
    {
        id: "1",
        source: "ethereum",
        name: "Ethereum Foundation Developer Grant",
        url: "https://ethereum.org/grants",
        deadline: "2025-12-31T23:59:59.000Z",
        status: "triage",
        createdAt: "2025-08-22T04:00:00.000Z",
        updatedAt: "2025-08-22T04:00:00.000Z"
    },
    {
        id: "2",
        source: "solana",
        name: "Solana Foundation Grant Program",
        url: "https://solana.org/grants",
        deadline: "2025-09-30T23:59:59.000Z",
        status: "eligible",
        createdAt: "2025-08-22T03:30:00.000Z",
        updatedAt: "2025-08-22T03:30:00.000Z"
    },
    {
        id: "3",
        source: "google-cloud",
        name: "Google Cloud for Startups",
        url: "https://cloud.google.com/startup",
        deadline: null,
        status: "applied",
        createdAt: "2025-08-22T03:00:00.000Z",
        updatedAt: "2025-08-22T04:05:00.000Z"
    }
];
var mockApplications = [
    {
        id: "1",
        oppId: "3",
        status: "submitted",
        artifactId: "123",
        submittedAt: "2025-08-22T04:05:00.000Z",
        createdAt: "2025-08-22T04:00:00.000Z",
        updatedAt: "2025-08-22T04:05:00.000Z"
    }
];
var mockOutreach = [
    {
        id: "1",
        oppId: "2",
        channel: "email",
        toAddr: "grants@solana.org",
        status: "sent",
        providerId: "msg_20250822_001",
        createdAt: "2025-08-22T03:45:00.000Z",
        updatedAt: "2025-08-22T03:45:00.000Z"
    },
    {
        id: "2",
        oppId: "1",
        channel: "form",
        toAddr: "https://ethereum.org/contact",
        status: "draft",
        providerId: null,
        createdAt: "2025-08-22T04:00:00.000Z",
        updatedAt: "2025-08-22T04:00:00.000Z"
    }
];
// Store mock artifact
function storeMockArtifact(kind, ref, data) {
    var artifact = {
        id: "mock_artifact_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9)),
        created_at: new Date().toISOString()
    };
    console.log("[GRANTS-MOCK] Artifact stored: ".concat(kind, " | ").concat(ref, " | ").concat(JSON.stringify(data)));
    return artifact;
}
function registerGrantsMockRoutes(app) {
    // ==================== MOCK GRANT OPPORTUNITIES ====================
    var _this = this;
    // Get all grant opportunities with filtering (mock data)
    app.get('/api/grants/opportunities', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, status_1, source_1, _b, limit, opportunities;
        return __generator(this, function (_c) {
            try {
                _a = req.query, status_1 = _a.status, source_1 = _a.source, _b = _a.limit, limit = _b === void 0 ? '50' : _b;
                opportunities = __spreadArray([], mockOpportunities, true);
                // Apply filters
                if (status_1) {
                    opportunities = opportunities.filter(function (opp) { return opp.status === status_1; });
                }
                if (source_1) {
                    opportunities = opportunities.filter(function (opp) { return opp.source === source_1; });
                }
                // Apply limit
                opportunities = opportunities.slice(0, parseInt(limit));
                res.json({
                    opportunities: opportunities,
                    total: opportunities.length,
                    filters_applied: { status: status_1, source: source_1 },
                    data_source: 'mock',
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('[GRANTS-MOCK] Error fetching opportunities:', error);
                res.status(500).json({
                    error: 'Failed to fetch grant opportunities',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
            return [2 /*return*/];
        });
    }); });
    // Create new grant opportunity (mock)
    app.post('/api/grants/opportunities', express_1.default.json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, source, name_1, url, deadline, _b, status_2, newOpportunity;
        return __generator(this, function (_c) {
            try {
                _a = req.body, source = _a.source, name_1 = _a.name, url = _a.url, deadline = _a.deadline, _b = _a.status, status_2 = _b === void 0 ? 'triage' : _b;
                if (!source || !name_1 || !url) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Missing required fields',
                            required: ['source', 'name', 'url']
                        })];
                }
                newOpportunity = {
                    id: (mockOpportunities.length + 1).toString(),
                    source: source,
                    name: name_1,
                    url: url,
                    deadline: deadline || null,
                    status: status_2,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                mockOpportunities.push(newOpportunity);
                // Store creation artifact
                storeMockArtifact('grant.opportunity.created', newOpportunity.id, {
                    opportunity_id: newOpportunity.id,
                    source: newOpportunity.source,
                    name: newOpportunity.name,
                    created_by: 'mock_system'
                });
                res.status(201).json({
                    success: true,
                    opportunity: newOpportunity,
                    data_source: 'mock',
                    message: 'Grant opportunity created successfully (mock data)'
                });
            }
            catch (error) {
                console.error('[GRANTS-MOCK] Error creating opportunity:', error);
                res.status(400).json({
                    error: 'Failed to create grant opportunity',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
            return [2 /*return*/];
        });
    }); });
    // Update grant opportunity status (mock)
    app.patch('/api/grants/opportunities/:id/status', express_1.default.json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id_1, status_3, validStatuses, oppIndex, oldStatus;
        return __generator(this, function (_a) {
            try {
                id_1 = req.params.id;
                status_3 = req.body.status;
                validStatuses = ['triage', 'eligible', 'ineligible', 'draft', 'ready', 'submitted', 'won', 'lost'];
                if (!validStatuses.includes(status_3)) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid status',
                            valid_statuses: validStatuses
                        })];
                }
                oppIndex = mockOpportunities.findIndex(function (opp) { return opp.id === id_1; });
                if (oppIndex === -1) {
                    return [2 /*return*/, res.status(404).json({ error: 'Grant opportunity not found' })];
                }
                oldStatus = mockOpportunities[oppIndex].status;
                mockOpportunities[oppIndex].status = status_3;
                mockOpportunities[oppIndex].updatedAt = new Date().toISOString();
                // Store status change artifact
                storeMockArtifact('grant.opportunity.status_changed', id_1, {
                    opportunity_id: id_1,
                    old_status: oldStatus,
                    new_status: status_3,
                    changed_by: 'mock_system'
                });
                res.json({
                    success: true,
                    opportunity: mockOpportunities[oppIndex],
                    data_source: 'mock',
                    message: "Status updated to ".concat(status_3)
                });
            }
            catch (error) {
                console.error('[GRANTS-MOCK] Error updating opportunity status:', error);
                res.status(500).json({
                    error: 'Failed to update opportunity status',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
            return [2 /*return*/];
        });
    }); });
    // ==================== MOCK GRANT APPLICATIONS ====================
    // Get applications for an opportunity (mock)
    app.get('/api/grants/opportunities/:oppId/applications', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var oppId_1, applications;
        return __generator(this, function (_a) {
            try {
                oppId_1 = req.params.oppId;
                applications = mockApplications.filter(function (app) { return app.oppId === oppId_1; });
                res.json({
                    applications: applications,
                    opportunity_id: oppId_1,
                    total: applications.length,
                    data_source: 'mock',
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('[GRANTS-MOCK] Error fetching applications:', error);
                res.status(500).json({
                    error: 'Failed to fetch applications',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
            return [2 /*return*/];
        });
    }); });
    // ==================== MOCK OUTREACH MANAGEMENT ====================
    // Get outreach for an opportunity (mock)
    app.get('/api/grants/opportunities/:oppId/outreach', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var oppId_2, _a, channel_1, status_4, outreachItems;
        return __generator(this, function (_b) {
            try {
                oppId_2 = req.params.oppId;
                _a = req.query, channel_1 = _a.channel, status_4 = _a.status;
                outreachItems = mockOutreach.filter(function (item) { return item.oppId === oppId_2; });
                // Apply filters
                if (channel_1) {
                    outreachItems = outreachItems.filter(function (item) { return item.channel === channel_1; });
                }
                if (status_4) {
                    outreachItems = outreachItems.filter(function (item) { return item.status === status_4; });
                }
                res.json({
                    outreach: outreachItems,
                    opportunity_id: oppId_2,
                    total: outreachItems.length,
                    filters_applied: { channel: channel_1, status: status_4 },
                    data_source: 'mock',
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('[GRANTS-MOCK] Error fetching outreach:', error);
                res.status(500).json({
                    error: 'Failed to fetch outreach',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
            return [2 /*return*/];
        });
    }); });
    // ==================== MOCK GRANTS DASHBOARD ====================
    // Get grants pipeline overview (mock)
    app.get('/api/grants/dashboard', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var opportunityStats, applicationStats, outreachStats;
        return __generator(this, function (_a) {
            try {
                opportunityStats = mockOpportunities.reduce(function (acc, opp) {
                    acc[opp.status] = (acc[opp.status] || 0) + 1;
                    return acc;
                }, {});
                applicationStats = mockApplications.reduce(function (acc, app) {
                    acc[app.status] = (acc[app.status] || 0) + 1;
                    return acc;
                }, {});
                outreachStats = mockOutreach.reduce(function (acc, item) {
                    var key = "".concat(item.channel, "_").concat(item.status);
                    acc[key] = (acc[key] || 0) + 1;
                    return acc;
                }, {});
                res.json({
                    pipeline_overview: {
                        opportunities: opportunityStats,
                        applications: applicationStats,
                        outreach: outreachStats
                    },
                    recent_opportunities: mockOpportunities.slice(-5),
                    data_source: 'mock',
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('[GRANTS-MOCK] Error fetching dashboard:', error);
                res.status(500).json({
                    error: 'Failed to fetch grants dashboard',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
            return [2 /*return*/];
        });
    }); });
    // ==================== MOCK GRANTS STATUS ====================
    // Get grants system status (mock)
    app.get('/api/grants/status', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                res.json({
                    system_status: 'operational_mock',
                    database_status: 'unavailable',
                    data_source: 'mock',
                    database_tables: ['grant_opportunity', 'grant_application', 'outreach'],
                    statistics: {
                        total_opportunities: mockOpportunities.length,
                        active_applications: mockApplications.filter(function (app) { return app.status === 'ready'; }).length,
                        pending_outreach: mockOutreach.filter(function (item) { return item.status === 'draft'; }).length
                    },
                    communication_integration: {
                        email_enabled: true,
                        sms_enabled: true,
                        form_enabled: true
                    },
                    endpoints: {
                        opportunities: '/api/grants/opportunities',
                        applications: '/api/grants/applications',
                        outreach: '/api/grants/outreach',
                        dashboard: '/api/grants/dashboard'
                    },
                    notice: 'Running with mock data due to database unavailability',
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('[GRANTS-MOCK] Error getting status:', error);
                res.status(500).json({
                    error: 'Failed to get grants system status',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
            return [2 /*return*/];
        });
    }); });
    console.log('🏆 [GRANTS-MOCK] Wolf Pack grants pipeline routes registered with mock data fallback');
}
