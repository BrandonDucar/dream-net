/**
 * Units Organ - The DreamNet Mini-App & Task System
 * 
 * Manages atomic units of work (Mini-Apps, Spores, Squads).
 */

import { MANIFOLD, NerveEvent } from '@dreamnet/nerve';

export class UnitsCore {
    constructor() {
        // Register Units middleware
        MANIFOLD.use(this.taskMiddleware.bind(this));
    }

    /**
     * Task Middleware - Intercepts events to trigger mini-app tasks
     */
    private async taskMiddleware(event: NerveEvent, next: () => Promise<void> | void) {
        if (event.channelId === "GEOFENCE_EVENT") {
            console.log(`[Units] Triggering localized mini-app task: ${event.id}`);
        }

        await next();
    }

    /**
     * Spore - Emit a mini-app readiness pulse
     */
    public async spore() {
        await MANIFOLD.process({
            id: crypto.randomUUID(),
            channelId: "SYSTEM_METRIC",
            kind: "METRIC_SNAPSHOT",
            priority: 3,
            context: { timestamp: new Date().toISOString() },
            payload: {
                metricName: "unit_readiness",
                value: 1,
                activeMiniApps: 42
            }
        });
    }
}

export const UNITS = new UnitsCore();
