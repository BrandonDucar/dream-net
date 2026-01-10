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
exports.createDreamInteractionsRouter = createDreamInteractionsRouter;
var express_1 = require("express");
var db_1 = require("../db");
var schema_1 = require("../../shared/schema");
var drizzle_orm_1 = require("drizzle-orm");
function createDreamInteractionsRouter() {
    var _this = this;
    var router = (0, express_1.Router)();
    // POST /api/dreams/:id/like
    router.post("/dreams/:id/like", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, userId, dream, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    id = req.params.id;
                    userId = req.headers["x-user-id"] || req.body.userId || "anonymous";
                    // Increment likes count
                    return [4 /*yield*/, db_1.db
                            .update(schema_1.dreams)
                            .set({
                            likes: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", " + 1"], ["", " + 1"])), schema_1.dreams.likes),
                        })
                            .where((0, drizzle_orm_1.eq)(schema_1.dreams.id, id))];
                case 1:
                    // Increment likes count
                    _a.sent();
                    return [4 /*yield*/, db_1.db.select().from(schema_1.dreams).where((0, drizzle_orm_1.eq)(schema_1.dreams.id, id))];
                case 2:
                    dream = (_a.sent())[0];
                    res.json({ ok: true, likes: (dream === null || dream === void 0 ? void 0 : dream.likes) || 0 });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Failed to like dream:", error_1);
                    res.status(500).json({ error: error_1.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // POST /api/dreams/:id/unlike
    router.post("/dreams/:id/unlike", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, dream, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    id = req.params.id;
                    // Decrement likes count (don't go below 0)
                    return [4 /*yield*/, db_1.db
                            .update(schema_1.dreams)
                            .set({
                            likes: (0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["GREATEST(", " - 1, 0)"], ["GREATEST(", " - 1, 0)"])), schema_1.dreams.likes),
                        })
                            .where((0, drizzle_orm_1.eq)(schema_1.dreams.id, id))];
                case 1:
                    // Decrement likes count (don't go below 0)
                    _a.sent();
                    return [4 /*yield*/, db_1.db.select().from(schema_1.dreams).where((0, drizzle_orm_1.eq)(schema_1.dreams.id, id))];
                case 2:
                    dream = (_a.sent())[0];
                    res.json({ ok: true, likes: (dream === null || dream === void 0 ? void 0 : dream.likes) || 0 });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("Failed to unlike dream:", error_2);
                    res.status(500).json({ error: error_2.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // POST /api/dreams/:id/comment
    router.post("/dreams/:id/comment", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, _a, comment, userId, dream, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    id = req.params.id;
                    _a = req.body, comment = _a.comment, userId = _a.userId;
                    if (!comment) {
                        return [2 /*return*/, res.status(400).json({ error: "Comment text required" })];
                    }
                    // Increment comments count
                    return [4 /*yield*/, db_1.db
                            .update(schema_1.dreams)
                            .set({
                            comments: (0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["", " + 1"], ["", " + 1"])), schema_1.dreams.comments),
                        })
                            .where((0, drizzle_orm_1.eq)(schema_1.dreams.id, id))];
                case 1:
                    // Increment comments count
                    _b.sent();
                    return [4 /*yield*/, db_1.db.select().from(schema_1.dreams).where((0, drizzle_orm_1.eq)(schema_1.dreams.id, id))];
                case 2:
                    dream = (_b.sent())[0];
                    res.json({
                        ok: true,
                        comments: (dream === null || dream === void 0 ? void 0 : dream.comments) || 0,
                        comment: {
                            id: "comment-".concat(Date.now()),
                            text: comment,
                            userId: userId || "anonymous",
                            createdAt: new Date().toISOString(),
                        },
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _b.sent();
                    console.error("Failed to comment on dream:", error_3);
                    res.status(500).json({ error: error_3.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // POST /api/dreams/:id/remix
    router.post("/dreams/:id/remix", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, _a, name_1, description, userId, original, remix, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    id = req.params.id;
                    _a = req.body, name_1 = _a.name, description = _a.description, userId = _a.userId;
                    if (!name_1) {
                        return [2 /*return*/, res.status(400).json({ error: "Dream name required" })];
                    }
                    return [4 /*yield*/, db_1.db.select().from(schema_1.dreams).where((0, drizzle_orm_1.eq)(schema_1.dreams.id, id))];
                case 1:
                    original = (_b.sent())[0];
                    if (!original) {
                        return [2 /*return*/, res.status(404).json({ error: "Dream not found" })];
                    }
                    // Increment remix count on original
                    return [4 /*yield*/, db_1.db
                            .update(schema_1.dreams)
                            .set({
                            remixCount: (0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["", " + 1"], ["", " + 1"])), schema_1.dreams.remixCount),
                        })
                            .where((0, drizzle_orm_1.eq)(schema_1.dreams.id, id))];
                case 2:
                    // Increment remix count on original
                    _b.sent();
                    return [4 /*yield*/, db_1.db
                            .insert(schema_1.dreams)
                            .values({
                            name: name_1,
                            title: name_1,
                            description: description || "Remix of: ".concat(original.name || original.title),
                            creator: userId || "anonymous",
                            wallet: userId || "anonymous",
                            remixOf: id,
                            tags: original.tags || [],
                            status: "Draft",
                            dreamStatus: "pending",
                        })
                            .returning()];
                case 3:
                    remix = (_b.sent())[0];
                    res.json({ ok: true, remix: remix, remixCount: (original.remixCount || 0) + 1 });
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _b.sent();
                    console.error("Failed to remix dream:", error_4);
                    res.status(500).json({ error: error_4.message });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    // GET /api/dreams/:id/comments
    router.get("/dreams/:id/comments", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            try {
                id = req.params.id;
                // For now, return empty array - comments storage can be added later
                res.json({ ok: true, comments: [] });
            }
            catch (error) {
                console.error("Failed to get comments:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    return router;
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
