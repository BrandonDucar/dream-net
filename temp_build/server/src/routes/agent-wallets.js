"use strict";
/**
 * Agent Wallet Management API Routes
 *
 * SECURITY BOUNDARY:
 * - HARD SEPARATION from user wallets (CoinSensei)
 * - User wallets = public addresses only (read-only)
 * - Agent wallets = system wallets for infra/testing
 *
 * WARNING: Testnet/sandbox use unless explicitly marked 'production-safe'
 * - NEVER returns private keys or mnemonics
 * - NEVER logs sensitive data
 * - NO endpoints that export private keys
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
exports.createAgentWalletRouter = void 0;
var express_1 = require("express");
var agent_wallet_manager_1 = require("../../packages/agent-wallet-manager");
var ethers_1 = require("ethers");
// SECURITY: Initialize wallet manager with mnemonic from env only
// Mnemonic comes from AGENT_WALLET_MNEMONIC environment variable
// NEVER from user input or request body
var router = (0, express_1.Router)();
exports.createAgentWalletRouter = router;
// Get or create wallet for an agent
router.post('/:agentId/wallet', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var agentId, _a, _b, chain, label, walletManager, wallet, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                agentId = req.params.agentId;
                _a = req.body, _b = _a.chain, chain = _b === void 0 ? 'ethereum' : _b, label = _a.label;
                walletManager = (0, agent_wallet_manager_1.getAgentWalletManager)();
                return [4 /*yield*/, walletManager.getOrCreateWallet(agentId, chain, label)];
            case 1:
                wallet = _c.sent();
                // SECURITY: Only return public data - private key NEVER included
                res.json({
                    agentId: wallet.agentId,
                    address: wallet.address,
                    chain: wallet.chain,
                    createdAt: wallet.createdAt,
                    label: wallet.label,
                    // NOTE: privateKey NEVER included in response
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _c.sent();
                // SECURITY: Never log sensitive data
                console.error('[AgentWallet] Creation error (no sensitive data logged):', error_1.message);
                res.status(500).json({ error: error_1.message || 'Wallet creation failed' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get wallet balance
router.get('/:agentId/wallet/:chain/balance', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, agentId, chain, rpcUrl, provider, walletManager, balance, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.params, agentId = _a.agentId, chain = _a.chain;
                rpcUrl = req.query.rpcUrl;
                if (!rpcUrl) {
                    return [2 /*return*/, res.status(400).json({ error: 'RPC URL required' })];
                }
                provider = new ethers_1.JsonRpcProvider(rpcUrl);
                walletManager = (0, agent_wallet_manager_1.getAgentWalletManager)();
                return [4 /*yield*/, walletManager.getBalance(agentId, chain, provider)];
            case 1:
                balance = _b.sent();
                res.json({ agentId: agentId, chain: chain, balance: balance });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error('Balance fetch error:', error_2);
                res.status(500).json({ error: error_2.message || 'Balance fetch failed' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// List all wallets for an agent
router.get('/:agentId/wallets', function (req, res) {
    try {
        var agentId = req.params.agentId;
        // SECURITY: Wallet manager initialized with mnemonic from env only
        // NEVER accepts mnemonic from request body or user input
        var walletManager = (0, agent_wallet_manager_1.getAgentWalletManager)(); // Uses AGENT_WALLET_MNEMONIC env var
        // Returns PUBLIC interface only (no private keys)
        var wallets = walletManager.getAgentWallets(agentId);
        // SECURITY: wallets already sanitized (no private keys)
        res.json({ agentId: agentId, wallets: wallets });
    }
    catch (error) {
        console.error('[AgentWallet] List error:', error.message);
        res.status(500).json({ error: error.message || 'Wallet list failed' });
    }
});
// List all agent wallets (admin)
router.get('/all', function (req, res) {
    try {
        // SECURITY: Wallet manager initialized with mnemonic from env only
        // NEVER accepts mnemonic from request body or user input
        var walletManager = (0, agent_wallet_manager_1.getAgentWalletManager)(); // Uses AGENT_WALLET_MNEMONIC env var
        // Returns PUBLIC interface only (no private keys)
        var wallets = walletManager.getAllWallets();
        // SECURITY: wallets already sanitized (no private keys)
        res.json({ wallets: wallets });
    }
    catch (error) {
        console.error('[AgentWallet] All wallets list error:', error.message);
        res.status(500).json({ error: error.message || 'Wallet list failed' });
    }
});
