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
var express_1 = require("express");
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("../db");
var metrics_1 = require("../trust/metrics");
var router = (0, express_1.Router)();
router.get("/trust", function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var vectorRoots, zkRoots, watchdogAlerts, metrics;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    SELECT * FROM dreamnet_trust.vector_roots ORDER BY batch_date DESC LIMIT 5\n  "], ["\n    SELECT * FROM dreamnet_trust.vector_roots ORDER BY batch_date DESC LIMIT 5\n  "]))))];
            case 1:
                vectorRoots = _a.sent();
                return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    SELECT * FROM dreamnet_trust.zk_roots ORDER BY batch_date DESC LIMIT 5\n  "], ["\n    SELECT * FROM dreamnet_trust.zk_roots ORDER BY batch_date DESC LIMIT 5\n  "]))))];
            case 2:
                zkRoots = _a.sent();
                return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    SELECT alert_id, severity, message, created_at\n    FROM dreamnet_trust.watchdog_alerts\n    ORDER BY created_at DESC\n    LIMIT 5\n  "], ["\n    SELECT alert_id, severity, message, created_at\n    FROM dreamnet_trust.watchdog_alerts\n    ORDER BY created_at DESC\n    LIMIT 5\n  "]))))];
            case 3:
                watchdogAlerts = _a.sent();
                return [4 /*yield*/, (0, metrics_1.listMetrics)()];
            case 4:
                metrics = _a.sent();
                res.json({
                    success: true,
                    vectorRoots: vectorRoots.rows,
                    zkRoots: zkRoots.rows,
                    watchdogAlerts: watchdogAlerts.rows,
                    metrics: metrics,
                });
                return [2 /*return*/];
        }
    });
}); });
exports.default = router;
var templateObject_1, templateObject_2, templateObject_3;
