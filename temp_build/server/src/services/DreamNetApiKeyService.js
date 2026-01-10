"use strict";
/**
 * DreamNet API Key Service
 * Generates and manages API keys for users to authenticate with DreamNet API
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiKey = createApiKey;
exports.validateApiKey = validateApiKey;
exports.listApiKeys = listApiKeys;
exports.revokeApiKey = revokeApiKey;
exports.getApiKeyById = getApiKeyById;
exports.getOrCreateDefaultApiKey = getOrCreateDefaultApiKey;
var crypto_1 = require("crypto");
var db_1 = require("../db");
var schema_1 = require("../../shared/schema");
var drizzle_orm_1 = require("drizzle-orm");
/**
 * Generate a secure API key
 * Format: dn_live_<64 random hex chars>
 */
function generateApiKey() {
    var randomBytes = crypto_1.default.randomBytes(32); // 32 bytes = 64 hex chars
    var key = "dn_live_".concat(randomBytes.toString("hex"));
    return key;
}
/**
 * Hash API key for storage (SHA-256)
 */
function hashApiKey(key) {
    return crypto_1.default.createHash("sha256").update(key).digest("hex");
}
/**
 * Get key prefix for display (first 8 chars after dn_live_)
 */
function getKeyPrefix(key) {
    var _a;
    var parts = key.split("_");
    if (parts.length >= 3) {
        return parts.slice(0, 3).join("_") + "_" + ((_a = parts[2]) === null || _a === void 0 ? void 0 : _a.substring(0, 8));
    }
    return key.substring(0, 16);
}
/**
 * Create a new API key
 * Returns the plaintext key (only shown once) and key info
 */
function createApiKey(options) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, walletAddress, name, description, _a, permissions, _b, rateLimit, expiresInDays, createdBy, plaintextKey, keyHash, keyPrefix, expiresAt, inserted, keyInfo;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    userId = options.userId, walletAddress = options.walletAddress, name = options.name, description = options.description, _a = options.permissions, permissions = _a === void 0 ? [] : _a, _b = options.rateLimit, rateLimit = _b === void 0 ? 1000 : _b, expiresInDays = options.expiresInDays, createdBy = options.createdBy;
                    if (!userId && !walletAddress) {
                        throw new Error("Either userId or walletAddress must be provided");
                    }
                    plaintextKey = generateApiKey();
                    keyHash = hashApiKey(plaintextKey);
                    keyPrefix = getKeyPrefix(plaintextKey);
                    expiresAt = expiresInDays
                        ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
                        : null;
                    return [4 /*yield*/, db_1.db
                            .insert(schema_1.dreamnetApiKeys)
                            .values({
                            keyHash: keyHash,
                            keyPrefix: keyPrefix,
                            userId: userId || null,
                            walletAddress: walletAddress || null,
                            name: name,
                            description: description || null,
                            permissions: permissions,
                            rateLimit: rateLimit,
                            expiresAt: expiresAt || null,
                            createdBy: createdBy || walletAddress || userId || null,
                        })
                            .returning()];
                case 1:
                    inserted = (_c.sent())[0];
                    keyInfo = {
                        id: inserted.id,
                        keyPrefix: inserted.keyPrefix,
                        name: inserted.name,
                        description: inserted.description || undefined,
                        permissions: inserted.permissions || [],
                        rateLimit: inserted.rateLimit || 1000,
                        lastUsedAt: inserted.lastUsedAt || null,
                        expiresAt: inserted.expiresAt || null,
                        createdAt: inserted.createdAt,
                        revokedAt: inserted.revokedAt || null,
                    };
                    return [2 /*return*/, {
                            key: plaintextKey, // Only returned once!
                            keyInfo: keyInfo,
                        }];
            }
        });
    });
}
/**
 * Validate API key and return key info
 */
function validateApiKey(key) {
    return __awaiter(this, void 0, void 0, function () {
        var keyHash, keyRecord;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    keyHash = hashApiKey(key);
                    return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.dreamnetApiKeys)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.dreamnetApiKeys.keyHash, keyHash), (0, drizzle_orm_1.isNull)(schema_1.dreamnetApiKeys.revokedAt) // Not revoked
                        ))
                            .limit(1)];
                case 1:
                    keyRecord = (_a.sent())[0];
                    if (!keyRecord) {
                        return [2 /*return*/, null];
                    }
                    // Check expiration
                    if (keyRecord.expiresAt && new Date(keyRecord.expiresAt) < new Date()) {
                        return [2 /*return*/, null];
                    }
                    // Update last used timestamp
                    return [4 /*yield*/, db_1.db
                            .update(schema_1.dreamnetApiKeys)
                            .set({ lastUsedAt: new Date() })
                            .where((0, drizzle_orm_1.eq)(schema_1.dreamnetApiKeys.id, keyRecord.id))];
                case 2:
                    // Update last used timestamp
                    _a.sent();
                    return [2 /*return*/, {
                            id: keyRecord.id,
                            keyPrefix: keyRecord.keyPrefix,
                            name: keyRecord.name,
                            description: keyRecord.description || undefined,
                            permissions: keyRecord.permissions || [],
                            rateLimit: keyRecord.rateLimit || 1000,
                            lastUsedAt: keyRecord.lastUsedAt || null,
                            expiresAt: keyRecord.expiresAt || null,
                            createdAt: keyRecord.createdAt,
                            revokedAt: keyRecord.revokedAt || null,
                        }];
            }
        });
    });
}
/**
 * List API keys for a user/wallet
 */
function listApiKeys(userId, walletAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var conditions, keys;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!userId && !walletAddress) {
                        throw new Error("Either userId or walletAddress must be provided");
                    }
                    conditions = [];
                    if (userId) {
                        conditions.push((0, drizzle_orm_1.eq)(schema_1.dreamnetApiKeys.userId, userId));
                    }
                    if (walletAddress) {
                        conditions.push((0, drizzle_orm_1.eq)(schema_1.dreamnetApiKeys.walletAddress, walletAddress));
                    }
                    return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.dreamnetApiKeys)
                            .where(drizzle_orm_1.and.apply(void 0, conditions))
                            .orderBy(schema_1.dreamnetApiKeys.createdAt)];
                case 1:
                    keys = _a.sent();
                    return [2 /*return*/, keys.map(function (key) { return ({
                            id: key.id,
                            keyPrefix: key.keyPrefix,
                            name: key.name,
                            description: key.description || undefined,
                            permissions: key.permissions || [],
                            rateLimit: key.rateLimit || 1000,
                            lastUsedAt: key.lastUsedAt || null,
                            expiresAt: key.expiresAt || null,
                            createdAt: key.createdAt,
                            revokedAt: key.revokedAt || null,
                        }); })];
            }
        });
    });
}
/**
 * Revoke an API key
 */
function revokeApiKey(keyId, userId, walletAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var conditions, updated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    conditions = [(0, drizzle_orm_1.eq)(schema_1.dreamnetApiKeys.id, keyId)];
                    // Ensure user owns the key
                    if (userId) {
                        conditions.push((0, drizzle_orm_1.eq)(schema_1.dreamnetApiKeys.userId, userId));
                    }
                    if (walletAddress) {
                        conditions.push((0, drizzle_orm_1.eq)(schema_1.dreamnetApiKeys.walletAddress, walletAddress));
                    }
                    return [4 /*yield*/, db_1.db
                            .update(schema_1.dreamnetApiKeys)
                            .set({ revokedAt: new Date() })
                            .where(drizzle_orm_1.and.apply(void 0, __spreadArray(__spreadArray([], conditions, false), [(0, drizzle_orm_1.isNull)(schema_1.dreamnetApiKeys.revokedAt)], false)))
                            .returning()];
                case 1:
                    updated = (_a.sent())[0];
                    return [2 /*return*/, !!updated];
            }
        });
    });
}
/**
 * Get API key by ID (for admin operations)
 */
function getApiKeyById(keyId) {
    return __awaiter(this, void 0, void 0, function () {
        var key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.dreamnetApiKeys)
                        .where((0, drizzle_orm_1.eq)(schema_1.dreamnetApiKeys.id, keyId))
                        .limit(1)];
                case 1:
                    key = (_a.sent())[0];
                    if (!key) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, {
                            id: key.id,
                            keyPrefix: key.keyPrefix,
                            name: key.name,
                            description: key.description || undefined,
                            permissions: key.permissions || [],
                            rateLimit: key.rateLimit || 1000,
                            lastUsedAt: key.lastUsedAt || null,
                            expiresAt: key.expiresAt || null,
                            createdAt: key.createdAt,
                            revokedAt: key.revokedAt || null,
                        }];
            }
        });
    });
}
/**
 * Get or create default API key for a wallet/user
 * Auto-generates a default key if none exists
 * This is called automatically on first wallet connection
 */
function getOrCreateDefaultApiKey(walletAddress, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var existingKeys, defaultKey, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!walletAddress && !userId) {
                        throw new Error("Either walletAddress or userId must be provided");
                    }
                    return [4 /*yield*/, listApiKeys(userId, walletAddress)];
                case 1:
                    existingKeys = _a.sent();
                    defaultKey = existingKeys.find(function (k) { return k.name === "Default API Key" && !k.revokedAt; });
                    if (defaultKey) {
                        // User already has a default key - return null (we can't show plaintext again)
                        // But we can return the key info
                        return [2 /*return*/, {
                                key: "", // Can't return plaintext for existing keys
                                keyInfo: defaultKey,
                                isNew: false,
                            }];
                    }
                    return [4 /*yield*/, createApiKey({
                            walletAddress: walletAddress,
                            userId: userId,
                            name: "Default API Key",
                            description: "Auto-generated default API key for DreamNet access",
                            permissions: ["read", "write"], // Default permissions
                            rateLimit: 1000, // Default rate limit
                            createdBy: walletAddress || userId || "system",
                        })];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, {
                            key: result.key, // Return plaintext for new keys
                            keyInfo: result.keyInfo,
                            isNew: true,
                        }];
            }
        });
    });
}
