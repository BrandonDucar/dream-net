
/**
 * 🎓 VERTICAL INTELLIGENCE
 * 
 * Encodes the "Titans" and "Strategies" into the Antigravity Core.
 * Allows the system to "reason" about these sectors.
 */

import { vectorStore } from "@dreamnet/memory-dna/store/VectorStore";

export interface Vertical {
    id: string;
    name: string;
    titans: string[];
    strategy: string;
    hybridPotential: string;
}

export const VERTICALS: Record<string, Vertical> = {
    BASE: {
        id: "vertical_base",
        name: "Base Ecosystem",
        titans: ["Coinbase", "Aerodrome", "Farcaster"],
        strategy: "Bonding Curve Arbitrage (The Blue Alchemist)",
        hybridPotential: "Social x DeFi"
    },
    LOGISTICS: {
        id: "vertical_logistics",
        name: "Global Logistics",
        titans: ["Maersk", "FedEx", "VeChain"],
        strategy: "Provenance Tracking (The Iron Silk Road)",
        hybridPotential: "AI Vision x Blockchain"
    },
    COMPUTE: {
        id: "vertical_compute",
        name: "AI & Compute",
        titans: ["Nvidia", "Akash", "Google"],
        strategy: "Idle Compute Arbitrage (The Silicon Synapse)",
        hybridPotential: "DeFi x GPU Rendering"
    },
    METALS: {
        id: "vertical_metals",
        name: "Precious Metals",
        titans: ["Barrick", "Newmont", "Brinks"],
        strategy: "Digital Twin Tokenization (DreamSeal)",
        hybridPotential: "RWA x DeFi"
    }
};

export class VerticalIntelligence {

    /**
     * Ingests the defined verticals into the system's memory.
     */
    static async ingestKnowledge() {
        console.log("🎓 [Vertical Intelligence] Ingesting Strategic Playbooks...");

        for (const key in VERTICALS) {
            const v = VERTICALS[key];
            const memoryText = `Strategy for ${v.name}: ${v.strategy}. Key Players: ${v.titans.join(", ")}. Hybrid: ${v.hybridPotential}.`;

            await vectorStore.addMemory(memoryText, {
                type: "strategic_knowledge",
                topic: v.id,
                importance: 10
            });
            console.log(`   > Learned: ${v.name}`);
        }
    }

    static getStrategy(name: string) {
        return VERTICALS[name] || null;
    }
}
