
import { SocialSuit } from './SocialSuit.js';
import { Octokit } from 'octokit';

/**
 * 🐙 GitHubSuit: The Biomech Skin for Open Source Construction
 * 
 * Capabilities:
 * - 📡 Radar: Scan repositories for Issues, PRs, and Vulnerabilities.
 * - 🖐 Hands: Commit code, Merge PRs, Assign Issues.
 * - 🧠 Onboard Computer: Triage bugs, Draft releases.
 */
export class GitHubSuit implements SocialSuit {
    public name: string = "GitHub-Mech-v1";
    private client: Octokit | null = null;
    private targetRepoOwner: string | null = null;
    private targetRepoName: string | null = null;

    constructor() {
        this.ignite().catch(err => {
            console.error(`[🐙 GitHubSuit] Ignition Failure: ${err.message}. Suit remains dormant.`);
        });
    }

    public isOnline(): boolean {
        return !!this.client;
    }

    public async ignite(): Promise<void> {
        const token = process.env.GITHUB_TOKEN;
        const repoUrl = process.env.GITHUB_REPO; // e.g. "params/dream-net"

        if (!token) {
            console.warn("[🐙 GitHubSuit] GITHUB_TOKEN missing. Suit is running in Simulation Mode.");
            return;
        }

        try {
            this.client = new Octokit({ auth: token });

            // Parse Repo
            if (repoUrl) {
                const parts = repoUrl.split('/');
                if (parts.length >= 2) {
                    this.targetRepoOwner = parts[parts.length - 2];
                    this.targetRepoName = parts[parts.length - 1];
                }
            }

            // Verify Connection
            const { data: user } = await this.client.rest.users.getAuthenticated();
            console.log(`[🐙 GitHubSuit] Systems Online. Connected as ${user.login}`);
            console.log(`[🐙 GitHubSuit] Locked on target: ${this.targetRepoOwner}/${this.targetRepoName}`);

        } catch (e: any) {
            console.error("[🐙 GitHubSuit] Connection Error:", e.message);
            this.client = null;
        }
    }

    // --- 📡 RADAR (Sensors) ---

    /**
     * Scan the environment (Repo) for signals (Issues/PRs).
     * @param query - "issues", "prs", or specific issue number
     */
    public async scan(query: string = "issues", limit: number = 10): Promise<any[]> {
        if (!this.client || !this.targetRepoOwner || !this.targetRepoName) {
            throw new Error("SUIT_OFFLINE_OR_NO_TARGET");
        }

        console.log(`[🐙 GitHubSuit] Radar Sweep: Scanning ${query}...`);

        try {
            if (query === 'issues') {
                const { data } = await this.client.rest.issues.listForRepo({
                    owner: this.targetRepoOwner,
                    repo: this.targetRepoName,
                    state: 'open',
                    per_page: limit
                });
                return data.map(i => ({
                    id: i.number,
                    title: i.title,
                    author: i.user?.login,
                    labels: i.labels.map((l: any) => l.name),
                    body: i.body
                }));
            }

            if (query === 'prs') {
                const { data } = await this.client.rest.pulls.list({
                    owner: this.targetRepoOwner,
                    repo: this.targetRepoName,
                    state: 'open',
                    per_page: limit
                });
                return data;
            }

            return [];
        } catch (e: any) {
            console.error(`[🐙 GitHubSuit] Radar Malfunction: ${e.message}`);
            return [];
        }
    }

    // --- 🧠 ONBOARD COMPUTER (Analysis) ---

    public async analyze(issueId: number): Promise<string> {
        if (!this.client || !this.targetRepoOwner || !this.targetRepoName) return "SYSTEM_OFFLINE";

        console.log(`[🐙 GitHubSuit] Computer Analyzing Issue #${issueId}...`);
        const { data: issue } = await this.client.rest.issues.get({
            owner: this.targetRepoOwner,
            repo: this.targetRepoName,
            issue_number: issueId
        });

        // Simple heuristic analysis (stub for LLM/BrainGate integration)
        const isBug = issue.labels.some((l: any) => l.name?.includes('bug'));
        const isFeature = issue.labels.some((l: any) => l.name?.includes('feature'));

        return `Analysis Complete. Type: ${isBug ? 'BUG' : isFeature ? 'FEATURE' : 'UNKNOWN'}. Priority: CALULATING...`;
    }


    // --- 🖐 HANDS (Manipulation) ---

    /**
     * Post a comment or Create an Issue
     */
    public async post(content: string | any): Promise<{ success: boolean; url?: string }> {
        if (!this.client || !this.targetRepoOwner || !this.targetRepoName) {
            throw new Error("SUIT_OFFLINE");
        }

        try {
            // If content is an object with { issueId, body }, it's a comment
            if (typeof content === 'object' && content.issueId && content.body) {
                const { data } = await this.client.rest.issues.createComment({
                    owner: this.targetRepoOwner,
                    repo: this.targetRepoName,
                    issue_number: content.issueId,
                    body: content.body
                });
                console.log(`[🐙 GitHubSuit] Hand Action: Commented on #${content.issueId}`);
                return { success: true, url: data.html_url };
            }

            // Otherwise, create a new issue
            const title = typeof content === 'string' ? content.substring(0, 50) + "..." : content.title;
            const body = typeof content === 'string' ? content : content.body;

            const { data } = await this.client.rest.issues.create({
                owner: this.targetRepoOwner,
                repo: this.targetRepoName,
                title: title,
                body: body
            });
            console.log(`[🐙 GitHubSuit] Hand Action: Created Issue #${data.number}`);
            return { success: true, url: data.html_url };

        } catch (e: any) {
            console.error(`[🐙 GitHubSuit] Hand Action Failed: ${e.message}`);
            return { success: false };
        }
    }

    public async engage(targetId: string, action: string, content?: string): Promise<boolean> {
        // Map 'targetId' to issue number
        const issueNumber = parseInt(targetId);
        if (isNaN(issueNumber)) return false;

        if (action === 'reply' || action === 'comment') {
            await this.post({ issueId: issueNumber, body: content || "Acknowledged." });
            return true;
        }

        if (action === 'close') {
            if (!this.client || !this.targetRepoOwner || !this.targetRepoName) return false;
            await this.client.rest.issues.update({
                owner: this.targetRepoOwner,
                repo: this.targetRepoName,
                issue_number: issueNumber,
                state: 'closed'
            });
            console.log(`[🐙 GitHubSuit] Hand Action: Closed Issue #${issueNumber}`);
            return true;
        }

        return false;
    }
}
