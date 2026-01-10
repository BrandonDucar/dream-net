"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.issuePassport = issuePassport;
exports.getPassport = getPassport;
exports.upgradePassport = upgradePassport;
const citizenshipStore_1 = require("../store/citizenshipStore");
/**
 * Issue a passport to an IdentityGrid node
 */
function issuePassport(identityId, tier, flags) {
    // Check if passport already exists
    const existing = citizenshipStore_1.CitizenshipStore.getPassport(identityId);
    if (existing) {
        // Upgrade if tier is higher
        if (shouldUpgrade(existing.tier, tier)) {
            const upgraded = citizenshipStore_1.CitizenshipStore.upgradePassport(identityId, tier);
            // Auto-record in Dream Snail
            Promise.resolve().then(() => __importStar(require("@dreamnet/dreamnet-snail-core/logic/autoRecord"))).then(({ autoRecordPassportAction }) => {
                autoRecordPassportAction("upgraded", identityId, tier);
            })
                .catch(() => { });
            return upgraded;
        }
        return existing;
    }
    const passport = citizenshipStore_1.CitizenshipStore.issuePassport(identityId, tier, flags);
    // Auto-record in Dream Snail
    Promise.resolve().then(() => __importStar(require("@dreamnet/dreamnet-snail-core/logic/autoRecord"))).then(({ autoRecordPassportAction }) => {
        autoRecordPassportAction("issued", identityId, tier);
    })
        .catch(() => { });
    return passport;
}
/**
 * Get passport for an IdentityGrid node
 */
function getPassport(identityId) {
    return citizenshipStore_1.CitizenshipStore.getPassport(identityId);
}
/**
 * Upgrade passport tier
 */
function upgradePassport(identityId, newTier) {
    return citizenshipStore_1.CitizenshipStore.upgradePassport(identityId, newTier);
}
// Helper: determine if new tier is higher than existing
function shouldUpgrade(existing, newTier) {
    const tierOrder = ["visitor", "dreamer", "citizen", "operator", "architect", "founder"];
    return tierOrder.indexOf(newTier) > tierOrder.indexOf(existing);
}
