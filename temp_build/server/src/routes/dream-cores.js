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
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = express_1.default.Router();
var storage_1 = require("../storage");
// Dream Core spawning with access level-based features
router.post('/spawn', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, dreamContent, accessLevel, walletScore, coreTypes, coreType, coreId, baseCore, coreFeatures, dreamCoreData, dbError_1, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, dreamContent = _a.dreamContent, accessLevel = _a.accessLevel, walletScore = _a.walletScore;
                if (!dreamContent || !accessLevel) {
                    return [2 /*return*/, res.status(400).json({ error: 'Dream content and access level required' })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                console.log("\u2728 [DREAM-CORES] Spawning ".concat(accessLevel, " core..."));
                coreTypes = ['Vision', 'Tool', 'Movement', 'Story'];
                coreType = coreTypes[Math.floor(Math.random() * coreTypes.length)];
                coreId = "core_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 6));
                baseCore = {
                    id: coreId,
                    dreamContent: dreamContent.substring(0, 500), // Truncate for storage
                    coreType: coreType,
                    accessLevel: accessLevel,
                    walletScore: walletScore,
                    spawned_at: new Date().toISOString(),
                    energy_level: Math.floor(Math.random() * 40) + 60, // 60-100
                    resonance_frequency: Math.random() * 2 + 1, // 1-3 Hz
                    stability: Math.floor(Math.random() * 30) + 70, // 70-100
                };
                coreFeatures = void 0;
                if (accessLevel === 'CRADLE') {
                    coreFeatures = __assign(__assign({}, baseCore), { premium_features: {
                            enhanced_processing: true,
                            collaborative_mode: true,
                            advanced_analytics: true,
                            priority_queue: true,
                            custom_visualizations: true
                        }, capabilities: [
                            'multi_dimensional_analysis',
                            'cross_dream_correlation',
                            'predictive_modeling',
                            'collective_consciousness_tap',
                            'reality_bridge_access'
                        ], max_evolution_stages: 7, bot_access: ['all_bots', 'premium_exclusive'], processing_speed: 'enhanced', storage_limit: 'unlimited' });
                }
                else {
                    // SEED access
                    coreFeatures = __assign(__assign({}, baseCore), { basic_features: {
                            standard_processing: true,
                            community_mode: true,
                            basic_analytics: true,
                            standard_queue: true,
                            template_visualizations: true
                        }, capabilities: [
                            'basic_analysis',
                            'pattern_recognition',
                            'simple_correlation',
                            'community_sharing'
                        ], max_evolution_stages: 3, bot_access: ['basic_bots', 'community_bots'], processing_speed: 'standard', storage_limit: '100MB' });
                }
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                dreamCoreData = {
                    coreId: coreId,
                    type: coreType,
                    energy: coreFeatures.energy_level,
                    resonance: coreFeatures.resonance_frequency,
                    lucidity: baseCore.stability,
                    memory: dreamContent.substring(0, 200),
                    wallet: 'demo_wallet'
                };
                return [4 /*yield*/, storage_1.storage.createDreamCore(dreamCoreData)];
            case 3:
                _b.sent();
                return [3 /*break*/, 5];
            case 4:
                dbError_1 = _b.sent();
                console.log('⚠️ [DREAM-CORES] Database storage failed, continuing with memory storage');
                return [3 /*break*/, 5];
            case 5:
                console.log("\uD83C\uDF1F [DREAM-CORES] ".concat(accessLevel, " core spawned: ").concat(coreId));
                res.json({
                    success: true,
                    dreamCore: coreFeatures,
                    spawning_details: {
                        processing_pipeline: ['LUCID', 'CANVAS', 'ROOT', 'ECHO'],
                        access_gates_passed: accessLevel === 'CRADLE' ? 'all' : 'basic',
                        unlock_conditions: accessLevel === 'CRADLE'
                            ? 'High wallet score (75+)'
                            : 'Standard access',
                        next_evolution_threshold: accessLevel === 'CRADLE' ? 85 : 70
                    }
                });
                return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                console.error('❌ [DREAM-CORES] Spawning failed:', error_1);
                res.status(500).json({ error: 'Dream core spawning failed' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// Get dream core details
router.get('/:coreId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var coreId, mockCore;
    return __generator(this, function (_a) {
        coreId = req.params.coreId;
        try {
            mockCore = {
                id: coreId,
                status: 'active',
                current_stage: Math.floor(Math.random() * 4) + 1,
                evolution_progress: Math.floor(Math.random() * 100),
                last_activity: new Date().toISOString()
            };
            res.json(mockCore);
        }
        catch (error) {
            res.status(500).json({ error: 'Core retrieval failed' });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
