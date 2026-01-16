export function calculateTrustLevel(score) {
    if (score >= 90)
        return 'Legendary';
    if (score >= 80)
        return 'Master';
    if (score >= 60)
        return 'Advanced';
    if (score >= 40)
        return 'Intermediate';
    if (score >= 20)
        return 'Novice';
    return 'Unverified';
}
export function determineUnlockedAgents(trustScore, stakedSheep, completedDreams, hasTokenBoost = false) {
    const agents = [];
    // Standard tier - always available
    agents.push('lucid', 'canvas');
    // ROOT requires trust > 60
    if (trustScore > 60) {
        agents.push('root');
    }
    // CRADLE requires trust > 80 OR token boost
    if (trustScore > 80 || hasTokenBoost) {
        agents.push('cradle');
    }
    // WING requires 1000+ staked SHEEP OR 10+ completed dreams
    if (stakedSheep >= 1000 || completedDreams >= 10) {
        agents.push('wing');
    }
    return agents;
}
export function analyzeWallet(walletData, completedDreams = 0, hasTokenBoost = false) {
    const stakedSheep = parseInt(walletData.tokens.SHEEP) || 0;
    const trustLevel = calculateTrustLevel(walletData.trustScore);
    const unlockedAgents = determineUnlockedAgents(walletData.trustScore, stakedSheep, completedDreams, hasTokenBoost);
    return {
        wallet: walletData.wallet,
        trustScore: walletData.trustScore,
        trustLevel,
        tokens: walletData.tokens,
        unlockedAgents,
        completedDreams,
        stakedAmount: stakedSheep,
        hasTokenBoost
    };
}
// Mock wallet data for testing
export const MOCK_WALLETS = [
    {
        wallet: "0x123",
        trustScore: 87,
        tokens: {
            SHEEP: "1200",
            FLBY: "0"
        },
        unlockedAgents: ["lucid", "canvas", "root", "cradle", "wing"]
    },
    {
        wallet: "0x456",
        trustScore: 45,
        tokens: {
            SHEEP: "250",
            FLBY: "1500"
        },
        unlockedAgents: ["lucid", "canvas"]
    },
    {
        wallet: "0x789",
        trustScore: 95,
        tokens: {
            SHEEP: "2500",
            FLBY: "800",
            CORE: "15"
        },
        unlockedAgents: ["lucid", "canvas", "root", "cradle", "wing"]
    }
];
export function getWalletData(address) {
    return MOCK_WALLETS.find(w => w.wallet === address) || null;
}
//# sourceMappingURL=wallet.js.map