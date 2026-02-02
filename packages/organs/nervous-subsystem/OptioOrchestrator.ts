import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';
import { optioConnector, OptioNodeVigor } from '../digestive/platform-connector/src/optio/OptioConnector.js';
import { dreamEventBus } from '../nervous/nerve/src/spine/dreamnet-event-bus/index.js';

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
        this.loadNodeIds();
    }

    private loadNodeIds() {
        try {
            // Load the canonical 20-node cluster from config
            const configPath = path.resolve(process.cwd(), 'packages/organs/digestive/platform-connector/configs/OptioClusterConfig.json');
            if (fs.existsSync(configPath)) {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                this.nodeIds = config.nodes.map((n: any) => n.id);
                console.log(`[🚀 OptioOrchestrator] Loaded ${this.nodeIds.length} nodes from Sovereign Cluster Config.`);
            } else {
                console.warn('[⚠️ OptioOrchestrator] Config file not found. Using hardcoded nodes.');
                this.nodeIds = [
                    "000000004f2f4803", "00000000579e0066", "0000000080d85ec4", "00000000a0b81e8b",
                    "00000000755ee4f8", "000000007357c917", "00000000f684826d", "000000004e90db7c",
                    "000000002f2bcc71", "0000000085a5e305", "0000000109a2503d", "00000000c258d4a6",
                    "00000000072b2609", "0000000086a9f4c3", "00000000527339d2", "00000000300ee3b1",
                    "00000000ee72e276", "00000000673413cb", "000000004f0561e1", "00000000eb9c2c2f"
                ];
                console.log(`[🚀 OptioOrchestrator] Loaded ${this.nodeIds.length} nodes from hardcoded list.`);
            }
        } catch (error) {
            console.error('[❌ OptioOrchestrator] Failed to load node IDs:', error);
            console.warn('[⚠️ OptioOrchestrator] Using fallback nodes due to error.');
            this.nodeIds = Array.from({ length: 20 }, (_, i) => `NODE_${i + 100}`);
        }
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
    /**
     * bindNodeAsSovereignAsset
     * Bind an Optio node to a sovereign identity (TBA).
     * Fulfills Balaji's Mandate: Physical Sovereignty of the rack.
     */
    public async bindNodeAsSovereignAsset(nodeId: string, walletAddress: string) {
        console.log(`[🛸 OPTIO] Binding Physical Node ${nodeId} to Sovereign Wallet ${walletAddress}...`);

        // Mocking the on-chain binding to an ERC-6551 Registry logic
        const txStub = `0x${Math.random().toString(16).substr(2, 64)}`;

        this.clusterVigor = this.clusterVigor.map(v =>
            v.nodeId === nodeId ? { ...v, status: 'SOVEREIGN_BOUND', owner: walletAddress } : v
        );

        this.emit('node.sovereign_bound', { nodeId, walletAddress, txStub });

        console.log(`✅ [🛸 OPTIO] Node ${nodeId} is now a Physical Sovereignty Asset. TX: ${txStub}`);
        return txStub;
    }
    public async syncPOIMetrics() {
        console.log('[📡 OptioOrchestrator] Syncing POI Metrics for 20 nodes...');
        try {
            this.clusterVigor = await optioConnector.getClusterVigor(this.nodeIds);

            // Calculate aggregated POI
            const totalImpact = this.calculateClusterPOI(this.clusterVigor);
            const avgVigor = this.clusterVigor.reduce((acc, v) => acc + v.vigorScore, 0) / this.clusterVigor.length;

            console.log(`[📊 Cluster Stats] Avg Vigor: ${avgVigor.toFixed(2)}% | Total POI: ${totalImpact.toFixed(2)} OPT`);

            dreamEventBus.publish('System.OptioVigor', {
                avgVigor,
                totalImpact,
                onlineCount: this.clusterVigor.filter(n => n.status === 'ONLINE').length,
                timestamp: Date.now()
            });

            this.emit('VIGOR_SYNCED', {
                avgVigor,
                totalImpact,
                nodes: this.clusterVigor,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('[❌ OptioOrchestrator] POI Sync Failed:', error);
        }
    }

    private calculateClusterPOI(vigor: OptioNodeVigor[]): number {
        // Simplified POI calculation: Impact = Sum(Earned * VigorRatio)
        return vigor.reduce((acc, n) => {
            const vigorRatio = n.vigorScore / 100;
            return acc + (n.totalOptEarned * vigorRatio);
        }, 0) / 1000; // Normalized scale
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
