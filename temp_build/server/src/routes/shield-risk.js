"use strict";
/**
 * Shield Risk Panel
 * Exposes risk profiles for DreamScope/Civic Panel
 */
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
var risk_1 = require("../../packages/shield-core/src/risk");
var withPort_1 = require("../../packages/port-governor/src/withPort");
var controlCoreMiddleware_1 = require("../../packages/dreamnet-control-core/controlCoreMiddleware");
var router = (0, express_1.Router)();
/**
 * GET /api/shield/risk
 * Get Shield Risk profiles (admin-only)
 * Shows risk scores, levels, and recent high-risk activity
 */
router.get("/shield/risk", (0, withPort_1.withPort)("AGENT_GATEWAY"), (0, controlCoreMiddleware_1.withGovernance)({ clusterId: "SHIELD_CORE", requiredCabinetId: ["SHIELD_CABINET"] }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var r, traceId, filterLevel, profiles, stats;
    return __generator(this, function (_a) {
        try {
            r = req;
            traceId = r.traceId || "unknown";
            filterLevel = req.query.level;
            profiles = (0, risk_1.listRiskProfiles)();
            // Filter by level if specified
            if (filterLevel && ["low", "medium", "high", "critical"].includes(filterLevel)) {
                profiles = (0, risk_1.getRiskProfilesByLevel)(filterLevel);
            }
            // Sort by score (highest risk first)
            profiles.sort(function (a, b) { return b.score - a.score; });
            stats = {
                total: (0, risk_1.listRiskProfiles)().length,
                byLevel: {
                    low: (0, risk_1.getRiskProfilesByLevel)("low").length,
                    medium: (0, risk_1.getRiskProfilesByLevel)("medium").length,
                    high: (0, risk_1.getRiskProfilesByLevel)("high").length,
                    critical: (0, risk_1.getRiskProfilesByLevel)("critical").length,
                },
                averageScore: profiles.length > 0
                    ? profiles.reduce(function (sum, p) { return sum + p.score; }, 0) / profiles.length
                    : 0,
            };
            return [2 /*return*/, res.json({
                    success: true,
                    traceId: traceId,
                    count: profiles.length,
                    profiles: profiles,
                    stats: stats,
                    timestamp: new Date().toISOString(),
                })];
        }
        catch (error) {
            res.status(500).json({
                error: "SHIELD_RISK_ERROR",
                message: error.message,
                traceId: req.traceId || "unknown",
            });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
