import type { PSLContext, DecaySignal } from '../types.js';

export function detectDecay(ctx: PSLContext): DecaySignal[] {
  const now = Date.now();
  const results: DecaySignal[] = [];

  // Stub heuristics: later replace with real subsystem telemetry
  if (ctx.haloLoop) {
    results.push({
      id: `decay-halo-${now}`,
      targetType: "service",
      targetId: "halo-loop",
      severity: 0.3,
      detectedAt: now,
      meta: { reason: "baseline decay scan" },
    });
  }

  if (ctx.wolfPack) {
    results.push({
      id: `decay-wpp-${now}`,
      targetType: "agent",
      targetId: "wolf-pack",
      severity: 0.4,
      detectedAt: now,
      meta: { reason: "wolf-pack target buildup" },
    });
  }

  if (ctx.slugTime) {
    results.push({
      id: `decay-slug-${now}`,
      targetType: "service",
      targetId: "slug-time-memory",
      severity: 0.2,
      detectedAt: now,
      meta: { reason: "slow-memory accumulation pattern" },
    });
  }

  if (!results.length) {
    return [];
  }

  return results;
}

