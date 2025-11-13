import type { DreamNodeConfig, DreamNodeRegistry, NodeUsageStats } from '../types/DreamNode';
export declare class DreamNodeRegistryImpl implements DreamNodeRegistry {
    nodes: Map<string, DreamNodeConfig>;
    private usageStats;
    constructor();
    private initializeSystemNodes;
    getNode(id: string): DreamNodeConfig | undefined;
    registerNode(node: DreamNodeConfig): void;
    listPublicNodes(): DreamNodeConfig[];
    listNodesByCreator(creator: string): DreamNodeConfig[];
    incrementUsage(nodeId: string): void;
    recordSuccess(nodeId: string, responseTime: number): void;
    recordFailure(nodeId: string): void;
    recordUserActivity(nodeId: string, wallet: string): void;
    getUsageStats(nodeId: string): NodeUsageStats | undefined;
    getAllUsageStats(): NodeUsageStats[];
    isInboxEnabled(nodeId: string): boolean;
    isMintEnabled(nodeId: string): boolean;
    hasCapability(nodeId: string, capability: string): boolean;
    getTrustBoundary(nodeId: string): number;
    isIsolated(nodeId: string): boolean;
    getAgentVisibility(nodeId: string): string[];
}
export declare const nodeRegistry: DreamNodeRegistryImpl;
