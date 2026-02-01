
import { LinearClient, LinearDocument } from '@linear/sdk';
import { NERVE_BUS } from '@dreamnet/nerve';

interface LinearAgentConfig {
    apiKey: string;
}

/**
 * Linear Agent Client
 * 
 * Gives agents "Hands" to manage projects.
 * Emits events to Nerve so Memory records the actions.
 */
export class LinearAgentClient {
    private client: LinearClient | null = null;

    constructor(config: LinearAgentConfig) {
        if (config.apiKey) {
            this.client = new LinearClient({ apiKey: config.apiKey });
        } else {
            console.warn('[LinearAgent] No API Key provided. Agent is effectively handless.');
        }
    }

    private ensureClient() {
        if (!this.client) throw new Error("LINEAR_API_KEY_MISSING");
        return this.client;
    }

    /**
     * Agent reads an issue
     */
    async getIssue(issueId: string) {
        const client = this.ensureClient();
        const issue = await client.issue(issueId);

        // Record Action
        this.emitAction('read_issue', { issueId, title: issue.title });

        return issue;
    }

    /**
     * Agent files a new task
     */
    async createIssue(teamId: string, title: string, description?: string) {
        const client = this.ensureClient();
        const payload = await client.createIssue({ teamId, title, description });
        const issue = await payload.issue;

        if (payload.success && issue) {
            this.emitAction('create_issue', { issueId: issue.id, title, url: issue.url });
            return issue;
        }
        throw new Error("Failed to create issue");
    }

    /**
     * Agent comments on work
     */
    async postComment(issueId: string, body: string) {
        const client = this.ensureClient();
        const payload = await client.createComment({ issueId, body });

        if (payload.success) {
            this.emitAction('post_comment', { issueId });
            return payload.comment;
        }
        throw new Error("Failed to post comment");
    }

    private emitAction(action: string, metadata: any) {
        // Feed to DreamNet Nerve -> ShieldWatchtower -> Memory
        try {
            NERVE_BUS.publish({
                kind: 'AGENT_TOOL_USE',
                channelId: 'agent-memory',
                id: crypto.randomUUID(),
                priority: 3,
                payload: {
                    tool: 'linear',
                    action,
                    metadata,
                    timestamp: Date.now()
                },
                context: {
                    source: 'LinearAgentClient'
                }
            });
        } catch (e) {
            console.error('[LinearAgent] Failed to record memory', e);
        }
    }
}

// Singleton export - but requires config injection usually
// For now, adhere to environmental config pattern
export const linearAgent = new LinearAgentClient({
    apiKey: process.env.LINEAR_API_KEY || ''
});
