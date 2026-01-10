"use strict";
/**
 * Shield Core API Routes
 * Multi-phase shield system with rotating frequencies
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
var controlCoreMiddleware_1 = require("../../packages/dreamnet-control-core/controlCoreMiddleware");
var router = express_1.default.Router();
// Shield Core is optional - handle missing package gracefully
var ShieldCore = null;
function getShieldCore() {
    return __awaiter(this, void 0, void 0, function () {
        var shieldModule, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (ShieldCore)
                        return [2 /*return*/, ShieldCore];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../../packages/shield-core"); })];
                case 2:
                    shieldModule = _a.sent();
                    ShieldCore = shieldModule.ShieldCore;
                    return [2 /*return*/, ShieldCore];
                case 3:
                    error_1 = _a.sent();
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// GET /api/shield - Get Shield Core status
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var core, status_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getShieldCore()];
            case 1:
                core = _a.sent();
                if (!core) {
                    return [2 /*return*/, res.status(503).json({ error: "Shield Core not available" })];
                }
                status_1 = core.status();
                res.json({
                    success: true,
                    shield: status_1,
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json({ error: error_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/shield/layers - Get all shield layers
router.get("/layers", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var core, layers, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getShieldCore()];
            case 1:
                core = _a.sent();
                if (!core) {
                    return [2 /*return*/, res.status(503).json({ error: "Shield Core not available" })];
                }
                layers = core.listLayers();
                res.json({ success: true, layers: layers, count: layers.length });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json({ error: error_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/shield/threats - Get all threats
router.get("/threats", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var core, threats, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getShieldCore()];
            case 1:
                core = _a.sent();
                if (!core) {
                    return [2 /*return*/, res.status(503).json({ error: "Shield Core not available" })];
                }
                threats = core.listThreats();
                res.json({ success: true, threats: threats, count: threats.length });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(500).json({ error: error_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/shield/spikes - Get offensive spikes
router.get("/spikes", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var core, spikes, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getShieldCore()];
            case 1:
                core = _a.sent();
                if (!core) {
                    return [2 /*return*/, res.status(503).json({ error: "Shield Core not available" })];
                }
                spikes = core.listSpikes();
                res.json({ success: true, spikes: spikes, count: spikes.length });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.status(500).json({ error: error_5.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/shield/cellular - Get cellular shields
router.get("/cellular", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var core, shields, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getShieldCore()];
            case 1:
                core = _a.sent();
                if (!core) {
                    return [2 /*return*/, res.status(503).json({ error: "Shield Core not available" })];
                }
                shields = core.listCellularShields();
                res.json({ success: true, shields: shields, count: shields.length });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                res.status(500).json({ error: error_6.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/shield/cross-chain - Get cross-chain shields
router.get("/cross-chain", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var core, shields, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getShieldCore()];
            case 1:
                core = _a.sent();
                if (!core) {
                    return [2 /*return*/, res.status(503).json({ error: "Shield Core not available" })];
                }
                shields = core.listCrossChainShields();
                res.json({ success: true, shields: shields, count: shields.length });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                res.status(500).json({ error: error_7.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/shield/adjust-phase - Adjust shield phase (requires SHIELD_COMMANDER office)
router.post("/adjust-phase", (0, controlCoreMiddleware_1.withGovernance)({
    clusterId: "SHIELD_CORE",
    requiredOfficeId: "SHIELD_COMMANDER",
}), function (req, res) {
    try {
        var _a = req.body, phase = _a.phase, strength = _a.strength;
        // Example: ShieldCore.adjustPhase(phase, strength);
        res.json({
            success: true,
            message: "Shield phase adjusted",
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/shield/rotate - Rotate shield frequencies
router.post("/rotate", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var core, status_2, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getShieldCore()];
            case 1:
                core = _a.sent();
                if (!core) {
                    return [2 /*return*/, res.status(503).json({ error: "Shield Core not available" })];
                }
                core.rotateFrequencies();
                status_2 = core.status();
                res.json({
                    success: true,
                    message: "Shield frequencies rotated",
                    shield: status_2,
                });
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                res.status(500).json({ error: error_8.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/shield/detect - Detect a threat
router.post("/detect", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var core, _a, type, level, source, target, payload, threat, error_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getShieldCore()];
            case 1:
                core = _b.sent();
                if (!core) {
                    return [2 /*return*/, res.status(503).json({ error: "Shield Core not available" })];
                }
                _a = req.body, type = _a.type, level = _a.level, source = _a.source, target = _a.target, payload = _a.payload;
                threat = core.detectThreat(type, level, source, target, payload);
                res.json({ success: true, threat: threat });
                return [3 /*break*/, 3];
            case 2:
                error_9 = _b.sent();
                res.status(500).json({ error: error_9.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/shield/fire-spike - Fire an offensive spike
router.post("/fire-spike", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var core, _a, name_1, type, target, intensity, spike, error_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getShieldCore()];
            case 1:
                core = _b.sent();
                if (!core) {
                    return [2 /*return*/, res.status(503).json({ error: "Shield Core not available" })];
                }
                _a = req.body, name_1 = _a.name, type = _a.type, target = _a.target, intensity = _a.intensity;
                spike = core.fireSpike(name_1, type, target, intensity);
                res.json({ success: true, spike: spike });
                return [3 /*break*/, 3];
            case 2:
                error_10 = _b.sent();
                res.status(500).json({ error: error_10.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
