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
exports.logVectorEvent = logVectorEvent;
exports.getVectorHistory = getVectorHistory;
exports.getVectorEvent = getVectorEvent;
exports.verifyVectorEvent = verifyVectorEvent;
exports.runVectorRollup = runVectorRollup;
var buffer_1 = require("buffer");
var drizzle_orm_1 = require("drizzle-orm");
var perf_hooks_1 = require("perf_hooks");
var db_1 = require("../db");
var nanoid_1 = require("nanoid");
var hash_1 = require("../trust/hash");
var starbridge_1 = require("../starbridge");
var merkle_1 = require("../trust/merkle");
var metrics_1 = require("../trust/metrics");
var TABLE = "dreamnet_trust.vector_events";
function mapVectorRow(row) {
    var _a;
    return {
        id: String(row.id),
        object_type: String(row.object_type),
        object_id: String(row.object_id),
        model: String(row.model),
        dim: Number((_a = row.dim) !== null && _a !== void 0 ? _a : 0),
        hash_algo: String(row.hash_algo),
        vec_hash: String(row.vec_hash),
        payload_hash: String(row.payload_hash),
        created_at: new Date(row.created_at),
    };
}
function logVectorEvent(input) {
    return __awaiter(this, void 0, void 0, function () {
        var id, vector, dim, algo, vecHash, payloadHash, record, rawRow, row;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    id = (0, nanoid_1.nanoid)();
                    vector = (_a = input.vector) !== null && _a !== void 0 ? _a : [];
                    dim = vector.length;
                    algo = (_b = input.hashAlgo) !== null && _b !== void 0 ? _b : hash_1.activeHashAlgo;
                    vecHash = (0, hash_1.hashVector)(vector, algo);
                    payloadHash = (0, hash_1.hashJson)((_c = input.payload) !== null && _c !== void 0 ? _c : {}, algo);
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    INSERT INTO ", " (id, object_type, object_id, model, dim, hash_algo, vec_hash, payload_hash)\n    VALUES (", ", ", ", ", ", ", ", ", ", ", ", ", ", ", ")\n    ON CONFLICT (id) DO NOTHING;\n  "], ["\n    INSERT INTO ", " (id, object_type, object_id, model, dim, hash_algo, vec_hash, payload_hash)\n    VALUES (", ", ", ", ", ", ", ", ", ", ", ", ", ", ", ")\n    ON CONFLICT (id) DO NOTHING;\n  "])), drizzle_orm_1.sql.raw(TABLE), id, input.objectType, input.objectId, input.model, dim, algo, vecHash, payloadHash))];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    SELECT * FROM ", " WHERE id = ", "\n  "], ["\n    SELECT * FROM ", " WHERE id = ", "\n  "])), drizzle_orm_1.sql.raw(TABLE), id))];
                case 2:
                    record = _e.sent();
                    rawRow = (_d = record.rows) === null || _d === void 0 ? void 0 : _d[0];
                    row = rawRow ? mapVectorRow(rawRow) : {
                        id: id,
                        object_type: input.objectType,
                        object_id: input.objectId,
                        model: input.model,
                        dim: dim,
                        hash_algo: algo,
                        vec_hash: vecHash,
                        payload_hash: payloadHash,
                        created_at: new Date(),
                    };
                    return [4 /*yield*/, (0, starbridge_1.publishInternalEvent)({
                            topic: starbridge_1.StarbridgeTopic.System,
                            source: starbridge_1.StarbridgeSource.Runtime,
                            type: "vector.event.logged",
                            payload: {
                                id: id,
                                objectType: input.objectType,
                                objectId: input.objectId,
                                model: input.model,
                                hashAlgo: algo,
                            },
                        })];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, (0, metrics_1.recordMetric)("vector.events", {
                            lastEventId: id,
                            lastObjectType: input.objectType,
                            lastObjectId: input.objectId,
                            lastModel: input.model,
                            lastHashAlgo: algo,
                            lastCreatedAt: new Date().toISOString(),
                        })];
                case 4:
                    _e.sent();
                    return [2 /*return*/, row];
            }
        });
    });
}
function getVectorHistory(objectType_1, objectId_1) {
    return __awaiter(this, arguments, void 0, function (objectType, objectId, limit) {
        var result;
        var _a;
        if (limit === void 0) { limit = 100; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    SELECT * FROM ", "\n    WHERE object_type = ", " AND object_id = ", "\n    ORDER BY created_at DESC\n    LIMIT ", "\n  "], ["\n    SELECT * FROM ", "\n    WHERE object_type = ", " AND object_id = ", "\n    ORDER BY created_at DESC\n    LIMIT ", "\n  "])), drizzle_orm_1.sql.raw(TABLE), objectType, objectId, limit))];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, ((_a = result.rows) !== null && _a !== void 0 ? _a : []).map(function (row) { return mapVectorRow(row); })];
            }
        });
    });
}
function getVectorEvent(id) {
    return __awaiter(this, void 0, void 0, function () {
        var result, row;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    SELECT * FROM ", "\n    WHERE id = ", "\n    LIMIT 1\n  "], ["\n    SELECT * FROM ", "\n    WHERE id = ", "\n    LIMIT 1\n  "])), drizzle_orm_1.sql.raw(TABLE), id))];
                case 1:
                    result = _b.sent();
                    row = (_a = result.rows) === null || _a === void 0 ? void 0 : _a[0];
                    return [2 /*return*/, row ? mapVectorRow(row) : null];
            }
        });
    });
}
function verifyVectorEvent(input) {
    return __awaiter(this, void 0, void 0, function () {
        var start, record, algo, vecHash, payloadHash, vecMatches, payloadMatches, result;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    start = (_b = (_a = perf_hooks_1.performance.now) === null || _a === void 0 ? void 0 : _a.call(perf_hooks_1.performance)) !== null && _b !== void 0 ? _b : Date.now();
                    return [4 /*yield*/, getVectorEvent(input.id)];
                case 1:
                    record = _g.sent();
                    if (!!record) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, metrics_1.recordMetric)("vector.verify", {
                            lastId: input.id,
                            ok: false,
                            reason: "not_found",
                            latencyMs: ((_d = (_c = perf_hooks_1.performance.now) === null || _c === void 0 ? void 0 : _c.call(perf_hooks_1.performance)) !== null && _d !== void 0 ? _d : Date.now()) - start,
                        })];
                case 2:
                    _g.sent();
                    return [2 /*return*/, { ok: false, reason: "not_found" }];
                case 3:
                    algo = record.hash_algo;
                    vecHash = input.vector ? (0, hash_1.hashVector)(input.vector, algo) : null;
                    payloadHash = input.payload ? (0, hash_1.hashJson)(input.payload, algo) : null;
                    vecMatches = vecHash ? vecHash === record.vec_hash : true;
                    payloadMatches = payloadHash ? payloadHash === record.payload_hash : true;
                    result = {
                        ok: vecMatches && payloadMatches,
                        vecMatches: vecMatches,
                        payloadMatches: payloadMatches,
                        expectedVecHash: record.vec_hash,
                        computedVecHash: vecHash !== null && vecHash !== void 0 ? vecHash : undefined,
                        expectedPayloadHash: record.payload_hash,
                        computedPayloadHash: payloadHash !== null && payloadHash !== void 0 ? payloadHash : undefined,
                    };
                    return [4 /*yield*/, (0, metrics_1.recordMetric)("vector.verify", {
                            lastId: input.id,
                            ok: result.ok,
                            vecMatches: vecMatches,
                            payloadMatches: payloadMatches,
                            latencyMs: ((_f = (_e = perf_hooks_1.performance.now) === null || _e === void 0 ? void 0 : _e.call(perf_hooks_1.performance)) !== null && _f !== void 0 ? _f : Date.now()) - start,
                            timestamp: new Date().toISOString(),
                        })];
                case 4:
                    _g.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function runVectorRollup(date) {
    return __awaiter(this, void 0, void 0, function () {
        var batchDate, result, rows, algo, leaves, merkleRoot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    batchDate = date.toISOString().slice(0, 10);
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    SELECT vec_hash, payload_hash, hash_algo\n    FROM ", "\n    WHERE DATE(created_at) = ", "\n    ORDER BY created_at ASC\n  "], ["\n    SELECT vec_hash, payload_hash, hash_algo\n    FROM ", "\n    WHERE DATE(created_at) = ", "\n    ORDER BY created_at ASC\n  "])), drizzle_orm_1.sql.raw(TABLE), batchDate))];
                case 1:
                    result = _a.sent();
                    rows = result.rows;
                    if (rows.length === 0) {
                        return [2 /*return*/, null];
                    }
                    algo = rows[0].hash_algo;
                    leaves = rows.map(function (row) {
                        var combined = buffer_1.Buffer.from("".concat(row.vec_hash, ":").concat(row.payload_hash), "utf-8");
                        return (0, hash_1.hashBuffer)(combined, algo);
                    });
                    merkleRoot = (0, merkle_1.computeMerkleRoot)(leaves, algo);
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    INSERT INTO ", " (batch_date, merkle_root, hash_algo, event_count)\n    VALUES (", ", ", ", ", ", ", ")\n    ON CONFLICT (batch_date)\n    DO UPDATE SET merkle_root = EXCLUDED.merkle_root,\n                  hash_algo = EXCLUDED.hash_algo,\n                  event_count = EXCLUDED.event_count,\n                  computed_at = NOW();\n  "], ["\n    INSERT INTO ", " (batch_date, merkle_root, hash_algo, event_count)\n    VALUES (", ", ", ", ", ", ", ")\n    ON CONFLICT (batch_date)\n    DO UPDATE SET merkle_root = EXCLUDED.merkle_root,\n                  hash_algo = EXCLUDED.hash_algo,\n                  event_count = EXCLUDED.event_count,\n                  computed_at = NOW();\n  "])), drizzle_orm_1.sql.raw("dreamnet_trust.vector_roots"), batchDate, merkleRoot, algo, rows.length))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, starbridge_1.publishInternalEvent)({
                            topic: starbridge_1.StarbridgeTopic.System,
                            source: starbridge_1.StarbridgeSource.Runtime,
                            type: "vector.rollup.completed",
                            payload: {
                                batchDate: batchDate,
                                merkleRoot: merkleRoot,
                                hashAlgo: algo,
                                eventCount: rows.length,
                            },
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, metrics_1.recordMetric)("vector.rollup", {
                            batchDate: batchDate,
                            merkleRoot: merkleRoot,
                            hashAlgo: algo,
                            eventCount: rows.length,
                            computedAt: new Date().toISOString(),
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/, { batchDate: batchDate, merkleRoot: merkleRoot, hashAlgo: algo, eventCount: rows.length }];
            }
        });
    });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
