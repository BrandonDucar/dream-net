import { NERVE_BUS } from '@dreamnet/nerve';
/**
 * Figma Agent Client
 *
 * Gives agents "Eyes" to see designs.
 * REST API wrapper for Figma.
 */
export class FigmaAgentClient {
    accessToken;
    baseUrl = 'https://api.figma.com/v1';
    constructor(config) {
        this.accessToken = config.accessToken;
        if (!this.accessToken) {
            console.warn('[FigmaAgent] No Access Token provided. Agent is blind to design.');
        }
    }
    get headers() {
        return {
            'X-Figma-Token': this.accessToken
        };
    }
    /**
     * Agent reads a design file
     */
    async getFile(fileKey) {
        if (!this.accessToken)
            throw new Error("FIGMA_TOKEN_MISSING");
        const res = await fetch(`${this.baseUrl}/files/${fileKey}`, { headers: this.headers });
        if (!res.ok)
            throw new Error(`Figma API Error: ${res.statusText}`);
        const data = await res.json();
        // Record Action
        this.emitAction('read_design', { fileKey, name: data.name });
        return data;
    }
    /**
     * Agent reads comments on a design
     */
    async getComments(fileKey) {
        if (!this.accessToken)
            throw new Error("FIGMA_TOKEN_MISSING");
        const res = await fetch(`${this.baseUrl}/files/${fileKey}/comments`, { headers: this.headers });
        if (!res.ok)
            throw new Error(`Figma API Error: ${res.statusText}`);
        const data = await res.json();
        this.emitAction('read_comments', { fileKey, count: data.comments.length });
        return data.comments;
    }
    /**
     * Agent posts feedback
     */
    async postComment(fileKey, message) {
        if (!this.accessToken)
            throw new Error("FIGMA_TOKEN_MISSING");
        const res = await fetch(`${this.baseUrl}/files/${fileKey}/comments`, {
            method: 'POST',
            headers: { ...this.headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, comment_id: null }) // top level comment
        });
        if (!res.ok)
            throw new Error(`Figma API Error: ${res.statusText}`);
        const data = await res.json();
        this.emitAction('post_comment', { fileKey });
        return data;
    }
    emitAction(action, metadata) {
        try {
            NERVE_BUS.publish({
                kind: 'AGENT_TOOL_USE',
                channelId: 'agent-memory',
                id: crypto.randomUUID(),
                priority: 3,
                payload: {
                    tool: 'figma',
                    action,
                    metadata,
                    timestamp: Date.now()
                },
                context: {
                    source: 'FigmaAgentClient'
                }
            });
        }
        catch (e) {
            console.error('[FigmaAgent] Failed to record memory', e);
        }
    }
}
export const figmaAgent = new FigmaAgentClient({
    accessToken: process.env.FIGMA_ACCESS_TOKEN || ''
});
//# sourceMappingURL=FigmaAgentClient.js.map