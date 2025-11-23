import { IdentityStore } from "./store/identityStore";
import { runIdentityCycle, identityStatus } from "./scheduler/identityScheduler";
import { autoIssuePassportForIdentity } from "@dreamnet/identity-passport-bridge";
export const IdentityGrid = {
    upsertNode(node) {
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
    addEdge(edge) {
        return IdentityStore.addEdge(edge);
    },
    listNodes() {
        return IdentityStore.listNodes();
    },
    listEdges() {
        return IdentityStore.listEdges();
    },
    getSnapshot() {
        return {
            nodes: IdentityStore.listNodes(),
            edges: IdentityStore.listEdges(),
        };
    },
    run(context) {
        return runIdentityCycle(context);
    },
    status() {
        return identityStatus();
    },
};
export * from "./types";
export default IdentityGrid;
