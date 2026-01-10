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
exports.runTrustMigrations = runTrustMigrations;
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("../db");
var TRUST_SCHEMA = "dreamnet_trust";
var initialized = false;
function createSchema() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["CREATE SCHEMA IF NOT EXISTS ", ";"], ["CREATE SCHEMA IF NOT EXISTS ", ";"])), drizzle_orm_1.sql.raw(TRUST_SCHEMA)))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createVectorLedger() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    CREATE TABLE IF NOT EXISTS ", " (\n      id TEXT PRIMARY KEY,\n      object_type TEXT NOT NULL,\n      object_id TEXT NOT NULL,\n      model TEXT NOT NULL,\n      dim INTEGER NOT NULL,\n      hash_algo TEXT NOT NULL DEFAULT 'SHA-256',\n      vec_hash TEXT NOT NULL,\n      payload_hash TEXT NOT NULL,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n  "], ["\n    CREATE TABLE IF NOT EXISTS ", " (\n      id TEXT PRIMARY KEY,\n      object_type TEXT NOT NULL,\n      object_id TEXT NOT NULL,\n      model TEXT NOT NULL,\n      dim INTEGER NOT NULL,\n      hash_algo TEXT NOT NULL DEFAULT 'SHA-256',\n      vec_hash TEXT NOT NULL,\n      payload_hash TEXT NOT NULL,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n  "])), drizzle_orm_1.sql.raw("".concat(TRUST_SCHEMA, ".vector_events"))))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    CREATE INDEX IF NOT EXISTS vector_events_object_idx\n      ON ", " (object_type, object_id);\n  "], ["\n    CREATE INDEX IF NOT EXISTS vector_events_object_idx\n      ON ", " (object_type, object_id);\n  "])), drizzle_orm_1.sql.raw("".concat(TRUST_SCHEMA, ".vector_events"))))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    CREATE TABLE IF NOT EXISTS ", " (\n      batch_date DATE PRIMARY KEY,\n      merkle_root TEXT NOT NULL,\n      hash_algo TEXT NOT NULL,\n      event_count INTEGER NOT NULL,\n      computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n  "], ["\n    CREATE TABLE IF NOT EXISTS ", " (\n      batch_date DATE PRIMARY KEY,\n      merkle_root TEXT NOT NULL,\n      hash_algo TEXT NOT NULL,\n      event_count INTEGER NOT NULL,\n      computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n  "])), drizzle_orm_1.sql.raw("".concat(TRUST_SCHEMA, ".vector_roots"))))];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createReputationGraph() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    CREATE TABLE IF NOT EXISTS ", " (\n      id TEXT PRIMARY KEY,\n      type TEXT NOT NULL,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n  "], ["\n    CREATE TABLE IF NOT EXISTS ", " (\n      id TEXT PRIMARY KEY,\n      type TEXT NOT NULL,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n  "])), drizzle_orm_1.sql.raw("".concat(TRUST_SCHEMA, ".rep_nodes"))))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    CREATE TABLE IF NOT EXISTS ", " (\n      src TEXT NOT NULL,\n      dst TEXT NOT NULL,\n      kind TEXT NOT NULL,\n      weight DOUBLE PRECISION NOT NULL DEFAULT 1.0,\n      signature TEXT,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      PRIMARY KEY (src, dst, kind),\n      FOREIGN KEY (src) REFERENCES ", " (id) ON DELETE CASCADE,\n      FOREIGN KEY (dst) REFERENCES ", " (id) ON DELETE CASCADE\n    );\n  "], ["\n    CREATE TABLE IF NOT EXISTS ", " (\n      src TEXT NOT NULL,\n      dst TEXT NOT NULL,\n      kind TEXT NOT NULL,\n      weight DOUBLE PRECISION NOT NULL DEFAULT 1.0,\n      signature TEXT,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      PRIMARY KEY (src, dst, kind),\n      FOREIGN KEY (src) REFERENCES ", " (id) ON DELETE CASCADE,\n      FOREIGN KEY (dst) REFERENCES ", " (id) ON DELETE CASCADE\n    );\n  "])), drizzle_orm_1.sql.raw("".concat(TRUST_SCHEMA, ".rep_edges")), drizzle_orm_1.sql.raw("".concat(TRUST_SCHEMA, ".rep_nodes")), drizzle_orm_1.sql.raw("".concat(TRUST_SCHEMA, ".rep_nodes"))))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n    CREATE TABLE IF NOT EXISTS ", " (\n      node_id TEXT PRIMARY KEY REFERENCES ", " (id) ON DELETE CASCADE,\n      score DOUBLE PRECISION NOT NULL,\n      computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n  "], ["\n    CREATE TABLE IF NOT EXISTS ", " (\n      node_id TEXT PRIMARY KEY REFERENCES ", " (id) ON DELETE CASCADE,\n      score DOUBLE PRECISION NOT NULL,\n      computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n  "])), drizzle_orm_1.sql.raw("".concat(TRUST_SCHEMA, ".rep_scores")), drizzle_orm_1.sql.raw("".concat(TRUST_SCHEMA, ".rep_nodes"))))];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createZkLayer() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n    CREATE TABLE IF NOT EXISTS ", " (\n      content_hash TEXT PRIMARY KEY,\n      proof_hash TEXT NOT NULL,\n      backend TEXT NOT NULL,\n      anchor_root TEXT,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n  "], ["\n    CREATE TABLE IF NOT EXISTS ", " (\n      content_hash TEXT PRIMARY KEY,\n      proof_hash TEXT NOT NULL,\n      backend TEXT NOT NULL,\n      anchor_root TEXT,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n  "])), drizzle_orm_1.sql.raw("".concat(TRUST_SCHEMA, ".zk_attestations"))))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n    CREATE TABLE IF NOT EXISTS ", " (\n      batch_date DATE PRIMARY KEY,\n      merkle_root TEXT NOT NULL,\n      proof_count INTEGER NOT NULL,\n      computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n  "], ["\n    CREATE TABLE IF NOT EXISTS ", " (\n      batch_date DATE PRIMARY KEY,\n      merkle_root TEXT NOT NULL,\n      proof_count INTEGER NOT NULL,\n      computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n  "])), drizzle_orm_1.sql.raw("".concat(TRUST_SCHEMA, ".zk_roots"))))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createWatchdogTables() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n    CREATE TABLE IF NOT EXISTS ", " (\n      snapshot_id TEXT NOT NULL,\n      path TEXT NOT NULL,\n      hash_algo TEXT NOT NULL DEFAULT 'SHA-256',\n      hash TEXT NOT NULL,\n      size_bytes BIGINT,\n      recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      PRIMARY KEY (snapshot_id, path)\n    );\n  "], ["\n    CREATE TABLE IF NOT EXISTS ", " (\n      snapshot_id TEXT NOT NULL,\n      path TEXT NOT NULL,\n      hash_algo TEXT NOT NULL DEFAULT 'SHA-256',\n      hash TEXT NOT NULL,\n      size_bytes BIGINT,\n      recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      PRIMARY KEY (snapshot_id, path)\n    );\n  "])), drizzle_orm_1.sql.raw("".concat(TRUST_SCHEMA, ".repo_fingerprints"))))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n    CREATE TABLE IF NOT EXISTS ", " (\n      alert_id TEXT PRIMARY KEY,\n      severity TEXT NOT NULL,\n      message TEXT NOT NULL,\n      diff JSONB,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n  "], ["\n    CREATE TABLE IF NOT EXISTS ", " (\n      alert_id TEXT PRIMARY KEY,\n      severity TEXT NOT NULL,\n      message TEXT NOT NULL,\n      diff JSONB,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n  "])), drizzle_orm_1.sql.raw("".concat(TRUST_SCHEMA, ".watchdog_alerts"))))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createMetricsView() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n    CREATE TABLE IF NOT EXISTS ", " (\n      id TEXT PRIMARY KEY,\n      payload JSONB NOT NULL,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n  "], ["\n    CREATE TABLE IF NOT EXISTS ", " (\n      id TEXT PRIMARY KEY,\n      payload JSONB NOT NULL,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n  "])), drizzle_orm_1.sql.raw("".concat(TRUST_SCHEMA, ".trust_metrics"))))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function runTrustMigrations() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (initialized)
                        return [2 /*return*/];
                    return [4 /*yield*/, createSchema()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Promise.all([
                            createVectorLedger(),
                            createReputationGraph(),
                            createZkLayer(),
                            createWatchdogTables(),
                            createMetricsView(),
                        ])];
                case 2:
                    _a.sent();
                    initialized = true;
                    return [2 /*return*/];
            }
        });
    });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
