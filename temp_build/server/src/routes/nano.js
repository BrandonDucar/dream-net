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
exports.registerNanoRoutes = registerNanoRoutes;
var zod_1 = require("zod");
var index_1 = require("../../packages/shared/model-registry/index");
var replitAuth_1 = require("../replitAuth");
var db_1 = require("../db");
var schema_1 = require("@shared/schema");
var drizzle_orm_1 = require("drizzle-orm");
// Environment configuration
var NANO_MAX_HOURLY = parseInt(process.env.NANO_MAX_HOURLY || '12');
var NANO_MAX_CONCURRENCY = parseInt(process.env.NANO_MAX_CONCURRENCY || '2');
var NANO_HARD_FAIL = process.env.NANO_HARD_FAIL === 'true';
var NANO_ENABLE_PROVENANCE = process.env.NANO_ENABLE_PROVENANCE !== 'false';
// In-memory concurrency tracking
var userConcurrency = new Map();
var throttleState = {
    p95Latency: 0,
    lastThrottleTime: 0,
    throttledCalls: 0,
    recentLatencies: []
};
// Request validation schemas
var generateRequestSchema = zod_1.z.object({
    prompt: zod_1.z.string().min(1).max(1000),
    mode: zod_1.z.enum(['text2img', 'img2img', 'edit']).default('text2img'),
    seed: zod_1.z.number().int().positive().optional(),
    guidance: zod_1.z.number().min(1).max(20).optional(),
    steps: zod_1.z.number().int().min(10).max(100).optional(),
    width: zod_1.z.number().int().min(256).max(1536).optional(),
    height: zod_1.z.number().int().min(256).max(1536).optional(),
    preserve_subject: zod_1.z.boolean().optional(),
    provenance: zod_1.z.boolean().default(NANO_ENABLE_PROVENANCE),
    image_url: zod_1.z.string().url().optional(), // For img2img and edit modes
});
/**
 * Check rate limits for user (12 requests per hour)
 */
function checkRateLimit(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var oneHourAgo, recentRequests, currentCount, remaining;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                    return [4 /*yield*/, db_1.db
                            .select({ count: (0, drizzle_orm_1.count)() })
                            .from(schema_1.nanoJobs)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.nanoJobs.userId, userId), (0, drizzle_orm_1.gte)(schema_1.nanoJobs.createdAt, oneHourAgo)))];
                case 1:
                    recentRequests = _b.sent();
                    currentCount = ((_a = recentRequests[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
                    remaining = Math.max(0, NANO_MAX_HOURLY - currentCount);
                    return [2 /*return*/, {
                            allowed: currentCount < NANO_MAX_HOURLY,
                            remaining: remaining
                        }];
            }
        });
    });
}
/**
 * Check concurrency limits (max 2 inflight per user)
 */
function checkConcurrency(userId) {
    var current = userConcurrency.get(userId) || 0;
    return {
        allowed: current < NANO_MAX_CONCURRENCY,
        current: current
    };
}
/**
 * Update p95 latency tracking for sweet spot throttling
 */
function updateLatencyTracking(latencyMs) {
    throttleState.recentLatencies.push(latencyMs);
    // Keep only last 20 calls
    if (throttleState.recentLatencies.length > 20) {
        throttleState.recentLatencies.shift();
    }
    // Calculate p95 latency
    if (throttleState.recentLatencies.length >= 5) {
        var sorted = __spreadArray([], throttleState.recentLatencies, true).sort(function (a, b) { return a - b; });
        var p95Index = Math.floor(sorted.length * 0.95);
        throttleState.p95Latency = sorted[p95Index];
    }
}
/**
 * Check if sweet spot throttling should be applied
 */
function shouldThrottle() {
    var now = Date.now();
    // If we're in throttling period (next 10 calls after detecting high latency)
    if (throttleState.throttledCalls > 0 && throttleState.throttledCalls <= 10) {
        return {
            throttle: true,
            reason: "Sweet spot throttling active (".concat(throttleState.throttledCalls, "/10 calls)")
        };
    }
    // Check if p95 latency > 6s over last 20 calls
    if (throttleState.p95Latency > 6000 && throttleState.recentLatencies.length >= 20) {
        if (now - throttleState.lastThrottleTime > 30000) { // Don't throttle more than once per 30s
            throttleState.lastThrottleTime = now;
            throttleState.throttledCalls = 1;
            return {
                throttle: true,
                reason: "High latency detected (p95: ".concat(Math.round(throttleState.p95Latency), "ms)")
            };
        }
    }
    return { throttle: false };
}
/**
 * Apply sweet spot parameter reduction
 */
function applyThrottling(params) {
    if (throttleState.throttledCalls > 0) {
        // Reduce steps and guidance by 20%
        if (params.steps) {
            params.steps = Math.floor(params.steps * 0.8);
        }
        if (params.guidance) {
            params.guidance = params.guidance * 0.8;
        }
        throttleState.throttledCalls++;
    }
    return params;
}
/**
 * Log generation event to telemetry
 */
function logTelemetry(data) {
    // Integration with existing telemetry system
    console.log("[NANO_TELEMETRY] ".concat(JSON.stringify(data)));
}
/**
 * Fallback to mock provider with branded placeholder
 */
function createFallbackResult(prompt, params) {
    return __awaiter(this, void 0, void 0, function () {
        var mockProvider, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockProvider = (0, index_1.createModelProvider)('mock');
                    return [4 /*yield*/, mockProvider.generate(prompt, params)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, __assign(__assign({}, result), { fallback: true, banner: "Nano Banana is cooling down - try again soon! 🍌" })];
            }
        });
    });
}
function registerNanoRoutes(app) {
    var _this = this;
    /**
     * POST /nano/generate - Main image generation endpoint
     */
    app.post('/nano/generate', replitAuth_1.isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, user, error_1, validatedData, rateCheck, concurrencyCheck, throttleCheck, startTime, result, provider, success, errorCode, modelProvider, params, error_2, current, duration, dbError_1, error_3, current, fallbackResult, fallbackError_1;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.claims) === null || _b === void 0 ? void 0 : _b.sub;
                    if (!userId) {
                        return [2 /*return*/, res.status(401).json({ error: 'User not authenticated' })];
                    }
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))];
                case 2:
                    user = (_e.sent())[0];
                    if (!user) {
                        return [2 /*return*/, res.status(403).json({ error: 'User not found' })];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _e.sent();
                    console.error('User lookup error:', error_1);
                    return [2 /*return*/, res.status(500).json({ error: 'Database error' })];
                case 4:
                    _e.trys.push([4, 18, , 23]);
                    validatedData = generateRequestSchema.parse(req.body);
                    return [4 /*yield*/, checkRateLimit(userId)];
                case 5:
                    rateCheck = _e.sent();
                    if (!rateCheck.allowed) {
                        return [2 /*return*/, res.status(429).json({
                                error: 'Rate limit exceeded',
                                limit: NANO_MAX_HOURLY,
                                remaining: rateCheck.remaining,
                                resetTime: new Date(Date.now() + 60 * 60 * 1000).toISOString()
                            })];
                    }
                    concurrencyCheck = checkConcurrency(userId);
                    if (!concurrencyCheck.allowed) {
                        return [2 /*return*/, res.status(429).json({
                                error: 'Concurrency limit exceeded',
                                limit: NANO_MAX_CONCURRENCY,
                                current: concurrencyCheck.current
                            })];
                    }
                    throttleCheck = shouldThrottle();
                    // Increment concurrency counter
                    userConcurrency.set(userId, (userConcurrency.get(userId) || 0) + 1);
                    startTime = Date.now();
                    result = void 0;
                    provider = void 0;
                    success = false;
                    errorCode = void 0;
                    _e.label = 6;
                case 6:
                    _e.trys.push([6, 8, 12, 13]);
                    modelProvider = (0, index_1.createModelProvider)();
                    provider = modelProvider.name;
                    params = __assign({}, validatedData);
                    if (throttleCheck.throttle) {
                        params = applyThrottling(params);
                    }
                    return [4 /*yield*/, modelProvider.generate(validatedData.prompt, params)];
                case 7:
                    // Attempt generation
                    result = _e.sent();
                    success = true;
                    return [3 /*break*/, 13];
                case 8:
                    error_2 = _e.sent();
                    console.error('Generation error:', error_2);
                    errorCode = ((_c = error_2.message) === null || _c === void 0 ? void 0 : _c.includes('timeout')) ? 'TIMEOUT' : 'PROVIDER_ERROR';
                    if (!NANO_HARD_FAIL) return [3 /*break*/, 9];
                    throw error_2;
                case 9: return [4 /*yield*/, createFallbackResult(validatedData.prompt, validatedData)];
                case 10:
                    result = _e.sent();
                    provider = 'mock_fallback';
                    success = true; // Fallback is considered successful
                    _e.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    current = userConcurrency.get(userId) || 0;
                    if (current > 0) {
                        userConcurrency.set(userId, current - 1);
                    }
                    return [7 /*endfinally*/];
                case 13:
                    duration = Date.now() - startTime;
                    // Update latency tracking
                    updateLatencyTracking(duration);
                    _e.label = 14;
                case 14:
                    _e.trys.push([14, 16, , 17]);
                    return [4 /*yield*/, db_1.db.insert(schema_1.nanoJobs).values({
                            userId: userId,
                            mode: validatedData.mode,
                            prompt: validatedData.prompt,
                            latencyMs: duration,
                            creditsUsed: ((_d = result.usage) === null || _d === void 0 ? void 0 : _d.credits) || 1,
                            provider: provider,
                            provenanceJson: result.provenance || null,
                            imageUrl: result.url || null,
                            parameters: validatedData,
                            status: success ? 'completed' : 'failed',
                            errorMessage: errorCode || null,
                        })];
                case 15:
                    _e.sent();
                    return [3 /*break*/, 17];
                case 16:
                    dbError_1 = _e.sent();
                    console.error('Database insert error:', dbError_1);
                    return [3 /*break*/, 17];
                case 17:
                    // Log telemetry
                    logTelemetry({
                        userId: userId,
                        provider: provider,
                        mode: validatedData.mode,
                        success: success,
                        latency: duration,
                        throttled: throttleCheck.throttle,
                        errorCode: errorCode
                    });
                    // Return response
                    return [2 /*return*/, res.json({
                            success: true,
                            result: result,
                            metadata: {
                                latency: duration,
                                provider: provider,
                                throttled: throttleCheck.throttle,
                                throttleReason: throttleCheck.reason,
                                remaining: rateCheck.remaining - 1,
                                fallback: result.fallback || false
                            }
                        })];
                case 18:
                    error_3 = _e.sent();
                    current = userConcurrency.get(userId) || 0;
                    if (current > 0) {
                        userConcurrency.set(userId, current - 1);
                    }
                    if (error_3 instanceof zod_1.z.ZodError) {
                        return [2 /*return*/, res.status(400).json({
                                error: 'Invalid request parameters',
                                details: error_3.errors
                            })];
                    }
                    console.error('Nano generation error:', error_3);
                    if (NANO_HARD_FAIL) {
                        return [2 /*return*/, res.status(503).json({
                                error: 'Service temporarily unavailable',
                                message: error_3.message
                            })];
                    }
                    _e.label = 19;
                case 19:
                    _e.trys.push([19, 21, , 22]);
                    return [4 /*yield*/, createFallbackResult(req.body.prompt || 'placeholder', { mode: 'text2img' })];
                case 20:
                    fallbackResult = _e.sent();
                    return [2 /*return*/, res.json({
                            success: true,
                            result: fallbackResult,
                            metadata: {
                                latency: 1000,
                                provider: 'mock_fallback',
                                throttled: false,
                                fallback: true,
                                error: error_3.message
                            }
                        })];
                case 21:
                    fallbackError_1 = _e.sent();
                    return [2 /*return*/, res.status(500).json({
                            error: 'Generation failed and fallback unavailable',
                            message: error_3.message
                        })];
                case 22: return [3 /*break*/, 23];
                case 23: return [2 /*return*/];
            }
        });
    }); });
    /**
     * GET /nano/status - Get current system status
     */
    app.get('/nano/status', replitAuth_1.isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, userStats, rateCheck, concurrency, status;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.claims) === null || _b === void 0 ? void 0 : _b.sub;
                    userStats = { remaining: NANO_MAX_HOURLY, used: 0 };
                    if (!userId) return [3 /*break*/, 2];
                    return [4 /*yield*/, checkRateLimit(userId)];
                case 1:
                    rateCheck = _c.sent();
                    userStats.remaining = rateCheck.remaining;
                    userStats.used = NANO_MAX_HOURLY - rateCheck.remaining;
                    _c.label = 2;
                case 2:
                    concurrency = userId ? (userConcurrency.get(userId) || 0) : 0;
                    status = throttleState.throttledCalls > 0 ? 'Throttled' :
                        throttleState.p95Latency > 6000 ? 'Cooling' : 'On';
                    return [2 /*return*/, res.json({
                            status: status,
                            provider: process.env.NANO_PROVIDER || 'mock',
                            userStats: userStats,
                            concurrency: {
                                current: concurrency,
                                limit: NANO_MAX_CONCURRENCY
                            },
                            performance: {
                                p95Latency: Math.round(throttleState.p95Latency),
                                throttledCalls: throttleState.throttledCalls,
                                recentSamples: throttleState.recentLatencies.length
                            },
                            capabilities: {
                                maxHourly: NANO_MAX_HOURLY,
                                maxConcurrency: NANO_MAX_CONCURRENCY,
                                hardFail: NANO_HARD_FAIL,
                                provenance: NANO_ENABLE_PROVENANCE
                            }
                        })];
            }
        });
    }); });
    /**
     * GET /nano/history - Get user's generation history
     */
    app.get('/nano/history', replitAuth_1.isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, history_1, error_4;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.claims) === null || _b === void 0 ? void 0 : _b.sub;
                    if (!userId) {
                        return [2 /*return*/, res.status(401).json({ error: 'User not authenticated' })];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db_1.db
                            .select({
                            id: schema_1.nanoJobs.id,
                            mode: schema_1.nanoJobs.mode,
                            prompt: schema_1.nanoJobs.prompt,
                            latencyMs: schema_1.nanoJobs.latencyMs,
                            provider: schema_1.nanoJobs.provider,
                            imageUrl: schema_1.nanoJobs.imageUrl,
                            status: schema_1.nanoJobs.status,
                            createdAt: schema_1.nanoJobs.createdAt
                        })
                            .from(schema_1.nanoJobs)
                            .where((0, drizzle_orm_1.eq)(schema_1.nanoJobs.userId, userId))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.nanoJobs.createdAt))
                            .limit(50)];
                case 2:
                    history_1 = _c.sent();
                    return [2 /*return*/, res.json({ history: history_1 })];
                case 3:
                    error_4 = _c.sent();
                    console.error('History query error:', error_4);
                    return [2 /*return*/, res.status(500).json({ error: 'Database error' })];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}
