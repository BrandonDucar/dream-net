export class DreamNodeRegistryImpl {
    nodes = new Map();
    usageStats = new Map();
    constructor() {
        // Initialize with system nodes
        this.initializeSystemNodes();
    }
    initializeSystemNodes() {
        // FlutterBye node will be registered when imported
    }
    getNode(id) {
        return this.nodes.get(id);
    }
    registerNode(node) {
        this.nodes.set(node.id, node);
        // Initialize usage stats
        if (!this.usageStats.has(node.id)) {
            this.usageStats.set(node.id, {
                nodeId: node.id,
                totalRequests: 0,
                successfulRequests: 0,
                failedRequests: 0,
                averageResponseTime: 0,
                lastUsed: 0,
                topUsers: []
            });
        }
    }
    listPublicNodes() {
        return Array.from(this.nodes.values()).filter(node => node.public);
    }
    listNodesByCreator(creator) {
        return Array.from(this.nodes.values()).filter(node => node.creator === creator);
    }
    incrementUsage(nodeId) {
        const node = this.nodes.get(nodeId);
        if (node) {
            node.usageCount += 1;
            // Update usage stats
            const stats = this.usageStats.get(nodeId);
            if (stats) {
                stats.totalRequests += 1;
                stats.lastUsed = Date.now();
            }
        }
    }
    recordSuccess(nodeId, responseTime) {
        const stats = this.usageStats.get(nodeId);
        if (stats) {
            stats.successfulRequests += 1;
            stats.averageResponseTime = (stats.averageResponseTime + responseTime) / 2;
        }
    }
    recordFailure(nodeId) {
        const stats = this.usageStats.get(nodeId);
        if (stats) {
            stats.failedRequests += 1;
        }
    }
    recordUserActivity(nodeId, wallet) {
        const stats = this.usageStats.get(nodeId);
        if (stats) {
            const existingUser = stats.topUsers.find(user => user.wallet === wallet);
            if (existingUser) {
                existingUser.requestCount += 1;
            }
            else {
                stats.topUsers.push({ wallet, requestCount: 1 });
            }
            // Keep only top 10 users
            stats.topUsers.sort((a, b) => b.requestCount - a.requestCount);
            stats.topUsers = stats.topUsers.slice(0, 10);
        }
    }
    getUsageStats(nodeId) {
        return this.usageStats.get(nodeId);
    }
    getAllUsageStats() {
        return Array.from(this.usageStats.values());
    }
    // Node capability checks
    isInboxEnabled(nodeId) {
        const node = this.getNode(nodeId);
        return node?.inboxEnabled ?? false;
    }
    isMintEnabled(nodeId) {
        const node = this.getNode(nodeId);
        return node?.mintEnabled ?? false;
    }
    hasCapability(nodeId, capability) {
        const node = this.getNode(nodeId);
        return node?.allowedAccess.includes(capability) ?? false;
    }
    getTrustBoundary(nodeId) {
        const node = this.getNode(nodeId);
        return node?.trustBoundary ?? 0;
    }
    isIsolated(nodeId) {
        const node = this.getNode(nodeId);
        return node?.isolation ?? false;
    }
    getAgentVisibility(nodeId) {
        const node = this.getNode(nodeId);
        return node?.agentVisibility ?? [];
    }
}
// Global registry instance
export const nodeRegistry = new DreamNodeRegistryImpl();
