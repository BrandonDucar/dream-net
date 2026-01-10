"use strict";
/**
 * DreamNet API Key Authentication Middleware
 * Validates API keys from Authorization header or X-API-Key header
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
exports.requireApiKey = requireApiKey;
exports.optionalApiKey = optionalApiKey;
exports.requirePermission = requirePermission;
var DreamNetApiKeyService_1 = require("../services/DreamNetApiKeyService");
/**
 * Middleware to authenticate requests using DreamNet API keys
 * Supports:
 * - Authorization: Bearer dn_live_...
 * - X-API-Key: dn_live_...
 */
function requireApiKey(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var apiKey, authHeader, keyInfo, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    apiKey = void 0;
                    authHeader = req.headers.authorization;
                    if (authHeader && authHeader.startsWith("Bearer ")) {
                        apiKey = authHeader.substring(7);
                    }
                    else if (req.headers["x-api-key"]) {
                        // Fallback to X-API-Key header
                        apiKey = req.headers["x-api-key"];
                    }
                    if (!apiKey) {
                        return [2 /*return*/, res.status(401).json({
                                error: "api_key_required",
                                message: "DreamNet API key required. Include in Authorization: Bearer <key> or X-API-Key header.",
                                hint: "Get your API key at /api/keys/create",
                            })];
                    }
                    return [4 /*yield*/, (0, DreamNetApiKeyService_1.validateApiKey)(apiKey)];
                case 1:
                    keyInfo = _a.sent();
                    if (!keyInfo) {
                        return [2 /*return*/, res.status(401).json({
                                error: "invalid_api_key",
                                message: "Invalid or expired API key",
                            })];
                    }
                    // Attach key info to request
                    req.apiKey = {
                        id: keyInfo.id,
                        keyPrefix: keyInfo.keyPrefix,
                        name: keyInfo.name,
                        permissions: keyInfo.permissions,
                        rateLimit: keyInfo.rateLimit,
                        userId: req.userId,
                        walletAddress: req.walletAddress,
                    };
                    next();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("[APIKeyAuth] Error validating API key:", error_1);
                    return [2 /*return*/, res.status(500).json({
                            error: "authentication_error",
                            message: "Failed to validate API key",
                        })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Optional API key authentication (doesn't fail if missing)
 * Useful for endpoints that support both API key and wallet auth
 */
function optionalApiKey(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, apiKey, keyInfo, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    authHeader = req.headers.authorization;
                    apiKey = void 0;
                    if (authHeader && authHeader.startsWith("Bearer ")) {
                        apiKey = authHeader.substring(7);
                    }
                    else if (req.headers["x-api-key"]) {
                        apiKey = req.headers["x-api-key"];
                    }
                    if (!apiKey) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, DreamNetApiKeyService_1.validateApiKey)(apiKey)];
                case 1:
                    keyInfo = _a.sent();
                    if (keyInfo) {
                        req.apiKey = {
                            id: keyInfo.id,
                            keyPrefix: keyInfo.keyPrefix,
                            name: keyInfo.name,
                            permissions: keyInfo.permissions,
                            rateLimit: keyInfo.rateLimit,
                        };
                    }
                    _a.label = 2;
                case 2:
                    next();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    // Don't fail on optional auth errors
                    next();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Check if API key has required permission
 */
function requirePermission(permission) {
    return function (req, res, next) {
        if (!req.apiKey) {
            return res.status(401).json({
                error: "api_key_required",
                message: "API key authentication required",
            });
        }
        if (!req.apiKey.permissions.includes(permission) && !req.apiKey.permissions.includes("*")) {
            return res.status(403).json({
                error: "insufficient_permissions",
                message: "API key missing required permission: ".concat(permission),
                required: permission,
                has: req.apiKey.permissions,
            });
        }
        next();
    };
}
