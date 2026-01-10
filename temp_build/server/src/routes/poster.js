"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.runPosterJob = runPosterJob;
exports.createPosterRouter = createPosterRouter;
var express_1 = require("express");
var media_vault_1 = require("../../packages/media-vault");
var metrics_engine_1 = require("../../packages/metrics-engine");
var drizzle_orm_1 = require("drizzle-orm");
var schema_1 = require("@shared/schema");
var db_1 = require("../db");
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
// Logs storage (in-memory for MVP)
var posterLogs = [];
function postToPlatform(platform, mediaId, caption, hashtags) {
    return __awaiter(this, void 0, void 0, function () {
        var mockUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Stub implementation - replace with actual platform APIs
                    console.log("[POSTER] Posting to ".concat(platform, ":"), { mediaId: mediaId, caption: caption, hashtags: hashtags });
                    // Simulate API call
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 1:
                    // Simulate API call
                    _a.sent();
                    mockUrl = "https://".concat(platform, ".com/posts/").concat(Date.now());
                    return [2 /*return*/, {
                            success: true,
                            postUrl: mockUrl,
                        }];
            }
        });
    });
}
function runPosterJob() {
    return __awaiter(this, void 0, void 0, function () {
        var now, processed, errors, scheduledPosts, _i, scheduledPosts_1, post, result, error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = new Date();
                    processed = 0;
                    errors = 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 16, , 17]);
                    return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.postQueue)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.postQueue.status, "scheduled"), (0, drizzle_orm_1.lte)(schema_1.postQueue.scheduled_at, now)))];
                case 2:
                    scheduledPosts = _a.sent();
                    _i = 0, scheduledPosts_1 = scheduledPosts;
                    _a.label = 3;
                case 3:
                    if (!(_i < scheduledPosts_1.length)) return [3 /*break*/, 15];
                    post = scheduledPosts_1[_i];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 12, , 14]);
                    return [4 /*yield*/, postToPlatform(post.platform, post.media_id, post.caption || "", post.hashtags || [])];
                case 5:
                    result = _a.sent();
                    if (!result.success) return [3 /*break*/, 9];
                    // Update post status
                    return [4 /*yield*/, db_1.db
                            .update(schema_1.postQueue)
                            .set({
                            status: "posted",
                            post_url: result.postUrl,
                            updated_at: new Date(),
                        })
                            .where((0, drizzle_orm_1.eq)(schema_1.postQueue.id, post.id))];
                case 6:
                    // Update post status
                    _a.sent();
                    // Increment media usage
                    return [4 /*yield*/, (0, media_vault_1.incrementMediaUsage)(post.media_id)];
                case 7:
                    // Increment media usage
                    _a.sent();
                    // Record metrics
                    return [4 /*yield*/, (0, metrics_engine_1.recordEvent)().catch(console.error)];
                case 8:
                    // Record metrics
                    _a.sent();
                    posterLogs.push({
                        timestamp: new Date().toISOString(),
                        action: "post.success",
                        orderId: post.id,
                        platform: post.platform,
                        success: true,
                    });
                    processed++;
                    return [3 /*break*/, 11];
                case 9: 
                // Mark as failed
                return [4 /*yield*/, db_1.db
                        .update(schema_1.postQueue)
                        .set({
                        status: "failed",
                        updated_at: new Date(),
                    })
                        .where((0, drizzle_orm_1.eq)(schema_1.postQueue.id, post.id))];
                case 10:
                    // Mark as failed
                    _a.sent();
                    posterLogs.push({
                        timestamp: new Date().toISOString(),
                        action: "post.failed",
                        orderId: post.id,
                        platform: post.platform,
                        success: false,
                        error: result.error || "Unknown error",
                    });
                    errors++;
                    _a.label = 11;
                case 11: return [3 /*break*/, 14];
                case 12:
                    error_1 = _a.sent();
                    console.error("[POSTER] Failed to post ".concat(post.id, ":"), error_1);
                    return [4 /*yield*/, db_1.db
                            .update(schema_1.postQueue)
                            .set({
                            status: "failed",
                            updated_at: new Date(),
                        })
                            .where((0, drizzle_orm_1.eq)(schema_1.postQueue.id, post.id))];
                case 13:
                    _a.sent();
                    posterLogs.push({
                        timestamp: new Date().toISOString(),
                        action: "post.error",
                        orderId: post.id,
                        platform: post.platform,
                        success: false,
                        error: error_1.message,
                    });
                    errors++;
                    return [3 /*break*/, 14];
                case 14:
                    _i++;
                    return [3 /*break*/, 3];
                case 15:
                    // Keep only last 100 logs
                    if (posterLogs.length > 100) {
                        posterLogs.splice(0, posterLogs.length - 100);
                    }
                    return [3 /*break*/, 17];
                case 16:
                    error_2 = _a.sent();
                    console.error("[POSTER] Job failed:", error_2);
                    errors++;
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/, { processed: processed, errors: errors }];
            }
        });
    });
}
function createPosterRouter() {
    var _this = this;
    var router = (0, express_1.Router)();
    // POST /api/jobs/poster (Vercel cron endpoint)
    router.post("/jobs/poster", function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runPosterJob()];
                case 1:
                    result = _a.sent();
                    res.json(__assign({ ok: true }, result));
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error("Poster job error:", error_3);
                    res.status(500).json({ ok: false, error: error_3.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // GET /api/jobs/poster/logs (admin only)
    router.get("/jobs/poster/logs", requireOperatorToken, function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                res.json({ ok: true, logs: posterLogs });
            }
            catch (error) {
                console.error("Failed to get poster logs:", error);
                res.status(500).json({ ok: false, error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    return router;
}
