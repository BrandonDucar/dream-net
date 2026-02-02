import { DreamEventBus } from './dreamnet-event-bus/index.js';

// Import core packages
// import { WolfPack } from '@dreamnet/wolf-pack';
// import { WhalePackCore } from '@dreamnet/whale-pack-core';
// import { OrcaPackCore } from '@dreamnet/orca-pack-core';
// import { HaloLoop } from '@dreamnet/halo-loop';
// import { DreamCortex } from '@dreamnet/dream-cortex';
// import { ReputationLattice } from '@dreamnet/reputation-lattice';
// import { ShieldCore } from '@dreamnet/shield-core';
// import { SpiderWebCore } from '../spider-web/index.js';
// import { StarBridgeLungs } from '@dreamnet/star-bridge-lungs';
// import { AliveMode } from '@dreamnet/alive-mode';
// import { flushAllWormholes } from '../wormholes/dispatcher.js';

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
            try {
                const { flushAllWormholes } = await import('../wormholes/dispatcher.js');
                await flushAllWormholes();
            } catch (e) { console.error('[Heartbeat] MagRail failed to load/run', e); }

            // 1. Health Check (Alive Mode)
            try {
                const { AliveMode } = await import('@dreamnet/alive-mode');
                AliveMode.check();
            } catch (e) { }

            // 2. Security Scan (Shield Core)
            try {
                const { ShieldCore } = await import('@dreamnet/shield-core');
                ShieldCore.run({ timestamp } as any);
            } catch (e) {
                // Shield might be headless in some configs
            }

            // 3. Health Monitoring (Halo Loop)
            try {
                const { HaloLoop } = await import('@dreamnet/halo-loop');
                HaloLoop.run({ timestamp } as any);
            } catch (e) { }

            // 4. Intelligence Processing (Spider Web)
            try {
                const { SpiderWebCore } = await import('../spider-web/index.js');
                await SpiderWebCore.run({ timestamp } as any);
            } catch (e) { }

            // 5. Cross-Chain Metrics (Star Bridge Lungs)
            try {
                const { StarBridgeLungs } = await import('@dreamnet/star-bridge-lungs');
                StarBridgeLungs.run({ timestamp } as any);
            } catch (e) { }

            // 6. Agent Packs (Wolf, Whale, Orca)
            // WolfPack is heavy, load carefully
            try {
                const { WolfPack } = await import('@dreamnet/wolf-pack');
                WolfPack.run({} as any);
            } catch (e) { }

            try {
                const { WhalePackCore } = await import('@dreamnet/whale-pack-core');
                WhalePackCore.run({} as any);
            } catch (e) { }

            try {
                const { OrcaPackCore } = await import('@dreamnet/orca-pack-core');
                OrcaPackCore.run({} as any);
            } catch (e) { }

            // 7. Dream Management (Cortex)
            try {
                const { DreamCortex } = await import('@dreamnet/dream-cortex');
                DreamCortex.run({} as any);
            } catch (e) { }

            // 8. Reputation Updates
            try {
                const { ReputationLattice } = await import('@dreamnet/reputation-lattice');
                ReputationLattice.run({} as any);
            } catch (e) { }

            // 9. Mastery Tracking (Agent Progress)
            try {
                const { masteryTracker } = await import('./MasteryTracker.js');
                // No specific 'run' method yet, but it listens to events.
                // We'll publish a pulse for mastery if needed.
            } catch (e) { }

            // console.log("[SystemHeartbeat] 💓 Thump-thump");

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
