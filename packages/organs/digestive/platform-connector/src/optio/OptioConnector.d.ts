/**
 * @dreamnet/platform-connector
 * OptioConnector: Bridge to the Optio Blockchain and POI Ecosystem.
 */
export interface OptioNodeVigor {
    nodeId: string;
    vigorScore: number;
    lastPulse: number;
    totalOptEarned: number;
    status: 'ONLINE' | 'OFFLINE' | 'STALL';
}
export declare class OptioConnector {
    private networkUrl;
    constructor(networkUrl?: string);
    /**
     * getClusterVigor
     * Monitors a list of nodes and returns their health and performance.
     */
    getClusterVigor(nodeIds: string[]): Promise<OptioNodeVigor[]>;
    /**
     * broadcastImpact
     * Submits activity to the Proof-of-Impact protocol.
     */
    broadcastImpact(agentId: string, impactData: {
        platform: string;
        type: string;
        payload: any;
    }): Promise<string>;
    /**
     * syncDailyRewards
     * Pulls reward data for the Economic Engine.
     */
    syncDailyRewards(nodeIds: string[]): Promise<number>;
}
export declare const optioConnector: OptioConnector;
//# sourceMappingURL=OptioConnector.d.ts.map