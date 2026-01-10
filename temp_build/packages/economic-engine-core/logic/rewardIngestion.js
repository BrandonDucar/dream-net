"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyEmissionForReward = applyEmissionForReward;
exports.ensureEconomicConfig = ensureEconomicConfig;
const econStore_1 = require("../store/econStore");
const emissionRules_1 = require("./emissionRules");
let rewardCounter = 0;
function nextRewardId() {
    rewardCounter += 1;
    return `reward-${Date.now()}-${rewardCounter}`;
}
/**
 * Core function: apply all matching emission rules to a raw reward event.
 * This updates balances and records AppliedReward entries.
 */
function applyEmissionForReward(ev) {
    const now = Date.now();
    const rules = econStore_1.EconStore.listEmissionRules().filter((r) => r.source === ev.source && r.kind === ev.kind);
    const applied = [];
    rules.forEach((rule) => {
        const amount = ev.baseValue * rule.multiplier;
        if (amount <= 0)
            return;
        // Adjust balance
        econStore_1.EconStore.adjustBalance(ev.identityId, rule.token, amount);
        const ar = {
            id: nextRewardId(),
            rawRewardId: ev.id,
            identityId: ev.identityId,
            token: rule.token,
            amount,
            createdAt: now,
            meta: {
                source: ev.source,
                kind: ev.kind,
                ruleId: rule.id,
            },
        };
        econStore_1.EconStore.addAppliedReward(ar);
        applied.push(ar);
    });
    return applied;
}
/**
 * Ingest pending rewards from other systems (future extension).
 * For now, this module expects callers to feed RawRewardEvent objects explicitly.
 */
function ensureEconomicConfig(ctx) {
    (0, emissionRules_1.ensureDefaultEconomicConfigSeeded)();
}
