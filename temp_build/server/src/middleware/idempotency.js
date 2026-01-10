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
exports.checkIdempotency = checkIdempotency;
exports.storeIdempotencyResponse = storeIdempotencyResponse;
exports.getIdempotencyResponse = getIdempotencyResponse;
exports.idempotencyMiddleware = idempotencyMiddleware;
var DEFAULT_TTL_MS = 10 * 60 * 1000;
var cache = new Map();
function checkIdempotency(key_1, traceId_1, digest_1) {
    return __awaiter(this, arguments, void 0, function (key, traceId, digest, ttlMs) {
        var now, existing;
        if (ttlMs === void 0) { ttlMs = DEFAULT_TTL_MS; }
        return __generator(this, function (_a) {
            now = Date.now();
            existing = cache.get(key);
            if (existing && now - existing < ttlMs) {
                return [2 /*return*/, { isReplay: true, record: { key: key, timestamp: existing } }];
            }
            cache.set(key, now);
            return [2 /*return*/, { isReplay: false }];
        });
    });
}
var responseCache = new Map();
function storeIdempotencyResponse(key_1, response_1) {
    return __awaiter(this, arguments, void 0, function (key, response, ttlMs) {
        var status, body;
        if (ttlMs === void 0) { ttlMs = DEFAULT_TTL_MS; }
        return __generator(this, function (_a) {
            status = typeof response === 'object' && response.status ? response.status : 200;
            body = typeof response === 'object' && response.body ? response.body : response;
            responseCache.set(key, { status: status, body: body, timestamp: Date.now() });
            // Auto-cleanup after TTL
            setTimeout(function () {
                var cached = responseCache.get(key);
                if (cached && Date.now() - cached.timestamp >= ttlMs) {
                    responseCache.delete(key);
                }
            }, ttlMs);
            return [2 /*return*/];
        });
    });
}
function getIdempotencyResponse(key) {
    return __awaiter(this, void 0, void 0, function () {
        var cached, now;
        return __generator(this, function (_a) {
            cached = responseCache.get(key);
            if (!cached) {
                return [2 /*return*/, null];
            }
            now = Date.now();
            if (now - cached.timestamp >= DEFAULT_TTL_MS) {
                responseCache.delete(key);
                return [2 /*return*/, null];
            }
            return [2 /*return*/, { status: cached.status, body: cached.body }];
        });
    });
}
function idempotencyMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var key_1, cachedResponse, isReplay, originalJson_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    key_1 = (req.headers["x-idempotency-key"] || req.headers["idempotency-key"]);
                    if (!key_1) {
                        return [2 /*return*/, next()];
                    }
                    return [4 /*yield*/, getIdempotencyResponse(key_1)];
                case 1:
                    cachedResponse = _a.sent();
                    if (cachedResponse) {
                        return [2 /*return*/, res.status(cachedResponse.status).json(cachedResponse.body)];
                    }
                    return [4 /*yield*/, checkIdempotency(key_1)];
                case 2:
                    isReplay = (_a.sent()).isReplay;
                    if (isReplay) {
                        return [2 /*return*/, res.status(409).json({
                                ok: false,
                                error: "duplicate_request",
                                message: "Request already processed within idempotency TTL window",
                            })];
                    }
                    originalJson_1 = res.json.bind(res);
                    res.json = function (body) {
                        storeIdempotencyResponse(key_1, res.statusCode, body).catch(function () {
                            // Ignore storage errors
                        });
                        return originalJson_1(body);
                    };
                    return [2 /*return*/, next()];
                case 3:
                    error_1 = _a.sent();
                    console.error("[IdempotencyMiddleware] Failed to evaluate request", error_1);
                    return [2 /*return*/, res.status(500).json({
                            ok: false,
                            error: "idempotency_internal_error",
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
