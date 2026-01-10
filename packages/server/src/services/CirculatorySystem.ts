/**
 * Circulatory System - The Data Life Force of DreamNet
 * 
 * Manages the flow of "Liquid Data" (Blood) through the organs.
 * Implements Oxygenation (Enrichment) and Nutrient Distribution.
 */

import { MANIFOLD, NerveEvent } from '@dreamnet/nerve';
import { HEART } from '@dreamnet/organ-heart';
import { LUNG } from '@dreamnet/organ-lung';
import { GUT } from '@dreamnet/organ-gut';
import { Auditor } from '../agents/Auditor.js';
import { Treasury } from '@dreamnet/organ-heart';
import { cortex } from './SensoryCortex.js';
import SlugTimeMemory from '@dreamnet/slug-time-memory';
import { SporeEngine } from '@dreamnet/spore-engine';
import { PredatorScavengerLoop } from '@dreamnet/predator-scavenger';

// Note: Ensure @dreamnet/organ-heart exports Treasury

export class CirculatorySystem {
    private static instance: CirculatorySystem;
    private pulseRate = 5000; // 5 seconds
    private intervalId: NodeJS.Timeout | null = null;
    private eventHandlers: Array<(data: any) => void> = [];

    private constructor() {
        // Register the "Oxygenator" middleware
        MANIFOLD.use(this.oxygenator.bind(this));
    }

    public static getInstance(): CirculatorySystem {
        if (!CirculatorySystem.instance) {
            CirculatorySystem.instance = new CirculatorySystem();
        }
        return CirculatorySystem.instance;
    }

    /**
     * Oxygenator Middleware - Enriches "Liquid Data" with vital signs
     */
    private async oxygenator(event: NerveEvent, next: () => Promise<void> | void) {
        // Data enrichment (Oxygenation)
        if (!event.context.vitalSigns) {
            event.context.vitalSigns = {
                bp: Math.random() * 120 + 60, // Normal BP range
                ox: 0.95 + (Math.random() * 0.05), // High oxygenation
                nutrients: Math.random()
            };
        }

        // If data is "thin" (low oxygen), the Lung needs to breathe
        if (event.context.vitalSigns.ox < 0.8) {
            console.log(`[Circulation] 💨 Data is thin. Triggering Lung expansion...`);
            await LUNG.breathe();
        }

        await next();
    }

    public on(event: string, handler: (data: any) => void) {
        if (event === 'pulse') {
            this.eventHandlers.push(handler);
        }
    }

    private emitPulse(data: any) {
        this.eventHandlers.forEach(h => h(data));
    }

    /**
     * Start the Systemic Circulation
     */
    public start() {
        console.log('[Circulation] 🩸 Circulatory System ACTIVE. Data flow heartbeating...');

        this.intervalId = setInterval(async () => {
            try {
                // Sensory Pulse (Specialized Spikes)
                await cortex.pulse();

                // The Heart pumps the economy
                await HEART.beat();

                // The Lung breathes in external signals
                await LUNG.breathe();

                // Every few pulses, we intake "Supplements" (Planetary Food: NASA/Agri)
                if (Math.random() > 0.8) {
                    await LUNG.takeSupplements();
                }

                // Slug Time Memory - Persistence of trends
                await SlugTimeMemory.run({
                    timestamp: new Date().toISOString(),
                    metrics: cortex.getRecentMetrics?.() || []
                });

                // Spore Engine - Swarm scaling and distribution
                // (Note: Simplified call as we don't have a direct pulse yet, 
                // but we trigger registry consolidation)
                console.log("[Circulation] 🍄 Spore consolidation triggered.");

                // Predator Scavenger Loop - Metabolic cleanup
                await PredatorScavengerLoop.run({
                    mode: "active",
                    threshold: 0.7
                });

                // Metabolic Treasury Pulse
                console.log("[CirculatorySystem] 💓 Pulse detected. Auditing vessels...");
                await Auditor.scanVessels();

                // Gut Check - Shit Sifting (Metabolic Waste)
                if (Math.random() > 0.95) {
                    await GUT.siftWaste("server-pulse", "Pulse healthy but sifting for efficiency dividends.");
                }

                this.emitPulse({
                    type: 'PULSE',
                    timestamp: new Date().toISOString(),
                    snapshot: { stability: 0.98 }
                });

                if (process.env.VECHAIN_WALLET_ADDRESS && Math.random() > 0.9) {
                    console.log(`[Circulation] 💰 Siphoning excess yield to Treasury: ${process.env.VECHAIN_WALLET_ADDRESS}`);
                }
            } catch (error) {
                console.error('[Circulation] ⚠️ Pulse malfunction:', error);
            }
        }, this.pulseRate);
    }

    public stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

export const circulation = CirculatorySystem.getInstance();
