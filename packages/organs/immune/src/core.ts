/**
 * Immune Organ - The DreamNet Defense System
 * 
 * Handles threat detection, mitigation, and security pulses.
 */

import { MANIFOLD, NerveEvent } from '@dreamnet/nerve';

export class ImmuneCore {
    constructor() {
        // Register Immune middleware to the Nerve Manifold
        MANIFOLD.use(this.securityMiddleware.bind(this));
    }

    /**
     * Security Middleware - Intercepts all inter-organ traffic for threats
     */
    private async securityMiddleware(event: NerveEvent, next: () => Promise<void> | void) {
        // Scan for threats
        const risk = this.analyzeRisk(event);

        if (risk > 80) {
            console.warn(`[Immune] High risk detected on event ${event.id}: MITIGATING`);
            event.payload = {
                ...event.payload,
                mitigated: true,
                originalRisk: risk
            };
            // We could potentially block the event by NOT calling next(), 
            // but for development we just flag it.
        }

        await next();
    }

    /**
     * Analyze Risk - Basic heuristic scanning for now
     */
    private analyzeRisk(event: NerveEvent): number {
        // Logic: If payload contains sensitive keywords or unexpected patterns
        const content = JSON.stringify(event.payload).toLowerCase();
        if (content.includes('exploit') || content.includes('malware')) return 99;
        if (event.priority === 5) return 10; // High priority is usually trusted
        return 0;
    }

    /**
     * Pulse - Emit a security status tick
     */
    public async pulse() {
        await MANIFOLD.process({
            id: crypto.randomUUID(),
            channelId: "SHIELD_EVENT",
            kind: "SHIELD_PHASE_TICK",
            priority: 3,
            context: { timestamp: new Date().toISOString() },
            payload: { integrity: 0.98, status: "stable" }
        });
    }
}

export const IMMUNE = new ImmuneCore();
