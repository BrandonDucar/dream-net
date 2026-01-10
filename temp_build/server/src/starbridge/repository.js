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
exports.starbridgeEvents = void 0;
exports.persistEvent = persistEvent;
exports.markEventReplayed = markEventReplayed;
exports.fetchEvents = fetchEvents;
var drizzle_orm_1 = require("drizzle-orm");
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_zod_1 = require("drizzle-zod");
var db_1 = require("../db");
var STARBRIDGE_TOPICS = ['Governor', 'Deploy', 'System', 'Economy', 'Vault'];
var STARBRIDGE_SOURCES = ['Runtime', 'ComputeGovernor', 'DeployKeeper', 'DreamKeeper', 'RelayBot', 'External'];
var starbridgeTopicEnum = (0, pg_core_1.pgEnum)("starbridge_topic", STARBRIDGE_TOPICS);
var starbridgeSourceEnum = (0, pg_core_1.pgEnum)("starbridge_source", STARBRIDGE_SOURCES);
exports.starbridgeEvents = (0, pg_core_1.pgTable)("starbridge_events", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    topic: starbridgeTopicEnum("topic").notNull(),
    source: starbridgeSourceEnum("source").notNull(),
    type: (0, pg_core_1.text)("type").notNull(),
    ts: (0, pg_core_1.timestamp)("ts", { withTimezone: true }).defaultNow().notNull(),
    payload: (0, pg_core_1.jsonb)("payload"),
    replayed: (0, pg_core_1.boolean)("replayed").default(false).notNull(),
});
var insertStarbridgeEventSchema = (0, drizzle_zod_1.createInsertSchema)(exports.starbridgeEvents);
var initialized = false;
function ensureInitialized() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (initialized)
                        return [2 /*return*/];
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    DO $$\n    BEGIN\n      CREATE TYPE starbridge_topic AS ENUM ('Governor', 'Deploy', 'System', 'Economy', 'Vault');\n    EXCEPTION WHEN duplicate_object THEN NULL;\n    END $$;\n  "], ["\n    DO $$\n    BEGIN\n      CREATE TYPE starbridge_topic AS ENUM ('Governor', 'Deploy', 'System', 'Economy', 'Vault');\n    EXCEPTION WHEN duplicate_object THEN NULL;\n    END $$;\n  "]))))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    DO $$\n    BEGIN\n      CREATE TYPE starbridge_source AS ENUM ('Runtime', 'ComputeGovernor', 'DeployKeeper', 'DreamKeeper', 'RelayBot', 'External');\n    EXCEPTION WHEN duplicate_object THEN NULL;\n    END $$;\n  "], ["\n    DO $$\n    BEGIN\n      CREATE TYPE starbridge_source AS ENUM ('Runtime', 'ComputeGovernor', 'DeployKeeper', 'DreamKeeper', 'RelayBot', 'External');\n    EXCEPTION WHEN duplicate_object THEN NULL;\n    END $$;\n  "]))))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    CREATE TABLE IF NOT EXISTS starbridge_events (\n      id TEXT PRIMARY KEY,\n      topic starbridge_topic NOT NULL,\n      source starbridge_source NOT NULL,\n      type TEXT NOT NULL,\n      ts TIMESTAMPTZ NOT NULL DEFAULT now(),\n      payload JSONB,\n      replayed BOOLEAN NOT NULL DEFAULT false\n    );\n  "], ["\n    CREATE TABLE IF NOT EXISTS starbridge_events (\n      id TEXT PRIMARY KEY,\n      topic starbridge_topic NOT NULL,\n      source starbridge_source NOT NULL,\n      type TEXT NOT NULL,\n      ts TIMESTAMPTZ NOT NULL DEFAULT now(),\n      payload JSONB,\n      replayed BOOLEAN NOT NULL DEFAULT false\n    );\n  "]))))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    CREATE INDEX IF NOT EXISTS starbridge_events_ts_idx ON starbridge_events (ts DESC);\n  "], ["\n    CREATE INDEX IF NOT EXISTS starbridge_events_ts_idx ON starbridge_events (ts DESC);\n  "]))))];
                case 4:
                    _a.sent();
                    initialized = true;
                    return [2 /*return*/];
            }
        });
    });
}
function persistEvent(event) {
    return __awaiter(this, void 0, void 0, function () {
        var parsed;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ensureInitialized()];
                case 1:
                    _b.sent();
                    parsed = insertStarbridgeEventSchema.parse({
                        id: event.id,
                        topic: event.topic,
                        source: event.source,
                        type: event.type,
                        ts: event.ts,
                        payload: (_a = event.payload) !== null && _a !== void 0 ? _a : null,
                    });
                    return [4 /*yield*/, db_1.db
                            .insert(exports.starbridgeEvents)
                            .values(parsed)
                            .onConflictDoNothing({ target: exports.starbridgeEvents.id })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function markEventReplayed(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureInitialized()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db_1.db
                            .update(exports.starbridgeEvents)
                            .set({ replayed: true })
                            .where((0, drizzle_orm_1.eq)(exports.starbridgeEvents.id, id))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function fetchEvents() {
    return __awaiter(this, arguments, void 0, function (options) {
        var topics, _a, limit, since, conditions, validTopics, builder, rows;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ensureInitialized()];
                case 1:
                    _b.sent();
                    topics = options.topics, _a = options.limit, limit = _a === void 0 ? 100 : _a, since = options.since;
                    conditions = [];
                    if (topics && topics.length > 0) {
                        validTopics = topics.filter(function (topic) {
                            return STARBRIDGE_TOPICS.includes(topic);
                        });
                        if (validTopics.length > 0) {
                            conditions.push((0, drizzle_orm_1.inArray)(exports.starbridgeEvents.topic, validTopics));
                        }
                    }
                    if (since) {
                        conditions.push((0, drizzle_orm_1.gt)(exports.starbridgeEvents.ts, since));
                    }
                    builder = db_1.db.select().from(exports.starbridgeEvents);
                    if (conditions.length === 1) {
                        builder = builder.where(conditions[0]);
                    }
                    else if (conditions.length > 1) {
                        builder = builder.where(drizzle_orm_1.and.apply(void 0, conditions));
                    }
                    return [4 /*yield*/, builder.orderBy((0, drizzle_orm_1.desc)(exports.starbridgeEvents.ts)).limit(limit).execute()];
                case 2:
                    rows = _b.sent();
                    return [2 /*return*/, rows];
            }
        });
    });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
