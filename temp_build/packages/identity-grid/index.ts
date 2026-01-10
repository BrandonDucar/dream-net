import type {
  IdentityType,
  ChainRef,
  IdentityNode,
  IdentityEdge,
  IdentityContext,
  IdentitySnapshot,
  IdentityStatus,
} from "./types";
import { IdentityStore } from "./store/identityStore";
import { runIdentityCycle, identityStatus } from "./scheduler/identityScheduler";

import { autoIssuePassportForIdentity, updateIdentityGridFromPassportAction } from "@dreamnet/identity-passport-bridge";

export const IdentityGrid = {
  upsertNode(node: Omit<IdentityNode, "createdAt" | "updatedAt">): IdentityNode {
    const createdNode = IdentityStore.upsertNode(node);
    
    // Auto-issue passport for new identity node
    autoIssuePassportForIdentity({
      id: createdNode.id,
      type: createdNode.type,
      label: createdNode.label,
      trustScore: createdNode.trustScore,
      metadata: createdNode.metadata,
      createdAt: createdNode.createdAt,
    });
    
    return createdNode;
  },

  addEdge(edge: IdentityEdge) {
    return IdentityStore.addEdge(edge);
  },

  listNodes(): IdentityNode[] {
    return IdentityStore.listNodes();
  },

  listEdges(): IdentityEdge[] {
    return IdentityStore.listEdges();
  },

  getSnapshot(): IdentitySnapshot {
    return {
      nodes: IdentityStore.listNodes(),
      edges: IdentityStore.listEdges(),
    };
  },

  run(context: IdentityContext): IdentityStatus {
    return runIdentityCycle(context);
  },

  status(): IdentityStatus {
    return identityStatus();
  },
};

export * from "./types";
export default IdentityGrid;

