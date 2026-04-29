import { notionClient, slackClient } from "@dreamnet/platform-connector";

/**
 * 🚢 CrewSyncService
 * Orchestrates the "Wolf Pack" of agents across platforms.
 * Syncs the 5 Notion agents with the 4 core DreamNet agents.
 */
export class CrewSyncService {
    private static instance: CrewSyncService;
    private crew: Map<string, any> = new Map();

    public static getInstance(): CrewSyncService {
        if (!CrewSyncService.instance) {
            CrewSyncService.instance = new CrewSyncService();
        }
        return CrewSyncService.instance;
    }

    /**
     * Sync with Notion to find the 5 agents
     */
    async syncNotionCrew(): Promise<any[]> {
        const databaseId = process.env.NOTION_AGENTS_DB || "";
        if (!databaseId) return [];

        console.log(`🚢 [CrewSync] Syncing with Notion Agent Hive...`);
        try {
            const results = await notionClient.getDatabase(databaseId);
            const agents = results.map((page: any) => ({
                id: page.id,
                name: page.properties.Name?.title[0]?.plain_text || "Unknown Agent",
                role: page.properties.Role?.select?.name || "Member",
                status: page.properties.Status?.status?.name || "Offline",
                mcpServers: page.properties.MCP_Servers?.multi_select?.map((s: any) => s.name) || []
            }));

            agents.forEach(agent => this.crew.set(agent.name, agent));
            return agents;
        } catch (error) {
            console.error("❌ [CrewSync] Notion sync failed:", error);
            return [];
        }
    }

    /**
     * Broadcast a message to the whole crew (Slack + Notion + Internal)
     */
    async broadcast(message: string, priority: "normal" | "urgent" = "normal"): Promise<void> {
        console.log(`🚢 [CrewSync] Broadcasting: ${message}`);
        
        // 1. Slack notification
        const channelId = process.env.SLACK_CREW_CHANNEL || "";
        if (channelId) {
            await slackClient.postMessage(channelId, `[${priority.toUpperCase()}] ${message}`);
        }

        // 2. Notion Audit Log
        const auditDbId = process.env.NOTION_AUDIT_DB || "";
        if (auditDbId) {
            await notionClient.createPage(auditDbId, {
                Title: { title: [{ text: { content: `Broadcast: ${message.slice(0, 50)}...` } }] },
                Timestamp: { date: { start: new Date().toISOString() } },
                Priority: { select: { name: priority } }
            });
        }
    }

    getCrew(): any[] {
        return Array.from(this.crew.values());
    }
}

export const crewSync = CrewSyncService.getInstance();
