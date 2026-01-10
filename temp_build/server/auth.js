"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.isAdminWallet = void 0;
var isAdminWallet = function (walletAddress) {
    var _a;
    // Temporary override for testing - remove in production
    if (process.env.NODE_ENV === 'development' && process.env.ADMIN_OVERRIDE === 'true') {
        return true;
    }
    var adminWallets = ((_a = process.env.ADMIN_WALLETS) === null || _a === void 0 ? void 0 : _a.split(",")) || [
        "0xAbCdEf1234567890abcdef1234567890aBcDeF01",
        "0x1234567890abcdef1234567890abcdef12345678",
        // Add test wallets for development
        "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
        "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
    ];
    return adminWallets.map(function (wallet) { return wallet.trim().toLowerCase(); }).includes(walletAddress.toLowerCase());
};
exports.isAdminWallet = isAdminWallet;
var requireAdmin = function (req, res, next) {
    var walletAddress = req.headers['x-wallet-address'];
    if (!walletAddress) {
        return res.status(401).json({ message: "Wallet address required" });
    }
    if (!(0, exports.isAdminWallet)(walletAddress)) {
        return res.status(403).json({ message: "Unauthorized" });
    }
    next();
};
exports.requireAdmin = requireAdmin;
