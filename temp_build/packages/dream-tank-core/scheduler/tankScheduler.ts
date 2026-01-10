import type { DreamTankContext, DreamTankStatus } from "../types";
import { TankStore } from "../store/tankStore";
import { runProgressionCycle } from "../logic/progressionEngine";

export function runDreamTankCycle(ctx: DreamTankContext): DreamTankStatus {
  const now = Date.now();

  // 1) Run progression & evaluations
  runProgressionCycle(ctx);

  // 2) Update last run timestamp
  TankStore.setLastRunAt(now);

  const status = TankStore.status();

  // 3) Optional: send narrative entries
  if (ctx.narrativeField?.add && status.sampleDreams.length) {
    ctx.narrativeField.add({
      id: `narrative-dreamtank-${now}`,
      timestamp: now,
      title: "Dream Tank progression cycle",
      summary: `Evaluated ${status.dreamCount} incubated dreams.`,
      severity: "info",
      domain: "dream",
      tags: ["dream-tank", "incubator"],
      references: status.sampleDreams.map((d) => ({
        kind: "dream",
        id: d.id,
        label: d.name,
      })),
      meta: { status },
    });
  }

  // 4) Optional: write into NeuralMesh
  if (ctx.neuralMesh?.remember) {
    ctx.neuralMesh.remember({
      source: "DreamTankCore",
      dreamCount: status.dreamCount,
      timestamp: now,
    });
  }

  return status;
}

