import type { FieldContext, FieldStatus } from '../types.js';
import { FieldStore } from '../store/fieldStore.js';
import { applyFieldDecay } from '../logic/fieldDecay.js';
import {
  updateFieldsFromReputation,
  updateFieldsFromStarBridge,
  updateFieldsFromQAL,
  updateFieldsFromDreamCortex,
  updateFieldsFromWolfPackAndPSL,
} from '../logic/fieldUpdaters.js';

export function runFieldCycle(ctx: FieldContext): FieldStatus {
  const now = Date.now();

  // 1) Apply decay to all fields
  applyFieldDecay(now);

  // 2) Ingest updates from core systems
  updateFieldsFromReputation(ctx, now);
  updateFieldsFromStarBridge(ctx, now);
  updateFieldsFromQAL(ctx, now);
  updateFieldsFromDreamCortex(ctx, now);
  updateFieldsFromWolfPackAndPSL(ctx, now);

  // 3) Update last run
  FieldStore.setLastRunAt(now);

  // 4) Optional: push coarse summary into NeuralMesh
  if (ctx.neuralMesh?.remember) {
    const st = FieldStore.status();
    ctx.neuralMesh.remember({
      source: "FieldLayer",
      totalSamples: st.totalSamples,
      timestamp: now,
    });
  }

  return FieldStore.status();
}

