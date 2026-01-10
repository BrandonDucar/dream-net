"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityGrid = void 0;
const identityStore_1 = require("./store/identityStore");
const identityScheduler_1 = require("./scheduler/identityScheduler");
const identity_passport_bridge_1 = require("@dreamnet/identity-passport-bridge");
exports.IdentityGrid = {
    upsertNode(node) {
        const createdNode = identityStore_1.IdentityStore.upsertNode(node);
        // Auto-issue passport for new identity node
        (0, identity_passport_bridge_1.autoIssuePassportForIdentity)({
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
        return identityStore_1.IdentityStore.addEdge(edge);
    },
    listNodes() {
        return identityStore_1.IdentityStore.listNodes();
    },
    listEdges() {
        return identityStore_1.IdentityStore.listEdges();
    },
    getSnapshot() {
        return {
            nodes: identityStore_1.IdentityStore.listNodes(),
            edges: identityStore_1.IdentityStore.listEdges(),
        };
    },
    run(context) {
        return (0, identityScheduler_1.runIdentityCycle)(context);
    },
    status() {
        return (0, identityScheduler_1.identityStatus)();
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.IdentityGrid;
