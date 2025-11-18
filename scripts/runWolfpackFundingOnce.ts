/**
 * Run Wolf Pack funding cycle once (for testing)
 * 
 * Usage:
 *   tsx scripts/runWolfpackFundingOnce.ts
 */

import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";

async function main() {
  const before = WolfPackFundingCore.status();
  console.log("Before run:", {
    leadCount: before.leadCount,
    queueCount: before.queueCount,
    pendingCount: before.pendingCount,
  });

  const after = WolfPackFundingCore.run({
    reputationLattice: undefined,
    fieldLayer: undefined,
    dreamTankCore: undefined,
    economicEngineCore: undefined,
    narrativeField: undefined,
    agentRegistryCore: undefined,
    neuralMesh: undefined,
  });

  console.log("After run:", {
    leadCount: after.leadCount,
    queueCount: after.queueCount,
    pendingCount: after.pendingCount,
    sampleQueue: after.sampleQueue,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

