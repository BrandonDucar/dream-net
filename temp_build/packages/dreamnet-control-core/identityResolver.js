"use strict";
/**
 * Identity Resolver
 * Resolves caller identity and tier from API keys and wallet signatures
 *
 * Supports:
 * - x-dreamnet-api-key (internal/external keys)
 * - x-dreamnet-wallet-address + x-dreamnet-wallet-signature (EVM wallets)
 *
 * @module @dreamnet/dreamnet-control-core/identityResolver
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.identityAndTierResolver = identityAndTierResolver;
const tierConfig_1 = require("./tierConfig");
const godVault_1 = require("./godVault");
const registry_1 = require("../dreamstate/src/registry");
/**
 * Simple mapping from non-God API keys to tiers.
 * These should NOT be hard-coded secrets; instead they can be lookup keys
 * or you can move this to a DB later. For now, this is just a placeholder.
 */
const NON_GOD_API_KEY_TIER_MAP = {
// "DN_BUILDER_API_KEY_1": "BUILDER",
// "DN_OPERATOR_API_KEY_1": "OPERATOR",
};
/**
 * Placeholder for wallet → tier logic (non-God).
 * For now, everything not in the God Vault could default to SEED or BUILDER.
 * Later you can plug in on-chain checks, balances, NFT gates, etc.
 */
function resolveNonGodWalletTier(_walletAddress) {
    // TODO: implement real wallet-based tier logic.
    return "SEED";
}
/**
 * Example wallet signature verification.
 * You can wire this to ethers.js or any EVM lib in your actual code.
 */
async function verifyWalletSignature(message, signature, expectedAddress) {
    // Example with ethers (uncomment if you have ethers installed):
    //
    // const recovered = ethers.utils.verifyMessage(message, signature);
    // return recovered.toLowerCase() === expectedAddress.toLowerCase();
    //
    // For now, treat as TODO.
    void message;
    void signature;
    void expectedAddress;
    return false;
}
/**
 * Resolve a caller's identity and tier from:
 * - x-dreamnet-api-key (internal/external keys)
 * - x-dreamnet-wallet-address + x-dreamnet-wallet-signature (EVM wallets)
 *
 * Attach a CallerIdentity object to req.callerIdentity.
 * Defaults to SEED when unknown.
 */
async function identityAndTierResolver(req, _res, next) {
    const traceId = req.traceId; // assumed from earlier trace middleware
    const godApiKeys = (0, godVault_1.getGodVaultApiKeysFromEnv)();
    // 1) API KEY PATH
    const apiKeyHeader = req.headers["x-dreamnet-api-key"] ?? undefined;
    if (apiKeyHeader) {
        // Check if it's a God Vault key first
        if (godApiKeys.includes(apiKeyHeader)) {
            // Attach founder passport for God Vault API keys
            const founderPassport = (0, registry_1.getPassportByCitizenId)("FOUNDER_BRANDON");
            req.callerIdentity = {
                source: "apiKey",
                tierId: godVault_1.GOD_VAULT.tierId,
                tier: tierConfig_1.TIERS[godVault_1.GOD_VAULT.tierId],
                isGodVault: true,
                apiKeyId: "GOD_VAULT_API_KEY",
                passport: founderPassport,
                officeIds: founderPassport?.officeIds,
                cabinetIds: founderPassport?.cabinetIds,
            };
            // Mirror passport for convenience
            req.dreamPassport = founderPassport;
            console.info("[identity] God Vault API key detected", {
                traceId,
                ownerId: godVault_1.GOD_VAULT.ownerId,
                passport: founderPassport ? "founder" : "none",
            });
            return next();
        }
        // Non-God API key mapping
        const tierId = NON_GOD_API_KEY_TIER_MAP[apiKeyHeader] ?? "SEED";
        req.callerIdentity = {
            source: "apiKey",
            tierId,
            tier: tierConfig_1.TIERS[tierId],
            isGodVault: false,
            apiKeyId: "PUBLIC_OR_PARTNER_KEY",
        };
        console.info("[identity] API key resolved", {
            traceId,
            tierId,
        });
        return next();
    }
    // 2) WALLET PATH
    const walletAddressHeader = req.headers["x-dreamnet-wallet-address"]?.toLowerCase();
    const walletSignatureHeader = req.headers["x-dreamnet-wallet-signature"];
    const walletMessageHeader = req.headers["x-dreamnet-wallet-message"] ??
        "dreamnet-auth";
    if (walletAddressHeader && walletSignatureHeader) {
        const isGod = (0, godVault_1.isGodVaultWallet)(walletAddressHeader);
        // Optionally verify the signature (recommended once wired up)
        const signatureValid = await verifyWalletSignature(walletMessageHeader, walletSignatureHeader, walletAddressHeader);
        // For now, skip signature verification if not implemented
        // TODO: Enable signature verification once ethers.js is integrated
        const shouldVerifySignature = false; // Set to true when ready
        if (shouldVerifySignature && !signatureValid) {
            console.warn("[identity] Invalid wallet signature", {
                traceId,
                walletAddress: walletAddressHeader,
            });
            // You can choose to 401 here in a separate auth middleware;
            // for now we just treat as unknown.
        }
        else if (isGod) {
            // Attach founder passport for God Vault wallets
            const founderPassport = (0, registry_1.getPassportByCitizenId)("FOUNDER_BRANDON");
            req.callerIdentity = {
                source: "wallet",
                tierId: godVault_1.GOD_VAULT.tierId,
                tier: tierConfig_1.TIERS[godVault_1.GOD_VAULT.tierId],
                isGodVault: true,
                walletAddress: walletAddressHeader,
                passport: founderPassport,
                officeIds: founderPassport?.officeIds,
                cabinetIds: founderPassport?.cabinetIds,
            };
            // Mirror passport for convenience
            req.dreamPassport = founderPassport;
            console.info("[identity] God Vault wallet authenticated", {
                traceId,
                ownerId: godVault_1.GOD_VAULT.ownerId,
                walletAddress: walletAddressHeader,
                passport: founderPassport ? "founder" : "none",
            });
            return next();
        }
        else {
            // Check for passport by wallet address
            const passport = (0, registry_1.getPassportByWallet)(walletAddressHeader);
            const tierId = passport?.tierId || resolveNonGodWalletTier(walletAddressHeader);
            req.callerIdentity = {
                source: "wallet",
                tierId,
                tier: tierConfig_1.TIERS[tierId],
                isGodVault: false,
                walletAddress: walletAddressHeader,
                passport,
                officeIds: passport?.officeIds,
                cabinetIds: passport?.cabinetIds,
            };
            // Mirror passport for convenience
            req.dreamPassport = passport;
            console.info("[identity] Wallet resolved", {
                traceId,
                walletAddress: walletAddressHeader,
                tierId,
                passport: passport ? passport.citizenId : "none",
            });
            return next();
        }
    }
    // 3) FALLBACK – UNKNOWN → SEED
    const fallbackTier = "SEED";
    req.callerIdentity = {
        source: "unknown",
        tierId: fallbackTier,
        tier: tierConfig_1.TIERS[fallbackTier],
        isGodVault: false,
    };
    console.info("[identity] Caller unresolved, defaulting to SEED", { traceId });
    return next();
}
