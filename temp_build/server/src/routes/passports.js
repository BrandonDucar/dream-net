"use strict";
/**
 * Passport Issuance Office API
 *
 * Issues Dream State Passports to citizens
 * Integrates with Domain Registry for automatic .dream domain issuance
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
var citizenshipStore_1 = require("../../packages/dream-state-core/store/citizenshipStore");
var domain_issuance_core_1 = require("../../packages/domain-issuance-core");
var router = (0, express_1.Router)();
// POST /api/passports/issue - Issue a single passport
router.post('/issue', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, identityId, walletAddress, _b, tier, flags, _c, autoIssueDomain, finalIdentityId, passport, domain, requestedName;
    return __generator(this, function (_d) {
        try {
            _a = req.body, identityId = _a.identityId, walletAddress = _a.walletAddress, _b = _a.tier, tier = _b === void 0 ? 'dreamer' : _b, flags = _a.flags, _c = _a.autoIssueDomain, autoIssueDomain = _c === void 0 ? true : _c;
            if (!identityId && !walletAddress) {
                return [2 /*return*/, res.status(400).json({
                        error: 'Missing required fields',
                        required: ['identityId or walletAddress'],
                    })];
            }
            finalIdentityId = identityId || "user:".concat(walletAddress);
            passport = citizenshipStore_1.CitizenshipStore.issuePassport(finalIdentityId, tier, flags);
            domain = null;
            if (autoIssueDomain) {
                try {
                    requestedName = (identityId === null || identityId === void 0 ? void 0 : identityId.split(':')[1]) || (walletAddress === null || walletAddress === void 0 ? void 0 : walletAddress.slice(2, 10));
                    domain = (0, domain_issuance_core_1.issueDreamDomain)({
                        passportId: passport.id,
                        walletAddress: walletAddress || finalIdentityId,
                        requestedName: requestedName,
                        tier: tier === 'founder' || tier === 'architect' ? 'premium' : 'personal',
                    });
                }
                catch (error) {
                    console.warn("Failed to auto-issue domain: ".concat(error.message));
                    // Don't fail passport issuance if domain fails
                }
            }
            res.json({
                success: true,
                passport: passport,
                domain: domain,
                message: "Passport ".concat(passport.id, " issued successfully"),
            });
        }
        catch (error) {
            res.status(400).json({
                error: 'Failed to issue passport',
                message: error.message,
            });
        }
        return [2 /*return*/];
    });
}); });
// POST /api/passports/batch-issue - Issue passports in batch
router.post('/batch-issue', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var citizens, results, errors, _i, citizens_1, citizen, walletAddress, identityId, _a, tier, flags, requestedDomain, finalIdentityId, passport, domain, domainName;
    return __generator(this, function (_b) {
        try {
            citizens = req.body.citizens;
            if (!Array.isArray(citizens) || citizens.length === 0) {
                return [2 /*return*/, res.status(400).json({
                        error: 'Missing or invalid citizens array',
                    })];
            }
            results = [];
            errors = [];
            for (_i = 0, citizens_1 = citizens; _i < citizens_1.length; _i++) {
                citizen = citizens_1[_i];
                try {
                    walletAddress = citizen.walletAddress, identityId = citizen.identityId, _a = citizen.tier, tier = _a === void 0 ? 'dreamer' : _a, flags = citizen.flags, requestedDomain = citizen.requestedDomain;
                    if (!walletAddress && !identityId) {
                        errors.push({
                            citizen: citizen,
                            error: 'Missing walletAddress or identityId',
                        });
                        continue;
                    }
                    finalIdentityId = identityId || "user:".concat(walletAddress);
                    passport = citizenshipStore_1.CitizenshipStore.issuePassport(finalIdentityId, tier, flags);
                    domain = null;
                    try {
                        domainName = requestedDomain || (walletAddress === null || walletAddress === void 0 ? void 0 : walletAddress.slice(2, 10)) || finalIdentityId.split(':')[1];
                        domain = (0, domain_issuance_core_1.issueDreamDomain)({
                            passportId: passport.id,
                            walletAddress: walletAddress || finalIdentityId,
                            requestedName: domainName,
                            tier: tier === 'founder' || tier === 'architect' ? 'premium' : 'personal',
                        });
                    }
                    catch (domainError) {
                        console.warn("Failed to issue domain for ".concat(finalIdentityId, ": ").concat(domainError.message));
                    }
                    results.push({
                        success: true,
                        passport: passport,
                        domain: domain,
                    });
                }
                catch (error) {
                    errors.push({
                        citizen: citizen,
                        error: error.message,
                    });
                }
            }
            res.json({
                success: true,
                summary: {
                    total: citizens.length,
                    successful: results.length,
                    failed: errors.length,
                },
                results: results,
                errors: errors.length > 0 ? errors : undefined,
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'Failed to process batch issuance',
                message: error.message,
            });
        }
        return [2 /*return*/];
    });
}); });
// GET /api/passports/:identityId - Get passport by identity ID
router.get('/:identityId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var identityId, passport;
    return __generator(this, function (_a) {
        try {
            identityId = req.params.identityId;
            passport = citizenshipStore_1.CitizenshipStore.getPassport(identityId);
            if (!passport) {
                return [2 /*return*/, res.status(404).json({
                        error: 'Passport not found',
                        identityId: identityId,
                    })];
            }
            res.json({
                success: true,
                passport: passport,
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'Failed to get passport',
                message: error.message,
            });
        }
        return [2 /*return*/];
    });
}); });
// GET /api/passports - List all passports
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var passports;
    return __generator(this, function (_a) {
        try {
            passports = citizenshipStore_1.CitizenshipStore.listPassports();
            res.json({
                success: true,
                passports: passports,
                count: passports.length,
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'Failed to list passports',
                message: error.message,
            });
        }
        return [2 /*return*/];
    });
}); });
// POST /api/passports/upgrade - Upgrade passport tier
router.post('/upgrade', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, identityId, newTier, upgraded;
    return __generator(this, function (_b) {
        try {
            _a = req.body, identityId = _a.identityId, newTier = _a.newTier;
            if (!identityId || !newTier) {
                return [2 /*return*/, res.status(400).json({
                        error: 'Missing required fields',
                        required: ['identityId', 'newTier'],
                    })];
            }
            upgraded = citizenshipStore_1.CitizenshipStore.upgradePassport(identityId, newTier);
            if (!upgraded) {
                return [2 /*return*/, res.status(404).json({
                        error: 'Passport not found',
                        identityId: identityId,
                    })];
            }
            res.json({
                success: true,
                passport: upgraded,
                message: "Passport upgraded to ".concat(newTier),
            });
        }
        catch (error) {
            res.status(400).json({
                error: 'Failed to upgrade passport',
                message: error.message,
            });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
