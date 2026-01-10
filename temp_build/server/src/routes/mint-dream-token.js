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
var nanoid_1 = require("nanoid");
var router = (0, express_1.Router)();
// In-memory storage for demo purposes
var mintedTokens = [];
router.post('/mint-dream-token', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, wallet, dreamId, dreamName, trustLevel, score, calculateTokenValue, tokenId, value, mintedToken;
    return __generator(this, function (_b) {
        try {
            _a = req.body, wallet = _a.wallet, dreamId = _a.dreamId, dreamName = _a.dreamName, trustLevel = _a.trustLevel, score = _a.score;
            // Validate CRADLE access (80+ score required)
            if (score < 80) {
                return [2 /*return*/, res.status(403).json({
                        error: 'Insufficient trust score for minting',
                        required: 80,
                        current: score
                    })];
            }
            // Validate wallet address
            if (!wallet || wallet.length < 32) {
                return [2 /*return*/, res.status(400).json({
                        error: 'Invalid wallet address'
                    })];
            }
            calculateTokenValue = function (trustLevel, score) {
                var baseValue = 100;
                var scoreMultiplier = Math.floor(score / 10);
                var trustMultiplier = trustLevel === 'High' ? 2.0 : trustLevel === 'Medium' ? 1.5 : 1.0;
                return Math.floor(baseValue * scoreMultiplier * trustMultiplier);
            };
            tokenId = "DTC-".concat((0, nanoid_1.nanoid)(8).toUpperCase());
            value = calculateTokenValue(trustLevel, score);
            mintedToken = {
                tokenId: tokenId,
                wallet: wallet,
                dreamId: dreamId,
                dreamName: dreamName,
                value: value,
                trustLevel: trustLevel,
                timestamp: new Date().toISOString(),
                signature: "sig_".concat((0, nanoid_1.nanoid)(16))
            };
            // Store the minted token
            mintedTokens.push(mintedToken);
            // Log minting activity
            console.log("\uD83E\uDE99 Dream Token Minted: ".concat(tokenId, " (").concat(value, " DTC) for wallet ").concat(wallet.slice(0, 8), "...").concat(wallet.slice(-8)));
            res.json({
                success: true,
                tokenId: mintedToken.tokenId,
                value: mintedToken.value,
                dreamName: mintedToken.dreamName,
                trustLevel: mintedToken.trustLevel,
                timestamp: mintedToken.timestamp,
                signature: mintedToken.signature,
                txHash: "0x".concat((0, nanoid_1.nanoid)(64)) // Mock transaction hash
            });
        }
        catch (error) {
            console.error('Minting error:', error);
            res.status(500).json({
                error: 'Internal server error during minting',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        return [2 /*return*/];
    });
}); });
// Get minted tokens for a wallet
router.get('/wallet/:wallet/tokens', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var wallet_1, walletTokens, totalValue;
    return __generator(this, function (_a) {
        try {
            wallet_1 = req.params.wallet;
            walletTokens = mintedTokens
                .filter(function (token) { return token.wallet === wallet_1; })
                .sort(function (a, b) { return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(); })
                .slice(0, 20);
            totalValue = walletTokens.reduce(function (sum, token) { return sum + token.value; }, 0);
            res.json({
                wallet: wallet_1,
                totalTokens: walletTokens.length,
                totalValue: totalValue,
                tokens: walletTokens
            });
        }
        catch (error) {
            console.error('Token fetch error:', error);
            res.status(500).json({
                error: 'Failed to fetch wallet tokens'
            });
        }
        return [2 /*return*/];
    });
}); });
// Get all minted tokens (admin endpoint)
router.get('/tokens/all', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var totalTokens, totalValue, uniqueWallets;
    return __generator(this, function (_a) {
        try {
            totalTokens = mintedTokens.length;
            totalValue = mintedTokens.reduce(function (sum, token) { return sum + token.value; }, 0);
            uniqueWallets = new Set(mintedTokens.map(function (token) { return token.wallet; })).size;
            res.json({
                totalTokens: totalTokens,
                totalValue: totalValue,
                uniqueWallets: uniqueWallets,
                recentTokens: mintedTokens
                    .sort(function (a, b) { return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(); })
                    .slice(0, 10)
            });
        }
        catch (error) {
            console.error('All tokens fetch error:', error);
            res.status(500).json({
                error: 'Failed to fetch token statistics'
            });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
