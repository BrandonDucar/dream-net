import { CitizenshipStore } from "../store/citizenshipStore";
/**
 * Issue a passport to an IdentityGrid node
 */
export function issuePassport(identityId, tier, flags) {
    // Check if passport already exists
    const existing = CitizenshipStore.getPassport(identityId);
    if (existing) {
        // Upgrade if tier is higher
        if (shouldUpgrade(existing.tier, tier)) {
            const upgraded = CitizenshipStore.upgradePassport(identityId, tier);
            // Auto-record in Dream Snail
            import("@dreamnet/dreamnet-snail-core/logic/autoRecord")
                .then(({ autoRecordPassportAction }) => {
                autoRecordPassportAction("upgraded", identityId, tier);
            })
                .catch(() => { });
            return upgraded;
        }
        return existing;
    }
    const passport = CitizenshipStore.issuePassport(identityId, tier, flags);
    // Auto-record in Dream Snail
    import("@dreamnet/dreamnet-snail-core/logic/autoRecord")
        .then(({ autoRecordPassportAction }) => {
        autoRecordPassportAction("issued", identityId, tier);
    })
        .catch(() => { });
    return passport;
}
/**
 * Get passport for an IdentityGrid node
 */
export function getPassport(identityId) {
    return CitizenshipStore.getPassport(identityId);
}
/**
 * Upgrade passport tier
 */
export function upgradePassport(identityId, newTier) {
    return CitizenshipStore.upgradePassport(identityId, newTier);
}
// Helper: determine if new tier is higher than existing
function shouldUpgrade(existing, newTier) {
    const tierOrder = ["visitor", "dreamer", "citizen", "operator", "architect", "founder"];
    return tierOrder.indexOf(newTier) > tierOrder.indexOf(existing);
}
