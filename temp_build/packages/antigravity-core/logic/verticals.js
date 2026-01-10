"use strict";
/**
 * 🎓 VERTICAL INTELLIGENCE
 *
 * Encodes the "Titans" and "Strategies" into the Antigravity Core.
 * Allows the system to "reason" about these sectors.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerticalIntelligence = exports.VERTICALS = void 0;
const VectorStore_1 = require("@dreamnet/memory-dna/store/VectorStore");
exports.VERTICALS = {
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
class VerticalIntelligence {
    /**
     * Ingests the defined verticals into the system's memory.
     */
    static async ingestKnowledge() {
        console.log("🎓 [Vertical Intelligence] Ingesting Strategic Playbooks...");
        for (const key in exports.VERTICALS) {
            const v = exports.VERTICALS[key];
            const memoryText = `Strategy for ${v.name}: ${v.strategy}. Key Players: ${v.titans.join(", ")}. Hybrid: ${v.hybridPotential}.`;
            await VectorStore_1.vectorStore.addMemory(memoryText, {
                type: "strategic_knowledge",
                topic: v.id,
                importance: 10
            });
            console.log(`   > Learned: ${v.name}`);
        }
    }
    static getStrategy(name) {
        return exports.VERTICALS[name] || null;
    }
}
exports.VerticalIntelligence = VerticalIntelligence;
