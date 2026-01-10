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
exports.createMediaRouter = createMediaRouter;
var express_1 = require("express");
var multer_1 = require("multer");
var node_path_1 = require("node:path");
var promises_1 = require("node:fs/promises");
var media_vault_1 = require("../../packages/media-vault");
var spore_engine_1 = require("../../packages/spore-engine");
var vocab_1 = require("../../packages/media-vault/src/vocab");
var rewards_engine_1 = require("../../packages/rewards-engine");
var upload = (0, multer_1.default)({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
    storage: multer_1.default.memoryStorage(),
});
function createMediaRouter() {
    var _this = this;
    var router = (0, express_1.Router)();
    // Rate limiting (simple in-memory)
    var ingestRateLimit = new Map();
    var RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
    var RATE_LIMIT_MAX = 10; // 10 requests per minute
    function checkRateLimit(ip) {
        var now = Date.now();
        var record = ingestRateLimit.get(ip);
        if (!record || now > record.resetAt) {
            ingestRateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
            return true;
        }
        if (record.count >= RATE_LIMIT_MAX) {
            return false;
        }
        record.count++;
        return true;
    }
    // POST /api/media/ingest
    router.post("/media/ingest", upload.single("file"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var ip, _a, url, source, title, tags, collections, prompt_1, model, rights, rating, asset, err_1, userId, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ip = req.ip || req.socket.remoteAddress || "unknown";
                    if (!checkRateLimit(ip)) {
                        res.status(429).json({ ok: false, error: "Rate limit exceeded" });
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 10, , 11]);
                    _a = req.body, url = _a.url, source = _a.source, title = _a.title, tags = _a.tags, collections = _a.collections, prompt_1 = _a.prompt, model = _a.model, rights = _a.rights, rating = _a.rating;
                    if (!source) {
                        res.status(400).json({ ok: false, error: "source is required" });
                        return [2 /*return*/];
                    }
                    asset = void 0;
                    if (!req.file) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, media_vault_1.ingestFromFile)(req.file.buffer, req.file.originalname, {
                            source: source,
                            title: title,
                            tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : undefined,
                            collections: collections ? (Array.isArray(collections) ? collections : JSON.parse(collections)) : undefined,
                            prompt: prompt_1,
                            model: model,
                            rights: rights,
                            rating: rating,
                        })];
                case 2:
                    // File upload
                    asset = _b.sent();
                    return [3 /*break*/, 6];
                case 3:
                    if (!url) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, media_vault_1.ingestFromUrl)(url, {
                            source: source,
                            title: title,
                            tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : undefined,
                            collections: collections ? (Array.isArray(collections) ? collections : JSON.parse(collections)) : undefined,
                            prompt: prompt_1,
                            model: model,
                            rights: rights,
                            rating: rating,
                        })];
                case 4:
                    // URL ingestion
                    asset = _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    res.status(400).json({ ok: false, error: "Either file or url is required" });
                    return [2 /*return*/];
                case 6:
                    _b.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, (0, spore_engine_1.createSpore)({
                            name: "media-".concat(asset.id),
                            description: "Media asset: ".concat(asset.title),
                            type: "media",
                            status: "published",
                            content: JSON.stringify({
                                mediaId: asset.id,
                                title: asset.title,
                                source: asset.source,
                                tags: asset.tags,
                                collections: asset.collections,
                                prompt: asset.credits.prompt,
                                model: asset.credits.model,
                            }),
                            metadata: {
                                mediaId: asset.id,
                                tags: asset.tags,
                                collections: asset.collections,
                                source: asset.source,
                            },
                        })];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _b.sent();
                    console.error("Failed to create Media Spore:", err_1);
                    return [3 /*break*/, 9];
                case 9:
                    userId = req.headers["x-user-id"] || req.query.userId;
                    if (userId) {
                        (0, rewards_engine_1.grantReward)(userId, "media-upload").catch(function (err) {
                            console.error("Failed to grant media-upload reward:", err);
                            // Don't fail the request if reward fails
                        });
                    }
                    res.json({ ok: true, asset: asset });
                    return [3 /*break*/, 11];
                case 10:
                    error_1 = _b.sent();
                    console.error("Media ingestion error:", error_1);
                    res.status(500).json({ ok: false, error: error_1.message });
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    }); });
    // GET /api/media/search
    router.get("/media/search", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, q, tags, type, source, collections, rating, date_from, date_to, limit, offset, filters, results, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.query, q = _a.q, tags = _a.tags, type = _a.type, source = _a.source, collections = _a.collections, rating = _a.rating, date_from = _a.date_from, date_to = _a.date_to, limit = _a.limit, offset = _a.offset;
                    filters = {
                        q: q,
                        tags: tags ? (Array.isArray(tags) ? tags : [tags]) : undefined,
                        type: type,
                        source: source,
                        collections: collections ? (Array.isArray(collections) ? collections : [collections]) : undefined,
                        rating: rating,
                        date_from: date_from,
                        date_to: date_to,
                    };
                    return [4 /*yield*/, (0, media_vault_1.searchMedia)(filters, parseInt(String(limit !== null && limit !== void 0 ? limit : "50"), 10), parseInt(String(offset !== null && offset !== void 0 ? offset : "0"), 10))];
                case 1:
                    results = _b.sent();
                    res.json({ ok: true, results: results, count: results.length });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _b.sent();
                    res.status(500).json({ ok: false, error: error_2.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // GET /api/media/:id
    // GET /api/media/public
    router.get("/media/public", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var collection, limit, offset, media, error_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    collection = req.query.collection || "all";
                    limit = parseInt(String((_a = req.query.limit) !== null && _a !== void 0 ? _a : "100"), 10) || 100;
                    offset = parseInt(String((_b = req.query.offset) !== null && _b !== void 0 ? _b : "0"), 10) || 0;
                    return [4 /*yield*/, (0, media_vault_1.getPublicMedia)(collection, limit, offset)];
                case 1:
                    media = _c.sent();
                    res.json({ ok: true, media: media, total: media.length });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _c.sent();
                    console.error("Failed to get public media:", error_3);
                    res.status(500).json({ ok: false, error: error_3.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    router.get("/media/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var asset, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, media_vault_1.getMediaById)(req.params.id)];
                case 1:
                    asset = _a.sent();
                    if (!asset) {
                        res.status(404).json({ ok: false, error: "Media not found" });
                        return [2 /*return*/];
                    }
                    res.json({ ok: true, asset: asset });
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    res.status(500).json({ ok: false, error: error_4.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // POST /api/posts/queue
    router.post("/posts/queue", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, media_id, platform, caption, hashtags, scheduled_at, asset, finalHashtags, queueItem, error_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    _a = req.body, media_id = _a.media_id, platform = _a.platform, caption = _a.caption, hashtags = _a.hashtags, scheduled_at = _a.scheduled_at;
                    if (!media_id || !platform) {
                        res.status(400).json({ ok: false, error: "media_id and platform are required" });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, media_vault_1.getMediaById)(media_id)];
                case 1:
                    asset = _b.sent();
                    if (!asset) {
                        res.status(404).json({ ok: false, error: "Media not found" });
                        return [2 /*return*/];
                    }
                    finalHashtags = hashtags && hashtags.length > 0 ? hashtags : (0, vocab_1.getHashtagsForTags)(asset.tags);
                    return [4 /*yield*/, (0, media_vault_1.createPostQueueItem)({
                            media_id: media_id,
                            platform: platform,
                            status: scheduled_at ? "scheduled" : "draft",
                            scheduled_at: scheduled_at ? new Date(scheduled_at).toISOString() : null,
                            caption: caption || asset.caption,
                            hashtags: finalHashtags,
                            post_url: null,
                            engagement: null,
                        })];
                case 2:
                    queueItem = _b.sent();
                    res.json({ ok: true, queueItem: queueItem });
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _b.sent();
                    res.status(500).json({ ok: false, error: error_5.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // GET /api/posts/queue
    router.get("/posts/queue", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, status_1, platform, items, error_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.query, status_1 = _a.status, platform = _a.platform;
                    return [4 /*yield*/, (0, media_vault_1.getPostQueueItems)({
                            status: status_1,
                            platform: platform,
                        })];
                case 1:
                    items = _b.sent();
                    res.json({ ok: true, items: items });
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _b.sent();
                    res.status(500).json({ ok: false, error: error_6.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // PUT /api/posts/queue/:id
    router.put("/posts/queue/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, status_2, post_url, engagement, updates, queueItem, item, updated, error_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    _a = req.body, status_2 = _a.status, post_url = _a.post_url, engagement = _a.engagement;
                    updates = {};
                    if (status_2)
                        updates.status = status_2;
                    if (post_url)
                        updates.post_url = post_url;
                    if (engagement)
                        updates.engagement = engagement;
                    if (!(status_2 === "posted")) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, media_vault_1.getPostQueueItems)()];
                case 1:
                    queueItem = _b.sent();
                    item = queueItem.find(function (q) { return q.id === req.params.id; });
                    if (!item) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, media_vault_1.incrementMediaUsage)(item.media_id)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [4 /*yield*/, (0, media_vault_1.updatePostQueueItem)(req.params.id, updates)];
                case 4:
                    updated = _b.sent();
                    if (!updated) {
                        res.status(404).json({ ok: false, error: "Queue item not found" });
                        return [2 /*return*/];
                    }
                    res.json({ ok: true, queueItem: updated });
                    return [3 /*break*/, 6];
                case 5:
                    error_7 = _b.sent();
                    res.status(500).json({ ok: false, error: error_7.message });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    // Serve media files
    router.get("/media/thumb_320/:id.jpg", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var getMediaRoot, mediaRoot, thumbPath, file, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    getMediaRoot = function () {
                        if (process.env.MEDIA_ROOT) {
                            if (process.env.MEDIA_ROOT.startsWith("/") || process.env.MEDIA_ROOT.match(/^[A-Z]:/)) {
                                return process.env.MEDIA_ROOT;
                            }
                            return (0, node_path_1.join)(process.cwd(), process.env.MEDIA_ROOT);
                        }
                        var projectRoot = process.cwd();
                        if (projectRoot.includes("OneDrive") || projectRoot.includes("Documents")) {
                            var parentDir = (0, node_path_1.dirname)(projectRoot);
                            return (0, node_path_1.join)(parentDir, "dream-net-media");
                        }
                        return (0, node_path_1.join)(projectRoot, "media");
                    };
                    mediaRoot = getMediaRoot();
                    thumbPath = (0, node_path_1.join)(mediaRoot, "thumb_320", "".concat(req.params.id, ".jpg"));
                    return [4 /*yield*/, (0, promises_1.readFile)(thumbPath)];
                case 1:
                    file = _b.sent();
                    res.setHeader("Content-Type", "image/jpeg");
                    res.send(file);
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    res.status(404).send("Not found");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    router.get("/media/web_1080/:id.jpg", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var getMediaRoot, mediaRoot, webPath, file, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    getMediaRoot = function () {
                        if (process.env.MEDIA_ROOT) {
                            if (process.env.MEDIA_ROOT.startsWith("/") || process.env.MEDIA_ROOT.match(/^[A-Z]:/)) {
                                return process.env.MEDIA_ROOT;
                            }
                            return (0, node_path_1.join)(process.cwd(), process.env.MEDIA_ROOT);
                        }
                        var projectRoot = process.cwd();
                        if (projectRoot.includes("OneDrive") || projectRoot.includes("Documents")) {
                            var parentDir = (0, node_path_1.dirname)(projectRoot);
                            return (0, node_path_1.join)(parentDir, "dream-net-media");
                        }
                        return (0, node_path_1.join)(projectRoot, "media");
                    };
                    mediaRoot = getMediaRoot();
                    webPath = (0, node_path_1.join)(mediaRoot, "web_1080", "".concat(req.params.id, ".jpg"));
                    return [4 /*yield*/, (0, promises_1.readFile)(webPath)];
                case 1:
                    file = _b.sent();
                    res.setHeader("Content-Type", "image/jpeg");
                    res.send(file);
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    res.status(404).send("Not found");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    return router;
}
