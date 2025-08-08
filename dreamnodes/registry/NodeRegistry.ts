import type { DreamNode, DreamNodeConfig, DreamNodeRegistry, NodeUsageStats } from '../types/DreamNode';

export class DreamNodeRegistryImpl implements DreamNodeRegistry {
  public nodes: Map<string, DreamNodeConfig> = new Map();
  private usageStats: Map<string, NodeUsageStats> = new Map();

  constructor() {
    // Initialize with system nodes
    this.initializeSystemNodes();
  }

  private initializeSystemNodes(): void {
    // FlutterBye node will be registered when imported
  }

  getNode(id: string): DreamNodeConfig | undefined {
    return this.nodes.get(id);
  }

  registerNode(node: DreamNodeConfig): void {
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

  listPublicNodes(): DreamNodeConfig[] {
    return Array.from(this.nodes.values()).filter(node => node.public);
  }

  listNodesByCreator(creator: string): DreamNodeConfig[] {
    return Array.from(this.nodes.values()).filter(node => node.creator === creator);
  }

  incrementUsage(nodeId: string): void {
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

  recordSuccess(nodeId: string, responseTime: number): void {
    const stats = this.usageStats.get(nodeId);
    if (stats) {
      stats.successfulRequests += 1;
      stats.averageResponseTime = (stats.averageResponseTime + responseTime) / 2;
    }
  }

  recordFailure(nodeId: string): void {
    const stats = this.usageStats.get(nodeId);
    if (stats) {
      stats.failedRequests += 1;
    }
  }

  recordUserActivity(nodeId: string, wallet: string): void {
    const stats = this.usageStats.get(nodeId);
    if (stats) {
      const existingUser = stats.topUsers.find(user => user.wallet === wallet);
      if (existingUser) {
        existingUser.requestCount += 1;
      } else {
        stats.topUsers.push({ wallet, requestCount: 1 });
      }
      
      // Keep only top 10 users
      stats.topUsers.sort((a, b) => b.requestCount - a.requestCount);
      stats.topUsers = stats.topUsers.slice(0, 10);
    }
  }

  getUsageStats(nodeId: string): NodeUsageStats | undefined {
    return this.usageStats.get(nodeId);
  }

  getAllUsageStats(): NodeUsageStats[] {
    return Array.from(this.usageStats.values());
  }

  // Node capability checks
  isInboxEnabled(nodeId: string): boolean {
    const node = this.getNode(nodeId);
    return node?.inboxEnabled ?? false;
  }

  isMintEnabled(nodeId: string): boolean {
    const node = this.getNode(nodeId);
    return node?.mintEnabled ?? false;
  }

  hasCapability(nodeId: string, capability: string): boolean {
    const node = this.getNode(nodeId);
    return node?.allowedAccess.includes(capability) ?? false;
  }

  getTrustBoundary(nodeId: string): number {
    const node = this.getNode(nodeId);
    return node?.trustBoundary ?? 0;
  }

  isIsolated(nodeId: string): boolean {
    const node = this.getNode(nodeId);
    return node?.isolation ?? false;
  }

  getAgentVisibility(nodeId: string): string[] {
    const node = this.getNode(nodeId);
    return node?.agentVisibility ?? [];
  }
}

// Global registry instance
export const nodeRegistry = new DreamNodeRegistryImpl();