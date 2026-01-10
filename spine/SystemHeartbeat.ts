import { DreamEventBus } from './dreamnet-event-bus/DreamEventBus.js';

// Import core packages
import { WolfPack } from '@dreamnet/wolf-pack';
import { WhalePackCore } from '@dreamnet/whale-pack-core';
import { OrcaPackCore } from '@dreamnet/orca-pack-core';
import { HaloLoop } from '@dreamnet/halo-loop';
import { DreamCortex } from '@dreamnet/dream-cortex';
import { ReputationLattice } from '@dreamnet/reputation-lattice';
import { ShieldCore } from '@dreamnet/shield-core';
import { SpiderWebCore } from '@dreamnet/spider-web-core';
import { StarBridgeLungs } from '@dreamnet/star-bridge-lungs';
import { AliveMode } from '@dreamnet/alive-mode';
import { flushAllWormholes } from '@dreamnet/event-wormholes';

export class SystemHeartbeat {
    private intervalId: NodeJS.Timeout | null = null;
    private isRunning = false;

    constructor(private eventBus: DreamEventBus) { }

    public start(intervalMs: number = 5000) {
        if (this.isRunning) return;

        console.log('[SystemHeartbeat] Starting system pulse...');
        this.isRunning = true;

        this.intervalId = setInterval(async () => {
            await this.pulse();
        }, intervalMs);

        this.eventBus.publish(this.eventBus.createEnvelope(
            'System.HeartbeatStarted',
            'system-heartbeat',
            { timestamp: Date.now(), intervalMs }
        ));
    }

    public stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        console.log('[SystemHeartbeat] System pulse stopped.');

        this.eventBus.publish(this.eventBus.createEnvelope(
            'System.HeartbeatStopped',
            'system-heartbeat',
            { timestamp: Date.now() }
        ));
    }

    private async pulse() {
        const timestamp = Date.now();

        try {
            // 0. MagRail: Flush Wormholes (Batch Processing)
            await flushAllWormholes();

            // 1. Health Check (Alive Mode)
            // AliveMode.check(); 

            // 2. Security Scan (Shield Core)
            ShieldCore.run({ timestamp } as any);

            // 3. Health Monitoring (Halo Loop)
            HaloLoop.run({ timestamp } as any);

            // 4. Intelligence Processing (Spider Web)
            await SpiderWebCore.run({ timestamp } as any);

            // 5. Cross-Chain Metrics (Star Bridge Lungs)
            StarBridgeLungs.run({ timestamp } as any);

            // 6. Agent Packs (Wolf, Whale, Orca)
            WolfPack.run({} as any);
            WhalePackCore.run({} as any);
            OrcaPackCore.run({} as any);

            // 7. Dream Management (Cortex)
            DreamCortex.run({} as any);

            // 8. Reputation Updates
            ReputationLattice.run({} as any);

            // Emit pulse event
            this.eventBus.publish(this.eventBus.createEnvelope(
                'System.Pulse',
                'system-heartbeat',
                { timestamp, status: 'nominal' }
            ));

        } catch (error: any) {
            console.error('[SystemHeartbeat] Pulse failed:', error);
            this.eventBus.publish(this.eventBus.createEnvelope(
                'System.PulseFailed',
                'system-heartbeat',
                { error: error.message, timestamp },
                { eventId: crypto.randomUUID(), timestamp, severity: 'high' }
            ));
        }
    }
}
