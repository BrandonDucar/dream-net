"use strict";
/**
 * Debug Summary Endpoint
 * Admin-only endpoint to see Env Keeper, API Keeper, and Vercel Agent summaries
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
var siwe_auth_1 = require("../siwe-auth");
var env_keeper_core_1 = require("../../packages/env-keeper-core");
var api_keeper_core_1 = require("../../packages/api-keeper-core");
var dreamnet_vercel_agent_1 = require("../../packages/dreamnet-vercel-agent");
var envClassifier_1 = require("../../packages/env-keeper-core/logic/envClassifier");
var router = (0, express_1.Router)();
/**
 * GET /api/debug-summary
 * Get summary of Env Keeper, API Keeper, and Vercel Agent (admin-only)
 */
router.get("/", siwe_auth_1.requireAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var envStatus, secretDescriptors, internalDescriptors, publicDescriptors, apiStatus, apiKeys, keysByProvider, _i, apiKeys_1, key, vercelStatus, error_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                envStatus = env_keeper_core_1.EnvKeeperCore.status();
                secretDescriptors = (0, envClassifier_1.getDescriptorsBySensitivity)("secret");
                internalDescriptors = (0, envClassifier_1.getDescriptorsBySensitivity)("internal");
                publicDescriptors = (0, envClassifier_1.getDescriptorsBySensitivity)("public");
                apiStatus = api_keeper_core_1.APIKeeperCore.status();
                apiKeys = api_keeper_core_1.APIKeeperCore.listKeys();
                keysByProvider = {};
                for (_i = 0, apiKeys_1 = apiKeys; _i < apiKeys_1.length; _i++) {
                    key = apiKeys_1[_i];
                    keysByProvider[key.providerId] = (keysByProvider[key.providerId] || 0) + 1;
                }
                vercelStatus = void 0;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dreamnet_vercel_agent_1.DreamNetVercelAgent.status()];
            case 2:
                vercelStatus = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                vercelStatus = { initialized: false, error: error_1.message };
                return [3 /*break*/, 4];
            case 4:
                res.json({
                    success: true,
                    envKeeper: {
                        totalVars: envStatus.totalVars,
                        secretsCount: envStatus.secretsCount,
                        internalCount: internalDescriptors.length,
                        publicCount: publicDescriptors.length,
                        categories: envStatus.categories,
                        lastSyncAt: envStatus.lastSyncAt,
                    },
                    apiKeeper: {
                        providerCount: apiStatus.providerCount,
                        activeProviderCount: apiStatus.activeProviderCount,
                        keyCount: apiStatus.keyCount,
                        activeKeyCount: apiStatus.activeKeyCount,
                        keysByProvider: keysByProvider, // Counts only, no raw keys
                        costToday: apiStatus.costToday,
                        costThisMonth: apiStatus.costThisMonth,
                    },
                    vercelAgent: {
                        initialized: vercelStatus.initialized,
                        projectsFound: vercelStatus.projectsFound || 0,
                        deploymentsFound: vercelStatus.deploymentsFound || 0,
                        lastSyncAt: vercelStatus.lastSyncAt || null,
                    },
                });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                res.status(500).json({ error: error_2.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
