/**
 * Heart Organ - The DreamNet Economic Engine
 * 
 * Manages the "8 Arms of the Octopus" and economic pulses.
 */

import { MANIFOLD, NerveEvent } from '@dreamnet/nerve';

export interface OctopusArm {
    name: string;
    status: "active" | "dormant" | "moving";
    allocation: number; // percentage or relative weight
}

export class HeartCore {
    private arms: OctopusArm[] = [
        { name: "Treasury Vault", status: "active", allocation: 40 },
        { name: "DeFi Liquidity", status: "active", allocation: 20 },
        { name: "Governance Voter", status: "dormant", allocation: 5 },
        { name: "Zora Minting", status: "active", allocation: 10 },
        { name: "Operations Fund", status: "moving", allocation: 10 },
        { name: "Shield Upkeep", status: "active", allocation: 5 },
        { name: "Research Grant", status: "dormant", allocation: 5 },
        { name: "Emergency Reserve", status: "active", allocation: 5 },
    ];

    constructor() {
        // Register Heart middleware to handle economic interception
        MANIFOLD.use(this.economicMiddleware.bind(this));
    }

    /**
     * Economic Middleware - Injects octopus/arm context into relevant events
     */
    private async economicMiddleware(event: NerveEvent, next: () => Promise<void> | void) {
        if (event.channelId === "TREASURY_MOVE") {
            console.log(`[Heart] Intercepted Treasury Move: Syncing Octopus Arms`);
            // Logic: Update arm status based on movement
            const opsArm = this.arms.find(a => a.name === "Operations Fund");
            if (opsArm) opsArm.status = "moving";
        }

        await next();
    }

    /**
     * Beat - Emit an economic pulse with full Octopus state
     */
    public async beat() {
        await MANIFOLD.process({
            id: crypto.randomUUID(),
            channelId: "SYSTEM_METRIC",
            kind: "METRIC_SNAPSHOT",
            priority: 4,
            context: { timestamp: new Date().toISOString() },
            payload: {
                metricName: "heart_rate",
                value: 72,
                arms: this.arms,
                totalStability: 0.95
            }
        });
    }
}

export const HEART = new HeartCore();
