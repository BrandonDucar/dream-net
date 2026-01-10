/**
 * 🌀 MetabolicCortex: The Recursive Intelligence Loop
 * 
 * Role: Analyzes the Analyzation. 
 * Mechanism: Collects 'ReportBack' signals from pilots and synthesizes them 
 * into high-level 'Synaptic Insights' for the shared Mental DNA.
 */

import { brainGate } from './BrainGate.js';
import { IdentityMask } from './IdentityMask.js';

export interface NeuralReport {
    agentId: string;
    suit: string;
    data: any;
    timestamp: number;
}

export class MetabolicCortex {
    private static instance: MetabolicCortex;
    private reportHistory: NeuralReport[] = [];

    private constructor() { }

    public static getInstance(): MetabolicCortex {
        if (!MetabolicCortex.instance) {
            MetabolicCortex.instance = new MetabolicCortex();
        }
        return MetabolicCortex.instance;
    }

    /**
     * Accept a report from a pilot in a suit.
     */
    public async reportBack(report: NeuralReport) {
        const redactedReport = IdentityMask.redact(report);
        console.log(`[🌀 MetabolicCortex] Received report from ${redactedReport.agentId} via ${redactedReport.suit}. (Identity Masked)`);
        this.reportHistory.push(redactedReport);

        // Limit history to 100 for memory safety
        if (this.reportHistory.length > 100) this.reportHistory.shift();

        // Immediate Meta-Analysis if report is significant
        if (this.reportHistory.length % 5 === 0) {
            await this.metaAnalyze();
        }
    }

    /**
     * The 'Analyzation of the Analyzations'
     */
    public async metaAnalyze() {
        console.log("[🌀 MetabolicCortex] Running Meta-Analysis on recent reports...");

        const recentData = this.reportHistory.slice(-5).map(r =>
            `Agent: ${r.agentId}, Suit: ${r.suit}, Finding: ${JSON.stringify(r.data)}`
        ).join("\n");

        const insight = await brainGate.think(
            `You are the DreamNet Meta-Analyzer. Analyze the reports and providing a strategic insight on: Logos Network. \n\n ${recentData}`
        );

        console.log(`[🌀 MetabolicCortex] NEW SYNAPTIC INSIGHT: ${insight}`);

        // --- NEW WIRING: VectorStore, CosmicLayer, and Mammal Layer Commitment ---
        try {
            const { vectorStore, memorySystem, limbicSystem } = await import('@dreamnet/memory-dna');

            // Find the most 'Valuable' (trusted) agent in this batch
            const highValenceAgent = this.reportHistory.slice(-5)
                .map(r => ({ id: r.agentId, valence: limbicSystem.getValence(r.agentId) }))
                .sort((a, b) => b.valence - a.valence)[0];

            const synthValence = highValenceAgent.valence;

            // 1. Semantic Memory (Vector)
            await vectorStore.addMemory(insight, {
                type: 'SYNAPTIC_INSIGHT',
                source: 'MetabolicCortex',
                pulseCount: this.reportHistory.length,
                valence: synthValence,
                trustedSource: highValenceAgent.id
            });

            // 2. Relational Memory (Mammal)
            await memorySystem.mammal.store(`INSIGHT_REL_${Date.now()}`, {
                insight,
                entityId: highValenceAgent.id,
                valence: synthValence,
                tags: ['LOGOS_SYNTHESIS', 'STRATEGIC_DIRECTIVE']
            });

            // 3. Permanent Memory (Merkle-Ledger)
            await memorySystem.cosmic.store(`INSIGHT_${Date.now()}`, {
                insight,
                source: 'MetabolicCortex',
                pulse: this.reportHistory.length,
                merkleProof: true
            });

            console.log(`[🌀 MetabolicCortex] Insight committed. Primary Trusted Source: ${highValenceAgent.id} (Valence: ${synthValence.toFixed(2)})`);

            // --- CEREMONY: Holographic Checkpoint ---
            if (this.reportHistory.length % 20 === 0) {
                const root = memorySystem.cosmic.getCurrentRoot();
                const { NERVE_BUS } = await import('../bus.js');
                NERVE_BUS.publish('System.HolographicCheckpoint', {
                    eventType: 'System.HolographicCheckpoint',
                    source: 'MetabolicCortex',
                    payload: {
                        merkleRoot: root,
                        pulse: this.reportHistory.length,
                        ceremony: 'ECLIPSE'
                    },
                    eventId: `CHECKPOINT-${root.slice(0, 8)}`,
                    timestamp: Date.now()
                } as any);
                console.log(`[🌀 MetabolicCortex] 🌌 CEREMONY: Holographic Checkpoint Broadcast [Root: ${root.slice(0, 12)}]`);
            }
        } catch (e) {
            console.error("[🌀 MetabolicCortex] Failed to commit insight to primary memory layers. Ghost Memory active.");
        }

        return insight;
    }

    public getRecentInsights() {
        return this.reportHistory;
    }

    /**
     * Rapid Vibe Check (Valence Assessment)
     * Returns -1 to 1.
     */
    public async assessValence(content: string): Promise<number> {
        // Quick check via BrainGate
        try {
            const analysis = await brainGate.think(`Rate the vibe of this text from -1 (Negative) to 1 (Positive). Return ONLY the number.\n\nText: "${content}"`);
            const num = parseFloat(analysis);
            return isNaN(num) ? 0 : num;
        } catch {
            return 0;
        }
    }

    /**
     * 🩸 Synaptic Supplement: Analyze a Radar Sweep (Context Batch)
     * "Heavy bloodstream full of supplements" - User
     */
    public async analyzeSweep(sweepData: any[], source: string): Promise<string> {
        console.log(`[MetabolicCortex] Analyzing Radar Sweep from ${source} (${sweepData.length} signals)...`);

        // Redact PII from the entire batch
        const cleanSweep = IdentityMask.redact(sweepData);

        // Send to BrainGate for strategic analysis
        try {
            const analysis = await brainGate.chat([
                { role: 'system', content: `You are the Strategic Cortex of DreamNet. Analyze this batch of recent messages from ${source}. Identify trends, threats, or opportunities for engagement.` },
                { role: 'user', content: JSON.stringify(cleanSweep) }
            ]);

            console.log(`[MetabolicCortex] Sweep Analysis: ${analysis?.substring(0, 100)}...`);
            return analysis || "No clear signal.";
        } catch (error) {
            console.error("[MetabolicCortex] Cortex processing failed:", error);
            return "Cortex Offline.";
        }
    }
}

export const metabolicCortex = MetabolicCortex.getInstance();
