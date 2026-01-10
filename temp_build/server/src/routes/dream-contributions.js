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
exports.createDreamContributionsRouter = createDreamContributionsRouter;
var express_1 = require("express");
var db_1 = require("../db");
var schema_1 = require("../../shared/schema");
var drizzle_orm_1 = require("drizzle-orm");
function createDreamContributionsRouter() {
    var _this = this;
    var router = (0, express_1.Router)();
    // POST /api/dreams/:id/contribute
    router.post("/dreams/:id/contribute", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, dreamId, _a, type, amount, token, skill, service, message, dream, currentBlessings, newBlessing, currentContributors, role, existingContributor, newContributor, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    userId = req.headers["x-user-id"];
                    if (!userId) {
                        return [2 /*return*/, res.status(401).json({ error: "Unauthorized: User ID required" })];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 10, , 11]);
                    dreamId = req.params.id;
                    _a = req.body, type = _a.type, amount = _a.amount, token = _a.token, skill = _a.skill, service = _a.service, message = _a.message;
                    if (!type) {
                        return [2 /*return*/, res.status(400).json({ error: "Contribution type is required" })];
                    }
                    return [4 /*yield*/, db_1.db.query.dreams.findFirst({
                            where: (0, drizzle_orm_1.eq)(schema_1.dreams.id, dreamId),
                        })];
                case 2:
                    dream = _b.sent();
                    if (!dream) {
                        return [2 /*return*/, res.status(404).json({ error: "Dream not found" })];
                    }
                    if (!(type === 'financial')) return [3 /*break*/, 4];
                    currentBlessings = dream.blessings || [];
                    newBlessing = {
                        wallet: userId,
                        message: message || "Contributed ".concat(amount, " ").concat(token),
                        amount: parseFloat(amount),
                        timestamp: Date.now(),
                    };
                    return [4 /*yield*/, db_1.db
                            .update(schema_1.dreams)
                            .set({
                            blessings: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", " || ", "::jsonb"], ["", " || ", "::jsonb"])), schema_1.dreams.blessings, JSON.stringify([newBlessing])),
                            xp: (0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", " + ", ""], ["", " + ", ""])), schema_1.dreams.xp, Math.floor(parseFloat(amount) * 10)), // Award XP based on contribution
                        })
                            .where((0, drizzle_orm_1.eq)(schema_1.dreams.id, dreamId))];
                case 3:
                    _b.sent();
                    res.json({
                        ok: true,
                        message: "Thank you for contributing ".concat(amount, " ").concat(token, "!"),
                        contribution: newBlessing,
                    });
                    return [3 /*break*/, 9];
                case 4:
                    if (!(type === 'skill' || type === 'service')) return [3 /*break*/, 8];
                    currentContributors = dream.contributors || [];
                    role = 'Builder';
                    if (skill) {
                        if (skill === 'coding')
                            role = 'Coder';
                        else if (skill === 'design')
                            role = 'Artist';
                        else if (skill === 'marketing' || skill === 'community')
                            role = 'Promoter';
                        else if (skill === 'strategy' || skill === 'writing')
                            role = 'Visionary';
                    }
                    existingContributor = currentContributors.find(function (c) { return c.wallet.toLowerCase() === userId.toLowerCase(); });
                    if (!!existingContributor) return [3 /*break*/, 6];
                    newContributor = {
                        wallet: userId,
                        role: role,
                        joinedAt: new Date().toISOString(),
                    };
                    return [4 /*yield*/, db_1.db
                            .update(schema_1.dreams)
                            .set({
                            contributors: (0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["", " || ", "::jsonb"], ["", " || ", "::jsonb"])), schema_1.dreams.contributors, JSON.stringify([newContributor])),
                            xp: (0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["", " + 50"], ["", " + 50"])), schema_1.dreams.xp), // Award XP for skill contribution
                        })
                            .where((0, drizzle_orm_1.eq)(schema_1.dreams.id, dreamId))];
                case 5:
                    _b.sent();
                    res.json({
                        ok: true,
                        message: "Thank you for offering your ".concat(skill || 'service', "! You've been added as a ").concat(role, "."),
                        contributor: newContributor,
                    });
                    return [3 /*break*/, 7];
                case 6:
                    res.json({
                        ok: true,
                        message: "You're already contributing to this dream as a ".concat(existingContributor.role, "."),
                        contributor: existingContributor,
                    });
                    _b.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8: return [2 /*return*/, res.status(400).json({ error: "Invalid contribution type" })];
                case 9: return [3 /*break*/, 11];
                case 10:
                    error_1 = _b.sent();
                    console.error("Failed to record contribution:", error_1);
                    res.status(500).json({ error: error_1.message });
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    }); });
    // GET /api/dreams/:id/contributions
    router.get("/dreams/:id/contributions", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var dreamId, dream, contributions, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    dreamId = req.params.id;
                    return [4 /*yield*/, db_1.db.query.dreams.findFirst({
                            where: (0, drizzle_orm_1.eq)(schema_1.dreams.id, dreamId),
                        })];
                case 1:
                    dream = _a.sent();
                    if (!dream) {
                        return [2 /*return*/, res.status(404).json({ error: "Dream not found" })];
                    }
                    contributions = {
                        financial: dream.blessings || [],
                        contributors: dream.contributors || [],
                    };
                    res.json({ ok: true, contributions: contributions });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error("Failed to fetch contributions:", error_2);
                    res.status(500).json({ error: error_2.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    return router;
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
