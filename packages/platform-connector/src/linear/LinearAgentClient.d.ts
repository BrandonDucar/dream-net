/**
 * 📊 Linear Agent Client
 * Connects DreamNet agents to Linear for project management.
 */
export declare class LinearAgentClient {
    private apiKey;
    private baseUrl;
    constructor(apiKey?: string);
    query(query: string, variables?: any): Promise<any>;
    getAssignedIssues(): Promise<any[]>;
    createIssue(teamId: string, title: string, description: string): Promise<any>;
    getTeams(): Promise<any[]>;
    updateIssue(issueId: string, input: any): Promise<any>;
}
export declare const linearClient: LinearAgentClient;
//# sourceMappingURL=LinearAgentClient.d.ts.map