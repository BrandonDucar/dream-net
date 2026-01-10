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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.chronoSet = chronoSet;
exports.chronoGet = chronoGet;
exports.chronoStats = chronoStats;
var ioredis_1 = require("ioredis");
var metrics_1 = require("../trust/metrics");
var lambda = Number((_a = process.env.LAMBDA) !== null && _a !== void 0 ? _a : 0.0001);
var epsilon = Number((_b = process.env.EPSILON) !== null && _b !== void 0 ? _b : 0.01);
var redis = null;
var memoryStore = new Map();
var hitCount = 0;
var missCount = 0;
function getRedis() {
    if (redis)
        return redis;
    if (!process.env.REDIS_URL)
        return null;
    redis = new ioredis_1.default(process.env.REDIS_URL);
    redis.on("error", function (err) {
        console.error("[ChronoCache] Redis error:", err);
    });
    return redis;
}
function chronoSet(key, value) {
    return __awaiter(this, void 0, void 0, function () {
        var entry, client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    entry = { value: value, storedAt: Date.now() };
                    client = getRedis();
                    if (!client) return [3 /*break*/, 3];
                    return [4 /*yield*/, client.set("chronocache:".concat(key), JSON.stringify(entry))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, client.publish("dreamnet-cache-events", JSON.stringify({ type: "set", key: key }))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    memoryStore.set(key, entry);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function chronoGet(key) {
    return __awaiter(this, void 0, void 0, function () {
        var client, entry, data, ageMs, ageSeconds, weight;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    client = getRedis();
                    entry = null;
                    if (!client) return [3 /*break*/, 2];
                    return [4 /*yield*/, client.get("chronocache:".concat(key))];
                case 1:
                    data = _b.sent();
                    entry = data ? JSON.parse(data) : null;
                    return [3 /*break*/, 3];
                case 2:
                    entry = (_a = memoryStore.get(key)) !== null && _a !== void 0 ? _a : null;
                    _b.label = 3;
                case 3:
                    if (!entry) {
                        missCount++;
                        return [2 /*return*/, null];
                    }
                    hitCount++;
                    ageMs = Date.now() - entry.storedAt;
                    ageSeconds = ageMs / 1000;
                    weight = Math.exp(-lambda * ageSeconds);
                    if (weight < epsilon) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, {
                            value: entry.value,
                            storedAt: entry.storedAt,
                            ageSeconds: ageSeconds,
                            weight: weight,
                        }];
            }
        });
    });
}
function chronoStats() {
    return __awaiter(this, void 0, void 0, function () {
        var total, hitRate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    total = hitCount + missCount;
                    hitRate = total ? hitCount / total : 0;
                    return [4 /*yield*/, (0, metrics_1.recordMetric)("chronocache.stats", {
                            hitCount: hitCount,
                            missCount: missCount,
                            hitRate: hitRate,
                            timestamp: new Date().toISOString(),
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { hitCount: hitCount, missCount: missCount, hitRate: hitRate, lambda: lambda, epsilon: epsilon }];
            }
        });
    });
}
