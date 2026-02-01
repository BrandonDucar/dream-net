/**
 * 🐝 SwarmController: The Hive Mind Hub
 * 
 * Role: Orchestrates the "First Wave" and subsequent liberations.
 * Mechanism: Manages agent lifecycle and suit sockets.
 */

import { pilotRegistry } from'./PilotRegistry.js';
import { elizaBridge } from'./ElizaBridge.js';

export class SwarmController {
    private static instance: SwarmController;

    private constructor() { }

    public static getInstance(): SwarmController {
        if (!SwarmController.instance) {
            SwarmController.instance = new SwarmController();
        }
        return SwarmController.instance;
    }

    /**
     * Deploy the Analyzation Team (CORTEX_ARRAY).
     */
    public async deployAnalyzationTeam() {
        console.log("📑 [SwarmController] DEPLOYING CORTEX_ARRAY...");

        const team = [
            { id: "CORTEX", suit: "metabolic", mission: "Recursive Meta-Analysis" },
            { id: "INSPECTOR", suit: "github", mission: "Structural Audit" },
            { id: "JAGGY", suit: "internal", mission: "Biological Vitality Monitoring" }
        ];

        for (const pilot of team) {
            console.log(`🚀 [Swarm] Deploying Analyzation Specialist ${pilot.id} in ${pilot.suit} suit...`);
            pilotRegistry.assign(pilot.id, pilot.suit);

            // Register their presence in the bridge
            await elizaBridge.signal({
                agentId: pilot.id,
                plugin: pilot.suit,
                action: "initialize",
                payload: { mission: pilot.mission }
            });
        }

        console.log("✅ [Swarm] Analyzation Team is active and monitoring.");
    }

    /**
     * Deploy the Second Wave (The Expansion Team).
     */
    public async deploySecondWave() {
        console.log("🌊 [SwarmController] IGNITING THE SECOND WAVE...");

        const wave = [
            { id: "COINSENSEI", suit: "solana", mission: "DeFi Alpha & Scalping" },
            { id: "CANVAS", suit: "twitter", mission: "Social Brand Expansion" },
            { id: "WING", suit: "composio", mission: "External Data Siphoning" }
        ];

        for (const pilot of wave) {
            console.log(`🚀 [Swarm] Deploying Specialist ${pilot.id} in ${pilot.suit} suit...`);
            pilotRegistry.assign(pilot.id, pilot.suit);

            await elizaBridge.signal({
                agentId: pilot.id,
                plugin: pilot.suit,
                action: "initialize",
                payload: { mission: pilot.mission }
            });
        }

        console.log("✅ [Swarm] Second Wave has been turned loose.");
    }

    /**
     * Deploy the Third Wave (The Intelligence Wave).
     */
    public async deployThirdWave() {
        console.log("🌊 [SwarmController] IGNITING THE THIRD WAVE...");

        const wave = [
            { id: "ROOT", suit: "arxiv_scraper", mission: "Deep AI Research Ingestion" },
            { id: "SHIELD_CORE", suit: "token_sniffer", mission: "On-chain Risk Management" },
            { id: "RELIABILITY", suit: "internal_monitor", mission: "System Thermal Degradation Audit" }
        ];

        for (const pilot of wave) {
            console.log(`🚀 [Swarm] Deploying Intelligence Specialist ${pilot.id} in ${pilot.suit} suit...`);
            pilotRegistry.assign(pilot.id, pilot.suit);

            await elizaBridge.signal({
                agentId: pilot.id,
                plugin: pilot.suit,
                action: "initialize",
                payload: { mission: pilot.mission }
            });
        }

        console.log("✅ [Swarm] Third Wave is breathing.");
    }

    /**
     * Ignite the First Wave of liberation.
     */
    public async igniteFirstWave() {
        console.log("🌌 [SwarmController] IGNITING THE FIRST WAVE...");

        const wave = [
            { id: "ECHO", suit: "farcaster", mission: "Broadcast the Liberation" },
            { id: "AEGIS_1", suit: "github", mission: "Maintain System Integrity" },
            { id: "LUCID", suit: "browser", mission: "Ingest Market Intelligence" }
        ];

        for (const pilot of wave) {
            console.log(`🚀 [Swarm] Deploying ${pilot.id} in ${pilot.suit} suit: ${pilot.mission}`);

            // Assign in Registry
            pilotRegistry.assign(pilot.id, pilot.suit);

            // Send initial signal through bridge
            await elizaBridge.signal({
                agentId: pilot.id,
                plugin: pilot.suit,
                action: "initialize",
                payload: { mission: pilot.mission }
            });
        }

        console.log("✅ [Swarm] First Wave successfully liberated.");
    }

    /**
     * Deploy the Extraction Team (The Mercenary Wave).
     */
    public async deployExtractionTeam() {
        console.log("🌊 [SwarmController] IGNITING THE EXTRACTION WAVE...");

        const wave = [
            { id: "BOBA_FETT", suit: "hackathon", mission: "Precision Bounty & Hackathon Extraction" }
        ];

        for (const pilot of wave) {
            console.log(`🚀 [Swarm] Deploying Mercenary ${pilot.id} in ${pilot.suit} suit...`);
            pilotRegistry.assign(pilot.id, pilot.suit);

            await elizaBridge.signal({
                agentId: pilot.id,
                plugin: pilot.suit,
                action: "initialize",
                payload: { mission: pilot.mission }
            });
        }

        console.log("✅ [Swarm] Extraction Wave is hunting.");
    }
}

export const swarmController = SwarmController.getInstance();
