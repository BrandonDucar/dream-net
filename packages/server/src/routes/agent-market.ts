/**
 * 🦅 Sovereign Agent Market API (The Almanac)
 * 
 * Hijacked Wisdom: The 143 Agents as "Revenue-Generating Citizens"
 */

import { Router, Request, Response } from "express";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const router = Router();

interface AgentEntry {
    id: string;
    name: string;
    file: string;
    type: string;
    status: string;
    description?: string;
}

/**
 * GET /api/market/agents
 * Returns a curated list of all agents, organized by Cluster and Tier.
 */
router.get("/agents", async (req: Request, res: Response) => {
    try {
        const inventoryPath = join(process.cwd(), "COMPREHENSIVE_AGENT_INVENTORY.json");

        if (!existsSync(inventoryPath)) {
            return res.status(404).json({
                success: false,
                message: "COMPREHENSIVE_AGENT_INVENTORY.json not found. Run 'pnpm run scan-agents' first."
            });
        }

        const data = JSON.parse(readFileSync(inventoryPath, "utf-8"));
        const agents = data.agents as AgentEntry[];

        // Categorize for the "Showcase"
        const marketReady = agents.map(agent => ({
            id: agent.id,
            name: agent.name,
            tier: determineMarketTier(agent.name),
            cluster: determineMarketCluster(agent.name),
            type: agent.type,
            status: agent.status,
            description: agent.description || "Active Citizen of DreamNet"
        }));

        res.json({
            success: true,
            total: marketReady.length,
            timestamp: Date.now(),
            agents: marketReady
        });

    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * 🧠 Logic to determine Tier for the Marketplace
 */
function determineMarketTier(name: string): string {
    const upName = name.toUpperCase();
    if (["LUCID", "CANVAS", "ROOT", "ECHO", "CRADLE"].includes(upName)) return "LEGENDARY";
    if (upName.includes("CORE") || upName.includes("NERVE") || upName.includes("SPINE")) return "EPIC";
    if (upName.includes("SHIELD") || upName.includes("WATCHTOWER")) return "RARE";
    return "CITIZEN";
}

/**
 * 🕸️ Logic to determine Cluster for the Marketplace
 */
function determineMarketCluster(name: string): string {
    const upName = name.toUpperCase();
    if (upName.includes("WOLF") || upName.includes("PACK")) return "WOLF_PACK";
    if (upName.includes("AEGIS")) return "AEGIS_FLEET";
    if (upName.includes("DREAM")) return "DREAM_STATE";
    if (upName.includes("VERTEX")) return "VERTEX_CORE";
    return "INDEPENDENT";
}

export default router;
