"use strict";
/**
 * Admin Wallets API
 * List admin wallet addresses (admin only)
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
var auth_1 = require("../auth");
var router = express_1.default.Router();
/**
 * GET /api/admin-wallets
 * List all admin wallet addresses
 * Requires admin authentication
 */
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var walletAddress, adminWalletsEnv, wallets, walletsWithTypes;
    return __generator(this, function (_a) {
        try {
            walletAddress = req.headers['x-wallet-address'];
            if (!walletAddress) {
                return [2 /*return*/, res.status(401).json({ error: 'Wallet address required' })];
            }
            if (!(0, auth_1.isAdminWallet)(walletAddress)) {
                return [2 /*return*/, res.status(403).json({ error: 'Unauthorized - admin access required' })];
            }
            adminWalletsEnv = process.env.ADMIN_WALLETS;
            wallets = adminWalletsEnv
                ? adminWalletsEnv.split(',').map(function (w) { return w.trim(); }).filter(function (w) { return w.length > 0; })
                : [
                    '0xAbCdEf1234567890abcdef1234567890aBcDeF01',
                    '0x1234567890abcdef1234567890abcdef12345678',
                    '0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e',
                    '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
                ];
            walletsWithTypes = wallets.map(function (wallet) {
                var type = 'unknown';
                var chain = 'unknown';
                // Ethereum/Base/VeChain addresses start with 0x and are 42 chars
                if (wallet.startsWith('0x') && wallet.length === 42) {
                    type = 'ethereum-base-vechain';
                    chain = 'ethereum'; // Default, could be Base or VeChain too
                }
                // Solana addresses are base58, typically 32-44 chars, no 0x prefix
                else if (!wallet.startsWith('0x') && wallet.length >= 32 && wallet.length <= 44) {
                    type = 'solana';
                    chain = 'solana';
                }
                return {
                    address: wallet,
                    type: type,
                    chain: chain,
                };
            });
            res.json({
                success: true,
                count: wallets.length,
                wallets: walletsWithTypes,
                source: adminWalletsEnv ? 'environment' : 'default',
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
