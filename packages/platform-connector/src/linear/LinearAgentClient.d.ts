interface LinearAgentConfig {
    apiKey: string;
}
/**
 * Linear Agent Client
 *
 * Gives agents "Hands" to manage projects.
 * Emits events to Nerve so Memory records the actions.
 */
export declare class LinearAgentClient {
    private client;
    constructor(config: LinearAgentConfig);
    private ensureClient;
    /**
     * Agent reads an issue
     */
    getIssue(issueId: string): Promise<import("@linear/sdk").Issue>;
    /**
     * Agent files a new task
     */
    createIssue(teamId: string, title: string, description?: string): Promise<import("@linear/sdk").Issue>;
    /**
     * Agent comments on work
     */
    postComment(issueId: string, body: string): Promise<import("@linear/sdk").Comment | undefined>;
    private emitAction;
}
export declare const linearAgent: LinearAgentClient;
export {};
//# sourceMappingURL=LinearAgentClient.d.ts.map