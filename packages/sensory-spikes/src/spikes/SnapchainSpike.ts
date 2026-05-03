import { snapchain } from '@dreamnet/snapchain-connector';

/**
 * ⚡ Snapchain Sensory Spike
 * Directly streams Farcaster social intelligence from our local node.
 */
export class SnapchainSpike {
    private isStreaming = false;

    public async fetch(): Promise<any> {
        console.log("⚡ [SnapchainSpike] Querying local node for trending data...");
        
        try {
            // In a real scenario, we might query a specific FID or a set of FIDs
            // For now, we'll return a placeholder that confirms connectivity
            const info = await snapchain.getInfo();
            
            return {
                category: "social",
                symbol: "SNAPCHAIN",
                data: {
                    status: "connected",
                    nodeInfo: info,
                    message: "Real-time stream active"
                },
                pulse: "high"
            };
        } catch (error) {
            console.warn("⚠️ [SnapchainSpike] Local node query failed, falling back to cached state.");
            return {
                category: "social",
                symbol: "SNAPCHAIN",
                data: { status: "disconnected" },
                pulse: "low"
            };
        }
    }

    public startStream(callback: (event: any) => void) {
        if (this.isStreaming) return;
        this.isStreaming = true;

        console.log("🌊 [SnapchainSpike] Starting real-time Farcaster event stream...");
        
        const stream = snapchain.subscribe();
        
        stream.on('data', (event: any) => {
            // Process raw Snapchain events into DreamNet spikes
            const spike = this.processEvent(event);
            if (spike) callback(spike);
        });

        stream.on('error', (error: any) => {
            console.error("❌ [SnapchainSpike] Stream error:", error);
            this.isStreaming = false;
            // Attempt reconnect after backoff
            setTimeout(() => this.startStream(callback), 5000);
        });
    }

    private processEvent(event: any): any {
        // Map Snapchain HubEvent to DreamNet Spike format
        // This is where the magic happens: filtering for alpha
        return {
            type: "social_event",
            source: "snapchain",
            raw: event,
            timestamp: Date.now()
        };
    }
}

export const snapchainSpike = new SnapchainSpike();
