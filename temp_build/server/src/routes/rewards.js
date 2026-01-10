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
exports.createRewardsRouter = createRewardsRouter;
var express_1 = require("express");
var rewards_engine_1 = require("../../packages/rewards-engine");
var metrics_engine_1 = require("../../packages/metrics-engine");
// Simple auth middleware for admin routes
function requireOperatorToken(req, res, next) {
    var authHeader = req.headers.authorization;
    var token = process.env.OPERATOR_TOKEN;
    if (!token) {
        return res.status(500).json({ error: "OPERATOR_TOKEN not configured" });
    }
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid authorization header" });
    }
    var providedToken = authHeader.substring(7);
    if (providedToken !== token) {
        return res.status(403).json({ error: "Invalid token" });
    }
    next();
}
// Extract userId from session/auth (simplified for MVP)
function getUserId(req) {
    // In production, extract from JWT or session
    // For MVP, use header or query param
    return req.headers["x-user-id"] || req.query.userId || null;
}
function createRewardsRouter() {
    var _this = this;
    var router = (0, express_1.Router)();
    // POST /api/rewards/login
    router.post("/rewards/login", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, balance, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    userId = getUserId(req);
                    if (!userId) {
                        return [2 /*return*/, res.status(401).json({ error: "User ID required" })];
                    }
                    return [4 /*yield*/, (0, rewards_engine_1.grantReward)(userId, "login")];
                case 1:
                    balance = _a.sent();
                    return [4 /*yield*/, (0, metrics_engine_1.recordEvent)().catch(console.error)];
                case 2:
                    _a.sent();
                    res.json({ ok: true, balance: balance });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Failed to grant login reward:", error_1);
                    res.status(500).json({ error: error_1.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // POST /api/rewards/daily-claim
    router.post("/rewards/daily-claim", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, balance, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    userId = getUserId(req);
                    if (!userId) {
                        return [2 /*return*/, res.status(401).json({ error: "User ID required" })];
                    }
                    return [4 /*yield*/, (0, rewards_engine_1.grantReward)(userId, "daily-claim")];
                case 1:
                    balance = _a.sent();
                    return [4 /*yield*/, (0, metrics_engine_1.recordEvent)().catch(console.error)];
                case 2:
                    _a.sent();
                    res.json({ ok: true, balance: balance });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("Failed to grant daily claim:", error_2);
                    res.status(400).json({ error: error_2.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // POST /api/rewards/weekly-claim
    router.post("/rewards/weekly-claim", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, balance, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    userId = getUserId(req);
                    if (!userId) {
                        return [2 /*return*/, res.status(401).json({ error: "User ID required" })];
                    }
                    return [4 /*yield*/, (0, rewards_engine_1.grantReward)(userId, "weekly-claim")];
                case 1:
                    balance = _a.sent();
                    return [4 /*yield*/, (0, metrics_engine_1.recordEvent)().catch(console.error)];
                case 2:
                    _a.sent();
                    res.json({ ok: true, balance: balance });
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error("Failed to grant weekly claim:", error_3);
                    res.status(400).json({ error: error_3.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // GET /api/rewards/balance
    router.get("/rewards/balance", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, balance, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = getUserId(req);
                    if (!userId) {
                        return [2 /*return*/, res.status(401).json({ error: "User ID required" })];
                    }
                    return [4 /*yield*/, (0, rewards_engine_1.getUserBalance)(userId)];
                case 1:
                    balance = _a.sent();
                    res.json({ ok: true, balance: balance });
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error("Failed to get balance:", error_4);
                    res.status(500).json({ error: error_4.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // GET /api/rewards/history
    router.get("/rewards/history", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, limit, events, error_5;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    userId = getUserId(req);
                    if (!userId) {
                        return [2 /*return*/, res.status(401).json({ error: "User ID required" })];
                    }
                    limit = parseInt(String((_a = req.query.limit) !== null && _a !== void 0 ? _a : "50"), 10) || 50;
                    return [4 /*yield*/, (0, rewards_engine_1.listRewardEvents)(userId, limit)];
                case 1:
                    events = _b.sent();
                    res.json({ ok: true, events: events });
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _b.sent();
                    console.error("Failed to get reward history:", error_5);
                    res.status(500).json({ error: error_5.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // GET /api/rewards/leaderboard
    router.get("/rewards/leaderboard", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, type, _c, limit, limitNum, balances, leaderboard, error_6;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    _a = req.query, _b = _a.type, type = _b === void 0 ? "dream" : _b, _c = _a.limit, limit = _c === void 0 ? "100" : _c;
                    limitNum = parseInt(String(limit), 10) || 100;
                    return [4 /*yield*/, (0, rewards_engine_1.getAllBalances)()];
                case 1:
                    balances = _d.sent();
                    leaderboard = void 0;
                    if (type === "dream") {
                        leaderboard = balances
                            .sort(function (a, b) { return b.dream - a.dream; })
                            .slice(0, limitNum)
                            .map(function (b, i) { return ({
                            rank: i + 1,
                            userId: b.userId,
                            dream: b.dream,
                            sheep: b.sheep,
                            streakDays: b.streakDays || 0,
                        }); });
                    }
                    else if (type === "sheep") {
                        leaderboard = balances
                            .sort(function (a, b) { return b.sheep - a.sheep; })
                            .slice(0, limitNum)
                            .map(function (b, i) { return ({
                            rank: i + 1,
                            userId: b.userId,
                            dream: b.dream,
                            sheep: b.sheep,
                            streakDays: b.streakDays || 0,
                        }); });
                    }
                    else if (type === "streak") {
                        leaderboard = balances
                            .sort(function (a, b) { return (b.streakDays || 0) - (a.streakDays || 0); })
                            .slice(0, limitNum)
                            .map(function (b, i) { return ({
                            rank: i + 1,
                            userId: b.userId,
                            dream: b.dream,
                            sheep: b.sheep,
                            streakDays: b.streakDays || 0,
                        }); });
                    }
                    else {
                        return [2 /*return*/, res.status(400).json({ error: "Invalid type. Use: dream, sheep, or streak" })];
                    }
                    res.json({ ok: true, leaderboard: leaderboard, type: type });
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _d.sent();
                    console.error("Failed to get leaderboard:", error_6);
                    res.status(500).json({ error: error_6.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // ============================================
    // ADMIN ROUTES
    // ============================================
    // GET /api/admin/rewards/:userId
    router.get("/admin/rewards/:userId", requireOperatorToken, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var balance, events, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, rewards_engine_1.getUserBalance)(req.params.userId)];
                case 1:
                    balance = _a.sent();
                    return [4 /*yield*/, (0, rewards_engine_1.listRewardEvents)(req.params.userId, 50)];
                case 2:
                    events = _a.sent();
                    res.json({ ok: true, balance: balance, events: events });
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _a.sent();
                    console.error("Failed to get user rewards:", error_7);
                    res.status(500).json({ error: error_7.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // POST /api/admin/rewards/:userId/adjust
    router.post("/admin/rewards/:userId/adjust", requireOperatorToken, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, deltaDream, deltaSheep, reason, balance, error_8;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, deltaDream = _a.deltaDream, deltaSheep = _a.deltaSheep, reason = _a.reason;
                    if (deltaDream === undefined && deltaSheep === undefined) {
                        return [2 /*return*/, res.status(400).json({ error: "At least one delta (deltaDream or deltaSheep) is required" })];
                    }
                    return [4 /*yield*/, (0, rewards_engine_1.grantReward)(req.params.userId, "admin-adjust", {
                            deltaDream: deltaDream !== null && deltaDream !== void 0 ? deltaDream : 0,
                            deltaSheep: deltaSheep !== null && deltaSheep !== void 0 ? deltaSheep : 0,
                            reason: reason,
                            meta: { reason: reason, adjustedBy: "admin" },
                        })];
                case 1:
                    balance = _b.sent();
                    res.json({ ok: true, balance: balance });
                    return [3 /*break*/, 3];
                case 2:
                    error_8 = _b.sent();
                    console.error("Failed to adjust balance:", error_8);
                    res.status(500).json({ error: error_8.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    return router;
}
