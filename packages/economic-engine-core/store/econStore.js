const tokenConfigs = new Map();
const balances = new Map(); // key: identityId:token
const rawRewards = [];
const emissionRules = [];
const appliedRewards = [];
let lastRunAt = null;
function balanceKey(identityId, token) {
    return `${identityId}:${token}`;
}
export const EconStore = {
    // Tokens
    upsertTokenConfig(cfg) {
        tokenConfigs.set(cfg.symbol, cfg);
        return cfg;
    },
    listTokenConfigs() {
        return Array.from(tokenConfigs.values());
    },
    // Balances
    getBalance(identityId, token) {
        const key = balanceKey(identityId, token);
        const existing = balances.get(key);
        const now = Date.now();
        if (existing)
            return existing;
        const rec = {
            identityId,
            token,
            amount: 0,
            updatedAt: now,
        };
        balances.set(key, rec);
        return rec;
    },
    setBalance(identityId, token, amount) {
        const now = Date.now();
        const key = balanceKey(identityId, token);
        const rec = {
            identityId,
            token,
            amount,
            updatedAt: now,
        };
        balances.set(key, rec);
        return rec;
    },
    adjustBalance(identityId, token, delta) {
        const existing = EconStore.getBalance(identityId, token);
        const newAmount = existing.amount + delta;
        return EconStore.setBalance(identityId, token, newAmount);
    },
    listBalances() {
        return Array.from(balances.values());
    },
    // Rewards
    addRawReward(ev) {
        rawRewards.push(ev);
    },
    listRawRewards() {
        return rawRewards;
    },
    addEmissionRule(rule) {
        emissionRules.push(rule);
    },
    listEmissionRules() {
        return emissionRules;
    },
    addAppliedReward(ar) {
        appliedRewards.push(ar);
    },
    listAppliedRewards() {
        return appliedRewards;
    },
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    status() {
        const sampleBalances = EconStore.listBalances().slice(0, 25);
        return {
            lastRunAt,
            tokenCount: tokenConfigs.size,
            emissionRuleCount: emissionRules.length,
            balanceCount: balances.size,
            appliedRewardCount: appliedRewards.length,
            sampleBalances,
        };
    },
};
