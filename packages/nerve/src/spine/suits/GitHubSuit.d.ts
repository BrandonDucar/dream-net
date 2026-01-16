import { SocialSuit } from './SocialSuit.js';
/**
 * 🐙 GitHubSuit: The Biomech Skin for Open Source Construction
 *
 * Capabilities:
 * - 📡 Radar: Scan repositories for Issues, PRs, and Vulnerabilities.
 * - 🖐 Hands: Commit code, Merge PRs, Assign Issues.
 * - 🧠 Onboard Computer: Triage bugs, Draft releases.
 */
export declare class GitHubSuit implements SocialSuit {
    name: string;
    private client;
    private targetRepoOwner;
    private targetRepoName;
    constructor();
    isOnline(): boolean;
    ignite(): Promise<void>;
    /**
     * Scan the environment (Repo) for signals (Issues/PRs).
     * @param query - "issues", "prs", or specific issue number
     */
    scan(query?: string, limit?: number): Promise<any[]>;
    analyze(issueId: number): Promise<string>;
    /**
     * Post a comment or Create an Issue
     */
    post(content: string | any): Promise<{
        success: boolean;
        url?: string;
    }>;
    engage(targetId: string, action: string, content?: string): Promise<boolean>;
}
//# sourceMappingURL=GitHubSuit.d.ts.map