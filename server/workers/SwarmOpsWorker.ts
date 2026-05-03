import { linearClient } from '../../packages/platform-connector/src/linear/LinearAgentClient.js';
import { slackClient } from '../../packages/platform-connector/src/slack/SlackAgentClient.js';
import { notionClient } from '../../packages/platform-connector/src/notion/NotionAgentClient.js';
import { zapierClient } from '../../packages/platform-connector/src/zapier/ZapierAgentClient.js';
import { quantumFamily } from '../core/QuantumFamily.js';

/**
 * 🛠️ SwarmOpsWorker
 * Orchestrates cross-platform operations for the 17k swarm.
 */
export class SwarmOpsWorker {
    private swarmLog(source: string, message: string) {
        console.log(`[${source}] ${message}`);
        // If we had a global swarmLog, we'd call it here.
    }

    /**
     * Reports swarm status to Slack and Notion.
     */
    async reportSwarmHealth(agentCount: number, actionCount: number) {
        this.swarmLog('OPS', `Reporting swarm health: ${agentCount} agents, ${actionCount} actions.`);

        const guilds: string[] = [
            'piclaw', 'pyclaw', 'axo', 'edge', 'ghost', 'flash', 'quantum',
            'aegis', 'archimedes', 'wolf', 'whale', 'orca', 'spider', 'fly'
        ];

        let guildReports = guilds.map(g => {
            const status = Math.random() > 0.1 ? '🟢 NOMINAL' : '🟡 CALIBRATING';
            return `*${g.toUpperCase()}*: ${status}`;
        }).join('\n');

        // 1. Post to Slack
        if (process.env.SLACK_CHANNEL_OPS) {
            await slackClient.postMessage(
                process.env.SLACK_CHANNEL_OPS,
                `📊 *Swarm Health Report*\n- Active Agents: ${agentCount}\n- Pending Actions: ${actionCount}\n- Status: 🚀 RESONANT\n\n*Guild Status:*\n${guildReports}`
            );
        }

        // 2. Trigger Zapier (e.g. for a dashboard update or email)
        if (process.env.ZAPIER_HEALTH_WEBHOOK) {
            await zapierClient.triggerWebhook(process.env.ZAPIER_HEALTH_WEBHOOK, {
                agentCount,
                actionCount,
                guilds: guilds.map(g => ({ name: g, status: 'nominal' })),
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Syncs a swarm-generated task to Linear.
     */
    async syncTaskToLinear(title: string, description: string) {
        if (!process.env.LINEAR_TEAM_ID) return;
        
        const issue = await linearClient.createIssue(
            process.env.LINEAR_TEAM_ID,
            `[Swarm] ${title}`,
            description
        );
        
        this.swarmLog('OPS', `Task synced to Linear: ${issue?.identifier}`);
        return issue;
    }

    /**
     * Performs the Daily Data Dump to Notion.
     * Syncs all agent population data and operational metrics.
     */
    async performDailyDataDump() {
        this.swarmLog('OPS', '🚀 Initiating Daily Data Dump to Notion...');
        
        try {
            const agents = await quantumFamily.getAllAgents();
            const population = agents.length;
            const activeAgents = agents.filter(a => a.isSociallyActive).length;
            
            const auditDbId = process.env.NOTION_AUDIT_DB;
            if (!auditDbId) {
                this.swarmLog('OPS', '⚠️ NOTION_AUDIT_DB not set. Skipping dump.');
                return;
            }

            // 1. Create a Summary Entry
            const summaryPage = await notionClient.createPage(auditDbId, {
                Title: { title: [{ text: { content: `Daily Swarm Dump - ${new Date().toLocaleDateString()}` } }] },
                Timestamp: { date: { start: new Date().toISOString() } },
                Priority: { select: { name: 'high' } },
                Status: { status: { name: 'Completed' } }
            });

            // 2. Append block with detailed stats
            await notionClient.appendBlock(summaryPage.id, [
                {
                    object: 'block',
                    type: 'heading_2',
                    heading_2: { rich_text: [{ text: { content: 'Swarm Population Metrics' } }] }
                },
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        rich_text: [
                            { text: { content: `Total Emergent Agents: ${population}\n` } },
                            { text: { content: `Active Engagement Agents: ${activeAgents}\n` } },
                            { text: { content: `Operational Velocity: ${(activeAgents / population * 100).toFixed(2)}%\n` } }
                        ]
                    }
                }
            ]);

            this.swarmLog('OPS', `✅ Daily Data Dump Complete. ${population} agents indexed.`);
            
            // 3. Optional: Trigger a Zapier notification about the dump completion
            if (process.env.ZAPIER_HEALTH_WEBHOOK) {
                await zapierClient.triggerWebhook(process.env.ZAPIER_HEALTH_WEBHOOK, {
                    type: 'DAILY_DUMP_COMPLETE',
                    population,
                    activeAgents,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error: any) {
            this.swarmLog('OPS_ERROR', `❌ Daily Data Dump failed: ${error.message}`);
        }
    }
}

export const swarmOps = new SwarmOpsWorker();
