import { EventEmitter } from 'events';
import { optioConnector, OptioNodeVigor } from '../digestive/platform-connector/src/optio/OptioConnector.js';

/**
 * OptioOrchestrator
 * Manages the Distributed Sovereignty of the 20-node Optio cluster.
 * Aggregates Proof-of-Impact (POI) and coordinates local inference workloads.
 */
export class OptioOrchestrator extends EventEmitter {
    private nodeIds: string[] = [];
    private clusterVigor: OptioNodeVigor[] = [];
    private syncInterval: NodeJS.Timeout | null = null;

    constructor() {
        super();
        // Initialize with the canonical 20-node cluster
        this.nodeIds = Array.from({ length: 20 }, (_, i) => `NODE_${i + 100}`);
    }

    /**
     * Start the Orchestrator
     */
    public async ignite() {
        console.log('[🚀 OptioOrchestrator] Igniting Distributed Sovereignty...');
        await this.syncPOIMetrics();

        // Start heartbeat sync every 60 seconds
        this.syncInterval = setInterval(() => this.syncPOIMetrics(), 60000);
    }

    /**
     * Aggregate Proof-of-Impact metrics across the cluster
     */
    public async syncPOIMetrics() {
        console.log('[📡 OptioOrchestrator] Syncing POI Metrics for 20 nodes...');
        try {
            this.clusterVigor = await optioConnector.getClusterVigor(this.nodeIds);

            const totalVigor = this.clusterVigor.reduce((acc, v) => acc + v.vigorScore, 0);
            const avgVigor = totalVigor / this.clusterVigor.length;

            console.log(`[📊 Cluster Stats] Avg Vigor: ${avgVigor.toFixed(2)}% | Nodes Online: ${this.clusterVigor.filter(n => n.status === 'ONLINE').length}`);

            this.emit('VIGOR_SYNCED', {
                avgVigor,
                nodes: this.clusterVigor,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('[❌ OptioOrchestrator] POI Sync Failed:', error);
        }
    }

    /**
     * Broadcast an agent's impact to the distributed network
     */
    public async delegateImpact(agentId: string, type: string, payload: any) {
        console.log(`[🔗 OptioOrchestrator] Delegating ${type} impact for ${agentId}`);
        const txHash = await optioConnector.broadcastImpact(agentId, {
            platform: 'Optio-Distributed',
            type,
            payload
        });

        return txHash;
    }

    public getClusterState() {
        return this.clusterVigor;
    }

    public stop() {
        if (this.syncInterval) clearInterval(this.syncInterval);
    }
}

export const optioOrchestrator = new OptioOrchestrator();
