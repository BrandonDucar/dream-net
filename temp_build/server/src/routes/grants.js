"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.registerGrantsRoutes = registerGrantsRoutes;
var express_1 = require("express");
var db_1 = require("../db");
var drizzle_orm_1 = require("drizzle-orm");
var grants_schema_1 = require("../../shared/grants-schema");
// Store communication artifact for grants
function storeGrantArtifact(kind, ref, data) {
    return __awaiter(this, void 0, void 0, function () {
        var artifact;
        return __generator(this, function (_a) {
            try {
                artifact = {
                    id: "grant_artifact_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9)),
                    created_at: new Date().toISOString()
                };
                console.log("[GRANTS] Artifact stored: ".concat(kind, " | ").concat(ref, " | ").concat(JSON.stringify(data)));
                return [2 /*return*/, artifact];
            }
            catch (error) {
                console.error('[GRANTS] Error storing artifact:', error);
                throw error;
            }
            return [2 /*return*/];
        });
    });
}
// Check if database is available
function isDatabaseAvailable() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.db.select().from(grants_schema_1.grantOpportunity).limit(1)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    error_1 = _a.sent();
                    console.log('[GRANTS] Database unavailable, falling back to mock routes');
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function registerGrantsRoutes(app) {
    // ==================== GRANT OPPORTUNITIES ====================
    var _this = this;
    // Get all grant opportunities with filtering
    app.get('/api/grants/opportunities', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, status_1, source, _b, limit, query, conditions, opportunities, error_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _a = req.query, status_1 = _a.status, source = _a.source, _b = _a.limit, limit = _b === void 0 ? '50' : _b;
                    query = db_1.db.select().from(grants_schema_1.grantOpportunity);
                    conditions = [];
                    if (status_1) {
                        conditions.push((0, drizzle_orm_1.eq)(grants_schema_1.grantOpportunity.status, status_1));
                    }
                    if (source) {
                        conditions.push((0, drizzle_orm_1.eq)(grants_schema_1.grantOpportunity.source, source));
                    }
                    if (conditions.length > 0) {
                        query = query.where(drizzle_orm_1.and.apply(void 0, conditions));
                    }
                    return [4 /*yield*/, query
                            .orderBy((0, drizzle_orm_1.desc)(grants_schema_1.grantOpportunity.createdAt))
                            .limit(parseInt(limit))];
                case 1:
                    opportunities = _c.sent();
                    res.json({
                        opportunities: opportunities,
                        total: opportunities.length,
                        filters_applied: { status: status_1, source: source },
                        timestamp: new Date().toISOString()
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _c.sent();
                    console.error('[GRANTS] Error fetching opportunities:', error_2);
                    res.status(500).json({
                        error: 'Failed to fetch grant opportunities',
                        details: error_2 instanceof Error ? error_2.message : 'Unknown error'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Create new grant opportunity
    app.post('/api/grants/opportunities', express_1.default.json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var validatedData, opportunity, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    validatedData = grants_schema_1.insertGrantOpportunitySchema.parse(req.body);
                    return [4 /*yield*/, db_1.db
                            .insert(grants_schema_1.grantOpportunity)
                            .values(validatedData)
                            .returning()];
                case 1:
                    opportunity = (_a.sent())[0];
                    // Store creation artifact
                    return [4 /*yield*/, storeGrantArtifact('grant.opportunity.created', opportunity.id.toString(), {
                            opportunity_id: opportunity.id,
                            source: opportunity.source,
                            name: opportunity.name,
                            created_by: 'system' // TODO: Add user tracking
                        })];
                case 2:
                    // Store creation artifact
                    _a.sent();
                    res.status(201).json({
                        success: true,
                        opportunity: opportunity,
                        message: 'Grant opportunity created successfully'
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('[GRANTS] Error creating opportunity:', error_3);
                    res.status(400).json({
                        error: 'Failed to create grant opportunity',
                        details: error_3 instanceof Error ? error_3.message : 'Unknown error'
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // Update grant opportunity status
    app.patch('/api/grants/opportunities/:id/status', express_1.default.json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, status_2, validStatuses, updated, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    id = req.params.id;
                    status_2 = req.body.status;
                    validStatuses = ['triage', 'eligible', 'ineligible', 'draft', 'ready', 'submitted', 'won', 'lost'];
                    if (!validStatuses.includes(status_2)) {
                        return [2 /*return*/, res.status(400).json({
                                error: 'Invalid status',
                                valid_statuses: validStatuses
                            })];
                    }
                    return [4 /*yield*/, db_1.db
                            .update(grants_schema_1.grantOpportunity)
                            .set({
                            status: status_2,
                            updatedAt: new Date()
                        })
                            .where((0, drizzle_orm_1.eq)(grants_schema_1.grantOpportunity.id, BigInt(id)))
                            .returning()];
                case 1:
                    updated = (_a.sent())[0];
                    if (!updated) {
                        return [2 /*return*/, res.status(404).json({ error: 'Grant opportunity not found' })];
                    }
                    // Store status change artifact
                    return [4 /*yield*/, storeGrantArtifact('grant.opportunity.status_changed', id, {
                            opportunity_id: id,
                            old_status: 'unknown', // TODO: Track previous status
                            new_status: status_2,
                            changed_by: 'system'
                        })];
                case 2:
                    // Store status change artifact
                    _a.sent();
                    res.json({
                        success: true,
                        opportunity: updated,
                        message: "Status updated to ".concat(status_2)
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error('[GRANTS] Error updating opportunity status:', error_4);
                    res.status(500).json({
                        error: 'Failed to update opportunity status',
                        details: error_4 instanceof Error ? error_4.message : 'Unknown error'
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // ==================== GRANT APPLICATIONS ====================
    // Get applications for an opportunity
    app.get('/api/grants/opportunities/:oppId/applications', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var oppId, applications, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    oppId = req.params.oppId;
                    return [4 /*yield*/, db_1.db
                            .select()
                            .from(grants_schema_1.grantApplication)
                            .where((0, drizzle_orm_1.eq)(grants_schema_1.grantApplication.oppId, BigInt(oppId)))
                            .orderBy((0, drizzle_orm_1.desc)(grants_schema_1.grantApplication.createdAt))];
                case 1:
                    applications = _a.sent();
                    res.json({
                        applications: applications,
                        opportunity_id: oppId,
                        total: applications.length,
                        timestamp: new Date().toISOString()
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error('[GRANTS] Error fetching applications:', error_5);
                    res.status(500).json({
                        error: 'Failed to fetch applications',
                        details: error_5 instanceof Error ? error_5.message : 'Unknown error'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Create new grant application
    app.post('/api/grants/applications', express_1.default.json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var validatedData, application, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    validatedData = grants_schema_1.insertGrantApplicationSchema.parse(req.body);
                    return [4 /*yield*/, db_1.db
                            .insert(grants_schema_1.grantApplication)
                            .values(validatedData)
                            .returning()];
                case 1:
                    application = (_a.sent())[0];
                    // Store creation artifact
                    return [4 /*yield*/, storeGrantArtifact('grant.application.created', application.id.toString(), {
                            application_id: application.id,
                            opportunity_id: application.oppId,
                            status: application.status,
                            created_by: 'system'
                        })];
                case 2:
                    // Store creation artifact
                    _a.sent();
                    res.status(201).json({
                        success: true,
                        application: application,
                        message: 'Grant application created successfully'
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    console.error('[GRANTS] Error creating application:', error_6);
                    res.status(400).json({
                        error: 'Failed to create grant application',
                        details: error_6 instanceof Error ? error_6.message : 'Unknown error'
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // ==================== OUTREACH MANAGEMENT ====================
    // Get outreach for an opportunity
    app.get('/api/grants/opportunities/:oppId/outreach', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var oppId, _a, channel, status_3, query, conditions, outreachItems, error_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    oppId = req.params.oppId;
                    _a = req.query, channel = _a.channel, status_3 = _a.status;
                    query = db_1.db
                        .select()
                        .from(grants_schema_1.outreach)
                        .where((0, drizzle_orm_1.eq)(grants_schema_1.outreach.oppId, BigInt(oppId)));
                    conditions = [(0, drizzle_orm_1.eq)(grants_schema_1.outreach.oppId, BigInt(oppId))];
                    if (channel) {
                        conditions.push((0, drizzle_orm_1.eq)(grants_schema_1.outreach.channel, channel));
                    }
                    if (status_3) {
                        conditions.push((0, drizzle_orm_1.eq)(grants_schema_1.outreach.status, status_3));
                    }
                    return [4 /*yield*/, query
                            .where(drizzle_orm_1.and.apply(void 0, conditions))
                            .orderBy((0, drizzle_orm_1.desc)(grants_schema_1.outreach.createdAt))];
                case 1:
                    outreachItems = _b.sent();
                    res.json({
                        outreach: outreachItems,
                        opportunity_id: oppId,
                        total: outreachItems.length,
                        filters_applied: { channel: channel, status: status_3 },
                        timestamp: new Date().toISOString()
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _b.sent();
                    console.error('[GRANTS] Error fetching outreach:', error_7);
                    res.status(500).json({
                        error: 'Failed to fetch outreach',
                        details: error_7 instanceof Error ? error_7.message : 'Unknown error'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Create outreach record
    app.post('/api/grants/outreach', express_1.default.json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var validatedData, outreachRecord, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    validatedData = grants_schema_1.insertOutreachSchema.parse(req.body);
                    return [4 /*yield*/, db_1.db
                            .insert(grants_schema_1.outreach)
                            .values(validatedData)
                            .returning()];
                case 1:
                    outreachRecord = (_a.sent())[0];
                    // Store creation artifact
                    return [4 /*yield*/, storeGrantArtifact('grant.outreach.created', outreachRecord.id.toString(), {
                            outreach_id: outreachRecord.id,
                            opportunity_id: outreachRecord.oppId,
                            channel: outreachRecord.channel,
                            to_addr: outreachRecord.toAddr,
                            created_by: 'system'
                        })];
                case 2:
                    // Store creation artifact
                    _a.sent();
                    res.status(201).json({
                        success: true,
                        outreach: outreachRecord,
                        message: 'Outreach record created successfully'
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_8 = _a.sent();
                    console.error('[GRANTS] Error creating outreach:', error_8);
                    res.status(400).json({
                        error: 'Failed to create outreach record',
                        details: error_8 instanceof Error ? error_8.message : 'Unknown error'
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // Send outreach (integrates with communication system)
    app.post('/api/grants/outreach/:id/send', express_1.default.json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, _a, message, subject, outreachRecord, sendResult, providerId, _b, emailResponse, smsResponse, newStatus, updated, error_9;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 14, , 15]);
                    id = req.params.id;
                    _a = req.body, message = _a.message, subject = _a.subject;
                    return [4 /*yield*/, db_1.db
                            .select()
                            .from(grants_schema_1.outreach)
                            .where((0, drizzle_orm_1.eq)(grants_schema_1.outreach.id, BigInt(id)))
                            .limit(1)];
                case 1:
                    outreachRecord = (_c.sent())[0];
                    if (!outreachRecord) {
                        return [2 /*return*/, res.status(404).json({ error: 'Outreach record not found' })];
                    }
                    if (outreachRecord.status !== grants_schema_1.OutreachStatus.DRAFT) {
                        return [2 /*return*/, res.status(400).json({
                                error: 'Outreach already sent',
                                current_status: outreachRecord.status
                            })];
                    }
                    sendResult = void 0;
                    providerId = void 0;
                    _b = outreachRecord.channel;
                    switch (_b) {
                        case grants_schema_1.OutreachChannel.EMAIL: return [3 /*break*/, 2];
                        case grants_schema_1.OutreachChannel.SMS: return [3 /*break*/, 5];
                        case grants_schema_1.OutreachChannel.FORM: return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 10];
                case 2: return [4 /*yield*/, fetch("".concat(req.protocol, "://").concat(req.get('host'), "/api/comm/email"), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            to: outreachRecord.toAddr,
                            subject: subject || "Grant Opportunity: ".concat(outreachRecord.oppId),
                            body: message
                        })
                    })];
                case 3:
                    emailResponse = _c.sent();
                    return [4 /*yield*/, emailResponse.json()];
                case 4:
                    sendResult = _c.sent();
                    providerId = sendResult.messageId;
                    return [3 /*break*/, 11];
                case 5: return [4 /*yield*/, fetch("".concat(req.protocol, "://").concat(req.get('host'), "/api/comm/sms"), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            to: outreachRecord.toAddr,
                            body: message
                        })
                    })];
                case 6:
                    smsResponse = _c.sent();
                    return [4 /*yield*/, smsResponse.json()];
                case 7:
                    sendResult = _c.sent();
                    providerId = sendResult.sid;
                    return [3 /*break*/, 11];
                case 8: 
                // Store as form submission artifact
                return [4 /*yield*/, storeGrantArtifact('grant.outreach.form_submission', id, {
                        outreach_id: id,
                        form_data: { message: message, subject: subject },
                        to_addr: outreachRecord.toAddr
                    })];
                case 9:
                    // Store as form submission artifact
                    _c.sent();
                    sendResult = { success: true, mode: 'form_submission' };
                    providerId = "form_".concat(Date.now());
                    return [3 /*break*/, 11];
                case 10: return [2 /*return*/, res.status(400).json({ error: 'Unsupported outreach channel' })];
                case 11:
                    newStatus = sendResult.error ? grants_schema_1.OutreachStatus.BOUNCED : grants_schema_1.OutreachStatus.SENT;
                    return [4 /*yield*/, db_1.db
                            .update(grants_schema_1.outreach)
                            .set({
                            status: newStatus,
                            providerId: providerId,
                            updatedAt: new Date()
                        })
                            .where((0, drizzle_orm_1.eq)(grants_schema_1.outreach.id, BigInt(id)))
                            .returning()];
                case 12:
                    updated = (_c.sent())[0];
                    // Store send artifact
                    return [4 /*yield*/, storeGrantArtifact('grant.outreach.sent', id, {
                            outreach_id: id,
                            channel: outreachRecord.channel,
                            status: newStatus,
                            provider_id: providerId,
                            send_result: sendResult
                        })];
                case 13:
                    // Store send artifact
                    _c.sent();
                    res.json({
                        success: !sendResult.error,
                        outreach: updated,
                        send_result: sendResult,
                        message: sendResult.error ? 'Outreach failed to send' : 'Outreach sent successfully'
                    });
                    return [3 /*break*/, 15];
                case 14:
                    error_9 = _c.sent();
                    console.error('[GRANTS] Error sending outreach:', error_9);
                    res.status(500).json({
                        error: 'Failed to send outreach',
                        details: error_9 instanceof Error ? error_9.message : 'Unknown error'
                    });
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    }); });
    // ==================== GRANTS DASHBOARD ====================
    // Get grants pipeline overview
    app.get('/api/grants/dashboard', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var opportunityStats, applicationStats, outreachStats, recentOpportunities, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, db_1.db
                            .select({
                            status: grants_schema_1.grantOpportunity.status,
                            count: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["cast(count(*) as int)"], ["cast(count(*) as int)"])))
                        })
                            .from(grants_schema_1.grantOpportunity)
                            .groupBy(grants_schema_1.grantOpportunity.status)];
                case 1:
                    opportunityStats = _a.sent();
                    return [4 /*yield*/, db_1.db
                            .select({
                            status: grants_schema_1.grantApplication.status,
                            count: (0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["cast(count(*) as int)"], ["cast(count(*) as int)"])))
                        })
                            .from(grants_schema_1.grantApplication)
                            .groupBy(grants_schema_1.grantApplication.status)];
                case 2:
                    applicationStats = _a.sent();
                    return [4 /*yield*/, db_1.db
                            .select({
                            channel: grants_schema_1.outreach.channel,
                            status: grants_schema_1.outreach.status,
                            count: (0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["cast(count(*) as int)"], ["cast(count(*) as int)"])))
                        })
                            .from(grants_schema_1.outreach)
                            .groupBy(grants_schema_1.outreach.channel, grants_schema_1.outreach.status)];
                case 3:
                    outreachStats = _a.sent();
                    return [4 /*yield*/, db_1.db
                            .select()
                            .from(grants_schema_1.grantOpportunity)
                            .orderBy((0, drizzle_orm_1.desc)(grants_schema_1.grantOpportunity.createdAt))
                            .limit(10)];
                case 4:
                    recentOpportunities = _a.sent();
                    res.json({
                        pipeline_overview: {
                            opportunities: opportunityStats.reduce(function (acc, stat) {
                                acc[stat.status] = stat.count;
                                return acc;
                            }, {}),
                            applications: applicationStats.reduce(function (acc, stat) {
                                acc[stat.status] = stat.count;
                                return acc;
                            }, {}),
                            outreach: outreachStats.reduce(function (acc, stat) {
                                var key = "".concat(stat.channel, "_").concat(stat.status);
                                acc[key] = stat.count;
                                return acc;
                            }, {})
                        },
                        recent_opportunities: recentOpportunities,
                        timestamp: new Date().toISOString()
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_10 = _a.sent();
                    console.error('[GRANTS] Error fetching dashboard:', error_10);
                    res.status(500).json({
                        error: 'Failed to fetch grants dashboard',
                        details: error_10 instanceof Error ? error_10.message : 'Unknown error'
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    // ==================== GRANTS STATUS ====================
    // Get grants system status
    app.get('/api/grants/status', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var totalOpportunities, activeApplications, pendingOutreach, error_11;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, db_1.db
                            .select({ count: (0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["cast(count(*) as int)"], ["cast(count(*) as int)"]))) })
                            .from(grants_schema_1.grantOpportunity)];
                case 1:
                    totalOpportunities = _d.sent();
                    return [4 /*yield*/, db_1.db
                            .select({ count: (0, drizzle_orm_1.sql)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["cast(count(*) as int)"], ["cast(count(*) as int)"]))) })
                            .from(grants_schema_1.grantApplication)
                            .where((0, drizzle_orm_1.eq)(grants_schema_1.grantApplication.status, grants_schema_1.GrantApplicationStatus.READY))];
                case 2:
                    activeApplications = _d.sent();
                    return [4 /*yield*/, db_1.db
                            .select({ count: (0, drizzle_orm_1.sql)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["cast(count(*) as int)"], ["cast(count(*) as int)"]))) })
                            .from(grants_schema_1.outreach)
                            .where((0, drizzle_orm_1.eq)(grants_schema_1.outreach.status, grants_schema_1.OutreachStatus.DRAFT))];
                case 3:
                    pendingOutreach = _d.sent();
                    res.json({
                        system_status: 'operational',
                        database_tables: ['grant_opportunity', 'grant_application', 'outreach'],
                        statistics: {
                            total_opportunities: ((_a = totalOpportunities[0]) === null || _a === void 0 ? void 0 : _a.count) || 0,
                            active_applications: ((_b = activeApplications[0]) === null || _b === void 0 ? void 0 : _b.count) || 0,
                            pending_outreach: ((_c = pendingOutreach[0]) === null || _c === void 0 ? void 0 : _c.count) || 0
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
                        timestamp: new Date().toISOString()
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_11 = _d.sent();
                    console.error('[GRANTS] Error getting status:', error_11);
                    res.status(500).json({
                        error: 'Failed to get grants system status',
                        details: error_11 instanceof Error ? error_11.message : 'Unknown error'
                    });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    // Check database availability and register mock routes if needed
    isDatabaseAvailable().then(function (available) {
        if (!available) {
            console.log('🏆 [GRANTS] Database unavailable, mock routes will be registered separately');
        }
        else {
            console.log('🏆 [GRANTS] Wolf Pack grants pipeline routes registered with Reality Contract compliance');
        }
    });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
