import type {
  EconomicEngineContext,
  RawRewardEvent,
  EmissionRule,
  AppliedReward,
} from '../types.js';
import { EconStore } from '../store/econStore.js';
import { ensureDefaultEconomicConfigSeeded } from './emissionRules.js';

let rewardCounter = 0;
function nextRewardId() {
  rewardCounter += 1;
  return `reward-${Date.now()}-${rewardCounter}`;
}

/**
 * Core function: apply all matching emission rules to a raw reward event.
 * This updates balances and records AppliedReward entries.
 */
export function applyEmissionForReward(ev: RawRewardEvent): AppliedReward[] {
  const now = Date.now();

  const rules = EconStore.listEmissionRules().filter(
    (r) => r.source === ev.source && r.kind === ev.kind
  );

  const applied: AppliedReward[] = [];

  rules.forEach((rule) => {
    const amount = ev.baseValue * rule.multiplier;
    if (amount <= 0) return;

    // Adjust balance
    EconStore.adjustBalance(ev.identityId, rule.token, amount);

    const ar: AppliedReward = {
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

    EconStore.addAppliedReward(ar);
    applied.push(ar);
  });

  return applied;
}

/**
 * Ingest pending rewards from other systems (future extension).
 * For now, this module expects callers to feed RawRewardEvent objects explicitly.
 */
export function ensureEconomicConfig(ctx: EconomicEngineContext) {
  ensureDefaultEconomicConfigSeeded();
}

