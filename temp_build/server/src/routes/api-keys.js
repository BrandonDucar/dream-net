"use strict";
/**
 * DreamNet API Keys Routes
 * Endpoints for users to create, manage, and revoke their API keys
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
var DreamNetApiKeyService_1 = require("../services/DreamNetApiKeyService");
var apiKeyAuth_1 = require("../middleware/apiKeyAuth");
var router = (0, express_1.Router)();
/**
 * POST /api/keys/create
 * Create a new API key
 * Requires wallet authentication (SIWE)
 */
router.post("/create", siwe_auth_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var walletAddress, _a, name_1, description, _b, permissions, _c, rateLimit, expiresInDays, result, error_1;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                walletAddress = (_d = req.user) === null || _d === void 0 ? void 0 : _d.walletAddress;
                if (!walletAddress) {
                    return [2 /*return*/, res.status(401).json({
                            error: "authentication_required",
                            message: "Wallet authentication required",
                        })];
                }
                _a = req.body, name_1 = _a.name, description = _a.description, _b = _a.permissions, permissions = _b === void 0 ? [] : _b, _c = _a.rateLimit, rateLimit = _c === void 0 ? 1000 : _c, expiresInDays = _a.expiresInDays;
                if (!name_1) {
                    return [2 /*return*/, res.status(400).json({
                            error: "name_required",
                            message: "API key name is required",
                        })];
                }
                return [4 /*yield*/, (0, DreamNetApiKeyService_1.createApiKey)({
                        walletAddress: walletAddress,
                        name: name_1,
                        description: description,
                        permissions: Array.isArray(permissions) ? permissions : [],
                        rateLimit: typeof rateLimit === "number" ? rateLimit : 1000,
                        expiresInDays: typeof expiresInDays === "number" ? expiresInDays : undefined,
                        createdBy: walletAddress,
                    })];
            case 1:
                result = _e.sent();
                // Return key info (plaintext key only shown once!)
                res.status(201).json({
                    success: true,
                    key: result.key, // ⚠️ Only shown once - user must save this!
                    keyInfo: {
                        id: result.keyInfo.id,
                        keyPrefix: result.keyInfo.keyPrefix,
                        name: result.keyInfo.name,
                        description: result.keyInfo.description,
                        permissions: result.keyInfo.permissions,
                        rateLimit: result.keyInfo.rateLimit,
                        expiresAt: result.keyInfo.expiresAt,
                        createdAt: result.keyInfo.createdAt,
                    },
                    warning: "⚠️ Save this API key now! It will not be shown again.",
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _e.sent();
                console.error("[APIKeys] Create error:", error_1);
                res.status(500).json({
                    error: "create_failed",
                    message: error_1.message || "Failed to create API key",
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/keys
 * List all API keys for the authenticated user
 */
router.get("/", siwe_auth_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var walletAddress, keys, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                walletAddress = (_a = req.user) === null || _a === void 0 ? void 0 : _a.walletAddress;
                if (!walletAddress) {
                    return [2 /*return*/, res.status(401).json({
                            error: "authentication_required",
                            message: "Wallet authentication required",
                        })];
                }
                return [4 /*yield*/, (0, DreamNetApiKeyService_1.listApiKeys)(undefined, walletAddress)];
            case 1:
                keys = _b.sent();
                res.json({
                    success: true,
                    keys: keys.map(function (key) { return ({
                        id: key.id,
                        keyPrefix: key.keyPrefix,
                        name: key.name,
                        description: key.description,
                        permissions: key.permissions,
                        rateLimit: key.rateLimit,
                        lastUsedAt: key.lastUsedAt,
                        expiresAt: key.expiresAt,
                        createdAt: key.createdAt,
                        revokedAt: key.revokedAt,
                        status: key.revokedAt ? "revoked" : key.expiresAt && new Date(key.expiresAt) < new Date() ? "expired" : "active",
                    }); }),
                    count: keys.length,
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error("[APIKeys] List error:", error_2);
                res.status(500).json({
                    error: "list_failed",
                    message: error_2.message || "Failed to list API keys",
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * DELETE /api/keys/:keyId
 * Revoke an API key
 */
router.delete("/:keyId", siwe_auth_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var walletAddress, keyId, revoked, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                walletAddress = (_a = req.user) === null || _a === void 0 ? void 0 : _a.walletAddress;
                if (!walletAddress) {
                    return [2 /*return*/, res.status(401).json({
                            error: "authentication_required",
                            message: "Wallet authentication required",
                        })];
                }
                keyId = req.params.keyId;
                return [4 /*yield*/, (0, DreamNetApiKeyService_1.revokeApiKey)(keyId, undefined, walletAddress)];
            case 1:
                revoked = _b.sent();
                if (revoked) {
                    res.json({
                        success: true,
                        message: "API key revoked successfully",
                    });
                }
                else {
                    res.status(404).json({
                        error: "key_not_found",
                        message: "API key not found or already revoked",
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error("[APIKeys] Revoke error:", error_3);
                res.status(500).json({
                    error: "revoke_failed",
                    message: error_3.message || "Failed to revoke API key",
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/keys/default
 * Get or create default API key for authenticated user
 * Returns existing default key info, or creates a new one
 */
router.get("/default", siwe_auth_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var walletAddress, result, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                walletAddress = (_a = req.user) === null || _a === void 0 ? void 0 : _a.walletAddress;
                if (!walletAddress) {
                    return [2 /*return*/, res.status(401).json({
                            error: "authentication_required",
                            message: "Wallet authentication required",
                        })];
                }
                return [4 /*yield*/, (0, DreamNetApiKeyService_1.getOrCreateDefaultApiKey)(walletAddress)];
            case 1:
                result = _b.sent();
                if (result.isNew) {
                    // New key created - return plaintext (only shown once!)
                    res.json({
                        success: true,
                        key: result.key, // ⚠️ Only shown once!
                        keyInfo: {
                            id: result.keyInfo.id,
                            keyPrefix: result.keyInfo.keyPrefix,
                            name: result.keyInfo.name,
                            description: result.keyInfo.description,
                            permissions: result.keyInfo.permissions,
                            rateLimit: result.keyInfo.rateLimit,
                            createdAt: result.keyInfo.createdAt,
                        },
                        warning: "⚠️ Save this API key now! It will not be shown again.",
                    });
                }
                else {
                    // Existing key - can't show plaintext, but return info
                    res.json({
                        success: true,
                        key: null, // Can't show plaintext for existing keys
                        keyInfo: {
                            id: result.keyInfo.id,
                            keyPrefix: result.keyInfo.keyPrefix,
                            name: result.keyInfo.name,
                            description: result.keyInfo.description,
                            permissions: result.keyInfo.permissions,
                            rateLimit: result.keyInfo.rateLimit,
                            lastUsedAt: result.keyInfo.lastUsedAt,
                            createdAt: result.keyInfo.createdAt,
                        },
                        message: "You already have a default API key. Use /api/keys/create to create additional keys.",
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                console.error("[APIKeys] Get default error:", error_4);
                res.status(500).json({
                    error: "get_default_failed",
                    message: error_4.message || "Failed to get default API key",
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/keys/validate
 * Validate an API key (for testing)
 * Can be called with API key auth to test it
 */
router.get("/validate", apiKeyAuth_1.requireApiKey, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var apiKey;
    return __generator(this, function (_a) {
        try {
            apiKey = req.apiKey;
            res.json({
                success: true,
                valid: true,
                keyInfo: {
                    id: apiKey.id,
                    keyPrefix: apiKey.keyPrefix,
                    name: apiKey.name,
                    permissions: apiKey.permissions,
                    rateLimit: apiKey.rateLimit,
                },
            });
        }
        catch (error) {
            res.status(500).json({
                error: "validation_failed",
                message: error.message || "Failed to validate API key",
            });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
