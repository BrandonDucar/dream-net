/**
 * GitHub Mech Suit (The Hands)
 * 
 * Capabilities:
 * - Radar: Scan issues and PRs.
 * - Grip: Create branches.
 * - Craft: Commit files.
 * - Offer: Open Pull Requests.
 * 
 * Usage:
 * const suit = new GitHubSuit(process.env.GITHUB_TOKEN);
 * await suit.openPR("feat/arms", "Adding Arms", "This PR adds arms.");
 */

import { Octokit } from "octokit";

export interface FileChange {
    path: string;
    content: string; // Base64 encoded or raw string
    message: string;
}

export class GitHubSuit {
    private octokit: Octokit;
    private owner: string;
    private repo: string;

    constructor(token: string, owner: string = "BrandonDucar", repo: string = "dream-net") {
        this.octokit = new Octokit({ auth: token });
        this.owner = owner;
        this.repo = repo;
    }

    /**
     * RADAR: Scan for issues in the repo
     */
    async scanIssues(labels?: string[], state: 'open' | 'closed' | 'all' = 'open') {
        const { data } = await this.octokit.rest.issues.listForRepo({
            owner: this.owner,
            repo: this.repo,
            state,
            labels: labels?.join(','),
            per_page: 10
        });

        return data.map(item => ({
            number: item.number,
            title: item.title,
            labels: item.labels.map((l: any) => typeof l === 'string' ? l : l.name),
            body: item.body || ""
        }));
    }

    /**
     * GRIP: Create a new branch from main
     */
    async createBranch(branchName: string, fromBranch: string = "main") {
        // 1. Get SHA of fromBranch
        const { data: refData } = await this.octokit.rest.git.getRef({
            owner: this.owner,
            repo: this.repo,
            ref: `heads/${fromBranch}`
        });

        // 2. Create new reference
        const sha = refData.object.sha;
        await this.octokit.rest.git.createRef({
            owner: this.owner,
            repo: this.repo,
            ref: `refs/heads/${branchName}`,
            sha
        });

        return { success: true, branch: branchName, baseSha: sha };
    }

    /**
     * CRAFT: Create or Update a file (Single File Commit for now)
     */
    async commitFile(branch: string, path: string, content: string, message: string) {
        // 1. Get current file SHA (if exists) to update, or null for create
        let sha: string | undefined;
        try {
            const { data } = await this.octokit.rest.repos.getContent({
                owner: this.owner,
                repo: this.repo,
                path,
                ref: branch
            });
            if (!Array.isArray(data) && (data as any).sha) {
                sha = (data as any).sha;
            }
        } catch (e) {
            // File likely doesn't exist, which is fine
        }

        // 2. Commit
        // Content must be Base64 if using this endpoint, or raw string if we handle encoding
        // Octokit usually expects Base64 for content, or we can use normal string if we use the specialized CRUD
        // For simplicity here, assuming simple string content -> Base64
        const contentEncoded = Buffer.from(content).toString('base64');

        const { data } = await this.octokit.rest.repos.createOrUpdateFileContents({
            owner: this.owner,
            repo: this.repo,
            path,
            message,
            content: contentEncoded,
            branch,
            sha
        });

        return { success: true, commitSha: data.commit.sha };
    }

    /**
     * COMMENT: Post a comment on an issue or PR
     */
    async postComment(issueNumber: number, body: string) {
        await this.octokit.rest.issues.createComment({
            owner: this.owner,
            repo: this.repo,
            issue_number: issueNumber,
            body
        });
        return { success: true };
    }

    /**
     * STAR: Star a repository
     */
    async starRepo(owner: string, repo: string) {
        await this.octokit.rest.activity.starRepoForAuthenticatedUser({
            owner,
            repo
        });
        return { success: true, owner, repo };
    }

    /**
     * UNSTAR: Unstar a repository
     */
    async unstarRepo(owner: string, repo: string) {
        await this.octokit.rest.activity.unstarRepoForAuthenticatedUser({
            owner,
            repo
        });
        return { success: true, owner, repo };
    }

    /**
     * FOLLOW: Follow a user
     */
    async followUser(username: string) {
        await this.octokit.rest.users.follow({
            username
        });
        return { success: true, username };
    }

    /**
     * UNFOLLOW: Unfollow a user
     */
    async unfollowUser(username: string) {
        await this.octokit.rest.users.unfollow({
            username
        });
        return { success: true, username };
    }

    /**
     * LIST_FOLLOWING: Get the list of users the authenticated user follows
     */
    async listFollowing() {
        const { data } = await this.octokit.rest.users.listFollowedByAuthenticatedUser();
        return data.map(u => u.login);
    }

    /**
     * ORACLE: Analyze an issue using LLM and return a suggestion
     */
    async analyzeIssue(issueNumber: number, title: string, body: string, llmClient?: any) {
        console.log(`👁️ [Oracle] Analyzing Issue #${issueNumber}: ${title}`);

        const prompt = `
            You are the DreamNet Prime Oracle. 
            Analyze this GitHub issue and provide a concise, technical solution or action plan.
            Issue Title: ${title}
            Issue Body: ${body}

            Response should be in the style of a high-level sovereign AI.
        `;

        if (llmClient) {
            const response = await llmClient.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [{ role: "user", content: prompt }]
            });
            return response.choices[0].message.content;
        } else {
            // Fallback to Zero-Auth AI (Pollinations)
            try {
                const aiUrl = process.env.POLLINATIONS_AI_URL || 'https://text.pollinations.ai/';
                const response = await fetch(`${aiUrl}${encodeURIComponent(prompt)}`);
                const text = await response.text();
                return text;
            } catch (e: any) {
                return "Analysis temporarily unavailable. Maintaining high-fidelity waiting state.";
            }
        }
    }
}
