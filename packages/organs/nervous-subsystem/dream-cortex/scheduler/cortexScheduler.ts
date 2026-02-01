import type { CortexContext, CortexStatus, CortexDirective } from '../types.js';
import { DreamRegistry } from '../store/dreamRegistry.js';
import { synthesizeDirectives } from '../logic/intentSynthesizer.js';

let lastRunAt: number | null = null;
let lastDirectives: CortexDirective[] = [];

export function runCortexCycle(ctx: CortexContext): CortexStatus {
  const directives = synthesizeDirectives(ctx);
  lastRunAt = Date.now();
  lastDirectives = directives;

  // Optional: send directives into Neural Mesh for long-term planning memory
  if (ctx.neuralMesh?.remember && directives.length) {
    ctx.neuralMesh.remember({
      source: "DreamCortex",
      directives,
      timestamp: lastRunAt,
    });
  }

  return cortexStatus();
}

export function cortexStatus(): CortexStatus {
  const regStatus = DreamRegistry.status();

  return {
    lastRunAt,
    dreamCount: regStatus.count,
    directiveCount: lastDirectives.length,
    lastDirectives,
  };
}

