import { dreamEventBus } from '../../../nerve/src/spine/dreamnet-event-bus/index.js';

/**
 * RELIABILITY GUARD (The Night Watchman)
 * Obsession: Stability & Uptime.
 * Directive: Monitor the Mercenary Crew & Social Mech Suits.
 */

export class ReliabilityGuard {
    private errorBuffer: number[] = [];
    private lastMercenaryActivity: number = Date.now();
    private lastSocialActivity: number = Date.now();

    constructor() {
        console.log("🛡️ [Watchman] Night Watchman taking his post...");
        this.initWatch();
    }

    private initWatch() {
        // --- 1. Mercenary Crew (Trading) ---
        dreamEventBus.subscribe('FlashTrader.Signal', () => {
            this.lastMercenaryActivity = Date.now();
            console.log("🛡️ [Watchman] Mercenary Pulse Detected: FlashTrader Signal.");
        });

        dreamEventBus.subscribe('DutchBook.Hedge', () => {
            this.lastMercenaryActivity = Date.now();
            console.log("🛡️ [Watchman] Mercenary Pulse Detected: DutchBook Hedge.");
        });

        // --- 2. Social Mech Suits (Outreach) ---
        dreamEventBus.subscribe('WolfPack.Outreach', () => {
            this.lastSocialActivity = Date.now();
            console.log("🛡️ [Watchman] Social Mech Pulse Detected: WolfPack Outreach.");
        });

        dreamEventBus.subscribe('Social.Pulse', (data) => this.trackCrewActivity('SocialMech', data));

        // Sentinel Build Watcher
        dreamEventBus.subscribe('Sentinel.Pulse', (data) => {
            console.log(`🛡️ [Watchman] Sentinel Pulse: ${data.status}`);
            if (data.status === 'DEBT_DETECTED') {
                this.recordError('Sentinel', data.error);
            }
        });

        dreamEventBus.subscribe('System.RefactorNeeded', (data) => {
            console.log(`⚠️ [Watchman] REFACTOR_REQUIRED: ${data.component} - ${data.reason}`);
            this.recordError('System', data.reason);
        });
    }

    logError() {
        this.errorBuffer.push(Date.now());
    }

    analyze() {
        const now = Date.now();
        const FIVE_MINUTES = 5 * 60 * 1000;

        const recentErrors = this.errorBuffer.filter(t => now - t < 60000).length;
        const mercenarySilence = now - this.lastMercenaryActivity;
        const socialSilence = now - this.lastSocialActivity;

        // Clean old errors
        this.errorBuffer = this.errorBuffer.filter(t => now - t < 60000);

        if (recentErrors > 10) {
            return { command: 'BACK_OFF', confidence: 1.0, reason: `Thermal spike: ${recentErrors} errors/min.` };
        }

        if (mercenarySilence > FIVE_MINUTES) {
            return { command: 'WARN', confidence: 0.9, reason: 'Mercenary Crew (Trading) pulse lost. Logic stalled?' };
        }

        if (socialSilence > FIVE_MINUTES * 2) { // Allow more leeway for social
            return { command: 'WARN', confidence: 0.7, reason: 'Social Mech Suits (Outreach) pulse lost.' };
        }

        return { command: 'GREEN', confidence: 0.9, reason: 'System healthy. All crews active.' };
    }
}
