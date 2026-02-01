import type {
  IdentityContext,
  IdentityNode,
  IdentityEdge,
  IdentityLinkType,
  ChainRef,
} from '../types.js';
import { IdentityStore } from '../store/identityStore.js';

let edgeCounter = 0;

function nextEdgeId(): string {
  edgeCounter += 1;
  return `edge-${Date.now()}-${edgeCounter}`;
}

export function syncIdentitiesFromContext(ctx: IdentityContext) {
  const now = Date.now();

  // 1) Link dreams from DreamCortex as identity nodes of type "dream"
  if (ctx.dreamCortex?.listDreams) {
    const dreams = ctx.dreamCortex.listDreams();
    dreams.forEach((d: any) => {
      IdentityStore.upsertNode({
        id: `dream:${d.id}`,
        type: "dream",
        label: d.name,
        tags: d.tags ?? ["dream"],
        meta: {
          status: d.status,
          priority: d.priority,
        },
      });
    });
  }

  // 2) Link chains from StarBridge as route-level identities (type "service"/"agent"-like)
  if (ctx.starBridge?.status) {
    const sbStatus = ctx.starBridge.status();
    const metrics = sbStatus.chainMetrics ?? [];

    metrics.forEach((m: any) => {
      IdentityStore.upsertNode({
        id: `chain:${m.chain}`,
        type: "service",
        label: `Chain ${m.chain}`,
        chain: m.chain as ChainRef,
        tags: ["chain", "routing"],
        meta: { metrics: m },
      });
    });
  }

  // 3) Link reputation entities as generic identities
  if (ctx.reputationLattice?.status) {
    const repStatus = ctx.reputationLattice.status();
    const scores = repStatus.scoresSample ?? [];

    scores.forEach((s: any) => {
      const nodeId = `${s.entityType}:${s.entityId}`;
      IdentityStore.upsertNode({
        id: nodeId,
        type: mapRepTypeToIdentityType(s.entityType),
        label: `${s.entityType}:${s.entityId}`,
        tags: ["reputation"],
        meta: { score: s.score },
      });
    });
  }

  // 4) Example links: dreams ↔ reputation entities (if they share dream IDs)
  // For now, create a generic "relates-to" edge when IDs align.
  if (ctx.reputationLattice?.status && ctx.dreamCortex?.listDreams) {
    const dreams = ctx.dreamCortex.listDreams();
    const repStatus = ctx.reputationLattice.status();
    const scores = repStatus.scoresSample ?? [];

    const dreamIds = new Set(dreams.map((d: any) => d.id));

    scores.forEach((s: any) => {
      if (!s.entityId) return;
      if (!dreamIds.has(s.entityId)) return;

      const dreamNodeId = `dream:${s.entityId}`;
      const repNodeId = `${s.entityType}:${s.entityId}`;

      const edge: IdentityEdge = {
        id: nextEdgeId(),
        fromId: dreamNodeId,
        toId: repNodeId,
        linkType: "relates-to",
        createdAt: now,
        meta: { reason: "dream ↔ reputation linkage" },
      };

      IdentityStore.addEdge(edge);
    });
  }

  // Note: Wallets are not yet imported from on-chain; they will be added later when we have wallet data.
}

function mapRepTypeToIdentityType(rep: string): any {
  switch (rep) {
    case "dream":
      return "dream";
    case "agent":
    case "service":
    case "route":
    case "wormhole":
      return "service";
    case "wallet":
      return "wallet";
    default:
      return "generic";
  }
}

