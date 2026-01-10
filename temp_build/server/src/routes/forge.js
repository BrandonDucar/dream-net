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
exports.createForgeRouter = createForgeRouter;
var express_1 = require("express");
var db_1 = require("../db");
var schema_1 = require("@shared/schema");
var drizzle_orm_1 = require("drizzle-orm");
var axios_1 = require("axios");
var vm2_1 = require("vm2");
var memory_dna_1 = require("../../packages/memory-dna");
/**
 * Dream API Forge Router
 * Provides REST API for managing API collections, requests, environments, and execution history.
 */
function createForgeRouter() {
    var _this = this;
    var router = (0, express_1.Router)();
    // ============================================
    // Collections CRUD
    // ============================================
    router.get("/forge/collections", function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
        var collections, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.db.select().from(schema_1.forgeCollections).orderBy((0, drizzle_orm_1.desc)(schema_1.forgeCollections.createdAt))];
                case 1:
                    collections = _a.sent();
                    res.json({ ok: true, collections: collections });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    res.status(500).json({ ok: false, error: error_1.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    router.post("/forge/collections", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, collection, error_2;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    body = req.body;
                    if (!body.name) {
                        res.status(400).json({ ok: false, error: "name is required" });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, db_1.db
                            .insert(schema_1.forgeCollections)
                            .values({
                            name: body.name,
                            description: (_a = body.description) !== null && _a !== void 0 ? _a : null,
                            tags: (_b = body.tags) !== null && _b !== void 0 ? _b : [],
                            metadata: (_c = body.metadata) !== null && _c !== void 0 ? _c : {},
                        })
                            .returning()];
                case 1:
                    collection = (_d.sent())[0];
                    res.json({ ok: true, collection: collection });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _d.sent();
                    res.status(500).json({ ok: false, error: error_2.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    router.put("/forge/collections/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, body, collection, error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    body = req.body;
                    return [4 /*yield*/, db_1.db
                            .update(schema_1.forgeCollections)
                            .set({
                            name: body.name,
                            description: (_a = body.description) !== null && _a !== void 0 ? _a : null,
                            tags: body.tags,
                            metadata: body.metadata,
                            updatedAt: new Date(),
                        })
                            .where((0, drizzle_orm_1.eq)(schema_1.forgeCollections.id, id))
                            .returning()];
                case 1:
                    collection = (_b.sent())[0];
                    if (!collection) {
                        res.status(404).json({ ok: false, error: "Collection not found" });
                        return [2 /*return*/];
                    }
                    res.json({ ok: true, collection: collection });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _b.sent();
                    res.status(500).json({ ok: false, error: error_3.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    router.delete("/forge/collections/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    return [4 /*yield*/, db_1.db.delete(schema_1.forgeCollections).where((0, drizzle_orm_1.eq)(schema_1.forgeCollections.id, id))];
                case 1:
                    _a.sent();
                    res.json({ ok: true });
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    res.status(500).json({ ok: false, error: error_4.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // ============================================
    // Requests CRUD
    // ============================================
    router.get("/forge/collections/:collectionId/requests", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var collectionId, requests, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    collectionId = req.params.collectionId;
                    return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.forgeRequests)
                            .where((0, drizzle_orm_1.eq)(schema_1.forgeRequests.collectionId, collectionId))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.forgeRequests.createdAt))];
                case 1:
                    requests = _a.sent();
                    res.json({ ok: true, requests: requests });
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    res.status(500).json({ ok: false, error: error_5.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    router.post("/forge/collections/:collectionId/requests", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var collectionId, body, request, error_6;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 2, , 3]);
                    collectionId = req.params.collectionId;
                    body = req.body;
                    if (!body.name || !body.method || !body.url) {
                        res.status(400).json({ ok: false, error: "name, method, and url are required" });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, db_1.db
                            .insert(schema_1.forgeRequests)
                            .values({
                            collectionId: collectionId,
                            name: body.name,
                            method: body.method,
                            url: body.url,
                            headers: (_a = body.headers) !== null && _a !== void 0 ? _a : {},
                            body: (_b = body.body) !== null && _b !== void 0 ? _b : null,
                            auth: (_c = body.auth) !== null && _c !== void 0 ? _c : { type: "none" },
                            testScript: (_d = body.testScript) !== null && _d !== void 0 ? _d : null,
                            tags: (_e = body.tags) !== null && _e !== void 0 ? _e : [],
                            metadata: (_f = body.metadata) !== null && _f !== void 0 ? _f : {},
                        })
                            .returning()];
                case 1:
                    request = (_g.sent())[0];
                    res.json({ ok: true, request: request });
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _g.sent();
                    res.status(500).json({ ok: false, error: error_6.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    router.get("/forge/requests/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, request, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    return [4 /*yield*/, db_1.db.select().from(schema_1.forgeRequests).where((0, drizzle_orm_1.eq)(schema_1.forgeRequests.id, id))];
                case 1:
                    request = (_a.sent())[0];
                    if (!request) {
                        res.status(404).json({ ok: false, error: "Request not found" });
                        return [2 /*return*/];
                    }
                    res.json({ ok: true, request: request });
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    res.status(500).json({ ok: false, error: error_7.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    router.put("/forge/requests/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, body, request, error_8;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    body = req.body;
                    return [4 /*yield*/, db_1.db
                            .update(schema_1.forgeRequests)
                            .set({
                            name: body.name,
                            method: body.method,
                            url: body.url,
                            headers: body.headers,
                            body: (_a = body.body) !== null && _a !== void 0 ? _a : null,
                            auth: body.auth,
                            testScript: (_b = body.testScript) !== null && _b !== void 0 ? _b : null,
                            tags: body.tags,
                            metadata: body.metadata,
                            updatedAt: new Date(),
                        })
                            .where((0, drizzle_orm_1.eq)(schema_1.forgeRequests.id, id))
                            .returning()];
                case 1:
                    request = (_c.sent())[0];
                    if (!request) {
                        res.status(404).json({ ok: false, error: "Request not found" });
                        return [2 /*return*/];
                    }
                    res.json({ ok: true, request: request });
                    return [3 /*break*/, 3];
                case 2:
                    error_8 = _c.sent();
                    res.status(500).json({ ok: false, error: error_8.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    router.delete("/forge/requests/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    return [4 /*yield*/, db_1.db.delete(schema_1.forgeRequests).where((0, drizzle_orm_1.eq)(schema_1.forgeRequests.id, id))];
                case 1:
                    _a.sent();
                    res.json({ ok: true });
                    return [3 /*break*/, 3];
                case 2:
                    error_9 = _a.sent();
                    res.status(500).json({ ok: false, error: error_9.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // ============================================
    // Environments CRUD
    // ============================================
    router.get("/forge/environments", function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
        var environments, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.db.select().from(schema_1.forgeEnvironments).orderBy((0, drizzle_orm_1.desc)(schema_1.forgeEnvironments.createdAt))];
                case 1:
                    environments = _a.sent();
                    res.json({ ok: true, environments: environments });
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _a.sent();
                    res.status(500).json({ ok: false, error: error_10.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    router.post("/forge/environments", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, environment, error_11;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    body = req.body;
                    if (!body.name) {
                        res.status(400).json({ ok: false, error: "name is required" });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, db_1.db
                            .insert(schema_1.forgeEnvironments)
                            .values({
                            name: body.name,
                            variables: (_a = body.variables) !== null && _a !== void 0 ? _a : {},
                        })
                            .returning()];
                case 1:
                    environment = (_b.sent())[0];
                    res.json({ ok: true, environment: environment });
                    return [3 /*break*/, 3];
                case 2:
                    error_11 = _b.sent();
                    res.status(500).json({ ok: false, error: error_11.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    router.put("/forge/environments/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, body, environment, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    body = req.body;
                    return [4 /*yield*/, db_1.db
                            .update(schema_1.forgeEnvironments)
                            .set({
                            name: body.name,
                            variables: body.variables,
                            updatedAt: new Date(),
                        })
                            .where((0, drizzle_orm_1.eq)(schema_1.forgeEnvironments.id, id))
                            .returning()];
                case 1:
                    environment = (_a.sent())[0];
                    if (!environment) {
                        res.status(404).json({ ok: false, error: "Environment not found" });
                        return [2 /*return*/];
                    }
                    res.json({ ok: true, environment: environment });
                    return [3 /*break*/, 3];
                case 2:
                    error_12 = _a.sent();
                    res.status(500).json({ ok: false, error: error_12.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    router.delete("/forge/environments/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, error_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    return [4 /*yield*/, db_1.db.delete(schema_1.forgeEnvironments).where((0, drizzle_orm_1.eq)(schema_1.forgeEnvironments.id, id))];
                case 1:
                    _a.sent();
                    res.json({ ok: true });
                    return [3 /*break*/, 3];
                case 2:
                    error_13 = _a.sent();
                    res.status(500).json({ ok: false, error: error_13.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // ============================================
    // History
    // ============================================
    router.get("/forge/requests/:id/history", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, history_1, error_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.forgeHistory)
                            .where((0, drizzle_orm_1.eq)(schema_1.forgeHistory.requestId, id))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.forgeHistory.createdAt))
                            .limit(50)];
                case 1:
                    history_1 = _a.sent();
                    res.json({ ok: true, history: history_1 });
                    return [3 /*break*/, 3];
                case 2:
                    error_14 = _a.sent();
                    res.status(500).json({ ok: false, error: error_14.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    router.get("/forge/history/recent", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var limit, history_2, error_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    limit = parseInt(req.query.limit) || 50;
                    return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.forgeHistory)
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.forgeHistory.createdAt))
                            .limit(limit)];
                case 1:
                    history_2 = _a.sent();
                    res.json({ ok: true, history: history_2 });
                    return [3 /*break*/, 3];
                case 2:
                    error_15 = _a.sent();
                    res.status(500).json({ ok: false, error: error_15.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // ============================================
    // Request Execution
    // ============================================
    router.post("/forge/execute", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var startTime, requestSnapshot, responseSnapshot, testResults, error, body, request, envVars_1, env, resolveVars_1, method, url, headers_1, bodyText, auth, credentials, key, urlObj, axiosConfig, axiosResponse, err_1, emitEvent, _a, durationMs, responseBody, responseSize, emitEvent, _b, history_3, err_2, durationMs, body, _c;
        var _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    startTime = Date.now();
                    requestSnapshot = null;
                    responseSnapshot = null;
                    testResults = null;
                    error = null;
                    _k.label = 1;
                case 1:
                    _k.trys.push([1, 21, , 27]);
                    body = req.body;
                    if (!body.requestId) {
                        res.status(400).json({ ok: false, error: "requestId is required" });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, db_1.db.select().from(schema_1.forgeRequests).where((0, drizzle_orm_1.eq)(schema_1.forgeRequests.id, body.requestId))];
                case 2:
                    request = (_k.sent())[0];
                    if (!request) {
                        res.status(404).json({ ok: false, error: "Request not found" });
                        return [2 /*return*/];
                    }
                    envVars_1 = {};
                    if (!body.environmentId) return [3 /*break*/, 4];
                    return [4 /*yield*/, db_1.db.select().from(schema_1.forgeEnvironments).where((0, drizzle_orm_1.eq)(schema_1.forgeEnvironments.id, body.environmentId))];
                case 3:
                    env = (_k.sent())[0];
                    if (env) {
                        envVars_1 = env.variables;
                    }
                    _k.label = 4;
                case 4:
                    resolveVars_1 = function (str) {
                        return str.replace(/\{\{(\w+)\}\}/g, function (_, key) { var _a; return (_a = envVars_1[key]) !== null && _a !== void 0 ? _a : "{{".concat(key, "}}"); });
                    };
                    method = (((_d = body.overrides) === null || _d === void 0 ? void 0 : _d.method) || request.method);
                    url = resolveVars_1(((_e = body.overrides) === null || _e === void 0 ? void 0 : _e.url) || request.url);
                    headers_1 = __assign({}, request.headers);
                    bodyText = resolveVars_1(((_f = body.overrides) === null || _f === void 0 ? void 0 : _f.body) || request.body || "");
                    // Apply overrides
                    if ((_g = body.overrides) === null || _g === void 0 ? void 0 : _g.headers) {
                        Object.entries(body.overrides.headers).forEach(function (_a) {
                            var k = _a[0], v = _a[1];
                            headers_1[resolveVars_1(k)] = resolveVars_1(v);
                        });
                    }
                    auth = request.auth;
                    if (auth.type === "bearer" && auth.token) {
                        headers_1["Authorization"] = "Bearer ".concat(resolveVars_1(auth.token));
                    }
                    else if (auth.type === "basic" && auth.username && auth.password) {
                        credentials = Buffer.from("".concat(resolveVars_1(auth.username), ":").concat(resolveVars_1(auth.password))).toString("base64");
                        headers_1["Authorization"] = "Basic ".concat(credentials);
                    }
                    else if (auth.type === "apikey" && auth.apiKey) {
                        key = resolveVars_1(auth.apiKey);
                        if (auth.apiKeyLocation === "query") {
                            urlObj = new URL(url);
                            urlObj.searchParams.set("api_key", key);
                            url = urlObj.toString();
                        }
                        else {
                            headers_1["X-API-Key"] = key;
                        }
                    }
                    // Prepare request snapshot
                    requestSnapshot = {
                        method: method,
                        url: url,
                        headers: headers_1,
                        body: bodyText || undefined,
                    };
                    axiosConfig = {
                        method: method,
                        url: url,
                        headers: headers_1,
                        data: bodyText || undefined,
                        validateStatus: function () { return true; }, // Don't throw on any status
                        timeout: 30000, // 30s timeout
                    };
                    axiosResponse = void 0;
                    _k.label = 5;
                case 5:
                    _k.trys.push([5, 7, , 13]);
                    return [4 /*yield*/, (0, axios_1.default)(axiosConfig)];
                case 6:
                    axiosResponse = _k.sent();
                    return [3 /*break*/, 13];
                case 7:
                    err_1 = _k.sent();
                    error = err_1.message || "Network error";
                    _k.label = 8;
                case 8:
                    _k.trys.push([8, 11, , 12]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../../packages/event-wormholes"); })];
                case 9:
                    emitEvent = (_k.sent()).emitEvent;
                    return [4 /*yield*/, emitEvent({
                            sourceType: "api",
                            eventType: "api.endpoint.failed",
                            severity: "error",
                            payload: {
                                requestId: body.requestId,
                                url: url,
                                method: method,
                                error: error,
                            },
                        })];
                case 10:
                    _k.sent();
                    return [3 /*break*/, 12];
                case 11:
                    _a = _k.sent();
                    return [3 /*break*/, 12];
                case 12: throw err_1;
                case 13:
                    durationMs = Date.now() - startTime;
                    responseBody = typeof axiosResponse.data === "string" ? axiosResponse.data : JSON.stringify(axiosResponse.data);
                    responseSize = Buffer.byteLength(responseBody, "utf8");
                    responseSnapshot = {
                        status: axiosResponse.status,
                        headers: axiosResponse.headers,
                        body: responseBody,
                        size: responseSize,
                    };
                    // Run test script if present
                    if (request.testScript) {
                        try {
                            testResults = runTestScript(request.testScript, {
                                status: axiosResponse.status,
                                headers: axiosResponse.headers,
                                body: responseBody,
                                durationMs: durationMs,
                            });
                        }
                        catch (testErr) {
                            testResults = {
                                passed: 0,
                                failed: 1,
                                logs: [],
                                errors: [testErr.message || "Test script execution failed"],
                            };
                        }
                    }
                    if (!(axiosResponse.status >= 400 || (testResults && testResults.failed > 0))) return [3 /*break*/, 18];
                    _k.label = 14;
                case 14:
                    _k.trys.push([14, 17, , 18]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../../packages/event-wormholes"); })];
                case 15:
                    emitEvent = (_k.sent()).emitEvent;
                    return [4 /*yield*/, emitEvent({
                            sourceType: "api",
                            eventType: "api.endpoint.failed",
                            severity: axiosResponse.status >= 500 ? "error" : "warning",
                            payload: {
                                requestId: body.requestId,
                                url: url,
                                statusCode: axiosResponse.status,
                                testFailed: (testResults === null || testResults === void 0 ? void 0 : testResults.failed) > 0,
                            },
                        })];
                case 16:
                    _k.sent();
                    return [3 /*break*/, 18];
                case 17:
                    _b = _k.sent();
                    return [3 /*break*/, 18];
                case 18: return [4 /*yield*/, db_1.db
                        .insert(schema_1.forgeHistory)
                        .values({
                        requestId: body.requestId,
                        environmentId: body.environmentId || null,
                        statusCode: axiosResponse.status,
                        durationMs: durationMs,
                        requestSnapshot: requestSnapshot,
                        responseSnapshot: responseSnapshot,
                        testResults: testResults,
                        error: null,
                    })
                        .returning()];
                case 19:
                    history_3 = (_k.sent())[0];
                    return [4 /*yield*/, (0, memory_dna_1.updateTraitsFromEvent)({
                            id: history_3.id,
                            timestamp: new Date().toISOString(),
                            sourceType: "api",
                            eventType: "api.endpoint.success",
                            severity: "info",
                            payload: {
                                requestId: body.requestId,
                                url: url,
                                statusCode: axiosResponse.status,
                                durationMs: durationMs,
                            },
                            handled: true,
                        })];
                case 20:
                    _k.sent();
                    res.json({
                        ok: true,
                        response: {
                            status: axiosResponse.status,
                            headers: axiosResponse.headers,
                            body: responseBody,
                            durationMs: durationMs,
                            size: responseSize,
                        },
                        testResults: testResults,
                        historyId: history_3.id,
                    });
                    return [3 /*break*/, 27];
                case 21:
                    err_2 = _k.sent();
                    durationMs = Date.now() - startTime;
                    error = err_2.message || "Execution failed";
                    body = req.body;
                    if (!(requestSnapshot && (body === null || body === void 0 ? void 0 : body.requestId))) return [3 /*break*/, 25];
                    _k.label = 22;
                case 22:
                    _k.trys.push([22, 24, , 25]);
                    return [4 /*yield*/, db_1.db.insert(schema_1.forgeHistory).values({
                            requestId: body.requestId,
                            environmentId: (body === null || body === void 0 ? void 0 : body.environmentId) || null,
                            statusCode: null,
                            durationMs: durationMs,
                            requestSnapshot: requestSnapshot,
                            responseSnapshot: responseSnapshot || {
                                status: 0,
                                headers: {},
                                body: error,
                            },
                            testResults: null,
                            error: error,
                        })];
                case 23:
                    _k.sent();
                    return [3 /*break*/, 25];
                case 24:
                    _c = _k.sent();
                    return [3 /*break*/, 25];
                case 25: return [4 /*yield*/, (0, memory_dna_1.updateTraitsFromEvent)({
                        id: "".concat((_h = body === null || body === void 0 ? void 0 : body.requestId) !== null && _h !== void 0 ? _h : "unknown", "-").concat(Date.now()),
                        timestamp: new Date().toISOString(),
                        sourceType: "api",
                        eventType: "api.endpoint.failed",
                        severity: "error",
                        payload: {
                            requestId: body === null || body === void 0 ? void 0 : body.requestId,
                            url: requestSnapshot === null || requestSnapshot === void 0 ? void 0 : requestSnapshot.url,
                            statusCode: (_j = responseSnapshot === null || responseSnapshot === void 0 ? void 0 : responseSnapshot.status) !== null && _j !== void 0 ? _j : 0,
                            error: error,
                        },
                        handled: false,
                    })];
                case 26:
                    _k.sent();
                    res.status(500).json({
                        ok: false,
                        error: error,
                        durationMs: durationMs,
                        requestSnapshot: requestSnapshot,
                    });
                    return [3 /*break*/, 27];
                case 27: return [2 /*return*/];
            }
        });
    }); });
    return router;
}
/**
 * Run test script in a sandboxed VM
 * Provides forge.* helpers for assertions
 */
function runTestScript(script, response) {
    var logs = [];
    var errors = [];
    var passed = 0;
    var failed = 0;
    var forge = {
        expectStatus: function (expected) {
            if (response.status === expected) {
                passed++;
                logs.push("\u2713 Status is ".concat(expected));
            }
            else {
                failed++;
                errors.push("\u2717 Expected status ".concat(expected, ", got ").concat(response.status));
            }
        },
        expectHeader: function (name, value) {
            var actual = response.headers[name.toLowerCase()];
            if (actual === value) {
                passed++;
                logs.push("\u2713 Header ".concat(name, " is ").concat(value));
            }
            else {
                failed++;
                errors.push("\u2717 Expected header ".concat(name, " to be ").concat(value, ", got ").concat(actual));
            }
        },
        expectBodyContains: function (text) {
            if (response.body.includes(text)) {
                passed++;
                logs.push("\u2713 Body contains \"".concat(text, "\""));
            }
            else {
                failed++;
                errors.push("\u2717 Body does not contain \"".concat(text, "\""));
            }
        },
        log: function (message) {
            logs.push("[LOG] ".concat(message));
        },
        response: {
            status: response.status,
            headers: response.headers,
            body: response.body,
            durationMs: response.durationMs,
        },
    };
    try {
        var vm = new vm2_1.VM({
            timeout: 5000, // 5s max execution
            sandbox: {
                forge: forge,
                console: {
                    log: function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        logs.push("[CONSOLE] ".concat(args.map(String).join(" ")));
                    },
                },
            },
        });
        vm.run(script);
    }
    catch (err) {
        errors.push("Script error: ".concat(err.message));
        failed++;
    }
    return {
        passed: passed,
        failed: failed,
        logs: logs,
        errors: errors,
    };
}
