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
exports.requireAdmin = exports.requireAuth = exports.verifyJWT = exports.generateJWT = exports.verifySignature = exports.createSiweMessage = exports.generateNonce = exports.isAdminWallet = void 0;
var siwe_1 = require("siwe");
var jsonwebtoken_1 = require("jsonwebtoken");
var JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
var JWT_EXPIRES_IN = '7d';
var isAdminWallet = function (walletAddress) {
    var _a;
    var adminWallets = ((_a = process.env.ADMIN_WALLETS) === null || _a === void 0 ? void 0 : _a.split(",")) || [
        "0xAbCdEf1234567890abcdef1234567890aBcDeF01",
        "0x1234567890abcdef1234567890abcdef12345678",
        "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
        "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
    ];
    return adminWallets.map(function (wallet) { return wallet.trim().toLowerCase(); }).includes(walletAddress.toLowerCase());
};
exports.isAdminWallet = isAdminWallet;
var generateNonce = function () {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
exports.generateNonce = generateNonce;
var createSiweMessage = function (address, domain, uri, nonce) {
    return new siwe_1.SiweMessage({
        domain: domain,
        address: address,
        statement: 'Sign in to Dream Network Dashboard',
        uri: uri,
        version: '1',
        chainId: 1, // Ethereum mainnet
        nonce: nonce,
        issuedAt: new Date().toISOString(),
    });
};
exports.createSiweMessage = createSiweMessage;
var verifySignature = function (message, signature) { return __awaiter(void 0, void 0, void 0, function () {
    var siweMessage, fields, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                siweMessage = new siwe_1.SiweMessage(message);
                return [4 /*yield*/, siweMessage.verify({ signature: signature })];
            case 1:
                fields = _a.sent();
                if (fields.success) {
                    return [2 /*return*/, { success: true, address: siweMessage.address }];
                }
                else {
                    return [2 /*return*/, { success: false, error: 'Invalid signature' }];
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('SIWE verification error:', error_1);
                return [2 /*return*/, { success: false, error: 'Signature verification failed' }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.verifySignature = verifySignature;
var generateJWT = function (walletAddress) {
    var isAdmin = (0, exports.isAdminWallet)(walletAddress);
    var payload = {
        walletAddress: walletAddress,
        isAdmin: isAdmin
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
exports.generateJWT = generateJWT;
var verifyJWT = function (token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
};
exports.verifyJWT = verifyJWT;
var requireAuth = function (req, res, next) {
    var authHeader = req.headers.authorization;
    var token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (!token) {
        return res.status(401).json({ error: 'Authentication token required' });
    }
    var payload = (0, exports.verifyJWT)(token);
    if (!payload) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = payload;
    next();
};
exports.requireAuth = requireAuth;
var requireAdmin = function (req, res, next) {
    (0, exports.requireAuth)(req, res, function () {
        var _a;
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    });
};
exports.requireAdmin = requireAdmin;
