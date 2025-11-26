/**
 * GitHub Integration
 *
 * Create issues, check PRs, manage projects
 */
export interface GitHubIssue {
    title: string;
    body: string;
    labels?: string[];
    assignees?: string[];
}
export interface GitHubPR {
    number: number;
    title: string;
    state: "open" | "closed" | "merged";
    labels: string[];
    readyForDeploy: boolean;
}
export declare class GitHubIntegration {
    private token?;
    private owner;
    private repo;
    private baseUrl;
    constructor(token?: string, owner?: string, repo?: string);
    /**
     * Create a GitHub issue from a Dev Brief
     */
    createIssue(issue: GitHubIssue): Promise<{
        number: number;
        url: string;
    }>;
    /**
     * Get PR by number
     */
    getPR(prNumber: number): Promise<GitHubPR | null>;
    /**
     * Check if PR is ready for deployment
     */
    isPRReadyForDeploy(prNumber: number): Promise<boolean>;
    /**
     * Add label to PR
     */
    addLabelToPR(prNumber: number, label: string): Promise<boolean>;
}
export default GitHubIntegration;
