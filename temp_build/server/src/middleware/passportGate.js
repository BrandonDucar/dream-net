"use strict";
/**
 * Dream State Passport Gate Middleware
 * Biomimetic: Dream State is top-level authority - all access flows through passports
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
exports.createPassportGate = createPassportGate;
exports.getPassport = getPassport;
exports.getIdentityId = getIdentityId;
var dream_state_core_1 = require("../../packages/dream-state-core");
var traceId_1 = require("./traceId");
/**
 * Create passport gate middleware
 * Checks if user has required passport tier
 */
function createPassportGate(requiredTier) {
    var _this = this;
    return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var traceId, walletAddress, userId, identityId, passport, tierHierarchy, userTierLevel, requiredTierLevel;
        return __generator(this, function (_a) {
            traceId = req.traceId || (0, traceId_1.getTraceId)(req);
            walletAddress = req.walletAddress || req.headers["x-wallet-address"];
            userId = req.userId || req.headers["x-user-id"];
            identityId = walletAddress || userId;
            if (!identityId) {
                return [2 /*return*/, res.status(401).json({
                        ok: false,
                        error: "passport_required",
                        message: "Dream State passport required. Please connect wallet or authenticate.",
                        traceId: traceId,
                    })];
            }
            passport = dream_state_core_1.DreamStateCore.getPassport(identityId);
            if (!passport) {
                return [2 /*return*/, res.status(403).json({
                        ok: false,
                        error: "no_passport",
                        message: "No Dream State passport found. Please request passport issuance.",
                        traceId: traceId,
                        identityId: identityId,
                    })];
            }
            tierHierarchy = {
                visitor: 1,
                citizen: 2,
                ambassador: 3,
                operator: 4,
                architect: 5,
                founder: 6,
            };
            userTierLevel = tierHierarchy[passport.tier];
            requiredTierLevel = tierHierarchy[requiredTier];
            if (userTierLevel < requiredTierLevel) {
                return [2 /*return*/, res.status(403).json({
                        ok: false,
                        error: "insufficient_tier",
                        message: "Requires ".concat(requiredTier, " tier passport. Current tier: ").concat(passport.tier),
                        traceId: traceId,
                        identityId: identityId,
                        currentTier: passport.tier,
                        requiredTier: requiredTier,
                    })];
            }
            // Attach passport to request for downstream use
            req.passport = passport;
            req.identityId = identityId;
            // Log access (for audit)
            dream_state_core_1.DreamStateCore.recordGovernmentAction({
                departmentId: "dept:state-integrity",
                action: "access_granted",
                details: {
                    resource: req.path,
                    tier: passport.tier,
                    requiredTier: requiredTier,
                },
                identityId: identityId,
            });
            next();
            return [2 /*return*/];
        });
    }); };
}
/**
 * Helper to get passport from request (after gate middleware)
 */
function getPassport(req) {
    return req.passport;
}
/**
 * Helper to get identity ID from request
 */
function getIdentityId(req) {
    return req.identityId;
}
