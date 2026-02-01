
import { dreamEventBus } from '../../../nerve/src/spine/dreamnet-event-bus/index.js';

/**
 * AliveMode: The Pulse of the Organism
 * 
 * Ensures that the Sovereign Monolith is truly "Alive".
 * Monitors component heartbeats and emits 'System.Stabilized' or 'System.Arrhythmia'.
 */
export class AliveMode {
    private static instance: AliveMode;
    private heartbeats: Record<string, number> = {};
    private readonly TOLERANCE_MS = 65000; // 65 seconds (allows for 1 min ticks + buffer)
    private checkInterval: NodeJS.Timeout | null = null;
    private isPaused: boolean = false;

    private constructor() {
        this.startMonitoring();
    }

    public static getInstance(): AliveMode {
        if (!AliveMode.instance) {
            AliveMode.instance = new AliveMode();
        }
        return AliveMode.instance;
    }

    public pulse(componentName: string) {
        if (this.isPaused) return;

        this.heartbeats[componentName] = Date.now();
        // console.log(`[AliveMode] 💜 Pulse received: ${componentName}`);
    }

    public pause() {
        this.isPaused = true;
        console.log('[AliveMode] ⏸️ System Monitoring PAUSED (Maintenance Mode)');
    }

    public resume() {
        this.isPaused = false;
        console.log('[AliveMode] ▶️ System Monitoring RESUMED');
    }

    private startMonitoring() {
        console.log('[AliveMode] 🏥 Heartbeat Monitor Active');

        this.checkInterval = setInterval(() => {
            if (this.isPaused) return;
            this.runHealthCheck();
        }, 30000); // Check every 30s
    }

    private runHealthCheck() {
        const now = Date.now();
        const criticalOrgans = [
            'WolfPackFundingAgent',
            'GlobalScanningService'
        ];

        let healthy = true;
        const statusReport: any = {};

        for (const organ of criticalOrgans) {
            const lastBeat = this.heartbeats[organ] || 0;
            const diff = now - lastBeat;

            if (diff > this.TOLERANCE_MS) {
                healthy = false;
                console.warn(`[AliveMode] ⚠️ ARRHYTHMIA DETECTED: ${organ} has not pulsed in ${Math.round(diff / 1000)}s.`);
            }
            statusReport[organ] = diff < this.TOLERANCE_MS ? 'HEALTHY' : 'CRITICAL';
        }

        if (healthy) {
            dreamEventBus.publish({
                type: 'System.Stabilized',
                payload: { status: 'OPTIMAL', organs: statusReport },
                source: 'AliveMode'
            });
            // console.log('[AliveMode] ✅ System Stable.');
        } else {
            dreamEventBus.publish({
                type: 'System.Arrhythmia',
                payload: { status: 'DEGRADED', organs: statusReport },
                source: 'AliveMode'
            });
        }
    }
}

export const aliveMode = AliveMode.getInstance();
