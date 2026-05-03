/**
 * 💬 Slack Agent Client
 * Connects DreamNet agents to Slack for comms.
 */
export declare class SlackAgentClient {
    private token;
    constructor(token?: string);
    postMessage(channelId: string, text: string): Promise<any>;
    addReaction(channelId: string, timestamp: string, name: string): Promise<any>;
    uploadFile(channels: string, content: string, filename: string): Promise<any>;
}
export declare const slackClient: SlackAgentClient;
//# sourceMappingURL=SlackAgentClient.d.ts.map