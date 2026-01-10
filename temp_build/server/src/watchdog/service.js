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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWatchdogSnapshot = runWatchdogSnapshot;
var fast_glob_1 = require("fast-glob");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("../db");
var nanoid_1 = require("nanoid");
var hash_1 = require("../trust/hash");
var metrics_1 = require("../trust/metrics");
var starbridge_1 = require("../starbridge");
var FINGERPRINTS = "dreamnet_trust.repo_fingerprints";
var ALERTS = "dreamnet_trust.watchdog_alerts";
var WATCH_PATH = (_a = process.env.WATCHDOG_ROOT) !== null && _a !== void 0 ? _a : path_1.default.resolve(process.cwd());
var ALERT_WEBHOOK = process.env.ALERT_WEBHOOK_URL;
var ignorePatterns = [
    "**/node_modules/**",
    "**/.git/**",
    "**/.next/**",
    "**/dist/**",
    "**/build/**",
    "**/.turbo/**",
];
function readSnapshot(snapshotId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, map, _i, _a, row;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    SELECT path, hash, size_bytes FROM ", "\n    WHERE snapshot_id = ", "\n  "], ["\n    SELECT path, hash, size_bytes FROM ", "\n    WHERE snapshot_id = ", "\n  "])), drizzle_orm_1.sql.raw(FINGERPRINTS), snapshotId))];
                case 1:
                    result = _c.sent();
                    map = new Map();
                    for (_i = 0, _a = result.rows; _i < _a.length; _i++) {
                        row = _a[_i];
                        map.set(row.path, { hash: row.hash, size: Number((_b = row.size_bytes) !== null && _b !== void 0 ? _b : 0) });
                    }
                    return [2 /*return*/, map];
            }
        });
    });
}
function latestSnapshotId() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    SELECT snapshot_id FROM ", "\n    ORDER BY recorded_at DESC\n    LIMIT 1\n  "], ["\n    SELECT snapshot_id FROM ", "\n    ORDER BY recorded_at DESC\n    LIMIT 1\n  "])), drizzle_orm_1.sql.raw(FINGERPRINTS)))];
                case 1:
                    result = _d.sent();
                    return [2 /*return*/, (_c = (_b = (_a = result.rows) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.snapshot_id) !== null && _c !== void 0 ? _c : null];
            }
        });
    });
}
function saveSnapshot(snapshotId, entries) {
    return __awaiter(this, void 0, void 0, function () {
        var values;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    values = entries.map(function (entry) {
                        return (0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["(", ", ", ", ", ", ", ", ", ", NOW())"], ["(", ", ", ", ", ", ", ", ", ", NOW())"])), snapshotId, entry.path, hash_1.activeHashAlgo, entry.hash, entry.size);
                    });
                    if (values.length === 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    INSERT INTO ", " (snapshot_id, path, hash_algo, hash, size_bytes, recorded_at)\n    VALUES ", "\n    ON CONFLICT (snapshot_id, path)\n    DO UPDATE SET hash = EXCLUDED.hash, size_bytes = EXCLUDED.size_bytes, recorded_at = EXCLUDED.recorded_at;\n  "], ["\n    INSERT INTO ", " (snapshot_id, path, hash_algo, hash, size_bytes, recorded_at)\n    VALUES ", "\n    ON CONFLICT (snapshot_id, path)\n    DO UPDATE SET hash = EXCLUDED.hash, size_bytes = EXCLUDED.size_bytes, recorded_at = EXCLUDED.recorded_at;\n  "])), drizzle_orm_1.sql.raw(FINGERPRINTS), drizzle_orm_1.sql.join(values, (0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject([", "], [", "]))))))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createAlert(severity, message, diff) {
    return __awaiter(this, void 0, void 0, function () {
        var alertId, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    alertId = (0, nanoid_1.nanoid)();
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    INSERT INTO ", " (alert_id, severity, message, diff)\n    VALUES (", ", ", ", ", ", ", ")\n  "], ["\n    INSERT INTO ", " (alert_id, severity, message, diff)\n    VALUES (", ", ", ", ", ", ", ")\n  "])), drizzle_orm_1.sql.raw(ALERTS), alertId, severity, message, JSON.stringify(diff)))];
                case 1:
                    _a.sent();
                    if (!ALERT_WEBHOOK) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fetch(ALERT_WEBHOOK, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ alertId: alertId, severity: severity, message: message, diff: diff }),
                        })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("[Watchdog] Failed to post alert webhook", error_1);
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, (0, starbridge_1.publishInternalEvent)({
                        topic: starbridge_1.StarbridgeTopic.System,
                        source: starbridge_1.StarbridgeSource.Runtime,
                        type: "watchdog.alert",
                        payload: { alertId: alertId, severity: severity, message: message },
                    })];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function runWatchdogSnapshot() {
    return __awaiter(this, void 0, void 0, function () {
        var previousSnapshotId, files, snapshotId, entries, _i, files_1, relPath, absolute, data, hash, diff, prev, current, _a, _b, _c, pathKey, info, _d, _e, pathKey;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, latestSnapshotId()];
                case 1:
                    previousSnapshotId = _f.sent();
                    return [4 /*yield*/, (0, fast_glob_1.default)("**/*", {
                            cwd: WATCH_PATH,
                            dot: false,
                            ignore: ignorePatterns,
                            onlyFiles: true,
                        })];
                case 2:
                    files = _f.sent();
                    snapshotId = (0, nanoid_1.nanoid)();
                    entries = [];
                    _i = 0, files_1 = files;
                    _f.label = 3;
                case 3:
                    if (!(_i < files_1.length)) return [3 /*break*/, 6];
                    relPath = files_1[_i];
                    absolute = path_1.default.join(WATCH_PATH, relPath);
                    return [4 /*yield*/, promises_1.default.readFile(absolute)];
                case 4:
                    data = _f.sent();
                    hash = (0, hash_1.hashBuffer)(data, hash_1.activeHashAlgo);
                    entries.push({ path: relPath, hash: hash, size: data.length });
                    _f.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    diff = { added: [], removed: [], changed: [] };
                    if (!(previousSnapshotId && previousSnapshotId !== snapshotId)) return [3 /*break*/, 9];
                    return [4 /*yield*/, readSnapshot(previousSnapshotId)];
                case 7:
                    prev = _f.sent();
                    current = new Map(entries.map(function (entry) { return [entry.path, entry]; }));
                    for (_a = 0, _b = current.entries(); _a < _b.length; _a++) {
                        _c = _b[_a], pathKey = _c[0], info = _c[1];
                        if (!prev.has(pathKey)) {
                            diff.added.push(pathKey);
                        }
                        else if (prev.get(pathKey).hash !== info.hash) {
                            diff.changed.push(pathKey);
                        }
                    }
                    for (_d = 0, _e = prev.keys(); _d < _e.length; _d++) {
                        pathKey = _e[_d];
                        if (!current.has(pathKey)) {
                            diff.removed.push(pathKey);
                        }
                    }
                    if (!(diff.added.length || diff.changed.length || diff.removed.length)) return [3 /*break*/, 9];
                    return [4 /*yield*/, createAlert("medium", "Watchdog detected changes: +".concat(diff.added.length, " ~").concat(diff.changed.length, " -").concat(diff.removed.length), diff)];
                case 8:
                    _f.sent();
                    _f.label = 9;
                case 9: return [4 /*yield*/, saveSnapshot(snapshotId, entries)];
                case 10:
                    _f.sent();
                    return [4 /*yield*/, (0, metrics_1.recordMetric)("watchdog.snapshot", {
                            snapshotId: snapshotId,
                            files: entries.length,
                            diff: diff,
                            timestamp: new Date().toISOString(),
                        })];
                case 11:
                    _f.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
