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
exports.ensureNode = ensureNode;
exports.addEdge = addEdge;
exports.getScore = getScore;
exports.recomputeScores = recomputeScores;
exports.getLeaderboard = getLeaderboard;
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("../db");
var starbridge_1 = require("../starbridge");
var metrics_1 = require("../trust/metrics");
var NODES = "dreamnet_trust.rep_nodes";
var EDGES = "dreamnet_trust.rep_edges";
var SCORES = "dreamnet_trust.rep_scores";
function ensureNode(id, type) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    INSERT INTO ", " (id, type)\n    VALUES (", ", ", ")\n    ON CONFLICT (id) DO NOTHING;\n  "], ["\n    INSERT INTO ", " (id, type)\n    VALUES (", ", ", ")\n    ON CONFLICT (id) DO NOTHING;\n  "])), drizzle_orm_1.sql.raw(NODES), id, type))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function addEdge(input) {
    return __awaiter(this, void 0, void 0, function () {
        var weight;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ensureNode(input.src, "unknown")];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, ensureNode(input.dst, "unknown")];
                case 2:
                    _c.sent();
                    weight = (_a = input.weight) !== null && _a !== void 0 ? _a : 1.0;
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    INSERT INTO ", " (src, dst, kind, weight, signature)\n    VALUES (", ", ", ", ", ", ", ", ", ")\n    ON CONFLICT (src, dst, kind)\n    DO UPDATE SET weight = EXCLUDED.weight, signature = EXCLUDED.signature, created_at = NOW();\n  "], ["\n    INSERT INTO ", " (src, dst, kind, weight, signature)\n    VALUES (", ", ", ", ", ", ", ", ", ")\n    ON CONFLICT (src, dst, kind)\n    DO UPDATE SET weight = EXCLUDED.weight, signature = EXCLUDED.signature, created_at = NOW();\n  "])), drizzle_orm_1.sql.raw(EDGES), input.src, input.dst, input.kind, weight, (_b = input.signature) !== null && _b !== void 0 ? _b : null))];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, starbridge_1.publishInternalEvent)({
                            topic: starbridge_1.StarbridgeTopic.Governor,
                            source: starbridge_1.StarbridgeSource.Runtime,
                            type: "reputation.edge.added",
                            payload: {
                                src: input.src,
                                dst: input.dst,
                                kind: input.kind,
                                weight: weight,
                            },
                        })];
                case 4:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getScore(nodeId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    SELECT score, computed_at FROM ", " WHERE node_id = ", "\n  "], ["\n    SELECT score, computed_at FROM ", " WHERE node_id = ", "\n  "])), drizzle_orm_1.sql.raw(SCORES), nodeId))];
                case 1:
                    result = _c.sent();
                    return [2 /*return*/, (_b = (_a = result.rows) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null];
            }
        });
    });
}
function recomputeScores() {
    return __awaiter(this, arguments, void 0, function (iterations) {
        var damping, nodesResult, nodes, edgesResult, edges, outgoingWeights, adjacency, _i, edges_1, edge, list, N, initial, scores, iter, next, _a, nodes_1, node, _b, nodes_2, node, outgoing, nodeScore, totalWeight, _c, outgoing_1, _d, dst, weight, contribution, entries, nodeIds, _e, entries_1, _f, node, score;
        var _g, _h, _j, _k, _l, _m;
        if (iterations === void 0) { iterations = 20; }
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    damping = Number((_g = process.env.REP_DAMPING) !== null && _g !== void 0 ? _g : 0.85);
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["SELECT id FROM ", ""], ["SELECT id FROM ", ""])), drizzle_orm_1.sql.raw(NODES)))];
                case 1:
                    nodesResult = _o.sent();
                    nodes = nodesResult.rows.map(function (row) { return row.id; });
                    if (nodes.length === 0) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    SELECT src, dst, weight FROM ", "\n  "], ["\n    SELECT src, dst, weight FROM ", "\n  "])), drizzle_orm_1.sql.raw(EDGES)))];
                case 2:
                    edgesResult = _o.sent();
                    edges = edgesResult.rows;
                    outgoingWeights = new Map();
                    adjacency = new Map();
                    for (_i = 0, edges_1 = edges; _i < edges_1.length; _i++) {
                        edge = edges_1[_i];
                        list = (_h = adjacency.get(edge.src)) !== null && _h !== void 0 ? _h : [];
                        list.push({ dst: edge.dst, weight: edge.weight });
                        adjacency.set(edge.src, list);
                        outgoingWeights.set(edge.src, ((_j = outgoingWeights.get(edge.src)) !== null && _j !== void 0 ? _j : 0) + edge.weight);
                    }
                    N = nodes.length;
                    initial = 1 / N;
                    scores = new Map(nodes.map(function (id) { return [id, initial]; }));
                    for (iter = 0; iter < iterations; iter++) {
                        next = new Map();
                        for (_a = 0, nodes_1 = nodes; _a < nodes_1.length; _a++) {
                            node = nodes_1[_a];
                            next.set(node, (1 - damping) / N);
                        }
                        for (_b = 0, nodes_2 = nodes; _b < nodes_2.length; _b++) {
                            node = nodes_2[_b];
                            outgoing = adjacency.get(node);
                            if (!outgoing || outgoing.length === 0)
                                continue;
                            nodeScore = (_k = scores.get(node)) !== null && _k !== void 0 ? _k : initial;
                            totalWeight = (_l = outgoingWeights.get(node)) !== null && _l !== void 0 ? _l : outgoing.length;
                            for (_c = 0, outgoing_1 = outgoing; _c < outgoing_1.length; _c++) {
                                _d = outgoing_1[_c], dst = _d.dst, weight = _d.weight;
                                contribution = damping * nodeScore * (weight / totalWeight);
                                next.set(dst, ((_m = next.get(dst)) !== null && _m !== void 0 ? _m : 0) + contribution);
                            }
                        }
                        scores = next;
                    }
                    entries = Array.from(scores.entries());
                    if (!(entries.length > 0)) return [3 /*break*/, 4];
                    nodeIds = entries.map(function (_a) {
                        var id = _a[0];
                        return id;
                    });
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      DELETE FROM ", "\n      WHERE node_id <> ALL(", ")\n    "], ["\n      DELETE FROM ", "\n      WHERE node_id <> ALL(", ")\n    "])), drizzle_orm_1.sql.raw(SCORES), drizzle_orm_1.sql.array(nodeIds, "text")))];
                case 3:
                    _o.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["DELETE FROM ", ""], ["DELETE FROM ", ""])), drizzle_orm_1.sql.raw(SCORES)))];
                case 5:
                    _o.sent();
                    _o.label = 6;
                case 6:
                    _e = 0, entries_1 = entries;
                    _o.label = 7;
                case 7:
                    if (!(_e < entries_1.length)) return [3 /*break*/, 10];
                    _f = entries_1[_e], node = _f[0], score = _f[1];
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n      INSERT INTO ", " (node_id, score, computed_at)\n      VALUES (", ", ", ", NOW())\n      ON CONFLICT (node_id)\n      DO UPDATE SET score = EXCLUDED.score, computed_at = EXCLUDED.computed_at;\n    "], ["\n      INSERT INTO ", " (node_id, score, computed_at)\n      VALUES (", ", ", ", NOW())\n      ON CONFLICT (node_id)\n      DO UPDATE SET score = EXCLUDED.score, computed_at = EXCLUDED.computed_at;\n    "])), drizzle_orm_1.sql.raw(SCORES), node, score))];
                case 8:
                    _o.sent();
                    _o.label = 9;
                case 9:
                    _e++;
                    return [3 /*break*/, 7];
                case 10: return [4 /*yield*/, (0, metrics_1.recordMetric)("reputation.scores", {
                        nodeCount: nodes.length,
                        edgeCount: edges.length,
                        lastComputedAt: new Date().toISOString(),
                    })];
                case 11:
                    _o.sent();
                    return [4 /*yield*/, (0, starbridge_1.publishInternalEvent)({
                            topic: starbridge_1.StarbridgeTopic.Governor,
                            source: starbridge_1.StarbridgeSource.ComputeGovernor,
                            type: "reputation.scores.updated",
                            payload: { nodeCount: nodes.length, edgeCount: edges.length },
                        })];
                case 12:
                    _o.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getLeaderboard() {
    return __awaiter(this, arguments, void 0, function (limit) {
        var result;
        if (limit === void 0) { limit = 10; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n    SELECT node_id, score FROM ", "\n    ORDER BY score DESC\n    LIMIT ", "\n  "], ["\n    SELECT node_id, score FROM ", "\n    ORDER BY score DESC\n    LIMIT ", "\n  "])), drizzle_orm_1.sql.raw(SCORES), limit))];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.rows];
            }
        });
    });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
