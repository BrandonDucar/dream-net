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
exports.createSocialMediaOpsRouter = createSocialMediaOpsRouter;
var express_1 = require("express");
var SocialMediaOps_1 = require("../agents/SocialMediaOps");
function createSocialMediaOpsRouter() {
    var _this = this;
    var router = (0, express_1.Router)();
    // POST /api/social-media-ops/initialize - Initialize social media accounts
    router.post("/social-media-ops/initialize", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var accounts, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, SocialMediaOps_1.socialMediaOps.initializeAccounts()];
                case 1:
                    accounts = _a.sent();
                    res.json({ ok: true, accounts: accounts });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Failed to initialize social media ops:", error_1);
                    res.status(500).json({ error: error_1.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // POST /api/social-media-ops/post - Create and post content
    router.post("/social-media-ops/post", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, content, platforms, mediaUrls, targetPlatforms, results, _i, targetPlatforms_1, platform, post, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    _a = req.body, content = _a.content, platforms = _a.platforms, mediaUrls = _a.mediaUrls;
                    if (!content) {
                        return [2 /*return*/, res.status(400).json({ error: "content is required" })];
                    }
                    targetPlatforms = platforms || ["twitter", "linkedin"];
                    results = [];
                    _i = 0, targetPlatforms_1 = targetPlatforms;
                    _b.label = 1;
                case 1:
                    if (!(_i < targetPlatforms_1.length)) return [3 /*break*/, 4];
                    platform = targetPlatforms_1[_i];
                    return [4 /*yield*/, SocialMediaOps_1.socialMediaOps.createPost(platform, content, mediaUrls)];
                case 2:
                    post = _b.sent();
                    results.push(post);
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    res.json({
                        ok: true,
                        message: "Post created",
                        posts: results
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _b.sent();
                    console.error("Failed to create post:", error_2);
                    res.status(500).json({ error: error_2.message });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    // POST /api/social-media-ops/start - Start auto-posting
    router.post("/social-media-ops/start", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                SocialMediaOps_1.socialMediaOps.startAutoPosting();
                res.json({
                    ok: true,
                    message: "Social media automation started",
                    status: "active"
                });
            }
            catch (error) {
                console.error("Failed to start social media ops:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/social-media-ops/status - Get status
    router.get("/social-media-ops/status", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var accounts;
        return __generator(this, function (_a) {
            try {
                accounts = SocialMediaOps_1.socialMediaOps.getAccounts();
                res.json({ ok: true, accounts: accounts });
            }
            catch (error) {
                console.error("Failed to get status:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/social-media-ops/messages - Get recent posts
    router.get("/social-media-ops/messages", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var posts;
        return __generator(this, function (_a) {
            try {
                posts = SocialMediaOps_1.socialMediaOps.getPosts();
                res.json({ ok: true, messages: posts.slice(0, 50) });
            }
            catch (error) {
                console.error("Failed to get messages:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    return router;
}
