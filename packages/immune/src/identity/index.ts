import type {
    IdentityType,
    ChainRef,
    IdentityNode,
    IdentityEdge,
    IdentityContext,
    IdentitySnapshot,
    IdentityStatus,
} from './types.js';
import { IdentityStore } from './store/identityStore.js';
import { runIdentityCycle, identityStatus } from './scheduler/identityScheduler.js';

// Assimilated Bridge Logic
import { autoIssuePassportForIdentity, updateIdentityGridFromPassportAction } from './logic/identityPassportBridge.js';

export const IdentityGrid = {
    upsertNode(node: Omit<IdentityNode, "createdAt" | "updatedAt">): IdentityNode {
        const createdNode = IdentityStore.upsertNode(node);

        // Auto-issue passport for new identity node
        autoIssuePassportForIdentity({
            id: createdNode.id,
            type: createdNode.type as any,
            label: createdNode.label || createdNode.id,
            trustScore: createdNode.trustScore,
            meta: createdNode.meta,
            createdAt: createdNode.createdAt,
            updatedAt: createdNode.updatedAt,
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

export * from './types.js';
export * from './logic/identityPassportBridge.js';
export default IdentityGrid;
