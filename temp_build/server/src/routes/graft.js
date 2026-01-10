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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraftRouter = createGraftRouter;
var express_1 = require("express");
var node_crypto_1 = require("node:crypto");
var graft_engine_1 = require("../../packages/graft-engine");
var DEFAULT_INTERNAL_URL = "http://127.0.0.1:".concat((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 5000);
function createInstallTask(graftId) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch("".concat(DEFAULT_INTERNAL_URL, "/api/squad/tasks"), {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                task: {
                                    type: "graft.install",
                                    payload: { graftId: graftId },
                                    priority: "high",
                                },
                            }),
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    // best-effort only
                    console.warn("[graft] Unable to schedule squad task:", error_1.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createGraftRouter() {
    var _this = this;
    var router = (0, express_1.Router)();
    router.post("/", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, type, name, graftPath, _b, metadata, graft, error_2;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = (_c = req.body) !== null && _c !== void 0 ? _c : {}, type = _a.type, name = _a.name, graftPath = _a.path, _b = _a.metadata, metadata = _b === void 0 ? {} : _b;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, graft_engine_1.submitGraft)({
                            id: (0, node_crypto_1.randomUUID)(),
                            type: type,
                            name: name,
                            path: graftPath,
                            metadata: metadata,
                        })];
                case 2:
                    graft = _d.sent();
                    // fire-and-forget squad task
                    void createInstallTask(graft.id);
                    res.status(201).json({ ok: true, graft: graft });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _d.sent();
                    res.status(500).json({ ok: false, error: error_2.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    router.get("/", function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
        var grafts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, graft_engine_1.getGrafts)()];
                case 1:
                    grafts = _a.sent();
                    res.json({ ok: true, grafts: grafts });
                    return [2 /*return*/];
            }
        });
    }); });
    router.get("/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var graft;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, graft_engine_1.getGraftById)(req.params.id)];
                case 1:
                    graft = _a.sent();
                    if (!graft) {
                        res.status(404).json({ ok: false, error: "graft not found" });
                        return [2 /*return*/];
                    }
                    res.json({ ok: true, graft: graft });
                    return [2 /*return*/];
            }
        });
    }); });
    router.post("/:id/validate", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var graft, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, graft_engine_1.getGraftById)(req.params.id)];
                case 1:
                    graft = _a.sent();
                    if (!graft) {
                        res.status(404).json({ ok: false, error: "graft not found" });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, graft_engine_1.validateGraft)(graft)];
                case 2:
                    result = _a.sent();
                    res.json({ ok: result.ok, issues: result.issues });
                    return [2 /*return*/];
            }
        });
    }); });
    router.post("/:id/install", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var graft, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, graft_engine_1.applyGraft)(req.params.id)];
                case 1:
                    graft = _a.sent();
                    res.json({ ok: true, graft: graft });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    res.status(400).json({ ok: false, error: error_3.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    router.delete("/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, graft_engine_1.removeGraft)(req.params.id)];
                case 1:
                    _a.sent();
                    res.json({ ok: true });
                    return [2 /*return*/];
            }
        });
    }); });
    return router;
}
