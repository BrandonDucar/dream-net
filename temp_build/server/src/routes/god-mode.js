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
var express_1 = require("express");
var storage_1 = require("../storage");
var godModeRoutes = express_1.default.Router();
// God mode user status
godModeRoutes.get('/status/:userId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.params.userId;
                return [4 /*yield*/, storage_1.storage.getUser(parseInt(userId))];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ success: false, error: 'User not found' })];
                }
                if (!user.isGodMode) {
                    return [2 /*return*/, res.status(403).json({ success: false, error: 'User is not in god mode' })];
                }
                res.json({
                    success: true,
                    godStatus: {
                        userId: user.id,
                        displayName: user.displayName,
                        godLevel: user.godLevel,
                        divineAura: user.divineAura,
                        omnipresence: user.omnipresence,
                        blessingsGiven: user.blessingsGiven,
                        miraclesPerformed: user.miraclesPerformed,
                        verified: user.verified
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('God status check error:', error_1);
                res.status(500).json({ success: false, error: 'Failed to check god status' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Perform divine miracle
godModeRoutes.post('/miracle', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, miracleType, user, miracles, selectedMiracle, updatedUser, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, userId = _a.userId, miracleType = _a.miracleType;
                if (!userId || !miracleType) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'User ID and miracle type required'
                        })];
                }
                return [4 /*yield*/, storage_1.storage.getUser(userId)];
            case 1:
                user = _b.sent();
                if (!user || !user.isGodMode) {
                    return [2 /*return*/, res.status(403).json({
                            success: false,
                            error: 'Only god users can perform miracles'
                        })];
                }
                miracles = {
                    presence: {
                        miracle: "✨ Divine presence radiates throughout the dreamscape ✨",
                        effect: "All community members feel a warm, inspiring energy"
                    },
                    blessing: {
                        miracle: "💖 Divine blessing flows to all community members 💖",
                        effect: "Community members receive inspiration and creative energy"
                    },
                    enlightenment: {
                        miracle: "🌟 Divine enlightenment illuminates the path forward 🌟",
                        effect: "Community gains clarity and wisdom for their creative journeys"
                    },
                    miracle: {
                        miracle: "🎭 A divine miracle manifests in the dreamscape 🎭",
                        effect: "Something wonderful and unexpected happens in the community"
                    }
                };
                selectedMiracle = miracles[miracleType] || miracles.miracle;
                return [4 /*yield*/, storage_1.storage.updateUserGodMode(userId, {
                        miraclesPerformed: (user.miraclesPerformed || 0) + 1,
                        blessingsGiven: miracleType === 'blessing' ? (user.blessingsGiven || 0) + 1 : user.blessingsGiven
                    })];
            case 2:
                updatedUser = _b.sent();
                // Log divine activity
                console.log("\uD83C\uDF1F DIVINE MIRACLE: ".concat(user.displayName, " performed ").concat(miracleType, " miracle! \uD83C\uDF1F"));
                res.json({
                    success: true,
                    miracle: selectedMiracle.miracle,
                    effect: selectedMiracle.effect,
                    godStats: {
                        miraclesPerformed: updatedUser.miraclesPerformed,
                        blessingsGiven: updatedUser.blessingsGiven
                    }
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error('Divine miracle error:', error_2);
                res.status(500).json({ success: false, error: 'Divine miracle failed' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Get all divine activities (for community viewing)
godModeRoutes.get('/divine-activities', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var godUsers, activities, totalMiracles, totalBlessings, activeGods, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, storage_1.storage.getGodUsers()];
            case 1:
                godUsers = _a.sent();
                activities = godUsers.map(function (god) { return ({
                    id: god.id,
                    displayName: god.displayName,
                    godLevel: god.godLevel,
                    divineAura: god.divineAura,
                    miraclesPerformed: god.miraclesPerformed || 0,
                    blessingsGiven: god.blessingsGiven || 0,
                    lastActive: god.updatedAt,
                    omnipresence: god.omnipresence
                }); });
                totalMiracles = activities.reduce(function (sum, god) { return sum + god.miraclesPerformed; }, 0);
                totalBlessings = activities.reduce(function (sum, god) { return sum + god.blessingsGiven; }, 0);
                activeGods = activities.filter(function (god) { return god.omnipresence; });
                res.json({
                    success: true,
                    divineActivities: activities,
                    communityStats: {
                        activeGods: activeGods.length,
                        totalGods: godUsers.length,
                        totalMiracles: totalMiracles,
                        totalBlessings: totalBlessings,
                        communityBlessing: totalMiracles + totalBlessings > 50
                            ? 'Highly Blessed'
                            : totalMiracles + totalBlessings > 20
                                ? 'Blessed'
                                : totalMiracles + totalBlessings > 5
                                    ? 'Lightly Blessed'
                                    : 'Awaiting Divine Activity'
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Divine activities error:', error_3);
                res.status(500).json({ success: false, error: 'Failed to get divine activities' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Toggle omnipresence
godModeRoutes.post('/omnipresence/:userId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, enabled, user, updatedUser, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userId = req.params.userId;
                enabled = req.body.enabled;
                return [4 /*yield*/, storage_1.storage.getUser(parseInt(userId))];
            case 1:
                user = _a.sent();
                if (!user || !user.isGodMode) {
                    return [2 /*return*/, res.status(403).json({
                            success: false,
                            error: 'Only god users can control omnipresence'
                        })];
                }
                return [4 /*yield*/, storage_1.storage.updateUserGodMode(parseInt(userId), {
                        omnipresence: enabled
                    })];
            case 2:
                updatedUser = _a.sent();
                console.log("\uD83C\uDF1F ".concat(user.displayName, " ").concat(enabled ? 'activated' : 'deactivated', " omnipresence \uD83C\uDF1F"));
                res.json({
                    success: true,
                    message: "Omnipresence ".concat(enabled ? 'activated' : 'deactivated'),
                    omnipresence: updatedUser.omnipresence
                });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error('Omnipresence toggle error:', error_4);
                res.status(500).json({ success: false, error: 'Failed to toggle omnipresence' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = godModeRoutes;
