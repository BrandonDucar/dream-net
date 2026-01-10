/**
 * Skin Organ - The DreamNet Visual Layer
 * 
 * Manages UI state, themes, and visual feedback pulses.
 */

import { MANIFOLD, NerveEvent } from '@dreamnet/nerve';

export class SkinCore {
    constructor() {
        // Register Skin middleware
        MANIFOLD.use(this.visualMiddleware.bind(this));
    }

    /**
     * Visual Middleware - Intercepts events to trigger visual feedback
     */
    private async visualMiddleware(event: NerveEvent, next: () => Promise<void> | void) {
        if (event.kind === "THREAT_DETECTED") {
            console.log(`[Skin] Triggering red screen flash for threat!`);
        }

        await next();
    }

    /**
     * Glow - Emit a visual readiness pulse
     */
    public async glow() {
        await MANIFOLD.process({
            id: crypto.randomUUID(),
            channelId: "SYSTEM_METRIC",
            kind: "METRIC_SNAPSHOT",
            priority: 1,
            context: { timestamp: new Date().toISOString() },
            payload: {
                metricName: "visual_fidelity",
                value: 9.5,
                theme: "cyber-punk-high-fi"
            }
        });
    }
}

export const SKIN = new SkinCore();
