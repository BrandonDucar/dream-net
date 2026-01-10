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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
var http_1 = require("http");
var storage_1 = require("./storage");
var schema_1 = require("@shared/schema");
var auth_1 = require("./auth");
var siwe_auth_1 = require("./siwe-auth");
var ai_scoring_1 = require("./ai-scoring");
var dream_scoring_1 = require("./dream-scoring");
var dream_score_engine_1 = require("./dream-score-engine");
var notification_engine_1 = require("./notification-engine");
var sample_data_1 = require("./sample-data");
var wallet_1 = require("@shared/wallet");
var zod_1 = require("zod");
var db_1 = require("./db");
var gardenFeedRouter_1 = require("./gardenFeedRouter");
var routes_connector_1 = require("./routes-connector");
var connector_1 = require("./routes/connector");
var dreams_1 = require("./routes/dreams");
var wallet_scan_1 = require("./routes/wallet-scan");
var dream_processor_1 = require("./routes/dream-processor");
var wallet_score_1 = require("./routes/wallet-score");
var dream_cores_1 = require("./routes/dream-cores");
var lucid_1 = require("./routes/lucid");
var canvas_1 = require("./routes/canvas");
var root_1 = require("./routes/root");
var echo_1 = require("./routes/echo");
var dream_storage_1 = require("./routes/dream-storage");
var save_core_1 = require("./routes/save-core");
var load_core_1 = require("./routes/load-core");
var reactivate_core_1 = require("./routes/reactivate-core");
var generate_dream_link_1 = require("./routes/generate-dream-link");
var shared_dream_1 = require("./routes/shared-dream");
var public_dream_1 = require("./routes/public-dream");
var mutate_dream_1 = require("./routes/mutate-dream");
var save_mutated_dream_1 = require("./routes/save-mutated-dream");
var load_dreams_1 = require("./routes/load-dreams");
var all_dreams_1 = require("./routes/all-dreams");
var get_dream_1 = require("./routes/get-dream");
var get_dream_by_id_1 = require("./routes/get-dream-by-id");
// Removed fuseDreamsRoute import as it's handled inline
var fusions_1 = require("./routes/fusions");
var controlCoreMiddleware_1 = require("../packages/dreamnet-control-core/controlCoreMiddleware");
var BrowserAgentWrapper_1 = require("../spine/wrappers/BrowserAgentWrapper");
var domainAllowlist_1 = require("./core/browser-agent/domainAllowlist");
var ipBlocking_1 = require("./core/browser-agent/ipBlocking");
// Feature Flags
var ENABLE_BROWSER_GOVERNANCE = process.env.ENABLE_BROWSER_GOVERNANCE === 'true';
var ENABLE_BROWSER_WRAPPER = process.env.ENABLE_BROWSER_WRAPPER === 'true';
// Governance Middleware (Conditional)
var browserGovernance = ENABLE_BROWSER_GOVERNANCE
    ? (0, controlCoreMiddleware_1.withGovernance)({ clusterId: 'BROWSER_AGENT', requiredOfficeId: 'BROWSER_OPERATOR' })
    : function (req, res, next) { return next(); };
var claim_fusion_1 = require("./routes/claim-fusion");
var dreams_2 = require("./routes/dreams");
var wallet_scoring_1 = require("./routes/wallet-scoring");
var echo_score_1 = require("./routes/echo-score");
var mint_dream_token_1 = require("./routes/mint-dream-token");
var mint_dream_1 = require("./routes/mint-dream");
// fuseDreamsRouter removed as route is handled inline
var my_dreams_1 = require("./routes/my-dreams");
var remix_dream_1 = require("./routes/remix-dream");
var dream_titles_1 = require("./routes/dream-titles");
var save_dream_1 = require("./routes/save-dream");
var post_bounty_1 = require("./routes/post-bounty");
var get_bounties_1 = require("./routes/get-bounties");
var join_dream_team_1 = require("./routes/join-dream-team");
var get_dream_forks_1 = require("./routes/get-dream-forks");
var get_dreams_by_cloud_1 = require("./routes/get-dreams-by-cloud");
var evolution_vault_1 = require("./routes/evolution-vault");
var ai_surgeon_1 = require("./routes/ai-surgeon");
var defense_network_1 = require("./routes/defense-network");
var evolution_engine_1 = require("./routes/evolution-engine");
var ops_1 = require("./routes/ops");
var admin_wallets_1 = require("./routes/admin-wallets");
var base_health_1 = require("./routes/base-health");
var website_designer_1 = require("./routes/website-designer");
var deployment_1 = require("./routes/deployment");
var domain_issuance_1 = require("./routes/domain-issuance");
var passports_1 = require("./routes/passports");
var citizens_1 = require("./routes/citizens");
var register_agents_1 = require("./routes/register-agents");
var aws_1 = require("./routes/aws");
var google_cloud_1 = require("./routes/google-cloud");
function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function () {
        var swarmCoordinator, ecosystemDashboardRoutes, ecosystemCommandsRoutes, dreamRemixRoutes, dreamCloudRoutes, httpServer;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // SIWE Auth routes
                    app.post("/api/auth/nonce", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var nonce;
                        return __generator(this, function (_a) {
                            try {
                                nonce = (0, siwe_auth_1.generateNonce)();
                                res.json({ nonce: nonce });
                            }
                            catch (error) {
                                res.status(500).json({ error: error.message });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    app.post("/api/auth/verify", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, message, signature, verification, token, isAdmin, error_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, message = _a.message, signature = _a.signature;
                                    if (!message || !signature) {
                                        return [2 /*return*/, res.status(400).json({ error: "Message and signature required" })];
                                    }
                                    return [4 /*yield*/, (0, siwe_auth_1.verifySignature)(message, signature)];
                                case 1:
                                    verification = _b.sent();
                                    if (verification.success && verification.address) {
                                        token = (0, siwe_auth_1.generateJWT)(verification.address);
                                        isAdmin = (0, auth_1.isAdminWallet)(verification.address);
                                        res.json({
                                            token: token,
                                            walletAddress: verification.address,
                                            isAdmin: isAdmin
                                        });
                                    }
                                    else {
                                        res.status(401).json({ error: verification.error || "Authentication failed" });
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_1 = _b.sent();
                                    res.status(500).json({ error: error_1.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post("/api/auth/validate-token", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var token, payload;
                        return __generator(this, function (_a) {
                            try {
                                token = req.body.token;
                                if (!token) {
                                    return [2 /*return*/, res.status(400).json({ error: "Token required" })];
                                }
                                payload = (0, siwe_auth_1.verifyJWT)(token);
                                if (payload) {
                                    res.json({
                                        valid: true,
                                        walletAddress: payload.walletAddress,
                                        isAdmin: payload.isAdmin
                                    });
                                }
                                else {
                                    res.status(401).json({ error: "Invalid or expired token" });
                                }
                            }
                            catch (error) {
                                res.status(500).json({ error: error.message });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // Legacy auth route for backward compatibility
                    app.post("/api/auth/validate", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var walletAddress, isAdmin;
                        return __generator(this, function (_a) {
                            try {
                                walletAddress = req.body.walletAddress;
                                if (!walletAddress) {
                                    return [2 /*return*/, res.status(400).json({ error: "Wallet address required" })];
                                }
                                isAdmin = (0, auth_1.isAdminWallet)(walletAddress);
                                res.json({ isAdmin: isAdmin, walletAddress: walletAddress });
                            }
                            catch (error) {
                                res.status(500).json({ error: error.message });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // Dashboard metrics
                    app.get("/api/dashboard/metrics", function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var metrics, error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.getDashboardMetrics()];
                                case 1:
                                    metrics = _a.sent();
                                    res.json(metrics);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_2 = _a.sent();
                                    res.status(500).json({ error: error_2.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Dreams routes
                    app.get("/api/dreams", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var limit, offset, dreams, transformedDreams, error_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    limit = parseInt(req.query.limit) || 100;
                                    offset = parseInt(req.query.offset) || 0;
                                    return [4 /*yield*/, storage_1.storage.getDreams(limit, offset)];
                                case 1:
                                    dreams = _a.sent();
                                    transformedDreams = dreams.map(function (dream) { return ({
                                        id: dream.id,
                                        dreamId: dream.id,
                                        title: dream.title || null,
                                        content: dream.content || null,
                                        wallet: dream.creatorWallet || null,
                                        createdAt: dream.createdAt ? new Date(dream.createdAt).getTime() : null,
                                        healthScore: dream.trustScore || dream.score || 50,
                                        engagementScore: dream.score || 0,
                                        metrics: {
                                            views: dream.views || 0,
                                            likes: dream.likes || 0,
                                            remixes: dream.remixes || 0,
                                            shares: dream.shares || 0,
                                        },
                                        evolutionPath: {
                                            generationLevel: dream.generationLevel || 0,
                                            branchingFactor: 0,
                                            divergenceScore: 0,
                                        },
                                        remixLineage: dream.forkedFrom ? [{ id: dream.forkedFrom, title: 'Parent Dream' }] : [],
                                    }); });
                                    res.json(transformedDreams);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_3 = _a.sent();
                                    res.status(500).json({ error: error_3.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get("/api/dreams/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var dream, error_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.getDream(req.params.id)];
                                case 1:
                                    dream = _a.sent();
                                    if (!dream) {
                                        return [2 /*return*/, res.status(404).json({ error: "Dream not found" })];
                                    }
                                    res.json(dream);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_4 = _a.sent();
                                    res.status(500).json({ error: error_4.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post("/api/dreams", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var dreamData, dream, _a, aiScore, aiTags, updatedDream, error_5;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 3, , 4]);
                                    dreamData = schema_1.insertDreamSchema.parse(req.body);
                                    return [4 /*yield*/, storage_1.storage.createDream(dreamData)];
                                case 1:
                                    dream = _b.sent();
                                    _a = (0, ai_scoring_1.calculateAIScore)(dream), aiScore = _a.aiScore, aiTags = _a.aiTags;
                                    return [4 /*yield*/, storage_1.storage.updateDreamAIScore(dream.id, aiScore, aiTags)];
                                case 2:
                                    updatedDream = _b.sent();
                                    res.status(201).json(updatedDream);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_5 = _b.sent();
                                    if (error_5 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ error: "Invalid data", details: error_5.errors })];
                                    }
                                    res.status(500).json({ error: error_5.message });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.patch("/api/dreams/:id/status", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, status_1, reviewerId, dream, error_6;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, status_1 = _a.status, reviewerId = _a.reviewerId;
                                    if (!["pending", "approved", "rejected"].includes(status_1)) {
                                        return [2 /*return*/, res.status(400).json({ error: "Invalid status" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.updateDreamStatus(req.params.id, status_1, reviewerId)];
                                case 1:
                                    dream = _b.sent();
                                    res.json(dream);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_6 = _b.sent();
                                    res.status(500).json({ error: error_6.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Approve dream endpoint
                    app.patch("/api/dreams/:id/approve", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var walletAddress, dream, error_7;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    walletAddress = req.headers['x-wallet-address'];
                                    return [4 /*yield*/, storage_1.storage.updateDreamStatus(req.params.id, "approved", walletAddress)];
                                case 1:
                                    dream = _a.sent();
                                    if (!dream) return [3 /*break*/, 3];
                                    return [4 /*yield*/, notification_engine_1.notificationEngine.notifyDreamApproved(dream)];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    res.json(dream);
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_7 = _a.sent();
                                    res.status(500).json({ error: error_7.message });
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Reject dream endpoint
                    app.patch("/api/dreams/:id/reject", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var walletAddress, dream, error_8;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    walletAddress = req.headers['x-wallet-address'];
                                    return [4 /*yield*/, storage_1.storage.updateDreamStatus(req.params.id, "rejected", walletAddress)];
                                case 1:
                                    dream = _a.sent();
                                    res.json(dream);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_8 = _a.sent();
                                    res.status(500).json({ error: error_8.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // AI Score dream endpoint
                    app.post("/api/dreams/:id/score", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var dream, _a, aiScore, aiTags, updatedDream, error_9;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, storage_1.storage.getDream(req.params.id)];
                                case 1:
                                    dream = _b.sent();
                                    if (!dream) {
                                        return [2 /*return*/, res.status(404).json({ error: "Dream not found" })];
                                    }
                                    _a = (0, ai_scoring_1.calculateAIScore)(dream), aiScore = _a.aiScore, aiTags = _a.aiTags;
                                    return [4 /*yield*/, storage_1.storage.updateDreamAIScore(req.params.id, aiScore, aiTags)];
                                case 2:
                                    updatedDream = _b.sent();
                                    res.json(updatedDream);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_9 = _b.sent();
                                    res.status(500).json({ error: error_9.message });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Dream Score endpoint
                    app.post("/api/dreams/:id/dream-score", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var dream, _a, dreamScore, scoreBreakdown, updatedDream, error_10;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, storage_1.storage.getDream(req.params.id)];
                                case 1:
                                    dream = _b.sent();
                                    if (!dream) {
                                        return [2 /*return*/, res.status(404).json({ error: "Dream not found" })];
                                    }
                                    _a = (0, dream_scoring_1.calculateDreamScore)(dream), dreamScore = _a.dreamScore, scoreBreakdown = _a.scoreBreakdown;
                                    return [4 /*yield*/, storage_1.storage.updateDreamScore(req.params.id, dreamScore, scoreBreakdown)];
                                case 2:
                                    updatedDream = _b.sent();
                                    res.json(updatedDream);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_10 = _b.sent();
                                    res.status(500).json({ error: error_10.message });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Update dream metrics endpoint
                    app.patch("/api/dreams/:id/metrics", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, views, likes, comments, contributors, editCount, uniquenessScore, metrics, updatedDream, error_11;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, views = _a.views, likes = _a.likes, comments = _a.comments, contributors = _a.contributors, editCount = _a.editCount, uniquenessScore = _a.uniquenessScore;
                                    metrics = { views: views, likes: likes, comments: comments, contributors: contributors, editCount: editCount, uniquenessScore: uniquenessScore };
                                    return [4 /*yield*/, storage_1.storage.updateDreamMetrics(req.params.id, metrics)];
                                case 1:
                                    updatedDream = _b.sent();
                                    res.json(updatedDream);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_11 = _b.sent();
                                    res.status(500).json({ error: error_11.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Cocoons routes
                    app.get("/api/cocoons", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var limit, offset, cocoons, error_12;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    limit = parseInt(req.query.limit) || 50;
                                    offset = parseInt(req.query.offset) || 0;
                                    return [4 /*yield*/, storage_1.storage.getCocoons(limit, offset)];
                                case 1:
                                    cocoons = _a.sent();
                                    res.json(cocoons);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_12 = _a.sent();
                                    res.status(500).json({ error: error_12.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get("/api/cocoons/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var cocoon, error_13;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.getCocoon(req.params.id)];
                                case 1:
                                    cocoon = _a.sent();
                                    if (!cocoon) {
                                        return [2 /*return*/, res.status(404).json({ error: "Cocoon not found" })];
                                    }
                                    res.json(cocoon);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_13 = _a.sent();
                                    res.status(500).json({ error: error_13.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post("/api/cocoons", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, dreamId, _b, evolutionNotes, _c, notifyCreator, dream, cocoonData, cocoon, error_14;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _d.trys.push([0, 5, , 6]);
                                    _a = req.body, dreamId = _a.dreamId, _b = _a.evolutionNotes, evolutionNotes = _b === void 0 ? [] : _b, _c = _a.notifyCreator, notifyCreator = _c === void 0 ? false : _c;
                                    return [4 /*yield*/, storage_1.storage.getDream(dreamId)];
                                case 1:
                                    dream = _d.sent();
                                    if (!dream) {
                                        return [2 /*return*/, res.status(404).json({ error: "Dream not found" })];
                                    }
                                    if (dream.dreamStatus !== "approved") {
                                        return [2 /*return*/, res.status(400).json({ error: "Can only create cocoons from approved dreams" })];
                                    }
                                    cocoonData = {
                                        dreamId: dream.id,
                                        title: dream.title || dream.name || "Untitled Dream",
                                        description: dream.description || "No description provided",
                                        creatorWallet: dream.wallet || dream.creator,
                                        evolutionNotes: evolutionNotes
                                    };
                                    return [4 /*yield*/, storage_1.storage.createCocoon(cocoonData)];
                                case 2:
                                    cocoon = _d.sent();
                                    // Update dream status to evolved
                                    return [4 /*yield*/, storage_1.storage.updateDreamStatus(dreamId, "evolved", req.headers['x-wallet-address'])];
                                case 3:
                                    // Update dream status to evolved
                                    _d.sent();
                                    // Send notification for cocoon creation
                                    return [4 /*yield*/, notification_engine_1.notificationEngine.notifyCocoonCreated(cocoon, dream)];
                                case 4:
                                    // Send notification for cocoon creation
                                    _d.sent();
                                    res.status(201).json(__assign(__assign({}, cocoon), { notificationSent: notifyCreator }));
                                    return [3 /*break*/, 6];
                                case 5:
                                    error_14 = _d.sent();
                                    if (error_14 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ error: "Invalid data", details: error_14.errors })];
                                    }
                                    res.status(500).json({ error: error_14.message });
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.patch("/api/cocoons/:id", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, stage, evolutionNotes, adminWallet, currentCocoon, oldStage, cocoon, error_15;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 9, , 10]);
                                    _a = req.body, stage = _a.stage, evolutionNotes = _a.evolutionNotes;
                                    adminWallet = req.headers['x-wallet-address'];
                                    return [4 /*yield*/, storage_1.storage.getCocoon(req.params.id)];
                                case 1:
                                    currentCocoon = _b.sent();
                                    if (!currentCocoon) {
                                        return [2 /*return*/, res.status(404).json({ error: "Cocoon not found" })];
                                    }
                                    oldStage = currentCocoon.stage;
                                    if (!(oldStage === 'incubating' && stage === 'active')) return [3 /*break*/, 4];
                                    if (!(!currentCocoon.dreamScore || currentCocoon.dreamScore < 60)) return [3 /*break*/, 4];
                                    // Log the failed progression attempt
                                    return [4 /*yield*/, storage_1.storage.logCocoonStageChange(req.params.id, oldStage, oldStage, // Keep same stage
                                        adminWallet, false, "Score too low for progression: ".concat(currentCocoon.dreamScore || 0, "/60 required"))];
                                case 2:
                                    // Log the failed progression attempt
                                    _b.sent();
                                    // Send notification to creator about insufficient score
                                    return [4 /*yield*/, notification_engine_1.notificationEngine.notifyInsufficientScore(currentCocoon)];
                                case 3:
                                    // Send notification to creator about insufficient score
                                    _b.sent();
                                    return [2 /*return*/, res.status(400).json({
                                            error: "Insufficient dream score for progression",
                                            required: 60,
                                            current: currentCocoon.dreamScore || 0,
                                            message: "Encourage collaboration or build more traction to increase the score."
                                        })];
                                case 4: return [4 /*yield*/, storage_1.storage.updateCocoon(req.params.id, { stage: stage, evolutionNotes: evolutionNotes })];
                                case 5:
                                    cocoon = _b.sent();
                                    if (!(stage && stage !== oldStage)) return [3 /*break*/, 8];
                                    return [4 /*yield*/, storage_1.storage.logCocoonStageChange(req.params.id, oldStage, stage, adminWallet)];
                                case 6:
                                    _b.sent();
                                    return [4 /*yield*/, notification_engine_1.notificationEngine.notifyCocoonStageUpdated(cocoon, oldStage, stage)];
                                case 7:
                                    _b.sent();
                                    _b.label = 8;
                                case 8:
                                    res.json(cocoon);
                                    return [3 /*break*/, 10];
                                case 9:
                                    error_15 = _b.sent();
                                    res.status(500).json({ error: error_15.message });
                                    return [3 /*break*/, 10];
                                case 10: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Generate NFT metadata for a cocoon
                    app.get("/api/cocoons/:id/metadata", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var cocoon, dream, metadata, error_16;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, storage_1.storage.getCocoon(req.params.id)];
                                case 1:
                                    cocoon = _b.sent();
                                    if (!cocoon) {
                                        return [2 /*return*/, res.status(404).json({ error: "Cocoon not found" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.getDream(cocoon.dreamId)];
                                case 2:
                                    dream = _b.sent();
                                    metadata = {
                                        name: "Cocoon of ".concat(cocoon.title),
                                        description: cocoon.description,
                                        attributes: [
                                            {
                                                trait_type: "Stage",
                                                value: cocoon.stage.charAt(0).toUpperCase() + cocoon.stage.slice(1)
                                            },
                                            {
                                                trait_type: "Dream Score",
                                                value: (dream === null || dream === void 0 ? void 0 : dream.dreamScore) || 0
                                            },
                                            {
                                                trait_type: "Creator",
                                                value: cocoon.creatorWallet
                                            },
                                            {
                                                trait_type: "Evolution Notes",
                                                value: ((_a = cocoon.evolutionNotes) === null || _a === void 0 ? void 0 : _a.length) || 0
                                            }
                                        ]
                                    };
                                    res.json(metadata);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_16 = _b.sent();
                                    console.error("Error generating cocoon metadata:", error_16);
                                    res.status(500).json({ error: "Failed to generate metadata" });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Update cocoon metadata
                    app.patch("/api/cocoons/:id/metadata", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var cocoon, error_17;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.updateCocoonMetadata(req.params.id, req.body)];
                                case 1:
                                    cocoon = _a.sent();
                                    res.json(cocoon);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_17 = _a.sent();
                                    console.error("Error updating cocoon metadata:", error_17);
                                    res.status(500).json({ error: "Failed to update metadata" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Dream Score Engine routes
                    app.post("/api/scoring/update-all", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var error_18;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, dream_score_engine_1.dreamScoreEngine.updateAllDreamScores()];
                                case 1:
                                    _a.sent();
                                    res.json({ message: "All dream scores updated successfully" });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_18 = _a.sent();
                                    res.status(500).json({ error: error_18.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post("/api/scoring/update/:dreamId", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var error_19;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, dream_score_engine_1.dreamScoreEngine.updateDreamScore(req.params.dreamId)];
                                case 1:
                                    _a.sent();
                                    res.json({ message: "Dream score updated successfully" });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_19 = _a.sent();
                                    res.status(500).json({ error: error_19.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get("/api/scoring/status", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var status_2;
                        return __generator(this, function (_a) {
                            try {
                                status_2 = dream_score_engine_1.dreamScoreEngine.getScoringStatus();
                                res.json(status_2);
                            }
                            catch (error) {
                                res.status(500).json({ error: error.message });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    app.post("/api/scoring/start", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            try {
                                dream_score_engine_1.dreamScoreEngine.startScheduledScoring();
                                res.json({ message: "Scheduled scoring started" });
                            }
                            catch (error) {
                                res.status(500).json({ error: error.message });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    app.post("/api/scoring/stop", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            try {
                                dream_score_engine_1.dreamScoreEngine.stopScheduledScoring();
                                res.json({ message: "Scheduled scoring stopped" });
                            }
                            catch (error) {
                                res.status(500).json({ error: error.message });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // Dream Cores routes
                    app.get("/api/cores", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var limit, offset, cores, error_20;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    limit = parseInt(req.query.limit) || 50;
                                    offset = parseInt(req.query.offset) || 0;
                                    return [4 /*yield*/, storage_1.storage.getDreamCores(limit, offset)];
                                case 1:
                                    cores = _a.sent();
                                    res.json(cores);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_20 = _a.sent();
                                    res.status(500).json({ error: error_20.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get("/api/cores/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var core, error_21;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.getDreamCore(req.params.id)];
                                case 1:
                                    core = _a.sent();
                                    if (!core) {
                                        return [2 /*return*/, res.status(404).json({ error: "Dream Core not found" })];
                                    }
                                    res.json(core);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_21 = _a.sent();
                                    res.status(500).json({ error: error_21.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post("/api/cores", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var coreData, core, error_22;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    coreData = schema_1.insertDreamCoreSchema.parse(req.body);
                                    return [4 /*yield*/, storage_1.storage.createDreamCore(coreData)];
                                case 1:
                                    core = _a.sent();
                                    res.status(201).json(core);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_22 = _a.sent();
                                    if (error_22 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ error: "Invalid data", details: error_22.errors })];
                                    }
                                    res.status(500).json({ error: error_22.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.patch("/api/cores/:id/energy", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, energy, resonance, core, error_23;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, energy = _a.energy, resonance = _a.resonance;
                                    if (typeof energy !== "number" || energy < 0 || energy > 100) {
                                        return [2 /*return*/, res.status(400).json({ error: "Energy must be a number between 0 and 100" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.updateDreamCoreEnergy(req.params.id, energy, resonance)];
                                case 1:
                                    core = _b.sent();
                                    res.json(core);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_23 = _b.sent();
                                    res.status(500).json({ error: error_23.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Wallets routes
                    app.get("/api/wallets", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var limit, offset, wallets, error_24;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    limit = parseInt(req.query.limit) || 50;
                                    offset = parseInt(req.query.offset) || 0;
                                    return [4 /*yield*/, storage_1.storage.getWallets(limit, offset)];
                                case 1:
                                    wallets = _a.sent();
                                    res.json(wallets);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_24 = _a.sent();
                                    res.status(500).json({ error: error_24.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get("/api/wallets/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var wallet, error_25;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.getWallet(req.params.id)];
                                case 1:
                                    wallet = _a.sent();
                                    if (!wallet) {
                                        return [2 /*return*/, res.status(404).json({ error: "Wallet not found" })];
                                    }
                                    res.json(wallet);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_25 = _a.sent();
                                    res.status(500).json({ error: error_25.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get("/api/wallets/user/:userId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var wallet, error_26;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.getWalletByUserId(req.params.userId)];
                                case 1:
                                    wallet = _a.sent();
                                    if (!wallet) {
                                        return [2 /*return*/, res.status(404).json({ error: "Wallet not found" })];
                                    }
                                    res.json(wallet);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_26 = _a.sent();
                                    res.status(500).json({ error: error_26.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post("/api/wallets", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var walletData, wallet, error_27;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    walletData = schema_1.insertWalletSchema.parse(req.body);
                                    return [4 /*yield*/, storage_1.storage.createWallet(walletData)];
                                case 1:
                                    wallet = _a.sent();
                                    res.status(201).json(wallet);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_27 = _a.sent();
                                    if (error_27 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ error: "Invalid data", details: error_27.errors })];
                                    }
                                    res.status(500).json({ error: error_27.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.patch("/api/wallets/user/:userId/scores", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, dreamScore, cocoonTokens, coreFragments, wallet, error_28;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, dreamScore = _a.dreamScore, cocoonTokens = _a.cocoonTokens, coreFragments = _a.coreFragments;
                                    return [4 /*yield*/, storage_1.storage.updateWalletScores(req.params.userId, dreamScore, cocoonTokens, coreFragments)];
                                case 1:
                                    wallet = _b.sent();
                                    res.json(wallet);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_28 = _b.sent();
                                    res.status(500).json({ error: error_28.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Contributors routes
                    app.post("/api/cocoons/:cocoonId/contributors", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var cocoonId, contributorSchema, _a, wallet, role, adminWallet, contributor, updatedCocoon, error_29;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    cocoonId = req.params.cocoonId;
                                    contributorSchema = zod_1.z.object({
                                        wallet: zod_1.z.string(),
                                        role: zod_1.z.enum(["Builder", "Artist", "Coder", "Visionary", "Promoter"]),
                                        adminWallet: zod_1.z.string()
                                    });
                                    _a = contributorSchema.parse(req.body), wallet = _a.wallet, role = _a.role, adminWallet = _a.adminWallet;
                                    contributor = {
                                        wallet: wallet,
                                        role: role,
                                        joinedAt: new Date().toISOString()
                                    };
                                    return [4 /*yield*/, storage_1.storage.addCocoonContributor(cocoonId, contributor, adminWallet)];
                                case 1:
                                    updatedCocoon = _b.sent();
                                    res.json(updatedCocoon);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_29 = _b.sent();
                                    res.status(400).json({ error: error_29.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.delete("/api/cocoons/:cocoonId/contributors/:walletAddress", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, cocoonId, walletAddress, adminWallet, updatedCocoon, error_30;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.params, cocoonId = _a.cocoonId, walletAddress = _a.walletAddress;
                                    adminWallet = req.body.adminWallet;
                                    if (!adminWallet) {
                                        return [2 /*return*/, res.status(400).json({ error: "Admin wallet required" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.removeCocoonContributor(cocoonId, walletAddress, adminWallet)];
                                case 1:
                                    updatedCocoon = _b.sent();
                                    res.json(updatedCocoon);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_30 = _b.sent();
                                    res.status(400).json({ error: error_30.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get("/api/cocoons/:cocoonId/contributors", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var cocoonId, contributors, error_31;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    cocoonId = req.params.cocoonId;
                                    return [4 /*yield*/, storage_1.storage.getCocoonContributors(cocoonId)];
                                case 1:
                                    contributors = _a.sent();
                                    res.json(contributors);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_31 = _a.sent();
                                    res.status(500).json({ error: error_31.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get("/api/contributors/log", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var cocoonId, log, error_32;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    cocoonId = req.query.cocoonId;
                                    return [4 /*yield*/, storage_1.storage.getContributorsLog(cocoonId)];
                                case 1:
                                    log = _a.sent();
                                    res.json(log);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_32 = _a.sent();
                                    res.status(500).json({ error: error_32.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get("/api/contributors/top", function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var topContributors, error_33;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.getTopContributors()];
                                case 1:
                                    topContributors = _a.sent();
                                    res.json(topContributors);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_33 = _a.sent();
                                    res.status(500).json({ error: error_33.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Notification routes
                    app.get("/api/notifications/unread", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var walletAddress, unreadNotifications, error_34;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    walletAddress = req.headers['x-wallet-address'];
                                    if (!walletAddress) {
                                        return [2 /*return*/, res.status(400).json({ error: "Wallet address required" })];
                                    }
                                    return [4 /*yield*/, notification_engine_1.notificationEngine.getUnreadNotifications(walletAddress)];
                                case 1:
                                    unreadNotifications = _a.sent();
                                    res.json(unreadNotifications);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_34 = _a.sent();
                                    res.status(500).json({ error: error_34.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get("/api/notifications", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var walletAddress, limit, offset, notifications_1, error_35;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    walletAddress = req.headers['x-wallet-address'];
                                    if (!walletAddress) {
                                        return [2 /*return*/, res.status(400).json({ error: "Wallet address required" })];
                                    }
                                    limit = parseInt(req.query.limit) || 20;
                                    offset = parseInt(req.query.offset) || 0;
                                    return [4 /*yield*/, notification_engine_1.notificationEngine.getNotifications(walletAddress, limit, offset)];
                                case 1:
                                    notifications_1 = _a.sent();
                                    res.json(notifications_1);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_35 = _a.sent();
                                    res.status(500).json({ error: error_35.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get("/api/notifications/count", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var walletAddress, count, error_36;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    walletAddress = req.headers['x-wallet-address'];
                                    if (!walletAddress) {
                                        return [2 /*return*/, res.status(400).json({ error: "Wallet address required" })];
                                    }
                                    return [4 /*yield*/, notification_engine_1.notificationEngine.getUnreadCount(walletAddress)];
                                case 1:
                                    count = _a.sent();
                                    res.json({ count: count });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_36 = _a.sent();
                                    res.status(500).json({ error: error_36.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.patch("/api/notifications/:id/read", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var walletAddress, error_37;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    walletAddress = req.headers['x-wallet-address'];
                                    if (!walletAddress) {
                                        return [2 /*return*/, res.status(400).json({ error: "Wallet address required" })];
                                    }
                                    return [4 /*yield*/, notification_engine_1.notificationEngine.markNotificationAsRead(req.params.id, walletAddress)];
                                case 1:
                                    _a.sent();
                                    res.json({ success: true });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_37 = _a.sent();
                                    res.status(500).json({ error: error_37.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.patch("/api/notifications/mark-all-read", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var walletAddress, notificationIds, error_38;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    walletAddress = req.headers['x-wallet-address'];
                                    if (!walletAddress) {
                                        return [2 /*return*/, res.status(400).json({ error: "Wallet address required" })];
                                    }
                                    notificationIds = req.body.notificationIds;
                                    if (!(notificationIds && Array.isArray(notificationIds))) return [3 /*break*/, 2];
                                    return [4 /*yield*/, notification_engine_1.notificationEngine.markAsRead(notificationIds, walletAddress)];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2:
                                    res.json({ success: true });
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_38 = _a.sent();
                                    res.status(500).json({ error: error_38.message });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Garden API - Public endpoint for displaying dreams and cocoons
                    app.get("/api/garden", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, stage, _b, sortBy, _c, order, _d, limit, _e, offset, gardenData, error_39;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    _f.trys.push([0, 2, , 3]);
                                    _a = req.query, stage = _a.stage, _b = _a.sortBy, sortBy = _b === void 0 ? 'lastUpdated' : _b, _c = _a.order, order = _c === void 0 ? 'desc' : _c, _d = _a.limit, limit = _d === void 0 ? 50 : _d, _e = _a.offset, offset = _e === void 0 ? 0 : _e;
                                    return [4 /*yield*/, storage_1.storage.getGardenFeed({
                                            stage: stage,
                                            sortBy: sortBy,
                                            order: order,
                                            limit: parseInt(limit),
                                            offset: parseInt(offset)
                                        })];
                                case 1:
                                    gardenData = _f.sent();
                                    res.json(gardenData);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_39 = _f.sent();
                                    res.status(500).json({ error: error_39.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Garden Feed endpoint - specifically for dashboard feed panel
                    // Remove this conflicting route since we're using the router at /api/garden-feed
                    /*
                    app.get("/api/garden-feed", (req, res, next) => {
                      // Allow bypass in development mode with wallet query param
                      if (process.env.NODE_ENV === 'development' && req.query.wallet) {
                        return next();
                      }
                      requireAuth(req, res, next);
                    }, async (req, res) => {
                      try {
                        let wallet = req.user?.walletAddress;
                        
                        // Development mode: use wallet from query param
                        if (process.env.NODE_ENV === 'development' && req.query.wallet) {
                          wallet = req.query.wallet as string;
                        }
                        
                        let gardenData = await storage.getGardenFeed({
                          sortBy: 'lastUpdated',
                          order: 'desc',
                          limit: 20,
                          offset: 0
                        });
                        
                        // Filter by authenticated user's wallet
                        if (wallet) {
                          gardenData = gardenData.filter(item => {
                            // Check if wallet is creator
                            if (item.creatorWallet === wallet) return true;
                            
                            // Check if wallet is in contributors
                            if (item.contributors && item.contributors.some(c => c.wallet === wallet)) return true;
                            
                            return false;
                          });
                        }
                        
                        res.json(gardenData);
                      } catch (error: any) {
                        res.status(500).json({ error: error.message });
                      }
                    });
                    */
                    // Wallet analysis endpoint
                    app.post("/api/wallet/analyze", function (req, res) {
                        var _a = req.body, walletAddress = _a.walletAddress, _b = _a.completedDreams, completedDreams = _b === void 0 ? 0 : _b, _c = _a.hasTokenBoost, hasTokenBoost = _c === void 0 ? false : _c;
                        if (!walletAddress) {
                            return res.json({
                                error: "Wallet address required",
                                status: "error"
                            });
                        }
                        var walletData = (0, wallet_1.getWalletData)(walletAddress);
                        if (!walletData) {
                            return res.json({
                                error: "Wallet not found",
                                status: "not_found"
                            });
                        }
                        var analysis = (0, wallet_1.analyzeWallet)(walletData, completedDreams, hasTokenBoost);
                        res.json({
                            status: "success",
                            data: analysis
                        });
                    });
                    // DreamNodes FlutterBye routes with access control
                    app.use("/api/dreamnodes/flutterbye", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                        var checkEndpointAccess, FLUTTERBY_NODE, endpoint, mintRouter, inboxRouter, outboxRouter, error_40;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 6, , 7]);
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/flutterbye/logic/agentAccess.js'); })];
                                case 1:
                                    checkEndpointAccess = (_a.sent()).checkEndpointAccess;
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/flutterbye/node.config.js'); })];
                                case 2:
                                    FLUTTERBY_NODE = (_a.sent()).FLUTTERBY_NODE;
                                    endpoint = req.path.split('/')[1] || req.path.substring(1);
                                    // Validate endpoint access
                                    if (!checkEndpointAccess(endpoint)) {
                                        return [2 /*return*/, res.status(403).json({
                                                error: 'Endpoint not allowed in Flutterbye node',
                                                allowedAccess: FLUTTERBY_NODE.allowedAccess,
                                                requested: endpoint,
                                                isolation: FLUTTERBY_NODE.isolation
                                            })];
                                    }
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/flutterbye/routes/mint.js'); })];
                                case 3:
                                    mintRouter = (_a.sent()).default;
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/flutterbye/routes/inbox.js'); })];
                                case 4:
                                    inboxRouter = (_a.sent()).default;
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/flutterbye/routes/outbox.js'); })];
                                case 5:
                                    outboxRouter = (_a.sent()).default;
                                    // Route to appropriate handler
                                    if (req.path.startsWith('/mint')) {
                                        mintRouter(req, res, next);
                                    }
                                    else if (req.path.startsWith('/inbox')) {
                                        inboxRouter(req, res, next);
                                    }
                                    else if (req.path.startsWith('/outbox')) {
                                        outboxRouter(req, res, next);
                                    }
                                    else {
                                        res.status(404).json({ error: 'DreamNode endpoint not found' });
                                    }
                                    return [3 /*break*/, 7];
                                case 6:
                                    error_40 = _a.sent();
                                    res.status(500).json({ error: 'DreamNode service unavailable' });
                                    return [3 /*break*/, 7];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Node capabilities endpoint
                    app.get("/api/dreamnodes/flutterbye/capabilities", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var getNodeCapabilities, trustScore, capabilities, error_41;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/flutterbye/logic/agentAccess.js'); })];
                                case 1:
                                    getNodeCapabilities = (_a.sent()).getNodeCapabilities;
                                    trustScore = parseInt(req.query.trustScore) || 0;
                                    capabilities = getNodeCapabilities(trustScore);
                                    res.json(capabilities);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_41 = _a.sent();
                                    res.status(500).json({ error: 'Failed to get node capabilities' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Direct FlutterBye inbox endpoint
                    app.get("/api/flutterbye/inbox", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var validateTrustScore, FLUTTERBY_NODE, wallet, trustValidation, mockMessages, error_42;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/flutterbye/logic/trustScore.js'); })];
                                case 1:
                                    validateTrustScore = (_a.sent()).validateTrustScore;
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/flutterbye/node.config.js'); })];
                                case 2:
                                    FLUTTERBY_NODE = (_a.sent()).FLUTTERBY_NODE;
                                    wallet = req.query.wallet;
                                    if (!wallet) {
                                        return [2 /*return*/, res.status(400).json({
                                                error: 'Missing wallet parameter',
                                                required: 'wallet'
                                            })];
                                    }
                                    return [4 /*yield*/, validateTrustScore(wallet)];
                                case 3:
                                    trustValidation = _a.sent();
                                    if (!trustValidation.valid) {
                                        return [2 /*return*/, res.status(403).json({
                                                error: 'Insufficient trust score for Flutterbye node access',
                                                required: FLUTTERBY_NODE.trustBoundary,
                                                current: trustValidation.score,
                                                isolation: FLUTTERBY_NODE.isolation ? 'Isolated node requires higher trust' : false
                                            })];
                                    }
                                    mockMessages = [
                                        {
                                            message: "You got this. 🦋",
                                            from: "0xABC",
                                            time: 1692637281723,
                                            unlocked: trustValidation.score >= FLUTTERBY_NODE.trustBoundary
                                        },
                                        {
                                            message: "Welcome to the FlutterBye network! Your trust score qualifies you for premium messaging.",
                                            from: "0x7890123456789012345678901234567890123456",
                                            time: Date.now() - 3600000,
                                            unlocked: trustValidation.score >= FLUTTERBY_NODE.trustBoundary
                                        },
                                        {
                                            message: "Congratulations on achieving trust level 80+! You can now export to DreamNet.",
                                            from: "0x4567890123456789012345678901234567890123",
                                            time: Date.now() - 7200000,
                                            unlocked: trustValidation.score >= FLUTTERBY_NODE.trustBoundary
                                        },
                                        {
                                            message: "Your message delivery through CANVAS agent was successful.",
                                            from: "0x1234567890123456789012345678901234567890",
                                            time: Date.now() - 10800000,
                                            unlocked: trustValidation.score >= FLUTTERBY_NODE.trustBoundary
                                        }
                                    ];
                                    // Return array format exactly matching your structure  
                                    res.json(mockMessages);
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_42 = _a.sent();
                                    console.error('FlutterBye inbox error:', error_42);
                                    res.status(500).json({ error: 'FlutterBye inbox service unavailable' });
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Direct FlutterBye outbox endpoint
                    app.get("/api/flutterbye/outbox", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var validateTrustScore, FLUTTERBY_NODE, wallet, trustValidation, mockOutboxMessages, error_43;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/flutterbye/logic/trustScore.js'); })];
                                case 1:
                                    validateTrustScore = (_a.sent()).validateTrustScore;
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/flutterbye/node.config.js'); })];
                                case 2:
                                    FLUTTERBY_NODE = (_a.sent()).FLUTTERBY_NODE;
                                    wallet = req.query.wallet;
                                    if (!wallet) {
                                        return [2 /*return*/, res.status(400).json({
                                                error: 'Missing wallet parameter',
                                                required: 'wallet'
                                            })];
                                    }
                                    return [4 /*yield*/, validateTrustScore(wallet)];
                                case 3:
                                    trustValidation = _a.sent();
                                    if (!trustValidation.valid) {
                                        return [2 /*return*/, res.status(403).json({
                                                error: 'Insufficient trust score for Flutterbye node access',
                                                required: FLUTTERBY_NODE.trustBoundary,
                                                current: trustValidation.score,
                                                isolation: FLUTTERBY_NODE.isolation ? 'Isolated node requires higher trust' : false
                                            })];
                                    }
                                    mockOutboxMessages = [
                                        {
                                            id: "msg_out_1754253100_xyz789abc",
                                            from: wallet,
                                            to: "0x9876543210987654321098765432109876543210",
                                            content: "Thank you for the warm welcome to FlutterBye!",
                                            tokens: { amount: 2.0, token: "FLBY" },
                                            timestamp: Date.now() - 1800000, // 30 minutes ago
                                            status: "delivered",
                                            deliveryConfirmed: true,
                                            gasUsed: "0.0008 ETH"
                                        },
                                        {
                                            id: "msg_out_1754252500_abc456xyz",
                                            from: wallet,
                                            to: "0x5555666677778888999900001111222233334444",
                                            content: "Wishing you strength and prosperity in your dreams.",
                                            tokens: { amount: 1.5, token: "FLBY" },
                                            timestamp: Date.now() - 5400000, // 90 minutes ago
                                            status: "pending",
                                            deliveryConfirmed: false,
                                            estimatedDelivery: "2-5 minutes"
                                        }
                                    ];
                                    res.json({
                                        success: true,
                                        wallet: wallet,
                                        sentMessages: mockOutboxMessages,
                                        totalSent: mockOutboxMessages.length,
                                        pendingCount: mockOutboxMessages.filter(function (m) { return m.status === 'pending'; }).length,
                                        totalFlbySpent: mockOutboxMessages.reduce(function (sum, m) { return sum + m.tokens.amount; }, 0),
                                        flutterbyeNode: {
                                            nodeId: FLUTTERBY_NODE.id,
                                            token: FLUTTERBY_NODE.token,
                                            isolation: FLUTTERBY_NODE.isolation,
                                            agentVisibility: FLUTTERBY_NODE.agentVisibility,
                                            trustBoundary: FLUTTERBY_NODE.trustBoundary
                                        },
                                        userTrust: {
                                            score: trustValidation.score,
                                            level: trustValidation.level,
                                            canExport: trustValidation.valid
                                        }
                                    });
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_43 = _a.sent();
                                    console.error('FlutterBye outbox error:', error_43);
                                    res.status(500).json({ error: 'FlutterBye outbox service unavailable' });
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Direct FlutterBye mint endpoint (alternative API path)
                    app.post("/api/flutterbye/mint", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var validateTrustScore, validateMessage, analyzeMessagePattern, FLUTTERBY_NODE, _a, toWallet, content, fromWallet, _b, tokenAmount, _c, tokenType, signature, trustValidation, numericAmount, messageValidation, messageAnalysis, message, error_44;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _d.trys.push([0, 6, , 7]);
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/flutterbye/logic/trustScore.js'); })];
                                case 1:
                                    validateTrustScore = (_d.sent()).validateTrustScore;
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/flutterbye/logic/messageValidation.js'); })];
                                case 2:
                                    validateMessage = (_d.sent()).validateMessage;
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/flutterbye/logic/messageUnlock.js'); })];
                                case 3:
                                    analyzeMessagePattern = (_d.sent()).analyzeMessagePattern;
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/flutterbye/node.config.js'); })];
                                case 4:
                                    FLUTTERBY_NODE = (_d.sent()).FLUTTERBY_NODE;
                                    _a = req.body, toWallet = _a.to, content = _a.message, fromWallet = _a.from, _b = _a.value, tokenAmount = _b === void 0 ? "1.00" : _b, _c = _a.token, tokenType = _c === void 0 ? 'FLBY' : _c, signature = _a.signature;
                                    // Validate required fields
                                    if (!fromWallet || !toWallet || !content) {
                                        return [2 /*return*/, res.status(400).json({
                                                error: 'Missing required fields',
                                                required: ['from', 'to', 'message']
                                            })];
                                    }
                                    return [4 /*yield*/, validateTrustScore(fromWallet)];
                                case 5:
                                    trustValidation = _d.sent();
                                    if (!trustValidation.valid) {
                                        return [2 /*return*/, res.status(403).json({
                                                error: 'Insufficient trust score for Flutterbye node export',
                                                required: FLUTTERBY_NODE.trustBoundary,
                                                current: trustValidation.score,
                                                isolation: FLUTTERBY_NODE.isolation ? 'Isolated node requires higher trust' : false
                                            })];
                                    }
                                    numericAmount = parseFloat(tokenAmount);
                                    messageValidation = validateMessage(content, numericAmount);
                                    if (!messageValidation.valid) {
                                        return [2 /*return*/, res.status(400).json({
                                                error: 'Invalid message format',
                                                details: messageValidation.errors
                                            })];
                                    }
                                    messageAnalysis = analyzeMessagePattern(content);
                                    message = {
                                        id: "msg_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9)),
                                        message: content, // Use 'message' field to match your format
                                        from: fromWallet,
                                        to: toWallet,
                                        time: Date.now(),
                                        tokens: {
                                            amount: parseFloat(tokenAmount),
                                            token: tokenType
                                        },
                                        unlocked: trustValidation.valid,
                                        signature: signature,
                                        validated: true,
                                        analysis: messageAnalysis
                                    };
                                    res.json({
                                        success: true,
                                        message: {
                                            id: message.id,
                                            status: 'minted',
                                            deliveryEstimate: '2-5 minutes',
                                            gasEstimate: '0.001 ETH',
                                            flbyAmount: numericAmount,
                                            unlocked: message.unlocked,
                                            trustImpact: messageAnalysis.trustImpact,
                                            supportive: messageAnalysis.supportive,
                                            emoji: messageAnalysis.emoji
                                        },
                                        flutterbyeNode: {
                                            nodeId: FLUTTERBY_NODE.id,
                                            token: FLUTTERBY_NODE.token,
                                            isolation: FLUTTERBY_NODE.isolation,
                                            agentVisibility: FLUTTERBY_NODE.agentVisibility,
                                            trustBoundary: FLUTTERBY_NODE.trustBoundary
                                        },
                                        userTrust: {
                                            current: trustValidation.score,
                                            level: trustValidation.level,
                                            canExport: trustValidation.valid
                                        }
                                    });
                                    return [3 /*break*/, 7];
                                case 6:
                                    error_44 = _d.sent();
                                    console.error('FlutterBye mint error:', error_44);
                                    res.status(500).json({ error: 'FlutterBye mint service unavailable' });
                                    return [3 /*break*/, 7];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Test endpoint - completely isolated
                    app.get("/api/test", function (req, res) {
                        res.json({ message: "Test endpoint working", timestamp: new Date().toISOString() });
                    });
                    // Secret Vault endpoints
                    app.get('/api/vault/secrets', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var wallet, messages, error_45;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    wallet = req.query.wallet;
                                    if (!wallet) {
                                        return [2 /*return*/, res.status(400).json({ error: 'Wallet address required' })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.getSecretMessages(wallet)];
                                case 1:
                                    messages = _a.sent();
                                    res.json(messages);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_45 = _a.sent();
                                    console.error('Error fetching secret messages:', error_45);
                                    res.status(500).json({ error: 'Failed to fetch secret messages' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/api/vault/secrets/unlock', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, messageId, wallet, result, error_46;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, messageId = _a.messageId, wallet = _a.wallet;
                                    if (!messageId || !wallet) {
                                        return [2 /*return*/, res.status(400).json({ error: 'Message ID and wallet required' })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.unlockSecretMessage(messageId, wallet)];
                                case 1:
                                    result = _b.sent();
                                    res.json(result);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_46 = _b.sent();
                                    console.error('Error unlocking secret:', error_46);
                                    res.status(500).json({ error: 'Failed to unlock secret' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/api/vault/secrets/reply', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, originalMessageId, replyData, result, error_47;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, originalMessageId = _a.originalMessageId, replyData = __rest(_a, ["originalMessageId"]);
                                    if (!originalMessageId) {
                                        return [2 /*return*/, res.status(400).json({ error: 'Original message ID required' })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.sendSecretReply(originalMessageId, replyData)];
                                case 1:
                                    result = _b.sent();
                                    res.json(result);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_47 = _b.sent();
                                    console.error('Error sending reply:', error_47);
                                    res.status(500).json({ error: 'Failed to send reply' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/api/vault/secrets/burn', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, messageId, wallet, result, error_48;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, messageId = _a.messageId, wallet = _a.wallet;
                                    if (!messageId || !wallet) {
                                        return [2 /*return*/, res.status(400).json({ error: 'Message ID and wallet required' })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.burnSecretVault(messageId, wallet)];
                                case 1:
                                    result = _b.sent();
                                    res.json(result);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_48 = _b.sent();
                                    console.error('Error burning vault:', error_48);
                                    res.status(500).json({ error: 'Failed to burn vault' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Dream remix submission endpoint
                    app.post('/api/dreams/remix', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, remixOf, title, tags, content, author, type, bounty, visibility, remixDream;
                        return __generator(this, function (_b) {
                            try {
                                _a = req.body, remixOf = _a.remixOf, title = _a.title, tags = _a.tags, content = _a.content, author = _a.author, type = _a.type, bounty = _a.bounty, visibility = _a.visibility;
                                if (!remixOf || !title || !content || !author) {
                                    return [2 /*return*/, res.status(400).json({
                                            error: 'Missing required fields',
                                            required: ['remixOf', 'title', 'content', 'author']
                                        })];
                                }
                                remixDream = {
                                    id: "remix_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9)),
                                    title: title,
                                    content: content,
                                    wallet: author,
                                    status: 'submitted',
                                    tags: tags || [],
                                    dreamScore: 0,
                                    forkedFrom: remixOf,
                                    bountyId: bounty ? "bounty_".concat(Date.now()) : null,
                                    visibility: visibility || 'public',
                                    createdAt: new Date(),
                                    isRemix: true,
                                    remixMetadata: {
                                        originalDreamId: remixOf,
                                        remixReason: 'Evolution and expansion',
                                        similarityScore: Math.floor(Math.random() * 30) + 70, // 70-100% similarity
                                        innovationFactor: Math.floor(Math.random() * 50) + 50 // 50-100% innovation
                                    }
                                };
                                console.log("\uD83C\uDFA8 Dream remix submitted: ".concat(title, " (remix of ").concat(remixOf, ") by ").concat(author));
                                // Mock storage since database might have issues
                                res.json({
                                    success: true,
                                    message: 'Dream remix submitted successfully',
                                    remix: {
                                        id: remixDream.id,
                                        title: remixDream.title,
                                        status: 'submitted',
                                        dreamScore: 0,
                                        estimatedReward: bounty || 150,
                                        processingTime: '2-5 minutes',
                                        remixMetadata: remixDream.remixMetadata
                                    },
                                    next: {
                                        action: 'awaiting_review',
                                        estimatedTime: '15-30 minutes',
                                        reviewType: 'community_voting'
                                    }
                                });
                            }
                            catch (error) {
                                console.error('Error processing dream remix:', error);
                                res.status(500).json({ error: 'Failed to process dream remix' });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // Seasonal events endpoint
                    app.get('/api/events/seasonal', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var seasonalEvent, error_49;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.getCurrentSeasonalEvent()];
                                case 1:
                                    seasonalEvent = _a.sent();
                                    res.json(seasonalEvent);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_49 = _a.sent();
                                    console.error('Error fetching seasonal event:', error_49);
                                    res.status(500).json({ error: 'Failed to fetch seasonal event' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Apply seasonal bonuses endpoint
                    app.post('/api/events/seasonal/bonus', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, baseXp, _b, action, bonusResult, error_50;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 2, , 3]);
                                    _a = req.body, baseXp = _a.baseXp, _b = _a.action, action = _b === void 0 ? 'general' : _b;
                                    if (!baseXp) {
                                        return [2 /*return*/, res.status(400).json({ error: 'Base XP required' })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.applySeasonalBonuses(baseXp, action)];
                                case 1:
                                    bonusResult = _c.sent();
                                    res.json(bonusResult);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_50 = _c.sent();
                                    console.error('Error applying seasonal bonus:', error_50);
                                    res.status(500).json({ error: 'Failed to apply seasonal bonus' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Wallet profile endpoints
                    app.get('/api/wallet/profile/:address', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var address, profile, error_51;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    address = req.params.address;
                                    return [4 /*yield*/, storage_1.storage.getWalletProfile(address)];
                                case 1:
                                    profile = _a.sent();
                                    res.json(profile);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_51 = _a.sent();
                                    console.error('Error fetching wallet profile:', error_51);
                                    res.status(500).json({ error: 'Failed to fetch wallet profile' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/api/wallet/mind-energy', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, walletAddress, energyChange, action, result, error_52;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, walletAddress = _a.walletAddress, energyChange = _a.energyChange, action = _a.action;
                                    if (!walletAddress || energyChange === undefined || !action) {
                                        return [2 /*return*/, res.status(400).json({ error: 'Wallet address, energy change, and action required' })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.updateWalletMindEnergy(walletAddress, energyChange, action)];
                                case 1:
                                    result = _b.sent();
                                    res.json(result);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_52 = _b.sent();
                                    console.error('Error updating mind energy:', error_52);
                                    res.status(500).json({ error: 'Failed to update mind energy' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/wallet/agent-access/:address/:agentId', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, address, agentId, accessResult, error_53;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.params, address = _a.address, agentId = _a.agentId;
                                    return [4 /*yield*/, storage_1.storage.checkAgentAccess(address, agentId)];
                                case 1:
                                    accessResult = _b.sent();
                                    res.json(accessResult);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_53 = _b.sent();
                                    console.error('Error checking agent access:', error_53);
                                    res.status(500).json({ error: 'Failed to check agent access' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Elite user analytics endpoint
                    app.get('/api/wallet/analytics/:address', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var address, profile, analytics, error_54;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    address = req.params.address;
                                    return [4 /*yield*/, storage_1.storage.getWalletProfile(address)];
                                case 1:
                                    profile = _a.sent();
                                    if (profile.tier !== 'Elite') {
                                        return [2 /*return*/, res.status(403).json({ error: 'Elite access required' })];
                                    }
                                    analytics = {
                                        performanceMetrics: {
                                            dreamCreationRate: profile.stats.dreamsCreated / 30, // per day average
                                            remixSuccessRate: (profile.stats.remixesCompleted / profile.stats.dreamsCreated) * 100,
                                            vaultUnlockEfficiency: profile.stats.secretsUnlocked / profile.progression.level,
                                            seasonalParticipation: profile.stats.seasonalEventParticipation
                                        },
                                        rankingPosition: {
                                            globalRank: 47, // Based on score
                                            tierRank: 12, // Within Elite tier
                                            percentile: 95.3
                                        },
                                        projectedGrowth: {
                                            nextLevelDays: Math.ceil(profile.progression.xpToNext / 50), // Assuming 50 XP/day
                                            scoreProjection30d: profile.score + 25,
                                            mindBalanceGrowth: '+15-20 over next month'
                                        }
                                    };
                                    res.json(analytics);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_54 = _a.sent();
                                    console.error('Error fetching analytics:', error_54);
                                    res.status(500).json({ error: 'Failed to fetch analytics' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Dream evolution endpoint
                    app.post('/api/dreams/evolve', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, dreamId, evolutionPath, validPaths, evolvedDream, error_55;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, dreamId = _a.dreamId, evolutionPath = _a.evolutionPath;
                                    if (!dreamId || !evolutionPath) {
                                        return [2 /*return*/, res.status(400).json({ error: 'Dream ID and evolution path required' })];
                                    }
                                    validPaths = ['Visionary', 'Protean', 'Oracle'];
                                    if (!validPaths.includes(evolutionPath)) {
                                        return [2 /*return*/, res.status(400).json({ error: 'Invalid evolution path' })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.evolveDream(dreamId, evolutionPath)];
                                case 1:
                                    evolvedDream = _b.sent();
                                    console.log("\uD83E\uDDEC Dream ".concat(dreamId, " evolved to ").concat(evolutionPath, " form"));
                                    res.json(evolvedDream);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_55 = _b.sent();
                                    console.error('Error evolving dream:', error_55);
                                    res.status(500).json({ error: 'Failed to evolve dream' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Check dream evolution eligibility
                    app.get('/api/dreams/:id/evolution-status', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, evolutionStatus, error_56;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    id = req.params.id;
                                    return [4 /*yield*/, storage_1.storage.checkEvolutionEligibility(id)];
                                case 1:
                                    evolutionStatus = _a.sent();
                                    res.json(evolutionStatus);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_56 = _a.sent();
                                    console.error('Error checking evolution status:', error_56);
                                    res.status(500).json({ error: 'Failed to check evolution status' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get evolved dreams for archive
                    app.get('/api/evolved-dreams', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var evolvedDreams, error_57;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.getEvolvedDreams()];
                                case 1:
                                    evolvedDreams = _a.sent();
                                    res.json(evolvedDreams);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_57 = _a.sent();
                                    console.error('Error fetching evolved dreams:', error_57);
                                    res.status(500).json({ error: 'Failed to fetch evolved dreams' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get dream tree structure
                    app.get('/api/dreams/:id/tree', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, dreamTree, error_58;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    id = req.params.id;
                                    return [4 /*yield*/, storage_1.storage.getDreamTree(id)];
                                case 1:
                                    dreamTree = _a.sent();
                                    res.json(dreamTree);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_58 = _a.sent();
                                    console.error('Error fetching dream tree:', error_58);
                                    res.status(500).json({ error: 'Failed to fetch dream tree' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get harvest yield data for wallet
                    app.get('/api/harvest-yield/:wallet', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var wallet, yieldData, error_59;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    wallet = req.params.wallet;
                                    return [4 /*yield*/, storage_1.storage.getHarvestYield(wallet)];
                                case 1:
                                    yieldData = _a.sent();
                                    res.json(yieldData);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_59 = _a.sent();
                                    console.error('Error fetching harvest yield:', error_59);
                                    res.status(500).json({ error: 'Failed to fetch harvest yield' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get harvest summary for wallet
                    app.get('/api/harvest-summary/:wallet', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var wallet, summary, error_60;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    wallet = req.params.wallet;
                                    return [4 /*yield*/, storage_1.storage.getHarvestSummary(wallet)];
                                case 1:
                                    summary = _a.sent();
                                    res.json(summary);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_60 = _a.sent();
                                    console.error('Error fetching harvest summary:', error_60);
                                    res.status(500).json({ error: 'Failed to fetch harvest summary' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Claim yield from specific dream
                    app.post('/api/harvest-claim', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, dreamId, walletAddress, claimResult, error_61;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, dreamId = _a.dreamId, walletAddress = _a.walletAddress;
                                    return [4 /*yield*/, storage_1.storage.claimYield(dreamId, walletAddress)];
                                case 1:
                                    claimResult = _b.sent();
                                    res.json(claimResult);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_61 = _b.sent();
                                    console.error('Error claiming yield:', error_61);
                                    res.status(500).json({ error: 'Failed to claim yield' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Claim all available yields
                    app.post('/api/harvest-claim-all', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var walletAddress, claimResult, error_62;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    walletAddress = req.body.walletAddress;
                                    return [4 /*yield*/, storage_1.storage.claimAllYields(walletAddress)];
                                case 1:
                                    claimResult = _a.sent();
                                    res.json(claimResult);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_62 = _a.sent();
                                    console.error('Error claiming all yields:', error_62);
                                    res.status(500).json({ error: 'Failed to claim all yields' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Claim rewards endpoint for SHEEP tokens
                    app.post('/api/claim-rewards', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, wallet, token, dreamId, claimResult, error_63;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 5, , 6]);
                                    _a = req.body, wallet = _a.wallet, token = _a.token, dreamId = _a.dreamId;
                                    // Validate input
                                    if (!wallet || !token || !dreamId) {
                                        return [2 /*return*/, res.status(400).json({
                                                success: false,
                                                error: 'Missing required fields: wallet, token, dreamId'
                                            })];
                                    }
                                    claimResult = void 0;
                                    if (!(token === 'SHEEP')) return [3 /*break*/, 2];
                                    return [4 /*yield*/, storage_1.storage.claimSheepReward(dreamId, wallet)];
                                case 1:
                                    claimResult = _b.sent();
                                    return [3 /*break*/, 4];
                                case 2: return [4 /*yield*/, storage_1.storage.claimYield(dreamId, wallet)];
                                case 3:
                                    claimResult = _b.sent();
                                    _b.label = 4;
                                case 4:
                                    res.json({
                                        success: true,
                                        amount: claimResult.amount,
                                        token: claimResult.token,
                                        dreamId: claimResult.dreamId
                                    });
                                    return [3 /*break*/, 6];
                                case 5:
                                    error_63 = _b.sent();
                                    console.error('Error claiming rewards:', error_63);
                                    res.status(400).json({
                                        success: false,
                                        error: error_63.message || 'Failed to claim rewards'
                                    });
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('./swarm-coordinator.js'); })];
                case 1:
                    swarmCoordinator = (_a.sent()).swarmCoordinator;
                    // Swarm status endpoint
                    app.get('/api/swarm/status', function (req, res) {
                        try {
                            var status_3 = swarmCoordinator.getSwarmStatus();
                            res.json(status_3);
                        }
                        catch (error) {
                            console.error('Error getting swarm status:', error);
                            res.status(500).json({ error: 'Failed to get swarm status' });
                        }
                    });
                    // Execute swarm operation
                    app.post('/api/swarm/execute', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, operation, params, operationId, error_64;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, operation = _a.operation, params = _a.params;
                                    return [4 /*yield*/, swarmCoordinator.executeSwarmOperation(operation, params)];
                                case 1:
                                    operationId = _b.sent();
                                    res.json({ operationId: operationId, status: 'EXECUTING' });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_64 = _b.sent();
                                    console.error('Error executing swarm operation:', error_64);
                                    res.status(500).json({ error: 'Failed to execute swarm operation' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Wake dream network (primary swarm command)
                    app.post('/api/swarm/wake', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var walletAddress, wakeOperation, linkOperation, buildOperation, monetizeOperation, error_65;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 5, , 6]);
                                    walletAddress = req.body.walletAddress;
                                    return [4 /*yield*/, swarmCoordinator.executeSwarmOperation('WAKE_DREAM', { walletAddress: walletAddress })];
                                case 1:
                                    wakeOperation = _a.sent();
                                    return [4 /*yield*/, swarmCoordinator.executeSwarmOperation('LINK_NODES', { walletAddress: walletAddress })];
                                case 2:
                                    linkOperation = _a.sent();
                                    return [4 /*yield*/, swarmCoordinator.executeSwarmOperation('BUILD_CORE', { walletAddress: walletAddress })];
                                case 3:
                                    buildOperation = _a.sent();
                                    return [4 /*yield*/, swarmCoordinator.executeSwarmOperation('MONETIZE_YIELD', { walletAddress: walletAddress })];
                                case 4:
                                    monetizeOperation = _a.sent();
                                    res.json({
                                        message: 'DREAM NETWORK AWAKENED',
                                        operations: {
                                            wake: wakeOperation,
                                            link: linkOperation,
                                            build: buildOperation,
                                            monetize: monetizeOperation
                                        },
                                        swarmTokens: ['FLBY', 'SHEEP', 'CORE', 'ROOT'],
                                        directive: 'ONE DREAM WAKES ANOTHER'
                                    });
                                    return [3 /*break*/, 6];
                                case 5:
                                    error_65 = _a.sent();
                                    console.error('Error waking dream network:', error_65);
                                    res.status(500).json({ error: 'Failed to wake dream network' });
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Node action endpoint
                    app.post('/api/nodes/:nodeId/action', function (req, res) {
                        var nodeId = req.params.nodeId;
                        var action = req.body.action;
                        // Future logic: match action type → perform task
                        console.log("\uD83C\uDFAF Action received: ".concat(action, " on node ").concat(nodeId));
                        // Handle special actions
                        var result = { status: 'ok', action: action, nodeId: nodeId };
                        if (action === 'cleanseNightmare') {
                            result = __assign(__assign({}, result), { message: 'Nightmare cleansed successfully', xpGained: 50 });
                        }
                        else if (action === 'claimRemix') {
                            result = __assign(__assign({}, result), { message: 'Remix bounty claimed', tokensEarned: 25 });
                        }
                        res.json(result);
                    });
                    // Static Dreams API endpoint - no database dependency
                    app.get("/api/dreams/static", function (req, res) {
                        res.json([
                            {
                                id: "dream-0",
                                name: "Dream 0",
                                creator: "0xFAKE0",
                                tags: ["ai"],
                                score: 0,
                                evolved: false,
                                lastUpdated: new Date().toISOString(),
                                coreType: "Vision",
                                description: "This is the seed description for Dream 0.",
                                image: "https://picsum.photos/seed/0/300/200",
                                status: "Draft",
                                title: "Dream 0",
                                urgency: 1,
                                wallet: "0xFAKE0"
                            },
                            {
                                id: "dream-1",
                                name: "Dream 1",
                                creator: "0xFAKE1",
                                tags: ["crypto"],
                                score: 0,
                                evolved: false,
                                lastUpdated: new Date().toISOString(),
                                coreType: "Tool",
                                description: "This is the seed description for Dream 1.",
                                image: "https://picsum.photos/seed/1/300/200",
                                status: "Draft",
                                title: "Dream 1",
                                urgency: 2,
                                wallet: "0xFAKE1"
                            },
                            {
                                id: "dream-2",
                                name: "Dream 2",
                                creator: "0xFAKE2",
                                tags: ["music"],
                                score: 0,
                                evolved: false,
                                lastUpdated: new Date().toISOString(),
                                coreType: "Movement",
                                description: "This is the seed description for Dream 2.",
                                image: "https://picsum.photos/seed/2/300/200",
                                status: "Draft",
                                title: "Dream 2",
                                urgency: 3,
                                wallet: "0xFAKE2"
                            }
                        ]);
                    });
                    // List all available dream IDs for debugging
                    app.get("/api/dreams/ids", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var dreamIds;
                        return __generator(this, function (_a) {
                            try {
                                dreamIds = sample_data_1.staticSampleDreams.map(function (d) { return ({
                                    id: d.id,
                                    name: d.name,
                                    coreType: d.coreType,
                                    status: d.status
                                }); });
                                console.log("[GET /api/dreams/ids] Returning ".concat(dreamIds.length, " dream IDs"));
                                res.json(dreamIds);
                            }
                            catch (error) {
                                console.error("[GET /api/dreams/ids] Error:", error);
                                res.status(500).json({ error: error.message });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // Get individual dream by ID from in-memory database
                    app.get('/api/dream/:id', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, dream, dbError_1, error_66;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    id = req.params.id;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 6, , 7]);
                                    console.log("[GET /api/dream/".concat(id, "] Querying dream by ID: ").concat(id));
                                    dream = void 0;
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, 4, , 5]);
                                    return [4 /*yield*/, storage_1.storage.getDream(id)];
                                case 3:
                                    dream = _a.sent();
                                    console.log("[GET /api/dream/".concat(id, "] Database query result: ").concat(dream ? 'found' : 'not found'));
                                    return [3 /*break*/, 5];
                                case 4:
                                    dbError_1 = _a.sent();
                                    console.log("[GET /api/dream/".concat(id, "] Database error: ").concat(dbError_1.message, ", falling back to sample data"));
                                    // Fallback to static sample dreams if database is unavailable
                                    dream = sample_data_1.staticSampleDreams.find(function (d) { return d.id === id; });
                                    console.log("[GET /api/dream/".concat(id, "] Sample data fallback result: ").concat(dream ? 'found' : 'not found'));
                                    return [3 /*break*/, 5];
                                case 5:
                                    if (!dream) {
                                        console.log("[GET /api/dream/".concat(id, "] Dream not found in database or sample data"));
                                        return [2 /*return*/, res.status(404).json({
                                                error: 'Dream not found',
                                                message: "No dream exists with ID: ".concat(id)
                                            })];
                                    }
                                    console.log("[GET /api/dream/".concat(id, "] Successfully returning dream: ").concat(dream.name || dream.title));
                                    res.json(dream);
                                    return [3 /*break*/, 7];
                                case 6:
                                    error_66 = _a.sent();
                                    console.error("[GET /api/dream/".concat(id, "] Unexpected error:"), error_66);
                                    res.status(500).json({
                                        error: 'Internal server error',
                                        message: 'Failed to retrieve dream',
                                        details: process.env.NODE_ENV === 'development' ? error_66.message : undefined
                                    });
                                    return [3 /*break*/, 7];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Lighthouse Website Audit endpoint
                    app.post("/api/lighthouse/audit", browserGovernance, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var url, lighthouseAuditor, auditResult, callerId, tierId, error_67;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 6, , 7]);
                                    url = req.body.url;
                                    if (!url) {
                                        return [2 /*return*/, res.status(400).json({
                                                error: 'URL is required',
                                                message: 'Please provide a website URL to audit'
                                            })];
                                    }
                                    console.log("[POST /api/lighthouse/audit] Starting audit for URL: ".concat(url));
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('./lighthouse-auditor'); })];
                                case 1:
                                    lighthouseAuditor = (_c.sent()).lighthouseAuditor;
                                    auditResult = void 0;
                                    if (!ENABLE_BROWSER_WRAPPER) return [3 /*break*/, 3];
                                    console.log("[POST /api/lighthouse/audit] Using BrowserAgentWrapper for ".concat(url));
                                    callerId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 'anonymous';
                                    tierId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.tier) || 'FREE';
                                    return [4 /*yield*/, BrowserAgentWrapper_1.browserAgentWrapper.auditWebsite({
                                            url: url,
                                            callerId: callerId,
                                            tierId: tierId
                                        })];
                                case 2:
                                    auditResult = _c.sent();
                                    return [3 /*break*/, 5];
                                case 3:
                                    console.log("[POST /api/lighthouse/audit] Using legacy LighthouseAuditor for ".concat(url));
                                    return [4 /*yield*/, lighthouseAuditor.auditWebsite(url)];
                                case 4:
                                    auditResult = _c.sent();
                                    _c.label = 5;
                                case 5:
                                    console.log("[POST /api/lighthouse/audit] Audit completed for ".concat(url, " - Overall Score: ").concat(auditResult.summary.overallScore));
                                    res.json({
                                        success: true,
                                        audit: auditResult,
                                        dreamContext: {
                                            category: auditResult.summary.dreamUpgradeCategory,
                                            upgradeType: 'Website Performance Enhancement',
                                            readyForGPTProcessing: true
                                        }
                                    });
                                    return [3 /*break*/, 7];
                                case 6:
                                    error_67 = _c.sent();
                                    console.error("[POST /api/lighthouse/audit] Error:", error_67);
                                    res.status(500).json({
                                        error: 'Audit failed',
                                        message: error_67.message,
                                        details: process.env.NODE_ENV === 'development' ? error_67.stack : undefined
                                    });
                                    return [3 /*break*/, 7];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Enhanced audit endpoint with GPT dream processing
                    app.post("/api/lighthouse/dream-audit", browserGovernance, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, url, _b, generateDreamReport, lighthouseAuditor, gptDreamProcessor, auditResult, callerId, tierId, gptReadyData, dreamReport, error_68;
                        var _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    _e.trys.push([0, 9, , 10]);
                                    _a = req.body, url = _a.url, _b = _a.generateDreamReport, generateDreamReport = _b === void 0 ? false : _b;
                                    if (!url) {
                                        return [2 /*return*/, res.status(400).json({
                                                error: 'URL is required',
                                                message: 'Please provide a website URL to audit'
                                            })];
                                    }
                                    console.log("[POST /api/lighthouse/dream-audit] Starting dream audit for URL: ".concat(url));
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('./lighthouse-auditor'); })];
                                case 1:
                                    lighthouseAuditor = (_e.sent()).lighthouseAuditor;
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('./gpt-dream-processor'); })];
                                case 2:
                                    gptDreamProcessor = (_e.sent()).gptDreamProcessor;
                                    auditResult = void 0;
                                    if (!ENABLE_BROWSER_WRAPPER) return [3 /*break*/, 4];
                                    console.log("[POST /api/lighthouse/dream-audit] Using BrowserAgentWrapper for ".concat(url));
                                    callerId = ((_c = req.user) === null || _c === void 0 ? void 0 : _c.id) || 'anonymous';
                                    tierId = ((_d = req.user) === null || _d === void 0 ? void 0 : _d.tier) || 'FREE';
                                    return [4 /*yield*/, BrowserAgentWrapper_1.browserAgentWrapper.auditWebsite({
                                            url: url,
                                            callerId: callerId,
                                            tierId: tierId
                                        })];
                                case 3:
                                    auditResult = _e.sent();
                                    return [3 /*break*/, 6];
                                case 4:
                                    console.log("[POST /api/lighthouse/dream-audit] Using legacy LighthouseAuditor for ".concat(url));
                                    return [4 /*yield*/, lighthouseAuditor.auditWebsite(url)];
                                case 5:
                                    auditResult = _e.sent();
                                    _e.label = 6;
                                case 6:
                                    gptReadyData = gptDreamProcessor.prepareLighthouseDataForGPT(auditResult);
                                    dreamReport = null;
                                    if (!generateDreamReport) return [3 /*break*/, 8];
                                    return [4 /*yield*/, gptDreamProcessor.processWithGPT(gptReadyData)];
                                case 7:
                                    // Generate dream-style upgrade report
                                    dreamReport = _e.sent();
                                    console.log("[POST /api/lighthouse/dream-audit] Dream report generated for ".concat(url));
                                    _e.label = 8;
                                case 8:
                                    console.log("[POST /api/lighthouse/dream-audit] Completed for ".concat(url, " - Score: ").concat(auditResult.summary.overallScore));
                                    res.json({
                                        success: true,
                                        audit: auditResult,
                                        gptData: gptReadyData,
                                        dreamReport: dreamReport,
                                        metadata: {
                                            auditTimestamp: auditResult.timestamp,
                                            processingTime: new Date().toISOString(),
                                            dreamCategory: auditResult.summary.dreamUpgradeCategory,
                                            readyForUpgrade: true
                                        }
                                    });
                                    return [3 /*break*/, 10];
                                case 9:
                                    error_68 = _e.sent();
                                    console.error("[POST /api/lighthouse/dream-audit] Error:", error_68);
                                    res.status(500).json({
                                        error: 'Dream audit failed',
                                        message: error_68.message,
                                        details: process.env.NODE_ENV === 'development' ? error_68.stack : undefined
                                    });
                                    return [3 /*break*/, 10];
                                case 10: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Quick audit endpoint for basic checks
                    app.get("/api/lighthouse/quick-check/:encodedUrl", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var url, allowlistCheck, ipCheck, error_69;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    url = decodeURIComponent(req.params.encodedUrl);
                                    console.log("[GET /api/lighthouse/quick-check] Quick check for URL: ".concat(url));
                                    // Basic URL validation
                                    try {
                                        new URL(url);
                                    }
                                    catch (_b) {
                                        return [2 /*return*/, res.status(400).json({
                                                error: 'Invalid URL format',
                                                message: 'Please provide a valid website URL'
                                            })];
                                    }
                                    if (!ENABLE_BROWSER_WRAPPER) return [3 /*break*/, 2];
                                    allowlistCheck = domainAllowlist_1.defaultDomainAllowlist.isAllowed(url);
                                    if (!allowlistCheck.allowed) {
                                        return [2 /*return*/, res.status(403).json({
                                                error: 'Domain not allowed',
                                                message: allowlistCheck.reason
                                            })];
                                    }
                                    return [4 /*yield*/, ipBlocking_1.defaultIpBlocking.validateUrl(url)];
                                case 1:
                                    ipCheck = _a.sent();
                                    if (!ipCheck.allowed) {
                                        return [2 /*return*/, res.status(403).json({
                                                error: 'Access denied',
                                                message: ipCheck.reason
                                            })];
                                    }
                                    _a.label = 2;
                                case 2:
                                    // Return a quick response indicating audit is possible
                                    res.json({
                                        url: url,
                                        ready: true,
                                        message: 'URL is valid and ready for full Lighthouse audit',
                                        estimatedTime: '30-60 seconds',
                                        auditEndpoints: {
                                            basic: '/api/lighthouse/audit',
                                            dreamReport: '/api/lighthouse/dream-audit'
                                        }
                                    });
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_69 = _a.sent();
                                    console.error("[GET /api/lighthouse/quick-check] Error:", error_69);
                                    res.status(500).json({
                                        error: 'Quick check failed',
                                        message: error_69.message
                                    });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Evolution Chains endpoints
                    app.get("/api/evolution-chains", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var limit, offset, chains, error_70;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    limit = parseInt(req.query.limit) || 50;
                                    offset = parseInt(req.query.offset) || 0;
                                    return [4 /*yield*/, storage_1.storage.getEvolutionChains(limit, offset)];
                                case 1:
                                    chains = _a.sent();
                                    res.json(chains);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_70 = _a.sent();
                                    console.log("Error fetching evolution chains: ".concat(error_70));
                                    res.status(500).json({ error: "Failed to fetch evolution chains" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get("/api/evolution-chains/:dreamId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var dreamId, chain, error_71;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    dreamId = req.params.dreamId;
                                    return [4 /*yield*/, storage_1.storage.getEvolutionChain(dreamId)];
                                case 1:
                                    chain = _a.sent();
                                    if (!chain) {
                                        return [2 /*return*/, res.status(404).json({ error: "Evolution chain not found" })];
                                    }
                                    res.json(chain);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_71 = _a.sent();
                                    console.log("Error fetching evolution chain: ".concat(error_71));
                                    res.status(500).json({ error: "Failed to fetch evolution chain" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Dream Invites endpoints
                    app.post("/api/dreams/:dreamId/invite", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var dreamId, _a, wallet, role, message, inviterWallet, invite, error_72;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    dreamId = req.params.dreamId;
                                    _a = req.body, wallet = _a.wallet, role = _a.role, message = _a.message;
                                    inviterWallet = req.headers['x-wallet-address'];
                                    if (!wallet || !role) {
                                        return [2 /*return*/, res.status(400).json({ error: "Wallet and role are required" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.inviteContributor(dreamId, wallet, role, inviterWallet, message)];
                                case 1:
                                    invite = _b.sent();
                                    res.json(invite);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_72 = _b.sent();
                                    res.status(500).json({ error: error_72.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get("/api/invites", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, wallet, dreamId, invites, error_73;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.query, wallet = _a.wallet, dreamId = _a.dreamId;
                                    return [4 /*yield*/, storage_1.storage.getDreamInvites(wallet, dreamId)];
                                case 1:
                                    invites = _b.sent();
                                    res.json(invites);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_73 = _b.sent();
                                    res.status(500).json({ error: error_73.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get("/api/invites/pending/:wallet", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var wallet, invites, error_74;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    wallet = req.params.wallet;
                                    return [4 /*yield*/, storage_1.storage.getPendingInvites(wallet)];
                                case 1:
                                    invites = _a.sent();
                                    res.json(invites);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_74 = _a.sent();
                                    res.status(500).json({ error: error_74.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.patch("/api/invites/:inviteId/respond", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var inviteId, accept, invite, error_75;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    inviteId = req.params.inviteId;
                                    accept = req.body.accept;
                                    if (typeof accept !== 'boolean') {
                                        return [2 /*return*/, res.status(400).json({ error: "Accept must be a boolean" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.respondToInvite(inviteId, accept)];
                                case 1:
                                    invite = _a.sent();
                                    res.json(invite);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_75 = _a.sent();
                                    res.status(500).json({ error: error_75.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Dream Tokens endpoints
                    app.post("/api/tokens/mint", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, dreamId, cocoonId, holderWallet, purpose, milestone, metadata, token, error_76;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, dreamId = _a.dreamId, cocoonId = _a.cocoonId, holderWallet = _a.holderWallet, purpose = _a.purpose, milestone = _a.milestone, metadata = _a.metadata;
                                    if (!dreamId || !holderWallet || !purpose) {
                                        return [2 /*return*/, res.status(400).json({ error: "DreamId, holderWallet, and purpose are required" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.mintToken(dreamId, cocoonId, holderWallet, purpose, milestone, metadata)];
                                case 1:
                                    token = _b.sent();
                                    res.json(token);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_76 = _b.sent();
                                    res.status(500).json({ error: error_76.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get("/api/tokens", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, wallet, dreamId, purpose, tokens, error_77;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.query, wallet = _a.wallet, dreamId = _a.dreamId, purpose = _a.purpose;
                                    return [4 /*yield*/, storage_1.storage.getDreamTokens(wallet, dreamId, purpose)];
                                case 1:
                                    tokens = _b.sent();
                                    res.json(tokens);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_77 = _b.sent();
                                    res.status(500).json({ error: error_77.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get("/api/tokens/holder/:wallet", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var wallet, tokens, error_78;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    wallet = req.params.wallet;
                                    return [4 /*yield*/, storage_1.storage.getTokensByHolder(wallet)];
                                case 1:
                                    tokens = _a.sent();
                                    res.json(tokens);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_78 = _a.sent();
                                    res.status(500).json({ error: error_78.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Network Graph endpoint
                    app.get("/api/network-graph", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var graph, error_79;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.getNetworkGraph()];
                                case 1:
                                    graph = _a.sent();
                                    res.json(graph);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_79 = _a.sent();
                                    console.log("Error generating network graph: ".concat(error_79));
                                    res.status(500).json({ error: "Failed to generate network graph" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Webhook test endpoint (admin only)
                    app.post("/api/webhooks/test", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var webhookNotifier, error_80;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./webhook-notifier"); })];
                                case 1:
                                    webhookNotifier = (_a.sent()).webhookNotifier;
                                    return [4 /*yield*/, webhookNotifier.testWebhooks()];
                                case 2:
                                    _a.sent();
                                    res.json({ message: "Webhook test triggered" });
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_80 = _a.sent();
                                    console.log("Error testing webhooks: ".concat(error_80));
                                    res.status(500).json({ error: "Failed to test webhooks" });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Simple Garden Feed API - Returns all dreams and cocoons with simple structure
                    app.get("/api/garden/feed", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var gardenFeed, error_81;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.getSimpleGardenFeed()];
                                case 1:
                                    gardenFeed = _a.sent();
                                    res.json({
                                        feed: gardenFeed,
                                        count: gardenFeed.length,
                                        timestamp: new Date().toISOString()
                                    });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_81 = _a.sent();
                                    res.status(500).json({ error: error_81.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Garden Feed direct route - Public access with static data (bypass router issues)
                    app.get("/api/garden-feed/", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var staticFeed;
                        return __generator(this, function (_a) {
                            try {
                                console.log('[Garden Feed Direct] Processing garden feed request - returning static data');
                                staticFeed = [
                                    {
                                        id: "dream-0",
                                        name: "Dream 0",
                                        creator: "0xFAKE0",
                                        tags: ["ai"],
                                        score: 75,
                                        evolved: false,
                                        lastUpdated: new Date().toISOString(),
                                        coreType: "Vision",
                                        description: "This is the seed description for Dream 0.",
                                        image: "https://picsum.photos/seed/0/300/200",
                                        status: "Draft"
                                    },
                                    {
                                        id: "dream-1",
                                        name: "Dream 1",
                                        creator: "0xFAKE1",
                                        tags: ["crypto"],
                                        score: 68,
                                        evolved: false,
                                        lastUpdated: new Date().toISOString(),
                                        coreType: "Tool",
                                        description: "This is the seed description for Dream 1.",
                                        image: "https://picsum.photos/seed/1/300/200",
                                        status: "Draft"
                                    },
                                    {
                                        id: "dream-2",
                                        name: "Dream 2",
                                        creator: "0xFAKE2",
                                        tags: ["music"],
                                        score: 82,
                                        evolved: false,
                                        lastUpdated: new Date().toISOString(),
                                        coreType: "Movement",
                                        description: "This is the seed description for Dream 2.",
                                        image: "https://picsum.photos/seed/2/300/200",
                                        status: "Draft"
                                    }
                                ];
                                console.log("[Garden Feed Direct] Returning ".concat(staticFeed.length, " static dreams"));
                                res.json(staticFeed);
                            }
                            catch (e) {
                                console.error('Feed error:', e);
                                res.status(500).json({
                                    error: 'Failed to get garden feed',
                                    message: e instanceof Error ? e.message : 'Unknown error'
                                });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // Garden Feed Router - Enhanced endpoint with metadata (public access)
                    app.use("/api/garden-feed", gardenFeedRouter_1.default);
                    // Task Connector Router - Bot routing and orchestration
                    app.use("/api/connector", routes_connector_1.default);
                    app.use("/api/connector-v1", connector_1.default);
                    // Dreams Router - Simple dream submission endpoint  
                    app.use('/api/dreams', dreams_1.default);
                    // Wallet Scan Router - FlutterAI wallet analysis
                    app.use('/api/wallet-scan', wallet_scan_1.default);
                    // Dream Processing Pipeline - LUCID/CANVAS/ROOT/ECHO stages
                    app.use('/api/dream-processor', dream_processor_1.default);
                    // Wallet Score Evaluation - CRADLE vs SEED access determination
                    app.use('/api/wallet-score', wallet_score_1.default);
                    // Dream Core Management - Spawning and evolution
                    app.use('/api/dream-cores', dream_cores_1.default);
                    app.use('/api/lucid', lucid_1.default);
                    app.use('/api/canvas', canvas_1.default);
                    app.use('/api/root', root_1.default);
                    app.use('/api/echo', echo_1.default);
                    // Test orchestration endpoint for simulation
                    app.post("/api/test/orchestration", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            try {
                                console.log("🎭 Starting Dream Network Orchestration Simulation...");
                                // Import and run orchestration (async to not block response)
                                Promise.resolve().then(function () { return require("./orchestration-script"); }).then(function (module) { return __awaiter(_this, void 0, void 0, function () {
                                    var error_82;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 2, , 3]);
                                                return [4 /*yield*/, module.runOrchestration()];
                                            case 1:
                                                _a.sent();
                                                console.log("✅ Orchestration simulation completed successfully");
                                                return [3 /*break*/, 3];
                                            case 2:
                                                error_82 = _a.sent();
                                                console.log("❌ Orchestration simulation failed:", error_82);
                                                return [3 /*break*/, 3];
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); });
                                res.json({
                                    message: "Dream network orchestration simulation started",
                                    status: "running",
                                    timestamp: new Date().toISOString()
                                });
                            }
                            catch (error) {
                                res.status(500).json({ error: error.message });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // AI Dream Evaluation endpoint
                    app.post("/api/evaluate-dream/:id", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var dream, dreamEvaluator, result, error_83;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    return [4 /*yield*/, storage_1.storage.getDream(req.params.id)];
                                case 1:
                                    dream = _a.sent();
                                    if (!dream) {
                                        return [2 /*return*/, res.status(404).json({ error: "Dream not found" })];
                                    }
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./ai-dream-evaluator"); })];
                                case 2:
                                    dreamEvaluator = (_a.sent()).dreamEvaluator;
                                    return [4 /*yield*/, dreamEvaluator.evaluateDream(dream)];
                                case 3:
                                    result = _a.sent();
                                    res.json({
                                        dreamId: dream.id,
                                        score: result.score,
                                        action: result.action,
                                        reasoning: result.reasoning,
                                        categoryScores: result.categoryScores,
                                        timestamp: new Date().toISOString()
                                    });
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_83 = _a.sent();
                                    console.error("❌ Dream evaluation error:", error_83);
                                    res.status(500).json({ error: "Failed to evaluate dream" });
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Batch evaluate all pending dreams
                    app.post("/api/evaluate-all-dreams", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            try {
                                console.log("🤖 Starting batch dream evaluation...");
                                // Import and run batch evaluation (async to not block response)
                                Promise.resolve().then(function () { return require("./ai-dream-evaluator"); }).then(function (module) { return __awaiter(_this, void 0, void 0, function () {
                                    var error_84;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 2, , 3]);
                                                return [4 /*yield*/, module.dreamEvaluator.evaluateAllPendingDreams()];
                                            case 1:
                                                _a.sent();
                                                console.log("✅ Batch dream evaluation completed");
                                                return [3 /*break*/, 3];
                                            case 2:
                                                error_84 = _a.sent();
                                                console.log("❌ Batch dream evaluation failed:", error_84);
                                                return [3 /*break*/, 3];
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); });
                                res.json({
                                    message: "Batch dream evaluation started",
                                    status: "running",
                                    timestamp: new Date().toISOString()
                                });
                            }
                            catch (error) {
                                res.status(500).json({ error: error.message });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // Public dream submission endpoint
                    app.post("/api/submit-dream", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, dreamName, walletAddress, description, tags, cleanTags, newDream, error_85;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 2, , 3]);
                                    _a = req.body, dreamName = _a.dreamName, walletAddress = _a.walletAddress, description = _a.description, tags = _a.tags;
                                    // Validation
                                    if (!dreamName || typeof dreamName !== 'string' || dreamName.trim().length < 3) {
                                        return [2 /*return*/, res.status(400).json({ error: "Dream name must be at least 3 characters" })];
                                    }
                                    if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.trim().length < 32) {
                                        return [2 /*return*/, res.status(400).json({ error: "Valid wallet address is required" })];
                                    }
                                    if (!description || typeof description !== 'string' || description.trim().length < 10) {
                                        return [2 /*return*/, res.status(400).json({ error: "Description must be at least 10 characters" })];
                                    }
                                    if (!tags || !Array.isArray(tags) || tags.length === 0) {
                                        return [2 /*return*/, res.status(400).json({ error: "At least one tag is required" })];
                                    }
                                    cleanTags = tags
                                        .map(function (tag) { return typeof tag === 'string' ? tag.trim() : ''; })
                                        .filter(function (tag) { return tag.length > 0; })
                                        .slice(0, 10);
                                    if (cleanTags.length === 0) {
                                        return [2 /*return*/, res.status(400).json({ error: "At least one valid tag is required" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.createDream({
                                            wallet: walletAddress.trim(),
                                            title: dreamName.trim(),
                                            description: description.trim(),
                                            tags: cleanTags,
                                            urgency: 5, // Default urgency for public submissions
                                            origin: "public_submission"
                                        })];
                                case 1:
                                    newDream = _c.sent();
                                    // Log to console
                                    console.log("📝 NEW DREAM SUBMITTED:");
                                    console.log("========================");
                                    console.log("ID: ".concat(newDream.id));
                                    console.log("Name: ".concat(newDream.title));
                                    console.log("Wallet: ".concat(newDream.wallet));
                                    console.log("Description: ".concat(newDream.description));
                                    console.log("Tags: ".concat((_b = newDream.tags) === null || _b === void 0 ? void 0 : _b.join(", ")));
                                    console.log("Status: ".concat(newDream.status));
                                    console.log("Timestamp: ".concat(new Date().toISOString()));
                                    console.log("========================");
                                    res.json({
                                        message: "Dream submitted successfully",
                                        dreamId: newDream.id,
                                        status: "pending_review",
                                        timestamp: new Date().toISOString()
                                    });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_85 = _c.sent();
                                    console.error("❌ Dream submission error:", error_85);
                                    res.status(500).json({ error: "Failed to submit dream. Please try again." });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Tags endpoints
                    app.get("/api/tags", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var tags, error_86;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.getAllTags()];
                                case 1:
                                    tags = _a.sent();
                                    res.json(tags);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_86 = _a.sent();
                                    res.status(500).json({ error: error_86.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.patch("/api/dreams/:id/tags", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var tags, dream, error_87;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    tags = req.body.tags;
                                    if (!Array.isArray(tags)) {
                                        return [2 /*return*/, res.status(400).json({ error: "Tags must be an array" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.updateDreamTags(req.params.id, tags)];
                                case 1:
                                    dream = _a.sent();
                                    res.json(dream);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_87 = _a.sent();
                                    res.status(500).json({ error: error_87.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.patch("/api/cocoons/:id/tags", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var tags, cocoon, error_88;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    tags = req.body.tags;
                                    if (!Array.isArray(tags)) {
                                        return [2 /*return*/, res.status(400).json({ error: "Tags must be an array" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.updateCocoonTags(req.params.id, tags)];
                                case 1:
                                    cocoon = _a.sent();
                                    res.json(cocoon);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_88 = _a.sent();
                                    res.status(500).json({ error: error_88.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Force cocoon stage endpoint with override protection
                    app.patch("/api/cocoons/:id/force-stage", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, stage, _b, overrideMode, adminWallet, cocoon, error_89;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 2, , 3]);
                                    _a = req.body, stage = _a.stage, _b = _a.overrideMode, overrideMode = _b === void 0 ? false : _b;
                                    adminWallet = req.headers['x-wallet-address'];
                                    if (!overrideMode && process.env.OVERRIDE_MODE !== 'true') {
                                        return [2 /*return*/, res.status(403).json({
                                                error: "Override mode required. Set OVERRIDE_MODE=true in environment or enable override mode in admin dashboard."
                                            })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.forceCocoonStage(req.params.id, stage, adminWallet)];
                                case 1:
                                    cocoon = _c.sent();
                                    res.json(cocoon);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_89 = _c.sent();
                                    res.status(500).json({ error: error_89.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Cocoon logs endpoints
                    app.get("/api/cocoons/:id/logs", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var logs, error_90;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.getCocoonLogs(req.params.id)];
                                case 1:
                                    logs = _a.sent();
                                    res.json(logs);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_90 = _a.sent();
                                    res.status(500).json({ error: error_90.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // NFT minting endpoint
                    app.post("/api/cocoons/:id/mint", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var cocoon, nftData, error_91;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, storage_1.storage.getCocoon(req.params.id)];
                                case 1:
                                    cocoon = _a.sent();
                                    if (!cocoon) {
                                        return [2 /*return*/, res.status(404).json({ error: "Cocoon not found" })];
                                    }
                                    if (cocoon.stage !== 'complete') {
                                        return [2 /*return*/, res.status(400).json({ error: "Only completed cocoons can be minted" })];
                                    }
                                    if (!cocoon.dreamScore || cocoon.dreamScore < 80) {
                                        return [2 /*return*/, res.status(400).json({ error: "Cocoon must have a score of 80+ to be eligible for minting" })];
                                    }
                                    nftData = {
                                        name: "Cocoon of ".concat(cocoon.title),
                                        contractAddress: "0x" + Math.random().toString(16).substr(2, 40),
                                        tokenId: Math.floor(Math.random() * 10000),
                                        mintedAt: new Date().toISOString(),
                                        owner: cocoon.creatorWallet
                                    };
                                    // Send notification
                                    return [4 /*yield*/, notification_engine_1.notificationEngine.notifyNFTMinted(cocoon, nftData)];
                                case 2:
                                    // Send notification
                                    _a.sent();
                                    res.json({
                                        message: "NFT minted successfully",
                                        nft: nftData,
                                        cocoon: cocoon
                                    });
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_91 = _a.sent();
                                    res.status(500).json({ error: error_91.message });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Archive inactive items endpoint
                    app.post("/api/maintenance/archive", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var inactivityDays, archivedItems, error_92;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    inactivityDays = parseInt(process.env.INACTIVITY_DAYS_BEFORE_ARCHIVE || '7');
                                    return [4 /*yield*/, storage_1.storage.archiveInactiveItems(inactivityDays)];
                                case 1:
                                    archivedItems = _a.sent();
                                    res.json({
                                        message: "Archive process completed",
                                        archived: archivedItems
                                    });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_92 = _a.sent();
                                    res.status(500).json({ error: error_92.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Development and testing endpoints (remove in production)
                    if (process.env.NODE_ENV === 'development') {
                        // Generate test dreams
                        app.post("/api/dev/generate-dreams", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                            var generateBatch, count, error_93;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 3, , 4]);
                                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./dev-test-generator"); })];
                                    case 1:
                                        generateBatch = (_a.sent()).generateBatch;
                                        count = parseInt(req.body.count) || 5;
                                        return [4 /*yield*/, generateBatch(count)];
                                    case 2:
                                        _a.sent();
                                        res.json({ message: "Generated ".concat(count, " test dreams successfully") });
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_93 = _a.sent();
                                        res.status(500).json({ error: error_93.message });
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                        // Run orchestration script
                        app.post("/api/dev/run-orchestration", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                            var runOrchestration, error_94;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 3, , 4]);
                                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./orchestration-script"); })];
                                    case 1:
                                        runOrchestration = (_a.sent()).runOrchestration;
                                        return [4 /*yield*/, runOrchestration()];
                                    case 2:
                                        _a.sent();
                                        res.json({ message: "Orchestration script completed successfully" });
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_94 = _a.sent();
                                        res.status(500).json({ error: error_94.message });
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                        // Run comprehensive test
                        app.post("/api/dev/run-test", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                            var runDemoTest, error_95;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 3, , 4]);
                                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../test-runner"); })];
                                    case 1:
                                        runDemoTest = (_a.sent()).runDemoTest;
                                        return [4 /*yield*/, runDemoTest()];
                                    case 2:
                                        _a.sent();
                                        res.json({ message: "Comprehensive test completed successfully" });
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_95 = _a.sent();
                                        res.status(500).json({ error: error_95.message });
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                        // Test minting functionality
                        app.post("/api/dev/test-mint/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                            var cocoon, minted, error_96;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 3, , 4]);
                                        return [4 /*yield*/, storage_1.storage.getCocoon(req.params.id)];
                                    case 1:
                                        cocoon = _a.sent();
                                        if (!cocoon) {
                                            return [2 /*return*/, res.status(404).json({ error: "Cocoon not found" })];
                                        }
                                        return [4 /*yield*/, storage_1.storage.checkAndMintNFT(cocoon)];
                                    case 2:
                                        minted = _a.sent();
                                        res.json({
                                            message: minted ? "NFT minted successfully" : "Minting conditions not met",
                                            minted: minted,
                                            cocoon: {
                                                id: cocoon.id,
                                                title: cocoon.title,
                                                stage: cocoon.stage,
                                                score: cocoon.dreamScore,
                                                alreadyMinted: cocoon.minted
                                            }
                                        });
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_96 = _a.sent();
                                        res.status(500).json({ error: error_96.message });
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                    }
                    // Simple notifications endpoints
                    app.get("/api/simple-notifications", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var walletAddress, simpleNotifications, limit, notifications_2, error_97;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    walletAddress = req.headers['x-wallet-address'];
                                    if (!walletAddress) {
                                        return [2 /*return*/, res.status(400).json({ error: "Wallet address required" })];
                                    }
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./simple-notifications"); })];
                                case 1:
                                    simpleNotifications = (_a.sent()).simpleNotifications;
                                    limit = parseInt(req.query.limit) || 20;
                                    notifications_2 = simpleNotifications.getNotifications(walletAddress, limit);
                                    res.json({
                                        notifications: notifications_2,
                                        unreadCount: simpleNotifications.getUnreadCount(walletAddress)
                                    });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_97 = _a.sent();
                                    res.status(500).json({ error: error_97.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.patch("/api/simple-notifications/:id/read", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var simpleNotifications, success, error_98;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./simple-notifications"); })];
                                case 1:
                                    simpleNotifications = (_a.sent()).simpleNotifications;
                                    success = simpleNotifications.markAsRead(req.params.id);
                                    res.json({ success: success });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_98 = _a.sent();
                                    res.status(500).json({ error: error_98.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.patch("/api/simple-notifications/mark-all-read", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var walletAddress, simpleNotifications, count, error_99;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    walletAddress = req.headers['x-wallet-address'];
                                    if (!walletAddress) {
                                        return [2 /*return*/, res.status(400).json({ error: "Wallet address required" })];
                                    }
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./simple-notifications"); })];
                                case 1:
                                    simpleNotifications = (_a.sent()).simpleNotifications;
                                    count = simpleNotifications.markAllAsRead(walletAddress);
                                    res.json({ markedCount: count });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_99 = _a.sent();
                                    res.status(500).json({ error: error_99.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Dream Storage Router - Local file persistence
                    app.use('/api/dream-storage', dream_storage_1.default);
                    app.use('/api/save-core', save_core_1.default);
                    app.use('/api/load-core', load_core_1.default);
                    app.use('/api/reactivate-core', reactivate_core_1.default);
                    app.use('/api/generate-dream-link', generate_dream_link_1.default);
                    app.use('/api/shared-dream', shared_dream_1.default);
                    app.use('/api/public-dream', public_dream_1.default);
                    app.use('/api/mutate-dream', mutate_dream_1.default);
                    app.use('/api/save-mutated-dream', save_mutated_dream_1.default);
                    app.use('/api/load-dreams', load_dreams_1.default);
                    app.use('/api/all-dreams', all_dreams_1.default);
                    app.use('/api/get-dream', get_dream_1.default);
                    app.use('/api/get-dream-by-id', get_dream_by_id_1.default);
                    // Fuse dreams route is handled inline above
                    app.use('/api/fusions', fusions_1.default);
                    app.use('/api/claim-fusion', claim_fusion_1.default);
                    app.use('/api/dreams', dreams_2.default);
                    app.use('/api/wallet-scoring', wallet_scoring_1.default);
                    app.use('/api/echo-score', echo_score_1.default);
                    app.use('/api', mint_dream_token_1.default);
                    app.use('/api', mint_dream_1.default);
                    // fuseDreamsRouter removed as route is handled inline
                    app.use('/api', my_dreams_1.default);
                    app.use('/api/remix-dream', remix_dream_1.default);
                    app.use('/api/dream-titles', dream_titles_1.default);
                    app.use('/api/save-dream', save_dream_1.default);
                    app.use('/api', save_dream_1.default);
                    app.use(evolution_vault_1.default);
                    app.use(ai_surgeon_1.default);
                    app.use(defense_network_1.default);
                    app.use(evolution_engine_1.default);
                    app.use('/api/base-health', base_health_1.default);
                    // OPS Contract routes
                    app.use('/api/ops', ops_1.default);
                    app.use('/api/website-designer', website_designer_1.default);
                    app.use('/api/deployment', deployment_1.default);
                    app.use('/api/domains', domain_issuance_1.default);
                    app.use('/api/passports', passports_1.default);
                    app.use('/api/citizens', citizens_1.default);
                    app.use('/api/register-agents', register_agents_1.default);
                    app.use('/api/aws', aws_1.default);
                    app.use('/api/google-cloud', google_cloud_1.default);
                    // Admin wallets routes
                    app.use('/api/admin-wallets', admin_wallets_1.default);
                    // Bounty endpoints
                    app.post('/api/post-bounty', post_bounty_1.default);
                    app.get('/api/get-bounties', get_bounties_1.default);
                    app.post('/api/join-dream-team', join_dream_team_1.default);
                    app.get('/api/get-dream-forks', get_dream_forks_1.default);
                    app.get('/api/get-forks-by-bounty', get_dream_forks_1.default);
                    app.get('/api/dreams/cloud/:slug', get_dreams_by_cloud_1.default);
                    app.get('/api/dreams/all', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var mockDreams;
                        return __generator(this, function (_a) {
                            try {
                                mockDreams = [
                                    { id: 'ai-1', title: 'Neural Network Vision', dreamCloud: 'ai' },
                                    { id: 'defi-1', title: 'Decentralized Exchange Protocol', dreamCloud: 'defi' },
                                    { id: 'gaming-1', title: 'Blockchain Gaming World', dreamCloud: 'gaming' },
                                    { id: 'zksync-1', title: 'Zero Knowledge Privacy Tool', dreamCloud: 'zksync' },
                                    { id: 'desci-1', title: 'Decentralized Research Platform', dreamCloud: 'desci' },
                                    { id: 'memes-1', title: 'Community Meme Generator', dreamCloud: 'memes' },
                                    { id: 'tools-1', title: 'Developer Productivity Suite', dreamCloud: 'tools' },
                                    { id: 'social-1', title: 'Decentralized Social Network', dreamCloud: 'social' },
                                    { id: 'art-1', title: 'NFT Art Marketplace', dreamCloud: 'art' }
                                ];
                                res.json(mockDreams);
                            }
                            catch (error) {
                                res.status(500).json({ error: error.message });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    app.post('/api/fuse-dreams', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, dreamIds, dreamBody, currentWallet, bountyToken, bountyAmount, fusionBoost, response, data, dreams, fusedDream, newDream, error_100;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 4, , 5]);
                                    _a = req.body, dreamIds = _a.dreamIds, dreamBody = _a.dreamBody, currentWallet = _a.currentWallet, bountyToken = _a.bountyToken, bountyAmount = _a.bountyAmount, fusionBoost = _a.fusionBoost;
                                    return [4 /*yield*/, fetch("http://localhost:5000/api/fuse/".concat(dreamIds.join(',')))];
                                case 1:
                                    response = _b.sent();
                                    return [4 /*yield*/, response.json()];
                                case 2:
                                    data = _b.sent();
                                    dreams = data.dreams;
                                    return [4 /*yield*/, db_1.mongoDb.collection('dreams').insertOne({
                                            title: 'Fused Dream',
                                            body: dreamBody,
                                            fusedFrom: dreams.map(function (d) { return d.id; }),
                                            creator: currentWallet,
                                            bountyToken: bountyToken,
                                            bountyAmount: bountyAmount, // Store in raw token units
                                            fusionBoost: fusionBoost,
                                            timestamp: Date.now()
                                        })];
                                case 3:
                                    fusedDream = _b.sent();
                                    newDream = {
                                        id: fusedDream.insertedId,
                                        title: 'Fused Dream',
                                        body: dreamBody,
                                        fusedFrom: dreams.map(function (d) { return d.id; }),
                                        creator: currentWallet,
                                        bountyToken: bountyToken,
                                        bountyAmount: bountyAmount,
                                        fusionBoost: fusionBoost,
                                        timestamp: Date.now()
                                    };
                                    console.log('Created fusion:', newDream);
                                    res.json({ success: true, fusedDream: newDream });
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_100 = _b.sent();
                                    console.error('Fusion error:', error_100);
                                    res.status(500).json({ error: error_100.message });
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/fuse/:ids', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var ids_1, allDreams, dreams;
                        return __generator(this, function (_a) {
                            try {
                                ids_1 = req.params.ids.split(',');
                                allDreams = [
                                    { id: 'ai-1', title: 'Neural Network Vision', dreamCloud: 'ai' },
                                    { id: 'defi-1', title: 'Decentralized Exchange Protocol', dreamCloud: 'defi' },
                                    { id: 'gaming-1', title: 'Blockchain Gaming World', dreamCloud: 'gaming' },
                                    { id: 'zksync-1', title: 'Zero Knowledge Privacy Tool', dreamCloud: 'zksync' },
                                    { id: 'desci-1', title: 'Decentralized Research Platform', dreamCloud: 'desci' },
                                    { id: 'memes-1', title: 'Community Meme Generator', dreamCloud: 'memes' },
                                    { id: 'tools-1', title: 'Developer Productivity Suite', dreamCloud: 'tools' },
                                    { id: 'social-1', title: 'Decentralized Social Network', dreamCloud: 'social' },
                                    { id: 'art-1', title: 'NFT Art Marketplace', dreamCloud: 'art' }
                                ];
                                dreams = allDreams.filter(function (d) { return ids_1.includes(d.id); });
                                res.json({ dreams: dreams });
                            }
                            catch (error) {
                                res.status(500).json({ error: error.message });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // Migration endpoint
                    app.post('/api/migrate-dream-cloud', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var migrateDreamCloud, result, error_101;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('./migrate-dream-cloud'); })];
                                case 1:
                                    migrateDreamCloud = (_a.sent()).migrateDreamCloud;
                                    return [4 /*yield*/, migrateDreamCloud()];
                                case 2:
                                    result = _a.sent();
                                    res.json(result);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_101 = _a.sent();
                                    res.status(500).json({ success: false, error: error_101.message });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // DreamNode Registry API endpoints
                    app.get('/api/nodes', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var nodeRegistry, FLUTTERBY_NODE, DEFI_LAB_NODE, publicNodes, error_102;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/registry/NodeRegistry.js'); })];
                                case 1:
                                    nodeRegistry = (_a.sent()).nodeRegistry;
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/flutterbye/node.config.js'); })];
                                case 2:
                                    FLUTTERBY_NODE = (_a.sent()).FLUTTERBY_NODE;
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/defi-lab/node.config.js'); })];
                                case 3:
                                    DEFI_LAB_NODE = (_a.sent()).DEFI_LAB_NODE;
                                    // Register nodes if not already registered
                                    if (!nodeRegistry.getNode('flutterbye')) {
                                        nodeRegistry.registerNode(FLUTTERBY_NODE);
                                    }
                                    if (!nodeRegistry.getNode('defi-lab')) {
                                        nodeRegistry.registerNode(DEFI_LAB_NODE);
                                    }
                                    publicNodes = nodeRegistry.listPublicNodes();
                                    res.json({
                                        success: true,
                                        nodes: publicNodes,
                                        totalCount: publicNodes.length,
                                        dreamNodeInterface: "Implemented according to DreamNode interface specification"
                                    });
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_102 = _a.sent();
                                    res.status(500).json({
                                        error: 'Failed to fetch nodes',
                                        details: error_102 instanceof Error ? error_102.message : 'Unknown error'
                                    });
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/nodes/:nodeId', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var nodeRegistry, FLUTTERBY_NODE, DEFI_LAB_NODE, nodeId, node, usageStats, error_103;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/registry/NodeRegistry.js'); })];
                                case 1:
                                    nodeRegistry = (_a.sent()).nodeRegistry;
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/flutterbye/node.config.js'); })];
                                case 2:
                                    FLUTTERBY_NODE = (_a.sent()).FLUTTERBY_NODE;
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../dreamnodes/defi-lab/node.config.js'); })];
                                case 3:
                                    DEFI_LAB_NODE = (_a.sent()).DEFI_LAB_NODE;
                                    // Register nodes if not already registered
                                    if (!nodeRegistry.getNode('flutterbye')) {
                                        nodeRegistry.registerNode(FLUTTERBY_NODE);
                                    }
                                    if (!nodeRegistry.getNode('defi-lab')) {
                                        nodeRegistry.registerNode(DEFI_LAB_NODE);
                                    }
                                    nodeId = req.params.nodeId;
                                    node = nodeRegistry.getNode(nodeId);
                                    if (!node) {
                                        return [2 /*return*/, res.status(404).json({
                                                error: 'Node not found',
                                                nodeId: nodeId
                                            })];
                                    }
                                    usageStats = nodeRegistry.getUsageStats(nodeId);
                                    res.json({
                                        success: true,
                                        node: node,
                                        usageStats: usageStats,
                                        dreamNodeInterface: "Full DreamNode specification implemented"
                                    });
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_103 = _a.sent();
                                    res.status(500).json({
                                        error: 'Failed to fetch node details',
                                        details: error_103 instanceof Error ? error_103.message : 'Unknown error'
                                    });
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('./routes/ecosystem-dashboard.js'); })];
                case 2:
                    ecosystemDashboardRoutes = _a.sent();
                    app.use('/api/ecosystem', ecosystemDashboardRoutes.default);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('./routes/ecosystem-commands.js'); })];
                case 3:
                    ecosystemCommandsRoutes = _a.sent();
                    app.use('/api/ecosystem', ecosystemCommandsRoutes.default);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('./routes/dream-remix.js'); })];
                case 4:
                    dreamRemixRoutes = _a.sent();
                    app.use('/api/dreams', dreamRemixRoutes.default);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('./routes/dream-cloud.js'); })];
                case 5:
                    dreamCloudRoutes = _a.sent();
                    app.use('/api/dream-clouds', dreamCloudRoutes.default);
                    app.use('/api/dreams', dreamCloudRoutes.default);
                    // Blessing system routes
                    app.post("/api/dreams/:dreamId/bless", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var dreamId, _a, wallet, message, amount, dream, blessing, currentBlessings, updatedBlessings, error_104;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 3, , 4]);
                                    dreamId = req.params.dreamId;
                                    _a = req.body, wallet = _a.wallet, message = _a.message, amount = _a.amount;
                                    return [4 /*yield*/, storage_1.storage.getDream(dreamId)];
                                case 1:
                                    dream = _b.sent();
                                    if (!dream) {
                                        return [2 /*return*/, res.status(404).json({ error: "Dream not found" })];
                                    }
                                    blessing = {
                                        wallet: wallet,
                                        message: message || "Blessed with positive energy ✨",
                                        amount: amount || 1,
                                        timestamp: Date.now()
                                    };
                                    currentBlessings = dream.blessings || [];
                                    updatedBlessings = __spreadArray(__spreadArray([], currentBlessings, true), [blessing], false);
                                    return [4 /*yield*/, storage_1.storage.updateDream(dreamId, {
                                            blessings: updatedBlessings,
                                            blessCount: updatedBlessings.length,
                                            xp: (dream.xp || 0) + (amount * 10) // 10 XP per SHEEP blessed
                                        })];
                                case 2:
                                    _b.sent();
                                    res.json({ success: true, blessing: blessing });
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_104 = _b.sent();
                                    res.status(500).json({ error: error_104.message });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get("/api/dreams/:dreamId/blessings", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var dreamId, dream, error_105;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    dreamId = req.params.dreamId;
                                    return [4 /*yield*/, storage_1.storage.getDream(dreamId)];
                                case 1:
                                    dream = _a.sent();
                                    if (!dream) {
                                        return [2 /*return*/, res.status(404).json({ error: "Dream not found" })];
                                    }
                                    res.json(dream.blessings || []);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_105 = _a.sent();
                                    res.status(500).json({ error: error_105.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Evolution system routes
                    app.post("/api/dreams/:dreamId/evolve", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var dreamId, evolutionType, dream, error_106;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    dreamId = req.params.dreamId;
                                    evolutionType = req.body.evolutionType;
                                    return [4 /*yield*/, storage_1.storage.getDream(dreamId)];
                                case 1:
                                    dream = _a.sent();
                                    if (!dream) {
                                        return [2 /*return*/, res.status(404).json({ error: "Dream not found" })];
                                    }
                                    if (dream.level < 3) {
                                        return [2 /*return*/, res.status(400).json({ error: "Dream must be level 3+ to evolve" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.updateDream(dreamId, {
                                            evolved: true,
                                            evolutionType: evolutionType,
                                            xp: (dream.xp || 0) + 100 // Evolution bonus
                                        })];
                                case 2:
                                    _a.sent();
                                    res.json({ success: true, evolutionType: evolutionType });
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_106 = _a.sent();
                                    res.status(500).json({ error: error_106.message });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Cloud XP tracking routes
                    app.get("/api/cloud/xp-events/:cloudId?", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var cloudId_1, mockEvents, filteredEvents;
                        return __generator(this, function (_a) {
                            try {
                                cloudId_1 = req.params.cloudId;
                                mockEvents = [
                                    {
                                        id: "evt_1",
                                        type: "remix",
                                        actor: "0xabc123",
                                        cloudId: cloudId_1 || "defi",
                                        xpGained: 50,
                                        timestamp: Date.now() - 300000,
                                        description: "Remix by 0xabc123 earned +50 XP"
                                    },
                                    {
                                        id: "evt_2",
                                        type: "revival",
                                        actor: "0xdef456",
                                        cloudId: cloudId_1 || "ai",
                                        xpGained: 200,
                                        timestamp: Date.now() - 600000,
                                        description: "Fossil revival boosted cloud by +200 XP"
                                    },
                                    {
                                        id: "evt_3",
                                        type: "blessing",
                                        actor: "0x789xyz",
                                        cloudId: cloudId_1 || "defi",
                                        xpGained: 25,
                                        timestamp: Date.now() - 900000,
                                        description: "Dream blessing contributed +25 XP"
                                    }
                                ];
                                filteredEvents = cloudId_1
                                    ? mockEvents.filter(function (e) { return e.cloudId === cloudId_1; })
                                    : mockEvents;
                                res.json(filteredEvents);
                            }
                            catch (error) {
                                res.status(500).json({ error: error.message });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    app.get("/api/cloud/leaderboard", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, limit, mockClouds, sortedClouds;
                        return __generator(this, function (_b) {
                            try {
                                _a = req.query.limit, limit = _a === void 0 ? 10 : _a;
                                mockClouds = [
                                    {
                                        id: "defi",
                                        name: "DeFi Lab",
                                        xp: 2450,
                                        level: 4,
                                        members: 23,
                                        recentActivity: 5
                                    },
                                    {
                                        id: "ai",
                                        name: "NeuroBloom",
                                        xp: 1890,
                                        level: 3,
                                        members: 18,
                                        recentActivity: 8
                                    },
                                    {
                                        id: "gaming",
                                        name: "GameForge",
                                        xp: 1650,
                                        level: 3,
                                        members: 31,
                                        recentActivity: 2
                                    },
                                    {
                                        id: "zksync",
                                        name: "ZK Sanctuary",
                                        xp: 1200,
                                        level: 2,
                                        members: 12,
                                        recentActivity: 0
                                    },
                                    {
                                        id: "memes",
                                        name: "Meme Factory",
                                        xp: 980,
                                        level: 2,
                                        members: 45,
                                        recentActivity: 12
                                    }
                                ];
                                sortedClouds = mockClouds
                                    .sort(function (a, b) { return b.xp - a.xp; })
                                    .slice(0, Number(limit));
                                res.json(sortedClouds);
                            }
                            catch (error) {
                                res.status(500).json({ error: error.message });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // Nightmare claiming routes
                    app.post("/api/dreams/:dreamId/claim-nightmare", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var dreamId, _a, wallet, claimType, reviveBonus, dream, bountyAmount, bountyToken, error_107;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 3, , 4]);
                                    dreamId = req.params.dreamId;
                                    _a = req.body, wallet = _a.wallet, claimType = _a.claimType, reviveBonus = _a.reviveBonus;
                                    return [4 /*yield*/, storage_1.storage.getDream(dreamId)];
                                case 1:
                                    dream = _b.sent();
                                    if (!dream) {
                                        return [2 /*return*/, res.status(404).json({ error: "Dream not found" })];
                                    }
                                    // Check if dream is actually a nightmare
                                    if (dream.status !== 'nightmare' && !dream.isNightmare) {
                                        return [2 /*return*/, res.status(400).json({ error: "Dream is not in nightmare status" })];
                                    }
                                    bountyAmount = dream.bountyAmount || '500';
                                    bountyToken = dream.bountyToken || 'SHEEP';
                                    return [4 /*yield*/, storage_1.storage.updateDream(dreamId, {
                                            status: 'Draft', // Restore from nightmare
                                            isNightmare: false,
                                            evolved: false,
                                            xp: (dream.xp || 0) + 150, // Bonus XP for revival
                                            level: Math.max(1, dream.level || 1),
                                            nightmareEscapes: (dream.nightmareEscapes || 0) + 1
                                        })];
                                case 2:
                                    _b.sent();
                                    res.json({
                                        success: true,
                                        bountyAmount: parseFloat(bountyAmount),
                                        bountyToken: bountyToken,
                                        xpBonus: 150,
                                        message: "Nightmare successfully claimed and dream revived!"
                                    });
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_107 = _b.sent();
                                    res.status(500).json({ error: error_107.message });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post("/api/dreams/:dreamId/revive", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var dreamId, _a, wallet, method, message, bountyAmount, bountyToken, dream, methodBonuses, bonus, error_108;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 3, , 4]);
                                    dreamId = req.params.dreamId;
                                    _a = req.body, wallet = _a.wallet, method = _a.method, message = _a.message, bountyAmount = _a.bountyAmount, bountyToken = _a.bountyToken;
                                    return [4 /*yield*/, storage_1.storage.getDream(dreamId)];
                                case 1:
                                    dream = _b.sent();
                                    if (!dream) {
                                        return [2 /*return*/, res.status(404).json({ error: "Dream not found" })];
                                    }
                                    methodBonuses = {
                                        blessing: { xp: 100, cost: 1 },
                                        community: { xp: 200, cost: 0 },
                                        evolution: { xp: 300, cost: 5 }
                                    };
                                    bonus = methodBonuses[method] || methodBonuses.blessing;
                                    return [4 /*yield*/, storage_1.storage.updateDream(dreamId, {
                                            status: 'Draft',
                                            isNightmare: false,
                                            evolved: method === 'evolution',
                                            evolutionType: method === 'evolution' ? 'Shadow' : dream.evolutionType,
                                            xp: (dream.xp || 0) + bonus.xp,
                                            level: Math.max(1, dream.level || 1),
                                            nightmareEscapes: (dream.nightmareEscapes || 0) + 1,
                                            blessCount: method === 'blessing' ? (dream.blessCount || 0) + 1 : dream.blessCount
                                        })];
                                case 2:
                                    _b.sent();
                                    res.json({
                                        success: true,
                                        method: method,
                                        bountyAmount: bountyAmount,
                                        bountyToken: bountyToken,
                                        xpBonus: bonus.xp,
                                        evolved: method === 'evolution',
                                        message: "Dream successfully revived using ".concat(method, " method!")
                                    });
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_108 = _b.sent();
                                    res.status(500).json({ error: error_108.message });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Dream remixing endpoint
                    app.post("/api/dreams/:dreamId/remix", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var dreamId, _a, userId, title, tags, content, token, remixData, newDream, error_109;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    dreamId = req.params.dreamId;
                                    _a = req.body, userId = _a.userId, title = _a.title, tags = _a.tags, content = _a.content, token = _a.token;
                                    remixData = {
                                        wallet: userId || "anonymous",
                                        title: title || "Remix of ".concat(dreamId),
                                        description: content || "A remix of dream ".concat(dreamId),
                                        tags: tags || ["remix"],
                                        urgency: 5,
                                        origin: "remix",
                                        forkedFrom: dreamId
                                    };
                                    return [4 /*yield*/, storage_1.storage.createDream(remixData)];
                                case 1:
                                    newDream = _b.sent();
                                    res.json(newDream);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_109 = _b.sent();
                                    console.error("Error creating remix:", error_109);
                                    res.status(500).json({ error: "Failed to create remix" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Dream evolution endpoint - returns hierarchical tree structure
                    app.get("/api/dreams/:id/evolution", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, dream, buildDreamTree_1, evolutionTree, error_110;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    id = req.params.id;
                                    return [4 /*yield*/, storage_1.storage.getDream(id)];
                                case 1:
                                    dream = _a.sent();
                                    if (!dream) {
                                        return [2 /*return*/, res.status(404).json({ error: "Dream not found" })];
                                    }
                                    buildDreamTree_1 = function (dreamId) { return __awaiter(_this, void 0, void 0, function () {
                                        var currentDream, allDreams, children, childrenTrees;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, storage_1.storage.getDream(dreamId)];
                                                case 1:
                                                    currentDream = _a.sent();
                                                    if (!currentDream)
                                                        return [2 /*return*/, null];
                                                    return [4 /*yield*/, storage_1.storage.getDreams()];
                                                case 2:
                                                    allDreams = _a.sent();
                                                    children = allDreams.filter(function (d) { return d.forkedFrom === dreamId; });
                                                    return [4 /*yield*/, Promise.all(children.map(function (child) { return buildDreamTree_1(child.id); }))];
                                                case 3:
                                                    childrenTrees = _a.sent();
                                                    return [2 /*return*/, {
                                                            id: currentDream.id,
                                                            title: currentDream.title || currentDream.name || "Untitled Dream",
                                                            children: childrenTrees.filter(Boolean)
                                                        }];
                                            }
                                        });
                                    }); };
                                    return [4 /*yield*/, buildDreamTree_1(id)];
                                case 2:
                                    evolutionTree = _a.sent();
                                    res.json(evolutionTree);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_110 = _a.sent();
                                    console.error("Error fetching evolution tree:", error_110);
                                    res.status(500).json({ error: "Failed to fetch evolution tree" });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Enhanced evolution tree with filtering
                    app.get("/api/evolution-tree", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, trust, bounty, collapse_1, allDreams_1, filteredDreams, rootDreams, dreamTrees, error_111;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.query, trust = _a.trust, bounty = _a.bounty, collapse_1 = _a.collapse;
                                    console.log("Evolution tree query params:", { trust: trust, bounty: bounty, collapse: collapse_1 });
                                    return [4 /*yield*/, storage_1.storage.getDreams()];
                                case 1:
                                    allDreams_1 = _b.sent();
                                    console.log("Found ".concat(allDreams_1.length, " dreams in storage"));
                                    filteredDreams = allDreams_1;
                                    if (trust === 'high') {
                                        filteredDreams = filteredDreams.filter(function (d) { return (d.trustScore || 50) >= 80; });
                                        console.log("After trust filter: ".concat(filteredDreams.length, " dreams"));
                                    }
                                    if (bounty === 'true') {
                                        filteredDreams = filteredDreams.filter(function (d) { return d.bountyId; });
                                        console.log("After bounty filter: ".concat(filteredDreams.length, " dreams"));
                                    }
                                    rootDreams = filteredDreams.filter(function (d) { return !d.forkedFrom; });
                                    console.log("Root dreams: ".concat(rootDreams.length));
                                    dreamTrees = rootDreams.map(function (rootDream) {
                                        function buildEnhancedTree(dreamId) {
                                            var dream = allDreams_1.find(function (d) { return d.id === dreamId; });
                                            if (!dream)
                                                return null;
                                            var children = allDreams_1.filter(function (d) { return d.forkedFrom === dreamId; });
                                            // Calculate trust level
                                            var trustScore = dream.trustScore || Math.floor(Math.random() * 100);
                                            var trustLevel = trustScore >= 80 ? 'High' : trustScore >= 60 ? 'Medium' : 'Low';
                                            return {
                                                id: dream.id,
                                                title: dream.title || dream.name || "Untitled Dream",
                                                score: dream.score || dream.dreamScore || Math.floor(Math.random() * 100),
                                                remixCount: children.length,
                                                bounties: dream.bountyId ? Math.floor(Math.random() * 5000) : 0,
                                                trustLevel: trustLevel,
                                                children: collapse_1 === 'true' ? [] : children.map(function (child) { return buildEnhancedTree(child.id); }).filter(Boolean)
                                            };
                                        }
                                        return buildEnhancedTree(rootDream.id);
                                    }).filter(Boolean);
                                    console.log("Returning ".concat(dreamTrees.length, " dream trees"));
                                    res.json(dreamTrees);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_111 = _b.sent();
                                    console.error("Error fetching evolution tree:", error_111);
                                    res.status(500).json({ error: "Failed to fetch evolution tree", details: error_111.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Nightmare network endpoint
                    app.post("/api/network/nightmare", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, dreamId, trigger, applyInvertedTrust, activateDecayVisuals, unlockAgents, invertedDreams, decayVisuals, nightmareAgents, error_112;
                        var _this = this;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, dreamId = _a.dreamId, trigger = _a.trigger;
                                    console.log("🌙 Nightmare network activated:", { dreamId: dreamId, trigger: trigger });
                                    applyInvertedTrust = function () { return __awaiter(_this, void 0, void 0, function () {
                                        var allDreams, invertedResults;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, storage_1.storage.getDreams()];
                                                case 1:
                                                    allDreams = _a.sent();
                                                    invertedResults = allDreams.map(function (dream) { return (__assign(__assign({}, dream), { trustScore: 100 - (dream.trustScore || 50), trustLevel: (dream.trustScore || 50) < 20 ? 'High' : (dream.trustScore || 50) < 40 ? 'Medium' : 'Low', isNightmare: true, decayRate: Math.random() * 0.1 + 0.05 // 5-15% decay per cycle
                                                     })); });
                                                    return [2 /*return*/, invertedResults];
                                            }
                                        });
                                    }); };
                                    activateDecayVisuals = function () {
                                        return {
                                            visualEffects: {
                                                backgroundGradient: 'linear-gradient(45deg, #1a0033, #330011)',
                                                glowColor: '#ff0066',
                                                pulseAnimation: 'nightmare-pulse 2s infinite',
                                                borderStyle: 'dashed',
                                                opacityDecay: 0.85
                                            },
                                            animations: {
                                                'nightmare-pulse': {
                                                    '0%': { boxShadow: '0 0 5px #ff0066' },
                                                    '50%': { boxShadow: '0 0 20px #ff0066, 0 0 30px #ff0066' },
                                                    '100%': { boxShadow: '0 0 5px #ff0066' }
                                                }
                                            }
                                        };
                                    };
                                    unlockAgents = function (agentList) {
                                        return agentList.map(function (agent) { return ({
                                            name: agent,
                                            type: 'nightmare',
                                            capabilities: agent === 'SHADE'
                                                ? ['shadow_analysis', 'trust_inversion', 'decay_calculation']
                                                : ['void_processing', 'entropy_management', 'reality_distortion'],
                                            status: 'activated',
                                            unlockTime: new Date().toISOString()
                                        }); });
                                    };
                                    return [4 /*yield*/, applyInvertedTrust()];
                                case 1:
                                    invertedDreams = _b.sent();
                                    decayVisuals = activateDecayVisuals();
                                    nightmareAgents = unlockAgents(['SHADE', 'VOID']);
                                    res.json({
                                        network: 'nightmare',
                                        status: 'activated',
                                        invertedTrustApplied: true,
                                        decayVisualsActive: true,
                                        unlockedAgents: nightmareAgents,
                                        affectedDreams: invertedDreams.length,
                                        effects: {
                                            trustInversion: 'active',
                                            decayVisuals: decayVisuals,
                                            specialAgents: nightmareAgents
                                        },
                                        timestamp: new Date().toISOString()
                                    });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_112 = _b.sent();
                                    console.error("Error activating nightmare network:", error_112);
                                    res.status(500).json({ error: "Failed to activate nightmare network" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Nightmare agent assignment endpoint
                    app.post("/api/nightmare/assign-agent", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, dreamId, agent, assignedBy, validAgents, dream, agentCapabilities, selectedAgent, assignment, nightmareEffects, error_113;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, dreamId = _a.dreamId, agent = _a.agent, assignedBy = _a.assignedBy;
                                    console.log("🌙 Assigning nightmare agent:", { dreamId: dreamId, agent: agent, assignedBy: assignedBy });
                                    validAgents = ["DREAD", "SHADE", "WHISPER", "ECHO", "CRYPT"];
                                    if (!validAgents.includes(agent)) {
                                        return [2 /*return*/, res.status(400).json({ error: "Invalid agent type", validAgents: validAgents })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.getDream(dreamId)];
                                case 1:
                                    dream = _b.sent();
                                    if (!dream) {
                                        return [2 /*return*/, res.status(404).json({ error: "Dream not found" })];
                                    }
                                    agentCapabilities = {
                                        DREAD: {
                                            type: "fear_amplifier",
                                            capabilities: ["anxiety_induction", "terror_projection", "phobia_manifestation"],
                                            powerLevel: 95,
                                            description: "Amplifies fear responses and instills deep psychological dread"
                                        },
                                        SHADE: {
                                            type: "shadow_processor",
                                            capabilities: ["shadow_analysis", "trust_inversion", "decay_calculation", "darkness_manipulation"],
                                            powerLevel: 88,
                                            description: "Processes shadow aspects and inverts trust mechanics"
                                        },
                                        WHISPER: {
                                            type: "mind_infiltrator",
                                            capabilities: ["subconscious_injection", "memory_distortion", "thought_seeding"],
                                            powerLevel: 82,
                                            description: "Infiltrates minds through subtle whispers and thought manipulation"
                                        },
                                        ECHO: {
                                            type: "reality_distorter",
                                            capabilities: ["perception_warping", "reality_echoing", "dimensional_bleeding"],
                                            powerLevel: 90,
                                            description: "Creates echoing distortions in perceived reality"
                                        },
                                        CRYPT: {
                                            type: "entropy_guardian",
                                            capabilities: ["data_corruption", "memory_encryption", "soul_binding"],
                                            powerLevel: 93,
                                            description: "Guards and corrupts data with cryptographic entropy"
                                        }
                                    };
                                    selectedAgent = agentCapabilities[agent];
                                    assignment = {
                                        dreamId: dreamId,
                                        agentName: agent,
                                        agentType: selectedAgent.type,
                                        capabilities: selectedAgent.capabilities,
                                        powerLevel: selectedAgent.powerLevel,
                                        assignedBy: assignedBy,
                                        assignedAt: new Date().toISOString(),
                                        status: "active",
                                        corruptionLevel: Math.floor(Math.random() * 50) + 50, // 50-100% corruption
                                        influenceRadius: Math.floor(Math.random() * 1000) + 500, // 500-1500 units
                                        description: selectedAgent.description
                                    };
                                    nightmareEffects = {
                                        trustScoreModification: -25, // Reduce trust by 25 points
                                        decayRateIncrease: 0.15, // Increase decay by 15%
                                        corruptionSpread: true,
                                        visualDistortions: {
                                            glitchIntensity: Math.random() * 0.8 + 0.2,
                                            colorShift: agent === "DREAD" ? "red" : agent === "SHADE" ? "purple" : "gray",
                                            pulseFrequency: selectedAgent.powerLevel / 10
                                        }
                                    };
                                    res.json({
                                        success: true,
                                        assignment: assignment,
                                        effects: nightmareEffects,
                                        message: "".concat(agent, " has been assigned to dream ").concat(dreamId),
                                        corruptionWarning: assignment.corruptionLevel > 80 ? "CRITICAL CORRUPTION LEVEL" : null,
                                        timestamp: new Date().toISOString()
                                    });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_113 = _b.sent();
                                    console.error("Error assigning nightmare agent:", error_113);
                                    res.status(500).json({ error: "Failed to assign nightmare agent", details: error_113.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Nightmare agent tracking endpoint
                    app.get("/api/nightmare/agents/tracking", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var activeAgents;
                        return __generator(this, function (_a) {
                            try {
                                activeAgents = [
                                    {
                                        dreamId: "infected_dream_123",
                                        agent: "WHISPER",
                                        status: "tracking",
                                        lastAction: "Analyzed source infection",
                                        powerLevel: 82,
                                        corruptionLevel: 76,
                                        influenceRadius: 1200,
                                        assignedBy: "0xYourWallet",
                                        assignedAt: "2025-01-04T21:45:00Z",
                                        log: [
                                            { timestamp: "2025-01-04T21:45:00Z", action: "Agent WHISPER activated", severity: "info" },
                                            { timestamp: "2025-01-04T21:45:15Z", action: "Initiated subconscious injection protocol", severity: "warning" },
                                            { timestamp: "2025-01-04T21:45:30Z", action: "Memory distortion field established", severity: "critical" },
                                            { timestamp: "2025-01-04T21:46:00Z", action: "Analyzed source infection patterns", severity: "info" },
                                            { timestamp: "2025-01-04T21:46:30Z", action: "Thought seeding commenced in dream core", severity: "warning" }
                                        ]
                                    },
                                    {
                                        dreamId: "dark_vision_456",
                                        agent: "DREAD",
                                        status: "amplifying",
                                        lastAction: "Terror projection at 95% intensity",
                                        powerLevel: 95,
                                        corruptionLevel: 89,
                                        influenceRadius: 1800,
                                        assignedBy: "0xDarkWallet",
                                        assignedAt: "2025-01-04T21:30:00Z",
                                        log: [
                                            { timestamp: "2025-01-04T21:30:00Z", action: "Agent DREAD deployed", severity: "info" },
                                            { timestamp: "2025-01-04T21:30:45Z", action: "Anxiety induction protocols active", severity: "warning" },
                                            { timestamp: "2025-01-04T21:31:30Z", action: "Phobia manifestation successful", severity: "critical" },
                                            { timestamp: "2025-01-04T21:32:00Z", action: "Terror projection at 95% intensity", severity: "critical" }
                                        ]
                                    },
                                    {
                                        dreamId: "shadow_realm_789",
                                        agent: "SHADE",
                                        status: "processing",
                                        lastAction: "Trust inversion cycle completed",
                                        powerLevel: 88,
                                        corruptionLevel: 71,
                                        influenceRadius: 950,
                                        assignedBy: "0xShadowKeeper",
                                        assignedAt: "2025-01-04T21:20:00Z",
                                        log: [
                                            { timestamp: "2025-01-04T21:20:00Z", action: "Agent SHADE initialized", severity: "info" },
                                            { timestamp: "2025-01-04T21:21:00Z", action: "Shadow analysis commenced", severity: "info" },
                                            { timestamp: "2025-01-04T21:22:30Z", action: "Trust metrics inverted successfully", severity: "warning" },
                                            { timestamp: "2025-01-04T21:23:45Z", action: "Decay calculation algorithms deployed", severity: "warning" },
                                            { timestamp: "2025-01-04T21:25:00Z", action: "Trust inversion cycle completed", severity: "info" }
                                        ]
                                    }
                                ];
                                res.json(activeAgents);
                            }
                            catch (error) {
                                console.error("Error fetching nightmare agent tracking:", error);
                                res.status(500).json({ error: "Failed to fetch agent tracking data" });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // Individual agent status endpoint
                    app.get("/api/nightmare/agents/:dreamId/:agent", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, dreamId, agent, agentStatus;
                        return __generator(this, function (_b) {
                            try {
                                _a = req.params, dreamId = _a.dreamId, agent = _a.agent;
                                agentStatus = {
                                    dreamId: dreamId,
                                    agent: agent.toUpperCase(),
                                    status: "active",
                                    lastAction: "".concat(agent, " performing specialized operations"),
                                    powerLevel: agent === "DREAD" ? 95 : agent === "CRYPT" ? 93 : agent === "ECHO" ? 90 : agent === "SHADE" ? 88 : 82,
                                    corruptionLevel: Math.floor(Math.random() * 40) + 60,
                                    influenceRadius: Math.floor(Math.random() * 1000) + 500,
                                    operations: {
                                        totalActions: Math.floor(Math.random() * 50) + 10,
                                        successRate: (Math.random() * 0.3 + 0.7) * 100, // 70-100%
                                        corruptionSpread: Math.floor(Math.random() * 20) + 5,
                                        resistanceEncountered: Math.random() > 0.7
                                    },
                                    nextAction: "Continue ".concat(agent.toLowerCase(), " protocol execution"),
                                    estimatedCompletion: new Date(Date.now() + Math.random() * 3600000).toISOString()
                                };
                                res.json(agentStatus);
                            }
                            catch (error) {
                                console.error("Error fetching individual agent status:", error);
                                res.status(500).json({ error: "Failed to fetch agent status" });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // Log nightmare agent actions
                    app.post("/api/nightmare/agents/log", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, dreamId, agent, action, timestamp, logEntry;
                        return __generator(this, function (_b) {
                            try {
                                _a = req.body, dreamId = _a.dreamId, agent = _a.agent, action = _a.action, timestamp = _a.timestamp;
                                console.log("🌙 Logging agent action:", { dreamId: dreamId, agent: agent, action: action, timestamp: timestamp });
                                logEntry = {
                                    dreamId: dreamId,
                                    agent: agent,
                                    action: action,
                                    timestamp: timestamp ? new Date(timestamp * 1000).toISOString() : new Date().toISOString(),
                                    severity: action.includes("neutralizing") ? "critical" : action.includes("Detected") ? "warning" : "info",
                                    loggedAt: new Date().toISOString()
                                };
                                // Simulate successful logging
                                res.json({
                                    success: true,
                                    logEntry: logEntry,
                                    message: "Action logged for ".concat(agent, " on dream ").concat(dreamId),
                                    totalLogs: Math.floor(Math.random() * 20) + 5
                                });
                            }
                            catch (error) {
                                console.error("Error logging agent action:", error);
                                res.status(500).json({ error: "Failed to log agent action" });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // Resolve infected dreams
                    app.post("/api/nightmare/resolve", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, dreamId, resolvedBy, resolution, resolutionTypes, resolutionData, resolutionRecord;
                        return __generator(this, function (_b) {
                            try {
                                _a = req.body, dreamId = _a.dreamId, resolvedBy = _a.resolvedBy, resolution = _a.resolution;
                                console.log("🌙 Resolving infected dream:", { dreamId: dreamId, resolvedBy: resolvedBy, resolution: resolution });
                                resolutionTypes = {
                                    transmuted: {
                                        description: "Dream corruption transmuted into pure energy",
                                        effect: "Nightmare agents neutralized, trust restored",
                                        reward: "50 CORE tokens + XP boost"
                                    },
                                    purified: {
                                        description: "Dream cleansed of all nightmare influences",
                                        effect: "Full trust restoration, enhanced dream score",
                                        reward: "75 CORE tokens + Elite status"
                                    },
                                    contained: {
                                        description: "Nightmare influence contained but not eliminated",
                                        effect: "Partial trust restoration, ongoing monitoring required",
                                        reward: "25 CORE tokens"
                                    }
                                };
                                resolutionData = resolutionTypes[resolution] || resolutionTypes.transmuted;
                                resolutionRecord = {
                                    dreamId: dreamId,
                                    resolvedBy: resolvedBy,
                                    resolution: resolution,
                                    resolvedAt: new Date().toISOString(),
                                    description: resolutionData.description,
                                    effect: resolutionData.effect,
                                    reward: resolutionData.reward,
                                    previousCorruption: Math.floor(Math.random() * 40) + 60,
                                    finalCorruption: resolution === "transmuted" ? 0 : resolution === "purified" ? 0 : 15,
                                    agentsAffected: ["WHISPER", "SHADE", "DREAD"].slice(0, Math.floor(Math.random() * 3) + 1)
                                };
                                res.json({
                                    success: true,
                                    resolution: resolutionRecord,
                                    message: "Dream ".concat(dreamId, " successfully ").concat(resolution),
                                    trustRestored: resolution === "transmuted" || resolution === "purified",
                                    timestamp: new Date().toISOString()
                                });
                            }
                            catch (error) {
                                console.error("Error resolving infected dream:", error);
                                res.status(500).json({ error: "Failed to resolve infected dream" });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // Dream remix v2 submission endpoint  
                    app.post("/api/dreams/remix-v2", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, remixer, title, description, tags, type, remixTypes, remixData, remixRecord;
                        return __generator(this, function (_b) {
                            try {
                                _a = req.body, remixer = _a.remixer, title = _a.title, description = _a.description, tags = _a.tags, type = _a.type;
                                console.log("🎨 Processing dream remix v2:", { remixer: remixer, title: title, type: type });
                                remixTypes = {
                                    "Reimagine": {
                                        description: "Complete conceptual transformation",
                                        bonusMultiplier: 2.5,
                                        requiredTrust: 75
                                    },
                                    "Enhance": {
                                        description: "Amplified original vision with new elements",
                                        bonusMultiplier: 1.8,
                                        requiredTrust: 60
                                    },
                                    "Fusion": {
                                        description: "Merged with complementary dream concepts",
                                        bonusMultiplier: 3.0,
                                        requiredTrust: 85
                                    }
                                };
                                remixData = remixTypes[type] || remixTypes.Reimagine;
                                remixRecord = {
                                    id: "remix-".concat(Date.now()),
                                    originalDreamId: "dream-".concat(Math.floor(Math.random() * 1000)),
                                    remixer: remixer,
                                    title: title,
                                    description: description,
                                    tags: tags,
                                    type: type,
                                    remixData: remixData,
                                    submittedAt: new Date().toISOString(),
                                    status: "pending_review",
                                    similarityScore: Math.floor(Math.random() * 30) + 20, // 20-50% similarity
                                    innovationScore: Math.floor(Math.random() * 40) + 60, // 60-100% innovation
                                    trustScore: Math.floor(Math.random() * 25) + 75, // 75-100% trust
                                    expectedReward: {
                                        baseCORE: 25,
                                        bonusCORE: Math.floor(25 * remixData.bonusMultiplier),
                                        XPBoost: type === "Fusion" ? "Elite" : "Standard",
                                        specialBadge: type === "Reimagine" ? "Visionary" : type === "Fusion" ? "Architect" : "Enhancer"
                                    },
                                    reviewCriteria: {
                                        originalityCheck: "pending",
                                        trustVerification: "pending",
                                        communityApproval: "pending",
                                        agentValidation: "pending"
                                    }
                                };
                                res.json({
                                    success: true,
                                    remix: remixRecord,
                                    message: "Dream remix \"".concat(title, "\" submitted successfully"),
                                    nextSteps: [
                                        "Originality verification in progress",
                                        "Trust score validation",
                                        "Community review queue",
                                        "Agent-based quality assessment"
                                    ],
                                    estimatedReview: "24-48 hours",
                                    timestamp: new Date().toISOString()
                                });
                            }
                            catch (error) {
                                console.error("Error processing dream remix:", error);
                                res.status(500).json({ error: "Failed to process dream remix" });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // Dream remix tracking endpoint
                    app.get("/api/dreams/remix/tracking/:remixId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var remixId, trackingData;
                        return __generator(this, function (_a) {
                            try {
                                remixId = req.params.remixId;
                                trackingData = {
                                    remixId: remixId,
                                    currentStage: "community_review",
                                    progress: 65,
                                    stages: [
                                        { name: "submission", status: "completed", completedAt: "2025-01-04T23:00:00Z" },
                                        { name: "originality_check", status: "completed", completedAt: "2025-01-04T23:15:00Z" },
                                        { name: "trust_verification", status: "completed", completedAt: "2025-01-04T23:30:00Z" },
                                        { name: "community_review", status: "in_progress", startedAt: "2025-01-04T23:45:00Z" },
                                        { name: "agent_validation", status: "pending", estimatedStart: "2025-01-05T12:00:00Z" },
                                        { name: "final_approval", status: "pending", estimatedStart: "2025-01-05T18:00:00Z" }
                                    ],
                                    communityVotes: {
                                        positive: 23,
                                        negative: 4,
                                        neutral: 8,
                                        totalVoters: 35
                                    },
                                    agentFeedback: {
                                        LUCID: { status: "pending", estimatedCompletion: "2025-01-05T14:00:00Z" },
                                        CANVAS: { status: "pending", estimatedCompletion: "2025-01-05T15:00:00Z" },
                                        ROOT: { status: "pending", estimatedCompletion: "2025-01-05T16:00:00Z" }
                                    },
                                    estimatedCompletion: "2025-01-05T20:00:00Z"
                                };
                                res.json(trackingData);
                            }
                            catch (error) {
                                console.error("Error fetching remix tracking:", error);
                                res.status(500).json({ error: "Failed to fetch tracking data" });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // Get remix collection endpoint
                    app.get("/api/remixes", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, type_1, tags, originator_1, _b, limit, mockRemixes, filteredRemixes, tagArray_1, sortedRemixes;
                        return __generator(this, function (_c) {
                            try {
                                _a = req.query, type_1 = _a.type, tags = _a.tags, originator_1 = _a.originator, _b = _a.limit, limit = _b === void 0 ? 20 : _b;
                                console.log("🎨 Fetching remix collection with filters:", { type: type_1, tags: tags, originator: originator_1, limit: limit });
                                mockRemixes = [
                                    {
                                        id: "remix456",
                                        title: "Crypto Kindergarten",
                                        type: "Parody",
                                        originator: "0xABCD1234",
                                        tags: ["ai", "satire"],
                                        createdAt: 1724087654,
                                        description: "A satirical take on cryptocurrency education for beginners",
                                        originalDream: "dream-789",
                                        status: "approved",
                                        likes: 45,
                                        remixCount: 3,
                                        bonusMultiplier: 1.5,
                                        healthScore: 92,
                                        emotionTone: "joy"
                                    },
                                    {
                                        id: "remix789",
                                        title: "Neural Symphony",
                                        type: "Enhance",
                                        originator: "0xDEF5678",
                                        tags: ["ai", "music", "neural"],
                                        createdAt: 1724083054,
                                        description: "Enhanced AI-generated music composition with neural networks",
                                        originalDream: "dream-445",
                                        status: "pending",
                                        likes: 23,
                                        remixCount: 1,
                                        bonusMultiplier: 1.8,
                                        healthScore: 67,
                                        emotionTone: "curiosity"
                                    },
                                    {
                                        id: "remix321",
                                        title: "DeFi Revolution 2.0",
                                        type: "Reimagine",
                                        originator: "0xGHI9012",
                                        tags: ["defi", "revolution", "future"],
                                        createdAt: 1724079454,
                                        description: "Complete reimagining of decentralized finance protocols",
                                        originalDream: "dream-112",
                                        status: "approved",
                                        likes: 67,
                                        remixCount: 8,
                                        bonusMultiplier: 2.5,
                                        healthScore: 88,
                                        emotionTone: "ambition"
                                    },
                                    {
                                        id: "remix654",
                                        title: "Gaming Metaverse Fusion",
                                        type: "Fusion",
                                        originator: "0xJKL3456",
                                        tags: ["gaming", "metaverse", "vr"],
                                        createdAt: 1724075854,
                                        description: "Fusion of multiple gaming concepts into unified metaverse",
                                        originalDream: "dream-998",
                                        status: "community_review",
                                        likes: 34,
                                        remixCount: 5,
                                        bonusMultiplier: 3.0,
                                        healthScore: 75,
                                        emotionTone: "love"
                                    },
                                    {
                                        id: "remix987",
                                        title: "Sustainable Tech Parody",
                                        type: "Parody",
                                        originator: "0xMNO7890",
                                        tags: ["sustainability", "tech", "humor"],
                                        createdAt: 1724072254,
                                        description: "Humorous take on green technology adoption",
                                        originalDream: "dream-223",
                                        status: "approved",
                                        likes: 19,
                                        remixCount: 2,
                                        bonusMultiplier: 1.3,
                                        healthScore: 44,
                                        emotionTone: "hope"
                                    }
                                ];
                                filteredRemixes = mockRemixes;
                                // Apply filters
                                if (type_1) {
                                    filteredRemixes = filteredRemixes.filter(function (r) { return r.type.toLowerCase() === type_1.toString().toLowerCase(); });
                                }
                                if (tags) {
                                    tagArray_1 = Array.isArray(tags) ? tags : [tags];
                                    filteredRemixes = filteredRemixes.filter(function (r) {
                                        return tagArray_1.some(function (tag) { return r.tags.includes(tag.toLowerCase()); });
                                    });
                                }
                                if (originator_1) {
                                    filteredRemixes = filteredRemixes.filter(function (r) { return r.originator === originator_1; });
                                }
                                sortedRemixes = filteredRemixes
                                    .sort(function (a, b) { return b.createdAt - a.createdAt; })
                                    .slice(0, Number(limit));
                                res.json({
                                    remixes: sortedRemixes,
                                    total: filteredRemixes.length,
                                    filters: { type: type_1, tags: tags, originator: originator_1, limit: limit },
                                    timestamp: new Date().toISOString()
                                });
                            }
                            catch (error) {
                                console.error("Error fetching remixes:", error);
                                res.status(500).json({ error: "Failed to fetch remixes" });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // GET /api/dreams/:id/insights - Get detailed insights for a specific dream
                    app.get("/api/dreams/:id/insights", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, dreamInsights;
                        return __generator(this, function (_a) {
                            try {
                                id = req.params.id;
                                console.log("\uD83D\uDD0D Fetching insights for dream ".concat(id));
                                dreamInsights = {
                                    dreamId: id,
                                    healthScore: 87,
                                    engagementScore: 91,
                                    remixLineage: [
                                        { id: 'dream001', title: 'Original Spark' },
                                        { id: 'dream045', title: 'Echo Reboot' }
                                    ],
                                    metrics: {
                                        views: 2847,
                                        likes: 523,
                                        remixes: 34,
                                        shares: 156,
                                        comments: 287
                                    },
                                    emotionalProfile: {
                                        primaryEmotion: "ambition",
                                        secondaryEmotions: ["curiosity", "hope"],
                                        intensityScore: 0.84
                                    },
                                    communityImpact: {
                                        influenceRadius: 847,
                                        networkConnections: 23,
                                        crossPlatformMentions: 12,
                                        collaborationRequests: 7
                                    },
                                    evolutionPath: {
                                        generationLevel: 3,
                                        branchingFactor: 5,
                                        divergenceScore: 0.72,
                                        convergencePoints: 2
                                    },
                                    viralityMetrics: {
                                        shareVelocity: 34.2,
                                        peakMomentum: "2024-08-20T15:30:00Z",
                                        currentTrend: "ascending",
                                        saturationLevel: 0.43
                                    }
                                };
                                res.json(dreamInsights);
                            }
                            catch (error) {
                                console.error("❌ Error fetching dream insights:", error);
                                res.status(500).json({ error: "Failed to fetch dream insights" });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // Get individual remix details
                    app.get("/api/remixes/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, remixDetails;
                        return __generator(this, function (_a) {
                            try {
                                id = req.params.id;
                                remixDetails = {
                                    id: id,
                                    title: "Crypto Kindergarten",
                                    type: "Parody",
                                    originator: "0xABCD1234",
                                    tags: ["ai", "satire"],
                                    createdAt: 1724087654,
                                    description: "A satirical take on cryptocurrency education for beginners",
                                    originalDream: {
                                        id: "dream-789",
                                        title: "Advanced Crypto Education",
                                        creator: "0xXYZ9876"
                                    },
                                    content: "Imagine a world where blockchain concepts are taught using colorful blocks and simple games...",
                                    status: "approved",
                                    metrics: {
                                        likes: 45,
                                        dislikes: 3,
                                        remixCount: 3,
                                        views: 234,
                                        shares: 12
                                    },
                                    rewards: {
                                        earned: 67.5,
                                        token: "CORE",
                                        bonusMultiplier: 1.5,
                                        specialBadge: "Satirist"
                                    },
                                    timeline: [
                                        { stage: "submission", timestamp: 1724087654, status: "completed" },
                                        { stage: "originality_check", timestamp: 1724087954, status: "completed" },
                                        { stage: "community_review", timestamp: 1724088254, status: "completed" },
                                        { stage: "approval", timestamp: 1724089554, status: "completed" }
                                    ],
                                    relatedRemixes: [
                                        { id: "remix789", title: "Neural Symphony", type: "Enhance" },
                                        { id: "remix321", title: "DeFi Revolution 2.0", type: "Reimagine" }
                                    ]
                                };
                                res.json(remixDetails);
                            }
                            catch (error) {
                                console.error("Error fetching remix details:", error);
                                res.status(500).json({ error: "Failed to fetch remix details" });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // SMS Reminder API endpoints
                    app.get('/api/get-reminders', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var mockReminders;
                        return __generator(this, function (_a) {
                            try {
                                mockReminders = [
                                    {
                                        id: "rem_001",
                                        dreamId: "dream_viral_startup",
                                        userPhone: "+15551234567",
                                        remindAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                                        status: "pending",
                                        tags: ["top-priority", "viral-potential"],
                                        dream: {
                                            title: "Viral Startup Revolution",
                                            viralityMetrics: { remixCount: 15, shareVelocity: 25, saturationLevel: 0.3, currentTrend: "ascending" },
                                            emotionalProfile: { primaryEmotion: "Excitement", intensity: 0.9 },
                                            remixLineage: [
                                                { id: "dream_startup_base", title: "Original Startup Idea", generation: 1 },
                                                { id: "dream_viral_twist", title: "Viral Marketing Twist", generation: 2 },
                                                { id: "dream_viral_startup", title: "Viral Startup Revolution", generation: 3 }
                                            ]
                                        }
                                    },
                                    {
                                        id: "rem_002",
                                        dreamId: "dream_ai_revolution",
                                        userPhone: "+15551234567",
                                        remindAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
                                        status: "pending",
                                        tags: ["ai-focus", "research"],
                                        dream: {
                                            title: "AI Revolution Blueprint",
                                            viralityMetrics: { remixCount: 8, shareVelocity: 12, saturationLevel: 0.6, currentTrend: "ascending" },
                                            emotionalProfile: { primaryEmotion: "Curiosity", intensity: 0.8 },
                                            remixLineage: [
                                                { id: "dream_ai_base", title: "Basic AI Concepts", generation: 1 },
                                                { id: "dream_ai_revolution", title: "AI Revolution Blueprint", generation: 2 }
                                            ]
                                        }
                                    },
                                    {
                                        id: "rem_003",
                                        dreamId: "dream_saturated_market",
                                        userPhone: "+15551234567",
                                        remindAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
                                        status: "pending",
                                        tags: ["market-analysis", "competitive"],
                                        dream: {
                                            title: "Saturated Market Analysis",
                                            viralityMetrics: { remixCount: 5, shareVelocity: 8, saturationLevel: 0.9, currentTrend: "declining" },
                                            emotionalProfile: { primaryEmotion: "Concern", intensity: 0.7 },
                                            remixLineage: [
                                                { id: "dream_market_base", title: "Market Research Basics", generation: 1 },
                                                { id: "dream_market_trends", title: "Market Trend Analysis", generation: 2 },
                                                { id: "dream_saturated_market", title: "Saturated Market Analysis", generation: 3 }
                                            ]
                                        }
                                    },
                                    {
                                        id: "rem_004",
                                        dreamId: "dream_creative_block",
                                        userPhone: "+15551234567",
                                        remindAt: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
                                        status: "pending",
                                        tags: ["creative", "brainstorming"],
                                        dream: {
                                            title: "Breaking Creative Blocks",
                                            viralityMetrics: { remixCount: 3, shareVelocity: 5, saturationLevel: 0.2, currentTrend: "stable" },
                                            emotionalProfile: { primaryEmotion: "Inspiration", intensity: 0.6 },
                                            remixLineage: [{ id: "dream_creativity_base", title: "Creative Foundation", generation: 1 }]
                                        }
                                    }
                                ];
                                res.json(mockReminders);
                            }
                            catch (error) {
                                console.error('Error fetching reminders:', error);
                                res.status(500).json({ error: 'Failed to fetch reminders' });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    app.post('/api/cancel-reminder', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id;
                        return __generator(this, function (_a) {
                            try {
                                id = req.body.id;
                                console.log("Cancelling reminder ".concat(id));
                                res.json({ success: true });
                            }
                            catch (error) {
                                console.error('Error cancelling reminder:', error);
                                res.status(500).json({ error: 'Failed to cancel reminder' });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    app.post('/api/update-tags', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, id, tag;
                        return __generator(this, function (_b) {
                            try {
                                _a = req.body, id = _a.id, tag = _a.tag;
                                console.log("Adding tag \"".concat(tag, "\" to reminder ").concat(id));
                                res.json({ success: true });
                            }
                            catch (error) {
                                console.error('Error updating tags:', error);
                                res.status(500).json({ error: 'Failed to update tags' });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    app.get('/api/dream-call-log', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var mockCallLog;
                        return __generator(this, function (_a) {
                            try {
                                mockCallLog = [
                                    {
                                        id: "call_001",
                                        dreamId: "dream_viral_startup",
                                        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                                        status: "completed",
                                        duration: "12:34",
                                        notes: "Great discussion about viral marketing strategies"
                                    },
                                    {
                                        id: "call_002",
                                        dreamId: "dream_ai_revolution",
                                        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                                        status: "completed",
                                        duration: "08:17",
                                        notes: "AI blueprint refinement session"
                                    }
                                ];
                                res.json(mockCallLog);
                            }
                            catch (error) {
                                console.error('Error fetching call log:', error);
                                res.status(500).json({ error: 'Failed to fetch call log' });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // Divine trigger endpoint
                    app.post('/api/check-divine-trigger', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, userActivity, inputText_1, checkForDivineTrigger, triggered;
                        return __generator(this, function (_b) {
                            try {
                                _a = req.body, userActivity = _a.userActivity, inputText_1 = _a.inputText;
                                checkForDivineTrigger = function (userActivity, inputText) {
                                    var keywords = ['call from god', 'dream deeper', 'divine download'];
                                    var matchesKeyword = keywords.some(function (kw) { return inputText.toLowerCase().includes(kw); });
                                    var thresholdCrossed = userActivity.dreamsCreated > 25 || userActivity.remixes > 10;
                                    return matchesKeyword || thresholdCrossed;
                                };
                                triggered = checkForDivineTrigger(userActivity || {}, inputText_1 || '');
                                res.json({
                                    triggered: triggered,
                                    reason: triggered ?
                                        (inputText_1 && ['call from god', 'dream deeper', 'divine download'].some(function (kw) { return inputText_1.toLowerCase().includes(kw); }) ? 'keyword_match' : 'threshold_crossed')
                                        : 'none',
                                    message: triggered ? 'Divine consciousness activated' : 'Continue dreaming'
                                });
                            }
                            catch (error) {
                                console.error('Error checking divine trigger:', error);
                                res.status(500).json({ error: 'Failed to check divine trigger' });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // DAO Management endpoints
                    app.get('/api/daos', function (req, res) {
                        var daoData = {
                            daos: [
                                {
                                    id: "dream_drifters",
                                    name: "Dream Drifters",
                                    type: "Theme DAO",
                                    focus: "Whispers of melancholy and joy",
                                    vault: "dream007",
                                    votingModel: "Quadratic",
                                    initialMembers: ["dreamer.eth", "petal.sol", "starborn.bnb"],
                                    totalMembers: 3,
                                    totalProposals: 2,
                                    treasuryBalance: "1,247 $SHEEP",
                                    governanceToken: "DRIFT",
                                    createdAt: "2024-01-01T00:00:00Z"
                                }
                            ]
                        };
                        res.json(daoData);
                    });
                    app.get('/api/daos/:daoId/members', function (req, res) {
                        var daoId = req.params.daoId;
                        var membersData = {
                            members: [
                                {
                                    wallet: "dreamer.eth",
                                    joinedAt: "2024-01-01",
                                    votingPower: 45,
                                    contributionScore: 892,
                                    driftTokens: 2025
                                },
                                {
                                    wallet: "petal.sol",
                                    joinedAt: "2024-01-02",
                                    votingPower: 38,
                                    contributionScore: 756,
                                    driftTokens: 1444
                                },
                                {
                                    wallet: "starborn.bnb",
                                    joinedAt: "2024-01-03",
                                    votingPower: 32,
                                    contributionScore: 634,
                                    driftTokens: 1024
                                }
                            ]
                        };
                        res.json(membersData);
                    });
                    app.get('/api/daos/:daoId/proposals', function (req, res) {
                        var daoId = req.params.daoId;
                        var proposalsData = {
                            proposals: [
                                {
                                    id: "prop_001",
                                    title: "Allocate 500 $SHEEP for Melancholy Dream Collection",
                                    description: "Fund creation of 10 dreams exploring themes of beautiful sadness and nostalgic reflection",
                                    proposer: "dreamer.eth",
                                    status: "active",
                                    votes: [
                                        { wallet: "dreamer.eth", power: 45, support: true },
                                        { wallet: "petal.sol", power: 38, support: true }
                                    ],
                                    createdAt: "2024-01-05T10:00:00Z",
                                    endsAt: "2024-01-12T10:00:00Z",
                                    minVotingPower: 50,
                                    quorum: 60
                                },
                                {
                                    id: "prop_002",
                                    title: "Partner with Joy Collective for Cross-DAO Event",
                                    description: "Collaborate on dream fusion event combining melancholy and joy themes",
                                    proposer: "petal.sol",
                                    status: "pending",
                                    votes: [],
                                    createdAt: "2024-01-06T14:30:00Z",
                                    endsAt: "2024-01-13T14:30:00Z",
                                    minVotingPower: 50,
                                    quorum: 60
                                }
                            ]
                        };
                        res.json(proposalsData);
                    });
                    app.post('/api/daos/:daoId/proposals/:proposalId/vote', function (req, res) {
                        var _a = req.params, daoId = _a.daoId, proposalId = _a.proposalId;
                        var _b = req.body, wallet = _b.wallet, support = _b.support, votingPower = _b.votingPower;
                        // Mock voting response
                        res.json({
                            success: true,
                            vote: {
                                wallet: wallet,
                                support: support,
                                votingPower: votingPower,
                                proposalId: proposalId,
                                timestamp: new Date().toISOString()
                            },
                            message: "Vote ".concat(support ? 'in favor' : 'against', " proposal recorded with ").concat(votingPower, " voting power")
                        });
                    });
                    // Dream Enhancement endpoints
                    app.get('/api/dreams/:dreamId/enhancements', function (req, res) {
                        var dreamId = req.params.dreamId;
                        var enhancementData = {
                            dreamId: dreamId,
                            addedEmotion: "Curiosity",
                            effect: "Expanded remix audience + Remix Toolchain Access",
                            previousEmotions: ["Hope", "Wonder"],
                            enhancedCapabilities: [
                                "Advanced Remix Editor",
                                "Collaborative Workspace",
                                "AI-Assisted Generation",
                                "Cross-Chain Distribution",
                                "Analytics Dashboard"
                            ],
                            audienceMultiplier: 2.3,
                            toolchainAccess: [
                                "LUCID Agent",
                                "CANVAS Agent",
                                "ROOT Agent",
                                "ECHO Agent",
                                "Fusion Chamber",
                                "Dream Linker"
                            ],
                            timestamp: new Date().toISOString()
                        };
                        res.json(enhancementData);
                    });
                    app.post('/api/dreams/:dreamId/enhance', function (req, res) {
                        var dreamId = req.params.dreamId;
                        var _a = req.body, emotion = _a.emotion, daoId = _a.daoId;
                        var emotionEffects = {
                            Curiosity: {
                                audienceMultiplier: 2.3,
                                toolchainAccess: ["LUCID Agent", "CANVAS Agent", "ROOT Agent", "ECHO Agent"],
                                effect: "Expanded remix audience + Remix Toolchain Access"
                            },
                            Wonder: {
                                audienceMultiplier: 2.1,
                                toolchainAccess: ["Visualization Tools", "Community Spotlight"],
                                effect: "Enhanced visualization tools + Community spotlights"
                            },
                            Passion: {
                                audienceMultiplier: 2.5,
                                toolchainAccess: ["Premium Agents", "Velocity Booster"],
                                effect: "Remix velocity boost + Premium agent access"
                            }
                        };
                        var enhancement = emotionEffects[emotion] || emotionEffects.Curiosity;
                        res.json({
                            success: true,
                            dreamId: dreamId,
                            addedEmotion: emotion,
                            enhancement: enhancement,
                            message: "Dream ".concat(dreamId, " enhanced with ").concat(emotion, " emotion")
                        });
                    });
                    // Whisper Messaging endpoints
                    app.get('/api/whispers', function (req, res) {
                        var whispers = [
                            {
                                id: 'whisper_001',
                                targetDreamId: 'dream108',
                                whisperType: 'Signal',
                                message: 'Your next fork belongs to fire.',
                                sender: 'dreamer.eth',
                                emotionOverlay: 'Passion',
                                timestamp: new Date().toISOString(),
                                status: 'delivered'
                            },
                            {
                                id: 'whisper_002',
                                targetWallet: 'echo.sol',
                                whisperType: 'Vault',
                                message: 'Unlock this door to access The Architect\'s Archive.',
                                sender: 'system',
                                link: 'https://dreamnetwork.xyz/vault/xyz',
                                tokenRequired: 'Ambition',
                                timestamp: new Date(Date.now() - 300000).toISOString(),
                                status: 'pending'
                            }
                        ];
                        res.json({ whispers: whispers });
                    });
                    app.post('/api/whispers', function (req, res) {
                        var _a = req.body, targetDreamId = _a.targetDreamId, targetWallet = _a.targetWallet, whisperType = _a.whisperType, message = _a.message, sender = _a.sender, emotionOverlay = _a.emotionOverlay, link = _a.link, tokenRequired = _a.tokenRequired;
                        var newWhisper = {
                            id: "whisper_".concat(Date.now()),
                            targetDreamId: targetDreamId,
                            targetWallet: targetWallet,
                            whisperType: whisperType,
                            message: message,
                            sender: sender,
                            emotionOverlay: emotionOverlay,
                            link: link,
                            tokenRequired: tokenRequired,
                            timestamp: new Date().toISOString(),
                            status: 'pending'
                        };
                        res.json({
                            success: true,
                            whisper: newWhisper,
                            message: 'Whisper sent successfully'
                        });
                    });
                    // Remix endpoints
                    app.post('/api/remix', function (req, res) {
                        var _a = req.body, originalDreamId = _a.originalDreamId, remixerWallet = _a.remixerWallet, content = _a.content, emotions = _a.emotions;
                        var newRemixId = "remix_".concat(Date.now());
                        res.json({
                            success: true,
                            remixId: newRemixId,
                            originalDreamId: originalDreamId,
                            remixerWallet: remixerWallet,
                            content: content,
                            emotions: emotions,
                            status: 'processing',
                            timestamp: new Date().toISOString(),
                            message: 'Remix request submitted successfully'
                        });
                    });
                    app.get('/api/remixes', function (req, res) {
                        var remixes = [
                            {
                                id: 'remix_001',
                                originalDreamId: 'dream045',
                                remixerWallet: 'you.eth',
                                content: 'A remix that merges dream logic with synthetic nature',
                                emotions: ['curiosity', 'awe'],
                                status: 'processing',
                                timestamp: new Date().toISOString()
                            }
                        ];
                        res.json({ remixes: remixes });
                    });
                    // Dream Lineage endpoints
                    app.post('/api/dreams/:dreamId/lineage', function (req, res) {
                        var dreamId = req.params.dreamId;
                        var _a = req.body, lineage = _a.lineage, status = _a.status;
                        res.json({
                            success: true,
                            newDreamId: dreamId,
                            lineage: lineage,
                            status: status,
                            timestamp: new Date().toISOString(),
                            message: "Dream lineage established for ".concat(dreamId)
                        });
                    });
                    app.get('/api/lineages', function (req, res) {
                        var lineages = [
                            {
                                newDreamId: 'dream066',
                                lineage: ['dream001', 'dream045'],
                                status: 'published',
                                timestamp: new Date().toISOString()
                            }
                        ];
                        res.json({ lineages: lineages });
                    });
                    // User Progression endpoints
                    app.get('/api/users/:userId/progression', function (req, res) {
                        var userId = req.params.userId;
                        var userProgression = {
                            userId: "dreamer_1072",
                            xp: 2893,
                            tier: "Weaver",
                            emotionTrail: ["hope", "curiosity"],
                            remixCount: 9,
                            vaultEarnings: 143,
                            visualConfig: {
                                coreGlow: "blue",
                                trailOverlay: "animated dust",
                                shape: "soft mandala",
                                emotionTint: ["#7ecfff", "#ffd97e"]
                            }
                        };
                        res.json({ user: userProgression });
                    });
                    app.post('/api/users/:userId/progression/update', function (req, res) {
                        var userId = req.params.userId;
                        var _a = req.body, xpGain = _a.xpGain, action = _a.action;
                        res.json({
                            success: true,
                            userId: userId,
                            xpGain: xpGain,
                            action: action,
                            newXp: 2893 + xpGain,
                            message: "".concat(xpGain, " XP gained from ").concat(action)
                        });
                    });
                    app.get('/api/tiers', function (req, res) {
                        var tiers = [
                            {
                                name: "Dreamer",
                                minXp: 0,
                                maxXp: 999,
                                benefits: ["Basic dream creation", "Standard emotions"],
                                visualUnlocks: ["Basic glow", "Simple shapes"]
                            },
                            {
                                name: "Weaver",
                                minXp: 1000,
                                maxXp: 2999,
                                benefits: ["Enhanced remixing", "Emotion trails", "Vault access"],
                                visualUnlocks: ["Core glow customization", "Trail overlays", "Mandala shapes"]
                            },
                            {
                                name: "Architect",
                                minXp: 3000,
                                maxXp: 4999,
                                benefits: ["Advanced AI agents", "Cross-chain features", "Premium tools"],
                                visualUnlocks: ["Complex geometries", "Multi-layer effects", "Custom animations"]
                            },
                            {
                                name: "Visionary",
                                minXp: 5000,
                                maxXp: 9999,
                                benefits: ["DAO governance", "Token multipliers", "Feature access"],
                                visualUnlocks: ["Particle systems", "Dynamic gradients", "Reality distortion"]
                            },
                            {
                                name: "Transcendent",
                                minXp: 10000,
                                maxXp: 99999,
                                benefits: ["Network ownership", "Agent creation", "Ecosystem control"],
                                visualUnlocks: ["Quantum effects", "Dimensional shifts", "Consciousness flows"]
                            }
                        ];
                        res.json({ tiers: tiers });
                    });
                    // Revenue Sharing endpoints
                    app.get('/api/vaults/:vaultId/revenue', function (req, res) {
                        var vaultId = req.params.vaultId;
                        var vaultRevenue = {
                            vaultId: "vault_304",
                            creator: "0xDREAMER001",
                            remixer: "0xDREAMER092",
                            agent: "dream_chaser_4",
                            totalRevenue: "2.31 SOL",
                            splits: {
                                creator: 0.5,
                                remixer: 0.25,
                                agent: 0.15,
                                networkFee: 0.10
                            },
                            timestamp: new Date().toISOString()
                        };
                        res.json({ vault: vaultRevenue });
                    });
                    app.post('/api/vaults/:vaultId/distribute', function (req, res) {
                        var vaultId = req.params.vaultId;
                        var _a = req.body, amount = _a.amount, currency = _a.currency;
                        var distribution = {
                            vaultId: vaultId,
                            totalAmount: amount,
                            currency: currency,
                            distributions: [
                                {
                                    recipient: "0xDREAMER001",
                                    role: "creator",
                                    amount: amount * 0.5,
                                    percentage: 50
                                },
                                {
                                    recipient: "0xDREAMER092",
                                    role: "remixer",
                                    amount: amount * 0.25,
                                    percentage: 25
                                },
                                {
                                    recipient: "dream_chaser_4",
                                    role: "agent",
                                    amount: amount * 0.15,
                                    percentage: 15
                                },
                                {
                                    recipient: "network",
                                    role: "platform",
                                    amount: amount * 0.10,
                                    percentage: 10
                                }
                            ],
                            transactionId: "tx_".concat(Date.now()),
                            status: "processing",
                            timestamp: new Date().toISOString()
                        };
                        res.json({
                            success: true,
                            distribution: distribution,
                            message: "Revenue distribution initiated for ".concat(vaultId)
                        });
                    });
                    app.get('/api/revenue/analytics', function (req, res) {
                        var analytics = {
                            totalRevenue: "47.83 SOL",
                            totalDistributions: 28,
                            averageVaultRevenue: "1.71 SOL",
                            topPerformingVault: "vault_304",
                            networkFeesCollected: "4.78 SOL",
                            activeVaults: 12,
                            monthlyGrowth: 24.7
                        };
                        res.json({ analytics: analytics });
                    });
                    // Vault Marketplace endpoints
                    app.get('/api/vaults', function (req, res) {
                        var vaults = [
                            {
                                vaultId: "vault_483",
                                title: "Moonwave: The Remix Archive",
                                creator: "0xDREAMER005",
                                emotion: "wonder",
                                views: 8432,
                                remixes: 132,
                                available: true,
                                price: "3.1 $SHEEP",
                                status: "trending",
                                description: "A celestial collection of moon-inspired dreams and their evolutionary remixes.",
                                tags: ["lunar", "ethereal", "transformative", "celestial"]
                            },
                            {
                                vaultId: "vault_301",
                                title: "Digital Fragments",
                                creator: "0xDREAMER001",
                                emotion: "curiosity",
                                views: 5672,
                                remixes: 89,
                                available: true,
                                price: "2.8 $SHEEP",
                                status: "popular",
                                tags: ["digital", "fragments", "exploration"]
                            },
                            {
                                vaultId: "vault_198",
                                title: "Neon Dreams Collection",
                                creator: "0xDREAMER092",
                                emotion: "excitement",
                                views: 12104,
                                remixes: 245,
                                available: false,
                                price: "5.2 $SHEEP",
                                status: "sold out",
                                tags: ["neon", "cyberpunk", "electric"]
                            }
                        ];
                        res.json({ vaults: vaults });
                    });
                    app.get('/api/vaults/:vaultId', function (req, res) {
                        var vaultId = req.params.vaultId;
                        var vault = {
                            vaultId: "vault_483",
                            title: "Moonwave: The Remix Archive",
                            creator: "0xDREAMER005",
                            emotion: "wonder",
                            views: 8432,
                            remixes: 132,
                            available: true,
                            price: "3.1 $SHEEP",
                            status: "trending",
                            description: "A celestial collection of moon-inspired dreams and their evolutionary remixes, capturing the wonder of lunar cycles and ethereal transformations.",
                            createdAt: "2025-01-03",
                            tags: ["lunar", "ethereal", "transformative", "celestial"],
                            remixHistory: [
                                { id: "remix_001", title: "Lunar Eclipse", creator: "0xREMIXER001", timestamp: "2025-01-04" },
                                { id: "remix_045", title: "Crescent Dreams", creator: "0xREMIXER045", timestamp: "2025-01-04" },
                                { id: "remix_092", title: "Stellar Winds", creator: "0xREMIXER092", timestamp: "2025-01-05" }
                            ]
                        };
                        res.json({ vault: vault });
                    });
                    app.post('/api/vaults/:vaultId/purchase', function (req, res) {
                        var vaultId = req.params.vaultId;
                        var _a = req.body, buyerWallet = _a.buyerWallet, paymentAmount = _a.paymentAmount;
                        res.json({
                            success: true,
                            vaultId: vaultId,
                            buyerWallet: buyerWallet,
                            paymentAmount: paymentAmount,
                            transactionId: "purchase_".concat(Date.now()),
                            accessGranted: true,
                            message: "Successfully purchased ".concat(vaultId)
                        });
                    });
                    app.get('/api/marketplace/stats', function (req, res) {
                        var stats = {
                            totalVaults: 47,
                            availableVaults: 32,
                            totalViews: 234567,
                            totalRemixes: 1893,
                            averagePrice: "3.2 $SHEEP",
                            topVault: "vault_483",
                            trendingEmotions: ["wonder", "curiosity", "excitement"],
                            dailyTransactions: 23
                        };
                        res.json({ stats: stats });
                    });
                    // Dream Cloud endpoints
                    app.get('/api/clouds/:cloudId', function (req, res) {
                        var cloudId = req.params.cloudId;
                        var cloud = {
                            cloudId: "cloud_007",
                            title: "Crypto for Kids Cloud",
                            dreams: 42,
                            remixPaths: 238,
                            emotions: ["curiosity", "empowerment"],
                            team: ["0xBrandon", "0xTina", "0xFlutter"],
                            totalRevenue: "18,720 $SHEEP",
                            vaultsActive: 19,
                            missionsLive: 5,
                            description: "Educational blockchain experience designed for young minds",
                            createdAt: "2024-12-15",
                            lastActive: new Date().toISOString()
                        };
                        res.json({ cloud: cloud });
                    });
                    app.get('/api/clouds/:cloudId/missions', function (req, res) {
                        var cloudId = req.params.cloudId;
                        var missions = [
                            {
                                id: "mission_001",
                                title: "Blockchain Basics Interactive Journey",
                                progress: 78,
                                reward: "2,400 $SHEEP",
                                status: "active",
                                assignedTo: "0xBrandon",
                                description: "Interactive learning module covering fundamental blockchain concepts"
                            },
                            {
                                id: "mission_002",
                                title: "Digital Wallet Adventure Game",
                                progress: 92,
                                reward: "3,100 $SHEEP",
                                status: "active",
                                assignedTo: "0xTina",
                                description: "Gamified wallet management and security education"
                            },
                            {
                                id: "mission_003",
                                title: "NFT Creation Workshop",
                                progress: 45,
                                reward: "1,800 $SHEEP",
                                status: "active",
                                assignedTo: "0xFlutter",
                                description: "Hands-on NFT creation and marketplace understanding"
                            }
                        ];
                        res.json({ missions: missions });
                    });
                    app.get('/api/clouds/:cloudId/team', function (req, res) {
                        var cloudId = req.params.cloudId;
                        var team = [
                            {
                                address: "0xBrandon",
                                role: "Lead Educator",
                                contributions: 89,
                                earnings: "7,240 $SHEEP",
                                status: "online",
                                joinedAt: "2024-12-15",
                                specialties: ["Blockchain Education", "Content Strategy"]
                            },
                            {
                                address: "0xTina",
                                role: "Content Creator",
                                contributions: 76,
                                earnings: "6,180 $SHEEP",
                                status: "online",
                                joinedAt: "2024-12-16",
                                specialties: ["Interactive Design", "Storytelling"]
                            },
                            {
                                address: "0xFlutter",
                                role: "UX Designer",
                                contributions: 67,
                                earnings: "5,300 $SHEEP",
                                status: "offline",
                                joinedAt: "2024-12-18",
                                specialties: ["User Experience", "Visual Design"]
                            }
                        ];
                        res.json({ team: team });
                    });
                    app.post('/api/clouds/:cloudId/missions/:missionId/update', function (req, res) {
                        var _a = req.params, cloudId = _a.cloudId, missionId = _a.missionId;
                        var _b = req.body, progress = _b.progress, status = _b.status;
                        res.json({
                            success: true,
                            cloudId: cloudId,
                            missionId: missionId,
                            progress: progress,
                            status: status,
                            timestamp: new Date().toISOString(),
                            message: "Mission ".concat(missionId, " updated successfully")
                        });
                    });
                    app.get('/api/clouds/analytics', function (req, res) {
                        var analytics = {
                            totalClouds: 12,
                            activeClouds: 8,
                            totalDreams: 347,
                            totalRemixPaths: 1542,
                            totalRevenue: "89,340 $SHEEP",
                            averageTeamSize: 3.2,
                            completionRate: 73,
                            topPerformingCloud: "cloud_007"
                        };
                        res.json({ analytics: analytics });
                    });
                    // Leaderboard endpoint
                    app.get('/api/leaderboard', function (req, res) {
                        var leaderboardData = {
                            leaderboard: [
                                { wallet: "dreamer.eth", score: 912, rank: 1, change: 2 },
                                { wallet: "echo.bnb", score: 888, rank: 2, change: -1 },
                                { wallet: "starborn.sol", score: 861, rank: 3, change: 1 },
                                { wallet: "void.base", score: 823, rank: 4, change: 0 },
                                { wallet: "nexus.arb", score: 798, rank: 5, change: 3 },
                                { wallet: "quantum.poly", score: 776, rank: 6, change: -2 },
                                { wallet: "cosmic.ftm", score: 752, rank: 7, change: 1 },
                                { wallet: "neural.avax", score: 728, rank: 8, change: -1 },
                                { wallet: "genesis.one", score: 704, rank: 9, change: 2 },
                                { wallet: "phoenix.near", score: 681, rank: 10, change: -3 }
                            ],
                            top_dreams: [
                                {
                                    title: "Echo Reboot",
                                    remixes: 47,
                                    heat: "🔥🔥🔥",
                                    vaultRevenue: "312 $SHEEP",
                                    creator: "dreamer.eth",
                                    tags: ["💡 Concept", "🚀 Launch", "⚡ Viral"]
                                },
                                {
                                    title: "Signal Lost",
                                    remixes: 33,
                                    heat: "🔥🔥",
                                    vaultRevenue: "147 $SHEEP",
                                    creator: "echo.bnb",
                                    tags: ["🎭 Drama", "⚡ Energy", "🌊 Trending"]
                                },
                                {
                                    title: "Quantum Drift",
                                    remixes: 28,
                                    heat: "🔥🔥",
                                    vaultRevenue: "89 $SHEEP",
                                    creator: "starborn.sol",
                                    tags: ["🌌 Cosmic", "🔬 Science", "🎨 Creative"]
                                },
                                {
                                    title: "Digital Awakening",
                                    remixes: 22,
                                    heat: "🔥",
                                    vaultRevenue: "67 $SHEEP",
                                    creator: "void.base",
                                    tags: ["🤖 AI", "💭 Philosophy", "🔮 Future"]
                                },
                                {
                                    title: "Neon Dreams",
                                    remixes: 19,
                                    heat: "🔥",
                                    vaultRevenue: "45 $SHEEP",
                                    creator: "nexus.arb",
                                    tags: ["🌈 Aesthetic", "🎵 Music", "✨ Inspiration"]
                                },
                                {
                                    title: "Whispers in Orbit",
                                    remixes: 22,
                                    heat: "🔥",
                                    vaultRevenue: "127 $SHEEP",
                                    creator: "starborn.sol",
                                    tags: ["🌟 Hope", "🌌 Cosmic", "💫 Whisper"],
                                    emotion: "Hope",
                                    agent: "Petal",
                                    actions: ["Remix", "Vault Peek", "Whisper"]
                                }
                            ],
                            totalRevenue: "1,974 $SHEEP",
                            totalRemixes: 434,
                            activeCreators: 91,
                            lastUpdated: new Date().toISOString()
                        };
                        res.json(leaderboardData);
                    });
                    httpServer = (0, http_1.createServer)(app);
                    return [2 /*return*/, httpServer];
            }
        });
    });
}
