import { runOrcaPackCycle } from '../../../orca-pack-core/scheduler/orcaScheduler.js';
import { SynapticBridge } from './SynapticBridge.js';
import { DiscordSuit } from './suits/DiscordSuit.js';

/**
 * PulseHeart: The Autonomic Nervous System.
 * It keeps the DreamNet alive by triggering regular cognitive cycles.
 */
export class PulseHeart {
    private bridge: SynapticBridge;
    private intervalRef: NodeJS.Timeout | null = null;
    private isRunning: boolean = false;
    private intervalMs: number;

    constructor(intervalMinutes: number = 5) {
        this.bridge = new SynapticBridge();
        this.intervalMs = intervalMinutes * 60 * 1000;
    }

    /**
     * IGNITE THE HEART.
     * Starts the autonomous beat.
     */
    public start() {
        if (this.isRunning) return;

        console.log("[PulseHeart] ❤️ System Heartbeat Started.");

        // Wire the bridge immediately
        this.bridge.wire();

        // Run one beat immediately
        this.beat();

        // Schedule future beats
        this.intervalRef = setInterval(() => this.beat(), this.intervalMs);
        this.isRunning = true;
    }

    public stop() {
        if (this.intervalRef) clearInterval(this.intervalRef);
        this.isRunning = false;
        console.log("[PulseHeart] 💔 System Heartbeat Stopped.");
    }

    /**
     * A single contracting beat of the heart.
     * Circulates information (Radar) and Action (Posts).
     */
    private async beat() {
        console.log(`\n[PulseHeart] Thump-Thump... (${new Date().toISOString()})`);

        try {
            // 1. Run the Orca Pack Cognitive Cycle (Think -> Plan -> Post)
            // The Bridge is already wired, so 'Post' will transmit to Discord/Telegram
            const status = await runOrcaPackCycle({
                // We can inject a narrative field here if we have one, or mock it
                narrativeField: undefined,
                vectorDb: undefined
            });

            console.log(`[PulseHeart] Cycle Complete. Status: ${status.state}`);

        } catch (e: any) {
            console.error(`[PulseHeart] Arrhythmia (Error): ${e.message}`);
        }
    }
}
