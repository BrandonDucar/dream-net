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
exports.createDreamSnailRouter = createDreamSnailRouter;
var express_1 = require("express");
var DreamSnail_1 = require("../snail/DreamSnail");
function createDreamSnailRouter() {
    var _this = this;
    var router = (0, express_1.Router)();
    // GET /api/snail/trail - Get user's trail
    router.get("/snail/trail", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, includeEncrypted, trails;
        return __generator(this, function (_a) {
            try {
                userId = req.headers["x-user-id"] || req.query.userId || "anonymous";
                includeEncrypted = req.query.includeEncrypted === "true";
                trails = DreamSnail_1.dreamSnail.getUserTrail(userId, includeEncrypted);
                res.json({ ok: true, trails: trails, count: trails.length });
            }
            catch (error) {
                console.error("Failed to get snail trail:", error);
                res.status(500).json({ ok: false, error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // POST /api/snail/trail - Record a trail event
    router.post("/snail/trail", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, _a, eventType, eventData, metadata, trail;
        return __generator(this, function (_b) {
            try {
                userId = req.headers["x-user-id"] || req.body.userId || "anonymous";
                _a = req.body, eventType = _a.eventType, eventData = _a.eventData, metadata = _a.metadata;
                if (!eventType) {
                    return [2 /*return*/, res.status(400).json({ ok: false, error: "eventType is required" })];
                }
                trail = DreamSnail_1.dreamSnail.recordTrail(userId, eventType, eventData || {}, metadata);
                res.json({ ok: true, trail: trail });
            }
            catch (error) {
                console.error("Failed to record snail trail:", error);
                res.status(500).json({ ok: false, error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/snail/privacy - Get privacy config
    router.get("/snail/privacy", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, config;
        return __generator(this, function (_a) {
            try {
                userId = req.headers["x-user-id"] || req.query.userId || "anonymous";
                config = DreamSnail_1.dreamSnail.getPrivacyConfig(userId);
                res.json({ ok: true, config: config });
            }
            catch (error) {
                console.error("Failed to get privacy config:", error);
                res.status(500).json({ ok: false, error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // PUT /api/snail/privacy - Update privacy config
    router.put("/snail/privacy", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, updates, config;
        return __generator(this, function (_a) {
            try {
                userId = req.headers["x-user-id"] || req.body.userId || "anonymous";
                updates = req.body;
                config = DreamSnail_1.dreamSnail.updatePrivacyConfig(userId, updates);
                res.json({ ok: true, config: config });
            }
            catch (error) {
                console.error("Failed to update privacy config:", error);
                res.status(500).json({ ok: false, error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/snail/insights - Get user insights
    router.get("/snail/insights", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, severity, insights;
        return __generator(this, function (_a) {
            try {
                userId = req.headers["x-user-id"] || req.query.userId || "anonymous";
                severity = req.query.severity;
                insights = DreamSnail_1.dreamSnail.getUserInsights(userId, severity);
                res.json({ ok: true, insights: insights, count: insights.length });
            }
            catch (error) {
                console.error("Failed to get snail insights:", error);
                res.status(500).json({ ok: false, error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/snail/analytics - Get analytics
    router.get("/snail/analytics", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, analytics;
        return __generator(this, function (_a) {
            try {
                userId = req.headers["x-user-id"] || req.query.userId || "anonymous";
                analytics = DreamSnail_1.dreamSnail.getAnalytics(userId);
                res.json({ ok: true, analytics: analytics });
            }
            catch (error) {
                console.error("Failed to get snail analytics:", error);
                res.status(500).json({ ok: false, error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/snail/verify - Verify trail integrity
    router.get("/snail/verify", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, verification;
        return __generator(this, function (_a) {
            try {
                userId = req.headers["x-user-id"] || req.query.userId || "anonymous";
                verification = DreamSnail_1.dreamSnail.verifyTrailIntegrity(userId);
                res.json({ ok: true, verification: verification });
            }
            catch (error) {
                console.error("Failed to verify trail:", error);
                res.status(500).json({ ok: false, error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    return router;
}
