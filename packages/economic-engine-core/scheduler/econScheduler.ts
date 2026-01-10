import type { EconomicEngineContext, EconomicEngineStatus, RawRewardEvent } from '../types.js';
import { EconStore } from '../store/econStore.js';
import { ensureEconomicConfig, applyEmissionForReward } from '../logic/rewardIngestion.js';

export function runEconomicEngineCycle(ctx: EconomicEngineContext): EconomicEngineStatus {
  const now = Date.now();

  ensureEconomicConfig(ctx);

  // Automatically process unprocessed rewards
  const rawRewards = EconStore.listRawRewards();
  rawRewards.forEach((ev) => {
    if (!ev.processed) {
      applyEmissionForReward(ev);
      EconStore.markRewardProcessed(ev.id);
    }
  });

  EconStore.setLastRunAt(now);
  const status = EconStore.status();

  // Optional: log into NeuralMesh
  if (ctx.neuralMesh?.remember) {
    ctx.neuralMesh.remember({
      source: "EconomicEngineCore",
      tokenCount: status.tokenCount,
      balanceCount: status.balanceCount,
      appliedRewards: status.appliedRewardCount,
      timestamp: now,
    });
  }

  return status;
}

