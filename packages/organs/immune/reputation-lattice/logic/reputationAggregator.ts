import type { ReputationContext, ReputationSignal, RepEntityType } from '../types.js';
import { ReputationStore } from '../store/reputationStore.js';

export function ingestExternalSignals(ctx: ReputationContext) {
  const now = Date.now();
  const signals: ReputationSignal[] = [];

  // Example heuristic: WolfPack targets => lower trust on those services/agents
  if (ctx.wolfPack?.status) {
    const wolfStatus = ctx.wolfPack.status();
    const targets: string[] = wolfStatus.activeTargets ?? [];

    targets.forEach((targetId) => {
      signals.push({
        id: `rep-wolf-${targetId}-${now}`,
        entityType: "service",
        entityId: targetId,
        source: "WolfPack",
        weight: 0.6,
        value: -0.4,
        createdAt: now,
        meta: { reason: "wolf-pack active target" },
      });
    });
  }

  // Example: Slug-Time snapshots with strong reliability => positive rep
  if (ctx.slugTime?.status) {
    const slugStatus = ctx.slugTime.status();
    // If context exposes snapshots directly, they can be iterated here.
    // For now, we just attach a generic positive signal when snapshotCount is healthy.
    if (slugStatus.snapshotCount > 0) {
      signals.push({
        id: `rep-slug-global-${now}`,
        entityType: "service",
        entityId: "slug-time-memory",
        source: "SlugTimeMemory",
        weight: 0.3,
        value: 0.3,
        createdAt: now,
        meta: { reason: "slug-time active and tracking" },
      });
    }
  }

  // Example: DreamCortex directives => dream-level reputation
  if (ctx.dreamCortex?.status) {
    const cortexStatus = ctx.dreamCortex.status();
    cortexStatus.lastDirectives?.forEach((d: any) => {
      const value = directiveToRepValue(d.intent);
      signals.push({
        id: `rep-dream-${d.dreamId}-${now}`,
        entityType: "dream",
        entityId: d.dreamId,
        source: "DreamCortex",
        weight: d.confidence ?? 0.5,
        value,
        createdAt: now,
        meta: { intent: d.intent },
      });
    });
  }

  // Optional: StarBridge aggregated metrics => chain-level or route-level rep
  if (ctx.starBridge?.status) {
    const sbStatus = ctx.starBridge.status();
    const metrics = sbStatus.chainMetrics ?? [];

    metrics.forEach((m: any) => {
      signals.push({
        id: `rep-chain-${m.chain}-${now}`,
        entityType: "route",
        entityId: String(m.chain),
        source: "StarBridgeLungs",
        weight: 0.4,
        value: (m.reliability ?? 0.5) * 2 - 1, // map [0,1] -> [-1,1]
        createdAt: now,
        meta: { metric: m },
      });
    });
  }

  // Store all the signals
  signals.forEach((s) => ReputationStore.addSignal(s));
}

function directiveToRepValue(intent: string): number {
  switch (intent) {
    case "accelerate":
    case "stabilize":
      return 0.4;
    case "unblock":
      return -0.2;
    case "deprecate":
      return -0.4;
    case "monitor":
    default:
      return 0.0;
  }
}

