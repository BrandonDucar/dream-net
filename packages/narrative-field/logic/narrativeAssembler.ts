import type {
  NarrativeContext,
  NarrativeEntry,
  NarrativeSeverity,
  NarrativeDomain,
} from '../types.js';

let counter = 0;

function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

export function assembleNarratives(ctx: NarrativeContext): NarrativeEntry[] {
  const now = Date.now();
  const entries: NarrativeEntry[] = [];

  // 1) Dream Cortex directives -> dream-level narrative
  if (ctx.dreamCortex?.status) {
    const cortexStatus = ctx.dreamCortex.status();
    const directives = cortexStatus.lastDirectives ?? [];

    directives.forEach((d: any) => {
      const severity: NarrativeSeverity =
        d.intent === "unblock" || d.intent === "deprecate"
          ? "warning"
          : d.intent === "stabilize"
          ? "notice"
          : "info";

      entries.push({
        id: nextId("cortex"),
        timestamp: now,
        title: `Dream directive: ${d.intent}`,
        summary: `Dream '${d.dreamId}' received directive '${d.intent}' with confidence ${(d.confidence ?? 0).toFixed(
          2
        )}.`,
        severity,
        domain: "dream",
        tags: ["dream", "directive", d.intent],
        references: [
          { kind: "dream", id: d.dreamId },
        ],
        meta: { directive: d },
      });
    });
  }

  // 2) Reputation Lattice snapshot -> trust narrative
  if (ctx.reputationLattice?.status) {
    const repStatus = ctx.reputationLattice.status();
    if (repStatus.scoresSample?.length) {
      entries.push({
        id: nextId("rep"),
        timestamp: now,
        title: "Reputation lattice updated",
        summary: `Recomputed reputation for ${repStatus.entityCount} entities from ${repStatus.signalCount} signals.`,
        severity: "info",
        domain: "reputation",
        tags: ["reputation", "trust"],
        meta: { repStatus },
      });
    }
  }

  // 3) WolfPack active targets -> risk narrative
  if (ctx.wolfPack?.status) {
    const wolfStatus = ctx.wolfPack.status();
    const activeTargets: string[] = wolfStatus.activeTargets ?? [];
    if (activeTargets.length) {
      entries.push({
        id: nextId("wolf"),
        timestamp: now,
        title: "Wolf-Pack hunting",
        summary: `Wolf-Pack is tracking ${activeTargets.length} active targets.`,
        severity: "warning",
        domain: "swarm",
        tags: ["wolf-pack", "risk", "swarm"],
        references: activeTargets.map((t) => ({
          kind: "service",
          id: t,
        })),
        meta: { wolfStatus },
      });
    }
  }

  // 4) Star-Bridge chain metrics -> cross-chain narrative
  if (ctx.starBridge?.status) {
    const sbStatus = ctx.starBridge.status();
    const metrics = sbStatus.chainMetrics ?? [];
    if (metrics.length) {
      entries.push({
        id: nextId("star-bridge"),
        timestamp: now,
        title: "Cross-chain breath check",
        summary: `Star-Bridge Lungs evaluated ${metrics.length} chains for reliability and pressure.`,
        severity: "info",
        domain: "cross-chain",
        tags: ["cross-chain", "liquidity", "routing"],
        meta: { metrics },
      });
    }
  }

  // 5) Slug-Time snapshots -> long-term trend narrative
  if (ctx.slugTime?.status) {
    const slugStatus = ctx.slugTime.status();
    if (slugStatus.snapshotCount > 0) {
      entries.push({
        id: nextId("slug"),
        timestamp: now,
        title: "Long-horizon trends updated",
        summary: `Slug-Time Memory updated ${slugStatus.snapshotCount} metric snapshots.`,
        severity: "info",
        domain: "infra",
        tags: ["slow-memory", "trends"],
        meta: { slugStatus },
      });
    }
  }

  return entries;
}

