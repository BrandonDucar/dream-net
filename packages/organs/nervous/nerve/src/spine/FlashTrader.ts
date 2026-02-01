/**
 * ⚡ FlashTrader: The Alpha Execution Core
 * 
 * Philosophy: Speed is the only moat. Arbitrage is the only truth.
 * Mechanism: Listen for Market.OpportunityDetected, validate, and execute.
 */

import { dreamEventBus } from './dreamnet-event-bus/index.js';
import { pilotRegistry } from './PilotRegistry.js';
import { elizaBridge } from './ElizaBridge.js';
import { Genome } from '../../../shared/genetic/Genome.js';
import { nursery } from './Nursery.js';

export interface MarketOpportunity {
    opportunityId: string;
    protocol: string;
    tokenPair: [string, string];
    expectedYield: number; // Percentage
    confidence: number;    // 0.0 - 1.0
}

export class FlashTrader {
    private static instance: FlashTrader;
    private stats = { totalAlpha: 0, tradeCount: 0 };
    private genome: Genome;

    private constructor() {
        // Initial 'Amnesia Haze' Genome (Optimized for Speed)
        this.genome = {
            strain: "Amnesia Haze",
            generation: 1,
            genes: {
                maxSlippage: { name: "Max Slippage", value: 0.015, min: 0.001, max: 0.05, mutationRate: 0.1 },
                minYield: { name: "Min Yield", value: 0.02, min: 0.005, max: 0.1, mutationRate: 0.1 },
                confidenceThreshold: { name: "Confidence", value: 0.85, min: 0.5, max: 1.0, mutationRate: 0.1 }
            }
        };

        nursery.register('FlashTrader', this.genome);
        this.ignite();
        this.listenForEvolution();
    }

    public static getInstance(): FlashTrader {
        if (!FlashTrader.instance) {
            FlashTrader.instance = new FlashTrader();
        }
        return FlashTrader.instance;
    }

    private ignite() {
        console.log(`[⚡ FlashTrader] Economic Engine Ignited with ${this.genome.strain}. Monitoring the pulse...`);

        dreamEventBus.subscribe('Market.OpportunityDetected', async (envelope) => {
            const opportunity = envelope.payload as MarketOpportunity;
            await this.handleOpportunity(opportunity);
        });
    }

    private async handleOpportunity(opportunity: MarketOpportunity) {
        // Genomic Validation
        const minYield = this.genome.genes.minYield.value;
        const minConfidence = this.genome.genes.confidenceThreshold.value;

        console.log(`[⚡ FlashTrader] Evaluating ${opportunity.opportunityId}: Yield ${opportunity.expectedYield.toFixed(4)}, Confidence ${opportunity.confidence.toFixed(2)}`);

        if (opportunity.expectedYield >= minYield && opportunity.confidence >= minConfidence) {
            console.log(`[⚡ FlashTrader] PREDATORY TRIGGER: High vigor alpha detected (${(opportunity.confidence * 100).toFixed(1)}%).`);

            const pilotId = pilotRegistry.getPilotForSuit('arbitrage');
            if (!pilotId) {
                console.warn("[⚡ FlashTrader] CRITICAL: No Arbitrage Pilots available. Alpha escaping...");
                return;
            }

            const txResult = await elizaBridge.signal({
                agentId: pilotId,
                plugin: 'defi',
                action: 'execute_swap',
                payload: {
                    protocol: opportunity.protocol,
                    tokens: opportunity.tokenPair,
                    amount: "MAX_AVAILABLE"
                }
            });

            if (txResult.success) {
                this.stats.totalAlpha += opportunity.expectedYield;
                this.stats.tradeCount++;
                console.log(`[⚡ FlashTrader] ALPHA EXTRACTED: Trade executed successfully. Hash: ${txResult.payload?.hash || '0xSimulated'}`);

                dreamEventBus.publish({
                    type: 'Market.TradeExecuted',
                    payload: { ...opportunity, trader: 'FlashTrader', finalAlpha: opportunity.expectedYield },
                    source: 'FlashTrader'
                });

                // Publish for Nursery fitness tracking
                dreamEventBus.publish({
                    type: 'Market.AlphaExtracted',
                    payload: { agentId: 'FlashTrader', yield: opportunity.expectedYield },
                    source: 'FlashTrader'
                });
            }
        } else {
            console.log(`   ❌ ALPHA REJECTED: Does not meet ${this.genome.strain} genomic threshold.`);
        }
    }

    private listenForEvolution() {
        dreamEventBus.subscribe('Agent.GeneticShift', (envelope: any) => {
            const { agentId, current: newGenome } = envelope.payload;
            if (agentId === 'FlashTrader') {
                console.log(`[⚡ FlashTrader] GENOMIC SHIFT DETECTED. Upgrading to Generation ${newGenome.generation}...`);
                this.genome = newGenome;
            }
        });
    }

    public getStats() {
        return {
            ...this.stats,
            currentGenome: this.genome
        };
    }
}

export const flashTrader = FlashTrader.getInstance();
