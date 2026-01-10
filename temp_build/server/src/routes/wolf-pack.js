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
exports.createWolfPackRouter = createWolfPackRouter;
var express_1 = require("express");
var WolfPack_1 = require("../agents/WolfPack");
var wolf_pack_activate_1 = require("./wolf-pack-activate");
var controlCoreMiddleware_1 = require("../../packages/dreamnet-control-core/controlCoreMiddleware");
// Rewards engine is optional
var grantReward = null;
try {
    var rewardsModule = require("../../packages/rewards-engine");
    grantReward = rewardsModule.grantReward;
}
catch (_a) {
    console.warn("[Wolf Pack] @dreamnet/rewards-engine not available");
}
function createWolfPackRouter() {
    var _this = this;
    var router = (0, express_1.Router)();
    // Attach WOLF_PACK cluster to all routes in this router
    // This enables Control Core middleware to enforce:
    // - Feature flag: canAccessWolfPack
    // - Rate limits: min(tierLimit, clusterLimit)
    // - Cluster enable/disable
    router.use((0, controlCoreMiddleware_1.withCluster)("WOLF_PACK"));
    // Middleware to get user ID (for paid feature)
    var getUserId = function (req) {
        return req.headers["x-user-id"] ||
            req.query.userId ||
            undefined;
    };
    // GET /api/wolf-pack/opportunities - Get all funding opportunities
    router.get("/wolf-pack/opportunities", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, source_1, status_1, opportunities;
        return __generator(this, function (_b) {
            try {
                _a = req.query, source_1 = _a.source, status_1 = _a.status;
                opportunities = WolfPack_1.wolfPack.getOpportunities();
                if (source_1) {
                    opportunities = opportunities.filter(function (opp) { return opp.source === source_1; });
                }
                if (status_1) {
                    opportunities = opportunities.filter(function (opp) { return opp.status === status_1; });
                }
                res.json({ ok: true, opportunities: opportunities });
            }
            catch (error) {
                console.error("Failed to get opportunities:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // POST /api/wolf-pack/discover - Trigger discovery (admin or paid feature)
    router.post("/wolf-pack/discover", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, opportunities, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = getUserId(req);
                    return [4 /*yield*/, WolfPack_1.wolfPack.discoverOpportunities()];
                case 1:
                    opportunities = _a.sent();
                    res.json({ ok: true, opportunities: opportunities, count: opportunities.length });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Failed to discover opportunities:", error_1);
                    res.status(500).json({ error: error_1.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // POST /api/wolf-pack/hunt - Create a new funding hunt
    router.post("/wolf-pack/hunt", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, targetAmount, targetSources, userId, hunt;
        return __generator(this, function (_b) {
            try {
                _a = req.body, targetAmount = _a.targetAmount, targetSources = _a.targetSources;
                userId = getUserId(req);
                if (!targetAmount || !targetSources || !Array.isArray(targetSources)) {
                    return [2 /*return*/, res.status(400).json({
                            error: "targetAmount and targetSources (array) are required",
                        })];
                }
                hunt = WolfPack_1.wolfPack.createHunt(targetAmount, targetSources, userId);
                res.json({ ok: true, hunt: hunt });
            }
            catch (error) {
                console.error("Failed to create hunt:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/wolf-pack/hunts - Get all hunts (user's hunts if userId provided)
    router.get("/wolf-pack/hunts", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, hunts;
        return __generator(this, function (_a) {
            try {
                userId = getUserId(req);
                hunts = WolfPack_1.wolfPack.getHunts(userId);
                res.json({ ok: true, hunts: hunts });
            }
            catch (error) {
                console.error("Failed to get hunts:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/wolf-pack/hunt/:id - Get specific hunt
    router.get("/wolf-pack/hunt/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var hunt;
        return __generator(this, function (_a) {
            try {
                hunt = WolfPack_1.wolfPack.getHunt(req.params.id);
                if (!hunt) {
                    return [2 /*return*/, res.status(404).json({ error: "Hunt not found" })];
                }
                res.json({ ok: true, hunt: hunt });
            }
            catch (error) {
                console.error("Failed to get hunt:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/wolf-pack/hunt/:id/stats - Get hunt statistics
    router.get("/wolf-pack/hunt/:id/stats", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var stats;
        return __generator(this, function (_a) {
            try {
                stats = WolfPack_1.wolfPack.getHuntStats(req.params.id);
                if (!stats) {
                    return [2 /*return*/, res.status(404).json({ error: "Hunt not found" })];
                }
                res.json({ ok: true, stats: stats });
            }
            catch (error) {
                console.error("Failed to get hunt stats:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // POST /api/wolf-pack/hunt/:id/opportunity - Add opportunity to hunt
    router.post("/wolf-pack/hunt/:id/opportunity", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var opportunityId, hunt;
        return __generator(this, function (_a) {
            try {
                opportunityId = req.body.opportunityId;
                if (!opportunityId) {
                    return [2 /*return*/, res.status(400).json({ error: "opportunityId is required" })];
                }
                WolfPack_1.wolfPack.addOpportunityToHunt(req.params.id, opportunityId);
                hunt = WolfPack_1.wolfPack.getHunt(req.params.id);
                res.json({ ok: true, hunt: hunt });
            }
            catch (error) {
                console.error("Failed to add opportunity:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // PUT /api/wolf-pack/opportunity/:id/status - Update opportunity status
    router.put("/wolf-pack/opportunity/:id/status", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, status_2, notes, userId;
        return __generator(this, function (_b) {
            try {
                _a = req.body, status_2 = _a.status, notes = _a.notes;
                if (!status_2) {
                    return [2 /*return*/, res.status(400).json({ error: "status is required" })];
                }
                WolfPack_1.wolfPack.updateOpportunityStatus(req.params.id, status_2, notes);
                // Grant reward for applying (if status is "applied")
                if (status_2 === "applied") {
                    userId = getUserId(req);
                    if (userId) {
                        if (grantReward) {
                            grantReward(userId, "task-complete", {
                                deltaDream: 50,
                                meta: { type: "funding-application" },
                            }).catch(function (err) {
                                console.error("Failed to grant reward:", err);
                            });
                        }
                    }
                }
                res.json({ ok: true });
            }
            catch (error) {
                console.error("Failed to update status:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // POST /api/wolf-pack/outreach - Generate outreach message
    router.post("/wolf-pack/outreach", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, opportunityId, templateId, variables, outreach;
        return __generator(this, function (_b) {
            try {
                _a = req.body, opportunityId = _a.opportunityId, templateId = _a.templateId, variables = _a.variables;
                if (!opportunityId || !templateId) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "opportunityId and templateId are required" })];
                }
                outreach = WolfPack_1.wolfPack.generateOutreach(opportunityId, templateId, variables || {});
                if (!outreach) {
                    return [2 /*return*/, res.status(404).json({ error: "Opportunity or template not found" })];
                }
                res.json({ ok: true, outreach: outreach });
            }
            catch (error) {
                console.error("Failed to generate outreach:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // Mount activation routes
    router.use((0, wolf_pack_activate_1.createWolfPackActivateRouter)());
    return router;
}
