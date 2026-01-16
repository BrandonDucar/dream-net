import { agentFoundry } from "../foundry/AgentFoundry.js";
import type { HaloCycleResult, AnalyzerResult } from "../../packages/halo-loop/src/types.js";

/**
 * ForgeService: The bridge between Discovery and Creation.
 * 
 * It analyzes Halo cycle results for "Opportunity Shards" 
 * and triggers the AgentFoundry to build specialized agents.
 */
export class ForgeService {
    private static OPPORTUNITY_KEYWORDS = [
        "Solana", "EVM", "MEV", "Arbitrage", "DePIN", "AI", "Quantum",
        "HFT", "Mycology", "Synthetic", "Stealth", "Sovereign"
    ];

    private static CREATION_THRESHOLD = 0.7; // 70% confidence/relevance

    /**
     * Synthesize discovery results into creation requests
     */
    public static async synthesizeOpportunities(cycle: HaloCycleResult): Promise<void> {
        console.log(`[Forge] 🔨 Analyzing Cycle ${cycle.id} for Forgeable Opportunities...`);

        const opportunities = this.extractOpportunities(cycle.analysis);

        for (const opp of opportunities) {
            if (opp.confidence >= this.CREATION_THRESHOLD) {
                console.log(`[Forge] ✨ High-Confidence Opportunity Found: ${opp.name}`);

                // Trigger the Foundry
                agentFoundry.requestBuild("ForgeService", opp.name, {
                    templateSlug: opp.template,
                    capabilities: opp.capabilities,
                    traits: opp.traits
                });
            }
        }
    }

    private static extractOpportunities(analysis: AnalyzerResult[]): any[] {
        const found = [];

        for (const result of analysis) {
            // Check descriptions for keywords
            for (const issue of result.issues) {
                const desc = issue.description;
                const match = this.OPPORTUNITY_KEYWORDS.find(k => desc.includes(k));

                if (match) {
                    found.push({
                        name: `${match} Specialist`,
                        confidence: 0.85, // Heuristic: keyword presence in Halo cycle = high confidence
                        template: this.mapKeywordToTemplate(match),
                        capabilities: ["analysis", "logic", "routing"],
                        traits: ["autonomous", "hunter", match.toLowerCase()]
                    });
                }
            }
        }

        return found;
    }

    private static mapKeywordToTemplate(keyword: string): string {
        if (["Solana", "EVM", "MEV", "Arbitrage"].includes(keyword)) return "analyst";
        if (["AI", "Quantum", "Synthetic"].includes(keyword)) return "task-router";
        return "evolution-engine"; // Default
    }
}
