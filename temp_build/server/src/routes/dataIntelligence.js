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
exports.registerDataIntelligenceRoutes = registerDataIntelligenceRoutes;
var DataIntelligenceService_1 = require("../services/DataIntelligenceService");
function registerDataIntelligenceRoutes(app) {
    var _this = this;
    // Get aggregated intelligence insights
    app.get('/api/intelligence/insights', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var insights, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, DataIntelligenceService_1.dataIntelligenceService.getAggregatedInsights()];
                case 1:
                    insights = _a.sent();
                    res.json({ success: true, insights: insights });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Intelligence insights error:', error_1);
                    res.status(500).json({ success: false, error: error_1.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Get Eric's specific profile
    app.get('/api/intelligence/eric-profile', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var eric, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, DataIntelligenceService_1.dataIntelligenceService.getEricProfile()];
                case 1:
                    eric = _a.sent();
                    res.json({ success: true, eric: eric });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Eric profile error:', error_2);
                    res.status(500).json({ success: false, error: error_2.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Get business dashboard metrics
    app.get('/api/intelligence/dashboard', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var dashboard, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, DataIntelligenceService_1.dataIntelligenceService.getDashboardMetrics()];
                case 1:
                    dashboard = _a.sent();
                    res.json({ success: true, dashboard: dashboard });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error('Dashboard metrics error:', error_3);
                    res.status(500).json({ success: false, error: error_3.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Track premium unlock events
    app.post('/api/intelligence/premium-unlock', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, keywords, amount, paymentMethod, userId, error_4;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _a = req.body, keywords = _a.keywords, amount = _a.amount, paymentMethod = _a.paymentMethod;
                    userId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || req.ip || 'anonymous';
                    return [4 /*yield*/, DataIntelligenceService_1.dataIntelligenceService.trackPremiumUnlock({
                            userId: userId,
                            keywords: keywords,
                            amount: amount,
                            paymentMethod: paymentMethod,
                            timestamp: new Date().toISOString(),
                            userAgent: req.headers['user-agent'] || '',
                            ip: req.ip
                        })];
                case 1:
                    _c.sent();
                    res.json({ success: true, message: 'Premium unlock tracked' });
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _c.sent();
                    console.error('Premium unlock tracking error:', error_4);
                    res.status(500).json({ success: false, error: error_4.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Track competitor analysis events
    app.post('/api/intelligence/competitor-analysis', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, competitorUrl, analysisType, keywords, insights, userId, error_5;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _a = req.body, competitorUrl = _a.competitorUrl, analysisType = _a.analysisType, keywords = _a.keywords, insights = _a.insights;
                    userId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || req.ip || 'anonymous';
                    return [4 /*yield*/, DataIntelligenceService_1.dataIntelligenceService.trackCompetitorAnalysis({
                            userId: userId,
                            competitorUrl: competitorUrl,
                            analysisType: analysisType,
                            keywords: keywords,
                            insights: insights,
                            timestamp: new Date().toISOString(),
                            userAgent: req.headers['user-agent'] || '',
                            ip: req.ip
                        })];
                case 1:
                    _c.sent();
                    res.json({ success: true, message: 'Competitor analysis tracked' });
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _c.sent();
                    console.error('Competitor analysis tracking error:', error_5);
                    res.status(500).json({ success: false, error: error_5.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Track user behavior patterns
    app.post('/api/intelligence/user-behavior', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, action, context_1, metadata, userId, error_6;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _a = req.body, action = _a.action, context_1 = _a.context, metadata = _a.metadata;
                    userId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || req.ip || 'anonymous';
                    return [4 /*yield*/, DataIntelligenceService_1.dataIntelligenceService.trackUserBehavior({
                            userId: userId,
                            action: action,
                            context: context_1,
                            metadata: metadata,
                            timestamp: new Date().toISOString(),
                            userAgent: req.headers['user-agent'] || '',
                            ip: req.ip
                        })];
                case 1:
                    _c.sent();
                    res.json({ success: true, message: 'User behavior tracked' });
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _c.sent();
                    console.error('User behavior tracking error:', error_6);
                    res.status(500).json({ success: false, error: error_6.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    console.log('📊 [Data Intelligence] Routes registered successfully');
}
