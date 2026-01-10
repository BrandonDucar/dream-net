"use strict";
/**
 * DreamState Registry
 * Bootstrap governance state with founder, offices, and cabinets
 *
 * @module @dreamnet/dreamstate/registry
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DREAMSTATE = void 0;
exports.getPassportByWallet = getPassportByWallet;
exports.getPassportByCitizenId = getPassportByCitizenId;
exports.getOfficesForCitizen = getOfficesForCitizen;
exports.getCabinetsForCitizen = getCabinetsForCitizen;
/**
 * Get founder wallet addresses from environment
 */
function getFounderWalletAddresses() {
    const addresses = [];
    // Check for DN_FOUNDER_WALLET_1, DN_FOUNDER_WALLET_2, etc.
    for (let i = 1; i <= 10; i++) {
        const envVar = process.env[`DN_FOUNDER_WALLET_${i}`];
        if (envVar && envVar.trim().length > 0) {
            addresses.push(envVar.toLowerCase().trim());
        }
    }
    return addresses;
}
/**
 * Bootstrap DreamState snapshot
 */
const DREAMSTATE_BOOTSTRAP = {
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    initializedBy: "DreamState Core",
    initializedAt: new Date().toISOString(),
    isReadOnlyBootstrap: true,
    founderCitizenId: "FOUNDER_BRANDON",
    godVaultCitizenId: "FOUNDER_BRANDON",
    defaultCitizenTemplateTierId: "SEED",
    defaultStatus: "active",
    nextCitizenIdSeed: 1,
    nextOfficeIdSuffix: 1,
    nextCabinetIdSuffix: 1,
    note: "Bootstrap DreamState - Founder and government structure seeded",
    // Offices
    offices: {
        FOUNDER: {
            id: "FOUNDER",
            name: "Founder",
            description: "Founder of DreamNet - ultimate authority",
            clusterScope: undefined, // All clusters
            requiredTierId: "GOD_MODE",
            isSingleSeat: true,
            powers: [
                "Override all decisions",
                "Appoint/remove offices",
                "Emergency kill switch proposals",
                "Full system access",
            ],
        },
        MINISTER_OF_WOLF_OPERATIONS: {
            id: "MINISTER_OF_WOLF_OPERATIONS",
            name: "Minister of Wolf Operations",
            description: "Oversees Wolf Pack cluster operations",
            clusterScope: ["WOLF_PACK"],
            requiredTierId: "OPERATOR",
            isSingleSeat: true,
            powers: [
                "Manage Wolf Pack operations",
                "Approve Wolf Pack actions",
                "Configure Wolf Pack settings",
            ],
        },
        CHIEF_OF_AI_SEO: {
            id: "CHIEF_OF_AI_SEO",
            name: "Chief of AI SEO",
            description: "Oversees AI SEO cluster operations",
            clusterScope: ["AI_SEO"],
            requiredTierId: "OPERATOR",
            isSingleSeat: true,
            powers: [
                "Manage AI SEO operations",
                "Configure SEO rules",
                "Approve SEO changes",
            ],
        },
        GEO_BOUNDARY_ARCHITECT: {
            id: "GEO_BOUNDARY_ARCHITECT",
            name: "Geo Boundary Architect",
            description: "Oversees geofencing operations",
            clusterScope: ["AI_SEO"], // Geofencing is part of AI SEO
            requiredTierId: "OPERATOR",
            isSingleSeat: true,
            powers: [
                "Create/modify geofences",
                "Configure geofence rules",
                "Manage geographic boundaries",
            ],
        },
        CELL_SHIELD_OVERSEER: {
            id: "CELL_SHIELD_OVERSEER",
            name: "Cell Shield Overseer",
            description: "Oversees cellular shield operations",
            clusterScope: ["SHIELD_CORE"],
            requiredTierId: "OPERATOR",
            isSingleSeat: true,
            powers: [
                "Manage cellular shields",
                "Configure shield frequencies",
                "Monitor shield integrity",
            ],
        },
        TREASURY_KEEPER: {
            id: "TREASURY_KEEPER",
            name: "Treasury Keeper",
            description: "Oversees treasury and economic operations",
            clusterScope: undefined, // Multiple clusters: Liquidity Engine, Economic Engine, WolfPack Funding, DreamBet
            requiredTierId: "OPERATOR",
            isSingleSeat: true,
            powers: [
                "Manage treasury funds",
                "Approve fund movements",
                "Monitor economic health",
            ],
        },
        SHIELD_COMMANDER: {
            id: "SHIELD_COMMANDER",
            name: "Shield Commander",
            description: "Oversees Shield Core and Webhook Nervous System",
            clusterScope: ["SHIELD_CORE", "WEBHOOK_NERVOUS_SYSTEM"],
            requiredTierId: "OPERATOR",
            isSingleSeat: true,
            powers: [
                "Manage shield operations",
                "Configure threat detection",
                "Approve shield adjustments",
            ],
        },
        DREAMKEEPER_CHIEF: {
            id: "DREAMKEEPER_CHIEF",
            name: "DreamKeeper Chief",
            description: "Oversees DreamKeeper, Dream Cortex, and Dream Vault",
            clusterScope: undefined, // DreamKeeper is cross-cluster
            requiredTierId: "OPERATOR",
            isSingleSeat: true,
            powers: [
                "Manage dream health",
                "Configure DreamKeeper settings",
                "Approve dream operations",
            ],
        },
        DREAMBET_STEWARD: {
            id: "DREAMBET_STEWARD",
            name: "DreamBet Steward",
            description: "Oversees DreamBet Core and gaming operations",
            clusterScope: undefined, // DreamBet is its own cluster
            requiredTierId: "OPERATOR",
            isSingleSeat: true,
            powers: [
                "Manage DreamBet operations",
                "Approve bankroll movements",
                "Configure game rules",
            ],
        },
        ZEN_GARDEN_CURATOR: {
            id: "ZEN_GARDEN_CURATOR",
            name: "Zen Garden Curator",
            description: "Oversees Zen Garden Core operations",
            clusterScope: undefined, // Zen Garden is its own cluster
            requiredTierId: "OPERATOR",
            isSingleSeat: true,
            powers: [
                "Manage Zen Garden content",
                "Configure garden settings",
                "Approve garden changes",
            ],
        },
        SOCIAL_HUB_DIRECTOR: {
            id: "SOCIAL_HUB_DIRECTOR",
            name: "Social Hub Director",
            description: "Oversees Social Hub Core and AI SEO cluster",
            clusterScope: undefined, // Social Hub and AI SEO
            requiredTierId: "OPERATOR",
            isSingleSeat: true,
            powers: [
                "Manage social operations",
                "Configure social settings",
                "Approve social changes",
            ],
        },
    },
    // Cabinets
    cabinets: {
        FOUNDER_CABINET: {
            id: "FOUNDER_CABINET",
            name: "Founder Cabinet",
            description: "Founder-only cabinet with ultimate authority",
            officeIds: ["FOUNDER"],
            decisionRule: "founder_override",
            clusterScope: undefined, // All clusters
        },
        SHIELD_CABINET: {
            id: "SHIELD_CABINET",
            name: "Shield Cabinet",
            description: "Oversees all shield and security operations",
            officeIds: ["SHIELD_COMMANDER", "CELL_SHIELD_OVERSEER", "GEO_BOUNDARY_ARCHITECT"],
            decisionRule: "majority",
            clusterScope: ["SHIELD_CORE", "WEBHOOK_NERVOUS_SYSTEM"],
        },
        TREASURY_CABINET: {
            id: "TREASURY_CABINET",
            name: "Treasury Cabinet",
            description: "Oversees treasury and economic operations",
            officeIds: ["TREASURY_KEEPER", "FOUNDER"],
            decisionRule: "founder_override",
            clusterScope: undefined, // Multiple economic clusters
        },
        GROWTH_SEO_CABINET: {
            id: "GROWTH_SEO_CABINET",
            name: "Growth & SEO Cabinet",
            description: "Oversees growth and SEO operations",
            officeIds: ["CHIEF_OF_AI_SEO", "SOCIAL_HUB_DIRECTOR"],
            decisionRule: "majority",
            clusterScope: ["AI_SEO"],
        },
        DATA_PRIVACY_CABINET: {
            id: "DATA_PRIVACY_CABINET",
            name: "Data & Privacy Cabinet",
            description: "Oversees data privacy and security",
            officeIds: ["CELL_SHIELD_OVERSEER", "SHIELD_COMMANDER"],
            decisionRule: "unanimous",
            clusterScope: ["SHIELD_CORE"],
        },
        DREAM_HEALTH_CABINET: {
            id: "DREAM_HEALTH_CABINET",
            name: "Dream Health Cabinet",
            description: "Oversees dream health and lifecycle",
            officeIds: ["DREAMKEEPER_CHIEF", "FOUNDER"],
            decisionRule: "founder_override",
            clusterScope: undefined, // DreamKeeper is cross-cluster
        },
        GAMING_CABINET: {
            id: "GAMING_CABINET",
            name: "Gaming Cabinet",
            description: "Oversees gaming and DreamBet operations",
            officeIds: ["DREAMBET_STEWARD", "TREASURY_KEEPER"],
            decisionRule: "majority",
            clusterScope: undefined, // DreamBet and treasury
        },
        SOCIAL_COORDINATION_CABINET: {
            id: "SOCIAL_COORDINATION_CABINET",
            name: "Social Coordination Cabinet",
            description: "Oversees social and communication operations",
            officeIds: ["SOCIAL_HUB_DIRECTOR", "CHIEF_OF_AI_SEO"],
            decisionRule: "majority",
            clusterScope: ["AI_SEO"],
        },
    },
    // Founder passport
    passports: {
        FOUNDER_BRANDON: {
            citizenId: "FOUNDER_BRANDON",
            displayName: "Brandon (Founder of DreamNet)",
            walletAddresses: getFounderWalletAddresses(),
            tierId: "GOD_MODE",
            status: "active",
            reputationScore: 100,
            officeIds: [
                "FOUNDER",
                "MINISTER_OF_WOLF_OPERATIONS",
                "CHIEF_OF_AI_SEO",
                "GEO_BOUNDARY_ARCHITECT",
                "CELL_SHIELD_OVERSEER",
                "TREASURY_KEEPER",
                "SHIELD_COMMANDER",
                "DREAMKEEPER_CHIEF",
                "DREAMBET_STEWARD",
                "ZEN_GARDEN_CURATOR",
                "SOCIAL_HUB_DIRECTOR",
            ],
            cabinetIds: [
                "FOUNDER_CABINET",
                "SHIELD_CABINET",
                "TREASURY_CABINET",
                "GROWTH_SEO_CABINET",
                "DATA_PRIVACY_CABINET",
                "DREAM_HEALTH_CABINET",
                "GAMING_CABINET",
                "SOCIAL_COORDINATION_CABINET",
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    },
};
/**
 * Exported DreamState snapshot
 */
exports.DREAMSTATE = DREAMSTATE_BOOTSTRAP;
/**
 * Get passport by wallet address
 *
 * @param wallet - Wallet address (will be normalized to lowercase)
 * @returns Passport if found, undefined otherwise
 */
function getPassportByWallet(wallet) {
    const normalizedWallet = wallet.toLowerCase().trim();
    for (const passport of Object.values(exports.DREAMSTATE.passports)) {
        if (passport.walletAddresses.includes(normalizedWallet)) {
            return passport;
        }
    }
    return undefined;
}
/**
 * Get passport by citizen ID
 *
 * @param citizenId - Citizen identifier
 * @returns Passport if found, undefined otherwise
 */
function getPassportByCitizenId(citizenId) {
    return exports.DREAMSTATE.passports[citizenId];
}
/**
 * Get offices for a citizen
 *
 * @param citizenId - Citizen identifier
 * @returns Array of offices held by the citizen
 */
function getOfficesForCitizen(citizenId) {
    const passport = getPassportByCitizenId(citizenId);
    if (!passport)
        return [];
    return passport.officeIds
        .map((officeId) => exports.DREAMSTATE.offices[officeId])
        .filter((office) => office !== undefined);
}
/**
 * Get cabinets for a citizen
 *
 * @param citizenId - Citizen identifier
 * @returns Array of cabinets the citizen belongs to
 */
function getCabinetsForCitizen(citizenId) {
    const passport = getPassportByCitizenId(citizenId);
    if (!passport)
        return [];
    return passport.cabinetIds
        .map((cabinetId) => exports.DREAMSTATE.cabinets[cabinetId])
        .filter((cabinet) => cabinet !== undefined);
}
